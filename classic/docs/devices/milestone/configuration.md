---
title: "Milestone VMS Configuration"
description: "Step-by-step configuration guide for Milestone VMS integration with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:milestone
sidebar_position: 2
last_updated: 2025-12-20
---

# Milestone VMS Configuration

## Overview

This comprehensive guide covers Milestone XProtect VMS integration with GCXONE, including basic configuration and advanced alarm management with I/O triggers.

**What you'll accomplish:**
- Configure Milestone XProtect for GCXONE integration
- Enable and configure Mobile Server for cloud access
- Set up user permissions and network settings
- Configure advanced alarm management with I/O triggers
- Add Milestone to GCXONE platform
- Configure cameras, events, and PTZ
- Verify all integration features

**Estimated time**: 60-90 minutes

## Prerequisites

- [ ] Milestone XProtect (2020 R1 or higher) installed
- [ ] Administrative access to Milestone Management Client
- [ ] Network connectivity to GCXONE platform
- [ ] GCXONE account with device permissions
- [ ] Cameras configured and recording in Milestone
- [ ] Static IP or DDNS for Milestone server

---

## Configuration Workflow

1. **Basic Configuration** - Configure Milestone server, Mobile Server, users, and network (Steps 1-6)
2. **Advanced Alarm Configuration** - Set up I/O triggers, alarm definitions, and rules (Steps 7-11, optional)
3. **GCXONE Integration** - Add Milestone to GCXONE and configure integration (Steps 12-15)
4. **Verification** - Test all features

---

## Part 1: Basic Milestone Configuration

### Step 1: Access Milestone Management Client

**Objective**: Access Milestone Management Client to begin configuration.

1. Launch Milestone Management Client on Windows server
2. Log in with administrator credentials
3. Verify XProtect version is 2020 R1 or higher
4. Check system status for any errors

![Milestone Management Client](./images/config-step1.png)

**Expected Result**: Successfully logged into Management Client.

---

### Step 2: Enable and Configure Mobile Server

**Objective**: Enable Mobile Server for GCXONE cloud integration.

1. In Management Client, navigate to **Servers** → **Mobile Server**
2. Click **Enable Mobile Server**
3. Configure Mobile Server settings:
   - **Port**: 8081 (default) or custom
   - **Enable HTTPS**: ✓ Recommended
   - **Authentication**: Windows or Basic
4. Click **Apply** and **Start** Mobile Server

![Mobile Server Configuration](./images/config-step2.png)

**Expected Result**: Mobile Server running and accessible.

---

### Step 3: Configure Network Settings

**Objective**: Configure network for cloud access.

1. Navigate to **Tools** → **Options** → **Network**
2. Verify server IP and network settings
3. Configure firewall for ports 8081, 443, 554
4. Test external connectivity

![Network Configuration](./images/config-step3.png)

**Expected Result**: Network configured, Mobile Server accessible.

---

### Step 4: Create Integration User

**Objective**: Create dedicated user for GCXONE.

1. Navigate to **Security** → **Users**
2. Click **Add User**
3. Configure:
   - **Username**: `gcxone_integration`
   - **Password**: Strong password
   - **Role**: Administrator or custom with full permissions
4. Enable mobile access, playback, PTZ, events

![User Configuration](./images/config-step4.png)

**Expected Result**: Integration user created.

---

### Step 5: Configure Cameras

**Objective**: Verify camera configuration.

1. Navigate to **Devices** → **Cameras**
2. For each camera verify:
   - Enabled and recording
   - Streams configured
   - Motion detection enabled
   - PTZ settings (if applicable)

![Camera Configuration](./images/config-step5.png)

**Expected Result**: All cameras configured and streaming.

---

### Step 6: Configure Recording Storage

**Objective**: Verify storage settings.

1. Navigate to **Recording** → **Storage**
2. Verify:
   - Available disk space
   - Retention period (7-30 days)
   - Recording schedules

![Storage Configuration](./images/config-step6.png)

**Expected Result**: Storage configured with retention.

---

## Part 2: Advanced Alarm Configuration (Optional)

### Step 7: Configure I/O Hardware

**Objective**: Set up I/O devices for alarms.

1. Navigate to **Devices** → **Input/Output**
2. Add I/O hardware devices
3. Configure inputs (e.g., "Door Contact")
4. Configure outputs for alarm responses

![I/O Hardware](./images/alarm-step1.png)

**Expected Result**: I/O hardware configured.

---

### Step 8: Create Alarm Definitions

**Objective**: Define alarms for events.

1. Navigate to **Alarms** → **Alarm Definitions**
2. Click **Add Alarm Definition**
3. Configure name, priority, category
4. Enable alarm

![Alarm Definitions](./images/alarm-step2.png)

**Expected Result**: Alarm definitions created.

---

### Step 9: Configure Alarm Triggers

**Objective**: Set up alarm triggers.

1. In Alarm Definition → **Trigger** tab
2. Add trigger source (I/O input, analytics)
3. Configure conditions and schedule

![Alarm Triggers](./images/alarm-step3.png)

**Expected Result**: Alarms trigger on events.

---

### Step 10: Configure Alarm Actions

**Objective**: Define alarm actions.

1. In Alarm Definition → **Actions** tab
2. Add actions:
   - Record video
   - Trigger outputs
   - Send notifications
3. Configure delays and durations

![Alarm Actions](./images/alarm-step4.png)

**Expected Result**: Alarm actions configured.

---

### Step 11: Configure Automation Rules

**Objective**: Create automation workflows.

1. Navigate to **Rules and Events** → **Rules**
2. Click **Add Rule**
3. Configure event, condition, action
4. Enable and test rule

![Rules Configuration](./images/alarm-step5.png)

**Expected Result**: Rules configured for automation.

---

## Part 3: GCXONE Platform Integration

### Step 12: Add Milestone in GCXONE

**Objective**: Register Milestone in GCXONE.

1. Log into GCXONE web portal
2. Navigate to **Devices** → **Add Device**
3. Select **Milestone VMS**
4. Enter details:
   - Device name
   - IP address
   - Port 8081
   - Username/password
5. Test connection and add

![Add in GCXONE](./images/config-gcxone-add.png)

**Expected Result**: Milestone added, status "Online".

---

### Step 13: Configure Camera Mappings

**Objective**: Map cameras to GCXONE.

1. Navigate to Milestone device in GCXONE
2. Click **Configure Cameras**
3. For each camera:
   - Assign to site/location
   - Enable cloud streaming
   - Enable event forwarding
   - Enable timeline
4. Save configuration

![Camera Mapping](./images/config-step10.png)

**Expected Result**: Cameras mapped and accessible.

---

### Step 14: Configure Events and Notifications

**Objective**: Set up event forwarding.

1. Navigate to **Event Configuration**
2. Enable forwarding:
   - Motion detection
   - Alarms
   - Analytics
   - System events
3. Configure notifications
4. Set event actions

![Event Configuration](./images/config-step11.png)

**Expected Result**: Events forwarded with notifications.

---

### Step 15: Configure PTZ and Advanced Features

**Objective**: Enable advanced features.

1. Configure PTZ presets in Milestone
2. Verify PTZ controls in GCXONE
3. Configure PTZ tours
4. Enable Genesis Audio if needed
5. Test bookmarks and timeline

![PTZ Configuration](./images/config-step12.png)

**Expected Result**: Advanced features functional.

---

## Verification Checklist

- [ ] Cloud streaming works
- [ ] Playback functional
- [ ] Timeline shows events
- [ ] Alarms trigger correctly
- [ ] Notifications sent
- [ ] PTZ controls work
- [ ] Mobile app access works
- [ ] Device status "Online"

---

## Advanced Configuration

### Multi-Server Setup
- Configure multiple Milestone servers
- Set up federation
- Add each server in GCXONE

### High Availability
- Configure failover server
- Set up database mirroring
- Test failover scenarios

### Analytics Integration
- Add analytics plugins
- Configure analytics rules
- Forward events to GCXONE

---

## Troubleshooting

**Mobile Server not accessible:**
- Check port 8081 open in firewall
- Verify service running
- Test external connectivity

**Connection fails:**
- Verify IP and credentials
- Check Mobile Server enabled
- Review Milestone logs

**No playback:**
- Verify recording enabled
- Check storage space
- Confirm retention period

See Troubleshooting Guide for more.

---

## Related Articles

- [Milestone VMS Overview](./overview.md)
- Milestone VMS Troubleshooting
- 
- 

---

**Need Help?**

[Contact support](/docs/troubleshooting-support/how-to-submit-a-support-ticket) for Milestone VMS assistance.
