---
title: "Milestone VMS Setup"
sidebar_label: "Milestone VMS Setup"
tags: ["milestone", "vms", "setup", "integration", "tcp", "mip sdk"]
---

# Milestone VMS Setup

Required Ports: Management Client Port 443, Streaming Port 7563, Web Client Port 8081, Event Port 22331.
Streaming Protocol: Uses TCP JPEG and Raw formats (RTSP is not supported).
Event Integration: Utilizes the Milestone MIP Component SDK for event integration.
Supported Features (Cloud Mode): Discovery, Live Video, Playback, Timeline, Events, ARM/DISARM, GCXONE Audio (SIP), PTZ/Presets, IO.
Health Support: Basic and Basic+ Camera Health are supported, but Advanced Camera Health is not supported for Milestone.
I/O Management: GCXONE automatically reads and displays I/O configuration details once the device is discovered.
