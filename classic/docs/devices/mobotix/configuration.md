---
title: "Mobotix IP Camera Configuration"
description: "Step-by-step configuration guide for Mobotix IP Camera integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:mobotix
sidebar_position: 2
last_updated: 2025-12-20
---

# Mobotix IP Camera Configuration

## Overview

This guide covers the configuration of Mobotix IP Camera integration with GCXONE, including camera setup, ONVIF configuration, and GCXONE platform integration.

**What you'll accomplish:**
- Configure Mobotix camera network settings
- Enable ONVIF service for integration
- Create integration user account
- Add camera to GCXONE platform
- Configure events and Genesis Audio (SIP)
- Verify successful integration

**Estimated time**: 15-20 minutes

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] Mobotix IP camera with latest firmware
- [ ] Admin access to Mobotix camera web interface
- [ ] Network connectivity between camera and GCXONE
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP or DHCP reservation for camera

---

## Configuration Workflow

The configuration process consists of 3 main parts:

1. **Camera Network Setup** - Configure network and access (Steps 1-2)
2. **ONVIF and Integration Setup** - Enable ONVIF, create user (Steps 3-4)
3. **GCXONE Platform Setup** - Add camera, configure features (Steps 5-6)

---

## Part 1: Camera Network Setup

### Step 1: Access Mobotix Camera Web Interface

**UI Path**: Web Browser → http://[Camera-IP]

**Objective**: Access Mobotix camera web interface to begin configuration.

**Configuration Steps:**

1. **Open web browser** and navigate to camera IP address:
   - Default IP may be obtained via DHCP or manufacturer default
   - Use Mobotix camera tool to discover camera on network
2. **Log in** with admin credentials:
   - Default username: `admin`
   - Default password: `meinsm` (change immediately for security)
3. **Accept security certificate** if prompted
4. **Change default password**:
   - Navigate to **Admin Menu** → **Admin Password**
   - Enter new strong password
   - Click **Set**

:::warning Security Alert
**Default Mobotix password "meinsm" MUST be changed immediately!**

Mobotix cameras use a well-known default password that poses a serious security risk. Always:
- Change the password during initial setup
- Use a strong password (12+ characters, mixed case, numbers, symbols)
- Document the new password in your password manager
- Never use the default password in production environments
:::

**Expected Result**: Successfully logged into Mobotix camera web interface with admin access.

---

### Step 2: Configure Network Settings

**UI Path**: Admin Menu → Network → Network Configuration

**Objective**: Configure camera network settings for GCXONE integration.

**Configuration Steps:**

1. Navigate to **Admin Menu** → **Network** → **Network Configuration**
2. Configure **IP Configuration**:
   - **DHCP**: Uncheck (for static IP) or Check (for DHCP)
   - **IP Address**: 192.168.1.100 (example - use static IP recommended)
   - **Subnet Mask**: 255.255.255.0
   - **Gateway**: 192.168.1.1
   - **DNS Server**: 8.8.8.8 or local DNS
3. Configure **Ports**:
   - **HTTP Port**: 80 (default)
   - **HTTPS Port**: 443 (default)
4. Click **Set** to save settings
5. **Reboot camera** if IP address changed (camera will reload at new IP)
6. Verify network connectivity by accessing camera at new IP

:::info Mobotix Admin Menu
Mobotix uses a unique menu system accessed via the **Admin Menu** button or link. The interface is functional but may appear dated compared to modern cameras. Key navigation tips:
- **Admin Menu**: Main configuration hub (top-right or bottom-left)
- **Set button**: Saves changes (must click after each section)
- **Quick Install**: Wizard for initial setup (skip if already configured)
- **Advanced settings**: Nested under each main section

Refer to Mobotix documentation for your specific model's menu structure.
:::

**Expected Result**: Camera has static IP and is accessible via HTTP/HTTPS.

---

## Part 2: ONVIF and Integration Setup

### Step 3: Enable ONVIF Service

**UI Path**: Admin Menu → Network → ONVIF

**Objective**: Enable ONVIF service for GCXONE integration.

**Configuration Steps:**

1. Navigate to **Admin Menu** → **Network** → **ONVIF**
2. **Enable ONVIF**:
   - **Enable ONVIF Service**: ✓ Checked
   - **ONVIF Port**: 80 (default) or custom port
3. Configure **ONVIF Authentication**:
   - **Authentication**: WS-UsernameToken (recommended)
4. Click **Set** to enable ONVIF
5. Verify ONVIF service is active

:::tip Mobotix ONVIF Support
Mobotix cameras support ONVIF Profile S for basic streaming and Profile T for advanced features (firmware dependent). Key notes:
- **ONVIF port**: Usually same as HTTP port (80), but check your model
- **MxPEG codec**: Mobotix's proprietary codec may not work via ONVIF - use H.264 stream instead
- **Firmware**: Ensure firmware is up-to-date for best ONVIF compatibility
- **Authentication**: WS-UsernameToken recommended for security
:::

**Expected Result**: ONVIF service enabled and accessible on configured port.

---

### Step 4: Create Integration User Account

**UI Path**: Admin Menu → Admin Password / User Management

**Objective**: Create or configure user account for GCXONE integration.

**Configuration Steps:**

1. **Option A: Use Admin Account** (simpler, less secure):
   - Use existing admin account credentials for GCXONE integration
   - Ensure admin password is strong and documented

2. **Option B: Create ONVIF User** (recommended for security):
   - Navigate to **Admin Menu** → **User Management** (if available)
   - Create new user:
     - **Username**: `gcxone_integration`
     - **Password**: Create strong password
     - **Permissions**: Full access or ONVIF access
   - Click **Set** to create user

**Note**: Some Mobotix models use a single admin account. For these models, use the admin credentials for integration.

**Note**: User configuration interface varies by Mobotix model. Some models may use the Admin Password section for user management.

**Expected Result**: Integration user account ready with appropriate permissions.

---

## Part 3: GCXONE Platform Setup

### Step 5: Add Mobotix Camera in GCXONE

**UI Path**: GCXONE Web Portal → Devices → Add Device

**Objective**: Register Mobotix camera in GCXONE platform.

**Configuration Steps:**

1. Log into **GCXONE** web portal with admin credentials
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **IP Camera**
   - **Manufacturer**: **Mobotix** or **ONVIF**
4. Enter camera details:
   - **Device Name**: Descriptive name (e.g., "Front Entrance - Mobotix")
   - **IP Address/Hostname**: Camera IP from Step 2 (e.g., 192.168.1.100)
   - **Port**: 80 (ONVIF port)
   - **Username**: Integration user from Step 4 (`admin` or `gcxone_integration`)
   - **Password**: Password for integration user
   - **Protocol**: ONVIF
   - **Time Zone**: Select appropriate time zone
5. Click **Test Connection** to verify connectivity
6. If successful, click **Add Device** to register in GCXONE
7. GCXONE will discover camera capabilities via ONVIF

:::info Mobotix Integration via ONVIF
When adding Mobotix cameras to GCXONE:
- **Protocol**: Select **ONVIF** (recommended) or **Mobotix** if available
- **Streaming**: GCXONE will use H.264 stream (MxPEG may have limited support)
- **Features**: Core ONVIF features supported - advanced Mobotix features may require Mobotix-specific integration
- **Audio**: Two-way audio supported if camera has microphone/speaker

Use ONVIF for maximum compatibility across GCXONE platform versions.
:::

**Expected Result**: Mobotix camera successfully added and shows "Online" status in GCXONE.

---

### Step 6: Configure Events and Genesis Audio

**UI Path**: GCXONE → Devices → Mobotix Camera → Configuration

**Objective**: Configure event detection, arm/disarm, and Genesis Audio (SIP).

**Configuration Steps:**

1. In GCXONE, navigate to newly added Mobotix camera
2. Click **Configuration** or **Settings**
3. Configure **Event Settings**:
   - **Motion Detection**: ✓ Enable
   - **Event Forwarding**: ✓ Enable
   - **Event Notifications**: ✓ Enable (push, email)
4. Configure **Arm/Disarm**:
   - **Enable Arm/Disarm**: ✓ Checked
   - **Default State**: Armed or Disarmed
5. Configure **Genesis Audio (SIP)** (if required):
   - **Enable Genesis Audio**: ✓ Checked
   - **SIP Configuration**: Auto-configured by GCXONE
   - **Audio Codec**: G.711 (default)
6. Configure **Streaming Settings**:
   - **Stream Quality**: Auto or Manual
   - **Cloud Streaming**: ✓ Enable
7. Click **Save Configuration**

**Note**: Event and audio configuration is completed through the GCXONE web interface after successful device addition.

**Expected Result**: Events configured, arm/disarm enabled, Genesis Audio ready (if configured).

---

## Verification and Testing

### Verification Checklist

**Live Streaming:**
- [ ] Cloud live streaming works
- [ ] Stream quality is acceptable
- [ ] MxPEG codec streaming functional

**Events:**
- [ ] Motion detection events forwarded to GCXONE
- [ ] Event notifications received (push, email)
- [ ] Arm/Disarm functions work correctly

**Audio (if configured):**
- [ ] Genesis Audio (SIP) two-way communication works
- [ ] Microphone captures audio
- [ ] Speaker plays audio clearly

**General:**
- [ ] Camera status shows "Online" in GCXONE
- [ ] Mobile app access works
- [ ] No error messages in logs

---

## Advanced Configuration

### Motion Detection Customization

To customize motion detection in Mobotix camera:

1. Access Mobotix web interface
2. Navigate to **Setup Menu** → **Event Control** → **Motion Detection**
3. Configure detection areas:
   - Draw or adjust detection zones
   - Set sensitivity levels
   - Configure trigger thresholds
4. Configure **Event Actions**:
   - Enable event recording
   - Set event duration
5. Click **Set** to save

### Audio Configuration

To optimize audio settings:

1. Navigate to **Admin Menu** → **Audio**
2. Configure **Microphone**:
   - Adjust gain/sensitivity
   - Enable noise suppression
3. Configure **Speaker**:
   - Adjust volume
   - Test speaker output
4. Click **Set** to save

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **Camera not discovered**: Verify ONVIF enabled, check IP address and port
- **Connection fails**: Check firewall allows ports 80, 443, 554
- **No video**: Verify camera has power and network connectivity
- **Poor video quality**: Check network bandwidth, adjust stream quality
- **No events**: Verify motion detection enabled in Mobotix camera
- **Audio not working**: Check Genesis Audio (SIP) enabled, verify microphone/speaker settings
- **MxPEG codec issues**: Ensure GCXONE supports MxPEG or use ONVIF H.264 stream

---

## Related Articles

- [Mobotix IP Camera Overview](./overview.md)
- [Mobotix IP Camera Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)

---

**Need Help?**

If you need assistance with Mobotix IP Camera configuration, [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
