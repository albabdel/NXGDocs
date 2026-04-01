---
gsd_state_version: 1.0
milestone: v5.0
milestone_name: Multi-Product Architecture
status: executing
stopped_at: "33-02 complete"
last_updated: "2026-04-01T23:00:00Z"
last_activity: "2026-04-01 – Phase 33-02 complete: Search History & Reading Progress"
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 18
  completed_plans: 14
  percent: 78
  current_phase: 33-personalization
  current_plan: 03
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-13)
See: .planning/ROADMAP.md (v5.0 phases 35-40)

**Core value:** Non-technical editors can open a web UI, write content, and publish it – without a developer as a bottleneck.
**Current focus:** v5.0 Multi-Product Architecture – Phase 33-02 complete, continuing personalization

## Current Position

Phase: 33-personalization – Role-Based Content Personalization
Status: EXECUTING - Phase 33-02 complete (search history & reading progress)
Last activity: 2026-04-01 – Phase 33-02 complete: Search History & Reading Progress

Progress: [========  ] 78% (14 of 18 plans complete)

**Roadmap Summary:** v5.0 transforms single-product docs into multi-product architecture with GCXONE and GC Surge.

## Architecture Decisions (from Research)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Product isolation | Single Sanity dataset + product field | Unified editorial workflow, simpler permissions |
| Content filtering | GROQ product filter on all queries | Content isolation at data layer |
| Build strategy | Separate builds per product | Static sites with no cross-product leakage |
| Authentication | Auth0 with product_access claim | Multi-product access control |
| Analytics | PostHog with product context | Per-product dashboards |
| Deployment | Separate Cloudflare Pages projects | Isolated domains and rebuilds |
| Product config | product.config.ts + PRODUCT env var | Type-safe configuration per product |
| Product theming | CSS custom properties + theme class | Dynamic color injection per product |

## Critical Security Concerns

**Content leakage prevention (multi-layer defense):**
1. Schema-level: Required product field on all Sanity documents
2. Query-level: GROQ filter on all fetch operations
3. Build-level: Separate builds per product
4. Search-level: Scoped search index per product
5. Function-level: requireProductAccess() guards

## Accumulated Context

### Decisions

Recent decisions affecting current work:

- [Research]: Single dataset with product field preferred over separate Sanity datasets
- [Research]: Multi-build pipeline produces separate static sites per product
- [Research]: Auth0 Actions add product_access claim to JWT
- [Research]: PostHog group() calls enable product-scoped analytics
- [35-01]: Default productAccess to ['gcxone'] for backwards compatibility
- [35-01]: Admins default to all products ['gcxone', 'gcsurge'] for full access
- [35-01]: Product detection cascade: X-Product header > URL path > PRODUCT env > 'gcxone'
- [35-02]: ProductAccessContext provides session state and product entitlements
- [35-02]: useProductAccess hook for component-level visibility checks
- [35-03]: Visibility tiers defined: public, authenticated, restricted
- [35-03]: Product guard pattern enforced at function entry point
- [Phase 37]: Parallel builds enabled by default (Promise.all) for efficiency
- [Phase 37]: require cache cleared between builds to ensure fresh PRODUCT env var
- [Phase 38]: product.config.ts provides type-safe configuration for each product
- [Phase 38]: Theme class injected via Root.tsx based on PRODUCT env var
- [Phase 38]: GCXONE uses gold (#C89446), GCSurge uses blue (#3B82F6)
- [Phase 39]: gcxone.pages.dev and gcsurge.pages.dev Cloudflare Pages projects
- [Phase 39]: Sanity webhook triggers product-scoped rebuilds via /api/sanity-webhook
- [Phase 39]: Using subdomains (.pages.dev) per user request, custom domains later
- [31-02]: useUserProfile hook auto-creates profile on first login
- [31-02]: useThemeSync syncs Docusaurus theme with Supabase preferences
- [31-02]: UserProtectedRoute uses Auth0 directly (separate from admin ProtectedRoute)
- [33-01]: Quick links stored in user_preferences.quick_links JSON field
- [33-01]: Max 10 quick links per user enforced
- [33-01]: Role-to-interest mapping for recommended reading (static, ML later)
- [33-01]: RoleBasedContent component for role-based content filtering
- [33-02]: Search history stored in localStorage (client-side only, max 50 items)
- [33-02]: Reading progress persisted to Supabase for cross-device sync
- [33-02]: Progress bar uses scroll-based calculation with 500ms debounce
- [33-02]: Mark as read triggers celebration animation on completion

### Pending Todos

None.

### Blockers/Concerns

**Requires user action before execution:**
- Auth0 Actions configuration (product_access claim)
- Product entitlements source verification (Zoho custom field or app_metadata)
- Private vs. public content strategy decision
- Search index strategy decision

## Session Continuity

Last session: 2026-04-01
Stopped at: 33-02 complete
Status: v5.0 Multi-Product Architecture - Phase 33-02 complete

**Next Steps:**
1. Continue with Phase 33-03 (if exists) or next phase
2. Fix pre-existing build issues (missing modules in updates pages)
3. Add role selection to profile settings
4. Integrate QuickLinks into sidebar navigation

---
*STATE.md updated: 2026-04-01T23:00:00Z*
