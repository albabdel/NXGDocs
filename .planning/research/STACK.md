# Technology Stack

**Project:** NXGen/GCXONE Documentation Platform — Sanity CMS Integration
**Researched:** 2026-03-06
**Context:** Brownfield. Existing Docusaurus (TypeScript) site on Cloudflare Pages. Adding Sanity as headless CMS, removing dead CMS code. Keeping Cloudinary + Algolia.

---

## Recommended Stack

### Core Framework (Keep As-Is)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Docusaurus | 3.x (current) | Static site + docs framework | Already in use; mature, MDX-native, has plugin ecosystem. No reason to migrate. |
| TypeScript | 5.x | Language | Already in use. Sanity's SDK is fully typed. |
| React | 18.x | UI rendering | Docusaurus dependency. Sanity Studio runs on React 18. |

**Confidence: HIGH** — Docusaurus 3 is stable and well-documented. No version change needed.

---

### CMS Layer (New)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@sanity/client` | ^6.x | Fetch content from Sanity API at build time | Official SDK. Lightweight. No runtime server needed — pure HTTP to Sanity's CDN API. Works in any Node.js build script. |
| `next-sanity` | NOT APPLICABLE | — | This is a Next.js-specific package. Do not use with Docusaurus. |
| `sanity` (studio) | ^3.x | Sanity Studio v3 (embedded or standalone) | Studio v3 is the current major version. Can be hosted separately at `studio.yourdomain.com` on Sanity's free hosting or any static host. No need to embed in Docusaurus build. |
| `@sanity/image-url` | ^1.x | Build Cloudinary-compatible or Sanity CDN image URLs | Only needed if you use Sanity's image pipeline. Given Cloudinary is already in use, evaluate whether to route images through Sanity's asset pipeline or keep Cloudinary directly. Recommendation: keep Cloudinary for image hosting; use Sanity only for structured content fields that reference Cloudinary URLs as strings. |
| `groq` | (bundled in `@sanity/client`) | Query language for Sanity | GROQ is Sanity's native query language. No separate install needed — it is the query string syntax sent to the API. |

**Confidence: HIGH** — `@sanity/client` v6 is the stable, documented path for non-Next.js integrations. Studio v3 is current.

---

### Content Integration Pattern: Build-Time Fetch

**Chosen approach: Build-time GROQ fetch via Docusaurus plugin.**

Do NOT use:
- Runtime API calls from the browser (exposes tokens, no SSR in Docusaurus)
- A custom Express/Node server (dead code already in the repo — remove it)
- GraphQL (Sanity has a GraphQL API but GROQ is simpler, better supported, and avoids the dead GraphQL code already being removed)

**How it works:**

```
Sanity Content API (GROQ)
        |
        v
Docusaurus custom plugin (runs at build time via `loadContent` lifecycle hook)
        |
        v
Generates .md / .mdx files OR injects data into React component props
        |
        v
Docusaurus static build
        |
        v
Cloudflare Pages deploys static output
```

**Implementation path:**

1. Create `plugins/sanity-content/index.js` (or `.ts`) as a Docusaurus plugin.
2. In the plugin's `loadContent()` hook, call `@sanity/client` with a GROQ query.
3. Write fetched content to `docs/` as `.mdx` files, OR store as JSON consumed by React pages.
4. `contentLoaded()` hook registers the routes.

For an existing MDX-heavy docs site, the simpler path is: fetch Sanity documents, write them as `.mdx` files into a temp directory that Docusaurus includes in its docs glob. This avoids restructuring existing Docusaurus routing.

**Confidence: MEDIUM** — This pattern is well-established for Gatsby/Next.js with Sanity, and the Docusaurus plugin API (`loadContent`) is documented. The exact plugin implementation is project-specific. No official "sanity-docusaurus" plugin exists as of knowledge cutoff — you build a thin one.

---

### Webhook-Triggered Rebuild (Cloudflare Pages Deploy Hook)

| Component | Details | Why |
|-----------|---------|-----|
| Cloudflare Pages Deploy Hook | A unique POST URL generated in the Cloudflare Pages dashboard (Settings > Builds & deployments > Deploy hooks) | Triggers a full rebuild without needing CI credentials exposed to Sanity |
| Sanity Webhook | Configured in Sanity project settings (manage.sanity.io) pointing to the Cloudflare deploy hook URL | Fires on document publish/unpublish events |
| Webhook filter (GROQ) | Filter in Sanity webhook config to only trigger on relevant document types | Avoids unnecessary rebuilds on every draft save |

**Flow:**
```
Editor publishes in Sanity Studio
        |
        v
Sanity fires GROQ-filtered webhook → POST to Cloudflare Deploy Hook URL
        |
        v
Cloudflare Pages triggers new build
        |
        v
Docusaurus plugin fetches fresh content from Sanity API
        |
        v
New static site deployed
```

**Cloudflare Deploy Hook setup:**
- Go to Cloudflare Pages project > Settings > Builds & deployments > Deploy hooks
- Create hook, copy the URL
- Paste URL into Sanity webhook destination

**Sanity webhook GROQ filter example:**
```
_type == "article" && delta::changedAny(title, body, slug)
```

This prevents rebuilds on metadata-only changes or draft saves.

**Confidence: HIGH** — Cloudflare Pages deploy hooks are a documented, stable feature. Sanity webhooks with GROQ filters are documented at sanity.io/docs/webhooks.

---

### Sanity MCP Server

| Component | Package/Config | Purpose |
|-----------|---------------|---------|
| Sanity MCP Server | `@sanity/mcp-server` (or configured via `npx sanity mcp`) | Exposes Sanity project schema and content to AI coding assistants via the Model Context Protocol |
| Configuration | `.mcp.json` or `claude_desktop_config.json` / `.claude/mcp.json` | Points MCP host (Claude Code, Cursor, etc.) at the Sanity MCP server |

**Setup pattern (Claude Code / claude.json):**

```json
{
  "mcpServers": {
    "sanity": {
      "command": "npx",
      "args": ["@sanity/mcp-server@latest"],
      "env": {
        "SANITY_PROJECT_ID": "your_project_id",
        "SANITY_DATASET": "production",
        "SANITY_API_TOKEN": "your_token"
      }
    }
  }
}
```

This gives AI assistants live schema awareness so they can write accurate GROQ queries and TypeScript types against the actual schema.

**Confidence: MEDIUM** — Sanity announced MCP server support in late 2024/early 2025. The package name `@sanity/mcp-server` is the canonical reference; verify the exact invocation against `sanity.io/docs/mcp` or the npm registry at implementation time, as this is a newer feature and exact CLI flags may have evolved.

---

### Existing Integrations to Keep

| Integration | Package | Keep? | Notes |
|-------------|---------|-------|-------|
| Cloudinary | `cloudinary` or direct URL transforms | YES | Keep for all image hosting. Do not route images through Sanity's asset pipeline. Store Cloudinary URLs as string fields in Sanity documents. |
| Algolia | `@docsearch/react`, `@docsearch/js` | YES | Algolia DocSearch crawls the static HTML output — no changes needed. Sanity-sourced pages will be indexed automatically once they appear in the built HTML. |
| Docusaurus Algolia plugin | `@docusaurus/theme-search-algolia` | YES | No changes needed. |

**Confidence: HIGH** — Both integrations are decoupled from the CMS layer and operate on the static build output. No migration work required.

---

### Dead Code to Remove

| Package / System | Why It's Dead | Action |
|-----------------|--------------|--------|
| `@storyblok/react`, `storyblok-js-client` | CMS replaced by Sanity | `npm uninstall` |
| `tinacms`, `@tinacms/*` | CMS replaced by Sanity | `npm uninstall` |
| `@hygraph/*`, `graphql-request` (if Hygraph-specific) | CMS replaced by Sanity | `npm uninstall` |
| `@strapi/*`, `strapi` | CMS replaced by Sanity | `npm uninstall` |
| `payload`, `@payloadcms/*` | CMS replaced by Sanity | `npm uninstall` |
| `@tiptap/*`, `tiptap` | Editor used by removed CMSs | `npm uninstall` |
| `monaco-editor`, `@monaco-editor/react` | Editor used by removed CMSs | `npm uninstall` |
| `express`, `cors`, `body-parser` (standalone server) | No runtime server needed; Cloudflare Pages is static | `npm uninstall`; delete `server/` or `api/` directories |
| `graphql`, `@graphql-codegen/*`, `apollo-client`, `urql` | Sanity integration uses GROQ, not GraphQL | `npm uninstall` |
| Any `.env` vars prefixed `STORYBLOK_`, `TINA_`, `HYGRAPH_`, `STRAPI_`, `PAYLOAD_` | Dead config | Remove from `.env`, Cloudflare Pages environment variables dashboard |

**Audit command to run:**
```bash
cat package.json | grep -E "storyblok|tinacms|tina|hygraph|strapi|payload|tiptap|monaco|@graphql|apollo|urql"
```

**Confidence: HIGH** — These packages are named explicitly in the project brief as dead code.

---

### Alternatives Considered and Rejected

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Content fetch | `@sanity/client` (GROQ, build-time) | Sanity GraphQL API | GraphQL API requires enabling a separate endpoint in Sanity, adds a package (`graphql-request`), and the codebase is already removing GraphQL. GROQ is more expressive and is Sanity's native interface. |
| Content fetch | Build-time plugin | Runtime API route on Cloudflare Workers | Adds complexity, requires token exposure strategy, and Docusaurus is a static site generator — runtime content fetching defeats the purpose. |
| Studio hosting | Standalone deploy (Sanity-hosted or separate Cloudflare Pages project) | Embedded in Docusaurus at `/studio` route | Embedding studio in Docusaurus requires ejecting Docusaurus webpack config and adds significant build complexity. Standalone is simpler, supported, and separation is cleaner. |
| Image pipeline | Keep Cloudinary | Migrate to Sanity Assets | Cloudinary is already integrated and working. Migrating images is high-effort with no net gain. |
| Rebuild trigger | Cloudflare Deploy Hook (webhook from Sanity) | GitHub Actions on a schedule | Scheduled builds waste build minutes and introduce up-to-60-minute content staleness. Webhooks are event-driven and instant. |
| Rebuild trigger | Cloudflare Deploy Hook | Cloudflare Workers webhook proxy | A Worker proxy is useful if you need webhook signature validation before triggering rebuild. Optional hardening step — not needed initially. |

---

## Installation

```bash
# Add Sanity client (the only new production dependency)
npm install @sanity/client

# If you need Sanity's portable text renderer for rich text fields:
npm install @portabletext/react

# Remove dead CMS packages (run iteratively based on package.json audit):
npm uninstall \
  @storyblok/react storyblok-js-client \
  tinacms \
  graphql graphql-request \
  express cors \
  monaco-editor @monaco-editor/react

# Verify no peer dependency breakage after removal:
npm ls --depth=0
```

```bash
# Sanity Studio (separate project, not in Docusaurus):
npm create sanity@latest
# Choose: existing project, dataset: production
# Deploy studio: sanity deploy  (hosted at your-project.sanity.studio)
```

---

## Environment Variables Required

| Variable | Where Set | Purpose |
|----------|-----------|---------|
| `SANITY_PROJECT_ID` | Cloudflare Pages env + local `.env` | Identifies Sanity project |
| `SANITY_DATASET` | Cloudflare Pages env + local `.env` | Usually `production` |
| `SANITY_API_TOKEN` | Cloudflare Pages env (secret) + local `.env` | Read-only token for build-time fetches |

Use a **read-only** Sanity API token for the build. The token only needs to read published content. Never use the editor/write token in the build environment.

---

## Sources

- Sanity client v6 docs: https://www.sanity.io/docs/js-client (HIGH confidence — official)
- Docusaurus plugin API (`loadContent`): https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis (HIGH confidence — official)
- Cloudflare Pages deploy hooks: https://developers.cloudflare.com/pages/configuration/deploy-hooks/ (HIGH confidence — official)
- Sanity webhooks: https://www.sanity.io/docs/webhooks (HIGH confidence — official)
- Sanity MCP server: https://www.sanity.io/docs/mcp (MEDIUM confidence — newer feature, verify package name at implementation time)
- Sanity Studio v3: https://www.sanity.io/docs/studio (HIGH confidence — current major version since 2023)
- Portable Text for React: https://github.com/portabletext/react-portabletext (HIGH confidence — official Sanity org)
- Algolia DocSearch (static crawler): https://docsearch.algolia.com/docs/what-is-docsearch (HIGH confidence — no changes needed)
