---
title: "NXG Cloud NVR Configuration"
description: "Simplified configuration guide for NXG Cloud NVR with GCXONE zero-touch provisioning"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:nxgcloudnvr
sidebar_position: 2
last_updated: 2025-12-20
---

# NXG Cloud NVR Configuration

## Overview

This simplified guide covers the NXG Cloud NVR setup with GCXONE using zero-touch provisioning. Unlike traditional NVRs, NXG Cloud NVR automatically registers with GCXONE on first boot, eliminating complex configuration steps.

**What you'll accomplish:**
- Install NXG Cloud NVR hardware and connect cameras
- Verify automatic cloud registration and discovery
- Activate integration profile with one click
- Test all pre-configured features

**Estimated time**: 5-10 minutes (fastest integration in the platform)

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] NXG Cloud NVR hardware (pre-registered with NXGEN cloud)
- [ ] Network connectivity with internet access
- [ ] GCXONE account with device configuration permissions
- [ ] Ethernet cable for NVR network connection
- [ ] IP cameras (PoE or network-connected)

---

## Configuration Workflow

The configuration process consists of 2 simplified parts (cloud-native zero-touch):

1. **Physical Installation** - Connect NVR to network and cameras (Step 1)
2. **Automatic Cloud Setup** - NVR auto-registers, activate profile, verify (Steps 2-4)

---

## Part 1: Physical Installation

### Step 1: Install NXG Cloud NVR and Connect Cameras

**UI Path**: Physical Installation

**Objective**: Install NVR hardware, connect to network, and connect cameras.

**Installation Steps:**

1. **Unbox NXG Cloud NVR** and verify contents:
   - NVR unit
   - Power adapter
   - Ethernet cable (if not included, use standard Cat5e/Cat6)
   - Quick start guide
2. **Connect NVR to Network**:
   - Connect Ethernet cable from NVR to network switch/router
   - Verify network has internet connectivity
   - Verify firewall allows outbound HTTPS (port 443)
3. **Connect Cameras to NVR**:
   - **For PoE NVRs**: Connect cameras directly to NVR PoE ports
   - **For Standard NVRs**: Connect cameras to same network as NVR
   - Verify all cameras power on and connect
4. **Power On NVR**:
   - Connect power adapter to NVR
   - Wait 2-3 minutes for NVR to boot and auto-register with cloud

![NXG Cloud NVR Installation](./images/config-step1.png)

**Expected Result**: NVR powered on, connected to network, cameras detected. NVR automatically registers with NXGEN cloud.

:::tip Zero-Touch Provisioning Benefits
**What just happened?** Your NXG Cloud NVR automatically:
- ✓ Connected to NXGEN cloud infrastructure (no manual server configuration)
- ✓ Registered with your GCXONE account (no credential entry needed)
- ✓ Discovered connected cameras (no manual camera addition)
- ✓ Applied security certificates (no SSL/TLS configuration)
- ✓ Configured firewall-friendly outbound connections (no port forwarding)

**Time saved**: Traditional NVRs require 30-60 minutes of network configuration, port forwarding, DDNS setup, and credential management. NXG Cloud NVR eliminates ALL of this through zero-touch cloud provisioning.
:::

---

## Part 2: Automatic Cloud Setup

### Step 2: Verify Automatic Discovery in GCXONE

**UI Path**: GCXONE Web Portal → Devices → Discovered Devices

**Objective**: Verify NXG Cloud NVR appears automatically in GCXONE.

**Verification Steps:**

1. Log into **GCXONE** web portal with admin credentials
2. Navigate to **Devices** → **Discovered Devices** or **Dashboard**
3. Wait 30-60 seconds for NVR to appear in discovered devices list
4. Locate your NXG Cloud NVR in the list:
   - **Device Name**: NXG Cloud NVR + serial number (auto-detected)
   - **Status**: "Pending Activation" or "Ready"
   - **Cameras**: Number of cameras detected
5. Click on the NVR entry to view details

![Auto-Discovered NVR](./images/config-gcxone-add.png)

**Expected Result**: NXG Cloud NVR appears automatically in GCXONE with all cameras detected.

**Troubleshooting**: If NVR doesn't appear after 2 minutes:
- Verify NVR has internet connectivity (check NVR front panel LEDs)
- Verify firewall allows outbound HTTPS (port 443)
- Check NVR is powered on and booted completely
- Refresh GCXONE page

---

### Step 3: Activate Integration Profile (One-Click Setup)

**UI Path**: GCXONE → Devices → NXG Cloud NVR → Activate

**Objective**: Activate integration profile to enable all features automatically.

**Activation Steps:**

1. Click on your NXG Cloud NVR in GCXONE device list
2. Click **Activate** or **Configure Integration**
3. Select **Integration Profile**:
   - **Basic Profile**: Essential features (live streaming, playback, events) - Good for basic deployments
   - **Basic+ Profile**: Enhanced features (event management, notifications, arm/disarm) - Recommended for most deployments
   - **Advanced Profile**: Full features (AI analytics, advanced automation, timelapse) - Best for comprehensive security
4. Click **Activate Profile**
5. Wait 10-30 seconds for activation to complete
6. All features are automatically configured based on selected profile:
   - ✓ Cloud streaming enabled
   - ✓ Local streaming enabled
   - ✓ Event forwarding enabled
   - ✓ Notifications configured
   - ✓ Genesis Audio (SIP) enabled
   - ✓ PTZ control enabled (if PTZ cameras present)
   - ✓ Cloud polling enabled
   - ✓ Timeline enabled

![Profile Activation](./images/config-step2.png)

**Expected Result**: Integration profile activated, all features auto-configured, NVR status shows "Online".

---

### Step 4: Verify Camera and Feature Configuration

**UI Path**: GCXONE → Devices → NXG Cloud NVR → Cameras / Settings

**Objective**: Verify all cameras and features are auto-configured correctly.

**Verification Steps:**

1. Navigate to **Cameras** tab in NXG Cloud NVR device page
2. Verify all connected cameras are listed:
   - Camera name (auto-generated or editable)
   - Status: "Online"
   - Cloud streaming: ✓ Enabled
   - Local streaming: ✓ Enabled
   - Timeline: ✓ Enabled
3. **Optional**: Customize camera settings:
   - Rename cameras to descriptive names
   - Assign cameras to site/location hierarchy
   - Adjust stream quality (Auto recommended)
   - Configure privacy masks if needed
4. Verify **Event Configuration** (auto-configured):
   - Motion detection: ✓ Enabled
   - Event notifications: ✓ Enabled (push, email)
   - Event recording: ✓ Enabled
5. Verify **Advanced Features** (based on profile):
   - Genesis Audio (SIP): ✓ Enabled
   - PTZ control: ✓ Enabled (if PTZ cameras)
   - AI analytics: ✓ Enabled (Advanced profile)
6. Click **Save** if any customizations made

![Camera Verification](./images/config-step3.png)

**Expected Result**: All cameras online, features auto-configured per selected profile.

---

## Verification and Testing

### Quick Verification Checklist

**Immediate Tests (Less than 2 minutes):**
- [ ] All cameras show "Online" status in GCXONE
- [ ] Live streaming works (click any camera to view)
- [ ] NVR status shows "Online" in GCXONE
- [ ] Timeline appears with event markers

**Comprehensive Tests (5-10 minutes):**
- [ ] **Live Streaming**: Cloud live streaming works for all cameras
- [ ] **Playback**: Cloud playback works with timeline navigation
- [ ] **Events**: Motion detection events appear in timeline
- [ ] **Notifications**: Push notifications received on mobile app (trigger motion)
- [ ] **Audio**: Genesis Audio (SIP) two-way communication works (if configured)
- [ ] **PTZ**: PTZ controls work for PTZ cameras (if present)
- [ ] **Local Streaming**: Local streaming works when on same network
- [ ] **Mobile App**: Access NVR and cameras via GCXONE mobile app

---

## Advanced Configuration (Optional)

### Customizing Auto-Configured Settings

While NXG Cloud NVR auto-configures all settings, you can optionally customize:

**Camera Names and Organization:**
1. Navigate to **Cameras** tab
2. Click camera to rename
3. Assign to site/location hierarchy
4. Group cameras by zone/area

**Event Notification Rules:**
1. Navigate to **Event Configuration**
2. Customize notification schedule (24/7 or custom hours)
3. Add additional notification recipients
4. Configure event-specific actions

**AI Analytics (Advanced Profile):**
1. Navigate to **Analytics** settings
2. Enable specific analytics:
   - Person detection
   - Vehicle detection
   - Line crossing
   - Loitering detection
3. Configure analytics zones for each camera
4. Set analytics sensitivity

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **NVR not discovered**: Verify internet connectivity, check firewall allows outbound HTTPS (443)
- **Cameras not detected**: Verify cameras connected to NVR PoE ports or network
- **No video**: Verify cameras are powered on and online in NVR
- **Activation fails**: Refresh GCXONE page, verify GCXONE account permissions
- **Events not appearing**: Wait 5 minutes for initial event sync, trigger motion to test

---

## Why NXG Cloud NVR is Different

Traditional NVR setup vs. NXG Cloud NVR:

| Task | Traditional NVR | NXG Cloud NVR |
|------|----------------|---------------|
| **Network Configuration** | Manual IP, port forwarding, DDNS | Automatic (zero-touch) |
| **Cloud Registration** | Manual account creation, server setup | Automatic on first boot |
| **GCXONE Integration** | Manual device addition, credentials | Automatic discovery |
| **Feature Configuration** | Step-by-step manual configuration | One-click profile activation |
| **Firmware Updates** | Manual download and installation | Automatic cloud updates |
| **Total Setup Time** | 45-90 minutes | 5-10 minutes |

---

## Related Articles

- [NXG Cloud NVR Overview](./overview.md)
- [NXG Cloud NVR Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)

---

**Need Help?**

If you need assistance with NXG Cloud NVR, [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket). Most issues resolve automatically within 5 minutes of installation.
