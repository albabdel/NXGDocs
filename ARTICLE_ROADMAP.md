---
id: documentation-roadmap
title: Documentation Roadmap
sidebar_label: 🗺️ Roadmap
slug: /roadmap
---

# 🗺️ NXGEN GCXONE Documentation Roadmap

This document serves as a comprehensive inventory and roadmap of all **338+** documentation articles within the NXGEN GCXONE codebase. It is designed to guide technical writers through the content structure, categorized by Page, Folders, and Articles.

---

## 🚀 Getting Started
*Found in `classic/docs/getting-started`*

- [ ] **Core Concepts**
    - [ ] What is NXGEN GCXONE? (`what-is-nxgen-gcxone.md`)
    - [ ] What is evalink talos? (`what-is-evalink-talos.md`)
    - [ ] GCXONE & Talos Interaction (`gcxone-talos-interaction.md`)
    - [ ] Key Benefits (`key-benefits.md`)
    - [ ] Cloud Architecture (`cloud-architecture.md`)
- [ ] **Network Requirements**
    - [ ] Required Ports (`required-ports.md`)
    - [ ] IP Whitelisting (`ip-whitelisting.md`)
    - [ ] Firewall Configuration (`firewall-configuration.md`)
    - [ ] Bandwidth Requirements (`bandwidth-requirements.md`)
    - [ ] NTP Configuration (`ntp-configuration.md`)
- [ ] **Onboarding**
    - [ ] First Time Login (`first-time-login.md`)
    - [ ] Password Management (`password-management.md`)
    - [ ] Quick Start Checklist (`quick-start-checklist.md`)

---

## 🏛️ Platform Fundamentals
*Found in `classic/docs/platform-fundamentals`*

- [ ] **Architecture**
    - [ ] Microservices Architecture (`microservices-architecture.md`)
    - [ ] Proxy Architecture (`proxy-architecture.md`)
- [ ] **Core Concepts**
    - [ ] Device Protocols (`device-protocols.md`)
    - [ ] Hierarchy Model (`hierarchy-model.md`)
    - [ ] Multi-tenant Architecture (`multi-tenant.md`)
- [ ] **System Workflows**
    - [ ] Alarm Flow (`alarm-flow.md`)
    - [ ] Site Synchronization (`site-synchronization.md`)
    - [ ] Event Processing (`event-processing.md`)
    - [ ] Token Configuration (`token-configuration.md`)
    - [ ] System Health Overview (`system-health-overview.md`)

---

## ⚙️ Admin & Configuration
*Found in `classic/docs/admin-guide`*

- [ ] **Dashboard & Analytics**
    - [ ] Dashboard Overview (`dashboard-overview.md`)
    - [ ] Active Sites Widget (`active-sites-widget.md`)
    - [ ] Alarm Volume Analytics (`alarm-volume-analytics.md`)
    - [ ] Device Health Status (`device-health-status.md`)
- [ ] **Management**
    - [ ] Creating Customers (`creating-customers.md`)
    - [ ] Creating Sites (`creating-sites.md`)
    - [ ] Site Groups (`site-groups.md`)
    - [ ] Creating Users (`creating-users.md`)
- [ ] **Security & Settings**
    - [ ] Role-Based Access Control (RBAC) (`rbac.md`)
    - [ ] Permissions Matrix (`permissions-matrix.md`)
    - [ ] Custom Properties Overview (`custom-properties-overview.md`)
    - [ ] Custom Property Hierarchy (`custom-property-hierarchy.md`)
    - [ ] Event Clip Configuration (`event-clip-configuration.md`)
    - [ ] Timezone Management (`timezone-management.md`)

---

## 📱 Devices
*Found in `classic/docs/devices`*

### 🛠️ General Onboarding (`general/`)
- [ ] Onboarding Overview, Discovery Methods, Authentication, Health Monitoring, Troubleshooting Basics.

### 📦 Manufacturer Specific Guides
Each manufacturer folder follows a standard set of articles: **Overview, Admin Configuration, Installer Configuration, Operator View, Supported Features, Troubleshooting.**

- [ ] **ADPRO** (`devices/adpro/*`) - 6 Articles
- [ ] **Avigilon** (`devices/avigilon/*`) - 6 Articles
- [ ] **Axis** (`devices/axis/*`) - 6 Articles
- [ ] **Axxon** (`devices/axxon/*`) - 6 Articles
- [ ] **Camect** (`devices/camect/*`) - 6 Articles
- [ ] **Dahua** (`devices/dahua/*`) - 7 Articles (includes DoLynk)
- [ ] **GCXONE Audio** (`devices/gcxone-audio/*`) - 6 Articles
- [ ] **Hanwha** (`devices/hanwha/*`) - 6 Articles
- [ ] **Heitel** (`devices/heitel/*`) - 6 Articles
- [ ] **Hikvision** (`devices/hikvision/*`) - 6 Articles
- [ ] **InnoVi** (`devices/innovi/*`) - 6 Articles
- [ ] **Milestone** (`devices/milestone/*`) - 6 Articles
- [ ] **Reconeyez** (`devices/reconeyez/*`) - 6 Articles
- [ ] **Teltonika** (`devices/teltonika/*`) - 6 Articles

### 🔌 Generic Integration (`generic/`)
- [ ] ONVIF Integration, RTSP Configuration, Limitations.

---

## ✨ Features
*Found in `classic/docs/features`*

Each feature category contains: **Overview, Configuration, Troubleshooting.**

- [ ] **AI Analytics** (`features/ai-analytics/*`) - 3 Articles
- [ ] **Audio Detection** (`features/audio-detection/*`) - 3 Articles
- [ ] **Event Clips** (`features/event-clips/*`) - 3 Articles
- [ ] **Face Detection** (`features/face-detection/*`) - 3 Articles
- [ ] **Heat Mapping** (`features/heat-mapping/*`) - 3 Articles
- [ ] **Intrusion Detection** (`features/intrusion-detection/*`) - 3 Articles
- [ ] **License Plate Recognition** (`features/license-plate/*`) - 3 Articles
- [ ] **Line Crossing** (`features/line-crossing/*`) - 3 Articles
- [ ] **Live View** (`features/live-view/*`) - 3 Articles
- [ ] **Motion Detection** (`features/motion-detection/*`) - 3 Articles
- [ ] **People Counting** (`features/people-counting/*`) - 3 Articles
- [ ] **Playback** (`features/playback/*`) - 3 Articles
- [ ] **PTZ Control** (`features/ptz-control/*`) - 3 Articles
- [ ] **Tamper Detection** (`features/tamper-detection/*`) - 3 Articles
- [ ] **Video Streaming** (`features/video-streaming/*`) - 3 Articles

---

## 🚨 Alarm Management (Talos)
*Found in `classic/docs/alarm-management`*

- [ ] **Operations**
    - [ ] Talos Dashboard, Alarm Queue, Alarm Prioritization, Alarm Actions, Alarm History, Alarm Notifications.
- [ ] **Strategy & Rules**
    - [ ] Escalation Rules, Alarm Filtering, Alarm Routing, Alarm SLA, False Alarms, Alarm Verification.
- [ ] **Analytics & Training**
    - [ ] Alarm Metrics, Alarm Reporting, Alarm Troubleshooting, Alarm Best Practices, Operator Training, System Health.

---

## 📊 Reporting & Analytics
*Found in `classic/docs/reporting`*

- [ ] **Core Reports**
    - [ ] Reporting Overview, Standard Reports, Custom Reports, Compliance Reports.
- [ ] **Data Insights**
    - [ ] Device Activity, Alarm Statistics, User Activity, System Performance, Event Analytics, Trend Analysis.
- [ ] **Tools & Sharing**
    - [ ] Scheduled Reports, Report Export, Dashboard Widgets, Report Sharing, Report Troubleshooting.

---

## 🎧 Operator Guide
*Found in `classic/docs/operator-guide`*

- [ ] **Standard Operations**
    - [ ] Operator Dashboard, Handling Alarms, Live Video, Video Playback, PTZ Control, Event Clips.
- [ ] **Workflow & Procedures**
    - [ ] Site Navigation, Multi-site Monitoring, Response Procedures, Communication Tools, Shift Handover, Notes & Annotations, Emergency Procedures.
- [ ] **Performance & Training**
    - [ ] Performance Metrics, Best Practices, Shortcuts & Tips, Troubleshooting, Training Guide.

---

## 🔧 Installer Guide
*Found in `classic/docs/installer-guide`*

- [ ] **Pre-Installation**
    - [ ] Installation Overview, Site Survey, Network Setup, Bandwidth Planning, Storage Requirements.
- [ ] **Execution**
    - [ ] Device Installation, Camera Positioning, Network Configuration, Device Registration, Testing & Commissioning, Cable Management, Power Requirements, Environmental, Mounting Hardware.
- [ ] **Post-Installation**
    - [ ] Redundancy & Failover, Best Practices, Troubleshooting, Post-Installation, Maintenance Schedule, Certification.

---

## 🔍 Troubleshooting
*Found in `classic/docs/troubleshooting`*

- [ ] **Connectivity & Access**
    - [ ] Overview, Connection Issues, Login Problems, Device Offline, Network Connectivity, Firewall Issues, Certificate Errors.
- [ ] **Streaming & Media**
    - [ ] Video Streaming, Video Quality, Playback Issues, Clips Missing, Audio Problems.
- [ ] **Features & Performance**
    - [ ] PTZ Not Working, Performance Issues, Browser Compatibility, Mobile App.
- [ ] **System & Sync**
    - [ ] Time Sync, Storage Issues, API Issues.

---

## 📚 Knowledge Base & Resources
- [ ] **Knowledge Base** (`classic/docs/knowledge-base`)
    - [ ] FAQ, Glossary, Video Tutorials, Quick Reference, System Requirements, Browser Requirements, Network Requirements, Security Best Practices, Backup & Recovery, Compliance, Data Privacy, API Documentation, Integration Guides, Migration Guides, Performance Optimization.
- [ ] **Release Notes** (`classic/docs/release-notes`)
    - [ ] Latest, v3.0, v2.9, v2.8, v2.7, v2.6, Deprecated, Upgrade Guide, Breaking Changes, Roadmap.
- [ ] **Support** (`classic/docs/support`)
    - [ ] Contact Support, Ticket System, Support SLA, Training Resources, Certification, Community Forum, Partner Program, Professional Services, System Status, Feedback.

---

## 🚧 Uncategorized / Root Content (Pending Migration)
*These items are located in the root directories and represent the ~430+ files discovered in `classic/_migrated_content` and root folders.*

- [ ] **Legacy Migrated Content** (`classic/_migrated_content/*`) - ~430 Files
- [ ] **Root Devices** (`/devices/*`) - Ajax, EagleEye, Ganz, Senstar, Uniview.
- [ ] **Root Features** (`/features/*`) - Bulk Import, Custom View, Health Check, Time Sync, Zen Mode.

---

> [!IMPORTANT]
> This roadmap now tracks **307 articles** in the main documentation and prepares for the integration of **430+ legacy/migrated files**.
