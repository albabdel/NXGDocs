# Roadmap: NXGEN GCXONE Documentation Platform

## Milestones

- v1.0 MVP - Phases 1-5 (shipped 2026-03-08)
- v1.1 Releases & Roadmap - Phases 6-10 (shipped 2026-03-16)
- v1.2 Confluence Integration - Phases 11-15 (on hold)
- v2.0 Admin Command Center - Phases 16-23 (shipped 2026-03-17)
- v3.0 Design System Polish - Phases 24-28 (shipped 2026-04-01)
- v4.0 Updates Hub - Phase 29 (shipped 2026-04-01)
- v5.0 Multi-Product Architecture - Phases 35-40 (current)

## Current Milestone: v5.0 Multi-Product Architecture

**Goal:** Transform single-product documentation into multi-product architecture supporting GCXONE and future products (GC Surge). Each product has isolated content, separate domain deployment, and product-scoped analytics.

**Key Features:**
- Auth0 authentication with product_access claims
- Sanity product field for content ownership
- Multi-build pipeline with separate deployments
- Product-specific branding and navigation
- Cloudflare Pages multi-project deployment
- PostHog analytics with product context

**Phases:**
- [x] **Phase 35: Auth Foundation & Product Access** - Auth0 with product_access claims, session management, access validation (completed 2026-04-01)
- [x] **Phase 36: Content Infrastructure** - Sanity product field, GROQ filtering, content backfill (completed 2026-04-01)
- [ ] **Phase 37: Multi-Build Pipeline** - Build orchestration for separate product deployments
- [ ] **Phase 38: Product Configuration & Branding** - Product-specific theming and navigation
- [ ] **Phase 39: Cloudflare Multi-Project Deployment** - Separate domains, product-scoped webhooks
- [ ] **Phase 40: PostHog Analytics** - Product-scoped events and dashboards

---

## Phase Details

### Phase 35: Auth Foundation & Product Access
**Goal**: Authentication includes product_access claims enabling multi-product content filtering and access control
**Depends on**: Phase 29 (Updates Hub complete)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, MPROD-01, MPROD-02
**Success Criteria** (what must be TRUE):
  1. User authenticates via Auth0 and receives JWT with product_access array claim
  2. User session includes productAccess array for runtime visibility checks
  3. Users only see content for products they are entitled to access
  4. Cloudflare Functions validate product access before serving protected content
  5. PRODUCT environment variable enables multi-product system configuration
**Plans**: 3 plans

Plans:
- [x] 35-01-PLAN.md — Session extension with productAccess + requireProductAccess guard ✓ 2026-04-01
- [x] 35-02-PLAN.md — Auth0 product_access claim extraction + React context ✓ 2026-04-01
- [x] 35-03-PLAN.md — Cloudflare Function guards + content visibility utilities ✓ 2026-04-01

### Phase 36: Content Infrastructure - Sanity Product Field
**Goal**: All content is tagged with product ownership and queryable by product
**Depends on**: Phase 35
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. Every Sanity document has required product field (enum: gcxone, gcsurge, shared)
  2. Editor can assign content to one or multiple products in Sanity Studio
  3. All GROQ queries filter content by product at build time
  4. Existing GCXONE content is backfilled with product=gcxone (no content lost)
  5. Shared content appears in multiple product builds without duplication
**Plans**: 2 plans

Plans:
- [ ] 36-01-PLAN.md — Add product field to all schemas + migration script
- [ ] 36-02-PLAN.md — Add product filtering to GROQ queries

### Phase 37: Multi-Build Pipeline
**Goal**: Build pipeline produces separate deployments for each product
**Depends on**: Phase 36
**Requirements**: MPROD-04
**Success Criteria** (what must be TRUE):
  1. `build-multi-product.js` script orchestrates builds for each product
  2. Each build run produces separate output directory per product
  3. Product-scoped JSON files contain only that product's content
  4. Build artifacts are isolated with no cross-product content leakage
**Plans**: 1 plan

Plans:
- [ ] 37-01-PLAN.md — Create multi-build orchestrator script with parallel builds

### Phase 38: Product Configuration & Branding
**Goal**: Each product has distinct branding, title, and navigation structure
**Depends on**: Phase 37
**Requirements**: DOM-03, DOM-04
**Success Criteria** (what must be TRUE):
  1. `product.config.ts` defines product-specific values (title, tagline, theme)
  2. Docusaurus config reads from product configuration file
  3. Each product has its own navigation menu and sidebar structure
  4. Theme colors and branding elements differ by product
**Plans**: 3 plans

Plans:
- [ ] 38-01-PLAN.md — Create product.config.ts + Docusaurus config integration
- [ ] 38-02-PLAN.md — Product-specific theming with CSS custom properties
- [ ] 38-03-PLAN.md — Product-aware Footer and navigation components

### Phase 39: Cloudflare Multi-Project Deployment
**Goal**: Each product deploys to its own domain with isolated rebuilds
**Depends on**: Phase 38
**Requirements**: MPROD-03, DOM-01, DOM-02, DOM-05
**Success Criteria** (what must be TRUE):
  1. docs.gcxone.com serves GCXONE content only
  2. docs.gcsurge.com serves GC Surge content only
  3. Sanity webhook triggers rebuild only for affected product (scoped by document product field)
  4. Products deploy as separate Cloudflare Pages projects
**Plans**: 3 plans

Plans:
- [ ] 39-01-PLAN.md — Cloudflare Pages projects setup (gcxone-docs, gcsurge-docs) with custom domains
- [ ] 39-02-PLAN.md — Sanity webhook routing for product-scoped rebuilds
- [ ] 39-03-PLAN.md — Deployment verification and runbook documentation

### Phase 40: PostHog Analytics
**Goal**: Product-scoped analytics enable per-product insights and dashboards
**Depends on**: Phase 39
**Requirements**: ANLT-01, ANLT-02, ANLT-03, ANLT-04, MPROD-05
**Success Criteria** (what must be TRUE):
  1. All PostHog events include product context property
  2. Article views tracked with product identifier
  3. Search queries tracked with product context
  4. Per-product analytics dashboards available in PostHog
  5. New product can be added to analytics in under 1 day
**Plans**: 3 plans

Plans:
- [ ] 40-01-PLAN.md — Product context integration (PostHog SDK + group() call)
- [ ] 40-02-PLAN.md — Article & search tracking with product context
- [ ] 40-03-PLAN.md — PostHog dashboard setup and documentation

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Cleanup | v1.0 | 8/8 | Complete | 2026-03-07 |
| 2. CMS Setup | v1.0 | 3/3 | Complete | 2026-03-07 |
| 3. Integration Pipeline | v1.0 | 4/4 | Complete | 2026-03-07 |
| 4. Content Migration | v1.0 | TBD/TBD | Complete | 2026-03-08 |
| 5. Polish | v1.0 | 6/6 | Complete | 2026-03-08 |
| 6. Schema & Data Pipeline | v1.1 | 3/3 | Complete | 2026-03-13 |
| 7. Releases Page | v1.1 | 2/2 | Complete | 2026-03-13 |
| 8. Roadmap Page & Hero Banner | v1.1 | 2/2 | Complete | 2026-03-13 |
| 9. Cleanup & URL Continuity | v1.1 | 3/3 | Complete | 2026-03-13 |
| 10. Deep Cleanup | v1.1 | 1/1 | Complete | 2026-03-16 |
| 29. Updates Hub | v4.0 | 3/3 | Complete | 2026-04-01 |
| 35. Auth Foundation & Product Access | v5.0 | Complete    | 2026-04-01 | 2026-04-01 |
| 36. Content Infrastructure | v5.0 | Complete    | 2026-04-01 | - |
| 37. Multi-Build Pipeline | v5.0 | 0/1 | Planned | - |
| 38. Product Configuration & Branding | v5.0 | 0/3 | Planned | - |
| 39. Cloudflare Multi-Project Deployment | v5.0 | 0/3 | Planned | - |
| 40. PostHog Analytics | v5.0 | 0/3 | Planned | - |

---

<details>
<summary>📋 v1.2 Confluence Integration (On Hold) - Phases 11-15</summary>

**Milestone Goal:** Mirror all Sanity content to Confluence automatically — editors publish in Sanity, content appears in both the public docs site and the internal Confluence knowledge base.

### Phase 11: Confluence API Setup
**Goal**: Confluence API is authenticated and tested, Space structure is defined, and a proof-of-concept page can be created programmatically
**Depends on**: Phase 10
**Requirements**: CONF-01, CONF-02, CONF-03
**Success Criteria** (what must be TRUE):
  1. Confluence API credentials are validated and stored securely in environment variables
  2. API client library is installed and a test page can be created, updated, and deleted via code
  3. Confluence Space exists with proper hierarchy structure (Documentation, Releases, Roadmap, Integrations)
  4. A sample Sanity document can be fetched and transformed to Confluence Storage Format
**Plans**: 3 plans

### Phase 12: Content Sync Pipeline
**Goal**: Core sync infrastructure exists — content type mappers, image handlers, and the sync engine
**Depends on**: Phase 11
**Requirements**: SYNC-01, SYNC-02, SYNC-03, SYNC-04
**Success Criteria** (what must be TRUE):
  1. Each Sanity content type (doc, article, release, roadmapItem) has a dedicated mapper to Confluence
  2. Cloudinary images can be uploaded as Confluence attachments and referenced in page content
  3. Sync engine can process a batch of documents and create/update Confluence pages
  4. Sync metadata (page IDs, sync timestamps) is tracked for incremental updates
**Plans**: 3 plans

### Phase 13: Bulk Migration
**Goal**: All existing Sanity content is migrated to Confluence in one execution
**Depends on**: Phase 12
**Requirements**: MIGR-01, MIGR-02
**Success Criteria** (what must be TRUE):
  1. Running the bulk migration script syncs all published docs, articles, releases, and roadmap items
  2. Page hierarchy in Confluence matches the sidebar structure in Sanity
  3. All images are uploaded and displayed correctly in Confluence pages
  4. Migration log shows success/failure counts with error details for any failures
**Plans**: 2 plans

### Phase 14: Webhook Integration
**Goal**: Sanity webhook triggers automatic Confluence sync on publish
**Depends on**: Phase 13
**Requirements**: HOOK-01, HOOK-02, HOOK-03
**Success Criteria** (what must be TRUE):
  1. Sanity webhook is configured to fire on document create/update/delete
  2. Cloudflare Pages Function receives webhook and triggers incremental sync
  3. Publishing a document in Sanity Studio updates Confluence within 2 minutes
  4. Deleted documents in Sanity are archived (not deleted) in Confluence
**Plans**: 2 plans

### Phase 15: Validation & Monitoring
**Goal**: Sync is reliable, monitored, and any issues are surfaced
**Depends on**: Phase 14
**Requirements**: VAL-01, VAL-02, VAL-03
**Success Criteria** (what must be TRUE):
  1. Sync status dashboard shows last sync time, success rate, and any errors
  2. Retry logic handles transient failures (rate limits, network errors)
  3. Manual sync can be triggered for specific documents or full content
  4. All content in Confluence matches Sanity (validated by spot-check)
**Plans**: 2 plans

</details>
