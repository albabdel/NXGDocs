---
title: "Hanwha Technical Reference"
sidebar_label: "Hanwha Technical Reference"
tags: ["internal", "technical reference", "hanwha", "device", "webhook"]
---

# Hanwha Technical Reference

Configuration: For event reception, webhooks must be configured inside the camera rules on the Hanwha device.
The Hanwha proxy URL (https://hanvoproxy.nxgen.cloud/eventIngest) must be added.
The payload must include Camera ID and event name.
Login/Password for basic authentication should be the device ID.
Supported Features (Cloud Mode): Discovery, Live Video, Playback, Timeline, ARM/DISARM, GCXONE Audio (SIP).
Limitations: PTZ/Presets and I/O functionalities are not supported in Cloud Mode. No Local Mode Support. Event log pulling is generally not available.
