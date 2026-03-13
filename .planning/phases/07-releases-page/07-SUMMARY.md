---
phase: 07-releases-page
plan: all
subsystem: releases
tags: [releases, sanity, docusaurus, plugin, react]

# Dependency graph
requires:
  - phase: 06-schema-and-data-pipeline
    provides: release and roadmapItem Sanity schemas, sanity-releases.generated.json
provides:
  - /releases index page driven by Sanity data
  - /releases/[slug] detail pages for each sprint release
  - Change-type badges with counts
  - Video embeds and screenshots on detail pages
affects:
  - 08-roadmap-page (shares releases JSON for hero banner)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Docusaurus plugin for dynamic route generation (docusaurus-plugin-release-pages)"
    - "Direct JSON import for static site generation"
    - "YouTube/Vimeo URL extraction for video embeds"
    - "Change-type badge system with visual indicators"

key-files:
  created:
    - classic/plugins/docusaurus-plugin-release-pages/index.js
    - classic/src/components/ReleaseDetailRenderer.tsx
  modified:
    - classic/src/pages/releases.tsx
    - classic/docusaurus.config.ts

key-decisions:
  - "Use Docusaurus plugin pattern for dynamic routes (Next.js-style [slug].tsx doesn't work in Docusaurus)"
  - "Render change-type badges on index page cards, not just detail page"
  - "Generate routes at build time from sanity-releases.generated.json"

requirements-completed:
  - REL-01
  - REL-02
  - REL-03
  - REL-04
  - REL-05
  - REL-06
  - REL-07
  - REL-08
  - REL-09

# Metrics
duration: 25min
completed: 2026-03-13
---
# Phase 7: Releases Page Summary

**Replaced hardcoded releases pages with Sanity-driven index and detail pages using a custom Docusaurus plugin for dynamic route generation.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-03-13T18:30:00Z
- **Completed:** 2026-03-13T18:55:00Z
- **Tasks:** 5
- **Files modified:** 4
- **Commits:** 4

## Accomplishments

### Plan 07-01: Releases Index Page
- Replaced `SanityLandingPageRoute` wrapper with direct JSON import
- Rendered releases in reverse-chronological order from `sanity-releases.generated.json`
- Added "Latest" badge to most recent release
- Implemented change-type badges with counts (feature/fix/improvement/breaking/security)
- Added empty state handling for when no releases exist
- Cards link to `/releases/[slug]` detail pages

### Plan 07-02: Release Detail Page
- Created `docusaurus-plugin-release-pages` plugin for dynamic route generation
- Created `ReleaseDetailRenderer` component for release detail pages
- Implemented video embed support (YouTube/Vimeo URL extraction)
- Added screenshot display with lazy loading
- Added affected-areas tags on items
- Included release summary stats section
- Added not-found state with friendly error page
- Discovered that Next.js-style `[slug].tsx` dynamic routes don't work in Docusaurus

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] useParam hook not exported from Docusaurus**
- **Found during:** Plan 07-02 Task 1
- **Issue:** Research document stated `useParam` hook could be used for dynamic routes, but Docusaurus doesn't export this hook
- **Fix:** Switched to Docusaurus plugin pattern using `addRoute` and `createData` APIs, following the existing `docusaurus-plugin-sanity-landing-pages` pattern
- **Files modified:** Created `docusaurus-plugin-release-pages` plugin and `ReleaseDetailRenderer` component
- **Commit:** 1a2d01a

**2. [Rule 3 - Blocking] [slug].tsx file doesn't work in Docusaurus**
- **Found during:** Plan 07-02 verification
- **Issue:** Created `[slug].tsx` file expecting Next.js-style dynamic routing, but Docusaurus treats brackets as literal characters
- **Fix:** Removed the file and used plugin-based route generation instead
- **Files modified:** Deleted `classic/src/pages/releases/[slug].tsx`
- **Commit:** 9e8335d

## Files Changed

| File | Action | Lines Changed |
|------|--------|---------------|
| `classic/src/pages/releases.tsx` | Replaced | +252/-7 |
| `classic/plugins/docusaurus-plugin-release-pages/index.js` | Created | +70 |
| `classic/src/components/ReleaseDetailRenderer.tsx` | Created | +329 |
| `classic/docusaurus.config.ts` | Modified | +1 |

## Verification Results

- [x] `/releases` page renders with mock data
- [x] Releases appear in reverse-chronological order
- [x] First release shows "Latest" badge
- [x] Change-type badges display with correct colors
- [x] Cards link to `/releases/[slug]` routes
- [x] `/releases/sprint-2026-03-a` detail page renders
- [x] Release header shows title, date, sprintId, summary
- [x] Items list shows all items with titles
- [x] Affected-areas tags display on items
- [x] "Back to Releases" navigation works
- [x] `npm run build` succeeds

## Key Learnings

1. **Docusaurus Dynamic Routes**: Unlike Next.js, Docusaurus requires plugins to generate dynamic routes at build time. The `addRoute` and `createData` APIs are the correct pattern.

2. **Plugin Pattern**: The existing `docusaurus-plugin-sanity-landing-pages` provided a reusable template for generating routes from JSON data.

3. **Change-Type Badges**: Implemented badge colors that match the site's existing styling:
   - feature: green
   - fix: blue
   - improvement: yellow/gold
   - breaking: red
   - security: purple
