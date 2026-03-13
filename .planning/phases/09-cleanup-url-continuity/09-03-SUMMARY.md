---
phase: 09
plan: 03
subsystem: cleanup
tags: [archive, legacy-entries, sprint-2025]
requires: [09-02]
provides: [clean-releases-index]
affects: [legacy-releases]
tech_stack:
  added: []
  patterns: [data-cleanup]
key_files:
  created: []
  modified:
    - classic/src/legacy-pages/releases.tsx
decisions:
  - Archive Sprint 2025.12-A (no route exists)
  - Keep Sprint 2025.12-B for backward compatibility
metrics:
  duration: 5min
  tasks_completed: 3
  files_modified: 1
---

# Phase 9 Plan 03: Archive Legacy Sprint Entries Summary

## One-Liner

Archived Sprint 2025.12-A from legacy releases page; confirmed public releases index shows only Sanity-driven 2026 releases.

## What Was Done

### Tasks Completed

| Task | Status | Description |
|------|--------|-------------|
| 1 | ✅ | Verified Sprint 2025.12 entries not in Sanity data |
| 2 | ✅ | Cleaned legacy releases.tsx fallback |
| 3 | ✅ | Verified public releases index excludes archived sprints |

### Verification Results

1. **sanity-releases.generated.json**: Contains only 2026 releases:
   - sprint-2026-03-a
   - sprint-2026-02-b
   - sprint-2026-02-a

2. **legacy-pages/releases.tsx**: Updated to:
   - Keep Sprint 2025.12-B (has valid route `/releases/sprint-2025-12-b`)
   - Remove Sprint 2025.12-A (no route exists, link would go to index)

3. **releases.tsx (main page)**: Uses Sanity data only, showing 2026 releases

### Current State

| Page | Data Source | Sprint 2025.12-A | Sprint 2025.12-B |
|------|-------------|------------------|------------------|
| `/releases` (main) | sanity-releases.generated.json | Not shown | Not shown |
| Legacy fallback | hardcoded | Removed | Kept |
| Direct route | - | N/A | `/releases/sprint-2025-12-b` works |

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- Sprint 2025.12-A and 2025.12-B do NOT appear on public `/releases` index
- Sprint 2025.12-B still accessible via direct URL `/releases/sprint-2025-12-b`
- Legacy fallback cleaned up to only show entries with valid routes

## Outcome

Legacy sprint entries properly archived. Public releases index shows only current (2026) releases from Sanity. Direct link to sprint-2025-12-b still works for backward compatibility.
