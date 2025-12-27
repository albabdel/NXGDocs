---
title: "Axis Supported Features"
description: "Complete guide for Axis Supported Features"
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:axis
sidebar_position: 5
last_updated: 2025-12-04
---

# Axis Supported Features

The Axis integration supports a wide range of operational and management features out of the box.

## Core Video Features

- **Live Streaming**: Secure RTSP/HTTPS streams for real-time monitoring.
- **Playback Control**: Access to recorded footage with smooth timeline scrubbing and calendar search.
- **PTZ & Presets**: Full control of Pan-Tilt-Zoom cameras, including the ability to trigger predefined presets.
- **Multi-Camera Layouts**: Standardized streaming in grid views within the Video Viewer application.

## Alarm & Event Management

- **Event Ingestion**: Real-time alerts for Motion, Tamper, and System Health.
- **Analytics Ingestion**: Support for Axis-native analytics events (e.g., Object Analytics, Line Crossing).
- **Snapshot Support**: Display of pre-alarm, current-alarm, and post-alarm snapshots in the operator workflow.

## Control & Communication

- **SIP Audio**: High-clarity live announcements through Axis Horn Speakers and audio modules.
- **Output Control**: Remote triggering of relays and virtual inputs for gate control or alarm activation.
- **I/O Status**: Real-time monitoring of physical sensor inputs integrated via Axis I/O modules.

## Features Summary

| Feature           | Protocol Used     | Integration Status |
| :---------------- | :---------------- | :----------------- |
| Device Discovery  | VAPIX API         | ✅ Integrated       |
| Live Stream       | RTSP/HTTPS        | ✅ Integrated       |
| Timeline Search   | VAPIX / ACS API   | ✅ Integrated       |
| PTZ Control       | VAPIX / ACS API   | ✅ Integrated       |
| Audio (Talkback)  | SIP / VAPIX Audio | ✅ Integrated       |
| Output Triggering | VAPIX I/O         | ✅ Integrated       |

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
