# Stack Research

**Domain:** Documentation platform — releases & roadmap features on existing Docusaurus + Sanity
**Researched:** 2026-03-13
**Confidence:** HIGH (all decisions derived from live codebase; no new dependencies required for core features)

---

## Context: What Already Exists

This is a brownfield addition to a validated, live system. Verified from codebase:

| Layer | Technology | Version (package.json) | Status |
|-------|------------|------------------------|--------|
| Frontend | Docusaurus | ^3.9.2 | Live |
| Language | TypeScript | ~5.6.2 | Live |
| UI | React | ^18.3.1 | Live |
| CMS | Sanity Studio | ^5.13.0 | Live at nxgen-docs.sanity.studio |
| Sanity client | `@sanity/client` | ^7.16.0 | Live — used in fetch script |
| Image URLs | `@sanity/image-url` | ^2.0.3 | Live — used in fetch script |
| Portable text | `@portabletext/markdown` | ^1.1.4 | Live — used in fetch script |
| Rich text studio | `sanity` (portableText-ultimate.ts) | ^5.13.0 | Live — image, video, code, table blocks defined |
| Video (Mux) | `sanity-plugin-mux-input` | ^2.17.0 | Live in studio — already installed |
| Animation | `framer-motion` | ^12.23.25 | Live — used in hero |
| Icons | `lucide-react` | ^0.554.0 | Live — used throughout |
| Tailwind CSS | tailwindcss | ^3.4.18 (dev) | Live — used in all page components |
| Hosting | Cloudflare Pages + webhook | — | Live — rebuild on Sanity publish |
| Search | `@easyops-cn/docusaurus-search-local` | ^0.55.1 | Live |

**Key insight:** Every library needed for the three new features is already installed. This milestone requires zero new npm packages for core functionality.

---

## Recommended Stack

### Feature 1: Redesigned Release Notes System in Sanity

**What changes:** Replace the existing flat `releaseNote` schema (one body field) with a `release` schema where each release document contains an `items` array. Each item has its own title, description, screenshot(s), and optional video.

#### Sanity Schema Layer (studio)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `sanity` defineType / defineField / defineArrayMember | ^5.13.0 (already installed) | Define the new `release` schema with items array | The codebase already uses this exact pattern in every schema file. `defineArrayMember` with `type: 'object'` is the established Sanity pattern for inline structured arrays. |
| `@sanity/image-url` | ^2.0.3 (already installed) | Resolve image URLs from Sanity asset references in items | Already used in `fetch-sanity-content.js` via `createImageUrlBuilder`. Zero change needed. |
| `sanity-plugin-mux-input` | ^2.17.0 (already installed) | Video upload and embedding in release items | Already in `studio/package.json`. The `mux.video` type is available in any schema field today. |

**Schema pattern to follow** (from `releaseNote.ts` and `portableText-ultimate.ts`):

```typescript
// New schema: studio/schemaTypes/release.ts
defineField({
  name: 'items',
  title: 'Release Items',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'releaseItem',
      fields: [
        defineField({ name: 'title', type: 'string', validation: r => r.required() }),
        defineField({ name: 'description', type: 'array', of: enhancedBlockContent }),
        defineField({ name: 'screenshots', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
        defineField({ name: 'video', type: 'mux.video' }),
      ],
    }),
  ],
})
```

This matches Sanity v5's documented `defineArrayMember` pattern (HIGH confidence — used in this codebase already in `portableText-ultimate.ts` which uses `defineArrayMember` extensively).

#### Fetch Script Layer (fetch-sanity-content.js)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js `fs` + GROQ projection | (already in use) | Fetch release items array and write to generated JSON | The fetch script already handles `releaseNote` documents and writes `sanity-release-notes.generated.json`. Extend the GROQ projection to include `items[]` and enrich image URLs through existing `enrichLandingMedia()` or `sanityImageUrl()` helpers. |

**GROQ projection change** (extend existing query in `getQueries()`):

```javascript
{
  type: 'release',
  query: `*[_type == "release" && ${filter}] | order(publishedAt desc) {
    title, slug, sprintId, publishedAt, version, status,
    "items": items[] {
      title, description, video,
      "screenshots": screenshots[].asset->url
    }
  }`,
}
```

The items array is serialized to JSON (not MDX) using the same `sanity-release-notes.generated.json` pattern — the `/releases` page will be a React page that reads this file, not a Docusaurus MDX doc.

---

### Feature 2: Public Roadmap Page with Client-Side Filter/Search

**What changes:** Add a `roadmapItem` schema to Sanity. Fetch all items at build time into a generated JSON file. Render `/roadmap` as a React page using `useState` for client-side filter and search — no additional library needed.

#### Sanity Schema Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `sanity` defineType | ^5.13.0 (already installed) | New `roadmapItem` document schema with status, business value, change type, UI change flag, UX fixes flag, entities impacted, and reference to a release | Uses the same schema patterns already in the codebase. Reference field to `release` documents for the "Shipped" link uses Sanity's native `reference` type — already used in `portableText-ultimate.ts`. |

**New schema: `roadmapItem`**

Fields to define (derived from PROJECT.md requirements):

```typescript
{ name: 'title', type: 'string' }
{ name: 'slug', type: 'slug', options: { source: 'title' } }
{ name: 'status', type: 'string', options: { list: ['Planned','In Progress','Shipped'] } }
{ name: 'businessValue', type: 'text' }
{ name: 'changeType', type: 'string', options: { list: [...] } }
{ name: 'uiChange', type: 'boolean' }
{ name: 'uxFix', type: 'boolean' }
{ name: 'entitiesImpacted', type: 'array', of: [{ type: 'string' }] }
{ name: 'linkedRelease', type: 'reference', to: [{ type: 'release' }] }
```

#### Fetch Script Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GROQ + existing fetch script | (already in use) | Fetch roadmap items at build time and write to `src/data/sanity-roadmap.generated.json` | Follows the same pattern as `sanity-release-notes.generated.json`. One new query added to `getQueries()`, one new generated file written. The fetch script's structure already handles multiple document types in a loop. |

**GROQ projection:**

```javascript
{
  type: 'roadmapItem',
  query: `*[_type == "roadmapItem" && ${filter}] | order(_createdAt asc) {
    title, slug, status, businessValue, changeType, uiChange, uxFix, entitiesImpacted,
    "linkedReleaseSlug": linkedRelease->slug.current
  }`,
}
```

#### Frontend Layer (Docusaurus React page)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React `useState` | ^18.3.1 (already installed) | Client-side status filter (Planned / In Progress / Shipped) | The roadmap page is a static React page (like `index.tsx`). `useState` is all that is needed for tab/filter switching — no library required. Pattern already used in `index.tsx` for event handling. |
| React `useMemo` | ^18.3.1 (already installed) | Derive filtered + searched item list from full dataset | `useMemo` on the full JSON array filtered by `activeStatus` and `searchQuery` avoids re-filtering on every render. No performance library needed at this data scale (tens to hundreds of items). |
| Tailwind CSS | ^3.4.18 (already installed) | Status badge colors, grid layout, filter bar styling | All existing pages use Tailwind. Roadmap page should match. |
| `lucide-react` | ^0.554.0 (already installed) | Search icon in filter bar, status icons | Already used throughout the site. |

**Filter implementation pattern** (no new library — pure React):

```tsx
const [statusFilter, setStatusFilter] = useState<string>('All');
const [query, setQuery] = useState('');

const filtered = useMemo(() =>
  roadmapItems
    .filter(item => statusFilter === 'All' || item.status === statusFilter)
    .filter(item => item.title.toLowerCase().includes(query.toLowerCase())),
  [roadmapItems, statusFilter, query]
);
```

This is the right approach because: (1) the full dataset is already in the page bundle (generated JSON imported at build time), (2) client-side filtering is instant, (3) it works with the static site constraint — no server needed.

**Do NOT use** a search library (Fuse.js, lunr, etc.) for this feature. The roadmap will have tens to low hundreds of items. Simple string matching on `title` and `businessValue` is sufficient and avoids adding a dependency.

---

### Feature 3: Dynamic Hero Banner Showing Latest Release

**What changes:** The `NXGENSphereHero.tsx` currently hardcodes "Sprint 2025.12-B is live". This text needs to be replaced with the title and date of the latest release from Sanity.

#### Data Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `sanity-release-notes.generated.json` (extended) | — | Provides latest release title + date to the hero at build time | The fetch script already writes this file. Add `title`, `publishedAt`, and `slug` to the generated JSON structure — they're already in the GROQ query. The hero reads item `[0]` (already ordered `desc` by `publishedAt`). |

**No new library or API call needed.** The hero reads from the generated JSON file that the fetch script already produces. The pattern is:

```tsx
// In NXGENSphereHero.tsx or index.tsx
import releases from '../data/sanity-release-notes.generated.json';
const latest = releases[0]; // ordered desc by publishedAt in fetch script
// renders: `${latest.title} is live`
```

This preserves the static site constraint — no runtime API call, no useEffect fetch, no loading state.

#### Hero Component Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `framer-motion` | ^12.23.25 (already installed) | Existing shimmer animation on the "What's New" chip | No change to animation. The text content changes; the component structure is identical. |
| Docusaurus `Link` | (Docusaurus core, already installed) | Link the chip to `/releases/${latest.slug.current}` | The chip already uses `<Link to="/releases">`. Update to link directly to the latest release entry. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `Fuse.js` or similar fuzzy search library | Overkill for a list of tens-to-hundreds of items. Adds a dependency and build complexity. | Native `String.includes()` filter on pre-loaded JSON array |
| `@portabletext/react` for release items | The site uses `@portabletext/markdown` for build-time MDX conversion — adding the React renderer creates two Portable Text paths. Release items should follow the existing pattern: serialize to HTML/Markdown at fetch time. | `serializeBody()` in the existing fetch script, which already handles all custom block types |
| Sanity's real-time listener (`client.listen()`) | Docusaurus is a static site. Real-time updates have no value — the webhook already handles this. | Cloudflare Pages webhook trigger on Sanity publish (already working) |
| New Docusaurus plugin for releases/roadmap | The releases and roadmap pages are React pages, not doc trees. They don't need a plugin route. | Direct React page files in `src/pages/` reading generated JSON |
| Separate `roadmap` schema document type called "feature" or "epic" | The existing `src/data/roadmap.ts` uses a complex multi-level epic/item hierarchy. The new Sanity schema should be simpler: flat list of `roadmapItem` documents. | Flat `roadmapItem` type with a single `status` field and direct reference to a release |
| `sanity-plugin-mux-input` for screenshots | Mux is for video. For screenshots (static images), use Sanity's native `image` type. | `type: 'image'` with `options: { hotspot: true }` |

---

## Integration Points with Existing Sanity Plugin

The two custom plugins in `classic/plugins/` have specific responsibilities:

| Plugin | Role | What Changes for v1.1 |
|--------|------|-----------------------|
| `docusaurus-plugin-sanity-content` | Creates `.sanity-cache/` directories at startup for `plugin-content-docs` | No change — releases and roadmap are React pages, not doc-tree content |
| `docusaurus-plugin-sanity-landing-pages` | Registers dynamic routes for `landingPage` documents | No change — releases/roadmap have dedicated static `.tsx` files in `src/pages/` |
| `classic/scripts/fetch-sanity-content.js` | Fetches all document types at build time, serializes to MDX and JSON | ADD: (1) new `release` query that fetches items array and writes extended JSON; (2) new `roadmapItem` query that writes `sanity-roadmap.generated.json`; (3) update generated release notes JSON shape to include items |

The fetch script's `getQueries()` array is the single integration point. Add two new entries. The existing `serializeBody()` and `enrichLandingMedia()` helpers already handle image URL resolution — release item screenshots follow the same pattern.

**Generated file targets:**

| File | Consumer | Change |
|------|----------|--------|
| `src/data/sanity-release-notes.generated.json` | `/releases` page, `NXGENSphereHero.tsx` | Extend shape to include `items[]` per release; keep existing top-level fields |
| `src/data/sanity-roadmap.generated.json` | `/roadmap` page | New file — created by new `roadmapItem` query in fetch script |

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|------------------------|
| Flat JSON import at build time for roadmap | Sanity `client.fetch()` in a `useEffect` (runtime) | Never — Docusaurus is static. Runtime fetch exposes API token and creates a loading state that degrades UX |
| `useState` + `useMemo` for roadmap filter | Dedicated filter library (react-select, Fuse.js) | If the roadmap grows to 500+ items with full-text multi-field search. Not the case for this product. |
| Extend existing fetch script | Add a third custom Docusaurus plugin for releases/roadmap | A plugin is appropriate when you need route generation or lifecycle integration. For JSON data files read by static pages, extending the fetch script is simpler. |
| Serialize release items at fetch time (inline HTML/Markdown) | Render Portable Text in the browser via `@portabletext/react` | Use `@portabletext/react` only if you need live preview in the browser. The static site build model means serializing at fetch time is correct. |
| Replace `releaseNote` schema with `release` schema | Keep `releaseNote` and add items as an array field to existing schema | A clean rename with a new schema is less confusing than mutating the existing one. The existing `releaseNote` documents can be migrated with a one-time GROQ patch script. |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `sanity` ^5.13.0 | `sanity-plugin-mux-input` ^2.17.0 | Already co-installed in studio — confirmed working. |
| `@sanity/client` ^7.16.0 | Sanity API version `2025-02-06` | apiVersion is set in fetch script; compatible with all current query features. |
| Docusaurus ^3.9.2 | React ^18.3.1 | Docusaurus 3.x requires React 18 — already the case. |
| `framer-motion` ^12.23.25 | React ^18.3.1 | Compatible — already working in hero component. |

---

## Installation

No new dependencies are required for the core features. All libraries are already installed.

```bash
# Verify no new packages needed — all of these are already in package.json:
# @sanity/client ^7.16.0
# @sanity/image-url ^2.0.3
# @portabletext/markdown ^1.1.4
# framer-motion ^12.23.25
# lucide-react ^0.554.0
# tailwindcss ^3.4.18 (dev)
# sanity-plugin-mux-input ^2.17.0 (studio)

# Nothing to install for v1.1 core features.
```

If the team later wants Mux video playback embedded in the releases page (not just in Studio), one package would be needed:

```bash
# Only if rendering Mux video in the browser on the /releases page:
npm install @mux/mux-player-react
```

This is NOT required for v1.1 as scoped. Video in release items would be rendered as an iframe embed using the Mux playback URL — no additional package needed.

---

## Sources

- `classic/package.json` — exact installed versions (HIGH confidence — live file)
- `studio/package.json` — exact studio plugin versions including mux (HIGH confidence — live file)
- `classic/plugins/docusaurus-plugin-sanity-content/index.js` — plugin architecture (HIGH confidence — live code)
- `classic/scripts/fetch-sanity-content.js` — GROQ queries, serialization patterns, generated file paths (HIGH confidence — live code)
- `studio/schemaTypes/releaseNote.ts` — current schema to be replaced (HIGH confidence — live code)
- `studio/schemaTypes/portableText-ultimate.ts` — `defineArrayMember` usage pattern (HIGH confidence — live code)
- `classic/src/components/NXGENSphereHero.tsx` — current hardcoded hero banner (HIGH confidence — live code)
- `classic/src/data/roadmap.ts` — existing static roadmap data shape to replace with Sanity (HIGH confidence — live code)
- `.planning/PROJECT.md` — v1.1 feature requirements (HIGH confidence — project spec)

---

*Stack research for: NXGEN GCXONE Documentation Platform — v1.1 Releases & Roadmap*
*Researched: 2026-03-13*
