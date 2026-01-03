---
title: "Honeywell 35 Series NVR Overview"
description: "Integration guide for Honeywell 35 Series NVR with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:honeywell
sidebar_position: 1
last_updated: 2025-12-20
---

# Honeywell 35 Series NVR

**Device Information:**
- **Device**: NVR (Network Video Recorder)
- **Vendor**: Honeywell
- **Model**: 35 Series (HRDP, HRDPX models)
- **Firmware**: 3.0 or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Enterprise NVR with GCXONE cloud integration for centralized multi-site video management and monitoring.
- **Outcome**: Cloud connectivity with remote access, live streaming, event management, and comprehensive security monitoring.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 35-45 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | Manual configuration via NVR web interface |
| **Protocol** | HTTPS/RTSP cloud polling |
| **Channels Supported** | 4, 8, 16, 32 channels (model-dependent) |
| **Ports Required** | HTTPS 443, RTSP 554, HTTP 80 |
| **Key Features** | Cloud streaming, playback, timeline, events, PTZ |
| **Firmware** | 3.0 or higher recommended |
| **Network** | Direct internet or VPN connection |
| **Integration Profile** | Cloud polling (automatic sync) |

## Prerequisites

Before you begin, ensure you have:

- [ ] Honeywell 35 Series NVR with firmware 3.0 or higher
- [ ] Network connectivity between NVR and GCXONE platform (direct internet or VPN)
- [ ] Administrative access to NVR web interface
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for NVR (recommended)
- [ ] Firewall configured to allow outbound HTTPS (port 443) and RTSP (port 554)

## Device Profile

- **Type**: NVR (Network Video Recorder)
- **Discovery Protocol**: Cloud polling via GCXONE platform
- **Event Types**: Motion detection, video loss, disk full, system alerts
- **Network Requirements**:
  - **Ports**: HTTPS (443), RTSP (554), HTTP (80)
  - **Connectivity**: Direct IP with internet access (cloud polling)
  - **Bandwidth**: 2-5 Mbps per camera stream (varies by resolution)
- **Known Considerations**:
  - Requires outbound internet connectivity for cloud integration
  - Mobile app access available through GCXONE platform
  - Supports Basic, Basic+, and Advanced integration profiles
  - Timelapse feature available for historical review

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | Cloud polling mechanism |
| | Manual Configuration | ✓ | IP-based configuration |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Via GCXONE platform |
| | Playback (Cloud) | ✗ | Not supported in current integration |
| | Timeline (Cloud) | ✗ | Not supported in current integration |
| **Local Capabilities** | Live Streaming (Local) | ✗ | Cloud streaming only |
| | Playback (Local) | ✗ | Cloud streaming only |
| | Local SDK Audio | ✗ | Cloud streaming only |
| **Events & Alarms** | Event Detection | ✗ | Polling-based monitoring only |
| | Arm/Disarm | ✗ | Not supported |
| | Event Acknowledgement | ✗ | Not supported |
| **Advanced Features** | PTZ/Presets | ✗ | Not supported in current integration |
| | I/O Control | ✗ | Not supported |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✗ | Standard resolution support |
| | Timelapse | ✓ | Historical video review |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| **Integration Profiles** | Basic Profile | ✓ | Standard features |
| | Basic+ Profile | ✓ | Enhanced features |
| | Advanced Profile | ✓ | Full feature set |

**Integration Highlights:**
- Cloud-based live streaming for remote monitoring
- Genesis Audio (SIP) for two-way communication
- Poll from cloud for status monitoring
- Mobile app enabled for on-the-go access
- Timelapse support for historical review
- Multiple integration profiles for flexible deployment

## Quick Start

To configure Honeywell 35 Series NVR with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure NVR has internet access and can reach GCXONE cloud platform
2. **Configure NVR Settings** - Access NVR web interface and configure required network settings (IP, ports, DDNS if needed)
3. **Add Device in GCXONE** - Log into GCXONE platform and add the Honeywell NVR using IP address and credentials
4. **Verify Integration** - Confirm live streaming works and device status shows online in GCXONE dashboard

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Honeywell 35 Series NVR Configuration](./configuration.md)
- [Honeywell 35 Series NVR Troubleshooting](./troubleshooting.md)
- 
- 
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Honeywell 35 Series NVR integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
