---
title: "Device Health Monitoring"
description: "Comprehensive guide to monitoring device connectivity, heartbeat detection, and health metrics"
tags:
  - role:all
  - category:monitoring
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-01-27
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Device Health Monitoring

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      <strong>GCXONE</strong> provides continuous monitoring of device availability and network performance. This comprehensive health monitoring system ensures that all integrated devices remain operational and accessible, with automated alerts for any connectivity or performance issues.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>💓</div>
      <h3 style={{color: 'white', margin: 0}}>Health Monitoring</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Connectivity & Performance</p>
    </div>
  </div>
</div>

## Overview

Device Health Monitoring is a critical component of the GCXONE platform that ensures continuous awareness of device status, connectivity, and performance. This system provides multiple layers of monitoring to detect issues before they impact operations.

## Connectivity Monitoring

**GCXONE** provides continuous monitoring of camera availability and network performance.

### Automated Polling

The system periodically attempts to access the live stream of every camera to ensure it is reachable and functioning. This includes:

- **Stream Accessibility:** Verifies that video streams can be accessed
- **Response Time:** Measures device response latency
- **Connection Stability:** Tracks connection reliability over time

### Network Path Tracking

For non-VPN setups, **GCXONE** monitors external IPs and forwarded ports (e.g., RTSP port 554). In VPN environments, the system monitors internal IP segments through secure side-to-side tunnels.

**Monitoring Includes:**
- External IP address reachability
- Port forwarding status
- VPN tunnel connectivity
- Network latency measurements

### Connectivity Failure Reporting

If a connection fails for more than 5 minutes, the device is flagged with a "Connection Failure" icon on the supervision dashboard. The system will:

1. **Detect Failure:** Automatically identify when a device becomes unreachable
2. **Log Event:** Record the failure in device logs with timestamp
3. **Trigger Alert:** Send notification to administrators
4. **Attempt Recovery:** Periodically retry connection to detect recovery

## Heartbeat Detection

The platform utilizes a "Heartbeat" or "Site Pulse" signal to maintain a constant awareness of device status.

### Pulse Intervals

Devices are typically configured to send a pulse every 30 to 60 minutes. This heartbeat mechanism:

- **Confirms Device Activity:** Verifies device is powered and operational
- **Validates Connectivity:** Confirms network path is functional
- **Tracks Uptime:** Maintains records of device availability

### Timeout Mechanism

If **GCXONE** does not receive a pulse within the configured window, it triggers a `ping.timeout` or `ping.notreachable` alarm in the **Talos CMS**.

**Configuration:**
- **Default Timeout:** 60 minutes (configurable per site)
- **Alert Severity:** Critical (requires immediate attention)
- **Auto-Recovery:** System automatically clears alert when pulse resumes

### Optimization

To avoid false alarms, it is recommended to set the **GCXONE** Site Pulse duration slightly higher than the device's internal heartbeat interval. For example:

- **Device Pulse:** Every 30 minutes
- **GCXONE Timeout:** 60 minutes (2x device interval)
- **Buffer:** Provides 30-minute buffer for network delays

## Connection Quality Metrics

Technical administrators can monitor specific connection statistics to ensure smooth video delivery.

### Packet Loss & Latency

Users can test network delay and packet loss by sending pings from the NVR to the **GCXONE** cloud. Metrics include:

- **Round-Trip Time (RTT):** Network latency measurement
- **Packet Loss Percentage:** Percentage of lost packets
- **Jitter:** Variation in packet delay
- **Bandwidth Utilization:** Current bandwidth usage

### Stream Information

Real-time data including **bitrate**, **frame rate (FPS)**, and **resolution** are accessible via the window toolbar. This information helps:

- **Diagnose Quality Issues:** Identify when streams degrade
- **Optimize Bandwidth:** Adjust settings based on available bandwidth
- **Troubleshoot Playback:** Understand stream characteristics

## Event Reception Rate

**GCXONE** monitors the flow of incoming events to detect anomalies.

### Event Overflow Detection

If a device sends more than 25 alarms in 5 minutes (a configurable threshold), the system triggers an **Event Overflow Alarm** and may temporarily block that device to protect platform stability.

**Configuration:**
- **Threshold:** 25 events per 5 minutes (default)
- **Action:** Temporary device blocking
- **Recovery:** Automatic unblock after cooldown period

### Log Inconsistency Detection

Technicians compare **GCXONE** dashboard counts against the physical device's log (e.g., a Dahua NVR log) to find gaps where alarms were detected but not transmitted.

**Investigation Process:**
1. Review device logs on physical hardware
2. Compare with GCXONE event logs
3. Identify missing events
4. Investigate transmission failures

## Health Check Configuration

### Setting Up Health Checks

1. Navigate to **Configuration App** > **Devices**
2. Select the device or site
3. Click **Health Check Settings**
4. Configure:
   - **Check Interval:** Frequency of health checks
   - **Timeout Duration:** Time before marking offline
   - **Alert Thresholds:** When to send alerts
5. Save configuration

### Health Check Modes

#### Basic Mode
- **Frequency:** Every 15-30 minutes
- **Checks:** Connectivity and basic functionality
- **Use Case:** Standard monitoring for most devices

#### Plus Mode
- **Frequency:** Every 10-15 minutes
- **Checks:** Connectivity, snapshots, and stream verification
- **Use Case:** Critical devices requiring enhanced monitoring

#### Advanced Mode
- **Frequency:** Continuous
- **Checks:** Full diagnostic including AI-powered analysis
- **Use Case:** High-value sites with predictive maintenance needs

## Best Practices

1. **Appropriate Timeouts:** Set timeout values higher than device heartbeat intervals
2. **Regular Review:** Check health metrics daily
3. **Proactive Maintenance:** Address yellow warnings before they become red alerts
4. **Documentation:** Keep records of device health patterns
5. **Automated Responses:** Configure workflows for common health issues

## Troubleshooting

### Device Shows Offline But Is Actually Online

- **Check Timeout Settings:** Verify timeout is not too short
- **Review Network:** Check for intermittent connectivity issues
- **Verify Heartbeat:** Confirm device is sending heartbeat signals

### False Connection Failures

- **Adjust Polling Interval:** Increase interval to reduce false positives
- **Check Network Stability:** Investigate network infrastructure
- **Review Firewall Rules:** Ensure GCXONE IPs are whitelisted

### High Event Reception Rate

- **Review Device Configuration:** Check for misconfigured motion detection
- **Adjust Sensitivity:** Reduce sensor sensitivity if appropriate
- **Investigate Device Issues:** Device may be malfunctioning

## Related Articles

- [Device Health Status Dashboard](/docs/admin-guide/device-health-status)
- [Connection Troubleshooting](/docs/troubleshooting/connection-issues)
- [Device Offline Alerts](/docs/troubleshooting/device-offline)
- [System Diagnostics](/docs/devices/general/troubleshooting-basics)

## Need Help?

If you're experiencing issues with device health monitoring, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support/contact-support).
