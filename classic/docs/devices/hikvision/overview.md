---
title: "Hikvision Overview"
description: "Complete guide for Hikvision device integration with GCXONE"
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:hikvision
sidebar_position: 1
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Hikvision Overview

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Hikvision IP cameras and NVRs integrate seamlessly with GCXONE to provide comprehensive video surveillance, event detection, and security monitoring capabilities.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📹</div>
      <h3 style={{color: 'white', margin: 0}}>Hikvision</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>IP Camera / NVR</p>
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
          <td>IP Camera / NVR</td>
        </tr>
        <tr>
          <td><strong>Vendor</strong></td>
          <td>Hikvision</td>
        </tr>
        <tr>
          <td><strong>Model</strong></td>
          <td>Various</td>
        </tr>
        <tr>
          <td><strong>Discovery Protocol</strong></td>
          <td>ISAPI Protocol</td>
        </tr>
        <tr>
          <td><strong>Ports</strong></td>
          <td>HTTP/HTTPS, RTSP</td>
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
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎯</div>
      <h4>Purpose</h4>
      <p style={{fontSize: '0.85rem'}}>Configure Hikvision devices to integrate seamlessly with GCXONE platform for video surveillance tasks</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
      <h4>Outcome</h4>
      <p style={{fontSize: '0.85rem'}}>Enhanced functionality with data security and optimal performance enabling robust management and monitoring capabilities</p>
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
        <li>
          <strong>Basic Events</strong>
          <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
            <li>Video Tampering</li>
          </ul>
        </li>
        <li>
          <strong>Smart Events</strong>
          <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
            <li>Line Crossing Detection</li>
            <li>Intrusion Detection</li>
          </ul>
        </li>
      </ul>
    </div>
    <div className="col col--6">
      <h4>Security Features</h4>
      <ul>
        <li><strong>Authentication</strong> - Digest (Recommended)</li>
        <li><strong>RTSP Authentication</strong> - Digest</li>
        <li><strong>WEB Authentication</strong> - Digest</li>
        <li><strong>ISAPI Protocol</strong> - Enabled for integration</li>
      </ul>
    </div>
  </div>
</div>

## Audio Implementation Levels

GCXONE supports two distinct levels of audio configuration for Hikvision devices:

1.  **Device-level Configuration**: 
    - Audio is linked directly to the main device (e.g., NVR).
    - Uses speaker channels common to all cameras on that device.
2.  **Sensor-level Configuration**:
    - Audio is linked specifically to individual cameras.
    - Ideal for cameras with built-in microphones.

> [!IMPORTANT]
> If a site has **Genesis Audio** enabled, it takes first priority and overrides both device and sensor-level audio channels.

---

<div className="alert alert--warning">
  <strong>Important Notes:</strong>
  <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
    <li><strong>Avoid setting up Motion events</strong> - they can trigger too many alarms and cause issues</li>
    <li><strong>RTSP and WEB authentication</strong> should be configured as Digest for enhanced security</li>
    <li>Whitelist the IP <code>35.156.60.98</code> (Hikvision Receiver) for alarm transmission</li>
  </ul>
</div>

## Supported Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>✅ Core Functions</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Live View</strong> - Real-time video streaming</li>
          <li><strong>Playback</strong> - Historical video playback</li>
          <li><strong>Events</strong> - Basic and Smart Events</li>
          <li><strong>PTZ/Presets</strong> - Pan-Tilt-Zoom control</li>
          <li><strong>Audio</strong> - Two-way audio support</li>
          <li><strong>Authentication</strong> - Digest (Recommended)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>🔧 Advanced Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>ISAPI Integration</strong> - Protocol-based communication</li>
          <li><strong>Smart Events</strong> - Line Crossing, Intrusion Detection</li>
          <li><strong>Basic Events</strong> - Video Tampering detection</li>
          <li><strong>Continuous Recording</strong> - Required for optimal performance</li>
          <li><strong>Local Mode</strong> - For P2P streaming, Audio, Encrypted stream</li>
          <li><strong>NTP Synchronization</strong> - Time synchronization</li>
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
      <li>✅ The Hikvision device is set up with Continuous Recording</li>
      <li>✅ Whitelist the IP <code>35.156.60.98</code> (Hikvision Receiver)</li>
      <li>✅ Local Mode is installed (For P2P streaming, Audio, Encrypted stream)</li>
      <li>✅ Administrative access to Hikvision web interface</li>
      <li>✅ GCXONE account with appropriate permissions</li>
      <li>✅ Network connectivity between device and GCXONE</li>
    </ul>
  </div>
</div>

## Related Articles

- 
- 
- 
- 

---

## Need Help?

If you need assistance with Hikvision integration, check our  or [contact support](/docs/support).
