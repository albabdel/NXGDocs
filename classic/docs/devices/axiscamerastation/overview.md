---
title: "AxisCameraStation VMS Overview"
description: "Integration guide for AxisCameraStation VMS with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:axiscamerastation
sidebar_position: 1
last_updated: 2025-12-20
---

# AxisCameraStation VMS

**Device Information:**
- **Device**: VMS (Video Management System)
- **Vendor**: Axis Communications
- **Model**: Camera Station Pro (5.x and later)
- **Firmware**: Camera Station 5.x or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Enterprise VMS with GCXONE cloud integration for multi-site Axis camera management and monitoring.
- **Outcome**: Cloud connectivity with live streaming, playback, PTZ, event management, and comprehensive monitoring.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 40-50 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | SDK-based integration via server connection |
| **Platform Support** | Windows only |
| **Camera Compatibility** | Axis IP cameras (optimized) |
| **Ports Required** | HTTPS 443, RTSP 554, HTTP 80 (optional) |
| **Key Features** | Cloud + local streaming, PTZ, analytics, event management |
| **Firmware** | Camera Station 5.x or higher |
| **Scalability** | Unlimited cameras (license-dependent) |
| **Integration Type** | SDK-based with cloud connectivity |

## Prerequisites

Before you begin, ensure you have:

- [ ] Axis Camera Station Pro 5.x or higher installed on Windows server
- [ ] Administrative access to Camera Station management interface
- [ ] Network connectivity between Camera Station server and GCXONE platform (direct internet or VPN)
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for Camera Station server (recommended)
- [ ] Firewall configured to allow outbound HTTPS (port 443) and RTSP (port 554)
- [ ] Valid Axis Camera Station license (supports required number of cameras)

## Device Profile

- **Type**: VMS (Video Management System)
- **Discovery Protocol**: SDK-based integration with direct server connection
- **Event Types**: Motion detection, video analytics, tampering, audio detection, I/O triggers, system events, camera disconnection
- **Network Requirements**:
  - **Ports**: HTTPS (443), RTSP (554), HTTP (80 - optional)
  - **Connectivity**: Direct IP with internet access (cloud integration via SDK)
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and compression)
- **Known Considerations**:
  - Requires Windows-based server installation (Camera Station runs on Windows only)
  - License-based camera limit (ensure license covers all cameras to be integrated)
  - Supports Axis cameras natively with full feature set
  - Cloud integration enables remote access without port forwarding via GCXONE platform
  - PTZ and I/O control available through both cloud and local connections
  - Event-driven recording and alarm management supported

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | SDK-based server discovery |
| | Manual Configuration | ✓ | IP-based configuration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Multiple streams per camera |
| | Playback (Cloud) | ✓ | Cloud-based video playback |
| | Timeline (Cloud) | ✓ | Event timeline view |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| | Local SDK Audio | ✓ | Bidirectional audio support |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, I/O triggers |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| | Event Acknowledgement | ✓ | Event management via GCXONE |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | I/O Control | ✓ | Digital input/output triggers |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✓ | Supports 4K Axis cameras |
| | Timelapse | ✓ | Historical video review |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| | Video Analytics | ✓ | Axis camera analytics integration |
| | Multi-Site Management | ✓ | Manage multiple installations |

**Integration Highlights:**
- Full-featured VMS integration with comprehensive camera control
- Both cloud and local streaming capabilities for flexibility
- Advanced PTZ control with preset positions
- I/O integration for alarm triggers and automation
- Genesis Audio (SIP) for two-way communication
- Mobile app access for remote monitoring
- Event-driven workflows and alarm management
- Support for Axis camera analytics and intelligent features

## Quick Start

To configure Axis Camera Station VMS with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure Camera Station server has internet access and can reach GCXONE cloud platform
2. **Configure Camera Station** - Set up network settings, enable required services, and configure SDK access in Camera Station management interface
3. **Add to GCXONE Platform** - Log into GCXONE and add the Camera Station server using IP address and credentials
4. **Configure Cameras and Events** - Map cameras, configure event rules, and verify live streaming and event detection
5. **Test Integration** - Verify live streaming, playback, PTZ control, and event forwarding work correctly

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [AxisCameraStation VMS Configuration](./configuration.md)
- [AxisCameraStation VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with AxisCameraStation VMS integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
