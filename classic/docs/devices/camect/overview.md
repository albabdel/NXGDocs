---
title: "Camect AI Box Overview"
description: "Integration guide for Camect AI-powered smart hub with intelligent object detection and event management"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:camect
sidebar_position: 1
last_updated: 2025-12-21
---

# Camect AI Box

**Device Information:**
- **Device**: AI Box (Smart Hub/NVR)
- **Vendor**: Camect
- **Model**: Camect Hub
- **Firmware**: Latest stable version
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: AI-powered smart hub adding intelligent object detection and event filtering to existing camera infrastructure.
- **Outcome**: Cloud integration with AI-driven alerts, live streaming, PTZ control, Genesis Audio, and arm/disarm modes.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 20-30 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | Manual configuration via Camect UI and GCXONE |
| **Protocol** | RTSP, HTTP/HTTPS API, NXGEN monitoring protocol |
| **Integration Type** | API-based with NXGEN monitoring service |
| **Ports Required** | HTTP/HTTPS 80/443, RTSP 554, Custom TCP (NXGEN) |
| **Key Features** | AI object detection, event filtering, live streaming, PTZ, Genesis Audio |
| **AI Capabilities** | Person, vehicle, animal detection with intelligent alert filtering |
| **User Management** | Granular permission control for integration users |
| **Notable Feature** | Substream support for smooth live viewing without stutter |

## Prerequisites

Before you begin, ensure you have:

- [ ] Network connectivity with reachable IP address
- [ ] Correct VLAN and port configuration (80/443/554/RTSP/TCP)
- [ ] Administrative access to Camect UI
- [ ] GCXONE account with device configuration permissions
- [ ] NTP enabled with time zone matching GCXONE
- [ ] IP allowlist updated (if site uses whitelisting)
- [ ] NXGEN monitoring credentials (Site ID and TCP address from support)

## Device Profile

- **Type**: AI Box (Smart Hub/NVR) - Intelligent Video Analytics
- **Discovery Protocol**: Manual registration via HTTP API
- **Event Types**: AI object detection (person, vehicle, animal), motion detection, camera tampering, camera disconnection, alert acknowledgement
- **Network Requirements**:
  - **Ports**: HTTP (80), HTTPS (443), RTSP (554), NXGEN TCP (custom)
  - **Connectivity**: Direct IP with API access
  - **Bandwidth**: 1-4 Mbps per camera stream (substream recommended)
- **Known Considerations**:
  - **NXGEN monitoring required** - Configure Site ID and TCP address for event forwarding
  - **Dedicated user account** - Create least-privilege user for GCXONE (not admin)
  - **Alert detection mandatory** - Must enable "Detect alerts" in hub settings
  - **Camera-by-camera forwarding** - Add each camera individually to NXGEN monitoring
  - **Substream recommended** - Enable substream (set to 1) to prevent live view stutter
  - **Time synchronization critical** - NTP must be enabled with matching time zone
  - **Granular permissions** - User requires: live view, query cameras, PTZ, view alerts, view footage, share cameras, change operating modes
  - **AI object detection** - Intelligent filtering reduces false alarms
  - **Operating modes** - Arm/disarm functionality for schedule-based monitoring
  - **PTZ support** - Full pan, tilt, zoom with preset management

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | API-based sensor discovery |
| | Manual Configuration | ✓ | IP-based with credentials |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud-based streaming via GCXONE |
| | Events | ✓ | AI-driven object detection events |
| **Events & Alarms** | Event Detection | ✓ | AI person/vehicle/animal detection |
| | Event Acknowledgement | ✓ | Mark events as reviewed |
| | Arm/Disarm | ✓ | Operating mode management |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | AI Object Detection | ✓ | Person, vehicle, animal classification |
| | Intelligent Alert Filtering | ✓ | Reduces false alarms via AI |
| | Substream Support | ✓ | Smooth live viewing (recommended) |
| | NXGEN Monitoring | ✓ | Event forwarding to GCXONE |
| | User Permission Management | ✓ | Granular access control |
| | Operating Modes | ✓ | Schedule-based arm/disarm |
| | Camera Health Monitoring | ✓ | Connection status tracking |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **AI-powered object detection** - Person, vehicle, animal classification with intelligent filtering
- **NXGEN monitoring service** - Event forwarding via Site ID and TCP address configuration
- **False alarm reduction** - AI filtering significantly reduces nuisance alerts
- **Substream optimization** - Enable secondary stream for smooth live viewing
- **Dedicated user security** - Least-privilege account with granular permissions
- **PTZ control** - Full pan, tilt, zoom with preset management
- **Genesis Audio (SIP)** - Two-way audio communication support
- **Operating modes** - Arm/disarm for schedule-based monitoring
- **Event acknowledgement** - Mark events as reviewed for workflow management
- **Time synchronization** - NTP-based with time zone matching
- **Camera-specific monitoring** - Granular control over which cameras forward events
- **API-based integration** - RESTful API for seamless GCXONE connectivity

## Quick Start

To configure Camect AI Box with GCXONE:

1. **Create Dedicated User** - Create local user (e.g., "NXG") with permissions: live view, query cameras, PTZ, view alerts, view footage, share cameras, change operating modes
2. **Configure Time/NTP** - Set time zone to match GCXONE and enable NTP
3. **Enable RTSP** - Ensure RTSP is enabled on hub
4. **Configure Alert Detection** - Enable "Detect alerts" and select object types (person, vehicle, animal)
5. **Setup NXGEN Monitoring** - Add Monitoring → NXGEN with Site ID and TCP address (provided by NXGEN support)
6. **Add Cameras to Monitoring** - Click "Add camera" for each camera to forward events
7. **Enable Substream** - Change substream from 0 to 1 for smooth live viewing (recommended)
8. **Add to GCXONE** - Register Camect in GCXONE using host/serial, username, password, ports, and time zone
9. **Verify Integration** - Test alert forwarding, live view, PTZ presets, and time synchronization

**Estimated setup time: 20-30 minutes**

For detailed step-by-step instructions with screenshots, see the [Installer Configuration Guide](./installer-configuration.md).

## Related Articles

- [Camect Installer Configuration](./installer-configuration.md)
- [Camect Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [NTP Configuration](/docs/getting-started/ntp-configuration)

## Change Log

- 2025-12-21 v1.0.0 - Comprehensive GCXONE documentation

---

**Need Help?**

If you need assistance with Camect AI Box integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
