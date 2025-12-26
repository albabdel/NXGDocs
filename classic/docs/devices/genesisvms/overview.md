---
title: "Genesis VMS Overview"
description: "Integration guide for Genesis VMS with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:genesisvms
sidebar_position: 1
last_updated: 2025-12-20
---

# Genesis VMS

**Device Information:**
- **Device**: VMS (Video Management System)
- **Vendor**: NXGEN (First-Party)
- **Model**: Genesis VMS (All editions)
- **Firmware**: Latest version recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: First-party VMS with native GCXONE integration, auto-discovery, and optimized performance for multi-site deployments.
- **Outcome**: Native integration with cloud and local streaming, PTZ, timeline, and comprehensive monitoring capabilities.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 20-30 minutes (5 minutes with auto-discovery) |
| **Difficulty** | Beginner |
| **Setup Method** | Auto-discovery (recommended) or manual configuration |
| **Discovery** | Auto-discovery via native integration |
| **Integration Type** | First-party native (optimized for GCXONE) |
| **Ports Required** | HTTPS 443, RTSP 554, Management 8080/8081 |
| **Integration Profiles** | Basic, Basic+, Advanced |
| **Key Features** | Cloud + local streaming, PTZ, Genesis Audio, AI analytics, timelapse |
| **Platform Support** | Windows, Linux |
| **Scalability** | Unlimited cameras (server-dependent) |

## Prerequisites

Before you begin, ensure you have:

- [ ] Genesis VMS installed on server (Windows or Linux)
- [ ] Administrative access to Genesis VMS management interface
- [ ] Network connectivity between Genesis VMS server and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for Genesis VMS server (recommended)
- [ ] Cameras already configured and recording in Genesis VMS
- [ ] Firewall configured to allow outbound HTTPS (port 443) and required ports

## Device Profile

- **Type**: VMS (Video Management System) - First-Party
- **Discovery Protocol**: Native SDK-based integration with auto-discovery
- **Event Types**: Motion detection, analytics events, camera disconnection, storage issues, system events, I/O triggers, tampering, intelligent video analytics
- **Network Requirements**:
  - **Ports**: HTTPS (443), RTSP (554), HTTP (8080), WebSocket (8081)
  - **Connectivity**: Direct IP with internet access (native GCXONE integration)
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and codec)
- **Known Considerations**:
  - First-party VMS with native GCXONE integration for optimal performance
  - Supports ONVIF and proprietary protocols for camera integration
  - Scalable architecture supporting thousands of cameras per server
  - Multiple integration profiles (Basic, Basic+, Advanced) pre-configured
  - Cloud polling mechanism for real-time status monitoring
  - Both cloud and local streaming supported with seamless failover
  - Built-in video analytics and AI-powered intelligent search
  - Native Genesis Audio (SIP) integration for two-way communication

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | Native auto-discovery via GCXONE |
| | Manual Configuration | ✓ | IP-based configuration also supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Optimized cloud streaming |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Advanced timeline with AI search |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, I/O triggers |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Native two-way audio integration |
| | 4K/High Resolution | ✓ | Supports 4K and higher resolution cameras |
| | Timelapse | ○ | Partial support for timelapse |
| | Clip Export | ✓ | Manual video clip export |
| | Mobile App Support | ✓ | Via GCXONE mobile app |
| | Poll from Cloud | ✓ | Real-time cloud polling |
| **Integration Profiles** | Basic Profile | ✓ | Essential features for basic integration |
| | Basic+ Profile | ✓ | Enhanced features with event management |
| | Advanced Profile | ✓ | Full feature set with AI analytics |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Native GCXONE integration** - First-party VMS designed specifically for GCXONE platform
- **Seamless cloud and local streaming** - Automatic failover between modes
- **Multiple integration profiles** - Pre-configured for different deployment scenarios
- **AI-powered video analytics** - Intelligent search and event detection
- **Genesis Audio (SIP) native integration** - Optimized two-way communication
- **PTZ control** with preset positions, tours, and tracking
- **Event-driven automation** - Advanced rule engine for complex workflows
- **Cloud polling** - Real-time status monitoring
- **Mobile app optimized** - Best-in-class mobile experience
- **ONVIF compliant** - Supports 7,000+ camera models
- **Scalable architecture** - From small to enterprise deployments
- **Simplified configuration** - Auto-discovery and one-click setup

## Quick Start

To configure Genesis VMS with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure Genesis VMS server has internet access and can reach GCXONE cloud platform
2. **Configure Genesis VMS** - Access Genesis VMS management interface, configure network settings, and enable GCXONE integration
3. **Auto-Discover in GCXONE** - Log into GCXONE and use auto-discovery to find Genesis VMS server (or add manually)
4. **Select Integration Profile** - Choose Basic, Basic+, or Advanced profile based on deployment needs
5. **Test Integration** - Verify live streaming, playback, timeline, PTZ control, and event forwarding work correctly

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Genesis VMS Configuration](./configuration.md)
- [Genesis VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Genesis VMS integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
