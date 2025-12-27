---
title: "Dahua Admin Configuration"
description: "Complete guide for Dahua Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:dahua
sidebar_position: 2
last_updated: 2025-12-04
---

# Dahua Admin Configuration

Follow these steps to configure your Dahua camera or NVR for integration with GCXONE.

## Prerequisites

- Accessible IP, correct VLAN, and ports (80/443/554/HTTP API).
- Time Zone synchronized with GCXONE and NTP enabled.
- Administrative access to both the Dahua UI and GCXONE Configuration App.
- Dedicated user account for GCXONE.

## Step-by-Step Guide

### Step 1: Prepare the Device (User, Time, Streams)
1. Go to **Home** > **Accounts**.
2. Click **Add** and create a user (e.g., `NXG`) with a strong password.
3. Assign permissions: **Manual control, System, Camera, System info, Event**.
4. Select the specific cameras for **Search** and **Live view** that will be used in GCXONE.
5. In the **Time/NTP** settings, set the correct time zone and enable NTP.

### Step 2: Configure Alerts (AI/IVS) and Reporting
1. Navigate to **AI** > **Parameters** > **IVS** (or **Alarm** > **Video Detection** for basic motion).
2. Select a camera and click **+** to add a rule.
3. Choose **Tripwire** or **Intrusion**.
4. Draw the rule/region on the screen.
5. Set the **Action** (Appear or Cross).
6. Set **Tracking duration** to 30 seconds.
7. Select **Effective target** type: **Human** or **Motor Vehicle**.
8. Go to **More** > **Log** > **Report Alarm** and enable it.

### Step 3: Add Device to GCXONE
1. In the GCXONE Configuration App, go to **Customer** > **Site** > **Devices** > **Add Device**.
2. Select **Dahua** as the manufacturer.
3. Enter the **Serial Number, Username, Password, Ports, and Time Zone**.
4. For NVRs, select the appropriate **Channel** for each sensor.
5. Click **Discover** and then **Save** once the sensors are identified.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
