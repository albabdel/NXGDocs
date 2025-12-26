---
title: "Redundancy & Failover"
description: "Complete guide for Redundancy & Failover"
tags:
  - role:installer
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
sidebar_position: 15
last_updated: 2025-12-04
---

# Redundancy & Failover

The GCXONE platform includes built-in redundancy mechanisms to ensure high availability and prevent alert fatigue.

## Redundancy Filter (Alarm De-duplication)

The Redundancy Filter is a core feature that prevents a flood of similar alarms from the same camera or sensor being sent repeatedly to the cloud.

### How it Works
1.  **Ingest Stage**: When a camera or sensor sends a video alarm, GCXONE accepts the first event.
2.  **30-Second Window**: By default, a 30-second redundancy timer is started.
3.  **Filtering**: If another alarm from the same camera with the same alarm code is received within this 30-second window, it is automatically rejected.
4.  **Reset**: After the window ends, the next alarm will be accepted again.

### Why it Matters
-   **Alert Fatigue**: Prevents operators from being overwhelmed by the same event triggered multiple times.
-   **Bandwidth Efficiency**: Reduces unnecessary cloud traffic and storage usage.
-   **Performance**: Ensures the system remains responsive during high-activity events.

> [!NOTE]
> The redundancy filter is applied per camera sensor, meaning each stream is handled independently.

## Customizing the Timer
While the default is 30 seconds, the redundancy timer is configurable per integration or device type. If you require a different window (e.g., for high-security perimeters), contact GCXONE support to adjust your custom property settings.

## System Failover
In the event of a primary server failure, GCXONE automatically routes traffic to secondary nodes to ensure zero downtime for alarm ingestion and live streaming.
