---
gsd_state_version: 1.0
milestone: v5.0
milestone_name: Multi-Product Architecture
status: executing
stopped_at: "35-01 complete"
last_updated: "2026-04-01T17:45:00Z"
last_activity: "2026-04-01 — Plan 35-01 complete: Session product access foundation"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 6
  completed_plans: 1
  percent: 4
current_phase: 35-auth-foundation
current_plan: 02
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-13)
See: .planning/ROADMAP.md (v5.0 phases 35-40)

**Core value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.
**Current focus:** v5.0 Multi-Product Architecture — ROADMAP CREATED

## Current Position

Phase: 35-auth-foundation — Auth Foundation & Product Access
Status: EXECUTING - Plan 01 complete
Last activity: 2026-04-01 — Plan 35-01 complete: Session product access foundation

Progress: [          ] 4% (1 of ~24 plans complete)

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
Stopped at: 35-01 complete
Status: v5.0 Multi-Product Architecture - Phase 35 in progress

**Next Steps:**
1. Continue with plan 35-02 (Auth0 integration)
2. User must verify Auth0 tenant configuration
3. User must decide private vs. public content strategy
4. User must configure product entitlements source

---
*STATE.md updated: 2026-04-01T17:45:00Z*
