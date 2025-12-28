---
title: "Alarm Actions"
description: "Complete guide to alarm actions: acknowledge, dismiss, escalate, reassign, and manage alarms in GCXONE"
tags:
  - role:operator
  - category:alarm-management
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 4
last_updated: 2025-01-27
---

# Alarm Actions

Comprehensive action toolkit for managing alarms: acknowledge, dismiss, escalate, snooze, reassign, and add operator notes.

## Overview

**Alarm Actions** provide operators with a comprehensive toolkit to manage alarms throughout their lifecycle. From initial assignment to final resolution, GCXONE offers a range of actions that enable efficient alarm handling, proper documentation, and seamless workflow execution.

## Core Alarm Actions

### 1. Acknowledge Alarm

**Purpose:** Mark an alarm as being actively handled by an operator.

**When to Use:**
- When you begin working on an alarm
- To indicate you've seen and are processing the event
- To prevent other operators from taking the same alarm

**How to Acknowledge:**
1. Select the alarm in the queue
2. Click **"Acknowledge"** or press the keyboard shortcut
3. The alarm status changes to "Acknowledged" and is assigned to you

### 2. Assign/Reassign Alarm

**Purpose:** Assign an alarm to yourself or another operator.

**When to Use:**
- Taking ownership of an unassigned alarm
- Transferring an alarm to a specialist operator
- Distributing workload across the team

**How to Assign:**
1. Select the alarm
2. Click **"Assign to Me"** or **"Reassign"**
3. Choose the target operator from the dropdown
4. Optionally add a note explaining the reassignment

### 3. Dismiss/Close Alarm

**Purpose:** Mark an alarm as resolved and remove it from the active queue.

**When to Use:**
- After verifying the alarm is false
- After completing the required response actions
- When the incident has been resolved

**How to Dismiss:**
1. Complete all required workflow steps
2. Click **"Close"** or **"Dismiss"**
3. Select the closure reason:
   - **Real Alarm** - Genuine security event that was handled
   - **False Alarm** - False positive, no actual threat
   - **Technical** - System or device malfunction
4. Add a brief note describing the resolution

### 4. Escalate Alarm

**Purpose:** Elevate an alarm to a supervisor or specialist team.

**When to Use:**
- When an alarm requires higher-level attention
- When you need assistance from a specialist
- When an alarm exceeds your authority level

**How to Escalate:**
1. Select the alarm
2. Click **"Escalate"**
3. Choose the escalation target (Supervisor, Manager, Specialist Team)
4. Add a note explaining why escalation is needed
5. The alarm is automatically routed to the selected recipient

### 5. Snooze/Park Alarm

**Purpose:** Temporarily remove an alarm from your active view with automatic return.

**When to Use:**
- Waiting for a callback from police or keyholder
- Temporarily deferring non-critical alarms
- Managing workflow when handling multiple alarms

**How to Snooze:**
1. Select the alarm
2. Click **"Snooze"** or **"Park"**
3. Set the duration (15 minutes, 30 minutes, 1 hour, etc.)
4. The alarm disappears from your active window
5. The alarm automatically returns after the set duration

### 6. Add Operator Notes

**Purpose:** Document actions taken, observations, and important information.

**When to Use:**
- Recording actions taken during alarm handling
- Documenting observations from video review
- Adding context for other operators or supervisors
- Creating an audit trail

**How to Add Notes:**
1. Select the alarm
2. Click **"Add Note"** or use the notes field
3. Enter your observation or action
4. Notes are timestamped and linked to your operator account

## Advanced Actions

### 7. Isolate Device/Site

**Purpose:** Temporarily suspend monitoring for a specific device or site.

**When to Use:**
- During scheduled maintenance
- When a technician is on-site
- During planned deliveries or events

**How to Isolate:**
1. Select the alarm or navigate to device settings
2. Click **"Isolate"** or **"Disarm Temporarily"**
3. Set the isolation duration (30 minutes to 8 hours)
4. GCXONE automatically re-arms the device after the timer expires

### 8. Test Mode

**Purpose:** Place a site in test mode to log alarms without displaying them in the active queue.

**When to Use:**
- During system testing or maintenance
- When verifying device functionality
- During training exercises

**How to Enable Test Mode:**
1. Navigate to site settings in Talos CMS
2. Enable **"Test Mode"**
3. Alarms are logged but don't appear in the active queue
4. Disable test mode when testing is complete

### 9. Audio Announcement

**Purpose:** Make live audio announcements through IP speakers at the site.

**When to Use:**
- Deterring intruders with verbal warnings
- Directing authorized personnel
- Emergency announcements

**How to Use Audio:**
1. Select the alarm
2. Click **"Audio"** or **"SIP Announcement"**
3. Use the microphone to speak live
4. Or select a pre-recorded message
5. The announcement is broadcast through site speakers

### 10. Trigger Digital Output

**Purpose:** Remotely activate lights, gates, sirens, or other devices.

**When to Use:**
- Illuminating an area during an alarm
- Activating deterrent devices
- Controlling access points

**How to Trigger:**
1. Select the alarm
2. Click **"I/O Control"** or **"Digital Output"**
3. Select the output to activate
4. Confirm the action
5. The device activates immediately

## Workflow Integration

Every alarm action is integrated with **Workflows** - predefined sequences that guide operator responses:

1. **Initial Assessment:** Determine if alarm is real or false
2. **Audio Deterrence:** Use GCXONE Audio (SIP) for live announcements
3. **Intervention:** Call keyholder, guard service, or police
4. **Parallel Actions:** Automated actions run in background (SMS, email, I/O triggers)
5. **Documentation:** Record all actions in notes and audit logs

## Best Practices

### Action Timing
- **Acknowledge immediately** when taking an alarm to prevent duplicate handling
- **Add notes in real-time** rather than waiting until closure
- **Use snooze sparingly** - only for non-critical alarms when waiting for callbacks

### Documentation
- **Be specific in notes** - include timestamps, actions taken, and outcomes
- **Use standardized terminology** for consistency across operators
- **Document false alarms** to help improve system tuning

### Workflow Adherence
- **Follow the workflow steps** in the order presented
- **Don't skip steps** unless explicitly authorized
- **Escalate when uncertain** rather than making assumptions

## Keyboard Shortcuts

For faster alarm handling, use keyboard shortcuts:

- **A** - Acknowledge alarm
- **C** - Close alarm
- **E** - Escalate alarm
- **N** - Add note
- **S** - Snooze alarm
- **R** - Reassign alarm

## Related Articles

- [Real-Time Alarm Queue](/docs/alarm-management/alarm-queue)
- [Alarm Prioritization](/docs/alarm-management/alarm-prioritization)
- [Alarm Verification](/docs/alarm-management/alarm-verification)
- [Operator Training Guide](/docs/alarm-management/operator-training)
- [Alarm Workflows](/docs/alarm-management/alarm-routing)

## Need Help?

If you're experiencing issues with alarm actions, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support/contact-support).
- [Support Resources](/docs/support)

## Need Help?

If you encounter issues during configuration, please:

1. Check the [troubleshooting guide](/docs/troubleshooting)
2. Review the [FAQ](/docs/knowledge-base/faq)
3. [Contact support](/docs/support/contact-support) for assistance
