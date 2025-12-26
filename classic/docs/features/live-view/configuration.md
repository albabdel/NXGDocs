---
title: "Live View Configuration"
description: "Step-by-step guide to configuring live view in GCXONE"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - feature:live-view
sidebar_position: 2
last_updated: 2025-12-21
---

# Live View Configuration

## Overview

This guide covers the configuration of live view functionality in GCXONE, including stream settings, layout configuration, multi-camera views, and optimization options.

**What you'll accomplish:**
- Configure live view stream settings
- Set up multi-camera grid layouts
- Configure live view preferences
- Optimize live view performance
- Enable advanced features

**Estimated time**: 15-20 minutes

## Prerequisites

Before configuring live view, ensure:

- [ ] Devices are successfully added to GCXONE
- [ ] Video streaming is working correctly
- [ ] Network connectivity is established
- [ ] Devices are online and accessible

---

## Configuration Workflow

1. **Stream Configuration** - Configure live stream settings
2. **Layout Configuration** - Set up camera layouts and grids
3. **Live View Preferences** - Configure user preferences
4. **Performance Optimization** - Optimize for performance
5. **Verification** - Test live view functionality

---

## Part 1: Stream Configuration

### Step 1: Configure Live Stream Settings

**UI Path**: GCXONE → Devices → [Camera] → Camera Configuration → Streaming

**Objective**: Configure live stream quality and settings for optimal viewing.

**Configuration Steps:**

1. Navigate to **Devices** → Select camera
2. Click **Camera Configuration** → **Streaming** tab
3. Configure **Live Stream Settings**:
   - **Stream Quality**: Auto (recommended), High, Medium, or Low
   - **Stream Source**: Primary (full quality) or Secondary (optimized)
   - **Adaptive Quality**: Enable for bandwidth optimization
   - **Resolution**: Verify resolution matches requirements
4. Configure **Stream Options**:
   - **Frame Rate**: Set appropriate FPS (15-30 typical)
   - **Bitrate**: Auto or manual control
   - **Codec**: H.264 or H.265
5. Click **Save Configuration**

**Expected Result**: Live stream configured with appropriate quality settings.

---

### Step 2: Configure Multi-Stream Support

**UI Path**: GCXONE → Devices → [Camera] → Camera Configuration → Streaming

**Objective**: Configure primary and secondary streams for different viewing contexts.

**Configuration Steps:**

1. Navigate to camera **Streaming** configuration
2. Configure **Primary Stream** (for full-screen viewing):
   - **Resolution**: Maximum resolution (e.g., 1920x1080)
   - **Frame Rate**: 30 FPS for smooth viewing
   - **Bitrate**: Higher bitrate for quality
3. Configure **Secondary Stream** (for grid views):
   - **Resolution**: Lower resolution (e.g., 640x480)
   - **Frame Rate**: 15 FPS sufficient
   - **Bitrate**: Lower bitrate for bandwidth efficiency
4. Enable **Auto Stream Selection**: GCXONE automatically uses appropriate stream
5. Click **Save Configuration**

**Expected Result**: Multi-stream configuration optimized for different viewing scenarios.

---

## Part 2: Layout Configuration

### Step 3: Create Camera Layouts

**UI Path**: GCXONE → Live View → Layouts → Create Layout

**Objective**: Create custom camera layouts for organized viewing.

**Configuration Steps:**

1. Navigate to **Live View** → **Layouts**
2. Click **Create Layout** or **New Layout**
3. Configure **Layout Settings**:
   - **Layout Name**: Descriptive name (e.g., "Entrance Cameras", "Perimeter View")
   - **Grid Size**: Select grid size (1x1, 2x2, 3x3, 4x4, custom)
   - **Layout Type**: Grid, Custom, or Panoramic
4. **Add Cameras to Layout**:
   - Drag cameras to layout positions
   - Or select cameras and assign positions
   - Arrange cameras logically
5. **Configure Layout Options**:
   - **Auto-Refresh**: Enable automatic updates
   - **Display Names**: Show camera names on layout
   - **Status Indicators**: Show online/offline status
6. Click **Save Layout**

**Expected Result**: Custom layout created and ready to use.

---

### Step 4: Configure Default Layouts

**UI Path**: GCXONE → Settings → Live View → Default Layouts

**Objective**: Set default layouts for different users or roles.

**Configuration Steps:**

1. Navigate to **Settings** → **Live View** → **Default Layouts**
2. Configure **User Defaults**:
   - Select user or role
   - Set default layout for that user
   - Configure layout preferences
3. Configure **Site Defaults**:
   - Set default layout per site/location
   - Configure location-based layouts
4. Configure **Device Group Defaults**:
   - Set layouts for device groups
   - Organize by device type or function
5. Click **Save Defaults**

**Expected Result**: Default layouts configured for users and contexts.

---

## Part 3: Live View Preferences

### Step 5: Configure Global Live View Settings

**UI Path**: GCXONE → Settings → Live View → Preferences

**Objective**: Configure platform-wide live view preferences.

**Configuration Steps:**

1. Navigate to **Settings** → **Live View** → **Preferences**
2. Configure **Display Settings**:
   - **Default Quality**: Auto, High, Medium, or Low
   - **Default Layout**: Select default layout
   - **Auto-Start Streams**: Enable/disable auto-start
   - **Show Timestamps**: Enable timestamp overlay
3. Configure **Performance Settings**:
   - **Maximum Concurrent Streams**: Limit per user/workstation
   - **Stream Buffer Size**: Adjust buffer settings
   - **Refresh Interval**: Set update frequency
4. Configure **User Interface**:
   - **Control Visibility**: Show/hide specific controls
   - **Camera Labels**: Display camera names
   - **Status Indicators**: Show connection status
5. Click **Save Preferences**

**Expected Result**: Global live view preferences configured.

---

### Step 6: Configure User-Specific Preferences

**UI Path**: GCXONE → User Profile → Live View Settings

**Objective**: Allow users to customize their live view experience.

**Configuration Steps:**

1. User navigates to their **Profile** → **Live View Settings**
2. Configure **Personal Preferences**:
   - **Preferred Layout**: Select favorite layout
   - **Default Quality**: Personal quality preference
   - **Auto-Start**: Enable/disable auto-start streams
3. Configure **Display Options**:
   - **Show/Hide Elements**: Customize interface
   - **Camera Organization**: Personal camera groupings
   - **Layout Preferences**: Preferred grid sizes
4. Save preferences

**Expected Result**: Users can customize their live view experience.

---

## Part 4: Performance Optimization

### Step 7: Optimize Live View Performance

**UI Path**: GCXONE → Settings → Live View → Performance

**Objective**: Optimize live view for best performance based on system capabilities.

**Configuration Steps:**

1. Navigate to **Settings** → **Live View** → **Performance**
2. Configure **Stream Limits**:
   - **Max Streams per User**: Set limit based on bandwidth
   - **Max Streams per Workstation**: Limit for hardware
   - **Quality Based Limits**: Different limits by quality
3. Configure **Bandwidth Management**:
   - **Enable Adaptive Quality**: Automatic quality adjustment
   - **Bandwidth Thresholds**: Set quality change triggers
   - **Prioritize Critical Streams**: Prioritize important cameras
4. Configure **Resource Management**:
   - **Stream Preloading**: Preload frequently viewed cameras
   - **Auto-Close Inactive**: Close streams after inactivity
   - **Memory Management**: Optimize memory usage
5. Click **Save Settings**

**Expected Result**: Live view performance optimized.

---

### Step 8: Enable Local Mode for Better Performance

**UI Path**: GCXONE → Settings → Local Mode

**Objective**: Enable Local Mode for reduced latency and better performance on operator workstations.

**Configuration Steps:**

1. Navigate to **Settings** → **Local Mode**
2. Enable **Local Mode**:
   - **Enable Local Mode**: ✓ Checked
   - **Auto-Discovery**: Enable device discovery
   - **Prefer Local**: Prefer local streams when available
3. Configure **Local Mode Settings**:
   - **Network Ranges**: Define local network ranges
   - **Fallback Behavior**: Cloud fallback if local unavailable
4. Verify **Local Mode Service**:
   - Ensure Local Mode service installed on workstations
   - Verify service is running
   - Test local connections
5. Click **Save Configuration**

**Expected Result**: Local Mode enabled for improved performance.

---

## Part 5: Verification and Testing

### Verification Checklist

**Basic Live View:**
- [ ] Individual camera streams display correctly
- [ ] Stream quality is acceptable
- [ ] Stream starts within reasonable time (2-3 seconds)
- [ ] No excessive buffering or lag
- [ ] Audio works (if applicable)

**Multi-Camera Views:**
- [ ] Grid layouts display correctly
- [ ] Multiple cameras stream simultaneously
- [ ] Layouts can be created and saved
- [ ] Switching between layouts works smoothly
- [ ] Camera labels and status indicators show correctly

**Performance:**
- [ ] Concurrent streams work without issues
- [ ] Performance is acceptable with multiple streams
- [ ] Bandwidth usage is reasonable
- [ ] System resources are used efficiently
- [ ] No performance degradation over time

**Advanced Features:**
- [ ] PTZ controls work from live view (if applicable)
- [ ] Audio controls work (if applicable)
- [ ] Full-screen mode works correctly
- [ ] Layout customization works
- [ ] User preferences are saved and applied

---

## Advanced Configuration

### Custom Layout Templates

Create reusable layout templates:

1. **Create Template**: Design layout structure
2. **Assign to Sites**: Apply templates to specific sites
3. **Role-Based Templates**: Different templates per role
4. **Dynamic Layouts**: Layouts that adapt based on available cameras

### Stream Prioritization

Prioritize important cameras:

1. **Define Priorities**: Assign priority levels to cameras
2. **Quality Allocation**: Higher quality for priority cameras
3. **Bandwidth Allocation**: Allocate bandwidth based on priority
4. **Resource Allocation**: Allocate system resources accordingly

---

## Troubleshooting

See the [Troubleshooting Guide](./troubleshooting.md) for common problems and solutions.

**Quick troubleshooting:**
- **Streams not starting**: Check device status, verify streaming configuration, check network
- **Poor quality**: Adjust quality settings, check bandwidth, verify stream source
- **Performance issues**: Limit concurrent streams, enable Local Mode, optimize quality
- **Layouts not saving**: Check permissions, verify layout configuration, clear cache

---

## Related Articles

- [Live View Overview](./overview.md)
- [Live View Troubleshooting](./troubleshooting.md)
- [Video Streaming Configuration](/docs/features/video-streaming/configuration.md)
- [Local Mode Overview](/docs/features/local-mode/overview.md)

---

**Need Help?**

If you need assistance with live view configuration, [contact support](/docs/support).
