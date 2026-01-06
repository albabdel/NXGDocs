---
title: "Test Mode"
description: "Understanding Test Mode functionality for managing high-volume testing and maintenance activities in the Talos ecosystem"
tags:
  - category:alarm-management
  - platform:GCXONE
  - talos
  - alarms
  - maintenance
  - testing
sidebar_position: 9
last_updated: 2026-01-05
---

# Test Mode

In the Talos ecosystem, **Test Mode** is a specialized status you can apply to a site when you expect a high volume of activity that isn't a real security threat—typically during technician maintenance, sensor upgrades, or system testing.

Here is an in-depth look at how it functions and why it is beneficial for your operations:

## 1. Selective Alarm Filtering

The primary purpose of Test Mode is to prevent "nuisance" alarms from distracting your operators without completely leaving the site unprotected. You can configure the system to:

*   **Suppress Specific Alarms:** Treat certain signals (like motion detection during a sensor replacement) as "test alarms" that are logged but do not appear in the normal operator queue.
*   **Prioritize Critical Alerts:** Even while in Test Mode, you can ensure that life-safety alarms—such as **Fire** or **Panic** buttons—remain fully operational and actionable.

## 2. Genesis Integration and Resource Conservation

When a site in Talos is placed into Test Mode, it triggers a powerful automated synergy with the Genesis platform. A background **Test Mode Workflow** is activated, which sends a command to **Disarm** the site in Genesis.

Because Talos is already set to ignore these specific alarms, there is no need for the Genesis cloud to fetch images or run expensive AI analytics on them. This **conserves processing resources** and ensures your system performance remains high.

## 3. Automated Re-Arming

The system is designed to ensure you never accidentally leave a site disarmed after maintenance is complete. When the technician deactivates Test Mode or the pre-set duration ends, a follow-up workflow automatically triggers an **Arm** command to bring the site back to its full security state.

## 4. Customization and Management

*   **Durations:** You can define specific "Test Types" with different durations based on the work being performed.
*   **Operational Control:** Operators can manually place a site into Test Mode from the site details page if a technician calls in from the field.

## Understanding Test Mode: An Analogy

Think of Test Mode like the **"Do Not Disturb"** feature on your smartphone. You can silence non-urgent notifications (the test alarms) while you are in a meeting, but you can set "Emergency Bypass" for specific contacts (critical fire or medical alarms) so that truly urgent matters still get through to you instantly. When your meeting ends, the phone automatically reverts to its normal ringing state so you don't miss any future calls.

## Related Documentation

- [Arm/Disarm and Isolate](/docs/alarm-management/arm-disarm-isolate)
- [Alarm Filtering](/docs/alarm-management/alarm-filtering)
- [Redundant Alarms](/docs/alarm-management/redundant-alarms)
- [Alarm Queue Management](/docs/alarm-management/alarm-queue)
- [Alarm Actions & Responses](/docs/alarm-management/alarm-actions)
- [False Alarm Management](/docs/alarm-management/false-alarms)

