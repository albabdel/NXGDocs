---
title: "Reconeyez Technical Reference"
sidebar_label: "Reconeyez Technical Reference"
tags: ["internal", "technical reference", "reconeyez", "pir camera", "device"]
---

# Reconeyez Technical Reference

Primary Integration Flow (Current):
End customer configures alarms and schedules in their Reconeyez portal.
Customer informs GCXONE/Reconeyez, which starts pushing images to a GCXONE FTP.
Alarms (raw events) are sent from Reconeyez to Talos via SIA DC-09.
Talos uses a workflow to convert the C-alarm message to a GCXONE alarm.
GCXONE receives the alarm, pulls its equivalent images from FTP, applies analytics, and sends a follow-up alarm back to Talos.
Future State: The goal is to evolve the system so that customers can configure the IP address and port number directly in GCXONE, eliminating the need for workflow conversion/alarm forwarding from Talos to GCXONE.
