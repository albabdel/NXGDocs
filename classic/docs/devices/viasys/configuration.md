---
title: "Viasys/ShieldBox Cloud NVR Configuration"
description: "Step-by-step configuration guide for Viasys/ShieldBox Cloud NVR integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:viasys
sidebar_position: 2
last_updated: 2025-12-20
---

# Viasys/ShieldBox Cloud NVR Configuration

## Overview

This guide covers the configuration of Viasys/ShieldBox Cloud NVR integration with GCXONE, leveraging cloud-based setup for simplified deployment.

**What you'll accomplish:**
- Access Viasys/ShieldBox cloud platform and configure NVR
- Setup network connectivity for cloud integration
- Add Viasys/ShieldBox Cloud NVR to GCXONE platform
- Configure cameras, events, and integration profile
- Verify successful integration and test all features

**Estimated time**: 25-35 minutes

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] Viasys/ShieldBox Cloud NVR hardware or cloud account
- [ ] Admin access to Viasys/ShieldBox cloud platform
- [ ] Network connectivity with internet access
- [ ] GCXONE account with device configuration permissions
- [ ] Viasys/ShieldBox cloud account credentials
- [ ] Cameras configured in Viasys/ShieldBox platform

---

## Configuration Workflow

The configuration process consists of 3 main parts:

1. **Viasys Cloud Setup** - Access cloud platform, configure NVR and cameras (Steps 1-3)
2. **GCXONE Platform Setup** - Add cloud NVR to GCXONE, configure integration (Steps 4-6)
3. **Verification** - Test live streaming, playback, timeline, events

---

## Part 1: Viasys/ShieldBox Cloud Setup

### Step 1: Access Viasys/ShieldBox Cloud Platform

**UI Path**: Web Browser → https://cloud.viasys.com or https://shieldbox.cloud (example URLs)

**Objective**: Access Viasys/ShieldBox cloud platform to configure NVR.

**Configuration Steps:**

1. **Open web browser** and navigate to Viasys/ShieldBox cloud portal
2. **Log in** with your cloud account credentials:
   - Email address
   - Password
3. **Select Organization** (if managing multiple organizations)
4. Navigate to **Devices** or **NVRs** section
5. Verify your Cloud NVR appears in the device list:
   - NVR should show "Online" status
   - Serial number matches physical device
6. Click on the NVR to access configuration

![Viasys Cloud Platform](./images/config-step1.png)

**Expected Result**: Successfully logged into Viasys/ShieldBox cloud platform with NVR visible and online.

---

### Step 2: Configure NVR Network and Cloud Settings

**UI Path**: Cloud Platform → NVR → Settings → Network

**Objective**: Configure NVR network settings for cloud integration.

**Configuration Steps:**

1. In NVR device page, navigate to **Settings** → **Network**
2. Configure **Network Settings**:
   - **Connection Type**: DHCP or Static IP
   - **IP Address**: Verify NVR has valid IP (if static)
   - **Gateway**: Verify gateway is correct
   - **DNS Server**: 8.8.8.8 or local DNS
3. Configure **Cloud Settings**:
   - **Enable Cloud Service**: ✓ Checked (should be enabled by default)
   - **Cloud Status**: Verify shows "Connected"
   - **GCXONE Integration**: ✓ Enable if available
4. Configure **Ports** (if configurable):
   - Verify HTTP/HTTPS ports for cloud communication
5. Click **Save** to apply settings
6. Verify **Cloud Connection Status** shows "Active" or "Connected"

![NVR Network Configuration](./images/config-step2.png)

**Expected Result**: NVR connected to Viasys cloud platform, network settings configured correctly.

---

### Step 3: Verify Cameras and Configure Recording

**UI Path**: Cloud Platform → NVR → Cameras

**Objective**: Verify cameras are configured and recording in Viasys cloud platform.

**Configuration Steps:**

1. Navigate to **Cameras** section in NVR device page
2. Verify all cameras are listed and online:
   - Camera names
   - Connection status: "Online"
   - Live stream preview available
3. For each camera, verify **Recording Settings**:
   - **Recording Schedule**: Continuous or Motion-based
   - **Recording Location**: Cloud, Local, or Both
   - **Retention Period**: Set according to requirements
4. Configure **Motion Detection** (if not already enabled):
   - Enable motion detection for cameras
   - Set detection sensitivity
   - Configure detection zones
5. Verify **Storage Status**:
   - Local storage (if available): Check disk space
   - Cloud storage: Verify storage allocation
6. Click **Save** to apply camera settings

![Camera Configuration](./images/config-step3.png)

**Expected Result**: All cameras online, recording enabled, motion detection configured.

---

## Part 2: GCXONE Platform Setup

### Step 4: Add Viasys/ShieldBox Cloud NVR in GCXONE

**UI Path**: GCXONE Web Portal → Devices → Add Device

**Objective**: Register Viasys/ShieldBox Cloud NVR in GCXONE platform.

**Configuration Steps:**

1. Log into **GCXONE** web portal with admin credentials
2. Navigate to **Devices** → **Add Device**
3. Select device type:
   - **Type**: **Cloud NVR** or **Cloud VMS**
   - **Manufacturer**: **Viasys** or **ShieldBox**
4. Enter cloud NVR details:
   - **Device Name**: Descriptive name (e.g., "Site A - Viasys Cloud NVR")
   - **Cloud Account**: Viasys/ShieldBox cloud account email
   - **Cloud Credentials**: Password or API key
   - **NVR Serial Number**: Serial number from Step 1
   - **Time Zone**: Select appropriate time zone
5. Alternatively, use **Cloud Integration** method:
   - **Cloud Platform**: Viasys/ShieldBox
   - **Authorization**: OAuth or API token (if available)
6. Click **Test Connection** to verify cloud connectivity
7. If successful, click **Add Device** to register in GCXONE
8. GCXONE will discover all cameras from Viasys Cloud NVR via cloud API

![Add Viasys in GCXONE](./images/config-gcxone-add.png)

**Expected Result**: Viasys/ShieldBox Cloud NVR successfully added and shows "Online" status in GCXONE with cameras discovered.

---

### Step 5: Configure Integration Profile and Features

**UI Path**: GCXONE → Devices → Viasys Cloud NVR → Integration Settings

**Objective**: Select integration profile and enable desired features.

**Configuration Steps:**

1. In GCXONE, navigate to newly added Viasys Cloud NVR device
2. Click **Integration Settings** or **Configuration**
3. Select **Integration Profile**:
   - **Basic Profile**: Essential features (live streaming, playback, events)
   - **Basic+ Profile**: Enhanced features (event management, notifications, IO control)
4. Click **Apply Profile** (features are auto-configured based on profile)
5. Review and customize **Profile Features**:
   - **Cloud Streaming**: ✓ Enabled (auto-configured)
   - **Cloud Polling**: ✓ Enabled (auto-configured)
   - **Genesis Audio (SIP)**: ✓ Enabled (auto-configured)
   - **PTZ Control**: ✓ Enabled (if PTZ cameras present)
   - **IO Control**: ✓ Enabled (if alarm inputs/outputs present)
   - **Timelapse**: ○ Enable if required (partial support)
6. Click **Save Configuration**

![Integration Profile](./images/config-step4.png)

**Expected Result**: Integration profile applied, features auto-configured and enabled.

---

### Step 6: Configure Cameras, Events, and Notifications

**UI Path**: GCXONE → Devices → Viasys Cloud NVR → Camera & Event Configuration

**Objective**: Configure camera mappings, event forwarding, and notification settings.

**Configuration Steps:**

1. Navigate to **Camera Configuration** in GCXONE
2. Review **Auto-Discovered Cameras** (synced from Viasys cloud)
3. For each camera:
   - Assign to site/location in hierarchy
   - Verify **Cloud Streaming** enabled
   - Verify **Timeline** enabled
   - Configure **Stream Quality**: Auto (recommended)
4. Navigate to **Event Configuration**
5. Configure **Event Forwarding**:
   - **Motion Detection**: ✓ Enabled
   - **Video Analytics**: ✓ Enabled (if available)
   - **Camera Disconnection**: ✓ Enabled
   - **System Events**: ✓ Enabled
   - **Alarm Inputs**: ✓ Enabled (if using physical alarms)
6. Configure **Notifications**:
   - **Push Notifications**: ✓ Enable for mobile alerts
   - **Email Notifications**: ✓ Enable (enter email addresses)
   - **SMS Notifications**: ✓ Enable if required
   - **Notification Schedule**: 24/7 or custom
7. Click **Save Configuration**

![Camera and Event Configuration](./images/config-step5.png)

**Expected Result**: Cameras mapped, events forwarding, notifications configured.

---

## Part 3: Verification and Testing

### Verification Checklist

**Live Streaming:**
- [ ] Cloud live streaming works for all cameras
- [ ] Stream quality acceptable with minimal latency
- [ ] Multiple concurrent streams work
- [ ] Audio works (if cameras support audio)

**Playback and Timeline:**
- [ ] Cloud playback works with timeline navigation
- [ ] Timeline shows event markers correctly
- [ ] Can jump to specific events on timeline
- [ ] Playback speed controls work
- [ ] Video export/clip download works

**Events:**
- [ ] Motion detection events forwarded to GCXONE
- [ ] Event notifications sent correctly (push, email, SMS)
- [ ] Event video clips accessible
- [ ] Arm/Disarm functions work
- [ ] System events properly reported

**PTZ Control (if applicable):**
- [ ] Cloud PTZ controls work (pan, tilt, zoom)
- [ ] PTZ presets can be saved and recalled

**General:**
- [ ] Device status shows "Online" in GCXONE
- [ ] Mobile app access works
- [ ] No error messages in device logs
- [ ] Cloud polling status active

---

## Advanced Configuration

### IO Integration (Basic+ Profile)

For NVRs with physical alarm inputs/outputs:

1. Navigate to **IO Configuration** in GCXONE
2. Map alarm inputs to GCXONE events:
   - Assign descriptive names to each input
   - Configure input trigger type (NC/NO)
3. Configure alarm output actions:
   - Link outputs to GCXONE automation rules
   - Set output duration and behavior
4. Test alarm triggers and verify events in GCXONE

### Multi-Site Deployment

For managing multiple Viasys/ShieldBox Cloud NVRs:

1. Add each Cloud NVR separately in GCXONE
2. Use cloud account credentials for each site
3. Organize NVRs by site hierarchy in GCXONE
4. Configure site-specific integration profiles
5. Set up cross-site automation rules if needed

---

## Troubleshooting

See the Troubleshooting Guide for common problems and solutions.

**Quick troubleshooting:**
- **NVR not discovered**: Verify cloud account credentials and NVR is online in Viasys platform
- **Connection fails**: Check cloud service enabled in Viasys platform, verify API access
- **No video**: Verify cameras online in Viasys cloud platform
- **Poor video quality**: Check network bandwidth between NVR and cloud
- **No events**: Verify motion detection enabled in Viasys platform and GCXONE
- **Cloud streaming fails**: Check NVR has internet connectivity and cloud status is "Connected"

---

## Related Articles

- [Viasys/ShieldBox Cloud NVR Overview](./overview.md)
- Viasys/ShieldBox Cloud NVR Troubleshooting
- 
- 

---

**Need Help?**

If you need assistance with Viasys/ShieldBox Cloud NVR configuration, [contact support](/docs/support/contact).
