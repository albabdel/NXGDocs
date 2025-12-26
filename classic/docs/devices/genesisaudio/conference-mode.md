---
title: "Conference Mode Support"
description: "Understanding collaborative audio communication with Genesis Audio Conference Mode"
tags:
  - role:all
  - category:features
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 5
last_updated: 2025-12-21
---

# Conference Mode Support

GCXONE supports advanced audio routing logic that enables multiple active audio devices to participate in a unified conference call. This is particularly useful for sites requiring collaborative communication across multiple endpoints.

## Audio Routing Modes

Routing behavior is determined by the **ACTIVE** status of GenesisAudio devices at a site:

### 1. Conference Mode (Full Collaboration)
-   **Condition**: All GenesisAudio devices at the site are marked as **ACTIVE**.
-   **Behavior**: Activates a central conference bridge sharing audio between all active devices and the operator.
-   **Use Case**: Team-based environments where multiple staff members need to coordinate via synchronized audio.

### 2. Dial-In Mode (Single Device)
-   **Condition**: Exactly one GenesisAudio device is **ACTIVE**; others are INACTIVE.
-   **Behavior**: The system links directly to the single active device. All inactive devices are ignored.
-   **Use Case**: Legacy or simplified setups where only one specific dial-in point is needed.

### 3. Device Audio Mode (Isolated)
-   **Condition**: All GenesisAudio devices at the site are **INACTIVE**.
-   **Behavior**: The call falls back to using the device's default internal audio (if supported).
-   **Use Case**: Independent device operation where cloud-bridged audio is not required.

## Initiating a Conference Call

1.  Open the **Video Viewer (Salvo)**.
2.  Select the **Site** and verify that multiple **Genesis Audio** devices are visible.
3.  Ensure the **Active** toggle is enabled for all desired participants in the Configuration App.
4.  Drag and drop the sensor/camera into the viewer.
5.  Click the **Mic** icon (Red).
6.  Once connected, the icon turns **Blue**, indicating the conference bridge is live and all active endpoints are bridged together.

> [!IMPORTANT]
> Initiating Genesis Audio calls does NOT require "Local Mode" to be enabled on the workstation. Everything is handled via the secure GCXONE cloud audio layer.
