---
title: "Hikvision"
sidebar_label: "Hikvision"
sidebar_position: 10
description: "Configure Hikvision device to integrate seamlessly with GC-X-ONE platform for video surveillance tasks."
tags:
  - Hikvision
  - IP Camera
  - NVR
  - ISAPI
  - GC-X-ONE
---

# Hikvision

**Device Information:**
- **Device**: Hikvision Device Model
- **Vendor**: Hikvision
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Summary

- Purpose: Configure Hikvision device to integrate seamlessly with GC-X-ONE platform for video surveillance tasks.
- Outcome: Enhanced functionality with data security and optimal performance enabling robust management and monitoring capabilities.
- Audience: Field engineer / Support.

# Prerequisites

- The Hikvision device is set up with Continuous Recording
- Whitelist the IP 35.156.60.98 (Hikvision Receiver)
- Local Mode is installed (For P2P streaming, Audio, Encrypted stream)

# Device profile

- Type: IP Camera/NVR
- Discovery: ISAPI Protocol
- Events: Basic Events (Video Tampering), Smart Events (Line Crossing, Intrusion Detection)
- Ports: HTTP/HTTPS, RTSP
- Known quirks: **Avoid setting up Motion events** - they can trigger too many alarms and cause issues. **RTSP and WEB authentication** should be configured as Digest for enhanced security.

**Core Functions**

- Live: Supported
- Playback: Supported
- Events: Supported (Basic and Smart Events)
- PTZ/Presets: Supported
- Audio: Supported (Two-way Audio)
- Authentication: Digest (Recommended)

# Steps

## Step 1 — System Configuration (Time Management)

- UI path: **Configuration → System → System Settings → Time Settings**

- Do
  - Login into your HikVision portal by providing the credentials needed
  - Navigate to the **configuration** page, then select **System**
  - Proceed to **System Settings** and choose Time **Settings**
  - Choose the **time zone** of your device and make sure to enable the **NTP**
  - If your device supports DST we recommend you also to have it enabled

- Purpose
  - NTP is a protocol used to synchronize the clocks of computers and other devices over a network
  - The primary goal of DST is to make better use of daylight during the longer days of summer

- Expected result: Time zone configured with NTP and DST enabled
![Hikvision Image](./images/Hik%20vision Time Configuration](./images/Hik%201.png)

![Hikvision Image](./images/Hik%20vision NTP Settings](./images/Hik%202.png)

## Step 2 — User Management

- UI path: **Configuration → System → User management → Add**

- Do
  - Navigate to the **configuration** page, then select **System**
  - Proceed to **User management** then click on "Add"
  - Enter the username and password for NXGEN
  - We recommend setting the username to "NXG" with the specified permissions

- Required Permissions for "NXG" user:
  - Local: Parameters Settings
  - Local: Log Search
  - Local: Playback
  - Local: Manual Operation
  - Local: PTZ Control
  - Local: Video Export
  - Remote: Parameters Settings
  - Remote: Log Search / Interrogate Working
  - Remote: Two-way Audio
  - Remote: Notify Surveillance Center / Trigger
  - Remote: Video Output Control
  - Remote: Live View
  - Remote: PTZ Control
  - Remote: Playback/Download

- Select the specific cameras you want to apply these permissions to
- Don't forget to click on "OK" to save the changes

- Expected result: NXG user created with proper permissions
![Hikvision Image](./images/Hik%20 3.png)
![Hikvision Image](./images/Hik%20 4.png)


## Step 3 — Security Configuration

- UI path: **Configuration → System → Security**

- Do
  - Configure both RTSP and WEB authentication as Digest
  - This enhances security by ensuring that your credentials are protected with stronger encryption, reducing the risk of unauthorized access

- Expected result: Authentication set to Digest for enhanced security

## Step 4 — Network Configuration (Integration Protocol)

- UI path: **Configuration → Network → Advanced Settings → Integration Protocol**

- Do
  - Under "Network," go to "Advanced Settings," and then select "Integration Protocol"
  - Enable the ISAPI by simply clicking on the check box

- Expected result: ISAPI protocol enabled
![Hikvision Image](./images/Hik%20 5.png)

## Step 5 — Basic Events Configuration

- UI path: **Configuration → Event → Basic Event**

- Do
  - On the "Configuration" page, under the "Event" application, click on "Basic Event"
  - Choose the camera you want to configure
  - Draw your area of interest
  - Choose the Arming Schedule under the "Arming Schedule" tab
  - In the "Linkage Method" tab, enable the checkbox under the camera and check "Notify Surveillance Center"
  - To trigger alarms from other cameras, use the "Trigger Alarm Output" options in the "Normal Linkage" section

- Important Note: Avoid setting up Motion events; they can trigger too many alarms and cause issues

- Expected result: Basic events configured for selected cameras
![Hikvision Image](./images/Hik%20 6.png)

## Step 6 — Smart Events Configuration

- UI path: **Configuration → Event → Smart Event**

- Available Smart Events:
  - **Line Crossing Detection**: This feature identifies when an object crosses a predefined virtual line, useful for monitoring entry and exit points
  - **Intrusion Detection**: It detects when an object enters or moves within a designated area, ideal for securing restricted zones

- Do
  - On the "Configuration" page, under the "Event" application, click on "Smart Event"
  - Choose the camera you want to configure
  - Draw lines on the area of interest
  - Choose the Arming Schedule under the "Arming Schedule" tab
  - In the "Linkage Method" tab, enable the checkbox under the camera and check "Notify Surveillance Center"
  - To trigger alarms from other cameras, use the "Trigger Alarm Output" options in the "Normal Linkage" section

- Expected result: Smart events configured to enhance security system's effectiveness and responsiveness
![Hikvision Image](./images/Hik%20 7.png)

## Step 7 — Add device in GC-X-ONE
- UI path: **GC-X-ONE → Customer → Site → Devices → Add Device**
- Do
  - Select **Camect**.
  - Fill: **Host/Serial, Username, Password, Ports, Time Zone**.
  - Click **Discover**. Review discovered sensors and I/O.
  - Click **Save**.
- Expected result: GC-X-ONE lists sensors under the Camect device.
![Hikvision Device Configuration](./images/Hik%208.png)

## Step 8 — Verify Integration

- Checks
  - Verify time synchronization is working
  - Test NXG user login and permissions
  - Confirm ISAPI protocol is active
  - Test basic and smart events are triggering properly
  - Verify "Notify Surveillance Center" is working

- Expected result: Complete Hikvision integration with GC-X-ONE platform

# Troubleshooting

- Time sync issues
  - Verify NTP server is reachable
  - Check time zone settings match GC-X-ONE
  - Ensure DST settings are correct

- User permission issues
  - Verify all required permissions are granted to NXG user
  - Check camera-specific permissions are applied
  - Ensure user account is active

- Event configuration problems
  - Avoid Motion events to prevent excessive alarms
  - Verify "Notify Surveillance Center" is enabled
  - Check arming schedule is properly configured

- Authentication failures
  - Confirm RTSP and WEB authentication set to Digest
  - Verify credentials are correct
  - Check ISAPI protocol is enabled

# Notes

- We highly recommend configuring both RTSP and WEB authentication as Digest for enhanced security
- Avoid setting up Motion events as they can trigger too many alarms and cause issues
- Proper configuration will enhance the functionality of your surveillance system and ensure data security and optimal performance
- If any issues arise with the configuration, please raise a ticket on NXGEN's Help-desk portal

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (migrated from GCXONE)

<!-- Video: Hikvision Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->