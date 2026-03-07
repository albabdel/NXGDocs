---
title: "Reconeyez Admin Configuration"
description: "Complete guide for Reconeyez Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:reconeyez
sidebar_position: 2
last_updated: 2025-12-04
---

# Reconeyez Admin Configuration

Follow these steps to integrate Reconeyez devices with the GCXONE platform.

## Prerequisites

- Reconeyez Device ID (found in the Reconeyez Client).
- Valid SIM card with data plan (for LTE) or stable Wi-Fi access.
- Access to the Reconeyez Cloud Portal or Mobile App.
- Outbound internet access allowed for cloud communication.

## Step-by-Step Guide

### Step 1: Network Configuration
Configure the connectivity for your device. For **LTE/4G**, ensure the SIM is active and signal strength is sufficient. For **Wi-Fi**, use the Reconeyez Mobile App to set the SSID and password. Ensure your firewall allowed outbound connections to the Reconeyez Cloud.

### Step 2: Event Settings
In the Reconeyez Cloud Portal, configure your event triggers. Set the video capture length (typically 10-15 seconds) and define the sensitivity for motion detection.

### Step 3: Platform Integration
Set up the API access for event forwarding. In GCXONE, you will need to configure a workflow that handles the incoming webhooks for event notifications from the Reconeyez platform.

### Step 4: Add Device to GCXONE
1. Log in to the GCXONE Configuration App.
2. Navigate to **Site** > **Devices** > **Add** > **Reconeyez**.
3. **Mandatory**: Enter the **Device ID** from the Reconeyez client into the **Serial Number** field.
4. Provide the Connection Details and Integration Settings (Webhook/API).
5. Click **Discover** to verify connectivity, then **Save**.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](#) or [contact support](#).
