# Phase 9 Research: Cleanup & URL Continuity

## Research Date: 2026-03-13

---

## 1. Internal-Releases Related Files

### Files That Exist

**sanity-landing-pages.generated.json** contains 3 internal-releases landing page entries:
- `slug: "internal-releases"` - The main internal releases index page
- `slug: "internal-releases/sprint-2025-12-b"` - Internal sprint 2025.12-B page
- `slug: "internal-releases/sprint-2026-01-a"` - Internal sprint 2026.01-A page

**seed-landing-pages-to-sanity.js**:
- Line 49: `if (route.startsWith('/internal-releases')) return 'internal-releases';`
- Line 59: `if (layoutType === 'internal-releases') return { icon: 'Shield', text: 'Internal Releases' };`

**LandingPageRenderer.tsx**:
- Line 138: `if (!normalizedSlug) return releaseType === 'internal' ? '/internal-releases' : '/releases';`
- Line 140: `const base = releaseType === 'internal' ? '/internal-releases' : '/releases';`
- Lines 131-142: Functions for internal release path handling

### Files That DO NOT Exist (referenced in plans but not found)

- `classic/src/pages/internal-releases.tsx` - Does not exist
- `classic/src/pages/internal-releases/` directory - Does not exist
- `classic/src/legacy-pages/internal-releases.tsx` - Does not exist
- `classic/src/legacy-pages/internal-releases/` directory - Does not exist

### Schema Analysis (landingPage.ts)

The `layoutType` field options:
- `standard` - Standard Landing Page
- `quick-start` - Quick Start Page
- `releases` - Release Notes Page
- `tower-guide` - Tower Guide Page
- `role` - Role Page

**Note**: `internal-releases` is NOT a layoutType option in the schema.

However, `landingSectionReleases` has a `releaseType` option:
- `customer` - Customer Releases
- `internal` - Internal Releases

This is for the releases section component, not the internal-releases page.

---

## 2. Legacy Sprint Pages

### Existing Sprint Routes

**Public releases routes:**
| File Path | Route URL | Status |
|-----------|-----------|--------|
| `classic/src/pages/releases.tsx` | `/releases` | Sanity-driven (uses sanity-releases.generated.json) |
| `classic/src/pages/releases/sprint-2025-12-b.tsx` | `/releases/sprint-2025-12-b` | SanityLandingPageRoute with legacy fallback |

**Legacy fallback pages:**
| File Path | Used By |
|-----------|---------|
| `classic/src/legacy-pages/releases.tsx` | Fallback when Sanity has no data |
| `classic/src/legacy-pages/releases/sprint-2025-12-b.tsx` | Fallback for sprint-2025-12-b route |

### sanity-releases.generated.json Contents

Current Sanity-driven releases (3 entries):
| _id | displayTitle | slug.current |
|-----|--------------|--------------|
| release-2026-03-a | March 2026 Release A | sprint-2026-03-a |
| release-2026-02-b | February 2026 Release B | sprint-2026-02-b |
| release-2026-02-a | February 2026 Release A | sprint-2026-02-a |

**Legacy entries NOT in Sanity data:**
- sprint-2025-12-a
- sprint-2025-12-b (has a static route with legacy fallback)

### Legacy releases.tsx Hardcoded Entries

The file `classic/src/legacy-pages/releases.tsx` contains hardcoded:
- Sprint 2025.12-B (with link to `/releases/sprint-2025-12-b`)
- Sprint 2025.12-A (with link to `/releases` - no detail page exists)

---

## 3. Route Resolution Analysis

### SanityLandingPageRoute Flow

1. Page wrapper imports SanityLandingPageRoute with a `slug` and `fallback` component
2. SanityLandingPageRoute checks `sanity-landing-pages.generated.json` for matching slug
3. If found: renders LandingPageRenderer with pageData
4. If not found: renders the fallback component

### /releases/sprint-2025-12-b Route

```
File: classic/src/pages/releases/sprint-2025-12-b.tsx
Import: SanityLandingPageRoute slug="releases/sprint-2025-12-b" fallback={LegacyPage}
```

1. Checks sanity-landing-pages.generated.json for slug "releases/sprint-2025-12-b"
2. If Sanity has data → renders from Sanity
3. If not → renders `classic/src/legacy-pages/releases/sprint-2025-12-b.tsx`

**Current state**: The slug "releases/sprint-2025-12-b" is NOT in sanity-landing-pages.generated.json (the internal version "internal-releases/sprint-2025-12-b" exists but that's different). So this route uses the legacy fallback.

---

## 4. Summary of Findings

### Plan 01 (Delete internal-releases) - Revised Tasks

The original plan references files that don't exist. Actual work needed:

1. **Remove internal-releases entries from sanity-landing-pages.generated.json**
   - Remove 3 entries with slugs: "internal-releases", "internal-releases/sprint-2025-12-b", "internal-releases/sprint-2026-01-a"

2. **Update seed-landing-pages-to-sanity.js**
   - Remove internal-releases routing logic (lines 49, 59)

3. **Update LandingPageRenderer.tsx** (optional cleanup)
   - Remove internal release path functions if not used elsewhere
   - Keep `releaseType: 'internal'` option in ReleasesSection as it's for display, not routing

### Plan 02 (Verify URL Continuity)

No issues expected:
- `/releases/sprint-2025-12-b` works via SanityLandingPageRoute with legacy fallback
- Sanity-driven releases (sprint-2026-*) work via dynamic routes

### Plan 03 (Archive Legacy Sprint Entries)

- Sprint 2025.12-A and 2025.12-B are NOT in sanity-releases.generated.json
- They only appear in the legacy fallback page
- The releases index page (releases.tsx) uses Sanity data only
- Sprint 2025.12-B has a working route via legacy fallback
- Sprint 2025.12-A has no detail route (only mentioned in legacy list)

**Action**: Clean up legacy releases.tsx to remove Sprint 2025.12-A entry (no route exists).
