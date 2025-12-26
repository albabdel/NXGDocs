---
title: "AXIS CS Pro VMS Configuration"
description: "Step-by-step configuration guide for AXIS CS Pro VMS integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
  - device:axiscspro
sidebar_position: 2
last_updated: 2025-12-20
---

# AXIS CS Pro VMS Configuration

## Overview

This guide covers the complete configuration of AXIS CS Pro VMS integration with GCXONE, including both device-side and platform-side setup.

**What you'll accomplish:**
- Configure AXIS CS Pro VMS for communication with GCXONE
- Set up network connectivity and credentials
- Add and register the device in GCXONE platform
- Verify successful integration
- Test key features

**Estimated time**: [X-X] minutes

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] [Device-specific software/client installed]
- [ ] [Network connectivity established]
- [ ] [Administrative credentials available]
- [ ] [GCXONE account with appropriate permissions]

---

## Configuration Workflow

The configuration process consists of [3-4] main parts:

1. **Network Setup** - Configure network connectivity and ports
2. **Device Configuration** - Set up [device-specific settings]
3. **GCXONE Platform Setup** - Add device in GCXONE and configure integration
4. **Verification** - Test and validate the integration

---

## Part 1: VMS Server Setup

### Step 1: Enable Web Client
1. Log in to the AXIS CS Pro server.
2. Navigate to the **Services** or **Server Settings**.
3. Ensure the **Web Client** service is enabled and running.

### Step 2: Firewall Configuration
Ensure the following ports are open on the ACS server:
- **29202 (TCP)**: Communication port.
- **29204 (API)**: Facade API port.
- **29205 (Streaming)**: Video streaming port.

**Expected Result**: VMS server is reachable via the required service ports.

---

## Part 2: Event Forwarding

### Step 3: Configure Action Rules
1. Open the **AXIS CS Client** and navigate to **Events > Action Rules**.
2. Click **New Action Rule** to start the configuration wizard.
3. **Trigger**: Select desired event (e.g., Motion Detection, Tamper, I/O).
4. **Action**: Select **Send HTTP Notification**.
5. **URL**: `https://acsproxy.nxgen.cloud/eventIngest`
6. **Method**: POST
7. **Body**: Use the GCXONE JSON template with your `DEVICE_ID` and `CAMERA_ID`.

**Expected Result**: Real-time events are forwarded from the VMS to the GCXONE webhook endpoint.

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

**Objective**: Register the AXIS CS Pro VMS in GCXONE platform.

**Configuration Steps:**

1. Log in to **GCXONE** platform
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **VMS**
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

**UI Path**: GCXONE → Devices → AXIS CS Pro VMS → Settings

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

If you encounter issues during configuration, see the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting**:
- **Device not discovered**: Verify network connectivity, credentials, and firewall settings
- **Connection fails**: Check IP address, port, and authentication credentials
- **No events received**: Verify event configuration on device and in GCXONE

---

## Related Articles

- [AXIS CS Pro VMS Overview](./overview.md)
- [AXIS CS Pro VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Network Requirements](/docs/getting-started/required-ports)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE configuration guide
