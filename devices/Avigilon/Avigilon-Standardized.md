---
title: "Avigilon Integration Guide"
description: "Complete guide to integrating Avigilon AI-powered cameras with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:intermediate
  - manufacturer:avigilon
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v7.14 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Avigilon Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Live Streaming (H.264/H.265)
- ✅ Playback & Timeline
- ✅ PTZ Control & Presets
- ✅ Two-Way Audio (Select models)
- ✅ AI-Powered Analytics
- ✅ Appearance Search
- ✅ Event Forwarding
- ✅ ONVIF Protocol Support

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v7.14 or later

---

## Prerequisites

### Hardware Requirements
- Avigilon camera with firmware v7.14+
- Network connectivity (Ethernet or WiFi)
- Power supply (PoE+, High PoE, or external adapter)

### Network Requirements
- Static IP address or DHCP reservation recommended
- Ports 80 (HTTP), 443 (HTTPS), 554 (RTSP) accessible
- Sufficient bandwidth for high-resolution streams

### Access Requirements
- Administrator credentials for Avigilon device
- GCXONE account with installer or admin role

---

## Step 1: Device Preparation

### 1.1 Initial Device Setup

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect device to network via Ethernet cable
    2. Power on device using PoE+ or High PoE
    3. Wait for initialization (typically 90-120 seconds)
    4. Find device IP using Avigilon Camera Configuration Tool
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Connect via Ethernet for initial setup
    2. Access device web interface
    3. Configure WiFi in Network settings
    4. Disconnect Ethernet after WiFi connection confirmed
  </TabItem>
</Tabs>

### 1.2 Access Device Web Interface

1. **Open web browser** and navigate to: `https://[device-ip]`
2. **Accept security certificate** (self-signed)
3. **Login** with default credentials:
   - **Username:** `admin`
   - **Password:** `admin` (change immediately)
4. **Initial Configuration:**
   - Set new admin password
   - Configure device name and location
   - Set time zone and NTP server

### 1.3 User Management

**Path:** Configuration → Users

1. **Create GCXONE user:**
   - **Username:** `nxgen`
   - **Password:** [secure password]
   - **Role:** Operator
2. **Required Permissions:**
   - ✅ Live view
   - ✅ Playback
   - ✅ PTZ control
   - ✅ Export
   - ✅ System information

---

## Step 2: Video & Analytics Configuration

### 2.1 Video Streams

**Path:** Configuration → Video

<Tabs>
  <TabItem value="stream1" label="Stream 1 (High Quality)">
    **Recommended Settings:**
    - **Resolution:** 1920×1080 or higher
    - **Frame Rate:** 30 fps
    - **Compression:** H.264 High Profile
    - **Bitrate:** 4-8 Mbps
    - **GOP:** 30 frames
  </TabItem>

  <TabItem value="stream2" label="Stream 2 (Standard)">
    **Recommended Settings:**
    - **Resolution:** 1280×720
    - **Frame Rate:** 15 fps
    - **Compression:** H.264 Main Profile
    - **Bitrate:** 1-2 Mbps
    - **GOP:** 15 frames
  </TabItem>
</Tabs>

### 2.2 AI Analytics Configuration

**Path:** Configuration → Analytics

#### Self-Learning Video Analytics
1. **Enable Analytics:** Check "Enable analytics"
2. **Learning Period:** 7-14 days recommended
3. **Sensitivity:** Medium (adjust after learning period)
4. **Scene Types:** Indoor/Outdoor selection
5. **Activity Levels:** Normal/High activity areas

#### Appearance Search
1. **Enable Appearance Search:** For person/vehicle tracking
2. **Database Size:** Configure based on storage capacity
3. **Retention Period:** Set based on requirements
4. **Search Accuracy:** High (requires more processing)

#### Classification
1. **Person Detection:** Enable for human classification
2. **Vehicle Detection:** Enable for vehicle classification
3. **Object Size Filtering:** Set minimum/maximum sizes
4. **Confidence Threshold:** 70-80% recommended

---

## Step 3: Event Configuration

### 3.1 Analytics Events

**Path:** Configuration → Events → Analytics Events

1. **Motion Events:**
   - Enable "Analytics motion"
   - Set sensitivity based on environment
   - Configure detection areas

2. **Classification Events:**
   - Enable "Person detected"
   - Enable "Vehicle detected"
   - Set confidence thresholds

3. **Tampering Events:**
   - Enable "Camera tampering"
   - Enable "Scene change detection"
   - Set sensitivity levels

### 3.2 Event Actions

**Path:** Configuration → Events → Actions

1. **HTTP Notification:**
   - **URL:** `http://[gcxone-server]/api/events`
   - **Method:** POST
   - **Content Type:** application/json
   - **Authentication:** Basic (if required)

2. **Recording Actions:**
   - Enable pre/post event recording
   - Set recording duration
   - Configure recording quality

---

## Step 4: Add Device to GCXONE

### 4.1 Device Discovery

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Avigilon"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [device-ip]
   Port: 80 (HTTP) or 443 (HTTPS)
   Username: nxgen
   Password: [nxgen user password]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `AVI-CAM-001`
   - **Time Zone:** [Auto-detected]
   - **Description:** Descriptive name

5. **Click "Discover"** and **Save**

### 4.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Device Status | 🟢 Online | [Check connectivity](#troubleshooting) |
| Video Streams | Multiple streams available | [Check stream config](#streaming-issues) |
| Analytics Events | AI events in Video Activity | [Verify analytics](#analytics-issues) |
| Appearance Search | Search functionality active | [Check database](#search-issues) |

---

## Troubleshooting

### Analytics Not Working

**Solutions:**
1. **Learning Period:** Allow 7-14 days for self-learning
2. **Scene Configuration:** Verify indoor/outdoor settings
3. **Sensitivity Adjustment:** Fine-tune after learning period
4. **Processing Power:** Ensure adequate camera resources

### Poor Search Results

**Solutions:**
1. **Database Size:** Increase appearance search database
2. **Image Quality:** Ensure good lighting and resolution
3. **Confidence Threshold:** Adjust search sensitivity
4. **Learning Time:** Allow more time for system learning

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v7.14  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0