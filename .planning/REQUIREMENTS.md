# Requirements: NXGEN GCXONE Documentation Platform — v1.1

**Defined:** 2026-03-13
**Core Value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.

## v1.1 Requirements

Requirements for the Releases & Roadmap milestone.

### Schema

- [x] **SCHEMA-01**: Editor can create a sprint release in Sanity Studio as one document with an array of items inside it
- [x] **SCHEMA-02**: Each release item has: title, body (rich text), change type tag, affected areas tags, optional screenshots, optional video embed URL, optional link to a docs page
- [x] **SCHEMA-03**: Editor can create a roadmap item in Sanity Studio with: title, description, status (Planned / In Progress / Shipped), business value, change type, UI change flag, entities impacted, projected release date
- [x] **SCHEMA-04**: A Shipped roadmap item can reference the specific sprint release it landed in

### Releases

- [x] **REL-01**: User can view a reverse-chronological list of all published sprint releases at /releases
- [x] **REL-02**: Each release card on the index shows: sprint ID, publish date, summary, and change-type badges
- [x] **REL-03**: The most recent release is marked with a "Latest" badge on the index page
- [x] **REL-04**: User can click a release card to view the full sprint detail page at /releases/[slug]
- [x] **REL-05**: Each item on a sprint detail page displays its title, body, and change-type tag
- [x] **REL-06**: Each release item can display one or more screenshots inline
- [x] **REL-07**: Each release item can display a video embed (YouTube/Vimeo)
- [x] **REL-08**: Each release item can display affected-areas tags
- [x] **REL-09**: Each release item can optionally link to a related documentation page ("Read the docs →")

### Roadmap

- [x] **ROAD-01**: User can view all roadmap items at /roadmap (Sanity-driven, replaces legacy hardcoded page)
- [x] **ROAD-02**: User can filter roadmap items by status (Planned / In Progress / Shipped)
- [x] **ROAD-03**: User can search roadmap items by keyword (searches title and description)
- [x] **ROAD-04**: User can expand a roadmap item to see: business value, change type, UI change flag, entities impacted, and projected release
- [x] **ROAD-05**: A Shipped roadmap item shows a "Released in [Sprint X] →" link to the corresponding release detail page
- [x] **ROAD-06**: The roadmap page shows a results count and a "no results" empty state when filters match nothing
- [x] **ROAD-07**: The roadmap page footer shows "Last updated: [date]" pulled from Sanity

### Hero Banner

- [x] **HERO-01**: The hero banner on the home page shows the latest published release title and date, dynamically pulled from Sanity at build time

### Mock Data

- [x] **MOCK-01**: 2–3 sample sprint release documents created in Sanity Studio with real-looking content (sprint title, date, 3–4 items each with text, at least one screenshot placeholder, at least one video embed)
- [x] **MOCK-02**: 5–8 sample roadmap items created in Sanity Studio covering all three statuses (Planned, In Progress, Shipped), with all fields populated — at least one Shipped item linked to a mock sprint release

### Cleanup & URL Continuity

- [x] **ARCH-01**: Legacy /internal-releases/ page is removed
- [x] **ARCH-02**: Existing sprint URL patterns (e.g. /releases/sprint-2025-12-b) continue to resolve after migration — no 404s introduced
- [x] **ARCH-03**: Existing Sprint 2025.12-A and Sprint 2025.12-B entries are archived (removed from public site)

## v3.1 Requirements

Requirements for the Updates Hub milestone.

### Updates Hub Schema

- [x] **UHUB-01**: Create Sanity `update` schema with type enum and conditional fields
- [ ] **UHUB-02**: Build `/updates` hub page with tabs and filtering
- [ ] **UHUB-03**: Create type-specific card components
- [ ] **UHUB-04**: Build detail page `/updates/[slug]` with type-specific layouts
- [ ] **UHUB-05**: Create GROQ queries for efficient fetching
- [ ] **UHUB-06**: Migrate existing release/roadmap data to update schema (optional)

## Future Requirements

Deferred to v1.2 or later.

### Releases

- **REL-F01**: Affected-areas filter chip group on /releases index (useful once 5+ releases with consistent tagging exist)
- **REL-F02**: Change-type filter on /releases index
- **REL-F03**: RSS feed for release notes

### Roadmap

- **ROAD-F01**: Year/quarter filter on /roadmap (useful once 2+ years of releases exist)
- **ROAD-F02**: Kanban/board view (customer audience needs to read, not manage)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Voting / upvoting on roadmap | Requires authentication + server infrastructure — static site |
| Email subscription to releases | Requires mailing list service — operational overhead |
| Comments on release entries | Requires authentication + storage |
| Zoho Sprints sync | Explicitly out of scope; Sanity Studio is source of truth |
| Private/internal roadmap view | Requires authentication; public only for v1.1 |
| Real-time roadmap updates | Static site — Cloudflare Pages; webhook rebuild is the update mechanism |
| Auto-generated release notes from git | Commit messages are developer notes, not customer copy |
| Mux video (full streaming) | YouTube/Vimeo embed sufficient; Mux adds streaming costs |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHEMA-01 | Phase 6 | Complete |
| SCHEMA-02 | Phase 6 | Complete |
| SCHEMA-03 | Phase 6 | Complete |
| SCHEMA-04 | Phase 6 | Complete |
| MOCK-01 | Phase 6 | Pending |
| MOCK-02 | Phase 6 | Pending |
| REL-01 | Phase 7 | Pending |
| REL-02 | Phase 7 | Pending |
| REL-03 | Phase 7 | Pending |
| REL-04 | Phase 7 | Pending |
| REL-05 | Phase 7 | Pending |
| REL-06 | Phase 7 | Pending |
| REL-07 | Phase 7 | Pending |
| REL-08 | Phase 7 | Pending |
| REL-09 | Phase 7 | Pending |
| ROAD-01 | Phase 8 | Pending |
| ROAD-02 | Phase 8 | Pending |
| ROAD-03 | Phase 8 | Pending |
| ROAD-04 | Phase 8 | Pending |
| ROAD-05 | Phase 8 | Pending |
| ROAD-06 | Phase 8 | Pending |
| ROAD-07 | Phase 8 | Pending |
| HERO-01 | Phase 8 | Pending |
| ARCH-01 | Phase 9 | Pending |
| ARCH-02 | Phase 9 | Pending |
| ARCH-03 | Phase 9 | Pending |
| UHUB-01 | Phase 29 | Complete |
| UHUB-02 | Phase 29 | Pending |
| UHUB-03 | Phase 29 | Pending |
| UHUB-04 | Phase 29 | Pending |
| UHUB-05 | Phase 29 | Pending |
| UHUB-06 | Phase 29 | Pending |

**Coverage:**
- v1.1 requirements: 26 total
- v3.1 requirements: 6 total
- Mapped to phases: 32
- Unmapped: 0

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-03-13 — SCHEMA-02 and SCHEMA-04 marked complete after 06-01 execution verified*
