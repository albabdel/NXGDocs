---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Releases & Roadmap
status: in_progress
stopped_at: "Phase 8 complete — ready for Phase 9"
last_updated: "2026-03-13T20:00:00Z"
last_activity: "2026-03-13 — Phase 8 complete: roadmap page and hero banner implemented"
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 11
  completed_plans: 5
  percent: 45
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-13)

**Core value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.
**Current focus:** Phase 9 (Cleanup) — Phase 7 & 8 complete

## Current Position

Phase: 8 COMPLETE — Phase 9 (Cleanup) ready
Status: Phase 7 & 8 both complete
Last activity: 2026-03-13 — Phase 8 complete, roadmap page and hero banner working

Progress: [████░░░░░░] 45% (5 of 11 plans complete)

**Note:** Phase 6, 7, and 8 are complete. Phase 9 (Cleanup) is next.

## Phase 8 Complete

### Implementation Summary

| Plan | Description | Status |
|------|-------------|--------|
| 08-01 | Roadmap page with filtering and search | ✅ Complete |
| 08-02 | Hero banner dynamic release display | ✅ Complete |

### Key Changes

- `roadmap.tsx` — Direct JSON import, status filtering, keyword search, accordion cards
- `NXGENSphereHero.tsx` — Dynamic release display from Sanity
- `index.tsx` — Home page releases section uses Sanity data

### Gap Fixed (Pre-Execution)

- ✅ Added `_updatedAt` to roadmap GROQ query in `fetch-sanity-content.js`
- ✅ Re-ran fetch script; `sanity-roadmap.generated.json` now includes `_updatedAt`
- ✅ ROAD-07 (last updated footer) implemented

## Previous Milestone Summary (v1.0 — SHIPPED 2026-03-08)

All 5 phases complete:
- Phase 1 (Cleanup): Dead CMS code removed, CSS consolidated, build stabilized
- Phase 2 (CMS Setup): Sanity Studio deployed, all 4 schemas locked
- Phase 3 (Integration Pipeline): Docusaurus-Sanity plugin built, publish webhook wired
- Phase 4 (Content Migration): All MDX content migrated to Sanity
- Phase 5 (Polish): Search (docusaurus-search-local), hero redesign, light mode contrast, visual consistency

## Accumulated Context

### Decisions

Recent decisions affecting current work:

- [v1.1 roadmap]: Zero new npm packages needed — all libraries already installed
- [v1.1 roadmap]: Build-time JSON is the SSG-safe data contract — no runtime API calls
- [v1.1 roadmap]: Phases 7 and 8 can run in parallel after Phase 6 is verified
- [v1.1 roadmap]: Replace releaseNote schema with release (one doc, items array)
- [v1.1 roadmap]: roadmap.tsx and releases.tsx must be replaced entirely, not extended
- [v1.1 roadmap]: MOCK-01 and MOCK-02 assigned to Phase 6
- [06-01]: Atomic migration used — all 7 releaseNote registration sites updated in single commit
- [06-01]: release schema uses displayTitle (customer-facing) + sprintId (optional internal)
- [06-01]: items[] inline array chosen over separate documents
- [06-01]: releaseRef on roadmapItem is optional (no required validation)
- [06-02]: fetchReleases()/fetchRoadmapItems() defined as inner async functions
- [06-02]: releaseNote query block removed; release-notes file kept as [] in git
- [06-02]: Fallback JSON files must be committed as [] before static import
- [06-03]: Content created via Sanity API instead of Studio UI
- [06-03]: roadmapItem GROQ filter uses `!(_id in path("drafts.**"))`
- [06-gap-fix]: `_updatedAt` added to roadmap GROQ query for ROAD-07
- [08-01]: Direct JSON import replaces SanityLandingPageRoute wrapper
- [08-01]: Status filter buttons (All, Planned, In Progress, Shipped)
- [08-01]: Accordion behavior — one item expanded at a time
- [08-01]: Shipped items link to /releases/[slug]
- [08-02]: Hero chip shows dynamic release displayTitle
- [08-02]: Hero chip links to release detail page, not index
- [08-02]: Home page releases section uses Sanity data

### Pending Todos

None.

### Blockers/Concerns

None — Phase 8 complete.

## Session Continuity

Last session: 2026-03-13
Stopped at: Phase 8 complete — Phase 9 ready
Resume file: None

**Next steps:**
1. Execute Phase 9 (Cleanup & URL Continuity)
2. Verify all links between pages work correctly
3. Remove any legacy code no longer needed
4. Final testing and polish
