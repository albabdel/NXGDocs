---
title: "NetVue IP Camera Overview"
description: "Integration guide for NetVue IP Camera with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:netvue
sidebar_position: 1
last_updated: 2025-12-20
---

# NetVue IP Camera

**Device Information:**
- **Device**: IP Camera
- **Vendor**: NetVue
- **Model**: NetVue Cloud IP Camera Series
- **Firmware**: Latest recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Cloud IP cameras with GCXONE integration for unified video management and remote monitoring.
- **Outcome**: Cloud integration with live video, playback, timeline, and Genesis Audio two-way communication.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 15-25 minutes |
| **Difficulty** | Beginner |
| **Setup Method** | Cloud-based pairing via NetVue platform |
| **Camera Type** | Cloud-connected IP cameras |
| **Target Market** | Small to medium installations, residential |
| **Ports Required** | HTTPS 443, RTSP 554, SIP 5060 (audio) |
| **Key Features** | Cloud streaming, playback, timeline, Genesis Audio, SDK audio |
| **Firmware** | Latest recommended (cloud-managed) |
| **Connectivity** | Internet required for cloud integration |
| **Integration Type** | Cloud-based via NetVue platform |

## Prerequisites

Before you begin, ensure you have:

- [ ] NetVue IP camera with active cloud subscription
- [ ] NetVue mobile app installed and camera configured
- [ ] Camera connected to network with internet access
- [ ] GCXONE account with device configuration permissions
- [ ] Camera credentials (username/password)
- [ ] Network connectivity between camera and GCXONE platform

## Device Profile

- **Type**: IP Camera (Cloud-Connected)
- **Discovery Protocol**: Cloud-based discovery through NetVue platform integration
- **Event Types**: Motion detection, audio detection, PIR sensor events, tampering alerts
- **Network Requirements**:
  - **Ports**: HTTPS (443), RTSP (554), SIP (5060 for audio)
  - **Connectivity**: Internet access required for cloud integration
  - **Bandwidth**: 1-4 Mbps per camera (varies by resolution and quality)
- **Known Considerations**:
  - Requires active NetVue cloud subscription
  - Cloud streaming is primary mode (local SDK available for audio)
  - Timeline feature available locally with some limitations
  - Timelapse functionality available with partial support
  - Genesis Audio (SIP) for two-way communication
  - Local SDK Audio as alternative audio method
  - Camera must be pre-configured in NetVue mobile app before GCXONE integration

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | Cloud-based camera discovery |
| | Manual Configuration | ✓ | Direct camera integration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Primary streaming mode |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ○ | Basic timeline functionality |
| **Local Capabilities** | Live Streaming (Local) | ✗ | Cloud streaming only |
| | Playback (Local) | ✗ | Cloud playback only |
| | Timeline (Local) | ○ | Local timeline with limitations |
| **Events & Alarms** | Event Detection | ✓ | Motion, audio, PIR sensor events |
| | Event Notifications | ✓ | Push notifications via GCXONE |
| **Audio Features** | Genesis Audio (SIP) | ✓ | Two-way audio via SIP protocol |
| | Local SDK Audio | ✓ | Direct audio communication |
| **Advanced Features** | Timelapse | ○ | Partial support for timelapse creation |
| | PTZ/Presets | ✗ | Not applicable (fixed cameras) |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| | Cloud Recording | ✓ | NetVue cloud storage integration |
| | Multi-Camera Management | ✓ | Manage multiple cameras per site |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- Cloud-first architecture with seamless GCXONE integration
- Dual audio capabilities: Genesis Audio (SIP) and Local SDK Audio
- Motion detection and PIR sensor integration for smart alerts
- Timeline feature for efficient event navigation (cloud and local modes)
- Timelapse functionality for long-term monitoring
- Mobile app access for remote monitoring anywhere
- Event-driven workflows for automated responses

## Quick Start

To configure NetVue IP Camera with GCXONE, follow these main steps:

1. **Pre-Configure Camera in NetVue App** - Install NetVue mobile app, add camera, and verify cloud connectivity
2. **Gather Camera Credentials** - Note camera serial number, username, and password
3. **Add to GCXONE Platform** - Log into GCXONE and add NetVue camera using credentials
4. **Configure Events and Audio** - Enable motion detection events, configure Genesis Audio (SIP), and set up notifications
5. **Test Integration** - Verify live streaming, playback, timeline, audio (two-way), and event forwarding

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [NetVue IP Camera Configuration](./configuration.md)
- NetVue IP Camera Troubleshooting
- 
- 
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with NetVue IP Camera integration, check our Troubleshooting Guide or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
