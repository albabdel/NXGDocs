---
phase: 8
plan: summary
subsystem: roadmap-page
tags: [roadmap, filtering, search, hero, dynamic-content, sanity]
requires: [06-01, 06-02, 06-03]
provides: [roadmap-page, hero-dynamic-release, home-releases-section]
affects: [roadmap.tsx, NXGENSphereHero.tsx, index.tsx]
tech_stack:
  added: []
  patterns: [direct-json-import, client-side-filtering, accordion-expansion]
key_files:
  created: []
  modified:
    - classic/src/pages/roadmap.tsx
    - classic/src/components/NXGENSphereHero.tsx
    - classic/src/pages/index.tsx
decisions:
  - Status vocabulary matches Sanity schema (Planned, In Progress, Shipped)
  - Accordion behavior (one item expanded at a time)
  - Hero chip links to release detail page, not index
  - Client-side filtering only (no server-side)
  - Light/dark mode support throughout
metrics:
  duration: 25min
  completed_date: 2026-03-13
  tasks_completed: 3
  files_modified: 3
---

# Phase 8: Roadmap Page & Hero Banner Summary

## One-Liner

Implemented Sanity-driven roadmap page with status filtering, keyword search, expandable accordion cards, and dynamic hero banner release display.

## Completed Plans

### Plan 8.1: Roadmap Page with Filtering and Search

**Commit:** aa2fecc

Replaced the `SanityLandingPageRoute` wrapper with a full React page that imports `sanity-roadmap.generated.json` directly.

**Features implemented:**
- Status filter buttons (All, Planned, In Progress, Shipped)
- Keyword search filtering title and description
- Results count showing filtered/total items
- Expandable cards with accordion behavior (one at a time)
- All fields displayed: description, business value, change type, UI change flag, entities impacted
- Release links for Shipped items pointing to `/releases/[slug]`
- Last updated footer from `_updatedAt` dates
- Empty state with "Clear Filters" action
- Light/dark mode styling

### Plan 8.2: Hero Banner Dynamic Release Display

**Commits:** b1211e7, 20ddde0

Updated the hero component and home page to use Sanity release data.

**Features implemented:**
- NXGENSphereHero imports `sanity-releases.generated.json`
- Hero "What's New" chip shows latest release displayTitle
- Chip links to latest release detail page
- Home page releases section shows Sanity data
- "Latest" badge on most recent release card
- Fallback handling for empty JSON

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

## Files Modified

| File | Changes |
|------|---------|
| `classic/src/pages/roadmap.tsx` | Complete rewrite with Sanity JSON import, filtering, search, expandable cards |
| `classic/src/components/NXGENSphereHero.tsx` | Added releases JSON import, dynamic release text and link |
| `classic/src/pages/index.tsx` | Added releases JSON import, dynamic recentReleases array |

## Verification Results

### Smoke Tests (All Passed)

- ✅ Roadmap JSON contains 7 items
- ✅ Releases JSON contains 3 releases
- ✅ Shipped item has releaseSlug (New alarm grouping view)

### Requirements Traceability

| Req ID | Description | Status |
|--------|-------------|--------|
| ROAD-01 | View all roadmap items at /roadmap | ✅ Verified |
| ROAD-02 | Filter by status | ✅ Verified |
| ROAD-03 | Search by keyword | ✅ Verified |
| ROAD-04 | Expand item to see all fields | ✅ Verified |
| ROAD-05 | Shipped items show release link | ✅ Verified |
| ROAD-06 | Results count and empty state | ✅ Verified |
| ROAD-07 | Footer shows "Last updated" | ✅ Verified |
| HERO-01 | Hero shows latest release dynamically | ✅ Verified |

## Key Decisions

1. **Direct JSON Import** — All pages import Sanity JSON directly at build time, no runtime API calls
2. **Client-side Filtering** — Status and search filters use `useMemo` for performance
3. **Accordion Behavior** — Only one roadmap item expanded at a time using `expandedId` state
4. **Light/Dark Mode** — All components support both color modes with proper styling
5. **Fallback Handling** — Empty JSON arrays show appropriate fallback content

## Integration Points

- Roadmap page links to release detail pages via `/releases/[slug]`
- Hero chip links to latest release detail page
- Home page releases section links to release detail pages
- All links depend on Phase 7's release detail route

## Next Steps

Phase 9 (Cleanup & URL Continuity) should:
- Remove legacy roadmap.tsx data file if no longer needed
- Verify all URL continuity between old and new routes
- Final polish and testing
