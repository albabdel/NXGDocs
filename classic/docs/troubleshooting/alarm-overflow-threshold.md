---
title: "Diagnosing and Resolving Alarms Blocked Due to Overflow Threshold"
description: "Complete guide for diagnosing and resolving alarms blocked due to overflow threshold in Genesis and Talos"
tags:
  - role:admin
  - role:operator
  - category:troubleshooting
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 21
last_updated: 2025-12-21
---

# Diagnosing and Resolving Alarms Blocked Due to Overflow Threshold

The system automatically suppresses alarms (blocks them) when a device or site exceeds a predefined threshold for alarm reception within a short timeframe. This feature is critical because devices, particularly certain types like Axon, can send thousands of alarms, potentially overwhelming or destabilizing the platform.

:::warning Important
There are two primary reasons why alarms might not be processed for the operator: **redundancy** or **block**. This guide focuses on diagnosing and resolving issues related to alarm blocking due to overflow.
:::

## Quick Checklist

- [ ] Check Genesis Device Dashboard: Filter alarm logs for the device to determine if alarms are flagged with a "Blocked" status.
- [ ] Identify Event Overflow Alarms: Search Genesis logs for the event overflow alarm type, which Genesis generates when the platform-wide threshold is breached.
- [ ] Verify Threshold Configuration: Check the custom properties (e.g., tile overflow threshold) at the tenant or customer level to confirm the device's configured alarm limit.
- [ ] Check Talos Blocking (Site Level): If alarms bypass Genesis but do not reach the operator, verify Talos logs for the site for the alarm code `Alarm limit exceeded`.

## Understanding Platform Thresholds

Alarm blocking occurs based on different criteria in Genesis and Talos:

### Genesis Blocking (Device Level)

The platform-wide default is to block a device if it sends more than **25 video alarms from a single device within a 5-minute window**. When blocked, Genesis will reject all subsequent alarms from that device until the threshold window resets.

### Talos Blocking (Site Level)

Talos has a similar blocking logic, but the threshold applies at the **site level**. If the total alarm count from all devices within a site exceeds **25 alarms in a 5-minute window**, Talos will block alarms for that site.

:::tip Threshold Configuration
These thresholds can be customized via custom properties at the tenant, customer, or site level. Contact support to adjust these values if needed.
:::

## Troubleshooting Steps

### 1. Verify Alarm Blocking Status in Genesis

1. **Locate the Device Dashboard**: Navigate to the device in question on the Genesis dashboard.
2. **Filter Alarm Logs**: Filter the displayed alarms, ignoring technical events like `ping.primary`. Focus on video alarms (analytics.something or motion.something).
3. **Check Status**: Observe the alarms to see if they are marked as "Blocked".
4. **Check for Event Overflow**: Look for the Genesis-generated alarm type `event overflow`. This alarm indicates that the threshold has been breached. Genesis continuously checks every 5 minutes and generates this alarm when the threshold is exceeded.

### 2. Confirm Threshold Breach and Review Custom Properties

1. **Determine the Incident Window**: Identify the time of the first "Blocked" status or event overflow alarm (e.g., 6:04).
2. **Filter for the 5-Minute Window**: Filter the alarm data for the 5 minutes preceding the block (e.g., 5:59 to 6:04).
3. **Count Alarms**: Calculate the total number of video alarms received in that window (e.g., 46 alarms in the example case).
4. **Check Configured Threshold**: Verify the configured threshold against the default of 25. Custom properties can override this default. This threshold can be found in the custom properties (e.g., `tile overflow threshold`) at the tenant or customer level.
5. **Identify the Source of the Block**: If the received count exceeds the configured threshold, the blocking mechanism is functioning as intended, and the issue lies with the device generating too many alarms.

### 3. Check for Talos Blocking

Alarms might bypass Genesis (especially if multiple devices are sending alarms below the 25-alarm device limit) but still get blocked by Talos.

1. **Check Talos Logs**: Consult the Talos logs for the specific site.
2. **Look for the Block Code**: Identify the exact alarm code indicating blocking on the Talos side: `Alarm limit exceeded` (Talos is case sensitive).

### 4. Resolution and Customer Recommendation

The ultimate resolution usually involves reducing the alarm volume from the device.

1. **Communicate the Reason**: Clearly communicate to the customer that the device was blocked due to exceeding the platform's high alarm volume limit (e.g., 46 alarms received in 5 minutes vs. the 25-alarm threshold).
2. **Avoid Motion Alarms**: Advise customers not to configure motion alarms. Motion alarms often "flood the system with alarms".
3. **Recommend IVS Alarms**: Recommend changing the device configuration to use IVS alarms (Advanced Intelligent Video processing alarms). IVS alarms apply a level of filtering on the device side, reducing the volume of alarms sent to the platform.
4. **Confirm Operational Risk**: If the customer insists on keeping motion alarms, they must be informed that the system cannot control alarms being blocked, presenting an operational risk.

## Related Phrases (Glossary)

| Term | Definition |
|------|------------|
| **Event Overflow** | An alarm type generated by Genesis indicating that a device has breached the platform's alarm reception threshold (e.g., 25 alarms in 5 minutes). |
| **Blocked Alarm** | An alarm status indicating that the alarm was received by the system but automatically suppressed or ignored because the device or site exceeded the predefined overflow threshold. |
| **Redundancy (Alarms Blocked Due to)** | Alarms that are ignored because they are duplicates of the exact same alarm code received from the same camera within a short period (typically 30 seconds by default). |
| **Custom Property** | A configuration parameter that can be set at the tenant, customer, or site level (e.g., `tile overflow threshold`) to customize platform defaults, such as the alarm overflow limit. |
| **Motion Alarm** | A basic alarm type triggered by movement, often resulting in a high volume of events that can flood the system, leading to blocking. |
| **IVS Alarm** | Intelligent Video Processing alarms; advanced, filtered alarms recommended over basic motion alarms to reduce event volume. |
| **Alarm limit exceeded** | The specific, case-sensitive alarm code found in Talos logs indicating that the site has been blocked due to exceeding the high alarm volume threshold. |
| **ping.primary** | A heartbeat signal sent by the device to ensure it can reach Genesis. These keep-alive signals are typically excluded from the alarm overflow calculation. |

## Related Documentation

- [Redundancy Filter](/docs/installer-guide/redundancy-failover)
- [Alarm Management](/docs/alarm-management)
- [Custom Properties](/docs/admin-guide/custom-properties-overview)
- [Device Configuration](/docs/devices)

## Need Help?

If you continue to experience issues with alarm blocking, contact [GCXONE Support](/docs/support) with the following information:
- Device ID and site information
- Time range of the blocking incident
- Alarm count during the 5-minute window
- Screenshots of blocked alarms from Genesis dashboard

