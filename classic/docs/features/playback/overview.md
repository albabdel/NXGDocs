---
title: "Playback Overview"
description: "Complete guide to video playback capabilities in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - feature:playback
sidebar_position: 1
last_updated: 2025-12-21
---

# Playback Overview

## Overview

The Playback feature in GCXONE enables users to review recorded video footage from any integrated camera or device. It provides powerful tools for investigating incidents, reviewing events, and analyzing historical video data with synchronized multi-camera playback, event navigation, and advanced search capabilities.

**What you'll learn:**
- How video playback works in GCXONE
- Key playback capabilities and features
- Timeline navigation and event markers
- Multi-camera synchronized playback
- Video export and clip management

## Key Capabilities

### Unified Timeline (Smart Timeline)

- **Synchronized Timeline**: View recordings from multiple cameras on a single timeline with perfect time alignment
- **Smart Timeline**: Intelligent timeline that provides chronological view of all archived data for easy navigation
- **Event Markers**: Visual indicators showing when alarms, motion, or other events occurred on the timeline
- **Calendar Integration**: Quick navigation to specific dates and times using integrated calendar tool
- **Recording Gaps**: Visual indication of gaps in recording coverage
- **Time Ranges**: Highlight available recording periods with color-coded indicators
- **Video Activity Search**: Specialized search tool that displays all received events within preferred filtration criteria, making it easy to audit specific types of alarms or time periods

### Playback Controls

- **Standard Controls**: Play, pause, stop, rewind, fast-forward
- **Speed Control**: Variable playback speeds (1x, 2x, 4x, 8x, 16x, 32x)
- **Frame-by-Frame**: Step through individual frames for detailed analysis
- **Jump to Time**: Instantly navigate to specific timestamps
- **Jump to Event**: Quick navigation to event markers on timeline

### Multi-Camera Playback

- **Synchronized Playback**: View multiple cameras at the exact same point in time
- **Grid Views**: Monitor multiple camera feeds simultaneously
- **Independent Controls**: Control each camera playback independently if needed
- **Comparison Mode**: Compare views from different cameras side-by-side

### Search and Navigation

- **Time Search**: Jump to specific date and time
- **Event Search**: Search for specific event types (motion, alarms, etc.)
- **Calendar Navigation**: Click on calendar dates to view recordings
- **Timeline Scrubbing**: Drag timeline slider for quick navigation
- **Bookmarks**: Save specific timestamps for quick access

### Video Export

- **Clip Export**: Export selected video segments
- **Multiple Formats**: Export in various video formats
- **Quality Options**: Choose export quality and resolution
- **Batch Export**: Export multiple clips simultaneously
- **Download Options**: Download clips or save to cloud storage

## How It Works

### Playback Architecture

1. **Recording Storage**: Video recorded on edge devices (cameras, NVRs, VMS)
2. **Metadata Indexing**: GCXONE indexes recording metadata and event information
3. **Timeline Generation**: Unified timeline created from multiple device recordings
4. **Stream Request**: User requests playback for specific time and camera
5. **Video Retrieval**: GCXONE retrieves video from device storage
6. **Stream Delivery**: Video streamed to user interface for playback

### Recording Sources

Playback supports recordings from:
- **Edge Devices**: Direct recording on cameras or NVRs
- **VMS Platforms**: Recordings stored in VMS systems (Milestone, Avigilon, etc.)
- **Cloud Storage**: Recordings stored in cloud (if configured)
- **Hybrid Storage**: Combination of local and cloud storage

### Timeline Synchronization

- **Time Sync**: All devices synchronized via NTP for accurate timeline alignment
- **Event Alignment**: Events from multiple sources aligned on timeline
- **Gap Detection**: System identifies and displays recording gaps
- **Cross-Reference**: Ability to correlate events across multiple cameras

## Use Cases

### Incident Investigation
- Review video footage from incidents
- Analyze sequence of events across multiple cameras
- Export video clips as evidence
- Document findings with timestamps

### Event Review
- Review alarm events to determine cause
- Analyze motion detection events
- Investigate false alarms
- Verify system performance

### Forensic Analysis
- Detailed frame-by-frame analysis
- Multi-camera reconstruction of events
- Time-based correlation of activities
- Export clips for legal/compliance purposes

### System Monitoring
- Review recording quality and coverage
- Identify recording gaps or issues
- Verify camera positioning and views
- Monitor storage usage and retention

### Training and Review
- Review operator actions
- Training material creation
- Best practice documentation
- Performance analysis

## Recording Requirements

### Device Configuration

For playback to work properly:

- **Recording Enabled**: Devices must have recording enabled
- **Storage Available**: Sufficient storage space on device
- **Time Synchronization**: Devices synchronized with NTP server
- **Network Connectivity**: Stable connection between device and GCXONE
- **Recording Schedule**: Continuous or event-based recording configured

### Storage Considerations

- **Retention Period**: Configured retention period affects available playback
- **Storage Type**: SD card, HDD, NAS, or cloud storage
- **Recording Quality**: Higher quality reduces retention period
- **Compression**: Codec and compression affect storage efficiency

## Best Practices

### Timeline Navigation
- Use event markers to quickly find relevant footage
- Use calendar for navigating to specific dates
- Use speed controls for efficient review
- Bookmark important timestamps for quick access

### Multi-Camera Review
- Use synchronized playback for event correlation
- Compare views from different angles
- Use grid layout for comprehensive view
- Focus on relevant cameras for specific events

### Video Export
- Export only necessary segments to save storage
- Use appropriate quality for intended use
- Include buffer time before/after events
- Organize exports with descriptive names

### Performance Optimization
- Limit number of concurrent playback streams
- Use lower quality for quick reviews
- Close unused playback windows
- Use Local Mode for on-site workstations

## Limitations and Considerations

### Network Bandwidth
- Playback requires sufficient bandwidth
- Multiple concurrent streams increase bandwidth needs
- Quality affects bandwidth requirements
- Consider Local Mode for high-bandwidth scenarios

### Storage Availability
- Playback limited to available recordings
- Retention policies affect historical availability
- Recording gaps limit playback in those periods
- Storage failures prevent playback from affected devices

### Device Compatibility
- Playback features vary by device type
- Some devices have limited playback capabilities
- Older devices may have restrictions
- VMS integration may have specific requirements

## Related Articles

- [Playback Configuration](./configuration.md)
- [Playback Troubleshooting](./troubleshooting.md)
- 
- 
- 

## Need Help?

If you're experiencing issues with playback, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/support).
