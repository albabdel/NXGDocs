---
title: "Hanwha NVR Setup"
sidebar_label: "Hanwha NVR Setup"
tags: ["hanwha", "nvr", "setup", "webhook", "cloud", "integration"]
---

# Hanwha NVR Setup

Hanwha relies entirely on Cloud Mode using webhooks for event reception.
Feature Category
Support Details
Source Reference
Cloud Features
Discovery, Live Video, Playback, Timeline, ARM/DISARM, GCXONE Audio (SIP), Events (specifically intrusion detection events).
Features Not Supported
PTZ and preset controls are NOT supported in the current cloud integration. Local Mode is NOT supported.
Integration Protocol
Events are transmitted via webhooks. The webhook URL must be configured on the camera rules within the Hanwha device.
Networking/Ports
Whitelist the GCXONE Alarm Receiver Gateway IP 18.184.110.24. Requires opening HTTP/HTTPS (80/443) and RTSP (554).
Prerequisites
HTTP or HTTPS port and RTSP port are mandatory fields to provide during configuration.
