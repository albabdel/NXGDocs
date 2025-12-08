---
title: "Camect"
sidebar_label: "Camect"
sidebar_position: 5
description: "Configure Camect to stream and send events to GC-X-ONE."
tags:
  - Camect
  - Hub
  - NVR
  - AI Detection
  - GC-X-ONE
---

# Camect

**Device Information:**
- **Device**: Camect Hub Model
- **Vendor**: Camect
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0  


# Summary
- Purpose: Configure Camect to stream and send events to GC-X-ONE.
- Outcome: Live view and alerts show in GC-X-ONE (Video Activity).
- Audience: Field engineer / Support.

# Prerequisites
- Network: Reachable IP, correct VLAN and ports (80/443/554/RTSP/TCP as used).
- Time sync: Match Camect time zone with GC-X-ONE. Enable NTP.
- Access: Admin to Camect UI and GC-X-ONE Config App.
- IP allowlist: Update if your site uses whitelisting.
- Test account: Create a dedicated user for GC-X-ONE.

# Device profile
- Type: Hub/NVR
- Discovery: Proprietary (Camect)
- Events: AI objects (per Camect rules)
- Ports: 80/443/554 + monitoring TCP
- Known quirks: Enable **Detect alerts** and set **Monitoring → NXGEN** so GC-X-ONE receives events.

**Core Functions**
- Cloud Mode: Supported
- Discovery: Supported
- Live: Supported
- Playback: Supported
- Timeline: Supported
- Events: Supported
- ARM / DISARM: Supported
- Audio (SIP): Supported
- PTZ/Presets: Supported

# Steps

## Step 1 — Prepare Camect (users, time, RTSP)
- UI path: **Users**
- Do
  - Create a local user (e.g., `NXG`) with password.
  - Grant: **Live view, Query Cameras, Pan/Tilt Cameras, View alerts, View footage, Share cameras, Change operating modes**.
- Time/NTP
  - Set time zone. Enable NTP. Save.
- RTSP
  - Ensure RTSP is enabled on the hub.
- Expected result: Dedicated user exists; time is correct; RTSP is on.
![Camect User Setup](./images/Camect%201.gif)

## Step 2 — Configure alerts and monitoring
- UI path: **Hub Settings → Alert**
- Do
  - Check **Detect alerts**.
  - Choose objects under **Detect objects in alerts**.
  - Select required alert types.
- Make events available to GC-X-ONE
  - Click **Add Monitoring** → choose **NXGEN**.
  - On the NXGEN page set:
    - **Site ID** = 1 (or as provided).
    - **TCP address** = `3.122.169.231:10520` (or as provided).
  - Click **Add camera** for each camera to forward.
- Expected result: Camect generates alerts and forwards them to GC-X-ONE.
![Camect Monitoring Setup](./images/Camect%203.gif)

![Camect Camera Addition](./images/Camect%204.gif)

- Check Detect alerts.
  - Choose objects under Detect objects in alerts.
  - Select required alert types.
  
  ![Camect Alert Detection](./images/Camect%202.gif)

## Step 2c — Enable Secondary Stream (recommended)
- UI path: **Camera → Settings → Information → Edit Substream**
- Do
  - Change **Substream** from `0` to `1`. Save.
- Purpose
  - Expose a smooth substream for Live view.
![Camect Substream Configuration](./images/Camect%205.gif)

## Step 3 — Add device in GC-X-ONE
- UI path: **GC-X-ONE → Customer → Site → Devices → Add Device**
- Do
  - Select **Camect**.
  - Fill: **Host/Serial, Username, Password, Ports, Time Zone**.
  - Click **Discover**. Review discovered sensors and I/O.
  - Click **Save**.
- Expected result: GC-X-ONE lists sensors under the Camect device.
![Camect Device Configuration](./images/CAMECT%20ADDING%20DEVICE.png)

## Step 4 — Verify
- Checks
  - Send a test alert. It appears in **Video Activity**.
  - **Live** opens without stutter.
  - PTZ presets move if enabled.


# Troubleshooting
- No events in Video Activity
  - Ensure **Detect alerts** is on.
  - Confirm **Monitoring → NXGEN** is configured with the correct **TCP address** and **Site ID**.
  - Add the camera under NXGEN monitoring.
  - Check time sync/NTP.
- Discovery fails
  - Verify credentials, ports, and reachability.
- Live view stutters
  - Enable the substream (set to `1`).
- No PTZ control
  - Grant **Pan/Tilt Cameras** permission to the GC-X-ONE user.

# Notes
- Least-privilege: Use the dedicated user created in Step 1.

# Change log
- 2025-09-02 v1.0.0 Initial GC-X-ONE aligned doc.

# Summary video
<!-- Video: Camect Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->
- External: ([Camect website](https://camect.com/welcome/))
