---
title: "EagleEye Integration Guide"
description: "Complete guide to integrating EagleEye IP cameras with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:eagleeye
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v3.1 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EagleEye Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Live Streaming (H.264/H.265)
- ✅ Playback & Timeline
- ✅ PTZ Control (Select models)
- ✅ Two-Way Audio (Select models)
- ✅ Motion Detection
- ✅ Smart Analytics
- ✅ Event Forwarding
- ✅ ONVIF Protocol Support

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v3.1 or later

---

## Prerequisites

### Hardware Requirements
- EagleEye IP camera with firmware v3.1+
- Network connectivity (Ethernet or WiFi)
- Power supply (PoE or external adapter)

### Network Requirements
- Static IP address or DHCP reservation recommended
- Ports 80 (HTTP), 554 (RTSP) accessible
- Internet connectivity for firmware updates

### Access Requirements
- Administrator credentials for EagleEye device
- GCXONE account with installer or admin role

---

## Step 1: Device Setup

### 1.1 Initial Configuration

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect camera to network via Ethernet
    2. Power on using PoE or external adapter
    3. Wait for initialization (60-90 seconds)
    4. Find IP using EagleEye discovery tool or router DHCP list
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Connect via Ethernet for initial setup
    2. Access camera web interface
    3. Configure WiFi in Network settings
    4. Test WiFi connection before disconnecting Ethernet
  </TabItem>
</Tabs>

### 1.2 Web Interface Access

1. **Navigate to:** `http://[camera-ip]`
2. **Login:** Default username `admin`, password `admin`
3. **Change Password:** Set secure admin password
4. **Verify Firmware:** Check version in System Info

### 1.3 User Management

**Path:** System → User Management

1. **Create User:** Username `nxgen`
2. **Set Password:** Secure password
3. **Assign Permissions:**
   - ✅ Live view
   - ✅ Playback
   - ✅ PTZ control
   - ✅ System info

---

## Step 2: Video Configuration

### 2.1 Stream Settings

**Path:** Video → Encode

<Tabs>
  <TabItem value="main" label="Main Stream">
    - **Resolution:** 1920×1080
    - **Frame Rate:** 25 fps
    - **Bitrate:** 2-4 Mbps
    - **Codec:** H.264
  </TabItem>

  <TabItem value="sub" label="Sub Stream">
    - **Resolution:** 640×480
    - **Frame Rate:** 15 fps
    - **Bitrate:** 512 Kbps
    - **Codec:** H.264
  </TabItem>
</Tabs>

### 2.2 Network Settings

**Path:** Network → Basic

1. **IP Configuration:** Static IP recommended
2. **DNS Settings:** Primary and secondary DNS
3. **NTP Server:** `time1.nxgen.cloud`
4. **Time Zone:** Local time zone

---

## Step 3: Event Configuration

### 3.1 Motion Detection

**Path:** Event → Motion Detection

1. **Enable Motion Detection**
2. **Set Sensitivity:** 50-70%
3. **Draw Detection Areas**
4. **Configure Schedule**
5. **Enable Alarm Output**

### 3.2 Smart Analytics

**Path:** Event → Smart Analytics

1. **Line Crossing:** Enable and configure
2. **Intrusion Detection:** Set detection zones
3. **Object Classification:** Person/Vehicle
4. **Confidence Threshold:** 70%

---

## Step 4: GCXONE Integration

### 4.1 Add to GCXONE

1. **Navigate:** Customer → Site → Devices → Add Device
2. **Select:** "EagleEye"
3. **Enter Details:**
   ```
   IP Address: [camera-ip]
   Port: 80
   Username: nxgen
   Password: [password]
   ```
4. **Save Configuration**

### 4.2 Verification

| Check | Expected | Action |
|-------|----------|--------|
| Status | 🟢 Online | Check network |
| Live View | Video playing | Verify streams |
| Events | Motion detected | Test detection |

---

## Troubleshooting

### Camera Offline
- Check network connectivity
- Verify IP address and credentials
- Test camera web interface access

### No Video Stream
- Verify stream configuration
- Check network bandwidth
- Test RTSP stream directly

### Events Not Received
- Enable alarm output in camera
- Check motion detection settings
- Verify GCXONE event processing

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v3.1  
**Certification:** ✅ NXGEN Certified