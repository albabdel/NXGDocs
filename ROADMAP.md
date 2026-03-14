---
milestone: Documentation Enhancement
version: 2.0.0
updated: 2026-03-14T17:00:00Z
---

# NXGEN Docs Roadmap

> **Current Phase:** Complete
> **Status:** ✅ Complete

## Overview

Complete rework of the NXGEN Technology AG documentation platform for B2B SaaS monitoring stations. Focus on Sanity CMS integration, dynamic landing pages, and comprehensive device integration documentation.

---

## Completed Work

### Phase 1: Integration Hub ✅

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

### Phase 2: Getting Started Rework ✅

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

### Phase 3: Video Tutorials ✅

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

### Phase 4: Broken Links & Fixes ✅

**Status:** ✅ Complete
**Objective:** Fix all broken links and ensure build passes

**Fixes Applied:**
- [x] Fixed `/docs/video-tutorials` → `/video-tutorials`
- [x] Fixed `/docs/getting-started/first-time-login` → `/docs/getting-started/first-time-login--access`
- [x] Fixed `/docs/getting-started/user-management/overview` → `/docs/getting-started/user-management-setup`
- [x] Updated role pages (admin, operator, manager, installer)
- [x] Updated onboardingPhases.ts with valid links

---

## Sanity Content Summary

### Document Types

| Type | Count |
|------|-------|
| Landing Pages | 15+ |
| Device Integrations | 51 |
| Device Docs | 32 |
| Getting Started Docs | 13 |
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
| `/docs/getting-started/*` | Sanity Docs | ✅ |
| `/docs/devices/*` | Sanity Docs | ✅ |

---

## Build Status

**Last Build:** 2026-03-14
**Status:** ✅ SUCCESS
**Total Pages:** 164

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
- [ ] Add API reference documentation
- [ ] Create monitoring station profiles
- [ ] Add multilingual support
