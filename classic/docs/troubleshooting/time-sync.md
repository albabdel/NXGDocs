---
title: "Time Sync Issues"
description: "Complete guide for Time Sync Issues"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 18
last_updated: 2025-12-04
---

# Time Sync Issues

Time synchronization is critical for ensuring that alarms are recorded accurately and that video playback aligns with event logs.

## Overview

General troubleshooting involves a systematic approach across layers, typically starting with device logs, followed by network configuration.

| Issue Category           | Common Causes                                                              | Resolution Steps                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time Synchronization** | Device time does not match GCXONE time; Incorrect NTP server address.      | Ensure NTP server is set to `timel.nxgen.cloud`; Use the GCXONE "time zone sync" button; Ensure time zone configuration in GCXONE matches the physical device. |
| **Connectivity**         | Ports not open on firewall; Incorrect IP address/DNS; Network instability. | Verify all required ports are open and forwarded; Ensure GCXONE service IPs are whitelisted; Check network connections and compatibility.                      |

## Step-by-Step Guide

### Step 1: Verify Device Time
Log in to the device's web interface (NVR/Camera) and check the current system time. It should be accurate to within a few seconds of the actual time.

### Step 2: Configure NTP
Ensure the device is pointing to a reliable NTP server.
- **NTP Server**: `timel.nxgen.cloud`
- **Port**: 123 (UDP)

### Step 3: Synchronize in GCXONE
1. Navigate to the **Device Dashboard** in GCXONE.
2. Select the relevant device and click **Edit**.
3. Locate the **Timezone** setting and ensure it matches the physical location of the device.
4. Click the **Sync Time** button to push the correct time configuration to the device.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
