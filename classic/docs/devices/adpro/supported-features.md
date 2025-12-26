---
title: "ADPRO Supported Features"
description: "Complete list of features supported by ADPRO devices in GCXONE"
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:GCXONE
  - device:adpro
sidebar_position: 4
last_updated: 2025-12-04
---

# ADPRO Supported Features

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      ADPRO security control panels support comprehensive alarm monitoring, event management, and security automation features when integrated with GCXONE.
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
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #4F46E5', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔔</div>
      <h4>Alarm Transmission</h4>
      <p style={{fontSize: '0.85rem'}}>Primary and Secondary receivers supported</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📹</div>
      <h4>Live View</h4>
      <p style={{fontSize: '0.85rem'}}>Real-time video monitoring</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚙️</div>
      <h4>ARM / DISARM</h4>
      <p style={{fontSize: '0.85rem'}}>Schedule-based automation</p>
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
        <h4>Basic Events</h4>
        <ul>
          <li><strong>Intrusion</strong> - Unauthorized entry detection</li>
          <li><strong>Motion</strong> - Motion-based alerts</li>
        </ul>
      </div>
      <div className="col col--4">
        <h4>Analytics Events</h4>
        <ul>
          <li><strong>Intrusion Trace</strong> - Area-based intrusion monitoring</li>
          <li><strong>Loiter Trace</strong> - Prolonged presence detection</li>
          <li><strong>Motion Sabotage</strong> - Camera tampering detection</li>
        </ul>
      </div>
      <div className="col col--4">
        <h4>System Events</h4>
        <ul>
          <li><strong>System Startup</strong> - Device initialization</li>
          <li><strong>System Armed</strong> - Security system activation</li>
          <li><strong>System Disarmed</strong> - Security system deactivation</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Advanced Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #4F46E5'}}>
      <div className="card__header">
        <h3>Alarm Management</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Primary Alarm Transmission</strong> - Main communication path</li>
          <li><strong>Secondary Alarm Transmission</strong> - Backup communication path</li>
          <li><strong>Parallel Alarm Transmission</strong> - Additional transmission paths</li>
          <li><strong>Site Pulse Monitoring</strong> - Device health checks</li>
          <li><strong>Alarm Profiles</strong> - Customizable alarm responses</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>System Configuration</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>User Management</strong> - Access control and permissions</li>
          <li><strong>Time Synchronization</strong> - NTP support</li>
          <li><strong>Time Zone Configuration</strong> - Location-based settings</li>
          <li><strong>Input/Output Behavior</strong> - Event response configuration</li>
          <li><strong>Camera Assignment</strong> - Visual event correlation</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Analytics Features

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h3>Advanced Analytics</h3>
  
  <div className="row">
    <div className="col col--4">
      <div className="card" style={{background: 'white', padding: '1rem'}}>
        <h4>Intrusion Trace</h4>
        <p style={{fontSize: '0.9rem'}}>Define specific areas within camera's field of view for unauthorized entry monitoring. Configure detection zones, sensitivity levels, and rules for detecting intrusions.</p>
      </div>
    </div>
    <div className="col col--4">
      <div className="card" style={{background: 'white', padding: '1rem'}}>
        <h4>Loiter Trace</h4>
        <p style={{fontSize: '0.9rem'}}>Configure detection for prolonged presence in restricted areas. Ideal for monitoring suspicious behavior and unauthorized loitering.</p>
      </div>
    </div>
    <div className="col col--4">
      <div className="card" style={{background: 'white', padding: '1rem'}}>
        <h4>Motion Sabotage</h4>
        <p style={{fontSize: '0.9rem'}}>Set up detection for camera tampering or obstruction. Protects against physical interference with security cameras.</p>
      </div>
    </div>
  </div>
</div>

## Scheduling Features

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Arm/Disarm Scheduling</h3>
  </div>
  <div className="card__body">
    <ul>
      <li><strong>Automated Scheduling</strong> - Set system to automatically arm or disarm at specific times</li>
      <li><strong>Time-Based Rules</strong> - Configure different schedules for different days</li>
      <li><strong>Operational States</strong> - Define behavior for armed and disarmed states</li>
      <li><strong>Profile-Based Scheduling</strong> - Link schedules to specific alarm profiles</li>
    </ul>
  </div>
</div>

## Camera Integration

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Camera Features</h3>
  </div>
  <div className="card__body">
    <div className="row">
      <div className="col col--6">
        <h4>View Styles</h4>
        <ul>
          <li><strong>Live View</strong> - Real-time video feed on both ADPRO XO client and GCXONE</li>
          <li><strong>Quad View</strong> - Multiple camera views in grid layout</li>
          <li><strong>Duress</strong> - Still images for alarm events</li>
        </ul>
      </div>
      <div className="col col--6">
        <h4>Camera Assignment</h4>
        <ul>
          <li><strong>Event Correlation</strong> - Link events to specific cameras</li>
          <li><strong>Email Reports</strong> - Send camera snapshots with alarm notifications</li>
          <li><strong>Alarm Reports</strong> - Include visual evidence in alarm reports</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## iFT Gateway Features

<div className="alert alert--info">
  <strong>iFT Gateway Subtype:</strong> Additional features available for iFT Gateway devices:
  <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
    <li><strong>Event Clip Recording</strong> - Automatic video clip generation for events</li>
    <li><strong>Custom Properties</strong> - Extended configuration options in GCXONE</li>
    <li><strong>Enhanced Event Handling</strong> - Advanced event processing capabilities</li>
  </ul>
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
          <td><strong>Alarm Transmission</strong></td>
          <td>✅ Supported</td>
          <td>Primary and Secondary</td>
        </tr>
        <tr>
          <td><strong>Events</strong></td>
          <td>✅ Supported</td>
          <td>Analytics, Motion, Intrusion</td>
        </tr>
        <tr>
          <td><strong>ARM / DISARM</strong></td>
          <td>✅ Supported</td>
          <td>Schedule-based</td>
        </tr>
        <tr>
          <td><strong>Live View</strong></td>
          <td>✅ Supported</td>
          <td>Real-time monitoring</td>
        </tr>
        <tr>
          <td><strong>User Management</strong></td>
          <td>✅ Supported</td>
          <td>Access control</td>
        </tr>
        <tr>
          <td><strong>Time Sync</strong></td>
          <td>✅ Supported</td>
          <td>NTP</td>
        </tr>
        <tr>
          <td><strong>Analytics</strong></td>
          <td>✅ Supported</td>
          <td>Intrusion Trace, Loiter Trace, Motion Sabotage</td>
        </tr>
        <tr>
          <td><strong>Site Pulse</strong></td>
          <td>✅ Supported</td>
          <td>Lifecheck monitoring</td>
        </tr>
        <tr>
          <td><strong>Alarm Profiles</strong></td>
          <td>✅ Supported</td>
          <td>Customizable responses</td>
        </tr>
        <tr>
          <td><strong>Event Clips (iFT)</strong></td>
          <td>✅ Supported</td>
          <td>iFT Gateway subtype only</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Related Articles

- [ADPRO Overview](/docs/devices/adpro/overview)
- [ADPRO Installer Configuration](/docs/devices/adpro/installer-configuration)
- [ADPRO Troubleshooting](/docs/devices/adpro/troubleshooting)

---

## Need Help?

For questions about ADPRO features, check our [Troubleshooting Guide](/docs/devices/adpro/troubleshooting) or [contact support](/docs/support).
