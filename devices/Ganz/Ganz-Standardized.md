---
title: "Ganz Integration Guide"
description: "Complete guide to integrating Ganz security cameras with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:ganz
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v2.4 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ganz Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Live Streaming (H.264/MJPEG)
- ✅ Playback & Timeline
- ✅ PTZ Control (Select models)
- ✅ Audio Support
- ✅ Motion Detection
- ✅ Privacy Masking
- ✅ Event Forwarding
- ✅ ONVIF Protocol Support

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v2.4 or later

---

## Prerequisites

### Hardware Requirements
- Ganz IP camera with firmware v2.4+
- Network connectivity (Ethernet)
- Power supply (PoE or 12V DC)

### Network Requirements
- Static IP address recommended
- Ports 80 (HTTP), 554 (RTSP) accessible
- Sufficient bandwidth for video streams

### Access Requirements
- Administrator credentials for Ganz device
- GCXONE account with installer or admin role

---

## Step 1: Device Setup

### 1.1 Initial Configuration

<Tabs>
  <TabItem value="ethernet" label="Ethernet Setup">
    1. Connect camera to network via Ethernet
    2. Apply power (PoE or 12V DC)
    3. Wait for boot sequence (90 seconds)
    4. Locate IP using Ganz IP Utility or DHCP list
  </TabItem>

  <TabItem value="default" label="Default Access">
    1. Default IP: 192.168.1.168
    2. Default username: `admin`
    3. Default password: `admin`
    4. Change defaults immediately
  </TabItem>
</Tabs>

### 1.2 Web Interface

1. **Access:** `http://[camera-ip]`
2. **Login:** Enter credentials
3. **Initial Setup:**
   - Change admin password
   - Set camera name
   - Configure network settings
4. **Firmware Check:** System → Information

### 1.3 User Configuration

**Path:** System → User

1. **Add User:** `nxgen`
2. **Set Password:** Secure password
3. **User Level:** Operator
4. **Permissions:**
   - ✅ Live view
   - ✅ Playback
   - ✅ PTZ (if applicable)
   - ✅ Configuration view

---

## Step 2: Video & Network Setup

### 2.1 Video Encoding

**Path:** Video → Encode

<Tabs>
  <TabItem value="stream1" label="Stream 1 (High)">
    - **Resolution:** 1920×1080
    - **Frame Rate:** 30 fps
    - **Bitrate:** 4 Mbps
    - **Codec:** H.264
  </TabItem>

  <TabItem value="stream2" label="Stream 2 (Low)">
    - **Resolution:** 704×480
    - **Frame Rate:** 15 fps
    - **Bitrate:** 1 Mbps
    - **Codec:** H.264
  </TabItem>
</Tabs>

### 2.2 Network Configuration

**Path:** Network → TCP/IP

1. **IP Mode:** Static (recommended)
2. **IP Address:** Assign static IP
3. **Subnet Mask:** Network subnet
4. **Gateway:** Network gateway
5. **DNS:** Primary/secondary DNS servers

### 2.3 Time Settings

**Path:** System → Date/Time

1. **Time Zone:** Select local zone
2. **NTP Enable:** Check enable
3. **NTP Server:** `time1.nxgen.cloud`
4. **DST:** Configure if applicable

---

## Step 3: Detection & Events

### 3.1 Motion Detection

**Path:** Event → Motion Detection

1. **Enable Motion Detection**
2. **Sensitivity:** 50% (adjust as needed)
3. **Detection Area:** Draw motion zones
4. **Schedule:** Set active periods
5. **Actions:** Enable alarm output

### 3.2 Privacy Masking

**Path:** Video → Privacy Mask

1. **Enable Privacy Mask**
2. **Draw Mask Areas:** Cover sensitive areas
3. **Mask Color:** Select color
4. **Apply Settings**

### 3.3 Alarm Configuration

**Path:** Event → Alarm

1. **Alarm Input:** Configure if available
2. **Alarm Output:** Set output actions
3. **Email Notification:** Configure SMTP
4. **FTP Upload:** Set FTP server for images

---

## Step 4: GCXONE Integration

### 4.1 Add Device

1. **Navigate:** Customer → Site → Devices → Add Device
2. **Manufacturer:** Select "Ganz"
3. **Connection Details:**
   ```
   IP Address: [camera-ip]
   Port: 80
   Username: nxgen
   Password: [password]
   ```
4. **Device Settings:**
   - **Server Unit ID:** `GANZ-001`
   - **Description:** Camera location
5. **Save Configuration**

### 4.2 Verification Steps

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Device Status | 🟢 Online | Check network connection |
| Live Stream | Video displaying | Verify stream settings |
| Motion Events | Events received | Check motion config |
| PTZ Control | Movement working | Verify PTZ settings |

---

## Advanced Features

### ONVIF Configuration

**Path:** Network → ONVIF

1. **Enable ONVIF**
2. **Port:** 80 (default)
3. **Authentication:** Digest
4. **User Access:** Configure ONVIF users

### Stream URLs

```bash
# Main stream
rtsp://[ip]:554/stream1

# Sub stream  
rtsp://[ip]:554/stream2

# MJPEG stream
http://[ip]/cgi-bin/mjpeg?stream=1
```

---

## Troubleshooting

### Connection Issues
**Problem:** Cannot access camera web interface
**Solutions:**
- Verify IP address and network connectivity
- Check power supply and cable connections
- Reset camera to factory defaults if needed

### Video Quality Issues
**Problem:** Poor or choppy video
**Solutions:**
- Reduce bitrate and frame rate
- Check network bandwidth availability
- Verify camera lens is clean

### Motion Detection Problems
**Problem:** Too many false alarms
**Solutions:**
- Adjust motion sensitivity
- Redraw detection zones
- Check for environmental factors (wind, lighting)

### ONVIF Compatibility
**Problem:** ONVIF discovery fails
**Solutions:**
- Verify ONVIF is enabled
- Check port 80 accessibility
- Confirm authentication settings

---

## Device Specifications

### Ganz Camera Series
- **ZN Series:** Network IP cameras
- **ZC Series:** Analog cameras with IP encoders
- **ZP Series:** PTZ cameras
- **ZD Series:** Dome cameras

### Technical Specifications
- **Resolution:** Up to 1080p
- **Compression:** H.264, MJPEG
- **Network:** 10/100 Ethernet
- **Power:** PoE or 12V DC
- **Operating Temp:** -10°C to +50°C

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v2.4  
**Certification:** ✅ NXGEN Certified