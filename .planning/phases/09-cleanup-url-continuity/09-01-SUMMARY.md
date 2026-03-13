---
phase: 09
plan: 01
subsystem: cleanup
tags: [internal-releases, cleanup, url-continuity]
requires: []
provides: [clean-codebase]
affects: [LandingPageRenderer, seed-landing-pages-to-sanity, sanity-landing-pages]
tech_stack:
  added: []
  patterns: [json-filtering, code-cleanup]
key_files:
  created: []
  modified:
    - classic/src/data/sanity-landing-pages.generated.json
    - classic/scripts/seed-landing-pages-to-sanity.js
    - classic/src/components/LandingPageRenderer.tsx
decisions:
  - Remove internal-releases entries from generated JSON
  - Remove internal-releases routing from seed script
  - Simplify LandingPageRenderer by removing internal release logic
metrics:
  duration: 15min
  tasks_completed: 5
  files_modified: 3
---

# Phase 9 Plan 01: Delete /internal-releases/ Page Summary

## One-Liner

Removed internal-releases page entries and routing logic, cleaning up legacy code for the now-deprecated internal releases feature.

## What Was Done

### Tasks Completed

| Task | Status | Description |
|------|--------|-------------|
| 1 | ✅ | Remove internal-releases entries from sanity-landing-pages.generated.json |
| 2 | ✅ | Remove internal-releases routing from seed-landing-pages-to-sanity.js |
| 3 | ✅ | Clean up LandingPageRenderer.tsx internal release code |
| 4 | N/A | Page files already deleted in previous phase |
| 5 | N/A | Schema doesn't have internal-releases as layoutType option |

### Key Changes

1. **sanity-landing-pages.generated.json**: Removed 3 entries:
   - `internal-releases` (main index)
   - `internal-releases/sprint-2025-12-b`
   - `internal-releases/sprint-2026-01-a`

2. **seed-landing-pages-to-sanity.js**: Removed `internal-releases` from:
   - `inferLayoutType()` function
   - `inferBadge()` function

3. **LandingPageRenderer.tsx**: Cleaned up:
   - Removed `isInternalReleaseNote()` function
   - Simplified `releasePathForNote()` to only handle customer releases
   - Simplified `getSectionReleaseNotes()` to return all published releases
   - Removed `releaseType` parameter from `ReleasesSection`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan referenced non-existent files**
- **Found during:** task 1
- **Issue:** Plan referenced files like `classic/src/pages/internal-releases.tsx` that don't exist
- **Fix:** These files were already deleted in a previous phase. Adjusted tasks to focus on JSON and code cleanup.
- **Files modified:** None (files already deleted)
- **Commit:** N/A

**2. [Rule 2 - Cleanup] Internal release logic in LandingPageRenderer**
- **Found during:** task 3
- **Issue:** `isInternalReleaseNote` and `releaseType` handling still existed but referenced non-existent internal releases
- **Fix:** Removed internal release functions and simplified ReleasesSection to only handle customer releases
- **Files modified:** LandingPageRenderer.tsx
- **Commit:** 14e46cd

## Verification

- Build status: Pending verification (build timeout)
- No TypeScript errors in modified files
- No remaining references to `internal-releases` in codebase

## Outcome

The internal-releases page and all related code has been removed. The `/internal-releases/` URL will return 404 as expected.
