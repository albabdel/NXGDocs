---
title: "NXWitness VMS Overview"
description: "Integration guide for NXWitness VMS with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:nxwitness
sidebar_position: 1
last_updated: 2025-12-20
---

# NXWitness VMS

**Device Information:**
- **Device**: VMS (Video Management System)
- **Vendor**: Network Optix
- **Model**: Nx Witness (All editions)
- **Firmware**: 5.0 or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Cross-platform VMS with GCXONE integration for centralized monitoring across multiple sites and thousands of cameras.
- **Outcome**: Cloud integration with live streaming, playback, PTZ, and timeline navigation for comprehensive security monitoring.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] Nx Witness VMS 5.0 or higher installed on server (Windows, Linux, or macOS)
- [ ] Administrative access to Nx Witness Desktop Client
- [ ] Network connectivity between Nx Witness server and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP address or DDNS configured for Nx Witness server (recommended)
- [ ] Cameras already configured and recording in Nx Witness
- [ ] Firewall configured to allow outbound HTTPS (port 443) and required ports

## Device Profile

- **Type**: VMS (Video Management System)
- **Discovery Protocol**: SDK-based integration with direct server connection
- **Event Types**: Motion detection, analytics events, camera disconnection, storage issues, system events, I/O triggers, tampering, generic events
- **Network Requirements**:
  - **Ports**: HTTPS (7001), RTSP (554), HTTP (7001), WebSocket (7001)
  - **Connectivity**: Direct IP with internet access (cloud integration via Nx Witness Cloud)
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and codec)
- **Known Considerations**:
  - Cross-platform VMS (Windows, Linux, macOS support)
  - Supports ONVIF and proprietary protocols for camera integration
  - Scalable architecture supporting thousands of cameras per server
  - Multiple integration profiles (Basic, Basic+, Advanced) for different feature sets
  - Cloud polling mechanism for status monitoring
  - Both cloud and local streaming supported for maximum flexibility
  - Built-in video analytics and intelligent search capabilities
  - Free version available with camera limit

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | SDK-based server discovery |
| | Manual Configuration | ✓ | IP-based configuration supported |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud-based streaming via Nx Cloud |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Event timeline with intelligent search |
| **Local Capabilities** | Live Streaming (Local) | ✓ | Direct RTSP streaming |
| | Playback (Local) | ✓ | Local video playback |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, I/O triggers |
| | Arm/Disarm | ✓ | Camera-level and system-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with presets |
| | Genesis Audio (SIP) | ✓ | Two-way audio communication |
| | 4K/High Resolution | ✓ | Supports 4K and higher resolution cameras |
| | Timelapse | ○ | Partial support for timelapse |
| | Clip Export | ✓ | Manual video clip export |
| | Mobile App Support | ✓ | Via GCXONE and Nx mobile apps |
| | Poll from Cloud | ✓ | Cloud polling for status monitoring |
| **Integration Profiles** | Basic Profile | ✓ | Essential features for basic integration |
| | Basic+ Profile | ✓ | Enhanced features with event management |
| | Advanced Profile | ✓ | Full feature set with analytics |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- Cross-platform VMS with robust multi-camera support
- Dual streaming modes: cloud and local for maximum flexibility
- Multiple integration profiles for different deployment scenarios
- Advanced analytics and intelligent video search capabilities
- PTZ control with preset positions and tours
- Genesis Audio (SIP) for two-way communication
- Event-driven workflows with customizable rules
- Cloud polling mechanism for status monitoring
- Mobile app access for remote monitoring
- Support for ONVIF and 7,000+ camera models
- Scalable architecture from small to enterprise deployments

## Quick Start

To configure Nx Witness VMS with GCXONE, follow these main steps:

1. **Verify Network Connectivity** - Ensure Nx Witness server has internet access and can reach GCXONE cloud platform
2. **Configure Nx Witness Server** - Access Nx Witness Desktop Client, configure network settings, enable cloud service, and create integration user
3. **Add to GCXONE Platform** - Log into GCXONE and add the Nx Witness server using IP address and credentials
4. **Configure Cameras and Events** - Map cameras, configure event rules, and verify streaming (cloud and local)
5. **Test Integration** - Verify live streaming, playback, timeline, PTZ control, and event forwarding work correctly

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [NXWitness VMS Configuration](./configuration.md)
- [NXWitness VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Nx Witness VMS integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
