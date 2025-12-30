---
title: "Reconeyez Integration Guide"
description: "Complete guide to integrating Reconeyez perimeter security with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:intermediate
  - manufacturer:reconeyez
  - device-type:sensor
supported: true
last_verified: "2025-12-28"
firmware_version: "v4.1 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Reconeyez Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Thermal Perimeter Detection
- ✅ Video Verification
- ✅ Solar Powered Options
- ✅ Wireless Communication
- ✅ Weather Resistant
- ✅ Event Forwarding
- ✅ Remote Monitoring
- ✅ Battery Backup

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v4.1 or later

---

## Prerequisites

### Hardware Requirements
- Reconeyez detector unit with firmware v4.1+
- Solar panel (for solar models) or external power
- Cellular or WiFi connectivity
- Mounting hardware and tools

### Network Requirements
- Cellular data connection or WiFi network
- Internet connectivity for cloud communication
- GCXONE server accessible from internet

### Access Requirements
- Reconeyez cloud account
- GCXONE account with installer or admin role
- Mobile device for configuration

---

## Step 1: Reconeyez Installation

### 1.1 Physical Installation

<Tabs>
  <TabItem value="solar" label="Solar Powered">
    1. Mount detector unit on fence or post
    2. Install solar panel with clear sky view
    3. Connect solar panel to detector unit
    4. Ensure proper grounding and weatherproofing
  </TabItem>

  <TabItem value="wired" label="Wired Power">
    1. Mount detector unit on fence or post
    2. Run power cable to 12V DC power source
    3. Connect power and ensure proper polarity
    4. Install backup battery if required
  </TabItem>
</Tabs>

### 1.2 Initial Configuration

1. **Power On:** Unit will initialize (2-3 minutes)
2. **LED Status:** Check status indicators
   - Solid green: Normal operation
   - Flashing red: Configuration needed
   - Solid red: Error condition
3. **Cellular/WiFi:** Unit connects automatically
4. **Cloud Registration:** Device registers with Reconeyez cloud

### 1.3 Mobile App Setup

1. **Download App:** Reconeyez mobile app
2. **Create Account:** Register with Reconeyez
3. **Add Device:** Scan QR code or enter device ID
4. **Initial Setup:**
   - Set device name and location
   - Configure detection zones
   - Set sensitivity levels
   - Configure alert preferences

---

## Step 2: Detection Configuration

### 2.1 Thermal Detection Setup

**Path:** Reconeyez App → Device Settings → Detection

1. **Detection Zones:**
   - Draw detection areas on camera view
   - Set zone priorities (high/medium/low)
   - Configure zone-specific sensitivity

2. **Thermal Settings:**
   - **Sensitivity:** 1-10 (start with 5)
   - **Size Filter:** Minimum/maximum object size
   - **Speed Filter:** Minimum movement speed
   - **Temperature Threshold:** Heat signature levels

3. **Environmental Compensation:**
   - **Weather Compensation:** Auto-adjust for conditions
   - **Vegetation Filter:** Ignore plant movement
   - **Animal Filter:** Reduce animal false alarms

### 2.2 Video Verification

**Camera Settings:**
1. **Video Quality:** HD/SD based on bandwidth
2. **Recording Duration:** Pre/post event recording
3. **Night Vision:** IR illumination settings
4. **Image Enhancement:** Contrast and brightness

**Verification Rules:**
1. **Auto-Verification:** AI confirms human detection
2. **Manual Verification:** Operator review required
3. **Confidence Threshold:** AI confidence levels
4. **Escalation Rules:** When to escalate alerts

### 2.3 Alert Configuration

**Notification Types:**
- **Instant Alerts:** Real-time push notifications
- **Email Alerts:** Email with video clips
- **SMS Alerts:** Text message notifications
- **Voice Calls:** Automated voice alerts

**Alert Scheduling:**
- **24/7 Monitoring:** Continuous detection
- **Scheduled Monitoring:** Specific time periods
- **Holiday Schedules:** Special event calendars
- **Maintenance Windows:** Disable during maintenance

---

## Step 3: GCXONE Integration

### 3.1 Cloud API Configuration

**Path:** Reconeyez Portal → Integrations

1. **Enable API Access:**
   - Generate API key for GCXONE
   - Set API permissions and access levels
   - Configure webhook endpoints

2. **Event Forwarding:**
   - **Webhook URL:** GCXONE server endpoint
   - **Event Types:** Select events to forward
   - **Message Format:** JSON or XML
   - **Authentication:** API key or token

### 3.2 Add Reconeyez to GCXONE

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Reconeyez"
3. **Enter Connection Details:**
   ```
   API Endpoint: https://api.reconeyez.com
   API Key: [generated-api-key]
   Device ID: [reconeyez-device-id]
   Webhook URL: [gcxone-webhook]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `RECON-001`
   - **Time Zone:** [Auto-detected]
   - **Description:** Device location

5. **Click "Discover"** and **Save**

### 3.3 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Device Status | 🟢 Online | [Check connectivity](#troubleshooting) |
| Detection Zones | Zones configured | [Verify zone setup](#zone-issues) |
| Video Stream | Live video available | [Check camera](#video-issues) |
| Alert Reception | Test alerts received | [Verify webhook](#webhook-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Get Reconeyez device status"
curl -X GET "https://api.reconeyez.com/devices/[device-id]" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Webhook Payload

```json title="Reconeyez alert webhook"
{
  "event_type": "intrusion_detected",
  "device_id": "RECON-12345",
  "device_name": "North Perimeter",
  "timestamp": "2025-12-28T10:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "detection": {
    "confidence": 0.95,
    "object_type": "human",
    "zone": "zone_1"
  },
  "media": {
    "video_url": "https://media.reconeyez.com/alerts/12345.mp4",
    "thumbnail_url": "https://media.reconeyez.com/alerts/12345.jpg"
  }
}
```

---

## Troubleshooting

### High False Alarm Rate

**Solutions:**
1. **Sensitivity Adjustment:** Reduce detection sensitivity
2. **Zone Refinement:** Redraw detection zones
3. **Environmental Filters:** Enable vegetation/animal filters
4. **Size Filtering:** Adjust minimum object size

### Poor Video Quality

**Solutions:**
1. **Camera Cleaning:** Clean camera lens regularly
2. **Lighting Conditions:** Add IR illumination if needed
3. **Network Bandwidth:** Check cellular/WiFi signal strength
4. **Compression Settings:** Adjust video quality settings

### Communication Issues

**Solutions:**
1. **Signal Strength:** Check cellular/WiFi signal
2. **Antenna Position:** Adjust antenna orientation
3. **Network Configuration:** Verify APN settings (cellular)
4. **Firewall Rules:** Ensure cloud access allowed

---

## Device Specifications

### Reconeyez Models
- **Standard:** Basic thermal detection with camera
- **Solar:** Solar-powered with battery backup
- **Long Range:** Extended detection range (up to 500m)
- **Wireless:** Cellular or WiFi connectivity options

### Detection Capabilities
- **Detection Range:** 50-500 meters (model dependent)
- **Field of View:** 60-120 degrees
- **Temperature Range:** -40°C to +85°C operating
- **Weather Rating:** IP67 weatherproof

### Power Options
- **Solar:** 20W solar panel with battery backup
- **Wired:** 12V DC external power supply
- **Battery Life:** 30+ days backup (solar models)
- **Low Power Mode:** Extended battery operation

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v4.1  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0