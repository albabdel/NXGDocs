# Technology Stack: Zoho Desk Portal Authentication

**Domain:** Zoho Desk Customer Portal Authentication
**Researched:** 2026-03-16
**Confidence:** MEDIUM (OAS specs verified, some docs inaccessible)

---

## Authentication Stack by User Type

### Agent Authentication (Staff/Support Reps)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zoho Accounts OAuth2 | v2.0 | Unified authentication for all Zoho products | Required for any Desk API access by agents |
| OAuth2 Authorization Code Flow | RFC 6749 | Secure delegated access | Industry standard; supports refresh tokens |
| OAuth Scopes | Zoho-defined | Granular permissions | e.g., `Desk.tickets.READ`, `Desk.contacts.CREATE` |
| Access Token | Bearer type | API authentication | Valid for 1 hour |
| Refresh Token | Long-lived | Token renewal | Unlimited lifetime until revoked |

**OAuth2 Flow Endpoints:**

```
Authorization: https://accounts.zoho.com/oauth/v2/auth
Token: https://accounts.zoho.com/oauth/v2/token
Revoke: https://accounts.zoho.com/oauth/v2/token/revoke
```

**Regional Endpoints:**

| Region | Accounts URL |
|--------|-------------|
| US | `accounts.zoho.com` |
| EU | `accounts.zoho.eu` |
| IN | `accounts.zoho.in` |
| AU | `accounts.zoho.com.au` |
| JP | `accounts.zoho.jp` |
| CN | `accounts.zoho.com.cn` |

### Portal User Authentication (Customers/End-Users)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zoho Help Center Portal | Built-in | Customer-facing portal | Pre-built UI for ticket submission, KB, community |
| JWT SSO | Custom | Third-party IdP integration | Required for Auth0, Okta, custom identity providers |
| SAML 2.0 | Standard | Enterprise SSO | For enterprise customers with existing IdP |
| Session-based Auth | Built-in | Portal login sessions | Maintains user state across portal pages |

---

## OAuth Scopes (Agent Authentication)

From `Common.json` securitySchemes:

### Core Ticket Operations

| Scope | Description |
|-------|-------------|
| `Desk.tickets.CREATE` | Create tickets and sub-resources |
| `Desk.tickets.READ` | Read tickets and sub-resources |
| `Desk.tickets.UPDATE` | Update tickets and sub-resources |
| `Desk.tickets.DELETE` | Delete tickets and sub-resources |

### Contact Management

| Scope | Description |
|-------|-------------|
| `Desk.contacts.CREATE` | Create contacts and sub-resources |
| `Desk.contacts.READ` | Read contacts and sub-resources |
| `Desk.contacts.UPDATE` | Update contacts and sub-resources |
| `Desk.contacts.DELETE` | Delete contacts and sub-resources |

### Knowledge Base

| Scope | Description |
|-------|-------------|
| `Desk.articles.CREATE` | Create articles and sub-resources |
| `Desk.articles.READ` | Read articles and sub-resources |
| `Desk.articles.UPDATE` | Update articles and sub-resources |
| `Desk.articles.DELETE` | Delete articles and sub-resources |

### Community

| Scope | Description |
|-------|-------------|
| `Desk.community.CREATE` | Create community topics, comments, categories |
| `Desk.community.READ` | Read community topics, comments, categories |
| `Desk.community.UPDATE` | Update community topics, comments, categories |
| `Desk.community.DELETE` | Delete community topics, comments, categories |

### Settings

| Scope | Description |
|-------|-------------|
| `Desk.settings.CREATE` | Create settings data (customizations, automations, etc.) |
| `Desk.settings.READ` | Read settings data |
| `Desk.settings.UPDATE` | Update settings data |
| `Desk.settings.DELETE` | Delete settings data |

### Basic Operations

| Scope | Description |
|-------|-------------|
| `Desk.basic.CREATE` | Create organizations, agents, departments, roles, profiles, groups |
| `Desk.basic.READ` | Read organizations, agents, departments, roles, profiles, groups |
| `Desk.basic.UPDATE` | Update organizations, agents, departments, roles, profiles, groups |
| `Desk.basic.DELETE` | Delete organizations, agents, departments, roles, profiles, groups |

---

## API Endpoints by User Type

### Agent API Endpoints (Full Desk API)

**Base URL:** `https://desk.zoho.{region}/api/v1/`

| Endpoint | Method | Purpose | Scope Required |
|----------|--------|---------|----------------|
| `/tickets` | GET, POST | List/Create tickets | `Desk.tickets.READ/CREATE` |
| `/tickets/{ticketId}` | GET, PATCH, DELETE | Ticket CRUD | `Desk.tickets.*` |
| `/contacts` | GET, POST | List/Create contacts | `Desk.contacts.READ/CREATE` |
| `/contacts/{contactId}` | GET, PATCH | Contact CRUD | `Desk.contacts.*` |
| `/contacts/{contactId}/inviteAsEndUser` | POST | Invite contact to portal | `Desk.contacts.UPDATE` |
| `/contacts/{contactId}/helpCenters` | GET | Get portal activation status | `Desk.contacts.READ` |
| `/agents` | GET, POST | List/Create agents | `Desk.basic.READ/CREATE` |
| `/departments` | GET, POST | List/Create departments | `Desk.basic.READ/CREATE` |
| `/articles` | GET, POST | List/Create KB articles | `Desk.articles.READ/CREATE` |
| `/communityTopics` | GET, POST | Community topics | `Desk.community.READ/CREATE` |

### Portal API Endpoints (End-User Access)

**Base URL:** `https://{portal-domain}/portal/api/`

| Endpoint | Method | Purpose | User Scope |
|----------|--------|---------|------------|
| `/tickets` | GET, POST | List/Create own tickets | Own tickets only |
| `/tickets/{ticketId}` | GET, PATCH | View/Update own ticket | Own ticket only |
| `/kb/articles` | GET | View KB articles | Public + restricted |
| `/community/topics` | GET, POST | View/Create topics | Own content only |
| `/user/profile` | GET, PATCH | View/Update own profile | Self only |

**Key Difference:** Portal API automatically filters by the authenticated portal user's contact ID. No explicit scope parameter needed.

---

## Contact Schema for Portal Users

From `Contact.json`:

```json
{
  "id": "string (int64)",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "mobile": "string",
  "accountId": "string (int64)",
  "isEndUser": "boolean",
  "isAnonymous": "boolean",
  "isSpam": "boolean",
  "photoURL": "string",
  "webUrl": "string",
  "createdTime": "timestamp",
  "type": "string (custom field)",
  "mappingInfo": {
    "mappingId": "string",
    "mappingType": "PRIMARY | SECONDARY",
    "isAccountTicketsViewable": "boolean"
  }
}
```

**Critical Fields:**

| Field | Purpose | Portal Implication |
|-------|---------|-------------------|
| `isEndUser` | True if portal user | Determines portal access |
| `mappingInfo.isAccountTicketsViewable` | Account ticket visibility | If true, user sees all account tickets, not just own |

---

## JWT SSO Configuration

### Required JWT Claims

| Claim | Type | Required | Description |
|-------|------|----------|-------------|
| `sub` | string | Yes | Unique user identifier |
| `email` | string | Yes | User email address |
| `firstName` | string | No | User first name |
| `lastName` | string | No | User last name |
| `iat` | timestamp | Yes | Issued at time |
| `exp` | timestamp | Yes | Expiration time |
| `aud` | string | No | Audience (Zoho Desk org ID) |
| `iss` | string | No | Issuer (your IdP identifier) |

### JWT SSO Flow

```
1. Generate JWT with claims (shared secret key)
2. POST to Zoho Desk JWT validation endpoint
3. Zoho validates signature, creates/maps Contact
4. Portal session established
```

---

## Installation / Setup

### Agent OAuth Setup

1. Go to Zoho API Console: `https://api-console.zoho.com/`
2. Create a new client (Server-based or Mobile/Desktop)
3. Note `client_id` and `client_secret`
4. Configure redirect URI
5. Request authorization with required scopes

### JWT SSO Setup

1. Go to Zoho Desk Admin → Help Center → Settings → Portal Login
2. Enable "JWT Single Sign-On"
3. Generate or paste shared secret key
4. Configure IdP endpoint URL
5. Map user attributes
6. Test authentication flow

### Portal User Invitation (via API)

```http
POST /api/v1/contacts/{contactId}/inviteAsEndUser
Authorization: Zoho-oauthtoken {access_token}
orgId: {org_id}
Content-Type: application/json

{
  "helpCenterId": "{help_center_id}"
}
```

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Agent OAuth for portal users | Agents get org-wide access; security risk | JWT SSO or native portal login |
| Full Desk API from portal frontend | Exposes admin endpoints | Portal API with session auth |
| Storing access tokens in browser localStorage | XSS vulnerability risk | HttpOnly cookies or session storage |
| Hardcoded client secrets | Credential exposure | Environment variables, secrets manager |

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|------------------------|
| JWT SSO | Native portal login | If no external IdP needed; simpler setup |
| JWT SSO | SAML SSO | If enterprise customers already use SAML IdP |
| Zoho Portal API | Custom portal with full Desk API | If you need complete control over UX and can secure credentials server-side |

---

## Sources

- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Common.json` - OAuth scopes (HIGH confidence)
- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Contact.json` - Contact schema (HIGH confidence)
- `https://www.zoho.com/crm/developer/docs/api/v8/oauth-overview.html` - OAuth fundamentals (HIGH confidence)
- `https://github.com/zoho/zohodesk-oas` - OAS repository structure (HIGH confidence)
- `https://desk.zoho.com/DeskAPIDocument` - Desk API docs (exists, too large to fetch)

---

*Stack research for: Zoho Desk Portal Authentication*
*Researched: 2026-03-16*
