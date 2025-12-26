---
title: "Milestone VMS Overview"
description: "Integration guide for Milestone VMS with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:milestone
sidebar_position: 1
last_updated: 2025-12-20
---

# Milestone VMS

**Device Information:**
- **Device**: VMS (Video Management System)
- **Vendor**: Milestone Systems
- **Model**: XProtect (Express, Essential, Professional, Expert, Corporate)
- **Firmware**: XProtect 2020 R1 or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Enterprise VMS with GCXONE cloud integration for multi-site security monitoring and advanced analytics.
- **Outcome**: Cloud connectivity with live streaming, playback, PTZ, alarms, I/O integration, and timeline view.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 45-60 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | SDK-based (MIP SDK / Mobile Server) |
| **Platform Support** | Windows only |
| **Editions** | Express, Essential, Professional, Expert, Corporate |
| **Ports Required** | HTTPS 443, HTTP 8081 (Mobile Server), RTSP 554 |
| **Key Features** | Cloud + local streaming, analytics, alarms, PTZ, I/O |
| **Firmware** | XProtect 2020 R1 or higher |
| **Scalability** | Unlimited cameras (license-dependent) |
| **Integration Type** | SDK-based via Mobile Server |

## Prerequisites

Before you begin, ensure you have:

- [ ] Milestone XProtect VMS (2020 R1 or higher) installed on Windows server
- [ ] Administrative access to Milestone Management Client
- [ ] Network connectivity between Milestone server and GCXONE platform (direct internet or VPN)
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for Milestone server (recommended)
- [ ] Firewall configured to allow outbound HTTPS (port 443) and RTSP (port 554)
- [ ] Valid Milestone XProtect license (supports required number of cameras)
- [ ] Cameras configured and recording in Milestone

## Device Profile

- **Type**: VMS (Video Management System)
- **Discovery Protocol**: SDK-based integration (MIP SDK / Mobile Server)
- **Event Types**: Motion detection, video analytics, tampering, audio detection, I/O triggers, alarms, system events, camera disconnection, storage alerts
- **Network Requirements**:
  - **Ports**: HTTPS (443), HTTP (8081 - Mobile Server), RTSP (554)
  - **Connectivity**: Direct IP with internet access (cloud integration via Mobile Server)
  - **Bandwidth**: 2-10 Mbps per camera stream (varies by resolution and quality)
- **Known Considerations**:
  - Requires Windows-based server installation
  - Mobile Server must be enabled for cloud integration
  - License-based camera and feature limits
  - Supports enterprise-scale deployments with hundreds of cameras
  - Advanced alarm management and rule engine integration
  - Milestone Smart Client not required for GCXONE integration
  - Event-driven architecture with comprehensive I/O support
  - Analytics integration with third-party systems

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | SDK-based server discovery via Mobile Server |
| | Manual Configuration | ✓ | IP-based configuration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Multiple streams per camera via Mobile Server |
| | Playback (Cloud) | ✓ | Cloud-based video playback |
| | Timeline (Cloud) | ✓ | Event timeline view with bookmarks |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| | Local SDK Audio | ✓ | Bidirectional audio support |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, I/O triggers, rules |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| | Event Acknowledgement | ✓ | Alarm acknowledgement workflow |
| | Alarm Management | ✓ | Advanced alarm configuration and routing |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets and patterns |
| | I/O Control | ✓ | Digital input/output triggers and automation |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✓ | Supports 4K and ultra-high resolution cameras |
| | Timelapse | ✓ | Historical video review |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| | Video Analytics | ✓ | Milestone and third-party analytics integration |
| | Multi-Site Management | ✓ | Manage multiple Milestone installations |
| | Rules Engine Integration | ✓ | Milestone rules trigger GCXONE actions |
| | Bookmarks | ✓ | Event bookmarking and searching |

**Integration Highlights:**
- Enterprise-grade VMS integration with comprehensive feature set
- Both cloud and local streaming capabilities for maximum flexibility
- Advanced PTZ control with presets, patterns, and tours
- Comprehensive I/O integration for alarm triggers and automation
- Advanced alarm management with acknowledgement workflow
- Genesis Audio (SIP) for two-way communication
- Mobile app access for remote monitoring
- Event-driven workflows with Milestone rules engine
- Support for Milestone and third-party video analytics
- Timeline with bookmarks for incident investigation
- Multi-server and federated architecture support
- High availability and failover support

## Quick Start

To configure Milestone XProtect VMS with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure Milestone server has internet access and can reach GCXONE cloud platform
2. **Enable Mobile Server** - Configure and enable Milestone Mobile Server for cloud integration
3. **Configure Milestone Settings** - Set up network settings, enable required services, configure users and permissions
4. **Configure Alarm Management** - Set up I/O triggers, alarm definitions, and rule-based automation (optional but recommended)
5. **Add to GCXONE Platform** - Log into GCXONE and add the Milestone server using IP address and credentials
6. **Configure Cameras and Events** - Map cameras, configure event rules, and verify live streaming and event detection
7. **Test Integration** - Verify live streaming, playback, PTZ control, alarms, and event forwarding work correctly

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Milestone VMS Configuration](./configuration.md)
- [Milestone VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Milestone VMS integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
