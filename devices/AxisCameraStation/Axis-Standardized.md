---
title: "Axis Communications Integration Guide"
description: "Complete guide to integrating Axis IP cameras and video encoders with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:intermediate
  - manufacturer:axis
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v10.12 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Axis Communications Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Live Streaming (Multiple streams)
- ✅ Playback & Timeline
- ✅ PTZ Control & Presets
- ✅ Two-Way Audio (Most models)
- ✅ Motion Detection
- ✅ AXIS Analytics (Advanced AI)
- ✅ Event Forwarding
- ✅ ONVIF & VAPIX Protocol Support

**Certification Level:** ✅ NXGEN Certified Premium
**Support Level:** Full Support
**Recommended Firmware:** v10.12 or later

---

## Prerequisites

### Hardware Requirements
- Axis IP camera or video encoder with firmware v10.12+
- Network connectivity (Ethernet or WiFi)
- Power supply (PoE+, High PoE, or external adapter)

### Network Requirements
- Static IP address or DHCP reservation recommended
- Ports 80 (HTTP), 443 (HTTPS), 554 (RTSP) accessible
- Internet connectivity for firmware updates and NTP sync

### Access Requirements
- Administrator credentials for Axis device
- GCXONE account with installer or admin role

---

## Step 1: Device Preparation

### 1.1 Initial Device Setup

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect device to network via Ethernet cable
    2. Power on device using PoE+ or High PoE
    3. Wait for initialization (typically 90-120 seconds)
    4. Find device IP address using:
       - AXIS IP Utility (recommended)
       - AXIS Device Manager
       - Router DHCP client list
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Power on device
    2. Use AXIS IP Utility to configure WiFi
    3. Connect to device's temporary IP
    4. Configure WiFi credentials in Network settings
    5. Note assigned IP address after connection
  </TabItem>
</Tabs>

### 1.2 Access Device Web Interface

1. **Open web browser** and navigate to: `https://[device-ip]`

2. **Initial Setup** (first-time access):
   - Accept security certificate
   - Create root password (strong password required)
   - Set device name and location
   - Configure basic network settings

3. **Login** with credentials:
   - **Username:** `root`
   - **Password:** [your secure password]

4. **Verify firmware version**:
   - Go to **System → Maintenance → Firmware Management**
   - **Minimum required:** v10.12
   - **Recommended:** Latest LTS version
   - [Update firmware if needed →](/guides/firmware-update-axis)

### 1.3 User Management

**Path:** System → Security → Users

1. **Click "Add user"**
2. **Enter user details:**
   - **User name:** `nxgen`
   - **Password:** [secure password - store safely]
   - **Confirm password:** [repeat password]
   - **User group:** Operator

3. **Required Privileges for nxgen user:**
   - ✅ Live view
   - ✅ Playback
   - ✅ PTZ control
   - ✅ Audio
   - ✅ System information
   - ✅ Parameters (read-only)

4. **Click "Save"** to create user

### 1.4 Time & Network Configuration

**Path:** System → Date and time

1. **Time zone:** Select your local time zone
2. **NTP servers:** Enable and use `time1.nxgen.cloud`
3. **Date format:** ISO 8601 (recommended)
4. **Click "Save"**

---

## Step 2: Video & Audio Configuration

### 2.1 Video Streams

**Path:** Video → Stream profiles

Configure multiple streams for different use cases:

<Tabs>
  <TabItem value="high" label="High Quality (Recording)">
    **Recommended Settings:**
    - **Resolution:** 1920×1080 or higher
    - **Frame rate:** 25-30 fps
    - **Compression:** H.264 High Profile or H.265
    - **Bitrate control:** VBR
    - **Max bitrate:** 4-8 Mbps
    - **GOP length:** 50-75

    **Use for:** Recording, forensic analysis
  </TabItem>

  <TabItem value="medium" label="Medium Quality (Live View)">
    **Recommended Settings:**
    - **Resolution:** 1280×720
    - **Frame rate:** 15-25 fps
    - **Compression:** H.264 Main Profile
    - **Bitrate control:** VBR
    - **Max bitrate:** 2-4 Mbps
    - **GOP length:** 25-50

    **Use for:** Live monitoring, operator viewing
  </TabItem>

  <TabItem value="low" label="Low Bandwidth (Mobile)">
    **Recommended Settings:**
    - **Resolution:** 640×360
    - **Frame rate:** 10-15 fps
    - **Compression:** H.264 Baseline
    - **Bitrate control:** VBR
    - **Max bitrate:** 512-1024 Kbps
    - **GOP length:** 15-25

    **Use for:** Mobile viewing, low bandwidth scenarios
  </TabItem>
</Tabs>

### 2.2 Audio Configuration (if supported)

**Path:** Audio → Audio settings

1. **Audio source:** Built-in microphone or Line in
2. **Audio format:** AAC-LC (recommended) or G.711
3. **Sample rate:** 16 kHz or 48 kHz
4. **Bitrate:** 64 kbps (AAC) or 64 kbps (G.711)
5. **Click "Save"**

---

## Step 3: Analytics & Event Configuration

### 3.1 AXIS Analytics (AI-based)

**Path:** Analytics → Applications

#### Motion Detection 2.0
1. **Install application** if not already installed
2. **Configure detection areas:**
   - Draw include zones (areas to monitor)
   - Draw exclude zones (areas to ignore)
3. **Sensitivity:** Medium (adjust based on environment)
4. **Object size filter:** Small to Large
5. **Time filter:** 0.5-2 seconds

#### Object Analytics
1. **Enable Human detection**
2. **Enable Vehicle detection** 
3. **Configure detection zones**
4. **Set confidence threshold:** 50-70%
5. **Object size limits:** Adjust for scene

#### Loitering Guard
1. **Draw detection area**
2. **Time threshold:** 10-60 seconds
3. **Object types:** Human, Vehicle, or Both
4. **Sensitivity:** Medium

### 3.2 Event Rules

**Path:** System → Events → Action rules

Create rules to forward events to GCXONE:

1. **Click "Add rule"**
2. **Rule name:** "GCXONE Event Forwarding"
3. **Condition:** Select analytics event (Motion, Human, Vehicle)
4. **Action:** HTTP notification
5. **HTTP settings:**
   - **URL:** `http://[gcxone-server]/api/events`
   - **Method:** POST
   - **Content type:** application/json
6. **Click "Save"**

---

## Step 4: Add Device to GCXONE

### 4.1 Device Discovery

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Axis Communications"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [device-ip]
   Port: 80 (HTTP) or 443 (HTTPS)
   Username: nxgen
   Password: [nxgen user password]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** Unique identifier (e.g., `AXIS-CAM-001`)
   - **Time Zone:** [Auto-detected or manual selection]
   - **Description:** Descriptive name for the device

5. **Click "Discover"** to detect streams and capabilities
6. **Review discovered features** and analytics
7. **Click "Save"** to add device to GCXONE

### 4.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Device Status | 🟢 Online | [Check network connectivity](#troubleshooting) |
| Video Streams | Multiple streams available | [Check stream configuration](#streaming-issues) |
| Live View | High-quality video | [Verify stream profiles](#stream-issues) |
| Analytics Events | AI events in Video Activity | [Check event rules](#event-issues) |
| PTZ Control | Smooth operation (if applicable) | [Verify PTZ settings](#ptz-issues) |
| Audio | Two-way audio working | [Check audio configuration](#audio-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Add Axis device via API"
curl -X POST https://api.nxgen.cloud/v1/devices \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "manufacturer": "Axis Communications",
    "model": "AXIS P3245-LVE",
    "ipAddress": "192.168.1.100",
    "port": 443,
    "credentials": {
      "username": "nxgen",
      "password": "secure_password"
    },
    "serverUnitId": "AXIS-CAM-001",
    "customerId": "customer_id_here",
    "siteId": "site_id_here"
  }'
```

### VAPIX API Usage

```bash title="Get device information via VAPIX"
curl -u nxgen:password \
  "http://[device-ip]/axis-cgi/param.cgi?action=list&group=Properties"
```

---

## Troubleshooting

### Device Shows Offline

**Solutions:**
1. **HTTPS Certificate Issues**
   - Accept self-signed certificate in browser
   - Configure proper SSL certificate
   - Use HTTP instead of HTTPS if needed

2. **Authentication Problems**
   - Verify nxgen user exists and has correct privileges
   - Check password complexity requirements
   - Test login via web interface

### Poor Video Quality

**Solutions:**
1. **Optimize Stream Profiles**
   - Use H.265 for better compression
   - Adjust bitrate based on available bandwidth
   - Configure appropriate GOP length

2. **Network Optimization**
   - Enable QoS for video traffic
   - Use dedicated VLAN for cameras
   - Check for network congestion

### Analytics Not Working

**Solutions:**
1. **Application Installation**
   - Verify analytics applications are installed
   - Check application licenses
   - Update to latest application versions

2. **Configuration Issues**
   - Review detection zones and sensitivity
   - Check object size filters
   - Verify event rules are active

---

## Device Specifications

### Supported Product Lines
- **Fixed Cameras:** P-series (P1245, P3245, P5654, etc.)
- **PTZ Cameras:** Q-series (Q6045, Q6155, etc.)
- **Thermal Cameras:** Q19 series
- **Video Encoders:** M-series
- **Specialty:** Explosion-protected, Covert cameras

### Feature Matrix

| Series | Resolution | Analytics | Audio | PTZ | Price Range |
|--------|------------|-----------|-------|-----|-------------|
| P12xx | 1080p | Basic | Optional | No | $300-600 |
| P32xx | 4K | Advanced AI | Yes | No | $600-1200 |
| P56xx | 4K+ | Premium AI | Yes | No | $1200-2500 |
| Q60xx | 4K | Advanced AI | Yes | Yes | $2500-5000 |

---

## Firmware & Updates

### Current Firmware Status
- **Latest LTS:** v10.12.x (Released: 2025-09-15)
- **Latest Active:** v11.x.x (Released: 2025-11-01)
- **Minimum Required:** v10.12
- **Status:** ✅ Fully Compatible with GCXONE

### Update Process
1. **Download Firmware:** From Axis support portal
2. **Backup Settings:** Export configuration
3. **Upload Firmware:** System → Maintenance → Firmware Management
4. **Automatic Reboot:** Device restarts automatically
5. **Verify Operation:** Test all functions after update

---

## Support & Resources

### Axis Resources
- [Axis Support Portal](https://www.axis.com/support)
- [VAPIX Documentation](https://www.axis.com/vapix-library)
- [Analytics Applications](https://www.axis.com/products/analytics)
- [Training & Certification](https://www.axis.com/learning)

### NXGEN Resources
- [Video Tutorial: Axis Setup](/tutorials/axis-setup)
- [Advanced Analytics Guide](/guides/axis-analytics)
- [Community Discussion](/community/axis)

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v10.12.x  
**Certification:** ✅ NXGEN Certified Premium  
**Document Version:** 2.0.0