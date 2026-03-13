# Pitfalls Research

**Domain:** SSG (Docusaurus) + Headless CMS (Sanity) — Releases & Public Roadmap (v1.1 milestone)
**Researched:** 2026-03-13
**Confidence:** HIGH (all pitfalls grounded in direct codebase inspection of the v1.0-completed system; no training-data guesses)

> Note: This file supersedes the v1.0 pitfalls document. The v1.0 pitfalls (dead CMS code, build pipeline, Storyblok removal, etc.) are resolved and archived. This document focuses exclusively on the v1.1 additions: schema migration, releases page, roadmap page, hero banner dynamic data, rich media in releases, and cross-document linking.

---

## Critical Pitfalls

### Pitfall 1: Removing `releaseNote` from the schema before migrating existing documents

**What goes wrong:**
The current schema registers `releaseNoteType` in four places: `schemaTypes/index.ts`, `sanity.config.ts` (initial value templates on line 60, document actions list on line 170, dashboard widget `types` arrays on lines 130 and 145), and `studio/src/structure.ts` (two list items: the "Release Notes" sidebar entry and the "Published > Release Notes" filter). If the type name is changed or the file is deleted while Sanity still holds documents of `_type == "releaseNote"`, Studio breaks with "Unknown document type" errors on every existing release note. The structure sidebar becomes unusable.

Simultaneously, `fetch-sanity-content.js` line 72 queries `_type == "releaseNote"`. After the rename, this query returns zero results. The script writes an empty `sanity-release-notes.generated.json` without error — and because `build.sh` runs `npm run fetch-content || true`, the build still succeeds. The `/releases` page silently falls back to the legacy component.

**Why it happens:**
Developers rename the schema type first (the obvious first step) and plan to migrate documents later. In Sanity, documents are not schema-bound — existing `releaseNote` documents survive in the dataset — but Studio can no longer display them.

**How to avoid:**
Execute the migration as a single atomic sequence:
1. Keep `releaseNoteType` registered as-is (do not touch it yet)
2. Add the new `release` schema type alongside it
3. Migrate existing `releaseNote` documents to `release` using the Sanity CLI or MCP mutations: `*[_type == "releaseNote"]` patched with `_type: "release"` and any new required fields populated
4. Update the GROQ query in `fetch-sanity-content.js` from `_type == "releaseNote"` to `_type == "release"`
5. Update all four registration sites in `sanity.config.ts`, `structure.ts`, and `index.ts`
6. Verify the fetch returns expected counts, then delete the old `releaseNote` schema file

**Warning signs:**
- Studio shows "Unknown document type" on any document in the Release Notes section
- `sanity-release-notes.generated.json` contains `[]` after a deploy
- The `/releases` page shows the legacy hardcoded sprint content instead of Sanity data
- `fetch-sanity-content.js` build log line reads `-> 0 releaseNote document(s)`

**Phase to address:** Phase 1 — Sanity schema migration

---

### Pitfall 2: The `|| true` flag in `build.sh` makes empty-content deploys invisible

**What goes wrong:**
`build.sh` line 19 reads `npm run fetch-content || true`. This means any non-zero exit from the fetch script is swallowed — the build continues. If a GROQ query is wrong, credentials are invalid, or a new schema type returns zero results because documents have not been migrated yet, the build succeeds and deploys an empty or stale site. The Cloudflare Pages dashboard shows a green build. No one knows the content is missing until a user visits the page.

This is especially dangerous for the hero banner: `NXGENSphereHero.tsx` line 418 currently has `Sprint 2025.12-B is live` hardcoded. If the dynamic fetch fails, the banner stays at that string indefinitely.

**Why it happens:**
The `|| true` was added to prevent build failures during Sanity outages — a legitimate production safeguard. It becomes a trap during schema migrations when empty results are a symptom of a bug, not a Sanity outage.

**How to avoid:**
- During active schema migration work: temporarily use `npm run sanity:pull:strict` (sets `SANITY_FETCH_STRICT=true`) in the build command to surface warnings as hard failures. Revert to `|| true` once migration is confirmed stable.
- Add a post-fetch validation check: after the fetch, assert that `sanity-release-notes.generated.json` is non-empty if the `release` schema type exists and has published documents. The fetch script already logs document counts — pipe these to a check.
- For the hero banner: treat the latest-release data as required. If the generated file is empty, the build step should warn loudly (log a WARN line) even if it does not abort.

**Warning signs:**
- `sanity-release-notes.generated.json` is `[]` after deploy
- `sanity-landing-pages.generated.json` is `[]` after deploy
- Cloudflare Pages build log shows `-> 0 X document(s)` for a type that should have data
- The `/releases` or `/roadmap` pages render legacy fallback content on the live site

**Phase to address:** Phase 1 — Build pipeline hardening; revisit in every phase that introduces new GROQ queries

---

### Pitfall 3: Cross-document Sanity references not dereferenced in GROQ — opaque `_ref` strings reach the frontend

**What goes wrong:**
A Sanity `reference` field stores only `{ _ref: "abc123" }` in the document. If the GROQ projection does not use the `->` dereference operator, the generated JSON passes this opaque object to the frontend. The React component receives `{ _ref: "abc123..." }` where it expects `{ title: "Sprint 2026-01-A", slug: { current: "sprint-2026-01-a" } }`. The "View Release" link on a shipped roadmap item either renders as `undefined`, `[object Object]`, or crashes with a null-access error.

This is invisible in Studio because Studio resolves references natively for editors. The bug only appears in the built site.

**Why it happens:**
Developers write the schema, test references in Studio (where they look correct), then write the GROQ query without the `->` operator, not realizing the frontend sees raw `_ref` strings.

**How to avoid:**
Always use one of two approaches — never mix them:

Option A (reference + dereference in GROQ): Store a `reference` field pointing to the `release` document. In the GROQ projection, dereference: `linkedRelease->{ title, "slug": slug.current }`. Add a null-guard in the React component for the case where the referenced document is unpublished or deleted.

Option B (slug string + optional reference): Store both a `releaseSlug` string field (used by the frontend for URL construction — always a plain string) and an optional `linkedRelease` reference field (used only for Studio navigation). The frontend reads only the slug string; the reference is irrelevant to the build output. This is more resilient because if the referenced document is deleted, the slug string still renders a link (which may 404, but is not a runtime crash).

Option B is recommended for this project given the build-time SSG pattern.

**Warning signs:**
- Roadmap page renders `[object Object]` or an empty string where the release link should appear
- Browser console errors: `Cannot read properties of null (reading 'slug')` or `Cannot read properties of undefined (reading 'current')`
- `sanity-release-notes.generated.json` contains objects with `_ref` strings rather than titles and slugs

**Phase to address:** Phase 2 — Roadmap schema design and frontend wiring

---

### Pitfall 4: Hero banner hardcoded sprint text — SSG cannot self-update without dynamic data injection

**What goes wrong:**
`NXGENSphereHero.tsx` line 418 contains `Sprint 2025.12-B is live` hardcoded in JSX. When v1.1 ships a new release, this text does not update. A developer must manually edit the file and push a commit — defeating the purpose of a CMS-managed release workflow.

The failure mode if someone wires this to `useEffect + fetch()` instead of the correct build-time pattern: the banner shows a loading state (or old text) until JavaScript hydrates the component, creating a flash of stale content. This is unnecessary and adds complexity — the Sanity webhook already triggers a full rebuild on every publish.

**Why it happens:**
Developers reach for `useEffect + fetch()` as the React way to make data dynamic, forgetting that Docusaurus pages are pre-rendered at build time and all Sanity data is already available via generated JSON files.

**How to avoid:**
Extend `fetch-sanity-content.js` to derive the latest release from `sanity-release-notes.generated.json` (already written) and write a `sanity-hero-data.generated.json` containing `{ latestRelease: { displayTitle: "...", date: "...", slug: "..." } }`. Import this file statically in `NXGENSphereHero.tsx`. The import is resolved at build time — zero client-side fetch, no hydration flash, and the data is always current because every publish triggers a rebuild.

**Warning signs:**
- `NXGENSphereHero.tsx` contains a hardcoded sprint identifier string (search for `Sprint` in the file)
- A `useEffect` + `fetch()` pattern appears in any top-level Docusaurus page component
- The "What's New" chip text flickers or shows a loading state on first paint
- The chip text differs between a fresh page load and a reload (hydration mismatch)

**Phase to address:** Phase 3 — Hero banner dynamic data

---

### Pitfall 5: `SanityLandingPageRoute` fallback silently renders legacy content for the new dedicated pages

**What goes wrong:**
`releases.tsx` and `roadmap.tsx` both use `SanityLandingPageRoute` with a legacy page as fallback. The pattern is: look for a `landingPage` document with the matching slug in Sanity; if not found, render the legacy component. For v1.1, the releases and roadmap pages are not `landingPage` documents — they are purpose-built pages reading from `sanity-release-notes.generated.json` and a new `sanity-roadmap.generated.json`. If these pages are not replaced but only extended, the `SanityLandingPageRoute` wrapper will continue to check for a non-existent `landingPage` slug and fall back to the legacy component — silently rendering old hardcoded content even after v1.1 is deployed.

**Why it happens:**
The `SanityLandingPageRoute` wrapper was the correct v1.0 migration pattern for landing pages. It is wrong for v1.1 dedicated pages. The pattern looks like it should "just work" because it did in v1.0.

**How to avoid:**
For v1.1, replace the contents of `releases.tsx` and `roadmap.tsx` entirely. Remove the `SanityLandingPageRoute` import and replace it with a direct-import component that reads the dedicated generated JSON files. Do NOT delete the legacy components in `legacy-pages/` until the new pages are confirmed live and correct — they serve as a rollback reference.

**Warning signs:**
- After v1.1 deploys, `releases.tsx` still imports `SanityLandingPageRoute`
- The live `/releases` page shows the old hardcoded sprint-2025-12-B content instead of Sanity data
- Sanity Studio has no `landingPage` document with slug `releases` but the page still renders content (from the legacy fallback)

**Phase to address:** Phase 1 — Page routing replacement (part of the schema migration phase)

---

### Pitfall 6: Portable Text body field on release items — `serializeCustomBlock` must be extended for new block types

**What goes wrong:**
`fetch-sanity-content.js` serializes Portable Text to Markdown via `serializeBody()`. Any `_type` not handled by `serializeCustomBlock()` produces an empty string and a warning counter increment. If the new `release` schema adds item-level blocks (e.g., a `screenshotGallery` array, a `videoEmbed` inline block) that are not explicitly handled in `serializeCustomBlock`, those blocks render as blank in the built Markdown. The bug is silent — no build error.

For releases rendered as a React page (not MDX), serializing to Markdown and then parsing Markdown back is an unnecessary lossy step. Rich media (video, image galleries) should be passed as raw Portable Text JSON and rendered directly with `@portabletext/react`.

**Why it happens:**
The existing pattern was designed for doc pages that become Markdown files. Release notes pages are better served as React components reading JSON directly — the Markdown intermediate format loses rich media fidelity.

**How to avoid:**
For the `release` schema type, store the full Portable Text body array in `sanity-release-notes.generated.json` (not converted to Markdown). Render it on the `/releases` page using `@portabletext/react` with custom components for each block type. The fetch script already writes a metadata-only version to the JSON for the releases list — add a `body` key with the raw Portable Text array.

If Markdown output is needed for some use case, extend `serializeCustomBlock` to handle each new block type before shipping.

**Warning signs:**
- Release note pages render blank sections where screenshots or video embeds should appear
- `fetch-sanity-content.js` build log shows warning lines for unhandled block types (look for `Serialize warning:` lines)
- The release notes JSON contains truncated body content

**Phase to address:** Phase 1 — Release schema design and fetch script extension

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep `\|\| true` in `build.sh` unconditionally | Build never aborts due to Sanity outage | Silent empty-content deploys during schema migrations | Acceptable in steady-state production; disable temporarily during migration work |
| Keep roadmap data in `src/data/roadmap.ts` (TypeScript file) instead of Sanity | No Sanity API call; git-based updates | Non-technical editors cannot update the roadmap without a developer | Never acceptable after v1.1 if the goal is editor-managed content |
| Use slug strings for release cross-links instead of Sanity references | No GROQ dereferencing complexity; resilient to document deletion | Slug drift: if a release slug changes, roadmap items silently point to 404s | Acceptable if slugs are treated as stable identifiers enforced by validation rules |
| Write full Portable Text body into the releases generated JSON | One fetch pass, simpler fetch script | Large JSON file slows build and page load if releases accumulate many images | Acceptable for up to ~30 rich releases; split per-release for larger catalogs |
| Add `useEffect + fetch()` for hero banner dynamic data | Quick to implement | Hydration flash; unnecessary on SSG; breaks without JS | Never on Docusaurus static pages |
| Store `projectedRelease` dates as human strings ("Q2 2026") instead of ISO dates | Easy for editors to author | Cannot sort or filter programmatically; dates go stale silently | Acceptable for display-only roadmap; add a machine-readable `estimatedDate` ISO field alongside |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Sanity schema → fetch script | Adding new schema fields without updating the GROQ projection in `fetch-sanity-content.js` | Every new Sanity field must be explicitly named in the GROQ projection; Sanity does not auto-include added fields |
| Sanity → Cloudflare Pages webhook | Assuming every Sanity publish triggers exactly one build, or that drafts do not trigger the webhook | Configure the Sanity webhook with a filter: `_type in ["release", "roadmapItem"] && !(_id in path("drafts.**"))` to prevent spurious rebuilds on draft saves |
| `sanity-release-notes.generated.json` → React import | Assuming the file always exists on a fresh clone | The file is created by `fetch-sanity-content.js`. On a fresh clone before the script runs, the import fails at build time. Commit a `[]` fallback file to git |
| Mux video in release items | Uploading video to generic Sanity asset pipeline using `enhancedVideoType` | `sanity-plugin-mux-input` is already installed in `studio/sanity.config.ts`. Use the Mux block type for streaming video — it handles playback, thumbnails, and CDN delivery natively |
| `docusaurus-search-local` + roadmap filter | Assuming the plugin's search index covers dynamically filtered roadmap items | `docusaurus-search-local` indexes static Docusaurus pages, not React component state. The roadmap search/filter must be a separate in-component `useState` + `useMemo` implementation (as the existing `legacy-pages/roadmap.tsx` already does correctly) — do not try to integrate with the docs search plugin |
| Sanity structure.ts + new types | Adding new schema types to `schemaTypes/index.ts` without adding them to `structure.ts` | New types appear in the auto-generated fallback list at the bottom of the Studio sidebar. Add explicit list items in `structure.ts` for `release` and `roadmapItem` so they appear in the correct grouped position |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| All roadmap items animating with `initial/animate` stagger simultaneously | Page jank or dropped frames on first render | Use `whileInView` + `viewport={{ once: true }}` for below-the-fold cards (the backlog section in legacy roadmap already does this correctly); do not stagger more than 20 items | Beyond ~50 items all animating on mount |
| Embedding full Portable Text body in `sanity-release-notes.generated.json` | JSON file grows to 1MB+; slower Docusaurus build; slower page load | Separate the metadata (for the releases list) from the full body (for the detail view). For a single-page releases view, use lazy accordion expansion so only visible content is parsed | When release body includes many images/embeds; at ~25+ rich releases |
| Client-side text search across all roadmap items on every keystroke without `useMemo` | Input lag as the roadmap grows | Use `useMemo` for the filtered array (the legacy implementation does this correctly). When a status filter is active, apply it before the text search — short-circuit on the smaller array | Beyond ~200 items with complex compound filters |
| Importing all of `sanity-landing-pages.generated.json` in a component that only needs one page | Entire landing pages dataset included in every component bundle that imports it | The file is only imported in `SanityLandingPageRoute.tsx`, which is route-level — acceptable. If new components import it for other reasons, extract a per-slug file at build time instead | At 50+ landing pages with large section arrays |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using a Sanity `editor` or `administrator` token in the Cloudflare Pages build environment | Write-capable token exposed in build logs or misconfigured CF Pages settings | Use a read-only `viewer` token for `SANITY_API_TOKEN` in the Cloudflare Pages environment variables. The fetch script only reads — it never needs write access |
| Exposing internal sprint identifiers, assignee names, or Zoho item IDs in the public roadmap JSON | Internal workflow data visible in page source and network requests | The current `roadmap.ts` data contains `assignees` and internal Zoho ID formats (e.g., `"TW-I13"`). Strip these from the Sanity roadmap schema or exclude them from the GROQ projection before they appear in the generated JSON |
| `rawHtml` Portable Text block type in release notes rendered via `dangerouslySetInnerHTML` | XSS if an editor pastes malicious HTML into a rawHtml block | `portableText-ultimate.ts` defines a `rawHtml` block type. Audit whether this type is included in the new `release` and `roadmapItem` schemas. If not needed, exclude it. If included, sanitize the HTML output at render time using `sanitize-html` (not `dompurify` — SSG context has no DOM) |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Roadmap shows "Projected Release: Q2 2026" on items that did not ship by Q2 | Customers lose trust; the roadmap feels abandoned or dishonest | Add a `lastReviewedAt` date field. Display "Estimated Q2 2026 — last reviewed March 2026" so customers can see the estimate is actively maintained, not forgotten |
| Status values copied from Zoho Sprints internal labels ("To do", "In Staging", "In Progress") | Customers see internal workflow jargon | Map Zoho statuses to public-facing labels in the Sanity schema: "To do" → "Planned", "In Staging" → "In Progress", "Done" → "Shipped". The Sanity schema stores the public label; Zoho sync is out of scope |
| Shipped roadmap item has no link to the release note where the feature was documented | Customers cannot find where a shipped feature was documented | Add a Sanity validation rule: when `status == "Shipped"`, the `releaseSlug` field is required. Editors cannot publish a shipped item without linking it |
| Hero banner "What's New" chip shows internal sprint identifier ("Sprint 2025.12-B") to external customers | Customers do not understand internal sprint naming conventions | The `release` schema needs a `displayTitle` field (e.g., "December 2025 Release") distinct from the internal `sprintId` field. The hero uses `displayTitle`; the internal sprint ID is editor-facing only |
| Releases page shows only the most recent sprint with no way to browse older releases | Customers cannot audit what changed 3 months ago | Default view: last 3–4 releases expanded; older releases collapsed with a "Show earlier releases" disclosure. Do not paginate — a single-page accordion is simpler and works without routing complexity |

---

## "Looks Done But Isn't" Checklist

- [ ] **Schema migration complete:** Verify `*[_type == "releaseNote"] | count` in GROQ Vision returns 0 before removing the `releaseNoteType` schema file.
- [ ] **Hero banner dynamic:** Search for hardcoded sprint text: `grep -n "Sprint" classic/src/components/NXGENSphereHero.tsx`. The file should contain no hardcoded sprint identifiers after v1.1.
- [ ] **Fetch script GROQ updated:** Verify `fetch-sanity-content.js` queries `_type == "release"` not `_type == "releaseNote"` after migration.
- [ ] **All four registration sites updated in Studio:** `schemaTypes/index.ts`, `sanity.config.ts` (initial value template, document actions, two dashboard widget `types` arrays), `structure.ts` (sidebar entry and Published filter entry) — all reference the new type name.
- [ ] **Roadmap cross-links resolve:** Open any shipped roadmap item on the live site. Confirm the "View Release" link resolves to a real `/releases/[slug]` URL — not `undefined`, `#`, or `[object Object]`.
- [ ] **Fallback JSON files in git:** `git ls-files classic/src/data/sanity-roadmap.generated.json` returns the file. It exists as an empty array so fresh clones build without running the fetch script first.
- [ ] **Webhook filter scoped:** The Cloudflare Pages deploy hook in Sanity only fires on published documents of the new types — not on draft saves of all document types.
- [ ] **Legacy page components not deleted:** `classic/src/legacy-pages/releases.tsx` and `classic/src/legacy-pages/roadmap.tsx` still exist as rollback references. They are no longer imported as active fallbacks by the new page components, but they exist in the repo.
- [ ] **`SanityLandingPageRoute` removed from releases and roadmap:** `releases.tsx` and `roadmap.tsx` do not import `SanityLandingPageRoute`. Both are now standalone components importing from dedicated generated JSON files.
- [ ] **Rich media renders in release notes:** Open a release note that contains an image array and/or a video embed in the built site. Both render correctly — not as blank sections.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Schema type deleted while documents still exist | MEDIUM | Re-add the old type as a stub (just `name` and `type: "document"` and a title field). Studio can open documents again. Export via `sanity dataset export`. Re-migrate to the new type. |
| Deployed with empty `sanity-release-notes.generated.json` | LOW | Restore from `.sanity-backups/` (the fetch script maintains up to 10 timestamped backups). Run `npm run sanity:pull` locally, commit the regenerated file, push to trigger a new build. |
| Hero banner stuck on old sprint text after v1.1 | LOW | Update the release `displayTitle` field in Studio and re-publish — the webhook triggers a rebuild and the banner updates automatically (if the dynamic pattern was implemented correctly). |
| Roadmap cross-links broken (null reference) | LOW | In Studio: open the affected roadmap item, set the `releaseSlug` string field. Re-publish. The link resolves after the next webhook-triggered build. |
| `SanityLandingPageRoute` fallback rendering legacy content | LOW | Confirm: (a) Does a `landingPage` document with slug `"releases"` exist in Sanity? Delete it if it was a v1.0 placeholder. (b) Has `releases.tsx` been updated to remove the `SanityLandingPageRoute` wrapper? Deploy after fix. |
| Build fails after schema rename — GROQ query mismatch | LOW | Revert the GROQ query in `fetch-sanity-content.js` to use the old type name. Fix the schema rename and query update together as one atomic change. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Schema type rename breaks documents and queries | Phase 1: Schema migration | GROQ Vision: `*[_type == "releaseNote"] \| count` returns 0; fetch log shows expected non-zero count for `release` type |
| Silent empty-content deploy from `\|\| true` | Phase 1: Build pipeline hardening | Run `npm run sanity:pull:strict` — zero warnings. Generated JSON files are non-empty. |
| Cross-references not dereferenced in GROQ | Phase 2: Roadmap schema + frontend wiring | Shipped roadmap items on `/roadmap` show a valid href linking to `/releases/[slug]` |
| Hero banner hardcoded text | Phase 3: Hero banner dynamic data | `grep -n "Sprint" src/components/NXGENSphereHero.tsx` returns no hardcoded sprint strings |
| `SanityLandingPageRoute` wrapping dedicated pages | Phase 1: Page routing replacement | `releases.tsx` and `roadmap.tsx` do not import `SanityLandingPageRoute` |
| Portable Text body not extended for rich media | Phase 1: Release schema + fetch script | Release notes with images and video embeds render correctly in the built site |
| Internal labels in public roadmap | Phase 2: Roadmap schema design | All `status` values in Sanity are public-facing labels ("Planned", "In Progress", "Shipped") — no Zoho internal labels |
| Stale projected-release dates | Phase 2: Roadmap schema design | Schema includes `lastReviewedAt` date field; roadmap page renders it alongside the estimate |
| Fallback JSON files missing from git | Phase 1: Schema migration | `git ls-files classic/src/data/sanity-roadmap.generated.json` confirms the file is tracked |
| Webhook firing on draft saves | Phase 1: Build pipeline hardening | Cloudflare Pages build history shows builds triggered only on publish events, not on draft saves |

---

## Sources

- Direct codebase inspection: `studio/schemaTypes/releaseNote.ts` — current schema structure and field names
- Direct codebase inspection: `studio/schemaTypes/index.ts` — all type registrations
- Direct codebase inspection: `studio/sanity.config.ts` — all four places where `releaseNote` is referenced (initial value template line 60, document actions line 170, dashboard widget lines 130 and 145)
- Direct codebase inspection: `studio/src/structure.ts` — two list items referencing `releaseNote` (sidebar entry and Published filter)
- Direct codebase inspection: `classic/scripts/fetch-sanity-content.js` — full implementation including GROQ queries (line 72), `|| true` fallback, backup system, and `serializeCustomBlock` handlers
- Direct codebase inspection: `classic/src/components/NXGENSphereHero.tsx` line 418 — hardcoded sprint string
- Direct codebase inspection: `classic/src/pages/releases.tsx` and `classic/src/pages/roadmap.tsx` — current `SanityLandingPageRoute` wrapper pattern
- Direct codebase inspection: `classic/src/legacy-pages/roadmap.tsx` — existing filter/search implementation using `useState` + `useMemo` (correct pattern)
- Direct codebase inspection: `classic/src/data/roadmap.ts` — internal Zoho status labels and assignee data in the current hardcoded roadmap
- Direct codebase inspection: `build.sh` line 19 — `|| true` flag on fetch-content step
- Direct codebase inspection: `classic/package.json` — `sanity-plugin-mux-input` already a dependency in studio; `@portabletext/react` not yet a dependency in classic (would be needed for direct Portable Text rendering)
- Project documentation: `.planning/PROJECT.md`

---
*Pitfalls research for: Docusaurus SSG + Sanity CMS — Releases & Public Roadmap (v1.1)*
*Researched: 2026-03-13*
