---
title: "GenesisAudio SIP Twillio Overview"
description: "Integration guide for GenesisAudio SIP Twillio with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
  - device:genesisaudio
sidebar_position: 1
last_updated: 2025-12-20
---

# GenesisAudio SIP Twillio

**Device Information:**
- **Device**: Other
- **Vendor**: NXGEN
- **Model**: TOA IP Speakers, Axis Horn Speakers (Axon)
- **Firmware**: SIP-compatible firmware
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Enables high-clarity cloud-to-site audio announcements and automated talk-down sequences via SIP.
- **Outcome**: Seamless integration of IP speakers for reactive monitoring and deterrent actions.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [x] Genesis Audio SIP Domain: genesisaudio.sip.twilio.com
- [x] Valid GCXONE SIP Account (Username/Password)
- [x] Internet connectivity for the speaker device
- [x] Administrative access to the speaker's web interface
- [x] Supported Audio Codecs enabled on the device
- [x] Firewall allows SIP traffic on port 5060 (UDP/TCP)

## Device Profile

- **Type**: IP Audio / SIP Endpoint
- **Discovery Protocol**: Manual / SIP Registration
- **Event Types**: SIP Status, Call Connected, Registration Failure
- **Network Requirements**:
  - **Ports**: 5060 (SIP), 10000-20000 (RTP/Audio)
  - **Connectivity**: Direct Internet Access / SIP Proxy
  - **Bandwidth**: Low (64-128kbps per active call)
- **Known Considerations**: Axis speakers require "Answer Automatically" enabled. Genesis Audio has first priority over device-level audio.

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

To configure GenesisAudio SIP Twillio with GCXONE, follow these main steps:

1. **SIP Account Creation** - Generate credentials in GCXONE Configuration App.
2. **Device Registration** - Enter SIP domain and credentials into the speaker's web UI.
3. **Codec Configuration** - Ensure supported codecs are enabled for audio transmission.
4. **Functional Test** - Use the Video Viewer "Mic" icon to verify talk-down capability.

For detailed step-by-step instructions, see the [Configuration Guide](./configuration.md).

## Related Articles

- [GenesisAudio SIP Twillio Configuration](./configuration.md)
- [GenesisAudio SIP Twillio Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with GenesisAudio SIP Twillio integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
