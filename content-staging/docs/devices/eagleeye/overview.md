---
title: "EagleEye Overview"
description: "Configure EagleEye Bridge to integrate with GC-X-ONE platform for video surveillance and camera management."
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:eagleeye
sidebar_position: 1
last_updated: 2025-12-04
---

# EagleEye

**Device Information:**
- **Device**: EagleEye Device Model
- **Vendor**: EagleEye
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

## Summary

- Purpose: Configure EagleEye Bridge to integrate with GC-X-ONE platform for video surveillance and camera management.
- Outcome: Enhanced functionality with bridge connectivity and camera network management through GC-X-ONE integration.
- Audience: Field engineer / Support.

## Prerequisites

- Administrative access to EagleEye Bridge configuration
- Network connectivity to bridge device
- Active internet connection for cloud system integration
- ESN (Equipment Serial Number) from bridge device

## Device Profile

- Type: Camera Bridge/Network Video Recorder
- Discovery: ESN (Equipment Serial Number) Based
- Events: Camera connectivity, network status
- Ports: WAN (1000Mb/s), CamLAN (1000Mb/s)
- Known quirks: Requires **ESN (Equipment Serial Number)** for device registration. **Bridge settings** must be properly configured. **User settings** configuration is essential for proper operation.

**Core Functions**

- Bridge Management: Supported
- Camera Network: Supported (Gigabit speeds)
- Cloud Integration: Supported via GUID
- User Management: Supported
- High-throughput Support: Up to 1000Mb/s for multiple cameras

## Steps

### Step 1 — Obtain Bridge Information

- UI path: **EagleEye Bridge → Bridge Settings**

- Collect Bridge Details
  - Access EagleEye Bridge configuration interface
  - Navigate to Bridge Settings section
  - Record the following hardware and network information:
    - **SSN**: Serial number of the bridge
    - **IP Address**: Local IP address assigned to the bridge on internal network
    - **ESN**: Equipment Serial Number (Required for GC-X-ONE registration)
    - **GUID**: Unique global identifier for the device in cloud system
    - **WAN**: 1000Mb/s - WAN (uplink) connection supports gigabit speeds
    - **CamLan**: 1000Mb/s - Bridge's camera network interface supports gigabit speeds
    - **CamLan+**: Confirms camera LAN supports up to 1000Mb/s (Gigabit) for high-throughput support
  
  ![EagleEye Bridge Settings](./images/EagleEye 1.png)

- Expected result: Bridge information collected for registration and configuration

### Step 2 — Configure User Settings

- UI path: **EagleEye Bridge → User Settings**

- Set User Configuration
  - Navigate to User Settings section in bridge interface
  - Configure user accounts and permissions as required
  - Set up authentication parameters
  - Configure access levels and security settings
  - Ensure proper user management for system access
  
  ![EagleEye User Settings 1](./images/EagleEye 2.png)
  
  ![EagleEye User Settings 2](./images/EagleEye 3.png)
  
  ![EagleEye User Settings 3](./images/EagleEye 4.png)

- Expected result: User settings properly configured for bridge access and management

### Step 3 — Add Device in GC-X-ONE

- UI path: **GC-X-ONE → Configuration App → Site → Devices → Add → EagleEye**

- Register EagleEye Device
  - Login to GC-X-ONE platform
  - Navigate to configuration app
  - Go to Site → Devices → Add → EagleEye
  - Provide the mandatory details:
    - **Device Name**: Descriptive name for the bridge
    - **ESN**: Equipment Serial Number obtained from Step 1
    - **IP Address**: Bridge IP address
    - **Authentication credentials**: As configured in user settings
  - Click on "Discover" to detect the device
  - Verify device discovery is successful
  - Click "Save" to complete registration
  
  ![EagleEye GC-X-ONE Configuration](./images/EagleEye 5.png)

- Expected result: EagleEye bridge successfully added and discovered in GC-X-ONE

### Step 4 — Verify Integration

- Checks
  - Verify bridge appears in GC-X-ONE device list
  - Confirm network connectivity is established
  - Test camera network functionality (CamLan)
  - Verify WAN connection is operational
  - Check GUID registration in cloud system
  - Confirm user authentication is working
  - Test high-throughput camera support

- Expected result: Complete EagleEye integration with GC-X-ONE platform

## Troubleshooting

- Bridge connectivity issues
  - Verify IP address configuration is correct
  - Check WAN connection supports gigabit speeds
  - Ensure proper network routing and firewall settings
  - Confirm internet connectivity for cloud integration

- ESN registration problems
  - Verify ESN is copied correctly from bridge settings
  - Ensure no extra characters or spaces in ESN entry
  - Check device type selection matches EagleEye in GC-X-ONE
  - Confirm ESN is valid and active

- User authentication failures
  - Verify user settings are properly configured
  - Check authentication credentials are correct
  - Ensure user accounts have appropriate permissions
  - Confirm access levels are set correctly

- Camera network issues
  - Verify CamLan interface supports 1000Mb/s
  - Check camera connections to bridge
  - Ensure adequate bandwidth for multiple cameras
  - Test high-resolution camera support

- Cloud integration problems
  - Verify GUID is properly registered
  - Check internet connectivity for cloud services
  - Ensure firewall allows cloud communication
  - Confirm bridge is properly authenticated with cloud system

## Notes

- ESN (Equipment Serial Number) is required for proper device registration
- Bridge supports gigabit speeds on both WAN and CamLan interfaces
- CamLan+ confirms high-throughput support for multiple high-resolution cameras
- User settings configuration is essential for proper system operation
- GUID provides unique identification for cloud system integration
- All network interfaces should be configured for optimal performance

## Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)

