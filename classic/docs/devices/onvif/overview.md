---
title: "ONVIF IP Camera Overview"
description: "Generic integration guide for ONVIF-compatible IP cameras with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:onvif
sidebar_position: 1
last_updated: 2025-12-20
---

# ONVIF IP Camera

**Device Information:**
- **Device**: IP Camera (Generic ONVIF)
- **Vendor**: Various (ONVIF-Compatible)
- **Model**: Any ONVIF Profile S or Profile T compliant camera
- **Firmware**: Compatible ONVIF firmware
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Universal integration for any ONVIF-compatible IP camera using standardized protocol for broad manufacturer support.
- **Outcome**: Cloud integration with event detection, arm/disarm, and Genesis Audio using industry-standard ONVIF protocol.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 10-15 minutes |
| **Difficulty** | Beginner |
| **Setup Method** | Manual configuration via camera web interface |
| **Protocol** | ONVIF (Profile S/T) |
| **Compatibility** | 5,000+ camera models from various manufacturers |
| **Ports Required** | HTTP 80, HTTPS 443, RTSP 554, ONVIF (varies) |
| **Key Features** | Event detection, arm/disarm, Genesis Audio (if supported) |
| **Profile Support** | Profile S (H.264), Profile T (H.265) |
| **Manufacturers** | Axis, Bosch, Dahua, Hanwha, Hikvision, Pelco, Sony, Uniview, etc. |
| **Use Case** | Universal integration for cameras without manufacturer-specific support |

## Prerequisites

Before you begin, ensure you have:

- [ ] ONVIF-compatible IP camera (Profile S or Profile T)
- [ ] Administrative access to camera web interface
- [ ] Network connectivity between camera and GCXONE platform
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP or DHCP reservation configured for camera
- [ ] ONVIF service enabled on camera

## Device Profile

- **Type**: IP Camera - Generic ONVIF
- **Discovery Protocol**: ONVIF (WS-Discovery)
- **Event Types**: Motion detection, tampering, digital inputs, ONVIF events
- **Network Requirements**:
  - **Ports**: HTTP (80), HTTPS (443), RTSP (554), ONVIF (varies by manufacturer)
  - **Connectivity**: Direct IP with ONVIF protocol
  - **Bandwidth**: 1-8 Mbps per camera (varies by resolution and codec)
- **Known Considerations**:
  - **ONVIF standard** - Universal protocol for IP camera integration
  - **Profile S** - Standard ONVIF profile for streaming
  - **Profile T** - Advanced ONVIF profile with H.265 support
  - **Manufacturer variations** - ONVIF implementation quality varies
  - **Limited features** - Generic integration supports core functions only
  - **Broad compatibility** - Works with thousands of camera models
  - **Standard authentication** - WS-UsernameToken or Digest authentication
  - **Event support** - ONVIF event subscription for alerts

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Events & Alarms** | Event Detection | ✓ | ONVIF motion and alarm events |
| | Arm/Disarm | ✓ | Camera-level arming via ONVIF |
| **Advanced Features** | Genesis Audio (SIP) | ✓ | Two-way audio (if camera supports) |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Universal compatibility** - Works with any ONVIF-compliant camera
- **ONVIF standard protocol** - Industry-standard integration
- **Event detection** - Motion detection and alarm events
- **Arm/disarm functions** - Camera-level security control
- **Genesis Audio (SIP)** - Two-way audio (camera-dependent)
- **Broad manufacturer support** - Axis, Bosch, Dahua, Hanwha, Hikvision, Pelco, Sony, Uniview, and thousands more
- **Simple setup** - Minimal configuration required
- **Profile S/T support** - H.264 and H.265 streaming

## Quick Start

To configure any ONVIF-compatible IP camera with GCXONE:

1. **Configure Camera Network** - Access camera web interface, configure static IP, verify ONVIF service is enabled
2. **Create ONVIF User** - Create user account for GCXONE integration with appropriate ONVIF permissions
3. **Add to GCXONE** - Register camera in GCXONE using ONVIF protocol with IP address and credentials
4. **Configure Events** - Enable event detection and arm/disarm functions in GCXONE
5. **Verify Integration** - Test event detection and audio functions (if supported)

**Estimated setup time: 10-15 minutes**

For detailed step-by-step instructions with screenshots, see the [Configuration Guide](./configuration.md).

## Compatibility Notes

**ONVIF Profile Support:**
- **Profile S**: Streaming - Most common, supports H.264 video streaming
- **Profile T**: Advanced Streaming - Supports H.265/HEVC for bandwidth efficiency

**Tested Manufacturers:**
This generic ONVIF integration has been tested with cameras from:
- Axis Communications
- Bosch Security Systems
- Dahua Technology
- Hanwha Techwin (Samsung)
- Hikvision
- Pelco
- Sony Professional
- Uniview
- And 5,000+ other ONVIF-compliant models

**Feature Availability:**
Features depend on camera capabilities and ONVIF implementation quality. Some manufacturers implement ONVIF more comprehensively than others.

## Related Articles

- [ONVIF IP Camera Configuration](./configuration.md)
- ONVIF IP Camera Troubleshooting
- 
- 
- [Standard Device Onboarding Process](/docs/devices/general/onboarding-overview)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE generic ONVIF documentation

---

**Need Help?**

If you need assistance with ONVIF IP Camera integration, check our Troubleshooting Guide or [contact support](/docs/support/contact).
