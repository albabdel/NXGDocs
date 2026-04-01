# Existing Authentication Architecture Analysis

**Researched:** 2026-04-01
**Domain:** Authentication Systems (Zoho OAuth + Auth0)
**Confidence:** HIGH (based on source code analysis)

## Summary

The codebase implements **two separate authentication systems**:

1. **Admin Authentication** (`/admin/*`) — Direct Zoho OAuth 2.0 with client-side token storage
2. **Customer Authentication** (`/support`) — Auth0 → Zoho exchange with HttpOnly session cookies

Both systems are **independent** and cannot share the same Auth0 application without significant refactoring. The customer auth flow is more secure (HttpOnly cookies, no token exposure to JavaScript) while admin auth uses sessionStorage (acceptable for admin-only access but has XSS risks).

**Primary finding:** There is no unified authentication system. Product-wide auth would require building a new layer that bridges these systems or consolidating to Auth0 for all authentication.

---

## Current Auth Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION SYSTEMS                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    ADMIN AUTHENTICATION (/admin/*)                        │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                          │    │
│  │  [Login Button]                                                          │    │
│  │       │                                                                  │    │
│  │       ▼                                                                  │    │
│  │  ┌─────────────────┐     Zoho OAuth 2.0 (Implicit Flow)                  │    │
│  │  │ AdminAuthContext│ ────────────────────────────────────────►          │    │
│  │  │ buildZohoAgentUrl│    response_type=token                            │    │
│  │  └─────────────────┘     scope=Desk.tickets.*,Desk.contacts.READ,...    │    │
│  │       │                                                                  │    │
│  │       ▼                           ┌──────────────────────────────────┐   │    │
│  │  ┌─────────────────┐              │  accounts.zoho.eu/oauth/v2/auth  │   │    │
│  │  │ sessionStorage  │◄─────────────│  → Returns access_token in hash  │   │    │
│  │  │ zoho_agent_token│              └──────────────────────────────────┘   │    │
│  │  │ {accessToken,   │                                                       │    │
│  │  │  expiry, mode}  │              VALIDATION                             │    │
│  │  └─────────────────┘              ┌──────────────────────────────────┐   │    │
│  │       │                          │  /zoho-proxy/accounts/oauth/v2/  │   │    │
│  │       ▼                          │  userinfo                        │   │    │
│  │  ┌─────────────────┐             │  Authorization: Zoho-oauthtoken  │   │    │
│  │  │ AdminUser       │◄────────────│  → Returns profile data          │   │    │
│  │  │ {id,email,name, │             └──────────────────────────────────┘   │    │
│  │  │  orgId,role}    │                                                       │    │
│  │  └─────────────────┘                                                      │    │
│  │                                                                          │    │
│  │  SERVER-SIDE (admin-auth-callback.ts):                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │    │
│  │  │ 1. Exchange code for token (authorization_code flow)             │    │    │
│  │  │ 2. Fetch profile from Zoho userinfo                             │    │    │
│  │  │ 3. Verify org membership (OrganizationId === ZOHO_ORG_ID)        │    │    │
│  │  │ 4. Create HMAC-signed session cookie (nxgen_admin_session)       │    │    │
│  │  │ 5. Sync user to Sanity (syncAdminUser)                           │    │    │
│  │  │ 6. Log audit event                                               │    │    │
│  │  └─────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                 CUSTOMER AUTHENTICATION (/support)                        │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                          │    │
│  │  TWO FLOWS AVAILABLE:                                                    │    │
│  │                                                                          │    │
│  │  FLOW A: Auth0 Exchange (useZohoAuth.ts:loginCustomer)                   │    │
│  │  ────────────────────────────────────────────────────                    │    │
│  │  [Login Button]                                                          │    │
│  │       │                                                                  │    │
│  │       ▼                                                                  │    │
│  │  ┌─────────────────┐     Auth0 Implicit Flow                             │    │
│  │  │ buildAuth0Url   │ ────────────────────────────────────────►          │    │
│  │  │ nonce=random32  │     response_type=id_token                          │    │
│  │  └─────────────────┘     scope=openid email profile                      │    │
│  │       │                     client_id=jqiJJISVmCmWWB46m0wMI7CO91KyliIm   │    │
│  │       ▼                                                                  │    │
│  │  ┌─────────────────┐              ┌──────────────────────────────────┐   │    │
│  │  │ /auth/callback  │◄─────────────│  nxgen.eu.auth0.com/authorize    │   │    │
│  │  │ #id_token=...   │              │  → Returns id_token in hash      │   │    │
│  │  └─────────────────┘              └──────────────────────────────────┘   │    │
│  │       │                                                                  │    │
│  │       ▼                                                                  │    │
│  │  ┌─────────────────┐              ┌──────────────────────────────────┐   │    │
│  │  │ POST /zoho-     │─────────────►│  Server-side verification:      │   │    │
│  │  │ customer-auth   │              │  1. Verify Auth0 JWT signature   │   │    │
│  │  │ {action:'auth0- │              │     (RS256 via JWKS)             │   │    │
│  │  │  exchange',     │              │  2. Extract email from claims    │   │    │
│  │  │  idToken}       │              │  3. Get Zoho service account     │   │    │
│  │  └─────────────────┘              │     token (refresh flow)         │   │    │
│  │       │                          │  4. Find Zoho contact by email   │   │    │
│  │       ▼                          │  5. Create HttpOnly session      │   │    │
│  │  ┌─────────────────┐              │     cookie (zoho_session)        │   │    │
│  │  │ sessionStorage  │◄─────────────│  6. Return profile data ONLY     │   │    │
│  │  │ zoho_customer_  │              │     (NO token exposed to JS)     │   │    │
│  │  │ session         │              └──────────────────────────────────┘   │    │
│  │  │ {mode,contactId,│                                                       │    │
│  │  │  accountId,     │              TOKEN NEVER EXPOSED TO JAVASCRIPT       │    │
│  │  │  displayName,   │                                                       │    │
│  │  │  account,       │                                                       │    │
│  │  │  csmEmail,      │                                                       │    │
│  │  │  csmName}       │                                                       │    │
│  │  └─────────────────┘                                                      │    │
│  │                                                                          │    │
│  │  FLOW B: Email Lookup (useZohoAuth.ts — email-lookup action)             │    │
│  │  ─────────────────────────────────────────────────────────────           │    │
│  │  [Email Input] → POST /zoho-customer-auth                                │    │
│  │       {action: 'email-lookup', email: '...'}                             │    │
│  │       │                                                                  │    │
│  │       ▼                                                                  │    │
│  │  Server: Find Zoho contact → Create session → Return profile             │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    SESSION COOKIE DETAILS                                 │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                          │    │
│  │  Admin Session (nxgen_admin_session):                                    │    │
│  │  ├── Cookie: HttpOnly, Secure, SameSite=Lax                              │    │
│  │  ├── Duration: 24 hours                                                   │    │
│  │  ├── Format: base64url(payload).HMAC-SHA256-signature                    │    │
│  │  ├── Payload: {userId, email, name, orgId, role, loginTimestamp, exp}    │    │
│  │  └── Secret: ZOHO_SESSION_SECRET (env var)                               │    │
│  │                                                                          │    │
│  │  Customer Session (zoho_session):                                        │    │
│  │  ├── Cookie: HttpOnly, Secure, SameSite=Lax                              │    │
│  │  ├── Duration: 24 hours                                                   │    │
│  │  ├── Format: base64url(payload).HMAC-SHA256-signature                    │    │
│  │  ├── Payload: {contactId, accountId, displayName, iat, exp}             │    │
│  │  └── Secret: ZOHO_SESSION_SECRET (env var)                               │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Admin vs Customer Auth Comparison Table

| Aspect | Admin Auth | Customer Auth |
|--------|-----------|---------------|
| **Identity Provider** | Zoho OAuth directly | Auth0 (then Zoho) |
| **OAuth Flow** | Implicit (client-side) + Authorization Code (server callback) | Implicit (Auth0 id_token) |
| **Response Type** | `token` (access_token in hash) | `id_token` (JWT in hash) |
| **Token Storage** | `sessionStorage` (accessible to JS) | **HttpOnly cookie** (NOT accessible to JS) |
| **Server Session** | Yes (HMAC-signed cookie) | Yes (HMAC-signed cookie) |
| **Session Duration** | 24 hours (server) / ~1 hour (Zoho token) | 24 hours |
| **User Data Source** | Zoho userinfo endpoint | Zoho contact lookup via service account |
| **Organization Check** | Yes (`OrganizationId === ZOHO_ORG_ID`) | No (any Zoho contact can authenticate) |
| **Token Exposure Risk** | XSS can steal token | Token never exposed to browser |
| **PKCE Used** | No | No |
| **Nonce Verification** | No | Yes (client + server) |
| **Audit Logging** | Yes (admin-audit) | No |
| **User Sync** | Yes (Sanity adminUser) | No (read-only Zoho lookup) |
| **Logout** | Clear sessionStorage + localStorage | Clear sessionStorage + server cookie |
| **Auth0 Application** | Not used | `jqiJJISVmCmWWB46m0wMI7CO91KyliIm` |
| **Zoho Client ID** | `1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN` | Same (service account token) |

---

## File Structure

```
classic/src/
├── contexts/
│   └── AdminAuthContext.tsx        # Admin auth state management
├── pages/
│   ├── admin-login.tsx             # Admin login page
│   ├── auth/callback.tsx           # Auth0 callback handler
│   ├── support.tsx                 # Customer portal page
│   └── admin/                      # Admin dashboard pages
│       └── index.tsx               # Uses ProtectedRoute + useAdminAuth
├── components/
│   ├── Admin/
│   │   └── ProtectedRoute.tsx      # Auth guard for admin pages
│   └── ZohoTickets/
│       ├── useZohoAuth.ts          # Unified auth hook (agent + customer)
│       └── TicketPortal.tsx        # Uses useZohoAuth
└── hooks/
    └── useAdminAuth.ts             # Re-exports AdminAuthContext

functions/
├── admin-auth-callback.ts          # Server-side admin OAuth callback
├── zoho-customer-auth.ts           # Customer auth (Auth0 exchange + email lookup)
├── zoho-logout.ts                  # Clear customer session cookie
└── lib/
    ├── admin-session.ts            # Admin session cookie utilities
    ├── zoho-session.ts             # Customer session cookie utilities
    └── sync-admin-user.ts          # Sync admin to Sanity

Environment Variables Required:
├── ZOHO_CLIENT_ID                  # Zoho OAuth app
├── ZOHO_CLIENT_SECRET              # Server-side only
├── ZOHO_ORG_ID                     # Organization ID for validation
├── ZOHO_SESSION_SECRET             # HMAC signing key
├── ZOHO_REFRESH_TOKEN              # Service account token
├── AUTH0_DOMAIN                    # e.g., nxgen.eu.auth0.com
├── SANITY_PROJECT_ID               # For admin user sync
├── SANITY_DATASET
└── SANITY_API_TOKEN
```

---

## Reusable Components/Patterns

### ✅ Highly Reusable

| Component | Location | Reuse Potential |
|-----------|----------|-----------------|
| **Session Cookie Utilities** | `lib/zoho-session.ts`, `lib/admin-session.ts` | HMAC signing, cookie building, verification — can consolidate |
| **ProtectedRoute Pattern** | `components/Admin/ProtectedRoute.tsx` | Auth guard wrapper — reuse for any protected route |
| **useAuth Hook Pattern** | `contexts/AdminAuthContext.tsx` | State management pattern — extend for unified auth |
| **Nonce Verification** | `useZohoAuth.ts:line 305-316` | CSRF protection for implicit flows |
| **Error Classification** | `useZohoAuth.ts:classifyAuthError` | User-friendly error handling |
| **Retry Logic** | `useZohoAuth.ts:withRetry` | Network resilience pattern |
| **JWKS Verification** | `zoho-customer-auth.ts:line 54-70` | Auth0 JWT verification |

### ⚠️ Partially Reusable (Needs Refactoring)

| Component | Location | Refactor Needed |
|-----------|----------|-----------------|
| **Login Flow** | `AdminAuthContext.tsx`, `useZohoAuth.ts` | Merge into single unified flow |
| **Token Storage** | `sessionStorage` (admin) vs HttpOnly (customer) | Standardize to HttpOnly for security |
| **User Data Model** | `AdminUser` vs `ZohoSessionData` | Unified user interface |

### ❌ Not Reusable (Domain-Specific)

| Component | Location | Why Not Reusable |
|-----------|----------|------------------|
| **Zoho OAuth URL Builder** | `AdminAuthContext.tsx:buildZohoAgentUrl` | Hardcoded Zoho scopes for admin |
| **Auth0 URL Builder** | `useZohoAuth.ts:buildAuth0Url` | Hardcoded Auth0 config for customer |
| **Zoho Contact Lookup** | `zoho-customer-auth.ts:findContactByEmail` | Customer-specific Zoho API calls |

---

## Security Analysis

### Admin Auth Security

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Token in sessionStorage** | MEDIUM | XSS can steal token; acceptable for admin-only portal |
| **No PKCE** | LOW | Implicit flow without PKCE; mitigated by short token life |
| **No Nonce** | LOW | Could add replay attack protection |
| **Org validation** | GOOD | Server validates `OrganizationId` |
| **Session cookie** | GOOD | HttpOnly, Secure, HMAC-signed |

### Customer Auth Security

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Token never exposed** | GOOD | HttpOnly cookie prevents XSS token theft |
| **Nonce verification** | GOOD | CSRF protection on both client and server |
| **JWKS verification** | GOOD | RS256 signature validation |
| **No org validation** | LOW | Any Zoho contact can authenticate |
| **Service account token** | MEDIUM | Stored server-side, never exposed to browser |

### Recommendations

1. **Admin auth should use Auth0 too** — Eliminates Zoho-specific OAuth, enables unified identity
2. **Add PKCE to all flows** — Prevents authorization code interception
3. **Add refresh token rotation** — For longer sessions without re-auth
4. **Consolidate session libraries** — `lib/zoho-session.ts` and `lib/admin-session.ts` are 90% similar

---

## Gaps for Product-Wide Auth

### Missing Features

| Gap | Impact | Effort to Fix |
|-----|--------|---------------|
| **No unified identity** | Admin = Zoho, Customer = Auth0; no shared user model | HIGH |
| **No RBAC** | Only admin/customer binary distinction | MEDIUM |
| **No centralized user management** | Admins in Zoho, Customers in Zoho Desk | HIGH |
| **No SSO** | Each system has separate login | HIGH |
| **No MFA** | Password-only auth for most users | MEDIUM |
| **No password policies** | Auth0 has defaults but not customized | LOW |
| **No session revocation** | Can't force logout remotely | MEDIUM |
| **No token introspection** | No way to check token validity without API call | LOW |

### Architecture Gaps

```
Current:
  Admin ─────► Zoho OAuth ─────► Zoho Session
  Customer ──► Auth0 ─────────► Zoho Session (via service account)
  Product X ──► ??? (not connected)

Needed for Product-Wide:
  All Users ──► Auth0 ─────► Unified Session ─────► Product APIs
                      │
                      └──► Zoho Desk (for support)
                      └──► Product X (for app)
                      └──► Admin Dashboard
```

### Integration Points Needed

| Integration | Current | Needed |
|-------------|---------|--------|
| **Auth0 → Zoho** | Customer only | All users |
| **Auth0 → Product APIs** | None | JWT verification middleware |
| **Auth0 → Sanity** | Admin sync (direct) | User profile management |
| **Session → Products** | None | Shared session validation |

---

## Recommendations for Unified Approach

### Option A: Auth0 for Everything (Recommended)

**Changes Required:**
1. Migrate admin auth from Zoho OAuth → Auth0
2. Add Zoho as Auth0 enterprise connection (SAML/OIDC)
3. Use Auth0 roles for admin/customer distinction
4. Create unified session cookie format
5. Add Auth0 Actions to sync users to Zoho/Sanity

**Benefits:**
- Single identity provider
- Built-in MFA, SSO, password policies
- RBAC via Auth0 permissions
- Session management via Auth0 dashboard

**Effort:** 2-3 weeks

### Option B: Keep Dual System with Bridge

**Changes Required:**
1. Create "auth bridge" service that normalizes both systems
2. Add shared user database (Sanity or new DB)
3. Implement token exchange between systems
4. Add unified session management

**Benefits:**
- Less migration work
- Can keep Zoho for admin if preferred

**Effort:** 3-4 weeks (more complexity)

### Option C: Zoho-only (Not Recommended)

**Changes Required:**
1. Migrate customer auth from Auth0 → Zoho
2. Build custom MFA/password policies in Zoho

**Drawbacks:**
- Zoho isn't designed for this use case
- No built-in social logins
- Limited customization

**Effort:** 4+ weeks (fighting the platform)

---

## Code Examples

### Admin Login Flow (Current)

```typescript
// classic/src/contexts/AdminAuthContext.tsx:127-131
const login = useCallback(() => {
  localStorage.setItem('zoho_pending_mode', 'agent');
  localStorage.setItem('zoho_admin_redirect', '/admin');
  window.location.href = buildZohoAgentUrl();
}, []);
```

### Customer Login Flow (Current)

```typescript
// classic/src/components/ZohoTickets/useZohoAuth.ts:452-459
const loginCustomer = useCallback(() => {
  setLoginError(null);
  setRetrying(false);
  localStorage.setItem(PENDING_MODE_KEY, 'customer');
  const nonce = randomString(32);
  localStorage.setItem(PENDING_NONCE_KEY, nonce);
  window.location.href = buildAuth0Url(nonce);
}, []);
```

### Session Cookie Verification (Server)

```typescript
// functions/lib/zoho-session.ts:125-153
export async function verifySessionCookie(
  cookie: string,
  secret: string,
): Promise<ZohoSession | null> {
  const parts = cookie.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const valid = await hmacVerify(secret, payload, signature);
  if (!valid) return null;

  const session = JSON.parse(
    new TextDecoder().decode(base64UrlDecode(payload)),
  ) as ZohoSession;

  if (session.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return session;
}
```

### Protected Route Pattern

```typescript
// classic/src/components/Admin/ProtectedRoute.tsx
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin-login" />;
  }

  return <>{children}</>;
}
```

---

## Questions for Planning Phase

1. **Should admin auth migrate to Auth0?** (Recommended for consistency)
2. **Should Zoho remain as identity source or migrate to Auth0 database?**
3. **What roles/permissions are needed beyond admin/customer?**
4. **Should existing Zoho sessions be migrated or invalidated?**
5. **What MFA requirements exist for different user types?**
6. **Should SSO be supported (SAML, OIDC connections)?**

---

## Sources

### Primary (HIGH confidence)
- `classic/src/contexts/AdminAuthContext.tsx` - Admin auth implementation
- `classic/src/components/ZohoTickets/useZohoAuth.ts` - Customer auth implementation
- `functions/zoho-customer-auth.ts` - Server-side customer auth
- `functions/admin-auth-callback.ts` - Server-side admin callback
- `functions/lib/admin-session.ts` - Admin session utilities
- `functions/lib/zoho-session.ts` - Customer session utilities
- `classic/src/components/Admin/ProtectedRoute.tsx` - Auth guard pattern

### Secondary (MEDIUM confidence)
- `classic/src/pages/admin-login.tsx` - Login UI
- `classic/src/pages/auth/callback.tsx` - Auth0 callback handler
- `functions/zoho-logout.ts` - Logout handler

---

## Metadata

**Confidence breakdown:**
- Architecture analysis: HIGH - Based on source code reading
- Security analysis: HIGH - Based on OAuth/cookie inspection
- Gap analysis: HIGH - Based on feature comparison
- Recommendations: MEDIUM - Based on best practices, needs validation

**Research date:** 2026-04-01
**Valid until:** Architecture changes (stable codebase)
