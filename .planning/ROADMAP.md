# Roadmap: NXGEN GCXONE Documentation Platform

## Milestones

- v1.0 MVP - Phases 1-5 (shipped 2026-03-08)
- v1.1 Releases & Roadmap - Phases 6-9 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-5) - SHIPPED 2026-03-08</summary>

### Phase 1: Cleanup
**Goal**: The Docusaurus build is clean, fast, and free of dead CMS code — a stable foundation for Sanity integration
**Depends on**: Nothing (first phase)
**Requirements**: CLEN-01, CLEN-02, CLEN-03, CLEN-04, INTG-03, INTG-04
**Success Criteria** (what must be TRUE):
  1. `npm run build` in the classic directory completes without errors and without referencing any Storyblok, TinaCMS, Hygraph, Strapi, Payload, Tiptap, Monaco, or GraphQL packages
  2. The Cloudflare Pages build command no longer runs `fetchHygraphContent.js` or any other dead prebuild hook
  3. No unused React components remain in `src/components/` — every component in the directory is actively rendered somewhere on the site
  4. The site CSS is a single consolidated stylesheet under 2,000 lines with the visual design unchanged and no dead rules
  5. `onBrokenLinks` is set to at minimum `'warn'` and the build log surfaces any broken link rather than silently ignoring it
  6. The feedback widget calls `/functions/page-feedback` (Cloudflare Pages Function) and no Netlify or Vercel function files remain
**Plans**: 8 plans

Plans:
- [x] 01-01-PLAN.md — Delete Storyblok files (atomic import-order deletion) and remove dead CMS scripts + prebuild hook from package.json
- [x] 01-02-PLAN.md — Audit and delete confirmed-orphaned components; remove co-located CSS rules
- [x] 01-03-PLAN.md — Remove all dead npm packages in verified batches (Storyblok, Tiptap, Monaco, GraphQL, dnd-kit, tsparticles, MUI, i18n, PDF)
- [x] 01-04-PLAN.md — Final CSS consolidation pass to under 2,000 lines; human visual spot-check
- [x] 01-05-PLAN.md — Upgrade onBrokenLinks to 'warn' → fix all broken links → elevate to 'throw'
- [x] 01-06-PLAN.md — Rewrite feedback widget as Cloudflare Pages Function (ZeptoMail HTTP API); delete dead Netlify/Vercel files; remove nodemailer
- [x] 01-07-PLAN.md — [GAP] Delete 10 remaining orphaned components (BackToTop, Badge, Collapsible, EnhancedFeatureCard, ErrorBoundary, FeaturesGrid, PrevNext, QuickLinks, Skeleton, VideoEmbed)
- [x] 01-08-PLAN.md — [GAP] Delete classic/api/feedback.ts and netlify/functions/storyblok-to-gitlab.mjs; create voc-feedback Cloudflare Pages Function; update VoCModal fetch URL

### Phase 2: CMS Setup
**Goal**: Sanity is ready for content — MCP operational, Studio accessible, and all four schemas locked before any content is entered
**Depends on**: Phase 1
**Requirements**: CMS-01, CMS-02, CMS-03
**Success Criteria** (what must be TRUE):
  1. Claude can create and update Sanity schemas through the MCP server without the user touching the Sanity dashboard
  2. Sanity Studio is accessible at a public `*.sanity.studio` URL and an editor can log in and see all four document types (doc, releaseNote, article, reference)
  3. A test document can be created in Studio for each content type, saved as a draft, and published — all fields validate correctly and slugs follow the existing `/docs/...` URL pattern
  4. Environment variables `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_TOKEN` are set in Cloudflare Pages settings
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Scaffold Sanity Studio in studio/ subdirectory and register Sanity MCP server in Claude Code
- [x] 02-02-PLAN.md — Write all 4 content-type schemas (doc, releaseNote, article, reference) and deploy schema manifest
- [x] 02-03-PLAN.md — Deploy Studio to *.sanity.studio, set CF Pages env vars, human-verify full Studio flow

### Phase 3: Integration Pipeline
**Goal**: Sanity content appears in the live site automatically when an editor clicks publish in Studio
**Depends on**: Phase 2
**Requirements**: INTG-01, INTG-02, INTG-03
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` locally fetches content from Sanity via GROQ and generates pages in `.sanity-cache/` — Sanity-sourced pages appear in the Docusaurus output alongside existing MDX pages
  2. Publishing a document in Sanity Studio triggers a Cloudflare Pages rebuild and the change appears on docs.nxgen.cloud within 5 minutes — no developer action required
  3. The feedback widget works correctly on Cloudflare Workers — it sends feedback via HTTP email API without using `nodemailer`, and no Vercel or Netlify function formats remain in the repo
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Install @sanity/client + @portabletext/markdown; add .sanity-cache/ to both .gitignore files; scaffold Playwright spec
- [x] 03-02-PLAN.md — Build docusaurus-plugin-sanity-content (GROQ fetch → Portable Text → MDX); register in docusaurus.config.ts first; human-verify end-to-end build
- [x] 03-03-PLAN.md — Create Cloudflare Pages deploy hook and register Sanity GROQ webhook; human-verify Studio publish triggers live rebuild
- [x] 03-04-PLAN.md — Verify feedback widget end-to-end: confirm ZEPTO_API_KEY set, smoke-test live endpoint, confirm email delivery

### Phase 4: Content Migration
**Goal**: All reader-facing content lives in Sanity, no live URL returns 404, and editors can manage everything from Studio
**Depends on**: Phase 3
**Requirements**: MIGR-01, MIGR-02, MIGR-03, MIGR-04, MIGR-05
**Success Criteria** (what must be TRUE):
  1. Every product documentation page previously served from `classic/docs/` is now served from Sanity content — the same `/docs/...` URL resolves to the same page with no 404
  2. All release notes and sprint update content is in Sanity and browseable in Studio under the releaseNote document type
  3. All long-form articles are in Sanity and visible in the live site with content freshness dates from Sanity `_updatedAt`
  4. All reference pages (specs, glossary, tables) are in Sanity and render correctly in Docusaurus
  5. A full URL sweep of the live site finds zero new 404s introduced by migration — all previously valid paths still resolve
**Plans**: TBD

### Phase 5: Polish
**Goal**: The site is visually consistent and readers can find content faster than before
**Depends on**: Phase 4
**Requirements**: PLSH-01, PLSH-02
**Success Criteria** (what must be TRUE):
  1. A user navigating from the home page can reach any major content section in no more than two clicks — sidebar structure and top-level navigation reflect the actual content hierarchy
  2. Pagefind search returns relevant results for common user queries — index is built at deploy time from the Docusaurus build output; no external service dependency
  3. All visual inconsistencies are resolved — font sizes, spacing, color usage, and component styling are consistent across all page types without changing the overall design direction
**Plans**: 6 plans (3 original + 3 gap-closure identified in 05-03 checkpoint)

Plans:
- [x] 05-01-PLAN.md — Scaffold Playwright test specs (Wave 0); fix VoC modal light-mode invisible text; fix D4A047 link color override; resolve Footer placeholder # links
- [x] 05-02-PLAN.md — Algolia credential unification (App ID + indexName unified to match indexer script; contextualSearch disabled)
- [x] 05-03-PLAN.md — Run Playwright suite (8 passed, 1 skipped); human verification checkpoint — NOT approved, 3 gaps identified
- [x] 05-04-PLAN.md — [GAP] Complete Pagefind migration: postbuild script, @getcanary/docusaurus-theme-search-pagefind, remove Algolia themeConfig block, update search.spec.ts selectors
- [x] 05-05-PLAN.md — [GAP] Hero light mode redesign: increase background.jpg opacity, reduce white overlay, accessible gold on light background
- [x] 05-06-PLAN.md — [GAP] Light mode contrast sweep: index.tsx + custom.css #E8B058 → accessible token for light mode; re-run human verification checkpoint (approved 2026-03-08)

</details>

---

### v1.1 Releases & Roadmap (In Progress)

**Milestone Goal:** Give customers a public releases page and browseable product roadmap, both managed through Sanity Studio — editors publish content, the site rebuilds automatically.

**Phase Numbering:** v1.1 starts at 6 (continuing from v1.0 which ended at 5).

- [ ] **Phase 6: Schema & Data Pipeline** - Replace releaseNote schema, add roadmapItem schema, and extend the fetch pipeline to produce verified JSON for all downstream pages
- [ ] **Phase 7: Releases Page** - Replace the hardcoded releases page with a Sanity-driven index and per-sprint detail pages with full rich media support
- [ ] **Phase 8: Roadmap Page & Hero Banner** - Replace the hardcoded roadmap page with a Sanity-driven, filterable page and wire the hero banner to show the latest release dynamically
- [ ] **Phase 9: Cleanup & URL Continuity** - Remove legacy pages and dead files, verify all URL patterns resolve correctly, and confirm no 404s were introduced

## Phase Details

### Phase 6: Schema & Data Pipeline
**Goal**: Editors can create sprint releases and roadmap items in Sanity Studio, and the build pipeline produces verified JSON files containing that data — every downstream page has correct data to import
**Depends on**: Phase 5
**Requirements**: SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04, MOCK-01, MOCK-02
**Success Criteria** (what must be TRUE):
  1. Editor can open Sanity Studio, create a new sprint release document with an array of items (each with title, body, change type, affected areas, optional screenshot, optional video embed URL), and publish it without errors
  2. Editor can create a roadmap item with all fields populated (title, description, status, business value, change type, UI change flag, entities impacted, projected release date) and link a Shipped item to a specific sprint release
  3. Running the build locally produces non-empty `sanity-releases.generated.json` and `sanity-roadmap.generated.json` files — confirmed by log output showing document counts greater than zero
  4. The old `releaseNote` schema and its GROQ query are fully removed — no references remain in Studio config, structure, or schemaTypes index
  5. Sample data (2-3 sprint releases with items, 5-8 roadmap items covering all three statuses) is present in Sanity Studio and visible in GROQ Vision
**Plans**: TBD

### Phase 7: Releases Page
**Goal**: Visitors can browse all published sprint releases at /releases, click into any release for the full detail view with screenshots and video, and the most recent release is visually distinguished
**Depends on**: Phase 6
**Requirements**: REL-01, REL-02, REL-03, REL-04, REL-05, REL-06, REL-07, REL-08, REL-09
**Success Criteria** (what must be TRUE):
  1. Visiting /releases shows a reverse-chronological list of sprint releases driven by Sanity data — each card shows sprint ID, publish date, summary, and change-type badges, and the most recent release carries a "Latest" badge
  2. Clicking any release card opens the full detail page at /releases/[slug] — every item in that sprint shows its title, body text, change-type tag, and affected-areas tags
  3. Release items with screenshots display the images inline on the detail page; items with video embed URLs display the embedded player
  4. Release items that reference a documentation page show a "Read the docs" link that navigates to the correct page
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md — Releases index page: replace SanityLandingPageRoute with direct JSON import; render reverse-chronological list with cards and "Latest" badge
- [ ] 07-02-PLAN.md — Release detail page: dynamic [slug] route with items, screenshots, video embeds, affected-areas tags

### Phase 8: Roadmap Page & Hero Banner
**Goal**: Visitors can find and explore roadmap items by status or keyword at /roadmap, shipped items link back to their release notes, and the home page hero banner dynamically shows the latest sprint name from Sanity
**Depends on**: Phase 6
**Requirements**: ROAD-01, ROAD-02, ROAD-03, ROAD-04, ROAD-05, ROAD-06, ROAD-07, HERO-01
**Success Criteria** (what must be TRUE):
  1. Visiting /roadmap shows all roadmap items from Sanity — user can filter by status (Planned / In Progress / Shipped) and the results update immediately without a page reload
  2. User can type a keyword in the search box and roadmap items filter to show only those whose title or description match — a results count is visible and an empty state with "Clear filters" appears when nothing matches
  3. Expanding a roadmap item reveals its business value, change type, UI change flag, entities impacted, and projected release date; a Shipped item shows a "Released in [Sprint X]" link that navigates to the correct release detail page
  4. The roadmap page footer shows "Last updated: [date]" pulled from Sanity
  5. The hero banner on the home page shows the latest published sprint title and date — the string is not hardcoded and updates automatically when a new release is published in Sanity
**Plans**: TBD

### Phase 9: Cleanup & URL Continuity
**Goal**: No legacy pages or dead files remain in the codebase, and every previously valid URL still resolves correctly — visitors and search engines encounter no 404s from the migration
**Depends on**: Phase 7, Phase 8
**Requirements**: ARCH-01, ARCH-02, ARCH-03
**Success Criteria** (what must be TRUE):
  1. Navigating to /internal-releases/ returns a redirect or clean 404 — the legacy page component is deleted from the codebase
  2. All previously valid sprint URLs (e.g. /releases/sprint-2025-12-b) resolve to the correct page — a URL sweep of known legacy paths finds zero new 404s
  3. Sprint 2025.12-A and Sprint 2025.12-B are no longer visible on the public /releases index — they are archived and do not appear in the Sanity-driven page output
**Plans**: TBD

## Progress

**Execution Order:**
v1.0 complete. v1.1 executes: 6 → 7 → 8 (parallel after 6) → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Cleanup | v1.0 | 8/8 | Complete | 2026-03-07 |
| 2. CMS Setup | v1.0 | 3/3 | Complete | 2026-03-07 |
| 3. Integration Pipeline | v1.0 | 4/4 | Complete | 2026-03-07 |
| 4. Content Migration | v1.0 | TBD/TBD | Complete | 2026-03-08 |
| 5. Polish | v1.0 | 6/6 | Complete | 2026-03-08 |
| 6. Schema & Data Pipeline | 1/3 | In Progress|  | - |
| 7. Releases Page | v1.1 | 2/2 | Planned | 2026-03-13 |
| 8. Roadmap Page & Hero Banner | v1.1 | 0/TBD | Not started | - |
| 9. Cleanup & URL Continuity | v1.1 | 0/TBD | Not started | - |
