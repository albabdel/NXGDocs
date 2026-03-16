# Zoho Authentication Implementation Analysis

**Date:** 2026-03-16
**Confidence:** HIGH (based on code review)

---

## Executive Summary

The current Zoho authentication implementation has **multiple critical issues** that prevent customer/end-user login from working correctly:

1. **Fundamental Architecture Flaw**: Customer portal login uses the **wrong OAuth flow entirely**
2. **Token Security Issues**: Service account token leaked to browser, no per-customer scoping
3. **Missing Token Refresh**: Tokens expire with no automatic refresh mechanism
4. **Poor Error Handling**: Silent failures, unhelpful error messages
5. **CORS Fallback Risks**: Direct API calls will fail in browser due to CORS

---

## Current Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AGENT LOGIN FLOW (Working)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. User clicks "Agent Login"                                               │
│  2. useZohoAuth.ts:loginAgent() called (L237-241)                           │
│  3. Redirect to Zoho OAuth:                                                 │
│     - accounts.zoho.eu/oauth/v2/auth                                        │
│     - response_type=token (implicit flow)                                   │
│     - access_type=online (short-lived token)                                │
│     - scope: Desk.tickets.READ, UPDATE, CREATE, etc.                        │
│  4. User authenticates at Zoho                                              │
│  5. Zoho redirects back with access_token in URL hash                       │
│  6. useZohoAuth parses hash, stores in sessionStorage                       │
│  7. Token used for API calls via zoho-proxy                                 │
│                                                                             │
│  ✓ This works because agents have Zoho accounts                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      CUSTOMER LOGIN FLOW (Broken)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PATH A: Portal OAuth (loginPortal) - BROKEN                                │
│  ─────────────────────────────────────────────────                          │
│  1. User clicks "Customer Login"                                            │
│  2. useZohoAuth.ts:loginPortal() called (L244-248)                          │
│  3. Redirect to Zoho OAuth with PORTAL_SCOPES                               │
│  4. ❌ REQUIRES ZOHO ACCOUNT - Customers don't have Zoho accounts!          │
│  5. User cannot authenticate (no Zoho credentials)                          │
│  6. Flow dead-ends                                                          │
│                                                                             │
│  PATH B: Auth0 Exchange (loginCustomer) - FLAWED                            │
│  ─────────────────────────────────────────────────                          │
│  1. User clicks "Customer Login (legacy)"                                   │
│  2. useZohoAuth.ts:loginCustomer() called (L251-257)                        │
│  3. Redirect to Auth0 (response_type=id_token)                              │
│  4. User authenticates with Auth0 (email/password)                          │
│  5. Auth0 returns id_token in URL hash                                      │
│  6. Browser POSTs id_token to /zoho-customer-auth                           │
│  7. Server verifies Auth0 JWT signature                                     │
│  8. Server uses SERVICE ACCOUNT refresh token to get Zoho access token      │
│  9. Server looks up contact by email                                        │
│  10. ❌ RETURNS SERVICE ACCOUNT TOKEN TO BROWSER                            │
│  11. Browser stores SERVICE ACCOUNT token in sessionStorage                 │
│  12. ❌ ALL CUSTOMERS SHARE THE SAME SERVICE ACCOUNT TOKEN                  │
│  13. ❌ NO PER-CUSTOMER PERMISSION SCOPING                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Issue #1: Customer Login Uses Wrong OAuth Flow

### Root Cause

**File:** `useZohoAuth.ts` lines 72-82, 244-248

```typescript
function buildZohoPortalUrl(): string {
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: ZOHO_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: PORTAL_SCOPES,
    access_type: 'online',
    prompt: 'consent',
  });
  return `${ZOHO_AUTH_URL}?${params}`;
}
```

### The Problem

`loginPortal()` redirects customers to Zoho's OAuth endpoint. **This requires the user to have a Zoho account.** Customers do NOT have Zoho accounts - they are external users who should authenticate via:

1. **Zoho Desk Customer Portal** - Zoho's built-in customer portal with its own auth
2. **Third-party IdP** - Auth0, Okta, etc. linked to Zoho Desk contacts

### Why It Fails

| Requirement | Reality |
|-------------|---------|
| User has Zoho credentials | ❌ Customers don't have Zoho accounts |
| User can access accounts.zoho.eu | ❌ Customers don't have Zoho access |
| OAuth returns valid token | ❌ Never gets that far |

### Evidence

The `PORTAL_SCOPES` (L22-27) are the same scopes agents use:
```typescript
const PORTAL_SCOPES = [
  'Desk.tickets.READ',
  'Desk.tickets.UPDATE',
  'Desk.tickets.CREATE',
  'Desk.basic.READ',
].join(',');
```

These are **agent scopes**, not customer portal scopes. Zoho Desk has a separate Portal API with different authentication.

---

## Issue #2: Service Account Token Leaked to Browser

### Root Cause

**File:** `zoho-customer-auth.ts` lines 188-206

```typescript
// Line 188: Get SERVICE ACCOUNT token
const { accessToken: zToken, expiresIn } = await refreshZohoToken(context.env);

// Lines 197-206: Return SERVICE ACCOUNT token to browser
return json({
  ok: true,
  accessToken: zToken,  // ❌ SERVICE ACCOUNT TOKEN
  expiry: Date.now() + expiresIn * 1000,
  accountId: contact.accountId ?? null,
  contactId: contact.id,
  displayName: ...,
  account: contact.account?.accountName ?? null,
});
```

### Security Impact

| Issue | Consequence |
|-------|-------------|
| Service account token in browser | Any user can inspect DevTools and extract token |
| Token has full agent privileges | Customer can potentially access ALL tickets, not just their own |
| No token binding | Token not tied to specific user - anyone with token can use it |
| Session storage | Token persists in browser until tab closed (or expiry) |

### What Should Happen Instead

The server should:
1. **Keep the service account token server-side**
2. **Issue a session token to the browser** (e.g., JWT signed by server)
3. **Validate session on each API call**
4. **Make API calls server-side using service account token**

---

## Issue #3: No Per-Customer Permission Scoping

### Root Cause

**File:** `zohoApi.ts` lines 70-76

```typescript
// Only scope to the configured department for customer queries;
// for agent queries (no account/contact filter) return all departments.
if (accountId) {
  params.set('departmentId', DEPT_ID);
  params.set('accountId', accountId);
} else if (contactId) {
  params.set('departmentId', DEPT_ID);
  params.set('contactId', contactId);
}
```

### The Problem

Scoping is done **client-side** by adding query parameters. This is **not security** - it's just filtering.

**A malicious user could:**
1. Extract the service account token from sessionStorage
2. Remove the `accountId` and `contactId` parameters
3. Query ALL tickets in the organization

### Why This Isn't Real Authorization

```typescript
// Current approach (client-side filtering):
const params = new URLSearchParams({ ... });
if (accountId) params.set('accountId', accountId);  // Optional, client-controlled

// What should happen (server-side authorization):
// Server validates: "Does this session have permission to access this ticket?"
// Not just: "Did the client include the right query parameter?"
```

---

## Issue #4: No Token Refresh Mechanism

### Root Cause

**File:** `useZohoAuth.ts` - No refresh logic exists

The token is stored once and never refreshed:
- Line 92: `expiry: Date.now() + parseInt(expiresIn ?? '3600') * 1000`
- Line 126-130: Token rejected if expired, but **no refresh attempted**

```typescript
function loadStoredToken(): ZohoTokenData | null {
  // ...
  if (data.expiry < Date.now() + 60_000) {
    sessionStorage.removeItem(STORAGE_KEY);  // ❌ Just deletes token
    return null;  // ❌ User must re-login
  }
  return data;
}
```

### Impact

| Scenario | Result |
|----------|--------|
| Token expires (1 hour) | User logged out without warning |
| API call with expired token | 401 error, poor UX |
| Long session | Repeated logins required |

### What's Missing

```typescript
// MISSING: Token refresh logic
async function refreshTokenIfNeeded(token: ZohoTokenData): Promise<ZohoTokenData> {
  if (token.expiry > Date.now() + 5 * 60 * 1000) return token; // 5 min buffer
  
  // For agents: Use Zoho refresh token (offline access)
  // For customers: Call /zoho-customer-auth to refresh service account token
  
  // Neither is implemented!
}
```

### Why It Matters

- **Agents**: Using `access_type: 'online'` (L67) means NO refresh token is available
- **Customers**: Service account token could be refreshed, but flow redirects to login instead

---

## Issue #5: CORS Fallback is Risky

### Root Cause

**File:** `zohoApi.ts` lines 8-46

```typescript
let useProxy = true;

async function apiCall<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  // ...
  if (useProxy) {
    res = await makeRequest(PROXY_BASE);
    if (res.status === 404) {
      // ...
      useProxy = false;
      console.warn('Proxy not available, falling back to direct API');
      res = await makeRequest(DIRECT_BASE);  // ❌ Will fail with CORS
    }
  } else {
    res = await makeRequest(DIRECT_BASE);
  }
}
```

### The Problem

If the proxy returns 404, the code falls back to **direct API calls**:

```typescript
const DIRECT_BASE = 'https://desk.zoho.eu/api/v1';
```

**This will fail in the browser** because:
1. `desk.zoho.eu` does NOT send `Access-Control-Allow-Origin` headers
2. Browser blocks the request before it even reaches Zoho
3. Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

### When This Happens

| Scenario | Proxy Status | Result |
|----------|--------------|--------|
| Cloudflare Functions deployed | Working | OK |
| Local development without Functions | 404 | CORS failure |
| Functions misconfigured | 404 | CORS failure |
| Staging environment | May vary | Unpredictable |

### Better Approach

```typescript
// Don't silently fall back - fail explicitly
if (res.status === 404) {
  throw new Error('API proxy not available. Please contact support.');
}
```

---

## Issue #6: Error Handling Gaps

### Silent Failures

**File:** `useZohoAuth.ts` lines 181-183

```typescript
} catch {
  // nonce check failed silently — Cloudflare Function will still verify the signature
}
```

**Problem:** Nonce mismatch is silently ignored. This weakens CSRF protection.

### Unhelpful Error Messages

**File:** `zoho-customer-auth.ts` line 193

```typescript
if (!contact) {
  return json({
    error: `No support account found for ${email}. Please contact NXGEN support.`,
  }, 404);
}
```

This is actually good, but other errors are generic:

**File:** `zohoApi.ts` lines 48-51

```typescript
if (!res.ok) {
  const err = await res.text().catch(() => res.statusText);
  throw new Error(`Zoho API ${res.status}: ${err}`);  // Generic, not actionable
}
```

### Missing Error Context

| Error Type | Current | Better |
|------------|---------|--------|
| Expired token | "Zoho API 401" | "Your session expired. Please log in again." |
| Invalid scope | "Zoho API 403" | "Permission denied. Contact your administrator." |
| Network error | "Failed to fetch" | "Network error. Check your connection." |
| Rate limit | "Zoho API 429" | "Too many requests. Please wait a moment." |

---

## Issue #7: Hardcoded Secrets

### Client ID in Frontend

**File:** `useZohoAuth.ts` line 8

```typescript
const ZOHO_CLIENT_ID = '1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN';
```

This is acceptable for public OAuth clients, but should be in environment variables for flexibility.

### Auth0 Domain Hardcoded

**File:** `useZohoAuth.ts` lines 33-34

```typescript
const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'ygWwMxVGpKHSxLLdNxfxPs8GHCIQRwES';
```

Should be environment-configurable for different environments (dev/staging/prod).

---

## Issue #8: Missing Audience Validation

### Root Cause

**File:** `zoho-customer-auth.ts` lines 110-113

```typescript
// Validate issuer
const expectedIss = `https://${domain}/`;
if (claims.iss !== expectedIss) throw new Error(`Invalid issuer: ${claims.iss}`);

return claims;  // ❌ No audience validation!
```

### Security Impact

The JWT's `aud` (audience) claim should be validated to ensure the token was issued for THIS application. Without this check, a token issued for a different Auth0 client could be accepted.

### What's Missing

```typescript
// MISSING: Audience validation
const expectedAud = context.env.AUTH0_CLIENT_ID;  // Should be in env
if (claims.aud !== expectedAud) {
  throw new Error(`Invalid audience: ${claims.aud}`);
}
```

---

## Failure Points Summary

| # | Issue | Severity | File:Lines |
|---|-------|----------|------------|
| 1 | Customer login uses wrong OAuth flow | **CRITICAL** | useZohoAuth.ts:72-82, 244-248 |
| 2 | Service account token leaked to browser | **CRITICAL** | zoho-customer-auth.ts:188-206 |
| 3 | No per-customer permission scoping | **CRITICAL** | zohoApi.ts:70-76 |
| 4 | No token refresh mechanism | **HIGH** | useZohoAuth.ts:126-130 |
| 5 | CORS fallback will fail | **HIGH** | zohoApi.ts:34-46 |
| 6 | Silent nonce check failure | **MEDIUM** | useZohoAuth.ts:181-183 |
| 7 | Missing audience validation | **MEDIUM** | zoho-customer-auth.ts:110-113 |
| 8 | Generic error messages | **MEDIUM** | zohoApi.ts:48-51 |
| 9 | Hardcoded configuration | **LOW** | useZohoAuth.ts:8, 33-34 |

---

## Recommended Architecture

### Current (Broken)

```
Browser ──► Auth0 ──► Browser (id_token)
                                    │
Browser ──► /zoho-customer-auth ──► Server
                │                      │
                └───── id_token ──────►│
                                       │
                                       ▼
                              Zoho Service Account Token
                                       │
                                       ▼
                          ❌ Returned to browser ❌
```

### Correct Approach

```
Browser ──► Auth0 ──► Browser (id_token)
                                    │
Browser ──► /auth/customer ──► Server
                │                      │
                └───── id_token ──────►│
                                       │
                                       ▼
                              Zoho Service Account Token (server-side only)
                                       │
                                       ▼
                          Server issues session JWT to browser
                                       │
                          Browser stores session JWT only
                                       
API Calls:
Browser ──► /api/tickets ──► Server validates session
                │                  │
                └─ session JWT ───►│
                                   │
                                   ▼
                          Server uses service account token
                          + validates user has access
                                   │
                                   ▼
                          Returns only user's tickets
```

---

## Code Quality Issues

### 1. Type Casting Issues

**File:** `useZohoAuth.ts` lines 196-204

```typescript
let data: Record<string, unknown>;
try { data = JSON.parse(text); } catch { throw new Error(`...`); }
data = data as {  // This is a type assertion, not validation
  ok?: boolean;
  accessToken?: string;
  // ...
};
```

This doesn't validate the response shape at runtime. If Zoho changes their API, this will fail silently.

### 2. Magic Numbers

**File:** `useZohoAuth.ts` line 126

```typescript
if (data.expiry < Date.now() + 60_000) {  // What is 60_000?
```

Should be a named constant: `TOKEN_EXPIRY_BUFFER_MS = 60_000`

### 3. Inconsistent Error Handling

**File:** `zoho-customer-auth.ts` lines 211-213

```typescript
const isAuthError = msg.includes('signature') || msg.includes('expired') || msg.includes('issuer');
return json({ error: isAuthError ? 'Authentication failed' : msg }, isAuthError ? 401 : 500);
```

This leaks `msg` for non-auth errors, which could include sensitive info.

### 4. No Request Timeout

All fetch calls lack timeout handling. A slow/hanging Zoho API could freeze the UI.

---

## Missing Functionality

| Feature | Status | Needed For |
|---------|--------|------------|
| Token refresh | ❌ Missing | Seamless long sessions |
| Proper customer auth | ❌ Broken | Customer portal access |
| Session management | ❌ Missing | Security, logout everywhere |
| Rate limit handling | ❌ Missing | API resilience |
| Retry logic | ❌ Missing | Transient failures |
| Request timeout | ❌ Missing | Prevent hangs |
| Proper error types | ❌ Missing | Actionable errors |
| Audit logging | ❌ Missing | Security compliance |

---

## Conclusion

The customer login flow is fundamentally broken because it assumes customers have Zoho accounts (they don't). The Auth0 exchange flow has a critical security flaw: it returns a privileged service account token to the browser, giving any customer access to all organization data.

**Immediate fixes needed:**

1. **Remove customer OAuth redirect** - Customers can't use Zoho OAuth
2. **Server-side API proxy** - Never send service account token to browser
3. **Session-based auth** - Issue session tokens, validate server-side
4. **Add token refresh** - For agents and server-side service account

**The architecture needs to change from "token in browser" to "session in browser, token on server."**
