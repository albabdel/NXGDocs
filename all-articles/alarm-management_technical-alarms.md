---
title: "Technical Alarms"
description: "Understanding technical alarms that monitor the health and operational integrity of security infrastructure"
tags:
  - category:alarm-management
  - platform:GCXONE
  - alarms
  - technical
  - monitoring
  - health-checks
sidebar_position: 11
last_updated: 2026-01-05
---

# Technical Alarms

**Technical alarms** are specialized alerts designed to monitor the **health and operational integrity** of your security infrastructure. While security alarms focus on external threats like intrusions, technical alarms act as an internal "check engine light," ensuring that every camera, recorder, and sensor is functioning correctly so your site is never left vulnerable.

Here is an in-depth look at the categories and specific codes that define technical monitoring in our system:

## 1. Connectivity and "Heartbeat" Alarms

These alarms track the communication between your local hardware and our cloud servers.

*   **`ping.primary` (The Heartbeat):** This is a pulse signal sent by your device at regular intervals (e.g., every 10 or 30 minutes) to confirm it is **active and connected**.
*   **`ping.timeout`:** If the system expects a heartbeat every 30 minutes and does not receive one, it triggers this alarm to notify us of a **potential connection gap**.
*   **`ping.notreachable`:** This is a critical technical alarm indicating the **device is completely offline** and has been for a persistent period, usually 30 minutes.
*   **`network.alert`:** This indicates **network instability** or a "network abort" occurring between your camera and recorder, or between the local network and the cloud.

## 2. Automated Health Check Alarms

Our system periodically "polls" each camera to verify that the image quality is sufficient for security monitoring.

*   **`camera.health.fail`:** This is triggered when a scheduled check determines a camera is **unresponsive or malfunctioning**.
*   **`camera.health.normal`:** A "restore" signal indicating the camera has recovered and passed its health check.
*   **`analytics.novideo`:** This signifies that while the camera is "online," the **video stream itself is missing** (resulting in a black screen).
*   **`analytics.healthcheck`:** An advanced predictive alarm that identifies **image degradation** such as lens blur, spider webs, low light, or if the camera has been physically moved (angle deviation).

## 3. Hardware and System Integrity

These alarms monitor the physical state of your recording devices and power supplies.

*   **Storage Alarms:** These include **`HDD full`**, **`HDD error`**, or **`HDD corrupt`**. If your hard disk fails, the system cannot save recordings, and Genesis will often be unable to fetch images for security alarms.
*   **Power Alerts:** Alarms like **`UPS fault`** or **`battery low`** notify operators of power interruptions or failing backup batteries.
*   **`video.loss`:** Triggered when a recorder loses the video signal from a specific camera channel.

## 4. System Stability Alarms

*   **`event.overflow`:** This is a protective "circuit breaker" alarm. If a malfunctioning sensor "thumps" the system with an excessive volume of signals (typically more than **25 alarms in 5 minutes**), the platform will **temporarily block that device** to maintain overall system stability.

## Operational Handling of Technical Alarms

Unlike intrusion alarms, which are often suppressed when a site is "Disarmed," **technical alarms are typically configured to be active 24/7**. This ensures that if a hard disk fails at noon while the site is disarmed, a technician can be dispatched immediately to fix it before the site is armed again at night. In most monitoring centers, the **day shift** focuses on resolving these technical alerts and coordinating with integrators for hardware maintenance.

## Understanding Technical Alarms: An Analogy

Think of technical alarms like the **sensors in a modern car**. An intrusion alarm is like the car's theft alarm that goes off if someone breaks a window. A **technical alarm**, however, is like the **tire pressure sensor or the engine temperature gauge**. You want these sensors working even when the car is parked (disarmed) because if a tire goes flat while you're shopping, you need to know *before* you try to drive away into a dangerous situation. Technical alarms ensure your "security vehicle" is always road-ready.

## Related Documentation

- [Alarm Codes](/docs/alarm-management/alarm-codes)
- [Event Overflow](/docs/alarm-management/event-overflow)
- [Alarm Filtering](/docs/alarm-management/alarm-filtering)
- [Arm/Disarm and Isolate](/docs/alarm-management/arm-disarm-isolate)
- [Test Mode](/docs/alarm-management/test-mode)
- [Alarm Queue Management](/docs/alarm-management/alarm-queue)
- [Alarm Troubleshooting](/docs/alarm-management/alarm-troubleshooting)

