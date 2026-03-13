# Project Research Summary

**Project:** NXGEN GCXONE Documentation Platform — v1.1 Releases & Roadmap
**Domain:** Brownfield feature addition to a live Docusaurus 3 + Sanity CMS documentation site
**Researched:** 2026-03-13
**Confidence:** HIGH

## Executive Summary

This is a brownfield v1.1 addition to a fully operational documentation platform. The core infrastructure — Docusaurus 3, Sanity Studio, the `fetch-sanity-content.js` pre-build pipeline, Cloudflare Pages hosting, and the webhook-triggered rebuild workflow — is production-proven and requires no architectural changes. The three features in scope (Sanity-driven release notes with per-item rich media, a Sanity-driven public roadmap with search and status filtering, and a dynamic hero banner showing the latest release) can all be implemented using zero new npm packages. Every library needed is already installed.

The recommended approach is strictly build-time: Sanity data is fetched via GROQ at build time into static JSON files, which React pages import directly. Client-side filter and search on the roadmap operate against the fully bundled dataset using `useState` + `useMemo`. No runtime API calls, no SSR, no Cloudflare Functions. This preserves the static site constraint and matches every established pattern in the existing codebase. The single most important architectural decision is replacing the flat `releaseNote` Sanity schema with a new `release` schema that treats each sprint as one document containing an `items[]` inline array — this enables per-item screenshots, video embeds, and metadata without the editorial overhead of managing cross-referenced documents.

The primary risk in this milestone is the schema migration from `releaseNote` to `release`. Sanity documents are not schema-bound: existing documents survive a type rename, but Studio breaks on them, and the fetch script silently returns empty results because `build.sh` swallows non-zero exit codes with `|| true`. This pitfall is well-understood and has a clear prevention strategy: the migration must be a single atomic sequence — add the new schema alongside the old, migrate documents, update all four registration sites in Studio config, update GROQ queries, then delete the old schema. The second major risk is the `SanityLandingPageRoute` fallback pattern currently used by both `releases.tsx` and `roadmap.tsx`: those wrappers must be replaced entirely, not extended, or the pages will silently render stale hardcoded content after v1.1 deploys.

---

## Key Findings

### Recommended Stack

No new dependencies are required for any core v1.1 feature. The entire implementation uses packages already in `classic/package.json` and `studio/package.json`. The single integration point for new data is `classic/scripts/fetch-sanity-content.js`: two new GROQ queries are added to its `run()` function, producing two new generated JSON files (`sanity-releases.generated.json` and `sanity-roadmap.generated.json`). React pages import these files with static TypeScript `import` statements — the data is baked into the page bundle at build time.

**Core technologies (all already installed):**

- **Sanity Studio ^5.13.0** — schema authoring for `release` (replaces `releaseNote`) and new `roadmapItem` document types; `defineArrayMember` pattern already used in `portableText-ultimate.ts`
- **`@sanity/client` ^7.16.0** — GROQ queries in the pre-build fetch script; two new queries added, no config changes
- **React `useState` + `useMemo` ^18.3.1** — client-side filter and search on the roadmap page; zero library additions needed
- **Tailwind CSS ^3.4.18** — styling for all new components; already used on every page
- **`lucide-react` ^0.554.0** — icons in filter bar and status badges; already used throughout
- **`framer-motion` ^12.23.25** — existing hero animation unchanged; no new animation work
- **`sanity-plugin-mux-input` ^2.17.0** — video support in release items; already installed in Studio
- **Docusaurus ^3.9.2** — no config changes needed; new features are custom React pages, not doc-tree content

**Explicitly avoid:** `Fuse.js`/fuzzy search (overkill for this dataset scale), `@portabletext/react` as a parallel rendering path unless release item descriptions require rich Portable Text (see Gaps section), runtime `useEffect + fetch()` in any hero or page component (causes hydration flash), Cloudflare Functions for roadmap data (operational complexity for no benefit), and separate `releaseItem` document type (creates editorial UX nightmare vs. inline array).

### Expected Features

The legacy `/releases` and `/roadmap` pages are already feature-rich in the hardcoded implementation. The v1.1 gap is that both are driven by static TypeScript data files rather than Sanity, and neither has the cross-linking between shipped roadmap items and their corresponding release notes.

**Must have — table stakes for release notes (v1.1 launch):**
- Reverse-chronological list of sprint releases driven by Sanity (replaces hardcoded `releases.tsx`)
- Per-sprint detail page at `/releases/[slug]` with all items, types, and metadata
- Item-level grouping within a sprint (items array, not flat prose)
- Screenshot support per release item (Sanity image assets, CDN URLs resolved at build time)
- Video embed per release item (YouTube/Vimeo iframe or Mux — already wired in Studio)
- Change-type badges (New, Fix, Improvement) on index and item level
- Stable permalinks per sprint entry; "Latest" badge on index; empty state guard

**Must have — table stakes for roadmap (v1.1 launch):**
- Status filter (Planned / In Progress / Shipped) and text search driven by Sanity data
- Per-item business value statement, change type, UI change flag, entities impacted
- Shipped items link to the corresponding sprint release note — the single highest-value differentiator in the competitive set
- Results count, empty state with "Clear filters", "last updated" timestamp from Sanity `_updatedAt`

**Must have — hero banner (v1.1 launch):**
- Dynamic "Sprint X is live" chip reading from `sanity-releases.generated.json[0]` — replaces the hardcoded `"Sprint 2025.12-B is live"` string at `NXGENSphereHero.tsx` line 418

**Should have — add after v1.1 validation (P2):**
- Affected-areas filter on releases index (once editors have populated 5+ entries consistently)
- Docs reference link per release item (`docsRef` reference field)
- Change-type filter on roadmap (once 20+ items with consistent tagging exist)

**Defer to v1.2+:**
- RSS feed for releases (requires new build plugin; no equivalent in current codebase)
- Year/quarter filter on releases index (only useful with 2+ years of data)
- Mux video playback in the browser (YouTube/Vimeo embed is sufficient for v1.1)

**Anti-features (deliberately not building):**
- Voting/upvoting on roadmap items — requires auth and server; explicit anti-feature
- Email subscription to releases — requires mailing list infrastructure out of scope
- Real-time roadmap updates — static site; webhook rebuild is the correct update cadence
- Kanban/board view — high complexity, negligible value for a public read-only audience
- Zoho Sprints integration — explicit out-of-scope decision; fragile API dependency

### Architecture Approach

The architecture is a proven three-layer pipeline: Sanity Studio (content authoring) → `fetch-sanity-content.js` (build-time GROQ + JSON generation) → Docusaurus React pages (static import of generated JSON). This pipeline is already proven for landing pages and existing release metadata. The v1.1 addition extends it with two new GROQ queries and two new generated files, then replaces the `SanityLandingPageRoute`-wrapped placeholder pages with purpose-built React components that own their data directly.

**Major components and their responsibilities:**

1. **`studio/schemaTypes/release.ts` (NEW)** — one Sanity document per sprint; `items[]` inline array with per-item title, description, change type, affected areas, optional screenshot, optional video; replaces `releaseNote.ts`
2. **`studio/schemaTypes/roadmapItem.ts` (NEW)** — flat document with status, businessValue, changeType, uiChange flag, entitiesImpacted array, optional `releaseRef` reference resolved to slug string in GROQ
3. **`classic/scripts/fetch-sanity-content.js` (MODIFIED)** — adds `fetchReleases()` and `fetchRoadmapItems()` functions; writes two new generated JSON files; removes the obsolete `releaseNote` GROQ query
4. **`classic/src/pages/releases.tsx` (REPLACED)** — standalone React page importing `sanity-releases.generated.json`; renders sprint list with per-item media; each release container carries `id={slug}` for anchor deep-links from roadmap
5. **`classic/src/pages/roadmap.tsx` (REPLACED)** — standalone React page importing `sanity-roadmap.generated.json`; `useState` + `useMemo` filter/search adapted from existing `legacy-pages/roadmap.tsx` pattern
6. **`classic/src/components/NXGENSphereHero.tsx` (MODIFIED)** — static import of `sanity-releases.generated.json`; renders `releases[0].displayTitle` in the "What's New" chip; removes hardcoded sprint string
7. **`classic/src/pages/index.tsx` (MODIFIED)** — replaces hardcoded `recentReleases` array (lines 105–119) with `releasesData.slice(0, 2)`

**Key patterns:**
- Build-time JSON as the SSG-safe data contract — no runtime API calls anywhere in the site
- Client-side filter on fully bundled dataset — no Cloudflare Function, no network round-trip
- Roadmap-to-release cross-link via resolved slug string (`"releaseSlug": releaseRef->slug.current` in GROQ) — never pass raw `_ref` objects to the frontend
- Items as an inline `array` field on the `release` document — editorial drag-and-drop reordering is native in Sanity's array UI; separate cross-referenced documents are not needed and create authoring friction

### Critical Pitfalls

1. **Schema rename before atomic migration breaks Studio and silently empties fetch output** — Execute as a single atomic sequence: add new `release` schema alongside old `releaseNote`, migrate existing documents via GROQ patch, update all four registration sites in `sanity.config.ts`, `structure.ts`, and `schemaTypes/index.ts`, update GROQ queries, then delete the old schema. Never rename first and migrate later. (PITFALLS.md Pitfall 1)

2. **`build.sh`'s `|| true` flag makes empty-content deploys invisible** — During migration work, temporarily enable strict mode (`SANITY_FETCH_STRICT=true`). Add a post-fetch assertion that generated JSON files are non-empty when the corresponding schema type has published documents. Cloudflare Pages shows a green build even when releases/roadmap data is an empty array. (PITFALLS.md Pitfall 2)

3. **GROQ reference fields missing the `->` dereference operator deliver opaque `_ref` strings to the frontend** — Always use `"releaseSlug": releaseRef->slug.current` in projections; guard null-checks in the component for unpublished or deleted referenced documents; never expose raw `{ _ref: "..." }` objects to React. (PITFALLS.md Pitfall 3)

4. **`SanityLandingPageRoute` fallback silently renders legacy hardcoded content** — Replace `releases.tsx` and `roadmap.tsx` entirely; do not extend the wrapper. The wrapper falls back to the legacy component when no `landingPage` document with the matching slug exists — which is always true for these dedicated-purpose pages. (PITFALLS.md Pitfall 5)

5. **Hero banner wired with `useEffect + fetch()` instead of static JSON import** — `useEffect + fetch()` in a Docusaurus static page causes a visible hydration flash. Use a static `import` of the pre-built JSON so the string is baked into HTML at build time with zero client-side fetch. (PITFALLS.md Pitfall 4)

---

## Implications for Roadmap

The ARCHITECTURE.md file provides an explicit 6-step build order that research across all four files independently confirms. The sequencing is unambiguous: schema and data pipeline must come before frontend pages, frontend pages before cosmetic polish, cleanup last. No phase has ambiguous ordering and no phase requires additional research before implementation can begin.

### Phase 1: Sanity Schema Migration and Data Pipeline

**Rationale:** Every downstream component depends on having Sanity documents to query and generated JSON files to import. TypeScript compilation of the React pages fails without the JSON files. The schema migration carries the highest risk in the milestone — it involves four registration sites, an atomic document migration, and a verification step that must confirm non-zero document counts before the old schema is deleted.

**Delivers:** New `release` schema with `items[]` array live in Studio; new `roadmapItem` schema live in Studio; `fetch-sanity-content.js` extended with two new GROQ queries; `sanity-releases.generated.json` and `sanity-roadmap.generated.json` written with verified test data; old `releaseNote` schema cleanly removed; fallback empty-array JSON files committed to git for fresh-clone builds; Cloudflare Pages webhook filter scoped to published document types only (not draft saves).

**Features addressed (from FEATURES.md):** Schema fields for all P1 features — items array with screenshot/video on release, businessValue/changeType/uiChange/entitiesImpacted/releaseRef on roadmapItem, displayTitle distinct from internal sprintId.

**Pitfalls to avoid:** Schema-rename-before-migration (Pitfall 1); silent empty deploy via `|| true` (Pitfall 2); missing fallback JSON in git (Integration Gotcha); Portable Text body serialization mismatch for rich media (Pitfall 6); `releaseNote` references remaining in all four Studio registration sites; webhook firing on draft saves.

**Research flag:** No additional research needed. All patterns are instantiated directly from existing codebase code. The atomic migration checklist in PITFALLS.md is the execution guide.

---

### Phase 2: Releases Page and Roadmap Page

**Rationale:** With verified JSON data on disk, both pages can be built in parallel. They share the same data-import pattern and are independent of each other at the page level, though the roadmap page's "Shipped" cross-links require the `releaseSlug` GROQ dereference from Phase 1 to be verified working. Both pages are replacements of the `SanityLandingPageRoute` wrapper, not extensions — this is the most common mistake to avoid.

**Delivers:** `/releases` index page driven by Sanity with sprint cards, change-type badges, and per-sprint detail pages at `/releases/[slug]` with per-item screenshots and video embeds; `/roadmap` page driven by Sanity with status filter and text search; Shipped roadmap items linking to `/releases#[slug]`; deletion of `src/data/roadmap.ts` and archival of `src/legacy-pages/releases.tsx`.

**Features addressed:** All P1 features — Sanity-driven releases index, release detail pages, per-item rich media, Sanity-driven roadmap with filter/search, Shipped-to-release cross-link (primary differentiator), status badges, business value, change type, UI change flag, entities impacted, results count, empty state, "last updated" timestamp.

**Stack used:** React `useState` + `useMemo` for roadmap filter; Tailwind for badge/grid styling; `lucide-react` for search/filter icons; Sanity image CDN URLs (resolved in GROQ) for screenshots; YouTube/Vimeo iframe for video embeds.

**Pitfalls to avoid:** Missing `->` dereference in GROQ for releaseRef (Pitfall 3); `SanityLandingPageRoute` wrapper not fully replaced (Pitfall 5); dual data source by keeping `roadmap.ts` alongside Sanity data (Pitfall 4 — delete in same commit); Zoho internal status labels exposed in public roadmap (UX Pitfalls); `useMemo` missing on roadmap filter causing input lag at scale.

**Research flag:** No additional research needed. The existing `legacy-pages/roadmap.tsx` filter/search pattern is the direct implementation template. ARCHITECTURE.md Steps 3 and 4 provide exact implementation notes.

---

### Phase 3: Hero Banner and Home Page Dynamic Data

**Rationale:** This phase depends on Phase 1 (JSON file must exist with correct shape) but is independent of Phase 2. It is cosmetic and low-risk. Implementing it after Phase 1 is verified ensures the hero reads from a JSON structure that has already been confirmed correct by integration testing.

**Delivers:** `NXGENSphereHero.tsx` "What's New" chip reads `sanity-releases.generated.json[0].displayTitle` dynamically — hardcoded sprint string at line 418 is removed; `index.tsx` recent-releases section reads `releasesData.slice(0, 2)` instead of a hardcoded array; `displayTitle` field on the `release` schema provides customer-facing language distinct from the internal `sprintId`.

**Features addressed:** Hero banner latest release badge (P1, PROJECT.md explicit requirement); dynamic recent releases on home page.

**Pitfalls to avoid:** `useEffect + fetch()` in hero component (Pitfall 4 — must use static import, never runtime fetch); hydration flash on first paint; hardcoded sprint string remaining in component after v1.1 (`grep -n "Sprint" NXGENSphereHero.tsx` check from PITFALLS.md checklist).

**Research flag:** No additional research needed. The implementation is a three-line change in `NXGENSphereHero.tsx` and a four-line change in `index.tsx`. ARCHITECTURE.md Pattern 3 gives the exact code.

---

### Phase 4: Cleanup and URL Verification

**Rationale:** Post-deployment verification and deletion of now-dead code. Skipping this phase leaves technical debt (superseded generated files, orphaned legacy pages) and risks 404s on previously valid URLs such as `/internal-releases/`.

**Delivers:** Deletion of `src/data/sanity-release-notes.generated.json` (superseded by `sanity-releases.generated.json`); deletion of `src/pages/internal-releases/` with Cloudflare `_redirects` entries if needed; verified anchor links for `/releases#[slug]` deep-links from roadmap Shipped items; confirmed webhook scoping (build logs show triggers only on publish, not draft saves); full "Looks Done But Isn't" checklist from PITFALLS.md executed.

**Pitfalls to avoid:** Webhook firing on draft saves causing spurious rebuilds; broken 404s on archived `/internal-releases/` paths; legacy page components deleted before confirmed as dead (keep `legacy-pages/` as rollback reference until deployment is stable).

**Research flag:** No additional research needed. PITFALLS.md "Looks Done But Isn't" checklist is the execution guide.

---

### Phase Ordering Rationale

- **Schema before pipeline, pipeline before pages** reflects the compile-time dependency chain independently confirmed across STACK.md, FEATURES.md, and ARCHITECTURE.md: React pages cannot compile without JSON files; JSON files cannot be generated without schema documents.
- **Phases 2 and 3 can run in parallel** after Phase 1 is verified: the releases page and roadmap page are independent of each other; the hero banner is independent of both pages; all three only share the Phase 1 prerequisite of a valid `sanity-releases.generated.json`.
- **Pitfall 1 (atomic schema migration) forces Phase 1 to be treated as a single verified pass**, not an incremental one. The team cannot move to Phase 2 until GROQ Vision confirms zero `releaseNote` documents remain and the fetch script logs a non-zero count for the `release` type.
- **The `|| true` build flag (Pitfall 2) means Phase 1 must include a strict-mode verification run** before handing off to Phase 2, otherwise Phase 2 begins on silently empty JSON data.

### Research Flags

Phases needing deeper research during planning:
- **None.** All four research files are grounded in direct codebase inspection of the live production system. All implementation patterns are already present in the codebase. The roadmapper can structure phases directly from this summary without additional research passes.

Phases with well-documented, proven patterns (no research-phase needed):
- **Phase 1:** `defineArrayMember` schema pattern, atomic migration checklist, GROQ query extension — all sourced from live code.
- **Phase 2:** Client-side filter pattern is a direct copy-adaptation of `legacy-pages/roadmap.tsx`. React page pattern follows `SanityLandingPageRoute.tsx` and `index.tsx`.
- **Phase 3:** Three-line component change with exact code provided in ARCHITECTURE.md Pattern 3.
- **Phase 4:** Execution checklist provided verbatim in PITFALLS.md "Looks Done But Isn't" section.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All decisions derived from live `package.json` files and running production code. No inference required. |
| Features | HIGH (codebase) / MEDIUM (benchmarks) | Table stakes and P1 features derived from direct legacy page inspection. Competitor analysis (Linear, Vercel, Intercom) drawn from training data cutoff August 2025 — treat as directional, not authoritative. |
| Architecture | HIGH | All patterns grounded in direct inspection of 13+ live source files. No architecture decision requires new technology or an untested pattern. |
| Pitfalls | HIGH | Every critical pitfall traceable to a specific file and line number in the live codebase. Mitigation steps are verified, not speculative. |

**Overall confidence: HIGH**

### Gaps to Address

- **`displayTitle` vs. `sprintId` UX field:** PITFALLS.md flags that external customers do not understand internal sprint naming conventions (e.g., "Sprint 2025.12-B"). The `release` schema needs a `displayTitle` field for customer-facing language distinct from `sprintId`. This field is absent from the existing `releaseNote` schema and must be added as a required field in Phase 1. Editors need a brief authoring note explaining the distinction. Decide in Phase 1 requirements whether `displayTitle` is required or optional with `sprintId` as fallback.

- **`@portabletext/react` dependency decision:** PITFALLS.md Pitfall 6 flags that rendering rich release item descriptions (inline images, video embeds as blocks) through the existing `serializeBody()` Markdown pipeline is lossy. If release item descriptions are simple prose, the existing serializer is sufficient and no new package is needed. If they use rich Portable Text blocks (image arrays, video embeds), `@portabletext/react` is needed — and it is not currently in `classic/package.json`. Validate during Phase 1 schema design: if item descriptions will be plain text plus links only, no new dependency. If rich blocks, add the dependency before Phase 2 begins.

- **Projected release date format on roadmap:** PITFALLS.md flags that storing `projectedRelease` as a human string ("Q2 2026") prevents programmatic sorting and causes silent staleness erosion. Adding a `lastReviewedAt` ISO date field alongside the human string is recommended. Decide during Phase 1 requirements whether this is in-scope for v1.1 or deferred to v1.2.

- **Webhook filter scope:** The current Cloudflare Pages webhook may not be scoped — it could fire on draft saves of all document types. PITFALLS.md Integration Gotcha recommends scoping to published `release` and `roadmapItem` documents only. Verify current webhook configuration in Sanity dashboard before Phase 1 begins and update if needed.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)

- `classic/package.json` — verified installed versions for all frontend dependencies
- `studio/package.json` — verified Studio plugin versions including `sanity-plugin-mux-input`
- `classic/scripts/fetch-sanity-content.js` — authoritative data pipeline; all GROQ patterns, serialization, backup system, `|| true` flag
- `studio/schemaTypes/releaseNote.ts` — current schema being replaced; field inventory
- `studio/schemaTypes/portableText-ultimate.ts` — `defineArrayMember` usage pattern (directly reusable)
- `studio/schemaTypes/index.ts` — all type registrations; four sites requiring update on migration
- `studio/sanity.config.ts` — initial value templates, document actions, dashboard widgets (lines 60, 130, 145, 170)
- `studio/src/structure.ts` — sidebar entry and Published filter referencing `releaseNote`
- `classic/src/components/NXGENSphereHero.tsx` line 418 — hardcoded sprint string to replace
- `classic/src/pages/releases.tsx` + `classic/src/pages/roadmap.tsx` — current `SanityLandingPageRoute` wrapper pattern to replace
- `classic/src/legacy-pages/releases.tsx` + `classic/src/legacy-pages/roadmap.tsx` — legacy implementations to adapt
- `classic/src/data/roadmap.ts` — existing static TypeScript roadmap data; internal Zoho labels to strip before exposing publicly
- `classic/src/pages/index.tsx` lines 105–119 — hardcoded `recentReleases` array
- `build.sh` line 19 — `|| true` flag on fetch-content step
- `.planning/PROJECT.md` — v1.1 feature requirements and constraints (no backend, static site, webhook rebuilds)

### Secondary (MEDIUM confidence — training data benchmarks)

- Linear changelog (linear.app/changelog) — "Released in" pattern for shipped items
- Vercel changelog (vercel.com/changelog) — per-item media and per-entry permalink pattern
- Intercom changelog (intercom.com/changelog) — category-based filtering pattern
- Canny.io — upvoting anti-feature reference; corroborates deliberate exclusion from scope

---

*Research completed: 2026-03-13*
*Ready for roadmap: yes*
