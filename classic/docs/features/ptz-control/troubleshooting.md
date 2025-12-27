---
title: "PTZ Control Troubleshooting"
description: "Common issues and solutions for PTZ control in GCXONE"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:beginner
  - platform:GCXONE
  - feature:ptz-control
sidebar_position: 3
last_updated: 2025-12-21
---

# PTZ Control Troubleshooting

## Overview

This guide provides solutions for common PTZ (Pan-Tilt-Zoom) control issues in GCXONE. Follow troubleshooting steps in order for best results.

---

## Common Issues

### PTZ Controls Not Available

**Symptoms:**
- PTZ control panel not visible
- PTZ buttons disabled or grayed out
- "PTZ not supported" message

**Possible Causes and Solutions:**

#### 1. Camera Doesn't Support PTZ
- **Check**: Camera model specifications
- **Solution**:
  - Verify camera has PTZ hardware capabilities
  - Check camera documentation for PTZ support
  - PTZ controls only available on motorized cameras

#### 2. PTZ Not Enabled on Device
- **Check**: PTZ settings in device web interface
- **Solution**:
  - Access device web interface
  - Navigate to PTZ settings
  - Enable PTZ functionality
  - Save settings and restart camera if needed

#### 3. PTZ Not Enabled in GCXONE
- **Check**: PTZ settings in GCXONE camera configuration
- **Solution**:
  - Navigate to camera configuration in GCXONE
  - Go to PTZ Settings tab
  - Enable "PTZ Control" option
  - Save configuration

#### 4. Insufficient User Permissions
- **Check**: User role permissions
- **Solution**:
  - Verify user has "PTZ Control" permission
  - Check role settings in user management
  - Request admin to grant PTZ permissions

---

### PTZ Commands Not Working

**Symptoms:**
- PTZ buttons don't respond
- Camera doesn't move when PTZ controls used
- No response to PTZ commands

**Possible Causes and Solutions:**

#### 1. Communication Protocol Issue
- **Check**: PTZ protocol configuration
- **Solution**:
  - Verify PTZ protocol in GCXONE matches device
  - Try different protocol (ONVIF vs manufacturer-specific)
  - Check device PTZ protocol settings
  - Test PTZ from device web interface

#### 2. Network Connectivity Issues
- **Check**: Network connection to camera
- **Solution**:
  - Verify camera is online in GCXONE
  - Ping camera IP address
  - Test video streaming (if video works, network is OK)
  - Check for network latency or packet loss

#### 3. Camera PTZ Mechanism Faulty
- **Check**: PTZ hardware functionality
- **Solution**:
  - Test PTZ directly from device web interface
  - Check for mechanical issues (stuck, frozen movement)
  - Listen for motor sounds when attempting movement
  - Contact device manufacturer if hardware issue

#### 4. PTZ Control Locked by Another User
- **Check**: Multiple users accessing same camera
- **Solution**:
  - Check if another user is controlling PTZ
  - Wait for control timeout
  - Configure PTZ control timeout in GCXONE settings
  - Coordinate PTZ access between users

---

### Presets Not Working

**Symptoms:**
- Cannot save presets
- Presets don't recall to correct positions
- Presets disappear or reset

**Possible Causes and Solutions:**

#### 1. Preset Limit Reached
- **Check**: Number of presets vs device limit
- **Solution**:
  - Check device preset limit (typically 255)
  - Delete unused presets
  - Verify preset count in device settings
  - Organize presets to stay within limit

#### 2. Preset Not Saved Correctly
- **Check**: Preset save process
- **Solution**:
  - Ensure camera is stationary when saving preset
  - Wait for camera to reach position before saving
  - Verify preset name and number entered correctly
  - Test preset immediately after saving

#### 3. Camera Position Changed
- **Check**: Physical camera position
- **Solution**:
  - Verify camera hasn't been physically moved
  - Re-calibrate presets if camera repositioned
  - Update presets after camera maintenance
  - Check camera mounting stability

#### 4. Preset Storage Issue
- **Check**: Device storage/memory
- **Solution**:
  - Check device storage space
  - Clear device cache if available
  - Restart camera to refresh memory
  - Export and re-import presets if supported

---

### Slow or Sluggish PTZ Response

**Symptoms:**
- Delay between command and camera movement
- Slow camera response to PTZ controls
- Laggy PTZ operation

**Possible Causes and Solutions:**

#### 1. Network Latency
- **Check**: Network delay to camera
- **Solution**:
  - Test network latency: `ping <camera-ip>`
  - Use Local Mode for on-site workstations
  - Check network routing and switches
  - Optimize network path to camera

#### 2. PTZ Speed Settings Too Low
- **Check**: Speed configuration
- **Solution**:
  - Increase PTZ speed in GCXONE settings
  - Adjust speed in device PTZ settings
  - Use higher speed for larger movements
  - Configure speed presets for different scenarios

#### 3. Device Performance Issues
- **Check**: Camera CPU/memory usage
- **Solution**:
  - Check device resource usage
  - Reduce concurrent operations on camera
  - Restart camera if overloaded
  - Update camera firmware if available

#### 4. Network Bandwidth Constraints
- **Check**: Network bandwidth usage
- **Solution**:
  - Check network bandwidth availability
  - Reduce video stream quality if needed
  - Limit concurrent video streams
  - Use dedicated network for PTZ if possible

---

### Inaccurate Preset Positions

**Symptoms:**
- Preset doesn't return to exact saved position
- Slight drift from saved position
- Presets become less accurate over time

**Possible Causes and Solutions:**

#### 1. Camera Calibration Needed
- **Check**: Camera positioning accuracy
- **Solution**:
  - Re-calibrate camera positioning system
  - Use device calibration function if available
  - Set home position correctly
  - Verify camera mounting is stable

#### 2. Mechanical Wear
- **Check**: Camera mechanism condition
- **Solution**:
  - Inspect camera mechanism for wear
  - Check for loose mounting
  - Verify mechanism maintenance schedule
  - Contact manufacturer for service if needed

#### 3. External Factors
- **Check**: Environmental conditions
- **Solution**:
  - Check for wind or vibration affecting camera
  - Verify camera mounting stability
  - Check for temperature-related expansion/contraction
  - Ensure camera housing is secure

#### 4. Preset Save Timing
- **Check**: How preset was saved
- **Solution**:
  - Ensure camera fully stopped before saving
  - Wait for movement to complete
  - Use precise positioning before saving
  - Test preset immediately after saving

---

### Preset Tours Not Working

**Symptoms:**
- Tour doesn't start
- Tour stops or skips presets
- Tour doesn't repeat as configured

**Possible Causes and Solutions:**

#### 1. Device Doesn't Support Tours
- **Check**: Tour support in device documentation
- **Solution**:
  - Verify device supports preset tours
  - Some devices only support preset recall, not tours
  - Use automation rules as alternative
  - Check device firmware for tour support

#### 2. Tour Configuration Error
- **Check**: Tour settings in GCXONE
- **Solution**:
  - Verify all presets in tour exist and are valid
  - Check dwell time and speed settings
  - Verify tour sequence is correct
  - Recreate tour if configuration is corrupted

#### 3. Tour Interrupted
- **Check**: Manual PTZ control during tour
- **Solution**:
  - Configure tour as interruptible if needed
  - Avoid manual PTZ control during tour
  - Set tour priority in automation settings
  - Restart tour after interruption

---

### Zoom Not Working

**Symptoms:**
- Zoom controls don't respond
- Zoom reaches limits quickly
- Image quality degrades with zoom

**Possible Causes and Solutions:**

#### 1. Zoom Disabled on Device
- **Check**: Zoom settings on camera
- **Solution**:
  - Enable zoom in device settings
  - Check zoom limits configured correctly
  - Verify optical vs digital zoom settings
  - Test zoom from device interface

#### 2. Digital Zoom Limitations
- **Check**: Zoom type (optical vs digital)
- **Solution**:
  - Optical zoom maintains quality, digital zoom reduces it
  - Use optical zoom when possible
  - Limit digital zoom usage
  - Adjust focus after zooming

#### 3. Focus Issues
- **Check**: Auto-focus functionality
- **Solution**:
  - Enable auto-focus on camera
  - Manually adjust focus after zoom if needed
  - Check focus settings in device configuration
  - Verify camera supports auto-focus

---

## Diagnostic Steps

### Test PTZ from Device Interface

1. Access camera web interface
2. Navigate to PTZ controls
3. Test basic movements (pan, tilt, zoom)
4. Verify response is immediate and accurate
5. If PTZ works from device but not GCXONE, check protocol/configuration

### Verify PTZ Protocol

1. Check PTZ protocol in GCXONE camera settings
2. Verify protocol matches device configuration
3. Try switching between ONVIF and manufacturer protocol
4. Test PTZ after protocol change

### Network Diagnostics

```bash
# Test connectivity
ping <camera-ip>

# Test port accessibility
telnet <camera-ip> 80
telnet <camera-ip> 554

# Check latency
ping -n 100 <camera-ip>
```

---

## Still Having Issues?

If problems persist after trying solutions above:

1. **Gather Information**:
   - Camera make and model
   - Firmware version
   - PTZ protocol used
   - Error messages and timestamps
   - Network configuration details

2. **Check Logs**:
   - Review GCXONE logs for PTZ errors
   - Check device logs for PTZ-related messages
   - Look for network or protocol errors

3. **Contact Support**: [Submit a support ticket](/docs/support) with gathered information

---

## Related Articles

- [PTZ Control Overview](./overview.md)
- [PTZ Control Configuration](./configuration.md)
- [Live View Overview](/docs/features/live-view/overview.md)
- [Device Troubleshooting](/docs/troubleshooting/device-connection-issues.md)

---

**Need Help?**

If you need further assistance, [contact support](/docs/support).
