---
title: "Twilio Conference Mode - Genesis Audio Device Logic"
description: "Complete guide for Genesis Audio device audio routing modes including Conference Mode, Dial-In Mode, and Device Audio Mode"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 15
last_updated: 2025-12-21
---

# Twilio Conference Mode - Genesis Audio Device Logic

Genesis Audio devices support three audio routing modes based on the ACTIVE/INACTIVE status of devices at a site. This guide explains how audio routing works and how to configure it.

## Audio Routing Modes

Audio routing behavior is determined by the ACTIVE status of GenesisAudioDevices at a site (location or logical group). There are three modes:

### 1. Conference Mode – Full Collaboration

**Condition:**
- All GenesisAudioDevices at the site are marked as ACTIVE.

**Behavior:**
- Activates Conference Call Mode.
- Devices share audio through a central conference bridge.
- Suitable for multi-device, multi-user, or team-based environments.

**Use Case:**
- Modern conference rooms with multiple devices needing synchronized audio participation.

### 2. Dial-In Mode – Single Device Control

**Condition:**
- Exactly one GenesisAudioDevice at the site is ACTIVE, and all others are INACTIVE.

**Behavior:**
- Engages Dial-In Behavior.
- The ACTIVE device links directly to the audio sensor.
- No linking logic for INACTIVE devices — they're ignored.

**Use Case:**
- Legacy or simplified setups where a single device manages the audio (e.g., personal office dial-in).

### 3. Device Audio Mode – Isolated Operation

**Condition:**
- All GenesisAudioDevices at the site are INACTIVE.

**Behavior:**
- Devices use their own internal audio (microphone/speaker).
- No audio sharing or linking.
- Simplest mode – no dependencies.

**Use Case:**
- Fallback operation or independent device use.

:::warning Note
This behavior is pending confirmation in production. Please verify with support before implementing in critical environments.
:::

## Improved Audio Routing with Conference Mode Support

### Previous Behavior

When multiple Genesis audio devices were configured under a single site, initiating an audio call from the UI (for any camera under that site) would always route audio to the first added Genesis audio device, regardless of its status.

### New Behavior

When an audio call is initiated and there are multiple active Genesis audio devices under the same site, the system will now initiate a conference mode.

In this mode:
- All active Genesis audio devices and the Genesis-side operator will be connected in a conference.
- This ensures collaborative communication across all active audio endpoints within the site.

### Fallback Handling

If none of the Genesis audio devices are active, or if the site has no Genesis audio devices configured:
- The call will fall back to using the device's default audio, if supported by that particular device type.

:::info Important Notes
- Genesis audio is configurable only if the user has the required permission
- "Local mode" settings are not required (calls can be initiated via Genesis audio even if local mode is disabled)
:::

## Steps to Add a Genesis Audio Device Under a Site

### Step 1: Login to Genesis

Access your Genesis account with appropriate permissions.

### Step 2: Navigate to Configuration

Open the Configuration app in Genesis.

### Step 3: Select the Site

Select the Site under which the Genesis audio device needs to be added.

### Step 4: Navigate to Devices Tab

Under the selected site, navigate to the "Devices" tab.

### Step 5: Click Add Button

Click on the "Add" button to add a new device.

### Step 6: Select Genesis Audio Type

Under General Settings, click on "Type" which gives the list of devices that are available. Select "Genesis Audio".

### Step 7: Enter Name and Discover

Enter the desired name and click on "Discover" to find available Genesis Audio devices.

### Step 8: Save the Device

Once the device is discovered, click on "Save".

### Step 9: Verify Success

A success pop-up message "Device Created" will be displayed and the device will be added to the data table.

### Step 10: Verify in Tree View

Verify if the added audio device is added by expanding the tree view under the site.

:::tip Configuration Note
Use this Genesis Audio device credentials and configure the IP speaker.
:::

## Steps to Initiate a Genesis Audio Call Request from Salvo

### Step 1: Login to Genesis

Access your Genesis account.

### Step 2: Navigate to Configuration

Navigate to the Configuration app in Genesis.

### Step 3: Expand Site in Tree View

Select the site in the tree view and right-click to Expand the site.

### Step 4: Select Genesis Audio Device

Select the added Genesis audio device under the site in the tree view.

### Step 5: Verify Active Status

Verify if the "Active" toggle is enabled to indicate that the added Genesis audio device is active.

### Step 6: Navigate to Video Viewer (Salvo)

Navigate to the Video viewer (Salvo) app.

### Step 7: Expand Site in Salvo

Select the site in the tree view and expand the site.

### Step 8: Verify Genesis Audio Device

Verify if the Genesis audio device is added under the selected site.

### Step 9: Drag Sensor to Video Viewer

Now drag and drop a sensor from the site into the video viewer (Salvo).

### Step 10: Verify Mic Symbol

Verify the mic symbol is enabled (red color).

### Step 11: Initiate Audio Call

Click on the mic symbol, an audio call will be initiated.

### Step 12: Verify Call Connection

Once the call is connected, the color of the mic will change from red to blue.

### Step 13: Disconnect Call

Click again on the mic to disconnect the call. Color of the mic will change from blue to red, once the call is disconnected.

## Related Documentation

- [Genesis Audio Overview](/docs/devices/gcxone-audio/overview)
- [Genesis Audio Configuration](/docs/devices/gcxone-audio/admin-configuration)
- [Local Mode Overview](/docs/features/local-mode/overview)

## Need Help?

For assistance with Genesis Audio configuration or conference mode setup, contact [GCXONE Support](/docs/support).

