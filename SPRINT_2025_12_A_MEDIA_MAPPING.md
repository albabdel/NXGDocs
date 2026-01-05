# Sprint 2025.12-A Media Files Mapping Documentation

**Date**: January 5, 2026  
**Last Updated**: January 5, 2026  
**Sprint**: 2025.12-A  
**Page**: `/internal-releases/sprint-2025-12-b`

## Overview

This document explains how media files from the `Sprint/` directory were mapped to feature cards in the Sprint 2025.12-A internal release notes page.

## File Organization

All media files have been moved to the appropriate static directories:

- **Images**: `classic/static/img/sprint-2025-12-a/`
- **Videos**: `classic/static/videos/sprint-2025-12-a/`

## Media Files Mapped

### Videos (6 files)

| File Name | Mapped To | Feature Card | Reasoning |
|-----------|-----------|--------------|-----------|
| `Salvo Operator Controls.mp4` | inc-001 | Salvo Operator Controls | Direct name match - demonstrates operator controls functionality |
| `Salvo share.mp4` | inc-001 | Salvo Operator Controls | Part of sharing events feature mentioned in the card description |
| `Salvo view enhancements.mp4` | inc-002 | Salvo View Layout Improvements | Direct name match - shows layout improvements |
| `Map Navigation and Search.mp4` | inc-005 | Map Navigation and Search | Direct name match - demonstrates navigation features |
| `2025-04-23 09-24-05.mp4` | inc-003 | Salvo Video View Refactor | Assumed mapping - generic timestamp name, assigned to video refactor feature |
| `Automated Reports.mp4` | inc-009 | Automated Reports | Direct name match - demonstrates automated report scheduling |

### Images (13 files)

| File Name | Mapped To | Feature Card | Reasoning |
|-----------|-----------|--------------|-----------|
| `IO 1.png` | inc-001 | Salvo Operator Controls | IO controls are a key feature of operator controls |
| `IO 2.png` | inc-001 | Salvo Operator Controls | Second image showing IO controls |
| `Full Image Preview 1.png` | inc-004 | Full Image Preview | Direct name match - shows full image preview feature |
| `Full Image Preview 2.png` | inc-004 | Full Image Preview | Second image showing full image preview |
| `Screenshot 2026-01-05 231442.png` | inc-007 | Healthcheck Dashboard Improvements | Generic screenshot - assigned to dashboard improvements (needs verification) |
| `Screenshot 2026-01-05 233356.png` | inc-007 | Healthcheck Dashboard Improvements | Generic screenshot - assigned to dashboard improvements (needs verification) |
| `Screenshot 2026-01-05 233502.png` | inc-006 | Tower and Device Management | Generic screenshot - assigned to tower management (needs verification) |
| `Customer success report 1.png` | inc-008 | Reporting Structure and Localization | Customer success report example - part of reporting structure |
| `Customer success report 2.png` | inc-008 | Reporting Structure and Localization | Customer success report example - part of reporting structure |
| `Customer success report 3.png` | inc-008 | Reporting Structure and Localization | Customer success report example - part of reporting structure |
| `localization_DE 1.png` | inc-008 | Reporting Structure and Localization | German localization example - demonstrates language support |
| `localization_DE 2.png` | inc-008 | Reporting Structure and Localization | German localization example - demonstrates language support |
| `Low light threshhold.png` | inc-010 | Security Analysis Enhancements | Low light threshold setting - part of security analysis (needs verification) |

## Feature Cards Updated

### Core Features

1. **Salvo Operator Controls** (inc-001)
   - **Images**: 2 (IO 1.png, IO 2.png)
   - **Videos**: 2 (Salvo Operator Controls.mp4, Salvo share.mp4)
   - **Status**: ✅ Fully mapped

2. **Salvo View Layout Improvements** (inc-002)
   - **Images**: 0
   - **Videos**: 1 (Salvo view enhancements.mp4)
   - **Status**: ✅ Fully mapped

### Video Features

3. **Salvo Video View Refactor** (inc-003)
   - **Images**: 0
   - **Videos**: 1 (2025-04-23 09-24-05.mp4) ⚠️ **Needs verification**
   - **Status**: ⚠️ Assumed mapping - video content should be verified

4. **Full Image Preview** (inc-004)
   - **Images**: 2 (Full Image Preview 1.png, Full Image Preview 2.png)
   - **Videos**: 0
   - **Status**: ✅ Fully mapped

### Map Module Improvements

5. **Map Navigation and Search** (inc-005)
   - **Images**: 0
   - **Videos**: 1 (Map Navigation and Search.mp4)
   - **Status**: ✅ Fully mapped

6. **Tower and Device Management** (inc-006)
   - **Images**: 1 (Screenshot 2026-01-05 233502.png) ⚠️ **Needs verification**
   - **Videos**: 0
   - **Status**: ⚠️ Assumed mapping - screenshot content should be verified

### Healthcheck & Reporting

7. **Healthcheck Dashboard Improvements** (inc-007)
   - **Images**: 2 (Screenshot 2026-01-05 231442.png, Screenshot 2026-01-05 233356.png) ⚠️ **Needs verification**
   - **Videos**: 0
   - **Status**: ⚠️ Assumed mapping - screenshot content should be verified

8. **Reporting Structure and Localization** (inc-008)
   - **Images**: 5 (Customer success report 1-3.png, localization_DE 1-2.png)
   - **Videos**: 0
   - **Status**: ✅ Fully mapped

9. **Automated Reports** (inc-009)
   - **Images**: 0
   - **Videos**: 1 (Automated Reports.mp4)
   - **Status**: ✅ Fully mapped

### Security and Analysis

10. **Security Analysis Enhancements** (inc-010)
    - **Images**: 1 (Low light threshhold.png) ⚠️ **Needs verification**
    - **Videos**: 0
    - **Status**: ⚠️ Assumed mapping - screenshot content should be verified

## Mapping Logic Used

### High Confidence Mappings (Direct Name Match)
- Files with descriptive names matching feature card titles were mapped directly
- Examples: "Salvo Operator Controls.mp4" → Salvo Operator Controls card
- Examples: "Full Image Preview 1.png" → Full Image Preview card
- Examples: "Automated Reports.mp4" → Automated Reports card
- Examples: "localization_DE 1.png" → Reporting Structure and Localization card

### Feature-Specific Mappings
- Files clearly related to a feature's functionality were mapped based on context
- Examples: "Customer success report 1-3.png" → Reporting Structure (report examples)
- Examples: "IO 1-2.png" → Salvo Operator Controls (IO functionality)

### Assumed Mappings (Requires Verification)
- Generic timestamp-named files were mapped based on:
  1. Context clues (e.g., "Screenshot" files to dashboard features)
  2. Available slots (features without media)
  3. Logical grouping (similar features)

### Files That Need Manual Review

The following files were mapped based on assumptions and should be verified:

1. **`2025-04-23 09-24-05.mp4`** → Assigned to "Salvo Video View Refactor"
   - **Action**: Review video content to confirm it shows video view refactoring
   - **Alternative**: Could be for any video-related feature

2. **`Screenshot 2026-01-05 231442.png`** → Assigned to "Healthcheck Dashboard Improvements"
   - **Action**: Review screenshot to confirm it shows healthcheck dashboard
   - **Alternative**: Could be for Map features, Reporting, or other dashboard features

3. **`Screenshot 2026-01-05 233356.png`** → Assigned to "Healthcheck Dashboard Improvements"
   - **Action**: Review screenshot to confirm it shows healthcheck dashboard
   - **Alternative**: Could be for Map features, Reporting, or other dashboard features

4. **`Screenshot 2026-01-05 233502.png`** → Assigned to "Tower and Device Management"
   - **Action**: Review screenshot to confirm it shows tower/device management
   - **Alternative**: Could be for Map features or other device-related features

5. **`Low light threshhold.png`** → Assigned to "Security Analysis Enhancements"
   - **Action**: Review screenshot to confirm it's related to security analysis
   - **Alternative**: Could be for camera/image analysis or another feature

## Code Changes Made

### File Updated
- `classic/src/pages/internal-releases/sprint-2025-12-b.tsx`

### Changes
1. Added media file paths to appropriate increment objects
2. Removed placeholder text from descriptions (e.g., `[Screenshot: ...]`, `[Video: ...]`)
3. All paths use Docusaurus static file format: `/img/...` and `/videos/...`

### Path Format
- Images: `/img/sprint-2025-12-a/{filename}`
- Videos: `/videos/sprint-2025-12-a/{filename}`

## Verification Checklist

Before considering this complete, verify:

- [ ] `2025-04-23 09-24-05.mp4` actually shows Salvo Video View Refactor
- [ ] `Screenshot 2026-01-05 231442.png` shows Healthcheck Dashboard
- [ ] `Screenshot 2026-01-05 233356.png` shows Healthcheck Dashboard
- [ ] `Screenshot 2026-01-05 233502.png` shows Tower/Device Management
- [ ] `Low light threshhold.png` is related to Security Analysis
- [ ] All media files display correctly on the sprint page
- [ ] Video playback works for all video files
- [ ] Image modal/lightbox works for all images

## Statistics

- **Total Media Files**: 19 files
- **Images**: 13 files
- **Videos**: 6 files
- **Features with Media**: 9 out of 10 features
- **High Confidence Mappings**: 14 files
- **Assumed Mappings**: 5 files (require verification)
- **Features without Media**: 1 feature (Salvo Video View Refactor has only assumed video)

## New Files Added (Update: January 5, 2026)

The following files were added in a subsequent update:

### Videos Added
- `Automated Reports.mp4` → Mapped to Automated Reports (inc-009)

### Images Added
- `Customer success report 1.png` → Mapped to Reporting Structure (inc-008)
- `Customer success report 2.png` → Mapped to Reporting Structure (inc-008)
- `Customer success report 3.png` → Mapped to Reporting Structure (inc-008)
- `localization_DE 1.png` → Mapped to Reporting Structure (inc-008)
- `localization_DE 2.png` → Mapped to Reporting Structure (inc-008)
- `Low light threshhold.png` → Mapped to Security Analysis (inc-010) ⚠️ Needs verification

## Next Steps

1. **Review Assumed Mappings**: Open the 5 files marked for verification and confirm they match their assigned features
2. **Update if Needed**: If any files are incorrectly mapped, update the paths in the sprint page
3. **Test Page**: Load the sprint page and verify all media displays correctly
4. **Optional Enhancements**: Consider adding more descriptive filenames for future sprints to avoid generic timestamp names

## File Structure Reference

```
classic/static/
├── img/
│   └── sprint-2025-12-a/
│       ├── Customer success report 1.png
│       ├── Customer success report 2.png
│       ├── Customer success report 3.png
│       ├── Full Image Preview 1.png
│       ├── Full Image Preview 2.png
│       ├── IO 1.png
│       ├── IO 2.png
│       ├── localization_DE 1.png
│       ├── localization_DE 2.png
│       ├── Low light threshhold.png
│       ├── Screenshot 2026-01-05 231442.png
│       ├── Screenshot 2026-01-05 233356.png
│       └── Screenshot 2026-01-05 233502.png
└── videos/
    └── sprint-2025-12-a/
        ├── 2025-04-23 09-24-05.mp4
        ├── Automated Reports.mp4
        ├── Map Navigation and Search.mp4
        ├── Salvo Operator Controls.mp4
        ├── Salvo share.mp4
        └── Salvo view enhancements.mp4
```

---

**Created**: January 5, 2026  
**Last Updated**: January 5, 2026  
**Status**: Complete - Requires verification of 5 assumed mappings
