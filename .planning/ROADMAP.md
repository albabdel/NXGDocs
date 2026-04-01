# Roadmap: NXGEN GCXONE Documentation Platform

## Milestones

- v1.0 MVP - Phases 1-5 (shipped 2026-03-08)
- v1.1 Releases & Roadmap - Phases 6-10 (shipped 2026-03-16)
- v1.2 Confluence Integration - Phases 11-15 (on hold)
- v2.0 Admin Command Center - Phases 16-23 (shipped 2026-03-17)
- v3.0 Design System Polish - Phases 24-28 (shipped 2026-04-01)
- **v4.0 Updates Hub - Phase 29 (current)**

## Current Milestone: v4.0 Updates Hub

**See detailed roadmap:** `.planning/ROADMAP-updates-hub.md`

**Goal:** Build a unified Updates Hub that consolidates all platform updates (announcements, releases, bug fixes, roadmap items) into a single, filterable, searchable interface:
- Single `update` Sanity schema with type enum
- Tab-filtered hub page at `/updates`
- Type-specific card layouts and detail pages
- Sanity Studio field groups for clean editing

**Phases:**
| Phase | Name | Status |
|-------|------|--------|
| 24 | CSS Architecture | Complete    | 2026-03-31 | 25 | 2/2 | Complete    | 2026-04-01 | 26 | 2/2 | Complete    | 2026-04-01 | 27 | UI Polish | Complete    | 2026-04-01 | 28 | Modern CSS | Complete    | 2026-04-01 | Phase | Milestone | Plans Complete | Status | Completed |
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
| 11. Confluence API Setup | v1.2 | 0/3 | In progress | - |
| 12. Content Sync Pipeline | v1.2 | 0/3 | Pending | - |
| 13. Bulk Migration | v1.2 | 0/2 | Pending | - |
| 14. Webhook Integration | v1.2 | 0/2 | Pending | - |
| 15. Validation & Monitoring | v1.2 | 0/2 | Pending | - |

---

### v1.2 Confluence Integration (Planned)

**Milestone Goal:** Mirror all Sanity content to Confluence automatically — editors publish in Sanity, content appears in both the public docs site and the internal Confluence knowledge base.

**Phase Numbering:** v1.2 starts at 11 (continuing from v1.1 which ended at 10).

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

Plans:
- [ ] 11-01-PLAN.md — Validate Confluence API credentials, install atlassian-api client, create test page
- [ ] 11-02-PLAN.md — Create Confluence Space structure (NXGEN Documentation), define page hierarchy
- [ ] 11-03-PLAN.md — Build Portable Text to Confluence Storage Format transformer (PoC)

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

Plans:
- [ ] 12-01-PLAN.md — Build content type mappers (doc, article, release, roadmapItem)
- [ ] 12-02-PLAN.md — Implement image sync (Cloudinary download → Confluence attachment upload)
- [ ] 12-03-PLAN.md — Create sync engine with batch processing and metadata tracking

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

Plans:
- [ ] 13-01-PLAN.md — Build bulk migration script with progress tracking
- [ ] 13-02-PLAN.md — Execute migration and verify all content synced

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

Plans:
- [ ] 14-01-PLAN.md — Create Sanity webhook and Cloudflare Pages Function handler
- [ ] 14-02-PLAN.md — Implement incremental sync logic with error handling

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

Plans:
- [ ] 15-01-PLAN.md — Add monitoring, logging, and retry logic
- [ ] 15-02-PLAN.md — Build admin sync UI and validation tools
