---
title: "Hikvision Supported Features"
description: "Complete list of features supported by Hikvision devices in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - device:hikvision
sidebar_position: 4
last_updated: 2025-12-04
---

# Hikvision Supported Features

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Hikvision IP cameras and NVRs support comprehensive video surveillance, event detection, and security monitoring features when integrated with GCXONE.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>✨</div>
      <h3 style={{color: 'white', margin: 0}}>Features</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Full Support</p>
    </div>
  </div>
</div>

## Core Functions

<div className="row margin-bottom--lg">
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📹</div>
      <h4>Live View</h4>
      <p style={{fontSize: '0.85rem'}}>Real-time video streaming</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⏮️</div>
      <h4>Playback</h4>
      <p style={{fontSize: '0.85rem'}}>Historical video playback</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #D946EF', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔔</div>
      <h4>Events</h4>
      <p style={{fontSize: '0.85rem'}}>Basic and Smart Events</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #8B5CF6', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎙️</div>
      <h4>Audio</h4>
      <p style={{fontSize: '0.85rem'}}>Two-way audio support</p>
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
      <div className="col col--6">
        <h4>Basic Events</h4>
        <ul>
          <li><strong>Video Tampering</strong> - Detection of camera obstruction or tampering</li>
        </ul>
        <div className="alert alert--warning" style={{marginTop: '1rem'}}>
          <strong>Note:</strong> Avoid setting up Motion events - they can trigger too many alarms and cause issues.
        </div>
      </div>
      <div className="col col--6">
        <h4>Smart Events</h4>
        <ul>
          <li><strong>Line Crossing Detection</strong> - Identifies when an object crosses a predefined virtual line</li>
          <li><strong>Intrusion Detection</strong> - Detects when an object enters or moves within a designated area</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Security Features

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h3>Authentication & Security</h3>
  
  <div className="row">
    <div className="col col--4">
      <div className="card" style={{background: 'white', padding: '1rem'}}>
        <h4>RTSP Authentication</h4>
        <p style={{fontSize: '0.9rem'}}>Digest authentication recommended for RTSP streaming</p>
      </div>
    </div>
    <div className="col col--4">
      <div className="card" style={{background: 'white', padding: '1rem'}}>
        <h4>WEB Authentication</h4>
        <p style={{fontSize: '0.9rem'}}>Digest authentication recommended for web interface access</p>
      </div>
    </div>
    <div className="col col--4">
      <div className="card" style={{background: 'white', padding: '1rem'}}>
        <h4>ISAPI Protocol</h4>
        <p style={{fontSize: '0.9rem'}}>Required for GCXONE integration and device communication</p>
      </div>
    </div>
  </div>
</div>

## Advanced Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>Video Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Live Streaming</strong> - Real-time video feed</li>
          <li><strong>Playback</strong> - Historical video review</li>
          <li><strong>Continuous Recording</strong> - Required for optimal performance</li>
          <li><strong>PTZ Control</strong> - Pan-Tilt-Zoom functionality</li>
          <li><strong>Presets</strong> - Camera position presets</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>Integration Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>ISAPI Integration</strong> - Protocol-based communication</li>
          <li><strong>Local Mode</strong> - For P2P streaming, Audio, Encrypted stream</li>
          <li><strong>NTP Synchronization</strong> - Time synchronization</li>
          <li><strong>Event Transmission</strong> - Alarm and event delivery to GCXONE</li>
          <li><strong>User Management</strong> - Granular permission control</li>
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
          <td><strong>Events</strong></td>
          <td>✅ Supported</td>
          <td>Basic and Smart Events</td>
        </tr>
        <tr>
          <td><strong>PTZ/Presets</strong></td>
          <td>✅ Supported</td>
          <td>Full PTZ control</td>
        </tr>
        <tr>
          <td><strong>Audio</strong></td>
          <td>✅ Supported</td>
          <td>Two-way audio</td>
        </tr>
        <tr>
          <td><strong>Authentication</strong></td>
          <td>✅ Supported</td>
          <td>Digest (Recommended)</td>
        </tr>
        <tr>
          <td><strong>ISAPI</strong></td>
          <td>✅ Supported</td>
          <td>Required for integration</td>
        </tr>
        <tr>
          <td><strong>NTP Sync</strong></td>
          <td>✅ Supported</td>
          <td>Time synchronization</td>
        </tr>
        <tr>
          <td><strong>Motion Events</strong></td>
          <td>⚠️ Not Recommended</td>
          <td>Can trigger too many alarms</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Related Articles

- 
- 
- 

---

## Need Help?

For questions about Hikvision features, check our  or [contact support](#).
