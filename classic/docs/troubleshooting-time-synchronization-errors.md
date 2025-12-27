---
id: "troubleshooting-time-synchronization-errors"
title: "Correcting Time Synchronization Errors Between Genesis and Talos"
slug: "troubleshooting-time-synchronization-errors"
description: "Guide for diagnosing and resolving time synchronization issues between Genesis and Talos platforms"
---

# Correcting Time Synchronization Errors Between Genesis and Talos

Time synchronization between Genesis and Talos is critical for accurate alarm processing, event logging, and video playback. This guide helps you diagnose and resolve time synchronization errors.

:::warning Important
Time synchronization issues can cause:
- Misaligned alarm timestamps
- Playback errors
- Event sequence problems
- Forensic investigation difficulties
:::

## Quick Checklist

- [ ] Verify NTP configuration on devices
- [ ] Check time zone settings in Genesis
- [ ] Verify time zone settings in Talos
- [ ] Check for Daylight Saving Time (DST) configuration
- [ ] Compare timestamps between Genesis and Talos for the same event
- [ ] Verify network connectivity to NTP servers

## Common Causes

1. **Incorrect NTP Server Configuration**: Devices not properly configured to sync with NTP servers
2. **Time Zone Mismatch**: Different time zones configured in Genesis vs. Talos
3. **Daylight Saving Time Issues**: DST not enabled or incorrectly configured
4. **Network Connectivity**: Devices unable to reach NTP servers
5. **Device Clock Drift**: Device clocks drifting due to lack of NTP sync

## Troubleshooting Steps

### 1. Verify NTP Configuration

Ensure all devices are configured to sync with the appropriate NTP servers:

- **VPN Customers**: Use `time1.nxgen.cloud` or `time2.nxgen.cloud`
- **Non-VPN/Public Connections**: Use `timeext1.nxgen.cloud`

For detailed NTP configuration, see the [NTP Configuration Guide](/docs/getting-started/ntp-configuration).

### 2. Check Time Zone Settings

1. **Genesis Time Zone**:
   - Navigate to Settings → Time Zone
   - Verify the time zone matches your operational region
   - Ensure DST is enabled if applicable

2. **Talos Time Zone**:
   - Navigate to Settings → Time Zone
   - Verify the time zone matches Genesis configuration
   - Check DST settings

### 3. Verify Device Time Synchronization

1. Access the device dashboard in Genesis
2. Check the device's current time vs. platform time
3. Look for time difference warnings
4. Verify NTP sync status on the device

### 4. Compare Timestamps

Compare timestamps for the same alarm or event in both Genesis and Talos:

1. Find a recent alarm in Genesis
2. Locate the same alarm in Talos
3. Compare timestamps - they should match or be very close
4. If there's a significant difference (> 1 minute), investigate further

## Resolution Steps

### Step 1: Configure NTP on Devices

1. Access device configuration
2. Navigate to Time/Date settings
3. Configure NTP server (use appropriate server based on connection type)
4. Enable NTP synchronization
5. Save and verify sync status

### Step 2: Align Time Zones

1. Ensure Genesis and Talos use the same time zone
2. Enable DST in both platforms if applicable
3. Verify time zone settings match your operational region

### Step 3: Verify Synchronization

1. Wait 5-10 minutes after configuration changes
2. Check device time vs. platform time
3. Verify no time difference warnings
4. Test with a new alarm to confirm timestamps align

## Related Documentation

- [NTP Configuration Guide](/docs/getting-started/ntp-configuration)
- [Timezone Management](/docs/admin-guide/timezone-management)
- [Device Configuration](/docs/devices)

## Need Help?

If time synchronization issues persist after following these steps, contact [GCXONE Support](/docs/support) with:
- Device IDs experiencing issues
- Screenshots of time settings from Genesis and Talos
- Examples of timestamp mismatches
- NTP server configuration details


