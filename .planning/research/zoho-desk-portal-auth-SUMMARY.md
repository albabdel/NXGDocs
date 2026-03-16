# Research Summary: Zoho Desk Portal Authentication

**Domain:** Zoho Desk Customer Portal Authentication for End Users
**Researched:** 2026-03-16
**Confidence:** MEDIUM (Official OAS specs verified, some documentation URLs inaccessible)

## Executive Summary

Zoho Desk uses a dual authentication model: **Agent OAuth** for staff/agents via Zoho Accounts IAM, and **Portal User authentication** for end-users (customers) accessing the help center portal. The two systems are fundamentally different in scope, token management, and API access patterns.

**Agent OAuth** uses Zoho's unified IAM OAuth2 flow with granular scopes (`Desk.tickets.READ`, `Desk.contacts.CREATE`, etc.) and is intended for backend integrations, staff applications, and agent workflows. Agents authenticate through `accounts.zoho.com` (or regional equivalents like `accounts.zoho.eu`) and receive access tokens valid for 1 hour with refresh tokens for long-term access.

**Portal User authentication** is designed for customers accessing the help center. Portal users are stored as Contacts in Zoho Desk with an `isEndUser: true` flag. They can authenticate through:
1. **Native Zoho signup/login** - Email-based registration in the help center
2. **JWT SSO** - Third-party identity provider integration
3. **SAML SSO** - Enterprise SSO integration
4. **Auth0/Okta integration** - Via JWT or SAML federation

The key architectural difference: **Agents use OAuth2 with API scopes**, **Portal users use session-based or JWT authentication scoped to their own data only**. Portal users cannot access the full Desk API - they use the Help Center Portal API which automatically scopes queries to their contact ID.

## Key Findings

### Stack: Authentication Methods by User Type

| User Type | Auth Method | Token Source | API Access | Data Scope |
|-----------|-------------|--------------|------------|------------|
| Agent | OAuth2 (Authorization Code) | `accounts.zoho.com` | Full Desk API | Organization-wide (scoped by permissions) |
| Portal User (native) | Email/Password | Help Center login | Portal API only | Own tickets + account tickets (if allowed) |
| Portal User (JWT SSO) | JWT token | Third-party IdP | Portal API only | Own tickets + account tickets (if allowed) |
| Portal User (SAML) | SAML assertion | Enterprise IdP | Portal API only | Own tickets + account tickets (if allowed) |

### Architecture: Authentication Flows

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AGENT AUTHENTICATION                              │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Agent redirects to accounts.zoho.com/oauth/v2/auth                   │
│  2. User logs in and grants permissions                                  │
│  3. Redirect back with authorization code                                │
│  4. Exchange code for access_token + refresh_token at /oauth/v2/token   │
│  5. Use access_token in Authorization: Zoho-oauthtoken <token>           │
│  6. Token valid for 1 hour; refresh_token for long-term access           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    PORTAL USER AUTHENTICATION (JWT SSO)                  │
├─────────────────────────────────────────────────────────────────────────┤
│  1. User visits help center portal                                       │
│  2. Portal redirects to third-party IdP (Auth0, Okta, custom)            │
│  3. User authenticates with IdP                                          │
│  4. IdP generates JWT with user claims (email, name, etc.)               │
│  5. JWT sent to Zoho Desk portal endpoint for validation                 │
│  6. Zoho creates/maps portal session to Contact record                   │
│  7. Portal session established; user can access own tickets              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Critical Differences: Agent vs Portal OAuth

| Aspect | Agent OAuth | Portal User Auth |
|--------|-------------|------------------|
| **Base URL** | `desk.zoho.{com/eu/in/au/jp}/api/v1/` | `{portal-domain}/portal/api/` |
| **Token Type** | Bearer token (OAuth2) | Session cookie or JWT |
| **Scope Control** | Explicit OAuth scopes (e.g., `Desk.tickets.READ`) | Implicit - only own data |
| **User Type** | `AGENT` | `END_USER` |
| **API Access** | All modules (tickets, contacts, agents, settings) | Tickets (own), Knowledge Base, Community |
| **Permission Model** | Role + Profile based | Contact-based (self only) |

## Implications for Roadmap

### Phase 1: Define Authentication Strategy

**Rationale:** Before implementing any portal integration, the authentication strategy must be defined. The choice between native portal login, JWT SSO, or Auth0 integration determines the entire implementation approach.

**Decision points:**
- If using existing Zoho portal login → No custom auth needed
- If integrating with Auth0 → JWT SSO required
- If enterprise customers need SSO → SAML federation required

**Features addressed:** Customer portal access, ticket submission, knowledge base access

### Phase 2: Implement JWT SSO (if Auth0 integration)

**Rationale:** JWT SSO is Zoho's recommended approach for third-party identity provider integration. Auth0 would act as the identity provider, generating JWTs that Zoho Desk validates.

**Implementation steps:**
1. Configure JWT SSO in Zoho Desk admin settings
2. Set up shared secret/key between Auth0 and Zoho Desk
3. Configure Auth0 to generate JWTs with required claims
4. Implement redirect flow from portal to Auth0
5. Handle JWT validation and session establishment

### Phase 3: Configure Portal User Scoping

**Rationale:** Portal users must only see their own tickets. This is enforced by Zoho Desk's portal API automatically - no additional scoping logic needed if using the portal API correctly.

**Key consideration:** The `isAccountTicketsViewable` flag in Contact mapping determines if a portal user can see all tickets for their associated Account (company), not just their own tickets.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Agent OAuth structure | HIGH | Verified in OAS Common.json - explicit scopes defined |
| Portal user as Contact | HIGH | Verified in Contact.json - `isEndUser` field, `inviteAsEndUser` endpoints |
| JWT SSO existence | MEDIUM | Referenced in Zoho documentation but specific docs URLs were inaccessible |
| Portal API endpoints | MEDIUM | Inferred from OAS structure and Zoho developer portal links |
| Auth0 integration pattern | LOW | Standard JWT SSO pattern assumed; specific Zoho-Auth0 docs not found |

## Gaps to Address

- **JWT SSO specific endpoint URLs** - Could not access full Zoho Desk API documentation (response too large)
- **JWT claim structure required by Zoho Desk** - Needs specific documentation
- **Token validation endpoint** - Specific endpoint for JWT validation not found
- **Auth0 specific integration guide** - Zoho-Auth0 integration documentation not directly accessible

## Sources

### Primary (HIGH confidence - Official Zoho sources)

- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Common.json` - OAuth2 scopes definition
- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/Contact.json` - Contact schema with `isEndUser`, `inviteAsEndUser` endpoints
- `https://raw.githubusercontent.com/zoho/zohodesk-oas/master/v1.0/CommunityUser.json` - Community user types (END_USER, AGENT)
- `https://www.zoho.com/crm/developer/docs/api/v8/oauth-overview.html` - Zoho OAuth2 fundamentals

### Secondary (MEDIUM confidence - Inferred from structure)

- `https://desk.zoho.com/DeskAPIDocument` - Zoho Desk API documentation (verified exists but too large to fetch)
- `https://github.com/zoho/react-native-zohodesk-portal-sdk` - Portal SDK structure indicates portal authentication patterns
- `https://www.zoho.com/developer/rest-api.html` - Developer API overview with Desk link

---

*Research completed: 2026-03-16*
*Ready for roadmap: yes, with gaps noted*
