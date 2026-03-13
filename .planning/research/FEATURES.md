# Feature Research

**Domain:** Public release notes pages and product roadmaps for a B2B SaaS documentation site
**Researched:** 2026-03-13
**Confidence:** HIGH (codebase inspection of existing legacy pages + Sanity schema files; MEDIUM for external benchmarks from training data, noted inline)

---

## Context

This research covers v1.1 of the NXGEN GCXONE docs site. The foundation is already built:
- Docusaurus + Sanity CMS integration is live
- A legacy `/releases` page exists (hardcoded `releases.tsx`, card-list of sprints with highlights)
- A legacy `/roadmap` page exists (full-featured: search, year/quarter/status/category filters, expand all, stats cards, product backlog section)
- A `releaseNote` Sanity schema exists with: title, slug, version, sprintId, publishedAt, changeType array, affectedAreas array, status workflow
- A `landingSectionReleases` Sanity object type exists for embedding release lists in landing pages

The gap: both pages are driven by hardcoded TypeScript data, not Sanity. The roadmap lacks a "Shipped" → release note link. The releases list has no per-item media support (screenshots, video). Neither fetches from Sanity at build time.

---

## Feature Landscape

### Table Stakes — Release Notes Page

Features users expect from a public release notes page. Missing these = page feels like an afterthought.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Reverse-chronological list of releases | Users check "what's new" — newest first is the universal convention | LOW | Already exists in legacy page as cards. Move to Sanity-driven list. |
| Release date per entry | Customers need to know if a release is current or months old | LOW | `publishedAt` field exists in `releaseNote` schema. Render prominently. |
| Sprint/version identifier in heading | GCXONE uses sprint IDs (e.g. "Sprint 2025.12-B") — customers reference these when filing support tickets | LOW | `sprintId` field exists. Should appear in H1/H2 of each entry. |
| Summary paragraph for each release | One-sentence "what is this sprint about" gives scanners enough to decide whether to read further | LOW | Currently `description` on the legacy `Release` type. Add to `releaseNote` schema. |
| Bullet list of changes per release | The actual content — what changed, what was fixed | LOW | Covered by the rich-text `body` field (Portable Text). Already in schema. |
| Change-type labels (New, Fix, Improvement) | Users filter mentally — "show me only the bugs that got fixed" | LOW | `changeType` array exists in schema with correct values. Surface as pills/badges on the index list. |
| Stable permalink per release entry | Customers link to release notes from support tickets and Slack | LOW | `slug` field exists. Each sprint entry gets `/releases/[slug]`. Already wired in legacy pages. |
| "Latest release" indicator on index page | Users who visit the page infrequently need to immediately spot what's new | LOW | Show a "Latest" badge on the first item. Hero banner already planned to show latest release title + date. |
| Clear "no more releases" / empty state | If no releases are published yet, the page must not show a broken empty layout | LOW | Guard with a conditional in the Docusaurus component. Not complex; often forgotten. |
| Page title and meta description | SEO and browser tab legibility | LOW | Docusaurus `<Layout title="...">` handles this. Feed from Sanity page metadata. |

### Table Stakes — Release Entry (Detail Page / Expanded View)

Features that make an individual release entry readable and useful.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Item-level grouping within a sprint | A bi-weekly sprint has 5-15 individual changes. Flat prose is unreadable. | LOW | The existing `releaseNote` schema has a flat `body` (Portable Text). Recommend switching to an **items array** pattern: one sprint doc, N items inside it, each item has title + body + optional media. |
| Screenshot support per item | Feature changes without visuals are harder to understand. Every major UI change should have a before/after or demo screenshot. | MEDIUM | Cloudinary is already the image CDN. Sanity Portable Text image blocks render via Cloudinary URL. The `enhancedMedia` schema type already exists in the codebase. |
| Video support per item | Some changes (new workflows, complex UX) are better explained with a short walkthrough video than screenshots | MEDIUM | `landingSectionVideo` section type already supports Mux, YouTube/Vimeo embed, and file upload. Adapt the same pattern for release items. **Do not build a custom video player** — embed YouTube/Vimeo iframe or use the Mux component already wired. |
| Affected areas tags | Operations teams need to know: "did this release touch alarm management or devices?" — so they can decide whether to read | LOW | `affectedAreas` array exists in schema. Surface as tags next to each item title. |
| Link to relevant documentation | After reading a release note about a new feature, users want to go straight to the how-to doc | MEDIUM | Sanity reference field to `doc` document type. Render as "Read docs" link per item. Complexity is in the schema design: add an optional `docsRef` reference field to each item. |
| Breadcrumb navigation | Users arrive at a sprint detail page directly from search or a link — they need to know where they are | LOW | Already implemented via `PageHeader` component with breadcrumbs. Carry forward. |
| "Back to all releases" link | Users read one sprint, then want to browse others | LOW | Simple `<Link to="/releases">` in the header. Trivial. |

### Table Stakes — Roadmap Page

Features users expect on a public product roadmap. Missing these = roadmap feels unpublishable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Status filter | Users want to see "what is In Progress" or "what is Planned" — browsing all statuses is noise | LOW | Already implemented in legacy page. Must carry forward in Sanity-driven version. Three statuses: Planned / In Progress / Shipped. |
| Text search | Users look for a specific feature by name (e.g., "PTZ control" or "reporting") | LOW | Already implemented in legacy page. Search hits title, description, businessValue, tags. Carry forward. |
| Per-item status badge | Status must be scannable in the list without expanding | LOW | Already implemented via colored pill badges. Carry forward. |
| Item title and one-line description | Enough information to judge relevance without expanding | LOW | `title` and `description` fields in roadmap item data type. Already present in legacy roadmap. |
| "Shipped" items visible with release link | Customers need to verify that shipped items actually appear in a release note — trust signal | MEDIUM | This is the key new feature. Shipped items need a `releaseNote` reference field that renders as "View in Sprint X Release Notes →". Currently missing from the legacy data structure. |
| Empty state when filters match nothing | "No items match" message with a "Clear filters" affordance | LOW | Already implemented in legacy page. Carry forward. |
| Results count | "Showing 12 of 47 features" — scanability signal | LOW | Already implemented. Carry forward. |
| "Last updated" timestamp on page | Roadmap credibility requires freshness signal. Stale roadmaps lose trust. | LOW | Pull `_updatedAt` from Sanity at build time. Render in page footer. |

### Table Stakes — Roadmap Item (Expanded)

Fields that make an individual roadmap item credible and useful when expanded.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Business value statement | GCXONE's customer base are security operations teams. They need to understand ROI before going to management to justify configuration changes. | LOW | `businessValue` field already exists in legacy `RoadmapFeature` type. Carry forward in Sanity schema. |
| Change type classification | "Is this a new capability, a UX fix, or a bugfix?" — answers different stakeholder questions | LOW | Already in `releaseNote` schema as `changeType`. Add equivalent field to `roadmapItem` schema. |
| UI change flag | Security platform admins who manage multiple operator workstations need advance warning of UI changes before a sprint lands | LOW | Boolean `isUiChange` field. Already referenced in PROJECT.md. |
| Entities impacted field | "Which part of the system does this touch?" — alarm management, devices, reporting, etc. | LOW | `affectedAreas` equivalent for roadmap items. Already referenced in PROJECT.md. |
| Projected release field | Customers plan around upcoming features. Even "Q2 2026" is better than nothing. | LOW | `projectedRelease` field already in legacy `RoadmapFeature`. Carry forward. Not a hard commitment — add disclaimer text in page footer. |

---

## Differentiators (Competitive Advantage)

Features that go beyond what users expect. Not required to ship, but they materially improve the experience.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Hero banner shows latest release dynamically | Homepage visitors see at a glance that the product is actively maintained. The current hero has "quick-link pills" — adding a "Latest: Sprint 2026.02-A" pill costs almost nothing but signals velocity. | LOW | PROJECT.md explicitly lists this. Fetch the most recent published `releaseNote` document at build time. Render as a hero badge. Only adds one Sanity GROQ call to the build. |
| "Shipped" roadmap item links to specific release note | Closes the loop between roadmap promise and release delivery — customers can verify what was promised is actually in the release note. Linear does this. Notion does this. This is the single most-requested feature from B2B SaaS customers on public roadmaps. | MEDIUM | Requires: (1) `releaseNote` reference field on `roadmapItem` Sanity schema, (2) conditional "View release →" link in the card expand section. The complexity is data modeling — the rendering is trivial. |
| Change-type color coding on release index | Visual scanning: a green "New Feature" badge, orange "Improvement", red "Bug Fix" lets users scan 10 sprint cards in 5 seconds to find bug fix releases. | LOW | `changeType` values already enumerated in the `releaseNote` schema. Map values to colors in the component. |
| Item-level media (screenshots + video) per release entry | Release notes without visuals are abstract. A 30-second screen recording of a new workflow is worth 10 bullet points. Vercel, Linear, and Intercom all use media-rich release notes as a differentiator vs. basic changelogs. | MEDIUM | Architecture: each item in the sprint items array gets an optional `media` field supporting image (Cloudinary URL from Sanity) or video embed (YouTube/Vimeo URL or Mux). The `enhancedMedia` schema type and `landingSectionVideo` section type both exist — adapt them rather than building new. |
| Affected areas filter on releases index | Advanced filter: "Show me only releases that touched Devices" — valuable for admins who own specific platform areas | LOW | `affectedAreas` already in schema as a multi-select array. Add a filter chip group to the index. Complexity is LOW because the filter logic is already written in the legacy roadmap component — copy the pattern. |
| Roadmap "In Progress" count in hero stats | A stat card showing "3 features in active development" signals momentum and publication cadence. Already in the legacy roadmap as stat cards. | LOW | Already implemented. Carry forward as Sanity-driven stats computed from item counts. |
| Expand All / Collapse All on roadmap | Power users read everything. This toggle is in the legacy page. Carry forward. | LOW | Already implemented. Keep. |
| "About This Roadmap" disclaimer | Public roadmaps without a "plans may change" note create customer expectation risk. The legacy page already has this. | LOW | Already implemented. Keep. Carry forward as Sanity-editable text field. |
| RSS feed for releases | Power users and enterprise customers want to subscribe to release updates without visiting the site | HIGH | Requires a static XML generation step post-build. Significant new code. **Defer to v1.2** — not in scope for v1.1 which is already well-scoped. |

---

## Anti-Features (Commonly Requested, Often Problematic)

Features that seem valuable but create significant problems for this specific project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Voting / upvoting on roadmap items | Users want to influence the roadmap | Requires authentication, server infrastructure, database — all out of scope for a static Docusaurus + Cloudflare Pages site | Direct customers to support channels via a "Have feedback?" link on the roadmap page |
| Email subscription to release notes | Users want to be notified of new releases | Requires a mailing list service, double opt-in flow, unsubscribe handling — significant operational overhead for a small team | Link to existing support/communication channels; RSS feed in v1.2 |
| Comments on release note entries | Users want to ask questions about what shipped | Same problem as voting — authentication + storage. The feedback widget is already the channel for general feedback | Route to support channels |
| Public roadmap editing / community submissions | Crowdsourced product backlog | Completely out of scope; Sanity Studio is the single source of truth for content | Internal Sanity Studio workflow only |
| Kanban / board view of roadmap | Trello-style drag-and-drop view | High implementation complexity for negligible value on a public-facing static page. The audience (customers) needs to read, not manage, the roadmap. | Keep the list + filter view. It's already well-designed in the legacy page. |
| Real-time roadmap updates (websockets) | "See it update live" | Static site — Cloudflare Pages. No real-time capability without a serverless function and client polling. Bi-weekly builds are the update cadence. | Webhook-triggered Cloudflare Pages rebuild on Sanity publish (already built in v1.0) |
| Private "internal-only" view of roadmap | Show different content to different audiences | Already removed from v1.1 scope in PROJECT.md. Requires authentication. The `/internal-releases` path exists but should be archived. | Keep roadmap fully public. Internal details stay in Sanity drafts (unpublished). |
| Zoho Sprints integration / sync | Automatically sync backlog items from Zoho Sprints to the public roadmap | Explicit out-of-scope decision in PROJECT.md. Zoho API complexity is high, sync is fragile, and it creates a dependency on a third-party project management system. | Sanity Studio is the editorial surface. Editors manually update roadmap items when sprint status changes. |
| Version comparison / diff view | "What changed between v3.11 and v3.12?" | High implementation complexity. GCXONE uses sprint IDs not semver — version comparison has no clear semantic meaning here. | Each sprint has its own release note page — side-by-side browsing is how users compare |
| Inline editing on public site | Edit roadmap items directly from the public page | TinaCMS attempted this pattern and was removed in v1.0 for exactly this reason. Creates a security surface. | Edit in Sanity Studio only. |
| Changelog RSS with full content | Full content in RSS feed | RSS parsers struggle with rich Portable Text content (images, videos). Full-content RSS has significant scope for rendering failures. | Summary-only RSS in v1.2 (titles + dates + links) |
| Auto-generated release notes from git commits | Pull commit messages into release notes | Commit messages are internal developer notes, not customer-facing language. Auto-generated changelogs are universally low quality. | Editor writes release note copy in Sanity Studio from a human perspective |

---

## Feature Dependencies

```
[Sanity `releaseNote` schema with items array]
    └──required by──> [Release entry detail page with per-item media]
                          └──required by──> [Screenshot/video per release item]
                          └──required by──> [Docs reference link per release item]

[Sanity `roadmapItem` schema]
    └──required by──> [Roadmap page (Sanity-driven)]
        └──requires──> [`releaseNote` reference field on roadmapItem]
                           └──enables──> [Shipped status → release note link]

[Sanity GROQ query for latest `releaseNote`]
    └──required by──> [Hero banner "latest release" badge]
    └──required by──> [Releases index page (build-time data)]

[Releases index page]
    └──required by──> ["Back to all releases" link on detail pages]
    └──requires──> [Reverse-chronological GROQ query]

[`releaseNote.releaseNoteRef` field on `roadmapItem`]
    └──enables──> [Shipped item → release note cross-link]
    └──requires──> [`releaseNote` documents to exist first (content dependency)]

[Change-type badges on release index]
    └──requires──> [`changeType` field populated by editors in Studio]
    └──enables──> [Change-type filter on releases index (future)]

[Affected-areas tags on release items]
    └──requires──> [`affectedAreas` field populated in Studio]
    └──enables──> [Affected-areas filter on releases index (differentiator)]
```

### Dependency Notes

- **`roadmapItem.releaseNoteRef` requires `releaseNote` documents:** Editors cannot link shipped roadmap items to release notes until release notes exist. Release notes page and schema must ship first (or same phase) as the roadmap.
- **Hero banner latest release requires `releaseNote` schema with `publishedAt`:** The GROQ query `*[_type == "releaseNote"] | order(publishedAt desc)[0]` requires at least one published `releaseNote` document. Guard with a null check.
- **Item-level media enhances the body field but does not replace it:** A release item always has a title + text body. Media is additive. Design the schema so media is optional — never required.
- **Shipped roadmap link does not conflict with any other feature:** It is purely additive — a conditional `<Link>` that renders only when `releaseNoteRef` is populated.

---

## MVP Definition

### Launch With (v1.1 — this milestone)

Minimum needed to replace the legacy hardcoded pages with live Sanity-driven equivalents.

- [ ] **Sanity `release` schema (one doc per sprint, items array)** — replaces the current flat `releaseNote` schema; each sprint is one document with N items inside it; each item has title, body (Portable Text), optional screenshot, optional video embed URL, change-type tag, affected-areas tags, optional `docsRef` reference
- [ ] **Public `/releases` index page (Sanity-driven)** — reverse-chronological list of published sprint releases; shows title, date, sprint ID, change-type badges, summary; replaces hardcoded `releases.tsx` data
- [ ] **Individual sprint release page `/releases/[slug]`** — full release entry with all items, screenshots, and videos; replaces legacy `/releases/sprint-2025-12-b` pattern
- [ ] **Sanity `roadmapItem` schema** — title, description, businessValue, status (Planned/In Progress/Shipped), changeType, isUiChange, affectedAreas, projectedRelease, optional `releaseNoteRef` reference
- [ ] **Public `/roadmap` page (Sanity-driven)** — search + status filter + results count; replaces hardcoded legacy roadmap page; Shipped items show "View in [sprint]" link when `releaseNoteRef` is populated
- [ ] **Hero banner latest release badge** — one GROQ call fetching `*[_type == "release"] | order(publishedAt desc)[0]`; renders sprint title + date as a hero pill/badge; PROJECT.md requirement
- [ ] **Legacy `/releases` and `/internal-releases/` archived** — old hardcoded pages replaced; legacy slug routes preserved via Docusaurus redirect config to avoid 404s

### Add After Validation (v1.1 post-ship)

Features to add once the core Sanity-driven pages are live and editors have entered real content.

- [ ] **Affected-areas filter on releases index** — add multi-select chip group filter; trigger: editors have populated `affectedAreas` on 5+ release entries and find the filter useful
- [ ] **Docs reference link per release item** — add `docsRef` reference field to release item schema; trigger: editors request the ability to link release items to docs pages
- [ ] **Change-type filter on roadmap** — extend roadmap filter bar with change-type chip group; trigger: roadmap has 20+ items with consistent `changeType` tagging

### Future Consideration (v1.2+)

Features to defer until v1.1 is proven stable and content is established.

- [ ] **RSS feed for releases** — static XML generation at build time; defer because it requires a new build plugin and has no equivalent in the current codebase
- [ ] **Year/quarter filter on releases index** — only useful once 2+ years of releases exist (currently 2 sprints from late 2025 exist)
- [ ] **Video playback via Mux** — Mux is wired in `landingSectionVideo` but has streaming costs; YouTube/Vimeo embed is sufficient for v1.1; revisit if video quality or control matters
- [ ] **Search within release notes** — docusaurus-search-local already indexes all static pages including release detail pages; no additional work needed unless a dedicated "search only releases" UX is requested

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Sanity-driven releases index | HIGH | MEDIUM | P1 |
| Sanity-driven roadmap page | HIGH | MEDIUM | P1 |
| Hero banner latest release badge | MEDIUM | LOW | P1 |
| Shipped roadmap → release note link | HIGH | LOW | P1 |
| Per-item screenshots in release entries | HIGH | MEDIUM | P1 |
| Per-item video embed in release entries | MEDIUM | LOW | P1 |
| Change-type badges on releases | MEDIUM | LOW | P1 |
| Status filter on roadmap | HIGH | LOW | P1 |
| Business value field on roadmap items | MEDIUM | LOW | P1 |
| Affected-areas tags on release items | MEDIUM | LOW | P1 |
| Affected-areas filter on releases index | LOW | LOW | P2 |
| Docs reference link per release item | MEDIUM | LOW | P2 |
| Change-type filter on roadmap | LOW | LOW | P2 |
| RSS feed for releases | LOW | HIGH | P3 |
| Voting / upvoting on roadmap | LOW | HIGH | P3 (anti-feature) |
| Email subscription to releases | LOW | HIGH | P3 (anti-feature) |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have; add when P1 is stable
- P3: Nice to have or actively avoided (anti-feature)

---

## Competitor Feature Analysis

Analyzed from training data (cutoff August 2025) — MEDIUM confidence; verify against live pages if specific feature parity is required.

| Feature | Linear (linear.app/changelog) | Vercel (vercel.com/changelog) | Intercom (intercom.com/changelog) | Our Approach |
|---------|-------------------------------|-------------------------------|-----------------------------------|--------------|
| Release grouping | Date-based (no sprint concept) | Date-based, one major item per entry | Date-based, categorized by product area | Sprint-ID-based (matches GCXONE's bi-weekly cadence) |
| Media per item | Screenshots inline | Screenshots + short video | Screenshots, occasional GIF | Screenshots (Cloudinary) + video embed (YouTube/Vimeo or Mux) |
| Change types | Category tags (New, Improved, Fixed) | Implicit in title/description | Tags (Features, Performance, Platform) | Explicit `changeType` array: feature, fix, improvement, breaking, security, deprecation |
| Per-entry permalink | Yes (`/changelog/[slug]`) | Yes (`/changelog/[slug]`) | Yes, but no detail page — all on index | Yes, `/releases/[sprintSlug]` |
| Roadmap | Linear has internal project management, no public roadmap | No public roadmap | No public roadmap (uses Canny) | Public roadmap at `/roadmap` with search + status filter |
| Shipped → release link | Linear shows "Released in" on issues | N/A | N/A (Canny has this) | `releaseNoteRef` field on roadmap items |
| Email subscribe | No (RSS available) | No | No | Not in v1.1 (out of scope) |
| Voting / upvoting | No (Linear has internal voting) | No | Canny has upvoting | Deliberate anti-feature — not building |
| Search on changelog | No | No | No | Not building dedicated release search; docusaurus-search-local indexes release pages |
| Filter by category | No | No | Yes (product area tabs) | Affected-areas filter (P2) |

### Key Insight from Competitor Analysis

The highest-value differentiator in the competitive set is **the Shipped roadmap → release note link**. Linear has this internally (issue shows which release cycle it landed in), but none of the B2B SaaS examples above do it on a public roadmap page. Notion, Canny, and Linear apps offer it in product management tools, but not on marketing-facing /roadmap pages. Building this feature well — clicking a "Shipped" item and being taken directly to the sprint release note that describes the change — is the single most trust-building feature for a public roadmap.

---

## What "Good" Looks Like for This Product

Drawing on the above analysis, here is the specific character of each page for GCXONE v1.1:

### /releases (index)

A reverse-chronological list of sprint cards. Each card shows:
- Sprint ID + date (e.g., "Sprint 2026.02-A · February 1, 2026")
- Summary paragraph (1-2 sentences)
- 3-5 bullet highlights (the most important changes)
- Change-type badges (colored pills: New Feature, Bug Fix, Improvement)
- "View full release notes →" link to `/releases/[slug]`

The hero shows a dynamic badge: "Latest: Sprint 2026.02-A" (Sanity-driven).

### /releases/[slug] (sprint detail page)

The full sprint entry. Structured as a sequence of items, each with:
- Item title (the change name)
- Short description paragraph
- Change-type tag (badge)
- Affected-areas tags
- Optional: one or more screenshots (Cloudinary-hosted, embedded inline)
- Optional: one video embed (YouTube/Vimeo iframe)
- Optional: "Read the docs →" link to the relevant documentation page

Items are grouped loosely but not by category — a sprint is a sprint, not a feature tree.

### /roadmap

A filterable, searchable list of roadmap items. Three statuses with distinct visual treatment:
- **Planned** (gray) — "On our list; not started"
- **In Progress** (blue) — "Actively being built this quarter"
- **Shipped** (green) — "Done. Click to see the release note."

Each item card expands to show:
- Business value statement
- Change type
- UI change flag (warning badge: "Includes UI changes")
- Affected areas tags
- Projected release (e.g., "Q2 2026") — with footer disclaimer that dates may change
- For Shipped items: "Released in Sprint 2026.02-A →" link

The page footer includes: "This roadmap reflects our current plans. Dates and features are subject to change. Last updated: [date from Sanity]."

---

## Sources

- Direct codebase inspection: `classic/src/legacy-pages/roadmap.tsx` — confirmed existing features (search, filters, expand all, stats, product backlog section)
- Direct codebase inspection: `classic/src/legacy-pages/releases.tsx` — confirmed existing release card structure
- Direct codebase inspection: `classic/src/data/roadmap.ts` — confirmed existing data model (RoadmapFeature, RoadmapItem, RoadmapEpic types and field names)
- Direct codebase inspection: `studio/schemaTypes/releaseNote.ts` — confirmed existing Sanity schema (fields: title, slug, version, sprintId, publishedAt, changeType array, affectedAreas array, status)
- Direct codebase inspection: `studio/schemaTypes/landingPage.ts` — confirmed existing section types including `landingSectionVideo` (Mux/YouTube/file) and `landingSectionReleases`
- Direct inspection: `.planning/PROJECT.md` — confirmed v1.1 target features: roadmap status filter + search, roadmapItem fields, Shipped → release link, hero banner, legacy page archival
- Benchmark analysis (MEDIUM confidence, training data as of August 2025): Linear changelog, Vercel changelog, Intercom changelog, Canny.io public roadmaps, Notion changelog — common patterns and differentiators
- Domain knowledge (HIGH confidence): B2B SaaS documentation site conventions, static site release notes patterns, Sanity reference field capabilities

---

*Feature research for: NXGEN GCXONE docs — v1.1 Releases & Roadmap milestone*
*Researched: 2026-03-13*
