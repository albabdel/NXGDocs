---
title: "Dahua Overview"
description: "Complete guide for Dahua device integration with GCXONE"
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:dahua
sidebar_position: 1
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dahua Overview

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Dahua IP cameras and NVRs integrate seamlessly with GCXONE to provide comprehensive video surveillance, intelligent event detection, and security monitoring capabilities.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📹</div>
      <h3 style={{color: 'white', margin: 0}}>Dahua</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Camera / NVR</p>
    </div>
  </div>
</div>

## Device Information

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__body">
    <table>
      <tbody>
        <tr>
          <td><strong>Device Type</strong></td>
          <td>Camera / NVR</td>
        </tr>
        <tr>
          <td><strong>Vendor</strong></td>
          <td>Dahua</td>
        </tr>
        <tr>
          <td><strong>Model</strong></td>
          <td>Various</td>
        </tr>
        <tr>
          <td><strong>Discovery Protocol</strong></td>
          <td>ONVIF / Proprietary (Dahua)</td>
        </tr>
        <tr>
          <td><strong>Ports</strong></td>
          <td>80/443/554/RTSP</td>
        </tr>
        <tr>
          <td><strong>Platform</strong></td>
          <td>GCXONE</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Summary

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎯</div>
      <h4>Purpose</h4>
      <p style={{fontSize: '0.85rem'}}>Configure Dahua to stream and send events to GCXONE</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
      <h4>Outcome</h4>
      <p style={{fontSize: '0.85rem'}}>Live view and alarms show in GCXONE (Video Activity)</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #D946EF', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👥</div>
      <h4>Audience</h4>
      <p style={{fontSize: '0.85rem'}}>Field engineer / Support</p>
    </div>
  </div>
</div>

## Device Profile

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h3>Key Characteristics</h3>
  
  <div className="row">
    <div className="col col--6">
      <h4>Event Types</h4>
      <ul>
        <li><strong>Motion</strong> - Motion detection (use with caution)</li>
        <li>
          <strong>IVS (Intelligent Video Surveillance)</strong>
          <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
            <li>Tripwire</li>
            <li>Intrusion</li>
          </ul>
        </li>
        <li><strong>Video Loss</strong> - Camera disconnection detection</li>
        <li><strong>Tamper</strong> - Camera tampering detection</li>
        <li><strong>I/O</strong> - Input/Output events</li>
      </ul>
    </div>
    <div className="col col--6">
      <h4>Integration Features</h4>
      <ul>
        <li><strong>Cloud Mode</strong> - Supported</li>
        <li><strong>Discovery</strong> - ONVIF and Proprietary</li>
        <li><strong>Report Alarm</strong> - Required for event transmission</li>
        <li><strong>Dual Stream</strong> - Main and substream support</li>
      </ul>
    </div>
  </div>
</div>

<div className="alert alert--warning">
  <strong>Critical Configuration:</strong>
  <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
    <li>Enable <strong>Log → Report Alarm</strong> so GCXONE receives events</li>
    <li>Avoid Motion Detection when possible - it can flood alerts. Prefer IVS (Tripwire/Intrusion)</li>
    <li>For Motion Detection, tune Sensitivity ~70 and Threshold 5; avoid noisy areas</li>
  </ul>
</div>

## Supported Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>✅ Core Functions</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Cloud Mode</strong> - Supported</li>
          <li><strong>Discovery</strong> - Supported</li>
          <li><strong>Live</strong> - Real-time video streaming</li>
          <li><strong>Playback</strong> - Historical video review</li>
          <li><strong>Timeline</strong> - Event timeline navigation</li>
          <li><strong>Events</strong> - Motion, IVS, Video Loss, Tamper, I/O</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>🔧 Advanced Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>ARM / DISARM</strong> - Supported</li>
          <li><strong>Genesis Audio (SIP)</strong> - Two-way audio</li>
          <li><strong>PTZ/Presets</strong> - Pan-Tilt-Zoom control</li>
          <li><strong>IVS Analytics</strong> - Tripwire and Intrusion Detection</li>
          <li><strong>Dual Stream</strong> - Main and substream profiles</li>
          <li><strong>NTP Sync</strong> - Time synchronization</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Prerequisites

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Before You Begin</h3>
  </div>
  <div className="card__body">
    <ul>
      <li>✅ Network: Reachable IP, correct VLAN and ports (80/443/554/HTTP API as used)</li>
      <li>✅ Time sync: Match Dahua time zone with GCXONE. Enable NTP</li>
      <li>✅ Access: Admin to Dahua UI and GCXONE Config App</li>
      <li>✅ IP allowlist: Update if your site uses whitelisting</li>
      <li>✅ Test account: Create a dedicated user for GCXONE</li>
    </ul>
  </div>
</div>

## Related Articles

- [Dahua Installer Configuration](/docs/devices/dahua/installer-configuration)
- [Dahua Dolynk Setup](/docs/devices/dahua/dolynk-setup)
- [Dahua Supported Features](/docs/devices/dahua/supported-features)
- [Dahua Troubleshooting](/docs/devices/dahua/troubleshooting)

---

## Need Help?

If you need assistance with Dahua integration, check our [Troubleshooting Guide](/docs/devices/dahua/troubleshooting) or [contact support](/docs/support).
