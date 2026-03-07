# Requirements: NXGEN GCXONE Documentation Platform

**Defined:** 2026-03-06
**Core Value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.

## v1 Requirements

### Cleanup

- [x] **CLEN-01**: Codebase builds cleanly after removing all dead CMS packages (Storyblok, TinaCMS, Hygraph, Strapi, Payload, Tiptap, Monaco, Express, GraphQL client, and their transitive dependencies)
- [x] **CLEN-02**: Cloudflare Pages build no longer calls `fetchHygraphContent.js` or any legacy prebuild hooks
- [x] **CLEN-03**: Unused React components identified and removed — only components actively rendered in the site remain
- [x] **CLEN-04**: CSS consolidated from ~3,800 lines to a maintainable stylesheet with dead rules removed and visual design preserved

### CMS Setup

- [x] **CMS-01**: Sanity MCP server configured and operational so Claude can create/update schemas, query content, and manage the Sanity project without manual dashboard interaction
- [x] **CMS-02**: Sanity project created with cloud-hosted Studio accessible at a public URL
- [x] **CMS-03**: Content schemas defined for all 4 content types: product documentation, release notes, long-form articles, and reference pages — with slug fields matching existing URL patterns

### Content Integration

- [ ] **INTG-01**: Custom Docusaurus plugin fetches content from Sanity at build time via GROQ and generates MDX files — Docusaurus renders them as normal pages
- [ ] **INTG-02**: Sanity publish event triggers Cloudflare Pages rebuild via deploy hook — live site updates within minutes of clicking publish in Studio
- [x] **INTG-03**: Feedback widget rewritten to use `fetch()` to an HTTP email API — works on Cloudflare Workers (removes `nodemailer` dependency)
- [x] **INTG-04**: Broken links audited and resolved — `onBrokenLinks` upgraded from `'ignore'` to at minimum `'warn'`

### Content Migration

- [ ] **MIGR-01**: All product documentation MDX files migrated to Sanity with slug continuity (existing `/docs/...` URLs remain valid)
- [ ] **MIGR-02**: All release notes and sprint update content migrated to Sanity
- [ ] **MIGR-03**: All long-form articles migrated to Sanity
- [ ] **MIGR-04**: All reference pages (specs, glossary, tables) migrated to Sanity
- [ ] **MIGR-05**: Zero 404s introduced — all live URLs verified functional after migration

### Polish

- [ ] **PLSH-01**: Navigation and search UX improved — sidebar structure refined, content discovery measurably faster
- [ ] **PLSH-02**: Visual inconsistencies resolved — CSS cleaned up, design direction polished without changing the overall visual identity

## v2 Requirements

### CMS Enhancements

- **CMS-V2-01**: Cloudinary asset source plugin in Sanity Studio — images uploaded in Studio go to Cloudinary automatically
- **CMS-V2-02**: Live preview in Sanity Studio — editors see how pages look before publishing
- **CMS-V2-03**: Role-based content targeting — `targetAudience` field routes docs to correct reader role

### Content Quality

- **QUAL-V2-01**: `onBrokenLinks` upgraded to `'throw'` — build fails on any broken link
- **QUAL-V2-02**: Algolia crawler reconfigured to reflect new Sanity-sourced content structure

### Component Library

- **COMP-V2-01**: Component library documented — each component has usage notes and props listed
- **COMP-V2-02**: Performance audit — bundle size measured and optimized post-cleanup

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-language support | Disabled in current config; not a priority for current audience |
| Mobile app | Web-first; native app is a separate project |
| Real-time collaborative editing | Not needed for solo/small team workflow |
| Self-hosted CMS | User cannot maintain backend infrastructure |
| Custom Studio plugins | Anti-feature — previous complexity was the root cause of 5 failed CMS attempts |
| Content approval/review workflow | Overkill for single editor; adds friction to publish flow |
| Scheduled publishing | Not in scope for v1 |
| Rebuilding frontend from scratch | Polish and extend what exists |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEN-01 | Phase 1 | Complete |
| CLEN-02 | Phase 1 | Complete |
| CLEN-03 | Phase 1 | Complete |
| CLEN-04 | Phase 1 | Complete |
| INTG-04 | Phase 1 | Complete |
| CMS-01 | Phase 2 | Complete |
| CMS-02 | Phase 2 | Complete |
| CMS-03 | Phase 2 | Complete |
| INTG-01 | Phase 3 | Pending |
| INTG-02 | Phase 3 | Pending |
| INTG-03 | Phase 3 | Complete |
| MIGR-01 | Phase 4 | Pending |
| MIGR-02 | Phase 4 | Pending |
| MIGR-03 | Phase 4 | Pending |
| MIGR-04 | Phase 4 | Pending |
| MIGR-05 | Phase 4 | Pending |
| PLSH-01 | Phase 5 | Pending |
| PLSH-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-07 — CMS-01, CMS-02, CMS-03 marked complete after Phase 2 completion*
