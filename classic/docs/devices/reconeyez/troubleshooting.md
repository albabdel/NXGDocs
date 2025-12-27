---
title: "Reconeyez Troubleshooting"
description: "Complete guide for Reconeyez Troubleshooting"
tags:
  - role:all
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:reconeyez
sidebar_position: 6
last_updated: 2025-12-04
---

# Reconeyez Troubleshooting

Solutions for common Reconeyez integration challenges.

## Common Issues

### Network & Connectivity
- **Issue**: Device is offline in the portal.
- **Solution**: 
    - Check if the SIM card is properly inserted and active.
    - Verify signal strength for LTE/4G deployments.
    - Ensure Wi-Fi credentials are correct if using local wireless.
    - Check firewall rules for outbound traffic to the Reconeyez Cloud.

### Event Capture Failures
- **Issue**: No video clips or snapshots are being generated.
- **Solution**: 
    - Verify event triggers and detection sensitivity in the cloud portal.
    - Check battery levels; low power may limit capture performance.
    - Ensure the camera view is not obstructed and there is enough light for motion detection.

### Integration Problems
- **Issue**: Events are not appearing in GCXONE.
- **Solution**: 
    - Confirm the **Device ID** is correctly entered as the **Serial Number** in GCXONE.
    - Verify the **Webhook URL** and API credentials in both platforms.
    - Check the GCXONE workflow associated with Reconeyez events.

## Best Practices
To optimize battery life, balance event-trigger sensitivity and capture frequency. Review periodic heartbeat signals to ensure system health in remote locations.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
