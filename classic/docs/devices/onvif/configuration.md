---
title: "ONVIF IP Camera Configuration"
description: "Generic configuration guide for ONVIF-compatible IP cameras with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:onvif
sidebar_position: 2
last_updated: 2025-12-20
---

# ONVIF IP Camera Configuration

## Overview

This generic guide covers the configuration of any ONVIF-compatible IP camera with GCXONE, using the industry-standard ONVIF protocol for universal camera support.

**What you'll accomplish:**
- Configure camera network settings
- Enable ONVIF service
- Create ONVIF user account
- Add camera to GCXONE using ONVIF protocol
- Configure events and features
- Verify successful integration

**Estimated time**: 10-15 minutes

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] ONVIF-compatible IP camera (Profile S or Profile T)
- [ ] Admin access to camera web interface
- [ ] Network connectivity between camera and GCXONE
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP or DHCP reservation for camera

---

## Configuration Workflow

The configuration process consists of 3 main parts:

1. **Camera Setup** - Configure network, enable ONVIF (Steps 1-3)
2. **GCXONE Platform Setup** - Add camera using ONVIF (Steps 4-5)
3. **Verification** - Test events and features

---

## Part 1: Camera Setup

### Step 1: Access Camera Web Interface

**UI Path**: Web Browser → http://[Camera-IP] or https://[Camera-IP]

**Objective**: Access camera web interface to begin configuration.

**Configuration Steps:**

1. **Discover camera IP address**:
   - Use manufacturer's camera discovery tool
   - Check DHCP server lease table
   - Use ONVIF Device Manager (free tool)
2. **Open web browser** and navigate to camera IP
3. **Log in** with default or admin credentials:
   - Check camera documentation for defaults
   - Common defaults: admin/admin, admin/12345, admin/[blank]
4. **Change default password** (security best practice):
   - Navigate to user/security settings
   - Create strong admin password

:::info Camera Web Interface
The camera web interface appearance varies significantly by manufacturer. Common interfaces include:
- **Axis**: Clean white interface with left sidebar navigation
- **Hikvision**: Blue-themed interface with top menu bar
- **Dahua**: Gray interface with configuration tree on left
- **Hanwha**: Modern flat design with card-based layout

Refer to your camera's user manual for manufacturer-specific login screens.
:::

**Expected Result**: Successfully logged into camera web interface with admin access.

---

### Step 2: Configure Network Settings

**UI Path**: Network / Network Configuration (varies by manufacturer)

**Objective**: Configure camera network for GCXONE integration.

**Configuration Steps:**

1. Navigate to **Network** or **Network Configuration**
2. Configure **IP Settings**:
   - **DHCP**: Disable (for static IP) or Enable with reservation
   - **IP Address**: 192.168.1.100 (example - use static recommended)
   - **Subnet Mask**: 255.255.255.0 (match your network)
   - **Gateway**: 192.168.1.1 (your network gateway)
   - **DNS Server**: 8.8.8.8 or local DNS
3. Configure **Ports** (if available):
   - **HTTP Port**: 80 (default)
   - **HTTPS Port**: 443 (default)
   - **RTSP Port**: 554 (default)
4. Click **Save** or **Apply**
5. If IP changed, access camera at new IP address

:::tip Network Configuration Best Practices
- **Static IP recommended**: Prevents connectivity issues when DHCP lease expires
- **Document the IP**: Keep a spreadsheet of all camera IPs for troubleshooting
- **Use network ranges**: Assign cameras to dedicated subnet (e.g., 192.168.10.x for cameras)
- **Test connectivity**: Ping camera from GCXONE server before proceeding
:::

**Expected Result**: Camera has static IP and is accessible via network.

---

### Step 3: Enable ONVIF Service and Create User

**UI Path**: ONVIF / System / User Management (varies by manufacturer)

**Objective**: Enable ONVIF service and create integration user.

**Configuration Steps:**

1. **Enable ONVIF Service**:
   - Navigate to **ONVIF** or **Network Services** settings
   - **Enable ONVIF**: ✓ Checked
   - **ONVIF Port**: Usually same as HTTP port (80) or dedicated port
   - **Authentication**: WS-UsernameToken or Digest (recommended)
2. **Create ONVIF User Account**:
   - Navigate to **User Management** or **Accounts**
   - Click **Add User**
   - Configure user:
     - **Username**: `onvif_user` or `gcxone_integration`
     - **Password**: Create strong password (save for GCXONE setup)
     - **Role/Level**: Administrator or Operator
     - **ONVIF Access**: ✓ Enabled
   - Click **Save** or **OK**
3. **Verify ONVIF Service**:
   - Check ONVIF service status shows "Enabled" or "Running"
   - Note the ONVIF port for GCXONE setup

:::warning ONVIF Configuration Locations Vary
ONVIF settings location differs by manufacturer. Common paths:
- **Axis**: System → Integration → ONVIF
- **Dahua**: Network → Integration → ONVIF
- **Hanwha**: Setup → Network → Integration
- **Hikvision**: Configuration → Network → Advanced → Integration Protocol
- **Uniview**: Network → Integration → ONVIF

If you cannot find ONVIF settings, consult your camera's user manual or search for "ONVIF" in the settings search bar.
:::

**Expected Result**: ONVIF service enabled, integration user created with appropriate permissions.

---

## Part 2: GCXONE Platform Setup

### Step 4: Add ONVIF Camera in GCXONE

**UI Path**: GCXONE Web Portal → Devices → Add Device

**Objective**: Register ONVIF camera in GCXONE platform.

**Configuration Steps:**

1. Log into **GCXONE** web portal with admin credentials
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **IP Camera**
   - **Manufacturer**: **ONVIF** or **Generic ONVIF**
4. Enter camera details:
   - **Device Name**: Descriptive name (e.g., "Lobby Camera - ONVIF")
   - **IP Address/Hostname**: Camera IP from Step 2 (e.g., 192.168.1.100)
   - **Port**: ONVIF port from Step 3 (usually 80 or custom)
   - **Username**: ONVIF user from Step 3 (`onvif_user`)
   - **Password**: Password for ONVIF user
   - **Protocol**: ONVIF
   - **Time Zone**: Select appropriate time zone
5. Click **Test Connection** to verify ONVIF connectivity
6. If successful, click **Add Device** to register in GCXONE
7. GCXONE will auto-discover camera capabilities via ONVIF:
   - Video streams (Profile S/T)
   - Event capabilities
   - Audio capabilities (if supported)
   - PTZ capabilities (if supported)

:::tip ONVIF Auto-Discovery
GCXONE automatically discovers camera capabilities via ONVIF, including:
- **Video profiles**: Resolution, frame rate, codec support
- **Event types**: Motion detection, tampering, digital inputs
- **Audio**: Microphone and speaker availability
- **PTZ**: Pan, tilt, zoom capabilities and preset positions

No manual configuration needed - GCXONE queries the camera's ONVIF services automatically.
:::

**Expected Result**: ONVIF camera successfully added and shows "Online" status in GCXONE.

**Troubleshooting Connection Issues:**
- Verify ONVIF service is enabled on camera
- Check firewall allows ONVIF port (usually 80)
- Verify credentials are correct
- Try using camera's IP address instead of hostname
- Check ONVIF port matches camera configuration

---

### Step 5: Configure Events and Features

**UI Path**: GCXONE → Devices → ONVIF Camera → Configuration

**Objective**: Configure event detection, arm/disarm, and audio features.

**Configuration Steps:**

1. In GCXONE, navigate to newly added ONVIF camera
2. Click **Configuration** or **Settings**
3. Configure **Event Settings**:
   - **Event Detection**: ✓ Enable (ONVIF motion detection)
   - **Event Forwarding**: ✓ Enable
   - **Event Notifications**: ✓ Enable (push, email)
   - **Event Types**: Select supported event types
4. Configure **Arm/Disarm**:
   - **Enable Arm/Disarm**: ✓ Checked
   - **Default State**: Armed or Disarmed
5. Configure **Genesis Audio (SIP)** (if camera supports audio):
   - **Enable Genesis Audio**: ✓ Checked (if available)
   - **Audio Codec**: G.711 or camera-supported codec
   - **Two-Way Audio**: ✓ Enable (if camera has speaker)
6. Configure **Additional Settings** (camera-dependent):
   - **PTZ Control**: Enable if camera supports PTZ
   - **Privacy Masks**: Configure if required
7. Click **Save Configuration**

**Note**: Available features depend on camera's ONVIF implementation. Configuration options vary by manufacturer and camera model.

**Expected Result**: Events configured, arm/disarm enabled, features activated based on camera capabilities.

**Note**: Available features depend on camera's ONVIF implementation. Not all features may be available on all cameras.

---

## Verification and Testing

### Verification Checklist

**Basic Functions:**
- [ ] Camera status shows "Online" in GCXONE
- [ ] Live streaming works (if supported by integration)
- [ ] Camera responds to connection tests

**Events:**
- [ ] Motion detection events forwarded to GCXONE
- [ ] Event notifications received (push, email)
- [ ] Arm/Disarm functions work correctly

**Audio (if configured):**
- [ ] Genesis Audio (SIP) connects successfully
- [ ] Two-way audio works (if camera has speaker)

**General:**
- [ ] Mobile app access works
- [ ] No error messages in GCXONE logs

---

## Advanced Configuration

### ONVIF Device Manager

For advanced ONVIF troubleshooting and verification:

1. Download free **ONVIF Device Manager** tool
2. Discover camera on network
3. Verify ONVIF services:
   - Device service
   - Media service
   - Event service
   - PTZ service (if applicable)
4. Test ONVIF capabilities:
   - Get profiles
   - Get stream URI
   - Subscribe to events
5. Use for troubleshooting GCXONE integration issues

### Manufacturer-Specific Optimizations

For best results with specific manufacturers:
- **Axis**: Use Axis-specific integration if available for enhanced features
- **Hikvision**: Use Hikvision SDK integration for better performance
- **Dahua**: Use Dahua-specific integration when possible
- **Generic ONVIF**: Use this guide when manufacturer-specific integration unavailable

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **Camera not discovered**: Verify ONVIF enabled, check IP address and ONVIF port
- **Connection fails**: Check firewall, verify credentials, test with ONVIF Device Manager
- **No events**: Verify motion detection enabled on camera, check event configuration in camera
- **Poor performance**: Consider manufacturer-specific integration if available
- **Audio not working**: Verify camera supports ONVIF audio, check Genesis Audio configuration
- **Limited features**: ONVIF implementation varies - some cameras support more features than others

---

## Manufacturer Resources

**Common ONVIF Locations by Manufacturer:**
- **Axis**: System → Integration → ONVIF
- **Dahua**: Network → Integration → ONVIF
- **Hanwha (Samsung)**: Setup → Network → Integration
- **Hikvision**: Configuration → Network → Advanced → Integration Protocol
- **Uniview**: Network → Integration → ONVIF

**ONVIF Conformance:**
Check manufacturer's ONVIF conformance at: https://www.onvif.org/conformant-products/

---

## Related Articles

- [ONVIF IP Camera Overview](./overview.md)
- [ONVIF IP Camera Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)

---

**Need Help?**

If you need assistance with ONVIF IP Camera configuration, [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket). For manufacturer-specific guidance, consult the camera's user manual.
