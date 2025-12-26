---
title: "AXIS CS Pro VMS Overview"
description: "Integration guide for AXIS CS Pro VMS with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
  - device:axiscspro
sidebar_position: 1
last_updated: 2025-12-20
---

# AXIS CS Pro VMS

**Device Information:**
- **Device**: VMS
- **Vendor**: Axis Communications
- **Model**: Axis Camera Station Pro (VMS)
- **Firmware**: Version 6.x or later recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Unified integration with Axis VMS for centralized video search, recording retrieval, and event management.
- **Outcome**: Seamless access to ACS Pro recorded archives and real-time alarms within GCXONE.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] [Device-specific software/client installed, if required]
- [ ] [Device or system with compatible firmware]
- [ ] Network connectivity between AXIS CS Pro VMS and GCXONE platform
- [ ] Administrative access to [device interface/management software]
- [ ] GCXONE account with appropriate permissions
- [ ] [Any specific network configuration - VPN, whitelisting, etc.]

## Device Profile

- **Type**: VMS / NVR
- **Discovery Protocol**: ACS Internal API
- **Event Types**: Analytics, System Health, Rule-based Alarms
- **Network Requirements**:
  - **Ports**: 29202 (TCP), 29204 (API), 29205 (Streaming)
  - **Connectivity**: Local Network / VPN / Cloud Proxy
  - **Bandwidth**: High (dependent on number of proxied streams)
- **Known Considerations**: Requires "Web Client" enabled on the ACS server for API access.

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

To configure AXIS CS Pro VMS with GCXONE, follow these main steps:

1. **[High-level step 1]** - [Brief description]
2. **[High-level step 2]** - [Brief description]
3. **[High-level step 3]** - [Brief description]
4. **[High-level step 4]** - [Brief description]

For detailed step-by-step instructions, see the [Configuration Guide](./configuration.md).

## Related Articles

- [AXIS CS Pro VMS Configuration](./configuration.md)
- [AXIS CS Pro VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with AXIS CS Pro VMS integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
