---
title: "Standard Device Onboarding Process"
sidebar_label: "Standard Device Onboarding Process"
tags: ["onboarding", "device", "setup", "integration", "configuration"]
---

# Standard Device Onboarding Process

Integrating a device involves a standardized sequence within the **GCXONE Configuration App**. Regardless of the device manufacturer (Hikvision, Dahua, Hanwha, etc.), the core steps remain consistent.

## Step-by-Step Guide

### 1. Login and Navigation
Login to GCXONE and navigate to the **Configuration App**.

### 2. Add Customer and Site
Ensure the Customer and Site are created. 
> [!NOTE]
> When a site is added in GCXONE, the site name is automatically synced and created in Talos.

### 3. Add Device
Navigate to the **Devices** tab at the site level and click **"Add"**.

### 4. Select Device Type
Choose the correct driver for your hardware (e.g., `HanwhaNVR`, `Hikvision`, `Milestone`, `Teltonika-IOT`).

### 5. Enter Mandatory Details
Enter the required connection information. This typically includes:
- **Name**: A friendly name for the device.
- **IP Address/Host**: Public IP, VPN IP, or Hostname.
- **Username**: Device admin username.
- **Password**: Device admin password.
- **Ports**: Specific ports required for the device (RTSP, Control, HTTP/HTTPS).
- **Unique Identifiers**: Serial Number, Server Unit ID, or Base URL (depending on device type).

### 6. Time Zone Synchronization
**CRITICAL**: The device's time zone must be correctly configured in GCXONE. This ensures accurate real-time event forwarding and synchronization with the server time.

### 7. Discover
Click **"Discover"**. 
- GCXONE initiates an automatic discovery process to connect to the device.
- It fetches device-specific information (including Input/Output (I/O) details).
- It automatically adds associated sensors (cameras) to the hierarchy.

### 8. Save
Click **"Save"** to finalize the configuration.

## Post-Onboarding Checks
- **Health Check**: Verify that the device shows as "Online" in the dashboard.
- **Live View**: Test the live stream for one of the cameras to ensure the streaming ports are open.
- **Events**: Trigger a test event (if possible) to verify alarm transmission.
