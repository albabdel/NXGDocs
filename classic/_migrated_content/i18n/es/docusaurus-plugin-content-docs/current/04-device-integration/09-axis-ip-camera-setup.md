---
title: "Axis IP Camera Setup"
sidebar_label: "Axis IP Camera Setup"
tags: ["axis", "ip camera", "setup", "webhook", "rtsp", "integration"]
---

# Axis IP Camera Setup

Axis devices rely on webhooks for event transmission and support advanced health features.
Feature Category
Support Details
Source Reference
Integration Protocol
Uses Axis HTTP API and WebHook Callback for event transmission. Video streaming uses RTSP.
Event Configuration
Event integration requires configuring a webhook on the IP Camera's rules to push video clips to GCXONE. The webhook URL must be specified as `https://axisproxy.nxgen.cloud/eventIngest/{nxgenDeviceId}`. The `nxgenDeviceId` is used as both the User Name and Password for Basic Authentication.
Ports Required
Control Port (Default 80 for IP Camera, 443 for Camera Station VMS), RTSP Port 554, and Audio Port 3000.
Features Supported
Discovery, Live Video, Playback, Timeline, Events, ARM/DISARM, GCXONE Audio (SIP), PTZ/Presets. GCXONE supports all levels of Camera Health monitoring: Basic, Basic+, and Advanced. The system also supports pre/post-alarm recording integration (e.g., 5 seconds before and after the alarm).
Features Not Supported
Playing audio from a file is not supported for Axis devices. I/O functionality is planned for future support in Cloud Mode. Local Mode I/O and Local SDK Audio/PTZ/Timeline are currently under development.
