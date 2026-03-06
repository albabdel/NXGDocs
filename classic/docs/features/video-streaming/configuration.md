---
title: "Video Streaming Configuration"
description: "Step-by-step guide to configuring video streaming in GCXONE"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - feature:video-streaming
sidebar_position: 2
last_updated: 2025-12-21
---

# Video Streaming Configuration

## Overview

This guide covers the configuration of video streaming for devices in GCXONE, including both cloud and local mode setup, stream quality settings, and optimization options.

**What you'll accomplish:**
- Configure cloud streaming for devices
- Set up Local Mode for optimal performance
- Adjust stream quality and bandwidth settings
- Enable multi-stream support
- Optimize streaming performance

**Estimated time**: 15-30 minutes per device type

## Prerequisites

Before configuring video streaming, ensure:

- [ ] Devices are successfully added to GCXONE
- [ ] Network connectivity is established
- [ ] Device credentials are configured correctly
- [ ] Required ports are open (RTSP 554, HTTP 80, HTTPS 443)
- [ ] For Local Mode: Operator workstations are prepared with network access

---

## Configuration Workflow

1. **Device-Level Streaming Configuration** - Configure streaming on individual devices
2. **GCXONE Platform Streaming Settings** - Set streaming preferences in GCXONE
3. **Local Mode Setup** (Optional) - Configure Local Mode for operator workstations
4. **Stream Quality Optimization** - Fine-tune quality and bandwidth settings
5. **Verification** - Test and validate streaming performance

---

## Part 1: Device-Level Streaming Configuration

### Step 1: Configure Device Streaming Settings

**UI Path**: Device Management Interface → Video/Streaming Settings

**Objective**: Configure device-side streaming parameters for optimal performance.

**Configuration Steps:**

1. Access the device's web interface or management software
2. Navigate to **Video Settings** or **Streaming Configuration**
3. Configure **Primary Stream**:
   - **Resolution**: Set appropriate resolution (e.g., 1920x1080, 1280x720)
   - **Frame Rate**: 15-30 FPS recommended for most use cases
   - **Bitrate**: Adjust based on network capacity (2-4 Mbps typical)
   - **Codec**: H.264 or H.265 (H.265 for better compression)
4. Configure **Secondary Stream** (if available):
   - **Resolution**: Lower resolution for sub-stream (e.g., 640x480)
   - **Bitrate**: Lower bitrate for bandwidth optimization
   - **Purpose**: Used for multi-camera grid views
5. Enable **RTSP Streaming** if not already enabled
6. Set **RTSP Port**: Typically 554 (or custom if required)
7. Click **Save** or **Apply**

**Note**: Specific settings vary by device manufacturer. Refer to device documentation for exact navigation paths.

**Expected Result**: Device configured with appropriate streaming parameters.

---

### Step 2: Verify Network Connectivity

**Objective**: Ensure device is accessible for streaming.

**Verification Steps:**

1. From GCXONE platform, verify device shows **Online** status
2. Test RTSP stream connection:
   ```bash
   # Example RTSP URL format
   rtsp://device-ip:554/stream1
   ```
3. Verify ports are accessible:
   - RTSP: `telnet device-ip 554`
   - HTTP: `curl http://device-ip`
   - HTTPS: `curl https://device-ip`
4. Check firewall rules allow required ports

**Expected Result**: All connectivity tests pass.

---

## Part 2: GCXONE Platform Streaming Configuration

### Step 3: Configure Camera Streaming Settings in GCXONE

**UI Path**: GCXONE → Devices → [Device Name] → Camera Configuration

**Objective**: Configure streaming preferences for each camera in GCXONE.

**Configuration Steps:**

1. Log into **GCXONE** web portal
2. Navigate to **Devices** → Select your device
3. Click **Configure Cameras** or **Camera Management**
4. For each camera, configure streaming:

   **Cloud Streaming Settings:**
   - **Enable Cloud Streaming**: ✓ Checked (for remote access)
   - **Stream Source**: Primary or Secondary stream
   - **Quality Mode**: Auto, High, Medium, or Low
   - **Adaptive Quality**: ✓ Enable for bandwidth optimization

   **Local Streaming Settings:**
   - **Enable Local Streaming**: ✓ Checked (if using Local Mode)
   - **Stream Source**: Primary stream (recommended for local)
   - **Quality Mode**: High (local network can handle higher quality)

5. Configure **Advanced Streaming Options**:
   - **Buffer Size**: Adjust for network conditions (default usually fine)
   - **Timeout Settings**: Increase if experiencing frequent timeouts
   - **Retry Logic**: Configure automatic reconnection attempts
6. Click **Save Configuration**

**Expected Result**: Cameras configured with appropriate streaming settings.

---

### Step 4: Configure Global Streaming Preferences

**UI Path**: GCXONE → Settings → Streaming Preferences

**Objective**: Set platform-wide streaming defaults and policies.

**Configuration Steps:**

1. Navigate to **Settings** → **Streaming Preferences**
2. Configure **Default Settings**:
   - **Default Quality**: Auto (recommended) or specific quality level
   - **Default Stream Source**: Primary or Secondary
   - **Concurrent Stream Limit**: Maximum streams per user/workstation
3. Configure **Bandwidth Management**:
   - **Enable Adaptive Quality**: ✓ Checked
   - **Bandwidth Threshold**: Set limits if required
   - **Quality Degradation Policy**: Define when to reduce quality
4. Configure **Performance Settings**:
   - **Stream Buffer Size**: Default or custom
   - **Connection Timeout**: Recommended 30-60 seconds
   - **Retry Attempts**: 3-5 attempts recommended
5. Click **Save Preferences**

**Expected Result**: Global streaming preferences configured.

---

## Part 3: Local Mode Setup (Optional but Recommended)

### Step 5: Install Local Mode Service

**UI Path**: Operator Workstation → Genesis Installer

**Objective**: Install Local Mode service for P2P streaming on operator workstations.

**Configuration Steps:**

1. Download **Genesis Installer** for Local Mode
2. Run installer on operator workstation (requires admin privileges)
3. Follow installation wizard:
   - Accept license agreement
   - Choose installation directory
   - Select Local Mode components
   - Complete installation
4. Verify service is running:
   - Check Windows Services (if Windows)
   - Verify process is active in Task Manager
5. Restart operator workstation if required

**Expected Result**: Local Mode service installed and running.

---

### Step 6: Configure Local Mode in GCXONE

**UI Path**: GCXONE → Settings → Local Mode Configuration

**Objective**: Enable and configure Local Mode for devices.

**Configuration Steps:**

1. Navigate to **Settings** → **Local Mode Configuration**
2. Enable **Local Mode** for supported devices:
   - Select devices that support Local Mode
   - Enable **Auto-Discovery** for local network devices
3. Configure **Local Mode Policies**:
   - **Prefer Local Mode**: ✓ Enable for operator workstations
   - **Fallback to Cloud**: ✓ Enable automatic fallback
   - **Local Network Detection**: Configure network ranges
4. Test Local Mode connectivity:
   - From operator workstation, verify devices appear in Local Mode
   - Test direct connection to device IP
5. Click **Save Configuration**

**Expected Result**: Local Mode enabled and functional.

---

## Part 4: Stream Quality Optimization

### Step 7: Optimize Stream Quality Based on Use Case

**Objective**: Fine-tune streaming quality for specific scenarios.

**Optimization Guidelines:**

**High-Priority Monitoring:**
- Quality: High
- Stream Source: Primary
- Buffer: Standard
- Use Local Mode if available

**Multi-Camera Grid Views:**
- Quality: Medium to Low
- Stream Source: Secondary (if available)
- Adaptive Quality: Enabled
- Limit concurrent streams

**Mobile/Remote Access:**
- Quality: Auto (adaptive)
- Stream Source: Secondary (lower bandwidth)
- Enable bandwidth optimization
- Use cloud streaming

**Recording/Playback:**
- Quality: High (for primary recordings)
- Stream Source: Primary
- Use device's recording settings
- Cloud streaming sufficient

---

## Part 5: Verification and Testing

### Verification Checklist

**Cloud Streaming:**
- [ ] Live video displays correctly in GCXONE
- [ ] Stream quality is acceptable
- [ ] Multiple cameras can stream simultaneously
- [ ] Streaming works from remote locations
- [ ] Adaptive quality adjusts based on bandwidth

**Local Mode (if configured):**
- [ ] Local Mode service is running
- [ ] Direct connections work from operator workstation
- [ ] Lower latency compared to cloud streaming
- [ ] Automatic fallback to cloud works
- [ ] Audio quality improved (if applicable)

**Performance:**
- [ ] No excessive buffering or lag
- [ ] Stream starts within 2-3 seconds
- [ ] Multiple concurrent streams work smoothly
- [ ] Bandwidth usage is within expected ranges
- [ ] No connection drops during normal operation

---

## Advanced Configuration

### Multi-Stream Configuration

For devices supporting multiple streams:

1. Configure Primary Stream: High quality for full-screen viewing
2. Configure Secondary Stream: Lower quality for grid views
3. Configure Sub-Stream: Very low quality for thumbnails
4. Set appropriate bitrates for each stream
5. Use stream selection based on viewing context

### Bandwidth Throttling

For sites with limited bandwidth:

1. Enable **Adaptive Quality** for all cameras
2. Set **Bandwidth Limits** in GCXONE settings
3. Use **Secondary Streams** for grid views
4. Limit **Concurrent Streams** per user
5. Implement **Quality Policies** based on time of day

### Failover Configuration

For high-availability requirements:

1. Configure **Primary and Backup Streams**
2. Enable **Automatic Failover** in device settings
3. Set up **Stream Redundancy** in GCXONE
4. Configure **Health Monitoring** for stream availability
5. Test failover scenarios regularly

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **No video**: Check device status, verify credentials, test RTSP connection
- **Poor quality**: Adjust bitrate settings, check bandwidth, verify stream source
- **Buffering**: Reduce quality, check network latency, increase buffer size
- **Connection drops**: Check network stability, verify timeout settings, check firewall
- **Local Mode not working**: Verify service is running, check network access, verify device support

---

## Related Articles

- [Video Streaming Overview](./overview.md)
- [Video Streaming Troubleshooting](./troubleshooting.md)
- 
- 
- [Bandwidth Requirements](/docs/getting-started/bandwidth-requirements)
- 

---

**Need Help?**

If you need assistance with video streaming configuration, [contact support](#).
