# Project Research Summary

**Project:** NXGen/GCXONE Documentation Platform — Sanity CMS Integration
**Domain:** Brownfield headless CMS integration for static documentation site
**Researched:** 2026-03-06
**Confidence:** HIGH

## Executive Summary

This is a brownfield project with a functioning Docusaurus 3.x documentation site already deployed to Cloudflare Pages at docs.nxgen.cloud. The site works for readers — search, navigation, dark mode, role-based instances, and 100+ articles are all in place. The gap is editor workflow: content today requires a developer to edit MDX files and push to git. The project adds Sanity as a headless CMS so non-technical editors can write and publish without developer involvement. The core value proposition is single-sentence: editor writes in Sanity Studio, clicks publish, site rebuilds automatically within 5 minutes.

The recommended approach is strictly build-time integration. Sanity content is fetched at build time via a custom Docusaurus plugin using GROQ queries, written to a `.sanity-cache/` directory, and consumed by the existing Docusaurus docs pipeline. Sanity webhooks trigger Cloudflare Pages rebuild on publish. No runtime server, no client-side API calls, no embedded Studio — all three would add complexity without benefit on a static site. The only new production dependency is `@sanity/client`. Everything else — Algolia, Cloudinary, Docusaurus — remains unchanged.

The biggest risk is not the Sanity integration itself; it is the accumulated dead weight from four previous failed CMS integrations (Storyblok, TinaCMS, Hygraph, Strapi, Payload). Dead packages inflate build times toward Cloudflare's 20-minute timeout, dead scripts in `prebuild` hooks can silently fail, and dead pages cause TypeScript compile errors during cleanup. The mandatory first phase is cleanup: audit and remove all dead code before adding any new code. A clean build is the prerequisite for a stable Sanity integration.

---

## Key Findings

### Recommended Stack

The core framework (Docusaurus 3.x, TypeScript 5.x, React 18.x) stays exactly as-is. No migration, no version changes. The only addition is `@sanity/client` v6 for build-time GROQ queries, and optionally `@portabletext/react` or `@portabletext/to-markdown` for rendering Sanity Portable Text as MDX. Sanity Studio v3 runs as a completely separate deployment (Sanity-hosted at `your-project.sanity.studio`) — it is never embedded in the Docusaurus build. Cloudinary stays as the image CDN; Sanity's asset pipeline is not used. Algolia DocSearch stays unchanged — it crawls the static HTML output and requires no CMS-layer changes.

**Core technologies:**
- `@sanity/client` v6: Build-time GROQ queries — official SDK, lightweight, no runtime server needed
- `@portabletext/to-markdown`: Portable Text to MDX conversion — needed in the content bridge plugin
- Sanity Studio v3: Authoring UI — deployed separately at `sanity.studio`, never bundled with Docusaurus
- Cloudflare Pages Deploy Hook: Rebuild trigger — event-driven, instant, no scheduled builds
- Sanity Webhooks (GROQ-filtered): Publish-to-rebuild pipeline — fires only on document publish, not draft saves

**Dead packages to remove immediately:**
- `@storyblok/react`, `storyblok-js-client`, `tinacms`, `@hygraph/*`, `@strapi/*`, `payload`, `@payloadcms/*`
- `@tiptap/*` (7 packages), `@dnd-kit/*` (3 packages), `monaco-editor`, `@monaco-editor/react`
- `express`, `cors`, `body-parser`, `graphql`, `@graphql-codegen/*`, `apollo-client`, `urql`
- `@vercel/node` (referenced in dead feedback API), `nodemailer` (not supported in Cloudflare Workers)

### Expected Features

The core editorial workflow is almost entirely handled by Sanity out of the box — rich text editor, draft/publish states, slug auto-generation, required field validation, image upload, revision history. The integration work is wiring the plumbing (webhook → Cloudflare deploy, GROQ fetch → MDX generation, slug matching → zero 404s), not building editor features.

**Must have (table stakes — MVP):**
- Sanity schemas for all four content types: `doc`, `releaseNote`, `article`, `reference`
- Build-time GROQ fetch via custom Docusaurus plugin (replaces MDX-from-git for CMS-managed content)
- Publish webhook wired to Cloudflare Pages deploy hook (the core automation)
- Slug validation matching existing `/docs/...` URL structure (zero 404s during migration)
- Required field validation in Studio: title, slug, content body, category
- Image upload in Studio routing to Cloudinary

**Should have (differentiators):**
- Role-based `targetAudience` field on documents (existing role routing continues from file content during transition)
- Structured `releaseNote` schema with `version` + `sprintId` + `releaseDate` (sprint-versioned nav)
- Content freshness date rendered from Sanity `_updatedAt` (trust signal for security platform operators)
- Inline callout/warning block types in Portable Text (maps to Docusaurus admonitions)
- Linked cross-references between docs via Sanity reference fields
- Feedback widget adapted to Cloudflare Functions (already partially implemented)

**Defer to post-MVP:**
- Live preview before publish (useful but non-blocking; requires a Docusaurus preview route + Sanity preview secret)
- Webhook hardening via Cloudflare Worker HMAC proxy (optional security hardening)
- Post-deploy Algolia crawler API trigger (Algolia daily crawl is sufficient initially)
- Content scheduling (out of scope per PROJECT.md)
- Multi-language / i18n (out of scope per PROJECT.md)

### Architecture Approach

The architecture has three planes: Authoring (Sanity Studio + Content Lake), Build (Cloudflare Pages running Docusaurus with a custom Sanity plugin), and Delivery (Cloudflare Pages CDN serving static HTML). The content bridge is a custom Docusaurus plugin (`docusaurus-plugin-sanity`) that runs in the `loadContent` lifecycle, fires GROQ queries against the Sanity CDN API, converts Portable Text to MDX, writes files to `.sanity-cache/`, and lets the existing `@docusaurus/plugin-content-docs` process them alongside legacy git-sourced MDX. Migration runs section-by-section using a parallel-source strategy: new Sanity docs appear at a shadow path first, then cut over one section at a time, never touching production URLs until verified.

**Major components:**
1. **Sanity Studio** — editor authoring UI; deployed at `your-project.sanity.studio`; communicates only with Sanity Content Lake
2. **Sanity Content Lake** — document storage, GROQ API, CDN API, webhook dispatch
3. **`docusaurus-plugin-sanity`** — custom build-time content bridge; the only new code component to write
4. **Cloudflare Pages Build** — runs Docusaurus, hosts plugin, receives Sanity webhooks via deploy hook
5. **Cloudinary** — image CDN; URLs stored as strings in Sanity documents; no pipeline changes
6. **Algolia DocSearch** — crawls static HTML output post-deploy; no CMS-layer changes

**Key patterns:**
- All Sanity fetches in `loadContent()` only — never client-side
- Always filter drafts: `!(_id in path("drafts.**"))` in every GROQ query
- Zero-document guard: abort build if Sanity returns 0 docs to prevent empty site deploys
- One GROQ query per content type (not a monolithic query)
- Environment variables via `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` — never hardcoded

### Critical Pitfalls

1. **Dead `prebuild` hook calls a Hygraph script that no longer has its env vars** — Remove `"prebuild": "npm run fetch-content"` from `package.json` on day one of cleanup. Re-add only once the Sanity fetch script exists and has a graceful fallback for missing env vars.

2. **Bloated `node_modules` drives build toward Cloudflare's 20-minute timeout** — Remove dead CMS packages before adding Sanity. The repo has 65+ production dependencies including 7 Tiptap packages, 3 DnD Kit packages, 3 TSParticles packages, and multiple dead CMS SDKs. `build-with-memory.js` already forces `--max-old-space-size=4096` — the build is already under memory pressure.

3. **Storyblok pages and lib must be deleted atomically** — Delete `src/pages/storyblok-example.tsx` and `storyblok-preview.tsx` first, then `src/components/storyblok/`, then `src/lib/storyblok.ts`, then remove npm packages. Any partial deletion creates TypeScript import errors that read as unrelated module resolution failures.

4. **MDX-to-Sanity migration silently strips custom JSX components** — Sanity Portable Text cannot natively represent Docusaurus components (`<Tabs>`, `<Callout>`, `<Steps>`, `<Admonition>`). Audit component usage before any migration. Design custom Portable Text block types for each component. Never run bulk migration before validating 2-3 representative documents end-to-end.

5. **Sanity schema changes after content entry destroy field visibility** — Field renames/removals in the Sanity schema orphan existing document data (data is preserved but invisible in Studio and returns null from GROQ). Finalize schema before editors begin entering real content. During development, iterate freely; after content entry begins, treat schema as locked.

6. **Feedback widget is split across Vercel and Netlify function formats, neither of which runs on Cloudflare Workers** — Rewrite `functions/page-feedback.ts` using the Workers API (`Request`/`Response`). Replace `nodemailer` with a `fetch()`-based transactional email HTTP API. Test with `wrangler pages dev`.

---

## Implications for Roadmap

Based on research, the dependency graph is clear and forces a specific phase order. Cleanup must come first — not as optional housekeeping, but because the dead code creates real build risk that will undermine every subsequent phase. Schema design must precede content migration. Parallel-source migration must precede URL cutover.

### Phase 1: Codebase Cleanup and Stabilization

**Rationale:** Dead CMS code creates active build risk (timeout, failed hooks, TypeScript errors). This is not optional prep — it is the prerequisite for all other work. The Cloudflare Pages build is already under memory pressure with 65+ dependencies. Adding Sanity integration on top of dead packages is a recipe for build failures with no clear error messages.

**Delivers:** Clean, stable build; no dead CMS packages; correct Cloudflare Pages build command; all broken link suppression replaced with explicit warnings; feedback widget rewritten for Cloudflare Workers.

**Addresses:** Table stakes publish workflow (clean build pipeline)

**Avoids:**
- Pitfall 1: Remove `prebuild` hook immediately
- Pitfall 2: Remove dead packages before build times balloon
- Pitfall 3: Delete Storyblok code atomically
- Pitfall 7: Rewrite feedback widget for Cloudflare Workers
- Pitfall 11: Fix Cloudflare Pages build command (not reading `netlify.toml`)
- Pitfall 13: Delete `sanitize.ts` with Storyblok code

**Research flag:** SKIP — standard cleanup patterns, no research needed.

---

### Phase 2: Sanity Schema Design and Studio Setup

**Rationale:** Schema is the data contract for everything that follows. The custom Docusaurus plugin is written against the schema. The migration script is written against the schema. If schema changes after content entry begins, data is orphaned. This phase must be completed and validated with test documents before any content migration begins.

**Delivers:** Sanity project created; all four schemas deployed (`doc`, `releaseNote`, `article`, `reference`); `blockContent` Portable Text config with custom block types for callouts, code, and cross-references; Studio accessible at `your-project.sanity.studio`; environment variables set in Cloudflare Pages.

**Addresses:**
- Schema for all four content types (MVP feature)
- Role-based `targetAudience` field
- Structured `releaseNote` schema with version/sprint fields
- Inline callout/warning block types

**Avoids:**
- Pitfall 10: Schema locked before content entry begins; use Sanity MCP server for schema operations
- Pitfall 4: Custom Portable Text blocks designed upfront (no silent JSX stripping on migration)

**Research flag:** NEEDS DEEPER RESEARCH during planning — specifically, how to represent Docusaurus `<Tabs>` and `<Steps>` in Portable Text custom block types. This is the most ambiguous technical decision in the project.

---

### Phase 3: Docusaurus-Sanity Content Bridge (Build Pipeline)

**Rationale:** The content bridge plugin is the core technical deliverable of this project. It runs only once all prerequisites are met: clean build (Phase 1), schema deployed with test content (Phase 2), and environment variables configured.

**Delivers:** `docusaurus-plugin-sanity` custom plugin; GROQ queries for all four content types with draft filter; Portable Text to MDX conversion; `.sanity-cache/` directory populated at build time; zero-document guard preventing empty deploys; local build verified with Sanity content.

**Uses:**
- `@sanity/client` v6 (only new production dependency)
- `@portabletext/to-markdown` for Portable Text conversion
- Docusaurus `loadContent`/`contentLoaded` lifecycle hooks
- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` env vars (Cloudflare Pages)

**Implements:** `docusaurus-plugin-sanity` architecture component; parallel-source strategy (shadow path `.sanity-cache/` alongside `classic/docs/`)

**Avoids:**
- Pitfall 5: Fetch script wraps all errors in try/catch; falls back to empty data (MDX files continue to serve)
- Anti-pattern: No runtime API calls from browser; all fetches in `loadContent()` only

**Research flag:** NEEDS DEEPER RESEARCH — specifically, `@portabletext/to-markdown` conversion fidelity for complex content (nested lists, code blocks, custom block types). Test with real content samples before committing to this approach.

---

### Phase 4: Publish Pipeline (Webhook Integration)

**Rationale:** This phase wires the editorial workflow end-to-end. Phase 3 proved the build works; this phase makes it trigger automatically on publish.

**Delivers:** Cloudflare Pages Deploy Hook URL generated; Sanity webhook configured pointing to deploy hook with GROQ document-type filter; end-to-end test verified (publish in Studio → Cloudflare build triggered → content live within 5 minutes).

**Uses:**
- Cloudflare Pages deploy hook (dashboard configuration, no code)
- Sanity webhook with GROQ filter: `_type in ["doc", "releaseNote", "article", "reference"]`

**Avoids:**
- Pitfall 14: Deploy Hook URL stored only in Sanity dashboard, never committed to repo
- Build webhook GROQ filter prevents rebuilds on draft saves

**Research flag:** SKIP — fully documented pattern, Cloudflare and Sanity official docs cover this completely.

---

### Phase 5: Content Migration (MDX to Sanity)

**Rationale:** Content migration is last because it depends on a verified pipeline (Phases 3-4) and a stable schema (Phase 2). Migration is the highest-risk phase because it touches existing reader-facing URLs. Section-by-section approach with URL continuity verification eliminates the risk.

**Delivers:** Migration script (`scripts/migrate-to-sanity.ts`) reading MDX frontmatter + content and creating Sanity documents; content migrated section by section in this order: (1) release-notes, (2) knowledge-base, (3) getting-started, (4) features/devices; URL continuity verified after each section (all `/docs/...` paths resolve); git-sourced MDX files archived after verified cutover; Algolia re-crawl triggered after each batch.

**Addresses:**
- Stable reader URLs (zero 404s)
- Content freshness date from `_updatedAt`
- All content types visible in Docusaurus

**Avoids:**
- Pitfall 4: Custom JSX components (`<Tabs>`, `<Callout>`) handled per the block types designed in Phase 2
- Pitfall 8: Manual Algolia re-crawl triggered after each section migration
- Pitfall 9: Role-based docs instances — decide before migration whether to keep or consolidate

**Research flag:** NEEDS DEEPER RESEARCH — specifically, the markdown-to-Portable-Text conversion library. Options include `sanity-markdown-to-blocks`, `mdast-util-to-portable-text`, and manual conversion scripts. Each has different fidelity tradeoffs for the JSX-heavy MDX files in this project.

---

### Phase 6: Polish and Hardening

**Rationale:** Post-migration, the pipeline is live. This phase addresses deferred differentiators and operational hardening.

**Delivers:** Live preview feature (Docusaurus preview route + Sanity preview secret); webhook hardening via Cloudflare Worker HMAC relay (optional); post-deploy Algolia crawler API trigger; `onBrokenLinks` set to `'throw'` as a permanent quality gate; `targetAudience` field wired to role-based Docusaurus instances.

**Avoids:**
- Pitfall 4: `onBrokenLinks: 'throw'` is the end-state quality gate (set to `'warn'` during cleanup, `'throw'` here)

**Research flag:** SKIP for most items. Live preview pattern is well-documented in Sanity docs. Cloudflare Worker HMAC relay is standard Workers code.

---

### Phase Ordering Rationale

- Phase 1 before all others: Dead code creates active build risk; any new integration added before cleanup will fail in non-obvious ways
- Phase 2 before Phase 3: Plugin code is written against schema; schema must be stable before plugin is coded
- Phase 3 before Phase 4: Webhook is useless if the build pipeline does not already consume Sanity content
- Phase 5 after Phases 3-4 are verified: Content migration is irreversible; only migrate once the full pipeline is proven
- Phase 6 last: Hardening and polish belong after the core functionality is stable

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Schema Design):** How to represent Docusaurus `<Tabs>` and `<Steps>` in Sanity Portable Text custom block types — no established precedent; requires experimentation
- **Phase 3 (Content Bridge):** `@portabletext/to-markdown` conversion fidelity for complex content — test with real content samples before committing
- **Phase 5 (Content Migration):** markdown-to-Portable-Text library selection — `sanity-markdown-to-blocks` vs `mdast-util-to-portable-text` vs manual; JSX-heavy MDX files make this the most ambiguous technical choice

**Phases with standard, well-documented patterns (safe to skip research-phase):**
- **Phase 1 (Cleanup):** Standard `npm uninstall` and dead code removal; no novel patterns
- **Phase 4 (Webhook):** Fully documented in Cloudflare Pages and Sanity official docs; configure, don't code
- **Phase 6 (Polish):** Sanity live preview pattern is extensively documented; Cloudflare Worker HMAC relay is standard

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | `@sanity/client` v6, Docusaurus 3.x, Cloudflare Pages deploy hooks — all official docs, stable APIs. MCP server package name needs verification at implementation time. |
| Features | HIGH | Based on direct codebase inspection + domain knowledge of Sanity Studio capabilities. Feature scope derived from actual project files and PROJECT.md constraints. |
| Architecture | HIGH | Docusaurus plugin lifecycle, Sanity GROQ API, Cloudflare deploy hooks — all well-documented. Portable Text → MDX conversion fidelity is MEDIUM (JSX complexity real). |
| Pitfalls | HIGH | All 7 critical pitfalls are directly evidenced in specific files and line numbers in the codebase. Not inferred — verified. |

**Overall confidence:** HIGH

### Gaps to Address

- **Portable Text to MDX conversion for JSX-heavy files:** The `@portabletext/to-markdown` package handles prose well but custom Docusaurus components (`<Tabs>`, `<Steps>`, `<Admonition>`) must be represented as custom block types in the schema and handled in the conversion step. The exact implementation requires experimentation — no off-the-shelf solution covers all of Docusaurus's custom components. **Handle during Phase 2 and Phase 3 planning.**

- **`@sanity/mcp-server` exact CLI invocation:** The MCP server package name is `@sanity/mcp-server` but the exact CLI flags may have evolved since the August 2025 knowledge cutoff. Verify against `sanity.io/docs/mcp` or the npm registry before Phase 2. **Handle at start of Phase 2.**

- **Role-based docs instances (Phase 5 decision):** The six `@docusaurus/plugin-content-docs` instances (`docs`, `internal`, `admin`, `manager`, `operator`, `operator-minimal`) are mostly empty shells. Whether to keep, consolidate, or remove them affects the Sanity schema (`targetAudience` field design) and the migration strategy. **This decision must be made during Phase 1 planning before any schema work begins.**

- **Algolia DocSearch plan tier:** The behavior of Algolia re-indexing post-deploy depends on whether the project is on the free DocSearch tier (daily scheduled crawl, no API trigger) or a paid plan (API-triggered crawl). Verify in the Algolia dashboard. **Handle during Phase 3 planning.**

---

## Sources

### Primary (HIGH confidence)

- `classic/package.json` — direct inspection; confirms Docusaurus 3.9.2, dead CMS packages, memory-constrained build script
- `classic/docusaurus.config.ts` — direct inspection; confirms Algolia, 6 docs plugin instances, `onBrokenLinks: 'ignore'`, role-based routing
- `classic/docs/` directory structure — direct inspection; 100+ articles across 15+ sections
- Sanity client v6 docs: https://www.sanity.io/docs/js-client
- Docusaurus Plugin Lifecycle API: https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis
- Cloudflare Pages Deploy Hooks: https://developers.cloudflare.com/pages/configuration/deploy-hooks/
- Sanity Webhooks: https://www.sanity.io/docs/webhooks
- Sanity GROQ API: https://www.sanity.io/docs/groq
- Sanity Studio v3: https://www.sanity.io/docs/studio
- Sanity draft document filtering: https://www.sanity.io/docs/drafts
- @portabletext/to-markdown: https://github.com/portabletext/to-markdown
- Algolia DocSearch: https://docsearch.algolia.com/docs/what-is-docsearch

### Secondary (MEDIUM confidence)

- `classic/scripts/fetchHygraphContent.js` — evidence of prebuild hook pattern and previous failed CMS fetch implementation
- `classic/src/lib/storyblok.ts`, `classic/src/pages/storyblok-example.tsx` — evidence of atomic deletion requirement
- `classic/api/page-feedback.ts`, `netlify/functions/page-feedback.mjs` — evidence of platform-split feedback function
- `classic/scripts/build-with-memory.js` — evidence of existing memory pressure (`--max-old-space-size=4096`)

### Tertiary (LOW confidence — needs validation at implementation)

- Sanity MCP Server: https://www.sanity.io/docs/mcp — newer feature; package name and CLI flags need verification
- `@portabletext/to-markdown` conversion fidelity for JSX-heavy MDX — inferred from package documentation; requires testing with real content
- markdown-to-Portable-Text library options for migration script — multiple packages exist (`sanity-markdown-to-blocks`, `mdast-util-to-portable-text`); selection requires evaluation against actual content samples

---

*Research completed: 2026-03-06*
*Ready for roadmap: yes*
