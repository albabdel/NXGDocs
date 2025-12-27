---
title: "Genesis VMS Configuration"
description: "Step-by-step configuration guide for Genesis VMS integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:genesisvms
sidebar_position: 2
last_updated: 2025-12-20
---

# Genesis VMS Configuration

## Overview

This guide covers the simplified configuration of Genesis VMS with GCXONE, leveraging native integration features for streamlined setup including auto-discovery and one-click configuration.

**What you'll accomplish:**
- Configure Genesis VMS network and GCXONE integration settings
- Enable auto-discovery or manually add Genesis VMS to GCXONE
- Select and configure integration profile (Basic, Basic+, Advanced)
- Configure cameras, events, and advanced features
- Verify successful integration and test all features

**Estimated time**: 20-30 minutes (faster with auto-discovery)

## Prerequisites

Ensure you have completed the prerequisites listed in the [Overview](./overview.md):

- [ ] Genesis VMS installed on server (Windows or Linux)
- [ ] Administrative access to Genesis VMS management interface
- [ ] Network connectivity established between server and GCXONE
- [ ] GCXONE account with device configuration permissions
- [ ] Static IP or DDNS configured for Genesis VMS server
- [ ] Cameras configured and recording in Genesis VMS

---

## Configuration Workflow

The configuration process consists of 2 main parts (simplified for native integration):

1. **Genesis VMS Setup** - Configure network and enable GCXONE integration (Steps 1-3)
2. **GCXONE Platform Setup** - Auto-discover or manually add Genesis VMS, configure profile and features (Steps 4-6)
3. **Verification** - Test live streaming, playback, timeline, events, and PTZ features

---

## Part 1: Genesis VMS Setup

### Step 1: Access Genesis VMS Management Interface

**UI Path**: Web Browser → https://[Genesis-VMS-IP]:8080

**Objective**: Access Genesis VMS management interface to begin configuration.

**Configuration Steps:**

1. Open a web browser and navigate to Genesis VMS management interface
2. Log in with administrative credentials
3. Verify Genesis VMS version is up to date
4. Check that cameras are discovered and recording

![Genesis VMS Management Interface](./images/config-step1.png)

**Expected Result**: Successfully logged into Genesis VMS with admin access.

---

### Step 2: Configure Network and Cloud Settings

**UI Path**: Genesis VMS → Settings → Network / Cloud Integration

**Objective**: Configure network settings and enable GCXONE cloud integration.

**Configuration Steps:**

1. Navigate to **Settings** → **Network**
2. Configure **Network Settings**:
   - **Server Name**: Descriptive name (e.g., "Site A Genesis VMS")
   - **IP Address**: Verify server IP (static recommended)
   - **Ports**: Verify ports 443, 554, 8080, 8081 are configured
   - **External Access**: Enable if using DDNS
3. Navigate to **Settings** → **Cloud Integration**
4. Configure **GCXONE Integration**:
   - **Enable GCXONE Integration**: ✓ Checked
   - **Auto-Discovery**: ✓ Enable (recommended for automatic detection)
   - **Cloud Service**: ✓ Enable cloud streaming
   - **Integration Mode**: Native (default for Genesis VMS)
5. Click **Save** and **Apply** settings

![Network and Cloud Configuration](./images/config-step2.png)

**Expected Result**: Network configured, GCXONE integration enabled, auto-discovery active.

---

### Step 3: Create Integration User (Optional for Manual Setup)

**UI Path**: Genesis VMS → Settings → Users

**Objective**: Create dedicated user for GCXONE integration (only if not using auto-discovery).

**Configuration Steps:**

1. Navigate to **Settings** → **Users**
2. Click **Add User**
3. Configure the integration user:
   - **Username**: `gcxone_integration` (or use default)
   - **Password**: Create strong password (save for manual setup)
   - **Role**: **Administrator**
   - **Permissions**: All permissions enabled (default for admin)
4. Click **Save**

**Note**: When using auto-discovery, Genesis VMS automatically creates integration credentials.

![User Configuration](./images/config-step3.png)

**Expected Result**: Integration user created (or auto-configured credentials ready).

---

## Part 2: GCXONE Platform Setup

### Step 4: Auto-Discover or Add Genesis VMS in GCXONE

**UI Path**: GCXONE Web Portal → Devices → Auto-Discover or Add Device

**Objective**: Register Genesis VMS in GCXONE using auto-discovery or manual setup.

**Configuration Steps (Auto-Discovery Method - Recommended):**

1. Log into the **GCXONE** web portal with admin credentials
2. Navigate to **Devices** → **Auto-Discover**
3. Click **Scan Network** or **Discover Devices**
4. Wait for GCXONE to discover Genesis VMS server (usually less than 30 seconds)
5. In discovered devices list, locate your Genesis VMS server
6. Click **Add** next to the Genesis VMS entry
7. Verify auto-populated information:
   - **Device Name**: Auto-detected name (edit if needed)
   - **IP Address**: Auto-detected
   - **Credentials**: Auto-configured (native integration)
8. Click **Add Device**

:::tip Why Auto-Discovery is Recommended
**Auto-discovery** dramatically simplifies Genesis VMS integration:
- **Zero credential entry**: Native integration auto-configures authentication
- **Instant detection**: Discovers Genesis VMS servers in under 30 seconds
- **Error prevention**: Eliminates manual IP/port/credential typos
- **One-click setup**: Single button click vs 8+ manual fields
- **Time savings**: 5 minutes vs 20+ minutes for manual method

Only use manual method if auto-discovery fails due to network segmentation or firewall rules.
:::

**Configuration Steps (Manual Method - If Auto-Discovery Fails):**

1. Navigate to **Devices** → **Add Device**
2. Select device type:
   - **Type**: **VMS**
   - **Manufacturer**: **NXGEN Genesis VMS**
3. Enter server details:
   - **Device Name**: Descriptive name
   - **IP Address/Hostname**: Server IP from Step 2
   - **Port**: 8080 (default) or custom
   - **Username**: Integration user from Step 3
   - **Password**: Password for integration user
   - **Protocol**: HTTPS
4. Click **Test Connection**
5. Click **Add Device**

![Auto-Discover Genesis VMS](./images/config-gcxone-add.png)

**Expected Result**: Genesis VMS successfully added and shows "Online" status in GCXONE.

---

### Step 5: Select Integration Profile and Configure Features

**UI Path**: GCXONE → Devices → Genesis VMS → Integration Profile

**Objective**: Select appropriate integration profile and enable desired features.

**Configuration Steps:**

1. In GCXONE, navigate to the newly added Genesis VMS device
2. Click **Integration Profile** or **Configuration**
3. Select **Integration Profile**:
   - **Basic Profile**: Essential features (live streaming, playback, events)
   - **Basic+ Profile**: Enhanced features (event management, notifications, arm/disarm)
   - **Advanced Profile**: Full features (AI analytics, advanced automation, timelapse) - **Recommended**

:::info Choosing the Right Integration Profile
**Which profile should you use?**
- **Basic**: Use for sites with no alarm monitoring requirements (view-only access)
- **Basic+**: Use for most installations with alarm monitoring and event response
- **Advanced**: Use for premium installations requiring AI analytics, automation, or timelapse

**Profile Migration**: You can upgrade profiles anytime without reconfiguration - features are added automatically.

**Recommendation**: Start with **Advanced** profile - there's no additional cost and all features remain available for future use.
:::

4. Click **Apply Profile** (features are auto-configured based on profile)
5. Review and customize **Profile Features** if needed:
   - **Cloud Streaming**: ✓ Enabled (auto-configured)
   - **Local Streaming**: ✓ Enabled (auto-configured)
   - **Cloud Polling**: ✓ Enabled (auto-configured)
   - **Genesis Audio (SIP)**: ✓ Enabled (auto-configured)
   - **PTZ Control**: ✓ Enabled (auto-configured)
   - **Clip Export**: ✓ Enabled (auto-configured)
   - **Timelapse**: ○ Enable if required (Advanced profile)
6. Click **Save Configuration**

![Integration Profile Selection](./images/config-step4.png)

**Expected Result**: Integration profile applied, features auto-configured and enabled.

---

### Step 6: Configure Cameras, Events, and Notifications

**UI Path**: GCXONE → Devices → Genesis VMS → Camera & Event Configuration

**Objective**: Configure camera mappings, event forwarding, and notification settings.

**Configuration Steps:**

1. Navigate to **Camera Configuration** in GCXONE
2. Review **Auto-Discovered Cameras** (Genesis VMS automatically syncs camera list)
3. For each camera (or use bulk configuration):
   - Assign to site/location in hierarchy
   - Verify **Cloud Streaming** enabled
   - Verify **Local Streaming** enabled
   - Verify **Timeline** enabled
   - Configure **Stream Quality**: Auto (recommended) or Manual
4. Navigate to **Event Configuration**
5. Configure **Event Forwarding** (auto-enabled based on profile):
   - **Motion Detection**: ✓ Enabled
   - **Analytics Events**: ✓ Enabled (Advanced profile)
   - **Camera Disconnection**: ✓ Enabled
   - **System Events**: ✓ Enabled
   - **I/O Triggers**: ✓ Enabled if hardware present
6. Configure **Notifications**:
   - **Push Notifications**: ✓ Enable for mobile alerts
   - **Email Notifications**: ✓ Enable (enter email addresses)
   - **SMS Notifications**: ✓ Enable if required
   - **Notification Schedule**: 24/7 or custom
7. Click **Save Configuration**

![Camera and Event Configuration](./images/config-step5.png)

**Expected Result**: Cameras auto-mapped, events forwarding, notifications configured.

---

## Part 3: Verification and Testing

### Verification Checklist

Test all core functions before completing configuration:

**Live Streaming:**
- [ ] Cloud live streaming works for all cameras
- [ ] Local live streaming works (when on same network)
- [ ] Stream quality is excellent with minimal latency
- [ ] Multiple concurrent streams work
- [ ] Automatic failover between cloud and local works

**Playback and Timeline:**
- [ ] Cloud playback works with timeline navigation
- [ ] Local playback works
- [ ] Timeline shows event markers with AI search
- [ ] Can jump to specific events
- [ ] Video export/clip download works

**Events:**
- [ ] Motion detection events forwarded correctly
- [ ] Event notifications received (push, email, SMS)
- [ ] Event video clips recorded
- [ ] Arm/Disarm functions work
- [ ] AI analytics events work (Advanced profile)

**PTZ Control:**
- [ ] PTZ controls work (pan, tilt, zoom)
- [ ] PTZ presets can be saved and recalled
- [ ] PTZ tours work

**General:**
- [ ] Device status shows "Online" in GCXONE
- [ ] Mobile app access works optimally
- [ ] No error messages in logs
- [ ] Cloud polling status active

---

## Advanced Configuration

### Multi-Site Deployment

For deploying Genesis VMS across multiple sites:

1. Install Genesis VMS at each site
2. Enable GCXONE integration on each instance
3. Use auto-discovery in GCXONE to find all instances
4. Organize by site hierarchy in GCXONE
5. Configure site-specific integration profiles
6. Set up cross-site automation rules if needed

### AI Analytics Configuration

To leverage AI-powered analytics (Advanced Profile):

1. Navigate to **Genesis VMS** → **Analytics**
2. Enable **AI Video Analytics**:
   - Object detection (person, vehicle, animal)
   - Behavior analysis (loitering, line crossing, crowd detection)
   - Facial recognition (if licensed)
3. Configure **Analytics Rules** in Genesis VMS
4. Verify analytics events forward to GCXONE
5. Create GCXONE automation rules based on analytics

### Genesis Audio Optimization

To optimize Genesis Audio (SIP) integration:

1. Navigate to **GCXONE** → **Genesis VMS** → **Audio Settings**
2. Verify **Genesis Audio (SIP)** is enabled (auto-configured)
3. Configure **Audio Quality**:
   - **Codec**: G.711 (default, high quality)
   - **Bitrate**: Auto (recommended)
   - **Echo Cancellation**: ✓ Enabled
4. Test two-way audio communication
5. Adjust settings based on network conditions

---

## Troubleshooting

If you encounter issues during configuration, see the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **Auto-discovery fails**: Verify network connectivity, check firewall allows UDP broadcast
- **Connection fails**: Verify IP address, port 8080, and network routing
- **No video**: Verify cameras are online in Genesis VMS management interface
- **Poor performance**: Check network bandwidth, consider using local streaming
- **Events not forwarded**: Verify integration profile has event forwarding enabled
- **Cloud polling inactive**: Check GCXONE integration enabled in Genesis VMS settings

---

## Related Articles

- [Genesis VMS Overview](./overview.md)
- [Genesis VMS Troubleshooting](./troubleshooting.md)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)
- [Required Ports](/docs/getting-started/required-ports)

---

**Need Help?**

If you need assistance with Genesis VMS configuration, [contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket).
