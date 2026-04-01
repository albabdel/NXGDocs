---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Design System Polish
status: in_progress
stopped_at: "26-02 Dialog and Card Primitives - COMPLETE"
last_updated: "2026-04-01T05:42:52Z"
last_activity: "2026-04-01 — Dialog and Card primitives: Radix wrapper, CVA variants, glass tokens"
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 8
  completed_plans: 5
  percent: 63
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-13)
See: .planning/ROADMAP-design-system.md (new milestone roadmap)

**Core value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.
**Current focus:** v3.0 Design System Polish — Transform CSS from patchwork to maintainable system

## Current Position

Phase: 26-variant-system — Component Variant System
Status: Plan 02 complete, phase complete
Last activity: 2026-04-01 — Dialog and Card primitives (5/8 plans)

Progress: [======    ] 63% (5 of 8 plans complete)

**Note:** v3.0 Design System Polish planned. 5 phases covering CSS architecture, component tokens, variant system, UI polish, and modern CSS features. Based on DESIGN_SYSTEM_ANALYSIS_AND_IMPLEMENTATION_PLAN.md.

## Phase 24: CSS Architecture (In Progress)

### Plan 01: CSS @layer Architecture (Complete)

**Summary:** CSS @layer architecture and file split for predictable cascade control and style discoverability.

**Changes:**
- Added CSS @layer declarations (docusaurus, tokens, components, utilities, overrides)
- Split 3,906-line custom.css into focused files:
  - tokens.css — Design tokens with :root and [data-theme='dark']
  - typography.css — Font families, heading sizes
  - components/sidebar.css — Sidebar styling with gold theme
  - components/code-blocks.css — Code block styles
  - components/cards.css — Card component styles
- Deleted unused style-override.css
- Updated docusaurus.config.ts to load all CSS files in order

**Commits:**
- 1f6cc0d — feat(24-01): add CSS @layer architecture to custom.css
- db37e50 — feat(24-01): split CSS into focused files
- b9523fc — chore(24-01): delete unused style-override.css

**Requirements:** CSS-01, CSS-02, CSS-03, CSS-04

## Phase 25: Component Tokens (In Progress)

### Plan 01: Component Tokens Migration (Complete)

**Summary:** Glassmorphism CSS tokens and theme-agnostic components replacing inline style branches.

**Changes:**
- Added glassmorphism CSS tokens (glass-bg, glass-border, glass-shadow, icon-bg) for both themes
- Migrated FeatureCard from inline style branches to CSS classes
- Migrated DocsIndex components (DocsHero, CategoriesGrid, QuickLinksSection, ResourcesSection, LandingPagesSection, ReturnHomeBanner) to CSS tokens
- Removed useColorMode from 6 components (kept only for canvas animation)

**Commits:**
- abfae50 — feat(25-01): add glassmorphism CSS tokens
- 1a3a8bf — feat(25-01): migrate FeatureCard to CSS tokens
- 1986645 — feat(25-01): migrate DocsIndex components to CSS tokens

**Requirements:** TOKN-01, TOKN-02, TOKN-03

### Plan 02: ZohoTickets Token Migration (Complete)

**Summary:** Migrated ZohoTickets from 63 inline style branches to 45+ CSS token-based classes.

**Changes:**
- Created zoho-tickets.css with 45+ token-based component classes
- Added portal-header-customer and portal-header-agent gradient classes
- Migrated 6 helper components (CopyButton, Avatar, TranslateButton, AttachmentItem, RelatedArticles, StyledSelect) to CSS classes
- Reduced isDark ternary patterns from 63 to ~20 (state-dependent styles remain)
- Removed unused cardBorder variable from TicketPortal

**Commits:**
- 0b8791b — feat(25-02): add zoho-tickets.css with token-based styles
- 9a18063 — feat(25-02): migrate ZohoTickets inline styles to CSS classes
- e33314b — verify(25-02): confirm CSS token migration compiles

**Requirements:** TOKN-04, TOKN-05

## Phase 26: Variant System (In Progress)

### Plan 01: CVA Button Primitive (Complete)

**Summary:** Type-safe Button component with 4 variants and 3 sizes using class-variance-authority.

**Changes:**
- Installed class-variance-authority@0.7.1 for type-safe component variants
- Created Button primitive with primary, secondary, ghost, destructive variants
- Added sm, md, lg size variants with VariantProps typing
- Created UI primitives barrel export pattern (src/components/ui/index.ts)
- Fixed blocking Tailwind @layer issue in zoho-tickets.css

**Commits:**
- dba5ba0 — feat(26-01): install class-variance-authority for variant system
- b1d0856 — feat(26-01): create Button primitive with CVA variants
- 82c86ed — fix(26-01): remove Tailwind @layer from zoho-tickets.css

**Requirements:** CVA-01, CVA-02, CVA-03

### Plan 02: Dialog and Card Primitives (Complete)

**Summary:** Accessible Dialog and glassmorphism Card primitives completing the UI component library foundation.

**Changes:**
- Installed @radix-ui/react-dialog@1.1.15 for accessible modals
- Created Dialog component with glassmorphism styling
- Created Card component with 4 CVA variants (default, elevated, featured, outline)
- Updated UI barrel export with all primitives

**Commits:**
- 4787ceb — feat(26-02): install @radix-ui/react-dialog for Dialog primitive
- 4e5e479 — feat(26-02): create Dialog component with NXGEN tokens
- d11453a — feat(26-02): create Card component with glass tokens
- 4d93003 — feat(26-02): update UI index exports with Dialog and Card

**Requirements:** CVA-04, CVA-05

## Phase 10 Complete

### Implementation Summary

| Plan | Description | Status |
|------|-------------|--------|
| 10-01 | Deep cleanup of dead CMS artifacts | ✅ Complete |

### Key Changes

- Attempted deletion of dead dot-directories (.netlify, .storyblok, .vercel)
- Attempted deletion of migration directories (content-staging, Implementation plan)
- Attempted deletion of dead Hygraph/Strapi/Payload scripts
- Attempted deletion of dead config files and documentation
- Attempted deletion of build logs and temp files
- Verified Vercel comments removed from docusaurus.config.ts (already clean)
- Build verified passing

### Verification

- All targeted files/directories were either already absent or untracked
- `npm run build` exits 0 with SUCCESS
- No new issues introduced

**Note:** Repository was already clean from previous phases. Phase 10 confirmed no dead files remain.

## Phase 9 Complete

### Implementation Summary

| Plan | Description | Status |
|------|-------------|--------|
| 09-01 | Delete /internal-releases/ page | ✅ Complete |
| 09-02 | Verify URL continuity | ✅ Complete |
| 09-03 | Archive legacy Sprint entries | ✅ Complete |

### Key Changes

- Removed 3 internal-releases entries from sanity-landing-pages.generated.json
- Cleaned up LandingPageRenderer.tsx (removed internal release logic)
- Removed internal-releases routing from seed script
- Archived Sprint 2025.12-A from legacy releases page
- Verified all sprint URLs work correctly

### Verification

- `/releases/sprint-2025-12-b` works via legacy fallback
- `/releases/sprint-2026-*` routes generated by plugin
- `/internal-releases/*` returns 404 as expected
- Public releases index shows only 2026 releases

## Phase 8 Complete

### Implementation Summary

| Plan | Description | Status |
|------|-------------|--------|
| 08-01 | Roadmap page with filtering and search | ✅ Complete |
| 08-02 | Hero banner dynamic release display | ✅ Complete |

### Key Changes

- `roadmap.tsx` — Direct JSON import, status filtering, keyword search, accordion cards
- `NXGENSphereHero.tsx` — Dynamic release display from Sanity
- `index.tsx` — Home page releases section uses Sanity data

## Previous Milestone Summary (v1.0 — SHIPPED 2026-03-08)

All 5 phases complete:
- Phase 1 (Cleanup): Dead CMS code removed, CSS consolidated, build stabilized
- Phase 2 (CMS Setup): Sanity Studio deployed, all 4 schemas locked
- Phase 3 (Integration Pipeline): Docusaurus-Sanity plugin built, publish webhook wired
- Phase 4 (Content Migration): All MDX content migrated to Sanity
- Phase 5 (Polish): Search (docusaurus-search-local), hero redesign, light mode contrast, visual consistency

## Accumulated Context

### Decisions

Recent decisions affecting current work:

  - [26-01]: Use CVA for type-safe component variants instead of manual className unions
  - [26-01]: Export buttonVariants for className composition with other utilities
  - [26-01]: Use existing CSS tokens (--glass-bg, --gold-text) for theme compatibility
  - [25-01]: Use CSS tokens instead of JavaScript colorMode branching for styling
  - [25-01]: Keep useColorMode only where needed for non-styling purposes (canvas animation)
  - [25-01]: Add glassmorphism tokens for glass surfaces in both light and dark themes
  - [24-01]: Use CSS @layer to override Docusaurus without !important — cascade control
- [24-01]: Split CSS into tokens, typography, and component files for discoverability
- [24-01]: Load CSS files in order: tokens -> typography -> components -> custom
- [v1.1 roadmap]: Zero new npm packages needed — all libraries already installed
- [v1.1 roadmap]: Build-time JSON is the SSG-safe data contract — no runtime API calls
- [v1.1 roadmap]: Phases 7 and 8 can run in parallel after Phase 6 is verified
- [v1.1 roadmap]: Replace releaseNote schema with release (one doc, items array)
- [v1.1 roadmap]: roadmap.tsx and releases.tsx must be replaced entirely, not extended
- [v1.1 roadmap]: MOCK-01 and MOCK-02 assigned to Phase 6
- [06-01]: Atomic migration used — all 7 releaseNote registration sites updated in single commit
- [06-01]: release schema uses displayTitle (customer-facing) + sprintId (optional internal)
- [06-01]: items[] inline array chosen over separate documents
- [06-01]: releaseRef on roadmapItem is optional (no required validation)
- [06-02]: fetchReleases()/fetchRoadmapItems() defined as inner async functions
- [06-02]: releaseNote query block removed; release-notes file kept as [] in git
- [06-02]: Fallback JSON files must be committed as [] before static import
- [06-03]: Content created via Sanity API instead of Studio UI
- [06-03]: roadmapItem GROQ filter uses `!(_id in path("drafts.**"))`
- [06-gap-fix]: `_updatedAt` added to roadmap GROQ query for ROAD-07
- [08-01]: Direct JSON import replaces SanityLandingPageRoute wrapper
- [08-01]: Status filter buttons (All, Planned, In Progress, Shipped)
- [08-01]: Accordion behavior — one item expanded at a time
- [08-01]: Shipped items link to /releases/[slug]
- [08-02]: Hero chip shows dynamic release displayTitle
- [08-02]: Hero chip links to release detail page, not index
- [08-02]: Home page releases section uses Sanity data
- [09-01]: Internal-releases page files already deleted in previous phase
- [09-01]: Removed internal release logic from LandingPageRenderer
- [09-03]: Sprint 2025.12-A archived (no route exists)
- [09-03]: Sprint 2025.12-B kept for backward compatibility
- [10-01]: Repository was already clean from previous phases — no tracked files affected
- [Phase 26-variant-system]: Use Radix Dialog for accessibility and keyboard navigation
- [Phase 26-variant-system]: Apply glassmorphism tokens to Dialog and Card for theme consistency
- [Phase 26-variant-system]: CVA variants for Card: default, elevated, featured, outline

### Pending Todos

None.

### Blockers/Concerns

None — v1.1 milestone complete.

## Session Continuity

Last session: 2026-04-01
Stopped at: 26-02 Dialog and Card Primitives - COMPLETE
Status: Phase 26 complete, ready for next phase

**Completion Summary:**
- Phase 16: Auth Foundation — OAuth, sessions, protected routes
- Phase 17: Admin Shell & Sidebar — Layout, navigation, 8 pages
- Phase 18: Content Approval Workflow — Review queue, approve/reject
- Phase 19: Routing & Block Editor — Dynamic routes, visual editing
- Phase 20: Analytics Dashboard — Metrics, charts, performance
- Phase 21: Audit & Compliance — Complete audit trail, retention
- Phase 22: Ticketing Integration — Embedded ticketing
- Phase 23: Polish & Testing — E2E tests, a11y, performance

---

## v2.0 Admin Command Center (Current Milestone)

### Phase 16: Auth Foundation (Complete)
**Goal:** OAuth org-based authentication with session management

Plans:
- [x] 16-01-PLAN.md — Auth foundation: session, OAuth callback, context, protected routes

**Summary:** Admin authentication foundation implemented with:
- HMAC-signed HttpOnly session cookies
- Zoho OAuth callback with org verification
- AdminAuthContext and hooks (useAdminAuth, useCurrentUser)
- ProtectedRoute component for /admin/* routes
- Sanity adminUser schema for user tracking
- User sync on first login

**Commit:** d132d57

### Phase 17: Admin Shell & Sidebar (Complete)
**Goal:** Admin dashboard layout with navigation

Plans:
- [x] 17-01-PLAN.md — AdminLayout, AdminSidebar, AdminHeader, and all admin route pages

**Summary:** Admin shell implemented with:
- Collapsible sidebar navigation (8 sections)
- Header with user menu and logout
- Mobile-responsive drawer
- 8 placeholder admin pages

**Commit:** 2fcf577

### Phase 18: Content Approval Workflow (Complete)
**Goal:** Review queue, approve/reject/edit content

Plans:
- [x] 18-01-PLAN.md — Content approval workflow with review queue

**Summary:** Content approval implemented with:
- Review queue for pending content
- Approve/reject/edit functionality
- Status tracking and notifications

**Commit:** phase-18-complete

### Phase 19: Routing & Block Editor (Complete)
**Goal:** Dynamic route config, visual block editing

Plans:
- [x] 19-01-PLAN.md — Routing editor with dynamic config
- [x] 19-02-PLAN.md — Visual block editor for content

**Summary:** Routing and block editing implemented with:
- Dynamic route configuration UI
- Visual block editor for content sections
- Drag-and-drop block management

**Commit:** phase-19-complete

### Phase 20: Analytics Dashboard (Complete)
**Goal:** Metrics, charts, content performance

Plans:
- [x] 20-01-PLAN.md — Analytics dashboard with metrics and charts

**Summary:** Analytics dashboard implemented with:
- Key metrics visualization
- Content performance charts
- Traffic and engagement data

**Commit:** phase-20-complete

### Phase 21: Audit & Compliance (Complete)
**Goal:** Complete audit trail, retention policies

Plans:
- [x] 21-01-PLAN.md — Audit trail and compliance logging

**Summary:** Audit and compliance implemented with:
- Complete audit trail for all admin actions
- Retention policy configuration
- Compliance reporting

**Commit:** phase-21-complete

### Phase 22: Ticketing Integration (Complete)
**Goal:** Embed ticketing in admin dashboard

Plans:
- [x] 22-01-PLAN.md — Ticketing integration with admin dashboard

**Summary:** Ticketing integration implemented with:
- Embedded ticketing widget
- Support ticket management
- Ticket status tracking

**Commit:** phase-22-complete

### Phase 23: Polish & Testing (Complete)
**Goal:** E2E tests, accessibility, performance

Plans:
- [x] 23-01-PLAN.md — E2E tests and accessibility audit
- [x] 23-02-PLAN.md — Performance optimization

**Summary:** Polish and testing complete with:
- E2E test coverage for admin flows
- Accessibility audit and fixes
- Performance optimization

**Commit:** phase-23-complete

---

## v1.2 Confluence Integration (On Hold)

Phases 11-15 are on hold pending v2.0 completion. The admin dashboard will include Confluence sync controls.
