---
title: "System Diagnostics and Troubleshooting Basics"
description: "Comprehensive diagnostic tools and troubleshooting procedures for device issues"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-01-27
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# System Diagnostics and Troubleshooting Basics

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      <strong>GCXONE</strong> provides deep-level diagnostics to troubleshoot hardware failures and system issues. This comprehensive diagnostic toolkit includes automated checks, manual testing tools, and detailed logging capabilities to help identify and resolve problems quickly.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🔧</div>
      <h3 style={{color: 'white', margin: 0}}>Diagnostics</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Troubleshooting Tools</p>
    </div>
  </div>
</div>

## Overview

System Diagnostics provides comprehensive tools for investigating device issues, network problems, and system performance. These tools help technicians quickly identify root causes and implement solutions.

## One-Click Collection

For certain hardware like Uniview, the system allows a "One-Click Collect" of NVR and camera diagnosis information, including operation logs for a specified number of days.

### Using One-Click Collection

1. Navigate to **Configuration App** > **Devices**
2. Select the device requiring diagnosis
3. Click **Diagnostics** > **Collect Logs**
4. Select the number of days to include (up to 14 days)
5. Click **Generate Report**
6. Download the collected diagnostic package

### Collected Information

The diagnostic package includes:

- **Operation Logs:** Device operation history
- **Error Logs:** All error messages and warnings
- **Configuration Files:** Current device settings
- **Network Information:** Connection details and network configuration
- **System Status:** Current device state and resource usage

## Crash Reporting

The platform can generate crash reports and core dumps to investigate software errors or hardware hangs.

### When to Use Crash Reports

- **Device Freezing:** When devices become unresponsive
- **Unexpected Reboots:** Devices restarting without apparent cause
- **Application Crashes:** Software errors causing device failures
- **Performance Degradation:** Sudden drops in device performance

### Generating Crash Reports

1. Navigate to **Configuration App** > **Devices**
2. Select the problematic device
3. Click **Diagnostics** > **Crash Report**
4. Select the time range for the report
5. Click **Generate**
6. Review the report or forward to support

## Automated Troubleshooting Workflows

**GCXONE** standardizes the troubleshooting process for technical issues like No Alarm Transmission. A systematic multi-step investigation is used to resolve breakdowns in the communication path.

### Step 1: Dashboard Log Review

Technicians first verify the device dashboard logs within GCXONE to confirm if the hardware is actively sending events.

**What to Check:**
- Recent event timestamps
- Event types and frequencies
- Error messages or warnings
- Connection status history

### Step 2: Network Validation

Connectivity is checked by verifying if required ports (e.g., HTTPS 443, RTSP 554, Control 8000) are open and active (Green status).

**Port Verification:**
- **HTTPS (443):** Web interface access
- **RTSP (554):** Video streaming
- **Control Port (8000):** Device control commands
- **Custom Ports:** Device-specific requirements

### Step 3: Event Polling

For devices incapable of pushing direct events, administrators must ensure the Event Polling toggle is enabled to allow GCXONE to pull data at set intervals.

**Configuration:**
1. Navigate to device settings
2. Locate **Event Polling** option
3. Enable polling if device doesn't support push events
4. Set appropriate polling interval
5. Save configuration

## Connection Quality Testing

### Ping Tests

Test network connectivity and latency:

1. Navigate to **Device Settings** > **Network Diagnostics**
2. Click **Ping Test**
3. Enter target IP address (GCXONE gateway)
4. Review results:
   - **Response Time:** Should be < 100ms for good connections
   - **Packet Loss:** Should be 0% for reliable connections
   - **Jitter:** Should be minimal for stable connections

### Port Checks

Verify that required ports are accessible:

1. Navigate to **Device Settings** > **Network Diagnostics**
2. Click **Port Check**
3. Select ports to test (443, 554, 8000)
4. Review results:
   - **Open:** Port is accessible
   - **Closed:** Port is blocked (check firewall)
   - **Filtered:** Port may be blocked by firewall

### Authentication Validation

Verify device credentials are correct:

1. Navigate to **Device Settings**
2. Click **Test Connection**
3. Review authentication result:
   - **Success:** Credentials are valid
   - **Failed:** Check username/password
   - **Timeout:** Network connectivity issue

## Device Logs & History

Historical logs are maintained for auditing and forensic investigation.

### Audit Tab

Tracks every action taken by users (e.g., "Mic ON," "Device Details Updated," "Login"). This includes:

- **User Actions:** All user interactions with devices
- **Configuration Changes:** Settings modifications
- **System Events:** Automated system actions
- **Error Events:** Failures and warnings

### Receiver Logs

Displays the raw "payload" of incoming messages (e.g., SIA-DC09 packets) to verify that a device is correctly pushing events.

**Log Information:**
- **Raw Messages:** Unprocessed device communications
- **Message Timestamps:** When messages were received
- **Message Types:** Event types and classifications
- **Processing Status:** Whether messages were successfully processed

### Data Retention

Logs and dashboard history are typically retained for up to 90 days upon request. This allows for:

- **Historical Analysis:** Review past device behavior
- **Forensic Investigation:** Investigate security incidents
- **Trend Analysis:** Identify patterns in device performance
- **Compliance:** Meet regulatory requirements

## Diagnostic Tools

### Device Information

View comprehensive device information:

- **Device Model:** Manufacturer and model number
- **Firmware Version:** Current firmware and update status
- **Serial Number:** Unique device identifier
- **MAC Address:** Network interface identifier
- **IP Address:** Current network configuration

### System Resources

Monitor device resource usage:

- **CPU Usage:** Processor utilization percentage
- **Memory Usage:** RAM consumption
- **Storage:** Disk space and utilization
- **Network:** Bandwidth usage and statistics

### Performance Metrics

Track device performance over time:

- **Response Time:** Average device response latency
- **Uptime:** Device availability percentage
- **Event Rate:** Events per minute/hour
- **Error Rate:** Errors per time period

## Troubleshooting Common Issues

### No Alarm Transmission

**Investigation Steps:**
1. Check device logs for event generation
2. Verify "Notify Surveillance Center" is enabled
3. Test webhook/event forwarding configuration
4. Check network connectivity to GCXONE
5. Review firewall rules

**Resolution:**
- Enable event forwarding on device
- Configure webhook URL correctly
- Verify network connectivity
- Check firewall whitelist

### Connection Failures

**Investigation Steps:**
1. Test network connectivity (ping test)
2. Verify port accessibility (port check)
3. Check firewall configuration
4. Review device network settings
5. Test from different network locations

**Resolution:**
- Open required firewall ports
- Verify IP whitelisting
- Check network routing
- Review VPN configuration

### Performance Issues

**Investigation Steps:**
1. Review system resource usage
2. Check network bandwidth
3. Analyze device logs for errors
4. Review recent configuration changes
5. Compare with baseline performance

**Resolution:**
- Optimize device settings
- Upgrade network infrastructure
- Reduce concurrent operations
- Update device firmware

## Best Practices

1. **Regular Diagnostics:** Run diagnostic checks weekly
2. **Document Issues:** Keep records of problems and solutions
3. **Proactive Monitoring:** Address warnings before they become critical
4. **Systematic Approach:** Follow troubleshooting steps in order
5. **Escalate When Needed:** Contact support for complex issues

## Related Articles

## Need Help?

If you're experiencing issues that cannot be resolved through diagnostics, please contact support for assistance.
