---
title: "Axis Camera Station Pro"
sidebar_label: "Axis Camera Station Pro"
sidebar_position: 4
description: "Configure Axis Camera Station Pro to integrate seamlessly with GC-X-ONE platform for comprehensive video management and security monitoring."
tags:
  - Axis
  - Camera Station Pro
  - VMS
  - Video Management
  - GC-X-ONE
---

# Axis Camera Station Pro

**Device Information:**
- **Device**: Axis Camera Station Pro Device Model
- **Vendor**: Axis
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Summary

- Purpose: Configure Axis Camera Station Pro to integrate seamlessly with GC-X-ONE platform for comprehensive video management and security monitoring.
- Outcome: Enhanced functionality with live streaming, recording, playback, and event management capabilities through GC-X-ONE integration.
- Audience: Field engineer / Support / Admin users for troubleshooting and configuration purposes.

# Prerequisites

- Administrator privileges on your system
- System meets minimum hardware and OS requirements for the Axis Camera Station Pro installer
- Network access to the target Axis Camera Station Pro device is available

# Device profile

- Type: Video Management System (VMS)
- Discovery: HTTP/HTTPS
- Events: Motion detection, device events, rule-based alarms
- Ports: HTTP Port 29204 (non-changeable for Pro version)
- Known quirks: **Axis Camera Station Pro always uses port 29204** (non-changeable). **Event callback** implemented for events - necessary webhook needs to be created at device level. **Different client executable** from standard Axis Camera Station.

**Core Functions**

- Live: Supported
- Playback: Supported (requires recording enabled at device level)
- Events: Supported (requires webhook configuration)
- Recording: Supported
- Device Management: Supported
- Rule-based Alarms: Supported

# Steps

## Step 1 — Install Axis Camera Station Pro Software

- Download Installer
  - Download Axis Camera Station Pro installer from the official website: [AXIS Camera Station Pro - Update for server and client](https://www.axis.com/ftp/pub_soft/cam_srv/cam_station_pro/latest/AXISCameraStationProSetup.msi)

- Run the Installer
  - Double-click the downloaded .msi file
  - Proceed with default options unless specified by IT policies
  - Finish installation and launch the application

- Installation Note
  - Upon installation, the "Welcome to Axis Camera Station Pro" pop-up will appear
  - ![AXIS Image](./images/AXIS%20 1.png)
  - ![AXIS Image](./images/AXIS%20 2.png)
  - ![AXIS Image](./images/AXIS%20 3.png)

- Post Installation
  - Once installed successfully you will be able to see the client on your desktop (or mentioned in your path)
  - ![AXIS Image](./images/AXIS%20 4.png)
  - Upon opening the client you will be asked for authorization with IP address, username, password and able to see the live stream
  - ![AXIS Image](./images/AXIS%20 5.png)

- Expected result: Axis Camera Station Pro client installed and accessible

## Step 2 — Device Discovery and Connection

- UI path: **Axis Camera Station Pro Client → Manual Search**

- Manual Device Search
  - Click "Manual Search" to open popup
  - Enter the IP Address of the target device
  - ![AXIS Image](./images/AXIS%20 6.png)
  - ![AXIS Image](./images/AXIS%20 7.png)
  - ![AXIS Image](./images/AXIS%20 8.png)

- Device Authentication
  - Enter the Username and Password for the device
  - Click Connect to establish connection
  - Verify device credentials are accepted

- Expected result: Device discovered and connected successfully

## Step 3 — Add Camera Devices

- UI path: **Axis Camera Station Pro Client → Devices → Add**

- Add Camera Process
  - Click the "Devices" section and select "Add"
  - ![AXIS Image](./images/AXIS%20 9.png)
  - Click "Next" to proceed with device addition
  - ![AXIS Image](./images/AXIS%20 10.png)
  - Click "Install the devices" to complete the process
  - ![AXIS Image](./images/AXIS%20 11.png)

- Verify Camera Installation
  - Once devices are installed, camera snapshots will show
  - ![AXIS Image](./images/AXIS%20 12.png)
  - Camera will be added successfully

- Expected result: Camera devices added and visible in the system

## Step 4 — Configure Live View

- UI path: **Axis Camera Station Pro Client → Live View**

- Setup Live View
  - Click the "+ plus button" and select "Live View"
  - ![AXIS Image](./images/AXIS%20 13.png)
  - Open the Live View interface
  - ![AXIS Image](./images/AXIS%20 14.png)

- Expected result: Live video feed accessible and working

## Step 5 — Enable Recording

- UI path: **Axis Camera Station Pro Client → Recording and Events → Recording Methods**

- Configure Recording
  - To make playback work, enable recording at the device level
  - Click "Recording and Events" and open "Recording Methods"
  - ![AXIS Image](./images/AXIS%20 15.png)
  - Click the "+ plus button" and select "Recording View"
  - ![AXIS Image](./images/AXIS%20 16.png)

- Expected result: Recording enabled for playback functionality

## Step 6 — Verify Streaming and Events

- Launch Application
  - Open the installed Axis Camera Station Pro client from your desktop or start menu

- Connect to Device
  - Enter the IP address, username, and password of the Axis Camera Station Pro unit
  - Click Connect

- Verify Live Stream
  - Navigate to the Live View tab
  - Confirm the live video feed is working as expected

- Verify Events
  - Go to the Events or Logs section
  - Confirm that real-time motion or intrusion events are being logged correctly

- Expected result: Device is online and in working state with live stream and events

## Step 7 — Add Axis Camera Station Pro Parameters to GC-X-ONE

- UI path: **GC-X-ONE → Configuration App → Service Provider → Overview → Edit → Additional Settings → Custom Property**

- Configure Custom Property
  - Login to GC-X-ONE
  - Navigate to configuration app
  - At service provider level, click on edit button under overview tab
  - ![[senstar 6.png)
  - Click on additional settings tab → Custom property
  - Scroll down and click on "Add +" button
  - ![[senstar 7.png)

- Enter Parameter Details
  - Parameter Type: string
  - Parameter Name: AxisCameraStation_Device_Custom_baseUrl
  - Parameter Value: https://acsproxy.nxgen.cloud/
  - ![AXIS Image](./images/AXIS%20 19.png)

- Expected result: Custom property added successfully

## Step 8 — Add Axis Camera Station Pro Device Under Required Site

- UI path: **GC-X-ONE → Configuration → Site → Devices → Add New Device**

- Add Device Process
  - Go to the Configuration section in GC-X-ONE
  - Select the target site under which the Axis Camera Station Pro device should be registered
![AXIS Device Configuration](./images/AXIS%2031.png)
  - Navigate to Devices → Add New Device
  - ![AXIS Image](./images/AXIS%20 31.png)

- Fill Device Details
  - Device Name: e.g., "Axis Camera Station Pro - Gate A"
  - Device Type: Axis Camera Station
  - IP Address/Host: xxx.xxx.xxx.xxx
  - Http/s Port: Default or customized (e.g., 5000)
  - Username: xxx
  - Password: xxx
  - HTTP Port: for streaming

- Important Note
  - Event Call back implemented for events. Necessary webhook needs to be created at device level

- Save and Verify
  - Click Save & Verify to confirm that the device is reachable and data (stream/events) is being received

- Expected result: Device added successfully in GC-X-ONE

## Step 9 — Configure Device Events

- UI path: **Axis Camera Station Pro Client → Device Events**

- Setup Device Events
  - Click the "Device Events" and click "OK"
  - ![AXIS Image](./images/AXIS%20 24.png)
  - Open the popup "Configure device events trigger" and click "OK"
  - ![AXIS Image](./images/AXIS%20 25.png)

- Configure Event Parameters
  - Events: MotionAlarm
  - State: Yes

- Expected result: Device events configured for alarm detection

## Step 10 — Create Webhook for Event Integration

- UI path: **Axis Camera Station Pro Client → HTTP Notification**

- Setup HTTP Notification
  - In the device event rule, configure an Action: Send HTTP Notification (Webhook)
  - ![AXIS Image](./images/AXIS%20 26.png)
  - Open the popup, click "Send HTTP Notification" and click "OK"
  - ![AXIS Image](./images/AXIS%20 27.png)

- Configure Webhook Parameters
  - URL: https://acsproxy.nxgen.cloud/
  - Method: POST
  - Content type: application/json

- Configure Request Body
  ```json
  {
    "initialRequest": {
      "payload": {
        "type": "NOTIFICATION",
        "authenticationToken": "5654974ab97f48a1b16a74472864e195",
        "notifications": [
          {
            "event": {
              "type": "ALARM_TRIGGERED",
              "cameraId": "$(TriggerData.SourceId)",
              "timestamp": "$(TriggerData.TimeUtc)"
            }
          }
        ]
      }
    }
  }
  ```

- Complete Webhook Setup
  - Copy and paste URL, Methods, Content type, Body and click "OK"
  - ![AXIS Image](./images/AXIS%20 28.png)

- Expected result: Webhook configured for event transmission to GC-X-ONE

## Step 11 — Finalize Event Rules

- UI path: **Axis Camera Station Pro Client → Edit Rules**

- Complete Rule Configuration
  - Open the popup "Edit rules" and click "Next"
  - ![AXIS Image](./images/AXIS%20 29.png)
  - Open the popup "Edit rules" and click "Finish"
  - ![AXIS Image](./images/AXIS%20 30.png)

- Expected result: Event rules finalized and active

## Step 12 — Verify Integration

- Live Stream Verification
  - Confirm live video feed appears in GC-X-ONE

- Event Verification
  - Verify events appear in Video Activity Search and Device Dashboard

- Expected result: Complete Axis Camera Station Pro integration with GC-X-ONE platform

# Troubleshooting

- Installation issues
  - Ensure administrator privileges are available
  - Verify system meets minimum hardware and OS requirements
  - Check network connectivity to target device

- Connection problems
  - Verify IP address, username, and password are correct
  - Ensure port 29204 is accessible (non-changeable for Pro version)
  - Check network connectivity between client and device

- Event configuration issues
  - Verify webhook URL is correct and accessible
  - Check authentication token in webhook payload
  - Ensure device events are properly configured with correct triggers

- Recording playback issues
  - Verify recording is enabled at device level
  - Check storage availability and configuration
  - Ensure proper permissions for playback access

# Notes

- Axis Camera Station Pro always uses port 29204 (non-changeable)
- Different client executable from standard Axis Camera Station
- Event callback requires webhook configuration at device level
- Recording must be enabled at device level for playback functionality
- Custom property must be added at service provider level in GC-X-ONE
- Authentication token in webhook payload should match system requirements

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
