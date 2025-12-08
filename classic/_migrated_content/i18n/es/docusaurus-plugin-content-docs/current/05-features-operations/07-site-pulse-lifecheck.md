---
title: "Site Pulse & Lifecheck"
sidebar_label: "Site Pulse & Lifecheck"
tags: ["site pulse", "health check", "monitoring", "heartbeat", "device status"]
---

# Site Pulse & Lifecheck

Device Health Monitoring is a core capability, providing automated alerts for offline cameras and monitoring storage or battery status.
Site Pulse / Lifecheck (Recommended): This feature acts as a "heartbeat" for the system. The ADPRO device (for example) sends a regular "I am alive" heartbeat signal to the configured GCXONE IP address at predefined intervals (e.g., 10 minutes, 30 minutes, or 1 hour).
Timeout Alarms: If GCXONE does not receive a site pulse within the configured time, a timeout alarm is automatically raised to the operator in Talos, signaling potential issues like power failure or network outage.
Site Pulse Configuration is also supported for Axis IP Camera, GCXONE Audio, Milestone, and Hanwha.
Event Polling: This configuration should only be activated if the device cannot send events directly to GCXONE. In this case, GCXONE will poll for events at a customizable time interval. This is critical for devices like Teltonika, which relies on event polling for dashboard data.
Alarm Supervision (Talos): This feature can be used for devices without a constant heartbeat or polling connection. If Talos doesn't receive an expected check-in signal (e.g., a "Fridge OK signal" or a QR code scan by a guard) within a set time, it raises a "Timeout Alarm".
