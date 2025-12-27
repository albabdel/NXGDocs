---
title: "Axis Admin Configuration"
description: "Complete guide for Axis Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:axis
sidebar_position: 2
last_updated: 2025-12-04
---

# Axis Admin Configuration

Follow these steps to integrate Axis IP cameras, I/O modules, and ACS Pro with GCXONE.

## Prerequisites

- Axis devices updated to the latest firmware.
- API access user with necessary privileges created on the device.
- Network connectivity (VPN or Public) between the site and GCXONE.
- **For ACS Pro**: Ensure "Web Client" is enabled and ports 29202, 29204, and 29205 are open.

## Step-by-Step Guide

### Step 1: Add Device in GCXONE
1. Navigate to the **Configuration App** and select the appropriate Customer and Site.
2. Under the **Devices** tab, click **Add New**.
3. Choose the appropriate Device Type:
   - **Axis Camera Station**: For ACS Pro VMS.
   - **Axis**: For IP Cameras and I/O Modules.
   - **Genesis Audio**: For Horn Speakers.

### Step 2: Device Discovery
1. Enter the Device Name, IP Address/Hostname, and Control Port (default 80/443).
2. Enter the device credentials and click **Discover**.
3. GCXONE will automatically retrieve the camera list or available I/O ports.

### Step 3: Configure Event Forwarding (Webhooks)
To receive real-time alarms from Axis devices or ACS Pro, you must configure a webhook on the device:
- **URL**: `https://acsproxy.nxgen.cloud/eventIngest`
- **Method**: POST
- **Content Type**: `application/json`
- **Payload**: Use the standardized GCXONE JSON template containing your `DEVICE_ID` and `CAMERA_ID`.

### Step 4: Verification
Trigger a test event (e.g., motion or I/O trigger) and verify that it appears in the **Video Activity Search** or the **Alarm Dashboard** in GCXONE.

## Best Practices
- **Time Sync**: Always synchronize Axis devices with an NTP server (`time.nxgen.cloud`) to prevent timeline misalignments.
- **Managed Workflows**: Assign discovery-based devices to managed workflows in Talos for consistent response procedures.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
