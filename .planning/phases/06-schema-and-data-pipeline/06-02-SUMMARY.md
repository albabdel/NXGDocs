---
phase: 06-schema-and-data-pipeline
plan: "02"
subsystem: api
tags: [sanity, groq, json, data-pipeline, fetch]

# Dependency graph
requires:
  - phase: 06-schema-and-data-pipeline/06-01
    provides: release and roadmapItem Sanity schemas to query against
provides:
  - Extended fetch pipeline writing sanity-releases.generated.json and sanity-roadmap.generated.json
  - RELEASES_GENERATED_FILE and ROADMAP_GENERATED_FILE path constants
  - getReleasesQuery() and getRoadmapQuery() GROQ query functions
  - fetchReleases() and fetchRoadmapItems() async pipeline functions
  - Committed empty-array fallback JSON files in classic/src/data/
affects:
  - 07-releases-page
  - 08-roadmap-page

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GROQ inline dereference: screenshotUrl: screenshot.asset->url"
    - "GROQ reference resolution: releaseSlug: releaseRef->slug.current"
    - "Async fetch functions defined inside run() to close over client/stats/writtenFiles"
    - "Fallback empty-array JSON committed to git as import targets for SSG"

key-files:
  created:
    - classic/src/data/sanity-releases.generated.json
    - classic/src/data/sanity-roadmap.generated.json
  modified:
    - classic/scripts/fetch-sanity-content.js

key-decisions:
  - "fetchReleases() and fetchRoadmapItems() defined as inner async functions inside run() to close over shared state (client, stats, writtenFiles, includeDrafts)"
  - "releaseNote query block removed from getQueries() — release schema replaces it; release-notes generated file kept as [] in git per plan (delete deferred to Phase 9)"
  - "Both new generated files added to backup sources in createBackupSnapshot() for operational safety"

patterns-established:
  - "New data types: add path constant, GROQ query function, async fetch function, backup source entry, stats keys — all four sites"
  - "Fallback JSON files must be committed as [] before any phase that imports them statically"

requirements-completed:
  - SCHEMA-01
  - SCHEMA-03

# Metrics
duration: 3min
completed: 2026-03-13
---

# Phase 6 Plan 02: Schema & Data Pipeline — Fetch Extension Summary

**Extended fetch-sanity-content.js with GROQ queries for release and roadmapItem documents, writing sanity-releases.generated.json and sanity-roadmap.generated.json; old releaseNote query removed; both fallback files committed as [] for Phase 7/8 TypeScript builds**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-13T17:40:45Z
- **Completed:** 2026-03-13T17:43:43Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `RELEASES_GENERATED_FILE` and `ROADMAP_GENERATED_FILE` path constants, mirroring the existing `LANDING_PAGES_GENERATED_FILE` pattern
- Added `getReleasesQuery()` and `getRoadmapQuery()` GROQ query functions with inline dereferences (`screenshot.asset->url`, `releaseRef->slug.current`)
- Added `fetchReleases()` and `fetchRoadmapItems()` as inner async functions called from `run()` after `fetchLandingPages()`
- Removed the old `releaseNote` GROQ query from `getQueries()` and all associated write logic (kept stats keys and `RELEASE_NOTES_GENERATED_FILE` constant per plan)
- Added both new files to backup sources in `createBackupSnapshot()`
- Created `sanity-releases.generated.json` and `sanity-roadmap.generated.json` as committed empty-array fallbacks in `classic/src/data/`

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend fetch-sanity-content.js with releases and roadmap pipeline** - `2e9a136` (feat)
2. **Task 2: Create fallback JSON files and verify pipeline** - `e3874a6` (feat)

**Plan metadata:** (docs commit — see state update)

## Files Created/Modified
- `classic/scripts/fetch-sanity-content.js` - Extended with 2 query functions, 2 fetch functions, 2 path constants, 2 backup sources, 2 stats keys; releaseNote query block removed
- `classic/src/data/sanity-releases.generated.json` - Committed empty-array fallback; written by fetch script at build time
- `classic/src/data/sanity-roadmap.generated.json` - Committed empty-array fallback; written by fetch script at build time

## Decisions Made
- Inner function pattern for `fetchReleases()`/`fetchRoadmapItems()` matches existing `fetchLandingPages()` — all three close over `client`, `stats`, `writtenFiles`, `includeDrafts` from `run()` scope. No changes needed to call signature.
- `releaseNote` stats keys (`releaseNote: 0`, `releaseNoteJson: 0`) left in stats object — they are vestigial but harmless; the query and write logic that populated them is removed. Cleanup deferred to Phase 9.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Script runs correctly; exits with expected `Missing SANITY_PROJECT_ID` env-var error when no credentials are present (correct behavior — not a code defect).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 7 (Releases Page) can now import `sanity-releases.generated.json` — file exists in git as `[]`, will be populated by fetch script when Sanity credentials are present
- Phase 8 (Roadmap Page) can now import `sanity-roadmap.generated.json` — same readiness
- Both phases should verify non-zero document counts after mock data is entered (Phase 6 Plan 03)

---
*Phase: 06-schema-and-data-pipeline*
*Completed: 2026-03-13*
