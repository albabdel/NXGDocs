# Feature Research: Multi-Product Documentation Platform

**Domain:** Multi-product documentation platforms (Docusaurus + Sanity)
**Researched:** 2026-04-01
**Confidence:** MEDIUM-HIGH (patterns derived from official docs, existing project research, competitor analysis)

---

## Executive Summary

Multi-product documentation platforms typically handle product separation through one of three architectural patterns: **domain-based** (docs.producta.com, docs.productb.com), **path-based** (docs.company.com/producta, docs.company.com/productb), or **workspace-based** (shared content with product-scoped visibility). For the NXGEN use case with Docusaurus + Sanity on Cloudflare Pages, the recommended approach is **path-based with domain routing** — a single Docusaurus build with product prefixes, Cloudflare Workers handling domain-to-path mapping, and Sanity content tagged with a `product` field for filtering.

Authentication-based content visibility is a **differentiator**, not table stakes. Most multi-product docs platforms (GitBook, ReadMe, Confluence) handle product separation at the workspace level with separate sites per product. Auth-gated content within a shared site is a premium feature (GitBook Ultimate, Notion Enterprise). The key insight is that **domain-based product context is orthogonal to auth-based content visibility** — they solve different problems.

---

## Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Product-specific URLs** | Users expect docs URL to match product identity | LOW | docs.gcxone.com vs docs.gcsurge.com OR docs.nxgen.cloud/gcxone vs docs.nxgen.cloud/gcsurge |
| **Product-specific branding** | Each product has distinct identity (logo, colors) | MEDIUM | Docusaurus theming per product or CSS variables driven by product context |
| **Product-specific navigation** | Sidebar shows only relevant docs | LOW | Content filtered by product field |
| **Product-specific search results** | Search returns only relevant content | LOW | Index scoped to current product |
| **Cross-product link handling** | Links between products work correctly | MEDIUM | Internal vs cross-product link detection |
| **Consistent auth across products** | Login works across all products (SSO) | LOW | Same Auth0 tenant, same session |

### Implementation Notes for Table Stakes

**Product-specific URLs:**

Three viable approaches, ranked by complexity:

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Path-based single build** (`/gcxone/`, `/gcsurge/`) | Single deployment, shared infrastructure, simpler CI/CD | Longer URLs unless using Cloudflare Workers rewrite | ✅ RECOMMENDED |
| **Domain-based multi-build** (separate Docusaurus per product) | Clean URLs, complete isolation | 2x build time, 2x deployments, duplicated infrastructure | Alternative if products diverge significantly |
| **Cloudflare Workers domain routing** (docs.gcxone.com → /gcxone/) | Clean URLs + single build | Additional edge layer, Workers cost | Optional enhancement on path-based |

**Path-based single build pattern:**
```typescript
// docusaurus.config.ts
export default {
  url: 'https://docs.nxgen.cloud',
  baseUrl: '/gcxone/', // Dynamically set via env var
  // ...
}
```

**Cloudflare Workers domain routing:**
```javascript
// workers/docs-router.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Map domains to paths
    const productMap = {
      'docs.gcxone.com': '/gcxone',
      'docs.gcsurge.com': '/gcsurge',
      'docs.nxgen.cloud': '' // Default, no prefix
    };
    
    const productPrefix = productMap[hostname] || '';
    const newPath = productPrefix + url.pathname;
    
    // Rewrite to origin
    url.pathname = newPath;
    return fetch(new Request(url, request));
  }
}
```

**Product-specific navigation:**

```groq
// GROQ query filtered by product
*[_type == "doc" && product == $product] {
  title, slug, category
}
```

**Cross-product link handling:**

```typescript
// Link component that detects cross-product links
function ProductLink({ href, children }) {
  const { currentProduct } = useProductContext();
  const targetProduct = getProductFromPath(href);
  
  if (targetProduct && targetProduct !== currentProduct) {
    // Cross-product link - use full URL
    return <a href={`https://docs.${targetProduct}.nxgen.cloud${href}`}>{children}</a>;
  }
  // Same-product link - use Docusaurus Link
  return <Link to={href}>{children}</Link>;
}
```

---

## Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Auth-gated content per product** | Control who sees what within a product's docs | HIGH | Requires auth + content model + visibility logic |
| **Product access control** | Users only see products they're entitled to | HIGH | Auth0 Organizations or app_metadata |
| **Role-based content visibility** | Admins see different content than operators | MEDIUM | Depends on auth metadata |
| **Analytics per product** | Track which products get more engagement | MEDIUM | Separate tracking per product context |
| **Shared content with overrides** | Common docs with product-specific additions | HIGH | Content inheritance pattern |
| **Product switcher UI** | Easy navigation between products for multi-product users | LOW | Dropdown or tabs in header |

### Implementation Notes for Differentiators

**Auth-gated content per product:**

This is a **premium feature** in most platforms:
- GitBook: Requires Ultimate plan for authenticated access
- Notion: Enterprise feature
- Confluence: Built-in but complex permission model

**Recommended architecture for NXGEN:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Content Visibility Layers                      │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: Product Context                                         │
│   - Domain/URL determines current product                         │
│   - Content filtered by `product` field                           │
│   - No auth required for public content                           │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: Auth State                                               │
│   - User logged in? Check via Auth0 session                       │
│   - User's product access in app_metadata.products[]              │
│   - Show/hide products user can access                            │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: Content Visibility                                       │
│   - Content has visibility field: public | authenticated | role   │
│   - Public: visible to all                                        │
│   - Authenticated: visible if logged in                           │
│   - Role: visible if user has matching role                       │
└─────────────────────────────────────────────────────────────────┘
```

**Sanity content model additions:**

```typescript
// studio/schemaTypes/doc.ts
export default defineType({
  name: 'doc',
  fields: [
    // ... existing fields
    defineField({
      name: 'product',
      type: 'string',
      options: {
        list: [
          { title: 'GCXONE', value: 'gcxone' },
          { title: 'GCSurge', value: 'gcsurge' },
          { title: 'Shared', value: 'shared' }, // Visible across all products
        ],
      },
    }),
    defineField({
      name: 'visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Authenticated Users', value: 'authenticated' },
          { title: 'Admins Only', value: 'admin' },
          { title: 'Operators', value: 'operator' },
        ],
      },
      initialValue: 'public',
    }),
  ],
});
```

**Auth0 app_metadata structure:**

```json
{
  "app_metadata": {
    "products": ["gcxone", "gcsurge"],
    "role": "admin",
    "org_id": "acme-corp"
  }
}
```

**Content visibility logic:**

```typescript
// hooks/useContentVisibility.ts
export function useContentVisibility(content: ContentItem): boolean {
  const { isAuthenticated, user } = useAuth0();
  
  // Public content always visible
  if (content.visibility === 'public') return true;
  
  // Auth-required content needs login
  if (!isAuthenticated) return false;
  
  // Authenticated visibility
  if (content.visibility === 'authenticated') return true;
  
  // Role-based visibility
  const userRole = user?.['https://docs.nxgen.cloud/role'];
  if (content.visibility === userRole) return true;
  
  return false;
}
```

**Product access control:**

```typescript
// hooks/useProductAccess.ts
export function useProductAccess(productId: string): boolean {
  const { isAuthenticated, user } = useAuth0();
  
  // Public products don't require auth
  if (isProductPublic(productId)) return true;
  
  // Check user's product access
  if (!isAuthenticated) return false;
  
  const userProducts = user?.['https://docs.nxgen.cloud/products'] || [];
  return userProducts.includes(productId);
}
```

**Analytics per product:**

Two approaches, depending on analytics provider:

**Option A: Plausible Analytics (Simple, Privacy-Focused)**

```html
<!-- Per-product tracking via data-domain -->
<script 
  defer 
  data-domain="docs.gcxone.com" 
  src="https://plausible.io/js/script.js"
></script>
```

Create separate Plausible "sites" for each product domain. Plausible's consolidated views can aggregate across products.

**Option B: PostHog Analytics (Feature-Rich)**

```typescript
// PostHog with product context
posthog.init('api_key', {
  api_host: 'https://app.posthog.com',
});

// Identify product in all events
posthog.register({
  product: 'gcxone',
  product_version: '1.2.0',
});

// Track page views with product context
posthog.capture('$pageview', {
  product: 'gcxone',
  doc_section: 'getting-started',
});
```

**Product switcher UI:**

```tsx
// components/ProductSwitcher.tsx
export function ProductSwitcher() {
  const { currentProduct } = useProductContext();
  const { user } = useAuth0();
  
  const availableProducts = user?.['https://docs.nxgen.cloud/products'] || 
    ['gcxone', 'gcsurge'];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProductIcon product={currentProduct} />
        {currentProduct.toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableProducts.map(product => (
          <DropdownMenuItem 
            key={product}
            onClick={() => navigateToProduct(product)}
          >
            <ProductIcon product={product} />
            {product.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Separate Sanity datasets per product** | Clean data isolation | Enterprise-only feature, loses shared content capability | Single dataset with product field |
| **Separate Docusaurus builds per product** | Complete separation | 2x build time, 2x deployment complexity, duplicated code | Single build with path prefixes |
| **Runtime content filtering** | Dynamic, real-time | Breaks static site model, slower, SEO issues | Build-time filtering with product field |
| **Document-level permissions** | Fine-grained control | Complex to manage, poor UX for editors | Role-based visibility tiers |
| **Auth gating all content** | Maximum security | Breaks discovery, hurts SEO, friction for users | Gate only sensitive content |
| **Real-time content sync across products** | Consistency | Fragile, race conditions, operational burden | Shared content pattern with overrides |

### Anti-Feature Details

**Separate Sanity datasets per product:**

Why it's problematic:
- Requires Sanity Enterprise plan (cross-dataset references are paid)
- Shared content (release notes, company info) becomes duplicated
- Editors must switch datasets to manage content
- GROQ queries become more complex with cross-dataset syntax

Better approach: Single dataset with `product` field:

```groq
// Single dataset, filter by product
*[_type == "doc" && (product == $product || product == "shared")]

// Cross-dataset reference (Enterprise only)
// Much more complex and expensive
```

**Runtime content filtering:**

Why it's problematic:
- Docusaurus is a static site generator — client-side filtering breaks SEO
- Search engines index all content regardless of user permissions
- Slower page loads (wait for JS to filter content)
- Hydration mismatches cause flicker

Better approach: Build-time filtering with multiple builds or product paths:

```bash
# Build for GCXONE product
PRODUCT=gcxone npm run build

# Or single build with path prefixes
npm run build
# Outputs: /gcxone/docs/, /gcsurge/docs/
```

**Auth gating all content:**

Why it's problematic:
- Users can't discover product before logging in
- Search engines can't index content
- High bounce rate (60%+ drop off at login wall)
- Creates friction for legitimate users

Better approach: Gate only sensitive content:

```
Public: Product overview, getting started, public APIs
Authenticated: Advanced configuration, admin guides
Role-based: Internal docs, partner docs
```

---

## Feature Dependencies

```
Product-Specific URLs
    └──requires──> Product field on all content schemas
                        └──requires──> Sanity schema migration

Auth-Gated Content
    └──requires──> Auth0 integration (already exists)
    └──requires──> Content visibility field
    └──requires──> Product access in app_metadata

Analytics Per Product
    └──requires──> Product context in tracking calls
    └──requires──> Separate Plausible sites OR PostHog project

Product Switcher
    └──requires──> Product context (URL/domain detection)
    └──enhances──> Auth-gated product access
```

### Dependency Notes

- **Product-Specific URLs require Product field:** Without a `product` field on content, there's no way to filter content by product at build time or runtime.

- **Auth-Gated Content requires visibility field:** The content model must support visibility levels. Without this, auth can only gate entire products, not individual documents.

- **Analytics Per Product requires product context:** Tracking calls must include product information. This is trivial once product context exists in the app.

- **Product Switcher enhances Auth-gated access:** Once users have product access in their metadata, the switcher provides a natural UI for navigating between products they can access.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the multi-product concept.

- [ ] **Product field on all content schemas** — Add `product` string field to doc, article, release, roadmapItem schemas; existing content migrated to 'gcxone' default
- [ ] **Path-based product routing** — Single Docusaurus build with `/gcxone/` and `/gcsurge/` path prefixes
- [ ] **Content filtering by product** — GROQ queries filter by product; build generates product-specific JSON files
- [ ] **Product context detection** — URL path or domain determines current product; React context provides product value
- [ ] **Cross-product navigation** — Links between products work correctly; product switcher in header

### Add After Validation (v1.x)

Features to add once core multi-product is working.

- [ ] **Domain-based routing via Cloudflare Workers** — Clean URLs (docs.gcxone.com) mapped to path prefixes
- [ ] **Product-specific theming** — Logo, colors, branding per product via CSS variables
- [ ] **Product access control** — app_metadata.products[] controls which products user can access
- [ ] **Content visibility tiers** — public/authenticated/role-based visibility on documents
- [ ] **Analytics per product** — Separate tracking with product context in all events

### Future Consideration (v2+)

Features to defer until multi-product is validated and stable.

- [ ] **Shared content with overrides** — Content inheritance pattern for docs common across products
- [ ] **Product-specific search indexes** — Separate Algolia/Meilisearch indexes per product
- [ ] **Multi-product admin dashboard** — Unified view across all products in Sanity Studio
- [ ] **Product-specific release schedules** — Independent release cadences per product

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Product field on schemas | HIGH | LOW | P1 |
| Path-based product routing | HIGH | LOW | P1 |
| Content filtering by product | HIGH | MEDIUM | P1 |
| Product context detection | HIGH | LOW | P1 |
| Cross-product navigation | MEDIUM | LOW | P1 |
| Domain-based routing | MEDIUM | MEDIUM | P2 |
| Product-specific theming | MEDIUM | MEDIUM | P2 |
| Product access control | HIGH | HIGH | P2 |
| Content visibility tiers | HIGH | HIGH | P2 |
| Analytics per product | MEDIUM | LOW | P2 |
| Shared content with overrides | LOW | HIGH | P3 |
| Product-specific search indexes | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | GitBook | ReadMe | Confluence | Docusaurus + Sanity |
|---------|---------|--------|------------|---------------------|
| Multi-product support | Spaces (separate sites) | Projects | Spaces | Path prefixes + product field |
| Domain per product | ✅ Custom domain per space | ✅ Custom domain | ✅ Subdomain per space | ✅ Via Cloudflare Workers |
| Auth-gated content | ✅ Ultimate plan | ✅ All plans | ✅ Built-in | ✅ Auth0 + visibility field |
| Shared content | ✅ Cross-space references | ❌ | ✅ Space imports | ⚠️ Single dataset + shared field |
| Analytics per product | ✅ Insights per space | ✅ Analytics per project | ✅ Space analytics | ✅ Plausible/PostHog per product |
| Product switcher | ✅ Collection switcher | ✅ Project dropdown | ✅ Space selector | ⚠️ Custom component needed |
| Role-based visibility | ✅ Team permissions | ✅ Role-based access | ✅ Space permissions | ✅ Auth0 metadata + visibility |

**Key insight:** GitBook and ReadMe use **separate sites per product** (Spaces/Projects) as their multi-tenancy model. This is simpler to implement but creates infrastructure duplication. Docusaurus + Sanity can achieve similar UX with **path prefixes and a single deployment**, which is more efficient but requires more custom code.

---

## Sources

### Primary (HIGH confidence)
- Docusaurus Deployment Documentation: https://docusaurus.io/docs/deployment
- Docusaurus i18n Documentation: https://docusaurus.io/docs/i18n/introduction (multi-path pattern)
- Sanity Cross-Dataset References: https://www.sanity.io/docs/cross-dataset-references (Enterprise-only)
- GitBook Authenticated Access: https://docs.gitbook.com/publishing-documentation/authenticated-access
- Cloudflare Service Tokens: https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/
- Auth0 Organizations: https://auth0.com/docs/manage-users/organizations

### Secondary (MEDIUM confidence)
- Plausible Analytics Documentation: https://plausible.io/docs
- PostHog Product Analytics: https://posthog.com/docs/product-analytics
- Existing project research: `.planning/research/auth0-upgrade-FEATURES.md`
- Existing project research: `.planning/research/analytics-dashboard.md`

### Project Context (HIGH confidence)
- `.planning/PROJECT.md` — Existing Docusaurus + Sanity + Cloudflare Pages architecture
- `.planning/research/SUMMARY.md` — Build-time content pipeline patterns
- Existing Auth0 integration at nxgen.eu.auth0.com

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Table stakes features | HIGH | Clear patterns from Docusaurus docs and competitor analysis |
| Domain/path routing | HIGH | Well-documented Cloudflare Workers pattern |
| Content model design | HIGH | Sanity schemas are straightforward; product field is simple |
| Auth integration | HIGH | Existing Auth0 research covers patterns needed |
| Analytics per product | MEDIUM | Plausible/PostHog patterns clear, but integration details need validation |
| Content visibility tiers | MEDIUM | Requires careful design; existing research covers auth patterns |
| Shared content pattern | LOW | Complex; needs deeper research if prioritized |

**Overall confidence: MEDIUM-HIGH**

Key gaps requiring validation:
- Build-time filtering with multiple product outputs (needs build script testing)
- Cloudflare Workers domain routing performance
- Shared content inheritance pattern if prioritized

---

*Feature research for: Multi-product documentation platform*
*Researched: 2026-04-01*
