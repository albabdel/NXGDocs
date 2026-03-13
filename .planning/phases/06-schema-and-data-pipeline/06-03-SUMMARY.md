---
phase: 06-schema-and-data-pipeline
plan: "03"
subsystem: content
tags: [sanity, content, mock-data, releases, roadmap]

# Dependency graph
requires:
  - phase: 06-schema-and-data-pipeline/06-01
    provides: release and roadmapItem Sanity schemas
  - phase: 06-schema-and-data-pipeline/06-02
    provides: Fetch pipeline writing JSON files
provides:
  - 3 sprint release documents with items arrays
  - 7 roadmap items covering all statuses (Planned/In Progress/Shipped)
  - 2 Shipped items with releaseRef linked to sprint releases
  - Non-empty sanity-releases.generated.json and sanity-roadmap.generated.json
affects:
  - 07-releases-page
  - 08-roadmap-page

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sanity API createOrReplace for programmatic content creation"
    - "GROQ reference dereference validation: releaseRef->slug.current"

key-files:
  created:
    - scripts/populate-sanity-content.js
  modified:
    - classic/src/data/sanity-releases.generated.json
    - classic/src/data/sanity-roadmap.generated.json

key-decisions:
  - "Content created via Sanity API instead of Studio UI to allow automation"
  - "Fixed roadmapItem GROQ filter: !(_id in path('drafts.**')) instead of statusFilterClause"

patterns-established:
  - "Roadmap items use different status semantics (Planned/In Progress/Shipped) vs other documents (published/draft)"

requirements-completed:
  - MOCK-01
  - MOCK-02

# Metrics
duration: 10min
completed: 2026-03-13
---

# Phase 6 Plan 03: Sample Content Entry Summary

**Created 3 sprint releases and 7 roadmap items via Sanity API, verified GROQ references resolve correctly, and confirmed fetch pipeline produces non-empty JSON files**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-13T18:13:00Z
- **Completed:** 2026-03-13T18:23:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created `scripts/populate-sanity-content.js` to programmatically create sample content via Sanity API
- Created 3 sprint releases with items arrays:
  - March 2026 Release A (3 items: alarm grouping, bulk acknowledge, report filter)
  - February 2026 Release B (3 items: bulk device config, installer guide, SSO fix)
  - February 2026 Release A (2 items: webhook retry, knowledge base search)
- Created 7 roadmap items with all fields populated:
  - 2 Shipped (linked to releases via releaseRef)
  - 2 In Progress
  - 3 Planned
- Fixed GROQ filter for roadmapItem query (status field has different semantics)
- Verified GROQ Vision query returns string releaseSlug values (not _ref objects)
- Confirmed all smoke tests pass

## Content Created

### Sprint Releases (3)
| Title | Sprint ID | Items | Published |
|-------|-----------|-------|-----------|
| March 2026 Release A | Sprint 2026.03-A | 3 | 2026-03-07 |
| February 2026 Release B | Sprint 2026.02-B | 3 | 2026-02-21 |
| February 2026 Release A | Sprint 2026.02-A | 2 | 2026-02-07 |

### Roadmap Items (7)
| Title | Status | releaseSlug |
|-------|--------|-------------|
| Bulk device configuration | Shipped | sprint-2026-02-b |
| New alarm grouping view | Shipped | sprint-2026-03-a |
| Advanced reporting filters | In Progress | null |
| API rate limit visibility | In Progress | null |
| Multi-language support (Phase 1) | Planned | null |
| Automated compliance report generation | Planned | null |
| Operator shift handover notes | Planned | null |

## Bug Fix Applied

The roadmapItem GROQ query was using `statusFilterClause()` which expects `status == "published"`. However, roadmapItem uses `status` for "Planned/In Progress/Shipped" semantics. Fixed by using `!(_id in path("drafts.**"))` filter instead.

## Smoke Test Results

```
PASS: releases>=2 (got 3)
PASS: roadmap>=5 (got 7)
PASS: has releaseSlug string (2 items with string values)
```

## Files Created/Modified
- `scripts/populate-sanity-content.js` - Script to create sample content via Sanity API
- `classic/scripts/fetch-sanity-content.js` - Fixed roadmapItem filter
- `classic/src/data/sanity-releases.generated.json` - Populated with 3 releases
- `classic/src/data/sanity-roadmap.generated.json` - Populated with 7 items

## Next Phase Readiness
- Phase 7 (Releases Page): sanity-releases.generated.json contains 3 releases with items
- Phase 8 (Roadmap Page): sanity-roadmap.generated.json contains 7 items with all fields
- Both Shipped items have valid releaseSlug strings for linking to release detail pages

---
*Phase: 06-schema-and-data-pipeline*
*Completed: 2026-03-13*
