# Auth0 Tenant User Analysis for NXGEN Documentation

**Researched:** 2026-04-01
**Domain:** Auth0 user base, tenant configuration, and product ecosystem
**Confidence:** HIGH (based on extensive codebase documentation and planning files)

---

## Executive Summary

The NXGEN ecosystem consists of two main products (GCXONE and GC Surge) with a shared documentation platform. **Users authenticated in the main product (gcx.nxgen.cloud) are the same users who should access the documentation site (docs.gcxone.com)** via SSO. The Auth0 tenant `nxgen.eu.auth0.com` serves as the unified identity provider across all NXGEN applications.

### ⚠️ Critical Finding: "Genesis" is NOT a User Population

**The term "Genesis" found in the codebase refers to a DEVICE INTEGRATION FEATURE, not a user type or Auth0 population.**

| Reference | Meaning | Location |
|-----------|---------|----------|
| `genesisAudio` | Audio streaming support for device integrations | `studio/schemaTypes/deviceIntegration.ts` |
| `genesisPorts` | Port configuration (Genesis Adpro Receiver, HPP Streaming) | `scripts/integration-matrix.json` |

**Evidence from codebase:**
```json
// scripts/integration-matrix.json - Device integration data
{
  "genesisAudio": "Supported",
  "genesisPorts": "Genesis Adpro Receiver: IP Address: (specific to tenant) Port 10000"
}
```

**Conclusion:** When the user mentioned "Genesis" in relation to Auth0 users, this was a confusion. Genesis is a technical feature for audio streaming and port configuration in the GCXONE platform — it has **NO connection to Auth0 users or authentication**.

---

## Primary Finding

**Users in Auth0 ARE considered users in the product.** The documentation site is designed to share authentication with the main product via SSO, meaning a user logged into gcx.nxgen.cloud is automatically authenticated for docs.gcxone.com.

---

## GCXONE Product Overview

### What is GCXONE?

GCXONE is NXGEN's primary SaaS product - a video surveillance/physical security platform. Based on the documentation content and templates:

| Aspect | Details |
|--------|---------|
| **Product Type** | Cloud-based video management system (VMS) |
| **Main Domain** | `gcx.nxgen.cloud` |
| **Docs Domain** | `docs.gcxone.com` (planned) |
| **Key Features** | Device management, video streaming, event handling, API access |
| **Supported Devices** | Hikvision, Dahua, Axis, Hanwha, Uniview, EagleEye, Ganz, Senstar |
| **APIs** | REST API at `api.nxgen.cloud` |

### Product Ecosystem

```
┌─────────────────────────────────────────────────────────────────┐
│                     NXGEN ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  GCXONE         │    │  GC SURGE       │                     │
│  │  (Primary)      │    │  (Secondary)    │                     │
│  │                 │    │                 │                     │
│  │ gcx.nxgen.cloud │    │ [TBD]           │                     │
│  │ docs.gcxone.com │    │ docs.gcsurge.com│                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  SHARED INFRASTRUCTURE                       ││
│  │                                                              ││
│  │  Auth0 Tenant: nxgen.eu.auth0.com                           ││
│  │  API Gateway:  api.nxgen.cloud                               ││
│  │  Media:        media.nxgen.cloud                             ││
│  │  Streaming:    stream.nxgen.cloud                            ││
│  │  NTP Server:   time1.nxgen.cloud                             ││
│  │  Status:       status.nxgen.cloud                            ││
│  │  N8N:          n8n.nxgen.cloud                               ││
│  │  Support:      support.nxgen.cloud (Zoho Desk)              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## User Overlap Analysis

### Are Auth0 Users the Same as Product Users?

**YES.** The architecture is designed for unified identity:

| Aspect | Evidence |
|--------|----------|
| **Same Auth0 Tenant** | `nxgen.eu.auth0.com` serves all NXGEN apps |
| **SSO Design** | Explicitly mentioned: "Users authenticated at gcx.nxgen.cloud are automatically authenticated at docs.nxgen.cloud" |
| **No `prompt: 'login'`** | SUPPORT-CONTEXT.md explicitly forbids adding prompt parameter to preserve SSO |
| **Custom Claims** | Auth0 Actions add `product_access` claims for multi-product authorization |

### Authentication Flow

```
User visits gcx.nxgen.cloud (main product)
    │
    ▼
Auth0 Login (nxgen.eu.auth0.com)
    │  - User authenticates
    │  - JWT issued with claims:
    │    - email, name, picture
    │    - https://nxgen.cloud/claims/product_access: ["gcxone"]
    │    - https://nxgen.cloud/claims/roles: ["admin", "operator"]
    ▼
User logged into product
    │
    ├──────────────────────────────────────┐
    │                                      │
    ▼                                      ▼
User visits docs.gcxone.com        User visits support.nxgen.cloud
    │                                      │
    ▼                                      ▼
Auth0 SSO Cookie Check            Auth0 SSO Cookie Check
    │                                      │
    ▼                                      ▼
✓ Already authenticated           ✓ Already authenticated
No re-login required              No re-login required
```

### User Types in the Ecosystem

| User Type | Product Access | Docs Access | Auth Source |
|-----------|---------------|-------------|-------------|
| **GCXONE Customer** | gcx.nxgen.cloud | docs.gcxone.com | Auth0 SSO |
| **GC Surge Customer** | [TBD] | docs.gcsurge.com | Auth0 SSO |
| **Multi-Product Customer** | Both products | Both docs sites | Auth0 SSO |
| **Public Visitor** | None | Public docs only | Anonymous |
| **NXGEN Staff** | All products | All docs + admin | Auth0 SSO + admin role |

---

## SSO Configuration Details

### Current SSO Setup

From SUPPORT-CONTEXT.md and planning documents:

```typescript
// Auth0 Provider Configuration (docs site)
<Auth0Provider
  domain="nxgen.eu.auth0.com"
  clientId="jqiJJISVmCmWWB46m0wMI7CO91KyliIm"
  authorizationParams={{
    redirect_uri: `${window.location.origin}/auth/callback`,
    scope: 'openid profile email'
    // NO prompt: 'login' - preserves SSO
  }}
  useRefreshTokens={true}
  cacheLocation="memory"
>
```

### Key SSO Rules (from SUPPORT-CONTEXT.md)

> **Do not add `prompt: 'login'` to the Auth0 URL.** This breaks SSO — users already logged into other NXGEN apps (e.g., gcx.nxgen.cloud) on the same Auth0 tenant should be automatically signed in without re-entering credentials.

### Custom Claims for Product Access

From Auth0 Action (planned):

```javascript
// Post-login Action
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://nxgen.cloud/claims';
  const productAccess = event.user.app_metadata?.productAccess || ['gcxone'];
  
  api.idToken.setCustomClaim(`${namespace}/product_access`, productAccess);
  api.idToken.setCustomClaim(`${namespace}/roles`, event.user.app_metadata?.roles || []);
};
```

---

## Product-to-Docs Integration

### Current State

| Feature | Status | Notes |
|---------|--------|-------|
| **Shared Auth** | ✅ Planned | Phase 35 - Auth Foundation |
| **SSO Between Product & Docs** | ✅ Designed | Same Auth0 tenant |
| **Product Access Claims** | ✅ Planned | JWT includes product_access |
| **Content Gating by Product** | ✅ Planned | Phase 35-36 |
| **User-Specific Content** | 🔄 Future | v5.1+ requirement |

### Planned Integration Features

Per REQUIREMENTS.md (AUTH-01 through AUTH-05):

1. **AUTH-01**: Auth0 authentication with `product_access` custom claim
2. **AUTH-02**: Users only access content for products they're entitled to
3. **AUTH-03**: Session includes `productAccess` array for runtime checks
4. **AUTH-04**: Content visibility tiers (public, authenticated, role-based)
5. **AUTH-05**: Cloudflare Functions validate product access before serving protected content

### User Journey (Planned)

```
1. User logs into gcx.nxgen.cloud (main product)
   └─ Auth0 JWT issued with product_access: ["gcxone"]

2. User navigates to docs.gcxone.com
   └─ SSO recognizes existing session
   └─ No additional login required

3. User sees docs content
   └─ Public content: visible to all
   └─ Authenticated content: visible because logged in
   └─ GCXONE-specific content: visible because product_access includes "gcxone"
   └─ GC Surge content: NOT visible (product_access doesn't include "gcsurge")

4. User navigates to docs.gcsurge.com
   └─ SSO recognizes session
   └─ But: product_access = ["gcxone"] only
   └─ Result: Sees only shared/public content, no GC Surge-specific content
```

---

## Recommendation: Unified Authentication

### Verdict: USE UNIFIED AUTH

The architecture is explicitly designed for unified authentication across product and docs. The user question "Are users in Auth0 really considered as users in my product?" has a clear answer:

**YES - They are the same users.**

### Why Unified Auth is Correct

| Factor | Analysis |
|--------|----------|
| **SSO is already designed** | Architecture explicitly preserves SSO between gcx.nxgen.cloud and docs sites |
| **Same Auth0 tenant** | All NXGEN apps share `nxgen.eu.auth0.com` |
| **Product access in JWT** | Custom claims enable per-product content control |
| **Single user experience** | Users expect one login for entire ecosystem |
| **Analytics alignment** | PostHog can track user journey across product → docs |

### Implementation Requirements

To complete the unified auth vision:

1. **Phase 35**: Implement Auth0 custom claims for product_access
2. **Phase 36**: Add product field to all Sanity content
3. **Runtime checks**: Implement content visibility checks based on product_access
4. **Cloudflare Functions**: Validate product access for protected content

### What This Means for Users

| Scenario | Expected Behavior |
|----------|-------------------|
| GCXONE customer visits docs | Auto-authenticated via SSO, sees GCXONE content |
| GC Surge customer visits docs | Auto-authenticated via SSO, sees GC Surge content |
| Multi-product customer | Sees content for all entitled products |
| Anonymous visitor | Sees public content only |
| User without product access | Sees shared/public content only |

---

## Key Technical Details

### Auth0 Configuration

| Setting | Value | Source |
|---------|-------|--------|
| **Tenant Domain** | `nxgen.eu.auth0.com` | SUPPORT-CONTEXT.md |
| **Client ID (docs)** | `jqiJJISVmCmWWB46m0wMI7CO91KyliIm` | SUPPORT-CONTEXT.md |
| **Scope** | `openid profile email` | Phase 30 plans |
| **Token Type** | ID Token (implicit flow) | Existing implementation |
| **Session Storage** | HttpOnly cookies + memory | Security best practice |

### Product Configuration

| Product | ID | Domain | Docs Domain | Theme Color |
|---------|-----|--------|-------------|-------------|
| GCXONE | `gcxone` | gcx.nxgen.cloud | docs.gcxone.com | Gold (#C89446) |
| GC Surge | `gcsurge` | [TBD] | docs.gcsurge.com | Blue (different theme) |

### Content Access Model

```typescript
// Content visibility levels
type Visibility = 'public' | 'authenticated' | 'role-based';

// Access check function
function canViewContent(
  content: { product: string; visibility: Visibility },
  user: { productAccess: string[]; roles: string[] } | null
): boolean {
  // Public content: always visible
  if (content.visibility === 'public') return true;
  
  // Authenticated content: requires login
  if (content.visibility === 'authenticated') {
    return user !== null;
  }
  
  // Role-based: requires specific role for product
  if (content.visibility === 'role-based') {
    if (!user) return false;
    const hasProductAccess = user.productAccess.includes(content.product);
    const hasRole = user.roles.some(r => 
      r === 'admin' || r === `editor-${content.product}`
    );
    return hasProductAccess && hasRole;
  }
  
  return false;
}
```

---

## Open Questions

### Resolved

| Question | Answer |
|----------|--------|
| Are Auth0 users the same as product users? | **YES** - Shared Auth0 tenant with SSO |
| Should docs share auth with product? | **YES** - Explicitly designed this way |
| Do users need separate logins? | **NO** - SSO provides seamless experience |

### Still To Be Implemented

| Question | Status | Phase |
|----------|--------|-------|
| How is product_access populated? | Planned | Phase 35 |
| How to handle user without product access? | Planned | Phase 35 |
| Should support portal use same auth? | Already implemented | Phase 30 |

---

## Sources

### Primary (HIGH confidence)
- `SUPPORT-CONTEXT.md` - Authentication architecture and SSO rules
- `.planning/REQUIREMENTS.md` - v5.0 multi-product requirements (AUTH-01 to AUTH-05)
- `.planning/ROADMAP.md` - Phase planning and milestones
- `.planning/phases/30-auth-foundation/30-01-PLAN.md` - Auth0 integration details
- `.planning/research/ARCHITECTURE.md` - Multi-product architecture patterns

### Secondary (MEDIUM confidence)
- `.planning/research/auth0-upgrade-FEATURES.md` - Auth0 capabilities
- `.planning/research/multi-product-FEATURES.md` - Multi-product patterns
- `Keys.md` - Infrastructure and domain information

---

## Metadata

**Confidence breakdown:**
- Product ecosystem: HIGH - Clear documentation in ROADMAP and plans
- User overlap: HIGH - Explicit SSO design in SUPPORT-CONTEXT.md
- SSO architecture: HIGH - Documented in multiple planning files
- Implementation status: HIGH - Requirements traceable to phases

**Research date:** 2026-04-01
**Valid until:** Architecture changes or Phase 35 completion

---

## Appendix: Current Auth0 User Base Details

### Who Can Currently Authenticate via Auth0?

The Auth0 tenant `nxgen.eu.auth0.com` currently serves:

| Application | Client ID | Current Users | Auth Flow |
|-------------|-----------|---------------|-----------|
| **Support Portal** | `jqiJJISVmCmWWB46m0wMI7CO91KyliIm` | Zoho Desk contacts only | Auth0 → Zoho lookup |
| **GCXONE Product** | (separate app) | All GCXONE customers | Direct Auth0 |
| **Admin Portal** | (not using Auth0 yet) | NXGEN staff | Zoho OAuth (migration planned) |

### Support Portal Auth Flow (Current)

```
┌─────────────────────────────────────────────────────────────────┐
│          CURRENT SUPPORT PORTAL AUTHENTICATION                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User clicks "Sign in with Auth0"                              │
│       │                                                          │
│       ▼                                                          │
│   Auth0 Universal Login (nxgen.eu.auth0.com)                    │
│       │  response_type=id_token                                  │
│       │  scope=openid email profile                              │
│       ▼                                                          │
│   /auth/callback page                                            │
│       │  id_token in URL hash                                    │
│       │                                                          │
│       ▼                                                          │
│   POST /zoho-customer-auth                                       │
│       │  { action: 'auth0-exchange', idToken }                   │
│       │                                                          │
│       ▼                                                          │
│   ┌─────────────────────────────────────────────┐               │
│   │  Server-side Processing:                     │               │
│   │  1. Verify Auth0 JWT signature (RS256)       │               │
│   │  2. Extract email from claims                │               │
│   │  3. Look up Zoho Desk contact by email       │               │
│   │  4. If found: Create session                 │               │
│   │  5. If not found: Return 404 error           │               │
│   └─────────────────────────────────────────────┘               │
│       │                                                          │
│       ▼                                                          │
│   RESULT: Only users with Zoho Desk contacts                    │
│           can access the support portal                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Code Location:** `functions/zoho-customer-auth.ts:443-448`
```typescript
const contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);

if (!contact) {
  return json({
    error: `No support account found for ${email}. Please contact NXGEN support.`,
  }, 404);
}
```

### User Population Overlap

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER POPULATION OVERLAP                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────┐                                        │
│   │  GCXONE Product     │◄─── Largest population                │
│   │     Users           │     All customers of the product      │
│   │  (gcx.nxgen.cloud)  │                                      │
│   └──────────┬──────────┘                                        │
│              │                                                    │
│              │  Subset (those who contacted support)             │
│              ▼                                                    │
│   ┌─────────────────────┐                                        │
│   │  Zoho Desk          │◄─── Current Auth0 users for docs      │
│   │    Contacts         │     (support portal only)             │
│   │  (support portal)   │                                      │
│   └──────────┬──────────┘                                        │
│              │                                                    │
│              │  May overlap                                       │
│              ▼                                                    │
│   ┌─────────────────────┐                                        │
│   │  NXGEN Staff        │◄─── Internal employees                 │
│   │  (Development Team) │     Currently use Zoho OAuth          │
│   │                     │     Migration to Auth0 planned        │
│   └─────────────────────┘                                        │
│                                                                  │
│   IMPORTANT: These are SEPARATE populations with overlap        │
│   - Not all GCXONE users are in Zoho Desk                       │
│   - Not all Zoho contacts are GCXONE product users              │
│   - NXGEN staff may exist in multiple systems                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Recommendation: Auth0 Architecture for Docs

### Strategy: Same Tenant, Separate Applications

**Recommendation:** Use the same Auth0 tenant (`nxgen.eu.auth0.com`) for SSO benefits, but create a **separate Auth0 application** for the documentation site.

```
┌─────────────────────────────────────────────────────────────────┐
│                  RECOMMENDED AUTH0 ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Auth0 Tenant: nxgen.eu.auth0.com                               │
│   │                                                              │
│   ├── Application: GCXONE Product                                │
│   │   └── Users: Product customers (existing)                    │
│   │                                                              │
│   ├── Application: Docs Portal (NEW - to be created)             │
│   │   └── Client ID: (new)                                       │
│   │   └── Redirect: docs.gcxone.com/auth/callback                │
│   │   └── Users: Same as GCXONE (SSO)                            │
│   │   └── NO Zoho contact lookup required                        │
│   │                                                              │
│   └── Application: Support Portal (existing)                     │
│       └── Client ID: jqiJJISVmCmWWB46m0wMI7CO91KyliIm            │
│       └── Users: Zoho Desk contacts only                         │
│       └── REQUIRES Zoho contact lookup                           │
│                                                                  │
│   BENEFITS:                                                      │
│   ✓ SSO works across all apps (same tenant)                      │
│   ✓ User logged into GCXONE → auto-logged into docs              │
│   ✓ Separate apps = separate redirect URIs, scopes               │
│   ✓ Docs doesn't need Zoho contact requirement                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why Same Tenant?

| Benefit | Explanation |
|---------|-------------|
| **SSO** | Users authenticated at gcx.nxgen.cloud are automatically authenticated at docs.gcxone.com |
| **Unified Identity** | Same user across all NXGEN products |
| **No Account Duplication** | User doesn't need separate accounts per product |
| **Existing Infrastructure** | Tenant already exists and is working |

### Why Separate Application?

| Reason | Explanation |
|--------|-------------|
| **Different Redirect URIs** | Docs needs `docs.gcxone.com/auth/callback`, not support's callback |
| **Different Scopes** | Docs needs custom claims for preferences/bookmarks |
| **Different Token Claims** | Docs-specific vs support-specific claims |
| **No Zoho Requirement** | Docs doesn't need Zoho contact validation |

### Key Difference: Docs vs Support Portal

| Aspect | Docs Portal | Support Portal |
|--------|-------------|----------------|
| **Requires Zoho Contact** | NO | YES |
| **User Population** | All GCXONE users | Zoho Desk contacts only |
| **Session Validation** | Auth0 JWT only | Auth0 + Zoho lookup |
| **Features** | Bookmarks, history, preferences | Ticket viewing |

---

## Answers to Research Questions

### 1. Who are the Auth0 users currently?

**Current Auth0 users include:**
- GCXONE product users (via GCXONE Auth0 app)
- Support portal users (must have Zoho Desk contact)
- Future: Admin users (migration planned)

### 2. What is "Genesis"?

**Genesis is a device integration feature** (audio streaming and port configuration). It is NOT a user population. The references to `genesisAudio` and `genesisPorts` in the codebase are about technical capabilities of device integrations, not about users.

### 3. Should the docs site use the same Auth0 tenant?

**YES** - For SSO benefits. Users authenticated in the main product should be automatically authenticated in the docs site.

### 4. Should docs use the same Auth0 application as the support portal?

**NO** - Create a separate Auth0 application for docs:
- Same tenant (for SSO)
- Different client ID
- Different redirect URIs
- No Zoho contact requirement

### 5. Are Auth0 users relevant to the docs product?

**YES** - Auth0 users (GCXONE product users) are the primary audience for the docs. They should be able to:
- View public documentation (no login required)
- Log in via SSO (no additional credentials)
- Save bookmarks and reading history
- See personalized content based on their product access
