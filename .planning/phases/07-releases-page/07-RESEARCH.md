# Phase 7: Releases Page — Research

**Researched:** 2026-03-13
**Domain:** Docusaurus React pages, Sanity JSON consumption, dynamic routing
**Confidence:** HIGH (architecture patterns from Phase 6 research; legacy page inspection)
**Dependency:** Phase 6 must produce `sanity-releases.generated.json`

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REL-01 | Reverse-chronological list of releases at /releases | GROQ `order(publishedAt desc)` already sorts; JSON import in React page |
| REL-02 | Each card shows sprint ID, date, summary, change-type badges | All fields in JSON from Phase 6; badge components from legacy page reusable |
| REL-03 | Most recent release marked with "Latest" badge | `idx === 0` check in map; conditional badge render |
| REL-04 | Click to view full detail at /releases/[slug] | Docusaurus file-based routing: `src/pages/releases/[slug].tsx` creates dynamic route |
| REL-05 | Item displays title, body, change-type tag | JSON has `items[]` array with all fields; render loop per item |
| REL-06 | Items can display screenshots inline | `"screenshotUrl": screenshot.asset->url` in GROQ; `<img>` or `<Image>` component |
| REL-07 | Items can display video embed | `videoUrl` field; YouTube/Vimeo iframe embed pattern |
| REL-08 | Items display affected-areas tags | `affectedAreas[]` array in JSON; map to tag chips |
| REL-09 | Optional "Read the docs" link | `docLink` field (if added to schema) or infer from `affectedAreas` |
</phase_requirements>

---

## Summary

Phase 7 consumes the `sanity-releases.generated.json` produced by Phase 6 and builds two React pages:
1. `/releases` — index page listing all releases in reverse-chronological order
2. `/releases/[slug]` — detail page for individual sprint releases

The current implementation uses `SanityLandingPageRoute` with a fallback to a hardcoded legacy page. Phase 7 replaces this entirely with a direct JSON import, following the established pattern from the architecture research.

**Key insight:** Docusaurus file-based routing means creating `src/pages/releases/[slug].tsx` automatically generates `/releases/:slug` routes. The slug parameter is available as a React prop. We query the imported JSON at runtime to find the matching release.

---

## Standard Stack

### Core (all already installed — zero new dependencies)

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| `react` | ^18.x | Component framework | Already installed |
| `framer-motion` | ^11.x | Animations (used in legacy page) | Already installed |
| `lucide-react` | ^0.x | Icons | Already installed |
| `@docusaurus/theme-common` | ^3.x | Layout, Link components | Docusaurus built-in |

### Explicitly Not Needed

- No new npm packages for Phase 7
- `@sanity/client` — NOT needed (JSON already built by Phase 6)
- `@portabletext/react` — NOT needed (Phase 6 uses `type: 'text'` for descriptions)
- No Cloudflare Functions — static build-time JSON

---

## Architecture Patterns

### Pattern 1: Direct JSON Import (No SanityLandingPageRoute)

The current `releases.tsx` uses `SanityLandingPageRoute` with a fallback. This was correct for landing pages managed in Sanity's `landingPage` schema. For releases, we have dedicated JSON data and a dedicated page structure.

**Before (current):**
```tsx
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/releases';
export default function ReleasesRoute() {
  return <SanityLandingPageRoute slug="releases" fallback={LegacyPage} />;
}
```

**After (Phase 7):**
```tsx
import releasesData from '../data/sanity-releases.generated.json';
export default function ReleasesPage() {
  return <ReleasesList releases={releasesData} />;
}
```

The `SanityLandingPageRoute` pattern is for pages that *might* exist in Sanity as `landingPage` documents. Releases are *always* Sanity-driven — they have their own schema and data pipeline.

### Pattern 2: Dynamic Route with Slug Parameter

Docusaurus creates dynamic routes from `[param].tsx` files:

```
src/pages/releases/[slug].tsx → /releases/:slug
```

The slug is available as a prop:

```tsx
import { useParam } from '@docusaurus/theme-common';
// or via props for generateMetadata patterns

export default function ReleaseDetailPage() {
  const { slug } = useParam<{ slug: string }>('slug');
  const release = releasesData.find(r => r.slug?.current === slug);
  // ...
}
```

### Pattern 3: Change-Type Badge Mapping

The `changeType` field has values: `feature`, `fix`, `improvement`, `breaking`, `security`. Map to visual badges:

| Value | Badge Style | Icon |
|-------|-------------|------|
| `feature` | Green bg | Sparkles |
| `fix` | Blue bg | Wrench |
| `improvement` | Yellow bg | ArrowUp |
| `breaking` | Red bg | AlertTriangle |
| `security` | Purple bg | Shield |

Pattern from legacy page uses inline styles; create reusable `<ChangeTypeBadge>` component.

### Pattern 4: Video Embed from URL

The `videoUrl` field contains a YouTube or Vimeo URL. Extract embed URL:

```tsx
function getEmbedUrl(url: string): string | null {
  // YouTube: youtube.com/watch?v=ID → youtube.com/embed/ID
  const ytMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Vimeo: vimeo.com/ID → player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  return null;
}
```

---

## File Changes

| File | Action | Notes |
|------|--------|-------|
| `src/pages/releases.tsx` | REPLACE | Remove SanityLandingPageRoute; import JSON directly |
| `src/pages/releases/[slug].tsx` | CREATE | Dynamic detail page |
| `src/components/ChangeTypeBadge.tsx` | CREATE | Reusable badge component |
| `src/components/ReleaseCard.tsx` | CREATE | Index page card component |
| `src/components/ReleaseItem.tsx` | CREATE | Detail page item component |
| `src/legacy-pages/releases.tsx` | DELETE | Phase 9 cleanup (keep for rollback safety) |
| `src/legacy-pages/releases/sprint-2025-12-b.tsx` | DELETE | Phase 9 cleanup |

---

## Common Pitfalls

### Pitfall 1: Using SanityLandingPageRoute for Releases

**What goes wrong:** `SanityLandingPageRoute` expects a `landingPage` document with `slug="releases"`. There is no such document. The fallback always renders the hardcoded legacy page. Sanity-driven releases never appear.

**Why it happens:** The pattern was correct for generic landing pages. Releases have their own pipeline.

**How to avoid:** Direct import of `sanity-releases.generated.json`. No `SanityLandingPageRoute`.

### Pitfall 2: Missing `[slug].tsx` File

**What goes wrong:** Clicking a release card navigates to `/releases/sprint-2026-01-a` which returns 404 because the dynamic route file doesn't exist.

**Why it happens:** Developer creates index page but forgets the detail route.

**How to avoid:** Create `src/pages/releases/[slug].tsx` in the same plan as the index page.

### Pitfall 3: Empty JSON During Development

**What goes wrong:** Phase 6 hasn't produced mock data yet. The JSON is `[]`. The releases page shows empty state.

**Why it happens:** Phase 7 can be developed in parallel with Phase 6, but requires Phase 6 mock data for visual testing.

**How to avoid:** Add a fallback mock dataset for local development, or wait for Phase 6 MOCK-01 completion before testing Phase 7 UI.

### Pitfall 4: Screenshot URL Not Resolved

**What goes wrong:** `screenshotUrl` in JSON is `null` even though a screenshot exists in Sanity.

**Why it happens:** The GROQ projection `screenshot.asset->url` fails if the asset reference is stale or the image hasn't been processed.

**How to avoid:** Verify GROQ in Phase 6. In Phase 7, guard with `{item.screenshotUrl && <img src={item.screenshotUrl} />}`.

---

## Validation Strategy

### Test Commands

| Requirement | Test Type | Command/Action |
|-------------|-----------|----------------|
| REL-01 | smoke | Visit `/releases`, verify releases appear in desc date order |
| REL-02 | visual | Check each card has title, date, summary, badges |
| REL-03 | visual | First card shows "Latest" badge |
| REL-04 | smoke | Click a card, verify navigation to `/releases/[slug]` |
| REL-05 | visual | Detail page shows item title, body, type tag |
| REL-06 | visual | Items with screenshots show images inline |
| REL-07 | visual | Items with videoUrl show embed player |
| REL-08 | visual | Items show affected-areas tags |
| REL-09 | visual | Items with doc link show "Read the docs" link |

### Sampling Rate

- **Per task commit:** Visual check in `npm run start`
- **Per wave merge:** Full smoke test of both pages
- **Phase gate:** All 9 requirements verified with mock data

---

## Sources

- `.planning/research/ARCHITECTURE.md` — comprehensive architecture for data flow
- `.planning/phases/06-schema-and-data-pipeline/06-RESEARCH.md` — Phase 6 JSON structure
- `classic/src/legacy-pages/releases.tsx` — current UI patterns to adapt
- `classic/src/legacy-pages/releases/sprint-2025-12-b.tsx` — detail page patterns
- `classic/src/components/SanityLandingPageRoute.tsx` — pattern NOT to use

---

*Research date: 2026-03-13*
*Confidence: HIGH — all patterns derived from existing codebase*
