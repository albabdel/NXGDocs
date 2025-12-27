---
id: "troubleshooting-alarm-not-received"
title: "Alarm Not Received"
slug: "troubleshooting-alarm-not-received"
description: "Complete guide for Alarm Not Received"
---

# Alarm Not Received (Overflow & Blocking)

If a device is sending signals but they are not appearing in the operator's alarm queue, the system may be automatically suppressing them due to an **Alarm Overflow**.

## Understanding Overflow Thresholds

GCXONE and Talos implement safety thresholds to prevent "system flooding" from malfunctioning devices.

| Platform    | Scope        | Threshold                  | Indicator                                  |
| ----------- | ------------ | -------------------------- | ------------------------------------------ |
| **Genesis** | Device Level | >25 video alarms in 5 mins | Status: "Blocked" in Device Dashboard      |
| **Talos**   | Site Level   | >25 alarms in 5 mins       | Code: "Alarm limit exceeded" in Talos Logs |

## Troubleshooting Steps

### 1. Check Genesis Block Status
- **Navigate**: Open the **Device Dashboard**.
- **Filter**: Look for alarm types like `analytics.something` or `motion.something`.
- **Status Check**: If alarms are marked as **Blocked**, the threshold has been reached.
- **Event Overflow**: Look for a system-generated alarm titled **Event Overflow**; this is the definitive indicator of a Genesis block.

### 2. Check Talos Logs
If Genesis shows alarms as "Accepted" but they don't reach the operator, check the site logs in Talos.
- **Search**: Look for the exact, case-sensitive code: `Alarm limit exceeded`.
- **Scope**: Note that Talos blocks are aggregate (all devices on a site combined).

### 3. Identify the Root Cause
- **Redundancy**: An alarm is ignored because an identical code was received from the same sensor within 30 seconds.
- **Flood**: Basic "Motion" alarms are highly prone to flooding during environmental changes (rain, shadows).

## Resolutions & Best Practices

-   **Disable Motion Alarms**: It is highly recommended to disable basic motion detection.
-   **Use IVS/Analytics**: Use **Intelligent Video Processing (IVS)** alarms (e.g., Line Crossing, Intrusion). These are pre-filtered by the device hardware, significantly reducing the event volume.
-   **Adjust Thresholds**: If a high-activity site legitimately requires higher volume, contact support to adjust the `tile overflow threshold` custom property for that specific site.

> [!CAUTION]
> If a customer insists on basic motion alarms that frequently trigger blocks, inform them of the operational risk, as the system cannot guarantee alarm delivery during a flood.


