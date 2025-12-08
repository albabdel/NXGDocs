---
title: "Dahua"
sidebar_label: "Dahua"
sidebar_position: 6
description: "Configure Dahua to stream and send events to GC-X-ONE."
tags:
  - Dahua
  - Camera
  - NVR
  - IVS Analytics
  - GC-X-ONE
---

# Dahua

**Device Information:**
- **Device**: Dahua Camera/NVR Model
- **Vendor**: Dahua
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0  


# Summary

- Purpose: Configure Dahua to stream and send events to GC-X-ONE.
    
- Outcome: Live view and alarms show in GC-X-ONE (Video Activity).
    
- Audience: Field engineer / Support.
    

# Prerequisites

- Network: Reachable IP, correct VLAN and ports (80/443/554/HTTP API as used).
    
- Time sync: Match Dahua time zone with GC-X-ONE. Enable NTP.
    
- Access: Admin to Dahua UI and GC-X-ONE Config App.
    
- IP allowlist: Update if your site uses whitelisting.
    
- Test account: Create a dedicated user for GC-X-ONE.
    

# Device profile

- Type: Camera | NVR
    
- Discovery: ONVIF | Proprietary (Dahua)
    
- Events: Motion | IVS (Tripwire/Intrusion) | Video Loss | Tamper | I/O
    
- Ports: 80/443/554/rtsp
    
- Known quirks: Enable **Log → Report Alarm** so GC-X-ONE receives events.
    

**Core Functions**

- Cloud Mode: Supported
    
- Discovery: Supported
    
- Live: Supported
    
- Playback: Supported
    
- Timeline: Supported
    
- Events: Supported
    
- ARM / DISARM: Supported
    
- GCXONE Audio (SIP): Supported
    
- PTZ/Presets: Supported

        

# Steps

## Step 1 — Prepare Dahua (users, time, streams)

- UI path: **Home → Accounts**
    
- Do
    
    - Click **Add**. Create a user (e.g., `NXG`) with password.
        
    - Grant permissions: **Manual control, System, Camera, System info, Event**.
        
    - For **Search** and **Live**, select the cameras you will use in GC-X-ONE.
        
- Time/NTP
    
    - Set time zone. Enable NTP. Save.
        
- Expected result: Dedicated least-privilege user exists; time is correct.
    
![Dahua User Setup](./images/Dahua%20pic%201.gif)
    

## Step 2 — Configure alerts (AI/IVS) and enable reporting

- UI path: **AI → Parameters → IVS** (or **Alarm → Video Detection** for basic motion)
    
- Do (IVS recommended)
    
    - Select camera. Click **+** to add a rule.
        
    - Choose **Tripwire** or **Intrusion**.
        
    - Draw rule/region.
        
    - Set **Action**: Appear or Cross.
        
    - Set **Tracking duration**: 30s.
        
    - **Effective target**: Human, Motor Vehicle.
        
    - Set **Schedule**.
        
- Make events available to GC-X-ONE
    
    - Open **More → Log → Report Alarm**. Enable and save.
        
- Optional: If you must use Motion, tune **Sensitivity ~70** and **Threshold 5**; avoid noisy areas.
    
- Expected result: Dahua generates IVS alarms and reports them to GC-X-ONE.
    
![Dahua IVS Configuration](./images/Dahua%20pic%203.gif)

## Step 2b — Alarm configuration (Optional)

- Note: Avoid **Motion Detection** when possible; it can flood alerts on legacy GCXONE. Prefer IVS.
    
- UI path: **Alarm → Video Detection**
    
- Applies to: Motion Detection, Video Tampering, Video Loss, and similar.
    
- Do
    
    - Choose the camera.
        
    - Click **Setting** to the right of **Channel**.
        
    - Select the region(s) to monitor.
        
    - Click **OK** to save.
        
- Make alarms available to GC-X-ONE
    
    - Go to **More → Log → Report Alarm**. Enable. Click **OK**.
        
![Dahua Alarm Configuration](./images/Dahua%20pic%202.gif)
    

## Step 3 — Add device in GC-X-ONE

- UI path: **GC-X-ONE → Customer → Site → Devices → Add Device**
    
- Do
    
    - Select **Dahua**.
        
    - Fill: **Serial Number, Username, Password, Ports, Time Zone**.
        
    - For NVR: pick **Channel** for each sensor you add.
        
    - Click **Discover**. Review discovered sensors and I/O.
        
    - Click **Save**.
        
- Expected result: GC-X-ONE lists sensors under the Dahua device.
    

    

## Step 4 — Verify

- Checks
    
    - **Live** opens without stutter.
        
    - Recent IVS events appear in **Video Activity** with clips.
        
    - PTZ moves to presets if supported.
        
![Adding Device Step 1](./images/Adding%20device%201.png)

![Adding Device Step 2](./images/Adding%20device%202.png)

![Adding Device Step 3](./images/Adding%20device%203.png)
    

# Troubleshooting

- No events in Video Activity
    
    - Recheck **More → Log → Report Alarm** is enabled.
        
    - Confirm IVS rule is armed and scheduled now.
        
    - Check time sync/NTP.
        
- Discovery fails
    
    - Verify credentials, role permissions, ports, and reachability.
        
    - Try HTTP vs HTTPS based on site policy.
        
- Live view stutters
    
    - Lower substream bitrate/FPS; confirm dual-stream profile.
        
- Too many alerts
    
    - Tighten IVS zones. Avoid generic motion if possible.
        

# Notes

- Least-privilege: Use the Dahua user created in Step 1; do not reuse admin.
    
- For multi-channel NVRs, repeat Step 3 per channel you need in GC-X-ONE.
    

# Change log

- 2025-09-02 v1.0.0 Initial GC-X-ONE aligned doc.
    

# Summary video

<!-- Video: Dahua Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->
    
- External: ([DahuaWiki](https://dahuawiki.com/NVR/Basic_Setup/Initial_Setup))