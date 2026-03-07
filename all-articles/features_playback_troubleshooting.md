---
title: "Playback Troubleshooting"
description: "Common issues and solutions for video playback in GCXONE"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:beginner
  - platform:GCXONE
  - feature:playback
sidebar_position: 3
last_updated: 2025-12-21
---

# Playback Troubleshooting

## Overview

This guide provides solutions for common video playback issues in GCXONE. Follow troubleshooting steps in order for best results.

---

## Common Issues

### No Recordings Available

**Symptoms:**
- Timeline shows no recordings
- "No recordings available" message
- Timeline is empty or grayed out

**Possible Causes and Solutions:**

#### 1. Recording Not Enabled
- **Check**: Recording status on device
- **Solution**:
  - Access device web interface
  - Navigate to Recording Settings
  - Enable recording (continuous or event-based)
  - Verify recording schedule is configured
  - Save settings and verify recordings start

#### 2. Recording Period Outside Retention
- **Check**: Recording retention period
- **Solution**:
  - Verify retention period configured on device
  - Check if requested time period is within retention
  - Adjust retention period if needed
  - Check storage capacity

#### 3. No Recordings for Selected Time
- **Check**: Timeline for selected date/time
- **Solution**:
  - Verify recording schedule covers requested time
  - Check if device was offline during period
  - Look for recording gaps on timeline
  - Try different time period

#### 4. Storage Issues
- **Check**: Device storage status
- **Solution**:
  - Check storage space available
  - Verify storage device is healthy
  - Check for storage errors in device logs
  - Replace/fix storage if needed

---

### Timeline Not Synchronized

**Symptoms:**
- Events appear at wrong times
- Multiple cameras show different times
- Timeline misaligned between cameras

**Possible Causes and Solutions:**

#### 1. Time Synchronization Issues
- **Check**: NTP synchronization status
- **Solution**:
  - Verify NTP configured on all devices
  - Check NTP server: `timel.nxgen.cloud`
  - Verify time sync is active
  - Manually sync time if needed
  - Restart device after NTP configuration

#### 2. Time Zone Mismatch
- **Check**: Time zone settings
- **Solution**:
  - Verify time zone configured correctly on devices
  - Check time zone in GCXONE matches devices
  - Update time zone if incorrect
  - Re-sync time after time zone change

#### 3. Device Time Incorrect
- **Check**: Device system time
- **Solution**:
  - Compare device time to accurate time source
  - Manually set time if significantly off
  - Enable NTP for automatic sync
  - Verify time after changes

---

### Playback Won't Start

**Symptoms:**
- Playback button doesn't respond
- Loading spinner appears but video doesn't start
- Error message when trying to play

**Possible Causes and Solutions:**

#### 1. Device Offline
- **Check**: Device status in GCXONE
- **Solution**:
  - Verify device shows "Online" status
  - Check network connectivity to device
  - Ping device IP address
  - Restart device if offline

#### 2. No Recordings for Selected Time
- **Check**: Timeline shows recordings
- **Solution**:
  - Verify recordings exist for selected time
  - Check timeline for available recordings
  - Try different time period
  - Verify recording was enabled during that time

#### 3. Network Connectivity Issues
- **Check**: Network connection to device
- **Solution**:
  - Test network connectivity: `ping <device-ip>`
  - Check firewall rules allow playback ports
  - Verify RTSP/HTTP ports accessible
  - Check network latency and packet loss

#### 4. Insufficient Permissions
- **Check**: User permissions
- **Solution**:
  - Verify user has playback permissions
  - Check role settings in user management
  - Request admin to grant permissions
  - Try different user account

---

### Poor Playback Quality

**Symptoms:**
- Video is pixelated or blurry
- Low resolution playback
- Poor image quality

**Possible Causes and Solutions:**

#### 1. Low Quality Setting
- **Check**: Playback quality settings
- **Solution**:
  - Increase playback quality in GCXONE
  - Change from Low/Medium to High quality
  - Disable adaptive quality if needed
  - Check device recording quality

#### 2. Bandwidth Limitations
- **Check**: Available network bandwidth
- **Solution**:
  - Check bandwidth availability
  - Reduce concurrent playback streams
  - Use Local Mode for on-site access
  - Increase network bandwidth if needed

#### 3. Using Wrong Stream
- **Check**: Stream source selection
- **Solution**:
  - Verify using primary stream (not sub-stream)
  - Check device stream configuration
  - Ensure recording uses high quality stream
  - Verify stream settings match requirements

#### 4. Device Recording Quality
- **Check**: Device recording settings
- **Solution**:
  - Verify recording resolution and bitrate
  - Increase recording quality on device
  - Check recording codec settings
  - Verify storage supports high quality

---

### Frequent Buffering

**Symptoms:**
- Playback pauses frequently
- Loading spinner appears often
- Choppy playback

**Possible Causes and Solutions:**

#### 1. Insufficient Bandwidth
- **Check**: Network bandwidth usage
- **Solution**:
  - Check available bandwidth
  - Reduce playback quality
  - Limit concurrent streams
  - Use Local Mode if available

#### 2. Network Latency/Packet Loss
- **Check**: Network performance
- **Solution**:
  - Test network latency: `ping <device-ip>`
  - Check for packet loss
  - Optimize network routing
  - Check network equipment performance

#### 3. Buffer Size Too Small
- **Check**: Playback buffer settings
- **Solution**:
  - Increase buffer size in GCXONE settings
  - Adjust preload duration
  - Check device buffer settings
  - Restart playback after changes

#### 4. Device Performance
- **Check**: Device resource usage
- **Solution**:
  - Check device CPU/memory usage
  - Reduce concurrent operations on device
  - Restart device if overloaded
  - Update device firmware

---

### Event Markers Not Showing

**Symptoms:**
- Timeline doesn't show event markers
- Events not visible on playback timeline
- Can't navigate to events

**Possible Causes and Solutions:**

#### 1. Event Markers Disabled
- **Check**: Event marker settings
- **Solution**:
  - Enable event markers in GCXONE settings
  - Verify event types are enabled
  - Check timeline marker configuration
  - Refresh timeline after enabling

#### 2. No Events Recorded
- **Check**: Event forwarding configured
- **Solution**:
  - Verify events are being forwarded to GCXONE
  - Check event configuration on device
  - Verify events occurred during recording period
  - Test event generation

#### 3. Timeline View Settings
- **Check**: Timeline display settings
- **Solution**:
  - Check timeline zoom level (may need to zoom in)
  - Verify marker density settings
  - Check if markers are hidden by view settings
  - Try different timeline view

---

### Can't Export Video Clips

**Symptoms:**
- Export button doesn't work
- Export fails or errors
- Exported clips don't download

**Possible Causes and Solutions:**

#### 1. Export Permissions
- **Check**: User export permissions
- **Solution**:
  - Verify user has export/clip download permissions
  - Check role settings
  - Request admin to grant permissions

#### 2. Export Settings Issue
- **Check**: Export configuration
- **Solution**:
  - Verify export settings are configured
  - Check export format and codec settings
  - Verify storage location is accessible
  - Check export size limits

#### 3. Storage Space
- **Check**: Available storage
- **Solution**:
  - Verify sufficient storage space for export
  - Check temporary storage location
  - Clear old exports if needed
  - Increase storage capacity

#### 4. Export Process Failed
- **Check**: Export logs/errors
- **Solution**:
  - Check error messages for details
  - Try smaller export segment
  - Try different export format
  - Retry export operation

---

### Multi-Camera Playback Issues

**Symptoms:**
- Synchronized playback not working
- Cameras out of sync
- Can't view multiple cameras together

**Possible Causes and Solutions:**

#### 1. Time Synchronization
- **Check**: All cameras synchronized
- **Solution**:
  - Verify NTP on all cameras
  - Check time alignment between cameras
  - Re-sync time on cameras
  - Verify time zones match

#### 2. Playback Sync Settings
- **Check**: Synchronized playback enabled
- **Solution**:
  - Enable synchronized playback mode
  - Verify sync settings in playback interface
  - Check playback controls are linked
  - Try re-selecting cameras for sync

#### 3. Network Performance
- **Check**: Network handling multiple streams
- **Solution**:
  - Check bandwidth for multiple streams
  - Reduce quality if needed
  - Use Local Mode for better performance
  - Limit number of synchronized cameras

---

## Diagnostic Steps

### Verify Recordings Exist

1. Access device web interface
2. Navigate to Playback/Recordings
3. Verify recordings for specific time period
4. Check recording schedule covers period
5. Verify storage has recordings

### Test Time Synchronization

```bash
# Check device time
# Compare with accurate time source

# Test NTP connection
ntpdate -q timel.nxgen.cloud

# Check time on multiple devices
# Should be within seconds of each other
```

### Test Playback Connection

1. Try playback from device web interface
2. Test RTSP playback directly: `vlc rtsp://device-ip/stream`
3. Verify network connectivity to device
4. Check firewall rules allow playback ports

---

## Still Having Issues?

If problems persist:

1. **Gather Information**:
   - Device type and model
   - Recording configuration
   - Time synchronization status
   - Error messages and timestamps
   - Network configuration

2. **Check Logs**:
   - Review GCXONE logs for playback errors
   - Check device logs for recording issues
   - Look for network or connectivity errors

3. **Contact Support**: [Submit a support ticket](#) with information

---

## Related Articles

- [Playback Overview](./overview.md)
- Playback Configuration
- 
- 

---

**Need Help?**

If you need further assistance, [contact support](#).
