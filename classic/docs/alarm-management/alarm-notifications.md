---
title: "Alarm Notifications"
description: "Complete guide for Alarm Notifications"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 8
last_updated: 2025-12-04
---

# Alarm Notifications

Configure how and when users receive alerts about security events.

## Overview

Notifications provide immediate awareness of alarms via Email, SMS, or Push Notifications, ensuring that even users away from the operator terminal remain informed.

## Notification Channels

- **Email**: Detailed reports including snapshots, site info, and timestamps.
- **SMS**: Concise alerts for immediate action.
- **Push (Mobile App)**: Direct interaction with the alarm, allowing users to view live video or snapshots.
- **Voice Calls**: Automated voice announcements for high-priority alerts.

## Configuration Steps

1. **User Profile**: Ensure the user's contact information (email/phone) is correctly configured in Talos.
2. **Workflow Integration**: Add a "Send Notification" step in the relevant Alarm Workflow.
3. **Condition Filtering**: Set filters so users only receive notifications for the sites and alarm types they are responsible for.

## Best Practices
- **Notification Throttle**: Avoid "alert fatigue" by setting frequency limits or only sending notifications for critical alarms.
- **Rich Content**: Always include a link to the snapshot or live stream in the notification to allow for instant verification.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
