# Architecture Patterns: Docusaurus + Sanity CMS Integration

**Domain:** Headless CMS integration for static documentation site
**Researched:** 2026-03-06
**Confidence:** HIGH (Sanity API, Docusaurus plugin lifecycle, Cloudflare Pages hooks — all well-documented, stable patterns)

---

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTHORING PLANE                              │
│                                                                     │
│   ┌─────────────────┐      ┌──────────────────────────────────┐    │
│   │  Sanity Studio  │─────▶│  Sanity Cloud (Content Lake)     │    │
│   │  (web UI)       │ CRUD │  - GROQ query API                │    │
│   │  sanity.io/...  │      │  - CDN API (api.sanity.io/cdn)   │    │
│   └─────────────────┘      │  - Webhook delivery              │    │
│                             └──────────────┬─────────────────┘    │
└────────────────────────────────────────────│────────────────────────┘
                                             │ HTTP POST webhook
                                             │ (on document publish)
┌────────────────────────────────────────────▼────────────────────────┐
│                        BUILD PLANE                                  │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │  Cloudflare Pages Build                                      │  │
│   │                                                              │  │
│   │  1. Plugin: docusaurus-plugin-sanity                        │  │
│   │     └─ loadContent(): GROQ → fetch all docs from Sanity     │  │
│   │     └─ contentLoaded(): write MDX files to .sanity-cache/   │  │
│   │                                                              │  │
│   │  2. Docusaurus @plugin-content-docs reads:                  │  │
│   │     ├─ classic/docs/  (git MDX — legacy, being migrated)    │  │
│   │     └─ .sanity-cache/ (generated MDX from Sanity)           │  │
│   │                                                              │  │
│   │  3. Build produces static HTML into /build                  │  │
│   │                                                              │  │
│   │  4. Algolia crawler or docusaurus-search-algolia runs       │  │
│   │     and re-indexes from built HTML                           │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ Deploy
┌──────────────────────────────▼──────────────────────────────────────┐
│                       DELIVERY PLANE                                │
│                                                                     │
│   Cloudflare Pages CDN → docs.nxgen.cloud                          │
│   (static HTML, CSS, JS — fully cacheable, no server runtime)      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Owns | Communicates With |
|-----------|---------------|------|-------------------|
| **Sanity Studio** | Content authoring UI | Document editing, publish actions, media uploads | Sanity Content Lake (HTTPS/REST) |
| **Sanity Content Lake** | Content storage + API | GROQ query API, CDN API, webhook dispatch | Studio (inbound), Docusaurus build (outbound fetch), Cloudflare Pages (outbound webhook) |
| **docusaurus-plugin-sanity** | Content bridge | GROQ queries at build time, MDX file generation | Sanity API (inbound), Docusaurus lifecycle (outbound) |
| **Docusaurus build** | Site compilation | Static HTML generation, sidebar construction, routing | plugin-sanity (content), Cloudinary (images), Algolia (search config) |
| **Cloudflare Pages** | Hosting + CI | Build environment, deploy hook endpoint, CDN | Sanity webhook (inbound), built assets (outbound to CDN) |
| **Algolia** | Search index | Search index, query API | Docusaurus build (re-index on rebuild), DocSearch UI component (query-time) |
| **Cloudinary** | Image CDN | Image storage, transformation URLs | Docusaurus components (image URLs embedded in content) |

---

## Data Flow: Content Editor to Live Page

```
Editor action in Sanity Studio
        │
        │ (1) Editor writes content, sets status to Published
        ▼
Sanity Content Lake stores document
        │
        │ (2) Sanity fires HTTP POST webhook to:
        │     https://pages.cloudflare.com/api/v1/pages/hooks/{token}
        ▼
Cloudflare Pages receives webhook → triggers new build
        │
        │ (3) Build starts: node scripts/build-with-memory.js
        │     → docusaurus build
        │
        │ (4) docusaurus-plugin-sanity.loadContent() runs:
        │     GROQ query to api.sanity.io/cdn/v2024-01-01/data/query/{dataset}
        │     → returns all published documents for each content type
        │
        │ (5) plugin.contentLoaded():
        │     writes fetched content as .mdx files to .sanity-cache/
        │     (or directly injects via addRoute / createData)
        │
        │ (6) @docusaurus/plugin-content-docs processes:
        │     - .sanity-cache/ (Sanity-sourced docs)
        │     - classic/docs/  (remaining git-sourced docs)
        │     → generates sidebar, routes, page HTML
        │
        │ (7) Algolia crawler re-indexes built HTML
        │     (or: docsearch-scraper runs against deployed URL post-deploy)
        │
        ▼
Cloudflare Pages deploys static build → CDN propagation (~30s)
        │
        ▼
docs.nxgen.cloud serves updated content
```

**End-to-end publish latency:** ~2-4 minutes (Sanity publish → Cloudflare build ~90s → CDN propagation ~30s).

---

## Sanity Content Schema Design

Four content types map to the existing doc sections.

### Type 1: `doc` (Core Documentation)

Covers: getting-started, features, devices, admin-guide, operator-guide, installer-guide, platform-fundamentals, alarm-management, device-integration, reporting, troubleshooting, support.

```typescript
// schemas/doc.ts
{
  name: 'doc',
  title: 'Documentation Article',
  type: 'document',
  fields: [
    { name: 'title',           type: 'string',   validation: required },
    { name: 'slug',            type: 'slug',     options: { source: 'title' } },
    { name: 'description',     type: 'text',     rows: 2 },
    { name: 'section',         type: 'string',
      options: { list: ['getting-started','features','devices','admin-guide',
                         'operator-guide','installer-guide','platform-fundamentals',
                         'alarm-management','device-integration','reporting',
                         'troubleshooting','support'] }
    },
    { name: 'sidebarPosition', type: 'number' },
    { name: 'tags',            type: 'array', of: [{ type: 'string' }] },
    { name: 'body',            type: 'array', of: [{ type: 'block' }, { type: 'image' }, { type: 'code' }] },
    { name: 'lastUpdated',     type: 'date' },
  ]
}
```

### Type 2: `releaseNote` (Release Notes)

Covers: release-notes section. Versioned, date-stamped entries.

```typescript
// schemas/releaseNote.ts
{
  name: 'releaseNote',
  title: 'Release Note',
  type: 'document',
  fields: [
    { name: 'version',      type: 'string',  validation: required },  // e.g. "2026.01-A"
    { name: 'releaseDate',  type: 'date',    validation: required },
    { name: 'title',        type: 'string' },                          // e.g. "Sprint 2026.01-A Release"
    { name: 'slug',         type: 'slug',    options: { source: 'version' } },
    { name: 'summary',      type: 'text',    rows: 3 },
    { name: 'highlights',   type: 'array',   of: [{ type: 'string' }] },
    { name: 'body',         type: 'array',   of: [{ type: 'block' }] },
    { name: 'tags',         type: 'array',   of: [{ type: 'string' }] },
  ],
  orderings: [{ title: 'Release Date, Newest', by: [{ field: 'releaseDate', direction: 'desc' }] }]
}
```

### Type 3: `article` (Long-Form Knowledge Base / Breakthroughs)

Covers: knowledge-base, breakthroughs sections. More editorial, less structured.

```typescript
// schemas/article.ts
{
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string',  validation: required },
    { name: 'slug',        type: 'slug',    options: { source: 'title' } },
    { name: 'description', type: 'text',    rows: 2 },
    { name: 'category',    type: 'string',
      options: { list: ['knowledge-base', 'breakthroughs', 'internal'] }
    },
    { name: 'author',      type: 'string' },
    { name: 'publishedAt', type: 'date' },
    { name: 'featuredImage', type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'cloudinaryUrl', type: 'url' }]  // override with Cloudinary URL
    },
    { name: 'tags',        type: 'array',   of: [{ type: 'string' }] },
    { name: 'body',        type: 'array',   of: [{ type: 'block' }, { type: 'image' }, { type: 'code' }] },
  ]
}
```

### Type 4: `reference` (Glossary, Quick Reference, Compliance)

Covers: knowledge-base/glossary, knowledge-base/quick-reference, knowledge-base/compliance.

```typescript
// schemas/reference.ts
{
  name: 'reference',
  title: 'Reference Entry',
  type: 'document',
  fields: [
    { name: 'title',      type: 'string',  validation: required },
    { name: 'slug',       type: 'slug',    options: { source: 'title' } },
    { name: 'refType',    type: 'string',
      options: { list: ['glossary', 'quick-reference', 'compliance', 'faq'] }
    },
    { name: 'term',       type: 'string' },   // for glossary entries
    { name: 'definition', type: 'text' },     // for glossary entries
    { name: 'body',       type: 'array',  of: [{ type: 'block' }] },
    { name: 'tags',       type: 'array',  of: [{ type: 'string' }] },
  ]
}
```

### Shared: `blockContent` portable text configuration

Standard Sanity portable text with additions for documentation use:

```typescript
// schemas/blockContent.ts — custom marks and types
{
  name: 'blockContent',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: ['strong', 'em', 'code', 'underline', 'strike-through'],
        annotations: [
          { name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] },
          { name: 'internalLink', type: 'object', fields: [{ name: 'slug', type: 'string' }] },
        ]
      },
      styles: ['normal', 'h1', 'h2', 'h3', 'h4', 'blockquote'],
    },
    { type: 'image', options: { hotspot: true } },
    { type: 'code', options: { language: 'typescript', withFilename: true } },  // @sanity/code-input
  ]
}
```

---

## How Docusaurus Sources Content from Sanity

### Recommended Approach: Custom Docusaurus Plugin (MDX Generation Strategy)

Docusaurus does not have a first-party Sanity integration. Two approaches exist:

**Option A: Generate MDX files at build time** (recommended for this project)

A custom plugin runs in the Docusaurus `loadContent` lifecycle, fetches from Sanity, and writes `.mdx` files into a temp directory. The existing `@docusaurus/plugin-content-docs` instance then reads from that directory exactly as it reads from `classic/docs/`.

```typescript
// classic/plugins/docusaurus-plugin-sanity/index.ts
import { createClient } from '@sanity/client'
import { toMarkdown } from '@portabletext/to-markdown'
import fs from 'fs/promises'
import path from 'path'

export default function sanityCmsPlugin(context, options) {
  return {
    name: 'docusaurus-plugin-sanity',

    async loadContent() {
      const client = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET ?? 'production',
        apiVersion: '2024-01-01',
        useCdn: true,           // CDN API: fast reads, ~60s eventual consistency
        token: undefined,       // public read; no token needed for published content
      })

      const docs = await client.fetch(`*[_type == "doc" && !(_id in path("drafts.**"))] | order(sidebarPosition asc) { _id, title, slug, section, sidebarPosition, description, tags, body, lastUpdated }`)
      const releaseNotes = await client.fetch(`*[_type == "releaseNote"] | order(releaseDate desc) { _id, version, releaseDate, title, slug, summary, body }`)
      const articles = await client.fetch(`*[_type == "article"] | order(publishedAt desc) { _id, title, slug, category, description, body, tags, publishedAt }`)
      const references = await client.fetch(`*[_type == "reference"] | order(title asc) { _id, title, slug, refType, term, definition, body, tags }`)

      return { docs, releaseNotes, articles, references }
    },

    async contentLoaded({ content, actions }) {
      const cacheDir = path.join(context.siteDir, '.sanity-cache')
      await fs.mkdir(cacheDir, { recursive: true })

      // Write each doc as an MDX file with Docusaurus-compatible frontmatter
      for (const doc of content.docs) {
        const mdx = toDocusaurusMdx(doc)
        const filePath = path.join(cacheDir, doc.section, `${doc.slug.current}.mdx`)
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, mdx, 'utf8')
      }

      // Same for releaseNotes, articles, references...
    }
  }
}

function toDocusaurusMdx(doc) {
  const frontmatter = [
    '---',
    `title: "${doc.title.replace(/"/g, '\\"')}"`,
    doc.description ? `description: "${doc.description.replace(/"/g, '\\"')}"` : '',
    doc.sidebarPosition ? `sidebar_position: ${doc.sidebarPosition}` : '',
    doc.lastUpdated ? `last_updated: ${doc.lastUpdated}` : '',
    doc.tags?.length ? `tags:\n${doc.tags.map(t => `  - ${t}`).join('\n')}` : '',
    '---',
    '',
  ].filter(Boolean).join('\n')

  const body = toMarkdown(doc.body ?? [])
  return frontmatter + body
}
```

**Option B: addRoute / createData (in-memory injection)**

Use Docusaurus `addRoute` + `createData` to inject pages without writing files. Appropriate when content types don't map to standard docs hierarchy (e.g., custom landing pages). More complex; not recommended for the main doc sections which rely on sidebar auto-generation.

**Decision: Use Option A for docs/release-notes/articles/reference, Option B only for custom standalone pages (e.g., a /changelog landing page).**

### GROQ Query Design

Always filter draft documents out of build-time queries:

```groq
// Published-only filter (critical — drafts have _id prefixed with "drafts.")
*[_type == "doc" && !(_id in path("drafts.**"))]
```

Use the CDN API (`useCdn: true`) for build-time fetches. This hits Sanity's globally distributed read replica and is faster and cheaper. Eventual consistency (~60s) is acceptable since we control rebuild timing via webhook.

---

## Webhook Flow: Sanity Publish to Cloudflare Deploy

```
Sanity Studio: editor clicks "Publish"
        │
        │ Sanity fires webhook:
        │   POST https://pages.cloudflare.com/api/v1/pages/hooks/{deploy-hook-token}
        │   Content-Type: application/json
        │   Body: { _type, _id, eventType: "create"|"update"|"delete" }
        │
        ▼
Cloudflare Pages Deploy Hook endpoint
        │  (no authentication needed on Cloudflare side — token in URL is the secret)
        │
        ▼
Cloudflare Pages queues a new build
        │
        ▼
Build runs (identical to git-push triggered build):
  npm run build → node scripts/build-with-memory.js → docusaurus build
        │
        ▼
On success: new deployment activates on docs.nxgen.cloud
```

### Sanity Webhook Configuration (via Sanity MCP or Studio Settings)

```
Name: Cloudflare Pages Rebuild
URL: https://pages.cloudflare.com/api/v1/pages/hooks/[TOKEN]
Trigger on: publish
Document filter: _type in ["doc", "releaseNote", "article", "reference"]
Method: POST
Secret: [set in Cloudflare, verified via HMAC header in Cloudflare Worker if hardening is needed]
```

### Webhook Hardening (optional, phase 2)

For production security, add a Cloudflare Worker as a relay that:
1. Receives Sanity webhook with HMAC signature header (`sanity-webhook-signature`)
2. Verifies signature using shared secret
3. Forwards to Cloudflare Pages deploy hook only if valid

This prevents unauthorized deploys if the Cloudflare Pages hook URL leaks. Not required for initial integration — prioritize it if the site becomes publicly high-traffic.

---

## Algolia Re-indexing on Rebuild

Algolia DocSearch is configured in `docusaurus.config.ts` and already working. Re-indexing behavior depends on which Algolia plan is in use:

**Algolia DocSearch (free tier — current setup):**
- Algolia's crawler re-indexes on a schedule (daily) OR can be triggered manually via Algolia dashboard
- The crawler hits the live URL (`docs.nxgen.cloud`) after deploy completes
- No code change needed — crawler runs independently of build
- Limitation: index lags behind by up to 24h without manual trigger

**Algolia Crawler API (paid or DocSearch Pro):**
- Trigger re-crawl via HTTP POST to crawler API after each Cloudflare deploy
- Can be done in a Cloudflare Pages build hook (post-deploy step)

**Recommended action for this project:** Keep existing DocSearch crawler as-is for initial Sanity integration. Add a post-deploy Algolia crawler trigger as a follow-up if search freshness becomes an issue.

---

## Build Order Dependencies

This is the strict dependency graph. Each item requires all items above it to exist.

```
Level 0 — Prerequisites (must exist before any other work):
  ├── Sanity project created (projectId, dataset)
  ├── SANITY_PROJECT_ID env var set in Cloudflare Pages
  └── SANITY_DATASET env var set in Cloudflare Pages

Level 1 — Schema (defines the data contract):
  ├── Sanity schemas defined and deployed to Content Lake
  │   (doc, releaseNote, article, reference, blockContent)
  └── Sanity Studio deployed and accessible (for content team)

Level 2 — Content Bridge (build-time fetching):
  ├── docusaurus-plugin-sanity written and registered in docusaurus.config.ts
  ├── @sanity/client installed in classic/package.json
  ├── @portabletext/to-markdown installed (portable text → MDX conversion)
  └── .sanity-cache/ added to .gitignore

Level 3 — Build Verification:
  ├── Local build succeeds with Sanity content (npm run build in classic/)
  └── At least one test document in Sanity renders correctly

Level 4 — Cloudflare Integration:
  ├── Cloudflare Pages deploy hook created (generates token URL)
  ├── Sanity webhook configured pointing to Cloudflare hook URL
  └── End-to-end test: publish in Studio → verify Cloudflare build triggers

Level 5 — Content Migration:
  ├── Existing MDX files imported into Sanity (migration script)
  ├── Git-sourced docs deprecated (docs path redirected to Sanity-sourced)
  └── URL continuity verified (all existing /docs/... paths still resolve)
```

---

## Migration Strategy: MDX Files into Sanity

### Phase A: Parallel operation (zero risk)

During integration, run both sources simultaneously:
- Git MDX files continue to serve existing docs at existing URLs
- Sanity plugin writes to `.sanity-cache/` which feeds a NEW doc instance (`id: 'sanity-docs'`)
- New Sanity docs appear at `/sanity-docs/...` initially — invisible to end users, verifiable by team

This allows testing the Sanity pipeline without touching production URLs.

### Phase B: Section-by-section migration

Migrate one section at a time, not all content at once:

```
Recommended order:
1. release-notes     — low volume, structured, easiest to migrate
2. knowledge-base    — reference-style, simpler body content
3. getting-started   — high traffic, verify carefully before cutover
4. features/devices  — largest sections, migrate last
```

For each section:
1. Run migration script: read MDX frontmatter + body → create Sanity document via API
2. Verify rendered output matches original (visual diff)
3. Switch Docusaurus plugin config to serve that section from `.sanity-cache/` instead of `classic/docs/`
4. Remove original MDX file from git (or archive to `docs-backup/`)

### Migration Script Pattern

```typescript
// scripts/migrate-to-sanity.ts
import { createClient } from '@sanity/client'
import { fromMarkdown } from 'mdast-util-from-markdown'
import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,  // write token only needed for migration
  useCdn: false,
})

async function migrateMdxFile(filePath: string, section: string) {
  const raw = await fs.readFile(filePath, 'utf8')
  const { data: frontmatter, content } = matter(raw)

  // Convert markdown body to Sanity portable text blocks
  // (use @portabletext/to-markdown in reverse: markdown → blocks)
  // or use 'sanity-markdown-to-blocks' package

  const doc = {
    _type: 'doc',
    title: frontmatter.title,
    slug: { _type: 'slug', current: path.basename(filePath, '.mdx') },
    section,
    sidebarPosition: frontmatter.sidebar_position,
    description: frontmatter.description,
    tags: frontmatter.tags ?? [],
    lastUpdated: frontmatter.last_updated,
    body: convertMarkdownToPortableText(content),
  }

  return client.create(doc)
}
```

### MDX Components Handling

Current MDX files use inline JSX extensively (custom `<section>`, `<div>`, layout components). Sanity portable text does not natively store JSX.

**Strategy for JSX-heavy files:**
- Store raw MDX as a `text` field in Sanity as a transitional approach
- Render it via `@mdx-js/mdx` in the plugin's contentLoaded step
- Gradually replace JSX-heavy sections with portable text + standard Docusaurus admonitions
- Target state: no JSX in Sanity content; all formatting via portable text marks and block types

This is the highest-effort part of migration and should be scoped per section.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Runtime API Calls from Browser

**What:** Fetching from Sanity API at page load time (client-side)
**Why bad:** Exposes project credentials, breaks offline/CDN use, kills search indexing, defeats static site benefits
**Instead:** All Sanity fetches in `loadContent()` — build time only. Pages are static HTML.

### Anti-Pattern 2: Using Draft Documents in Build

**What:** Omitting `!(_id in path("drafts.**"))` from GROQ queries
**Why bad:** Unpublished draft content appears on live site
**Instead:** Always filter drafts. Sanity separates drafts (`drafts.{id}`) from published (`{id}`) at the ID level.

### Anti-Pattern 3: Direct Docusaurus Docs Path Pointing to Sanity Cache

**What:** Configuring `path: '.sanity-cache'` as the only docs path while content is still being migrated
**Why bad:** Any GROQ failure or Sanity API outage during build = empty docs site
**Instead:** Run parallel paths during transition; add build-time guard that fails hard if Sanity returns zero documents.

```typescript
if (content.docs.length === 0) {
  throw new Error('Sanity returned 0 docs — aborting build to prevent empty deploy')
}
```

### Anti-Pattern 4: Hardcoding Sanity Project ID

**What:** `projectId: 'abc123'` in source code
**Why bad:** Leaks project info; can't change without code deploy; fails in CI without env setup
**Instead:** `process.env.SANITY_PROJECT_ID` always. Set in Cloudflare Pages environment variables and local `.env`.

### Anti-Pattern 5: Single Monolithic GROQ Query

**What:** One massive GROQ query fetching all content types and all fields
**Why bad:** Slow, fragile, hard to debug, fetches unused fields
**Instead:** One GROQ query per content type, projection-optimized (fetch only fields actually used).

---

## Scalability Considerations

| Concern | Current scale (~200 docs) | At 2,000 docs | At 20,000 docs |
|---------|--------------------------|---------------|----------------|
| GROQ query speed | <1s per type | 2-5s total | Use pagination with `[0..500]` slices |
| Build time | ~90s | ~120s | Consider incremental builds (Docusaurus 4 roadmap) |
| Sanity CDN cache freshness | 60s lag acceptable | 60s lag acceptable | Use Live API for instant freshness if needed |
| Algolia index size | Fine | Fine | DocSearch limits apply; evaluate Algolia Crawler plan |

---

## Environment Variables Required

| Variable | Where Set | Purpose |
|----------|-----------|---------|
| `SANITY_PROJECT_ID` | Cloudflare Pages + local `.env` | Identifies Sanity project |
| `SANITY_DATASET` | Cloudflare Pages + local `.env` | `production` or `staging` |
| `SANITY_WRITE_TOKEN` | Local `.env` only (migration only) | Write access for migration script; never in CF |
| `ALGOLIA_APP_ID` | Already set in CF | Existing |
| `ALGOLIA_API_KEY` | Already set in CF | Existing |
| `CLOUDINARY_CLOUD_NAME` | Already set in CF | Existing |

---

## Docusaurus Config Changes Required

```typescript
// docusaurus.config.ts additions

plugins: [
  // NEW: Sanity content bridge
  ['./plugins/docusaurus-plugin-sanity', {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET ?? 'production',
    cacheDir: '.sanity-cache',
  }],

  // EXISTING: plugin-content-docs for default docs instance
  // ADD: path includes .sanity-cache subdirs per section
  // (or run as separate docs instance during migration)

  // REMOVE (dead weight — Phase 1 cleanup):
  // storyblok, hygraph, strapi, payload integrations
],
```

---

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Docusaurus plugin lifecycle (loadContent/contentLoaded) | HIGH | Docusaurus 3.x official docs, stable since v2 |
| Sanity GROQ API + CDN API | HIGH | Sanity official docs, widely used pattern |
| Cloudflare Pages deploy hooks | HIGH | Cloudflare Pages official docs, standard feature |
| @portabletext/to-markdown conversion | MEDIUM | Package exists and is maintained; JSX conversion complexity is real |
| Algolia re-indexing behavior | MEDIUM | Depends on DocSearch plan tier; crawler schedule not under our control |
| Migration script: markdown → portable text | LOW-MEDIUM | Lossy conversion for JSX-heavy MDX; needs per-file verification |

---

## Sources

- Docusaurus Plugin Lifecycle: https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis (loadContent, contentLoaded)
- Sanity GROQ API: https://www.sanity.io/docs/groq
- Sanity CDN API: https://www.sanity.io/docs/api-cdn
- Sanity Webhooks: https://www.sanity.io/docs/webhooks
- Cloudflare Pages Deploy Hooks: https://developers.cloudflare.com/pages/configuration/deploy-hooks/
- @portabletext/to-markdown: https://github.com/portabletext/to-markdown
- @sanity/client: https://www.sanity.io/docs/js-client
- Sanity draft document filtering: https://www.sanity.io/docs/drafts (published docs have no "drafts." prefix)
