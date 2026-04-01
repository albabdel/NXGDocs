# Stack Research

**Domain:** Multi-product knowledge base architecture
**Milestone:** Multi-product capabilities (Auth0, PostHog, separate domains)
**Researched:** 2026-04-01
**Confidence:** HIGH

---

## Overview

This research covers **NEW stack additions** for multi-product capabilities. The existing stack (Docusaurus 3.9.2, Sanity, Cloudflare Pages, Cloudinary, docusaurus-search-local) remains unchanged and is not re-researched here.

**What's already in place (from keys.md):**
- PostHog Project ID: 365239
- PostHog Token: `phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS`
- PostHog Host: `https://us.i.posthog.com`
- Sanity Project ID: `fjjuacab`
- Cloudflare Pages domains: `gcxone.pages.dev`

---

## Recommended Stack Additions

### Core Libraries

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@auth0/auth0-react` | 2.16.1 | Auth0 authentication for external users | Official Auth0 React SDK, handles PKCE flow automatically, provides hooks (`useAuth0`) and HOCs (`withAuthenticationRequired`) that integrate cleanly with Docusaurus's React architecture |
| `posthog-js` | 1.364.4 | Core analytics SDK | Official PostHog JavaScript library, project token already exists, supports product tracking via `group()` and person properties |
| `@posthog/react` | 1.8.2 | React integration for PostHog | Provides `PostHogProvider` context and hooks (`usePostHog`, `useFeatureFlagEnabled`), cleaner integration than raw posthog-js in React/Docusaurus apps |

### Infrastructure

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Auth0 Tenant | External user authentication | Create new application in Auth0 dashboard, configure callback URLs for each product domain |
| PostHog Project | Product analytics | **Already exists** — Project ID: 365239 |
| Cloudflare Pages | Multi-domain hosting | Create separate Pages projects for each product domain |

### Sanity Schema Additions

| Field | Type | Purpose | Notes |
|-------|------|---------|-------|
| `product` | string | Filter content by product | Add to all content types needing product-specific filtering. Use string values like `"product-a"`, `"product-b"` for simple filtering |

---

## Integration Points

### 1. Auth0 + Docusaurus

**Approach:** Swizzle the Root component to wrap with `Auth0Provider`

```typescript
// src/theme/Root.tsx
import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import Root from '@theme-original/Root';

export default function RootWrapper(props) {
  return (
    <Auth0Provider
      domain={process.env.AUTH0_DOMAIN}
      clientId={process.env.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Root {...props} />
    </Auth0Provider>
  );
}
```

**Configuration needed:**
- Auth0 domain and client ID (create in Auth0 dashboard)
- Allowed callback URLs: each product domain
- Allowed logout URLs: each product domain

**Multi-domain considerations:**

| Approach | When to Use | Trade-offs |
|----------|-------------|------------|
| Single Auth0 app, `cookieDomain: '.nxgen.cloud'` | Products share parent domain | Simpler config, shared session, SSO across products |
| Separate Auth0 apps per product | Products have different user bases | More isolation, different client IDs, separate auth per domain |

**Recommendation:** Single Auth0 application with parent domain cookie if products are under `*.nxgen.cloud` subdomains.

### 2. PostHog + Docusaurus

**Approach:** Initialize PostHog in swizzled Root, wrap with `PostHogProvider`

```typescript
// src/theme/Root.tsx
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import React from 'react';
import Root from '@theme-original/Root';

// Initialize with existing token from keys.md
if (typeof window !== 'undefined') {
  posthog.init('phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-01-30',
  });
}

export default function RootWrapper(props) {
  return (
    <PostHogProvider client={posthog}>
      <Root {...props} />
    </PostHogProvider>
  );
}
```

**Product tracking:** Use `posthog.group('product', 'product-a')` to tag events with product context. Call this on page load or route change.

**Usage in components:**

```typescript
import { usePostHog } from '@posthog/react';

function SomeComponent() {
  const posthog = usePostHog();
  
  useEffect(() => {
    posthog?.group('product', process.env.PRODUCT_NAME);
  }, [posthog]);
  
  return <div>...</div>;
}
```

### 3. Multi-Build Pipeline for Separate Product Domains

**Approach:** Use Docusaurus multi-instance plugin pattern OR multiple config files

#### Option A: Multi-Instance Plugins (Same Build)

```javascript
// docusaurus.config.js
export default {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'product-a',
        path: 'docs/product-a',
        routeBasePath: '/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'product-b',
        path: 'docs/product-b',
        routeBasePath: '/',
      },
    ],
  ],
};
```

**Limitation:** This creates `/product-a/...` and `/product-b/...` routes on the same domain. Not ideal for separate product domains.

#### Option B: Multiple Config Files + Separate Builds (Recommended for separate domains)

```javascript
// docusaurus.config.product-a.js
export default {
  title: 'Product A Docs',
  url: 'https://product-a.nxgen.cloud',
  baseUrl: '/',
  presets: [
    ['@docusaurus/preset-classic', {
      docs: {
        id: 'default',
        path: 'docs/product-a',
        routeBasePath: '/',
      },
    }],
  ],
  customFields: {
    product: 'product-a',
    sanityFilter: 'product == "product-a"',
  },
};
```

```json
// package.json
{
  "scripts": {
    "build:product-a": "docusaurus build --config docusaurus.config.product-a.js --out-dir build/product-a",
    "build:product-b": "docusaurus build --config docusaurus.config.product-b.js --out-dir build/product-b"
  }
}
```

**Cloudflare Pages setup:**
- Project `product-a-docs`: Build command `npm run build:product-a`, output `build/product-a`
- Project `product-b-docs`: Build command `npm run build:product-b`, output `build/product-b`

### 4. Sanity Content Filtering by Product

**Schema change:** Add `product` field to content types

```typescript
// studio/schemaTypes/doc.ts
export default defineType({
  name: 'doc',
  type: 'document',
  fields: [
    // ... existing fields
    defineField({
      name: 'product',
      type: 'string',
      options: {
        list: [
          { title: 'Product A', value: 'product-a' },
          { title: 'Product B', value: 'product-b' },
        ],
      },
    }),
  ],
});
```

**GROQ filtering:**

```groq
# Get all docs for Product A
*[_type == "doc" && product == "product-a"]

# Parameterized query (pass $product from build config)
*[_type == "doc" && product == $product]

# With joins
*[_type == "doc" && product == "product-a"]{
  title,
  slug,
  "category": category->{title, slug}
}
```

**Fetch script integration:** Pass product filter from config to GROQ query

```javascript
// In fetch-sanity-content.js
const product = process.env.PRODUCT || 'default';
const query = `*[_type == "doc" && product == "${product}"] { ... }`;
```

---

## Installation

```bash
# Authentication
npm install @auth0/auth0-react

# Analytics (PostHog project already exists, just need SDK)
npm install posthog-js @posthog/react

# Type definitions (optional)
npm install -D @posthog/types
```

**Environment variables:**

```env
# Auth0 (create new application in dashboard)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id

# PostHog (already have from keys.md)
POSTHOG_TOKEN=phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS
POSTHOG_HOST=https://us.i.posthog.com

# Multi-product build (set per Cloudflare Pages project)
PRODUCT=product-a
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not Alternative |
|-------------|-------------|---------------------|
| `@auth0/auth0-react` | `@auth0/auth0-spa-js` | SPA SDK is lower-level; React SDK provides hooks and context for cleaner Docusaurus integration |
| `@auth0/auth0-react` | Clerk, Supabase Auth | Auth0 consistency with existing v2.0 admin (Zoho OAuth via Auth0) |
| `@posthog/react` | Raw `posthog-js` | React SDK provides hooks (`usePostHog`, `useFeatureFlagEnabled`) easier to use in components |
| Single dataset + product field | Multiple Sanity datasets | Single dataset is simpler, allows shared content, easier migrations |
| Multiple config files | Multi-instance plugins in single build | Multi-instance creates paths on same domain; separate configs deploy to separate domains |
| Client-side Auth0Provider | Server-side auth checks | Docusaurus is static; server-side auth requires Cloudflare Workers/Functions complexity |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Multiple Sanity datasets per product | Adds complexity: separate tokens, duplicated schemas, migrations on each, shared content requires duplication | Single dataset with `product` field |
| Auth0 SPA SDK directly | More boilerplate, manual state management, no React context | `@auth0/auth0-react` |
| Google Analytics | PostHog already in use, provides feature flags and session replay in one tool | PostHog |
| Separate git repos per product | Duplicate components/themes/config, maintenance nightmare | Multiple Docusaurus configs in one repo |
| Build-time auth checks | Docusaurus is static; can't validate auth during build | Client-side `Auth0Provider` wrapper |
| `docusaurus-search-local` per product | Search index would be built per product anyway | Existing search works; index is per-build |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@auth0/auth0-react@2.x` | React 16.8+ | Docusaurus 3.9.2 uses React 18 — compatible |
| `posthog-js@1.364.x` | All modern browsers | Works with `@posthog/react` as peer |
| `@posthog/react@1.8.x` | React 16.8+ | Requires posthog-js as peer dependency |
| Docusaurus 3.9.2 | Node 18+ | Cloudflare Pages supports Node 18+ |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Sanity CMS (fjjuacab)                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Documents with product field:                               │   │
│  │  - doc { product: "product-a", ... }                         │   │
│  │  - doc { product: "product-b", ... }                         │   │
│  │  - roadmapItem { product: "product-a", ... }                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ Webhook on publish
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Cloudflare Pages Builds                          │
│  ┌─────────────────────────┐    ┌─────────────────────────┐        │
│  │  Product A Build        │    │  Product B Build        │        │
│  │  PRODUCT=product-a      │    │  PRODUCT=product-b      │        │
│  │  docusaurus.config.a.js │    │  docusaurus.config.b.js │        │
│  │  GROQ: product=="a"     │    │  GROQ: product=="b"     │        │
│  └───────────┬─────────────┘    └───────────┬─────────────┘        │
└──────────────┼─────────────────────────────┼──────────────────────┘
               ▼                             ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │ product-a.pages.dev  │      │ product-b.pages.dev  │
    │ docs.product-a.cloud │      │ docs.product-b.cloud │
    └──────────┬───────────┘      └──────────┬───────────┘
               │                              │
               │   ┌──────────────────────────┼──────────────────┐
               │   │                          │                  │
               ▼   ▼                          ▼                  ▼
    ┌──────────────────────┐     ┌──────────────────────────────────┐
    │   Auth0 Provider     │     │        PostHog Analytics         │
    │   (client-side)      │     │  Project: 365239                 │
    │                      │     │  group('product', 'product-a')   │
    │  - loginWithRedirect │     │  group('product', 'product-b')  │
    │  - getUser           │     │                                  │
    │  - withAuthRequired  │     │  Host: us.i.posthog.com          │
    └──────────────────────┘     └──────────────────────────────────┘
```

---

## Cloudflare Pages Multi-Build Configuration

**Project creation:**

```bash
# Product A
wrangler pages project create product-a-docs
wrangler pages deploy build/product-a --project-name=product-a-docs

# Product B  
wrangler pages project create product-b-docs
wrangler pages deploy build/product-b --project-name=product-b-docs
```

**Build settings per project:**

| Setting | Product A | Product B |
|---------|-----------|-----------|
| Build command | `npm run build:product-a` | `npm run build:product-b` |
| Build output | `build/product-a` | `build/product-b` |
| Environment | `PRODUCT=product-a` | `PRODUCT=product-b` |
| Domain | `docs.product-a.nxgen.cloud` | `docs.product-b.nxgen.cloud` |

**Sanity webhook configuration:**

Trigger builds for affected products when content changes. Use Sanity webhook with GROQ projection to determine which products are affected:

```groq
// In webhook payload
{
  "affectedProducts": *[_id in $ids].product
}
```

---

## Sources

- **Auth0 React SDK** — https://auth0.com/docs/libraries/auth0-react (HIGH confidence - official docs)
- **PostHog JS SDK** — https://posthog.com/docs/libraries/js (HIGH confidence - official docs)
- **PostHog React SDK** — https://posthog.com/docs/libraries/react (HIGH confidence - official docs)
- **Docusaurus Multi-Instance** — https://docusaurus.io/docs/using-plugins#multi-instance-plugins (HIGH confidence - official docs)
- **Sanity GROQ Cheat Sheet** — https://www.sanity.io/docs/query-cheat-sheet (HIGH confidence - official docs)
- **Cloudflare Pages Deployment** — https://docusaurus.io/docs/deployment#deploying-to-cloudflare-pages (HIGH confidence - official docs)
- **keys.md** — PostHog credentials, Sanity project ID (HIGH confidence - project file)
- **npm registry** — Package versions verified via `npm view` (HIGH confidence - live data)

---

*Stack research for: Multi-product knowledge base architecture*
*Researched: 2026-04-01*
