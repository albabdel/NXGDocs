# Roadmap: NXGEN GCXONE Documentation Platform

## Overview

The project starts by excising five previous failed CMS integrations from the codebase, leaving a clean Docusaurus build. Sanity CMS is then configured via MCP, schemas are locked, and a custom build-time plugin wires Sanity content into Docusaurus alongside a webhook that triggers automatic Cloudflare Pages rebuilds on publish. All existing MDX content is migrated to Sanity section by section with zero URL breakage. A final polish phase tightens navigation, search, and visual consistency. At completion, a non-technical editor can write in Sanity Studio and have changes live on docs.nxgen.cloud within minutes — no developer involvement.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Cleanup** - Remove all dead CMS code, consolidate CSS, and stabilize the build (completed 2026-03-07)
- [x] **Phase 2: CMS Setup** - Create Sanity project, configure MCP server, and lock all content schemas (completed 2026-03-07)
- [ ] **Phase 3: Integration Pipeline** - Build the Docusaurus-Sanity plugin, rewrite feedback widget, and wire publish webhook
- [ ] **Phase 4: Content Migration** - Move all MDX content into Sanity section by section with zero URL breakage
- [ ] **Phase 5: Polish** - Refine navigation, search UX, and visual consistency

## Phase Details

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
- [ ] 01-01-PLAN.md — Delete Storyblok files (atomic import-order deletion) and remove dead CMS scripts + prebuild hook from package.json
- [ ] 01-02-PLAN.md — Audit and delete confirmed-orphaned components; remove co-located CSS rules
- [ ] 01-03-PLAN.md — Remove all dead npm packages in verified batches (Storyblok, Tiptap, Monaco, GraphQL, dnd-kit, tsparticles, MUI, i18n, PDF)
- [ ] 01-04-PLAN.md — Final CSS consolidation pass to under 2,000 lines; human visual spot-check
- [ ] 01-05-PLAN.md — Upgrade onBrokenLinks to 'warn' → fix all broken links → elevate to 'throw'
- [ ] 01-06-PLAN.md — Rewrite feedback widget as Cloudflare Pages Function (ZeptoMail HTTP API); delete dead Netlify/Vercel files; remove nodemailer
- [ ] 01-07-PLAN.md — [GAP] Delete 10 remaining orphaned components (BackToTop, Badge, Collapsible, EnhancedFeatureCard, ErrorBoundary, FeaturesGrid, PrevNext, QuickLinks, Skeleton, VideoEmbed)
- [ ] 01-08-PLAN.md — [GAP] Delete classic/api/feedback.ts and netlify/functions/storyblok-to-gitlab.mjs; create voc-feedback Cloudflare Pages Function; update VoCModal fetch URL

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
- [ ] 02-01-PLAN.md — Scaffold Sanity Studio in studio/ subdirectory and register Sanity MCP server in Claude Code
- [ ] 02-02-PLAN.md — Write all 4 content-type schemas (doc, releaseNote, article, reference) and deploy schema manifest
- [ ] 02-03-PLAN.md — Deploy Studio to *.sanity.studio, set CF Pages env vars, human-verify full Studio flow

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
- [ ] 03-01-PLAN.md — Install @sanity/client + @portabletext/markdown; add .sanity-cache/ to both .gitignore files; scaffold Playwright spec
- [ ] 03-02-PLAN.md — Build docusaurus-plugin-sanity-content (GROQ fetch → Portable Text → MDX); register in docusaurus.config.ts first; human-verify end-to-end build
- [ ] 03-03-PLAN.md — Create Cloudflare Pages deploy hook and register Sanity GROQ webhook; human-verify Studio publish triggers live rebuild
- [ ] 03-04-PLAN.md — Verify feedback widget end-to-end: confirm ZEPTO_API_KEY set, smoke-test live endpoint, confirm email delivery

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
  2. Algolia search returns relevant results for common user queries — search index reflects the Sanity-sourced content structure and no stale or broken entries appear in results
  3. All visual inconsistencies are resolved — font sizes, spacing, color usage, and component styling are consistent across all page types without changing the overall design direction
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Cleanup | 6/8 | Complete    | 2026-03-07 |
| 2. CMS Setup | 3/3 | Complete    | 2026-03-07 |
| 3. Integration Pipeline | 1/4 | In Progress|  |
| 4. Content Migration | 0/TBD | Not started | - |
| 5. Polish | 0/TBD | Not started | - |
