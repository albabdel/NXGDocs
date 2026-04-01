---
gsd_state_version: 1.0
milestone: v5.0
milestone_name: Multi-Product Architecture
status: executing
stopped_at: "38 complete"
last_updated: "2026-04-01T20:00:00Z"
last_activity: "2026-04-01 � Phase 38 complete: Product Configuration & Branding"
progress:
  total_phases: 6
  completed_phases: 4
  total_plans: 15
  completed_plans: 9
  percent: 60
  current_phase: 39-cloudflare-multi-project
  current_plan: 01
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-13)
See: .planning/ROADMAP.md (v5.0 phases 35-40)

**Core value:** Non-technical editors can open a web UI, write content, and publish it � without a developer as a bottleneck.
**Current focus:** v5.0 Multi-Product Architecture � Phase 38 complete, Phase 39 next

## Current Position

Phase: 39-cloudflare-multi-project � Cloudflare Multi-Project Deployment
Status: EXECUTING - Phase 38 complete, ready for Phase 39
Last activity: 2026-04-01 � Phase 38 complete: Product Configuration & Branding

Progress: [======    ] 60% (9 of 15 plans complete)

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
Stopped at: 38 complete
Status: v5.0 Multi-Product Architecture - Phase 38 complete

**Next Steps:**
1. Continue with Phase 39 (Cloudflare Multi-Project Deployment)
2. Set up Cloudflare Pages projects for each product
3. Configure Sanity webhook routing
4. Document deployment runbook

---
*STATE.md updated: 2026-04-01T20:00:00Z*
