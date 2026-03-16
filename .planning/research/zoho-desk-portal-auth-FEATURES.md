# Feature Landscape: Zoho Desk Portal Authentication

**Domain:** Zoho Desk Customer Portal Authentication
**Researched:** 2026-03-16
**Confidence:** MEDIUM

---

## Table Stakes

Features users expect from a customer portal. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Email/password login | Standard authentication | Low | Built-in to Zoho Help Center |
| Password reset | Self-service recovery | Low | Built-in with email verification |
| "Remember me" option | Session persistence | Low | Cookie-based session |
| Single ticket view | View submitted tickets | Medium | Portal API provides this |
| Ticket submission | Core portal function | Medium | Portal API endpoint |
| Knowledge base access | Self-service support | Low | Public KB articles |
| Profile editing | Update own information | Low | Portal API endpoint |
| Logout | Security expectation | Low | Session destruction |

---

## Differentiators

Features that set apart portal authentication implementations.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **JWT SSO Integration** | Seamless login from your app | High | Requires IdP setup |
| **Auth0/Okta Integration** | Enterprise-grade identity | High | Via JWT or SAML |
| **Account-wide ticket visibility** | B2B portal pattern | Medium | `isAccountTicketsViewable` flag |
| **Custom portal branding** | White-label experience | Medium | Zoho Help Center customization |
| **Multi-department access** | Enterprise customers | Medium | Multiple help center mapping |
| **SSO across products** | Unified experience | High | Shared JWT across Zoho products |
| **Real-time chat** | Live support option | Medium | Zoho SalesIQ integration |
| **Community forums access** | Peer support | Low | Built-in with portal |

---

## Anti-Features

Features to explicitly NOT build or enable.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Agent OAuth in portal frontend | Security catastrophe | Use JWT SSO or native portal |
| Full Desk API access for portal users | Data breach risk | Use Portal API only |
| Storing tokens in localStorage | XSS vulnerability | HttpOnly cookies or server proxy |
| Creating new contacts per login | Data fragmentation | Email lookup before create |
| Hardcoded credentials | Credential exposure | Environment variables, secrets |
| Skipping account association | Wrong ticket visibility | Always associate Contact with Account |
| JWT without expiration | Token theft risk | Set `exp` claim < 1 hour |

---

## Feature Dependencies

```
Portal User Authentication
├── Contact Management
│   ├── Contact exists in Zoho Desk
│   ├── isEndUser = true
│   └── Contact associated with Account
├── Help Center Configuration
│   ├── Portal enabled
│   ├── Departments accessible
│   └── KB articles published
└── JWT SSO (if used)
    ├── Shared secret configured
    ├── IdP endpoint accessible
    └── JWT claims map to Contact fields

JWT SSO Integration
├── IdP Setup (Auth0/Okta)
│   ├── Application created
│   ├── JWT signing key generated
│   └── Callback URL configured
├── Zoho Desk Configuration
│   ├── JWT SSO enabled
│   ├── Shared secret stored
│   └── Attribute mapping defined
└── User Flow
    ├── Login redirect to IdP
    ├── JWT generation
    ├── JWT validation
    └── Session creation
```

---

## Authentication Methods Comparison

| Method | Use Case | Complexity | Maintenance |
|--------|----------|------------|-------------|
| **Native Portal Login** | Simple B2C portal | Low | Low |
| **JWT SSO** | Custom IdP, Auth0 | High | Medium |
| **SAML SSO** | Enterprise customers | High | High |
| **Hybrid** | Multiple customer types | Very High | High |

---

## MVP Recommendation

### If Building Custom Portal with Auth0:

**Prioritize:**
1. JWT SSO implementation (core authentication)
2. Contact lookup/create flow (prevent duplicates)
3. Ticket submission via Portal API
4. Ticket listing (own tickets only)

**Defer:**
- Account-wide ticket visibility (configure per customer)
- Community forums (add after core features stable)
- Real-time chat (separate integration)
- Multi-department access (enterprise feature)

### If Using Native Zoho Help Center:

**Prioritize:**
1. Enable portal in Zoho Desk admin
2. Configure help center branding
3. Set up ticket submission forms
4. Publish knowledge base articles

**Defer:**
- JWT SSO (only if SSO needed)
- Custom portal domain (requires DNS setup)
- Advanced branding (CSS customization)

---

## Zoho-Specific Feature Notes

### Portal Invitation Flow

1. Contact must exist in Zoho Desk
2. Call `/contacts/{contactId}/inviteAsEndUser` API
3. Contact receives email invitation
4. Contact sets password and activates portal access
5. `isEndUser` flag set to true

### JWT SSO Flow (Recommended for Auth0)

1. Configure JWT SSO in Zoho Desk Help Center settings
2. Generate shared secret (or use RSA key)
3. Configure Auth0 to sign JWTs with same secret
4. Set JWT claims: `email`, `firstName`, `lastName`, `exp`
5. User authenticates with Auth0
6. Auth0 generates JWT
7. JWT sent to Zoho Desk validation endpoint
8. Zoho creates session, maps to Contact

### Account Ticket Visibility

- **B2C Portal:** `isAccountTicketsViewable: false` (user sees only their tickets)
- **B2B Portal:** `isAccountTicketsViewable: true` (user sees all company tickets)

Configure via Contact mapping API or in Zoho Desk admin UI.

---

## API Endpoints for Portal Users

| Endpoint | Method | Purpose | Scope |
|----------|--------|---------|-------|
| `/portal/api/tickets` | GET | List own tickets | Auto-filtered by contact |
| `/portal/api/tickets` | POST | Create ticket | Auto-associated with contact |
| `/portal/api/tickets/{id}` | GET | View own ticket | Own ticket only |
| `/portal/api/tickets/{id}/reply` | POST | Reply to ticket | Own ticket only |
| `/portal/api/user` | GET | Get own profile | Self only |
| `/portal/api/user` | PATCH | Update own profile | Self only |
| `/portal/api/kb/articles` | GET | List KB articles | Public + restricted |
| `/portal/api/kb/articles/{id}` | GET | View KB article | Per article permissions |
| `/portal/api/community/topics` | GET | List topics | Public |
| `/portal/api/community/topics` | POST | Create topic | Own content |
| `/portal/api/sso/jwt` | POST | JWT validation | SSO flow |

---

## Sources

- OAS specifications for API endpoints - HIGH confidence
- Zoho Desk API documentation link verified - MEDIUM confidence
- JWT SSO patterns from Zoho developer resources - MEDIUM confidence

---

*Features research for: Zoho Desk Portal Authentication*
*Researched: 2026-03-16*
