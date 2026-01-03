---
title: "Live View Overview"
description: "Complete guide to live video viewing capabilities in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - feature:live-view
sidebar_position: 1
last_updated: 2025-12-21
---

# Live View Overview

## Overview

Live View is the core real-time monitoring feature in GCXONE, providing instant access to live video feeds from all connected cameras and devices. It enables operators to monitor sites in real-time, respond to events immediately, and maintain situational awareness across multiple locations.

**What you'll learn:**
- How live view works in GCXONE
- Key capabilities and features
- Multi-camera viewing options
- Interactive controls and features
- Best practices for live monitoring

## Key Capabilities

### Real-Time Video Streaming

- **Instant Access**: Immediate access to live video feeds
- **Low Latency**: Optimized streaming for minimal delay
- **High Quality**: Support for high-resolution video streams
- **Adaptive Quality**: Automatic quality adjustment based on bandwidth
- **Multi-Protocol**: Support for RTSP, P2P, and manufacturer-specific protocols

### Multi-Camera Monitoring

- **Grid Layouts**: View multiple cameras simultaneously in organized grids
- **Custom Layouts**: Create and save custom camera arrangements
- **Layout Templates**: Use predefined or create custom layout templates
- **Flexible Views**: Switch between single camera and multi-camera views
- **Panoramic Views**: Support for panoramic camera views

### Interactive Controls

- **PTZ Control**: Direct pan-tilt-zoom control from live view (on supported cameras)
- **Audio Controls**: Two-way audio communication (on supported devices)
- **Preset Access**: Quick access to camera preset positions
- **Full-Screen Mode**: Expand camera to full screen for detailed viewing
- **Snapshot**: Capture still images from live video

### Performance Features

- **Local Mode**: Direct P2P streaming for reduced latency
- **Stream Optimization**: Intelligent bandwidth and quality management
- **Concurrent Streams**: Support for multiple simultaneous streams
- **Auto-Refresh**: Automatic stream refresh and reconnection
- **Resource Management**: Efficient use of system resources

## How It Works

### Streaming Architecture

1. **Stream Request**: User selects camera for live view
2. **Connection Establishment**: GCXONE establishes connection to camera/NVR
3. **Stream Initiation**: Device starts video stream
4. **Stream Delivery**: Video streamed to user interface
5. **Display**: Video displayed in browser or application
6. **Continuous Streaming**: Stream maintained for real-time monitoring

### Deployment Models

#### Cloud Streaming
- Video routed through GCXONE cloud infrastructure
- Accessible from anywhere with internet
- Encrypted and secure
- Optimized for remote access

#### Local Mode (P2P)
- Direct connection between workstation and device
- Reduced latency for on-site monitoring
- Lower bandwidth on WAN
- Enhanced performance for operator workstations

## Supported Devices

Live view works with all devices integrated with GCXONE:

- **IP Cameras**: All supported camera manufacturers
- **NVRs**: Network video recorders from all supported vendors
- **VMS Platforms**: Milestone, Avigilon, Digital Watchdog, Genesis VMS, and more
- **Cloud Devices**: NXG Cloud NVR, NXG Cloud Vision Edge
- **Specialized Devices**: Various specialized surveillance devices

## Use Cases

### Real-Time Monitoring
- **Continuous Surveillance**: Monitor sites continuously in real-time
- **Multi-Site Monitoring**: Monitor multiple locations from central location
- **Event Response**: Quickly access cameras during alarms or events
- **Operator Monitoring**: Operator workstations for active surveillance

### Active Surveillance
- **PTZ Operation**: Actively control cameras to follow activity
- **Area Coverage**: Monitor large areas with PTZ cameras
- **Detail Inspection**: Zoom in on specific areas or subjects
- **Interactive Monitoring**: Engage with subjects via audio (if available)

### Situational Awareness
- **Overview Monitoring**: Maintain awareness of overall site status
- **Multi-Camera Views**: Monitor multiple areas simultaneously
- **Custom Layouts**: Organize cameras by area, priority, or function
- **Status Monitoring**: Quick visual verification of site conditions

### Mobile Monitoring
- **Remote Access**: Access live feeds from mobile devices
- **On-the-Go Monitoring**: Monitor sites while away from workstation
- **Mobile App**: Native mobile applications for iOS and Android
- **Touch Controls**: Intuitive touch-based controls on mobile

## Best Practices

### Layout Organization
- **Logical Grouping**: Group cameras by location, function, or priority
- **Consistent Layouts**: Use consistent layouts across shifts
- **Critical Cameras**: Place important cameras in prominent positions
- **Easy Navigation**: Organize for quick access to needed cameras

### Performance Optimization
- **Limit Concurrent Streams**: Don't exceed system capabilities
- **Use Appropriate Quality**: Balance quality vs performance
- **Enable Local Mode**: For on-site workstations when available
- **Close Unused Streams**: Close streams when not needed

### Monitoring Efficiency
- **Use Grid Views**: Monitor multiple areas simultaneously
- **Focus on Critical Areas**: Prioritize important monitoring areas
- **Use Presets**: Quick access to important camera positions
- **Regular Review**: Periodically review all camera views

### Security
- **Secure Access**: Use secure connections (HTTPS)
- **User Authentication**: Ensure proper user authentication
- **Access Control**: Limit access based on user roles
- **Audit Logging**: Monitor access to live view

## Limitations and Considerations

### Network Requirements
- **Bandwidth**: Requires adequate bandwidth for streaming
- **Latency**: Network latency affects real-time viewing
- **Stability**: Stable network connection required
- **Multiple Streams**: More streams require more bandwidth

### System Resources
- **Concurrent Streams**: Limited by system capabilities
- **Performance**: Multiple streams may impact performance
- **Hardware**: Workstation hardware affects performance
- **Browser Performance**: Browser capabilities affect streaming

### Device Capabilities
- **Stream Limits**: Devices have limits on concurrent streams
- **Protocol Support**: Features depend on device protocol support
- **Firmware**: Device firmware affects feature availability
- **Hardware**: Device hardware capabilities affect streaming

## Related Articles

- Live View Configuration
- [Live View Troubleshooting](./troubleshooting.md)
- 
- 
- 

## Need Help?

If you're experiencing issues with live view, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](#).
