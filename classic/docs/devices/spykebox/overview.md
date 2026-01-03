---
title: "SPYKEBOX NVR Overview"
description: "Integration guide for SPYKEBOX NVR with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:spykebox
sidebar_position: 1
last_updated: 2025-12-20
---

# SPYKEBOX NVR

**Device Information:**
- **Device**: NVR (Network Video Recorder)
- **Vendor**: SPYKEBOX
- **Model**: SPYKEBOX NVR Series (Hikvision SDK-based)
- **Firmware**: Latest NVR firmware recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Professional NVR with Hikvision SDK compatibility for robust GCXONE integration and multi-site deployments.
- **Outcome**: Cloud integration with live streaming, playback, PTZ, and timeline optimized for SPYKEBOX hardware.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] SPYKEBOX NVR with latest firmware
- [ ] Administrative access to SPYKEBOX NVR web interface
- [ ] Network connectivity between SPYKEBOX NVR and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for NVR (recommended)
- [ ] Cameras already configured and recording in SPYKEBOX NVR
- [ ] Firewall configured to allow required ports (HTTPS, RTSP)

## Device Profile

- **Type**: NVR (Network Video Recorder) - Hikvision SDK-Based
- **Discovery Protocol**: SDK-based integration using Hikvision ISAPI protocol
- **Event Types**: Motion detection, video analytics, camera disconnection, storage alerts, system events, alarm inputs, tampering, line crossing, intrusion detection
- **Network Requirements**:
  - **Ports**: HTTP (80), HTTPS (443), RTSP (554), SDK (8000)
  - **Connectivity**: Direct IP with internet access for cloud integration
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and H.265/H.264 codec)
- **Known Considerations**:
  - Built on Hikvision SDK platform for enhanced compatibility
  - Supports Hikvision cameras and ONVIF-compatible devices
  - Multiple integration profiles (Basic, Basic+, Advanced) for different deployments
  - Cloud polling mechanism for status monitoring
  - Both cloud and local streaming supported with automatic failover
  - Supports video analytics and intelligent event detection
  - Compatible with Genesis Audio (SIP) for two-way communication
  - H.265+ compression for bandwidth optimization
  - Scalable from 4 to 32 camera channels per NVR

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | SDK-based NVR discovery |
| | Manual Configuration | ✓ | IP-based configuration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud-based streaming via GCXONE |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Event timeline with intelligent search |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, alarm inputs |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✓ | Supports 4K cameras |
| | Timelapse | ○ | Partial support for timelapse |
| | Clip Export | ✓ | Manual video clip export |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| | Poll from Cloud | ✓ | Cloud polling for status monitoring |
| **Integration Profiles** | Basic Profile | ✓ | Essential features for basic integration |
| | Basic+ Profile | ✓ | Enhanced features with event management |
| | Advanced Profile | ✓ | Full feature set with analytics |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Hikvision SDK compatibility** - Built on proven Hikvision technology
- **Dual streaming modes** - Cloud and local for maximum flexibility
- **Multiple integration profiles** - Basic, Basic+, Advanced for different scenarios
- **Video analytics** - Intelligent event detection and line crossing
- **PTZ control** - Full pan, tilt, zoom with preset positions
- **Genesis Audio (SIP)** - Two-way audio communication
- **Event-driven workflows** - Customizable automation rules
- **Cloud polling** - Real-time status monitoring
- **Mobile app access** - Remote monitoring via GCXONE app
- **H.265+ compression** - Optimized bandwidth usage
- **Alarm input integration** - Physical alarm sensors supported
- **ONVIF compatibility** - Works with 3rd-party cameras
- **Reliable performance** - Based on Hikvision's proven architecture

## Quick Start

To configure SPYKEBOX NVR with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure SPYKEBOX NVR has internet access and can reach GCXONE cloud platform
2. **Configure NVR Settings** - Access NVR web interface, configure network settings, create integration user account
3. **Add to GCXONE Platform** - Log into GCXONE and add the SPYKEBOX NVR using IP address and credentials
4. **Configure Integration Profile** - Select integration profile (Basic, Basic+, or Advanced) and enable features
5. **Map Cameras and Events** - Configure camera mappings, event rules, and verify streaming (cloud and local)
6. **Test Integration** - Verify live streaming, playback, timeline, PTZ control, and event forwarding work correctly

**Estimated setup time: 30-40 minutes**

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [SPYKEBOX NVR Configuration](./configuration.md)
- SPYKEBOX NVR Troubleshooting
-  - For SDK compatibility reference
- 
- 
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with SPYKEBOX NVR integration, check our Troubleshooting Guide or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
