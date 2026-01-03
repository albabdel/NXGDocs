---
title: "Video Streaming Overview"
description: "Complete guide to video streaming capabilities in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - feature:video-streaming
sidebar_position: 1
last_updated: 2025-12-21
---

# Video Streaming Overview

## Overview

Video Streaming is a core feature of GCXONE that enables real-time video delivery from integrated cameras and devices. The platform supports multiple streaming protocols and deployment models to provide optimal video quality and performance across different network conditions.

**What you'll learn:**
- How video streaming works in GCXONE
- Supported streaming protocols and deployment models
- Key capabilities and features
- Use cases and best practices

## Key Capabilities

### Multi-Protocol Support

GCXONE supports various streaming protocols to ensure compatibility with different device types:

- **RTSP (Real-Time Streaming Protocol)**: Industry-standard protocol for IP cameras
- **P2P (Peer-to-Peer)**: Direct streaming via Local Mode for reduced latency and enhanced performance
- **HLS (HTTP Live Streaming)**: Adaptive streaming for compatible devices (e.g., Camect)
- **TCP JPEG/Raw**: Used for Milestone VMS integrations for optimal performance
- **Manufacturer SDKs**: Native protocols for devices like Milestone (MIP Component SDK), Avigilon, Hikvision (HikProConnect), Dahua (DoLynk)
- **WebSocket Streaming**: Real-time streaming for web applications
- **Low Bandwidth Mode**: Optimized streaming for constrained network conditions

### Streaming Modes

#### Cloud Streaming
- Video routed through GCXONE cloud infrastructure
- Accessible from anywhere with internet connection
- Encrypted and secure transmission
- Optimized bandwidth usage with adaptive quality

#### Local Mode (P2P Streaming)
- Direct connection between operator workstation and device
- Minimal latency for critical monitoring
- Reduced bandwidth on WAN connection
- Enhanced audio quality via local SDK
- Requires Local Mode service installation

### Stream Quality Management

**GreenStream (Adaptive Streaming)**: GCXONE's intelligent streaming technology automatically selects the best matching video stream resolution based on the size of the viewing window on the operator's screen. This significantly decreases the load on the operator's CPU and GPU while optimizing bandwidth usage.

Quality options include:
- **Auto (GreenStream)**: Automatically adjusts resolution based on viewport size and network conditions (recommended)
- **High**: Maximum quality available for full-screen viewing
- **Medium**: Balanced quality and bandwidth for grid views
- **Low**: Optimized for limited bandwidth scenarios

GCXONE automatically adjusts stream quality based on:
- Viewport/window size (GreenStream technology)
- Available network bandwidth
- Device capabilities
- Connection type (cloud vs. local)
- Number of concurrent streams

## How It Works

### Cloud Streaming Architecture

1. **Device Connection**: Camera/NVR establishes connection to GCXONE platform
2. **Stream Initiation**: User requests live view from GCXONE interface
3. **Stream Routing**: GCXONE requests video stream from device
4. **Stream Processing**: Video is transcoded and optimized if needed
5. **Delivery**: Stream delivered to user's browser/app with encryption

### Local Mode Architecture

1. **Local Mode Service**: Installed on operator workstation
2. **Discovery**: Service discovers devices on local network
3. **Direct Connection**: Workstation establishes P2P connection to device
4. **Stream Delivery**: Video streamed directly, bypassing cloud
5. **Fallback**: Automatically falls back to cloud if local connection fails

## Supported Devices

Video streaming is supported across all device types integrated with GCXONE:

- **IP Cameras**: Axis, Hikvision, Dahua, Hanwha, and more
- **NVRs**: All supported NVR manufacturers
- **VMS Platforms**: Milestone, Avigilon, Digital Watchdog, Genesis VMS
- **Cloud Devices**: NXG Cloud NVR, NXG Cloud Vision Edge
- **Specialized Devices**: Camect, Reconeyez, and others

## Use Cases

### Real-Time Monitoring
- Live surveillance of multiple locations
- Multi-camera grid views
- Mobile monitoring via mobile app
- Operator workstation monitoring

### Critical Response
- Rapid access to live feeds during alarms
- Low-latency streaming for time-sensitive situations
- Multiple operators viewing same camera simultaneously
- Priority streaming for emergency situations

### Remote Access
- Access cameras from anywhere
- Secure remote monitoring
- Mobile workforce monitoring
- After-hours surveillance

## Deployment Considerations

### Network Requirements
- **Bandwidth**: Minimum 2 Mbps per camera for standard quality
- **Latency**: < 100ms recommended for real-time monitoring
- **Ports**: RTSP (554), HTTP/HTTPS (80/443), and device-specific ports
- **Firewall**: Port forwarding may be required for direct access

### Local Mode Requirements
- **Network Access**: Workstation must be on same network as devices
- **Admin Privileges**: Required for Local Mode service installation
- **Service Installation**: Genesis Installer must be deployed
- **Device Support**: Verify device supports Local Mode

## Best Practices

### Stream Quality Optimization
- Use Auto quality mode for best balance
- Enable Local Mode for high-camera-count sites
- Configure device bitrate settings appropriately
- Monitor bandwidth usage and adjust as needed

### Performance Tips
- Limit concurrent high-quality streams per workstation
- Use grid views to monitor multiple cameras efficiently
- Close unused video windows to free resources
- Prefer Local Mode for operator workstations

### Security
- Always use encrypted connections (HTTPS/RTSP over TLS)
- Implement proper authentication and authorization
- Use firewall rules to restrict access
- Monitor for unauthorized access attempts

## Related Articles

- [Video Streaming Configuration](./configuration.md)
- [Video Streaming Troubleshooting](./troubleshooting.md)
- 
- 
- 

## Need Help?

If you're experiencing issues with video streaming, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/support).
