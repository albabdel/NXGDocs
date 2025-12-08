---
title: "Teltonika Router"
sidebar_label: "Teltonika Router"
sidebar_position: 13
description: "Configure Teltonika Router to integrate with GC-X-ONE platform for GPS tracking and device monitoring."
tags:
  - Teltonika
  - Router
  - GPS Tracking
  - HTTPS
  - GC-X-ONE
---

# Teltonika Router

**Device Information:**
- **Device**: Teltonika Router Device Model
- **Vendor**: Teltonika
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Summary

- Purpose: Configure Teltonika Router to integrate with GC-X-ONE platform for GPS tracking and device monitoring.
- Outcome: Enhanced functionality with GPS data transmission and location tracking through GC-X-ONE integration.
- Audience: Field engineer / Support.

# Prerequisites

- Administrative access to Teltonika Router configuration interface
- Network connectivity to router device
- Active GPS signal for location tracking
- HTTPS connectivity for data transmission

# Device profile

- Type: GPS Tracking Router
- Discovery: Serial Number Based
- Events: GPS location updates, device status
- Ports: HTTPS
- Known quirks: Requires **device serial number** for registration. **GPS service** must be enabled and configured. **HTTPS URL** must be properly configured for data transmission.

**Core Functions**

- GPS Tracking: Supported
- Location Updates: Supported
- Device Status: Supported
- HTTPS Communication: Supported

# Steps

## Step 1 — Obtain Device Serial Number

- UI path: **Teltonika Router → Status → Device**

- Get Device Serial Number
  - Login to Teltonika Device web interface
  - Navigate to Status menu
  - Click on Device option
  - Copy the serial number displayed
  - This serial number will be required for device registration in GC-X-ONE
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 Status](./images/Teltonika%20Router%201.png)
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 2.png)

- Expected result: Device serial number obtained for registration

## Step 2 — Add Device in GC-X-ONE

- UI path: **GC-X-ONE → Configuration App → Site → Devices → Add**

- Register Teltonika Device
  - Login to GC-X-ONE platform
  - Navigate to configuration app
  - Go to device addition section
  - Select device type as "Teltonika"
  - Enter the serial number copied from Step 1
  - Complete the device registration process
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 10.png)

- Expected result: Teltonika device successfully registered in GC-X-ONE

## Step 3 — View Device Information

- UI path: **GC-X-ONE → Device List → View**

- Verify Device Registration
  - After device registration, click on the "View" button
  - Verify device information is correctly displayed
  - Confirm device status and configuration details
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 11.png)

- Expected result: Device information accessible and properly configured

## Step 4 — Obtain Custom Receiver URL

- UI path: **GC-X-ONE → Device Configuration → Edit**

- Get Teltonika Custom URL
  - Click the "Edit" button in device configuration
  - Locate the "Teltonika Custom Receiver URL" field
  - Copy the complete URL provided
  - This URL will be used to configure the router for data transmission
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 11.png)
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 12.png)


- Expected result: Custom receiver URL obtained for router configuration

## Step 5 — Configure GPS Service on Router

- UI path: **Teltonika Router → Service → GPS**

- Configure GPS Settings
  - Return to Teltonika Router web interface
  - Navigate to Service menu
  - Select GPS submenu
  - Access GPS configuration options
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 8.png)

- Expected result: GPS service configuration page accessed

## Step 6 — Configure HTTPS URL

- UI path: **Teltonika Router → Service → GPS → HTTPS Tab**

- Set Custom Receiver URL
  - Navigate to the HTTPS tab in GPS settings
  - Enter the URL copied from Step 4 into the HTTPS URL field
  - Ensure URL is correctly formatted and complete
  - Save the configuration settings
  - ![Teltonika Router Image](./images/Teltonika%20Router%20 9.png)

- Expected result: HTTPS URL configured for data transmission to GC-X-ONE

## Step 7 — Verify Integration

- Checks
  - Verify GPS service is enabled and active
  - Confirm HTTPS URL is properly configured
  - Check device status in GC-X-ONE shows online
  - Verify GPS location data is being received
  - Test data transmission functionality

- Expected result: Complete Teltonika Router integration with GC-X-ONE platform

# Troubleshooting

- Serial number issues
  - Verify serial number is copied correctly from device status page
  - Ensure no extra characters or spaces in serial number entry
  - Check device type selection in GC-X-ONE matches Teltonika

- GPS service problems
  - Verify GPS antenna is properly connected
  - Check GPS signal strength and satellite reception
  - Ensure GPS service is enabled in router configuration
  - Confirm location services are active

- HTTPS configuration issues
  - Verify custom receiver URL is copied correctly
  - Check HTTPS connectivity from router to GC-X-ONE
  - Ensure firewall settings allow HTTPS traffic
  - Confirm network connectivity and DNS resolution

- Data transmission problems
  - Verify HTTPS URL configuration is saved
  - Check router system logs for transmission errors
  - Confirm GC-X-ONE is receiving data updates
  - Test network connectivity between devices

# Notes

- Device serial number is required for proper registration in GC-X-ONE
- GPS service must be enabled for location tracking functionality
- HTTPS URL configuration is critical for data transmission
- Proper network connectivity is essential for integration
- All configurations should be verified after implementation

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
