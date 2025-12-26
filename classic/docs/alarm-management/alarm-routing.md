---
title: "Alarm Routing Configuration"
description: "Complete guide for Alarm Routing Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
sidebar_position: 9
last_updated: 2025-12-04
---

# Alarm Routing Configuration

Direct alarms to the right responder using logic-based routing in Talos.

## Overview

Alarm Routing ensures that every security event is forwarded to the appropriate operator terminal, mobile device, or central station based on predefined conditions.

## Routing Levels

- **Global Routing**: Applies to all sites in the organization.
- **Group Routing**: Directs alarms from specific site groups (e.g., "North Region" or "Premium Customers").
- **Site-Specific Routing**: Tailored rules for individual high-security locations.

## Configuration Steps

### 1. Define Conditions
Routing is based on "Incoming Conditions" such as:
- **Alarm Code**: (e.g., Burglary, Fire, Panic).
- **Zone/Partition**: Specific areas within a site.
- **Time/Schedule**: Routing differently after hours or during weekends.

### 2. Assign Workflows
Each routing rule points to a specific **Workflow**. The workflow dictates the sequence of actions (Email, SMS, PTZ move, Operator prompt) once the alarm reaches its destination.

### 3. Automated Routing
Use automated workflows for low-priority alerts or system notifications that don't require human intervention, such as "Test Mode" heartbeats.

## Best Practices
- **Managed Workflows**: Create a single "Managed" workflow and assign it to multiple routing rules to simplify maintenance.
- **Redundancy**: Always configure a fallback routing rule in case the primary destination is unavailable.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
