---
phase: 06-schema-and-data-pipeline
plan: "01"
subsystem: cms
tags: [sanity, schema, migration, typescript]

# Dependency graph
requires: []
provides:
  - studio/schemaTypes/release.ts — release document type with items[] inline array
  - studio/schemaTypes/roadmapItem.ts — roadmapItem document type with releaseRef reference to release
  - Updated schema registry in studio/schemaTypes/index.ts
  - Updated studio/sanity.config.ts (Sprint Release template, widget types, typesWithCustomActions)
  - Updated studio/src/structure.ts (Sprint Releases and Roadmap Items sidebar entries)
affects:
  - 06-schema-and-data-pipeline/06-02
  - 07-releases-page
  - 08-roadmap-page

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline items[] array inside document type (items as array of objects, not separate documents)"
    - "defineArrayMember({type: 'object', name: 'releaseItem', fields: [...]}) for inline array members"
    - "Reference field scoped to single type: defineField({type: 'reference', to: [{type: 'release'}]})"
    - "Atomic migration: all 7 registration sites updated in single commit to prevent partial-migration compile errors"

key-files:
  created:
    - studio/schemaTypes/release.ts
    - studio/schemaTypes/roadmapItem.ts
  modified:
    - studio/schemaTypes/index.ts
    - studio/sanity.config.ts
    - studio/src/structure.ts
    - studio/schemaTypes/folder.ts
    - studio/schemaTypes/importTool.ts
    - studio/schemaTypes/portableText-ultimate.ts
    - studio/schemaTypes/portableText.ts
  deleted:
    - studio/schemaTypes/releaseNote.ts

key-decisions:
  - "Atomic migration approach: all 7 releaseNote reference sites updated and releaseNote.ts deleted in a single commit — partial migration would leave Studio in broken state with TypeScript errors"
  - "release schema uses displayTitle (customer-facing) + sprintId (internal, optional) — separates customer copy from engineering identifiers"
  - "items[] inline array chosen over separate documents — matches bi-weekly publish workflow, simpler Studio UX"
  - "releaseRef on roadmapItem is optional (no required validation) — Planned and In Progress items have no release to link yet"

requirements-completed:
  - SCHEMA-01
  - SCHEMA-02
  - SCHEMA-03
  - SCHEMA-04

# Metrics
duration: 8min
completed: 2026-03-13
---

# Phase 6 Plan 01: Schema Migration Summary

**Atomically replaced releaseNote Sanity schema with release (items[] inline array) and roadmapItem schemas, updating all 7 registration sites across 3 files in a single commit, verified live in Sanity Studio at nxgen-docs.sanity.studio**

## Performance

- **Duration:** ~8 min
- **Completed:** 2026-03-13
- **Tasks:** 2 auto + 1 human-verify checkpoint
- **Files modified:** 9 (2 created, 7 updated, 1 deleted)

## Accomplishments

- Created `studio/schemaTypes/release.ts` with `displayTitle` (required), `sprintId` (optional internal), `slug` (auto-from displayTitle), `publishedAt` (required date), `summary` (optional text), and `items[]` inline array — each item has: `title`, `description`, `changeType` (radio: feature/fix/improvement/breaking/security), `affectedAreas` (tags: 9 areas), `screenshot` (image with hotspot), `videoUrl` (optional URL)
- Created `studio/schemaTypes/roadmapItem.ts` with `title`, `description`, `status` (radio: Planned/In Progress/Shipped, initialValue: Planned), `businessValue`, `changeType` (radio), `uiChange` (boolean), `entitiesImpacted` (tags), `projectedRelease` (string), `releaseRef` (reference scoped to release documents, optional)
- Deleted `studio/schemaTypes/releaseNote.ts` entirely
- Updated `studio/schemaTypes/index.ts`: removed `releaseNoteType` import and array entry; added `releaseType` and `roadmapItemType`
- Updated `studio/sanity.config.ts` (4 sites): Sprint Release initial value template; documentListWidget types; Recently Published widget; typesWithCustomActions array
- Updated `studio/src/structure.ts` (3 sites): Published section filter changed to `_type == "release"`; Sprint Releases and Roadmap Items sidebar entries; exclusion filter updated
- Human-verify checkpoint approved: Studio deployed and verified live at https://nxgen-docs.sanity.studio/

## Task Commits

Each task was committed atomically:

1. **Task 1: Create release.ts and roadmapItem.ts schemas** - `a5e8714` (feat)
2. **Task 2: Atomic migration — replace releaseNote with release+roadmapItem** - `f1fbbcc` (feat)

**Plan metadata:** (docs commit — see state update)

## Files Created/Modified

- `studio/schemaTypes/release.ts` — New: release document type with displayTitle, sprintId, slug, publishedAt, summary, items[] inline array
- `studio/schemaTypes/roadmapItem.ts` — New: roadmapItem document type with all fields; releaseRef scoped to release type
- `studio/schemaTypes/releaseNote.ts` — Deleted
- `studio/schemaTypes/index.ts` — releaseNoteType removed; releaseType + roadmapItemType added
- `studio/sanity.config.ts` — 4 sites updated: template, widget types x2, typesWithCustomActions
- `studio/src/structure.ts` — 3 sites updated: Published filter, sidebar entries (Sprint Releases + Roadmap Items), exclusion filter
- `studio/schemaTypes/folder.ts` — Auto-fix: releaseNote references replaced with release
- `studio/schemaTypes/importTool.ts` — Auto-fix: releaseNote references replaced with release
- `studio/schemaTypes/portableText-ultimate.ts` — Auto-fix: releaseNote reference replaced with release
- `studio/schemaTypes/portableText.ts` — Auto-fix: releaseNote reference replaced with release

## Decisions Made

- Atomic migration approach used: all registration sites updated in one commit to prevent TypeScript errors from partial state. Studio cannot compile when index.ts imports a deleted schema or references a non-existent type.
- `displayTitle` (customer-facing name) and `sprintId` (internal engineering identifier) are separate fields — avoids forcing editors to write technical sprint IDs in the public-facing title.
- `items[]` inline array (not separate documents) matches the bi-weekly publish workflow — editors create one document per sprint, add items inside it, and publish once.
- `releaseRef` on roadmapItem has no required validation — items in Planned or In Progress status have no release to link yet; the field only becomes meaningful when status is Shipped.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Auto-fix blocking] Additional releaseNote references found in folder.ts, importTool.ts, portableText-ultimate.ts, portableText.ts**
- **Found during:** Task 2 — post-migration grep sweep
- **Issue:** Four additional schema files contained `'releaseNote'` string references in option lists and reference field `to` arrays. These would cause Studio runtime errors or incorrect behavior despite TypeScript compiling without type errors.
- **Fix:** Replaced all `'releaseNote'` occurrences with `'release'` in all four files
- **Files modified:** `studio/schemaTypes/folder.ts`, `studio/schemaTypes/importTool.ts`, `studio/schemaTypes/portableText-ultimate.ts`, `studio/schemaTypes/portableText.ts`
- **Commit:** f1fbbcc (included in same atomic migration commit)

## Human Checkpoint

**checkpoint:human-verify** — Approved 2026-03-13

Verified at https://nxgen-docs.sanity.studio/:
- Sidebar shows "Sprint Releases" and "Roadmap Items" — "Release Notes" is gone
- All fields render correctly for Sprint Release and Roadmap Item document types
- Changes deployed and confirmed working

## Self-Check: PASSED

- `a5e8714` in git log: FOUND
- `f1fbbcc` in git log: FOUND
- `studio/schemaTypes/release.ts` created: FOUND (confirmed in commit a5e8714)
- `studio/schemaTypes/roadmapItem.ts` created: FOUND (confirmed in commit a5e8714)
- `studio/schemaTypes/releaseNote.ts` deleted: CONFIRMED (removed in commit f1fbbcc)
- Human checkpoint approved: CONFIRMED

---
*Phase: 06-schema-and-data-pipeline*
*Completed: 2026-03-13*
