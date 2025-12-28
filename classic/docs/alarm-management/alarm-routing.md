---
title: "Alarm Routing Rules"
description: "Complete guide to configuring intelligent alarm routing and escalation based on site, device, priority, and time"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 6
last_updated: 2025-01-27
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Alarm Routing Rules

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Intelligent routing engine directing alarms to specific operators, teams, or queues based on site, device, priority, or time. <strong>GCXONE</strong> utilizes customizable Workflows to define exactly how an alarm travels through the system.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🔄</div>
      <h3 style={{color: 'white', margin: 0}}>Alarm Routing</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Intelligent Distribution</p>
    </div>
  </div>
</div>

## Overview

Alarm Routing Rules ensure that alarms are delivered to the right operators at the right time. This intelligent distribution system optimizes response times and ensures that alarms are handled by operators with the appropriate expertise and availability.

## Routing Logic

Alarms can be routed based on multiple criteria:

### Routing Criteria

- **Alarm Code:** Route specific alarm types to specialized teams
- **Zone:** Route based on physical location or zone
- **Schedule:** Route differently based on time of day or day of week
- **Regular Expression:** Advanced routing using pattern matching in data payload
- **Priority:** Route high-priority alarms to senior operators
- **Site:** Route based on site location or customer
- **Device Type:** Route based on device category

### Routing Examples

**Example 1: Priority-Based Routing**
- Critical alarms → Senior Operator Team
- High priority → Standard Operator Team
- Medium/Low priority → Junior Operator Team

**Example 2: Time-Based Routing**
- Business Hours (9 AM - 5 PM) → Day Shift Team
- After Hours (5 PM - 9 AM) → Night Shift Team
- Weekends → Weekend Team

**Example 3: Site-Based Routing**
- Site A → Operator Team 1
- Site B → Operator Team 2
- Site C → Operator Team 3

## Workflow Configuration

**GCXONE** utilizes customizable Workflows to define exactly how an alarm travels through the system.

### Creating a Workflow

1. Navigate to **Configuration App** > **Workflows**
2. Click **Add Workflow**
3. Define workflow name and description
4. Configure routing rules:
   - **Conditions:** When this workflow applies
   - **Actions:** What happens when workflow triggers
   - **Routing:** Where alarms are sent
5. Test the workflow
6. Activate the workflow

### Workflow Components

- **Trigger Conditions:** When the workflow activates
- **Routing Rules:** Where alarms are sent
- **Actions:** Automated actions to perform
- **Escalation:** What happens if alarm isn't handled
- **Notifications:** Who to notify

## Escalation Rules

Administrators can configure rules to automatically notify managers via Email or SMS if an alarm remains in the queue for too long (e.g., >5 minutes) without operator action.

### Escalation Configuration

1. Navigate to **Configuration App** > **Escalation Rules**
2. Click **Add Rule**
3. Configure:
   - **Time Threshold:** Duration before escalation (e.g., 5 minutes)
   - **Priority Filter:** Which alarms to escalate
   - **Escalation Target:** Manager or supervisor to notify
   - **Notification Method:** Email, SMS, or both
4. Save the rule

### Escalation Levels

- **Level 1:** Notify supervisor after X minutes
- **Level 2:** Notify manager after Y minutes
- **Level 3:** Notify executive after Z minutes

## Auto-Feed

This feature automatically assigns matching alarms to available operators based on their expertise or current workload, preventing bottlenecks.

### Auto-Feed Configuration

- **Operator Availability:** Only assign to active operators
- **Workload Balancing:** Distribute alarms evenly
- **Expertise Matching:** Route to operators with relevant skills
- **Priority Handling:** High-priority alarms bypass queue

## Multi-Site Alarm Management

For large-scale operations, sites are organized into Site Groups or Organizational Units. This allows a single "Managed Workflow" to be applied to hundreds of sites simultaneously, ensuring standardized security responses across an entire enterprise.

### Site Group Configuration

1. Navigate to **Configuration App** > **Site Groups**
2. Create or select a site group
3. Assign sites to the group
4. Apply workflow to the entire group
5. Configure group-specific routing rules

## Routing Best Practices

1. **Balance Workload:** Distribute alarms evenly among operators
2. **Specialize Teams:** Route alarms to operators with relevant expertise
3. **Time-Based Routing:** Adjust routing based on shift schedules
4. **Priority Handling:** Ensure critical alarms get immediate attention
5. **Regular Review:** Monitor routing effectiveness and adjust as needed

## Related Articles

- [Escalation Rules](/docs/alarm-management/escalation-rules)
- [Multi-Site Alarm Management](/docs/alarm-management/multi-site-alarms)
- [Alarm Queue](/docs/alarm-management/alarm-queue)
- [Workflow Configuration](/docs/admin-guide/workflows)

## Need Help?

If you need assistance configuring alarm routing, check our [Configuration Guide](/docs/admin-guide) or [contact support](/docs/support/contact-support).
