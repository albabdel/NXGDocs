---
title: "Reconeyez"
sidebar_label: "Reconeyez"
sidebar_position: 11
description: "Configure Reconeyez devices to integrate with GC-X-ONE platform for event-driven video surveillance and monitoring."
tags:
  - Reconeyez
  - Event Camera
  - Battery Powered
  - Mobile Connectivity
  - GC-X-ONE
---

# Reconeyez

**Device Information:**
- **Device**: Reconeyez Device Model
- **Vendor**: Reconeyez
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Summary

- Purpose: Configure Reconeyez devices to integrate with GC-X-ONE platform for event-driven video surveillance and monitoring.
- Outcome: Enhanced functionality with mobile connectivity, event-based capture, and cloud integration through GC-X-ONE platform.
- Audience: Field engineer / Support.

# Prerequisites

- Valid SIM card with data plan (for LTE connectivity) or Wi-Fi access
- Reconeyez mobile app or cloud platform access
- Device ID from Reconeyez client (used as Serial number)
- Network connectivity allowing outgoing connections to cloud platform

# Device profile

- Type: Battery-Powered Event Camera
- Discovery: Device ID/Serial Number Based
- Events: Motion detection, alarm triggers, scheduled captures
- Connectivity: LTE/4G, Wi-Fi, Bluetooth
- Known quirks: **Device ID from client is mandatory** and used as Serial number. **Event-driven capture** rather than continuous streaming. **Power conservation** limits live video functionality. **Webhook configuration** required for platform integration.

**Core Functions**

- Event Capture: Supported (10-15 second clips)
- Snapshots: Supported (configurable interval and count)
- Cloud Integration: Supported via Reconeyez Cloud
- Mobile Connectivity: Supported (LTE/4G, Wi-Fi)
- API Integration: Supported for event forwarding

# Steps

## Step 1 — Network Configuration

- UI path: **Reconeyez Device → Network Settings**

- Configure Connectivity Options
  - **For LTE/4G Connection:**
    - Insert SIM card with valid data plan
    - Ensure adequate signal strength for mobile data
  - **For Wi-Fi Connection:**
    - Configure network settings through mobile app or cloud platform
    - Set SSID and password
    - Ensure Wi-Fi coverage and signal strength
  - **General Network Setup:**
    - Devices automatically connect to Reconeyez Cloud (minimal manual IP configuration needed)
    - Ensure firewall and proxy settings allow outgoing connections to cloud platform
    - Verify network connectivity for cloud communication

- Expected result: Network connectivity established for cloud communication

## Step 2 — Event Configuration

- UI path: **Reconeyez Cloud Portal/Mobile App → Event Settings**

- Configure Event-Driven Capture
  - Access Reconeyez cloud portal or mobile app
  - Configure event triggers for video capture
  - Set up snapshots or video clips (typically 10-15 seconds) upon event trigger
  - Configure number of photos and time interval for snapshots
  - Set event detection parameters and sensitivity
  
  ![Reconeyez Event Configuration 1](./images/Reconeyez%201.png)
  
  ![Reconeyez Event Configuration 2](./images/Reconeyez%202.png)

- Expected result: Event capture settings configured for optimal surveillance

## Step 3 — Platform Integration Setup

- UI path: **Reconeyez Platform → Integration Settings**

- Configure Third-Party Integration
  - Set up API access for event forwarding and video access
  - Configure email/FTP notifications to external systems
  - Set up central monitoring station integration using protocols like SIA or Contact ID
  - Configure optional cloud-to-cloud integration with platforms
  - In GC-X-ONE, configure workflow to add webhook for event notifications
  
  ![Reconeyez Platform Integration](./images/Reconeyez%203.png)

- Expected result: Platform integration configured for event forwarding

## Step 4 — Add Device in GC-X-ONE

- UI path: **GC-X-ONE → Configuration App → Site → Devices → Add → Reconeyez**

- Register Reconeyez Device
  - Login to GC-X-ONE platform
  - Navigate to configuration app
  - Go to Site → Devices → Add → Reconeyez
  - Provide the mandatory details:
    - **Device Name**: Descriptive name for the device
    - **Serial Number**: Use Device ID from Reconeyez client (mandatory)
    - **Connection details**: Network and authentication parameters
    - **Integration settings**: Webhook and API configuration
  - Click on "Discover" to detect the device
  - Verify device discovery is successful
  - Click "Save" to complete registration
  
  ![Reconeyez GC-X-ONE Configuration](./images/Reconeyez%204.png)

- **Important Note**: Device ID from client is used as Serial number in Reconeyez and is mandatory for registration

- Expected result: Reconeyez device successfully added and configured in GC-X-ONE

## Step 5 — Verify Integration

- Checks
  - Verify network connectivity (LTE/4G or Wi-Fi) is operational
  - Test event-driven video capture functionality
  - Confirm snapshots are being captured at configured intervals
  - Verify cloud platform integration is working
  - Test webhook notifications to GC-X-ONE
  - Check API access for event forwarding
  - Confirm historical event review capability
  - Verify live status monitoring functionality

- Expected result: Complete Reconeyez integration with GC-X-ONE platform

# Troubleshooting

- Network connectivity issues
  - Verify SIM card is properly inserted and activated with data plan
  - Check mobile signal strength for LTE/4G connectivity
  - Ensure Wi-Fi credentials are correct and signal is adequate
  - Confirm firewall settings allow outgoing cloud connections
  - Test internet connectivity and DNS resolution

- Event capture problems
  - Verify event triggers are properly configured
  - Check device battery level for optimal performance
  - Ensure adequate lighting and positioning for motion detection
  - Test snapshot interval and count settings
  - Verify storage capacity for captured events

- Platform integration issues
  - Check API credentials and access permissions
  - Verify webhook configuration in GC-X-ONE
  - Test email/FTP notification settings
  - Confirm SIA or Contact ID protocol configuration
  - Ensure cloud-to-cloud integration is properly set up

- Device registration problems
  - Verify Device ID from client is used correctly as Serial number
  - Check device discovery process in GC-X-ONE
  - Ensure all mandatory fields are properly filled
  - Confirm device compatibility with GC-X-ONE platform

- Power and performance issues
  - Monitor battery levels for battery-powered devices
  - Optimize event trigger sensitivity to conserve power
  - Balance capture frequency with power consumption
  - Verify live video limitations due to power conservation

# Notes

- Reconeyez devices are optimized for event-driven video capture, not continuous streaming
- Live video is limited due to power conservation on battery-powered devices
- Device ID from Reconeyez client is mandatory and used as Serial number in GC-X-ONE
- Devices automatically connect to Reconeyez Cloud with minimal manual configuration
- Event clips are typically 10-15 seconds long for optimal storage and transmission
- Webhook configuration in GC-X-ONE is essential for receiving event notifications
- Mobile connectivity options include LTE/4G, Wi-Fi, and Bluetooth

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
