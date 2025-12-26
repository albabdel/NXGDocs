---
title: "Ganz Overview"
description: "Configure Ganz devices to integrate seamlessly with GC-X-ONE platform for video surveillance and event management."
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:ganz
sidebar_position: 1
last_updated: 2025-12-04
---

# Ganz

**Device Information:**
- **Device**: Ganz Device Model
- **Vendor**: Ganz
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

## Summary

- Purpose: Configure Ganz devices to integrate seamlessly with GC-X-ONE platform for video surveillance and event management.
- Outcome: Enhanced functionality with live streaming, event detection, and alarm management through GC-X-ONE integration.
- Audience: Field engineer / Support.

## Prerequisites

- Network connectivity to Ganz device
- Administrative access to device configuration
- Proper firewall configuration for HTTP/HTTPS and RTSP ports
- NTP server access for time synchronization

## Device Profile

- Type: IP Camera/Video Surveillance Device
- Discovery: ONVIF Protocol
- Events: Motion detection, tampering, line crossing, intrusion detection
- Ports: HTTP/HTTPS (80/443), RTSP (554)
- Known quirks: Requires **proper time synchronization** for accurate event timestamps. **ONVIF** should be enabled for third-party platform integration. **Stream configuration** affects performance optimization.

**Core Functions**

- Live: Supported
- Events: Supported (Motion, Tampering, Line Crossing, Intrusion)
- Stream Configuration: Supported (H.264/H.265)
- Time Sync: NTP Supported
- ONVIF: Supported

## Steps

### Step 1 — Network Configuration

- UI path: **Ganz Device → Network Settings**

- Configure Network Settings
  - Assign a Static IP or use DHCP
  - Configure:
    - IP Address
    - Subnet Mask
    - Default Gateway
    - DNS Server
  - Ensure port forwarding is set up if accessing the device over the internet
  - Make sure firewall settings allow access on HTTP/HTTPS and RTSP ports (typically 80/443 and 554)
  - ![Ganz Network Configuration](./images/ganz 1.png)

- Expected result: Network connectivity established to Ganz device

### Step 2 — Time Settings Configuration

- UI path: **Ganz Device → Time Settings**

- Configure Time Synchronization
  - Set the time zone correctly
  - Enable NTP (Network Time Protocol) to sync time with a reliable time server (e.g., pool.ntp.org)
  - Ensure both the camera and VMS server are time-synced
  - ![Ganz Time Settings](./images/ganz 2.png)

- Expected result: Time settings configured with NTP synchronization for accurate event timestamps

### Step 3 — Alarm/Event Configuration

- UI path: **Ganz Device → Alarm/Event Settings**

- Configure Event Detection
  - Configure motion detection zones in the camera settings
  - Set up alarm input/output (if the device has I/O ports)
  - Enable event triggers such as:
    - Motion detection
    - Tampering
    - Line crossing
    - Intrusion detection
  - Set notification methods (email, snapshot upload, or VMS alert)
  - Test event triggers to verify correct operation
  - ![Ganz Alarm Configuration 1](./images/ganz 3.png)
  - ![Ganz Alarm Configuration 2](./images/ganz 4.png)
  - ![Ganz Alarm Configuration 3](./images/ganz 5.png)
  - ![Ganz Alarm Configuration 4](./images/ganz 6.png)

- Expected result: Event triggers configured and tested for proper operation

### Step 4 — Live View Settings

- UI path: **Ganz Device → Live View/Stream Settings**

- Configure Stream Settings
  - Select stream type (main stream/sub-stream)
  - Set resolution, frame rate, and compression (H.264/H.265) for performance optimization
  - Enable ONVIF if using with third-party platforms
  - ![Ganz Stream Settings 1](./images/ganz 7.png)
  - ![Ganz Stream Settings 2](./images/ganz 8.png)

- Expected result: Live stream configured and optimized for GC-X-ONE integration

### Step 5 — Add Device in GC-X-ONE

- UI path: **GC-X-ONE → Configuration App → Site → Devices → Add → GanzAI**

- Configure Device in GC-X-ONE
  - Login to GC-X-ONE
  - Navigate to configuration app
  - Navigate to Site → Devices → Add → GanzAI
  - Provide the mandatory details:
    - Device Name
    - IP Address
    - Username and Password
    - Port configuration
  - Click on Discover
  - Click Save
  - ![Ganz GC-X-ONE Configuration](./images/ganz 9.png)

- Expected result: Ganz device successfully added and discovered in GC-X-ONE

### Step 6 — Verify Integration

- Checks
  - Verify live stream appears in GC-X-ONE
  - Test event detection and alarm notifications
  - Confirm time synchronization is working
  - Check ONVIF compatibility
  - Verify all configured event triggers are functioning

- Expected result: Complete Ganz integration with GC-X-ONE platform

## Troubleshooting

- Network connectivity issues
  - Verify IP address, subnet mask, and gateway configuration
  - Check firewall settings for required ports (80/443, 554)
  - Ensure port forwarding is configured correctly for remote access

- Time synchronization problems
  - Verify NTP server is reachable
  - Check time zone settings match GC-X-ONE
  - Ensure both camera and VMS server are time-synced

- Event detection issues
  - Test motion detection zones and sensitivity settings
  - Verify alarm input/output configuration
  - Check notification methods are properly configured
  - Ensure event triggers are enabled and tested

- Stream quality problems
  - Adjust resolution, frame rate, and compression settings
  - Check network bandwidth availability
  - Verify stream type configuration (main/sub-stream)

- ONVIF compatibility issues
  - Ensure ONVIF is enabled on the device
  - Verify ONVIF profile compatibility with GC-X-ONE
  - Check device discovery settings

## Notes

- Time synchronization is crucial for accurate event timestamps
- ONVIF should be enabled for third-party platform integration
- Stream configuration affects performance - optimize based on network capacity
- Test all event triggers after configuration to ensure proper operation
- Ensure proper firewall configuration for required ports

## Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)

