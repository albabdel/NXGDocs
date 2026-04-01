# Architecture Research: Multi-Product Knowledge Base

**Domain:** Multi-product Docusaurus + Sanity architecture
**Researched:** 2026-04-01
**Confidence:** HIGH (based on direct codebase inspection and existing v5.0 Auth0 planning)

---

## Executive Summary

This research addresses the **NEW architectural components** required to transform the existing single-product Docusaurus + Sanity documentation platform into a multi-product system. The existing architecture (build-time Sanity fetch, static generation, Cloudflare Pages deployment) is preserved and extended.

**Key Integration Points:**
1. **Multi-build pipeline** extends the existing `fetch-sanity-content.js` to filter by product
2. **Sanity schemas** add a `product` field to all content types
3. **Auth0 integration** (already planned in v5.0) enables content access control
4. **PostHog analytics** adds product-aware tracking
5. **Domain routing** maps product builds to their respective domains

---

## Current Architecture Overview

```
+---------------------------------------------------------------------+
|                     SANITY STUDIO (studio/)                          |
|  +---------------------+  +------------------+  +-----------------+   |
|  |  doc                |  |  release         |  |  article        |   |
|  |  - title            |  |  - title         |  |  - title        |   |
|  |  - slug             |  |  - sprintId      |  |  - slug         |   |
|  |  - targetAudience[] |  |  - items[]       |  |  - body         |   |
|  |  - body             |  |  - publishedAt   |  |                 |   |
|  |  - status           |  |                  |  |                 |   |
|  +---------------------+  +------------------+  +-----------------+   |
|                                                                       |
|  CURRENT: Single dataset "production" for single product (GCXONE)    |
|  NEW: Add product field to all schemas for multi-product support     |
+----------------------------------------------+----------------------+
                                               |
                       Sanity webhook -> Cloudflare Pages rebuild
                                               v
+---------------------------------------------------------------------+
|             CLOUDFLARE PAGES BUILD PIPELINE (CURRENT)               |
|                                                                     |
|  Pre-build:  node classic/scripts/fetch-sanity-content.js          |
|    GROQ: docs, articles, releases, roadmapItems, landingPages      |
|    Output: .sanity-cache/{audience}/*.md                           |
|            src/data/sanity-*.generated.json                         |
|                                                                     |
|  Build:      npx docusaurus build                                   |
|    Output:    classic/build/ -> deployed to docs.nxgen.cloud       |
|                                                                     |
|  NEW: Multi-build pipeline runs one build per product              |
+----------------------------------------------+----------------------+
                                               v
+---------------------------------------------------------------------+
|               DEPLOYED STATIC SITES (CURRENT + NEW)                  |
|                                                                     |
|  CURRENT:  docs.nxgen.cloud      -> single product (GCXONE)        |
|  NEW:      docs.gcxone.com       -> GCXONE product site            |
|            docs.gcsurge.com      -> GCSurge product site           |
|            (Additional products as needed)                         |
+---------------------------------------------------------------------+
```

---

## New Architecture Components

### System Overview (Multi-Product)

```
+-----------------------------------------------------------------------------+
|                     SANITY STUDIO (MODIFIED)                                 |
|  +-----------------------------------------------------------------------+  |
|  |  ALL SCHEMAS (NEW: product field added)                               |  |
|  |  +------------+  +------------+  +------------+  +------------+       |  |
|  |  | doc        |  | release    |  | article    |  | roadmapItem|       |  |
|  |  | + product  |  | + product  |  | + product  |  | + product  |       |  |
|  |  | (required) |  | (required) |  | (required) |  | (required) |       |  |
|  |  +------------+  +------------+  +------------+  +------------+       |  |
|  |                                                                         |  |
|  |  +-------------------------------------------------------------+       |  |
|  |  | sidebarCategory + product (for product-specific sidebars)   |       |  |
|  |  | landingPage + product (for product-specific landing pages)  |       |  |
|  |  +-------------------------------------------------------------+       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  PRODUCT ENUM: ["gcxone", "gcsurge"] (extensible)                           |
+----------------------------------------------+-----------------------------+
                                               |
                    Sanity webhook triggers multi-build
                                               v
+-----------------------------------------------------------------------------+
|                     MULTI-BUILD PIPELINE (NEW)                              |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |  build-multi-product.js                                               |  |
|  |                                                                       |  |
|  |  For each PRODUCT in ["gcxone", "gcsurge"]:                          |  |
|  |    1. Set PRODUCT env var                                             |  |
|  |    2. Run fetch-sanity-content.js (GROQ filters by product)          |  |
|  |    3. Run docusaurus build --out-dir build/${PRODUCT}                |  |
|  |    4. Output: classic/build/gcxone/ and classic/build/gcsurge/       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
|  MODIFIED: fetch-sanity-content.js adds product filter to ALL GROQ queries |
+----------------------------------------------+-----------------------------+
                                               v
+-----------------------------------------------------------------------------+
|                     CLOUDFLARE PAGES DEPLOYMENT (NEW)                       |
|                                                                             |
|  +---------------------+    +---------------------+                        |
|  | docs.gcxone.com     |    | docs.gcsurge.com    |                        |
|  | (GCXONE Pages proj) |    | (GCSurge Pages proj)|                        |
|  | -> build/gcxone/    |    | -> build/gcsurge/   |                        |
|  +---------------------+    +---------------------+                        |
|                                                                             |
|  Each domain is a separate Cloudflare Pages project with its own:          |
|  - Custom domain configuration                                              |
|  - Environment variables (SANITY_PROJECT_ID, SANITY_DATASET, PRODUCT)      |
|  - Build hook from Sanity webhook                                          |
+-----------------------------------------------------------------------------+
```

---

## Component Responsibilities

### New Components

| Component | Type | Responsibility | Location |
|-----------|------|---------------|----------|
| `build-multi-product.js` | NEW | Orchestrates multi-build pipeline, one build per product | `classic/scripts/` |
| `product.config.ts` | NEW | Product-specific configuration (title, branding, domains) | `classic/` |
| `sanity-product.config.ts` | NEW | Sanity product field validation and preview | `studio/schemaTypes/` |
| Auth0 Provider wrapper | NEW | Auth0 React SDK integration with product context | `classic/src/theme/Root.tsx` |
| PostHog Provider | NEW | Analytics with product identification | `classic/src/theme/Root.tsx` |
| Access control utilities | NEW | Content visibility checks based on product + user roles | `classic/src/utils/` |

### Modified Components

| Component | Modification | Why |
|-----------|-------------|-----|
| `fetch-sanity-content.js` | Add product filter to all GROQ queries | Filter content by PRODUCT env var |
| `docusaurus.config.ts` | Read PRODUCT env var for site title, URL, branding | Product-specific configuration |
| All Sanity schemas | Add `product` field (required, enum) | Content belongs to specific product |
| `generate-sidebar-from-sanity.js` | Filter categories by product | Product-specific sidebar structure |
| `.cfpages.yaml` | Support multi-project deployment | Deploy each product to its domain |

### Unchanged Components

| Component | Why Unchanged |
|-----------|---------------|
| `plugin-content-docs` instances | Continue to read from `.sanity-cache/`; content filtered by product |
| `docusaurus-plugin-sanity-content` | Remains a thin shim; fetch script handles filtering |
| Cloudflare Functions | Auth and API endpoints work across products |
| Static generation approach | Each product is a separate static site |

---

## Architectural Patterns

### Pattern 1: Environment-Driven Product Context

**What:** The `PRODUCT` environment variable flows through the entire build pipeline, filtering content, configuring branding, and determining output directory.

**When to use:** Multi-product static sites where each product has distinct content but shares the same codebase.

**Trade-offs:** Single codebase maintenance vs. separate deployments per product. Build time scales linearly with number of products. Each product is a complete static site with no runtime product-switching overhead.

**Implementation:**

```javascript
// classic/scripts/build-multi-product.js
const PRODUCTS = ['gcxone', 'gcsurge'];

async function buildAllProducts() {
  for (const product of PRODUCTS) {
    process.env.PRODUCT = product;
    
    // 1. Fetch product-specific content from Sanity
    await require('./fetch-sanity-content.js').run();
    
    // 2. Generate product-specific sidebar
    await require('../scripts/generate-sidebar-from-sanity.js').run();
    
    // 3. Build Docusaurus with product configuration
    execSync(`npx docusaurus build --out-dir build/${product}`, {
      stdio: 'inherit',
      env: { ...process.env, PRODUCT: product }
    });
    
    console.log(`Built ${product} -> build/${product}/`);
  }
}
```

**Docusaurus config reads product context:**

```typescript
// classic/docusaurus.config.ts
const product = process.env.PRODUCT || 'gcxone';

const PRODUCT_CONFIG = {
  gcxone: {
    title: 'GCXONE Documentation',
    url: 'https://docs.gcxone.com',
    tagline: 'Complete documentation for GCXONE platform',
  },
  gcsurge: {
    title: 'GCSurge Documentation',
    url: 'https://docs.gcsurge.com',
    tagline: 'Complete documentation for GCSurge platform',
  },
};

const config = {
  title: PRODUCT_CONFIG[product].title,
  url: PRODUCT_CONFIG[product].url,
  tagline: PRODUCT_CONFIG[product].tagline,
  // ...
};
```

### Pattern 2: GROQ Product Filter on All Content Queries

**What:** Every GROQ query in `fetch-sanity-content.js` includes a product filter clause. This ensures each product build only fetches its own content.

**When to use:** Multi-tenant Sanity datasets where documents belong to specific tenants.

**Trade-offs:** Simple filtering approach vs. separate Sanity datasets per product. Using a single dataset with product filtering keeps all content in one place for easier cross-product editorial workflows. Separate datasets would require dataset-level permissions and complicate Studio access.

**Implementation:**

```javascript
// classic/scripts/fetch-sanity-content.js

const PRODUCT = process.env.PRODUCT || 'gcxone';

function getProductFilter() {
  return `product == "${PRODUCT}"`;
}

function getQueries(includeDrafts) {
  const statusFilter = statusFilterClause(includeDrafts);
  const productFilter = getProductFilter();
  
  return [
    {
      type: 'doc',
      query: `*[_type == "doc" && ${statusFilter} && ${productFilter}] | order(sidebarPosition asc) {
        title, slug, targetAudience, category, sidebarPosition, sidebarLabel, 
        hideFromSidebar, body, lastUpdated, description, tags, status, product,
        "categoryId": sidebarCategory->_id,
        "categorySlug": sidebarCategory->slug.current,
        "categoryTitle": sidebarCategory->title,
        "coverImageUrl": coverImage.asset->url
      }`,
    },
    // ... all other queries include product filter
  ];
}
```

### Pattern 3: Sanity Schema Product Field (Required Enum)

**What:** Every content schema includes a required `product` field with an enum of valid products. This ensures all content is explicitly assigned to a product and prevents orphaned documents.

**When to use:** Multi-product content management where content must not be "shared" or ambiguous.

**Trade-offs:** Slightly more editorial overhead (selecting product for each document) vs. clear product ownership. Required field prevents editorial errors where content is not assigned.

**Implementation:**

```typescript
// studio/schemaTypes/doc.ts (MODIFIED)

export const docType = defineType({
  name: 'doc',
  type: 'document',
  title: 'Documentation Page',
  fields: [
    // ... existing fields
    defineField({
      name: 'product',
      type: 'string',
      title: 'Product',
      options: {
        list: [
          { title: 'GCXONE', value: 'gcxone' },
          { title: 'GCSurge', value: 'gcsurge' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'gcxone',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      product: 'product',
      status: 'status',
    },
    prepare({ title, product, status }) {
      return {
        title,
        subtitle: `${product?.toUpperCase() || 'No product'} - ${status || 'draft'}`,
      };
    },
  },
});
```

### Pattern 4: Product-Specific Sidebar Generation

**What:** The sidebar generation script filters categories and documents by product, generating a unique sidebar structure for each product build.

**Implementation:**

```javascript
// scripts/generate-sidebar-from-sanity.js (MODIFIED)

const PRODUCT = process.env.PRODUCT || 'gcxone';

async function fetchSanityData() {
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2025-02-06',
  });

  const categories = await client.fetch(`
    *[_type == "sidebarCategory" && product == "${PRODUCT}"] | order(position asc) {
      _id, title, slug, icon, position, parent, collapsed, collapsible, link, product
    }
  `);

  const docs = await client.fetch(`
    *[_type == "doc" && status == "published" && product == "${PRODUCT}"] {
      _id, title, "slug": slug.current, category, "categoryId": sidebarCategory->_id,
      sidebarPosition, sidebarLabel, product
    }
  `);

  return { categories, docs };
}
```

### Pattern 5: Auth0 Integration for Access Control (v5.0 Foundation)

**What:** Auth0 provides user authentication with product-specific roles. The existing v5.0 Auth0 planning provides the foundation for content access control.

**Integration with multi-product:** Auth0 custom claims include product roles, enabling per-product content visibility.

**Auth0 Action for product claims:**

```javascript
// Auth0 Action: Add product roles to JWT claims

exports.onExecutePostLogin = async (event) => {
  const namespace = 'https://nxgen.cloud/claims';
  const productAccess = event.user.app_metadata?.productAccess || ['gcxone'];
  
  event.authorization.tokens[`${namespace}/product_access`] = productAccess;
  event.authorization.tokens[`${namespace}/roles`] = event.user.app_metadata?.roles || [];
};
```

**Frontend access control:**

```typescript
// classic/src/utils/contentAccess.ts (NEW)

import { useAuth0 } from '@auth0/auth0-react';

export function useContentAccess() {
  const { isAuthenticated, user } = useAuth0();
  
  const userProductAccess = user?.['https://nxgen.cloud/claims/product_access'] || [];
  const userRoles = user?.['https://nxgen.cloud/claims/roles'] || [];
  
  return {
    canView: (content: { product: string; visibility: 'public' | 'private' }) => {
      if (content.visibility === 'public') return true;
      if (!isAuthenticated) return false;
      return userProductAccess.includes(content.product);
    },
    
    canEdit: (content: { product: string }) => {
      if (!isAuthenticated) return false;
      return userRoles.includes(`editor-${content.product}`) || userRoles.includes('admin');
    },
  };
}
```

**Important:** The current architecture is **build-time static generation**. Content access control for private content requires either:
1. **Client-side gating** - All content in build, visibility enforced by React components
2. **Protected builds** - Private content excluded from public builds, served via authenticated routes
3. **Edge authentication** - Cloudflare Workers check auth before serving private content

**Recommendation:** For the multi-product milestone, use **client-side gating** for private content. This preserves static generation while adding the UX of gated content.

### Pattern 6: PostHog Product-Aware Analytics

**What:** PostHog tracks user interactions with product context, enabling per-product analytics dashboards.

**Implementation:**

```typescript
// classic/src/theme/Root.tsx (MODIFIED)

import { PostHogProvider } from 'posthog-js/react';

const PRODUCT = process.env.PRODUCT || 'gcxone';

function Root({ children }) {
  const posthogConfig = {
    api_key: process.env.POSTHOG_KEY,
    options: {
      properties: { product: PRODUCT },
    },
  };
  
  return (
    <PostHogProvider {...posthogConfig}>
      {children}
    </PostHogProvider>
  );
}
```

---

## Data Flow

### Multi-Build Pipeline Flow

```
Sanity publish webhook received
    |
    v
build-multi-product.js runs
    |
    |-- FOR PRODUCT = "gcxone":
    |       |
    |       v
    |   Set process.env.PRODUCT = "gcxone"
    |       |
    |       v
    |   fetch-sanity-content.js
    |       |-- GROQ: *[_type == "doc" && product == "gcxone"]
    |       |-- GROQ: *[_type == "release" && product == "gcxone"]
    |       |-- GROQ: *[_type == "roadmapItem" && product == "gcxone"]
    |       |-- GROQ: *[_type == "landingPage" && product == "gcxone"]
    |       v
    |   .sanity-cache/ populated with GCXONE content only
    |   src/data/sanity-*.generated.json populated with GCXONE data
    |       |
    |       v
    |   generate-sidebar-from-sanity.js
    |       |-- GROQ: sidebarCategory + product == "gcxone"
    |       v
    |   sidebars.ts generated for GCXONE
    |       |
    |       v
    |   npx docusaurus build --out-dir build/gcxone
    |       |
    |       v
    |   classic/build/gcxone/ (GCXONE static site)
    |
    |-- FOR PRODUCT = "gcsurge":
    |       |
    |       v
    |   (same pipeline, product == "gcsurge")
    |       |
    |       v
    |   classic/build/gcsurge/ (GCSurge static site)
    |
    v
Cloudflare Pages deployment
    |-- docs.gcxone.com <- build/gcxone/
    |-- docs.gcsurge.com <- build/gcsurge/
```

### Content Query Flow (Product-Filtered)

```
Editor publishes doc with product: "gcxone" in Sanity Studio
    |
    v   Document stored: { _type: "doc", title: "...", product: "gcxone", ... }
    |
Sanity webhook triggers Cloudflare Pages rebuild
    |
    v
build-multi-product.js executes
    |
    |-- GCXONE build:
    |       |
    |       v
    |   GROQ query: *[_type == "doc" && product == "gcxone"]
    |       |
    |       v
    |   Document IS included in GCXONE build
    |
    |-- GCSurge build:
            |
            v
        GROQ query: *[_type == "doc" && product == "gcsurge"]
            |
            v
        Document is NOT included (product mismatch)
```

### Authenticated Content Access Flow

```
User visits docs.gcxone.com
    |
    v
Auth0Provider checks authentication state
    |
    |-- Not authenticated:
    |       |
    |       v
    |   Show public content only
    |   "Sign in" link in navbar
    |
    |-- Authenticated:
            |
            v
        JWT contains product_access claim: ["gcxone"]
            |
            v
        ContentAccess.canView({ product: "gcxone", visibility: "private" })
            |
            v
        Returns true (user has gcxone access)
            |
            v
        Private GCXONE content visible
```

---

## Integration Points

### External Services

| Service | Integration | Product Context | Notes |
|---------|-------------|-----------------|-------|
| Sanity Content API | GROQ queries with product filter | `product == "${PRODUCT}"` | All content queries filtered |
| Sanity Studio | Product field on all schemas | Required enum field | Editors select product per document |
| Auth0 | v5.0 Auth0 Integration | Custom claims for product_access | Extends existing Auth0 planning |
| PostHog | Analytics provider | `product` property on all events | Per-product analytics |
| Cloudflare Pages | Multi-project deployment | Separate project per product domain | Each domain is a Pages project |
| Cloudflare Workers | (Optional) Edge auth | Product-aware routing | Future: edge-based access control |

### Internal Boundaries

| Boundary | Communication | Product Context |
|----------|---------------|-----------------|
| `build-multi-product.js` -> `fetch-sanity-content.js` | PRODUCT env var | Determines which content to fetch |
| `fetch-sanity-content.js` -> Sanity API | GROQ filter clause | `product == "${PRODUCT}"` in all queries |
| `docusaurus.config.ts` -> PRODUCT env var | Node.js process.env | Site title, URL, branding |
| `Root.tsx` -> Auth0 | JWT custom claims | `product_access` array for content gating |
| `Root.tsx` -> PostHog | Provider config | `product` property on events |

### Existing Components (Unchanged Integration)

| Component | Integration | Impact |
|-----------|-------------|--------|
| `plugin-content-docs` | Reads `.sanity-cache/` | Content already filtered by product |
| `docusaurus-plugin-sanity-content` | No-op `loadContent()` | Unchanged; fetch script handles filtering |
| `docusaurus-plugin-sanity-landing-pages` | Reads landing pages JSON | Content already filtered by product |
| Cloudflare Functions | Existing auth patterns | Work across products |

---

## Suggested Build Order

The following sequence respects dependencies between new and existing components:

### Phase 1: Sanity Schema Product Field (Foundation)

**Dependencies:** None. Self-contained in `studio/`.

1. Create `studio/schemaTypes/fields/product.ts` - reusable product field definition
2. Add `product` field to ALL content schemas (doc, release, roadmapItem, article, landingPage, sidebarCategory)
3. Set `validation: Rule.required()` and `initialValue: 'gcxone'`
4. Add product badge to preview configurations
5. Run migration script to set `product: 'gcxone'` on all existing documents
6. Verify: open Sanity Studio, confirm all documents show product badge

**Why first:** Every downstream step depends on content having a product field. Without this, queries cannot filter and builds cannot separate content.

**Migration script:**

```javascript
// studio/scripts/migrate-product-field.js

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-06' });

async function migrate() {
  const types = ['doc', 'release', 'roadmapItem', 'article', 'landingPage', 'sidebarCategory'];
  
  for (const type of types) {
    const docs = await client.fetch(`*[_type == "${type}" && !defined(product)]`);
    
    for (const doc of docs) {
      await client.patch(doc._id).set({ product: 'gcxone' }).commit();
    }
    console.log(`Migrated ${docs.length} ${type} documents`);
  }
}
```

### Phase 2: Fetch Script Product Filter

**Dependencies:** Phase 1 complete (all documents have product field).

1. Add `PRODUCT` env var reading to `fetch-sanity-content.js`
2. Create `getProductFilter()` helper function
3. Add product filter to ALL GROQ queries
4. Add product filter to sidebar category query in `generate-sidebar-from-sanity.js`
5. Test locally: `PRODUCT=gcxone node classic/scripts/fetch-sanity-content.js`
6. Verify: JSON files contain only GCXONE content

**Why second:** The multi-build pipeline (Phase 3) requires product-filtered content.

### Phase 3: Multi-Build Pipeline

**Dependencies:** Phase 2 complete (content filtering works).

1. Create `classic/scripts/build-multi-product.js` - orchestrates builds
2. Define `PRODUCTS` array (initially `['gcxone', 'gcsurge']`)
3. Implement build loop: set env -> fetch -> generate sidebar -> docusaurus build
4. Test locally: `node classic/scripts/build-multi-product.js`
5. Verify: `classic/build/gcxone/` and `classic/build/gcsurge/` directories created

**Why third:** Domain deployment (Phase 4) requires built artifacts.

### Phase 4: Product Configuration and Branding

**Dependencies:** Phase 3 complete (build pipeline works).

1. Create `classic/product.config.ts` - product-specific configuration
2. Modify `docusaurus.config.ts` to read PRODUCT env var and apply config
3. Add product-specific: title, tagline, URL, favicon, logo (if different)
4. Test builds: verify each product has correct branding

**Configuration structure:**

```typescript
// classic/product.config.ts

export const PRODUCT_CONFIGS = {
  gcxone: {
    title: 'GCXONE Documentation',
    tagline: 'Complete documentation for GCXONE platform',
    url: 'https://docs.gcxone.com',
    favicon: 'img/favicon-gcxone.png',
    theme: { primaryColor: '#E8B058' },
  },
  gcsurge: {
    title: 'GCSurge Documentation',
    tagline: 'Complete documentation for GCSurge platform',
    url: 'https://docs.gcsurge.com',
    favicon: 'img/favicon-gcsurge.png',
    theme: { primaryColor: '#3B82F6' },
  },
};
```

### Phase 5: Cloudflare Pages Multi-Project Setup

**Dependencies:** Phase 4 complete (branding configured).

1. Create separate Cloudflare Pages project for each product domain
2. Configure custom domains: `docs.gcxone.com`, `docs.gcsurge.com`
3. Set environment variables per project:
   - `SANITY_PROJECT_ID` (same)
   - `SANITY_DATASET` (same)
   - `SANITY_API_TOKEN` (same)
   - `PRODUCT` (different per project)
4. Configure build command: `node scripts/build-multi-product.js`
5. Configure build output directory: `build/${PRODUCT}`
6. Test deployment: verify each domain serves correct product

**Recommendation:** Start with separate Pages projects per product. Simpler initial setup, clear separation, independent deployment.

### Phase 6: Auth0 Integration (Extends v5.0)

**Dependencies:** v5.0 Auth0 foundation in place.

1. Extend Auth0 Actions to include `product_access` claim
2. Create product-specific roles in Auth0: `editor-gcxone`, `editor-gcsurge`, `admin`
3. Update `useContentAccess` hook to check product access
4. Add visibility field to Sanity schemas: `public` | `private`
5. Implement client-side content gating in React components
6. Test: verify private content hidden for users without access

**Note:** This phase extends the v5.0 Auth0 Integration milestone. Coordinate with that planning.

### Phase 7: PostHog Analytics Integration

**Dependencies:** None (can run in parallel with Phases 2-5).

1. Install PostHog dependencies (already in root package.json)
2. Create `PostHogProvider` wrapper in `Root.tsx`
3. Add product context to all events
4. Configure PostHog project to receive events
5. Create per-product analytics dashboards

### Phase 8: Content Seeding for GCSurge

**Dependencies:** Phase 1 complete (schemas support product field).

1. Create initial GCSurge content in Sanity Studio
2. Mirror essential docs, releases, roadmap items with `product: 'gcsurge'`
3. Verify sidebar structure renders correctly
4. Deploy to docs.gcsurge.com
5. Verify content accessible and branded correctly

---

## Anti-Patterns

### Anti-Pattern 1: Separate Sanity Datasets Per Product

**What people do:** Create `production-gcxone` and `production-gcsurge` datasets.

**Why it's wrong:** Requires managing multiple dataset connections in Studio, complicates cross-product editorial workflows, requires dataset-level permissions, and prevents easy content sharing or migration. Studio editors must switch datasets manually.

**Do this instead:** Single dataset with `product` field on all documents. GROQ filtering at build time is efficient. Studio editors see all products in one view with product badges. Content migration between products is a simple field change.

### Anti-Pattern 2: Build-Time Auth Checks for Private Content

**What people do:** Attempt to filter private content from builds based on user authentication.

**Why it's wrong:** Static builds are generated at build time, before any user authentication. There is no "current user" during build. All content in the build is publicly accessible once deployed.

**Do this instead:** Client-side content gating for the MVP. Private content is in the build but hidden by React components based on auth state. For truly sensitive content, use protected builds (separate authenticated deployment) or Cloudflare Workers for edge auth.

### Anti-Pattern 3: Hardcoded Product References in Components

**What people do:** Write `if (product === 'gcxone')` conditionals throughout React components.

**Why it's wrong:** Makes adding new products require code changes. Violates open/closed principle. Components become coupled to specific product names.

**Do this instead:** Use configuration-driven approach. `product.config.ts` provides product-specific values. Components read from config via context or props. Adding a new product is a config change, not a code change.

### Anti-Pattern 4: Single Cloudflare Pages Project with Subpaths

**What people do:** Deploy all products to a single domain with subpaths: `docs.nxgen.cloud/gcxone/`, `docs.nxgen.cloud/gcsurge/`.

**Why it's wrong:** Requires `baseUrl` changes per product in Docusaurus config, complicates routing, makes custom domains impossible, and creates confusion with relative URLs.

**Do this instead:** Separate Cloudflare Pages projects with custom domains. Each product has its own domain: `docs.gcxone.com`, `docs.gcsurge.com`. Clean separation, independent deployments, proper branding.

### Anti-Pattern 5: Duplicating Entire Codebase Per Product

**What people do:** Clone the entire `classic/` directory for each product.

**Why it's wrong:** Maintenance nightmare. Bug fixes and features must be applied to multiple codebases. Divergence occurs quickly. No code sharing between products.

**Do this instead:** Single codebase with environment-driven configuration. The multi-build pipeline produces separate deployments from the same source. All products benefit from shared improvements.

---

## Scaling Considerations

| Scale | Architecture | Notes |
|-------|-------------|-------|
| 2 products | Multi-build pipeline | Each build runs sequentially; build time ~2x single |
| 3-5 products | Parallel builds | Run builds in parallel; build time ~same as single |
| 10+ products | Consider separate repos | Build time and Sanity API quota become factors |
| 50+ products | Sanity multi-tenant | Re-evaluate architecture; consider Sanity multi-tenant features |

### Build Time Scaling

| Products | Sequential Build | Parallel Build | Notes |
|----------|-----------------|----------------|-------|
| 1 (current) | ~90s | N/A | Current single-product build |
| 2 | ~3 min | ~90s | Two sequential builds; parallel keeps same time |
| 5 | ~7.5 min | ~90s | Sequential becomes problematic; parallel recommended |
| 10 | ~15 min | ~90s | Parallel essential; consider CI optimization |

**Recommendation:** For 2-5 products, use parallel builds via Promise.all() in build-multi-product.js. For 10+ products, consider CI matrix builds or separate repositories.

### Sanity API Quota

The free tier includes 1,000,000 API requests/month. Each build makes ~10 GROQ queries.

| Builds/day | Monthly Requests | Status |
|------------|-----------------|--------|
| 10 (single product) | 300 | Well within limit |
| 20 (2 products) | 600 | Well within limit |
| 50 (5 products) | 1,500 | Well within limit |
| 200+ | 6,000+ | Monitor; consider caching |

---

## Sources

All findings are based on direct inspection of the following files:

**Existing Architecture:**
- `classic/docusaurus.config.ts` - Main Docusaurus configuration
- `classic/scripts/fetch-sanity-content.js` - The authoritative data pipeline (all GROQ queries)
- `classic/plugins/docusaurus-plugin-sanity-content/index.js` - Plugin structure
- `scripts/generate-sidebar-from-sanity.js` - Sidebar generation
- `studio/sanity.config.ts` - Sanity Studio configuration
- `.planning/STATE.md` - Project state and v5.0 Auth0 planning
- `.planning/PROJECT.md` - Project constraints

**Existing Research:**
- `.planning/research/ARCHITECTURE.md` - Previous architecture research (v1.1 Releases & Roadmap)
- `.planning/research/auth0-upgrade-FEATURES.md` - Auth0 capabilities
- `.planning/research/auth0-upgrade-UX-PATTERNS.md` - UX patterns for auth

**Configuration:**
- `.cfpages.yaml` - Current Cloudflare Pages configuration
- `wrangler.toml` - Cloudflare environment variables
- `package.json` (root and classic) - Dependencies

---

## Summary

**Multi-product architecture integrates with existing Docusaurus/Sanity setup through:**

1. **PRODUCT env var** - Single environment variable flows through entire pipeline
2. **GROQ product filter** - All queries in `fetch-sanity-content.js` add product clause
3. **Sanity product field** - All schemas get required product enum field
4. **Multi-build pipeline** - New `build-multi-product.js` orchestrates builds
5. **Separate deployments** - Each product deploys to its own Cloudflare Pages project

**Build Order:**
1. Sanity schema product field (foundation)
2. Fetch script product filter (data pipeline)
3. Multi-build pipeline (build orchestration)
4. Product configuration (branding)
5. Cloudflare Pages setup (deployment)
6. Auth0 integration (extends v5.0)
7. PostHog analytics (parallel)
8. Content seeding (GCSurge initial content)

**Key Integration Points:**
- `fetch-sanity-content.js` -> All GROQ queries modified
- `docusaurus.config.ts` -> Reads PRODUCT env var for branding
- `generate-sidebar-from-sanity.js` -> Filters by product
- Sanity schemas -> All add product field
- `Root.tsx` -> Auth0 + PostHog providers with product context

---

*Architecture research for: Multi-Product Knowledge Base*
*Researched: 2026-04-01*
```
