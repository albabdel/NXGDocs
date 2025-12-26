---
title: "Avigilon VMS Overview"
description: "Integration guide for Avigilon Access Control Center (ACC) Video Management System with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:avigilon
sidebar_position: 1
last_updated: 2025-12-21
---

# Avigilon VMS

**Device Information:**
- **Device**: Video Management System (VMS)
- **Vendor**: Avigilon (Motorola Solutions)
- **Model**: Avigilon Control Center (ACC) 7.x and higher
- **Firmware**: ACC 7+ with WebAPI Endpoint Service
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Enterprise VMS with advanced video analytics and AI-powered detection for comprehensive security monitoring.
- **Outcome**: Cloud integration with live streaming, playback, timeline, intelligent analytics, and alarm management via WebAPI.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 35-50 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | Manual configuration via ACC Client and GCXONE |
| **Protocol** | WebAPI Endpoint Service (ACC 7+) |
| **Integration Type** | SDK-based via WebAPI with port forwarding |
| **Ports Required** | HTTP/HTTPS 80/443, ACC Server port (custom), WebAPI port |
| **Key Features** | Advanced video analytics, AI object detection, alarm management, PTZ control |
| **Analytics Capabilities** | Person/vehicle detection, line crossing, area intrusion, object classification |
| **Video Codecs** | H.264, H.265/HEVC |
| **User Management** | Group-based permissions with granular access control |

## Prerequisites

Before you begin, ensure you have:

- [ ] Avigilon ACC Client software installed
- [ ] ACC 7 WebAPI Endpoint Service installed
- [ ] Administrative access to Avigilon ACC system
- [ ] Network connectivity between ACC server and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Port forwarding configured on firewall or router (coordinated with IT team)
- [ ] Static IP or DDNS configured for ACC server (recommended)

## Device Profile

- **Type**: Video Management System (VMS) - Enterprise Analytics Platform
- **Discovery Protocol**: Manual registration via WebAPI Endpoint
- **Event Types**: Motion detection, video analytics (person/vehicle detection), line crossing, area intrusion, tampering, camera disconnection, storage alerts, alarm inputs, analytic events
- **Network Requirements**:
  - **Ports**: HTTP (80), HTTPS (443), ACC Server (configurable), WebAPI Endpoint (configurable)
  - **Connectivity**: Direct IP with port forwarding to WebAPI Endpoint
  - **Bandwidth**: 2-8 Mbps per camera stream (varies by resolution and codec)
- **Known Considerations**:
  - **WebAPI Endpoint mandatory** - Required for external GCXONE communication
  - **Port forwarding required** - IT team must configure firewall/router
  - **Advanced video analytics** - AI-powered person and vehicle detection
  - **User group management** - Granular permission control for GCXONE integration
  - **Alarm configuration** - Comprehensive trigger sources and recipient management
  - **Area of interest** - Define specific zones for analytics monitoring
  - **High-resolution support** - 4K/8K camera compatibility
  - **Analytics tuning** - Configurable sensitivity, threshold time, timeout settings
  - **Object classification** - Person vs vehicle differentiation
  - **Map integration** - Visual site layout with camera positioning

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✗ | Manual configuration via WebAPI |
| | Manual Configuration | ✓ | IP-based with WebAPI Endpoint |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud-based streaming via GCXONE |
| | Playback (Cloud) | ✓ | Cloud video playback |
| | Timeline (Cloud) | ✓ | Event timeline with intelligent search |
| **Events & Alarms** | Event Detection | ✓ | Motion, analytics, alarm inputs |
| | Alarm Management | ✓ | Trigger sources, recipients, recording |
| | Arm/Disarm | ✓ | Site-level and camera-level |
| **Advanced Features** | PTZ/Presets | ✓ | Full PTZ control with locking |
| | Video Analytics | ✓ | AI person/vehicle detection |
| | Genesis Audio (SIP) | ✓ | Two-way audio (microphones/speakers) |
| | Area of Interest | ✓ | Zone-based analytics configuration |
| | Object Classification | ✓ | Person, vehicle, object types |
| | Line Crossing Detection | ✓ | Directional intrusion detection |
| | Area Intrusion Detection | ✓ | Zone-based intrusion alerts |
| | High Resolution Support | ✓ | 4K/8K camera support |
| | Clip Export | ✓ | Video clip export capability |
| | User Group Permissions | ✓ | Granular access control |
| | Digital Outputs | ✓ | Trigger digital outputs on events |
| | Map Integration | ✓ | Visual site maps with cameras |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **WebAPI Endpoint** - External communication bridge for GCXONE
- **Advanced video analytics** - AI-powered person/vehicle detection with object classification
- **Comprehensive alarm management** - Trigger sources, recipients, recording duration
- **User group security** - Granular permission control for GCXONE integration user
- **Area of interest configuration** - Define specific zones for targeted analytics
- **PTZ control** - Full pan, tilt, zoom with control locking
- **Genesis Audio (SIP)** - Two-way audio communication via microphones/speakers
- **Event-driven workflows** - Customizable automation rules based on analytics
- **High-resolution support** - 4K/8K camera compatibility
- **Map integration** - Visual site layout with camera positioning
- **Export capabilities** - Video clip export with identifying features
- **Multi-camera analytics** - Configure analytics across multiple cameras simultaneously
- **Pre/post-motion recording** - Configurable recording buffers around events

## Quick Start

To configure Avigilon VMS with GCXONE:

1. **Install WebAPI Endpoint Service** - Install ACC 7 WebAPI Endpoint (mandatory for external communication)
2. **Configure Analytics** - Set up motion detection analytics with sensitivity, threshold, and area of interest
3. **Create GCXONE User Group** - Create dedicated user group with appropriate permissions (live view, playback, PTZ, audio)
4. **Configure Alarms** - Set up alarm triggers, recording settings, and recipients
5. **Setup Port Forwarding** - Coordinate with IT team to configure firewall/router for WebAPI access
6. **Add to GCXONE** - Register Avigilon VMS in GCXONE using IP address and user group credentials
7. **Verify Integration** - Test live streaming, playback, timeline, analytics events, and alarm notifications

**Estimated setup time: 35-50 minutes**

For detailed step-by-step instructions with screenshots, see the [Installer Configuration Guide](./installer-configuration.md).

## Related Articles

- [Avigilon Installer Configuration](./installer-configuration.md)
- [Avigilon Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-21 v1.0.0 - Comprehensive GCXONE documentation

---

**Need Help?**

If you need assistance with Avigilon VMS integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
