---
title: "Event Clip Recording Configuration"
description: "Complete guide for Event Clip Recording Configuration"
tags:
  - admin
  - configuration
  - intermediate
  - GCXONE
sidebar_position: 13
last_updated: 2025-12-04
---


# Event Clip Recording Configuration

Custom parameters provide a free-flow configuration enabled on the fly for different features at various hierarchical levels (Tenant/Customer/Site/Device/Cameras). They are added under "Additional Settings" > "Custom property" after selecting "edit" for the relevant level.

### Key Uses of Custom Properties:

**Event Clip Recording**: Used for ADPRO, Dahua, Hikvision, and Milestone to enable automatic recording of pre- and post-alarm video clips (e.g., -5 to +5 seconds) for specific real alarms, providing rich context for operators.
- Parameter name: `eventClipRecord` (Value: `True`)
- Parameter name: `eventClipRecordAlarmCode` (Value: e.g., `motion.perimeter`)

**iFT Gateway (ADPRO)**: Required for ADPRO device subtype `[iFT] Gateway`.

**Milestone Optimization**: Used to set base URLs, WebSocket endpoints, optimize for low bandwidth, and control alarm/event subscriptions.
- `MilestoneNVR_Device_Custom_isLowBandwidthDevice` (Value: `True`)

**Teltonika Event Filtering**: Used to define Custom Alarm Rules with thresholds (e.g., voltage high/low limits) to filter frequent data changes and ensure only meaningful events trigger alarms.

**HoneywellS35**: Requires `HoneywellS35_Device_Custom_baseUrl` at the service provider level.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
