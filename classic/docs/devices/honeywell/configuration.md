---
title: "Honeywell 35 Series NVR Configuration"
description: "Step-by-step configuration guide for Honeywell 35 Series NVR integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:honeywell
sidebar_position: 2
last_updated: 2025-12-20
---

# Honeywell 35 Series NVR Configuration

## Overview

This guide covers the complete configuration of Honeywell 35 Series NVR integration with GCXONE, including both device-side and platform-side setup.

**What you'll accomplish:**
- Configure Honeywell 35 Series NVR for communication with GCXONE
- Set up network connectivity and credentials
- Add and register the device in GCXONE platform
- Verify successful integration
- Test key features

**Estimated time**: 15-20 minutes

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] Honeywell 35 Series NVR with firmware 3.0 or higher
- [ ] Network connectivity (internet access via direct connection or VPN)
- [ ] Administrative credentials for NVR web interface
- [ ] GCXONE account with device configuration permissions

---

## Configuration Workflow

The configuration process consists of 3 main parts:

1. **Network Setup** - Configure NVR network settings and ensure connectivity
2. **GCXONE Platform Setup** - Add and configure device in GCXONE
3. **Verification** - Test live streaming and confirm integration status

---

## Part 1: Network Setup

### Step 1: Access NVR Web Interface

**UI Path**: Web Browser → http://[NVR-IP-Address]

**Objective**: Access the Honeywell NVR web interface to configure network settings.

**Configuration Steps:**

1. Open a web browser (Chrome, Firefox, or Edge recommended)
2. Enter the NVR IP address in the address bar
3. Log in with administrative credentials:
   - **Username**: admin (default) or custom admin account
   - **Password**: Your administrator password
4. Accept any security warnings (if using HTTP instead of HTTPS)

![NVR Login Screen](./images/config-step1.png)

**Expected Result**: Successfully logged into NVR web interface with main dashboard visible.

---

### Step 2: Verify Network Configuration

**UI Path**: NVR Interface → Settings → Network

**Objective**: Confirm NVR has proper network configuration for internet connectivity.

**Configuration Steps:**

1. Navigate to **Settings** → **Network** from the main menu
2. Verify the following settings:
   - **IP Address**: Confirm static IP or DHCP assignment
   - **Subnet Mask**: Typically 255.255.255.0
   - **Gateway**: Confirm correct gateway IP for internet access
   - **DNS Server**: Use 8.8.8.8 (Google) or your network DNS
3. Test internet connectivity if available in NVR interface
4. Note down the IP address for GCXONE configuration

![Network Settings](./images/config-step2.png)

**Expected Result**: NVR has valid network configuration with internet connectivity confirmed.

---

## Part 2: GCXONE Platform Setup

### Step 3: Add Honeywell NVR in GCXONE

**UI Path**: GCXONE → Devices → Add Device

**Objective**: Register the Honeywell 35 Series NVR in GCXONE platform for cloud monitoring.

**Configuration Steps:**

1. Log in to **GCXONE** platform (https://gcxone.com or your tenant URL)
2. Navigate to **Devices** → **Add Device** from the main menu
3. Select device type from dropdown:
   - **Type**: **Honeywell NVR** or **Generic NVR** (depending on platform version)
4. Enter device information:
   - **Device Name**: `Honeywell-Site-Location` (descriptive name for easy identification)
   - **Host/IP Address**: `[NVR IP Address from Step 2]`
   - **Port**: `80` (HTTP) or `443` (HTTPS)
   - **Username**: `admin` or your NVR admin username
   - **Password**: Your NVR admin password
   - **Time Zone**: Select the appropriate time zone for device location
5. Click **Test Connection** to verify credentials (if available)
6. Click **Save** or **Add Device**

![GCXONE Add Device](./images/config-step5.png)

**Expected Result**: Device added successfully and appears in GCXONE device list with "Connecting" or "Online" status.

---

### Step 4: Configure Integration Settings

**UI Path**: GCXONE → Devices → [Device Name] → Settings

**Objective**: Configure cloud streaming and integration profile settings.

**Configuration Steps:**

1. Locate your newly added Honeywell NVR in the device list
2. Click **Settings** or **Configure** icon
3. Configure integration settings:
   - **Integration Profile**: Select **Basic**, **Basic+**, or **Advanced** (based on subscription)
   - **Cloud Streaming**: Enable if required for remote access
   - **Genesis Audio**: Enable SIP audio if two-way communication is needed
   - **Polling Interval**: Set to 60 seconds (default) or as needed
4. Configure camera channels:
   - Review discovered cameras from the NVR
   - Enable/disable specific channels as needed
   - Set stream quality (Standard/High)
5. Click **Save Changes**

![Integration Settings](./images/config-step8.png)

**Expected Result**: Integration settings configured and device begins polling NVR for status updates.

---

### Step 3: [Configure Secondary Feature/Service]

**UI Path**: [Exact navigation path]

**Objective**: [What this step accomplishes]

**Configuration Steps:**

1. [Detailed configuration steps]
2. [Include specific values, dropdown selections, checkboxes]
3. [Screenshots for complex screens]
4. [Verification steps]

![Secondary Configuration](./images/config-step3.png)

**Expected Result**: [Expected outcome]

---

### Step 4: [Configure Credentials/Authentication]

**UI Path**: [Path to user/authentication settings]

**Objective**: Create or configure user account for GCXONE integration.

**Configuration Steps:**

1. Navigate to **[User Management / Security]**
2. Create new user or modify existing:
   - **Username**: `[Recommended username for GCXONE]`
   - **Password**: `[Strong password - note requirements]`
   - **Permissions/Role**: **[Administrator / Operator / Custom]**
3. Enable **[Required permissions for integration]**:
   - [ ] [Permission 1]
   - [ ] [Permission 2]
   - [ ] [Permission 3]
4. Click **Save**

**Expected Result**: User account created with appropriate permissions for GCXONE integration.

---

### Step 5: [Additional Device-Specific Configuration]

**UI Path**: [Path]

**Objective**: [What this accomplishes]

**Configuration Steps:**

[Add additional steps as needed for device-specific configuration]

**Expected Result**: [Expected outcome]

---

## Part 3: GCXONE Platform Setup

### Step 6: Add Device in GCXONE

**UI Path**: GCXONE → Devices → Add Device

**Objective**: Register the Honeywell 35 Series NVR in GCXONE platform.

**Configuration Steps:**

1. Log in to **GCXONE** platform
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **NVR**
4. Enter device information:
   - **Name**: `[Descriptive name for this device]`
   - **Host/IP Address**: `[Device IP or hostname]`
   - **Port**: `[Default port or custom]`
   - **Username**: `[Username created in Step 4]`
   - **Password**: `[Password created in Step 4]`
   - **Time Zone**: `[Select appropriate time zone]`
5. **[Any additional device-specific fields]**
6. Click **Discover** (if auto-discovery is supported)
   - The platform will connect to the device and discover available channels/sensors
7. Review discovered devices/channels
8. Click **Save**

![GCXONE Add Device](./images/config-gcxone-add.png)

**Expected Result**: Device appears in GCXONE device list with status indicator showing online/connected.

---

### Step 7: Configure Device Settings in GCXONE (Optional)

**UI Path**: GCXONE → Devices → Honeywell 35 Series NVR → Settings

**Objective**: Configure GCXONE-specific settings for the device.

**Configuration Steps:**

1. Locate your newly added device in the device list
2. Click **View** or **Settings**
3. Configure optional settings:
   - **[Setting 1]**: [Description and value]
   - **[Setting 2]**: [Description and value]
   - **Event Filters**: [Configure if needed]
   - **Recording Schedule**: [Configure if applicable]
4. Click **Save**

**Expected Result**: Device settings configured according to deployment requirements.

---

## Verification

### Verification Checklist

After completing the configuration, verify the following:

- [ ] **Device Status**: Shows as online/connected in GCXONE
- [ ] **[Feature 1]**: [How to test - expected result]
- [ ] **[Feature 2]**: [How to test - expected result]
- [ ] **Event Reception**: Trigger a test event, verify it appears in GCXONE
- [ ] **[Feature 4]**: [How to test - expected result]

### Test Procedures

**Test 1: [Primary Feature Test]**

1. [How to trigger/test the feature]
2. [What to observe]
3. **Expected Result**: [What should happen]

**Test 2: [Secondary Feature Test]**

1. [How to test]
2. [What to observe]
3. **Expected Result**: [What should happen]

**Test 3: Event/Alarm Test**

1. Trigger a test event on the device
2. Check GCXONE for event reception
3. **Expected Result**: Event appears in GCXONE within [X] seconds with correct details

---

## Advanced Configuration (Optional)

### [Optional Feature 1]

**When to use**: [Scenario where this is needed]

**Configuration**:
1. [Steps to configure]

### [Optional Feature 2]

**When to use**: [Scenario]

**Configuration**:
1. [Steps]

---

## Troubleshooting

If you encounter issues during configuration, see the Troubleshooting Guide for common problems and solutions.

**Quick troubleshooting**:
- **Device not discovered**: Verify network connectivity, credentials, and firewall settings
- **Connection fails**: Check IP address, port, and authentication credentials
- **No events received**: Verify event configuration on device and in GCXONE

---

## Related Articles

- [Honeywell 35 Series NVR Overview](./overview.md)
- Honeywell 35 Series NVR Troubleshooting
- 
- 

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE configuration guide
