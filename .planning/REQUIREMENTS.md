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
- [x] **UHUB-02**: Build `/updates` hub page with tabs and filtering
- [x] **UHUB-03**: Create type-specific card components
- [x] **UHUB-04**: Build detail page `/updates/[slug]` with type-specific layouts
- [x] **UHUB-05**: Create GROQ queries for efficient fetching
- [ ] **UHUB-06**: Migrate existing release/roadmap data to update schema (optional)

## v5.0 Requirements

Requirements for the Multi-Product Architecture milestone.

### Multi-Product Infrastructure

- [x] **MPROD-01**: System supports multiple products via PRODUCT environment variable
- [ ] **MPROD-02**: Each product has isolated content with no cross-product visibility
- [ ] **MPROD-03**: Products deploy to separate domains (docs.gcxone.com, docs.gcsurge.com)
- [x] **MPROD-04**: Multi-build pipeline produces separate deployments per product
- [ ] **MPROD-05**: New product can be added in < 1 day (no code changes)

### Content Management

- [ ] **CONT-01**: All Sanity documents have required product field (enum: gcxone, gcsurge, shared)
- [ ] **CONT-02**: Editors can assign content to one or multiple products
- [ ] **CONT-03**: GROQ queries filter content by product at build time
- [ ] **CONT-04**: Existing GCXONE content is backfilled with product=gcxone
- [ ] **CONT-05**: Shared content appears in multiple products without duplication

### Authentication & Access

- [ ] **AUTH-01**: Auth0 authentication with product_access custom claim
- [ ] **AUTH-02**: Users only access content for products they're entitled to
- [x] **AUTH-03**: Session includes productAccess array for runtime checks
- [x] **AUTH-04**: Content visibility tiers supported (public, authenticated, role-based)
- [x] **AUTH-05**: Cloudflare Functions validate product access before serving protected content

### Analytics

- [ ] **ANLT-01**: PostHog tracks events with product context
- [ ] **ANLT-02**: Article views include product identifier
- [ ] **ANLT-03**: Search queries tracked with product context
- [ ] **ANLT-04**: Per-product analytics dashboards available

### Domain & Branding

- [ ] **DOM-01**: docs.gcxone.com serves GCXONE content only
- [ ] **DOM-02**: docs.gcsurge.com serves GC Surge content only
- [ ] **DOM-03**: Each product has distinct branding (title, tagline, theme)
- [ ] **DOM-04**: Product-specific navigation and sidebar structure
- [ ] **DOM-05**: Webhook triggers rebuild only for affected product

## Future Requirements

Deferred to v1.2, v5.1 or later.

### Releases

- **REL-F01**: Affected-areas filter chip group on /releases index (useful once 5+ releases with consistent tagging exist)
- **REL-F02**: Change-type filter on /releases index
- **REL-F03**: RSS feed for release notes

### Roadmap

- **ROAD-F01**: Year/quarter filter on /roadmap (useful once 2+ years of releases exist)
- **ROAD-F02**: Kanban/board view (customer audience needs to read, not manage)

### Multi-Product (v5.1+)

- **MPROD-F01**: Context-aware documentation based on user setup
- **MPROD-F02**: Recommended articles engine
- **MPROD-F03**: A/B testing of documentation experiences
- **MPROD-F04**: Full internal admin dashboard for multi-product insights

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
| MOCK-01 | Phase 6 | Complete |
| MOCK-02 | Phase 6 | Complete |
| REL-01 | Phase 7 | Complete |
| REL-02 | Phase 7 | Complete |
| REL-03 | Phase 7 | Complete |
| REL-04 | Phase 7 | Complete |
| REL-05 | Phase 7 | Complete |
| REL-06 | Phase 7 | Complete |
| REL-07 | Phase 7 | Complete |
| REL-08 | Phase 7 | Complete |
| REL-09 | Phase 7 | Complete |
| ROAD-01 | Phase 8 | Complete |
| ROAD-02 | Phase 8 | Complete |
| ROAD-03 | Phase 8 | Complete |
| ROAD-04 | Phase 8 | Complete |
| ROAD-05 | Phase 8 | Complete |
| ROAD-06 | Phase 8 | Complete |
| ROAD-07 | Phase 8 | Complete |
| HERO-01 | Phase 8 | Complete |
| ARCH-01 | Phase 9 | Complete |
| ARCH-02 | Phase 9 | Complete |
| ARCH-03 | Phase 9 | Complete |
| UHUB-01 | Phase 29 | Complete |
| UHUB-02 | Phase 29 | Complete |
| UHUB-03 | Phase 29 | Complete |
| UHUB-04 | Phase 29 | Complete |
| UHUB-05 | Phase 29 | Complete |
| UHUB-06 | Phase 29 | Deferred |
| MPROD-01 | Phase 35 | Complete |
| MPROD-02 | Phase 35 | Pending |
| MPROD-03 | Phase 39 | Pending |
| MPROD-04 | Phase 37 | Complete |
| MPROD-05 | Phase 40 | Pending |
| CONT-01 | Phase 36 | Pending |
| CONT-02 | Phase 36 | Pending |
| CONT-03 | Phase 36 | Pending |
| CONT-04 | Phase 36 | Pending |
| CONT-05 | Phase 36 | Pending |
| AUTH-01 | Phase 35 | Pending |
| AUTH-02 | Phase 35 | Pending |
| AUTH-03 | Phase 35 | Complete |
| AUTH-04 | Phase 35 | Complete |
| AUTH-05 | Phase 35 | Complete |
| ANLT-01 | Phase 40 | Pending |
| ANLT-02 | Phase 40 | Pending |
| ANLT-03 | Phase 40 | Pending |
| ANLT-04 | Phase 40 | Pending |
| DOM-01 | Phase 39 | Pending |
| DOM-02 | Phase 39 | Pending |
| DOM-03 | Phase 38 | Pending |
| DOM-04 | Phase 38 | Pending |
| DOM-05 | Phase 39 | Pending |

**Coverage:**
- v1.1 requirements: 26 total
- v3.1 requirements: 6 total
- v5.0 requirements: 24 total
- Mapped to phases: 56
- Unmapped: 0

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-04-01 — AUTH-04 and AUTH-05 marked complete after 35-03 execution*
