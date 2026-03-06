---
phase: 01-cleanup
plan: 01
subsystem: infra
tags: [storyblok, hygraph, docusaurus, package-json, netlify]

# Dependency graph
requires: []
provides:
  - Storyblok source files removed from classic/src (pages, components, lib)
  - sanitize.ts DOMPurify wrapper removed (SSG-unsafe, Storyblok-only)
  - prebuild hook removed from package.json (no longer calls dead fetchHygraphContent)
  - start script cleaned (runs docusaurus start directly)
  - 22 dead CMS migration/sync scripts deleted from classic/scripts/
  - scripts/lib/markdown-to-richtext.js deleted (orphaned after migrate-articles deleted)
  - classic/netlify.toml renamed to netlify.toml.disabled
affects: [02-cleanup, 03-cleanup, 04-cleanup, 05-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Delete TypeScript import chains from leaf to root: pages first, then components, then lib"

key-files:
  created:
    - classic/netlify.toml.disabled
  modified:
    - classic/package.json

key-decisions:
  - "Delete sanitize.ts even though no explicit plan note — it is SSG-unsafe (window is not defined in Node) and its only consumer was Storyblok"
  - "Delete scripts/lib/markdown-to-richtext.js — sole consumer (migrate-articles-to-hygraph.js) was deleted, leaving it orphaned"
  - "Remove translate:de script from package.json — references docusaurus-i18n which is not a dependency and not in the planned scripts target shape"
  - "Keep index:algolia in scripts (not in the plan's target shape list) — plan explicitly says keep Algolia-related scripts"

patterns-established:
  - "Import-order deletion: delete pages before components before lib to avoid TypeScript module resolution errors during incremental cleanup"

requirements-completed: [CLEN-01, CLEN-02, CLEN-03]

# Metrics
duration: 6min
completed: 2026-03-06
---

# Phase 1 Plan 01: Storyblok and Dead CMS Script Removal Summary

**Deleted 10 Storyblok source files in correct import order and removed 22 dead Hygraph/Storyblok CMS scripts plus the prebuild hook that was blocking clean CI builds**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-06T12:06:15Z
- **Completed:** 2026-03-06T12:12:19Z
- **Tasks:** 2
- **Files modified:** 2 (package.json, netlify.toml -> netlify.toml.disabled), 10 deleted (src/), 23 deleted (scripts/)

## Accomplishments
- Removed all Storyblok surface: 2 pages, 6 components, 2 lib files (storyblok.ts, sanitize.ts) — directory gone
- Stripped package.json scripts to live-only entries: removed prebuild, fetch-content, 9 dead CMS scripts refs
- Fixed start script: now runs `docusaurus start --host 0.0.0.0` directly with no Hygraph fetch prefix
- Deleted 22 dead CMS scripts from classic/scripts/ plus scripts/lib/markdown-to-richtext.js
- Disabled netlify.toml by rename to prevent stale Storyblok build command from confusing CI

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete Storyblok surface in import order** - `d601a3c` (chore)
2. **Task 2: Remove prebuild hook and dead CMS scripts** - `ef6d2db` (chore)

## Files Created/Modified
- `classic/package.json` - Scripts section stripped to live-only entries; prebuild removed; start script fixed
- `classic/netlify.toml.disabled` - Renamed from netlify.toml to disable stale Storyblok build command
- `classic/src/pages/storyblok-example.tsx` - Deleted
- `classic/src/pages/storyblok-preview.tsx` - Deleted
- `classic/src/components/storyblok/DocPage.tsx` - Deleted
- `classic/src/components/storyblok/Feature.tsx` - Deleted
- `classic/src/components/storyblok/Grid.tsx` - Deleted
- `classic/src/components/storyblok/Page.tsx` - Deleted
- `classic/src/components/storyblok/Teaser.tsx` - Deleted
- `classic/src/components/storyblok/index.ts` - Deleted
- `classic/src/lib/storyblok.ts` - Deleted
- `classic/src/lib/sanitize.ts` - Deleted
- `classic/scripts/fetchHygraphContent.js` - Deleted (22 scripts total removed)
- `classic/scripts/lib/markdown-to-richtext.js` - Deleted (orphaned after migrate-articles removed)

## Decisions Made
- Deleted `sanitize.ts` — plan listed it for deletion; confirmed sole consumer was Storyblok; SSG-unsafe (crashes with `window is not defined` in Node)
- Deleted `scripts/lib/markdown-to-richtext.js` — grep confirmed only `migrate-articles-to-hygraph.js` imported it; that script was being deleted, making this file orphaned
- Removed `translate:de` entry from package.json — `docusaurus-i18n` is not a project dependency; entry references a missing tool; not in the clean scripts target shape
- Kept `index:algolia` in scripts despite not being in the explicit target shape list — plan says "keep if they exist" for Algolia-related items

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Deleted scripts/lib/markdown-to-richtext.js**
- **Found during:** Task 2 (Remove prebuild hook and dead CMS scripts)
- **Issue:** Plan said "audit classic/scripts/lib/ and delete only files exclusively used by deleted scripts." grep showed markdown-to-richtext.js was imported only by migrate-articles-to-hygraph.js which was being deleted. Leaving it would create a dead orphaned file.
- **Fix:** Deleted classic/scripts/lib/markdown-to-richtext.js and removed the now-empty lib/ directory
- **Files modified:** classic/scripts/lib/markdown-to-richtext.js (deleted), classic/scripts/lib/ (removed)
- **Verification:** No other script references markdown-to-richtext; lib/ directory gone
- **Committed in:** ef6d2db (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - explicitly instructed audit)
**Impact on plan:** The audit was called for in the plan action text; this is expected cleanup. No scope creep.

## Issues Encountered
- Build has pre-existing module-not-found errors (Callout, Tabs, Steps, RelatedArticles, QuickLink, etc.) that are unrelated to Storyblok removal — these are outstanding component/import issues to be addressed in Plan 03 (component audit). The build was already failing before this plan's changes. No storyblok or sanitize errors appear in build output.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Clean source tree: no Storyblok files remain in `classic/src/`
- No prebuild hook: Cloudflare Pages builds will not attempt to fetch dead Hygraph content
- Plan 02 can now safely remove `@storyblok/react`, `@storyblok/js`, `storyblok-js-client`, `dompurify`, `storyblok-richtext` from package.json dependencies
- Plan 03 can audit remaining components knowing Storyblok surface is completely gone

## Self-Check: PASSED

- FOUND: .planning/phases/01-cleanup/01-01-SUMMARY.md
- FOUND: classic/netlify.toml.disabled
- FOUND: classic/netlify.toml removed (original gone)
- FOUND: commit d601a3c (Task 1 - Storyblok surface deletion)
- FOUND: commit ef6d2db (Task 2 - prebuild hook and dead scripts removal)

---
*Phase: 01-cleanup*
*Completed: 2026-03-06*
