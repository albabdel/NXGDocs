---
title: "Avigilon Troubleshooting"
description: "Complete guide for Avigilon Troubleshooting"
tags:
  - role:all
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:avigilon
sidebar_position: 6
last_updated: 2025-12-04
---

# Avigilon Troubleshooting

Common issues and solutions for the Avigilon VMS integration.

## Common Issues

### WebAPI Endpoint Problems
- **Issue**: GCXONE cannot communicate with Avigilon.
- **Solution**: 
    - Verify the **WebAPI Endpoint** is correctly installed on the ACC server.
    - Check that **Port Forwarding** is correctly configured on your router/firewall.
    - Confirm the ACC Server is reachable from an external network.

### User Access Issues
- **Issue**: Cameras are not appearing in GCXONE or access is denied.
- **Solution**: 
    - Check that the **User Group** (e.g., "NXGEN") has been created in Avigilon.
    - Ensure the correct **Privileges** (View Live/Recorded, PTZ, etc.) are assigned to the group.
    - Verify that the specific cameras have been assigned to the "NXGEN" group.

### Analytics Not Working
- **Issue**: Motion or analytic events are not being received.
- **Solution**: 
    - Review **Sensitivity** settings (Recommended: 8–10).
    - Ensure the **Area of Interest** is correctly defined in the camera setup.
    - Verify **Threshold Time** and **Timeout** settings.

### Alarm Configuration Errors
- **Issue**: Alarms are not triggering or being sent to the correct recipients.
- **Solution**: 
    - Check if the correct **Trigger Source** (cameras) is selected.
    - Verify the **Recipient Group** matches the configured NXGEN user group.
    - Confirm **Recording Settings** (Pre/Post-alarm) are active.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
