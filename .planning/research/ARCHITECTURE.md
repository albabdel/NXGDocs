# Architecture Research

**Domain:** Docusaurus SSG + Sanity CMS — v1.1 Releases & Roadmap milestone
**Researched:** 2026-03-13
**Confidence:** HIGH (based on direct codebase inspection of all relevant files)

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        SANITY STUDIO (studio/)                        │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  release (NEW)      │  │  roadmapItem     │  │  doc / article  │  │
│  │  - title            │  │  (NEW schema)    │  │  (existing,     │  │
│  │  - sprintId         │  │  - title         │  │   unchanged)    │  │
│  │  - publishedAt      │  │  - status        │  │                 │  │
│  │  - items[] (array)  │  │  - businessValue │  │                 │  │
│  │    - title          │  │  - changeType    │  │                 │  │
│  │    - description    │  │  - uiChange flag │  │                 │  │
│  │    - type           │  │  - uxFixes flag  │  │                 │  │
│  │    - screenshot?    │  │  - entities[]    │  │                 │  │
│  │    - video?         │  │  - releaseRef?   │  │                 │  │
│  └─────────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                        │
│  releaseNote.ts → DELETED. Replaced entirely by release.ts above.     │
└──────────────────────┬───────────────────────────────────────────────┘
                       |
                       |  Sanity publish fires webhook
                       |
                       v
┌──────────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES BUILD PIPELINE                          │
│                                                                        │
│  webhook received -> Cloudflare Pages triggers rebuild                 │
│                                                                        │
│  Pre-build:  node classic/scripts/fetch-sanity-content.js             │
│    GROQ existing:  docs, articles, referencePages                      │
│    GROQ existing:  landingPages -> .sanity-landing-pages/ + JSON       │
│    GROQ NEW:       release      -> src/data/sanity-releases.json       │
│    GROQ NEW:       roadmapItem  -> src/data/sanity-roadmap.json        │
│    MDX output:     .sanity-cache/{audience}/*.md  (docs only)         │
│                                                                        │
│  Build:      npx docusaurus build                                      │
│    - plugin-content-docs reads .sanity-cache/ for /docs/*             │
│    - src/pages/*.tsx compiled with JSON imports baked in               │
└──────────────────────┬───────────────────────────────────────────────┘
                       |
                       v
┌──────────────────────────────────────────────────────────────────────┐
│                  STATIC SITE OUTPUT (deployed to Cloudflare CDN)       │
│                                                                        │
│  /releases     custom React page - reads sanity-releases.json         │
│  /roadmap      custom React page - reads sanity-roadmap.json          │
│  /             hero banner reads releases[0] from sanity-releases.json │
│  /docs/*       MDX docs via plugin-content-docs (unchanged pipeline)   │
│                                                                        │
│  Client-side:  search/filter on /roadmap runs entirely in browser      │
│                (no API calls; full dataset in JS bundle)               │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Status | Responsibility | Location |
|-----------|--------|---------------|----------|
| `releaseNote.ts` | DELETED | Replaced by `release.ts` | `studio/schemaTypes/` |
| `release.ts` | NEW | One doc per sprint; items as inline array | `studio/schemaTypes/` |
| `roadmapItem.ts` | NEW | Individual roadmap item; optional ref to release | `studio/schemaTypes/` |
| `studio/schemaTypes/index.ts` | MODIFIED | Swap releaseNoteType, add roadmapItemType | `studio/schemaTypes/` |
| `fetch-sanity-content.js` | MODIFIED | Add two new GROQ queries + JSON output | `classic/scripts/` |
| `sanity-releases.generated.json` | NEW | Build artifact; all release data for /releases | `classic/src/data/` |
| `sanity-roadmap.generated.json` | NEW | Build artifact; all roadmap items for /roadmap | `classic/src/data/` |
| `src/pages/releases.tsx` | REPLACED | Custom React page; reads sanity-releases JSON | `classic/src/pages/` |
| `src/pages/roadmap.tsx` | REPLACED | Custom React page; reads sanity-roadmap JSON | `classic/src/pages/` |
| `NXGENSphereHero.tsx` | MODIFIED | Banner chip reads releases[0] from JSON | `classic/src/components/` |
| `src/pages/index.tsx` | MODIFIED | "Recent Releases" section reads releases[0..1] | `classic/src/pages/` |
| `src/legacy-pages/releases.tsx` | DELETED | Replaced by CMS-backed page | `classic/src/legacy-pages/` |
| `src/data/roadmap.ts` | DELETED | Replaced by sanity-roadmap.generated.json | `classic/src/data/` |

---

## Recommended Project Structure

```
classic/
├── scripts/
│   └── fetch-sanity-content.js         # MODIFIED: new queries + JSON output
│
├── src/
│   ├── data/
│   │   ├── sanity-releases.generated.json      # NEW: written at build time
│   │   ├── sanity-roadmap.generated.json       # NEW: written at build time
│   │   ├── sanity-release-notes.generated.json # KEEP or DELETE (now superseded)
│   │   └── sanity-landing-pages.generated.json # UNCHANGED
│   │
│   ├── pages/
│   │   ├── releases.tsx         # REPLACED: reads sanity-releases JSON
│   │   ├── roadmap.tsx          # REPLACED: reads sanity-roadmap JSON
│   │   └── index.tsx            # MODIFIED: hero + recent releases from JSON
│   │
│   └── components/
│       └── NXGENSphereHero.tsx  # MODIFIED: latest release from JSON import
│
studio/
└── schemaTypes/
    ├── releaseNote.ts           # DELETED
    ├── release.ts               # NEW
    ├── roadmapItem.ts           # NEW
    └── index.ts                 # MODIFIED
```

### Structure Rationale

- **`sanity-releases.generated.json` and `sanity-roadmap.generated.json`:** Follow the established pattern of `sanity-landing-pages.generated.json`. Written at build time by the fetch script; imported as static JSON by React pages. Zero runtime API calls. Zero SSG compatibility issues.
- **Releases as a custom React page (not MDX docs):** The new schema has `items[]` — an array with per-item screenshots and video. MDX docs render one `body` field per document. There is no reasonable way to render a structured items array through the Portable Text to MDX pipeline. A custom page with a direct JSON import is the correct approach. This is already the pattern used by `roadmap.tsx`.
- **Roadmap items as JSON (not MDX):** Roadmap items are structured data rows — title, status, flags, reference. Running them through the MDX pipeline (GROQ → Portable Text → MDX → sidebar) adds complexity for zero benefit. The filter/search UI requires the full dataset in memory anyway.

---

## Architectural Patterns

### Pattern 1: Build-Time JSON as the SSG-Safe Data Contract

**What:** `fetch-sanity-content.js` runs before `docusaurus build`, executes GROQ queries, and writes typed JSON files to `src/data/`. React pages import these files with static TypeScript `import` statements. No runtime API calls. No SSR.

**When to use:** All Sanity data that needs to power a custom React page (not an MDX doc). Already established for landing pages and release note metadata.

**Trade-offs:** Extremely fast page loads. Perfect Cloudflare Pages compatibility. Zero runtime API cost. Content is only as fresh as the last build — acceptable because a Sanity publish webhook triggers a new build, and the pipeline completes in under 3 minutes.

**Example — adding releases to fetch-sanity-content.js:**
```javascript
// In fetch-sanity-content.js

const RELEASES_GENERATED_FILE = path.join(
  SITE_DIR, 'src', 'data', 'sanity-releases.generated.json'
);

const ROADMAP_GENERATED_FILE = path.join(
  SITE_DIR, 'src', 'data', 'sanity-roadmap.generated.json'
);

function getReleasesQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return `*[_type == "release" && ${filter}] | order(publishedAt desc) {
    _id, title, slug, sprintId, publishedAt,
    items[] {
      _key, title, description, type,
      "screenshotUrl": screenshot.asset->url,
      videoUrl
    }
  }`;
}

function getRoadmapQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return `*[_type == "roadmapItem" && ${filter}] | order(_createdAt desc) {
    _id, title, status, businessValue, changeType,
    uiChange, uxFixes, entities,
    "releaseSlug": releaseRef->slug.current
  }`;
}
```

**Example — consuming in a React page:**
```typescript
// src/pages/releases.tsx
import releases from '../data/sanity-releases.generated.json';

export default function ReleasesPage() {
  return (
    // releases is typed, bundled at build time, zero fetch latency
    releases.map(release => <ReleaseCard key={release._id} release={release} />)
  );
}
```

### Pattern 2: Client-Side Filter on Build-Time Data

**What:** All data is in the page bundle at build time. Search and filter operate in the browser via React `useState` + `useMemo`. No API calls at filter time.

**When to use:** Datasets small enough to ship in-bundle — dozens to a few hundred items. Both the roadmap and releases qualify. A year of bi-weekly releases is 26 records. A roadmap rarely exceeds a few hundred items.

**Trade-offs:** Zero filter latency (no network round-trip). Works offline. Full dataset is in the HTML payload — fine at this scale; would need pagination beyond ~500 items. The existing legacy roadmap page already uses exactly this pattern.

**Example (adapted from existing legacy roadmap.tsx):**
```typescript
const filteredItems = useMemo(() => {
  return roadmapItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.businessValue?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
}, [searchQuery, selectedStatus, roadmapItems]);
```

### Pattern 3: Hero Banner via Static JSON Import (Not Client-Side Fetch)

**What:** The hero banner in `NXGENSphereHero.tsx` currently hardcodes `"Sprint 2025.12-B is live"` (line 418). Replace this string with a read from `releases[0]` via a static import of the JSON file.

**Why not client-side fetch:** SSG pages are rendered to static HTML at build time. A client-side `fetch()` causes a hydration flash — the server HTML shows nothing, then data appears after JS runs. This is a visible flash directly in the hero on every page load. Unacceptable.

**Why not a Cloudflare Function:** Adding a Function for a banner title adds operational complexity, introduces a runtime dependency, and violates the "no runtime infrastructure" constraint. The data is already available in the JSON that the build script writes.

**How it works:**
```typescript
// src/components/NXGENSphereHero.tsx
import releasesData from '../data/sanity-releases.generated.json';

// releases are already sorted desc by publishedAt in the GROQ query
const latestRelease = releasesData[0];
const bannerText = latestRelease
  ? `${latestRelease.title} is live`
  : 'Latest release';
```

When a new release is published in Sanity, the webhook triggers a rebuild. The GROQ query runs, the JSON updates with the new release at index 0, and the new banner text appears in the deployed build — typically within 2-3 minutes of hitting "Publish" in Studio.

### Pattern 4: Roadmap Item → Release Cross-Reference via Slug

**What:** The `roadmapItem` schema has an optional `releaseRef` Sanity reference. In GROQ, resolve this to a slug string so the frontend can render a deep-link without needing to look up the release document separately.

**Example GROQ projection:**
```groq
*[_type == "roadmapItem"] {
  ...,
  "releaseSlug": releaseRef->slug.current
}
```

**Frontend consumption:**
```typescript
// In /roadmap page
{item.releaseSlug && item.status === 'Shipped' && (
  <Link to={`/releases#${item.releaseSlug}`}>View release notes</Link>
)}
```

The `/releases` page renders each release with `id={release.slug.current}` on its container element, making these anchor links work without any routing changes.

---

## Data Flow

### Release Data Flow (Build Time)

```
Editor publishes "release" document in Sanity Studio
    |
    | (Sanity fires webhook to Cloudflare Pages deploy hook)
    v
Cloudflare Pages triggers rebuild
    |
    v
node scripts/fetch-sanity-content.js
    |
    |-- GROQ: *[_type == "release"] | order(publishedAt desc)
    |   projections: title, slug, sprintId, publishedAt,
    |                items[]{title, description, type, screenshotUrl, videoUrl}
    |
    v
src/data/sanity-releases.generated.json  <-- written to disk
    |
    v
docusaurus build: React pages compiled with JSON baked into bundle
    |
    |-- src/pages/releases.tsx         imports JSON -> renders /releases
    |-- NXGENSphereHero.tsx            reads releases[0] -> hero banner chip
    |-- src/pages/index.tsx            reads releases[0..1] -> "Recent Releases"
    |
    v
Static HTML + JS deployed to Cloudflare CDN
User sees latest release data in every page -- no client-side fetch required
```

### Roadmap Data Flow (Build Time + Client-Side Filter)

```
Editor publishes/updates "roadmapItem" documents in Sanity Studio
    |
    | (webhook -> rebuild)
    v
node scripts/fetch-sanity-content.js
    |
    |-- GROQ: *[_type == "roadmapItem"] | order(_createdAt desc)
    |   projections: all fields + "releaseSlug": releaseRef->slug.current
    |
    v
src/data/sanity-roadmap.generated.json  <-- written to disk
    |
    v
docusaurus build: full roadmap dataset bundled into /roadmap page
    |
    v
Browser: user loads /roadmap
    |
    |-- Full dataset already in JS bundle (no fetch needed at runtime)
    |-- useState: searchQuery, selectedStatus, other filters
    |-- useMemo: filter in-memory on every state change
    |
    v
Filtered list rendered with zero network latency
```

### What Does Not Change in the Existing Pipeline

The following existing data flows are unaffected by this milestone:

- GROQ queries for `doc`, `article`, `referencePage` types
- MDX file generation into `.sanity-cache/{audience}/*.md`
- `plugin-content-docs` instances reading `.sanity-cache/`
- `sanity-landing-pages.generated.json` and the `SanityLandingPageRoute` component
- The `docusaurus-plugin-sanity-content` plugin's `index.js` (remains a no-op shim)
- Cloudflare Pages webhook configuration (already triggers on any Sanity publish)

---

## Integration Points

### How New Schemas Interact With the Existing Plugin

The plugin (`docusaurus-plugin-sanity-content/index.js`) has a no-op `loadContent()`. The real work is in `scripts/fetch-sanity-content.js`. This is the only file that needs to change in the data pipeline.

Required changes to `fetch-sanity-content.js`:
1. Add `RELEASES_GENERATED_FILE` and `ROADMAP_GENERATED_FILE` constants
2. Add GROQ queries for `release` and `roadmapItem` types (inside `getQueries()` or as separate functions)
3. Add `fetchReleases()` and `fetchRoadmapItems()` functions modeled on existing `fetchLandingPages()`
4. Call both at the end of `run()`, alongside `fetchLandingPages()`
5. Remove the `releaseNote` type from `getQueries()` once `release` schema is in place

No changes to the plugin's `index.js` are needed. No changes to `docusaurus.config.ts` are needed. No new Docusaurus plugin instances are needed.

### Schema Migration: releaseNote -> release

The existing `releaseNote` schema has `title`, `slug`, `version`, `sprintId`, `publishedAt`, `changeType`, `affectedAreas`, `status`, and a single `body` (Portable Text). The new `release` schema replaces this with `items[]` (an inline array of structured objects).

The current fetch script has a `releaseNote` GROQ query that writes both MDX files to `.sanity-cache/docs/` and a `sanity-release-notes.generated.json` metadata file. Both outputs become obsolete when the schema is replaced:

- The MDX files for release notes are no longer needed (releases move to a custom React page)
- The `sanity-release-notes.generated.json` file can be deleted (superseded by `sanity-releases.generated.json`)

There is currently one live release note document in Sanity (the JSON file is empty `[]`). No migration of existing content is required.

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Sanity Content API | GROQ at build time via `@sanity/client` | Add two new queries; no new auth required |
| Sanity Asset CDN | `asset->url` in GROQ projection | Screenshots in release items resolve to CDN URLs inline; no URL builder logic needed in fetch script |
| Cloudflare Pages | Webhook -> rebuild | No change; existing webhook covers all Sanity document types |
| Cloudflare Functions | Existing: page-feedback.ts, voc-feedback.ts | No new Functions needed for this milestone |
| Cloudinary | Docs images only | Not involved in releases or roadmap; release items use Sanity assets directly |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `fetch-sanity-content.js` -> `src/data/*.json` | File write at build time | One-way; script writes, pages read via static import |
| `src/pages/releases.tsx` -> `sanity-releases.generated.json` | Static TypeScript import | JSON bundled at build time; no runtime fetch |
| `src/pages/roadmap.tsx` -> `sanity-roadmap.generated.json` | Static TypeScript import | Replaces current import from `src/data/roadmap.ts` |
| `NXGENSphereHero.tsx` -> `sanity-releases.generated.json` | Static TypeScript import | Reads `releases[0]` for banner chip text |
| `src/pages/index.tsx` -> `sanity-releases.generated.json` | Static TypeScript import | Replaces hardcoded `recentReleases` array in index.tsx lines 105-119 |
| `roadmapItem` schema -> `release` schema | Sanity reference field | Resolved to slug string in GROQ; frontend uses as anchor link |

---

## Suggested Build Order

The following sequence respects dependencies between components. Each step assumes the previous step is complete and verified.

### Step 1: Sanity Schema — Replace and Add

**Dependencies:** None. Self-contained in `studio/`.

1. Delete `studio/schemaTypes/releaseNote.ts`
2. Create `studio/schemaTypes/release.ts` — document type with `items[]` array
3. Create `studio/schemaTypes/roadmapItem.ts` — document type with `releaseRef` reference field
4. Update `studio/schemaTypes/index.ts` — remove `releaseNoteType`, add `releaseType` and `roadmapItemType`
5. Verify: open Sanity Studio, confirm `release` and `roadmapItem` appear as document types
6. Create one test release with 2-3 items, create 3-5 test roadmap items (various statuses)

**Why first:** Every downstream step depends on having schema documents to query. Steps 2-5 have no data to work with until this is done.

### Step 2: Fetch Script — New GROQ Queries + JSON Output

**Dependencies:** Step 1 complete with test documents in Sanity.

1. Add `RELEASES_GENERATED_FILE` and `ROADMAP_GENERATED_FILE` path constants
2. Add GROQ query for `release` type with `items[]` and nested `screenshot.asset->url`
3. Add GROQ query for `roadmapItem` type with `releaseRef->slug.current` projection
4. Add `fetchReleases()` and `fetchRoadmapItems()` functions
5. Call both at end of `run()`
6. Remove `releaseNote` from `getQueries()` (or comment out during transition)
7. Run script locally: `node classic/scripts/fetch-sanity-content.js`
8. Verify `src/data/sanity-releases.generated.json` and `src/data/sanity-roadmap.generated.json` contain correct data

**Why second:** The React pages (Steps 3 and 4) import these JSON files. Without them, TypeScript compilation fails.

### Step 3: /releases Page — Replace Legacy Implementation

**Dependencies:** Step 2 (JSON files must exist with correct structure).

1. Replace `src/pages/releases.tsx` — remove `SanityLandingPageRoute` wrapper; write a full custom React page
2. Import `sanity-releases.generated.json` with a typed interface
3. Render releases in reverse-chronological order (already sorted by GROQ)
4. Per-release: header with title, date, sprint ID; per-item: type badge, title, description, optional screenshot image, optional video
5. Add `id={release.slug.current}` to each release container (for deep-links from roadmap)
6. Delete or archive `src/legacy-pages/releases.tsx` and `src/pages/releases/` sprint files

**Note on page approach:** Do not route releases through `plugin-content-docs`. The per-item rich media layout cannot be achieved through the Portable Text to MDX pipeline. The existing `/roadmap` page is a custom React page for exactly this reason — follow the same pattern.

### Step 4: /roadmap Page — Replace Static Data Source

**Dependencies:** Step 2 (roadmap JSON must exist).

1. Replace `src/pages/roadmap.tsx` — remove `SanityLandingPageRoute` wrapper; write a full custom React page
2. Import `sanity-roadmap.generated.json` with typed interface
3. Adapt existing legacy roadmap filter/search logic to new schema field names
4. Map status values to the new vocabulary: `Planned`, `In Progress`, `Shipped`
5. Render "View release notes" link for items where `status === 'Shipped' && item.releaseSlug`
6. Delete `src/data/roadmap.ts` (static TypeScript data file no longer needed)

### Step 5: Hero Banner + Home Page Recent Releases

**Dependencies:** Step 2 (releases JSON must exist). Independent of Steps 3 and 4.

1. In `NXGENSphereHero.tsx` (line 418): replace hardcoded `"Sprint 2025.12-B is live"` with `${releases[0]?.title ?? 'Latest release'} is live`
2. Add static import at top of `NXGENSphereHero.tsx`: `import releasesData from '../data/sanity-releases.generated.json'`
3. In `src/pages/index.tsx` (lines 105-119): replace hardcoded `recentReleases` array with `releasesData.slice(0, 2)` mapped to the `Resource` type

**Why last:** This is cosmetic. It depends on Step 2 but has no blocking relationship with Steps 3 or 4.

### Step 6: Cleanup and URL Verification

**Dependencies:** Steps 3-5 complete and deployed.

1. Verify `/releases` renders correctly from Sanity data
2. Verify `/roadmap` renders correctly from Sanity data
3. Verify `/` hero banner shows latest release from Sanity
4. Verify `/releases#sprint-2026-01-a` anchor links work from roadmap "Shipped" items
5. Delete `src/data/sanity-release-notes.generated.json` and remove it from `fetch-sanity-content.js`
6. Archive or delete `src/pages/internal-releases/` if no longer needed
7. Confirm no broken links from `/internal-releases/` (add Cloudflare `_redirects` if needed)

---

## Anti-Patterns

### Anti-Pattern 1: Client-Side Fetch for the Hero Banner

**What people do:** `useEffect(() => { fetch('https://...api.sanity.io/...').then(setLatestRelease) }, [])` in `NXGENSphereHero.tsx`.

**Why it's wrong:** SSG pages render to static HTML at build time. The first paint shows the HTML without any client data. The `useEffect` fires only after JavaScript hydrates, causing a visible flash where the banner shows empty or stale content. For a component rendered immediately on page load, this is noticeable. Additionally, this introduces a runtime API dependency requiring CORS headers or a proxy — complexity not justified for a single string.

**Do this instead:** Static import of the pre-built JSON file. The string is baked into the HTML at build time. Zero flash. Zero runtime API dependency.

### Anti-Pattern 2: Routing Releases Through plugin-content-docs

**What people do:** Write one MDX file per release to `.sanity-cache/docs/releases/sprint-xxx.md`, register a "releases" docs plugin instance, let Docusaurus handle routing.

**Why it's wrong:** The new `release` schema has `items[]` — an array of structured objects each with a type badge, screenshot, and optional video. The MDX pipeline renders one `body` Portable Text field per document. There is no clean way to serialize an items array through Portable Text into MDX that preserves the structured layout. The result would be fragile markdown with hardcoded sub-sections and no type-safe rendering.

**Do this instead:** A custom React page at `src/pages/releases.tsx` that imports the JSON directly and renders items with full control over layout — type badge chip, `<img>` for screenshot, `<video>` or `<iframe>` for video. This is already how `roadmap.tsx` works.

### Anti-Pattern 3: One Sanity Document Per Release Item

**What people do:** Create a `releaseItem` document type and cross-reference items from the release document via a `references()` array.

**Why it's wrong:** Each sprint has 5-20 items. Editors must create 5-20 separate Studio documents per sprint, navigate between them to reorder, and manage reference arrays manually. Studio UX becomes a drag-and-drop nightmare. Ordering becomes a separate operation. The relationship between items and their release is maintained through references rather than co-location.

**Do this instead:** Items as an inline `array` field directly on the `release` document. Sanity's array field UI handles drag-and-drop reordering natively. All items are authored in a single document edit session.

### Anti-Pattern 4: Keeping roadmap.ts as a Parallel Data Source

**What people do:** Add new roadmap items to `src/data/roadmap.ts` (the existing static TypeScript file) as a "quick fix" before the Sanity schema is ready, intending to migrate later.

**Why it's wrong:** Creates dual-source-of-truth immediately. When Sanity data lands, merging static file content back into Sanity is manual and error-prone. The existing `roadmap.ts` uses different status vocabulary (`Launched`, `In Development`, `Beta`, `Planning`, `Coming Soon`) than the new schema defines (`Planned`, `In Progress`, `Shipped`). Reconciling this later adds unnecessary risk.

**Do this instead:** Delete `roadmap.ts` in the same commit that introduces `sanity-roadmap.generated.json`. Seed historical roadmap data directly into Sanity Studio as part of Step 1. There is no reason to maintain both simultaneously.

### Anti-Pattern 5: Adding a Cloudflare Function for Roadmap Search

**What people do:** Create a Cloudflare Function that queries Sanity at runtime, enabling "real-time" search.

**Why it's wrong:** The existing roadmap dataset fits comfortably in a JavaScript bundle. The legacy `roadmap.tsx` already does client-side filtering on a similar dataset. A Cloudflare Function adds deployment complexity, a runtime failure mode, cold start latency, and an API billing surface. For a dataset of dozens to hundreds of items, in-browser filtering is faster than a network round-trip to a Function.

**Do this instead:** Client-side filter on the bundled JSON. If the roadmap ever exceeds ~500 items, revisit — but at bi-weekly cadence that threshold is years away.

---

## Scaling Considerations

This site is internal product documentation for a team of editors and a public customer audience. Scaling to millions of users is not a relevant concern. The relevant operational constraints are:

| Concern | Current | With Releases + Roadmap | Assessment |
|---------|---------|------------------------|------------|
| Build time | ~60-90s (fetch + Docusaurus) | +5-15s for two new GROQ queries | Acceptable |
| JSON bundle size | landing pages JSON is small | 26 releases/year at ~5KB each = ~130KB/year | Well within budget |
| Roadmap bundle | N/A (static TS file) | 100-200 items at ~1KB each = ~200KB | Fine for client-side filtering |
| Cloudflare Functions | 2 existing | No new Functions this milestone | No change |
| Sanity API quota | Low-volume build-time fetches | 2 additional GROQ queries per build | Negligible |
| Content freshness | Rebuild on publish | Same; webhook already configured | No change |

If the roadmap grows beyond ~500 items in a single page, introduce pagination in the React component (slice the imported JSON, render a "Load more" control). The JSON import approach accommodates this without any pipeline changes.

---

## Sources

All findings are based on direct inspection of the following files:

- `classic/scripts/fetch-sanity-content.js` — the authoritative data pipeline (all GROQ queries, all JSON output logic)
- `classic/plugins/docusaurus-plugin-sanity-content/index.js` — confirms plugin is a thin shim; no-op `loadContent()`
- `studio/schemaTypes/releaseNote.ts` — current schema being replaced
- `studio/schemaTypes/index.ts` — current schema registry
- `classic/src/pages/releases.tsx` — current implementation (thin SanityLandingPageRoute wrapper)
- `classic/src/pages/roadmap.tsx` — current implementation (thin SanityLandingPageRoute wrapper)
- `classic/src/legacy-pages/releases.tsx` — legacy static implementation with hardcoded data
- `classic/src/legacy-pages/roadmap.tsx` — legacy filter/search pattern to be adapted
- `classic/src/components/NXGENSphereHero.tsx` — hardcoded banner text at line 418
- `classic/src/pages/index.tsx` — hardcoded recentReleases array at lines 105-119
- `classic/src/components/SanityLandingPageRoute.tsx` — JSON-backed page pattern
- `classic/src/data/sanity-releases.generated.json` — currently empty `[]`
- `.planning/PROJECT.md` — constraints (no backend, Cloudflare Pages, webhook rebuilds, no SSR)

---

*Architecture research for: NXGEN GCXONE Docs — v1.1 Releases & Roadmap*
*Researched: 2026-03-13*
