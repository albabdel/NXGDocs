---
title: "Local Mode Overview"
description: "Understanding GCXONE Local Mode for P2P streaming and local SDK features"
tags:
  - role:all
  - category:architecture
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-12-21
---

# Local Mode Overview

Local Mode allows the operator workstation to establish a direct, peer-to-peer (P2P) connection to a Network Video Recorder (NVR) or device, typically bypassing the central cloud streaming gateway for high-bandwidth functions.

## Key Functionalities

When fully supported by a device type, Local Mode enables the following features directly on the operator's workstation:

| Feature               | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| **P2P Streaming**     | Enables fast, direct video streaming with minimal latency.         |
| **Live Video**        | Real-time video monitoring bypassing cloud proxies.                |
| **Playback**          | Review of archived footage directly from the local device storage. |
| **Local SDK Audio**   | High-performance two-way audio and announcements via device SDK.   |
| **Encrypted Streams** | Handling of encrypted communication streams from the device.       |
| **Local PTZ & I/O**   | Direct control of pan-tilt-zoom and relay operations.              |

## Applicability

Local Mode is highly recommended for sites with multiple operator workstations and high camera counts to maintain local bandwidth efficiency.

### Not Supported Device Types
Local Mode is not supported or required for:
- **Hanwha-Techwin NVRs**: All features managed via cloud integration.
- **Genesis Audio (SIP/Twilio)**: Cloud-native by design.
- **InnoVi AI Cloud**: Purely cloud-based SaaS solution.
- **Senstar / Viasys**: Integration is exclusively cloud-based.

## Prerequisites
- **Admin Privileges**: Required for installation of the Local Mode service.
- **Network Routing**: Workstations must have network access to the device IPs.
- **Genesis Installer**: The Local Mode service must be installed on every operator workstation.
