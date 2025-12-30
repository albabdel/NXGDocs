---
title: "Camect Integration Guide"
description: "Complete guide to integrating Camect smart home security with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:camect
  - device-type:nvr
supported: true
last_verified: "2025-12-28"
firmware_version: "v2.8 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Camect Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ AI-Powered Smart Detection
- ✅ Multi-Camera Support
- ✅ Local Processing (No Cloud)
- ✅ Mobile App Control
- ✅ Person/Vehicle Recognition
- ✅ Event Forwarding
- ✅ Local Storage
- ✅ Easy Setup

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v2.8 or later

---

## Prerequisites

### Hardware Requirements
- Camect Hub with firmware v2.8+
- Compatible IP cameras (ONVIF or specific brands)
- Network connectivity (Ethernet required)
- Power supply (included adapter)

### Network Requirements
- Ethernet connection to router
- Internet connectivity for initial setup and updates
- Local network access to cameras
- Sufficient bandwidth for camera streams

### Access Requirements
- Camect mobile app installed
- Camect account (created during setup)
- GCXONE account with installer or admin role

---

## Step 1: Camect Hub Setup

### 1.1 Initial Installation

<Tabs>
  <TabItem value="setup" label="Physical Setup">
    1. Connect Camect Hub to router via Ethernet
    2. Connect power adapter to Hub
    3. Wait for LED to turn solid blue (2-3 minutes)
    4. Hub will automatically get IP address via DHCP
  </TabItem>

  <TabItem value="app" label="Mobile App Setup">
    1. Download Camect app from App Store or Google Play
    2. Create Camect account or sign in
    3. Follow app setup wizard to discover Hub
    4. Complete initial configuration
  </TabItem>
</Tabs>

### 1.2 Camera Discovery

**Automatic Discovery:**
1. **In Camect App:** Go to Cameras → Add Camera
2. **Auto-Discovery:** Camect scans network for cameras
3. **Select Cameras:** Choose cameras to add
4. **Enter Credentials:** Provide camera login details

**Manual Addition:**
1. **Camera IP:** Enter camera IP address manually
2. **Credentials:** Username and password
3. **Test Connection:** Verify camera access
4. **Add Camera:** Complete camera addition

**Supported Camera Brands:**
- ONVIF-compliant cameras
- Hikvision, Dahua, Axis, Uniview
- Reolink, Amcrest, Foscam
- Many other IP camera brands

### 1.3 Camera Configuration

**Per-Camera Settings:**
1. **Camera Name:** Descriptive name and location
2. **Detection Zones:** Draw areas for AI detection
3. **Sensitivity:** Adjust detection sensitivity
4. **Recording Settings:** Continuous or event-based
5. **Notifications:** Configure alert preferences

---

## Step 2: AI Detection Configuration

### 2.1 Smart Detection Setup

**Path:** Camect App → Settings → Detection

1. **Person Detection:**
   - Enable person recognition
   - Set confidence threshold (70-90%)
   - Configure detection zones per camera

2. **Vehicle Detection:**
   - Enable vehicle recognition
   - Set vehicle types (car, truck, motorcycle)
   - Configure detection areas

3. **Package Detection:**
   - Enable package/delivery detection
   - Set package size thresholds
   - Configure delivery zones

### 2.2 Advanced AI Features

**Familiar Face Recognition:**
1. **Enable Feature:** Turn on face recognition
2. **Add Faces:** Upload photos of family/staff
3. **Training Period:** Allow system to learn faces
4. **Notification Settings:** Alerts for unknown persons

**Zone-Based Detection:**
1. **Draw Zones:** Create detection areas per camera
2. **Zone Types:** Entry, perimeter, restricted areas
3. **Time Schedules:** Different zones for different times
4. **Sensitivity Levels:** Adjust per zone

### 2.3 Alert Configuration

**Notification Types:**
- **Push Notifications:** Real-time mobile alerts
- **Email Alerts:** Email with event details and images
- **Webhook Notifications:** HTTP POST to external systems
- **Local Alerts:** On-screen notifications

**Alert Filtering:**
- **Time-based:** Different alerts for day/night
- **Zone-based:** Specific alerts per detection zone
- **Confidence-based:** Only high-confidence detections
- **Frequency Limits:** Prevent alert flooding

---

## Step 3: GCXONE Integration

### 3.1 Enable API Access

**Path:** Camect App → Settings → Integrations

1. **Enable API:** Turn on API access
2. **Generate Token:** Create API token for GCXONE
3. **Set Permissions:** Configure API access levels
4. **Webhook URL:** Set GCXONE webhook endpoint

### 3.2 Add Camect to GCXONE

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Camect"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [camect-hub-ip]
   Port: 443 (HTTPS)
   API Token: [generated-token]
   Webhook URL: [gcxone-webhook]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `CAMECT-001`
   - **Time Zone:** [Auto-detected]
   - **Description:** Hub location/description

5. **Click "Discover"** to detect cameras
6. **Review Cameras:** Verify all cameras found
7. **Click "Save"**

### 3.3 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Hub Status | 🟢 Online | [Check network](#troubleshooting) |
| Camera Discovery | All cameras found | [Verify camera access](#camera-issues) |
| AI Events | Smart events in GCXONE | [Check webhook config](#webhook-issues) |
| Live Streams | Video streams working | [Check bandwidth](#streaming-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Get Camect system status"
curl -X GET "https://[camect-ip]/api/cameras" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

### Webhook Configuration

```json title="Camect webhook payload"
{
  "type": "alert",
  "camera_id": "camera_001",
  "camera_name": "Front Door",
  "detected_object": "person",
  "confidence": 0.92,
  "timestamp": "2025-12-28T10:30:00Z",
  "image_url": "https://camect-hub/api/alerts/12345/image",
  "zone": "entrance"
}
```

### Camera Stream URLs

```bash title="Access camera streams via Camect"
# Main stream
https://[camect-ip]/api/cameras/[camera-id]/stream

# Thumbnail
https://[camect-ip]/api/cameras/[camera-id]/thumbnail
```

---

## Troubleshooting

### Cameras Not Detected

**Solutions:**
1. **Network Connectivity:** Ensure cameras and Hub on same network
2. **Camera Credentials:** Verify username/password correct
3. **ONVIF Support:** Check camera supports ONVIF protocol
4. **Firewall Settings:** Ensure camera ports accessible

### AI Detection Issues

**Solutions:**
1. **Detection Zones:** Redraw zones to focus on important areas
2. **Sensitivity Adjustment:** Fine-tune detection sensitivity
3. **Lighting Conditions:** Ensure adequate lighting for AI
4. **Camera Positioning:** Optimize camera angles and height

### Poor Recognition Accuracy

**Solutions:**
1. **Training Period:** Allow more time for AI learning
2. **Image Quality:** Ensure cameras provide clear images
3. **Detection Distance:** Objects should be 10-50 feet from camera
4. **Environmental Factors:** Minimize shadows and reflections

### Webhook Not Working

**Solutions:**
1. **URL Configuration:** Verify webhook URL is correct
2. **Network Access:** Ensure Camect can reach GCXONE server
3. **API Token:** Verify token is valid and has permissions
4. **Firewall Rules:** Check firewall allows webhook traffic

---

## Device Specifications

### Camect Hub Models
- **Camect Hub:** Standard model, supports 10+ cameras
- **Processing Power:** Local AI processing, no cloud dependency
- **Storage:** Built-in storage for recordings
- **Connectivity:** Ethernet only (no WiFi)

### Camera Compatibility
- **ONVIF Cameras:** Full support for ONVIF Profile S/T
- **Specific Brands:** Optimized support for major brands
- **Resolution:** Up to 4K camera support
- **Frame Rate:** Up to 30 FPS per camera

### AI Capabilities
- **Object Detection:** Person, vehicle, package, animal
- **Face Recognition:** Familiar face identification
- **Behavior Analysis:** Loitering, line crossing
- **Smart Alerts:** Reduce false positives by 95%

---

## Support & Resources

### Camect Resources
- [Camect Support](https://camect.com/support/)
- [Setup Guides](https://camect.com/help/)
- [Camera Compatibility](https://camect.com/cameras/)
- [Community Forum](https://community.camect.com/)

### NXGEN Resources
- [Video Tutorial: Camect Setup](/tutorials/camect-setup)
- [Smart Home Security Guide](/guides/camect-smart-home)
- [Community Discussion](/community/camect)

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v2.8  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0