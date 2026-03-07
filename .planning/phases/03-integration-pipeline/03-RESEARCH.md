# Phase 3: Integration Pipeline - Research

**Researched:** 2026-03-07
**Domain:** Sanity GROQ + Docusaurus custom plugin + Cloudflare Pages deploy hooks + Cloudflare Workers validation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**targetAudience route mapping:**
- `targetAudience: ["all"]` → content goes to main `docs/` directory only (rendered at `/docs/...`)
- `targetAudience: ["admin"]` → content goes to `docs-admin/` only (rendered at `/role-admin/...`)
- `targetAudience: ["manager"]` → `docs-manager/` only (rendered at `/manager/...`)
- `targetAudience: ["operator"]` → `docs-operator/` only (rendered at `/operator/...`)
- `targetAudience: ["operator-minimal"]` → `docs-operator-minimal/` only (rendered at `/operator-minimal/...`)
- `targetAudience: ["internal"]` → `docs-internal/` only (rendered at `/internal/...`)
- Multi-value arrays (e.g., `["admin", "manager"]`) → content written to each applicable directory
- No duplication of content across the main `/docs/` route and role-specific routes — content lives in exactly the audience-appropriate location(s)

**MDX component scope (Phase 3 plugin):**
- Phase 3 handles standard Portable Text blocks only: paragraphs, headings (h2–h4), lists, blockquote, code blocks (with language), inline marks (bold, italic, underline, code, link), images, tables, and callout/admonition blocks
- `<Tabs>`, `<Steps>`, `<CardGrid>` custom block rendering is deferred to Phase 4
- Phase 3 plugin does not need a Portable Text → JSX serializer for these components
- Callout/admonition blocks from Portable Text should map to Docusaurus `:::note`, `:::tip`, `:::warning`, `:::danger` syntax in the generated MDX

**Plugin output strategy:**
- Plugin writes generated MDX files to `.sanity-cache/` at build time — Docusaurus `plugin-content-docs` instances then read from those directories
- Cache directory is git-ignored (build artifact, not source)
- Generated files must preserve the `slug` field from Sanity as the file path to maintain URL continuity
- The plugin is a custom Docusaurus plugin (in `classic/plugins/`) following the existing `docusaurus-plugin-last-update` pattern

**Build resilience:**
- Hard-fail: if Sanity API is unreachable at build time, the build fails and Cloudflare Pages does not deploy
- The plugin should log a clear error message identifying which GROQ query failed

**Deploy hook (INTG-02):**
- Set up Cloudflare Pages deploy hook URL and register it as a Sanity webhook (via Sanity MCP or dashboard)
- Webhook triggers on document publish events for all four content types (doc, releaseNote, article, referencePage)
- No custom webhook server needed — Cloudflare Pages has native deploy hook URLs

**Feedback widget verification (INTG-03):**
- `classic/functions/page-feedback.ts` is complete — no new code required
- Phase 3 task: confirm `ZEPTO_API_KEY` is set in Cloudflare Pages environment variables (production)
- Smoke-test the deployed function endpoint to verify it returns 200 and sends email
- Verify no legacy function files remain (Vercel `api/` or Netlify `netlify/functions/` formats)

**GROQ field contract:**
- All Phase 3 queries must use `_type == 'referencePage'` (not `reference`)
- Env vars available in Cloudflare Pages build: `SANITY_PROJECT_ID`, `SANITY_DATASET` (= `production`), `SANITY_API_TOKEN`

### Claude's Discretion
- Exact Sanity JS client version and import style (`@sanity/client` vs `next-sanity`)
- Whether the plugin uses a single GROQ query per content type or a combined query
- Exact `.sanity-cache/` subdirectory structure (e.g., `sanity-cache/docs/`, `sanity-cache/docs-admin/`)
- Error boundary: whether to catch per-document errors or fail the entire query on first error

### Deferred Ideas (OUT OF SCOPE)
- `<Tabs>`, `<Steps>`, `<CardGrid>` Portable Text → MDX rendering — Phase 4
- Incremental builds (only re-fetch changed documents) — v2
- Sanity webhook HMAC signature verification — v2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INTG-01 | Custom Docusaurus plugin fetches content from Sanity at build time via GROQ and generates MDX files — Docusaurus renders them as normal pages | Covered by: @sanity/client v6 GROQ fetching, Docusaurus plugin lifecycle (loadContent runs before docs plugin reads), @portabletext/markdown for serialization, .sanity-cache/ directory strategy |
| INTG-02 | Sanity publish event triggers Cloudflare Pages rebuild via deploy hook — live site updates within minutes of clicking publish in Studio | Covered by: Cloudflare Pages deploy hook URL creation (dashboard → Settings → Builds → Add deploy hook), Sanity webhook configuration (POST method, GROQ filter `_type in ["doc","releaseNote","article","referencePage"]`) |
| INTG-03 | Feedback widget rewritten to use `fetch()` to an HTTP email API — works on Cloudflare Workers | Already complete in `classic/functions/page-feedback.ts`; Phase 3 task is verification only — confirm ZEPTO_API_KEY env var, smoke-test endpoint, confirm no Vercel/Netlify files remain |
</phase_requirements>

---

## Summary

Phase 3 has three deliverables. The core work (INTG-01) is a custom Docusaurus plugin — `docusaurus-plugin-sanity-content` — that runs as the first step of `npm run build`, fetches all published documents from Sanity via GROQ using `@sanity/client`, serializes Portable Text to MDX using `@portabletext/markdown`, and writes the resulting `.mdx` files into `.sanity-cache/` subdirectories before `plugin-content-docs` reads them. The second deliverable (INTG-02) is a Cloudflare Pages deploy hook wired to a Sanity GROQ-powered webhook — no custom server is required; Cloudflare provides the POST URL natively and Sanity sends a POST request to it on every publish event. The third deliverable (INTG-03) is already coded in `classic/functions/page-feedback.ts`; Phase 3 only needs to verify the `ZEPTO_API_KEY` env var is set in Cloudflare Pages production settings and smoke-test the live endpoint.

The critical architectural insight is **plugin execution order**: the custom Sanity plugin must be listed **before** the `plugin-content-docs` instances in `docusaurus.config.ts` so that `.sanity-cache/` directories are populated before Docusaurus tries to read them. The `.sanity-cache/` directory must be added to the root `.gitignore` (not yet present there) and to `classic/.gitignore`. The `plugin-content-docs` `path` configuration for each audience instance must be updated to point to the `.sanity-cache/` subdirectory rather than the existing `docs/`, `docs-admin/`, etc. directories — but only for documents sourced from Sanity; existing MDX files remain in their current directories and continue to be served without change (the two sets coexist in the same `plugin-content-docs` instance via multiple source paths, or Sanity-generated files are placed alongside existing MDX).

**Primary recommendation:** Use `@sanity/client` v6 (the studio already depends on `sanity` v5 which ships it), install `@portabletext/markdown` in `classic/`, write the plugin in CommonJS (`.js`) matching the `docusaurus-plugin-last-update` pattern, place it first in the `plugins` array, and use four separate GROQ queries (one per content type) for clarity and targeted error messages.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@sanity/client` | ^6.x (latest ~7.14) | Fetch documents from Sanity Content Lake via GROQ | Official Sanity JS client; ships with the `sanity` package the studio already uses; works in Node.js build environments |
| `@portabletext/markdown` | ^1.1.2 | Serialize Portable Text JSON → Markdown/MDX string | Official portabletext-org package; handles all standard block types; supports custom type renderers for callouts; bidirectional |
| Node.js `fs` (built-in) | — | Write generated MDX files to `.sanity-cache/` | No extra dependency; synchronous file writes are safe inside plugin `loadContent` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@sanity/client` `createClient()` | same as above | Instantiate a single configured client; call `.fetch()` per content type | Always — one client instance shared across all four GROQ queries |
| Cloudflare Pages deploy hook | Native CF feature | POST URL that triggers a Pages rebuild | INTG-02 only — no npm package needed |
| Sanity Dashboard / MCP webhook config | N/A | Register the CF Pages URL as a Sanity webhook | INTG-02 only |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@sanity/client` (direct) | `next-sanity` | `next-sanity` is a wrapper for Next.js-specific features (ISR, live preview); the project uses Docusaurus, not Next.js — `@sanity/client` is the correct choice |
| `@portabletext/markdown` | Manual serializer | Manual code would need to replicate table, image, code-block, callout handling; `@portabletext/markdown` covers all Phase 3 block types with custom renderers for gaps |
| Single combined GROQ query | Four separate queries | A combined query loses the ability to log which type failed; four queries let the plugin report exactly which content type caused a Sanity API failure |
| `fs.writeFileSync` in `loadContent` | `addRoute()` / `createData()` | `addRoute` creates React-rendered pages, not MDX files in a directory; writing files with `fs` is the only way to make `plugin-content-docs` (autogenerated sidebar) pick them up |

**Installation (in `classic/` directory):**
```bash
npm install @sanity/client @portabletext/markdown
```

---

## Architecture Patterns

### Recommended Project Structure

```
classic/
├── plugins/
│   ├── docusaurus-plugin-last-update/     # existing pattern
│   │   └── index.js
│   └── docusaurus-plugin-sanity-content/  # NEW Phase 3 plugin
│       └── index.js
├── .sanity-cache/                          # git-ignored, build artifact
│   ├── docs/                              # targetAudience: ["all"]
│   │   └── {slug}.mdx
│   ├── docs-admin/                        # targetAudience: ["admin"]
│   │   └── {slug}.mdx
│   ├── docs-manager/
│   ├── docs-operator/
│   ├── docs-operator-minimal/
│   └── docs-internal/
├── docs/                                  # existing MDX (untouched in Phase 3)
├── docs-admin/                            # existing MDX (untouched in Phase 3)
└── docusaurus.config.ts                   # plugin listed FIRST before plugin-content-docs
```

### Pattern 1: Custom Docusaurus Plugin with `loadContent` for File Generation

**What:** The plugin's `loadContent()` lifecycle method executes before any `plugin-content-docs` instance loads. It uses this window to fetch all Sanity documents and write `.mdx` files to `.sanity-cache/`. The `plugin-content-docs` instances then find those files on disk and include them in their autogenerated sidebars.

**When to use:** Any time you need to generate MDX content from an external CMS before Docusaurus's content discovery runs.

**Critical ordering requirement:** The custom plugin **must be listed before** the `plugin-content-docs` instances in `docusaurus.config.ts`. Docusaurus executes `loadContent()` calls in plugins-array order.

**Example:**
```javascript
// classic/plugins/docusaurus-plugin-sanity-content/index.js
// Source: pattern from classic/plugins/docusaurus-plugin-last-update/index.js + Docusaurus lifecycle API

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { portableTextToMarkdown } = require('@portabletext/markdown');

// Audience → cache subdirectory mapping (locked decision from CONTEXT.md)
const AUDIENCE_DIR_MAP = {
  'all':              'docs',
  'admin':            'docs-admin',
  'manager':          'docs-manager',
  'operator':         'docs-operator',
  'operator-minimal': 'docs-operator-minimal',
  'internal':         'docs-internal',
};

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-sanity-content',

    async loadContent() {
      const projectId = process.env.SANITY_PROJECT_ID;
      const dataset  = process.env.SANITY_DATASET || 'production';
      const token    = process.env.SANITY_API_TOKEN;

      if (!projectId || !token) {
        throw new Error(
          '[sanity-content] Missing SANITY_PROJECT_ID or SANITY_API_TOKEN env vars'
        );
      }

      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2025-02-06',  // hard-coded per Sanity docs requirement
        useCdn: false,              // bypass CDN for fresh data at build time
        token,
      });

      // Ensure .sanity-cache/ subdirs exist
      const cacheRoot = path.join(context.siteDir, '.sanity-cache');
      for (const dir of Object.values(AUDIENCE_DIR_MAP)) {
        fs.mkdirSync(path.join(cacheRoot, dir), { recursive: true });
      }

      // Four separate queries for four content types
      // Hard-fail on Sanity API error (build resilience decision)
      const contentTypes = [
        { type: 'doc',           query: `*[_type == "doc" && defined(slug.current)] | order(sidebarPosition asc)` },
        { type: 'releaseNote',   query: `*[_type == "releaseNote" && defined(slug.current)] | order(publishedAt desc)` },
        { type: 'article',       query: `*[_type == "article" && defined(slug.current)] | order(publishedAt desc)` },
        { type: 'referencePage', query: `*[_type == "referencePage" && defined(slug.current)]` },
      ];

      for (const { type, query } of contentTypes) {
        let docs;
        try {
          docs = await client.fetch(query);
        } catch (err) {
          throw new Error(
            `[sanity-content] GROQ query failed for type "${type}": ${err.message}`
          );
        }

        for (const doc of docs) {
          const mdxContent = buildMDX(doc, type);
          const audiences = doc.targetAudience?.length ? doc.targetAudience : ['all'];

          for (const audience of audiences) {
            const subDir = AUDIENCE_DIR_MAP[audience];
            if (!subDir) continue; // unknown audience value — skip
            const filePath = path.join(cacheRoot, subDir, `${doc.slug.current}.mdx`);
            fs.writeFileSync(filePath, mdxContent, 'utf8');
          }
        }
      }

      return null; // loadContent return value unused — files are on disk
    },
  };
};

function buildMDX(doc, type) {
  const frontmatter = buildFrontmatter(doc, type);
  const body = doc.body ? serializeBody(doc.body) : '';
  return `${frontmatter}\n\n${body}\n`;
}

function buildFrontmatter(doc, type) {
  const lines = ['---', `title: "${escapeYaml(doc.title)}"`];
  if (doc.sidebarPosition != null) lines.push(`sidebar_position: ${doc.sidebarPosition}`);
  if (doc.lastUpdated) lines.push(`last_update:\n  date: ${doc.lastUpdated}`);
  if (type === 'releaseNote' && doc.publishedAt) lines.push(`date: ${doc.publishedAt}`);
  lines.push('---');
  return lines.join('\n');
}

function serializeBody(body) {
  return portableTextToMarkdown(body, {
    overrideRenderers: {
      types: {
        // callout → Docusaurus admonition syntax
        callout: ({ value }) =>
          `:::${value.type}\n\n${value.body}\n\n:::\n`,
        // code block (from @sanity/code-input)
        code: ({ value }) =>
          `\`\`\`${value.language || ''}\n${value.code}\n\`\`\`\n`,
      },
    },
  });
}

function escapeYaml(str) {
  return (str || '').replace(/"/g, '\\"');
}
```

### Pattern 2: Cloudflare Pages Deploy Hook + Sanity Webhook

**What:** Cloudflare Pages generates a unique POST URL when you create a deploy hook. Any HTTP POST to that URL triggers a full rebuild. Sanity's webhook system sends a POST to that URL whenever a matching document is published.

**When to use:** INTG-02 — the "publish → live in 5 minutes" requirement.

**Steps (no code — configuration only):**
1. Cloudflare Dashboard → Workers & Pages → select `nxgen` project → Settings → Builds → Add deploy hook
2. Name it `sanity-publish`, target branch `main`, copy the generated hook URL
3. Sanity Dashboard → sanity.io/manage → project → API → Webhooks → Add webhook
4. Configure:
   - **URL:** (Cloudflare deploy hook URL from step 2)
   - **Method:** POST
   - **Dataset:** production
   - **Filter:** `_type in ["doc", "releaseNote", "article", "referencePage"]`
   - **Trigger on:** Update (publishing is an update that changes draft → published state), Create, Delete
   - **Status:** Active
5. Test by publishing a document in Studio and verifying a new deployment appears in CF Pages

### Pattern 3: Portable Text → MDX Serialization

**What:** `@portabletext/markdown`'s `portableTextToMarkdown()` converts Portable Text JSON arrays to Markdown strings. Custom `overrideRenderers.types` handlers cover block types that the library doesn't handle by default (callout, code from `@sanity/code-input`).

**Portable Text block types in the schema and their MDX output:**

| Sanity schema block | `@portabletext/markdown` handling | MDX output |
|---------------------|----------------------------------|------------|
| `block` (normal, h2–h4, blockquote) | Built-in | `#`, `##`, `###`, `####`, `>` |
| `block` marks (strong, em, underline, code) | Built-in | `**`, `_`, `<u>`, `` ` `` |
| `block` annotation (link with href/blank) | Built-in | `[text](url)` |
| `code` (from @sanity/code-input) | Custom renderer required | ` ```lang\ncode\n``` ` |
| `callout` (custom object) | Custom renderer required | `:::note\n\nbody\n\n:::` |
| `image` (with alt, caption) | Built-in DefaultImageRenderer | `![alt](url)` |
| `table` (from @sanity/table) | Built-in DefaultTableRenderer | GFM table |

**Image URL note:** Sanity images require the `@sanity/image-url` helper or manual URL construction using the project ID and dataset to generate the CDN URL from the `asset._ref` value.

### Pattern 4: Plugin Registration in `docusaurus.config.ts`

**What:** The Sanity plugin must appear before the `plugin-content-docs` entries.

**Example (abbreviated):**
```typescript
// classic/docusaurus.config.ts
plugins: [
  // MUST be first — populates .sanity-cache/ before content-docs reads
  './plugins/docusaurus-plugin-sanity-content',
  './plugins/docusaurus-plugin-last-update',
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'internal',
      path: 'docs-internal',       // existing MDX + Sanity-generated files coexist here
      // OR point to .sanity-cache/docs-internal if migrating fully
      ...
    },
  ],
  // ... remaining plugin-content-docs instances
],
```

**Coexistence strategy for Phase 3:** The generated `.sanity-cache/docs/` files are separate from `docs/`. Phase 3 does NOT move existing MDX. Two options exist:
- Option A (recommended for Phase 3): Update `plugin-content-docs` `path` to include both dirs via an array — but Docusaurus v3 `path` only accepts a single string.
- Option B (recommended for Phase 3): Write Sanity-generated files directly into `docs/`, `docs-admin/` etc. under a `_sanity/` subdirectory prefix — files coexist, autogenerate sidebar picks both up.
- Option C (clean): Use `.sanity-cache/` as a completely separate set of docs instances with new plugin-content-docs entries alongside the existing ones.

Given the CONTEXT.md decision that `.sanity-cache/` is the output and `plugin-content-docs` reads from those directories, **Option C** is the purest implementation: the Sanity plugin writes to `.sanity-cache/{audience-dir}/`, and corresponding `plugin-content-docs` instances use `.sanity-cache/{audience-dir}/` as their `path`. The existing `docs/`, `docs-admin/` etc. directories stay unchanged with their current `plugin-content-docs` registrations, and Sanity pages appear at new routes (e.g., `/sanity-docs/...`). **This creates URL conflicts with Phase 4's goal of replacing existing MDX.** The planner must resolve this by deciding: in Phase 3, since no real Sanity content exists yet (migration is Phase 4), the plugin output serves as a proof-of-concept with test documents, so URL conflicts are not yet a concern.

### Anti-Patterns to Avoid

- **Using `useCdn: true` at build time:** CDN cache may serve stale data. Set `useCdn: false` so the plugin always fetches from the live API.
- **Dynamic `apiVersion` (e.g., `new Date().toISOString().slice(0,10)`):** Sanity docs explicitly warn against this — it can break when the API changes. Hard-code a specific date string.
- **Calling `plugin-content-docs` with a path that doesn't exist at startup:** Docusaurus will fail if the `path` directory is missing. The plugin's `loadContent` must `fs.mkdirSync(..., { recursive: true })` before docs instances try to read.
- **Placing the Sanity plugin after `plugin-content-docs` in the plugins array:** `plugin-content-docs` will not find the generated files because it runs `loadContent` in order. Sanity plugin must be first.
- **Writing files during `contentLoaded` instead of `loadContent`:** `contentLoaded` runs after all `loadContent` calls complete, which is too late for other plugins to discover new files.
- **Using a GROQ filter `_type == 'reference'`:** The document type is `referencePage` — this is a confirmed Phase 2 decision. `reference` is a reserved Sanity built-in type for cross-document references.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Portable Text → Markdown | Custom recursive serializer | `@portabletext/markdown` | Handles nested marks, decorator stacking, inline annotations, hard breaks, tables, images — all edge cases are already solved |
| Sanity GROQ client | Raw `fetch()` to Content Lake API | `@sanity/client` | Handles authentication headers, API versioning, CDN routing, error responses, token injection — all non-trivial |
| Webhook server for INTG-02 | Express endpoint, Cloudflare Worker to receive Sanity events | Cloudflare Pages native deploy hook URL | Deploy hooks are exactly designed for this use case; no server needed, no HMAC verification needed for v1 |
| Image URL generation | Manual string concatenation from `asset._ref` | `@sanity/image-url` builder | `_ref` format (`image-{id}-{dimensions}-{ext}`) must be parsed precisely; the helper does this reliably |

**Key insight:** The Sanity ecosystem provides all the tools for this integration. The plugin's job is to orchestrate them (fetch → serialize → write), not to implement any of the low-level pieces.

---

## Common Pitfalls

### Pitfall 1: Plugin Execution Order — Files Not Found

**What goes wrong:** Docusaurus build fails with "docs directory does not exist" or the sidebar is empty.
**Why it happens:** The custom plugin appears after `plugin-content-docs` in the plugins array. `plugin-content-docs` runs `loadContent` first, finds `.sanity-cache/docs/` empty or missing, and either errors or produces no pages.
**How to avoid:** Always list `./plugins/docusaurus-plugin-sanity-content` as the very first entry in the `plugins` array in `docusaurus.config.ts`. Run `fs.mkdirSync(..., { recursive: true })` inside `loadContent` to guarantee directories exist before returning.
**Warning signs:** Empty sidebar despite Sanity content existing; "path does not exist" build errors; pages exist in `.sanity-cache/` but don't appear in the build.

### Pitfall 2: `.sanity-cache/` Not in `.gitignore` — Large Files Committed

**What goes wrong:** Generated MDX files are committed to git, causing merge conflicts on every build and polluting the git history.
**Why it happens:** The root `.gitignore` and `classic/.gitignore` do not currently list `.sanity-cache/`. The directory will be created at build time and git will stage it.
**How to avoid:** Add `.sanity-cache/` to both `classic/.gitignore` and the root `.gitignore` as part of the first plan in this phase, before writing any files.
**Warning signs:** `git status` shows hundreds of new `.mdx` files after a local build.

### Pitfall 3: Missing Sanity Image URL Construction

**What goes wrong:** Images in generated MDX output as `![alt](undefined)` or broken URLs.
**Why it happens:** Sanity stores images as `{ asset: { _ref: "image-abc123-800x600-png" } }`. The CDN URL is not stored directly — it must be constructed from the `_ref`.
**How to avoid:** Install `@sanity/image-url` and use `imageUrlBuilder(client).image(imageRef).url()`. Alternatively, manually parse the `_ref` using the known format: `https://cdn.sanity.io/images/{projectId}/{dataset}/{id}-{dimensions}.{ext}`.
**Warning signs:** Alt text renders but images are broken 404s in the built site.

### Pitfall 4: `apiVersion` Drift

**What goes wrong:** Build fails with "Unrecognized API version" or behavior changes unpredictably after a Sanity API update.
**Why it happens:** Using `apiVersion: new Date().toISOString().slice(0,10)` means the version changes daily.
**How to avoid:** Hard-code `apiVersion: '2025-02-06'` (or the most recent stable date at time of implementation). Only update it intentionally.
**Warning signs:** Build failures that correlate with date changes but not code changes.

### Pitfall 5: Callout `body` Is Plain Text, Not Portable Text

**What goes wrong:** Attempting to call `portableTextToMarkdown()` on `callout.body` — it is a plain string, not an array.
**Why it happens:** Phase 2 decision: callout body is `type: 'text'` (not nested Portable Text) to avoid Studio recursion issues.
**How to avoid:** In the custom callout renderer, use `value.body` directly as a string: `:::${value.type}\n\n${value.body}\n\n:::\n`.
**Warning signs:** TypeError "portableTextToMarkdown received non-array" inside the callout renderer.

### Pitfall 6: Code Block Type Mismatch (`@sanity/code-input`)

**What goes wrong:** Code blocks appear as empty or as raw JSON objects in generated MDX.
**Why it happens:** `@sanity/code-input` stores code blocks with `_type: 'code'` and fields `code` and `language` — not as a standard `block` with `code` decorator. `@portabletext/markdown` does not have a built-in renderer for this custom block type.
**How to avoid:** Register a custom renderer in `overrideRenderers.types.code` that reads `value.code` and `value.language`.
**Warning signs:** Code blocks render as `{}` or `[object Object]` in the built site.

### Pitfall 7: Webhook Triggering on Drafts

**What goes wrong:** Every keystroke in Studio triggers a Cloudflare Pages rebuild, consuming build minutes rapidly.
**Why it happens:** Sanity webhooks default to firing on draft saves if not filtered. However, Sanity documentation states that by default webhooks ignore draft and version events, only firing when changes are published. Verify this holds for the specific event trigger configuration.
**How to avoid:** Use "Update" trigger type (which fires on publish) and confirm in Sanity webhook logs that draft saves do not appear. The GROQ filter `_type in [...]` only filters by document type, not draft status.
**Warning signs:** Excessive rebuild notifications in Cloudflare Pages dashboard after typing in Studio without clicking Publish.

### Pitfall 8: Slug Field Structure — `slug.current` not `slug`

**What goes wrong:** File paths generated as `undefined.mdx` or the GROQ query returns no documents because the slug filter fails.
**Why it happens:** Sanity slug fields are objects `{ _type: 'slug', current: 'the-actual-slug' }`. The file path must use `doc.slug.current`, and GROQ queries should filter `defined(slug.current)` not `defined(slug)`.
**How to avoid:** Always access `doc.slug.current` in the plugin. Use the GROQ filter `defined(slug.current)` to exclude documents where the slug field is incomplete.
**Warning signs:** Files named `undefined.mdx` in `.sanity-cache/`; no documents returned by GROQ queries.

---

## Code Examples

### GROQ Queries — One per Content Type

```javascript
// Source: Sanity GROQ docs — https://www.sanity.io/docs/content-lake/groq-syntax
// Confirmed field names from Phase 2 schema review

// doc type
const docs = await client.fetch(
  `*[_type == "doc" && defined(slug.current)] | order(sidebarPosition asc) {
    title,
    slug,
    targetAudience,
    category,
    sidebarPosition,
    body,
    lastUpdated
  }`
);

// releaseNote type
const releaseNotes = await client.fetch(
  `*[_type == "releaseNote" && defined(slug.current)] | order(publishedAt desc) {
    title,
    slug,
    sprintId,
    publishedAt,
    body
  }`
);

// article type
const articles = await client.fetch(
  `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    title,
    slug,
    tags,
    publishedAt,
    body
  }`
);

// referencePage type — NOTE: must be 'referencePage', NOT 'reference'
const referencePages = await client.fetch(
  `*[_type == "referencePage" && defined(slug.current)] {
    title,
    slug,
    body
  }`
);
```

### @sanity/client Initialization

```javascript
// Source: @sanity/client GitHub README + Sanity docs
// https://github.com/sanity-io/client

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,   // unprefixed, per Phase 2 CF Pages decision
  dataset:   process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-02-06',                    // hard-coded — do NOT use new Date()
  useCdn:    false,                            // bypass CDN for fresh build-time data
  token:     process.env.SANITY_API_TOKEN,    // read token — required for private datasets
});
```

### Portable Text → MDX Serialization with Custom Renderers

```javascript
// Source: @portabletext/markdown npm package (v1.1.2)
// https://www.npmjs.com/package/@portabletext/markdown

const { portableTextToMarkdown } = require('@portabletext/markdown');

function serializePortableText(body) {
  return portableTextToMarkdown(body, {
    overrideRenderers: {
      types: {
        // @sanity/code-input stores code as {_type:'code', code:'...', language:'...'}
        code: ({ value }) =>
          `\`\`\`${value.language || 'text'}\n${value.code || ''}\n\`\`\`\n`,

        // Custom callout object: {type:'note'|'tip'|'warning'|'danger', body:'plain text'}
        // body is a plain string (NOT nested Portable Text — Phase 2 decision)
        callout: ({ value }) =>
          `:::${value.type || 'note'}\n\n${value.body || ''}\n\n:::\n`,

        // @sanity/table — DefaultTableRenderer handles this if registered
        // If the default renderer doesn't fire, add a custom one here
      },
    },
  });
}
```

### MDX Frontmatter Generation

```javascript
// Docusaurus frontmatter spec:
// https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter

function buildFrontmatter(doc) {
  const lines = ['---'];
  lines.push(`title: "${(doc.title || '').replace(/"/g, '\\"')}"`);

  // sidebar_position only on doc type
  if (doc.sidebarPosition != null) {
    lines.push(`sidebar_position: ${doc.sidebarPosition}`);
  }

  // sidebar_label from category if present
  if (doc.category) {
    lines.push(`sidebar_label: "${doc.category}"`);
  }

  // last_update for docs — uses Docusaurus native field
  if (doc.lastUpdated) {
    lines.push(`last_update:\n  date: ${doc.lastUpdated}`);
  }

  lines.push('---');
  return lines.join('\n');
}
```

### Sanity Webhook Filter (GROQ)

```
// Source: Sanity webhook docs — https://www.sanity.io/docs/content-lake/webhooks
// "Filter is what you see between *[ and ] in a GROQ query"

_type in ["doc", "releaseNote", "article", "referencePage"]
```

### Cloudflare Pages Deploy Hook (Dashboard Config, not code)

```
# Source: https://developers.cloudflare.com/pages/configuration/deploy-hooks/

Navigation: Workers & Pages → [project: nxgen] → Settings → Builds → Add deploy hook
  Name: sanity-publish
  Branch: main
  → Copy generated URL (format: https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/[unique-id])

Sanity Webhook config:
  URL: [paste CF deploy hook URL]
  Method: POST
  Dataset: production
  Filter: _type in ["doc", "releaseNote", "article", "referencePage"]
  Trigger on: Create, Update, Delete
```

### Feedback Widget Verification (INTG-03 smoke test)

```bash
# Smoke-test the deployed Cloudflare Pages Function endpoint
# Requires the site to be deployed and ZEPTO_API_KEY set in CF Pages env vars

curl -X POST https://docs.nxgen.cloud/functions/page-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "type": "page_feedback",
    "rating": "helpful",
    "context": {
      "pageTitle": "INTG-03 smoke test",
      "pageUrl": "https://docs.nxgen.cloud/docs/test"
    }
  }'

# Expected: {"success":true} with HTTP 200
# Verification: email arrives at abed.badarnah@nxgen.io
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `block-content-to-markdown` (unmaintained) | `@portabletext/markdown` | 2022 | Old package is archived on GitHub; new package is actively maintained under portabletext org |
| `@sanity/client` v5 (using `listen()` for SSE) | `@sanity/client` v6+ with standard `fetch()` | 2023 | v6 is a complete rewrite; `useCdn` config and import paths changed |
| Sanity webhooks (basic HTTP only) | GROQ-powered webhooks with filter expressions | 2021 | Eliminates need to filter on the receiving end |
| Cloudflare Pages Functions using `wrangler publish` | `wrangler deploy` / Pages dashboard | 2023 | `wrangler publish` is deprecated; Pages Functions deploy with site build |

**Deprecated/outdated:**
- `@sanity/block-content-to-markdown`: Unmaintained, GitHub-archived — do not use. Use `@portabletext/markdown` instead.
- `next-sanity` for non-Next.js projects: Designed for Next.js App Router caching patterns; adds unnecessary complexity in Docusaurus context.
- Sanity `useCdn: true` at build time: CDN may serve up to 60-second-stale data; inappropriate for build-time content fetching.

---

## Open Questions

1. **Image URL generation — `@sanity/image-url` vs manual construction**
   - What we know: Sanity images have `asset._ref` in format `image-{id}-{w}x{h}-{ext}`; the CDN URL is `https://cdn.sanity.io/images/{projectId}/{dataset}/{id}-{w}x{h}.{ext}`
   - What's unclear: Whether `@portabletext/markdown`'s default image renderer already constructs the URL, or whether it outputs the raw `_ref`
   - Recommendation: Test with a real document image in the first plan; if the default renderer outputs broken URLs, add `@sanity/image-url` as a dependency and override the image renderer

2. **`plugin-content-docs` path for Sanity-sourced content in Phase 3**
   - What we know: Decision says `plugin-content-docs` instances read from `.sanity-cache/` subdirectories. But Phase 3 has no real Sanity content yet (migration is Phase 4).
   - What's unclear: Should Phase 3 update `plugin-content-docs` to point at `.sanity-cache/` now (requiring test docs to be created in Studio for verification), or keep existing `docs/` paths and add new plugin-content-docs instances for `.sanity-cache/`?
   - Recommendation: Keep existing `docs/` paths unchanged. Add new `plugin-content-docs` instances for `.sanity-cache/` subdirs with distinct IDs (e.g., `id: 'sanity-docs'`), routed at `/sanity-docs/...` for Phase 3 verification. Phase 4 migration swaps the routing.

3. **`@sanity/table` block rendering in `@portabletext/markdown`**
   - What we know: The schema uses `@sanity/table` blocks; `@portabletext/markdown` has a `DefaultTableRenderer`
   - What's unclear: Whether `DefaultTableRenderer` is enabled by default or must be explicitly registered, and whether `@sanity/table`'s output format matches what `@portabletext/markdown` expects
   - Recommendation: Test with a table document in Studio during plan execution; add a custom table renderer if the default does not work

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.48.0 |
| Config file | `classic/playwright.config.ts` |
| Quick run command | `cd classic && npx playwright test e2e/sanity-content.spec.ts` |
| Full suite command | `cd classic && npx playwright test` |

**Note:** The existing `e2e/docusaurus-integration.spec.ts` tests reference a `/cms` route and CMS edit mode from a previous (deleted) CMS integration. These tests are stale and will not pass against the current site — they are not authoritative for Phase 3 verification. Phase 3 should add a new spec file.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTG-01 | `npm run build` completes and `.sanity-cache/` contains `.mdx` files | Build smoke test | `cd classic && npm run build && test -d .sanity-cache/docs` | No — Wave 0 |
| INTG-01 | Sanity-sourced page is accessible at its slug URL in built site | Playwright e2e | `cd classic && npx playwright test e2e/sanity-content.spec.ts` | No — Wave 0 |
| INTG-02 | Cloudflare Pages deploy hook URL returns non-4xx when POSTed to | Manual verification | `curl -X POST [CF_DEPLOY_HOOK_URL]` — manual, not automated | N/A — manual |
| INTG-02 | Publishing in Studio triggers a CF Pages rebuild within 5 minutes | Manual verification | Watch CF Pages dashboard after Studio publish — manual | N/A — manual |
| INTG-03 | `GET /functions/page-feedback` returns 405, `POST` returns 200 with valid payload | HTTP smoke test | `curl -X POST https://docs.nxgen.cloud/functions/page-feedback [...]` — manual | N/A — manual |
| INTG-03 | No `api/page-feedback.ts` (Vercel) or `netlify/functions/` files exist | File presence check | `test ! -f classic/api/page-feedback.ts && test ! -d netlify/` | N/A — grep check |

### Sampling Rate

- **Per task commit:** Build smoke test — `cd classic && npm run build` (verifies plugin runs without error)
- **Per wave merge:** Full Playwright suite — `cd classic && npx playwright test`
- **Phase gate:** Manual INTG-02 and INTG-03 verification before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `classic/e2e/sanity-content.spec.ts` — covers INTG-01 (Sanity page renders at slug URL after build)
- [ ] Plugin installation: `npm install @sanity/client @portabletext/markdown` in `classic/` — not yet in `package.json`
- [ ] `.sanity-cache/` added to `classic/.gitignore` and root `.gitignore` before first build

---

## Sources

### Primary (HIGH confidence)

- Cloudflare Pages deploy hooks official docs — https://developers.cloudflare.com/pages/configuration/deploy-hooks/ — verified: POST method, dashboard creation flow, security notes
- Sanity GROQ-powered webhooks official docs — https://www.sanity.io/docs/content-lake/webhooks — verified: event triggers, GROQ filter syntax, HTTP method config, draft-vs-published behavior
- @sanity/client GitHub README — https://github.com/sanity-io/client — verified: v6 `createClient` import, `useCdn: false` for build-time, `apiVersion` hard-coding requirement
- Project codebase: `classic/plugins/docusaurus-plugin-last-update/index.js` — verified CJS plugin pattern
- Project codebase: `classic/functions/page-feedback.ts` — verified INTG-03 is complete
- Project codebase: `studio/schemaTypes/portableText.ts` — verified all block types that need serialization
- Project codebase: `classic/docusaurus.config.ts` — verified 6 `plugin-content-docs` instances and their paths

### Secondary (MEDIUM confidence)

- `@portabletext/markdown` npm package — https://www.npmjs.com/package/@portabletext/markdown — verified: exists, v1.1.2, bidirectional, custom type renderers; specific renderer API verified via search (not official docs fetched directly due to 403)
- Docusaurus Lifecycle APIs page — https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis — verified: `loadContent` → `contentLoaded` execution order; plugin-array order governs execution sequence
- Sanity webhook GROQ filter syntax — verified from official docs: `_type in ["doc", "article"]` is valid GROQ; confirmed by docs quote "filter is what you see between `*[` and `]`"

### Tertiary (LOW confidence)

- Plugin execution order guarantee (custom plugin before plugin-content-docs): Inferred from Docusaurus lifecycle documentation and community answers; no explicit official statement found that lists-array-order == execution-order. Recommendation: test empirically in Wave 1.
- `@sanity/table` compatibility with `@portabletext/markdown`: Not verified — needs testing with real data.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@sanity/client` and `@portabletext/markdown` are the official Sanity-org packages for this exact use case; Cloudflare deploy hooks are official CF feature
- Architecture: MEDIUM — Plugin execution order is inferred (not explicitly documented as guaranteed); `.sanity-cache/` routing strategy requires planner to make the path decision clearly
- Pitfalls: HIGH — All identified from actual schema decisions (Phase 2 decisions), actual codebase inspection, and official documentation

**Research date:** 2026-03-07
**Valid until:** 2026-06-07 (stable ecosystem — 90 days)
