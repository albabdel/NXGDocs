# Implementation Review: Documents in `getting-started/next`

**Date:** 2025-12-21  
**Location:** `classic/docs/getting-started/next/`

## Overview

This directory contains 47 files that were recently added and need to be implemented into the documentation site. The files consist of:
- **32 PDF files** - Original source documents
- **15 UTF8 files** - Extracted text from PDFs (ready for markdown conversion)

## File Inventory

### UTF8 Files (Ready for Conversion)
These files have extracted text and can be converted to markdown immediately:

1. ✅ `correcting-time-synchronization-errors-between-genesis-and-talos.utf8` (125 bytes)
2. ✅ `diagnosing-and-resolving-alarms-blocked-due-to-overflow-threshold-genesis-and-talos.utf8` (6,024 bytes)
3. ✅ `gcx-genesis-alarm-forwarding.utf8` (18,895 bytes)
4. ✅ `genesis-local-mode-service-documentation.utf8` (2,401 bytes)
5. ✅ `Getting to Know Evalink Talos (1).utf8` (78,160 bytes)
6. ✅ `how-to-adjust-user-operator-privileges-in-genesis.utf8` (918 bytes)
7. ✅ `image-and-video-display-issues.utf8` (11,026 bytes)
8. ✅ `monitoring-and-resolving-display-issues-in-genesis.utf8` (111 bytes)
9. ✅ `network-time-protocol-ntp-client-configuration-guide (1).utf8` (3,254 bytes)
10. ✅ `redundancy (1).utf8` (2,871 bytes)
11. ✅ `talos-role-creation-modification.utf8` (553 bytes)
12. ✅ `troubleshooting (1).utf8` (80 bytes)
13. ✅ `twilioconference-20-5-2025.utf8` (5,936 bytes)
14. ✅ `unable-to-open-evalink-talos-oops-something-went-wrong-error.utf8` (738 bytes)
15. ✅ `user-management (1).utf8` (12,130 bytes)

### PDF Files (Need Extraction or Reference)
These PDFs may need text extraction or can be referenced as downloadable resources:

1. `article (2).pdf` (172 KB)
2. `avigilon-sdk-integration.pdf` (4.6 MB)
3. `axis-camera-station-pro-acs-pro-integration-and-alarm-configuration-guide.pdf` (4.7 MB)
4. `axis-io-module-onboarding-guide.pdf` (441 KB)
5. `axis-speaker-automatic-audio-announcement-recorded-audio-from-workflow.pdf` (230 KB)
6. `axon-horn-speaker-configuration (1).pdf` (207 KB)
7. `diagnosing-and-resolving-alarms-blocked-due-to-overflow-threshold-genesis-and-talos.pdf` (97 KB)
8. `genesis-audio-configuration-documentation.pdf` (4.5 MB)
9. `genesis-local-mode-service-documentation.pdf` (78 KB)
10. `Getting to Know Evalink Talos (1).pdf` (4.4 MB)
11. `geutebrueck-prerequisites-installation-guide.pdf` (3.1 MB)
12. `hanwah-cl (1).pdf` (3.1 MB)
13. `hanwah-cl.pdf` (3.1 MB) - duplicate
14. `heitel-configuration (2).pdf` (3.5 MB)
15. `hikvision-audio-implementation.pdf` (693 KB)
16. `hikvision-cloud-audio-implementation.pdf` (608 KB)
17. `hikvision-ip-speaker.pdf` (183 KB)
18. `how-to-adjust-user-operator-privileges-in-genesis.pdf` (143 KB)
19. `image-and-video-display-issues.pdf` (141 KB)
20. `network-time-protocol-ntp-client-configuration-guide (1).pdf` (331 KB)
21. `reconeyez-alarm-configuration-guide.pdf` (1.4 MB)
22. `redundancy (1).pdf` (330 KB)
23. `release-notes-reverse-rectangle-zoom-out-live-view.pdf` (54 KB)
24. `step-by-step-guide-to-separating-alarms-into-groups-in-talos.pdf` (172 KB)
25. `talos-role-creation-modification.pdf` (160 KB)
26. `technical-specification-integration-of-hikvision-nvrs-ip-cameras-with-genesis.pdf` (834 KB)
27. `toa-ip-speaker-configuration (1).pdf` (263 KB)
28. `truvision-configuration (1).pdf` (255 KB)
29. `twilioconference-20-5-2025.pdf` (3.2 MB)
30. `unable-to-open-evalink-talos-oops-something-went-wrong-error.pdf` (151 KB)
31. `user-management (1).pdf` (636 KB)

## Document Categories

### Getting Started & Platform Fundamentals
- `Getting to Know Evalink Talos (1).utf8/pdf` - Comprehensive Talos overview
- `gcx-genesis-alarm-forwarding.utf8/pdf` - Alarm forwarding configuration
- `genesis-local-mode-service-documentation.utf8/pdf` - Local mode setup
- `network-time-protocol-ntp-client-configuration-guide (1).utf8/pdf` - NTP configuration
- `redundancy (1).utf8/pdf` - Redundancy filter documentation
- `user-management (1).utf8/pdf` - User management guide

### Troubleshooting & Diagnostics
- `correcting-time-synchronization-errors-between-genesis-and-talos.utf8` - Time sync issues
- `diagnosing-and-resolving-alarms-blocked-due-to-overflow-threshold-genesis-and-talos.utf8/pdf` - Alarm overflow issues
- `image-and-video-display-issues.utf8/pdf` - Display troubleshooting
- `monitoring-and-resolving-display-issues-in-genesis.utf8` - Display issues
- `unable-to-open-evalink-talos-oops-something-went-wrong-error.utf8/pdf` - Talos error resolution
- `troubleshooting (1).utf8` - General troubleshooting

### Configuration & Administration
- `how-to-adjust-user-operator-privileges-in-genesis.utf8/pdf` - User privileges
- `talos-role-creation-modification.utf8/pdf` - Role management
- `twilioconference-20-5-2025.utf8/pdf` - Twilio conference configuration

### Device Integration Guides
- `avigilon-sdk-integration.pdf` - Avigilon SDK integration
- `axis-camera-station-pro-acs-pro-integration-and-alarm-configuration-guide.pdf` - Axis ACS Pro
- `axis-io-module-onboarding-guide.pdf` - Axis IO module
- `axis-speaker-automatic-audio-announcement-recorded-audio-from-workflow.pdf` - Axis speaker
- `axon-horn-speaker-configuration (1).pdf` - Axon speaker
- `genesis-audio-configuration-documentation.pdf` - Genesis audio
- `geutebrueck-prerequisites-installation-guide.pdf` - Geutebrueck setup
- `hanwah-cl (1).pdf` - Hanwha configuration
- `heitel-configuration (2).pdf` - Heitel setup
- `hikvision-audio-implementation.pdf` - Hikvision audio
- `hikvision-cloud-audio-implementation.pdf` - Hikvision cloud audio
- `hikvision-ip-speaker.pdf` - Hikvision IP speaker
- `reconeyez-alarm-configuration-guide.pdf` - Reconeyez alarms
- `technical-specification-integration-of-hikvision-nvrs-ip-cameras-with-genesis.pdf` - Hikvision NVR
- `toa-ip-speaker-configuration (1).pdf` - TOA speaker
- `truvision-configuration (1).pdf` - Truvision setup

### Release Notes & Updates
- `release-notes-reverse-rectangle-zoom-out-live-view.pdf` - Release notes
- `step-by-step-guide-to-separating-alarms-into-groups-in-talos.pdf` - Alarm grouping

## Implementation Status

### ✅ Completed
- Review document created
- File inventory completed
- Document categorization completed

### 🔄 In Progress
- Converting UTF8 files to markdown format
- Adding proper frontmatter
- Organizing into appropriate directories

### ⏳ Pending
- PDF text extraction (if needed)
- Sidebar configuration updates
- Cross-referencing with existing documents
- Image extraction from PDFs (if applicable)

## Implementation Plan

### Phase 1: UTF8 to Markdown Conversion (Priority)
1. Convert all 15 UTF8 files to markdown format
2. Add proper frontmatter (title, description, tags, sidebar_position)
3. Format content with proper headings, lists, and code blocks
4. Add appropriate cross-references

### Phase 2: Document Organization
1. Move converted markdown files to appropriate directories:
   - Getting Started: `classic/docs/getting-started/`
   - Troubleshooting: `classic/docs/troubleshooting/`
   - Admin Guide: `classic/docs/admin-guide/`
   - Device Guides: `classic/docs/devices/[device-name]/`
2. Update sidebar configuration
3. Create category JSON files if needed

### Phase 3: PDF Handling
1. Determine which PDFs need full text extraction
2. Extract text from critical PDFs
3. Convert to markdown or reference as downloadable resources
4. Extract images from PDFs if needed

### Phase 4: Integration & Testing
1. Verify all links work
2. Check for duplicate content
3. Ensure proper categorization
4. Test site build

## Notes

- Some documents may overlap with existing content (e.g., NTP configuration already exists)
- Device integration guides should be placed in `devices/[device-name]/` directories
- Troubleshooting guides should go in `troubleshooting/` directory
- Configuration guides may belong in `admin-guide/` or `getting-started/` depending on audience

## Next Steps

1. Start converting UTF8 files to markdown (highest priority)
2. Update sidebar configuration as documents are added
3. Review and merge duplicate content where applicable
4. Extract and organize images from PDFs if needed

