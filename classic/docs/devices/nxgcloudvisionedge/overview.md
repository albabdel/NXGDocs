---
title: "NXG Cloud Vision Edge Overview"
description: "Integration guide for NXG Cloud Vision Edge with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:nxgcloudvisionedge
sidebar_position: 1
last_updated: 2025-12-20
---

# NXG Cloud Vision Edge

**Device Information:**
- **Device**: Cloud VMS (Video Management System)
- **Vendor**: NXGEN (First-Party)
- **Model**: NXG Cloud Vision Edge
- **Firmware**: Latest cloud-managed firmware
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Cloud-native VMS with edge computing, zero-configuration deployment, and automatic updates for distributed installations.
- **Outcome**: Enterprise cloud VMS with edge AI, live streaming, playback, PTZ, and zero server management.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] NXG Cloud Vision Edge account (cloud service subscription)
- [ ] Network connectivity with internet access for cameras/edge devices
- [ ] GCXONE account with device configuration permissions
- [ ] IP cameras (ONVIF or manufacturer-specific protocol)
- [ ] Edge devices or cloud connector installed at site (if using edge mode)
- [ ] Firewall allows outbound HTTPS (port 443) - no inbound ports required

## Device Profile

- **Type**: Cloud VMS (Video Management System) - First-Party Cloud-Native
- **Discovery Protocol**: Automatic cloud discovery with zero-touch provisioning
- **Event Types**: Motion detection, AI analytics events, camera disconnection, storage alerts, system health, tampering, intelligent video analytics, edge-based events
- **Network Requirements**:
  - **Ports**: HTTPS (443 outbound only) - no port forwarding required
  - **Connectivity**: Cloud-native via NXGEN cloud infrastructure with edge computing support
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and H.265 codec)
- **Known Considerations**:
  - **Pure cloud architecture** - No on-premise VMS server required
  - **Zero-touch provisioning** - Auto-discovers and registers with GCXONE
  - **Automatic firmware updates** - Managed by NXGEN cloud
  - **Edge computing support** - Distributed AI processing at camera/edge level
  - **No port forwarding** - Outbound-only connections for maximum security
  - **Pre-configured integration profiles** - One-click feature enablement
  - **Unlimited scalability** - Cloud infrastructure scales to hundreds of cameras
  - Both cloud and local streaming supported with automatic failover
  - Built-in AI analytics with edge and cloud processing
  - Native Genesis Audio (SIP) integration
  - Multi-site management from single platform
  - Hybrid edge-cloud architecture for optimal performance

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | Zero-touch cloud provisioning |
| | Manual Configuration | ✓ | Manual camera addition supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Primary streaming mode |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | AI-enhanced timeline with intelligent search |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Edge-to-client streaming |
| | Playback (Local) | ✓ | Local video playback from edge storage |
| **Events & Alarms** | Event Detection | ✓ | Motion, AI analytics, system alerts |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Native two-way audio integration |
| | 4K/High Resolution | ✓ | Supports 4K+ cameras |
| | Timelapse | ○ | Partial support for timelapse |
| | Clip Export | ✓ | Manual video clip export |
| | Mobile App Support | ✓ | Optimized GCXONE mobile experience |
| | Poll from Cloud | ✓ | Real-time cloud health monitoring |
| **Integration Profiles** | Basic Profile | ✓ | Essential features pre-configured |
| | Basic+ Profile | ✓ | Enhanced features pre-configured |
| | Advanced Profile | ✓ | Full AI analytics with edge processing |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Pure cloud VMS** - No on-premise server installation required
- **Zero-touch provisioning** - Cameras auto-register with cloud VMS
- **Edge computing architecture** - Distributed AI processing for performance
- **Unlimited scalability** - Cloud infrastructure supports hundreds of cameras
- **Automatic firmware updates** - Cloud-managed updates for cameras and edge devices
- **Instant cloud access** - Remote monitoring from day one
- **AI-powered analytics** - Edge and cloud AI for intelligent event detection
- **Genesis Audio (SIP) native** - Optimized two-way communication
- **Dual streaming modes** - Cloud and edge-local with automatic failover
- **Mobile-optimized** - Best-in-class mobile app experience
- **Multi-site management** - Manage unlimited sites from single platform
- **Secure** - Outbound-only connections, no inbound firewall rules
- **Pre-configured profiles** - One-click feature activation
- **Hybrid architecture** - Best of cloud and edge computing

## Quick Start

To configure NXG Cloud Vision Edge with GCXONE (cloud-native VMS process):

1. **Create Cloud Account** - Sign up for NXG Cloud Vision Edge service (cloud subscription)
2. **Add Cameras** - Add IP cameras to cloud VMS (auto-discovery or manual entry)
3. **Install Edge Devices** (Optional) - Deploy edge connectors at sites for local processing
4. **Auto-Discovery in GCXONE** - Cloud VMS appears automatically in GCXONE device list
5. **One-Click Activation** - Select integration profile (Basic, Basic+, or Advanced) and activate
6. **Verify** - Test live streaming, playback, timeline, and events (all pre-configured)

**Total setup time: 10-15 minutes** (cloud VMS, no hardware to install)

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [NXG Cloud Vision Edge Configuration](./configuration.md)
- [NXG Cloud Vision Edge Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with NXG Cloud Vision Edge integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
