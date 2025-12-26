---
title: "Digital Watchdog VMS Overview"
description: "Integration guide for Digital Watchdog VMS/NVR with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:digitalwatchdog
sidebar_position: 1
last_updated: 2025-12-20
---

# Digital Watchdog VMS/NVR

**Device Information:**
- **Device**: VMS/NVR (Video Management System / Network Video Recorder)
- **Vendor**: Digital Watchdog (DW)
- **Model**: Spectrum, DW Spectrum IPVMS, Blackjack NVRs
- **Firmware**: DW Spectrum 5.0 or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Enterprise VMS/NVR with GCXONE integration for professional security installations with cloud-based centralized monitoring.
- **Outcome**: Cloud integration with live streaming, playback, PTZ, and timeline optimized for Digital Watchdog hardware.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] Digital Watchdog Spectrum VMS 5.0+ or compatible Blackjack NVR
- [ ] Administrative access to DW Spectrum Desktop Client or NVR web interface
- [ ] Network connectivity between DW system and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for DW server/NVR (recommended)
- [ ] Cameras already configured and recording in Digital Watchdog system
- [ ] Firewall configured to allow outbound HTTPS (port 443) and required ports

## Device Profile

- **Type**: VMS/NVR (Video Management System / Network Video Recorder)
- **Discovery Protocol**: SDK-based integration with direct connection
- **Event Types**: Motion detection, video analytics, camera disconnection, storage alerts, system events, I/O triggers, tampering, intelligent video analytics
- **Network Requirements**:
  - **Ports**: HTTPS (7001), RTSP (554), HTTP (7001), WebSocket (7001)
  - **Connectivity**: Direct IP with internet access (cloud integration via DW Cloud)
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and H.265/H.264 codec)
- **Known Considerations**:
  - DW Spectrum is based on Nx Witness platform with DW-specific enhancements
  - Linux-based NVRs offer enhanced stability and performance
  - Supports ONVIF and proprietary protocols for camera integration
  - Scalable architecture supporting hundreds of cameras per server
  - Multiple integration profiles (Basic, Basic+, Advanced) for different deployments
  - Cloud polling mechanism for status monitoring
  - Both cloud and local streaming supported
  - Built-in video analytics and intelligent search (DW Spectrum Analytics+)
  - DW MEGApix cameras fully supported with advanced features

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | SDK-based server/NVR discovery |
| | Manual Configuration | ✓ | IP-based configuration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud-based streaming via DW Cloud |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Event timeline with intelligent search |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, I/O triggers |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✓ | Supports 4K and higher MEGApix cameras |
| | Timelapse | ○ | Partial support for timelapse |
| | Clip Export | ✓ | Manual video clip export |
| | Mobile App Support | ✓ | Via GCXONE and DW mobile apps |
| | Poll from Cloud | ✓ | Cloud polling for status monitoring |
| **Integration Profiles** | Basic Profile | ✓ | Essential features for basic integration |
| | Basic+ Profile | ✓ | Enhanced features with event management |
| | Advanced Profile | ✓ | Full feature set with DW Analytics+ |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- Enterprise-grade VMS/NVR with robust performance
- Dual streaming modes: cloud and local for maximum flexibility
- Multiple integration profiles for different deployment scenarios
- DW Spectrum Analytics+ for intelligent video analysis
- PTZ control with preset positions and tours
- Genesis Audio (SIP) for two-way communication
- Event-driven workflows with customizable rules
- Cloud polling mechanism for status monitoring
- Mobile app access for remote monitoring
- Support for ONVIF and 5,000+ camera models
- Optimized for DW MEGApix IP cameras
- Linux-based NVR platform for reliability
- Scalable from small to enterprise deployments

## Quick Start

To configure Digital Watchdog VMS/NVR with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure DW Spectrum server or NVR has internet access and can reach GCXONE cloud platform
2. **Configure DW System** - Access DW Spectrum Desktop Client or NVR web interface, configure network settings, enable cloud service, create integration user
3. **Add to GCXONE Platform** - Log into GCXONE and add the DW server/NVR using IP address and credentials
4. **Configure Cameras and Events** - Map cameras, configure event rules, verify streaming (cloud and local)
5. **Test Integration** - Verify live streaming, playback, timeline, PTZ control, and event forwarding work correctly

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Digital Watchdog VMS/NVR Configuration](./configuration.md)
- [Digital Watchdog VMS/NVR Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Digital Watchdog VMS/NVR integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
