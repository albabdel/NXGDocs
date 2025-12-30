---
title: "Dahua Dolynk Integration Guide"
description: "Complete guide to integrating Dahua Dolynk cloud cameras with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:dahua-dolynk
  - device-type:camera
supported: true
last_verified: "2025-12-28"
firmware_version: "v1.8 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dahua Dolynk Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Cloud-Based Management
- ✅ Live Streaming (H.264)
- ✅ Mobile App Control
- ✅ Easy WiFi Setup
- ✅ Motion Detection
- ✅ Cloud Storage
- ✅ Two-Way Audio (Select models)
- ✅ Night Vision

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v1.8 or later

---

## Prerequisites

### Hardware Requirements
- Dahua Dolynk camera with firmware v1.8+
- WiFi network connectivity
- Power supply (included adapter or PoE)
- Mobile device for initial setup

### Network Requirements
- 2.4GHz WiFi network (5GHz not supported)
- Internet connectivity for cloud services
- Sufficient upload bandwidth (1-2 Mbps per camera)

### Access Requirements
- Dolynk mobile app installed
- Dolynk cloud account
- GCXONE account with installer or admin role

---

## Step 1: Dolynk Camera Setup

### 1.1 Initial Installation

<Tabs>
  <TabItem value="mobile" label="Mobile App Setup">
    1. Download "Dolynk" app from App Store/Google Play
    2. Create Dolynk account or sign in
    3. Power on camera (LED will flash red)
    4. Follow app setup wizard
    5. Scan QR code on camera or enter device ID
  </TabItem>

  <TabItem value="wifi" label="WiFi Configuration">
    1. Select WiFi network in app
    2. Enter WiFi password
    3. Camera will connect (LED turns solid blue)
    4. Complete device naming and location setup
    5. Test live view in mobile app
  </TabItem>
</Tabs>

### 1.2 Camera Configuration

**Via Dolynk Mobile App:**

1. **Device Settings:**
   - Set camera name and location
   - Configure time zone
   - Set video quality preferences
   - Enable/disable status LED

2. **Detection Settings:**
   - Enable motion detection
   - Set detection sensitivity (1-100)
   - Configure detection zones
   - Set notification preferences

3. **Recording Settings:**
   - Cloud recording: Continuous or event-based
   - Local recording: MicroSD card (if supported)
   - Recording quality: HD/SD
   - Retention period: Based on cloud plan

### 1.3 Advanced Features

**Smart Detection:**
- Human detection (AI-powered)
- Package detection
- Pet detection (select models)
- Sound detection

**Privacy Features:**
- Privacy mode scheduling
- Geofencing (auto arm/disarm)
- Multiple user access
- Shared device management

---

## Step 2: Cloud Integration

### 2.1 Dolynk Cloud Services

**Cloud Features:**
- Live streaming from anywhere
- Cloud video storage
- Motion alerts and notifications
- Device sharing with family/team
- Remote configuration

**Subscription Plans:**
- **Basic:** Free plan with limited features
- **Standard:** 7-day cloud storage
- **Premium:** 30-day cloud storage + advanced AI

### 2.2 API Access Configuration

**Path:** Dolynk Web Portal → Developer Settings

1. **Enable API Access:**
   - Log into Dolynk web portal
   - Navigate to Developer/Integration settings
   - Generate API key for GCXONE integration
   - Set API permissions and access levels

2. **Webhook Configuration:**
   - Set webhook URL for GCXONE
   - Select event types to forward
   - Configure authentication method
   - Test webhook connectivity

---

## Step 3: GCXONE Integration

### 3.1 Add Dolynk Device

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Dahua Dolynk"
3. **Enter Connection Details:**
   ```
   Cloud API Endpoint: https://api.dolynk.com
   API Key: [generated-api-key]
   Device ID: [dolynk-device-id]
   Webhook URL: [gcxone-webhook-endpoint]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `DOLYNK-001`
   - **Time Zone:** [Auto-detected from cloud]
   - **Description:** Camera location/description

5. **Click "Discover"** to detect camera capabilities
6. **Review Settings** and click "Save"

### 3.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Cloud Status | 🟢 Online | [Check internet connection](#troubleshooting) |
| Live Stream | Video streaming | [Verify cloud subscription](#streaming-issues) |
| Motion Events | Events in GCXONE | [Check webhook config](#webhook-issues) |
| Mobile Access | App working | [Verify Dolynk account](#app-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Get Dolynk device status"
curl -X GET "https://api.dolynk.com/v1/devices/[device-id]" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Webhook Payload Example

```json title="Dolynk motion event webhook"
{
  "event_type": "motion_detected",
  "device_id": "DOLYNK-12345",
  "device_name": "Front Door Camera",
  "timestamp": "2025-12-28T10:30:00Z",
  "detection": {
    "type": "human",
    "confidence": 0.89,
    "zone": "entrance"
  },
  "media": {
    "thumbnail_url": "https://cloud.dolynk.com/thumbnails/12345.jpg",
    "video_url": "https://cloud.dolynk.com/clips/12345.mp4"
  }
}
```

### Stream Access

```bash title="Access live stream via cloud API"
# Get stream URL
curl -X GET "https://api.dolynk.com/v1/devices/[device-id]/stream" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Response includes temporary stream URL
{
  "stream_url": "https://stream.dolynk.com/live/[device-id]?token=temp_token",
  "expires_at": "2025-12-28T11:00:00Z"
}
```

---

## Troubleshooting

### Camera Won't Connect to WiFi

**Solutions:**
1. **Network Compatibility:** Ensure 2.4GHz WiFi (not 5GHz)
2. **Signal Strength:** Move camera closer to router during setup
3. **Password:** Verify WiFi password is correct
4. **Router Settings:** Check for MAC filtering or access restrictions

### Poor Video Quality

**Solutions:**
1. **Internet Speed:** Check upload bandwidth (minimum 1 Mbps)
2. **WiFi Signal:** Improve WiFi signal strength at camera location
3. **Quality Settings:** Adjust video quality in mobile app
4. **Network Congestion:** Reduce other network usage during viewing

### Motion Detection Issues

**Solutions:**
1. **Sensitivity:** Adjust detection sensitivity in app
2. **Detection Zones:** Redraw zones to focus on important areas
3. **Lighting:** Ensure adequate lighting for detection
4. **Positioning:** Optimize camera angle and height

### Cloud Service Problems

**Solutions:**
1. **Subscription Status:** Verify cloud subscription is active
2. **Account Issues:** Check Dolynk account status
3. **Server Status:** Check Dolynk service status
4. **API Limits:** Verify API usage within limits

---

## Device Specifications

### Dolynk Camera Models
- **Indoor Cameras:** Compact design, 1080p, night vision
- **Outdoor Cameras:** Weatherproof, enhanced night vision
- **PTZ Cameras:** Pan/tilt functionality, tracking
- **Doorbell Cameras:** Two-way audio, motion alerts

### Technical Specifications
- **Resolution:** 1080p (1920×1080)
- **Compression:** H.264
- **Network:** 2.4GHz WiFi (802.11 b/g/n)
- **Power:** 5V DC adapter or PoE (select models)
- **Storage:** Cloud storage + MicroSD (select models)

### Cloud Features
- **Live Streaming:** Real-time video access
- **Cloud Recording:** Automatic cloud backup
- **AI Detection:** Human, package, pet detection
- **Mobile Alerts:** Push notifications
- **Multi-User Access:** Family/team sharing

---

## Support & Resources

### Dolynk Resources
- [Dolynk Support](https://www.dolynk.com/support)
- [Mobile App Guides](https://www.dolynk.com/app-guide)
- [Cloud Service Status](https://status.dolynk.com)
- [Community Forum](https://community.dolynk.com)

### NXGEN Resources
- [Video Tutorial: Dolynk Setup](/tutorials/dolynk-setup)
- [Cloud Camera Guide](/guides/dolynk-cloud)
- [Community Discussion](/community/dolynk)

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v1.8  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0