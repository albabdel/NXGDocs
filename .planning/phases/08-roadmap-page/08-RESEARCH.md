# Phase 8: Roadmap Page & Hero Banner — Research

**Researched:** 2026-03-13
**Domain:** Docusaurus React pages, Sanity JSON consumption, client-side filtering/search, hero banner dynamic content
**Confidence:** HIGH (architecture patterns from Phase 6/7 research; legacy page inspection; JSON structure verified)
**Dependency:** Phase 6 must produce `sanity-roadmap.generated.json` and `sanity-releases.generated.json`

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ROAD-01 | View all roadmap items at /roadmap (Sanity-driven) | Direct JSON import from `sanity-roadmap.generated.json` |
| ROAD-02 | Filter by status (Planned / In Progress / Shipped) | Client-side React state with `useState`; filter function on `status` field |
| ROAD-03 | Search by keyword (title and description) | Client-side search with `useMemo`; lowercase match on `title` and `description` |
| ROAD-04 | Expand item to see business value, change type, UI change flag, entities impacted, projected release | Expandable card component with AnimatePresence from framer-motion; all fields in JSON |
| ROAD-05 | Shipped items show "Released in [Sprint X]" link | `releaseSlug` field in JSON; Link to `/releases/${releaseSlug}` |
| ROAD-06 | Results count and empty state | Conditional render based on `filteredItems.length` |
| ROAD-07 | Footer shows "Last updated: [date]" from Sanity | `_updatedAt` not in current GROQ; add to Phase 6 fetch query or use max of `_id` timestamps |
| HERO-01 | Hero banner shows latest release title and date | Import `sanity-releases.generated.json`; use `releases[0]` (already sorted desc by date) |

</phase_requirements>

---

## Summary

Phase 8 consumes the `sanity-roadmap.generated.json` produced by Phase 6 and builds:
1. `/roadmap` — Sanity-driven roadmap page with status filtering, keyword search, and expandable items
2. Hero banner update — Dynamic latest release display in `NXGENSphereHero` component

The current implementation uses `SanityLandingPageRoute` with a fallback to a complex legacy page (`legacy-pages/roadmap.tsx`) that uses Zoho-style statuses vocabulary (Planning, In Development, Launched, Beta). Phase 8 replaces this with the new Sanity-driven data that uses customer-facing statuses: Planned, In Progress, Shipped.

**Key insight:** The legacy roadmap page has extensive filtering UI (year, quarter, status, category) that is NOT required for v1.1. The requirements specify only status filtering and keyword search. Simplify the UI accordingly.

---

## Standard Stack

### Core (all already installed — zero new dependencies)

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| `react` | ^18.x | Component framework, useState, useMemo | Already installed |
| `framer-motion` | ^11.x | Expand/collapse animations | Already installed |
| `lucide-react` | ^0.x | Icons | Already installed |
| `@docusaurus/theme-common` | ^3.x | Layout, Link components | Docusaurus built-in |

### Explicitly Not Needed

- No new npm packages for Phase 8
- `@sanity/client` — NOT needed (JSON already built by Phase 6)
- `Fuse.js` — NOT needed (simple keyword search suffices; no fuzzy matching required)
- No Cloudflare Functions — static build-time JSON

---

## Architecture Patterns

### Pattern 1: Direct JSON Import (Same as Phase 7)

The current `roadmap.tsx` uses `SanityLandingPageRoute` with fallback. Replace with direct import:

**Before (current):**
```tsx
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/roadmap';
export default function RoadmapRoute() {
  return <SanityLandingPageRoute slug="roadmap" fallback={LegacyPage} />;
}
```

**After (Phase 8):**
```tsx
import roadmapData from '../data/sanity-roadmap.generated.json';
export default function RoadmapPage() {
  return <RoadmapList items={roadmapData} />;
}
```

### Pattern 2: Client-Side Status Filtering

Status values in new data: `Planned`, `In Progress`, `Shipped`. Filter with React state:

```tsx
const [statusFilter, setStatusFilter] = useState<string>('All');

const filteredItems = useMemo(() => {
  return roadmapData.filter(item => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
}, [statusFilter, searchQuery]);
```

### Pattern 3: Status Badge Mapping

| Value | Badge Style | Icon |
|-------|-------------|------|
| `Shipped` | Green bg | CheckCircle2 |
| `In Progress` | Blue bg | Clock |
| `Planned` | Yellow bg | Layers |

Reuse the `getStatusConfig` pattern from legacy page but adapt to new status values.

### Pattern 4: Expandable Item Card

Use framer-motion AnimatePresence for expand/collapse:

```tsx
const [expandedId, setExpandedId] = useState<string | null>(null);

<motion.div>
  <button onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}>
    {/* Header with title, status, projected release */}
  </button>
  <AnimatePresence>
    {expandedId === item._id && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        {/* Expanded content: businessValue, changeType, uiChange, entitiesImpacted */}
        {/* Shipped items show release link */}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

### Pattern 5: Shipped Item Release Link

The `releaseSlug` field contains the sprint slug (e.g., `sprint-2026-03-a`). Render link:

```tsx
{item.status === 'Shipped' && item.releaseSlug && (
  <Link to={`/releases/${item.releaseSlug}`} className="text-[#E8B058] hover:underline">
    Released in {item.releaseSlug.replace('sprint-', 'Sprint ').replace(/-/g, '.')} →
  </Link>
)}
```

### Pattern 6: Hero Banner Dynamic Update

The `NXGENSphereHero` component currently has hardcoded text: "Sprint 2025.12-B is live". Replace with dynamic content from releases JSON.

**Current (hardcoded at line 418):**
```tsx
<span className="relative">Sprint 2025.12-B is live</span>
```

**After (Phase 8):**
```tsx
// Import at top of file
import releasesData from '../data/sanity-releases.generated.json';

// In component
const latestRelease = releasesData[0];
const releaseText = latestRelease 
  ? `${latestRelease.displayTitle} is live` 
  : 'Latest release';

<span className="relative">{releaseText}</span>
```

**Note:** The releases JSON is already sorted by `publishedAt desc` from the GROQ query in Phase 6.

---

## JSON Structure (from Phase 6)

### `sanity-roadmap.generated.json`

```json
[
  {
    "_id": "roadmap-1",
    "title": "Bulk device configuration",
    "description": "Allow operators to configure multiple devices...",
    "status": "Shipped",
    "businessValue": "Reduces device setup time by 80%...",
    "changeType": "feature",
    "uiChange": true,
    "entitiesImpacted": ["Devices", "Admin"],
    "projectedRelease": "Q1 2026",
    "releaseSlug": "sprint-2026-02-b"
  }
]
```

### `sanity-releases.generated.json`

```json
[
  {
    "_id": "release-2026-03-a",
    "displayTitle": "March 2026 Release A",
    "sprintId": "Sprint 2026.03-A",
    "slug": { "current": "sprint-2026-03-a" },
    "publishedAt": "2026-03-07",
    "summary": "Alarm management improvements..."
  }
]
```

---

## File Changes

| File | Action | Notes |
|------|--------|-------|
| `src/pages/roadmap.tsx` | REPLACE | Remove SanityLandingPageRoute; import JSON directly |
| `src/components/NXGENSphereHero.tsx` | MODIFY | Import releases JSON; use dynamic latest release text |
| `src/legacy-pages/roadmap.tsx` | DELETE | Phase 9 cleanup (keep for rollback safety) |
| `src/data/roadmap.ts` | DELETE | Phase 9 cleanup (legacy data file) |

---

## Common Pitfalls

### Pitfall 1: Status Vocabulary Mismatch

**What goes wrong:** Code filters for `In Development` but new data has `In Progress`. No items appear when filtering.

**Why it happens:** Legacy roadmap uses Zoho vocabulary (Planning, In Development, Launched, Beta). New Sanity schema uses customer-facing vocabulary (Planned, In Progress, Shipped).

**How to avoid:** Use exact values from schema: `Planned`, `In Progress`, `Shipped`. These are the values in the GROQ query and JSON output.

### Pitfall 2: Missing `releaseSlug` for Shipped Items

**What goes wrong:** Shipped items show "Released in →" but link is broken or missing.

**Why it happens:** `releaseRef` is optional on roadmapItem. If editor forgets to set it, `releaseSlug` is null in JSON.

**How to avoid:** Guard the link render: `{item.status === 'Shipped' && item.releaseSlug && (...)}`. Show nothing if releaseSlug is null.

### Pitfall 3: Empty State Without "Clear Filters"

**What goes wrong:** User filters to "Shipped" and searches "xyz" with no matches. Page shows blank with no way to reset.

**Why it happens:** Empty state renders but has no action.

**How to avoid:** Include "Clear filters" button in empty state that resets both status and search.

### Pitfall 4: Hero Shows "undefined is live"

**What goes wrong:** Hero banner shows "undefined is live" when releases JSON is empty.

**Why it happens:** Phase 6 not complete; JSON is `[]`. Accessing `releasesData[0]` returns undefined.

**How to avoid:** Guard with null check: `const latestRelease = releasesData[0]; const releaseText = latestRelease ? ... : 'View releases'`.

### Pitfall 5: `last updated` Date Not in JSON

**What goes wrong:** ROAD-07 requires "Last updated: [date]" footer but `_updatedAt` is not in GROQ query.

**Why it happens:** Phase 6 GROQ query for roadmap items does not include `_updatedAt`.

**How to avoid:** Either: (a) Add `_updatedAt` to GROQ query in Phase 6 fetch script, OR (b) Use the most recent `_id` timestamp as proxy. Option (a) is cleaner but requires Phase 6 change. Option (b) works with current JSON.

**Recommendation:** Add `_updatedAt` to roadmapItem GROQ query. This is a minor Phase 6 gap that should be fixed before Phase 8 execution.

---

## Validation Strategy

### Test Commands

| Requirement | Test Type | Command/Action |
|-------------|-----------|----------------|
| ROAD-01 | smoke | Visit `/roadmap`, verify items appear |
| ROAD-02 | smoke | Click status filter buttons, verify filtering works |
| ROAD-03 | smoke | Type in search box, verify filtering works |
| ROAD-04 | visual | Click item to expand, verify all fields appear |
| ROAD-05 | smoke | Click Shipped item's release link, verify navigation |
| ROAD-06 | visual | Filter to show no results, verify empty state with "Clear" |
| ROAD-07 | visual | Check footer for "Last updated" date |
| HERO-01 | smoke | Visit home page, verify hero shows latest release |

### Sampling Rate

- **Per task commit:** Visual check in `npm run start`
- **Per wave merge:** Full smoke test of roadmap page and hero
- **Phase gate:** All 8 requirements verified with mock data

---

## Gap from Phase 6 — RESOLVED

### `_updatedAt` Added to Roadmap Query

**Status:** ✅ RESOLVED (2026-03-13)

The GROQ query for roadmap items now includes `_updatedAt`:

```javascript
// Fixed in fetch-sanity-content.js:
function getRoadmapQuery(includeDrafts) {
  const filter = includeDrafts ? 'true' : '!(_id in path("drafts.**"))';
  return `*[_type == "roadmapItem" && ${filter}] | order(_createdAt desc) {
    _id,
    _updatedAt,  // ✅ ADDED
    title,
    description,
    status,
    businessValue,
    changeType,
    uiChange,
    entitiesImpacted,
    projectedRelease,
    "releaseSlug": releaseRef->slug.current
  }`;
}
```

**Verification:** The `sanity-roadmap.generated.json` now includes `_updatedAt` timestamps for all roadmap items. The most recent `_updatedAt` value can be used for ROAD-07 (last updated footer).

---

## Sources

- `.planning/research/ARCHITECTURE.md` — comprehensive architecture for data flow
- `.planning/phases/06-schema-and-data-pipeline/06-RESEARCH.md` — Phase 6 JSON structure
- `.planning/phases/07-releases-page/07-RESEARCH.md` — Phase 7 patterns (direct import, dynamic route)
- `classic/src/legacy-pages/roadmap.tsx` — current UI patterns to adapt
- `classic/src/pages/index.tsx` — home page with hero
- `classic/src/components/NXGENSphereHero.tsx` — hero component
- `classic/src/data/sanity-roadmap.generated.json` — verified JSON structure
- `classic/src/data/sanity-releases.generated.json` — verified releases structure

---

*Research date: 2026-03-13*
*Confidence: HIGH — all patterns derived from existing codebase and verified JSON output*
