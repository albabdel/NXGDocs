---
title: "Video Streaming Troubleshooting"
description: "Common issues and solutions for video streaming in GCXONE"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:beginner
  - platform:GCXONE
  - feature:video-streaming
sidebar_position: 3
last_updated: 2025-12-21
---

# Video Streaming Troubleshooting

## Overview

This guide provides solutions for common video streaming issues in GCXONE. Follow the troubleshooting steps in order, as later solutions may depend on earlier fixes.

---

## Common Issues

### No Video Display

**Symptoms:**
- Black screen or "No video available" message
- Camera shows online but no video stream
- Video player loads but shows nothing

**Possible Causes and Solutions:**

#### 1. Device Offline or Unreachable
- **Check**: Device status in GCXONE shows "Offline"
- **Solution**:
  - Verify device is powered on and connected to network
  - Ping device IP address: `ping <device-ip>`
  - Check network cable connections
  - Verify device is accessible from GCXONE server

#### 2. Incorrect Credentials
- **Check**: Authentication errors in device logs
- **Solution**:
  - Verify username and password in GCXONE device configuration
  - Test credentials by logging into device web interface
  - Check if credentials were changed on device
  - Update credentials in GCXONE if changed

#### 3. RTSP Port Blocked
- **Check**: RTSP connection fails (typically port 554)
- **Solution**:
  - Verify RTSP port is open: `telnet <device-ip> 554`
  - Check firewall rules allow RTSP traffic
  - Verify port forwarding if accessing remotely
  - Test RTSP URL: `rtsp://username:password@device-ip:554/stream1`

#### 4. Stream Path Incorrect
- **Check**: Device-specific RTSP path required
- **Solution**:
  - Verify correct RTSP path for device manufacturer
  - Common paths: `/stream1`, `/h264`, `/video`, `/live`
  - Check device documentation for exact path
  - Update stream path in GCXONE device configuration

#### 5. Codec Not Supported
- **Check**: Device uses unsupported codec
- **Solution**:
  - Verify device codec is H.264 or H.265
  - Check browser codec support
  - Update browser to latest version
  - Try different browser (Chrome recommended)

---

### Poor Video Quality

**Symptoms:**
- Pixelated or blurry video
- Choppy playback
- Low resolution display

**Possible Causes and Solutions:**

#### 1. Low Bitrate Setting
- **Check**: Bitrate configured too low on device
- **Solution**:
  - Access device web interface
  - Navigate to Video/Streaming settings
  - Increase bitrate (recommended: 2-4 Mbps for 1080p)
  - Adjust frame rate if needed (15-30 FPS typical)

#### 2. Bandwidth Limitations
- **Check**: Network bandwidth insufficient
- **Solution**:
  - Check available bandwidth: `speedtest.net`
  - Reduce stream quality in GCXONE (Medium or Low)
  - Enable adaptive quality in GCXONE settings
  - Use secondary stream for grid views
  - Limit concurrent streams

#### 3. Using Wrong Stream Source
- **Check**: Primary stream used when secondary available
- **Solution**:
  - Switch to secondary stream for grid views
  - Use primary stream only for full-screen viewing
  - Configure stream source in camera settings

#### 4. Network Latency
- **Check**: High latency to device or GCXONE
- **Solution**:
  - Test latency: `ping <device-ip>`
  - Use Local Mode for on-site workstations
  - Check network routing and switches
  - Verify network equipment performance

---

### Frequent Buffering or Stuttering

**Symptoms:**
- Video pauses frequently
- Loading spinner appears often
- Playback is choppy

**Possible Causes and Solutions:**

#### 1. Insufficient Bandwidth
- **Check**: Bandwidth usage exceeds capacity
- **Solution**:
  - Reduce stream quality
  - Limit number of concurrent streams
  - Close unused video windows
  - Enable adaptive quality

#### 2. Network Packet Loss
- **Check**: High packet loss on network
- **Solution**:
  - Test packet loss: `ping -n 100 <device-ip>`
  - Check network cables and connections
  - Verify network switch performance
  - Check for network congestion

#### 3. Buffer Size Too Small
- **Check**: Buffer settings in GCXONE
- **Solution**:
  - Increase buffer size in streaming preferences
  - Adjust timeout settings
  - Check device buffer settings

#### 4. Device Performance Issues
- **Check**: Device CPU/memory usage high
- **Solution**:
  - Reduce number of simultaneous streams from device
  - Lower stream bitrate on device
  - Check device temperature and cooling
  - Restart device if needed

---

### Connection Drops or Timeouts

**Symptoms:**
- Video stream disconnects frequently
- "Connection lost" messages
- Stream stops after period of time

**Possible Causes and Solutions:**

#### 1. Network Instability
- **Check**: Network connection drops
- **Solution**:
  - Test network stability: continuous ping
  - Check network cable connections
  - Verify switch/router stability
  - Check for interference (WiFi issues)

#### 2. Timeout Settings Too Short
- **Check**: Connection timeout configured too short
- **Solution**:
  - Increase timeout in GCXONE streaming settings (30-60 seconds)
  - Adjust device timeout settings
  - Enable keep-alive mechanisms

#### 3. Firewall Timeout
- **Check**: Firewall closing idle connections
- **Solution**:
  - Adjust firewall timeout settings
  - Configure firewall to allow persistent connections
  - Check NAT timeout settings

#### 4. Device Resource Exhaustion
- **Check**: Device running out of resources
- **Solution**:
  - Reduce concurrent connections to device
  - Lower stream quality/bitrate
  - Restart device
  - Check device firmware updates

---

### Local Mode Not Working

**Symptoms:**
- Local Mode enabled but still using cloud
- No P2P connection established
- High latency despite Local Mode

**Possible Causes and Solutions:**

#### 1. Local Mode Service Not Running
- **Check**: Service status on workstation
- **Solution**:
  - Verify Local Mode service is running (Windows Services)
  - Restart Local Mode service
  - Reinstall Local Mode if needed
  - Check service logs for errors

#### 2. Network Access Issues
- **Check**: Workstation can't reach device on local network
- **Solution**:
  - Verify workstation and device are on same network
  - Test connectivity: `ping <device-ip>`
  - Check network routing and VLAN configuration
  - Verify firewall allows local connections

#### 3. Device Not Supporting Local Mode
- **Check**: Device type supports Local Mode
- **Solution**:
  - Verify device type supports Local Mode (check documentation)
  - Some devices (Hanwha, Genesis Audio) don't support Local Mode
  - Use cloud streaming for unsupported devices

#### 4. Auto-Discovery Failed
- **Check**: Devices not discovered on local network
- **Solution**:
  - Manually configure device IPs in Local Mode settings
  - Check network broadcast settings
  - Verify UDP ports for discovery are open
  - Restart Local Mode service

---

### Slow Stream Startup

**Symptoms:**
- Takes long time for video to start
- Loading spinner for extended period
- Delay before first frame appears

**Possible Causes and Solutions:**

#### 1. High Latency Connection
- **Check**: Round-trip time to device
- **Solution**:
  - Use Local Mode for on-site access
  - Check network latency: `ping <device-ip>`
  - Optimize network routing
  - Consider CDN for cloud streaming

#### 2. Device Slow to Respond
- **Check**: Device response time
- **Solution**:
  - Check device CPU/memory usage
  - Restart device if overloaded
  - Update device firmware
  - Reduce load on device (fewer streams)

#### 3. Stream Initialization Issues
- **Check**: RTSP handshake taking too long
- **Solution**:
  - Verify RTSP path is correct
  - Check device RTSP settings
  - Test RTSP directly with VLC or similar tool
  - Update device firmware

---

### Audio Issues

**Symptoms:**
- No audio with video
- Audio out of sync
- Poor audio quality

**Possible Causes and Solutions:**

#### 1. Audio Not Enabled
- **Check**: Audio disabled in device or GCXONE
- **Solution**:
  - Enable audio in device settings
  - Enable audio in GCXONE camera configuration
  - Check audio codec support

#### 2. Audio Codec Not Supported
- **Check**: Unsupported audio codec
- **Solution**:
  - Verify codec is G.711, AAC, or PCM
  - Update browser to latest version
  - Check device audio codec settings

#### 3. Audio Sync Issues
- **Check**: Audio/video synchronization
- **Solution**:
  - Adjust buffer settings
  - Check device firmware for audio sync fixes
  - Use Local Mode for better sync (if available)

---

## Diagnostic Tools

### Testing RTSP Connection

```bash
# Test RTSP port accessibility
telnet <device-ip> 554

# Test RTSP stream with VLC
vlc rtsp://username:password@device-ip:554/stream1

# Test with ffmpeg
ffmpeg -i rtsp://username:password@device-ip:554/stream1 -vframes 1 test.jpg
```

### Network Diagnostics

```bash
# Ping test
ping -n 100 <device-ip>

# Traceroute
tracert <device-ip>

# Check open ports
nmap -p 554,80,443 <device-ip>
```

### Browser Console

- Open browser Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests
- Verify WebSocket connections if applicable

---

## Still Having Issues?

If you've tried the solutions above and are still experiencing problems:

1. **Check Device Logs**: Review device logs for specific errors
2. **Check GCXONE Logs**: Review platform logs for streaming errors
3. **Gather Information**:
   - Device type and model
   - Firmware version
   - Network configuration
   - Error messages and timestamps
4. **Contact Support**: [Submit a support ticket](#) with gathered information

---

## Related Articles

- [Video Streaming Overview](./overview.md)
- [Video Streaming Configuration](./configuration.md)
- 

---

**Need Help?**

If you need further assistance, [contact support](#).
