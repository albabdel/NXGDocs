---
title: "Reconeyez PIR Cam Overview"
description: "Integration guide for Reconeyez battery-powered PIR event cameras with wireless connectivity and cloud integration"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:reconeyez
sidebar_position: 1
last_updated: 2025-12-21
---

# Reconeyez PIR Cam

**Device Information:**
- **Device**: Battery-Powered PIR Event Camera
- **Vendor**: Reconeyez
- **Model**: Reconeyez PIR Cam (various models)
- **Firmware**: Latest stable version
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Battery-powered wireless PIR camera with event-driven video capture for temporary or remote surveillance locations.
- **Outcome**: Cloud integration with event-triggered video clips, webhook notifications, arm/disarm control, and wireless connectivity.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 15-25 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | Cloud-based via Reconeyez platform + GCXONE webhook integration |
| **Connectivity** | LTE/4G (SIM card) or Wi-Fi |
| **Integration Type** | Webhook-based event forwarding via cloud platform |
| **Power** | Battery-powered (optimized for extended deployment) |
| **Key Features** | Event-driven capture, PIR motion detection, wireless deployment, arm/disarm |
| **Video Capture** | 10-15 second clips on event trigger (not continuous streaming) |
| **Protocols Supported** | Webhook, API, SIA, Contact ID, Email/FTP |
| **Ideal Use Cases** | Temporary sites, remote locations, off-grid surveillance, construction sites |

## Prerequisites

Before you begin, ensure you have:

- [ ] Valid SIM card with data plan (for LTE/4G connectivity) OR Wi-Fi access
- [ ] Reconeyez mobile app or cloud platform access
- [ ] Device ID from Reconeyez client (used as Serial number in GCXONE)
- [ ] Network connectivity allowing outgoing connections to cloud platform
- [ ] GCXONE account with device configuration permissions
- [ ] Webhook configuration capability in GCXONE
- [ ] Adequate mobile signal strength (for LTE) or Wi-Fi coverage

## Device Profile

- **Type**: Battery-Powered PIR Event Camera - Wireless IoT Device
- **Discovery Protocol**: Manual registration via Device ID
- **Event Types**: PIR motion detection, event-driven video capture, snapshot triggers, arm/disarm state changes, battery alerts, connectivity loss
- **Network Requirements**:
  - **Connectivity**: LTE/4G (SIM card required) or Wi-Fi (SSID/password configuration)
  - **Outgoing Connections**: Cloud platform (minimal manual IP configuration needed)
  - **Firewall**: Allow outgoing connections to Reconeyez Cloud
  - **Bandwidth**: Minimal (event-driven clips only, not continuous streaming)
- **Known Considerations**:
  - **Battery-powered** - Optimized for event-driven capture, not continuous streaming
  - **Event-driven video** - 10-15 second clips on trigger (preserves battery life)
  - **Webhook integration mandatory** - Configure workflow in GCXONE for event notifications
  - **Device ID as Serial** - Use Device ID from Reconeyez client as Serial number (mandatory)
  - **Wireless deployment** - No wired power or network required (ideal for temporary sites)
  - **LTE/4G or Wi-Fi** - Flexible connectivity options for various deployment scenarios
  - **PIR motion detection** - Passive Infrared sensor triggers video capture
  - **Snapshot capture** - Configurable photo intervals and count
  - **Cloud-based management** - Configure via Reconeyez mobile app or cloud portal
  - **SIA/Contact ID support** - Central monitoring station integration available

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Device Discovery | ✓ | Manual registration via Device ID |
| | Cloud Integration | ✓ | Reconeyez Cloud platform |
| **Connectivity** | LTE/4G | ✓ | SIM card with data plan required |
| | Wi-Fi | ✓ | SSID/password configuration |
| **Events & Alarms** | Event Detection | ✓ | PIR motion-triggered capture |
| | Arm/Disarm | ✓ | Schedule-based or manual control |
| | Webhook Notifications | ✓ | Real-time event forwarding to GCXONE |
| **Video Capture** | Event-Driven Clips | ✓ | 10-15 second clips on trigger |
| | Snapshot/Photos | ✓ | Configurable intervals and count |
| | Continuous Streaming | ✗ | Not supported (battery optimization) |
| **Advanced Features** | Battery-Powered Operation | ✓ | Extended deployment capability |
| | API Access | ✓ | Event forwarding and video retrieval |
| | Email/FTP Notifications | ✓ | External system integration |
| | SIA Protocol | ✓ | Central monitoring station integration |
| | Contact ID Protocol | ✓ | Alternative monitoring protocol |
| | Cloud-to-Cloud Integration | ✓ | Platform interconnectivity |
| | Historical Event Review | ✓ | Cloud-stored event access |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **Battery-powered wireless** - No wired power or network infrastructure required
- **Event-driven optimization** - 10-15 second clips preserve battery life while capturing critical events
- **Flexible connectivity** - LTE/4G (SIM card) or Wi-Fi for various deployment scenarios
- **Webhook-based integration** - Real-time event notifications to GCXONE via configured workflow
- **PIR motion detection** - Passive Infrared sensor triggers video capture on movement
- **Cloud-based management** - Configure via Reconeyez mobile app or cloud portal
- **Ideal for temporary sites** - Construction sites, remote locations, off-grid surveillance
- **Snapshot capability** - Configurable photo intervals and count for additional verification
- **Central monitoring integration** - SIA and Contact ID protocol support
- **API access** - Programmatic event forwarding and video retrieval
- **Email/FTP notifications** - Integration with external monitoring systems
- **Arm/disarm control** - Schedule-based or manual surveillance mode management

## Quick Start

To configure Reconeyez PIR Cam with GCXONE:

1. **Network Configuration** - Insert SIM card with data plan (for LTE/4G) OR configure Wi-Fi via mobile app/cloud portal
2. **Verify Connectivity** - Ensure adequate signal strength (mobile or Wi-Fi) and cloud platform connectivity
3. **Configure Event Triggers** - Access Reconeyez cloud portal/mobile app and set up event-driven capture parameters
4. **Set Video Clip Duration** - Configure 10-15 second clips and snapshot intervals/count
5. **Setup Platform Integration** - Configure webhook for event forwarding and API access in Reconeyez platform
6. **Configure GCXONE Webhook** - In GCXONE, configure workflow to add webhook for event notifications (mandatory)
7. **Add Device in GCXONE** - Navigate to Site → Devices → Add → Reconeyez, provide Device Name and Serial Number (use Device ID from Reconeyez client)
8. **Discover and Save** - Click "Discover" to detect device, verify discovery success, and click "Save"
9. **Verify Integration** - Test event-driven capture, webhook notifications, and API access

**Estimated setup time: 15-25 minutes**

For detailed step-by-step instructions with screenshots, see the [Installer Configuration Guide](./installer-configuration.md).

## Related Articles

- [Reconeyez Installer Configuration](./installer-configuration.md)
- Reconeyez Troubleshooting
- 

## Change Log

- 2025-12-21 v1.0.0 - Comprehensive GCXONE documentation

---

**Need Help?**

If you need assistance with Reconeyez PIR Cam integration, check our Troubleshooting Guide or [contact support](/docs/support/contact).
