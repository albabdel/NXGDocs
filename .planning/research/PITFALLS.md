# Pitfalls Research: Multi-Product Architecture

**Domain:** Adding multi-product/multi-tenancy to existing Docusaurus + Sanity documentation platform
**Researched:** 2026-04-01
**Confidence:** HIGH (based on existing architecture analysis, auth system inspection, and platform capabilities research)

> **CRITICAL:** This document focuses exclusively on pitfalls when ADDING multi-product support to an existing single-product system. The existing v1.0+v1.1 system works well — the risks are in the transformation, not in the current architecture.

---

## Critical Pitfalls

### Pitfall 1: Content Leakage Between Products (CRITICAL SECURITY RISK)

**What goes wrong:**
A user authenticates for Product A but can access documentation intended for Product B. This can happen through:
- URL guessing (`/docs/product-b/secret-feature` accessible to Product A users)
- Search results showing content from all products
- Sidebar navigation exposing document structure of other products
- API endpoints returning unfiltered Sanity data
- Generated JSON files bundling content from all products without access checks

**Why it happens:**
The existing single-product architecture has no access boundaries. The GROQ queries fetch all documents of a type. The static build includes all content. The search index covers the entire site. When adding multi-product, developers often add a `product` field to schemas but forget to:
1. Add the filter to every GROQ query
2. Restrict the search plugin to product-scoped content
3. Protect the JSON endpoints at the function level
4. Verify access before rendering deep-linked pages

**How to avoid:**

**Layer 1 - Sanity Schema Level:**
```javascript
// EVERY document type must have a product field
defineType({
  name: 'doc',
  fields: [
    { name: 'product', type: 'string', options: {
      list: [
        { title: 'GCXONE', value: 'gcxone' },
        { title: 'Product B', value: 'product-b' }
      ]
    }},
    // ... other fields
  ],
  // Validation: product is required
  validation: Rule => Rule.required()
})
```

**Layer 2 - GROQ Query Level:**
```javascript
// NEVER query without product filter
// WRONG:
*[_type == "doc"]

// CORRECT:
*[_type == "doc" && product == $product]

// ALWAYS parameterize from session/auth context
const product = await getProductFromSession(request);
const docs = await client.fetch(groqQuery, { product });
```

**Layer 3 - Build Level:**
```javascript
// Generate SEPARATE JSON files per product
// sanity-gcxone-docs.generated.json
// sanity-product-b-docs.generated.json

// OR: Generate one file with product filtering at runtime
// But verify the filter is applied BEFORE any content reaches the page
```

**Layer 4 - Search Level:**
```javascript
// docusaurus-search-local must be configured per-product
// Option A: Separate search indexes per product subdomain
// Option B: Runtime filter on search results (less secure, prone to timing attacks)
```

**Layer 5 - Cloudflare Function Level:**
```javascript
// EVERY function must verify product access
export const onRequest = async (context) => {
  const session = await verifySession(context.request);
  const allowedProduct = session.productAccess; // ['gcxone'] or ['product-b'] or both
  
  const requestedProduct = new URL(context.request.url).pathname.split('/')[2];
  
  if (!allowedProduct.includes(requestedProduct)) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... proceed
}
```

**Warning signs:**
- GROQ queries without `product == $product` filter anywhere in codebase
- Single `sanity-docs.generated.json` file containing all products
- Search results showing documents the user shouldn't see
- Direct URL access to `/docs/product-b/...` works without auth check
- Cloudflare Functions reading from request path without product validation

**Phase to address:** Phase 1 (Auth Foundation) - Access boundaries must be defined BEFORE any multi-product content is added

---

### Pitfall 2: Dual Auth Systems Not Unified for Multi-Product Access

**What goes wrong:**
The existing system has TWO separate auth systems:
1. **Admin auth** — Zoho OAuth → admin session (sessionStorage + HttpOnly cookie)
2. **Customer auth** — Auth0 → Zoho session (HttpOnly cookie only)

When adding multi-product:
- Admin auth has no concept of "product access" — it's org-wide
- Customer auth ties to Zoho contact which may have different product entitlements
- Neither system tracks which products a user can access
- A user might authenticate via Auth0 for the docs site but their Zoho contact lacks the product entitlement field

**Why it happens:**
The auth systems were built for single-product access (GCXONE only). The Zoho contact record has no `productEntitlements` field. The Auth0 user metadata has no `productAccess` array. The session cookies store contact info but not product permissions.

**How to avoid:**

**Option A - Extend Auth0 with product claims (RECOMMENDED):**
```javascript
// Auth0 Action: Post-login
exports.onExecutePostLogin = async (event, api) => {
  // Fetch product entitlements from source of truth (Zoho, Supabase, etc.)
  const entitlements = await fetchProductEntitlements(event.user.email);
  
  // Add to ID token claims
  api.idToken.setCustomClaim('https://docs.nxgen.cloud/product_access', entitlements);
  
  // Add to app_metadata for server-side access
  api.user.setAppMetadata('product_access', entitlements);
};

// Cloudflare Function: Verify product access
const claims = await verifyAuth0Token(request);
const allowedProducts = claims['https://docs.nxgen.cloud/product_access'] || [];
```

**Option B - Extend Zoho session with product field:**
```javascript
// When creating session, fetch product entitlements
const contact = await getZohoContact(email);
const productAccess = contact.cf_product_entitlements?.split(',') || ['gcxone'];

const session = {
  contactId: contact.id,
  displayName: contact.first_name,
  productAccess, // NEW FIELD
  exp: Date.now() + 24 * 60 * 60 * 1000
};
```

**Option C - Migrate admin auth to Auth0 first:**
This is recommended in the existing auth research. Unifying on Auth0 before adding multi-product eliminates the dual-system complexity.

**Warning signs:**
- Session objects have no `productAccess` or `product_access` field
- Auth0 ID token lacks product-related claims
- Cloudflare Functions check `isAuthenticated` but not product-specific access
- Admin session grants access to all products implicitly (acceptable for admins)
- Customer session grants access to all products implicitly (UNACCEPTABLE)

**Phase to address:** Phase 1 (Auth Foundation) - Product access must be in session before content boundaries matter

---

### Pitfall 3: Static Build Leaks All Content to All Users

**What goes wrong:**
The current architecture is a static site generator. At build time, `fetch-sanity-content.js` fetches ALL documents and writes them to JSON files. The Docusaurus build compiles ALL pages. Every user receives the same static HTML bundle.

If Product B has sensitive documentation:
- Its content exists in `sanity-docs.generated.json` (visible in page source)
- Its pages exist in the static HTML (visible to search engines, archived)
- Its content is in the JavaScript bundle (downloadable by anyone)

**Why it happens:**
Static sites are inherently public. The build doesn't know who the user is. All content is pre-rendered. This is fundamental to SSG architecture.

**How to avoid:**

**Pattern A - Product-specific builds (for strongly isolated products):**
```
docs-gcxone.nxgen.cloud → Build with GROQ filter: product == 'gcxone'
docs-productb.nxgen.cloud → Build with GROQ filter: product == 'product-b'
```

Each subdomain is a separate Cloudflare Pages project with its own build command:
```bash
# Project: docs-gcxone
PRODUCT_FILTER=gcxone npm run build

# Project: docs-productb
PRODUCT_FILTER=product-b npm run build
```

**Pattern B - Runtime filtering with ISR/SSR (for shared infrastructure):**
Move from pure SSG to Incremental Static Regeneration or Server-Side Rendering:
- Public content: Pre-rendered static HTML
- Product-specific content: Rendered on-demand with access check
- Requires Docusaurus + server runtime (Cloudflare Workers, not Pages Functions)

**Pattern C - Hybrid approach (RECOMMENDED for this project):**
```
Public content (releases, roadmap, general docs): Static build, no secrets
Product-specific docs: Protected by auth, loaded via API after login
```

The sensitive documentation pages:
1. Show login prompt if not authenticated
2. Fetch content via Cloudflare Function that validates product access
3. Content never exists in static HTML

**Warning signs:**
- `sanity-docs.generated.json` contains Product B content
- Docusaurus `plugin-content-docs` configured without product filter
- Build script lacks `PRODUCT_FILTER` environment variable
- No distinction between "public" and "product-protected" docs
- Search index includes product-specific docs without access control

**Phase to address:** Phase 1 (Architecture decision) - Must choose pattern before content migration

---

### Pitfall 4: Search Index Exposes Cross-Product Content

**What goes wrong:**
`docusaurus-search-local` indexes ALL pages at build time. When a Product A user searches:
1. The entire search index is downloaded to their browser
2. They can search for Product B terms
3. Results show Product B page titles and snippets
4. Clicking results may fail (403 or 404) but the exposure has happened

Even if the page itself is protected, the search metadata leaks information.

**Why it happens:**
The search plugin has no concept of user identity or product scope. It builds a single Lunr.js index at build time. This index is a static file served to all users.

**How to avoid:**

**Option A - Separate search indexes per product:**
```javascript
// docusaurus.config.ts
plugins: [
  [
    require.resolve('@easyops-cn/docusaurus-search-local'),
    {
      // Generate separate index per product subdomain
      indexDocs: true,
      indexDocSidebar: 'default',
      // Filter docs by product at build time
      docsRouteBasePath: process.env.PRODUCT_FILTER === 'gcxone' 
        ? '/docs/gcxone' 
        : '/docs/product-b'
    }
  ]
]
```

**Option B - Exclude product-specific docs from search:**
```yaml
# In Sanity doc schema
hiddenFromSearch: boolean  # Set true for sensitive docs

# In GROQ query
*[_type == "doc" && !hiddenFromSearch && product == $product]

# Or: Never index protected docs
# Use server-side search for those instead
```

**Option C - Runtime search via Cloudflare Function:**
For protected content, never include in static index:
```javascript
// functions/search.ts
export const onRequest = async (context) => {
  const session = await verifySession(context.request);
  const query = new URL(context.request.url).searchParams.get('q');
  
  // GROQ query filtered by product access
  const results = await client.fetch(
    `*[_type == "doc" && product in $products && title match $query]`,
    { products: session.productAccess, query: `*${query}*` }
  );
  
  return new Response(JSON.stringify(results));
};
```

**Warning signs:**
- `search-index.json` contains Product B content
- No product filter in search plugin config
- Search results show pages the user cannot access
- `docusaurus-search-local` configured without docs filtering

**Phase to address:** Phase 2 (Content Infrastructure) - Search must be scoped before content is indexed

---

### Pitfall 5: Overengineering Product Separation

**What goes wrong:**
Developers create elaborate multi-tenant infrastructure:
- Separate Sanity datasets per product (unnecessary for 2-3 products)
- Separate Docusaurus instances per product (doubles maintenance)
- Complex microservices for content routing
- Enterprise-grade RBAC when simple role checks would suffice
- Organizations in Auth0 when a `productAccess` claim is enough

The existing single-product architecture works well. Overengineering creates:
- Deployment complexity (multiple build pipelines)
- Sync issues (shared content must be duplicated)
- Maintenance burden (changes applied in multiple places)
- Debugging nightmare (which instance is broken?)

**Why it happens:**
Developers assume multi-tenant = enterprise architecture. They look at how SaaS platforms with 1000s of tenants are built, not how docs sites with 2-3 products should be built.

**How to avoid:**

**Start simple:**
```
2-3 products → Single Sanity dataset + product field + GROQ filters
2-3 products → Single Docusaurus instance + product-specific routes
2-3 products → Single Auth0 app + product claims
```

**Only escalate if you actually need:**
- 10+ products with independent teams → Consider separate Sanity projects
- Regulatory isolation requirements → Separate subdomains with isolated builds
- Independent release schedules → Separate Cloudflare Pages projects

**For this project (NXGEN GCXONE + Product B):**
```javascript
// SIMPLER APPROACH:
// One Sanity dataset with product field
// One Docusaurus build with product-scoped routes
// One Auth0 app with product_access claim

// Sanity schema:
{ name: 'product', type: 'string', options: { list: ['gcxone', 'product-b'] } }

// GROQ:
*[_type == "doc" && product == $product]

// Auth0:
claims.product_access = ['gcxone'] or ['product-b'] or ['gcxone', 'product-b']

// Routes:
/gcxone/docs/...  // filtered to product == 'gcxone'
/product-b/docs/...  // filtered to product == 'product-b'
```

**Warning signs:**
- Planning separate Sanity projects for 2-3 products
- Planning separate Docusaurus repos
- Planning Auth0 Organizations for 2-3 products
- Multiple Cloudflare Pages projects when one would work
- "We need a multi-tenant architecture" discussion starting before defining actual requirements

**Phase to address:** Phase 1 (Architecture decision) - Start with simplest viable approach

---

### Pitfall 6: Migration Breaks Existing Single-Product Content

**What goes wrong:**
When adding multi-product support:
1. New `product` field added to schemas as optional
2. Existing documents have `product: undefined`
3. GROQ query `product == $product` excludes all old content
4. Existing GCXONE docs disappear from the site
5. Editors panic, customers see empty pages

**Why it happens:**
The migration path from single-product to multi-product is not atomic. Adding the field doesn't populate it. The query starts filtering before the data is backfilled.

**How to avoid:**

**Step 1 - Add field with default value:**
```javascript
// Sanity schema
{
  name: 'product',
  type: 'string',
  options: { list: [...] },
  initialValue: 'gcxone',  // Default for NEW documents
  // Don't make required yet
}
```

**Step 2 - Backfill existing content:**
```javascript
// One-time migration script
await client.patch(
  { query: '*[_type == "doc" && !defined(product)]' },
  { set: { product: 'gcxone' } }
).commit();
```

**Step 3 - Verify backfill:**
```groq
// GROQ Vision
*[_type == "doc" && !defined(product)] | count()
// Should return 0
```

**Step 4 - Make field required:**
```javascript
// Update schema
validation: Rule => Rule.required()
```

**Step 5 - Add GROQ filter:**
```javascript
// Now safe to filter
*[_type == "doc" && product == $product]
```

**Step 6 - Update queries in all locations:**
- `fetch-sanity-content.js`
- `SanityLandingPageRoute.tsx`
- Cloudflare Functions
- Any hardcoded GROQ in components

**Warning signs:**
- Schema has `product` field but existing documents show `undefined`
- GROQ queries filtering by `product` before backfill complete
- `count` of documents matching query drops after schema change
- `/docs` pages showing empty or fewer results than before

**Phase to address:** Phase 2 (Content Infrastructure) - Migration must be atomic and verified

---

### Pitfall 7: Cloudflare Functions Lack Product Context

**What goes wrong:**
The existing Cloudflare Functions (`zoho-customer-auth.ts`, `admin-auth-callback.ts`, etc.) have no product awareness:

```javascript
// Current zoho-customer-auth.ts
// Creates session with contactId, accountId, displayName
// NO product access information

// Current page-feedback.ts
// Accepts feedback from any page
// NO verification that user can access that product's docs
```

When Product B launches:
- Functions still accept feedback on Product B pages from GCXONE users
- Functions still serve content requests without product check
- Session validation passes for any authenticated user

**Why it happens:**
Functions were written for single-product context. The session verification checks "is authenticated" not "is authenticated for this product."

**How to avoid:**

**Update session to include product access:**
```javascript
// lib/session.ts - Update session interface
interface Session {
  userId: string;
  email: string;
  displayName: string;
  productAccess: string[];  // ['gcxone'] | ['product-b'] | ['gcxone', 'product-b']
  exp: number;
}

// Update createSession to populate productAccess
async function createSession(user: Auth0User | ZohoContact) {
  const productAccess = await fetchProductEntitlements(user.email);
  return {
    ...user,
    productAccess,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };
}
```

**Update function guards:**
```javascript
// lib/requireProductAccess.ts - New utility
export async function requireProductAccess(
  request: Request,
  product: string,
  secret: string
): Promise<Session> {
  const session = await verifySessionCookie(
    request.headers.get('Cookie'),
    secret
  );
  
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  if (!session.productAccess.includes(product)) {
    throw new Response('Forbidden - No access to this product', { status: 403 });
  }
  
  return session;
}

// functions/docs-feedback.ts - Updated
import { requireProductAccess } from '../lib/requireProductAccess';

export const onRequestPost = async (context) => {
  const product = context.params.product; // from /:product/docs/...
  const session = await requireProductAccess(
    context.request,
    product,
    context.env.SESSION_SECRET
  );
  
  // Now safe to accept feedback
  // ...
}
```

**Warning signs:**
- Cloudflare Functions check `isAuthenticated` but not product access
- No `requireProductAccess` utility exists
- Session interface lacks `productAccess` field
- Function routes don't include product parameter (`/:product/...`)

**Phase to address:** Phase 1 (Auth Foundation) - Functions need product guards before content is added

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Add `product` field but don't filter queries yet | Faster to implement schema | Content leakage if Product B docs added before filtering | NEVER - This is how leaks happen |
| Use single session for all products | Simpler auth | No way to restrict access per product | ONLY if all products are public |
| Skip product validation in Functions | Less code | Any authenticated user can call any function | NEVER for protected content |
| Copy existing docs to Product B instead of sharing | Quick launch | Divergence, sync issues | NEVER - Use references or shared content |
| Hardcode product list in GROQ | Avoids config | Adding Product C requires code change | SHORT-TERM - Acceptable for MVP if config is planned |
| Trust client-side filtering | Simpler implementation | User can modify JS to see other products | NEVER - Client-side is presentation only |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Sanity → Docusaurus** | Single JSON file with all products | Separate JSON per product OR filter at function level |
| **Auth0 → Cloudflare Functions** | Session has email but no productAccess | Add product_access claim to Auth0 token, validate in functions |
| **Zoho Contact → Session** | Assume all contacts have GCXONE access | Query product entitlements from Zoho custom field |
| **Cloudflare Pages Build** | One build for all products | Either: separate builds per product, or: runtime access checks |
| **Search Index** | Index all docs regardless of product | Filter by product at build time OR use server-side search |
| **Webhook Rebuild** | Rebuild all products on any change | Scope webhooks to product-specific Sanity documents |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Multiple full site builds** | Deploy takes 10+ minutes, high build minutes | Separate critical path - only rebuild affected product | At 5+ products with shared infrastructure |
| **Large JSON with all products** | Slow page load, large bundle size | Split JSON per product OR lazy-load protected content | At 1000+ docs across products |
| **Per-request GROQ for protected content** | Slow page render, API rate limits | Cache product-filtered results in KV with session-scoped key | At high traffic + many protected docs |
| **Search index includes all products** | Large search file download | Split search index per product | At 500+ total docs |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Static build includes Product B content** | Product B docs in page source, searchable, archivable | Use runtime fetch for protected content OR separate builds |
| **Search results show Product B** | Information disclosure through search metadata | Product-scoped search index OR server-side search |
| **Session lacks productAccess** | Any authenticated user can access any product | Add product_access claim to Auth0 token |
| **Function doesn't check product** | Authenticated GCXONE user can call Product B APIs | requireProductAccess guard in every function |
| **URL path determines product without validation** | User changes `/gcxone/...` to `/product-b/...` | Validate product from session, not just URL |
| **Shared assets between products** | Images/videos leak through asset URLs | Use product-scoped asset folders OR signed URLs |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Login required for public docs** | Users frustrated, bounce | Only require auth for product-specific protected content |
| **No indication of product after login** | User unsure which docs they can access | Show product badge/chip in nav, "Your access: GCXONE" |
| **Product switcher shows inaccessible products** | User clicks, gets 403 | Only show products in user's productAccess |
| **Deep link to wrong product** | User follows link, gets 403 | Redirect to their accessible product OR show "You don't have access to Product B. You have access to: GCXONE" |
| **Search returns inaccessible results** | User sees result, clicks, blocked | Filter search to user's products |
| **"Request access" leads nowhere** | Dead end, frustration | Link to sales/support with product context |

---

## "Looks Done But Isn't" Checklist

- [ ] **Product field on all document types** — Verify EVERY schema has product field (doc, article, landingPage, release, roadmapItem, etc.)
- [ ] **Backfill complete** — GROQ Vision: `*[_type == "doc" && !defined(product)] | count` returns 0
- [ ] **All GROQ queries filtered** — Search codebase for `*[_type ==` and verify each has `&& product == $product`
- [ ] **Session has productAccess** — Log session object, verify productAccess array exists
- [ ] **Functions check product access** — Every function handling protected content calls requireProductAccess
- [ ] **Search index scoped** — Download search-index.json, verify it doesn't contain other products
- [ ] **Static build filtered** — View page source, search for Product B terms, find nothing
- [ ] **Auth0 claims populated** — Decode ID token at jwt.io, verify product_access claim exists
- [ ] **Product switcher accurate** — Only shows products in user's session.productAccess
- [ ] **Cross-product links handled** — Link from GCXONE doc to Product B doc shows access denied, not 404

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Content leaked via static build** | HIGH | Rebuild with filtering, request search engine de-index, rotate asset URLs if sensitive |
| **Session lacks productAccess** | MEDIUM | Add claim to Auth0, force re-login for all users, update function guards |
| **Search exposes other products** | MEDIUM | Rebuild search index with product filter, clear browser cache |
| **Function doesn't validate product** | LOW | Add guard, deploy function — no data exposure if caught quickly |
| **Backfill incomplete** | LOW | Run migration script again, verify count |
| **Product field missing from schema** | LOW | Add field, backfill, verify — no leakage if no Product B content yet |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| **Content leakage** | Phase 1 (Auth Foundation) | Penetration test: authenticated GCXONE user cannot access Product B URLs |
| **Dual auth not unified** | Phase 1 (Auth Foundation) | Session object has productAccess field for both admin and customer auth |
| **Static build leaks** | Phase 1 (Architecture Decision) | Page source contains only accessible product content |
| **Search index exposes** | Phase 2 (Content Infrastructure) | search-index.json contains only one product's content |
| **Overengineering** | Phase 1 (Architecture Decision) | Architecture doc shows single dataset, single build, product field approach |
| **Migration breaks content** | Phase 2 (Content Infrastructure) | GROQ Vision count matches pre-migration, all docs have product field |
| **Functions lack product context** | Phase 1 (Auth Foundation) | Every function has requireProductAccess guard |

---

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — Existing single-product architecture constraints
- `.planning/research/auth0-upgrade-EXISTING-AUTH.md` — Dual auth systems analysis
- `.planning/research/auth0-upgrade-FEATURES.md` — Auth0 Organizations and claims patterns
- `.planning/research/ARCHITECTURE.md` — Current build pipeline and data flow
- `.planning/research/PITFALLS.md` — Existing v1.1 pitfalls (schema migration patterns apply)
- `functions/zoho-customer-auth.ts` — Current session creation (lacks productAccess)
- `functions/lib/zoho-session.ts` — Session interface (lacks productAccess)

### Secondary (MEDIUM confidence)
- Docusaurus i18n documentation — Separation patterns (different use case but relevant structure)
- Auth0 Organizations documentation — Multi-tenant patterns (may be overkill for 2-3 products)
- Sanity GROQ documentation — Filtering patterns

### Patterns inferred from existing codebase (HIGH confidence)
- Build-time JSON pattern established and working
- HttpOnly cookie session pattern established and secure
- Auth0 integration pattern established and working
- Schema migration patterns established from v1.1 work

---

## Additional Recommendations

### Test Strategy for Content Isolation

Before any Product B content is added, create automated tests:

```javascript
// tests/product-isolation.test.ts
describe('Product Isolation', () => {
  it('GCXONE user cannot access Product B URLs', async () => {
    const session = await loginAsGcxoneUser();
    const response = await fetch('/product-b/docs/secret-feature', {
      headers: { Cookie: session.cookie }
    });
    expect(response.status).toBe(403);
  });
  
  it('Search does not return Product B results for GCXONE user', async () => {
    const session = await loginAsGcxoneUser();
    const response = await fetch('/search?q=product-b-feature', {
      headers: { Cookie: session.cookie }
    });
    const results = await response.json();
    expect(results.every(r => r.product === 'gcxone')).toBe(true);
  });
  
  it('Static build does not include Product B content', async () => {
    const build = await fetch('/docs/sanity-docs.generated.json');
    const docs = await build.json();
    expect(docs.every(d => d.product === 'gcxone')).toBe(true);
  });
});
```

### Checklist Before Adding Product B

1. [ ] All schemas have `product` field
2. [ ] All existing docs have `product: 'gcxone'`
3. [ ] Session includes `productAccess: ['gcxone']`
4. [ ] Functions check `requireProductAccess`
5. [ ] Search index filtered to product
6. [ ] Static build filtered to product
7. [ ] Tests pass for isolation
8. [ ] Penetration test confirms no cross-product access

Only then: Create first Product B document.

---

*Pitfalls research for: Multi-Product Architecture Migration*
*Researched: 2026-04-01*
*Context: Adding multi-product support to existing Docusaurus + Sanity docs platform*
