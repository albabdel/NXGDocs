---
phase: 08-roadmap-page
plan: planning
subsystem: frontend
tags: [roadmap, filtering, search, hero, docusaurus, react]

# Dependency graph
requires:
  - phase: 06-schema-and-data-pipeline
    provides: sanity-roadmap.generated.json with _updatedAt
  - phase: 07-releases-page
    provides: /releases/[slug] routes for roadmap item links
provides:
  - /roadmap page with status filtering and keyword search
  - Expandable roadmap item cards with release links
  - Hero banner dynamic latest release display
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Direct JSON import (no SanityLandingPageRoute)"
    - "Client-side filtering with useState/useMemo"
    - "Accordion expand/collapse with framer-motion AnimatePresence"
    - "Dynamic hero content from releases JSON"

key-files:
  created:
    - .planning/phases/08-roadmap-page/08-RESEARCH.md
    - .planning/phases/08-roadmap-page/08-01-PLAN.md
    - .planning/phases/08-roadmap-page/08-02-PLAN.md
    - .planning/phases/08-roadmap-page/08-VALIDATION.md
  modified:
    - classic/scripts/fetch-sanity-content.js (added _updatedAt to roadmap query)
    - classic/src/data/sanity-roadmap.generated.json (now includes _updatedAt)

key-decisions:
  - "Status vocabulary: Planned, In Progress, Shipped (matches Sanity schema, not legacy Zoho vocabulary)"
  - "Accordion behavior: one item expanded at a time"
  - "Hero chip links to release detail page, not /releases index"
  - "Client-side filtering only (no server-side)"
  - "Simplified UI: no year/quarter/category filters (not in v1.1 requirements)"

patterns-established:
  - "Roadmap page follows same direct JSON import pattern as releases page"
  - "Shipped items link to /releases/[slug] for cross-navigation"

requirements-covered:
  - ROAD-01: View all roadmap items at /roadmap
  - ROAD-02: Filter by status (Planned / In Progress / Shipped)
  - ROAD-03: Search by keyword (title and description)
  - ROAD-04: Expand item to see all fields
  - ROAD-05: Shipped items show release link
  - ROAD-06: Results count and empty state with "Clear filters"
  - ROAD-07: Footer shows "Last updated: [date]"
  - HERO-01: Hero banner shows latest release dynamically

# Metrics
duration: 20min
completed: 2026-03-13
---

# Phase 8: Roadmap Page & Hero Banner — Planning Summary

**Planning complete for Phase 8. Ready for execution after Phase 7.**

## Planning Artifacts

| Artifact | Purpose | Status |
|----------|---------|--------|
| 08-RESEARCH.md | Architecture patterns, JSON structure, pitfalls | ✅ Complete |
| 08-01-PLAN.md | Roadmap page with filtering, search, expandable items | ✅ Complete |
| 08-02-PLAN.md | Hero banner dynamic release display | ✅ Complete |
| 08-VALIDATION.md | Test commands and verification checklist | ✅ Complete |

## Gap Fixed

**Issue:** Phase 6 GROQ query for roadmap items was missing `_updatedAt` field.

**Fix:** Added `_updatedAt` to `getRoadmapQuery()` in `fetch-sanity-content.js`.

**Verification:** Re-ran fetch script; `sanity-roadmap.generated.json` now includes `_updatedAt` timestamps.

## Plans Overview

### Plan 8.1: Roadmap Page with Filtering and Search

**Deliverables:**
- Replace `SanityLandingPageRoute` with direct JSON import
- Status filter buttons: All, Planned, In Progress, Shipped
- Keyword search filtering title and description
- Expandable accordion cards showing all fields
- Shipped items link to release detail pages
- "Last updated" footer from `_updatedAt`

### Plan 8.2: Hero Banner Dynamic Release Display

**Deliverables:**
- Import `sanity-releases.generated.json` in `NXGENSphereHero`
- Replace hardcoded "Sprint 2025.12-B is live" with dynamic `displayTitle`
- Link hero chip to latest release detail page
- Optional: Update home page releases section to use Sanity data

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Phase 6 JSON output | ✅ Ready | 3 releases, 7 roadmap items with `_updatedAt` |
| Phase 7 release routes | 🔄 In Progress | `/releases/[slug]` needed for roadmap links |

## Requirements Mapping

| Requirement | Plan | Status |
|-------------|------|--------|
| ROAD-01 | 08-01 | Planned |
| ROAD-02 | 08-01 | Planned |
| ROAD-03 | 08-01 | Planned |
| ROAD-04 | 08-01 | Planned |
| ROAD-05 | 08-01 | Planned |
| ROAD-06 | 08-01 | Planned |
| ROAD-07 | 08-01 | Planned |
| HERO-01 | 08-02 | Planned |

## Execution Order

Phase 8 can execute in parallel with Phase 7 after Phase 6 is complete. However, Phase 8 Plan 8.01 (Shipped item release links) requires Phase 7 Plan 7.2 (release detail routes).

**Recommended sequence:**
1. Phase 7 Plan 7.1 (releases index)
2. Phase 8 Plan 8.1 (roadmap page) — can run in parallel
3. Phase 7 Plan 7.2 (release detail) — must complete before Phase 8.1 verification
4. Phase 8 Plan 8.2 (hero banner)

## Files to Modify

| File | Action | Plan |
|------|--------|------|
| `classic/src/pages/roadmap.tsx` | REPLACE | 08-01 |
| `classic/src/components/NXGENSphereHero.tsx` | MODIFY | 08-02 |
| `classic/src/pages/index.tsx` | MODIFY (optional) | 08-02 |

## Next Steps

1. Complete Phase 7 execution (in parallel session)
2. Execute Phase 8 Plan 8.1 after Phase 7 Plan 7.1
3. Execute Phase 8 Plan 8.2 after Phase 7 complete
4. Run validation tests
5. Create execution summary

---

*Planning completed: 2026-03-13*
*Phase status: Ready for execution*
