---
title: "HealthCheck Breakthrough"
description: "Automated daily checks 12x faster, zero downtime, eliminate risks."
tags:
  - all
  - breakthrough
  - beginner
  - GCXONE
last_updated: 2025-12-28
---


# ❤️ HealthCheck Breakthrough

Introducing HealthCheck – the always-on guardian of system integrity. By automating device diagnostics with zero manual effort, HealthCheck ensures 100% camera uptime and eliminates the spreadsheets and guesswork that drag operations down.

---

import Tabs from '@site/src/components/Tabs';
import { TabItem } from '@site/src/components/Tabs';

<Tabs defaultValue="brochure">
<TabItem value="brochure" label="📄 Product Brochure">
    <div style={{width: '100%', height: 'calc(100vh - 200px)', minHeight: '600px', margin: '2rem 0', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '8px', overflow: 'auto'}}>
      <iframe
        src="/Brochours/HTML/Healthcheck.html"
        style={{
          width: '892px',
          height: '1262px',
          border: 'none',
          backgroundColor: 'white',
          transform: 'scale(0.9)',
          transformOrigin: 'top left'
        }}
        title="HealthCheck Product Brochure"
      />
    </div>
</TabItem>

<TabItem value="implementation" label="🚀 Implementation Guide">

## See It in Action

HealthCheck automates device monitoring and maintenance validation across GCXONE deployments:

### Scenario 1: Enterprise Network with 20,000 Cameras

A global security provider manages 20,000 cameras across 500 sites. Previously, technicians performed manual health checks using spreadsheets, checking 100 cameras per day. At this rate, a complete network audit took 200 working days (40 weeks), meaning some cameras went unchecked for nearly a year.

With HealthCheck:
1. The system administrator schedules a daily automated scan at 3 AM (off-peak hours)
2. HealthCheck completes a full scan of all 20,000 cameras in 6 hours
3. The morning report shows: 19,847 Healthy (99.2%), 97 "Low Light Warning", 42 "Obstructed View", 14 Offline
4. IT prioritizes the 14 offline cameras for immediate attention, schedules the 42 obstructed cameras for site visits, and adjusts settings for the 97 low-light cameras remotely
5. By 9 AM, all actionable issues have been triaged and assigned

The measurable impact: What took 70 hours of manual work per month now completes in 6 hours automatically. The team reallocates 64 hours to higher-value projects, and camera uptime improves from 96.5% to 99.8% because issues are caught within 24 hours instead of weeks.

### Scenario 2: Post-Installation Handoff Verification

An installer completes a 50-camera deployment at a new warehouse site. The contract requires documentation proving 100% camera functionality before final payment. Creating manual test footage, reviewing each camera, and generating the handoff report traditionally took 4-6 hours.

With HealthCheck:
- The installer triggers a manual "Pre-Handoff Scan" from the mobile app
- HealthCheck validates all 50 cameras in 3 minutes, checking: Network connectivity, Recording status, Motion detection, Image quality, Timestamp accuracy, Storage allocation
- The system auto-generates a PDF report with green checkmarks for all devices and includes sample frames from each camera
- The installer emails the defensible proof to the client within 5 minutes of scan completion
- The client approves the installation on-site, and payment is released immediately

The transformation: Installation handoff time drops from 5 hours to 10 minutes, eliminating revisits (which cost €200-500 per truck roll), and providing legally defensible documentation that withstands compliance audits.

### Scenario 3: Proactive Maintenance Scheduling

A facility manager oversees security for 30 industrial sites. Camera failures used to be discovered only when operators noticed blank feeds or when an incident occurred and footage was missing. This reactive approach led to compliance gaps and lost evidence.

With HealthCheck:
1. HealthCheck runs automatic scans every 12 hours
2. On Tuesday morning, the scan detects: Camera 14 at Site 7 - "Signal Loss Intermittent - 6 dropouts in 24 hours"
3. The system auto-creates a maintenance ticket and notifies the facilities team
4. A technician inspects Camera 14 that afternoon and finds a loose network cable
5. The issue is resolved before any critical outage occurs

The result: Zero unplanned downtime, 100% camera availability for compliance reporting, and IT support tickets drop by 50% because issues are resolved proactively before users report problems. The organization saves 65+ hours per month previously spent firefighting device failures.

---

## 📄 Marketing Materials

### HealthCheck: Automated Daily Checks 12x Faster, ZERO Downtime, Eliminate Risks

**Before GCXONE**
Manual processes, blind spots, and recurring IT tickets slowed every review.

**With GCXONE**
Cameras stay at 100% uptime, IT tickets drop by 50%, and teams manage 130+ more sites each month with zero manual effort.

### Automate Health. Amplify Results.
This automation frees up more than 65 hours per month, allowing your team to focus on higher-value tasks while maintaining confidence in system performance and reliability. With HealthCheck, you gain not only time savings but also operational consistency and scalability, all without lifting a finger. It's a smarter, more efficient way to ensure your surveillance infrastructure stays healthy and effective.

**KEY FEATURES**
- Automated HealthCheck cuts time spent by >90%
- 6 vs 70 Hours per Month for 20k cameras (12x faster)
- Frees up > 65 hours per month
- Completely automated, no operator intervention

**Powering Your Success**
- **ENSURE 100% CAMERA UPTIME**
- **SCANS 20K+ DEVICES IN SECONDS**
- **0 MANUAL EFFORT**

### The Breakthrough
Introducing **HealthCheck** – the always-on guardian of system integrity. By automating device diagnostics with zero manual effort, HealthCheck ensures 100% camera uptime and eliminates the spreadsheets and guesswork that drag operations down. Operators gain the confidence of verified visuals, administrators get defensible proof for every review, and IT teams see tickets cut by 50% as issues are resolved before they escalate. Even installers benefit, handing over systems with trusted health status every time. With the same team able to manage 130+ additional sites per month, General Managers unlock scale without compromise. HealthCheck turns reliability into growth — making every system smarter, stronger, and legally defensible.

### Boost Your HealthCheck Experience with Genie
**HealthCheck** identifies device issues early, but turning insights into action often requires manual follow-up. **Genie** bridges the gap by automatically handling the majority of device-related queries and guiding teams to the right fix, ensuring HealthCheck insights translate into uptime and reliability.

---

## ⚙️ How to Activate HealthCheck

This section explains how to enable and schedule HealthCheck in your GCXONE instance.

### Prerequisites

Before activating HealthCheck, ensure you have:
- [ ] Administrator access to GCXONE
- [ ] HealthCheck license enabled
- [ ] Devices properly onboarded and reachable in the network

### Activation Steps

#### Step 1: Access System Supervision
1. Log into GCXONE as an administrator.
2. Navigate to **System Supervision** → **HealthCheck Settings**.
3. Toggle the **Enable HealthCheck** switch to ON.

#### Step 2: Configure Scan Frequency
1. Select the scan interval (e.g., Daily, Every 12 Hours, or Custom).
2. Choose the preferred scan time to avoid peak network usage (though scans are highly efficient).
3. Click **Apply Schedule**.

#### Step 3: Define Health Criteria
1. Define what constitutes a "Healthy" device (e.g., Online status, recent clip activity, no signal loss).
2. Set sensitivity levels for "Obstructed" or "Low Light" warnings.
3. Save your criteria.

#### Step 4: Configure Alerting & Reporting
1. Navigate to **Alerts** → **HealthCheck Alerts**.
2. Define recipients for health status reports (e.g., IT department, Site Managers).
3. Choose the delivery method (Email, Webhook, or GCXONE Notification).

#### Step 5: Verify Initial Scan
1. Click **Run Manual Scan** to trigger the first check.
2. Monitor the **System Supervision** dashboard for real-time results.
3. Verify that the "Total Scanned" count matches your device inventory.

---

## 🚀 Adoption Guide

Successfully rolling out HealthCheck across your organization requires planning and integration into your maintenance workflows.

### Phase 1: Planning (Week 1)

#### Assess Your Needs
- **Inventory:** Verify all active cameras and devices are registered.
- **KPIs:** Establish baseline uptime and current IT ticket volume.
- **Roles:** Designate the personnel responsible for responding to HealthCheck alerts.

### Phase 2: Configuration & Testing (Week 2)
- Set up the initial scan schedule.
- Fine-tune health criteria for different device types (e.g., Thermal vs. Optical).
- Validate the accuracy of auto-resolved status reports.

### Phase 3: Workflow Integration (Week 2-3)
- Integrate HealthCheck alerts into your ticketing system (e.g., Zendesk, ServiceNow).
- Train the maintenance team on how to interpret "Obstructed" vs. "Offline" alerts.
- Use HealthCheck data for pro-active maintenance scheduling.

### Phase 4: Full Automation (Week 3-4)
- Transition from manual reviews to "Defense by Exception" — only interveneing when HealthCheck flags an issue.
- Generate automated weekly health reports for leadership.
- Use "Defensible Proof" logs for compliance audits.

### Best Practices
- **DO** set up automated scans during off-peak hours.
- **DO** use HealthCheck results to prioritize technician site visits.
- **DO** regularly review the "Obstructed" flags to prevent long-term data loss.
- **DON'T** ignore minor health alerts; they often precede total device failure.
- **DON'T** share health reports with unauthorized external vendors.

### Success Metrics
| Metric               | Target           | Measurement Method                |
| :------------------- | :--------------- | :-------------------------------- |
| Camera Uptime        | 100%             | HealthCheck history logs          |
| Scan Time Saved      | > 90%            | Comparison with manual check logs |
| IT Ticket Volume     | -50%             | Integrated ticketing analytics    |
| Maintenance Capacity | +130 Sites/Month | Site management growth report     |

### Support Resources
- [HealthCheck Troubleshooting Guide](#)
- [Video: Setting Up Automated Health Checks](#)
- [Compliance Reporting with HealthCheck](/docs/reporting/compliance)

</TabItem>
</Tabs>
