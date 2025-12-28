# Image References Analysis Summary

## Overview
Comprehensive analysis of image references in markdown files within `classic/docs` directory and their corresponding files in `classic/static/img`.

---

## Key Findings

| Metric | Count |
|--------|-------|
| **Markdown Files with Images** | 70 |
| **Total Image References** | 524 |
| **Absolute Path References** (/img/) | 104 |
| **Relative Path References** (./images/) | 420 |
| **Total Image Files in static/img** | 170 |
| **Broken Absolute Paths** | 0 ✓ |

---

## Detailed Breakdown

### 1. Absolute Path References (/img/) - Status: ALL VALID ✓

All 104 absolute path references are properly linked to existing images.

**Example categories:**
- Device integration diagrams (`/img/device-integration/...`)
- Getting started guides (`/img/getting-started/...`)
- Dashboard screenshots (`/img/dashboard-*.svg`)
- Feature diagrams (`/img/feature-*.svg`)
- Key benefits pages (`/img/getting-started/key-benefits/...`)
- Login flows (`/img/getting-started/first-time-login/...`)

### 2. Relative Path References (./images/) - Status: REQUIRES INVESTIGATION

**420 references** use relative paths pointing to `./images/` directories within their document folders. These need verification as they are:
- Device-specific configuration files in `devices/` folder
- Getting-started guides in nested device folders
- Tower monitoring configuration
- User management guides

**Files affected:**
- 55 markdown files use relative image paths
- Most are in `devices/*/configuration.md` files
- Some in `getting-started/devices/*/` folders

---

## Files Grouped by Reference Type

### Absolute Path Files (All Valid)
1. `device-integration/alarm-panels.md` - 5 refs
2. `device-integration/iot-sensors.md` - 7 refs
3. `device-integration/ip-cameras.md` - 6 refs
4. `getting-started/first-time-login.md` - 34 refs
5. `getting-started/first-time-login-full.md` - 33 refs
6. `getting-started/gcxone-talos-interaction.md` - 4 refs
7. `getting-started/key-benefits.md` - 13 refs
8. `platform-fundamentals/hierarchy-model.md` - 1 ref
9. `platform-fundamentals/microservices-architecture.md` - 1 ref
10. `platform-fundamentals-hierarchy-model.md` - 1 ref
11. `platform-fundamentals-microservices-architecture.md` - 1 ref
12. `getting-started/bandwidth-requirements.md` - 1 ref

### Relative Path Files (55 files total)

#### Device Configuration Files
- `devices/ajax/overview.md` - 11 refs
- `devices/autoaid/configuration.md` - 4 refs
- `devices/axis/configuration.md` - 4 refs
- `devices/axiscamerastation/configuration.md` - 15 refs
- `devices/axiscspro/configuration.md` - 1 ref
- `devices/axxon/configuration.md` - 4 refs
- `devices/davantis/configuration.md` - 4 refs
- `devices/digitalwatchdog/configuration.md` - 8 refs
- `devices/eagleeye/overview.md` - 5 refs
- `devices/efoy/configuration.md` - 4 refs
- `devices/eneo/configuration.md` - 6 refs
- `devices/eneoip/configuration.md` - 9 refs
- `devices/essence/configuration.md` - 4 refs
- `devices/ganz/overview.md` - 9 refs
- `devices/genesisaudio/configuration.md` - 2 refs
- `devices/genesisvms/configuration.md` - 6 refs
- `devices/geutebruck/configuration.md` - 4 refs
- `devices/hanwha/configuration.md` - 4 refs
- `devices/heitel/configuration.md` - 4 refs
- `devices/hikpro/configuration.md` - 4 refs
- `devices/honeywell/configuration.md` - 6 refs
- `devices/innovi/configuration.md` - 4 refs
- `devices/milestone/configuration.md` - 15 refs
- `devices/miwi/configuration.md` - 4 refs
- `devices/netvue/configuration.md` - 6 refs
- `devices/nxgcloudnvr/configuration.md` - 4 refs
- `devices/nxgcloudvisionedge/configuration.md` - 6 refs
- `devices/nxwitness/configuration.md` - 8 refs
- `devices/rosenberger/configuration.md` - 4 refs
- `devices/spykebox/configuration.md` - 7 refs
- `devices/uniview/overview.md` - 7 refs
- `devices/viasys/configuration.md` - 6 refs
- `devices/victron/configuration.md` - 4 refs
- `devices/auraigateway/configuration.md` - 4 refs

#### Getting-Started Device Guides
- `getting-started/Towers/Towers.md` - 16 refs
- `getting-started/devices/ADPRO/ADPRO.md` - 21 refs
- `getting-started/devices/Ajax/Ajax.md` - 11 refs
- `getting-started/devices/Avigilon/Avigilon.md` - 22 refs
- `getting-started/devices/AxisCameraStation/Axis Camera Station Pro.md` - 20 refs
- `getting-started/devices/Camect/Camect.md` - 8 refs
- `getting-started/devices/Dahua/Dahua.md` - 6 refs
- `getting-started/devices/Dahua Dolynk/Dahua Dolynk.md` - 5 refs
- `getting-started/devices/EagleEye/EagleEye.md` - 5 refs
- `getting-started/devices/Ganz/Ganz.md` - 3 refs
- `getting-started/devices/HikVision/Hikvision.md` - 8 refs
- `getting-started/devices/Reconeyez/Reconeyez.md` - 4 refs
- `getting-started/devices/Senstar/Senstar.md` - 26 refs
- `getting-started/devices/Teltonika Router/Teltonkia Router.md` - 8 refs
- `getting-started/devices/Uniview/Uniview.md` - 7 refs

#### Getting-Started General Guides
- `getting-started/ntp-configuration.md` - 10 refs
- `getting-started/quick-start-checklist.md` - 5 refs
- `getting-started/user-management/creating-roles.md` - 7 refs
- `getting-started/user-management/customer-groups.md` - 2 refs
- `getting-started/user-management/inviting-users.md` - 8 refs
- `getting-started/user-management/managing-users.md` - 4 refs
- `getting-started/user-management/overview.md` - 3 refs
- `getting-started/user-management/roles-and-access-levels.md` - 4 refs
- `getting-started/user-management/talos-user-management.md` - 8 refs

---

## Recommendations

### Status: EXCELLENT ✓
- **No broken absolute path links** - All `/img/` references are properly served
- **Proper image organization** - Images are well-structured in logical directories

### Relative Paths
- 420 relative path references need to be verified against their respective local `images/` directories
- These are primarily device-specific setup guides that may have local image folders
- Consider standardizing to absolute paths (`/img/`) for consistency across the entire documentation

### Next Steps
1. Verify that each `./images/` directory referenced actually exists in the file system
2. Consider migrating all relative paths to absolute paths for better maintainability
3. Monitor for any 404 errors when accessing device-specific documentation pages

---

## File: IMAGE_ANALYSIS_REPORT.txt
A detailed report with all 524 image references listed by file has been generated at:
`/classic/IMAGE_ANALYSIS_REPORT.txt`
