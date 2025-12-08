---
title: "Alarms Not Being Received"
sidebar_label: "Alarms Not Being Received"
tags: ['troubleshooting', 'support', 'alarms', 'debugging']
---

# Alarms Not Being Received

One of the most common issues in a security operations center is the failure of alarms to reach the monitoring platform. This guide details the troubleshooting steps to resolve this issue.

## Initial Checks (L1 Analysis)

Before escalating, perform the following checks:

1. **Check Dashboard Logs**:
   - Look at the **Device Dashboard logs**. Are there "video alarms" vs "technical alarms"?
   - If the log is empty for that camera, the issue is likely upstream (at the device or network).

2. **Verify Device State**:
   - Is the device or sensor **Disarmed**?
   - Is the device **Isolated**?
   - Check the "GCXONE Analytics" column in the device dashboard. If all inputs are false, the alarm will not be forwarded.

3. **Check Talos Receiver**:
   - Verify the status of the receiver (e.g., SIA DC-09 receiver). Is it operational?

4. **Verify Identifiers**:
   - Ensure the unique **Server Unit ID** is correct. A mismatch prevents GCXONE from associating the alarm with the correct device.

## Common Causes & Resolutions

| Issue Category           | Common Causes                                     | Resolution Steps                                                                    |
| :----------------------- | :------------------------------------------------ | :---------------------------------------------------------------------------------- |
| **Transmission Failure** | Device Disarmed, Incorrect Schedule, Wrong Hub ID | Check dashboard logs, verify arm/disarm schedule, check Server Unit ID.             |
| **Connectivity**         | Ports not open, Firewall blocking                 | Verify ports (green status in GCXONE), whitelist GCXONE IPs on customer firewall. |
| **Time Sync**            | Device time mismatch                              | Ensure NTP is set to `timel.nxgen.cloud`.                                           |
| **Configuration**        | "Notify Surveillance Center" disabled             | Enable the linkage action on the device (Hikvision/Dahua).                          |

## Advanced Troubleshooting

### Alarms Present but Not Forwarded
If the alarm appears in the **Alarm Receiver Log** but not on the **Operator Screen**:
1. Check if the **Report Alarm** toggle is enabled for that sensor.
2. Review **False Alarm Filtering** settings (Priority List, Whitelist, Blacklist). The alarm might be correctly suppressed as a false alarm.

### No Events from Single Camera
1. Log into the physical device UI.
2. Check if alarms are generating locally on the device.
3. If yes, check the **Event Linkage** settings to ensure the "Notify Surveillance Center" (or equivalent) is checked.
