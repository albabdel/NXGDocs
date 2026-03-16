# Zoho Desk Authentication Fix: Implementation Roadmap

**Created:** 2026-03-16  
**Status:** Draft - Pending Approval  
**Priority:** CRITICAL (Security Vulnerabilities)

---

## Executive Summary

### Current State (CRITICAL SECURITY ISSUES)

The existing Zoho Desk authentication implementation has **severe security vulnerabilities**:

1. **Service Token Leakage**: `zoho-customer-auth.ts` returns the Zoho service account access token directly to the browser (line 198: `accessToken: zToken`)
2. **Org-Wide Access**: The leaked token has full organization access - any customer can potentially view ALL tickets
3. **No Customer Scoping**: No use of Zoho Portal API or contact-based scoping
4. **Session Storage Vulnerability**: Tokens stored in `sessionStorage` (XSS attack vector)
5. **Missing Token Refresh**: No refresh mechanism for agent tokens

### Target State

| Component | Current | Target |
|-----------|---------|--------|
| Customer Auth | Service token to browser | JWT SSO to Portal session |
| Agent Auth | Manual token flow | OAuth2 with auto-refresh |
| Token Storage | Browser sessionStorage | Server-side (Cloudflare KV) |
| API Used | Desk API (org-wide) | Portal API (scoped) |
| Session | Token in memory | HttpOnly cookies |

---

## Phase Structure Overview

| Phase | Goal | Duration | Risk Level |
|-------|------|----------|------------|
| Phase 1 | Security Hotfix - Stop Token Leakage | 1-2 days | CRITICAL |
| Phase 2 | Customer JWT SSO Implementation | 3-5 days | HIGH |
| Phase 3 | Agent OAuth2 with Token Management | 2-3 days | MEDIUM |
| Phase 4 | Session Management and Security Hardening | 2-3 days | MEDIUM |
| Phase 5 | Testing, Documentation and Rollback Plan | 2-3 days | LOW |

**Total Estimated Effort:** 10-16 days

---

## Phase Details

### Phase 1: Security Hotfix - Stop Token Leakage

**Goal:** Immediately eliminate the critical security vulnerability where service account tokens are exposed to browsers.

**Depends on:** Nothing (emergency fix)

**Requirements Addressed:**
- ZOHO-SEC-01: Never leak service tokens to browser
- ZOHO-SEC-02: Eliminate org-wide access for customers

**Success Criteria (What must be TRUE when complete):**

1. Service token NEVER returned to browser - The `accessToken` field is removed from customer auth response
2. All Zoho API calls proxied through backend - No direct Zoho API calls from browser
3. Customer operations use scoped endpoints - Backend enforces contactId filtering
4. Existing functionality preserved - Customers can still view/create tickets (via proxy)

**Implementation Tasks:**

```typescript
// BEFORE (VULNERABLE - current code):
return json({
  ok: true,
  accessToken: zToken,  // SECURITY ISSUE: Token leaked to browser
  expiry: Date.now() + expiresIn * 1000,
  ...
});

// AFTER (SECURE):
return json({
  ok: true,
  // No token returned - browser uses session cookie
  sessionExpiry: Date.now() + expiresIn * 1000,
  accountId: contact.accountId ?? null,
  contactId: contact.id,
  displayName: ...,
  account: contact.account?.accountName ?? null,
});
```

**Key Deliverables:**

1. **Modified `zoho-customer-auth.ts`**:
   - Remove `accessToken` from response
   - Set HttpOnly session cookie instead
   - Return only user profile data

2. **New `zoho-customer-proxy.ts`**:
   - Server-side proxy for customer Zoho operations
   - Uses stored session to get contactId
   - Enforces contactId scoping on all queries
   - Uses service token server-side only

3. **Updated `zohoApi.ts`**:
   - Change from token-based to session-based auth
   - All API calls go through `/functions/zoho-customer-proxy/`

**Files to Create/Modify:**

| File | Action | Purpose |
|------|--------|---------|
| `functions/zoho-customer-auth.ts` | MODIFY | Remove token from response |
| `functions/zoho-customer-proxy/[[path]].ts` | CREATE | Server-side proxy with scoping |
| `classic/src/components/ZohoTickets/zohoApi.ts` | MODIFY | Use session-based proxy |
| `classic/src/components/ZohoTickets/useZohoAuth.ts` | MODIFY | Store contactId, not token |

**Risk Mitigation:**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Existing sessions break | HIGH | MEDIUM | Feature flag to toggle old/new flow |
| Performance degradation | MEDIUM | LOW | Cache contact lookups in KV |
| Proxy implementation bugs | MEDIUM | MEDIUM | Comprehensive test suite |

**Rollback Plan:**
- Feature flag `USE_SECURE_PROXY` defaults to `false`
- Can instantly revert to old flow if issues detected
- Monitor error rates for first 24 hours

---

### Phase 2: Customer JWT SSO Implementation

**Goal:** Implement proper JWT Single Sign-On for customer portal authentication using Auth0 as identity provider.

**Depends on:** Phase 1 (Security Hotfix)

**Requirements Addressed:**
- ZOHO-AUTH-01: JWT SSO for customers (portal users)
- ZOHO-AUTH-02: Use Zoho Desk Portal API for customer-scoped operations
- ZOHO-SEC-03: Proper contact mapping from Auth0 user

**Success Criteria (What must be TRUE when complete):**

1. Customer authenticates via Auth0 - No direct Zoho login credentials needed
2. JWT validated server-side - Auth0 id_token verified with JWKS
3. Contact automatically mapped by email - Existing contacts reused, no duplicates
4. Portal session established - User can access tickets via Portal API
5. isEndUser flag verified/set - Contact has portal access enabled

**Architecture Flow:**

```
CUSTOMER JWT SSO FLOW

1. Browser -> Click "Login" -> 2. Auth0
   <- Redirect to Auth0 login <-
   -> User authenticates ->
   <- id_token (JWT) in callback <-
   
3. Browser POSTs id_token to /functions/zoho-jwt-sso
   |
   v
SERVER-SIDE (Cloudflare):
   4. Verify JWT signature via Auth0 JWKS
   5. Extract email claim
   6. Find/create Zoho Contact by email
   7. Ensure isEndUser = true (invite if needed)
   8. Generate Zoho Portal JWT or use Portal API session
   9. Set HttpOnly session cookie
   10. Return user profile (NO tokens)
   
11. Browser has session cookie
    |
    v
12. All Zoho calls go through /functions/zoho-customer-proxy
    (proxy uses Portal API with contact scoping)
```

**Implementation Tasks:**

1. **Configure Zoho Desk JWT SSO** (Zoho Admin Panel):
   - Enable JWT Single Sign-On in Help Center settings
   - Generate/configure shared secret key
   - Set attribute mapping (email, firstName, lastName, etc.)

2. **Create `functions/zoho-jwt-sso.ts`**:
   ```typescript
   export async function onRequestPost(context) {
     const { idToken } = await context.request.json();
     
     // 1. Verify Auth0 JWT
     const claims = await verifyAuth0IdToken(idToken, context.env.AUTH0_DOMAIN);
     
     // 2. Get service token for backend operations
     const serviceToken = await getServiceToken(context.env);
     
     // 3. Find or create contact
     const contact = await findOrCreateContact(serviceToken, claims.email, {
       firstName: claims.given_name,
       lastName: claims.family_name,
     });
     
     // 4. Ensure portal access
     if (!contact.isEndUser) {
       await inviteAsEndUser(serviceToken, contact.id, context.env.ZOHO_ORG_ID);
     }
     
     // 5. Generate portal session
     const portalSession = await createPortalSession(contact, context.env);
     
     // 6. Set HttpOnly cookie, return profile (no tokens!)
     return new Response(JSON.stringify({
       ok: true,
       contactId: contact.id,
       displayName: contact.firstName + ' ' + contact.lastName,
       email: contact.email,
       accountId: contact.accountId,
     }), {
       headers: {
         'Set-Cookie': `zoho_session=${portalSession.token}; HttpOnly; Secure; SameSite=Strict; Path=/`,
         'Content-Type': 'application/json',
       },
     });
   }
   ```

3. **Create `functions/zoho-portal-proxy/[[path]].ts`**:
   - Validates session cookie
   - Extracts contactId from session
   - Proxies to Zoho Portal API (NOT Desk API)
   - Enforces scoping at proxy level as defense-in-depth

4. **Update frontend auth flow**:
   - Replace direct Auth0 callback handling
   - Route through `/functions/zoho-jwt-sso`
   - Store user profile (not tokens) in React state

**Files to Create/Modify:**

| File | Action | Purpose |
|------|--------|---------|
| `functions/zoho-jwt-sso.ts` | CREATE | JWT validation + contact mapping |
| `functions/zoho-portal-proxy/[[path]].ts` | CREATE | Portal API proxy with scoping |
| `functions/lib/zoho-portal-session.ts` | CREATE | Session management utilities |
| `classic/src/components/ZohoTickets/useZohoAuth.ts` | MODIFY | JWT SSO flow |
| `classic/src/components/ZohoTickets/zohoApi.ts` | MODIFY | Use portal proxy |

**Environment Variables Required:**

```bash
# Existing
AUTH0_DOMAIN=nxgen.eu.auth0.com
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_REFRESH_TOKEN=...
ZOHO_ORG_ID=20067436506

# New for JWT SSO
ZOHO_JWT_SSO_SECRET=...     # Shared secret from Zoho Desk config
ZOHO_PORTAL_DOMAIN=...      # e.g., help.nxgen.com or your portal URL
ZOHO_HELP_CENTER_ID=...     # From Zoho Desk admin
```

**Risk Mitigation:**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Zoho JWT SSO docs unclear | HIGH | MEDIUM | Use Portal API fallback approach |
| Contact duplicate creation | MEDIUM | HIGH | Case-insensitive email lookup + upsert |
| isEndUser invitation fails | MEDIUM | MEDIUM | Retry with exponential backoff |
| Session cookie issues | LOW | HIGH | Comprehensive cross-browser testing |

**Dependencies:**
- Zoho Desk admin access to configure JWT SSO
- Auth0 application configured for the portal
- Shared secret key exchange between systems
