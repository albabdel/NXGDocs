---
title: "Live View Troubleshooting"
description: "Common issues and solutions for live view in GCXONE"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:beginner
  - platform:GCXONE
  - feature:live-view
sidebar_position: 3
last_updated: 2025-12-21
---

# Live View Troubleshooting

## Overview

This guide provides solutions for common live view issues in GCXONE. Many issues overlap with video streaming troubleshooting - see [Video Streaming Troubleshooting](/docs/features/video-streaming/troubleshooting.md) for additional solutions.

---

## Common Issues

### Streams Not Starting

**Symptoms:**
- Live view shows loading spinner but no video
- "Unable to start stream" error
- Black screen in live view window

**Possible Causes and Solutions:**

See [Video Streaming Troubleshooting - No Video Display](/docs/features/video-streaming/troubleshooting.md#no-video-display) for detailed solutions.

Quick fixes:
- Verify device is online
- Check streaming configuration
- Verify user permissions
- Test network connectivity

---

### Poor Stream Quality

**Symptoms:**
- Pixelated or blurry video
- Low resolution display
- Poor image quality

**Possible Causes and Solutions:**

See [Video Streaming Troubleshooting - Poor Video Quality](/docs/features/video-streaming/troubleshooting.md#poor-video-quality) for detailed solutions.

Quick fixes:
- Increase stream quality setting
- Check bandwidth availability
- Verify using primary stream (not sub-stream)
- Enable Local Mode for better quality

---

### Layout Issues

**Symptoms:**
- Layouts not displaying correctly
- Cameras in wrong positions
- Layouts not saving

**Possible Causes and Solutions:**

#### 1. Layout Configuration Error
- **Check**: Layout settings
- **Solution**:
  - Verify cameras are assigned to layout positions
  - Check grid size matches number of cameras
  - Recreate layout if corrupted
  - Clear browser cache and reload

#### 2. Camera Not Available
- **Check**: Camera status
- **Solution**:
  - Verify camera is online
  - Check camera permissions
  - Remove unavailable cameras from layout
  - Replace with available cameras

#### 3. Layout Not Saved
- **Check**: Save permissions
- **Solution**:
  - Verify user has layout management permissions
  - Check if layout name already exists
  - Try different layout name
  - Save layout again

---

### Performance Issues

**Symptoms:**
- Slow stream startup
- Laggy or choppy video
- System performance degradation with multiple streams

**Possible Causes and Solutions:**

See [Video Streaming Troubleshooting - Frequent Buffering](/docs/features/video-streaming/troubleshooting.md#frequent-buffering-or-stuttering) for detailed solutions.

Additional live view specific:
- **Limit Concurrent Streams**: Reduce number of simultaneous streams
- **Use Grid View Efficiently**: Don't exceed system capabilities
- **Enable Local Mode**: For on-site workstations
- **Close Unused Streams**: Close streams when not viewing

---

### Multi-Camera View Problems

**Symptoms:**
- Grid view not working
- Cameras not displaying in grid
- Layout switching issues

**Possible Causes and Solutions:**

#### 1. Too Many Concurrent Streams
- **Check**: Number of streams vs system limit
- **Solution**:
  - Reduce number of cameras in grid
  - Use smaller grid size (e.g., 2x2 instead of 4x4)
  - Use secondary streams for grid views
  - Limit concurrent streams per layout

#### 2. Grid Configuration Issue
- **Check**: Layout configuration
- **Solution**:
  - Verify grid size is appropriate
  - Check camera assignments to grid positions
  - Recreate layout with correct configuration
  - Verify all cameras in layout are available

#### 3. Performance Limitations
- **Check**: System performance
- **Solution**:
  - Check system resources (CPU, memory, network)
  - Reduce stream quality for grid views
  - Use Local Mode if available
  - Upgrade hardware if needed

---

### PTZ Controls Not Available in Live View

**Symptoms:**
- PTZ controls not visible in live view
- PTZ buttons disabled
- Can't control camera from live view

**Possible Causes and Solutions:**

See [PTZ Control Troubleshooting](/docs/features/ptz-control/troubleshooting.md) for detailed solutions.

Quick fixes:
- Verify camera supports PTZ
- Check PTZ is enabled on device
- Verify user has PTZ permissions
- Enable PTZ controls in live view settings

---

## Still Having Issues?

If problems persist:

1. **Check Video Streaming Troubleshooting**: Many live view issues are streaming-related
2. **Gather Information**: Device types, error messages, network configuration
3. **Review Logs**: Check GCXONE and device logs for errors
4. **Contact Support**: [Submit a support ticket](/docs/support) with details

---

## Related Articles

- [Live View Overview](./overview.md)
- [Live View Configuration](./configuration.md)
- [Video Streaming Troubleshooting](/docs/features/video-streaming/troubleshooting.md)
- [PTZ Control Troubleshooting](/docs/features/ptz-control/troubleshooting.md)

---

**Need Help?**

If you need further assistance, [contact support](/docs/support).
