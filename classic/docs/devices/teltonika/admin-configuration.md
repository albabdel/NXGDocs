---
title: "Teltonika Admin Configuration"
description: "Complete guide for Teltonika Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:teltonika
sidebar_position: 2
last_updated: 2025-12-04
---

# Teltonika Admin Configuration

Follow these steps to integrate your Teltonika router for GPS tracking and monitoring.

## Prerequisites

- Administrative access to the Teltonika router's web interface.
- Active GPS signal for the device.
- Outbound HTTPS connectivity allowed on the network.
- Device Serial Number (found in the router UI).

## Step-by-Step Guide

### Step 1: Obtain Device Serial Number
Log in to the Teltonika router UI, navigate to **Status** > **Device**, and copy the **Serial Number**.

### Step 2: Register Device in GCXONE
1. Log in to the GCXONE Configuration App.
2. Go to **Customer** > **Site** > **Devices** > **Add**.
3. Select **Teltonika** as the device type and enter the **Serial Number**.
4. Save the registration.

### Step 3: Obtain Custom Receiver URL
In the newly created device's configuration in GCXONE, click **Edit** and copy the **Teltonika Custom Receiver URL**.

### Step 4: Configure GPS Service on Router
1. Return to the Teltonika router UI and go to **Services** > **GPS**.
2. Enable the GPS service.
3. Switch to the **HTTPS** tab.
4. Paste the **Custom Receiver URL** into the HTTPS URL field.
5. Save the settings.

### Step 5: Verify Integration
Confirm the device status shows as "Online" in GCXONE and verify that GPS position data is being received.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
