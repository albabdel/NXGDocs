# Zoho Desk Portal API Research

**Domain:** Zoho Desk Customer Portal API Endpoints
**Researched:** 2026-03-16
**Confidence:** MEDIUM (OAS specs verified, Portal API structure inferred from existing implementation)

---

## Executive Summary

Zoho Desk does **not** provide a separate Portal API endpoint namespace (`/portal/api/`) in the official OpenAPI specifications. All customer operations use the **same Desk API endpoints** (`/api/v1/`) with the key difference being **authentication method and server-side scoping**.

The existing project implementation correctly uses:
- **Desk API endpoints** (`/api/v1/tickets`, etc.) for all operations
- **Session-based authentication** via HttpOnly cookies (not OAuth tokens exposed to browser)
- **Server-side scoping** enforced by backend proxy that filters by `contactId`

**Critical Finding:** There is no `/portal/api/` endpoint namespace in the official Zoho Desk API. The "Portal API" referenced in Zoho documentation refers to the **Help Center UI and authentication flow**, not separate API endpoints.

---

## Key Finding: No Separate Portal API Endpoints

### Official OAS Specification Analysis

From the official Zoho Desk OpenAPI specifications (`github.com/zoho/zohodesk-oas`):

| Endpoint Category | Base Path | Authentication |
|-------------------|-----------|----------------|
| Tickets | `/api/v1/tickets` | OAuth2 (Agent) |
| Contacts | `/api/v1/contacts` | OAuth2 (Agent) |
| Articles (KB) | `/api/v1/articles` | OAuth2 (Agent) |
| Threads | `/api/v1/tickets/{ticketId}/threads` | OAuth2 (Agent) |
| Comments | `/api/v1/tickets/{ticketId}/comments` | OAuth2 (Agent) |
| Attachments | `/api/v1/tickets/{ticketId}/attachments` | OAuth2 (Agent) |

**All endpoints require `iam-oauth2-schema` authentication with explicit scopes** (e.g., `Desk.tickets.READ`, `Desk.tickets.CREATE`).

### The "Portal API" Misconception

Zoho documentation references "Portal API" in two contexts:

1. **Help Center Portal UI** - The customer-facing web interface at `{portal-domain}/portal/`
2. **Portal User Authentication** - JWT SSO or native login for end-users

These are **authentication/UI concepts**, not separate API endpoints. The actual API calls made by the Help Center portal use the same `/api/v1/` endpoints but with **session-based authentication** that automatically scopes responses to the authenticated contact.

---

## Customer Operations: Endpoints & Implementation

### Current Project Implementation

The project uses a **secure proxy pattern** for customer operations:

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Customer   │────▶│  /zoho-customer- │────▶│   Desk API      │
│   Browser   │     │     proxy        │     │  /api/v1/...    │
└─────────────┘     └──────────────────┘     └─────────────────┘
       │                    │                        │
       │  Session Cookie    │  OAuth Token           │
       │  (HttpOnly)        │  (Server-side)         │
       │                    │                        │
       │                    ▼                        │
       │            ┌──────────────────┐             │
       │            │  contactId       │             │
       │            │  scoping filter  │             │
       │            └──────────────────┘             │
       │                                             │
       └─────────────────────────────────────────────┘
                   Response filtered by contactId
```

### Key Endpoints for Customer Operations

#### 1. List Tickets (Customer's Own)

**Endpoint:** `GET /api/v1/tickets`

**Parameters:**
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `orgId` | Required | Organization ID |
| `departmentId` | Optional | Filter by department |
| `status` | Optional | Filter by status |
| `from` | Optional | Pagination offset |
| `limit` | Optional | Max results (default 50) |
| `sortBy` | Optional | `createdTime`, `modifiedTime` |

**Scoping Implementation:**
```typescript
// Backend proxy adds contactId filter automatically
const params = new URLSearchParams({
  orgId: ORG_ID,
  departmentId: DEPT_ID,
  from: String((page - 1) * limit),
  limit: String(limit),
  sortBy: '-createdTime',
});

// Server-side: Add contactId from session
const session = await getSessionFromHeader(cookieHeader, secret);
if (session?.contactId) {
  params.set('contactId', session.contactId);
}
```

**Alternative: Use Contact-Specific Endpoint**
```
GET /api/v1/contacts/{contactId}/tickets
```
This endpoint is documented in OAS and explicitly lists tickets for a contact.

#### 2. Get Ticket Details

**Endpoint:** `GET /api/v1/tickets/{ticketId}`

**Security Check Required:**
```typescript
// Backend must verify ticket belongs to customer
const ticket = await fetchTicket(ticketId);
const session = await getSession(cookieHeader);

if (ticket.contactId !== session.contactId) {
  // Check account-level access if configured
  if (!canViewAccountTickets(session)) {
    return new Response('Unauthorized', { status: 403 });
  }
}
```

#### 3. Create Ticket

**Endpoint:** `POST /api/v1/tickets`

**Request Body:**
```json
{
  "subject": "Ticket subject",
  "description": "Ticket description",
  "departmentId": "17599000000007061",
  "email": "customer@example.com",
  "contactId": "CONTACT_ID_FROM_SESSION",
  "priority": "High",
  "status": "Open",
  "channel": "CUSTOMERPORTAL"
}
```

**Auto-association:**
```typescript
// Backend automatically sets contactId from session
const session = await getSession(cookieHeader);
const ticketData = {
  ...requestBody,
  contactId: session.contactId,  // Always use session contact
  channel: 'CUSTOMERPORTAL'       // Mark as portal-originated
};
```

#### 4. Add Comment/Reply

**Endpoint:** `POST /api/v1/tickets/{ticketId}/comments`

**Request Body:**
```json
{
  "content": "Comment text",
  "isPublic": true,
  "contentType": "plainText"
}
```

**Alternative: Send Reply via Thread**
**Endpoint:** `POST /api/v1/tickets/{ticketId}/sendReply`

```json
{
  "channel": "EMAIL",
  "to": "support@example.com",
  "from": "customer@example.com",
  "contentType": "html",
  "content": "<p>Reply content</p>",
  "attachments": []
}
```

#### 5. Get Knowledge Base Articles

**Endpoint:** `GET /api/v1/articles`

**Parameters:**
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `orgId` | Required | Organization ID |
| `status` | `Published` | Only published articles |
| `permission` | `ALL`, `REGISTEREDUSERS` | Access level filter |
| `categoryId` | Optional | Filter by category |
| `limit` | Optional | Max results |
| `from` | Optional | Pagination offset |

**Permission Values:**
- `ALL` - Public articles (visible to all)
- `REGISTEREDUSERS` - Only for logged-in portal users
- `AGENTS` - Internal only (not for customers)

**Customer Access Pattern:**
```typescript
// Fetch public and registered-user articles
const articles = await fetch('/api/v1/articles', {
  headers: {
    'orgId': ORG_ID,
  },
  params: {
    status: 'Published',
    permission: 'ALL,REGISTEREDUSERS',  // Exclude AGENTS-only
  }
});
```

**Get Single Article:** `GET /api/v1/articles/{articleId}`

---

## Authentication: Portal API vs Desk API

### The Real Difference

| Aspect | "Desk API" (Agent) | "Portal API" (Customer) |
|--------|-------------------|------------------------|
| **Endpoints** | `/api/v1/*` | `/api/v1/*` (same!) |
| **Auth Method** | OAuth2 Bearer Token | Session Cookie / JWT SSO |
| **Token Location** | `Authorization: Zoho-oauthtoken <token>` | HttpOnly Cookie |
| **Scope** | Organization-wide (permission-based) | Contact-scoped (own data only) |
| **User Type** | `AGENT` | `END_USER` |
| **Scopes Required** | `Desk.tickets.*`, etc. | None (implicit via session) |

### Current Implementation (Correct Pattern)

From `functions/zoho-customer-auth.ts`:

```typescript
// 1. Customer authenticates via Auth0
const claims = await verifyAuth0IdToken(idToken, env.AUTH0_DOMAIN);

// 2. Backend finds Zoho contact
const contact = await findContactByEmail(zToken, email, orgId);

// 3. Create session cookie (token NEVER exposed to browser)
const sessionToken = await createSessionCookie(
  contact.id,
  contact.accountId,
  displayName,
  env.ZOHO_SESSION_SECRET,
);

// 4. Return session cookie, not token
return new Response(JSON.stringify({
  ok: true,
  contactId: contact.id,
  displayName,
}), {
  headers: {
    'Set-Cookie': buildSessionCookieHeader(sessionToken),
  },
});
```

From `functions/lib/zoho-session.ts`:

```typescript
// Session cookie format: base64url(payload).signature
export interface ZohoSession {
  contactId: string;
  accountId: string | null;
  displayName: string;
  iat: number;
  exp: number;
}
```

---

## Comparison: Desk API vs Portal Implementation

### Option A: Using Desk API Directly (Current - Correct)

```typescript
// Frontend calls backend proxy
const tickets = await fetch('/zoho-customer-proxy/tickets', {
  credentials: 'include',  // Sends session cookie
});

// Backend proxy adds OAuth token and contactId scoping
const response = await fetch(`https://desk.zoho.eu/api/v1/tickets?contactId=${contactId}`, {
  headers: {
    'Authorization': `Zoho-oauthtoken ${accessToken}`,
    'orgId': orgId,
  },
});
```

**Pros:**
- Full access to all Desk API capabilities
- Proven working implementation
- Secure (OAuth token never exposed to browser)
- Flexible scoping control

**Cons:**
- Requires backend proxy for all requests
- Must implement own contactId filtering

### Option B: Using Help Center Portal (Embedded)

Zoho provides embeddable Help Center widgets:

```html
<script src="https://desk.zoho.com/portal/{portalName}/embed.js"></script>
```

**Pros:**
- Zero maintenance
- Built-in authentication
- KB, tickets, community included

**Cons:**
- Limited customization
- Not a custom portal experience
- Requires customers to visit separate portal

### Option C: JWT SSO + Portal Session (Alternative Auth)

If using Zoho's native portal authentication:

```typescript
// 1. IdP generates JWT
const jwt = generateJwt({
  email: 'customer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  exp: Math.floor(Date.now() / 1000) + 3600,
});

// 2. Send to Zoho's JWT validation endpoint
const response = await fetch('https://{portal}.zohodesk.com/portal/api/sso/jwt', {
  method: 'POST',
  body: JSON.stringify({ token: jwt }),
});

// 3. Zoho creates portal session
// User can now access Help Center with own data
```

**Note:** This endpoint (`/portal/api/sso/jwt`) is for **session establishment**, not for customer data operations. After JWT validation, Zoho creates a portal session that can access `/api/v1/*` endpoints.

---

## Authentication Requirements Summary

### For Customer Portal Operations

| Requirement | Implementation |
|-------------|----------------|
| Auth Method | Session Cookie (HttpOnly) or JWT SSO |
| Token Storage | Server-side only |
| Contact Association | Required (from session) |
| OAuth Token | Backend-only (service account or agent token) |
| Scoping | Backend enforces `contactId` filter |

### Session Cookie Requirements

```typescript
// Cookie attributes
const cookie = [
  'zoho_session=<signed_jwt>',
  'Path=/',
  'HttpOnly',        // Not accessible via JavaScript
  'Secure',          // HTTPS only
  'SameSite=Lax',    // CSRF protection
  'Max-Age=86400',   // 24 hours
].join('; ');
```

### Token Refresh Strategy

From `functions/lib/zoho-session.ts`:

```typescript
// In-memory cache for service account token (per-worker)
let tokenCache: TokenCache | null = null;
const TOKEN_CACHE_TTL_MS = 50 * 60 * 1000; // 50 minutes

export async function getCachedToken(env: ZohoEnv): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }
  // Refresh token
  const newToken = await refreshZohoToken(env);
  tokenCache = {
    accessToken: newToken.accessToken,
    expiresAt: Date.now() + TOKEN_CACHE_TTL_MS,
  };
  return newToken.accessToken;
}
```

---

## API Endpoint Reference

### Customer-Accessible Endpoints

| Operation | Endpoint | Method | Scope Enforced By |
|-----------|----------|--------|-------------------|
| List my tickets | `/api/v1/tickets` | GET | Backend: `contactId` filter |
| List my tickets (alt) | `/api/v1/contacts/{contactId}/tickets` | GET | Path parameter |
| Get ticket details | `/api/v1/tickets/{ticketId}` | GET | Backend: ownership check |
| Create ticket | `/api/v1/tickets` | POST | Backend: set `contactId` |
| Add comment | `/api/v1/tickets/{ticketId}/comments` | POST | Backend: ownership check |
| Send reply | `/api/v1/tickets/{ticketId}/sendReply` | POST | Backend: ownership check |
| Get threads | `/api/v1/tickets/{ticketId}/threads` | GET | Backend: ownership check |
| Get attachments | `/api/v1/tickets/{ticketId}/attachments` | GET | Backend: ownership check |
| Upload attachment | `/api/v1/tickets/{ticketId}/attachments` | POST | Backend: ownership check |
| List KB articles | `/api/v1/articles` | GET | `permission` filter |
| Get KB article | `/api/v1/articles/{articleId}` | GET | `permission` check |
| Get my profile | `/api/v1/contacts/{contactId}` | GET | Session contactId |

### Security Scopes Required (Agent Token)

| Scope | Operations |
|-------|------------|
| `Desk.tickets.READ` | List, get tickets |
| `Desk.tickets.CREATE` | Create tickets |
| `Desk.tickets.UPDATE` | Update tickets, add comments |
| `Desk.articles.READ` | Read KB articles |
| `Desk.contacts.READ` | Read contact info |

---

## Implementation Recommendations

### 1. Continue Using Current Architecture

The existing implementation is **correct and secure**:
- Session-based auth with HttpOnly cookies
- Backend proxy with OAuth token
- Server-side scoping by contactId

### 2. Add Explicit Ownership Checks

```typescript
// In zoho-customer-proxy
export async function onRequestGet(context) {
  const session = await getSessionFromHeader(
    context.request.headers.get('Cookie'),
    context.env.ZOHO_SESSION_SECRET,
  );
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // For ticket operations, verify ownership
  const ticketId = context.params.ticketId;
  if (ticketId) {
    const ticket = await getTicket(ticketId, context.env);
    if (ticket.contactId !== session.contactId) {
      // Check account-level access if configured
      if (!session.accountId || !canViewAccountTickets(session)) {
        return new Response('Forbidden', { status: 403 });
      }
    }
  }
  
  // Proceed with proxied request
  return proxyRequest(context.request, session, context.env);
}
```

### 3. Use Contact-Specific Endpoints Where Available

```typescript
// Instead of generic /tickets with contactId filter
const tickets = await fetch(
  `https://desk.zoho.eu/api/v1/contacts/${session.contactId}/tickets?orgId=${orgId}`,
  { headers: { 'Authorization': `Zoho-oauthtoken ${token}` } }
);
```

### 4. Filter KB Articles by Permission

```typescript
// Only fetch articles accessible to customers
const articles = await fetch(
  `https://desk.zoho.eu/api/v1/articles?orgId=${orgId}&status=Published&permission=ALL`,
  { headers: { 'Authorization': `Zoho-oauthtoken ${token}` } }
);
```

---

## Conclusion

**There is no separate Portal API namespace.** The "Portal API" is a concept, not a separate set of endpoints. The correct implementation uses:

1. **Same Desk API endpoints** (`/api/v1/*`)
2. **Different authentication** (session cookies, not exposed OAuth tokens)
3. **Server-side scoping** (contactId filtering by backend proxy)

The existing project implementation follows this pattern correctly. Continue using the `/zoho-customer-proxy` backend that:
- Verifies session cookies
- Adds OAuth tokens server-side
- Filters responses by contactId

---

## Sources

### Primary (HIGH confidence)

- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Ticket.json` - Official OAS spec for Ticket endpoints
- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Article.json` - Official OAS spec for Article endpoints
- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Thread.json` - Official OAS spec for Thread endpoints
- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Common.json` - OAuth scopes definition
- `functions/zoho-customer-auth.ts` - Existing project implementation
- `functions/lib/zoho-session.ts` - Session management implementation
- `classic/src/components/ZohoTickets/zohoApi.ts` - Frontend API client

### Secondary (MEDIUM confidence)

- `.planning/research/zoho-desk-portal-auth-SUMMARY.md` - Previous portal auth research
- `.planning/research/zoho-desk-portal-auth-ARCHITECTURE.md` - Authentication architecture

---

*Research completed: 2026-03-16*
*Ready for roadmap: Yes - confirms current implementation is correct*
