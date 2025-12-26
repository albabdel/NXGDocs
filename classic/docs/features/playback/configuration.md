---
title: "Playback Configuration"
description: "Step-by-step guide to configuring video playback in GCXONE"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - feature:playback
sidebar_position: 2
last_updated: 2025-12-21
---

# Playback Configuration

## Overview

This guide covers the configuration of video playback in GCXONE, including device recording setup, timeline configuration, playback preferences, and optimization settings.

**What you'll accomplish:**
- Configure device recording for playback
- Set up time synchronization for accurate timelines
- Configure playback preferences in GCXONE
- Enable event markers and timeline features
- Optimize playback performance
- Configure video export settings

**Estimated time**: 20-30 minutes

## Prerequisites

Before configuring playback, ensure:

- [ ] Devices are successfully added to GCXONE
- [ ] Devices have recording capabilities
- [ ] Network connectivity is established
- [ ] Time synchronization (NTP) is configured
- [ ] Storage is available on recording devices

---

## Configuration Workflow

1. **Device Recording Configuration** - Enable and configure recording on devices
2. **Time Synchronization** - Ensure accurate timeline alignment
3. **GCXONE Playback Settings** - Configure playback preferences
4. **Event Markers Configuration** - Enable event markers on timeline
5. **Playback Optimization** - Fine-tune performance settings
6. **Verification** - Test playback functionality

---

## Part 1: Device Recording Configuration

### Step 1: Enable Recording on Devices

**UI Path**: Device Web Interface → Recording Settings

**Objective**: Enable and configure recording on cameras/NVRs for playback.

**Configuration Steps:**

1. Access device web interface or management software
2. Navigate to **Recording Settings** or **Storage Settings**
3. Enable **Recording**:
   - **Recording Mode**: Continuous, Event-based, or Scheduled
   - **Recording Schedule**: Configure when recording should occur
   - **Pre-Record**: Enable buffer before events (5-10 seconds recommended)
   - **Post-Record**: Enable buffer after events (5-10 seconds recommended)
4. Configure **Recording Quality**:
   - **Resolution**: Set recording resolution
   - **Frame Rate**: Set frames per second (15-30 FPS typical)
   - **Bitrate**: Configure bitrate for recording quality
   - **Codec**: H.264 or H.265 (H.265 for better compression)
5. Configure **Storage Settings**:
   - **Storage Location**: Select storage device (HDD, SD card, NAS)
   - **Retention Period**: Set how long recordings are kept
   - **Storage Allocation**: Configure space allocation
6. Click **Save** or **Apply**

**Expected Result**: Recording enabled and configured on device.

---

### Step 2: Configure Recording Schedule (if needed)

**UI Path**: Device Web Interface → Recording → Schedule

**Objective**: Set up recording schedules for specific times or days.

**Configuration Steps:**

1. Navigate to **Recording Schedule**
2. Configure **Schedule**:
   - **Time Periods**: Define when recording should occur
   - **Days of Week**: Select days for schedule
   - **Recording Type**: Continuous or event-based for each period
3. Set **Multiple Schedules** (if needed):
   - Different schedules for different times
   - Weekend vs weekday schedules
   - Business hours vs after-hours
4. Click **Save Schedule**

**Expected Result**: Recording schedule configured.

---

## Part 2: Time Synchronization

### Step 3: Configure NTP Time Synchronization

**UI Path**: Device Web Interface → System → Time Settings / NTP

**Objective**: Ensure accurate time synchronization for proper timeline alignment.

**Configuration Steps:**

1. Navigate to **System Settings** → **Time** or **NTP Settings**
2. Configure **NTP Server**:
   - **NTP Server**: `timel.nxgen.cloud` (GCXONE NTP server)
   - **Alternate NTP Server**: Secondary server (optional)
   - **Time Zone**: Select correct time zone
   - **Daylight Saving**: Enable if applicable
3. Enable **Auto Synchronization**:
   - **Sync Interval**: Set sync frequency (daily or more frequent)
   - **Auto Sync**: Enable automatic time synchronization
4. Verify **Time Sync**:
   - Check current time matches system time
   - Verify time zone is correct
   - Test NTP connection
5. Click **Save** or **Apply**

**Critical**: Time synchronization is essential for accurate timeline alignment across multiple cameras. Incorrect time will cause events and recordings to be misaligned.

**Expected Result**: Time synchronized with NTP server.

---

### Step 4: Verify Time Synchronization in GCXONE

**UI Path**: GCXONE → Devices → [Device] → System Information

**Objective**: Verify devices are properly synchronized.

**Verification Steps:**

1. Navigate to device **System Information** in GCXONE
2. Check **System Time**: Verify matches current time
3. Check **Time Zone**: Verify correct time zone
4. Check **NTP Status**: Verify NTP synchronization is active
5. Compare **Multiple Devices**: Verify all devices show same time (within seconds)

**Expected Result**: All devices synchronized to same time.

---

## Part 3: GCXONE Playback Settings

### Step 5: Configure Playback Preferences

**UI Path**: GCXONE → Settings → Playback Preferences

**Objective**: Configure global playback settings and preferences.

**Configuration Steps:**

1. Navigate to **Settings** → **Playback Preferences**
2. Configure **Default Settings**:
   - **Default Playback Speed**: Set default speed (1x recommended)
   - **Default Quality**: Auto, High, Medium, or Low
   - **Timeline Display**: Configure timeline appearance
   - **Event Markers**: Enable event markers on timeline
3. Configure **Performance Settings**:
   - **Concurrent Playback Limit**: Maximum simultaneous playback streams
   - **Buffer Size**: Adjust playback buffer (default usually fine)
   - **Preload Duration**: How much video to preload
4. Configure **Timeline Settings**:
   - **Timeline Granularity**: Detail level on timeline
   - **Event Marker Display**: Which events to show
   - **Gap Indication**: How to display recording gaps
5. Click **Save Preferences**

**Expected Result**: Playback preferences configured.

---

### Step 6: Enable Event Markers

**UI Path**: GCXONE → Settings → Events → Timeline Markers

**Objective**: Enable event markers on playback timeline for easy navigation.

**Configuration Steps:**

1. Navigate to **Settings** → **Events** → **Timeline Markers**
2. Enable **Event Types** to show on timeline:
   - **Motion Detection**: ✓ Enable
   - **Alarms**: ✓ Enable
   - **Camera Events**: ✓ Enable (disconnection, etc.)
   - **System Events**: ✓ Enable (if needed)
   - **Custom Events**: Enable specific event types
3. Configure **Marker Display**:
   - **Marker Style**: Choose visual style
   - **Marker Density**: How many markers to show
   - **Marker Colors**: Color coding by event type
4. Configure **Event Details**:
   - **Show Event Names**: Enable to show event descriptions
   - **Show Event Count**: Show number of events in period
   - **Click to Navigate**: Enable click-to-jump functionality
5. Click **Save Configuration**

**Expected Result**: Event markers enabled and visible on timeline.

---

## Part 4: Playback Optimization

### Step 7: Configure Playback Performance

**UI Path**: GCXONE → Settings → Playback → Performance

**Objective**: Optimize playback performance based on network and system capabilities.

**Configuration Steps:**

1. Navigate to **Settings** → **Playback** → **Performance**
2. Configure **Bandwidth Management**:
   - **Adaptive Quality**: Enable for bandwidth optimization
   - **Quality Priority**: Prioritize quality vs performance
   - **Bandwidth Limit**: Set maximum bandwidth per playback
3. Configure **Streaming Settings**:
   - **Prefer Local Mode**: Enable for on-site workstations
   - **Fallback Quality**: Quality to use if bandwidth limited
   - **Retry Logic**: Configure reconnection attempts
4. Configure **Resource Limits**:
   - **Maximum Concurrent Streams**: Limit per user/workstation
   - **Memory Allocation**: Adjust if system has limitations
   - **CPU Priority**: Adjust playback priority if needed
5. Click **Save Settings**

**Expected Result**: Playback performance optimized.

---

### Step 8: Configure Video Export Settings

**UI Path**: GCXONE → Settings → Playback → Export

**Objective**: Configure video clip export options.

**Configuration Steps:**

1. Navigate to **Settings** → **Playback** → **Export**
2. Configure **Export Formats**:
   - **Default Format**: MP4, AVI, or other supported formats
   - **Codec Options**: H.264, H.265, etc.
   - **Quality Presets**: High, Medium, Low quality options
3. Configure **Export Options**:
   - **Include Audio**: Enable if audio should be included
   - **Include Timestamp**: Enable timestamp overlay
   - **Include Event Markers**: Include markers in exported video
4. Configure **Storage**:
   - **Export Location**: Where to save exports
   - **Temporary Storage**: Location for processing
   - **Retention**: How long to keep exported clips
5. Click **Save Settings**

**Expected Result**: Video export configured.

---

## Part 5: Verification and Testing

### Verification Checklist

**Recording Functionality:**
- [ ] Recordings are being created on devices
- [ ] Recordings are accessible from GCXONE
- [ ] Timeline shows available recordings
- [ ] No recording gaps (or gaps are expected)

**Timeline Functionality:**
- [ ] Timeline displays correctly
- [ ] Timeline is synchronized across cameras
- [ ] Event markers appear on timeline
- [ ] Can navigate to specific times
- [ ] Calendar navigation works

**Playback Functionality:**
- [ ] Video playback starts correctly
- [ ] Playback controls work (play, pause, speed)
- [ ] Frame-by-frame navigation works
- [ ] Jump to time/event works
- [ ] Multi-camera synchronized playback works

**Performance:**
- [ ] Playback starts within reasonable time (2-5 seconds)
- [ ] No excessive buffering
- [ ] Multiple concurrent streams work
- [ ] Quality is acceptable

**Export Functionality:**
- [ ] Can export video clips
- [ ] Export quality is correct
- [ ] Exported clips download successfully
- [ ] Clips play correctly after export

---

## Advanced Configuration

### Multi-Camera Timeline Synchronization

For sites with multiple cameras:

1. **Time Sync**: Ensure all devices use same NTP server
2. **Event Correlation**: Enable cross-camera event correlation
3. **Timeline View**: Use unified timeline view for all cameras
4. **Synchronized Playback**: Enable synchronized multi-camera playback

### Recording Retention Policies

Configure retention based on requirements:

1. **Compliance Requirements**: Set retention based on legal/compliance needs
2. **Storage Capacity**: Balance retention period with available storage
3. **Event-Based Retention**: Keep event recordings longer than continuous
4. **Archive Policies**: Configure automatic archiving for long-term storage

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **No recordings available**: Check recording enabled, verify storage, check retention period
- **Timeline misaligned**: Verify NTP synchronization, check time zones
- **Playback not starting**: Check device connectivity, verify recordings exist, check permissions
- **Poor playback quality**: Adjust quality settings, check bandwidth, use Local Mode
- **Events not showing**: Verify event forwarding enabled, check event marker configuration

---

## Related Articles

- [Playback Overview](./overview.md)
- [Playback Troubleshooting](./troubleshooting.md)
- [NTP Configuration](/docs/getting-started/ntp-configuration.md)
- [Video Streaming Configuration](/docs/features/video-streaming/configuration.md)
- [Event Clips Configuration](/docs/features/event-clips/configuration.md)

---

**Need Help?**

If you need assistance with playback configuration, [contact support](/docs/support).
