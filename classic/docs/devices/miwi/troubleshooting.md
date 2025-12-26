---
title: "Miwi Urmet (Polish) NVR/IP Camera Troubleshooting"
description: "Troubleshooting guide for Miwi Urmet (Polish) NVR/IP Camera integration with GCXONE"
tags:
  - role:installer
  - role:support
  - category:troubleshooting
  - difficulty:intermediate
  - platform:GCXONE
  - device:miwi
sidebar_position: 3
last_updated: 2025-12-20
---

# Miwi Urmet (Polish) NVR/IP Camera Troubleshooting

## Overview

This guide covers common issues and solutions for Miwi Urmet (Polish) NVR/IP Camera integration with GCXONE. Use this guide to diagnose and resolve problems during installation, configuration, and operation.

**How to use this guide**:
1. Identify the symptom you're experiencing
2. Review the possible causes
3. Follow the solutions step-by-step
4. Verify the expected result
5. If issue persists, see [Escalation Guidelines](#escalation-guidelines)

---

## Connection Issues

### Device Not Discovered

**Symptoms**:
- Device does not appear in GCXONE discovery list
- Auto-discovery fails or times out
- "Device not found" error message

**Possible Causes**:
1. Network connectivity issues between device and GCXONE
2. Incorrect IP address or hostname
3. Firewall blocking communication
4. Device not configured for discovery protocol
5. Incorrect credentials

**Solutions**:

**Solution 1: Verify Network Connectivity**
1. Ping the device IP address from a computer on the same network
2. Verify device is powered on and network cable connected
3. Check network switch/router for link status
4. Verify device has valid IP configuration (not 0.0.0.0 or 169.254.x.x)

**Solution 2: Check Credentials and Settings**
1. Verify username and password are correct
2. Ensure user account has administrator/sufficient permissions
3. Check if device requires HTTPS (try both HTTP and HTTPS)
4. Verify port number is correct (check device documentation)

**Solution 3: Verify Firewall Configuration**
1. Check device firewall settings allow incoming connections
2. Verify GCXONE IP/network is whitelisted on device (if applicable)
3. Check network firewall rules between device and GCXONE
4. Temporarily disable device firewall to test (re-enable after testing)

**Expected Result**: Device appears in discovery list and connection succeeds.

---

### Device Shows Offline in GCXONE

**Symptoms**:
- Device was online, now shows offline status
- Red or gray status indicator in GCXONE
- "Connection lost" or "Unreachable" message

**Possible Causes**:
1. Network connectivity interruption
2. Device restarted or powered off
3. Credentials changed on device
4. IP address changed
5. Firewall rules changed
6. Device firmware updated and settings reset

**Solutions**:

**Solution 1: Verify Device Status**
1. Check if device is powered on
2. Verify device web interface is accessible
3. Check device system logs for errors or restarts
4. Verify network cable connections

**Solution 2: Check Network Connectivity**
1. Ping device IP address
2. Access device web interface from browser
3. Check for network changes (VLAN, routing, firewall)

**Solution 3: Verify Credentials**
1. Try logging into device with credentials stored in GCXONE
2. If login fails, update credentials in GCXONE:
   - GCXONE → Devices → [Device] → Edit → Update credentials
3. Save and test connection

**Solution 4: Check for IP Address Change**
1. Verify device IP address hasn't changed
2. If IP changed, update in GCXONE device settings
3. Consider assigning static IP or DHCP reservation

**Expected Result**: Device status shows online/green in GCXONE.

---

## Video/Streaming Issues

### No Live Video

**Symptoms**:
- Black screen when opening live view
- "Stream not available" error
- Loading icon that never completes

**Possible Causes**:
1. Stream not enabled on device
2. Network bandwidth insufficient
3. Codec not supported
4. Camera/channel disabled
5. Incorrect stream URL or settings

**Solutions**:

**Solution 1: Verify Stream Configuration**
1. Access device web interface
2. Navigate to **Video/Stream Settings**
3. Verify main stream is enabled
4. Check stream encoding settings:
   - **Codec**: H.264 or H.265
   - **Resolution**: [Recommended settings]
   - **Frame Rate**: 15-30 fps recommended
   - **Bitrate**: [Recommended range]

**Solution 2: Check Network Bandwidth**
1. Verify network has sufficient bandwidth
2. Test with lower resolution or bitrate
3. Check for network congestion
4. Test from different network location

**Solution 3: Verify Channel Status**
1. Ensure camera/channel is not disabled
2. Check camera has power (for IP cameras)
3. Verify camera is connected to NVR/VMS

**Expected Result**: Live video streams successfully in GCXONE.

---

### Poor Video Quality or Lagging

**Symptoms**:
- Pixelated or blurry video
- Stuttering or choppy playback
- Delayed or frozen frames

**Possible Causes**:
1. Insufficient bandwidth
2. High network latency
3. Bitrate too low on device
4. Network packet loss
5. CPU overload on device

**Solutions**:

**Solution 1: Adjust Stream Settings**
1. Access device video settings
2. Increase bitrate (if too low)
3. Adjust frame rate to 20-25 fps
4. Use H.265 codec for better compression (if supported)

**Solution 2: Check Network Performance**
1. Test network latency: `ping [device_ip] -t`
2. Check for packet loss
3. Verify bandwidth availability
4. Consider quality of service (QoS) settings

**Expected Result**: Smooth, clear video streaming.

---

### Playback Not Working

**Symptoms**:
- Cannot access recorded video
- Timeline shows no recordings
- Playback fails to load

**Possible Causes**:
1. Recording not enabled on device
2. Storage full or unavailable
3. Time zone mismatch
4. Playback protocol not supported
5. Recording corrupted

**Solutions**:

**Solution 1: Verify Recording Settings**
1. Check recording is enabled on device
2. Verify recording schedule is configured
3. Check storage status (disk space available)
4. Verify recording mode (continuous, motion, event)

**Solution 2: Check Time Zone Settings**
1. Verify device time zone matches GCXONE settings
2. Synchronize time (NTP recommended)
3. Check for daylight saving time discrepancies

**Expected Result**: Recorded video plays successfully from timeline.

---

## Event/Alarm Issues

### Events Not Received in GCXONE

**Symptoms**:
- No events appearing in GCXONE
- Events showing on device but not in platform
- Delayed event notification

**Possible Causes**:
1. Event detection not enabled on device
2. Event transmission not configured
3. Network blocking event protocol
4. Event filters misconfigured
5. Wrong receiver IP/port configured

**Solutions**:

**Solution 1: Verify Event Configuration on Device**
1. Access device event/alarm settings
2. Enable event detection:
   - [ ] Motion detection
   - [ ] Intrusion detection
   - [ ] [Device-specific events]
3. Configure event sensitivity/zones
4. Enable event notification

**Solution 2: Configure Event Transmission**
1. Navigate to alarm/event server settings
2. Configure GCXONE receiver details:
   - **Protocol**: [SIA-DC09 / Custom / etc.]
   - **IP Address**: [GCXONE receiver IP - obtain from GCXONE device view]
   - **Port**: [Receiver port]
   - **Account Number**: [If required - from GCXONE]
3. Enable transmission
4. Save settings

**Solution 3: Test Event Triggering**
1. Manually trigger a test event on device
2. Check device logs for event transmission
3. Verify event appears in GCXONE within expected time
4. Check GCXONE event logs if needed

**Expected Result**: Events appear in GCXONE immediately or within configured delay.

---

### False Alarms

**Symptoms**:
- Excessive motion detection alerts
- Alarms triggered by non-threatening events
- Repeated false positives

**Possible Causes**:
1. Motion sensitivity too high
2. Detection zones not configured properly
3. Environmental factors (wind, shadows, insects)
4. Analytics settings need tuning

**Solutions**:

**Solution 1: Adjust Motion Sensitivity**
1. Access motion detection settings
2. Reduce sensitivity level (start with medium)
3. Test and adjust as needed

**Solution 2: Configure Detection Zones**
1. Define motion detection zones
2. Exclude areas with movement (trees, flags, traffic)
3. Focus on critical areas only

**Solution 3: Use Advanced Analytics**
1. Enable smart motion detection (if available)
2. Configure object classification (person, vehicle)
3. Set minimum object size
4. Enable AI-based false alarm filtering (GCXONE feature)

**Expected Result**: Significant reduction in false alarms while maintaining detection of real events.

---

## Feature-Specific Issues

### PTZ Not Working

**Symptoms**:
- Cannot control PTZ from GCXONE
- PTZ controls unresponsive
- Camera does not move to presets

**Possible Causes**:
1. PTZ not enabled on device
2. PTZ protocol mismatch
3. User permissions insufficient
4. PTZ locked by another user/system

**Solutions**:

**Solution 1: Verify PTZ Configuration**
1. Confirm camera supports PTZ
2. Check PTZ is enabled in device settings
3. Verify PTZ protocol matches (Pelco-D, Pelco-P, ONVIF, etc.)
4. Test PTZ from device interface

**Solution 2: Check Permissions**
1. Verify GCXONE user has PTZ control permissions
2. Check if PTZ is locked by another session
3. Ensure no conflicting PTZ commands

**Expected Result**: PTZ controls respond correctly from GCXONE.

---

### Audio Not Working

**Symptoms**:
- No audio in live stream
- Audio playback fails
- Distorted or garbled audio

**Possible Causes**:
1. Audio not enabled on device
2. Microphone not connected or faulty
3. Audio codec not supported
4. Audio stream not configured

**Solutions**:

**Solution 1: Enable Audio**
1. Access device audio settings
2. Enable audio for the stream
3. Configure audio encoding (G.711, AAC, etc.)
4. Adjust audio bitrate

**Solution 2: Check Hardware**
1. Verify microphone is connected
2. Test microphone on device directly
3. Check audio input levels

**Expected Result**: Audio streams successfully with video.

---

## Performance Issues

### High Latency

**Symptoms**:
- Significant delay in live video
- Slow response to PTZ commands
- Delayed event notifications

**Possible Causes**:
1. Network congestion
2. Insufficient bandwidth
3. Device CPU overloaded
4. Too many concurrent streams
5. Inefficient routing

**Solutions**:

**Solution 1: Optimize Network**
1. Check network utilization
2. Implement QoS for video traffic
3. Use dedicated VLAN for video (if possible)
4. Verify routing is optimal

**Solution 2: Reduce Load**
1. Decrease number of concurrent streams
2. Lower resolution/bitrate for less critical cameras
3. Disable unnecessary features
4. Restart device to clear resources

**Expected Result**: Latency reduced to acceptable levels (less than 500ms for local, less than 2s for cloud).

---

## Diagnostic Tools

### Built-in Device Diagnostics

Most nvr devices include diagnostic tools:

1. Access device web interface
2. Navigate to **Diagnostics** or **System Tools**
3. Available tools may include:
   - **Network Test**: Ping, traceroute, bandwidth test
   - **System Logs**: View device logs for errors
   - **Resource Monitor**: CPU, memory, disk usage
   - **Connection Status**: Active connections and sessions

### Network Testing

Test network connectivity:

```bash
# Ping device
ping [device_ip]

# Traceroute to device
tracert [device_ip]  # Windows
traceroute [device_ip]  # Linux/Mac

# Test port connectivity
telnet [device_ip] [port]
```

### GCXONE Logs

Access GCXONE logs for device communication:

1. GCXONE → Settings → System Logs
2. Filter by device name or ID
3. Look for connection errors, authentication failures, or event reception issues

---

## Escalation Guidelines

### When to Contact Support

Contact GCXONE support if:

- Issue persists after following all troubleshooting steps
- Device behavior is inconsistent with documentation
- Suspected platform or integration bug
- Need assistance with complex configuration
- Require access to advanced logs or diagnostics

### Information to Gather Before Contacting Support

Prepare the following information:

- [ ] **Device Information**:
  - Device model and firmware version
  - Device serial number
  - Device IP address
- [ ] **GCXONE Information**:
  - Tenant name
  - Device name in GCXONE
  - User account experiencing issue
- [ ] **Issue Details**:
  - Symptom description
  - When issue started
  - Frequency (constant, intermittent)
  - Steps already attempted
- [ ] **Logs and Screenshots**:
  - Error messages (screenshots)
  - Device logs (export if possible)
  - GCXONE logs (if accessible)
  - Network diagram (for connectivity issues)
- [ ] **Recent Changes**:
  - Firmware updates
  - Configuration changes
  - Network changes

### How to Contact Support

- Submit ticket: [How to Submit a Support Ticket](/docs/troubleshooting-support/how-to-submit-a-support-ticket)
- Email: support@nxgen.io (include all gathered information)
- Phone: [Support phone number] (for urgent issues)

---

## Related Articles

- [Miwi Urmet (Polish) NVR/IP Camera Overview](./overview.md)
- [Miwi Urmet (Polish) NVR/IP Camera Configuration](./configuration.md)
- [General Troubleshooting Guide](/docs/troubleshooting-support/general-troubleshooting)
- [Network Diagnostics](/docs/troubleshooting-support/network-diagnostics)

## Change Log

- 2025-12-20 v1.0.0 - Initial troubleshooting guide

---

**Still need help?** [Contact GCXONE Support](/docs/troubleshooting-support/how-to-submit-a-support-ticket)
