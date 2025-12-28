# Unmapped Buttons and Cards - Complete Inventory

This document lists all buttons and cards across all pages that are not mapped to specific articles.

## Main Landing Page (`/`)

### Popular Devices Section
**Section Title:** "Popular Devices"  
**Subtitle:** "Commonly integrated hardware devices"

All three cards link to the generic onboarding process instead of device-specific articles:

1. **IP Cameras**
   - Description: "HD surveillance cameras with alarm integration"
   - Current Link: `/docs/device-integration/standard-device-onboarding-process`
   - Status: ❌ Not mapped to specific IP Cameras article

2. **Alarm Panels**
   - Description: "Connect security panels to GCXONE"
   - Current Link: `/docs/device-integration/standard-device-onboarding-process`
   - Status: ❌ Not mapped to specific Alarm Panels article

3. **IoT Sensors**
   - Description: "Temperature, motion, and environmental sensors"
   - Current Link: `/docs/device-integration/standard-device-onboarding-process`
   - Status: ❌ Not mapped to specific IoT Sensors article

### Help & Resources Section
**Section Title:** "Need Help?"  
**Subtitle:** "Additional resources and support"

1. **Video Tutorials**
   - Description: "How-to videos for all user levels"
   - Current Link: `/docs/platform-fundamentals/what-is-gcxone-GCXONE` (WRONG LINK)
   - Status: ❌ Should link to `/docs/knowledge-base/video-tutorials` or similar

2. **Release Notes**
   - Description: "Latest updates and releases"
   - Current Link: `/docs/platform-fundamentals/what-is-gcxone-GCXONE` (WRONG LINK)
   - Status: ❌ Should link to `/docs/release-notes/latest` or `/docs/release-notes/`

---

## Integration Hub Page (`/integration-hub`)

### Device Cards
All device cards link to `/docs/devices/{device}/overview` format. These may or may not exist. The following devices are listed:

**NVR Devices:**
- Adpro NVR → `/docs/devices/adpro/overview`
- Hikvision(NVR) NVR → `/docs/devices/hikvision/overview`
- Dahua NVR → `/docs/devices/dahua/overview`
- SPYKEBOX NVR → `/docs/devices/spykebox/overview`
- Hanwha-Techwin NVR → `/docs/devices/hanwha/overview`
- Heitel NVR → `/docs/devices/heitel/overview`
- Uniview NVR → `/docs/devices/uniview/overview`
- Honeywell 35 Series NVR → `/docs/devices/honeywell/overview`
- Ajax Hub/NVR → `/docs/devices/ajax/overview`
- SenStar NVR → `/docs/devices/senstar/overview`
- ENEO NVR → `/docs/devices/eneo/overview`
- ENEOIP NVR → `/docs/devices/eneoip/overview`
- Miwi Urmet (Polish) NVR/IP Camera → `/docs/devices/miwi/overview`

**VMS Devices:**
- NXWitness → `/docs/devices/nxwitness/overview`
- HANWHA → `/docs/devices/hanwha/overview`
- DigitalWatchdog → `/docs/devices/digitalwatchdog/overview`
- GenesisVms → `/docs/devices/genesisvms/overview`
- Avigilon VMS → `/docs/devices/avigilon/overview`
- Axxon VMS → `/docs/devices/axxon/overview`
- Milestone VMS → `/docs/devices/milestone/overview`
- AxisCameraStation VMS → `/docs/devices/axiscamerastation/overview`
- AXIS CS Pro VMS → `/docs/devices/axiscspro/overview`
- Geutebrück VMS → `/docs/devices/geutebruck/overview`

**IP Camera Devices:**
- Hikvision(IPCamera) IPC → `/docs/devices/hikvision/overview`
- Axis IP Camera → `/docs/devices/axis/overview`
- NetVue IP Camera → `/docs/devices/netvue/overview`
- Onvif IP Camera → `/docs/devices/onvif/overview`
- Mobotix IP Camera → `/docs/devices/mobotix/overview`

**AI Box Devices:**
- Camect AI BOX → `/docs/devices/camect/overview`
- Ganz AI BOX → `/docs/devices/ganz/overview`
- Davantis AI BOX → `/docs/devices/davantis/overview`

**Cloud VMS Devices:**
- Hikpro P2P Cloud VMS → `/docs/devices/hikpro/overview`
- Dahua Dolync Cloud P2P Cloud VMS → `/docs/devices/dahua/dolynk-setup`
- NXGCloudNVR → `/docs/devices/nxgcloudnvr/overview`
- NXG Cloud Vision Edge → `/docs/devices/nxgcloudvisionedge/overview`
- Viasys/ShieldBox Cloud NVR → `/docs/devices/viasys/overview`

**Router Devices:**
- Teltonika Router → `/docs/devices/teltonika/overview`
- EFOY Router → `/docs/devices/efoy/overview`
- Victron Router → `/docs/devices/victron/overview`

**IoT Devices:**
- AJAX PIR CAM → `/docs/devices/ajax/overview`
- Essence My Sheild PIR CAM → `/docs/devices/essence/overview`
- Reconeyez PIR Cam → `/docs/devices/reconeyez/overview`
- Innovi AI Cloud → `/docs/devices/innovi/overview`
- Rosenberger IOT battery Mgmt → `/docs/devices/rosenberger/overview`
- Autoaid IOT → `/docs/devices/autoaid/overview`
- Auraigateway IOT Mining → `/docs/devices/auraigateway/overview`

**Other Devices:**
- GenesisAudio SIP Twillio → `/docs/devices/genesisaudio/overview`

**Status:** ⚠️ Need to verify which of these device overview articles actually exist

---

## Device Monitoring Page (`/device-monitoring`)

### Feature Cards with "Learn more" Links
All feature cards have "Learn more" links. The following features may not have corresponding articles:

**Real-Time Health Monitoring:**
1. Device Health Status Dashboard → `/docs/admin-guide/device-health-status`
2. Connectivity Monitoring → `/docs/devices/general/health-monitoring`
3. Heartbeat Detection → `/docs/devices/general/health-monitoring`
4. Device Status Indicators → `/docs/admin-guide/device-health-status`
5. Multi-Site Health Overview → `/docs/admin-guide/device-health-status`

**Device Diagnostics:**
6. System Diagnostics → `/docs/devices/general/troubleshooting-basics`
7. Connection Quality Metrics → `/docs/devices/general/health-monitoring`
8. Event Reception Rate → `/docs/devices/general/health-monitoring`
9. Device Logs & History → `/docs/troubleshooting/device-offline`

**Performance Monitoring:**
10. Video Stream Quality Monitoring → `/docs/troubleshooting/video-streaming`
11. Storage Capacity Monitoring → `/docs/troubleshooting/storage-issues`
12. CPU & Memory Utilization → `/docs/devices/general/health-monitoring`
13. Temperature & Environmental Monitoring → `/docs/devices/general/health-monitoring`
14. Bandwidth Usage Tracking → `/docs/troubleshooting/performance-issues`

**Alerts & Notifications:**
15. Device Offline Alerts → `/docs/troubleshooting/device-offline`
16. Health Alert Rules → `/docs/devices/general/health-monitoring`
17. Proactive Maintenance Alerts → `/docs/installer-guide/maintenance-schedule`

**Configuration & Management:**
18. Remote Device Configuration → `/docs/installer-guide/device-installation`
19. Firmware Version Management → `/docs/devices/general/health-monitoring`
20. Device Registration & Onboarding → `/docs/installer-guide/device-registration`
21. Device Grouping & Organization → `/docs/admin-guide/site-groups`

**Reporting & Analytics:**
22. Device Health Reports → `/docs/reporting/device-activity`
23. Uptime & Availability Metrics → `/docs/reporting/device-activity`
24. Historical Performance Trends → `/docs/reporting/system-performance`
25. Device Activity Analytics → `/docs/reporting/device-activity`

**Troubleshooting & Support:**
26. Automated Troubleshooting → `/docs/devices/general/troubleshooting-basics`
27. Connection Troubleshooting → `/docs/troubleshooting/connection-issues`
28. Device Reset & Recovery → `/docs/troubleshooting/device-offline`

**Status:** ⚠️ Need to verify which of these articles actually exist

### Quick Start Resources Section
1. Device Health Dashboard → `/docs/admin-guide/device-health-status`
2. Connection Troubleshooting → `/docs/troubleshooting/connection-issues`
3. Setup Health Alerts → `/docs/devices/general/health-monitoring`

---

## Alarm Management Page (`/alarm-management`)

### Feature Cards with "Learn more" Links
All feature cards have "Learn more" links. The following features may not have corresponding articles:

**Core Processing:**
1. Real-Time Alarm Queue → `/docs/alarm-management/alarm-queue`
2. Alarm Prioritization → `/docs/alarm-management/alarm-prioritization`
3. Alarm Actions → `/docs/alarm-management/alarm-actions`
4. Alarm Verification → `/docs/alarm-management/alarm-verification`
5. Alarm Filtering → `/docs/alarm-management/alarm-filtering`

**Routing & Escalation:**
6. Alarm Routing Rules → `/docs/alarm-management/alarm-routing`
7. Escalation Rules → `/docs/alarm-management/escalation-rules`
8. Multi-Site Alarm Management → `/docs/alarm-management/multi-site-alarms`

**Notifications & Integration:**
9. Alarm Notifications → `/docs/alarm-management/alarm-notifications`
10. Third-Party Integration → `/docs/alarm-management/alarm-integration`

**Analytics & Reporting:**
11. Alarm History → `/docs/alarm-management/alarm-history`
12. Alarm Metrics → `/docs/alarm-management/alarm-metrics`
13. Alarm Reporting → `/docs/alarm-management/alarm-reporting`
14. SLA Monitoring → `/docs/alarm-management/alarm-sla`

**Optimization & Training:**
15. False Alarm Management → `/docs/alarm-management/false-alarms`
16. Operator Training → `/docs/alarm-management/operator-training`
17. Alarm Best Practices → `/docs/alarm-management/alarm-best-practices`

**System Health & Performance:**
18. System Health Monitoring → `/docs/alarm-management/system-health`
19. Troubleshooting Guide → `/docs/alarm-management/alarm-troubleshooting`

**Status:** ⚠️ Need to verify which of these articles actually exist

### Quick Start Resources Section
1. Alarm Queue Dashboard → `/docs/alarm-management/alarm-queue`
2. Setup Routing Rules → `/docs/alarm-management/alarm-routing`
3. Operator Training → `/docs/alarm-management/operator-training`

---

## User Management Page (`/user-management`)

### Feature Cards with "Learn more" Links
All feature cards have "Learn more" links. The following features may not have corresponding articles:

**Role Management:**
1. Role-Based Access Control (RBAC) → `/docs/admin-guide/rbac`
2. Creating Custom Roles → `/docs/admin-guide/creating-users`
3. Access Levels → `/docs/admin-guide/rbac`
4. Privilege Configuration → `/docs/admin-guide/rbac`
5. Session Timeout Management → `/docs/admin-guide/rbac`

**User Administration:**
6. User Invitation System → `/docs/admin-guide/creating-users`
7. Multi-Organization Access → `/docs/admin-guide/creating-users`
8. User Status Management → `/docs/admin-guide/creating-users`
9. Bulk User Operations → `/docs/admin-guide/creating-users`

**Customer Groups:**
10. Customer Groups → `/docs/admin-guide/creating-customers`
11. Customer Group Configuration → `/docs/admin-guide/creating-customers`
12. Data Segregation → `/docs/admin-guide/creating-customers`
13. Production/Test Environment Separation → `/docs/admin-guide/creating-customers`

**Permissions & Security:**
14. Permissions Matrix → `/docs/admin-guide/permissions-matrix`
15. Password Policies → `/docs/getting-started/password-management`
16. Two-Factor Authentication (2FA) → `/docs/getting-started/password-management`
17. Single Sign-On (SSO) → `/docs/getting-started/first-time-login`

**Operator Management:**
18. Operator Privilege Adjustment → `/docs/admin-guide/adjust-user-operator-privileges`
19. Operator Groups & Alarm Routing → `/docs/admin-guide/adjust-user-operator-privileges`

**Monitoring & Audit:**
20. User Activity Logging → `/docs/reporting/user-activity`
21. User Analytics → `/docs/reporting/user-activity`
22. Access Reports → `/docs/reporting/user-activity`

**Status:** ⚠️ Need to verify which of these articles actually exist

### Quick Start Resources Section
1. Create Your First Role → `/docs/admin-guide/rbac`
2. Invite New Users → `/docs/admin-guide/creating-users`
3. Setup Customer Groups → `/docs/admin-guide/creating-customers`

---

## Getting Started Page (`/getting-started`)

### Video Placeholders
All video cards are placeholders without actual video content or article links:

1. **GCXONE Product Overview** (5:30)
   - Description: "Discover what GCXONE can do for your security operations and why leading companies trust our platform."
   - Status: ❌ No video source or article link

2. **Platform Walkthrough** (8:45)
   - Description: "A complete tour of the GCXONE interface, navigation, and key features you'll use daily."
   - Video Source: `/videos/platform-walkthrough.mp4`
   - Status: ⚠️ Video may not exist, no article link

3. **Key Features & Value** (6:15)
   - Description: "Learn how GCXONE's powerful features deliver real value and transform your monitoring operations."
   - Video Source: `/videos/key-features-value.mp4`
   - Status: ⚠️ Video may not exist, no article link

4. **First-Time Login & Setup** (4:20)
   - Description: "Step-by-step guide to your first login, password setup, and MFA configuration."
   - Video Source: `/videos/first-time-login-setup.mp4`
   - Status: ⚠️ Video may not exist, no article link

5. **Dashboard Deep Dive** (7:00)
   - Description: "Master the dashboard widgets, customization options, and real-time monitoring capabilities."
   - Video Source: `/videos/dashboard-deep-dive.mp4`
   - Status: ⚠️ Video may not exist, no article link

### Feature Deep Dives Section
All video cards are placeholders without article links:

6. **Alarm Management System** (9:30)
   - Description: "Complete guide to receiving, processing, and handling alarms efficiently in GCXONE."
   - Status: ❌ No video source or article link

7. **Device Integration** (11:20)
   - Description: "Learn how to connect cameras, sensors, and alarm panels to your GCXONE instance."
   - Status: ❌ No video source or article link

8. **User & Permission Management** (6:45)
   - Description: "Set up user accounts, configure roles, and manage access permissions effectively."
   - Status: ❌ No video source or article link

9. **Reporting & Analytics** (8:15)
   - Description: "Generate reports, analyze trends, and extract insights from your monitoring data."
   - Status: ❌ No video source or article link

10. **CMS Integration Setup** (10:00)
    - Description: "Configure connections to Talos, external CMS platforms, and third-party systems."
    - Status: ❌ No video source or article link

11. **Troubleshooting Common Issues** (7:30)
    - Description: "Quick solutions for the most common problems operators and admins encounter."
    - Status: ❌ No video source or article link

### Additional Resources Section
1. **Help Center** → `/docs/support`
   - Status: ⚠️ May need to verify if this index page exists

2. **Release Notes** → `/docs/release-notes`
   - Status: ✅ Should exist (index page)

3. **Troubleshooting** → `/docs/troubleshooting`
   - Status: ⚠️ May need to verify if this index page exists

---

## Device Integration Page (`/quick-start/device-integration`)

### Quick Start Guides Section
All guides link to device overview pages that may or may not exist:

1. **Hikvision NVR Setup** → `/docs/devices/hikvision/overview`
2. **Axis Camera Integration** → `/docs/devices/axis/overview`
3. **Camect AI Box** → `/docs/devices/camect/overview`
4. **Ajax IoT Sensors** → `/docs/devices/ajax/overview`

**Status:** ⚠️ Need to verify which of these device overview articles actually exist

---

## Towers Page (`/towers`)

### Related Resources Section
1. **Getting Started** → `/getting-started` (page, not article)
2. **Full Documentation** → `/docs/getting-started/Towers/Towers`
3. **Network Configuration** → `/docs/getting-started/required-ports`

**Status:** ⚠️ Need to verify if Towers article exists at specified path

---

## Summary

### Critical Issues (Wrong Links)
- **Video Tutorials** on main page → Wrong link
- **Release Notes** on main page → Wrong link

### High Priority (Generic Links)
- **Popular Devices** section (3 cards) → All link to generic onboarding instead of device-specific articles
- **50+ Device Cards** in Integration Hub → Need verification of article existence

### Medium Priority (Feature Cards)
- **28 Device Monitoring features** → Need verification
- **19 Alarm Management features** → Need verification
- **22 User Management features** → Need verification

### Low Priority (Video Placeholders)
- **11 Video placeholders** on Getting Started page → No article links

---

## Recommended Actions

1. **Fix wrong links immediately:**
   - Video Tutorials → `/docs/knowledge-base/video-tutorials`
   - Release Notes → `/docs/release-notes/latest`

2. **Create device-specific articles for Popular Devices:**
   - IP Cameras article
   - Alarm Panels article
   - IoT Sensors article

3. **Verify and create missing device overview articles** for Integration Hub

4. **Verify and create missing feature articles** for Device Monitoring, Alarm Management, and User Management pages

5. **Add article links to video placeholders** on Getting Started page

