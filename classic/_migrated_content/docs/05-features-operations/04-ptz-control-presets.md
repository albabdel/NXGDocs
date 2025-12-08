---
title: "PTZ Control & Presets"
sidebar_label: "PTZ Control & Presets"
tags: ["ptz", "camera control", "presets", "pan tilt zoom"]
---

# PTZ Control & Presets

Integrating a device involves a standardized sequence within the GCXONE Configuration App:
Login to GCXONE and navigate to the Configuration App.
Add Customer and Site (if not already configured). Site addition automatically syncs the site name with Talos.
Navigate to the Devices tab at the site level and click "Add".
Select Device Type (e.g., HanwhaNVR, Hikvision, Milestone, Teltonika-IOT).
Enter Mandatory Details: This typically includes Name, IP Address/Host, Username, and Password. Specific devices require ports (RTSP, Control, HTTP/HTTPS) and unique identifiers (Serial Number, Server Unit ID, or Base URL).
Time Zone Synchronization: The device's time zone must be correctly configured in GCXONE for accurate real-time event forwarding and synchronization.
Click "Discover": GCXONE initiates an automatic discovery process to connect, fetch device-specific information (including Input/Output (I/O) details), and automatically add associated sensors (cameras).
Click "Save" to finalize the configuration.
