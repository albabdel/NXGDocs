---
title: "Hanwha Techwin Integration Guide"
description: "Complete guide to integrating Hanwha Techwin (Samsung) IP cameras with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:hanwha
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v2.40 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Hanwha Techwin Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Live Streaming (Dual streams)
- ✅ Playback & Timeline
- ✅ PTZ Control & Presets
- ✅ Two-Way Audio (Select models)
- ✅ Motion Detection
- ✅ Intelligent Video Analytics (IVA)
- ✅ Event Forwarding
- ✅ ONVIF Protocol Support

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v2.40 or later

---

## Prerequisites

### Hardware Requirements
- Hanwha Techwin IP camera with firmware v2.40+
- Network connectivity (Ethernet or WiFi)
- Power supply (PoE, PoE+, or external adapter)

### Network Requirements
- Static IP address or DHCP reservation recommended
- Ports 80 (HTTP), 443 (HTTPS), 554 (RTSP) accessible
- Internet connectivity for firmware updates and NTP sync

### Access Requirements
- Administrator credentials for Hanwha device
- GCXONE account with installer or admin role

---

## Step 1: Device Preparation

### 1.1 Initial Device Setup

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect device to network via Ethernet cable
    2. Power on device using PoE or external adapter
    3. Wait for initialization (typically 60-90 seconds)
    4. Find device IP address using:
       - Hanwha Device Manager
       - iPOLiS Device Manager
       - Router DHCP client list
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Power on device
    2. Use WPS button method or temporary Ethernet connection
    3. Access device web interface
    4. Configure WiFi in Network → Wireless settings
    5. Note assigned IP address after connection
  </TabItem>
</Tabs>

### 1.2 Access Device Web Interface

1. **Open web browser** and navigate to: `http://[device-ip]`

2. **Initial Setup** (first-time access):
   - Install ActiveX plugin (IE) or use plugin-free mode
   - Create admin password (minimum 8 characters)
   - Set basic network configuration
   - Accept license agreement

3. **Login** with credentials:
   - **Username:** `admin`
   - **Password:** [your secure password]

4. **Verify firmware version**:
   - Go to **Setup → System → Product Information**
   - **Minimum required:** v2.40
   - **Recommended:** Latest available version

### 1.3 User Management

**Path:** Setup → System → User

1. **Click "Add"** to create new user
2. **Enter user details:**
   - **ID:** `nxgen`
   - **Password:** [secure password - store safely]
   - **Confirm Password:** [repeat password]
   - **Authority:** User

3. **Required Permissions for nxgen user:**
   - ✅ Live
   - ✅ Playback
   - ✅ PTZ control
   - ✅ Audio
   - ✅ Relay control
   - ✅ System information

4. **Click "OK"** to save user

### 1.4 Time Configuration

**Path:** Setup → System → Date & Time

1. **Time zone:** Select your local time zone
2. **NTP synchronization:** Enable
3. **NTP server:** Use `time1.nxgen.cloud` or `pool.ntp.org`
4. **Daylight saving time:** Configure if applicable
5. **Click "Apply"** to save settings

---

## Step 2: Video & Audio Configuration

### 2.1 Video Codec Settings

**Path:** Setup → Video & Audio → Video Profile

Configure dual streams for optimal performance:

<Tabs>
  <TabItem value="profile1" label="Profile 1 (High Quality)">
    **Recommended Settings:**
    - **Codec:** H.264 or H.265
    - **Resolution:** 1920×1080 (1080p)
    - **Frame rate:** 25 fps
    - **Bitrate control:** VBR
    - **Target bitrate:** 2048-4096 Kbps
    - **GOP size:** 30

    **Use for:** Recording, high-quality viewing
  </TabItem>

  <TabItem value="profile2" label="Profile 2 (Live View)">
    **Recommended Settings:**
    - **Codec:** H.264
    - **Resolution:** 704×480 or 640×360
    - **Frame rate:** 15 fps
    - **Bitrate control:** VBR
    - **Target bitrate:** 512-1024 Kbps
    - **GOP size:** 15

    **Use for:** Live monitoring, mobile viewing
  </TabItem>
</Tabs>

### 2.2 Audio Configuration (if supported)

**Path:** Setup → Video & Audio → Audio

1. **Audio input:** Enable if microphone available
2. **Audio codec:** G.711 μ-law or AAC
3. **Sample rate:** 8 kHz (G.711) or 16 kHz (AAC)
4. **Bitrate:** 64 Kbps
5. **Click "Apply"** to save

---

## Step 3: Analytics & Event Configuration

### 3.1 Intelligent Video Analytics (IVA)

**Path:** Setup → Event → Video Analytics

#### Motion Detection
1. **Enable motion detection**
2. **Sensitivity:** 50-80 (adjust based on environment)
3. **Detection area:** Draw areas to monitor
4. **Object size filter:** Set minimum and maximum sizes
5. **Schedule:** Configure active hours

#### Line Crossing
1. **Enable line crossing detection**
2. **Draw detection line** on video preview
3. **Direction:** Bidirectional or specific direction
4. **Sensitivity:** 50-70
5. **Object filter:** Person, Vehicle, or All

#### Enter/Exit Detection
1. **Enable enter/exit detection**
2. **Draw detection area** (polygon)
3. **Detection type:** Enter, Exit, or Both
4. **Sensitivity:** 50-70
5. **Minimum duration:** 1-3 seconds

### 3.2 Event Actions

**Path:** Setup → Event → Event Action

Configure actions for each event type:

1. **Select event type** (Motion, Line crossing, etc.)
2. **Enable "Notify server"** (critical for GCXONE)
3. **Server settings:**
   - **Protocol:** HTTP
   - **Server IP:** GCXONE server IP
   - **Port:** 80 or 443
   - **Path:** `/api/events`
4. **Enable "Record"** for video clips
5. **Click "Apply"** to save

---

## Step 4: Add Device to GCXONE

### 4.1 Device Discovery

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Hanwha Techwin"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [device-ip]
   Port: 80 (HTTP) or 443 (HTTPS)
   Username: nxgen
   Password: [nxgen user password]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** Unique identifier (e.g., `HAN-CAM-001`)
   - **Time Zone:** [Auto-detected or manual selection]
   - **Description:** Descriptive name for the device

5. **Click "Discover"** to detect streams and capabilities
6. **Review discovered features** and analytics
7. **Click "Save"** to add device to GCXONE

### 4.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Device Status | 🟢 Online | [Check network connectivity](#troubleshooting) |
| Video Streams | Dual streams available | [Check codec settings](#streaming-issues) |
| Live View | Clear video quality | [Verify profiles](#profile-issues) |
| Analytics Events | IVA events in Video Activity | [Check event actions](#event-issues) |
| PTZ Control | Smooth operation (if applicable) | [Verify PTZ settings](#ptz-issues) |
| Audio | Audio working (if supported) | [Check audio settings](#audio-issues) |

---

## Troubleshooting

### Device Shows Offline

**Solutions:**
1. **Plugin Issues**
   - Use plugin-free mode in modern browsers
   - Clear browser cache and cookies
   - Try different browser (Chrome, Firefox)

2. **Network Configuration**
   - Verify IP address is correct and reachable
   - Check firewall settings
   - Ensure proper VLAN configuration

### Video Stream Issues

**Solutions:**
1. **Codec Problems**
   - Use H.264 instead of H.265 for compatibility
   - Reduce bitrate if network bandwidth limited
   - Check GOP size settings

2. **Profile Configuration**
   - Verify both profiles are properly configured
   - Test streams individually
   - Check resolution and frame rate settings

### Analytics Not Triggering

**Solutions:**
1. **Detection Settings**
   - Adjust sensitivity levels (50-80 range)
   - Redraw detection areas
   - Check object size filters

2. **Event Actions**
   - Verify "Notify server" is enabled
   - Check server IP and port settings
   - Test event actions manually

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v2.40.x  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0