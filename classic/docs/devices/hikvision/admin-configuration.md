---
title: "Hikvision Admin Configuration"
description: "Complete guide for Hikvision Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:hikvision
sidebar_position: 2
last_updated: 2025-12-04
---

# Hikvision Admin Configuration

Follow these steps to configure your Hikvision device for integration with GCXONE.

## Prerequisites

- Hikvision device with continuous recording enabled.
- Whitelist the IP `35.156.60.98` (Hikvision Receiver).
- Administrative access to the Hikvision web interface and GCXONE.

## Step-by-Step Guide

### Step 1: System Configuration (Time & NTP)
1. Go to **Configuration** > **System** > **System Settings** > **Time Settings**.
2. Select your **Time Zone** and enable **NTP**.
3. If supported, enable **DST** (Daylight Saving Time).

### Step 2: User Management
1. Go to **Configuration** > **System** > **User Management** > **Add**.
2. Create a user (e.g., "NXG").
3. Assign the following permissions:
   - **Local**: Parameters Settings, Log Search, Playback, Manual Operation, PTZ Control, Video Export.
   - **Remote**: Parameters Settings, Log Search, Two-way Audio, Notify Surveillance Center, Video Output Control, Live View, PTZ Control, Playback/Download.
4. Select the cameras the user should have access to and save.

### Step 3: Security Configuration
Go to **Configuration** > **System** > **Security** and set both **RTSP Authentication** and **WEB Authentication** to **Digest**.

### Step 4: Network Configuration (ISAPI)
Go to **Configuration** > **Network** > **Advanced Settings** > **Integration Protocol**. Enable the **ISAPI** checkbox.

### Step 5: Configure Events
1. For **Basic Events** (e.g., Tampering): Go to **Configuration** > **Event** > **Basic Event**. Draw the Area of Interest, set the Arming Schedule, and in **Linkage Method**, enable **Notify Surveillance Center**.
2. For **Smart Events** (e.g., Line Crossing): Go to **Configuration** > **Event** > **Smart Event**. Select the camera, draw your lines/zones, set the schedule, and ensure **Notify Surveillance Center** is enabled.

### Step 6: Add Device to GCXONE
In the GCXONE Configuration App, add the device by entering the **Host/Serial**, **Username**, and **Password**. Click **Discover** to identify the sensors.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](#) or [contact support](#).
