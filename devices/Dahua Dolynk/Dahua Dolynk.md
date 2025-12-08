---
title: "Dahua Dolynk"
sidebar_label: "Dahua Dolynk"
sidebar_position: 7
description: "Configure Dahua Dolynk devices to integrate with GC-X-ONE platform through Dolynk Care cloud service."
tags:
  - Dahua
  - Dolynk
  - Cloud Service
  - ARC
  - GC-X-ONE
---

# Dahua Dolynk

**Device Information:**
- **Device**: Dahua Dolynk Device Model
- **Vendor**: Dahua
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Summary

- Purpose: Configure Dahua Dolynk devices to integrate with GC-X-ONE platform through Dolynk Care cloud service.
- Outcome: Cloud-based device integration enabling alarm receiving center (ARC) functionality through GC-X-ONE.
- Audience: Field engineer / Support / Installers.

# Prerequisites

Before configuring the device in GC-X-ONE, it's essential to gather the following information from the installer. This data should be forwarded to the NXGEN team as prerequisites to ensure a smooth setup process.

1. Serial Number of the device
2. Device Password, User Name
3. Ports

# Device profile

- Type: Cloud-based Security Device
- Discovery: Dolynk Cloud Service
- Events: Sensor-based alarms and notifications
- Ports: Cloud service managed
- Known quirks: Requires Dolynk Care account setup before GC-X-ONE integration. Device must be online for discovery to work.

**Core Functions**

- Cloud Integration: Supported
- Events: Supported
- ARC Functionality: Supported

# Steps

## Step 1 — Log in to Dolynk Care Account

- Do
  - Log in to your Dolynk Care account through this URL: https://care.dolynkcloud.com/

- Expected result: Successfully logged into Dolynk Care portal

## Step 2 — Add Site

- UI path: **Site → Add**

- Do
  - Go to **Site** and click on **Add**
  
  ![Dolynk Site Addition](./images/Dolynk%201.png)

- Expected result: Site creation page opened

## Step 3 — Fill Site Details

- Do
  - Fill in the details of the site such as Timezone and Name

- Expected result: Site created in Dolynk Care

## Step 4 — Add Device to Site

- UI path: **Site → Add Device → Serial Number (SN)**

- Do
  - Click on the **Site** that was created, then click on **Add Device** through **Serial Number (SN)**
  - Fill in the details of the device
  
  ![Dolynk Device Addition](./images/Dolynk%202.png)

- Important Note
  - P.S. Please ensure that the device is online

- Expected result: Device added to the site

## Step 5 — Set up ARC (Alarm Receiving Center) and Share Device with NXGEN

- UI path: **Security Service**

- Do
  - Now that the device is added to your Dolynk Care account, we need to set up GC-X-ONE as your ARC (Alarm Receiving Center) for that device by selecting the **Security Service** option
  
  ![Dolynk Security Service](./images/Dolynk%203.png)

- Do
  - In the menu that shows, select the device/sensors you want that you want to share with GC-X-ONE then click on **Next**
  - In the **Company Name/email** field please use our email to search (dev@nxgen.info)
  - Once that is done, you should see NXGEN Technology AG, click on the shield icon next to it
  
  ![Dolynk ARC Selection](./images/Dolynk%204.png)

- Expected result: NXGEN Technology AG selected as ARC

## Step 7 — Apply and Save Configuration

- Do
  - Click on Apply to save and notify your ARC


- Expected result: ARC configuration saved and NXGEN notified

## Step 8 — Configure Device in GC-X-ONE

- UI path: **GC-X-ONE → Site → Configuration App → Devices**

- Do
  - Go into the Site that you want to add the device to in GC-X-ONE Configuration App
  - Choose Dahua Cloud as your device, and Fill in the Serial Number, UserName, and Password of the device
![Dolynk GC-X-ONE Configuration](./images/Dolynk%205.png)

- Do
  - Once the details are filled, click on Discover and you should see the sensors discovered

- Expected result: Sensors discovered successfully in GC-X-ONE

# Troubleshooting

- Discovery issues
  - Verify device is online in Dolynk Care
  - Check serial number, username, and password accuracy
  - Ensure device is properly shared with NXGEN

# Notes

- Device must be online for successful configuration
- Device must not be bound to another account
- Use dev@nxgen.info for company search in Dolynk Care
- These steps and explanations will help you configure the Dahua Dolynk device into GC-X-ONE
- If any issues arise with the configuration, please raise a ticket on NXGEN's Help-desk portal to the NXGEN support team for swift issue resolution

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
