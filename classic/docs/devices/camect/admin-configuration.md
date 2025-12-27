---
title: "Camect Admin Configuration"
description: "Complete guide for Camect Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:camect
sidebar_position: 2
last_updated: 2025-12-04
---

# Camect Admin Configuration

Follow these steps to configure your Camect Hub for integration with GCXONE.

## Prerequisites

- Accessible IP, correct VLAN, and ports (80/443/554/RTSP/TCP).
- Camect time zone synchronized with GCXONE and NTP enabled.
- Administrative access to the Camect UI and GCXONE Configuration App.
- Dedicated user account for GCXONE.

## Step-by-Step Guide

### Step 1: Prepare the Hub (Users, Time, RTSP)
1. In the Camect UI, navigate to **Users** and create a local user (e.g., `NXG`).
2. Assign the following permissions: **Live view, Query Cameras, Pan/Tilt Cameras, View alerts, View footage, Share cameras, Change operating modes**.
3. Set the correct time zone and enable NTP.
4. Ensure **RTSP** is enabled on the Hub.

### Step 2: Configure Alerts and Monitoring
1. Go to **Hub Settings** > **Alert**.
2. Activate **Detect alerts** and select the objects you want to detect (e.g., Person, Vehicle).
3. Click **Add Monitoring** and choose **NXGEN**.
4. Provide the following details:
    - **Site ID**: As provided by your administrator.
    - **TCP Address**: `3.122.169.231:10520` (or as provided).
5. Add each camera that should be forwarded to GCXONE.

### Step 3: Enable Secondary Stream (Recommended)
1. Go to **Camera** > **Settings** > **Information**.
2. Click **Edit Substream** and set it to `1`. This ensures smoother live video performance.

### Step 4: Add Device to GCXONE
1. In the GCXONE Configuration App, go to **Customer** > **Site** > **Devices** > **Add Device**.
2. Select **Camect** as the manufacturer.
3. Enter the **Host/Serial, Username, Password, Ports, and Time Zone**.
4. Click **Discover** and then **Save** once the sensors are identified.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
