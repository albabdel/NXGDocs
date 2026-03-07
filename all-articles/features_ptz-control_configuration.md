---
title: "PTZ Control Configuration"
description: "Step-by-step guide to configuring PTZ control in GCXONE"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - feature:ptz-control
sidebar_position: 2
last_updated: 2025-12-21
---

# PTZ Control Configuration

## Overview

This guide covers the configuration of PTZ (Pan-Tilt-Zoom) control for cameras in GCXONE, including device-side setup, GCXONE platform configuration, preset management, and optimization.

**What you'll accomplish:**
- Configure PTZ functionality on camera device
- Enable PTZ control in GCXONE
- Create and manage preset positions
- Configure preset tours
- Set up PTZ automation rules
- Optimize PTZ performance

**Estimated time**: 20-30 minutes per PTZ camera

## Prerequisites

Before configuring PTZ control, ensure:

- [ ] PTZ camera is successfully added to GCXONE
- [ ] Camera hardware supports PTZ functionality
- [ ] Device is online and accessible
- [ ] Video streaming is working correctly
- [ ] Appropriate user permissions are available

---

## Configuration Workflow

1. **Device-Level PTZ Configuration** - Enable and configure PTZ on camera
2. **GCXONE PTZ Settings** - Configure PTZ in GCXONE platform
3. **Preset Configuration** - Create and organize preset positions
4. **Preset Tours** - Configure automated tours (if supported)
5. **PTZ Automation** - Set up alarm-triggered PTZ movements
6. **Verification** - Test PTZ functionality

---

## Part 1: Device-Level PTZ Configuration

### Step 1: Enable PTZ on Camera Device

**UI Path**: Device Web Interface → PTZ Settings / Camera Control

**Objective**: Enable and configure PTZ functionality on the camera.

**Configuration Steps:**

1. Access the camera's web interface
2. Navigate to **PTZ Settings** or **Camera Control**
3. Enable **PTZ Function**:
   - **PTZ Enable**: ✓ Checked
   - **PTZ Protocol**: Select appropriate protocol (ONVIF, manufacturer-specific)
   - **PTZ Address**: Verify address (typically 1 or auto-detect)
4. Configure **Movement Limits** (if applicable):
   - **Pan Range**: Set minimum/maximum pan angles (if limited)
   - **Tilt Range**: Set minimum/maximum tilt angles
   - **Speed Limits**: Configure maximum movement speeds
5. Configure **PTZ Parameters**:
   - **Idle Time**: Time before camera returns to home position (optional)
   - **Home Position**: Define default/home position
   - **Preset Count**: Maximum number of presets (typically 255)
6. Click **Save** or **Apply**

**Note**: Exact navigation varies by manufacturer. Refer to device documentation.

**Expected Result**: PTZ functionality enabled on device.

---

### Step 2: Configure PTZ Protocol Settings

**UI Path**: Device Web Interface → Network → PTZ / Protocol Settings

**Objective**: Ensure PTZ protocol is properly configured for GCXONE communication.

**Configuration Steps:**

1. Navigate to **Network Settings** → **PTZ** or **Protocol Settings**
2. Verify **PTZ Protocol**:
   - **ONVIF PTZ**: Enable if using ONVIF (recommended for compatibility)
   - **Manufacturer Protocol**: Enable native protocol if available
   - **Port**: Verify PTZ control port (typically same as device HTTP port)
3. Configure **PTZ User Permissions**:
   - Ensure integration user has PTZ control permissions
   - Verify user role includes PTZ operations
4. Test PTZ from device interface:
   - Use device's PTZ controls to verify functionality
   - Test pan, tilt, and zoom operations
   - Verify preset save/recall works
5. Click **Save**

**Expected Result**: PTZ protocol configured and tested.

---

## Part 2: GCXONE Platform PTZ Configuration

### Step 3: Enable PTZ Control in GCXONE

**UI Path**: GCXONE → Devices → [Camera Name] → Camera Configuration → PTZ Settings

**Objective**: Enable and configure PTZ control for camera in GCXONE.

**Configuration Steps:**

1. Log into **GCXONE** web portal
2. Navigate to **Devices** → Select your PTZ camera
3. Click **Camera Configuration** or **Configure Camera**
4. Navigate to **PTZ Settings** tab
5. Enable **PTZ Control**:
   - **Enable PTZ**: ✓ Checked
   - **PTZ Protocol**: Select protocol (Auto-detect or specific)
   - **Test PTZ Connection**: Click to verify communication
6. Configure **PTZ Options**:
   - **Default Speed**: Set default movement speed (1-8, varies by device)
   - **Zoom Speed**: Set zoom speed (if adjustable)
   - **Invert Controls**: Enable if needed for camera orientation
   - **Relative Movement**: Enable for incremental movement
7. Configure **Advanced Settings**:
   - **Control Timeout**: Time before control released (if multiple users)
   - **Preset Support**: Verify preset count matches device
   - **Tour Support**: Enable if device supports tours
8. Click **Save Configuration**

**Expected Result**: PTZ control enabled and configured in GCXONE.

---

### Step 4: Configure PTZ User Permissions

**UI Path**: GCXONE → Settings → User Management → [User] → Permissions

**Objective**: Ensure users have appropriate PTZ control permissions.

**Configuration Steps:**

1. Navigate to **Settings** → **User Management**
2. Select user or role to configure
3. Navigate to **Permissions** or **Feature Access**
4. Enable **PTZ Control** permissions:
   - **View PTZ Controls**: ✓ Enable (to see PTZ interface)
   - **Control PTZ**: ✓ Enable (to operate camera)
   - **Manage Presets**: ✓ Enable (to create/edit presets)
   - **Control Tours**: ✓ Enable (if using tours)
5. Configure **PTZ Restrictions** (if needed):
   - **Allowed Cameras**: Restrict to specific cameras
   - **Time Restrictions**: Limit PTZ control to specific times
   - **Preset Restrictions**: Limit preset management
6. Click **Save Permissions**

**Expected Result**: Users have appropriate PTZ permissions.

---

## Part 3: Preset Configuration

### Step 5: Create Preset Positions

**UI Path**: GCXONE → Live View → [PTZ Camera] → PTZ Controls → Presets

**Objective**: Create and save preset camera positions for quick access.

**Configuration Steps:**

1. Navigate to **Live View** in GCXONE
2. Select PTZ camera to configure
3. Open **PTZ Controls** panel (if not visible)
4. Use PTZ controls to position camera:
   - **Pan/Tilt**: Move camera to desired position
   - **Zoom**: Zoom to desired level
   - **Focus**: Adjust focus if needed
5. Once positioned correctly:
   - Click **Save Preset** or **+** button
   - Enter **Preset Name**: Descriptive name (e.g., "Front Entrance", "Parking Lot North")
   - Enter **Preset Number**: Optional number (1-255)
   - Click **Save** or **OK**
6. Verify preset saved:
   - Preset should appear in preset list
   - Test recalling preset to verify position

**Best Practices for Presets:**
- Use descriptive names that indicate location or purpose
- Number critical presets sequentially (1-10) for quick access
- Test each preset after creation
- Document preset purposes for reference
- Update presets if camera position changes

**Expected Result**: Preset positions created and accessible.

---

### Step 6: Organize and Manage Presets

**UI Path**: GCXONE → Devices → [Camera] → PTZ Settings → Preset Management

**Objective**: Organize, edit, and manage preset positions.

**Configuration Steps:**

1. Navigate to camera **PTZ Settings** → **Preset Management**
2. View list of all saved presets
3. **Edit Preset**:
   - Click on preset name
   - Update name if needed
   - Option to reposition and save
4. **Reorder Presets**:
   - Drag and drop to reorder (if supported)
   - Or renumber for logical organization
5. **Delete Preset**:
   - Select preset to delete
   - Click **Delete** and confirm
6. **Export/Import Presets** (if supported):
   - Export preset list for backup
   - Import presets to duplicate on other cameras

**Expected Result**: Presets organized and managed effectively.

---

## Part 4: Preset Tours Configuration

### Step 7: Create Preset Tours (if supported)

**UI Path**: GCXONE → Devices → [Camera] → PTZ Settings → Tours

**Objective**: Configure automated tours that visit multiple preset positions.

**Configuration Steps:**

1. Navigate to **PTZ Settings** → **Tours**
2. Click **Create Tour** or **Add Tour**
3. Configure **Tour Settings**:
   - **Tour Name**: Descriptive name (e.g., "Perimeter Scan", "Entrance Check")
   - **Tour Duration**: Total time for tour
   - **Repeat**: Enable continuous repeat or one-time
4. **Add Presets to Tour**:
   - Select presets to include in tour
   - Set **Dwell Time**: Time to stay at each preset (seconds)
   - Set **Movement Speed**: Speed between presets
   - Reorder presets to define tour sequence
5. Configure **Tour Options**:
   - **Start Position**: Begin at first preset or current position
   - **End Behavior**: Return to start, stay at end, or go to home
   - **Interruptible**: Allow manual PTZ to interrupt tour
6. Click **Save Tour**

**Expected Result**: Preset tour created and ready to use.

---

### Step 8: Configure Tour Automation

**UI Path**: GCXONE → Settings → Automation → PTZ Tours

**Objective**: Automate tour execution based on schedule or events.

**Configuration Steps:**

1. Navigate to **Settings** → **Automation** → **PTZ Tours**
2. Create **Tour Schedule**:
   - Select tour to schedule
   - Set **Schedule**: Time of day, days of week
   - Set **Duration**: How long tour runs
3. Configure **Event-Triggered Tours**:
   - Select tour
   - Set **Trigger**: Alarm type, time period, manual
   - Configure **Conditions**: When tour should run
4. Set **Tour Priorities**:
   - Define which tours can interrupt others
   - Set manual control priority over tours
5. Click **Save Automation**

**Expected Result**: Tours automated based on schedule/events.

---

## Part 5: PTZ Automation Rules

### Step 9: Configure Alarm-Triggered PTZ Movements

**UI Path**: GCXONE → Settings → Automation → PTZ Rules

**Objective**: Automatically move PTZ camera to preset when alarm triggers.

**Configuration Steps:**

1. Navigate to **Settings** → **Automation** → **PTZ Rules**
2. Click **Create Rule** or **Add Rule**
3. Configure **Rule Conditions**:
   - **Trigger**: Select alarm type or event
   - **Camera/Sensor**: Select which sensor triggers rule
   - **Time Conditions**: Optional time restrictions
4. Configure **PTZ Action**:
   - **Target Camera**: Select PTZ camera to control
   - **Action**: Move to preset, start tour, or specific movement
   - **Preset**: Select preset position (if applicable)
5. Configure **Rule Options**:
   - **Delay**: Optional delay before action
   - **Duration**: How long to stay at preset
   - **Return Behavior**: Return to previous position or stay
6. Click **Save Rule**

**Example Rule**: "When motion detected at Front Door sensor, move PTZ camera to Preset 1 (Front Entrance) for 60 seconds, then return to home position."

**Expected Result**: Alarm-triggered PTZ automation configured.

---

## Part 6: Verification and Testing

### Verification Checklist

**Basic PTZ Control:**
- [ ] Pan left/right works correctly
- [ ] Tilt up/down works correctly
- [ ] Zoom in/out works correctly
- [ ] Focus control works (if applicable)
- [ ] Movement speed is appropriate
- [ ] Controls are responsive

**Preset Functionality:**
- [ ] Can save new presets
- [ ] Presets recall to correct positions
- [ ] Preset names are descriptive
- [ ] Can edit existing presets
- [ ] Can delete presets
- [ ] Presets are organized logically

**Advanced Features:**
- [ ] Preset tours work (if supported)
- [ ] Tours visit all presets in sequence
- [ ] Tours can be interrupted and resumed
- [ ] Alarm-triggered PTZ movements work
- [ ] Automation rules execute correctly

**Performance:**
- [ ] PTZ response time is acceptable
- [ ] No lag or delay in control
- [ ] Movement is smooth
- [ ] Camera reaches preset positions accurately
- [ ] Multiple users can access (with proper controls)

---

## Advanced Configuration

### Multi-Camera PTZ Coordination

For sites with multiple PTZ cameras:

1. **Coordinate Presets**: Use consistent preset numbering across cameras
2. **Synchronized Tours**: Configure tours that coordinate multiple cameras
3. **Master/Slave Setup**: Configure one camera to follow another's movement
4. **Preset Groups**: Group related presets across cameras for quick access

### PTZ Performance Optimization

1. **Network Optimization**: Use Local Mode for better PTZ responsiveness
2. **Speed Settings**: Adjust speed based on use case (faster for large movements, slower for precision)
3. **Preset Optimization**: Limit number of active presets if device has limitations
4. **Control Timeout**: Set appropriate timeout to prevent conflicts between users

---

## Troubleshooting

See the Troubleshooting Guide for common problems and solutions.

**Quick troubleshooting:**
- **PTZ not working**: Verify PTZ enabled on device, check protocol settings, verify user permissions
- **Presets not saving**: Check preset count limit, verify permissions, check device storage
- **Slow response**: Check network latency, use Local Mode if available, verify device performance
- **Movement inaccurate**: Calibrate camera, check for mechanical issues, verify preset positions

---

## Related Articles

- [PTZ Control Overview](./overview.md)
- PTZ Control Troubleshooting
- 
- 

---

**Need Help?**

If you need assistance with PTZ configuration, [contact support](#).
