---
title: "Axis IP Camera Overview"
description: "Integration guide for Axis IP Camera with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:axis
sidebar_position: 1
last_updated: 2025-12-20
---

# Axis IP Camera

**Device Information:**
- **Device**: IP Camera
- **Vendor**: Axis Communications
- **Model**: Axis Family (Cameras, Speakers, I/O, ACS Pro)
- **Firmware**: Latest Axis LTS firmware
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Unified monitoring, event ingestion, and proactive control of Axis hardware including ACS Pro, IP Speakers, and I/O Modules.
- **Outcome**: Seamless video, alarm delivery, and unified audio/relay control within the GCXONE ecosystem.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 15-25 minutes |
| **Difficulty** | Beginner |
| **Setup Method** | VAPIX API / SDK integration |
| **Product Range** | Cameras, Speakers, I/O Modules, ACS Pro |
| **Protocol** | VAPIX API, ONVIF, SIP (audio) |
| **Ports Required** | HTTP/HTTPS 80/443, RTSP 554, SIP 5060, ACS API 29204 |
| **Key Features** | Live streaming, events, PTZ, audio control, I/O, analytics |
| **Firmware** | Latest Axis LTS firmware recommended |
| **Video Codecs** | H.264, H.265/HEVC |
| **Integration Type** | Direct IP / VPN / Cloud Proxy |

## Prerequisites

Before you begin, ensure you have:

- [x] Axis Camera Station Pro (if integrating via VMS)
- [x] Axis device with VAPIX API support
- [x] Network connectivity between Axis device and GCXONE platform
- [x] Administrative access to Axis device web interface
- [x] GCXONE account with appropriate permissions
- [x] VPN or port forwarding (80/443, 554) configured

## Device Profile

- **Type**: IP Camera / VMS / I/O / IP Audio
- **Discovery Protocol**: VAPIX API / SDK
- **Event Types**: Motion, Tamper, I/O, System Health, Analytics
- **Network Requirements**:
  - **Ports**: 80/443 (Control), 554 (RTSP), 5060 (SIP Audio), 29204 (ACS API)
  - **Connectivity**: Direct IP / VPN / Cloud Proxy
  - **Bandwidth**: Dependent on stream resolution (H.264/H.265 supported)
- **Known Considerations**: ACS Pro requires "Web Client" enabled for integration. Genesisaudio priority for SIP speakers.

## Supported Features

### Core Functions

| Feature Category       | Feature                | Status            | Notes            |
| ---------------------- | ---------------------- | ----------------- | ---------------- |
| **Discovery & Setup**  | Auto-Discovery         | [✓ / ✗ / Partial] | [Optional notes] |
|                        | Manual Configuration   | [✓ / ✗]           |                  |
| **Cloud Capabilities** | Live Streaming (Cloud) | [✓ / ✗]           |                  |
|                        | Playback (Cloud)       | [✓ / ✗]           |                  |
|                        | Timeline (Cloud)       | [✓ / ✗]           |                  |
| **Local Capabilities** | Live Streaming (Local) | [✓ / ✗]           |                  |
|                        | Playback (Local)       | [✓ / ✗]           |                  |
|                        | Local SDK Audio        | [✓ / ✗]           |                  |
| **Events & Alarms**    | Event Detection        | [✓ / ✗]           |                  |
|                        | Arm/Disarm             | [✓ / ✗]           |                  |
|                        | Event Acknowledgement  | [✓ / ✗]           |                  |
| **Advanced Features**  | PTZ/Presets            | [✓ / ✗]           |                  |
|                        | I/O Control            | [✓ / ✗]           |                  |
|                        | Genesis Audio (SIP)    | [✓ / ✗]           |                  |
|                        | 4K/High Resolution     | [✓ / ✗]           |                  |
|                        | Timelapse              | [✓ / ✗ / Partial] |                  |
|                        | Mobile App Support     | [✓ / ✗]           |                  |

**Note**: Add or remove features based on device capabilities. Minimum 15 features recommended.

## Quick Start

To configure Axis IP Camera with GCXONE, follow these main steps:

1. **Device Discovery** - Add ACS Pro or standalone devices via the Configuration App.
2. **Event Configuration** - Set up HTTPS webhooks for real-time alarm ingestion.
3. **Audio Setup** - Configure SIP credentials for speakers if using talk-down features.
4. **Verification** - Test live streams and trigger alarms to verify platform response.

For detailed step-by-step instructions, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Axis IP Camera Configuration](./configuration.md)
- [Axis IP Camera Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Axis IP Camera integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
