---
title: "Event Clips Missing"
description: "Complete guide for Event Clips Missing"
tags:
  - role:all
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 10
last_updated: 2025-12-04
---

# Event Clips & Images Missing

Missing alarm snapshots or event clips are usually caused by a failure to fetch the image immediately after the alarm trigger. This is often tied to synchronization, storage, or network latency.

## Quick Diagnostic Checklist

| Check          | Objective                                                                  |
| -------------- | -------------------------------------------------------------------------- |
| **Time Sync**  | Is the device time within 5 seconds of the platform time?                  |
| **HDD Status** | Are there "HDD Failure" or "Disk Full" alarms on the dashboard?            |
| **Playback**   | Can you manually play back video from that time in Genesis?                |
| **Cache**      | Are images from *incorrect* sites appearing? (Indicates cache corruption). |

## In-Depth Troubleshooting

### 1. Time Synchronization (Mandatory)
Discrepancies between the device and the GCXONE cloud are the #1 cause of missing images.
-   **Tolerance**: If the difference exceeds **5 seconds**, the system may fail to capture the required three-image snapshot sequence.
-   **DST**: Ensure **Daylight Saving Time** is enabled on the device hardware. Failing to do so will cause image retrieval failures whenever the time shifts.

### 2. Storage & Recording Configuration
If the device isn't recording, no image can be fetched.
-   **HDD Failure**: Check for platform alarms indicating a hard drive issue. If the local disk fails, all subsequent alarms will lack snapshots.
-   **Clip Duration**: Configure the device to record for at least **30 seconds** per event. Short 10-second clips are often missed if there is even a minor time sync slippage.
-   **Continuous Recording**: For high-security sites, continuous recording during armed periods is recommended to ensure "pre-alarm" footage is always available.

### 3. Network Latency & Flow
-   **High Alarm Volume**: During an "Alarm Flood," a recorder may become too busy processing signals to respond to image fetch requests from the cloud.
-   **Latency**: If network round-trip time is excessive, the fetch request may time out.

### 4. Cache Corruption (Mixed Images)
If an alarm shows an image from a completely different site:
-   **Diagnosis**: This indicates a corrupted image cache.
-   **Resolution**: Document the affected Site IDs and Camera Names and escalate to the **NXGEN Technical Team** for a cache purge.

---

> [!TIP]
> If playback works on the native device interface but fails in GCXONE, it suggests a connection issue between the cloud and the edge device that requires attention.
