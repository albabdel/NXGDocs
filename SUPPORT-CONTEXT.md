# Support Portal — Context & Rules for AI Agents

This document is the authoritative reference for any AI agent working on the `/support` customer portal. Read it fully before touching any file in `functions/`, `functions/lib/`, or `classic/src/components/ZohoTickets/`.

---

## 1. What This Is

A customer-facing support portal at `/support` that lets Auth0-authenticated users view and manage their own Zoho Desk tickets. It is built on:

- **Docusaurus** (React, static site) — frontend in `classic/`
- **Cloudflare Pages Functions** (serverless backend) — in `functions/`
- **Wrangler v2** (local dev server) — runs the full stack locally at `http://localhost:8080`

---

## 2. Full Authentication Flow

```
User clicks "Sign in with Auth0"
  │
  ▼
Auth0 Universal Login (nxgen.eu.auth0.com)
  │  response_type=id_token, scope=openid email profile
  │  redirect_uri=http://localhost:8080/auth/callback
  ▼
/auth/callback page (classic/src/pages/auth/callback.tsx)
  │  Reads id_token from URL hash
  │  Verifies nonce (anti-replay)
  │  POSTs { action: 'auth0-exchange', idToken } to /zoho-customer-auth
  ▼
/zoho-customer-auth (functions/zoho-customer-auth.ts)
  │  1. Verifies id_token signature using Auth0 JWKS (RS256)
  │  2. Extracts email from claims
  │  3. Refreshes Zoho service account token
  │  4. Finds contact in Zoho Desk by email (see §6 for API quirks)
  │  5. Creates HMAC-SHA256 signed session cookie (HttpOnly)
  │  6. Returns only safe profile data (contactId, displayName, accountId)
  ▼
Browser receives HttpOnly session cookie (zoho_session)
  │  JavaScript cannot read this cookie — this is intentional
  ▼
/support page loads — customer sees their tickets
  │
  ▼
All ticket API calls go through /zoho-customer-proxy/[[path]]
  (functions/zoho-customer-proxy/[[path]].ts)
  │  Validates session cookie
  │  Extracts contactId from session (never from client request)
  │  Rewrites URL to scope request to that contact
  │  Forwards to Zoho Desk API with service account token
  │  Validates response ownership before returning
```

---

## 3. File Map

### Backend (Cloudflare Pages Functions)

| File | Purpose |
|------|---------|
| `functions/zoho-customer-auth.ts` | Auth0 id_token → Zoho session. Handles `auth0-exchange` action. |
| `functions/zoho-customer-proxy/[[path]].ts` | Secure proxy for all Zoho Desk API calls from the customer portal. |
| `functions/lib/zoho-session.ts` | Session cookie creation, verification, HMAC signing, token caching. |

### Frontend (Docusaurus/React)

| File | Purpose |
|------|---------|
| `classic/src/pages/auth/callback.tsx` | Auth0 redirect target. Exchanges id_token for session, redirects to /support. |
| `classic/src/pages/support.tsx` (or similar) | The main /support page that renders the ZohoTickets component. |
| `classic/src/components/ZohoTickets/` | All ticket UI components. |
| `classic/src/components/ZohoTickets/useZohoAuth.ts` | Auth state hook. Manages session, login flow, logout. |

### Config

| File | Purpose |
|------|---------|
| `.dev.vars` | Local secrets for Wrangler. **Gitignored. Never commit.** |
| `wrangler.toml` | Cloudflare Pages config. Does NOT contain secrets. |

---

## 4. Environment Variables

All set in `.dev.vars` for local dev. Set as Cloudflare Pages secrets for production.

| Variable | What it is |
|----------|-----------|
| `AUTH0_DOMAIN` | `nxgen.eu.auth0.com` — Auth0 tenant domain |
| `ZOHO_ORG_ID` | `20067436506` — Zoho Desk organization ID |
| `ZOHO_CLIENT_ID` | Zoho OAuth app client ID (service account) |
| `ZOHO_CLIENT_SECRET` | Zoho OAuth app client secret — **never expose to browser** |
| `ZOHO_REFRESH_TOKEN` | Service account refresh token — **never expose to browser** |
| `ZOHO_SESSION_SECRET` | HMAC-SHA256 key for signing session cookies |
| `SANITY_PROJECT_ID` | Sanity CMS project ID |
| `SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | Sanity read token |

---

## 5. Security Model — Critical Rules

**Never break these:**

1. **The Zoho service account token is NEVER returned to the browser.** The `/zoho-customer-auth` function creates an HttpOnly cookie. The JavaScript layer only ever sees `contactId`, `displayName`, and `accountId` — not tokens.

2. **`contactId` is ALWAYS taken from the session cookie, never from the client request.** In `zoho-customer-proxy`, the `applyContactScoping()` function enforces this. Do not pass `contactId` from `req.query` or the request URL to Zoho.

3. **The session cookie is HttpOnly and signed with HMAC-SHA256.** Do not change `buildSessionCookieHeader()` to remove `HttpOnly`. Do not weaken the signing in `zoho-session.ts`.

4. **Auth0 is treated as read-only.** Do not change Auth0 application settings, allowed callbacks, or token settings. The implicit flow (`response_type=id_token`) is intentional. The registered callback is `http://localhost:8080/auth/callback`.

5. **Do not add `prompt: 'login'` to the Auth0 URL.** This breaks SSO — users already logged into other NXGEN apps (e.g., gcx.nxgen.cloud) on the same Auth0 tenant should be automatically signed in without re-entering credentials.

---

## 6. Zoho Desk API Quirks (Important)

The Zoho Desk EU API (`desk.zoho.eu`) has changed several endpoints. Do not use the old parameter forms:

| Old (broken) | New (correct) |
|---|---|
| `GET /api/v1/contacts/search?searchStr=x&searchField=email` | `GET /api/v1/search?searchStr=x&module=contacts` |
| `GET /api/v1/contacts?searchStr=x&searchField=email` | Same as above |
| `GET /api/v1/tickets?contactId=x` | `GET /api/v1/contacts/{contactId}/tickets` |
| `GET /api/v1/contacts/search?searchStr=x` | `GET /api/v1/search?searchStr=x&module=contacts` |

Any endpoint that returns `422 UNPROCESSABLE_ENTITY: "Extra query parameter 'X' is present"` means Zoho has removed support for that parameter. Check the table above or test directly using `node scripts/test-*.mjs`.

The `/api/v1/contacts/search` endpoint (no params) returns recently modified contacts — it is NOT a search endpoint anymore. Use the global `/api/v1/search?module=contacts` instead.

### Required OAuth Scopes for the Service Account

The Zoho refresh token in `.dev.vars` must have been generated with ALL of these scopes:

```
Desk.tickets.READ,Desk.tickets.UPDATE,Desk.tickets.CREATE,
Desk.contacts.READ,Desk.contacts.CREATE,Desk.search.READ,
Desk.agents.READ,Desk.basic.READ,aaaserver.profile.read
```

If `GET /api/v1/search` returns `403 SCOPE_MISMATCH`, the refresh token is missing `Desk.search.READ`. Regenerate via Zoho API Console Self Client at `https://api-console.zoho.eu/`.

---

## 7. Local Development

### Starting the dev server

```bash
# First time or after Sanity content changes:
npm run sanity:fetch   # fetches Sanity content into classic/
npm run dev            # builds Docusaurus then starts Wrangler

# After code changes (no Sanity changes):
npm run dev:full       # skips rebuild, starts Wrangler only
```

The server runs at `http://localhost:8080`.
Auth0 callback is registered for `http://localhost:8080/auth/callback`.

**Important:** Wrangler reads `.dev.vars` only at startup. If you change `.dev.vars`, restart Wrangler for changes to take effect.

### Wrangler version

The project uses **Wrangler v2** (`wrangler@^2.21.3`). Do NOT upgrade to v3 or v4 — they ship a `workerd` binary that crashes on Windows with `std::terminate()`.

### Testing scripts

Diagnostic scripts in `scripts/` that use the service account token directly:

| Script | What it tests |
|--------|--------------|
| `test-new-token.mjs` | Token refresh, contacts list, search endpoint |
| `test-find-contact.mjs` | Paginates contacts to find a specific email |
| `test-tickets.mjs` | Ticket endpoint approaches |
| `test-search-endpoint.mjs` | Zoho search API parameter formats |

Run with: `node scripts/<name>.mjs`

---

## 8. How to Add a New Backend Feature

### Adding a new Cloudflare Function

Create `functions/my-feature.ts`:

```typescript
import { getSessionFromHeader, getCachedToken, ZohoEnv } from './lib/zoho-session';

export const onRequestGet: PagesFunction<ZohoEnv> = async (context) => {
  // 1. Validate session
  const session = await getSessionFromHeader(
    context.request.headers.get('Cookie'),
    context.env.ZOHO_SESSION_SECRET
  );
  if (!session) return new Response(JSON.stringify({ error: 'Auth required' }), { status: 401 });

  // 2. Get service token (cached, never returned to browser)
  const token = await getCachedToken(context.env);

  // 3. Call Zoho API — ALWAYS scope to session.contactId
  const res = await fetch(
    `https://desk.zoho.eu/api/v1/contacts/${session.contactId}/something`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}`, orgId: context.env.ZOHO_ORG_ID } }
  );

  // 4. Return result
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Extending the proxy for a new endpoint

If you need to add a new Zoho endpoint accessible from the frontend (e.g., create a ticket, add a comment), add handling in `applyContactScoping()` in `functions/zoho-customer-proxy/[[path]].ts`:

```typescript
// Example: scope ticket creation to the contact
if (path === 'tickets' && request.method === 'POST') {
  // Inject contactId into the POST body from the session
  // Never trust contactId from the client
}
```

### Calling a new function from the frontend

```typescript
// In any ZohoTickets component, call through the proxy:
const res = await fetch('/zoho-customer-proxy/tickets', {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Required — sends the HttpOnly session cookie
});
```

Always use `credentials: 'include'` so the HttpOnly session cookie is sent.

---

## 9. What NOT to Do

- **Do not** call Zoho APIs directly from the frontend. All Zoho calls must go through `/zoho-customer-proxy`.
- **Do not** store the Zoho service account token in `localStorage`, `sessionStorage`, or any JS-accessible location.
- **Do not** upgrade Wrangler to v3+. It crashes on Windows.
- **Do not** add `prompt: 'login'` to the Auth0 URL — this breaks SSO.
- **Do not** use `contactId` from query params when calling Zoho — always use it from the session cookie.
- **Do not** use `GET /api/v1/tickets?contactId=xxx` — use `GET /api/v1/contacts/{id}/tickets`.
- **Do not** use `GET /api/v1/contacts/search?searchStr=xxx` — use `GET /api/v1/search?searchStr=xxx&module=contacts`.
- **Do not** commit `.dev.vars` or `classic/.env.local` — they contain secrets and are gitignored.
- **Do not** change the `ZOHO_SESSION_SECRET` in production without also invalidating all existing sessions (changing it logs everyone out).

---

## 10. Key Identifiers (Dev Environment)

| Item | Value |
|------|-------|
| Auth0 Tenant | `nxgen.eu.auth0.com` |
| Auth0 Client ID (docs portal) | `jqiJJISVmCmWWB46m0wMI7CO91KyliIm` |
| Zoho Org ID | `20067436506` |
| Zoho API Base URL | `https://desk.zoho.eu/api/v1` |
| Zoho OAuth Token URL | `https://accounts.zoho.eu/oauth/v2/token` |
| Session Cookie Name | `zoho_session` |
| Local Dev Port | `8080` |
