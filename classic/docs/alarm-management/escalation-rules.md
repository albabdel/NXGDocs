---
title: "Alarm Escalation Rules"
description: "Complete guide for Alarm Escalation Rules"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 5
last_updated: 2025-12-04
---

# Alarm Escalation Rules

Define the transition from automated handling to human intervention.

## Overview

Escalation rules dictate when an alarm should move up the chain of command—for example, from a standard operator queue to an emergency response team, or from L1 support to L2 technical specialists.

## Escalation Triggers

- **Response Time (SLA)**: If an alarm is not claimed within X minutes.
- **Unhandled Alarm**: If an alarm remains in the queue past its defined "Resolution Deadline".
- **SOP Requirement**: Specific high-value zones or alarm types (e.g., Fire/Panic) that bypass standard queues.
- **Customer Uncooperativeness**: If L1 support cannot resolve an issue due to lack of customer cooperation.

## Configuration In Talos

Escalation is typically configured within the **Workflow** module. A "Step" in the workflow can be set to:
1. **Wait** for a specific duration.
2. **Check Status** (Has the alarm been verified?).
3. **Escalate** to a specific User Group or External Contact if the condition is not met.

## Best Practices
- **Early Escalation for Criticals**: Panic and Fire alarms should have a 0-minute escalation rule to ensure immediate visibility.
- **documented SOPs**: Ensure that the "Instructions" section of the workflow clearly explains *why* the escalation is happening and what the next tier should do.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
