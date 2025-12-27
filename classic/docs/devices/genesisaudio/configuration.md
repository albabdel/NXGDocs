---
title: "GenesisAudio SIP Twillio Configuration"
description: "Step-by-step configuration guide for GenesisAudio SIP Twillio integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
  - device:genesisaudio
sidebar_position: 2
last_updated: 2025-12-20
---

# GenesisAudio SIP Twillio Configuration

## Overview

This guide covers the complete configuration of GenesisAudio SIP Twillio integration with GCXONE, including both device-side and platform-side setup.

**What you'll accomplish:**
- Configure GenesisAudio SIP Twillio for communication with GCXONE
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

## Part 1: Network Setup

### Step 1: Configure Network Settings

**UI Path**: [Device Interface → Network → Settings] (or specify exact path)

**Objective**: Ensure GenesisAudio SIP Twillio can communicate with GCXONE platform.

**Configuration Steps:**

1. [Access device web interface / management software]
2. Navigate to **[Network Settings / Configuration]**
3. Configure the following:
   - **IP Address**: [Static IP recommended] - `[Example: 192.168.1.100]`
   - **Subnet Mask**: `[Example: 255.255.255.0]`
   - **Gateway**: `[Example: 192.168.1.1]`
   - **DNS**: [Primary: X.X.X.X, Secondary: X.X.X.X]
4. **[Any device-specific network settings]**
5. Click **Save** or **Apply**

![Network Configuration](./images/config-step1.png)

**Expected Result**: Device has stable network connectivity. Verify by pinging the device IP address.

---

## Part 2: Device Configuration

### Step 2: Configure Axis Horn Speakers

**UI Path**: System → SIP → SIP accounts → + Account

**Configuration Steps:**
1. Log in to the speaker with admin credentials.
2. Navigate to **SIP Accounts** and click **+ Account**.
3. Enter the credentials from the GCXONE Configuration App:
   - **Active**: Enable
   - **Transport Mode**: TCP
   - **Answer Automatically**: Enable
4. Click **Save**.

**Expected Result**: Status indicator turns green, showing the account is successfully registered with the SIP server.

---

### Step 3: Configure TOA IP Speakers

**UI Path**: Left Menu → SIP

**Configuration Steps:**
1. Log in to the TOA web interface.
2. Navigate to the **SIP** menu on the left.
3. Enter the following details:
   - **SIP Account Active**: ON
   - **SIP Server Address**: genesisaudio.sip.twilio.com
   - **User ID**: [GCXONE SIP Username]
   - **Password**: [GCXONE SIP Password]
4. Move required **Audio Codecs** to the Enable tab.
5. Click **Save**.

**Expected Result**: Registration status updates to **Registered**.

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

**Objective**: Register the GenesisAudio SIP Twillio in GCXONE platform.

**Configuration Steps:**

1. Log in to **GCXONE** platform
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **Other**
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

**UI Path**: GCXONE → Devices → GenesisAudio SIP Twillio → Settings

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

- [GenesisAudio SIP Twillio Overview](./overview.md)
- [GenesisAudio SIP Twillio Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Network Requirements](/docs/getting-started/required-ports)

## Change Log

- 2025-12-20 v1.0.0 - Initial GCXONE configuration guide
