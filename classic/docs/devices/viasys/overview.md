---
title: "Viasys/ShieldBox Cloud NVR Overview"
description: "Integration guide for Viasys/ShieldBox Cloud NVR with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:viasys
sidebar_position: 1
last_updated: 2025-12-20
---

# Viasys/ShieldBox Cloud NVR

**Device Information:**
- **Device**: Cloud NVR (Network Video Recorder)
- **Vendor**: Viasys / ShieldBox
- **Model**: Cloud NVR Series
- **Firmware**: Cloud-managed firmware
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Cloud NVR with simplified deployment and minimal infrastructure for small to medium security installations.
- **Outcome**: Cloud integration with live video, playback, timeline, and events—no port forwarding or complex configuration.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] Viasys/ShieldBox Cloud NVR hardware or cloud account
- [ ] Network connectivity with internet access for NVR/cameras
- [ ] GCXONE account with device configuration permissions
- [ ] IP cameras connected to cloud NVR (via local NVR or cloud service)
- [ ] Viasys/ShieldBox cloud account credentials
- [ ] Firewall allows outbound HTTPS (port 443)

## Device Profile

- **Type**: Cloud NVR (Network Video Recorder) - Cloud-Based
- **Discovery Protocol**: Cloud-based discovery via Viasys platform
- **Event Types**: Motion detection, video analytics, camera disconnection, storage alerts, system events, alarm inputs, intelligent event detection
- **Network Requirements**:
  - **Ports**: HTTPS (443 outbound) - minimal firewall configuration
  - **Connectivity**: Cloud-native via Viasys platform
  - **Bandwidth**: 2-6 Mbps per camera stream (varies by resolution)
- **Known Considerations**:
  - **Cloud-first architecture** - Reduced on-premise hardware requirements
  - **Simplified setup** - Minimal network configuration needed
  - **Cloud storage options** - Local and cloud recording supported
  - **Remote access** - Built-in cloud streaming without port forwarding
  - **Multi-site capable** - Manage multiple locations from single platform
  - **Integration profiles** - Pre-configured feature sets
  - **IO support** - Physical alarm input/output integration
  - **Mobile optimized** - Cloud streaming optimized for mobile devices
  - **Scalable** - Supports 4 to 16 camera channels per NVR

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | Cloud-based auto-discovery |
| | Manual Configuration | ✓ | Manual setup also supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Primary streaming mode |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Event timeline navigation |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, system alerts |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | I/O Control | ✓ | Alarm input/output support |
| | Timelapse | ○ | Partial support for timelapse |
| **Integration Profiles** | Basic Profile | ✓ | Essential features pre-configured |
| | Basic+ Profile | ✓ | Enhanced features pre-configured |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Cloud-native architecture** - Minimal on-premise infrastructure
- **Simplified deployment** - Quick setup with cloud provisioning
- **Remote monitoring** - Cloud streaming without port forwarding
- **Multi-site management** - Centralized management across locations
- **Integration profiles** - Pre-configured Basic and Basic+ options
- **Genesis Audio (SIP)** - Two-way audio communication
- **PTZ control** - Full pan, tilt, zoom functionality
- **IO integration** - Physical alarm sensors and outputs
- **Event management** - Intelligent event detection and notification
- **Mobile-optimized** - Cloud streaming for mobile devices
- **Scalable** - Support for small to medium deployments
- **Secure** - Cloud-based with minimal firewall configuration

## Quick Start

To configure Viasys/ShieldBox Cloud NVR with GCXONE:

1. **Setup Cloud Account** - Create or access Viasys/ShieldBox cloud account, ensure NVR is registered
2. **Configure Network** - Connect NVR to network with internet access (minimal configuration required)
3. **Add to GCXONE** - Register Viasys/ShieldBox cloud NVR in GCXONE platform using cloud credentials
4. **Select Integration Profile** - Choose Basic or Basic+ profile for feature set
5. **Configure Cameras and Events** - Map cameras, configure event forwarding and notifications
6. **Verify Integration** - Test live streaming, playback, timeline, and event functions

**Estimated setup time: 25-35 minutes**

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Viasys/ShieldBox Cloud NVR Configuration](./configuration.md)
- [Viasys/ShieldBox Cloud NVR Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Viasys/ShieldBox Cloud NVR integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
