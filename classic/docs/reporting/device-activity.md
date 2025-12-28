---
title: "Device Activity Reports"
description: "Generate comprehensive device activity reports including health status, uptime metrics, and historical performance trends"
tags:
  - role:admin
  - role:manager
  - category:reporting
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 3
last_updated: 2025-01-27
---

# Device Activity Reports

Generate detailed reports on device health, activity, uptime, and historical performance trends across your GCXONE deployment.

## Overview

**Device Activity Reports** provide high-level transparency into system performance through automated and on-demand reporting. These reports summarize the status, activity, and reliability of every sensor and device across your tenant, enabling data-driven decisions about maintenance, upgrades, and system optimization.

## Report Types

### 1. Device Health Reports

**Purpose:** Comprehensive summary of the operational status of all devices.

**Content Includes:**
- Device status (Healthy, Warning, Critical, Offline)
- Health check results and timestamps
- Connection quality metrics
- Storage capacity status
- Firmware versions
- Last activity timestamps

**Health Check Modes:**
- **Basic Mode:** Reactive monitoring of valid images and connectivity
- **Plus Mode:** Proactive scheduled checks with snapshots
- **Advanced Mode:** Predictive analytics for blur, low light, and angle deviation

**How to Generate:**
1. Navigate to **Reporting** > **Device Activity**
2. Select **"Health Report"**
3. Choose date range and device filters
4. Select report format (PDF, Excel, CSV)
5. Click **"Generate Report"**

### 2. Uptime & Availability Reports

**Purpose:** Track device uptime and availability metrics over time.

**Content Includes:**
- Uptime percentage per device
- Availability trends (daily, weekly, monthly)
- Historical status changes
- Site Pulse compliance
- Connection failure incidents
- Recovery time metrics

**Availability Metrics:**
- **GCXONE** performs periodic health checks, marking cameras as "Healthy" (Green) or "Critical" (Red)
- Historical logs retain these statuses for up to **90 days**
- Provides clear record of long-term hardware reliability

**Visualizations:**
- Pie charts showing customer-level device contributions
- Line graphs tracking uptime trends over 24-hour or weekly intervals
- Heat maps showing availability by site and time period

### 3. Historical Performance Trends

**Purpose:** Analyze long-term performance patterns and identify trends.

**Content Includes:**
- Performance metrics over time
- Trend analysis (improving, stable, degrading)
- Comparative analysis across sites
- Seasonal patterns
- Anomaly detection

**Key Metrics Tracked:**
- Connection stability
- Response times
- Event reception rates
- Storage utilization trends
- Bandwidth usage patterns

### 4. Device Activity Analytics

**Purpose:** Detailed analysis of device activity patterns and event generation.

**Content Includes:**
- Event counts per device
- Alarm generation rates
- Activity patterns by time of day
- Peak usage periods
- Device utilization statistics

**Data Inflow/Outflow Analysis:**
- Analytics dashboards visualize "Inflow vs. Outflow" trends
- Shows how many alarms were received vs. successfully processed
- Identifies bottlenecks in the alarm processing pipeline

## Customizing Reports

### Report Templates

Report templates can be tailored using Angular-based code to focus on specific data points:

- **Alarm Listing Reports:** Filter by alarm type, site, or device
- **Workflow Event Logs:** Track operator actions and workflow execution
- **Device Health Summaries:** Focus on specific device categories
- **Site-Specific Reports:** Generate reports for individual sites or site groups

### Custom Filters

Apply filters to focus reports on specific criteria:

- **Date Range:** Custom date ranges or predefined periods (Today, This Week, This Month)
- **Device Type:** Filter by device category (NVR, IP Camera, IoT Sensor, etc.)
- **Site/Customer:** Focus on specific sites or customer groups
- **Status:** Filter by device status (Healthy, Warning, Critical, Offline)
- **Manufacturer:** Filter by device manufacturer

### Export Formats

Reports can be exported in multiple formats:

- **PDF:** Formatted reports suitable for printing and sharing
- **Excel:** Spreadsheet format for data analysis
- **CSV:** Raw data for import into other systems
- **JSON:** Machine-readable format for API integration

## Scheduled Reports

### Setting Up Scheduled Reports

1. Navigate to **Reporting** > **Scheduled Reports**
2. Click **"Create Schedule"**
3. Configure:
   - Report type (Health, Uptime, Activity, etc.)
   - Frequency (Daily, Weekly, Monthly)
   - Recipients (Email addresses)
   - Filters and customizations
4. Save the schedule

### Report Delivery

Scheduled reports are automatically:
- Generated at the specified time
- Emailed to designated recipients
- Stored in the report archive
- Available for download from the dashboard

## Dashboard Visualizations

### Real-Time Activity Dashboard

The Device Activity dashboard provides real-time visualizations:

- **Status Overview:** Color-coded tiles showing device health distribution
- **Activity Timeline:** Real-time event feed showing device activity
- **Trend Graphs:** Line charts showing performance trends
- **Geographic View:** Map view showing device locations and status

### Interactive Charts

- **Click to Drill Down:** Click on chart elements to see detailed information
- **Time Range Selection:** Adjust time ranges to focus on specific periods
- **Comparison Mode:** Compare metrics across different sites or time periods
- **Export Charts:** Export chart images for presentations

## Best Practices

### Regular Monitoring
- **Weekly Reviews:** Review device activity reports weekly to identify trends
- **Monthly Summaries:** Generate monthly summaries for management reporting
- **Quarterly Analysis:** Conduct quarterly deep-dives for strategic planning

### Actionable Insights
- **Identify Patterns:** Look for patterns in device failures or performance degradation
- **Proactive Maintenance:** Use reports to schedule maintenance before failures occur
- **Capacity Planning:** Use trend data to plan for future capacity needs

### Report Sharing
- **Stakeholder Reports:** Create simplified reports for non-technical stakeholders
- **Technical Reports:** Detailed reports for technical teams and support staff
- **Compliance Reports:** Generate reports that meet regulatory or contractual requirements

## Troubleshooting

### Common Issues

**Issue:** Report generation fails or times out
- **Solution:** Reduce date range or apply more specific filters
- **Solution:** Generate reports during off-peak hours for large datasets

**Issue:** Missing data in reports
- **Solution:** Verify device connectivity and health check schedules
- **Solution:** Check that devices are properly configured for reporting

**Issue:** Inaccurate uptime calculations
- **Solution:** Verify Site Pulse configuration matches device heartbeat intervals
- **Solution:** Review connection failure logs for false positives

## Related Articles

- [Device Health Status Dashboard](/docs/admin-guide/device-health-status)
- [Device Health Monitoring](/docs/devices/general/health-monitoring)
- [System Performance Reports](/docs/reporting/system-performance)
- [Custom Reports](/docs/reporting/custom-reports)
- [Scheduled Reports](/docs/reporting/scheduled-reports)

## Need Help?

If you need assistance with device activity reports, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support/contact-support).
- [Support Resources](/docs/support)

## Need Help?

If you encounter issues during configuration, please:

1. Check the [troubleshooting guide](/docs/troubleshooting)
2. Review the [FAQ](/docs/knowledge-base/faq)
3. [Contact support](/docs/support/contact-support) for assistance
