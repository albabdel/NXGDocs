---
title: "Avigilon"
sidebar_label: "Avigilon"
sidebar_position: 3
description: "Configure Avigilon Video Management System (VMS) to integrate seamlessly with GC-X-ONE platform for enhanced video surveillance and analytics."
tags:
  - Avigilon
  - VMS
  - Video Management
  - Analytics
  - GC-X-ONE
---

# Avigilon

**Device Information:**
- **Device**: Avigilon Device Model
- **Vendor**: Avigilon
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Summary

- Purpose: Configure Avigilon Video Management System (VMS) to integrate seamlessly with GC-X-ONE platform for enhanced video surveillance and analytics.
- Outcome: Enhanced functionality with analytics, user management, and alarm configuration enabling robust management and monitoring capabilities through GC-X-ONE integration.
- Audience: System administrators / IT professionals / Field engineers.

# Prerequisites

- Avigilon ACC client software
- ACC 7 Web Endpoint Service
- IT team responsible to set up port forwarding on their firewall or router
- Administrative access to Avigilon system

# Device profile

- Type: Video Management System (VMS)
- Discovery: WebAPI Endpoint
- Events: Motion detection, analytic events, alarm triggers
- Ports: Custom (configured via port forwarding)
- Known quirks: Requires **WebAPI Endpoint installation** for external communication. **User group setup** mandatory for GC-X-ONE access. **Analytics configuration** at camera level needed for event detection.

**Core Functions**

- Live: Supported
- Analytics: Supported (Motion Detection, Object Detection)
- Events: Supported
- Alarm Management: Supported
- User Management: Supported
- PTZ Controls: Supported

# Steps

## Step 1 — Install Essential Software Components

- Install WebAPI Endpoint
  - In case of having Avigilon VMS install WebAPI Endpoint
  - Install the Avigilon WebAPI endpoint by following the instructions provided in the Avigilon WebAPI Endpoint Quick Start Guide
  - This endpoint facilitates communication between the VMS and external applications

- Ensure ACC Server Accessibility
  - Confirm that the ACC (Avigilon Control Center) server is properly installed and operational
  - The ACC server communicates with the external world through the configured server port, ensuring that the VMS can send and receive data as needed

- Expected result: WebAPI Endpoint installed and ACC server accessible

## Step 2 — Login to Avigilon ACC Client

- UI path: **ACC Client → Login**

- Access ACC Client
  - In the ACC client login screen, locate the field to enter the device's IP address in the search bar
  - Enter your username and password for the ACC client
  
  ![Avigilon Image](./images/Avigilon%20 ACC Client Login](./images/Avigilon%201.png)

- Expected result: Successfully logged into ACC client

## Step 3 — Navigate to Camera Configuration

- UI path: **ACC Client → Camera Selection**

- Access Camera Interface
  - Once logged in, use the client interface to navigate to the specific camera or device you need to configure
  - ![Avigilon Image](./images/Avigilon%20 Camera Selection](./images/Avigilon%202.png)

- Expected result: Camera interface accessible for configuration

## Step 4 — Access Camera Setup

- UI path: **Camera → Right-Click → Setup**

- Open Camera Configuration
  - Right-Click on the Camera you want to configure
  - In the context menu that appears, click on "Setup"
  - This will open the camera's configuration page
  - ![Avigilon Image](./images/Avigilon%20 Camera Right-Click](./images/Avigilon%203.png)
  - ![Avigilon Image](./images/Avigilon%20 4.png)

- Expected result: Camera configuration page opened

## Step 5 — Configure Motion Detection Analytics

- UI path: **Camera Setup → Analytics → Motion Detection**

- Setup Motion Detection
  - Choose and Configure the Type of Analytics
  - After selecting the desired analytics type, you will be able to adjust various settings and parameters specific to that type
  - Configure Motion Detection parameters:
    - **Object Types**: Select types of objects (Person, Vehicle)
    - **Sensitivity**: Set sensitivity level (recommended 8-10)
    - **Threshold Time**: Set minimum duration (recommended 2 seconds)
    - **Pre-Motion Record Time**: Set recording time before event (recommended 10 seconds)
    - **Post-Motion Record Time**: Set recording time after event (recommended 10 seconds)
  - ![Avigilon Image](./images/Avigilon%20 5.png)

- Expected result: Motion detection analytics configured

## Step 6 — Configure Analytic Events

- UI path: **Camera Setup → Analytics → Analytic Events**

- Setup Analytic Events
  - Analytics process the video feed in real-time to detect and respond to specific activities or conditions
  - Click on the button "Add"
  - Define your Area of interest by clicking the icon on the top left of the screen
  - ![Avigilon Image](./images/Avigilon%20 6.png)
  - ![Avigilon Image](./images/Avigilon%20 7.png)

- Configure Event Parameters
  - After you add the area of interest, setup the following:
    - **Enabled Checkbox**: Check to enable the analytic event
    - **Activity**: Select the type of activity to monitor within the defined zone
    - **Object Types**: Specify what kinds of objects the system should detect
    - **Sensitivity**: Set sensitivity level (recommended 8-10)
    - **Threshold Time**: Set minimum duration (recommended 2 seconds)
    - **Number of Objects**: Specify number of objects required to trigger event
    - **Timeout**: Set wait time before resetting (recommended 10 seconds)
    - **Distance (feet)**: Set minimum distance an object must travel
  - ![Avigilon Image](./images/Avigilon%20 8.png)

- Expected result: Analytic events configured with area of interest

## Step 7 — Setup User Group for GC-X-ONE

- UI path: **Site → Right-Click → Setup → User and Groups**

- Access Site Configuration
  - Right-Click on the Site you want to configure
  - In the context menu that appears, click on "Setup"
  - This will open the Site's configuration page
  - ![Avigilon Image](./images/Avigilon%20 9.png)
  - Navigate to "User and groups"
  - ![Avigilon Image](./images/Avigilon%20 10.png)

- Expected result: User and groups configuration accessed

## Step 8 — Create User Group

- UI path: **Groups → Add**

- Add New Group
  - Navigate to "Groups" and then click "Add"
  - ![Avigilon Image](./images/Avigilon%20 11.png)
  - Add a copy permission, "Restricted Users" for NXGEN
  - ![Avigilon Image](./images/Avigilon%20 12.png)

- Expected result: New user group created

## Step 9 — Configure Group Settings

- Configure Group Details
  - Add the "Name" of the user, recommended to use "NXGEN" or "NXG" in the Name field
  - Add the privileges listed below in "Group Privileges":
    - **View Live Images**:
      - Use PTZ controls
      - Lock PTZ controls
      - Trigger Digital Outputs
      - Broadcast to speakers
    - **Receive live events with identifying features**
    - **View high resolution images**
    - **View Recorded Images**:
      - Export images
      - View images recorded before login
      - Licensed search for identifying features
    - **View Maps**:
      - Manage Maps
    - **Manage user sessions**
    - **Listen to microphones**

- Expected result: Group privileges configured

## Step 10 — Add Cameras to Group

- Add Camera Access
  - Add the cameras you want to appear on GC-X-ONE platform
  - ![Avigilon Image](./images/Avigilon%20 13.png)
  - ![Avigilon Image](./images/Avigilon%20 14.png)
  - ![Avigilon Image](./images/Avigilon%20 15.png)
  - Click "Ok" to save the changes

- Expected result: Cameras assigned to user group

## Step 11 — Configure Alarms

- UI path: **Setup → Alarms**

- Access Alarm Configuration
  - Back to the Setup page from previous step, Navigate to "Alarms"
  - ![Avigilon Image](./images/Avigilon%20 16.png)
  - Click "Add"
  - ![Avigilon Image](./images/Avigilon%20 17.png)

- Expected result: Alarm configuration page accessed

## Step 12 — Set Alarm Trigger Source

- Configure Alarm Triggers
  - Set the alarm trigger source, and select the cameras you are interested in
  - Then click "Next"
  - ![Avigilon Image](./images/Avigilon%20 18.png)

- Expected result: Alarm trigger source configured

## Step 13 — Configure Alarm Recording Settings

- Setup Recording Parameters
  - Select the devices you want to associate the type of alarm with
  - Setup the "Pre-alarm recording time" (recommended 10 seconds)
  - Setup the recording duration below
  - Then click "Next"
  - ![Avigilon Image](./images/Avigilon%20 19.png)

- Expected result: Alarm recording settings configured

## Step 14 — Configure Alarm Recipients

- UI path: **Alarm Recipients → Add Recipients**

- Setup Recipients
  - Select alarm recipients
  - Click on "Add Recipients" and ensure to select the group you configured earlier
  - ![Avigilon Image](./images/Avigilon%20 20.png)
  - Click "Next"

- Expected result: Alarm recipients configured

## Step 15 — Finalize Alarm Configuration

- Complete Alarm Setup
  - Select the user as configured
  - Then click "Add"
  - Select the duration needed to notify the recipient when an alarm is triggered
  - ![Avigilon Image](./images/Avigilon%20 21.png)
  - Don't forget to Save the changes

- Expected result: Alarm configuration completed and saved

## Step 16 — Configure Device in GC-X-ONE

- UI path: **GC-X-ONE → Site → Configuration App → Devices**

- Do
  - Go into the Site that you want to add the device to in GC-X-ONE Configuration App
  - Choose Avigilon as your device, and Fill in the Serial Number, UserName, and Password of the device
![Avigilon Image](./images/Avigilon%20 GC-X-ONE Configuration](./images/Avigilon%2022.png)

- Do
  - Once the details are filled, click on Discover and you should see the sensors discovered

- Expected result: Sensors discovered successfully in GC-X-ONE

## Step 17 — Verify Integration

- Checks
  - Verify WebAPI endpoint is functional
  - Test user group access and permissions
  - Confirm analytics are generating appropriate events
  - Test alarm notifications
  - Verify camera access through configured user group

- Expected result: Complete Avigilon integration with GC-X-ONE platform

# Troubleshooting

- WebAPI endpoint issues
  - Verify WebAPI endpoint is properly installed
  - Check port forwarding configuration
  - Ensure ACC server is accessible externally

- User access problems
  - Verify user group permissions are correctly configured
  - Check camera assignments to user group
  - Ensure proper privileges are granted

- Analytics not working
  - Check sensitivity settings (recommended 8-10)
  - Verify area of interest is properly defined
  - Confirm threshold time and timeout settings

- Alarm configuration issues
  - Verify alarm trigger sources are correctly selected
  - Check recipient configuration matches user group
  - Ensure recording settings are properly configured

# Notes

- WebAPI Endpoint installation is mandatory for external communication
- User group setup is required for GC-X-ONE access
- Analytics configuration at camera level needed for event detection
- Recommended settings: Sensitivity 8-10, Threshold Time 2 seconds, Timeout 10 seconds
- Pre-alarm and post-motion recording recommended at 10 seconds
- Proper port forwarding setup required by IT team

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
