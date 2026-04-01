# Project Research Summary

**Project:** Multi-Product Knowledge Base Architecture
**Domain:** B2B SaaS documentation platform with multi-product/multi-tenancy capabilities
**Researched:** 2026-04-01
**Confidence:** HIGH

## Executive Summary

This research addresses transforming an existing single-product Docusaurus + Sanity documentation platform into a multi-product system serving GCXONE and future products. The existing architecture (build-time Sanity fetch, static generation, Cloudflare Pages deployment, Auth0 authentication) is well-established and works well—the transformation extends rather than replaces these foundations.

**Recommended approach:** Add multi-product support through environment-driven configuration rather than architectural overhaul. A single `PRODUCT` environment variable flows through the entire pipeline, filtering Sanity content via GROQ queries, scoping builds, and configuring product-specific branding. This preserves the proven static generation pattern while enabling product isolation.

**Key risk:** Content leakage between products is the critical security concern. Multi-layer defense is essential: (1) Sanity schema requires product field on all documents, (2) all GROQ queries include product filter, (3) separate builds per product OR runtime access checks, (4) search index scoped per product, (5) Cloudflare Functions validate product access. Authentication must be extended to include product_access claims before any multi-product content is added.

## Key Findings

### Recommended Stack

The existing stack (Docusaurus 3.9.2, Sanity CMS, Cloudflare Pages, Cloudinary, docusaurus-search-local) remains unchanged. New additions for multi-product capabilities:

**Core libraries:**
- **@auth0/auth0-react (v2.16.1)** — Auth0 authentication for external users — Official React SDK with hooks (`useAuth0`) and HOCs (`withAuthenticationRequired`) that integrate cleanly with Docusaurus
- **posthog-js (v1.364.4) + @posthog/react (v1.8.2)** — Product analytics — Already have PostHog project (ID: 365239); SDK enables product-scoped tracking via `group()` calls
- **Multiple Docusaurus config files** — Multi-build pipeline — Separate config per product enables distinct domains without code duplication

**Infrastructure additions:**
- **Auth0 tenant** — External user authentication with product_access claims
- **Separate Cloudflare Pages projects** — One per product domain (docs.gcxone.com, docs.gcsurge.com)
- **Sanity product field** — Required enum field added to all content schemas

### Expected Features

This milestone focuses on multi-product infrastructure rather than end-user features. The research covers two related concerns:

**Multi-product infrastructure (primary):**
- Content filtering by product — All Sanity documents tagged with product enum
- Product-scoped builds — Each product deploys to its own domain
- Product-aware analytics — PostHog events tagged with product context
- Auth with product claims — JWT includes product_access array for access control
- Product-specific branding — Title, tagline, theme colors per product

**Release notes & roadmap (v1.1 carryover, per FEATURES.md):**
- Sanity-driven `/releases` index with reverse-chronological sprint cards
- Individual sprint detail pages with per-item media support
- Sanity-driven `/roadmap` with search, status filter, Shipped→release links
- Hero banner showing latest release dynamically
- Legacy hardcoded pages archived with redirects

**Must have (table stakes for releases):**
- Reverse-chronological release list with dates and sprint IDs
- Change-type badges (New/Fix/Improvement)
- Stable permalinks per release entry
- Item-level screenshots and video support

**Should have (differentiators):**
- Shipped roadmap items link to specific release notes
- Hero banner "Latest: Sprint X" badge (dynamic from Sanity)
- Per-item media (screenshots + video embeds)

**Defer (v1.2+):**
- RSS feed for releases
- Year/quarter filters (needs 2+ years of content)
- Mux video streaming (YouTube/Vimeo embeds sufficient)

### Architecture Approach

The architecture extends the existing build-time static generation pattern with product-aware filtering. A single environment variable (`PRODUCT`) flows through all layers, eliminating the need for complex multi-tenant infrastructure.

**Major components:**
1. **Sanity product field** — Required enum on all document types (doc, release, roadmapItem, article, landingPage, sidebarCategory); validates content ownership
2. **Multi-build pipeline (`build-multi-product.js`)** — Orchestrates builds: for each product, set env → fetch filtered content → generate sidebar → build → output to product directory
3. **GROQ product filter** — All queries in `fetch-sanity-content.js` include `product == $product` clause; ensures content isolation at data layer
4. **Product configuration (`product.config.ts`)** — Centralized product-specific values (title, URL, branding); Docusaurus config reads from this
5. **Auth0 product claims** — JWT custom claim `product_access` array; Cloudflare Functions validate before serving protected content
6. **PostHog product context** — Analytics events tagged with `product` property; enables per-product dashboards

**Architecture pattern:** Single dataset with product filtering, not separate Sanity datasets. This keeps editorial workflow unified, simplifies cross-product content management, and avoids dataset-level permission complexity.

### Critical Pitfalls

**1. Content leakage between products (CRITICAL SECURITY)** — Multi-layer defense: (a) schema-level product field required, (b) GROQ filter on all queries, (c) separate builds OR runtime checks, (d) scoped search index, (e) function-level product validation. Prevented in Phase 1 (Auth Foundation).

**2. Dual auth systems not unified** — Existing admin auth (Zoho OAuth) and customer auth (Auth0) lack product_access tracking. Extend Auth0 with custom claims; add productAccess to session objects. Addressed in Phase 1.

**3. Static build leaks all content** — Static sites are inherently public. Solution: product-specific builds with GROQ filtering OR client-side gating with protected content fetched via authenticated API. Decision needed in Phase 1.

**4. Search index exposes cross-product content** — `docusaurus-search-local` builds single index at build time. Must either: (a) generate separate indexes per product, (b) exclude protected docs from search, or (c) use server-side search. Addressed in Phase 2.

**5. Migration breaks existing content** — Adding product field to schemas without backfilling existing docs causes them to disappear from filtered queries. Atomic migration required: add field → backfill all existing docs with 'gcxone' → verify count → then filter. Phase 2 priority.

**6. Overengineering product separation** — For 2-3 products, avoid separate Sanity datasets, separate repos, or Auth0 Organizations. Single dataset + product field + GROQ filters is sufficient. Architecture decision in Phase 1.

**7. Cloudflare Functions lack product context** — Existing functions check `isAuthenticated` but not product-specific access. Add `requireProductAccess()` guard to all functions handling protected content. Phase 1.

## Implications for Roadmap

Based on research, suggested phase structure follows the architecture build order with security-first priority:

### Phase 1: Auth Foundation & Architecture Decision
**Rationale:** Multi-layer content isolation requires authentication to include product_access before any product-specific content is added. Architecture pattern (single vs. separate builds) determines all downstream implementation.
**Delivers:** Session with productAccess, Auth0 claims, requireProductAccess guards, architecture decision documented
**Addresses:** Dual auth unification, content leakage prevention, function guards
**Avoids:** Pitfall 1 (content leakage), Pitfall 2 (dual auth), Pitfall 7 (function context)
**Research flag:** Standard patterns (Auth0 claims, session extension well-documented)

### Phase 2: Content Infrastructure
**Rationale:** Sanity schema changes and migration are prerequisite for any multi-product content. Must backfill before filtering.
**Delivers:** Product field on all schemas, backfill migration, GROQ product filters in all queries
**Uses:** Sanity GROQ patterns from STACK.md
**Implements:** Sanity product field component from ARCHITECTURE.md
**Avoids:** Pitfall 5 (overengineering - single dataset approach), Pitfall 6 (migration breaks content)
**Research flag:** Standard patterns (Sanity schema migration established from v1.1)

### Phase 3: Multi-Build Pipeline
**Rationale:** With product-filtered content, build orchestration produces separate deployments per product.
**Delivers:** `build-multi-product.js` script, separate build outputs, product-scoped JSON files
**Implements:** Multi-build pipeline from ARCHITECTURE.md
**Avoids:** Pitfall 3 (static build leaks) — each build contains only one product's content
**Research flag:** May need research — Docusaurus multi-config builds, Cloudflare Pages multi-project deployment specifics

### Phase 4: Product Configuration & Branding
**Rationale:** Distinct product identities require configuration-driven approach, not hardcoded conditionals.
**Delivers:** `product.config.ts`, product-specific Docusaurus config reading, branding variations
**Implements:** Environment-driven configuration pattern from ARCHITECTURE.md
**Avoids:** Anti-pattern 3 (hardcoded product references)
**Research flag:** Standard patterns (Docusaurus config well-documented)

### Phase 5: Cloudflare Pages Multi-Project Setup
**Rationale:** Separate domains require separate Pages projects with product-specific environment variables.
**Delivers:** docs.gcxone.com, docs.gcsurge.com deployed, webhook-triggered rebuilds per product
**Implements:** Multi-project deployment from STACK.md
**Research flag:** May need research — Cloudflare Pages multi-project automation, webhook scoping

### Phase 6: PostHog Analytics Integration
**Rationale:** Product-scoped analytics enable per-product insights. Can run parallel with Phases 3-5.
**Delivers:** PostHog provider with product context, per-product dashboards
**Uses:** @posthog/react from STACK.md
**Research flag:** Standard patterns (PostHog React SDK well-documented)

### Phase 7: Content Seeding for New Products
**Rationale:** New products need initial content before launch. Can begin after Phase 2.
**Delivers:** Initial GCSurge content, sidebar structure, verified rendering
**Dependencies:** Phase 2 complete (schemas support product field)
**Research flag:** No research needed — content creation task

### Phase Ordering Rationale

- **Security before content:** Phase 1 establishes access boundaries before any multi-product content exists
- **Data layer first:** Phase 2 (schemas) before Phase 3 (builds) because builds depend on filtered content
- **Infrastructure before branding:** Phase 3-5 build and deploy pipeline before Phase 4 customizes it
- **Parallel opportunities:** PostHog (Phase 6) and content seeding (Phase 7) can overlap with build/deploy phases

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** Docusaurus multi-config builds with separate output directories; build artifact separation
- **Phase 5:** Cloudflare Pages multi-project automation via wrangler; webhook filtering by Sanity document product field

Phases with standard patterns (skip research-phase):
- **Phase 1:** Auth0 custom claims and session extension are well-documented official patterns
- **Phase 2:** Sanity schema migration patterns established in v1.1 work
- **Phase 4:** Docusaurus configuration is extensively documented
- **Phase 6:** PostHog React SDK has official documentation and examples
- **Phase 7:** Content seeding is editorial work, not technical research

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official SDKs with verified versions; existing Auth0/PostHog integrations in codebase |
| Features | HIGH | Codebase inspection confirmed existing patterns; MEDIUM for external benchmarks from training data |
| Architecture | HIGH | Direct inspection of existing build pipeline; patterns validated against existing implementation |
| Pitfalls | HIGH | Based on existing architecture analysis, auth system inspection, and platform capabilities research |

**Overall confidence:** HIGH

### Gaps to Address

- **Product entitlements source:** Auth0 claims need to fetch product access from somewhere (Zoho custom field, separate database, or Auth0 app_metadata). Validate which source of truth exists.
- **Zoho contact product field:** Need to verify if Zoho contact records have a custom field for product entitlements. If not, need to create one or use alternative source.
- **Private vs. public content strategy:** Decision needed on whether product-specific docs are fully protected (require auth) or partially public. Affects architecture choice (client-side gating vs. protected builds).
- **Asset isolation:** If product-specific images/videos should not leak, need product-scoped Cloudinary folders OR signed URLs. Verify requirements.
- **Search index strategy:** Need to decide between (a) separate search indexes per product subdomain, (b) exclude protected docs from static index, or (c) server-side search API. Depends on private/public content decision.

## Sources

### Primary (HIGH confidence)
- **Auth0 React SDK** — https://auth0.com/docs/libraries/auth0-react — Integration patterns, hooks, HOCs
- **PostHog JS SDK** — https://posthog.com/docs/libraries/js — Initialization, group tracking
- **PostHog React SDK** — https://posthog.com/docs/libraries/react — Provider setup, hooks
- **Docusaurus Multi-Instance** — https://docusaurus.io/docs/using-plugins#multi-instance-plugins — Plugin configuration patterns
- **Sanity GROQ Cheat Sheet** — https://www.sanity.io/docs/query-cheat-sheet — Filtering patterns
- **Cloudflare Pages Deployment** — https://docusaurus.io/docs/deployment#deploying-to-cloudflare-pages — Build configuration
- **keys.md** — PostHog credentials (Project ID: 365239, Token: phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS)
- **npm registry** — Package versions verified via `npm view`

### Codebase inspection (HIGH confidence)
- `classic/docusaurus.config.ts` — Current Docusaurus configuration
- `classic/scripts/fetch-sanity-content.js` — Authoritative data pipeline (all GROQ queries)
- `classic/plugins/docusaurus-plugin-sanity-content/index.js` — Plugin structure
- `scripts/generate-sidebar-from-sanity.js` — Sidebar generation
- `studio/sanity.config.ts` — Sanity Studio configuration
- `functions/zoho-customer-auth.ts` — Current session creation
- `functions/lib/zoho-session.ts` — Session interface
- `.planning/PROJECT.md` — Project constraints
- `.planning/STATE.md` — v5.0 Auth0 planning

### Existing research (HIGH confidence)
- `.planning/research/ARCHITECTURE.md` — v1.1 architecture patterns
- `.planning/research/auth0-upgrade-EXISTING-AUTH.md` — Dual auth systems analysis
- `.planning/research/auth0-upgrade-FEATURES.md` — Auth0 capabilities

### Secondary (MEDIUM confidence)
- Docusaurus i18n documentation — Separation patterns (analogous use case)
- Auth0 Organizations documentation — Multi-tenant patterns (may be overkill for 2-3 products)
- Benchmark analysis (training data as of August 2025) — Linear, Vercel, Intercom changelogs; common patterns

---
*Research completed: 2026-04-01*
*Ready for roadmap: yes*
