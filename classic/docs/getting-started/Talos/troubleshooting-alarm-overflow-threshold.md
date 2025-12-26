---
title: "Diagnosing and Resolving Alarms Blocked Due to Overflow Threshold"
description: "Complete guide to understanding and resolving alarm blocking issues when devices exceed overflow thresholds in Genesis and Talos"
tags:
  - role:admin
  - category:troubleshooting
  - difficulty:advanced
  - platform:talos
sidebar_position: 6
last_updated: 2025-12-21
---

# Diagnosing and Resolving Alarms Blocked Due to Overflow Threshold

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      The system automatically suppresses alarms when a device or site exceeds a predefined threshold for alarm reception within a short timeframe. This guide helps you diagnose and resolve these blocking issues.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🚫</div>
      <h3 style={{color: 'white', margin: 0}}>Alarm Blocking</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Overflow Protection</p>
    </div>
  </div>
</div>

## Quick Checklist

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-danger)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>🔍 Quick Diagnostic Checklist</h3>
  <ol>
    <li>Check Genesis Device Dashboard: Filter alarm logs for the device to determine if alarms are flagged with a "Blocked" status</li>
    <li>Identify Event Overflow Alarms: Search Genesis logs for the event overflow alarm type, which Genesis generates when the platform-wide threshold is breached</li>
    <li>Verify Threshold Configuration: Check the custom properties (e.g., tile overflow threshold) at the tenant or customer level to confirm the device's configured alarm limit</li>
    <li>Check Talos Blocking (Site Level): If alarms bypass Genesis but do not reach the operator, verify Talos logs for the site for the alarm code "Alarm limit exceeded"</li>
  </ol>
</div>

## Understanding Platform Thresholds

Alarm blocking occurs based on different criteria in Genesis and Talos. This feature is critical because devices, particularly certain types like Axon, can send thousands of alarms, potentially overwhelming or destabilizing the platform.

There are two primary reasons why alarms might not be processed for the operator:
1. **Redundancy** - Alarms that are duplicates of the exact same alarm code received from the same camera within a short period (typically 30 seconds by default)
2. **Blocking** - Alarms blocked due to overflow threshold (this guide focuses on this)

### Genesis Blocking (Device Level)

The platform-wide default is to block a device if it sends more than **25 video alarms from a single device within a 5-minute window**. When blocked, Genesis stops processing alarms from that device until the threshold period resets.

**Characteristics:**
- Threshold: 25 alarms per device
- Time window: 5 minutes
- Scope: Per device
- Action: Device is blocked, alarms are discarded

### Talos Blocking (Site Level)

Talos has a similar blocking logic, but the threshold applies at the **site level**. If the total alarm count from all devices within a site exceeds **25 alarms in a 5-minute window**, Talos will block further alarms from that site.

**Characteristics:**
- Threshold: 25 alarms per site
- Time window: 5 minutes
- Scope: Per site (all devices combined)
- Action: Site is blocked, alarms are discarded
- Alarm code: "Alarm limit exceeded" (case sensitive)

## Troubleshooting Steps

### Step 1: Verify Alarm Blocking Status in Genesis

1. **Locate the Device Dashboard:**
   - Navigate to the device in question on the Genesis dashboard

2. **Filter Alarm Logs:**
   - Filter the displayed alarms
   - Ignore technical events like `ping.primary`
   - Focus on video alarms (`analytics.something` or `motion.something`)

3. **Check Status:**
   - Observe the alarms to see if they are marked as **"Blocked"**
   - Note the time when blocking started

4. **Check for Event Overflow:**
   - Look for the Genesis-generated alarm type **`event overflow`**
   - This alarm indicates that the threshold has been breached
   - Genesis continuously checks every 5 minutes and generates this alarm when the threshold is exceeded

### Step 2: Confirm Threshold Breach and Review Custom Properties

1. **Determine the Incident Window:**
   - Identify the time of the first "Blocked" status or event overflow alarm (e.g., 6:04)

2. **Filter for the 5-Minute Window:**
   - Filter the alarm data for the 5 minutes preceding the block (e.g., 5:59 to 6:04)

3. **Count Alarms:**
   - Calculate the total number of video alarms received in that window
   - Example: 46 alarms in the example case

4. **Check Configured Threshold:**
   - Verify the configured threshold against the default of 25
   - Custom properties can override this default
   - This threshold can be found in the custom properties (e.g., `tile overflow threshold`) at the tenant or customer level

5. **Identify the Source of the Block:**
   - If the received count exceeds the configured threshold, the blocking mechanism is functioning as intended
   - The issue lies with the device generating too many alarms

### Step 3: Check for Talos Blocking

Alarms might bypass Genesis (especially if multiple devices are sending alarms below the 25-alarm device limit) but still get blocked by Talos.

1. **Check Talos Logs:**
   - Consult the Talos logs for the specific site

2. **Look for the Block Code:**
   - Identify the exact alarm code indicating blocking on the Talos side: **"Alarm limit exceeded"** (Talos is case sensitive)
   - This confirms that Talos has blocked the site due to overflow

## Resolution and Customer Recommendations

The ultimate resolution usually involves reducing the alarm volume from the device.

### Step 1: Communicate the Reason

Clearly communicate to the customer that the device was blocked due to exceeding the platform's high alarm volume limit. Provide specific details:

- Number of alarms received (e.g., 46 alarms received in 5 minutes)
- The threshold limit (25 alarms in 5 minutes)
- Why this is a protective measure for system stability

### Step 2: Avoid Motion Alarms

**Advise customers not to configure motion alarms.** Motion alarms often "flood the system with alarms" and are a common cause of overflow blocking.

**Why motion alarms are problematic:**
- Very sensitive to environmental changes
- Generate excessive false positives
- Difficult to filter effectively
- Can trigger hundreds of alarms per hour

### Step 3: Recommend IVS Alarms

**Recommend changing the device configuration to use IVS alarms** (Advanced Intelligent Video processing alarms). IVS alarms apply a level of filtering on the device itself, reducing the number of alarms sent to the platform.

**Benefits of IVS alarms:**
- Built-in intelligence reduces false alarms
- More accurate detection
- Lower alarm volume
- Better system performance

**IVS alarm types include:**
- Intrusion detection
- Line crossing
- Object detection
- Face detection
- License plate recognition

### Step 4: Confirm Operational Risk

If the customer insists on keeping motion alarms, they must be informed that:
- The system cannot control alarms being blocked
- This presents an operational risk
- Critical alarms may be missed during blocking periods
- Alternative solutions should be considered

## Related Terms (Glossary)

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>📚 Key Terms</h3>
  </div>
  <div className="card__body">
    <table>
      <thead>
        <tr>
          <th>Term</th>
          <th>Definition</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Event Overflow</strong></td>
          <td>An alarm type generated by Genesis indicating that a device has breached the platform's alarm reception threshold (e.g., 25 alarms in 5 minutes)</td>
        </tr>
        <tr>
          <td><strong>Blocked Alarm</strong></td>
          <td>An alarm status indicating that the alarm was received by the system but automatically suppressed or ignored because the device or site exceeded the predefined overflow threshold</td>
        </tr>
        <tr>
          <td><strong>Redundancy (Alarms Blocked Due to)</strong></td>
          <td>Alarms that are ignored because they are duplicates of the exact same alarm code received from the same camera within a short period (typically 30 seconds by default)</td>
        </tr>
        <tr>
          <td><strong>Custom Property</strong></td>
          <td>A configuration parameter that can be set at the tenant, customer, or site level (e.g., tile overflow threshold) to customize platform defaults, such as the alarm overflow limit</td>
        </tr>
        <tr>
          <td><strong>Motion Alarm</strong></td>
          <td>A basic alarm type triggered by movement, often resulting in a high volume of events that can flood the system, leading to blocking</td>
        </tr>
        <tr>
          <td><strong>IVS Alarm</strong></td>
          <td>Intelligent Video Processing alarms; advanced, filtered alarms recommended over basic motion alarms to reduce event volume</td>
        </tr>
        <tr>
          <td><strong>Alarm limit exceeded</strong></td>
          <td>The specific, case-sensitive alarm code found in Talos logs indicating that the site has been blocked due to exceeding the high alarm volume threshold</td>
        </tr>
        <tr>
          <td><strong>Ping.primary</strong></td>
          <td>A heartbeat signal sent by the device to ensure it can reach Genesis. These keep-alive signals are typically excluded from the alarm overflow calculation</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Prevention

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-success)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>✅ Best Practices to Prevent Alarm Overflow</h3>
  <ul>
    <li><strong>Use IVS alarms instead of motion alarms</strong> for better filtering</li>
    <li><strong>Configure appropriate detection zones</strong> to reduce false triggers</li>
    <li><strong>Set proper sensitivity levels</strong> on devices</li>
    <li><strong>Use time-based filtering</strong> to reduce alarms during low-risk periods</li>
    <li><strong>Monitor alarm volumes</strong> regularly to identify problematic devices</li>
    <li><strong>Configure custom thresholds</strong> for specific devices if needed (requires admin access)</li>
    <li><strong>Test alarm configurations</strong> before deploying to production</li>
    <li><strong>Document device-specific configurations</strong> for reference</li>
  </ul>
</div>

## Related Articles

- [Getting to Know Evalink Talos - Complete Guide](/docs/getting-started/Talos/getting-to-know-evalink-talos-complete)
- [Talos Workflows and Alarms](/docs/getting-started/Talos/talos-workflows-and-alarms)
- [Troubleshooting Time Synchronization Errors](/docs/getting-started/Talos/troubleshooting-time-synchronization-errors)
- [GCXONE & Talos Interaction](/docs/getting-started/gcxone-talos-interaction)

## Need Help?

If you continue to experience alarm overflow issues:

1. Review device-specific configuration guides
2. Check the [Troubleshooting Guide](/docs/troubleshooting)
3. [Contact GCXONE Support](/docs/support) with:
   - Device type and model
   - Alarm volume statistics
   - Custom property configurations
   - Recent alarm logs

