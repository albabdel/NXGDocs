---
title: "Senstar"
sidebar_label: "Senstar"
sidebar_position: 12
description: "Configure Senstar to stream and send events to GC-X-ONE."
tags:
  - Senstar
  - Perimeter Security
  - Symphony Server
  - RTSP
  - GC-X-ONE
---

# Senstar

**Device Information:**
- **Device**: Senstar Device Model
- **Vendor**: Senstar
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Summary

- Purpose: Configure Senstar to stream and send events to GC-X-ONE.
- Outcome: Live view and events show in GC-X-ONE (Video Activity).
- Audience: Field engineer / Support / Admin users for troubleshooting and configuration purposes.

# Prerequisites

- Administrator privileges on your system
- System meets minimum hardware and OS requirements for the Senstar installer
- Network access to the target senstar device is available

# Device profile

- Type: Perimeter Security Device
- Discovery: HTTP/HTTPS
- Events: Motion/intrusion events (per Senstar rules)
- Ports: HTTP/HTTPS (default 5000), RTSP
- Known quirks: Requires **encoded password** for RTSP streaming. **Event polling** must be enabled. Rules must be configured in Symphony Server for alarms.

**Core Functions**

- Live: Supported
- Events: Supported (requires rules configuration)
- Streaming: RTSP with encoded password

# Steps

## Step 1 — Install Senstar Software

- Download Installer
  - Download Senstar Installer (senstar server) from the official website

- Run the Installer
  - Double-click the downloaded .exe file
  - Proceed with default options unless specified by IT policies
  - Finish installation and launch the application

- Installation Note
  - Upon installation, a pop up will be displayed. Uncheck the selected checkbox and click on "Next" button to continue the installation
  - ![Senstar Image](./images/senstar%20 Installation](./images/senstar%201.png)

- Post Installation
  - Once installed successfully you will be able to see the client in your desktop (or mentioned in your path)
  - ![Senstar Image](./images/senstar%20 2.png)
  - Upon opening the client you will be asked for the authorization with IP address, username, password and able to see the live stream
  - ![Senstar Image](./images/senstar%20 3.png)

- Expected result: Senstar client installed and accessible

## Step 2 — Verify Streaming and Events in Senstar client

- UI path: **Senstar Client**

- Launch Application
  - Open the installed **Senstar client** from your desktop or start menu

- Connect to Device
  - Enter the **IP address**, **username**, and **password** of the Senstar unit
  - Click **Connect**

- Verify Live Stream
  - Navigate to the **Live View** tab
  - Confirm the live video feed is working as expected

- Verify Events
  - Go to the **Events** or **Logs** section
  - Confirm that real-time motion or intrusion events are being logged correctly

- ![Senstar Image](./images/senstar%20 4.png)

- Expected result: Device is online and in working state

## Step 3 — Add Senstar Parameters to GC-X-ONE

- Overall summary:
- ![Senstar Image](./images/senstar%20 5.png)

- UI path: **GC-X-ONE → Configuration App → Service Provider → Overview → Edit → Additional Settings → Custom Property**

- Do
  - Login to GC-X-ONE
  - Navigate to configuration app
  - At service provider level, click on edit button under overview tab
  - ![Senstar Image](./images/senstar%20 6.png)
  - Click on additional settings tab → Custom property
  - Scroll down and click on "Add +" button
  - ![Senstar Image](./images/senstar%20 7.png)
  - Enter parameter details:
    - **Parameter Type**: string
    - **Parameter Name**: SenStar_Device_Custom_baseUrl
    - **Parameter Value**: https://universalproxy.nxgen.cloud/
  - ![Senstar Image](./images/senstar%20 8.png)

- Expected result: Custom property added successfully

## Step 4 — Add Senstar Device Under the Required Site

- UI path: **GC-X-ONE → Configuration → Site → Devices → Add New Device**

- Do
  - Go to the **Configuration** section in GC-X-ONE
  - Select the **target site** under which the Senstar device should be registered
  - ![Senstar Image](./images/senstar%20 9.png)
  - Navigate to **Devices** → **Add New Device**
  - ![Senstar Image](./images/senstar%20 10.png)
  - Fill in the following details:
    - **Device Name**: e.g., "Senstar Camera - Gate A"
    - **Device Type**: SenStar
    - **IP Address/Host**: xxx.xxx.xxx.xxx
    - **Http/s Port**: Default or customized (e.g., 5000)
    - **Enable HTTPS**: switch ON the toggle if the device supports HTTPS, If not it can be in OFF
    - **Username**: xxx
    - **Password**: xxx
    - **RTSP Port**: for streaming
    - **Enable event polling check box for events to flow with 10 sec interval**

- Note: Please refer below for the default ports
- ![Senstar Image](./images/senstar%20 11.png)

- **Streaming Key**: The protected rtsp password should be provided in this field

## Step 5 — Generate Streaming Password

- The Senstar device requires an encoded password to access the RTSP-based live stream

- Steps to Get Encoded password:
  - User can encode the password using the PasswordEncoder.exe
  - Note: The encoder cannot be downloaded and installed directly. User needs to install the Senstar server exe in their machine as mentioned in prerequisite conditions. Once installed, they can access the Password encoder from their system in the following path
  - **PATH: Local disk C → Program files → Senstar → Symphony server V7 → _Tools → PasswordEncoder (File type - Application)**
  - ![Senstar Image](./images/senstar%20 12.png)
  - Run PasswordEncoder.exe
  - Enter device password
  - Copy and paste the Encoded Password in Device Configuration page
  - ![Senstar Image](./images/senstar%20 13.png)

- Info: The note below is needed to stream the live via **VLC media player** and is not required in GC-X-ONE
- ![Senstar Image](./images/senstar%20 14.png)

- To Enable Events: Check the event polling enabled
- ![Senstar Image](./images/senstar%20 15.png)

- Click **Save & Verify** to confirm that the device is reachable and data (stream/events) is being received

- Note: Make sure rtsp url work in vlc media player

- **Live Stream:**
- ![Senstar Image](./images/senstar%20 16.png)

- **Events In Video Activity Search and Device Dashboard:**
- ![Senstar Image](./images/senstar%20 17.png)

- Expected result: Device added successfully with live stream and events

## Step 6 — Configuring Senstar for Alarms

- Background Information
  - The Senstar Symphony Server can generate alarms from rules. Rules include events, action sets, and schedules
  - You create rules in the Senstar Symphony Server configuration interface. When you create a rule, you either associate existing events, action sets, and a schedule with the rule, or you create new events, action sets, and a schedule for the rule
  - An event triggers a rule. Examples include events from video analytics, camera inputs, and access devices
  - An action set defines the actions that the Senstar Symphony Server takes when an event triggers a rule
  - A schedule defines when a rule is active. An event must occur during an active time in the schedule to trigger a rule
  - When a rule is enabled, the occurrence of an event associated with the rule during an active period in the rule's schedule causes the Senstar Symphony Server to perform the actions defined in the rule's action set
  - Please refer to Senstar Webhelp on how to create new rule: [Create Rule](https://xnet.senstar.com/webhelp/Symphony/8.0/en/topic_task/air_server_rules_rule_create_8.html?hl=add%2Crule)

- Steps to Add rule in Senstar client:
  - **Note**: The below configuration should be configured by admin user
  - **Step 1**: Open the symphony client from your machine
  - ![Senstar Image](./images/senstar%20 18.png)
  - **Step 2**: Login to the device in the symphony client
  - **Step 3**: Click on the server configuration option
  - ![Senstar Image](./images/senstar%20 19.png)
  - **Step 4**: User will be redirected to the senstar portal
  - **Step 5**: Login to the portal with username and password
  - ![Senstar Image](./images/senstar%20 20.png)
  - **Step 6**: User will be landed up in the configuration as shown below
  - ![Senstar Image](./images/senstar%20 21.png)

- Note: Rules should be enabled for the alarms to be generated in client. Alarms will not be generated if no rules is enabled in client

  - **Step 7**: Click on the Rules tab
  - **Step 8**: Click on the add button
  - ![Senstar Image](./images/senstar%20 22.png)
  - **Step 9**: Provide the mandatory fields required to add a rule
  - ![Senstar Image](./images/senstar%20 23.png)
  - **Step 10**: Click on save
  - **Step 11**: The added rule will be listed under rules tab
  - ![Senstar Image](./images/senstar%20 24.png)
  - **Step 12**: Now the events should flow according to the rule set in client
  - ![Senstar Image](./images/senstar%20 25.png)
  - **Step 13**: The event generated in client will be received in GC-X-ONE
  - ![Senstar Image](./images/senstar%20 26.png)

- Expected result: Rules configured and events flowing to GC-X-ONE

## Step 7 — Verify

- Checks
  - Live Stream appears in GC-X-ONE
  - Events appear in Video Activity Search and Device Dashboard
  - Make sure rtsp url work in vlc media player

- Expected result: Full integration working with live stream and events

# Troubleshooting Tools

- **Senstar SDK Mobile**: Mobile Bridge application is used to get connected sensors lists

# Notes

- The above encoder cannot be downloaded and installed directly. User needs to install the Senstar server exe in their machine as mentioned in prerequisite conditions
- Rules should be enabled for the alarms to be generated in client
- Alarms will not be generated if no rules is enabled in client
- Make sure rtsp url work in vlc media player
- The note about VLC media player is needed to stream the live via VLC media player and is not required in GC-X-ONE

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (migrated from Genesis)