---
title: "Dahua Supported Features"
description: "Complete list of features supported by Dahua devices in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - device:dahua
sidebar_position: 4
last_updated: 2025-12-04
---

# Dahua Supported Features

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Dahua IP cameras and NVRs support comprehensive video surveillance, intelligent event detection, and security monitoring features when integrated with GCXONE.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>✨</div>
      <h3 style={{color: 'white', margin: 0}}>Features</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Full Support</p>
    </div>
  </div>
</div>

## Core Functions

<div className="row margin-bottom--lg">
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>☁️</div>
      <h4>Cloud Mode</h4>
      <p style={{fontSize: '0.85rem'}}>Cloud-based integration</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📹</div>
      <h4>Live View</h4>
      <p style={{fontSize: '0.85rem'}}>Real-time streaming</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #D946EF', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⏮️</div>
      <h4>Playback</h4>
      <p style={{fontSize: '0.85rem'}}>Historical review</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #8B5CF6', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔔</div>
      <h4>Events</h4>
      <p style={{fontSize: '0.85rem'}}>Intelligent detection</p>
    </div>
  </div>
</div>

## Event Types

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Supported Events</h3>
  </div>
  <div className="card__body">
    <div className="row">
      <div className="col col--4">
        <h4>IVS Events (Recommended)</h4>
        <ul>
          <li><strong>Tripwire</strong> - Virtual line crossing detection</li>
          <li><strong>Intrusion</strong> - Area-based intrusion detection</li>
        </ul>
        <div className="alert alert--success" style={{marginTop: '1rem', fontSize: '0.85rem'}}>
          <strong>Best Practice:</strong> IVS events are recommended over Motion Detection for better accuracy and fewer false alarms.
        </div>
      </div>
      <div className="col col--4">
        <h4>Basic Events</h4>
        <ul>
          <li><strong>Motion</strong> - Motion detection (use with caution)</li>
          <li><strong>Video Loss</strong> - Camera disconnection</li>
          <li><strong>Tamper</strong> - Camera tampering</li>
        </ul>
        <div className="alert alert--warning" style={{marginTop: '1rem', fontSize: '0.85rem'}}>
          <strong>Note:</strong> Motion Detection can flood alerts. If used, tune Sensitivity ~70 and Threshold 5.
        </div>
      </div>
      <div className="col col--4">
        <h4>I/O Events</h4>
        <ul>
          <li><strong>Input Events</strong> - External sensor inputs</li>
          <li><strong>Output Events</strong> - Alarm outputs</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Advanced Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>Video Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Live Streaming</strong> - Real-time video feed</li>
          <li><strong>Playback</strong> - Historical video review</li>
          <li><strong>Timeline</strong> - Event timeline navigation</li>
          <li><strong>Dual Stream</strong> - Main and substream profiles</li>
          <li><strong>PTZ Control</strong> - Pan-Tilt-Zoom functionality</li>
          <li><strong>Presets</strong> - Camera position presets</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>Integration Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Cloud Mode</strong> - Cloud-based integration</li>
          <li><strong>Discovery</strong> - ONVIF and Proprietary protocols</li>
          <li><strong>ARM / DISARM</strong> - System arming/disarming</li>
          <li><strong>Genesis Audio (SIP)</strong> - Two-way audio support</li>
          <li><strong>Event Transmission</strong> - Alarm and event delivery</li>
          <li><strong>NTP Sync</strong> - Time synchronization</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Feature Matrix

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Feature Support Summary</h3>
  </div>
  <div className="card__body">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Cloud Mode</strong></td>
          <td>✅ Supported</td>
          <td>Cloud-based integration</td>
        </tr>
        <tr>
          <td><strong>Discovery</strong></td>
          <td>✅ Supported</td>
          <td>ONVIF / Proprietary</td>
        </tr>
        <tr>
          <td><strong>Live View</strong></td>
          <td>✅ Supported</td>
          <td>Real-time streaming</td>
        </tr>
        <tr>
          <td><strong>Playback</strong></td>
          <td>✅ Supported</td>
          <td>Historical video review</td>
        </tr>
        <tr>
          <td><strong>Timeline</strong></td>
          <td>✅ Supported</td>
          <td>Event timeline navigation</td>
        </tr>
        <tr>
          <td><strong>Events</strong></td>
          <td>✅ Supported</td>
          <td>Motion, IVS, Video Loss, Tamper, I/O</td>
        </tr>
        <tr>
          <td><strong>ARM / DISARM</strong></td>
          <td>✅ Supported</td>
          <td>System arming/disarming</td>
        </tr>
        <tr>
          <td><strong>Genesis Audio (SIP)</strong></td>
          <td>✅ Supported</td>
          <td>Two-way audio</td>
        </tr>
        <tr>
          <td><strong>PTZ/Presets</strong></td>
          <td>✅ Supported</td>
          <td>Full PTZ control</td>
        </tr>
        <tr>
          <td><strong>Motion Detection</strong></td>
          <td>⚠️ Use with Caution</td>
          <td>Can flood alerts; prefer IVS</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Related Articles

- [Dahua Overview](/docs/devices/dahua/overview)
- [Dahua Installer Configuration](/docs/devices/dahua/installer-configuration)
- [Dahua Dolynk Setup](/docs/devices/dahua/dolynk-setup)
- [Dahua Troubleshooting](/docs/devices/dahua/troubleshooting)

---

## Need Help?

For questions about Dahua features, check our [Troubleshooting Guide](/docs/devices/dahua/troubleshooting) or [contact support](/docs/support).
