---
title: "Alarm Filtering"
description: "Complete guide for Alarm Filtering"
tags:
  - role:operator
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 6
last_updated: 2025-12-04
---

# Alarm Filtering

Reduce noise and focus on real threats using AI-driven and threshold-based filtering.

## Overview

Alarm Filtering prevents system fatigue by suppressing false triggers and blocking malfunctioning devices. This is achieved through AI object classification and "Overflow" protection.

## Filtering Mechanisms

### 1. AI-Driven Filtering (False Alarm Filtering)
The system uses AI to analyze images/video associated with an alarm to distinguish between "Real" and "False" events.
- **Priority List**: Objects (e.g., "Person") that always trigger a real alarm.
- **Whitelist**: Potential objects (e.g., "Car") that may trigger an alarm based on location/time.
- **Blacklist/Reject**: Objects (e.g., "Bicycle", "Animal") that are suppressed as false alarms.

### 2. Threshold Filtering (Overflow Blocking)
To protect the system from malfunctioning devices (e.g., an Axon camera sending 100 motion events a minute):
- **Default Threshold**: 25 alarms per period.
- **Blocking**: The system automatically blocks a device if it exceeds the threshold, requiring an operator to "Unblock" it after the issue is resolved.

## Configuration Steps

1. **Enable AI Filtering**: In the GCXONE Configuration App, enable "False Alarm Filtering" for supported cameras.
2. **Review Analytics**: Use the Analytics dashboard to verify if filters are correctly identifying objects.
3. **Adjust Thresholds**: Modify the overflow custom property for sites with high legitimate activity.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
