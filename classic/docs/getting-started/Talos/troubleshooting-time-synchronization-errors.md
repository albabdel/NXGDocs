---
title: "Correcting Time Synchronization Errors Between Genesis and Talos"
description: "Guide to diagnosing and resolving time synchronization issues between NXGEN Genesis and Evalink Talos"
tags:
  - role:admin
  - category:troubleshooting
  - difficulty:intermediate
  - platform:talos
sidebar_position: 5
last_updated: 2025-12-21
---

# Correcting Time Synchronization Errors Between Genesis and Talos

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Time synchronization is critical for accurate alarm processing and event correlation between Genesis and Talos. This guide helps you diagnose and resolve time synchronization errors.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>⏰</div>
      <h3 style={{color: 'white', margin: 0}}>Time Sync</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Troubleshooting</p>
    </div>
  </div>
</div>

## Overview

Accurate time synchronization between NXGEN Genesis and Evalink Talos is essential for:
- Proper alarm sequencing
- Accurate event correlation
- Reliable log analysis
- Compliance and audit requirements
- Troubleshooting and diagnostics

When time is out of sync, you may experience:
- Alarms appearing in the wrong order
- Difficulty correlating events between systems
- Inaccurate timestamps in reports
- Issues with scheduled workflows

## Common Symptoms

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-warning)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>⚠️ Signs of Time Synchronization Issues</h3>
  <ul>
    <li>Alarms appear with incorrect timestamps</li>
    <li>Events are out of sequence</li>
    <li>Time differences between Genesis and Talos are noticeable</li>
    <li>Scheduled workflows trigger at wrong times</li>
    <li>Reports show inconsistent timestamps</li>
    <li>Event logs don't match between systems</li>
  </ul>
</div>

## Diagnostic Steps

### Step 1: Check Current Time in Both Systems

1. **In Genesis:**
   - Navigate to the device dashboard
   - Check the device's current time
   - Note the timezone setting

2. **In Talos:**
   - Navigate to a site's overview page
   - Check the site's timezone setting
   - Compare timestamps of recent alarms

3. **Compare:**
   - Calculate the time difference between the two systems
   - Note if the difference is consistent or varying

### Step 2: Verify NTP Configuration

All devices should be configured to use the NXGEN NTP server for accurate time synchronization.

**Recommended NTP Server:**
```
time1.nxgen.cloud
```

**To verify NTP configuration:**

1. **In Genesis:**
   - Check device network settings
   - Verify NTP server is set to `time1.nxgen.cloud`
   - Check if NTP synchronization is enabled
   - Verify timezone matches the site location

2. **In Device Settings:**
   - Access the device's web interface
   - Navigate to Network or System settings
   - Check NTP configuration
   - Verify the device can reach the NTP server

### Step 3: Check Network Connectivity

Ensure the device can reach the NTP server:

1. **Test NTP Server Connectivity:**
   - From the device or a network-connected computer
   - Ping `time1.nxgen.cloud`
   - Verify DNS resolution works correctly
   - Check firewall rules allow NTP traffic (UDP port 123)

2. **Verify Firewall Rules:**
   - Ensure UDP port 123 is open for outbound traffic
   - Check if any network restrictions block NTP access
   - Verify proxy settings if applicable

## Resolution Steps

### Solution 1: Configure NTP on Device

If the device is not configured with the correct NTP server:

1. **Access Device Settings:**
   - Log into the device's web interface
   - Navigate to Network or System settings

2. **Configure NTP:**
   - Enable NTP synchronization
   - Set NTP server to: `time1.nxgen.cloud`
   - Set timezone to match the site location
   - Save settings

3. **Verify Synchronization:**
   - Wait a few minutes for synchronization
   - Check device logs for NTP sync status
   - Verify time is now accurate

### Solution 2: Correct Timezone Settings

If timezones are mismatched:

1. **In Genesis:**
   - Update device timezone to match site location
   - Ensure timezone is correctly set

2. **In Talos:**
   - Go to Site Settings
   - Update Time Zone to match the site location
   - Save changes

3. **Verify:**
   - Check that both systems now show the same local time
   - Verify alarm timestamps are consistent

### Solution 3: Manual Time Correction

If immediate correction is needed:

:::warning Manual Time Correction
Manual time correction should only be used as a temporary measure. Always configure proper NTP synchronization for long-term accuracy.
:::

1. **In Genesis:**
   - Access device settings
   - Manually set the correct time
   - Immediately configure NTP to prevent drift

2. **In Talos:**
   - Verify site timezone is correct
   - Talos will use the timezone setting for alarm timestamps

### Solution 4: Network Troubleshooting

If NTP connectivity issues exist:

1. **Check Firewall Rules:**
   - Ensure UDP port 123 is open for outbound traffic
   - Verify no firewall is blocking NTP requests
   - Check if proxy settings need configuration

2. **Test NTP Connectivity:**
   ```bash
   # Test NTP server reachability
   ntpdate -q time1.nxgen.cloud
   ```

3. **Verify DNS Resolution:**
   - Ensure `time1.nxgen.cloud` resolves correctly
   - Check DNS server settings on the device
   - Verify no DNS filtering is blocking the domain

## Prevention

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-success)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>✅ Best Practices for Time Synchronization</h3>
  <ul>
    <li><strong>Always configure NTP</strong> on all devices during initial setup</li>
    <li><strong>Use the NXGEN NTP server</strong> (`time1.nxgen.cloud`) for consistency</li>
    <li><strong>Set correct timezones</strong> in both Genesis and Talos</li>
    <li><strong>Verify NTP regularly</strong> as part of routine maintenance</li>
    <li><strong>Monitor time drift</strong> and investigate if significant differences appear</li>
    <li><strong>Document timezone settings</strong> for each site</li>
    <li><strong>Test NTP connectivity</strong> during network configuration</li>
  </ul>
</div>

## Verification

After applying fixes, verify the solution:

1. **Check Time Accuracy:**
   - Compare current time in Genesis and Talos
   - Verify they match (accounting for timezone differences)

2. **Test Alarm Flow:**
   - Trigger a test alarm
   - Verify timestamps are accurate in both systems
   - Check that events appear in correct sequence

3. **Monitor Over Time:**
   - Check time synchronization daily for the first week
   - Verify no drift occurs
   - Confirm NTP is working correctly

## Related Articles

- [NTP Configuration Guide](/docs/getting-started/ntp-configuration)
- [Getting to Know Evalink Talos - Complete Guide](/docs/getting-started/Talos/getting-to-know-evalink-talos-complete)
- [Talos Site Management](/docs/getting-started/Talos/talos-site-management)
- [Troubleshooting Alarm Overflow Threshold](/docs/getting-started/Talos/troubleshooting-alarm-overflow-threshold)

## Need Help?

If you continue to experience time synchronization issues:

1. Check the [Troubleshooting Guide](/docs/troubleshooting)
2. Review device-specific documentation
3. [Contact GCXONE Support](/docs/support) with:
   - Device type and model
   - Current time in both systems
   - NTP configuration details
   - Network configuration information

