---
title: "Event Overflow"
description: "Understanding the Event Overflow protective feature that prevents system overload from malfunctioning devices"
tags:
  - category:alarm-management
  - platform:GCXONE
  - alarms
  - system-protection
  - overflow
sidebar_position: 10
last_updated: 2026-01-05
---

# Event Overflow

**Event Overflow** is a built-in protective feature of the platform designed to maintain system stability and prevent the infrastructure from being overwhelmed by a massive influx of data. Essentially, it acts as a "circuit breaker" when a malfunctioning or poorly configured device begins "thumping" our servers with an excessive number of alarms.

Here is a detailed breakdown of how this process works and what it means for your site:

## 1. The Threshold (The 25/5 Rule)

By default, the platform is set to a threshold of **25 alarms from a single device within a 5-minute window**. This number is configurable based on a customer's specific needs; for example, some high-activity sites have their limits increased to 50 or even 100 alarms. If a device exceeds this limit, the system classifies it as an overflow state.

## 2. The Blocking Period

Once a device breaches the threshold, the platform will **automatically block and discard all subsequent alarms** from that specific sensor for the next **5 minutes**. Crucially, this block **excludes heartbeat signals** like `ping.primary`, so you will still know the device is online even while its security events are being suppressed.

## 3. Operator Notification

To ensure you are aware of the situation, the system generates a specific technical alarm in Talos called **`event.overflow`**. This alerts your operators that a device is currently being suppressed and requires investigation. If the device continues to "flood" the system after the first 5-minute block ends, the system will raise another overflow alarm and continue discarding events until the frequency drops below the threshold.

## 4. Why This Happens and How to Fix It

Common causes for an event overflow include:

*   **Malfunctioning Hardware:** A faulty sensor sending rapid-fire signals.
*   **Environmental Factors:** Moving trees, heavy rain, or spiders causing constant motion triggers.
*   **Analytics Configuration:** Relying on general motion detection instead of refined **Intelligent Video Surveillance (IVS)** like line crossing or intrusion zones.

**Recommendation:** If you frequently encounter event overflows, we suggest **tuning your device analytics** to focus on specific object types (like people or vehicles) or crossing virtual boundaries.

## 5. Multi-Level Protection

It is important to note that this logic exists at two levels:

*   **Genesis Level:** Monitors individual devices.
*   **Talos Level:** Monitors the **entire site**. Even if three different devices each send 10 alarms (30 total), Talos may trigger an "Alarm Limit Exceeded" block because the site-wide limit of 25 was breached.

## Understanding Event Overflow: An Analogy

Think of event overflow like an **office phone system**. If one disgruntled person calls your front desk 100 times in a minute, they would tie up all your phone lines and prevent real customers from getting through. To protect your business, you put that specific caller on a **"5-minute timeout"** (blocking their number). This keeps the lines open for genuine emergencies while signaling your manager (the operator) to figure out why that person is calling so much.

## Related Documentation

- [Alarm Codes](/docs/alarm-management/alarm-codes)
- [Redundant Alarms](/docs/alarm-management/redundant-alarms)
- [Alarm Filtering](/docs/alarm-management/alarm-filtering)
- [False Alarm Management](/docs/alarm-management/false-alarms)
- [Test Mode](/docs/alarm-management/test-mode)
- [Arm/Disarm and Isolate](/docs/alarm-management/arm-disarm-isolate)
- [Alarm Troubleshooting](/docs/alarm-management/alarm-troubleshooting)

