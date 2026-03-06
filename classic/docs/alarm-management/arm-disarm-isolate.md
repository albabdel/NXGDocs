---
title: "Arm/Disarm and Isolate"
description: "Understanding the differences between Arm/Disarm and Isolate functions for controlling security event processing in GCXONE"
tags:
  - category:alarm-management
  - platform:GCXONE
  - alarms
  - control
  - monitoring
sidebar_position: 8
last_updated: 2026-01-05
---

# Arm/Disarm and Isolate

In the GCXONE platform, **Arm/Disarm** and **Isolate** are two distinct methods for controlling when security events are processed, and understanding the differences between them is essential for efficient site management.

## Arm and Disarm

The **Arm/Disarm** function is a high-level security toggle used to manage whether a site or device is actively reporting events to your monitoring center.

### Key Characteristics

*   **Persistent State:** When you set a device to **Armed**, it is enabled to send events; when set to **Disarmed**, it is marked as inactive for reporting. This state is **persistent**, meaning it remains in that mode until it is manually changed or triggered by a predefined schedule.
*   **Software Override:** In our platform, this functions as a **software-level override**. Even if your physical hardware (like an NVR) is internally "armed," if the Genesis software is set to **Disarmed**, the platform will **automatically skip processing** any incoming alarms.
*   **Device-Level Control:** Typically, Arm/Disarm applies to the **entire device or site**. It is generally not possible to disarm a single camera sensor while leaving the rest of the device active.

## Isolate

The **Isolate** feature is designed for the **temporary suspension** of monitoring, typically used during planned activities such as technician maintenance or site loading.

### Key Characteristics

*   **Mandatory Timeout:** Unlike disarming, Isolation requires a **mandatory duration parameter** (such as 30 minutes, 1 hour, or up to 24 hours). Once this timer expires, the isolated entity will automatically **"spring back to life"** and return to its active monitoring state without human intervention.
*   **Granular Control:** Isolate provides much finer control than Arm/Disarm because it can be applied to **individual sensors (cameras)**, an entire device, or a whole site. This allows you to silence a single problematic camera while keeping the rest of the facility protected.
*   **Internal Rejection:** When a sensor is isolated, the system will still "hear" the raw alarm signal from the device, but it will **refuse to fetch images or run AI analytics**. This prevents "alarm floods" from reaching your operators during maintenance.

## Comparison at a Glance

| Feature | **Arm / Disarm** | **Isolate** |
| :--- | :--- | :--- |
| **Duration** | Persistent until changed | Temporary with a required timeout |
| **Granularity** | Applies to the whole device/site | Can apply to a single camera sensor |
| **Automation** | Often driven by fixed schedules | Usually triggered for on-demand events |
| **Processing** | Stops all AI and image fetching | Stops all AI and image fetching |

## Understanding the Difference: An Analogy

Think of **Arming/Disarming** like a master **light switch** for your office; when it's off, the whole building is dark and stays that way until you return to flip it back. **Isolating** is more like a **sleep timer** on a television; you are specifically silencing one "screen" for a set amount of time so you can work undisturbed, knowing it will automatically turn back on as soon as the timer runs out.

## Related Documentation

- [Alarm Queue Management](/docs/alarm-management/alarm-codes)
- [Alarm Filtering](/docs/alarm-management/alarm-codes)
- [Redundant Alarms](/docs/alarm-management/redundant-alarms)
- [Alarm Actions & Responses](/docs/alarm-management/arm-disarm-isolate)
- [False Alarm Management](/docs/alarm-management/priority-whitelist-blacklist)

