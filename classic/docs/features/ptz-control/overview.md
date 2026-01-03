---
title: "PTZ Control Overview"
description: "Complete guide to PTZ (Pan-Tilt-Zoom) control in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - feature:ptz-control
sidebar_position: 1
last_updated: 2025-12-21
---

# PTZ Control Overview

## Overview

PTZ (Pan-Tilt-Zoom) Control enables remote operation of motorized cameras, allowing operators to adjust camera position, angle, and zoom level in real-time from the GCXONE interface. This feature is essential for active surveillance, investigation, and dynamic monitoring scenarios.

**What you'll learn:**
- How PTZ control works in GCXONE
- Supported PTZ operations and capabilities
- Preset positions and tours
- Use cases and best practices

## Key Capabilities

### Basic PTZ Operations

- **Pan**: Horizontal rotation (left/right) - typically ±360° continuous or limited range
- **Tilt**: Vertical rotation (up/down) - typically ±90° or more depending on camera
- **Zoom**: Optical and/or digital zoom for closer views
- **Focus**: Automatic or manual focus control (on supported cameras)
- **Iris**: Aperture control for light management (on supported cameras)

### Advanced Features

- **Preset Positions**: Save and recall up to 255 preset camera positions for quick access to critical viewing angles
- **Preset Tours**: Automated sequences visiting multiple preset positions on a schedule
- **Pattern Recording**: Record and replay movement patterns for consistent monitoring
- **Speed Control**: Adjustable movement speed (1-8, varies by device) for precise positioning
- **Relative Movement**: Move camera by specific increments for fine adjustments
- **Absolute Positioning**: Move camera to exact coordinates (on supported devices)
- **Rectangle PTZ** (Milestone-specific): Draw a rectangle on the screen to optically zoom into that specific area - exclusive to Milestone-integrated PTZ cameras
- **Point to Center** (Milestone-specific): Click a point on the screen to center the camera on that exact spot - exclusive to Milestone-integrated PTZ cameras

### Control Methods

- **On-Screen Controls**: Click-and-drag or directional buttons in GCXONE interface
- **Keyboard Controls**: Arrow keys for pan/tilt, +/- for zoom
- **Mobile App**: Touch-based PTZ controls on mobile devices
- **Preset Selection**: Quick access to saved preset positions

## Supported Devices

PTZ control is supported on:

- **PTZ Cameras**: Motorized cameras with pan-tilt-zoom capabilities
- **PTZ Domes**: Dome cameras with internal PTZ mechanisms
- **Speed Domes**: High-speed PTZ cameras
- **Integrated PTZ**: Cameras with built-in PTZ functionality

**Device Requirements:**
- Camera must have PTZ hardware capabilities
- Device must support PTZ protocol (ONVIF, manufacturer SDK, etc.)
- PTZ functionality must be enabled in device settings
- Appropriate user permissions required

## How It Works

### PTZ Protocol Communication

1. **User Input**: Operator initiates PTZ command via GCXONE interface
2. **Command Translation**: GCXONE translates command to device protocol
3. **Device Communication**: Command sent to camera via network
4. **Camera Execution**: Camera motor executes movement
5. **Feedback**: Camera position/status updated in interface

### Supported Protocols

- **ONVIF PTZ**: Standard protocol for PTZ control
- **Manufacturer SDKs**: Native protocols (Hikvision, Dahua, Axis, etc.)
- **Pelco-D/P**: Legacy protocol support
- **HTTP/HTTPS**: Web-based PTZ control

## Use Cases

### Active Surveillance
- Monitor moving subjects across large areas
- Follow suspicious activity in real-time
- Cover wide areas with single camera
- Respond to alarms by positioning camera on event location

### Investigation
- Review incidents by positioning camera for optimal view
- Zoom in on specific details or areas
- Capture multiple angles of incident scene
- Document evidence with preset positions

### Site Monitoring
- Routinely scan large areas (parking lots, warehouses, perimeters)
- Use preset tours for automated monitoring
- Quickly access critical viewing angles via presets
- Monitor multiple zones with single PTZ camera

### Emergency Response
- Rapidly position camera on alarm location
- Zoom in on emergency situations
- Provide detailed view for security personnel
- Document emergency situations

## Best Practices

### Preset Management
- **Organize Presets**: Use descriptive names (e.g., "Front Entrance", "Parking Lot North")
- **Number Presets**: Assign logical numbers for quick access (1-10 for critical positions)
- **Test Presets**: Regularly verify preset accuracy and adjust if needed
- **Document Presets**: Maintain list of preset positions and their purposes

### Movement Control
- **Use Appropriate Speed**: Faster speed for large movements, slower for precision
- **Avoid Excessive Movement**: Limit rapid movements to reduce wear on camera mechanism
- **Consider Delay**: Account for camera movement time when positioning
- **Use Relative Movement**: For fine adjustments after reaching preset

### Power Management
- **Limit Continuous Movement**: Avoid leaving camera in continuous pan mode unnecessarily
- **Return to Home**: Configure camera to return to default position after inactivity
- **Use Presets**: Reduce wear by using presets instead of manual movement when possible

### Integration with Alarms
- **Configure Alarm Presets**: Set camera to move to preset when alarm triggers
- **Use Alarm Tours**: Create tours that visit alarm locations
- **Automate Response**: Configure automatic PTZ movement based on events

## Limitations and Considerations

### Physical Limitations
- **Movement Range**: Cameras have physical limits to pan/tilt range
- **Movement Speed**: Maximum speed varies by camera model
- **Zoom Limits**: Optical zoom has maximum range; digital zoom reduces quality
- **Wear and Tear**: Excessive use may reduce mechanism lifespan

### Network Considerations
- **Latency**: Network delay affects real-time control responsiveness
- **Bandwidth**: PTZ control uses minimal bandwidth but requires stable connection
- **Local Mode**: P2P connections provide better PTZ responsiveness

### Operational Considerations
- **Concurrent Control**: Only one user should control PTZ at a time per camera
- **Preset Conflicts**: Multiple users changing presets simultaneously may cause conflicts
- **Permission Requirements**: Appropriate user permissions required for PTZ control

## Related Articles

- [PTZ Control Configuration](./configuration.md)
- [PTZ Control Troubleshooting](./troubleshooting.md)
- 
- 

## Need Help?

If you're experiencing issues with PTZ control, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/support).
