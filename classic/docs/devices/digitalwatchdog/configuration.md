---
title: "Digital Watchdog VMS/NVR Configuration"
description: "Step-by-step configuration guide for Digital Watchdog VMS/NVR integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:digitalwatchdog
sidebar_position: 2
last_updated: 2025-12-20
---

# Digital Watchdog VMS/NVR Configuration

## Overview

This guide covers the configuration of Digital Watchdog Spectrum VMS or Blackjack NVR integration with GCXONE, including server setup, cloud service configuration, and GCXONE platform integration.

**What you'll accomplish:**
- Configure DW Spectrum/NVR network and cloud settings
- Enable DW Cloud service for GCXONE integration
- Create integration user with appropriate permissions
- Add DW system to GCXONE platform
- Configure cameras, events, and advanced features
- Verify successful integration and test all features

**Estimated time**: 40-50 minutes

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] Digital Watchdog Spectrum VMS 5.0+ or Blackjack NVR
- [ ] Admin access to DW Spectrum Desktop Client or NVR web interface
- [ ] Network connectivity between DW system and GCXONE
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP or DDNS configured for DW server/NVR
- [ ] Cameras configured and recording in DW system

---

## Configuration Workflow

1. **DW System Configuration** - Configure network, cloud service, users, cameras (Steps 1-5)
2. **GCXONE Platform Setup** - Add DW system to GCXONE, configure integration (Steps 6-8)
3. **Verification** - Test live streaming, playback, timeline, events, PTZ features

---

## Part 1: Digital Watchdog System Configuration

### Step 1: Access DW Spectrum Desktop Client or NVR Web Interface

**UI Path**: Desktop → DW Spectrum Desktop Client OR Web Browser → https://[NVR-IP]

**Objective**: Access DW management interface to begin configuration.

**Configuration Steps:**

1. **For DW Spectrum VMS**: Launch DW Spectrum Desktop Client
   - Connect to server (IP or hostname)
   - Enter admin credentials
   - Click **Connect**
2. **For Blackjack NVR**: Open web browser
   - Navigate to https://[NVR-IP]
   - Log in with admin credentials
3. Verify DW Spectrum version 5.0+ or compatible NVR firmware
4. Check cameras are discovered and recording

![DW Spectrum/NVR Interface](./images/config-step1.png)

**Expected Result**: Successfully connected to DW system with admin access.

---

### Step 2: Configure Server Network Settings

**UI Path**: System Administration → General / Network Settings

**Objective**: Configure server network settings for GCXONE integration.

**Configuration Steps:**

1. Navigate to **System Administration** → **General** (Spectrum) or **Settings** → **Network** (NVR)
2. Configure **Server Settings**:
   - **Server Name**: Descriptive name (e.g., "Site A DW Spectrum")
   - **Server URL**: Verify external IP or DDNS hostname
   - **Port**: 7001 (default HTTPS) - note for GCXONE setup
3. Verify network has stable internet connectivity
4. Note server/NVR IP address for GCXONE integration
5. Click **Apply** to save settings

![Network Configuration](./images/config-step2.png)

**Expected Result**: Server network configured with accessible IP/hostname.

---

### Step 3: Enable and Configure DW Cloud Service

**UI Path**: System Administration → Cloud / Cloud Settings

**Objective**: Enable DW Cloud service for GCXONE cloud integration.

**Configuration Steps:**

1. Navigate to **System Administration** → **Cloud** (or **Settings** → **Cloud** on NVR)
2. Click **Connect to Cloud** or **Enable Cloud Service**
3. Configure **Cloud Settings**:
   - **Cloud Account**: Sign in with DW Cloud account (or create new)
   - **System Name**: Descriptive name for cloud access
   - **Cloud Relay**: ✓ Enable for cloud streaming
4. Configure **Cloud Permissions**:
   - **Allow Cloud Access**: ✓ Enabled
   - **Cloud Streaming**: ✓ Enabled
   - **Cloud Playback**: ✓ Enabled
5. Click **Save** and verify cloud connection status shows "Connected"

![DW Cloud Configuration](./images/config-step3.png)

**Expected Result**: DW Cloud service enabled and connected successfully.

---

### Step 4: Create Integration User Account

**UI Path**: System Administration → Users / User Management

**Objective**: Create dedicated user for GCXONE integration with full permissions.

**Configuration Steps:**

1. Navigate to **System Administration** → **Users** (or **Settings** → **User Management**)
2. Click **Add User** or **+** icon
3. Configure the integration user:
   - **Username**: `gcxone_integration`
   - **Password**: Create strong password (save for GCXONE setup)
   - **User Type**: **Administrator** or **Power User**
4. Configure **Permissions** (ensure all are enabled):
   - ✓ Live View
   - ✓ Playback
   - ✓ Export Video
   - ✓ PTZ Control
   - ✓ Event Management
   - ✓ System Administration (for SDK access)
5. Click **OK** or **Save** to create the user

![User Configuration](./images/config-step4.png)

**Expected Result**: Integration user created with full administrative permissions.

---

### Step 5: Configure Cameras and Recording Settings

**UI Path**: Desktop Client → Cameras / NVR → Recording Schedule

**Objective**: Verify cameras configured correctly for GCXONE integration.

**Configuration Steps:**

1. View **Cameras** list in left panel (Spectrum) or **Camera Management** (NVR)
2. For each camera, verify:
   - Camera is **Online** and streaming
   - **Recording Schedule** configured (continuous or motion-based)
   - **Motion Detection** enabled if required
   - **Stream Quality** appropriate (primary and secondary streams)
3. Configure **Recording Settings**:
   - Navigate to **System Administration** → **Recording** or **Storage**
   - Set **Retention Period**: 7-30 days
   - Enable **Pre-Recording**: 5-10 seconds
   - Configure **Storage** location and available space
4. Verify **PTZ Cameras** (if applicable):
   - Test PTZ controls
   - Configure PTZ presets if needed
5. Click **Apply** to save

![Camera Configuration](./images/config-step5.png)

**Expected Result**: All cameras online, recording, and properly configured.

---

## Part 2: GCXONE Platform Setup

### Step 6: Add Digital Watchdog System in GCXONE

**UI Path**: GCXONE Web Portal → Devices → Add Device

**Objective**: Register DW system in GCXONE platform.

**Configuration Steps:**

1. Log into **GCXONE** web portal with admin credentials
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **VMS** (for Spectrum) or **NVR** (for Blackjack)
   - **Manufacturer**: **Digital Watchdog**
4. Enter system details:
   - **Device Name**: Descriptive name (e.g., "Site A - DW Spectrum VMS")
   - **IP Address/Hostname**: Server/NVR IP from Step 2
   - **Port**: 7001 (default) or custom port
   - **Username**: Integration user from Step 4 (`gcxone_integration`)
   - **Password**: Password for integration user
   - **Protocol**: HTTPS
   - **Time Zone**: Select appropriate time zone
5. Configure **Integration Profile**:
   - **Basic Profile**: Essential features only
   - **Basic+ Profile**: Enhanced with event management
   - **Advanced Profile**: Full feature set with DW Analytics+ (recommended)
6. Click **Test Connection** to verify connectivity
7. If successful, click **Add Device** to register in GCXONE
8. GCXONE will discover all cameras from DW system

![Add DW in GCXONE](./images/config-gcxone-add.png)

**Expected Result**: DW system successfully added and shows "Online" status in GCXONE.

---

### Step 7: Configure Camera Mappings and Streaming

**UI Path**: GCXONE → Devices → Digital Watchdog → Camera Configuration

**Objective**: Map cameras, configure streaming modes, enable timeline features.

**Configuration Steps:**

1. In GCXONE, navigate to newly added DW system
2. Click **Configure Cameras** or **Camera Management**
3. For each camera:
   - Verify camera name and assign to site/location
   - Enable **Cloud Streaming**: ✓ Checked (for remote access)
   - Enable **Local Streaming**: ✓ Checked (for on-site access)
   - Enable **Event Forwarding**: ✓ Checked
   - Configure **Stream Quality**: Auto, High, Medium, or Low
   - Enable **Timeline**: ✓ Checked (for event navigation)
4. Configure **Advanced Camera Settings**:
   - **Audio**: Enable if cameras support audio
   - **PTZ Settings**: Configure PTZ presets (if applicable)
   - **Privacy Masks**: Configure if required
5. Click **Save Configuration**

![Camera Mapping](./images/config-step6.png)

**Expected Result**: All cameras mapped with cloud and local streaming enabled.

---

### Step 8: Configure Events, Notifications, and Integration Profiles

**UI Path**: GCXONE → Devices → Digital Watchdog → Event Configuration

**Objective**: Set up event forwarding, notifications, configure integration profile features.

**Configuration Steps:**

1. Navigate to DW system **Event Configuration** in GCXONE
2. Configure **Event Forwarding**:
   - **Motion Detection**: ✓ Enable forwarding
   - **Analytics Events**: ✓ Enable (if using DW Analytics+)
   - **Camera Disconnection**: ✓ Enable
   - **System Events**: ✓ Enable (storage full, errors)
   - **I/O Triggers**: ✓ Enable (if using I/O devices)
3. Configure **Event Notifications**:
   - **Push Notifications**: ✓ Enable for mobile app alerts
   - **Email Notifications**: ✓ Enable (enter email addresses)
   - **SMS Notifications**: ✓ Enable if required
   - **Notification Schedule**: 24/7 or custom schedule
4. Configure **Integration Profile Features**:
   - **Cloud Polling**: ✓ Enable (for status monitoring)
   - **Genesis Audio (SIP)**: ✓ Enable (for two-way communication)
   - **Clip Export**: ✓ Enable (for manual video export)
   - **Timelapse**: ✓ Enable if required (partial support)
5. Configure **Event Actions**:
   - Set recording triggers
   - Configure automation rules
   - Set event retention period
6. Click **Save Event Configuration**

![Event Configuration](./images/config-step7.png)

**Expected Result**: Events forwarded, notifications configured, integration profile features enabled.

---

## Part 3: Verification and Testing

### Verification Checklist

**Live Streaming:**
- [ ] Cloud live streaming works for all cameras
- [ ] Local live streaming works (when on same network)
- [ ] Stream quality acceptable with minimal latency
- [ ] Multiple concurrent streams work
- [ ] Audio works (if cameras support audio)

**Playback and Timeline:**
- [ ] Cloud playback works with timeline navigation
- [ ] Local playback works (when on same network)
- [ ] Timeline shows event markers correctly
- [ ] Can jump to specific events on timeline
- [ ] Playback speed controls work
- [ ] Video export/clip download works

**Events:**
- [ ] Motion detection events forwarded to GCXONE
- [ ] Event notifications sent correctly (push, email, SMS)
- [ ] Event video clips recorded
- [ ] Arm/Disarm functions work
- [ ] System events properly reported

**PTZ Control (if applicable):**
- [ ] Cloud PTZ controls work (pan, tilt, zoom)
- [ ] Local PTZ control works
- [ ] PTZ presets can be saved and recalled
- [ ] PTZ tours work (if configured)

**General:**
- [ ] Device status shows "Online" in GCXONE
- [ ] Mobile app access works
- [ ] No error messages in device logs
- [ ] Cloud polling status active

---

## Advanced Configuration

### DW Spectrum Analytics+ Integration

To integrate DW Spectrum Analytics+ (Advanced Profile):

1. Install analytics plugins in DW Spectrum
2. Configure analytics rules (motion, line crossing, loitering, etc.)
3. Enable analytics event forwarding in GCXONE
4. Configure GCXONE automation rules based on analytics events
5. Test analytics detection and event flow

### Multi-Server Federation

For deploying multiple DW systems:

1. Configure each system independently
2. Add each as separate device in GCXONE
3. Organize cameras by site hierarchy in GCXONE
4. Configure cross-server event rules if needed
5. Set up role-based access per server/site

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **System not discovered**: Verify IP address, port 7001, and credentials
- **Connection fails**: Check firewall rules allow port 7001 and 443
- **No video**: Verify cameras online in DW system
- **Poor video quality**: Check network bandwidth and camera bitrate settings
- **No events**: Verify event detection enabled in DW system and GCXONE
- **Cloud connection fails**: Check DW Cloud service enabled and connected
- **PTZ not working**: Verify PTZ cameras properly configured in DW system

---

## Related Articles

- [Digital Watchdog VMS/NVR Overview](./overview.md)
- [Digital Watchdog VMS/NVR Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)

---

**Need Help?**

If you need assistance with Digital Watchdog VMS/NVR configuration, [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
