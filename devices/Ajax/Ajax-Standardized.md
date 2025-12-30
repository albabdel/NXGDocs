---
title: "Ajax Systems Integration Guide"
description: "Complete guide to integrating Ajax wireless security systems with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:beginner
  - manufacturer:ajax
  - device-type:alarm-panel
supported: true
last_verified: "2025-12-28"
firmware_version: "v2.15 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ajax Systems Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Wireless Security System
- ✅ Hub-based Architecture
- ✅ Mobile App Control
- ✅ Multiple Detector Types
- ✅ Event Forwarding
- ✅ Battery Backup
- ✅ Tamper Detection
- ✅ Two-way Communication

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v2.15 or later

---

## Prerequisites

### Hardware Requirements
- Ajax Hub (Hub, Hub Plus, or Hub 2) with firmware v2.15+
- Ajax detectors and devices
- Internet connectivity (Ethernet and/or cellular)
- Power supply (included adapter)

### Network Requirements
- Internet connection for cloud communication
- Ethernet connection recommended (WiFi backup available)
- Cellular backup (SIM card) optional but recommended
- Ports 80, 443 accessible for cloud communication

### Access Requirements
- Ajax mobile app installed
- Ajax account with admin privileges
- GCXONE account with installer or admin role

---

## Step 1: Ajax Hub Setup

### 1.1 Initial Hub Installation

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect Hub to router via Ethernet cable
    2. Connect power adapter to Hub
    3. Wait for initialization (LED indicators will show status)
    4. Hub will automatically connect to Ajax cloud
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Connect power adapter to Hub
    2. Use Ajax app to configure WiFi connection
    3. Select your WiFi network and enter credentials
    4. Hub will connect to Ajax cloud via WiFi
  </TabItem>
</Tabs>

### 1.2 Ajax Mobile App Configuration

1. **Download Ajax App** from App Store or Google Play
2. **Create Account** or login to existing Ajax account
3. **Add Hub:**
   - Scan QR code on Hub or enter Hub ID manually
   - Follow app setup wizard
   - Set Hub name and location
4. **Configure Settings:**
   - Set time zone and location
   - Configure notification preferences
   - Set up user accounts and permissions

### 1.3 Add Ajax Devices

**Supported Device Types:**
- **Motion Detectors:** MotionProtect, MotionProtect Plus
- **Door/Window Sensors:** DoorProtect, DoorProtect Plus
- **Glass Break Detectors:** GlassProtect
- **Smoke Detectors:** FireProtect, FireProtect Plus
- **Flood Detectors:** LeaksProtect
- **Outdoor Detectors:** MotionProtect Outdoor
- **Cameras:** MotionCam (with built-in camera)
- **Keypads:** KeyPad, KeyPad Plus
- **Sirens:** HomeSiren, StreetSiren

**Adding Devices:**
1. **In Ajax App:** Go to Devices → Add Device
2. **Scan QR Code** on device or enter device ID
3. **Configure Device:**
   - Set device name and room
   - Adjust sensitivity settings
   - Configure detection zones (if applicable)
4. **Test Device:** Perform walk test to verify operation

---

## Step 2: Security Configuration

### 2.1 Security Modes

Configure different security modes:

**Away Mode:**
- All detectors armed
- Immediate alarm on any detection
- Entry/exit delays configured

**Home Mode:**
- Perimeter protection only
- Interior detectors bypassed
- Reduced sensitivity options

**Night Mode:**
- Partial arming
- Bedroom detectors bypassed
- Perimeter and common areas armed

### 2.2 Automation Rules

**Path:** Ajax App → Automation

Create automation scenarios:
1. **Scenario Name:** Descriptive name
2. **Trigger Conditions:** Device states, time, mode changes
3. **Actions:** Device control, notifications, mode changes
4. **Schedule:** When scenario is active

Example scenarios:
- Turn on lights when motion detected in night mode
- Send photo when door opens in away mode
- Activate siren when smoke detected

### 2.3 Notification Settings

Configure how and when to receive notifications:
- **Push Notifications:** Real-time alerts to mobile app
- **SMS Notifications:** Text message alerts
- **Email Notifications:** Email alerts with details
- **Phone Calls:** Voice call notifications for critical events

---

## Step 3: GCXONE Integration

### 3.1 Enable Third-Party Integration

**Path:** Ajax App → Settings → Integration

1. **Enable API Access:**
   - Go to Settings → Integration
   - Enable "Third-party integration"
   - Generate API token for GCXONE

2. **Configure Webhook:**
   - Set webhook URL to GCXONE server
   - Select events to forward
   - Test webhook connection

### 3.2 Add Ajax Hub to GCXONE

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Ajax Systems"
3. **Enter Connection Details:**
   ```
   Hub ID: [Ajax Hub ID]
   API Token: [Generated API token]
   Webhook URL: [GCXONE webhook endpoint]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** Unique identifier (e.g., `AJAX-HUB-001`)
   - **Time Zone:** [Auto-detected or manual selection]
   - **Description:** Descriptive name for the system

5. **Click "Discover"** to detect all Ajax devices
6. **Review discovered devices** and sensors
7. **Click "Save"** to add system to GCXONE

### 3.3 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Hub Status | 🟢 Online | [Check internet connectivity](#troubleshooting) |
| Device Discovery | All devices found | [Check device registration](#device-issues) |
| Event Reception | Test events in GCXONE | [Verify webhook configuration](#webhook-issues) |
| Battery Status | All devices reporting | [Check device communication](#battery-issues) |
| Signal Strength | Good signal levels | [Optimize device placement](#signal-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Get Ajax system status via API"
curl -X GET "https://api.ajax.systems/api/v1/hubs/[HUB_ID]/status" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

### Webhook Configuration

```json title="Ajax webhook payload example"
{
  "event_type": "alarm",
  "hub_id": "12345678",
  "device_id": "87654321",
  "device_type": "motion_detector",
  "device_name": "Living Room Motion",
  "timestamp": "2025-12-28T10:30:00Z",
  "event_data": {
    "alarm_type": "intrusion",
    "zone": "living_room",
    "battery_level": 85
  }
}
```

---

## Troubleshooting

### Hub Shows Offline

**Symptoms:** Hub status shows offline in Ajax app or GCXONE

**Solutions:**
1. **Internet Connectivity**
   - Check Ethernet cable connection
   - Verify router/modem is working
   - Test internet connection on other devices

2. **Power Issues**
   - Verify power adapter is connected
   - Check LED indicators on Hub
   - Try different power outlet

3. **Network Configuration**
   - Check firewall settings
   - Verify ports 80/443 are open
   - Test with cellular backup if available

### Devices Not Responding

**Symptoms:** Ajax devices show offline or not responding

**Solutions:**
1. **Signal Strength**
   - Check device signal strength in Ajax app
   - Move Hub closer to devices if needed
   - Remove obstacles between Hub and devices

2. **Battery Issues**
   - Check battery levels in Ajax app
   - Replace batteries if low
   - Verify battery contacts are clean

3. **Device Registration**
   - Re-register device if communication lost
   - Check device is within Hub range
   - Verify device is not damaged

### Events Not Appearing in GCXONE

**Symptoms:** Ajax events detected but not showing in GCXONE

**Solutions:**
1. **Webhook Configuration**
   - Verify webhook URL is correct
   - Check API token is valid
   - Test webhook manually

2. **Event Filtering**
   - Check which events are enabled for forwarding
   - Verify event types are supported
   - Review GCXONE event processing

---

## Device Specifications

### Ajax Hub Models
- **Hub:** Basic model, Ethernet connectivity
- **Hub Plus:** Enhanced model, Ethernet + WiFi + cellular
- **Hub 2:** Latest model, improved range and capacity

### Supported Detectors
- **Motion Detectors:** PIR, dual-tech, outdoor models
- **Opening Detectors:** Magnetic contacts, vibration sensors
- **Environmental:** Smoke, flood, glass break detectors
- **Cameras:** MotionCam with built-in PIR and camera

### Communication Range
- **Indoor Range:** Up to 2000m (open space)
- **Typical Range:** 200-400m in buildings
- **Frequency:** 868.0-868.6 MHz (EU), 915-921 MHz (US)
- **Encryption:** AES-128 block cipher

---

## Support & Resources

### Ajax Resources
- [Ajax Systems Support](https://ajax.systems/support/)
- [Mobile App Guides](https://ajax.systems/manuals/)
- [Installation Videos](https://ajax.systems/videos/)
- [Technical Documentation](https://ajax.systems/technical-documentation/)

### NXGEN Resources
- [Video Tutorial: Ajax Setup](/tutorials/ajax-setup)
- [Wireless Security Guide](/guides/ajax-wireless)
- [Community Discussion](/community/ajax)

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v2.15  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0