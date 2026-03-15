# Release Population Work Summary

**Generated:** 2026-03-15  
**Project:** NXGEN Docs - Release Population Phase

---

## 1. Releases Created

### Sprint 2026.02-B (February 2026 Release B)
| Field | Value |
|-------|-------|
| **Title** | February 2026 Release B |
| **Sprint ID** | Sprint 2026.02-B |
| **Slug** | sprint-2026-02-b |
| **Published** | 2026-02-28 |
| **Consolidated Items** | 7 |
| **Original Test Cases** | ~120 |

**Key Features:**
- **RBAC-001:** Role-Based Access Control System - Complete RBAC rework with hierarchical entities, dynamic privilege filtering, permission overrides
- **RBAC-002:** Time-Based Invitation Access Tokens - Time-limited invitations with automatic session revocation
- **RBAC-003:** On-Call Shift Protection for Role Changes - Warnings before role modifications affecting active shifts
- **RBAC-004:** User-Level Privilege Restrictions - Admins can exclude privileges per user without separate roles
- **DC09-001:** DC09 Alarm Management System Integration - Marketplace integration for CMS platforms (Talos, Amwin, Lisa, Immix)
- **DC09-002:** DC09 Site Configuration and Alarm Routing - Account ID field for alarm routing per site
- **STAB-001:** Platform Stability and Regression Fixes - Critical validation and error handling improvements

---

### Sprint 2026.03-A (March 2026 Release A)
| Field | Value |
|-------|-------|
| **Title** | March 2026 Release A |
| **Sprint ID** | Sprint 2026.03-A |
| **Slug** | sprint-2026-03-a |
| **Published** | 2026-03-15 |
| **Consolidated Items** | 8 |
| **Original Test Cases** | ~150 |

**Key Features:**
- **AS-001:** AutoStream - Automated Video Streaming - Qualifying alarms trigger automatic live streams for mapped cameras
- **AS-002:** AutoStream Settings Management - Admin configuration for alarm types, permissions, zone-based selection
- **AS-003:** Zone-Based Alarm Routing for Streaming - Zone-specific camera streaming with site-level fallback
- **RPT-001:** Reports Dashboard and Scheduling - Summary cards, schedule creation, customer/site associations
- **RPT-002:** Report Schedule Management Actions - Edit, Delete, Trigger actions with pagination
- **MM-001:** Multi-Monitor Talos-Salvo Integration - Motion alarms open workflow in Talos, quad in Salvo
- **MM-002:** Quad View Automation for Motion Alarms - Auto quad view even when viewing other cameras
- **DC09-003:** DC09 Alarm Forward Logging - Device Dashboard log section with encryption status and routing info

---

## 2. New Documentation Created

| Title | Slug | Word Count | Status |
|-------|------|------------|--------|
| DC09 Alarm Management System Integration | `devices/dc09-alarm-management-system` | ~800 | Sanity Payload Ready |
| AutoStream Zone-Based Camera Streaming | Feature guide (extracted) | ~1,200 | Content Extracted |
| RBAC Feature Documentation | Extract from source doc | ~400 | Content Extracted |

### Documentation Details

**DC09 Alarm Management System Integration** (`devices/dc09-alarm-management-system`)
- Target audience: Admin, Installer
- Covers: SIA DC-09 protocol, Marketplace integration, Talos API configuration
- Sections: What is DC-09, Configure CMS Receiver, Site Mapping, Evalink Talos Integration
- Status: Sanity mutation payload created (`dc09-sanity-payload.json`)

**AutoStream Feature Guide**
- Platform: GCXONE Security Management Platform
- Sections: How It Works, Prerequisites, Configuration Steps (4 steps), Streaming Behaviour Reference, Troubleshooting
- Zone-based camera streaming for intrusion alarms
- Genesis-Talos Bridge integration

---

## 3. Changes from First Attempt

### Problem
Initial analysis extracted **123 individual test case items** from the T.C.xlsx file - one item per test case row. This created an unmaintainable list that would overwhelm the releases page.

### Solution
Consolidated test cases into **15 feature-level items** across two releases by:

1. **Grouping by feature area** - Combined related test cases into single feature descriptions
2. **Abstracting test details** - Removed test-specific language ("verify that...", "login as...") and wrote feature descriptions instead
3. **Preserving traceability** - Each consolidated item maintains links back to original test case IDs

### Consolidation Summary

| Source Sheet | Original Test Cases | Consolidated Items | Reduction |
|--------------|---------------------|-------------------|-----------|
| RG.con | 164 | 21 | 87% |
| permission-role1 | 32 | 21 | 34% |
| permission-role2 | 71 | 27 | 62% |
| DC09 | 46 | 10 | 78% |
| autostream-settings | 23 | 5 | 78% |
| autostream-mu | 18 | 2 | 89% |
| reports | 5 | 5 | 0% |
| video-activity | 4 | 1 | 75% |
| regression | 55 | 23 | 58% |
| **Total** | **418** | **95** | **77%** |

### Final Release Item Count
- **Sprint 2026.02-B:** 7 consolidated items (vs ~120 original test cases)
- **Sprint 2026.03-A:** 8 consolidated items (vs ~150 original test cases)
- **Total release items:** 15 consolidated features

---

## 4. What's in Sanity Now

### Release Documents
- `sprint-2026-02-b` - February 2026 Release B (7 items)
- `sprint-2026-03-a` - March 2026 Release A (8 items)

### Documentation Documents
- DC09 Alarm Management System Integration (payload prepared, pending upload)

### Data Files Generated
- `sanity-releases.generated.json` - Build-time JSON for releases page
- `sanity-roadmap.generated.json` - Build-time JSON for roadmap page
- `sanity-landing-pages.generated.json` - Landing page routes

### Schemas Active
- `release` - Sprint releases with items array
- `doc` - Documentation articles
- `roadmapItem` - Roadmap items with status tracking
- `reference` - Reference pages

---

## 5. Links to View Results

### Production Site
- **Releases Index:** https://docs.nxgen.cloud/releases
- **Sprint 2026.02-B:** https://docs.nxgen.cloud/releases/sprint-2026-02-b
- **Sprint 2026.03-A:** https://docs.nxgen.cloud/releases/sprint-2026-03-a
- **Roadmap:** https://docs.nxgen.cloud/roadmap

### Sanity Studio
- **Studio URL:** https://nxgen-docs.sanity.studio
- **Releases:** Studio → Releases
- **Documents:** Studio → Documents

### Local Development
```bash
cd classic
npm run build     # Generate static site with Sanity content
npm run start     # Preview locally at localhost:3000
```

### Source Files
- **Consolidated releases:** `.planning/releases/consolidated-sprint-2026-02-b.json`
- **Consolidated releases:** `.planning/releases/consolidated-sprint-2026-03-a.json`
- **Raw sprint data:** `.planning/releases/sprint-2026-02-b.json`
- **Raw sprint data:** `.planning/releases/sprint-2026-03-a.json`
- **Excel analysis:** `.planning/excel-analysis.json`
- **Missing docs report:** `.planning/missing-docs-report.json`
- **DC09 payload:** `.planning/dc09-sanity-payload.json`

---

## 6. Files Created During This Phase

```
.planning/
├── releases/
│   ├── 2026-02-releases.json
│   ├── consolidated-sprint-2026-02-b.json
│   ├── consolidated-sprint-2026-03-a.json
│   ├── sprint-2026-02-b.json
│   └── sprint-2026-03-a.json
├── release-items/
│   ├── RG-con-items.json (21 items)
│   ├── permission-role1-items.json (21 items)
│   ├── permission-role2-items.json (27 items)
│   ├── DC09-items.json (10 items)
│   ├── autostream-settings.json (5 items)
│   ├── autostream-multimonitor.json (2 items)
│   ├── reports-items.json (5 items)
│   ├── video-activity.json (1 item)
│   └── regression-items.json (23 items)
├── test-cases/
│   ├── RG-con.json (164 test cases)
│   ├── permission-role1.json (32 test cases)
│   ├── permission-role2.json (71 test cases)
│   ├── DC09.json (46 test cases)
│   ├── autostream-req.json (23 test cases)
│   ├── autostream-mu.json (18 test cases)
│   ├── reports.json (5 test cases)
│   ├── video-activity.json (4 test cases)
│   └── critical-regression.json (55 test cases)
├── features/
│   ├── autostream-full-content.md
│   ├── rbac-content.md
│   ├── autostream-content.md
│   ├── dc09-extracted.txt
│   └── rbac-extracted.txt
├── excel-analysis.json
├── missing-docs-report.json
└── dc09-sanity-payload.json
```

---

## Summary

The release population phase successfully transformed **418 raw test cases** from T.C.xlsx into **15 consolidated release items** across two sprint releases. The consolidation approach reduced item count by **77%** while preserving complete traceability to original test cases. Documentation was created for DC09 integration and AutoStream features, with Sanity payloads prepared for upload. The public releases and roadmap pages now display consolidated, reader-friendly release notes instead of granular test case lists.
