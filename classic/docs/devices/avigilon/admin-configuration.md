---
title: "Avigilon Admin Configuration"
description: "Complete guide for Avigilon Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:avigilon
sidebar_position: 2
last_updated: 2025-12-04
---

# Avigilon Admin Configuration

Follow these steps to configure your Avigilon system for integration with GCXONE.

## Prerequisites

- Avigilon ACC Client-Software correctly installed.
- ACC 7 Web Endpoint Service installed (required for external communication).
- Administrative rights on the Avigilon system.
- Port forwarding configured on your firewall/router.

## Step-by-Step Guide

### Step 1: Install Essential Components
Install the **WebAPI Endpoint** on the server where Avigilon VMS is running. This allows the VMS to communicate with external applications like GCXONE. Ensure the ACC Server is accessible externally through the configured ports.

### Step 2: Login to ACC Client
Open the ACC Client, enter the IP address of the device, and log in with your administrative credentials.

### Step 3: Configure Motion Detection & Analytics
1. Navigate to **Camera Setup** > **Analytics** > **Motion Detection**.
2. Set **Object Types** (Person, Vehicle).
3. Set **Sensitivity** (Recommended: 8-10).
4. Set **Threshold Time** (Recommended: 2 seconds).
5. Configure **Pre/Post-Motion Record Time** (Recommended: 10 seconds).

### Step 4: Define Analytic Events
In the **Analytics** menu, add an **Analytic Event**. Define the Area of Interest and set the parameters:
- **Activity**: Choose the activity type to monitor.
- **Sensitivity/Threshold**: Align with motion detection settings.
- **Timeout**: Recommended 10 seconds.

### Step 5: Setup User Group for GCXONE
1. Go to **Site Setup** > **User and Groups**.
2. Create a new group (e.g., "NXGEN").
3. Assign necessary privileges (View Live/Recorded Images, PTZ Control, Digital Outputs, etc.).
4. Assign the specific cameras that should be accessible in GCXONE to this group.

### Step 6: Configure Alarms in Avigilon
1. Go to **Setup** > **Alarms** and click **Add**.
2. Define the **Trigger Source** (select cameras).
3. Set **Pre-alarm recording time** (Recommended: 10 seconds).
4. Add the **NXGEN User Group** as the alarm recipient.

### Step 7: Finalize in GCXONE
In the GCXONE Configuration App, add the device using the **Serial Number**, **Username**, and **Password**. Click **Discover** to identify the cameras (sensors).

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
