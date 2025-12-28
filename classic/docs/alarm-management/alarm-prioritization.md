---
title: "Alarm Prioritization"
description: "Complete guide for Alarm Prioritization"
tags:
  - role:operator
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 3
last_updated: 2025-12-04
---

# Alarm Prioritization

Ensure critical events receive immediate attention through tiered prioritization and intelligent routing.

## Overview

Not all alarms are created equal. **GCXONE** prioritization ensures that life-safety events (Fire, Panic) always appear at the top of the operator queue, ahead of low-priority events like technical faults or scheduled heartbeats. The system uses a sophisticated multi-level priority system with visual indicators and automatic sorting for efficient triage.

## Priority Tiers

The GCXONE alarm prioritization system uses four distinct priority levels:

- **Priority 1 (Critical)**: Fire, Panic, Burglary in progress. Immediate operator intervention required. These alarms appear at the top of the queue with red indicators.
- **Priority 2 (High)**: Line crossing in restricted areas, known trespassers, intrusion detection in armed zones. High-priority alarms are color-coded orange/yellow.
- **Priority 3 (Medium)**: Motion detection in standard areas, suspicious activity, environmental alerts. Medium-priority alarms appear with standard indicators.
- **Priority 4 (Low)**: Technical faults, battery alerts, communication heartbeats, routine maintenance notifications. Low-priority alarms are visually de-emphasized.

## Event Grouping and Severity Routing

**GCXONE** groups related alarms into a single **Event** to provide operators with comprehensive context. For example, if a motion sensor triggers at the same time a door contact is breached, the system groups them into one Event.

### Severity-Based Sorting

Alarms are sorted in the queue by:
- **Priority Level**: Critical alarms always appear first
- **Timestamp**: Within the same priority, newest alarms appear first (or oldest, depending on configuration)
- **Site Status**: Alarms from armed sites are automatically elevated in priority
- **Device Type**: Life-safety devices (fire, panic) are prioritized over routine monitoring

## Configuration In Talos

### 1. Alarm Code Priority Assignment

Assign a priority level to each unique alarm code in the Talos configuration:

1. Navigate to **Talos CMS Configuration**
2. Select **Alarm Codes** or **Event Types**
3. For each alarm code, assign a priority level (1-4)
4. Configure dynamic priority rules based on site status

### 2. Dynamic Prioritization

Alarms can be dynamically re-prioritized based on contextual factors:

- **Site Arming Status**: A "Motion" alarm becomes Priority 1 if the site is in "Armed" mode
- **Time of Day**: Configure different priorities for business hours vs. after-hours
- **Zone Configuration**: Restricted zones automatically elevate alarm priority
- **Device Health**: Technical alarms from critical devices may be elevated

### 3. Queue Sorting Configuration

The Talos Alarm Queue is automatically sorted by:
1. Priority level (Critical → High → Medium → Low)
2. Urgency (time since arrival)
3. Site importance (if configured)
4. Operator assignment status

### 4. Workspace-Based Routing

Operators can be assigned to specific **Workspaces** to route high-priority alarms to specialist teams:

- **Language-Specific Workspaces**: Route alarms to operators fluent in specific languages
- **Expertise-Based Routing**: Route technical alarms to technical specialists
- **Geographic Routing**: Route alarms to operators familiar with specific regions

## Visual Indicators

The alarm queue uses color-coding and icons to indicate priority:

- 🔴 **Red**: Critical priority (Priority 1)
- 🟠 **Orange**: High priority (Priority 2)
- 🟡 **Yellow**: Medium priority (Priority 3)
- ⚪ **Gray**: Low priority (Priority 4)

## Best Practices

### Priority Assignment Guidelines

- **Life-Safety First**: Always prioritize fire, panic, and medical emergencies as Critical
- **Context Matters**: Consider site type, time of day, and arming status when assigning priorities
- **Avoid Over-Prioritization**: If too many events are marked as "Critical," the queue becomes cluttered, defeating the purpose of prioritization
- **Regular Review**: Periodically review your priority mappings to ensure they reflect the evolving security needs of the customer

### Queue Management

- **Monitor Queue Depth**: Keep an eye on the number of unassigned alarms in each priority tier
- **Balance Workload**: Distribute high-priority alarms across available operators
- **Use Auto-Feed**: Enable automatic assignment for high-priority alarms to ensure rapid response
- **Escalation Rules**: Configure automatic escalation if high-priority alarms remain unassigned

## Related Articles

- [Real-Time Alarm Queue](/docs/alarm-management/alarm-queue)
- [Alarm Routing Rules](/docs/alarm-management/alarm-routing)
- [Escalation Rules](/docs/alarm-management/escalation-rules)
- [Operator Training Guide](/docs/alarm-management/operator-training)

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
