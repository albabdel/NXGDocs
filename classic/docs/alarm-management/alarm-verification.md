---
title: "Alarm Verification"
description: "Complete guide to verifying alarms using AI-powered analytics, video review, and visual context"
tags:
  - role:operator
  - category:alarm-management
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 4
last_updated: 2025-01-27
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Alarm Verification

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Built-in verification tools including video clip review, live view access, and event context to validate alarm authenticity. <strong>GCXONE</strong> uses AI-powered analytics to automatically classify alarms, reducing false positives by 80-95%.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>✅</div>
      <h3 style={{color: 'white', margin: 0}}>Verification</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>AI-Powered Analysis</p>
    </div>
  </div>
</div>

## Overview

Alarm Verification is the process of determining whether an alarm represents a real security threat or a false positive. GCXONE provides multiple verification tools to help operators make accurate decisions quickly.

## The Verification Process

When an alarm occurs, GCXONE extracts three critical images (pre-alarm, current, and post-alarm) or a video clip. The AI engine classifies the object (Human or Vehicle) and places a bounding box around the threat.

### AI-Powered Classification

The core value of GCXONE is its AI-powered false alarm filtering, which reduces the volume of alerts by approximately **80% to 95%**.

**Classification Process:**
1. **Image Extraction:** System extracts key frames from video
2. **AI Analysis:** AI engine scans for human or vehicle activity
3. **Bounding Box:** If person detected, marks bounding box on image
4. **Classification:** Determines if alarm is "Real" or "False"
5. **Automated Action:** False alarms can be automatically closed

### Verification Result Types

- **Real Alarm:** Confirmed security threat requiring response
- **False Alarm:** Non-threatening event (e.g., shadows, animals, weather)
- **Technical Alarm:** System or device issue requiring technical attention
- **Unverified:** Unable to determine (requires manual review)

## Quad View - The Power of Context

For video events, the system displays three critical images: **Pre-Alarm**, **Current-Alarm**, and **Post-Alarm**. This "Quad View" provides complete context of what happened before, during, and after the alarm trigger.

### Pre-Alarm Image

Shows the scene **before** the alarm was triggered. This helps operators understand:
- Normal state of the area
- What changed to trigger the alarm
- Environmental conditions

### Current-Alarm Image

Shows the scene **at the moment** the alarm was triggered. This is the primary verification image showing:
- The detected object or activity
- AI bounding box (if classification available)
- Alarm trigger point

### Post-Alarm Image

Shows the scene **after** the alarm was triggered. This helps operators see:
- If the threat persisted
- Direction of movement
- Current state of the area

## AI Bounding Boxes

If the AI has classified the object, you will see a bounding box around the person or vehicle:

- **Blue Box (Tracked):** Object is being tracked but not necessarily a threat
- **Red Box (Alarm):** Object has triggered an alarm condition
- **Green Box (Verified):** Object has been verified as a real threat

### Understanding Bounding Boxes

- **Accuracy Indicator:** Box confidence level
- **Object Type:** Human, Vehicle, or Unknown
- **Movement Direction:** Arrow showing direction of travel
- **Size Estimation:** Relative size of detected object

## Live View Access

You can toggle to **Live View** to see what is happening now in real-time. This is useful for:

- **Active Threats:** Monitor ongoing security incidents
- **Verification:** Confirm current state of the area
- **Response Coordination:** Guide security response in real-time

### Live View Features

- **Real-Time Streaming:** Current camera feed
- **PTZ Control:** Pan, tilt, zoom to investigate
- **Audio:** Two-way audio communication (if available)
- **Recording:** Start manual recording if needed

## Archive Review

Use the **Timeline** to scrub through the archive for further evidence. This allows you to:

- **Review History:** See what happened before the alarm
- **Find Patterns:** Identify recurring issues
- **Gather Evidence:** Collect video evidence for reports
- **Investigate:** Conduct thorough investigation of incidents

### Timeline Navigation

- **Scrub Bar:** Drag to navigate through time
- **Thumbnail View:** See key moments in timeline
- **Playback Controls:** Play, pause, speed control
- **Export:** Download video clips for evidence

## Automated Filtering

If the AI determines an alarm is "False" (e.g., caused by shadows or animals), it can be automatically closed without operator intervention. This significantly reduces operator workload.

### Auto-Close Conditions

- **High Confidence False:** AI is very confident it's a false alarm
- **Pattern Recognition:** Matches known false alarm patterns
- **Environmental Factors:** Weather, lighting, or other environmental causes
- **Device Issues:** Camera obstruction or technical problems

### Manual Override

Operators can always override AI classification:
- **Mark as Real:** Even if AI says false
- **Mark as False:** Even if AI says real
- **Request Review:** Flag for supervisor review

## Verification Workflow

### Step 1: Initial Assessment

When an alarm appears in your queue:

1. **Review AI Classification:** Check if AI has already classified the alarm
2. **View Quad Images:** Review pre, current, and post-alarm images
3. **Check Bounding Boxes:** See what the AI detected
4. **Read Alarm Details:** Review site, device, and alarm type information

### Step 2: Visual Verification

1. **Open Live View:** Check current state of the area
2. **Review Archive:** Scrub through timeline if needed
3. **Compare Images:** Compare pre-alarm vs. current state
4. **Look for Context:** Check surrounding cameras if available

### Step 3: Decision Making

Based on verification:

- **Real Threat:** Proceed with response workflow
- **False Alarm:** Mark as false and close
- **Technical Issue:** Escalate to technical team
- **Uncertain:** Request supervisor review

## Best Practices

1. **Trust but Verify:** Use AI classification as a guide, but always verify
2. **Use Context:** Review all three quad images for complete picture
3. **Check Multiple Angles:** If multiple cameras available, check all views
4. **Document Findings:** Add notes explaining your verification decision
5. **Learn Patterns:** Note common false alarm causes for future reference

## Common False Alarm Causes

- **Environmental:** Shadows, reflections, weather
- **Animals:** Wildlife triggering motion sensors
- **Vegetation:** Trees, bushes moving in wind
- **Lighting:** Sudden light changes
- **Technical:** Camera obstructions, lens issues

## Related Articles

- [Real-Time Alarm Queue](/docs/alarm-management/alarm-queue)
- [Alarm Actions](/docs/alarm-management/alarm-actions)
- [False Alarm Management](/docs/alarm-management/false-alarms)
- [Operator Training Guide](/docs/operator-guide-training-guide)
- [Live Video Guide](/docs/operator-guide-live-video)

## Need Help?

If you're experiencing issues with alarm verification, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support/contact-support).
