---
title: "Hikvision Technical Reference"
sidebar_label: "Hikvision Technical Reference"
tags: ["internal", "technical reference", "hikvision", "device", "isapi"]
---

# Hikvision Technical Reference

Integration Protocol: Uses Http ISAPI for Cloud mode and .NET HcNetSDK for Local mode. Event integration utilizes an ISAPI Event API Subscription, meaning no specific device configuration is needed on the Hikvision side beyond enabling "Notify Surveillance Center".
Time Synchronization: Configure the NTP Client on the NVR to use timel.nxgen.cloud as the server.
HikProConnect (Cloud): Requires the Device Base URL (e.g., https://ieu.hik-partner.com for Europe) in the "IP address-host" field, and the Encryption Key must be added. Encryption functionality is only supported when Local Mode is installed.
Supported Features (Cloud Mode): Discovery, Live Video, Playback, Timeline, Events, PTZ/Presets control, IO, GCXONE Audio (SIP), Arm/Disarm capabilities.
Optimization/Troubleshooting:
Avoid basic motion detection for alarm reception; instead use smart events like line crossing or intrusion detection.
Enabling Smart Codec may nullify certain network camera functions.
A 5-minute live view limit occurs if UPnP or manual port forwarding is not enabled.
Ensure the Server Unit ID is unique to prevent alarm conflicts due to duplication.
