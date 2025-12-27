---
title: "Event Clips Overview"
description: "Complete guide to automatic event clip recording and retrieval in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - feature:event-clips
sidebar_position: 1
last_updated: 2025-12-21
---

# Event Clips Overview

## Overview

Event Clips is a critical feature in GCXONE that automatically captures and retrieves short video segments around alarm events, providing operators with immediate context to verify and respond to security incidents. This feature ensures that operators have the exact video context needed without manually searching through hours of recorded footage.

**What you'll learn:**
- How event clip recording works
- Pre- and post-alarm buffer recording
- Supported devices and configurations
- Automatic clip retrieval and playback
- Integration with alarm workflows

## Key Capabilities

### Automatic Clip Capture

**Pre-Alarm Recording**: Event Clips automatically captures video footage **before** an alarm triggers (typically -5 seconds). This provides crucial context showing what happened leading up to the event.

**Post-Alarm Recording**: The system continues recording **after** the alarm trigger (typically +5 seconds), capturing the immediate aftermath and any ongoing activity.

**Configurable Buffer Times**: The pre- and post-alarm buffer periods are configurable, typically ranging from -5 to +5 seconds, but can be adjusted based on specific requirements.

### Supported Devices

Event Clips are automatically captured and retrieved for:
- **ADPRO**: Full support for event clip recording and retrieval
- **Dahua**: Automatic event clip capture and access
- **Hikvision**: Integrated event clip functionality
- **Milestone**: Event clip support through VMS integration

**Device Requirements:**
- Device must support event-triggered recording
- Recording must be enabled on the device
- Device must maintain recording buffer
- Network connectivity required for clip retrieval

### Configurable Alarm Codes

Event Clips can be configured to capture clips for specific alarm codes:
- **All Alarm Codes**: Capture clips for all alarm types
- **Specific Alarm Codes**: Configure which alarm codes trigger clip capture
- **Custom Alarm Types**: Support for custom or vendor-specific alarm codes
- **Motion Detection**: Capture clips for motion events
- **Intrusion Detection**: Capture clips for intrusion alarms
- **Tamper Detection**: Capture clips for tamper events

### Automatic Retrieval

When an alarm is processed:
1. **Alarm Received**: GCXONE receives alarm from device
2. **Clip Request**: System automatically requests event clip from device
3. **Clip Retrieval**: Video clip retrieved with pre/post-alarm buffer
4. **Clip Storage**: Clip stored temporarily for operator access
5. **Immediate Access**: Operators can view clip immediately with alarm

## How It Works

### Recording Architecture

**Device-Side Recording**:
- Device continuously records video to storage
- Maintains rolling buffer for pre-alarm footage
- When alarm triggers, device:
  - Saves pre-alarm buffer (e.g., last 5 seconds)
  - Continues recording for post-alarm period (e.g., next 5 seconds)
  - Marks clip with alarm event information
  - Makes clip available for retrieval

**GCXONE Retrieval**:
- System requests event clip when alarm received
- Retrieves clip from device storage via network
- Processes clip for immediate playback
- Makes clip available in alarm interface

### Clip Duration

**Standard Configuration**: Typically 10 seconds total (5 seconds pre + 5 seconds post)
- **Pre-Alarm**: 5 seconds before alarm trigger
- **Alarm Moment**: Frame at exact alarm trigger time
- **Post-Alarm**: 5 seconds after alarm trigger

**Custom Configurations**: Can be adjusted based on:
- Alarm type and severity
- Response time requirements
- Storage considerations
- Network bandwidth

### Integration with Alarm Workflow

Event Clips integrate seamlessly with alarm processing:

1. **Alarm Triggers**: Device sends alarm to GCXONE
2. **Clip Request**: GCXONE automatically requests associated clip
3. **AI Analysis** (if enabled): Clip analyzed for human/vehicle detection
4. **Alarm Distribution**: Alarm and clip presented to operator together
5. **Operator Review**: Operator views clip to verify alarm
6. **Decision Making**: Operator makes decision based on clip content
7. **Response Actions**: Appropriate response actions initiated

## Use Cases

### Alarm Verification
- **Rapid Verification**: Quickly verify if alarm is genuine threat
- **False Alarm Identification**: Immediately identify false alarms
- **Context Understanding**: Understand what happened before/after alarm
- **Decision Support**: Make informed decisions about alarm response

### Incident Investigation
- **Initial Assessment**: First view of incident scene
- **Timeline Reconstruction**: Understand sequence of events
- **Evidence Collection**: Collect video evidence of incidents
- **Documentation**: Document security events with video proof

### Operator Efficiency
- **Reduced Search Time**: No need to search through hours of video
- **Immediate Context**: Have context immediately with alarm
- **Faster Response**: Respond faster with immediate visual information
- **Better Decision Making**: Make better decisions with visual evidence

### Integration with AI Analytics
- **AI Verification**: AI analyzes clips to classify alarms
- **Bounding Boxes**: AI annotations on clips show detected objects
- **Confidence Scoring**: AI provides confidence levels on clip analysis
- **Automated Filtering**: False alarms filtered before reaching operators

## Benefits

### Operational Efficiency
- **Immediate Context**: Operators have video context immediately
- **Faster Verification**: Quickly verify alarms without manual search
- **Reduced Workload**: Less time spent searching for relevant video
- **Better Response Times**: Faster response to genuine threats

### Enhanced Security
- **Rapid Threat Assessment**: Quickly assess security threats
- **Complete Context**: See full context around security events
- **Evidence Preservation**: Automatic capture of critical moments
- **No Missed Events**: Important events automatically captured

### Cost Savings
- **Reduced Storage**: Only critical moments stored as clips
- **Bandwidth Efficiency**: Small clips use less bandwidth than full playback
- **Operator Productivity**: More efficient operator workflow
- **Better Resource Utilization**: Operators focus on relevant events

## Configuration Options

### Buffer Configuration
- **Pre-Alarm Duration**: Configure seconds before alarm (default: 5 seconds)
- **Post-Alarm Duration**: Configure seconds after alarm (default: 5 seconds)
- **Total Clip Duration**: Combined duration (typically 10 seconds)

### Alarm Code Selection
- **All Alarms**: Capture clips for all alarm types
- **Specific Codes**: Select specific alarm codes for clip capture
- **Priority-Based**: Capture clips only for priority alarms
- **Custom Rules**: Configure custom rules for clip capture

### Storage and Retention
- **Temporary Storage**: Clips stored temporarily for operator access
- **Retention Period**: How long clips are kept (typically 30-90 days)
- **Storage Location**: Where clips are stored (device vs. cloud)
- **Cleanup Policies**: Automatic cleanup of old clips

## Limitations and Considerations

### Device Support
- **Device-Specific**: Only supported devices can provide event clips
- **Recording Required**: Device must have recording enabled
- **Buffer Management**: Device must maintain recording buffer
- **Network Dependency**: Requires network connectivity for retrieval

### Storage Considerations
- **Storage Capacity**: Devices need sufficient storage for buffer
- **Clip Volume**: High alarm rates generate many clips
- **Retention Policies**: Balance retention vs. storage capacity
- **Storage Health**: Device storage must be healthy and functional

### Network Requirements
- **Bandwidth**: Clips require bandwidth for retrieval
- **Latency**: Network latency affects clip retrieval time
- **Reliability**: Network must be reliable for clip access
- **Concurrent Requests**: Multiple clips may be retrieved simultaneously

## Best Practices

### Buffer Configuration
- **Adequate Pre-Buffer**: Ensure enough pre-alarm time for context (5+ seconds)
- **Sufficient Post-Buffer**: Include enough post-alarm time (5+ seconds)
- **Balance Duration**: Balance clip length with storage/bandwidth
- **Test Different Settings**: Test various buffer durations for optimal results

### Alarm Code Selection
- **Focus on Critical**: Capture clips for critical alarm types
- **Avoid Redundancy**: Don't capture clips for every minor event
- **Priority-Based**: Prioritize high-priority alarms for clips
- **Review Periodically**: Regularly review and adjust alarm code selection

### Storage Management
- **Monitor Storage**: Regularly monitor device storage capacity
- **Retention Policies**: Set appropriate retention periods
- **Cleanup Schedules**: Configure automatic cleanup of old clips
- **Storage Health**: Ensure device storage is healthy

## Related Articles

- [Event Clips Configuration](./configuration.md)
- [Event Clips Troubleshooting](./troubleshooting.md)
- [AI Analytics Overview](/docs/features/ai-analytics/overview.md)
- [Playback Overview](/docs/features/playback/overview.md)
- [Alarm Management](/docs/alarm-management/)

## Need Help?

If you're experiencing issues with event clips, check our [Troubleshooting Guide](./troubleshooting.md) or [contact support](/docs/support).
