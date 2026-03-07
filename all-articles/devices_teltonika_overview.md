---
title: "Teltonika Router Overview"
description: "Integration guide for Teltonika industrial GPS tracking routers with cellular connectivity and I/O monitoring"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:teltonika
sidebar_position: 1
last_updated: 2025-12-21
---

# Teltonika Router

**Device Information:**
- **Device**: Industrial Cellular Router with GPS Tracking
- **Vendor**: Teltonika
- **Model**: Various models (RUT series, TRB series)
- **Firmware**: Compatible versions
- **Platform**: GCXONE
- **Doc Version**: 1.0.0

## Summary

- **Purpose**: Industrial cellular router with GPS tracking, digital I/O monitoring, and event management for remote connectivity.
- **Outcome**: Cloud integration with GPS location tracking, cellular connectivity status, I/O event monitoring, and arm/disarm control.
- **Audience**: Technical Installers / Field Engineers / Support

## At a Glance

| Aspect | Details |
|--------|---------|
| **Setup Time** | 15-20 minutes |
| **Difficulty** | Intermediate |
| **Setup Method** | Serial number registration + custom HTTPS receiver URL configuration |
| **Connectivity** | Cellular (LTE/4G/5G), Ethernet, Wi-Fi (model-dependent) |
| **Integration Type** | HTTPS-based data transmission with custom receiver URL |
| **Ports Required** | HTTPS (443) outgoing |
| **Key Features** | GPS tracking, location updates, digital I/O monitoring, arm/disarm, event notifications |
| **GPS Capabilities** | Real-time location tracking with configurable update intervals |
| **I/O Monitoring** | Digital input/output monitoring for sensors and control devices |
| **Ideal Use Cases** | Remote sites, asset tracking, vehicle tracking, backup connectivity, IoT device networking |

## Prerequisites

Before you begin, ensure you have:

- [ ] Administrative access to Teltonika Router web interface
- [ ] Network connectivity to router device
- [ ] Active GPS signal and properly connected GPS antenna
- [ ] HTTPS connectivity for data transmission
- [ ] GCXONE account with device configuration permissions
- [ ] Device serial number (from router status page)
- [ ] Cellular connectivity (SIM card with data plan, if applicable)

## Device Profile

- **Type**: Industrial Cellular Router - GPS Tracking & IoT Connectivity
- **Discovery Protocol**: Serial number-based registration
- **Event Types**: GPS location updates, device status changes, digital I/O events, connectivity loss, arm/disarm state changes, cellular signal strength
- **Network Requirements**:
  - **Connectivity**: Cellular (LTE/4G/5G primary), Ethernet, Wi-Fi (model-dependent)
  - **Outgoing**: HTTPS (443) to GCXONE custom receiver URL
  - **GPS**: Active GPS signal required for location tracking
  - **Bandwidth**: Minimal (periodic GPS updates and I/O events)
- **Known Considerations**:
  - **Serial number registration** - Device serial number required for GCXONE registration
  - **Custom receiver URL** - HTTPS URL from GCXONE must be configured in GPS service settings
  - **GPS service mandatory** - GPS service must be enabled for location tracking
  - **GPS antenna** - External GPS antenna must be properly connected and positioned
  - **Cellular connectivity** - SIM card with data plan required for cellular models
  - **Digital I/O** - Configurable digital inputs/outputs for sensor and control integration
  - **Arm/disarm functionality** - Remote control of device operating modes
  - **Event-driven updates** - Configurable GPS update intervals and I/O event triggers
  - **HTTPS communication** - Secure data transmission to GCXONE platform
  - **Industrial design** - Ruggedized for harsh environments and outdoor deployment

## Supported Features

### Core Functions

| Feature Category | Feature | Status | Notes |
|-----------------|---------|--------|-------|
| **Discovery & Setup** | Serial Number Discovery | ✓ | Manual registration via serial number |
| | Custom Receiver URL | ✓ | HTTPS-based data transmission |
| **GPS Tracking** | Real-Time Location | ✓ | GPS coordinates with configurable intervals |
| | Location Updates | ✓ | Periodic or event-driven updates |
| | GPS Service | ✓ | Configurable GPS settings |
| **Connectivity** | Cellular (LTE/4G/5G) | ✓ | Primary connectivity (model-dependent) |
| | Ethernet | ✓ | Wired connectivity option |
| | Wi-Fi | ✓ | Wireless connectivity (model-dependent) |
| **Events & Monitoring** | Event Detection | ✓ | I/O events, connectivity changes |
| | Device Status | ✓ | Online/offline, signal strength |
| | Arm/Disarm | ✓ | Operating mode control |
| **I/O Capabilities** | Digital Inputs | ✓ | Sensor monitoring (door, motion, etc.) |
| | Digital Outputs | ✓ | Device control (relay, alarm, etc.) |
| | I/O Event Triggers | ✓ | Configurable event notifications |
| **Advanced Features** | HTTPS Communication | ✓ | Secure data transmission |
| | Cellular Signal Monitoring | ✓ | Signal strength and quality tracking |
| | Failover/Backup | ✓ | Multiple connectivity options |
| | Remote Configuration | ✓ | Web-based management interface |

**Legend**: ✓ Supported | ○ Partial Support | ✗ Not Supported

**Integration Highlights:**
- **GPS tracking** - Real-time location updates with configurable intervals for asset and vehicle tracking
- **Industrial cellular connectivity** - LTE/4G/5G primary connectivity with failover options
- **Digital I/O monitoring** - Monitor sensors (door contacts, motion detectors) and control devices (relays, alarms)
- **HTTPS-based integration** - Secure data transmission via custom receiver URL
- **Serial number registration** - Simple device onboarding using device serial number
- **Arm/disarm control** - Remote control of device operating modes via GCXONE
- **Event-driven architecture** - Configurable triggers for GPS updates and I/O events
- **Multi-connectivity** - Cellular, Ethernet, Wi-Fi for redundancy and flexibility
- **Industrial design** - Ruggedized for harsh environments and outdoor deployment
- **Minimal bandwidth** - Efficient data transmission for cellular cost optimization
- **Remote management** - Web-based configuration interface for settings and troubleshooting
- **Ideal for remote sites** - Cellular connectivity enables deployment in locations without fixed infrastructure

## Quick Start

To configure Teltonika Router with GCXONE:

1. **Obtain Device Serial Number** - Login to Teltonika router web interface → Status → Device, copy serial number
2. **Add Device in GCXONE** - Navigate to Configuration App → Site → Devices → Add → Teltonika, enter serial number and save
3. **View Device Information** - Click "View" button to verify device registration
4. **Obtain Custom Receiver URL** - Click "Edit" button in device configuration, copy "Teltonika Custom Receiver URL"
5. **Configure GPS Service** - In Teltonika router, navigate to Service → GPS
6. **Configure HTTPS URL** - Go to HTTPS tab in GPS settings, paste custom receiver URL from step 4, save configuration
7. **Verify GPS Antenna** - Ensure GPS antenna is properly connected and positioned for signal reception
8. **Configure I/O Settings** (if applicable) - Set up digital inputs/outputs for sensor and control integration
9. **Verify Integration** - Check GPS location data in GCXONE, test I/O event notifications, confirm device status is online

**Estimated setup time: 15-20 minutes**

For detailed step-by-step instructions with screenshots, see the [Installer Configuration Guide](./installer-configuration.md).

## Related Articles

- [Teltonika Installer Configuration](./installer-configuration.md)
- Teltonika Troubleshooting
- 
- 

## Change Log

- 2025-12-21 v1.0.0 - Comprehensive GCXONE documentation

---

**Need Help?**

If you need assistance with Teltonika Router integration, check our Troubleshooting Guide or [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
