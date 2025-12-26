---
title: "ENEOIP NVR Overview"
description: "Integration guide for ENEOIP NVR with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:eneoip
sidebar_position: 1
last_updated: 2025-12-20
---

# ENEOIP NVR

**Device Information:**
- **Device**: NVR (Network Video Recorder)
- **Vendor**: ENEO (Germany)
- **Model**: ENEOIP Series (IP-based NVR models)
- **Firmware**: 3.0 or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: IP-based NVR with GCXONE cloud integration and enhanced network capabilities for professional installations.
- **Outcome**: Cloud connectivity with live streaming, playback, PTZ, timeline, and optimized IP network performance.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 35-45 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | SDK-based integration via NVR connection |
| **Series** | ENEOIP (IP-optimized series) |
| **Channels Supported** | 4, 8, 16, 32 channels (model-dependent) |
| **Ports Required** | HTTPS 443, RTSP 554, SDK 8000, HTTP 80 (optional) |
| **Key Features** | Cloud streaming, playback, timeline, PTZ, analytics |
| **Firmware** | 3.0 or higher recommended |
| **Network** | Enhanced IP network capabilities |
| **Integration Type** | SDK-based with cloud connectivity |

## Prerequisites

Before you begin, ensure you have:

- [ ] ENEOIP NVR with firmware 3.0 or higher
- [ ] Network connectivity between NVR and GCXONE platform (direct internet or VPN)
- [ ] Administrative access to NVR web interface
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for NVR (recommended)
- [ ] Firewall configured to allow outbound HTTPS (port 443) and RTSP (port 554)

## Device Profile

- **Type**: NVR (Network Video Recorder)
- **Discovery Protocol**: SDK-based integration with direct NVR connection
- **Event Types**: Motion detection, video loss, disk full, system alerts, I/O triggers, tampering, analytics events
- **Network Requirements**:
  - **Ports**: HTTPS (443), RTSP (554), HTTP (80 - optional), SDK Port (8000)
  - **Connectivity**: Direct IP with internet access (cloud integration via SDK)
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution)
- **Known Considerations**:
  - Requires outbound internet connectivity for cloud integration
  - Enhanced IP network capabilities for better performance
  - Both cloud and local streaming supported for flexibility
  - PTZ control available through both cloud and local connections
  - Timeline feature for efficient event navigation
  - Genesis Audio (SIP) supported for two-way communication
  - Mobile app access via GCXONE platform
  - Optimized for IP camera integration

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | SDK-based NVR discovery |
| | Manual Configuration | ✓ | IP-based configuration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud-based streaming |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Event timeline view |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| | Timeline (Local) | ✓ | Local timeline navigation |
| **Events & Alarms** | Event Detection | ✓ | Motion, I/O triggers, system alerts |
| | Arm/Disarm | ✓ | NVR-level arm/disarm |
| | Event Acknowledgement | ✓ | Event management via GCXONE |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Local PTZ | ✓ | Direct PTZ control |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✓ | Supports high-resolution IP cameras |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| | Multi-Site Management | ✓ | Manage multiple installations |
| | IP Camera Integration | ✓ | Optimized for IP camera networks |

**Integration Highlights:**
- Comprehensive NVR integration with full cloud and local capabilities
- Enhanced IP network performance for IP camera installations
- Both cloud and local streaming for maximum flexibility
- PTZ control available through both cloud and local connections
- Timeline feature for both cloud and local playback
- Genesis Audio (SIP) for two-way communication
- Event-driven workflows and alarm management
- Mobile app access for remote monitoring
- Optimized for modern IP camera infrastructure

## Quick Start

To configure ENEOIP NVR with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure NVR has internet access and can reach GCXONE cloud platform
2. **Configure NVR Settings** - Access NVR web interface and configure network settings, enable SDK access
3. **Add to GCXONE Platform** - Log into GCXONE and add the ENEOIP NVR using IP address and credentials
4. **Configure Cameras and Events** - Map cameras, configure event rules, and verify streaming
5. **Test Integration** - Verify live streaming, playback, timeline, PTZ control, and event forwarding

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [ENEOIP NVR Configuration](./configuration.md)
- [ENEOIP NVR Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with ENEOIP NVR integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
