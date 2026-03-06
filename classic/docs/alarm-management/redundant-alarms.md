---
title: "Redundant Alarms"
description: "Understanding redundant alarm filtering and how it prevents alarm floods in GCXONE"
tags:
  - category:alarm-management
  - platform:GCXONE
  - alarms
  - filtering
sidebar_position: 6
last_updated: 2026-01-05
---

# Redundant Alarms

## What is a Redundant Alarm?

A redundant alarm occurs when a security device sends **multiple copies of the same alarm code from the same camera or sensor** within a very short period.

The system operates under these specific rules:

*   **Same Alarm Code:** The filter only applies if the alarm type is identical. For example, if a camera sends an `analytics.zonecross` alert and then immediately sends another `analytics.zonecross`, the second one is marked redundant.
*   **Same Sensor:** This logic applies on a per-camera or per-sensor basis.
*   **The Time Window:** By default, GCXONE uses a **30-second redundancy timer**. Any identical signal received within 30 seconds of the first one is rejected and not processed by the cloud engine.

## Will I miss different types of alerts?

**No.** The system is intelligent enough to distinguish between different events. If the same camera triggers two *different* types of alarms, for instance, an `analytics.zonecross` followed by an `analytics.linecross`, **both alarms will be processed**, even if they occur within the 30-second window.

## Can this be customized?

Yes. While the **platform default is 30 seconds**, this is a configurable property. Depending on your specific operational needs, we can increase this timer (for example, to 5 minutes) to further reduce "nuisance" alarms from highly active sites.

## Why do we use this?

The primary goal of redundancy filtering is to **prevent "alarm floods"** that could potentially overwhelm your monitoring station or impact platform stability. It ensures your team only sees the initial trigger of an event rather than being thrashed by dozens of repeat signals for the same ongoing activity.

## Analogy for Understanding

Think of a redundant alarm like a **doorbell**. If a visitor presses the button five times in ten seconds, you only need to hear the first ring to know someone is there. The other four rings don't give you new information; they just create unnecessary noise. Redundancy filtering effectively "mutes" those extra rings so you can focus on the visitor.

## Related Documentation

- [Alarm Filtering](/docs/alarm-management/alarm-codes)
- [Alarm Queue Management](/docs/alarm-management/alarm-codes)
- [False Alarm Management](/docs/alarm-management/priority-whitelist-blacklist)
- [Alarm Flow](/docs/platform-fundamentals/alarm-flow)

