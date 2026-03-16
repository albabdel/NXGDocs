# Architecture Patterns: Zoho Desk Portal Authentication

**Domain:** Zoho Desk Customer Portal Authentication
**Researched:** 2026-03-16
**Confidence:** MEDIUM

---

## Recommended Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              AUTHENTICATION ARCHITECTURE                              │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐            │
│  │   AGENT APP     │        │  PORTAL APP     │        │  CUSTOMER APP   │            │
│  │   (Staff UI)    │        │  (Help Center)  │        │  (Embedded)     │            │
│  └────────┬────────┘        └────────┬────────┘        └────────┬────────┘            │
│           │                          │                          │                      │
│           │ OAuth2                   │ JWT SSO                  │ JWT SSO              │
│           │ (Authorization Code)     │ (Session)                │ (Session)            │
│           ▼                          ▼                          ▼                      │
│  ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐            │
│  │  Zoho Accounts  │        │  Auth0/IdP      │        │  Your Auth      │            │
│  │  (accounts.zoho)│        │  (or SAML IdP)  │        │  Service        │            │
│  └────────┬────────┘        └────────┬────────┘        └────────┬────────┘            │
│           │                          │                          │                      │
│           │ Token                     │ JWT Token                │ JWT Token           │
│           ▼                          ▼                          ▼                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                            ZOHO DESK API                                         │ │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────────────┐ │ │
│  │  │     DESK API (Agent)        │    │        PORTAL API (End User)             │ │ │
│  │  │  /api/v1/tickets            │    │  /portal/api/tickets                    │ │ │
│  │  │  /api/v1/contacts           │    │  /portal/api/kb/articles                │ │ │
│  │  │  /api/v1/agents             │    │  /portal/api/community/topics           │ │ │
│  │  │  Full CRUD + Admin access   │    │  Scoped to authenticated contact        │ │ │
│  │  └─────────────────────────────┘    └─────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│           │                                      │                                   │
│           ▼                                      ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              ZOHO DESK DATA                                      │ │
│  │  Tickets | Contacts | Accounts | Knowledge Base | Community                     │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### Component 1: Agent Authentication Service

| Responsibility | Communicates With |
|---------------|-------------------|
| Authenticate support staff | Zoho Accounts IAM |
| Generate OAuth tokens | Desk API |
| Refresh expired tokens | Token storage |
| Scope management | User session |

**Authentication Pattern:**

```typescript
// Agent OAuth Flow
const authUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
  `response_type=code&` +
  `client_id=${CLIENT_ID}&` +
  `scope=Desk.tickets.READ,Desk.contacts.READ&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `access_type=offline`;

// After user authorizes, exchange code for tokens
const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=authorization_code&code=${AUTH_CODE}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`
});

// Use access token for API calls
const tickets = await fetch('https://desk.zoho.com/api/v1/tickets', {
  headers: { 'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}` }
});
```

### Component 2: Portal User Authentication Service

| Responsibility | Communicates With |
|---------------|-------------------|
| Authenticate end-users | Auth0/IdP |
| Generate JWT tokens | Portal API |
| Map to Zoho Contacts | Contact service |
| Session management | Browser session |

**Authentication Pattern (JWT SSO):**

```typescript
// JWT SSO Flow
// 1. User clicks "Login" on portal
// 2. Redirect to Auth0 (or custom IdP)
const loginUrl = `https://your-auth-domain/auth/login?` +
  `redirect_uri=${PORTAL_URL}/auth/callback`;

// 3. IdP authenticates user and generates JWT
const jwt = await auth0Client.getToken();

// 4. JWT sent to Zoho Desk for validation
const portalSession = await fetch('https://your-portal.zohodesk.com/portal/api/sso/jwt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: jwt })
});

// 5. Portal session established
// 6. User can now access portal API with session cookie
```

### Component 3: Data Scope Enforcer

| Responsibility | Communicates With |
|---------------|-------------------|
| Filter tickets by contact | Portal API |
| Validate account ticket access | Contact mapping |
| Enforce read-only for KB | Knowledge Base |
| Community moderation check | Community API |

---

## Data Flow

### Agent Ticket Creation Flow

```
┌──────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│  Agent   │───▶│ OAuth Token  │───▶│  Desk API  │───▶│   Ticket     │
│  Client  │    │  (Bearer)    │    │  /tickets  │    │   Created    │
└──────────┘    └──────────────┘    └────────────┘    └──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │ Scope Check: │
              │Desk.tickets. │
              │   CREATE     │
              └──────────────┘
```

### Portal User Ticket Submission Flow

```
┌──────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│ Portal   │───▶│   Session    │───▶│ Portal API │───▶│   Ticket     │
│  User    │    │   Cookie     │    │  /tickets  │    │   Created    │
└──────────┘    └──────────────┘    └────────────┘    └──────────────┘
                      │                    │
                      ▼                    ▼
              ┌──────────────┐     ┌──────────────┐
              │ Contact ID   │     │ Auto-scope:  │
              │ from Session │     │ contactId =  │
              └──────────────┘     │ session.user │
                                   └──────────────┘
```

---

## Patterns to Follow

### Pattern 1: Server-Side Token Storage for Agents

**What:** Store OAuth tokens server-side, never expose to client
**When:** Building agent applications with Desk API access
**Why:** Prevents token exposure via XSS, allows secure refresh

```typescript
// Backend token manager
class AgentTokenManager {
  private tokenStore: Map<string, TokenPair> = new Map();
  
  async getAccessToken(userId: string): Promise<string> {
    const tokens = this.tokenStore.get(userId);
    if (!tokens) throw new Error('User not authenticated');
    
    if (this.isExpired(tokens)) {
      return await this.refreshTokens(userId);
    }
    
    return tokens.access_token;
  }
  
  private async refreshTokens(userId: string): Promise<string> {
    const tokens = this.tokenStore.get(userId);
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      body: `grant_type=refresh_token&refresh_token=${tokens.refresh_token}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });
    
    const newTokens = await response.json();
    this.tokenStore.set(userId, newTokens);
    return newTokens.access_token;
  }
}
```

### Pattern 2: JWT SSO with Contact Mapping

**What:** Use email claim in JWT to map to existing Zoho Contact
**When:** Integrating Auth0 or custom IdP with Zoho Desk portal
**Why:** Ensures existing contact records are reused, ticket history preserved

```typescript
// JWT validation and contact mapping
async function handleJwtSso(jwt: string): Promise<PortalSession> {
  // 1. Validate JWT signature
  const payload = await verifyJwt(jwt, SHARED_SECRET);
  
  // 2. Extract email claim
  const email = payload.email;
  if (!email) throw new Error('Email claim required');
  
  // 3. Find or create contact in Zoho Desk
  const contact = await findOrCreateContact(email, {
    firstName: payload.firstName,
    lastName: payload.lastName
  });
  
  // 4. Ensure contact is portal user
  if (!contact.isEndUser) {
    await inviteContactAsEndUser(contact.id);
  }
  
  // 5. Create portal session
  return createPortalSession(contact.id);
}
```

### Pattern 3: Account Ticket Visibility Control

**What:** Use `isAccountTicketsViewable` flag to control ticket scope
**When:** Portal users should see company tickets, not just personal
**Why:** B2B portals often need company-wide ticket visibility

```typescript
// When inviting contact to portal, set account visibility
async function inviteWithAccountAccess(contactId: string, accountId: string) {
  // Primary mapping with account ticket visibility
  await updateContactMapping(contactId, accountId, {
    mappingType: 'PRIMARY',
    isAccountTicketsViewable: true  // User sees all account tickets
  });
}

// OR limit to own tickets only
async function inviteWithLimitedAccess(contactId: string, accountId: string) {
  await updateContactMapping(contactId, accountId, {
    mappingType: 'SECONDARY',
    isAccountTicketsViewable: false  // User sees only their own tickets
  });
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using Agent OAuth for Portal Users

**What:** Generating agent OAuth tokens and using them in portal frontend
**Why bad:** 
- Agents have org-wide access - security risk
- Tokens can access admin endpoints
- No automatic contact scoping
**Instead:** Use JWT SSO with portal session, or native portal login

### Anti-Pattern 2: Client-Side Token Storage

**What:** Storing access tokens in localStorage or sessionStorage
**Why bad:** XSS vulnerability can steal tokens
**Instead:** Use HttpOnly cookies for session, or server-side token proxy

### Anti-Pattern 3: Skipping Contact Lookup

**What:** Creating new contact for every JWT SSO login without checking
**Why bad:** 
- Duplicate contacts created
- Ticket history scattered across multiple contacts
- Data quality issues
**Instead:** Always lookup by email first, create only if not found

### Anti-Pattern 4: Using Desk API for Portal Features

**What:** Building custom portal using full Desk API
**Why bad:**
- Requires agent credentials (security risk)
- Must implement own scoping logic
- More maintenance overhead
**Instead:** Use Portal API with built-in scoping, or embed Zoho Help Center

---

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 100K users |
|---------|--------------|--------------|---------------|
| Token storage | In-memory OK | Redis cache | Distributed cache + DB |
| JWT validation | Synchronous | Synchronous | Consider caching validated tokens |
| Contact lookup | Single query | Indexed query | Cache contact mappings |
| Session storage | In-memory | Redis | Redis cluster |

---

## Security Checklist

- [ ] Agent OAuth tokens stored server-side only
- [ ] JWT SSO uses strong shared secret (256-bit minimum)
- [ ] JWT expiration time < 1 hour
- [ ] Portal session cookies are HttpOnly, Secure, SameSite
- [ ] Contact email validation before JWT mapping
- [ ] Account ticket visibility explicitly configured
- [ ] Rate limiting on authentication endpoints
- [ ] Audit logging for all authentication events
- [ ] Refresh token rotation enabled for agent OAuth

---

## Sources

- OAS specifications (Common.json, Contact.json) - HIGH confidence
- Zoho CRM OAuth documentation - HIGH confidence
- Zoho Desk API documentation link verified - MEDIUM confidence
- JWT SSO pattern from Zoho developer resources - MEDIUM confidence

---

*Architecture research for: Zoho Desk Portal Authentication*
*Researched: 2026-03-16*
