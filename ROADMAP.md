---
milestone: Documentation Enhancement
version: 2.2.0
updated: 2026-03-14T23:30:00Z
---

# NXGEN Docs Roadmap

> **Current Phase:** Complete
> **Status:** ✅ Complete

## Overview

Complete rework of the NXGEN Technology AG documentation platform for B2B SaaS monitoring stations. Focus on Sanity CMS integration, dynamic landing pages, and comprehensive device integration documentation.

---

## Completed Work

### Phase 1: Critical Fixes ✅

**Status:** ✅ Complete
**Objective:** Address critical documentation gaps and fix urgent issues

**Deliverables:**
- [x] Generate .sanity-cache folder with 144 docs
- [x] Populate alarm-management.tsx with 23 features
- [x] Fix 29 placeholder links in device-monitoring.tsx
- [x] Set published status on 60 null-status docs

---

### Phase 2: Integration Hub ✅

**Status:** ✅ Complete
**Objective:** Create a dynamic device integration matrix with manufacturer logos and configuration guides

**Deliverables:**
- [x] Integration Hub page (`/integration-hub`)
- [x] Device integration cards with logos
- [x] Filter sidebar (category, GCX-Ready, manufacturer)
- [x] Device detail modal with Cloud/Local features
- [x] Manual Available badges linking to docs
- [x] 51 device integrations seeded to Sanity
- [x] 32 device configuration articles created
- [x] All integrations linked to documentation

**Files Created:**
- `classic/src/pages/integration-hub.tsx`
- `classic/src/pages/integration-hub.module.css`
- `scripts/integration-matrix.json`
- `scripts/seed-device-integrations.js`
- `scripts/link-all-device-docs.js`
- `studio/schemaTypes/deviceIntegration.ts`

---

### Phase 3: Getting Started Rework ✅

**Status:** ✅ Complete
**Objective:** Create a comprehensive onboarding experience managed by Sanity

**Deliverables:**
- [x] Getting Started landing page (`/getting-started`)
- [x] 5 onboarding phases with progress tracking
- [x] Role-based filtering (Admin, Operator, Installer, Manager)
- [x] Video tutorial integration
- [x] Featured articles section
- [x] Quick Start CTA buttons

**Files Created:**
- `classic/src/pages/getting-started.tsx`
- `classic/src/pages/getting-started.module.css`
- `scripts/seed-getting-started-page.js`
- `studio/schemaTypes/gettingStartedPage.ts`

**Sanity Documents Created:**
- `getting-started/index`
- `getting-started/first-time-login`
- `getting-started/required-ports`
- `getting-started/organization-setup`
- `getting-started/user-management`
- `getting-started/video-tutorials`
- `alarm-management/index`
- `alarm-management/test-mode`

---

### Phase 4: Video Tutorials ✅

**Status:** ✅ Complete
**Objective:** Create a dedicated video tutorials page

**Deliverables:**
- [x] Video Tutorials page (`/video-tutorials`)
- [x] YouTube video grid with thumbnails
- [x] Category tabs (Getting Started, Features, Advanced)
- [x] Modal video player
- [x] Search functionality

**Videos Integrated:**
| Video ID | Title | Category |
|----------|-------|----------|
| I7dccOLTOsk | First-Time Login Setup | Getting Started |
| ER-tnAvGXow | GCXONE Product Overview | Getting Started |
| p--04PIIO-M | Platform Walkthrough | Features |
| AxHOF8cV88Q | Dashboard Deep Dive | Features |
| H2WhN1p3x9E | Tower Management | Advanced |

**Files Created:**
- `classic/src/pages/video-tutorials.tsx`
- `classic/src/pages/video-tutorials.module.css`

---

### Phase 5: Broken Links & Content Fixes ✅

**Status:** ✅ Complete
**Objective:** Fix all broken links and ensure build passes

**Fixes Applied:**
- [x] Fixed `/docs/video-tutorials` → `/video-tutorials`
- [x] Fixed `/docs/getting-started/first-time-login` → `/docs/getting-started/first-time-login--access`
- [x] Fixed `/docs/getting-started/user-management/overview` → `/docs/getting-started/user-management-setup`
- [x] Fixed 23 broken links in Sanity content
- [x] Fixed broken anchors in Sanity content
- [x] Updated role pages (admin, operator, manager, installer)
- [x] Updated onboardingPhases.ts with valid links

---

### Phase 6: Landing Pages & Contact ✅

**Status:** ✅ Complete
**Objective:** Create essential landing pages and contact functionality

**Deliverables:**
- [x] Create `/contact` landing page
- [x] Create `/roles` index page with 4 role cards
- [x] Expand landing pages with additional sections
- [x] Fix all remaining broken anchors

**Files Created:**
- `classic/src/pages/contact.tsx`
- `classic/src/pages/contact.module.css`
- `classic/src/pages/roles.tsx`
- `classic/src/pages/roles.module.css`

---

### Phase 7: Device Configuration Guides ✅

**Status:** ✅ Complete
**Objective:** Add comprehensive device configuration documentation

**Deliverables:**
- [x] Add 6 device configuration guides
- [x] Create alarm-management/test-mode doc
- [x] Complete documentation coverage

---

### Phase 8: Schema Standardization ✅

**Status:** ✅ Complete
**Objective:** Standardize Sanity schemas and clean up content

**Deliverables:**
- [x] Standardize status field values across 7 schemas
- [x] Delete 7 test documents from Sanity
- [x] Redesign integrations.tsx with site design patterns

---

### Phase 9: API Documentation ✅

**Status:** ✅ Complete
**Objective:** Create comprehensive API documentation section

**Deliverables:**
- [x] Create API documentation section
- [x] 5 API docs created
- [x] 6 API categories organized

**Files Created:**
- `studio/schemaTypes/apiReference.ts`
- Scripts for API doc seeding

---

### Phase 10: Sidebar & Content Quality ✅

**Status:** ✅ Complete
**Objective:** Fix sidebar structure, remove emojis, clean up placeholder content

**Deliverables:**
- [x] Remove ALL emojis from sidebar labels
- [x] Fix incorrect article names and labels
- [x] Delete 34 placeholder/draft documents from Sanity
- [x] Delete 11 orphaned sidebar categories
- [x] Fix 22 slug format issues (spaces, uppercase → hyphens, lowercase)
- [x] Fix title/label mismatches in 10 docs
- [x] Generate sidebar from actual Sanity cache docs
- [x] Proper folder/subfolder structure (11 categories, 94 docs)

**Scripts Created:**
- `scripts/generate-sidebar-from-sanity.js`
- `scripts/delete-placeholder-content.js`
- `scripts/fix-slug-issues.js`
- `scripts/fix-title-label-mismatches.js`

---

### Phase 11: Documentation Index Page ✅

**Status:** ✅ Complete
**Objective:** Create comprehensive docs index as central navigation system

**Deliverables:**
- [x] Create /docs and /docs-index pages
- [x] Dynamic data fetching from Sanity
- [x] Hero section with search (Ctrl+K shortcut)
- [x] Quick links to main areas
- [x] Category grid with article counts
- [x] Landing pages section
- [x] Resources section (API, Releases, Roadmap)
- [x] Return to Home button in docs hero (static, always visible)
- [x] Quick access bar on landing page (Documentation Index, Release Notes, Roadmap)
- [x] Last updated timestamps
- [x] Auto-refresh when content changes

**Components Created:**
- `classic/src/pages/docs.tsx`
- `classic/src/pages/docs-index.tsx`
- `classic/src/components/DocsIndex/` (7 components)
- `studio/schemaTypes/docsIndexConfig.ts`

**Scripts Created:**
- `scripts/fetch-docs-index-data.js`
- `scripts/seed-docs-index-config.js`

**Bug Fixes (2026-03-14):**
- Fixed invisible Return to Home button on /docs — removed framer-motion `initial={{ opacity: 0 }}` wrapper that prevented display due to SSR/hydration issues
- Removed unreliable `position: fixed` floating button (Docusaurus stacking context breaks z-index)
- Added quick access navigation bar to landing page (/) with Documentation Index, Release Notes, and Roadmap buttons

---

### Phase 12: PDF Download for Articles ✅

**Status:** Complete
**Objective:** Add PDF download functionality with NXGEN template branding

**Architecture:**
- Build-time PDF generation using Puppeteer (not client-side)
- PDFs pre-generated at build, served as static files
- Images render correctly (Puppeteer is a real browser)
- Works with GitLab Pages static hosting

**Deliverables:**
- [x] Puppeteer PDF generation script
- [x] NXGEN branded PDF template (gold #C9A227, Arial font)
- [x] NXGEN logo in PDF header
- [x] Images properly rendered in PDFs
- [x] 26 PDFs generated at build time
- [x] DownloadPDF component links to static PDFs

**Components Created:**
- `classic/scripts/generate-pdfs.js` (Puppeteer PDF generator)
- `scripts/pdf-template.html` (NXGEN branded template)
- `classic/src/components/DownloadPDF/index.tsx` (download button)

**Assets Added:**
- `classic/static/img/nxgen-pdf-logo.png` (from docx template)
- `classic/static/pdfs/*.pdf` (generated at build, gitignored)

**Dependencies Added:**
- puppeteer (dev dependency for build-time PDF generation)

**Integration:**
- Build script runs PDF generation
- DownloadPDF component links to `/pdfs/{slug}.pdf`

---

## Sanity Content Summary

### Document Types

| Type | Count |
|------|-------|
| Landing Pages | 24 |
| Device Integrations | 51 |
| Device Docs | 32 |
| Getting Started Docs | 13 |
| API Docs | 5 |
| Sidebar Categories | 8 |

### Schemas Created

- `deviceIntegration` - Device integration matrix
- `gettingStartedPage` - Getting started landing page
- `alertTemplate` - Alert templates
- `apiReference` - API documentation
- `monitoringStation` - Station profiles

---

## Routes Summary

| Route | Type | Status |
|-------|------|--------|
| `/` | Landing Page | ✅ |
| `/getting-started` | Landing Page | ✅ |
| `/video-tutorials` | Static Page | ✅ |
| `/integration-hub` | Static Page | ✅ |
| `/quick-start` | Landing Page | ✅ |
| `/quick-start/guide` | Landing Page | ✅ |
| `/quick-start/device-integration` | Landing Page | ✅ |
| `/quick-start/platform-overview` | Landing Page | ✅ |
| `/contact` | Landing Page | ✅ |
| `/roles` | Landing Page | ✅ |
| `/docs/getting-started/*` | Sanity Docs | ✅ |
| `/docs/devices/*` | Sanity Docs | ✅ |
| `/docs/api/*` | Sanity Docs | ✅ |

---

## Metrics Summary

- **Total documents in Sanity:** 164 (after cleanup)
- **Sidebar categories:** 11
- **Sidebar docs:** 94
- **Landing pages:** 24
- **Device integrations:** 51
- **API docs:** 5
- **Scripts created:** 15+
- **Emojis removed:** 11
- **Placeholder docs deleted:** 34
- **Slug fixes:** 22
- **Build status:** SUCCESS

---

## Build Status

**Last Build:** 2026-03-14
**Status:** SUCCESS
**Total Pages:** 94 docs + 24 landing pages

---

## Technical Stack

- **Frontend:** React, Docusaurus, Tailwind CSS
- **CMS:** Sanity.io
- **Icons:** Lucide React
- **Videos:** YouTube embeds
- **Deployment:** GitLab CI/CD

---

## Next Steps (Future)

- [ ] Add Mux video streaming for self-hosted videos
- [ ] Implement Algolia search
- [ ] Add multilingual support
- [ ] Create monitoring station profiles
- [ ] Expand API documentation coverage
