---
title: "Real-Time Alarm Queue"
description: "Complete guide to managing the alarm queue in Talos CMS with priority sorting and instant acknowledgement"
tags:
  - role:operator
  - category:alarm-management
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-01-27
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Real-Time Alarm Queue

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      The <strong>Talos CMS</strong> serves as the central hub where operators manage the real-time alarm buffer. This unified interface provides comprehensive alarm management capabilities with priority-based sorting, filtering, and instant acknowledgement features.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🚨</div>
      <h3 style={{color: 'white', margin: 0}}>Alarm Queue</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Centralized Management</p>
    </div>
  </div>
</div>

## Overview

The Real-Time Alarm Queue is the primary interface for security operators to receive, process, and manage alarms. It provides a centralized buffer where all incoming alarms are displayed, sorted, and made available for operator action.

### Key Features

- **Centralized Queue:** All alarms displayed in a single, unified interface
- **Priority Sorting:** Automatic sorting by alarm priority and severity
- **Instant Acknowledgement:** Quick acknowledgement capabilities for rapid response
- **Filtering:** Advanced filtering by priority, status, site, device type, and time range
- **Event Grouping:** Related alarms grouped into single events for context

## Understanding Alarms vs. Events

In **GCXONE**, precision in terminology is vital for accurate reporting:

### Alarm

A single notification from a specific device (e.g., a "Line Crossing" detection from Camera 1). Alarms are the raw signals from hardware.

### Event

A logical grouping of related alarms. For example, if a motion sensor triggers at the same time a door contact is breached, **GCXONE** groups them into one **Event** to provide you with the full context of the incident.

**Benefits of Event Grouping:**
- **Complete Context:** See all related alarms together
- **Faster Processing:** Handle related alarms as a single unit
- **Better Reporting:** More accurate incident documentation
- **Reduced Clutter:** Fewer items in queue to manage

## Queue Interface

### Queue Layout

The alarm queue is typically organized into columns:

- **Unassigned:** New alarms waiting for operator assignment
- **Assigned to Me:** Alarms you are currently handling
- **Assigned to Others:** Alarms being handled by other operators
- **Parked:** Alarms temporarily set aside
- **Closed:** Recently resolved alarms

### Alarm Display

Each alarm in the queue shows:

- **Priority Indicator:** Color-coded priority level
- **Alarm Type:** Visual icon representing alarm category
- **Site/Device:** Location and device information
- **Timestamp:** When the alarm was triggered
- **Status:** Current processing status
- **AI Classification:** If available, shows AI verification result

## Prioritization and Severity

Alarms are sorted in the queue by **priority** (e.g., Burglary alarms appear above Motion alerts) or by **timestamp**. High-severity alarms are color-coded to ensure they are addressed immediately.

### Priority Levels

- **Critical (Red):** Life-threatening or property-damaging events
  - Fire alarms
  - Panic buttons
  - Critical security breaches
  
- **High (Orange):** Important security events requiring prompt response
  - Burglary alarms
  - Intrusion detection
  - Forced entry
  
- **Medium (Yellow):** Standard security events
  - Motion detection
  - Door/window contacts
  - Perimeter breaches
  
- **Low (Blue):** Informational or non-critical events
  - System notifications
  - Maintenance alerts
  - Status updates

### Sorting Options

- **By Priority:** Highest priority alarms first
- **By Time:** Newest or oldest alarms first
- **By Site:** Grouped by site location
- **By Device Type:** Grouped by device category

## Assignment Process

### Manual Assignment

Alarms land in the "Unassigned" buffer. You can manually take an alarm by:

1. Clicking **"Assign to Me"** button on the alarm
2. Dragging the alarm into your column
3. Double-clicking the alarm to open and assign

### Auto-Feed

In busy environments, the **"Auto-feed"** feature may be enabled to automatically push high-priority alarms directly to your screen based on your availability. This prevents bottlenecks and ensures critical alarms are handled immediately.

**Auto-Feed Configuration:**
- **Priority Threshold:** Only alarms above this priority are auto-fed
- **Availability Status:** Only active operators receive auto-fed alarms
- **Workload Balancing:** Distributes alarms evenly among available operators

## Workspaces

Operators can be assigned to specific "Workspaces" to route high-priority alarms to specialist teams or specific language-speaking staff.

### Workspace Benefits

- **Specialization:** Route alarms to experts in specific areas
- **Language Support:** Assign alarms to operators speaking specific languages
- **Workload Management:** Distribute alarms based on operator capacity
- **Geographic Routing:** Route alarms to operators familiar with specific regions

## Alarm Actions

### Available Actions

- **Acknowledge:** Mark alarm as received and being processed
- **Dismiss:** Close alarm as false or non-actionable
- **Escalate:** Forward to supervisor or specialist team
- **Snooze:** Temporarily set aside for later review
- **Reassign:** Transfer to another operator
- **Add Notes:** Document observations and actions taken

### Quick Actions

For common scenarios, quick action buttons provide one-click responses:

- **False Alarm:** Quickly mark and close false alarms
- **Verified Real:** Confirm real threat and proceed with response
- **Technical Issue:** Mark as technical problem for IT team
- **Test Alarm:** Identify and close test alarms

## Filtering and Search

### Filter Options

- **Priority:** Filter by alarm priority level
- **Status:** Filter by processing status
- **Site:** Filter by site location
- **Device Type:** Filter by device category
- **Time Range:** Filter by alarm timestamp
- **Custom Criteria:** Advanced filtering with multiple conditions

### Search Functionality

Quick search allows you to find specific alarms by:

- **Alarm ID:** Unique alarm identifier
- **Site Name:** Search by site
- **Device Name:** Search by device
- **Operator Notes:** Search within notes and comments

## Best Practices

1. **Prioritize Critical Alarms:** Always handle critical priority alarms first
2. **Use Event Grouping:** Review related alarms together for complete context
3. **Document Actions:** Add notes to all alarms for audit trail
4. **Regular Queue Review:** Check queue frequently to prevent backlog
5. **Collaborate:** Use reassignment when you need specialist help

## Related Articles

- [Alarm Prioritization](/docs/alarm-management/alarm-prioritization)
- [Alarm Actions](/docs/alarm-management/alarm-actions)
- [Alarm Verification](/docs/alarm-management/alarm-verification)
- [Alarm Filtering](/docs/alarm-management/alarm-filtering)
- [Operator Training Guide](/docs/operator-guide-training-guide)

## Need Help?

If you're experiencing issues with the alarm queue, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support/contact-support).
