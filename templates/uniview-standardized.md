---
title: "Uniview Integration Guide"
description: "Complete guide to integrating Uniview IP cameras and NVRs with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:uniview
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v5.1.0 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Uniview Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Live Streaming (Triple streams)
- ✅ Playback & Timeline
- ✅ PTZ Control & Presets
- ✅ Two-Way Audio (Select models)
- ✅ Motion Detection
- ✅ Smart IPC Analytics
- ✅ Event Forwarding
- ✅ ONVIF Protocol Support

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v5.1.0 or later

---

## Prerequisites

### Hardware Requirements
- Uniview IP camera or NVR with firmware v5.1.0+
- Network connectivity (Ethernet or WiFi)
- Power supply (PoE, PoE+, or external adapter)

### Network Requirements
- Static IP address or DHCP reservation recommended
- Ports 80 (HTTP), 443 (HTTPS), 554 (RTSP) accessible
- Internet connectivity for firmware updates and NTP sync

### Access Requirements
- Administrator credentials for Uniview device
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
       - EZTools (Uniview's discovery software)
       - Router DHCP client list
       - Device label (default IP)
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Power on device
    2. Connect via Ethernet for initial setup
    3. Access device web interface
    4. Configure WiFi in Network → WiFi settings
    5. Disconnect Ethernet and note WiFi IP
  </TabItem>
</Tabs>

### 1.2 Access Device Web Interface

1. **Open web browser** and navigate to: `http://[device-ip]`

2. **Initial Setup** (first-time access):
   - Create admin password (minimum 8 characters)
   - Set device name and location
   - Configure basic network settings
   - Accept license terms

3. **Login** with credentials:
   - **Username:** `admin`
   - **Password:** [your secure password]

4. **Verify firmware version**:
   - Go to **System → Device Info → Basic Info**
   - **Minimum required:** v5.1.0
   - **Recommended:** Latest stable version

### 1.3 User Management

**Path:** System → User Management → User

1. **Click "Add"** to create new user
2. **Enter user details:**
   - **User Name:** `nxgen`
   - **Password:** [secure password - store safely]
   - **Confirm Password:** [repeat password]
   - **User Type:** Operator

3. **Required Permissions for nxgen user:**
   - ✅ Live View
   - ✅ Playback
   - ✅ PTZ Control
   - ✅ Two-way Audio
   - ✅ Device Control
   - ✅ System Info

4. **Click "OK"** to save user

### 1.4 Time Configuration

**Path:** System → General → Date & Time

1. **Time Zone:** Select your local time zone
2. **NTP Enable:** Check to enable
3. **NTP Server:** Use `time1.nxgen.cloud` or `pool.ntp.org`
4. **DST:** Configure daylight saving time if applicable
5. **Click "Apply"** to save settings

---

## Step 2: Video & Audio Configuration

### 2.1 Video Stream Settings

**Path:** Media → Video → Video Stream

Configure multiple streams for different use cases:

<Tabs>
  <TabItem value="main" label="Main Stream (Recording)">
    **Recommended Settings:**
    - **Resolution:** 1920×1080 (1080p) or higher
    - **Frame Rate:** 25 fps
    - **Bitrate Type:** VBR
    - **Bitrate:** 2048-4096 Kbps
    - **Encoding:** H.264 or H.265
    - **I-Frame Interval:** 50

    **Use for:** Recording, forensic analysis
  </TabItem>

  <TabItem value="sub1" label="Sub Stream 1 (Live View)">
    **Recommended Settings:**
    - **Resolution:** 704×576 or 640×480
    - **Frame Rate:** 15 fps
    - **Bitrate Type:** VBR
    - **Bitrate:** 512-1024 Kbps
    - **Encoding:** H.264
    - **I-Frame Interval:** 25

    **Use for:** Live monitoring, operator viewing
  </TabItem>

  <TabItem value="sub2" label="Sub Stream 2 (Mobile)">
    **Recommended Settings:**
    - **Resolution:** 352×288 or 320×240
    - **Frame Rate:** 10 fps
    - **Bitrate Type:** CBR
    - **Bitrate:** 256-512 Kbps
    - **Encoding:** H.264
    - **I-Frame Interval:** 15

    **Use for:** Mobile viewing, low bandwidth
  </TabItem>
</Tabs>

### 2.2 Audio Configuration (if supported)

**Path:** Media → Audio → Audio Stream

1. **Audio Enable:** Check to enable audio
2. **Audio Encoding:** G.711A or AAC
3. **Sample Rate:** 8000 Hz (G.711) or 16000 Hz (AAC)
4. **Bitrate:** 64 Kbps
5. **Click "Apply"** to save

---

## Step 3: Analytics & Event Configuration

### 3.1 Smart IPC Analytics

**Path:** Event → Smart Event → Smart IPC

#### Motion Detection
1. **Enable Motion Detection**
2. **Sensitivity:** 1-100 (start with 50)
3. **Detection Region:** Draw areas to monitor
4. **Target Size Filter:** Set min/max object sizes
5. **Schedule:** Configure active time periods

#### Line Crossing Detection
1. **Enable Line Crossing**
2. **Draw Detection Line:** Click and drag on preview
3. **Direction:** A→B, B→A, or A↔B
4. **Sensitivity:** 1-100 (start with 60)
5. **Target Filter:** Human, Vehicle, or All

#### Intrusion Detection
1. **Enable Intrusion Detection**
2. **Draw Detection Area:** Create polygon region
3. **Time Threshold:** 1-10 seconds
4. **Sensitivity:** 1-100 (start with 60)
5. **Target Filter:** Human, Vehicle, or All

### 3.2 Event Actions

**Path:** Event → Event Handler → Event Handler

Configure actions for each event type:

1. **Select Event Type** (Motion, Line Crossing, etc.)
2. **Enable "Notify Surveillance Center"** (required for GCXONE)
3. **Notification Settings:**
   - **Protocol:** HTTP
   - **Server Address:** GCXONE server IP
   - **Port:** 80 or 443
   - **URL:** `/api/events`
4. **Enable "Record"** for video clips
5. **Click "Apply"** to save

---

## Step 4: Add Device to GCXONE

### 4.1 Device Discovery

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Uniview"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [device-ip]
   Port: 80 (HTTP) or 443 (HTTPS)
   Username: nxgen
   Password: [nxgen user password]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** Unique identifier (e.g., `UNV-CAM-001`)
   - **Time Zone:** [Auto-detected or manual selection]
   - **Description:** Descriptive name for the device

5. **Click "Discover"** to detect streams and capabilities
6. **Review discovered features** and analytics
7. **Click "Save"** to add device to GCXONE

### 4.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Device Status | 🟢 Online | [Check network connectivity](#troubleshooting) |
| Video Streams | Multiple streams available | [Check stream settings](#streaming-issues) |
| Live View | Clear video quality | [Verify stream configuration](#stream-issues) |
| Analytics Events | Smart events in Video Activity | [Check event handlers](#event-issues) |
| PTZ Control | Smooth operation (if applicable) | [Verify PTZ settings](#ptz-issues) |
| Audio | Audio working (if supported) | [Check audio configuration](#audio-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Add Uniview device via API"
curl -X POST https://api.nxgen.cloud/v1/devices \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "manufacturer": "Uniview",
    "model": "IPC2124SR3-PF40",
    "ipAddress": "192.168.1.100",
    "port": 80,
    "credentials": {
      "username": "nxgen",
      "password": "secure_password"
    },
    "serverUnitId": "UNV-CAM-001",
    "customerId": "customer_id_here",
    "siteId": "site_id_here"
  }'
```

---

## Troubleshooting

### Device Shows Offline

**Solutions:**
1. **Network Connectivity**
   - Verify device IP is correct and reachable
   - Check network cables and switch ports
   - Ensure proper VLAN configuration

2. **Authentication Issues**
   - Confirm nxgen user exists with correct permissions
   - Test login via web browser
   - Check password complexity requirements

### Video Stream Issues

**Solutions:**
1. **Stream Configuration**
   - Verify all three streams are properly configured
   - Check resolution and bitrate settings
   - Ensure H.264 codec is selected

2. **Network Bandwidth**
   - Reduce bitrate if bandwidth limited
   - Use appropriate stream for viewing context
   - Check network utilization

### Analytics Not Working

**Solutions:**
1. **Smart Event Settings**
   - Verify analytics are enabled and configured
   - Check sensitivity levels (50-70 range)
   - Redraw detection areas if needed

2. **Event Handler Configuration**
   - Ensure "Notify Surveillance Center" is enabled
   - Check GCXONE server IP and port settings
   - Verify event schedule is active

---

## Device Specifications

### Supported Product Lines
- **Bullet Cameras:** IPC21xx, IPC22xx series
- **Dome Cameras:** IPC32xx, IPC33xx series
- **PTZ Cameras:** IPC67xx series
- **NVRs:** NVR301, NVR302 series
- **Specialty:** Fisheye, Thermal cameras

### Feature Comparison

| Series | Resolution | Analytics | Audio | PTZ | Price Range |
|--------|------------|-----------|-------|-----|-------------|
| IPC21xx | 1080p-4K | Basic | Optional | No | $100-300 |
| IPC32xx | 1080p-4K | Smart IPC | Yes | No | $200-500 |
| IPC67xx | 1080p-4K | Advanced | Yes | Yes | $500-1500 |

---

## Support & Resources

### Uniview Resources
- [Support Portal](https://www.uniview.com/Support/)
- [Product Documentation](https://www.uniview.com/Products/)
- [Firmware Downloads](https://www.uniview.com/Support/Download/)
- [Technical Training](https://www.uniview.com/Support/Training/)

### NXGEN Resources
- [Video Tutorial: Uniview Setup](/tutorials/uniview-setup)
- [Smart Analytics Guide](/guides/uniview-analytics)
- [Community Discussion](/community/uniview)

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v5.1.0  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0