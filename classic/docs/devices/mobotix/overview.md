---
title: "Mobotix IP Camera Overview"
description: "Integration guide for Mobotix IP Camera with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:mobotix
sidebar_position: 1
last_updated: 2025-12-20
---

# Mobotix IP Camera

**Device Information:**
- **Device**: IP Camera
- **Vendor**: Mobotix
- **Model**: Various Mobotix IP Camera Models
- **Firmware**: MxPEG firmware 4.x or higher recommended
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: High-quality IP cameras with decentralized architecture and weatherproof German engineering for demanding environments.
- **Outcome**: Cloud integration with live video, events, arm/disarm, and Genesis Audio using MxPEG codec.
- **Audience**: Technical Installers / Field Engineers / Support

## Prerequisites

Before you begin, ensure you have:

- [ ] Mobotix IP camera with latest firmware
- [ ] Administrative access to Mobotix camera web interface
- [ ] Network connectivity between camera and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP or DHCP reservation configured for camera (recommended)
- [ ] Firewall allows required ports (HTTP, HTTPS, RTSP)

## Device Profile

- **Type**: IP Camera - Decentralized Architecture
- **Discovery Protocol**: ONVIF / Manual IP configuration
- **Event Types**: Motion detection, tampering, audio detection, PIR sensor events (select models), network loss, storage alerts
- **Network Requirements**:
  - **Ports**: HTTP (80), HTTPS (443), RTSP (554)
  - **Connectivity**: Direct IP with cloud integration
  - **Bandwidth**: 0.5-3 Mbps per camera (MxPEG codec optimized)
- **Known Considerations**:
  - **Decentralized architecture** - On-camera processing and storage
  - **MxPEG codec** - Proprietary codec optimized for low bandwidth
  - **Built-in storage** - Cameras include microSD card slot
  - **Weatherproof** - Designed for extreme temperatures (-40°C to +65°C)
  - **Dual sensor models** - Some models have dual optical sensors
  - **Audio support** - Built-in microphone and speaker on many models
  - **ONVIF Profile S** - Standard ONVIF compatibility
  - **PoE powered** - Power over Ethernet support
  - **German engineering** - High build quality and reliability

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Auto-Discovery | ✓ | ONVIF discovery supported |
| | Manual Configuration | ✓ | IP-based configuration |
| **Cloud Capabilities** | Live Streaming (Cloud) | ✓ | Cloud streaming via GCXONE |
| **Events & Alarms** | Event Detection | ✓ | Motion, tampering, audio detection |
| | Arm/Disarm | ✓ | Camera-level arming |
| **Advanced Features** | Genesis Audio (SIP) | ✓ | Two-way audio communication |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Decentralized architecture** - On-camera intelligence and storage
- **MxPEG codec** - Bandwidth-optimized streaming
- **ONVIF compatibility** - Standard protocol support
- **Built-in storage** - Local recording on microSD card
- **Genesis Audio (SIP)** - Two-way audio communication
- **Event detection** - Motion, tampering, audio alerts
- **Arm/disarm functions** - Camera-level security control
- **Weatherproof design** - Extreme temperature operation
- **German quality** - Reliable hardware and firmware
- **Low bandwidth** - Optimized for remote locations

## Quick Start

To configure Mobotix IP Camera with GCXONE:

1. **Configure Camera Network** - Access camera web interface, configure static IP or DHCP, verify network connectivity
2. **Enable ONVIF/Cloud Integration** - Enable ONVIF service, create integration user with full permissions
3. **Add to GCXONE** - Register camera in GCXONE using IP address and credentials
4. **Configure Events and Audio** - Set up motion detection, arm/disarm, and Genesis Audio (SIP) if required
5. **Verify Integration** - Test live streaming, event detection, and audio functions

**Estimated setup time: 15-20 minutes**

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Related Articles

- [Mobotix IP Camera Configuration](./configuration.md)
- [Mobotix IP Camera Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)
- [Standard Device Onboarding Process](/docs/device-integration/standard-device-onboarding-process)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE documentation

---

**Need Help?**

If you need assistance with Mobotix IP Camera integration, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
