---
title: "Alarm Queue Management"
description: "Complete guide for Alarm Queue Management"
tags:
  - role:operator
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 2
last_updated: 2025-12-04
---

# Alarm Queue Management

Efficiently handle incoming alarms through the structured queue system in Talos and GCXONE.

## Overview

The Alarm Queue is the primary interface for operators to receive, claim, and process security events. Efficient queue management ensures that no alarm is left unaddressed and that response times meet SLA requirements.

## Key Concepts

- **Queue Priority**: Alarms are prioritized based on their type, severity, and customer tier.
- **L1 Support Queue**: The first point of entry for technical alarms where basic troubleshooting occurs (checking site/device info).
- **L2 Escalation**: Alarms that require specialist intervention are escalated to senior technical teams.

## Queue Handling Procedures

### 1. Initial Claim
When an alarm arrives in the queue, an operator must "Claim" it. This locks the alarm to that operator, preventing duplicate effort.

### 2. Information Verification
The operator should immediately verify:
- **Site Name and Location**: Is the context clear?
- **Device Details**: Is the specific sensor or camera identified?
- **Alarm Type**: Is it a burglary, fire, technical fault, or health check?

### 3. Queue Resolution
If the alarm is a false trigger or a resolved technical issue, it can be "Closed" with the appropriate resolution code. If intervention is needed, the operator follows the site-specific workflow.

## Best Practices
- **Never wait for incomplete info**: If critical details are missing from a ticket, immediately contact the customer rather than let the alarm sit in the queue.
- **Consolidated Resolution**: Address groups of related alarms together to solve the root cause rather than treating them as isolated incidents.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
