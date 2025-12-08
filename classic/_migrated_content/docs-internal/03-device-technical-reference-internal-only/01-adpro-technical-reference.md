---
title: "ADPRO Technical Reference"
sidebar_label: "ADPRO Technical Reference"
tags: ["internal", "technical reference", "adpro", "device", "tcp"]
---

# ADPRO Technical Reference

Integration Method: Events are pushed via TCP to the GCXONE ADPRO Receiver.
Required Configuration: Receiver IP address, port (10000), and the account ID of each site are critical information needed for the DC9 integration.
Alarm Behavior: The system's behavior when Armed or Disarmed can be defined, including options like suppressing alarms, primary/backup transmissions, and email notifications.
iFT Gateway Subtype: For this subtype, specific custom properties must be added in GCXONE under "Additional Settings" -> "Custom property":
Parameter name: eventClipRecord (Type: String, Value: True).
Parameter name: eventClipRecordAlarmCode (Type: String, Value: motion.perimeter).
Known Issues: The Server Unit ID is used for device identification, but it is an unreliable integer that can be easily duplicated. Alarms from inactive/disarmed devices will still be forwarded. Time-based alarm image pulling is not available.
