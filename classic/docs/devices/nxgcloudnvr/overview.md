---
title: "NXG Cloud NVR Overview"
description: "Integration guide for NXG Cloud NVR with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:nxgcloudnvr
sidebar_position: 1
last_updated: 2025-12-20
---

# NXG Cloud NVR

**Device Information:**
- **Device**: Cloud NVR (Network Video Recorder)
- **Vendor**: NXGEN (First-Party)
- **Model**: NXG Cloud NVR Series
- **Firmware**: Latest cloud-managed firmware
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Cloud-native NVR with zero-touch provisioning, automatic updates, and seamless integration with GCXONE platform.
- **Outcome**: Instant cloud integration with live streaming, playback, PTZ, and event management—no server configuration required.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 5-10 minutes (fastest in platform) |
| **Difficulty** | Beginner |
| **Setup Method** | Zero-touch provisioning (automatic) |
| **Discovery** | Auto-discovery via cloud |
| **Ports Required** | HTTPS 443 outbound only |
| **Port Forwarding** | Not required |
| **Integration Profiles** | Basic, Basic+, Advanced |
| **Key Features** | Cloud streaming, local backup, AI analytics, PTZ, Genesis Audio |
| **Cameras Supported** | 4-32 channels per NVR |
| **Firmware Updates** | Automatic via cloud |

## Prerequisites

Before you begin, ensure you have:

- [ ] NXG Cloud NVR (hardware pre-registered with NXGEN cloud)
- [ ] Network connectivity with internet access for NVR
- [ ] GCXONE account with device configuration permissions
- [ ] NVR connected to network via Ethernet (PoE or standard)
- [ ] Cameras connected to NVR (PoE or network)
- [ ] Firewall allows outbound HTTPS (port 443) - no inbound ports required

## Device Profile

- **Type**: Cloud NVR (Network Video Recorder) - First-Party Cloud-Native
- **Discovery Protocol**: Automatic cloud discovery (zero-touch provisioning)
- **Event Types**: Motion detection, AI analytics events, camera disconnection, storage alerts, system health, tampering, intelligent video analytics
- **Network Requirements**:
  - **Ports**: HTTPS (443 outbound only) - no port forwarding required
  - **Connectivity**: Cloud-native via NXGEN cloud infrastructure
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and H.265 codec)
- **Known Considerations**:
  - **Cloud-first architecture** - No on-premise server configuration required
  - **Zero-touch provisioning** - Auto-discovers and registers with GCXONE
  - **Automatic firmware updates** - Managed by NXGEN cloud
  - **No port forwarding** - Outbound-only connections for maximum security
  - **Pre-configured integration profiles** - One-click feature enablement
  - Both cloud and local streaming supported with automatic failover
  - Built-in AI analytics for intelligent event detection
  - Native Genesis Audio (SIP) integration
  - Scalable from 4 to 32 camera channels per NVR

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | Zero-touch cloud provisioning |
| | Manual Configuration | ✓ | Manual registration also supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Primary streaming mode |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | AI-enhanced timeline |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Automatic failover to local |
| | Playback (Local) | ✓ | Local video playback |
| **Events & Alarms** | Event Detection | ✓ | Motion, AI analytics, system alerts |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Native two-way audio integration |
| | 4K/High Resolution | ✓ | Supports 4K cameras |
| | Timelapse | ○ | Partial support for timelapse |
| | Clip Export | ✓ | Manual video clip export |
| | Mobile App Support | ✓ | Optimized GCXONE mobile experience |
| | Poll from Cloud | ✓ | Real-time cloud health monitoring |
| **Integration Profiles** | Basic Profile | ✓ | Essential features pre-configured |
| | Basic+ Profile | ✓ | Enhanced features pre-configured |
| | Advanced Profile | ✓ | Full AI analytics pre-configured |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Zero-touch provisioning** - NVR auto-registers with GCXONE on first boot
- **Cloud-native architecture** - No complex server setup or port forwarding
- **Automatic firmware updates** - Always up-to-date with latest features
- **Instant cloud access** - Remote monitoring from day one
- **AI-powered analytics** - Built-in intelligent event detection
- **Genesis Audio (SIP) native** - Optimized two-way communication
- **Dual streaming modes** - Cloud and local with automatic failover
- **Mobile-optimized** - Best-in-class mobile app experience
- **Scalable** - 4 to 32 camera channels per NVR
- **Secure** - Outbound-only connections, no inbound firewall rules
- **Pre-configured profiles** - One-click feature activation
- **PoE support** - Simplified camera connectivity

## Quick Start

To configure NXG Cloud NVR with GCXONE (simplified cloud-native process):

1. **Physical Installation** - Connect NVR to network via Ethernet, connect cameras via PoE or network
2. **Power On** - NVR automatically boots and registers with NXGEN cloud (2-3 minutes)
3. **Auto-Discovery in GCXONE** - NVR appears automatically in GCXONE device list
4. **One-Click Activation** - Select integration profile (Basic, Basic+, or Advanced) and activate
5. **Verify** - Test live streaming, playback, timeline, and events (all pre-configured)

**Total setup time: 5-10 minutes** (fastest integration in the platform)

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [NXG Cloud NVR Configuration](./configuration.md)
- [NXG Cloud NVR Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with NXG Cloud NVR integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
