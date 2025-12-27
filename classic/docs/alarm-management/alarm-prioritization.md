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

Ensure critical events receive immediate attention through tiered prioritization.

## Overview

Not all alarms are created equal. Prioritization ensures that life-safety events (Fire, Panic) always appear at the top of the operator queue, ahead of low-priority events like technical faults or scheduled heartbeats.

## Priority Tiers

- **Priority 1 (Critical)**: Fire, Panic, Burglary in progress. Immediate operator intervention required.
- **Priority 2 (High)**: Line crossing in restricted areas, known trespassers.
- **Priority 3 (Medium)**: Motion detection in standard areas, suspicious activity.
- **Priority 4 (Low)**: Technical faults, battery alerts, communication heartbeats.

## Configuration In Talos

1. **Alarm Codes**: Assign a priority level to each unique alarm code in the Talos configuration.
2. **Dynamic Prioritization**: Alarms can be dynamically re-prioritized based on the site status (e.g., a "Motion" alarm becomes Priority 1 if the site is in "Armed" mode).
3. **Queue Sorting**: The Talos Alarm Queue is automatically sorted by priority level and then by urgency (time since arrival).

## Best Practices
- **Periodic Review**: Regularly review your priority mappings to ensure they reflect the evolving security needs of the customer.
- **Avoid Over-Prioritization**: If too many events are marked as "Critical," the queue becomes cluttered, defeating the purpose of prioritization.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
