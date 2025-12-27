---
title: "Dahua Installer Configuration"
description: "Step-by-step guide for configuring Dahua devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:dahua
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dahua Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Dahua IP cameras and NVRs to integrate with GCXONE. Follow these steps to ensure proper video streaming, event detection, and device connectivity.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>⚙️</div>
      <h3 style={{color: 'white', margin: 0}}>Configuration</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Step-by-Step</p>
    </div>
  </div>
</div>

## Step 1: Prepare Dahua (Users, Time, Streams)

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Prepare Dahua (Users, Time, Streams)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Home → Accounts</strong></p>
  </div>
  <div className="card__body">
    <h4>User Configuration</h4>
    <ol>
      <li>Click <strong>Add</strong>. Create a user (e.g., <code>NXG</code>) with password</li>
      <li>Grant permissions: <strong>Manual control, System, Camera, System info, Event</strong></li>
      <li>For <strong>Search</strong> and <strong>Live</strong>, select the cameras you will use in GCXONE</li>
    </ol>
    
    <img src={require('./images/Dahua pic 1.gif').default} alt="Dahua User Setup" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Time/NTP Configuration</h4>
    <ul>
      <li>Set time zone</li>
      <li>Enable NTP</li>
      <li>Save configuration</li>
    </ul>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Best Practice:</strong> Use a dedicated least-privilege user for GCXONE. Do not reuse admin account.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Dedicated least-privilege user exists; time is correct</p>
  </div>
</div>

## Step 2: Configure Alerts (AI/IVS) and Enable Reporting

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Configure Alerts (AI/IVS) and Enable Reporting</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>AI → Parameters → IVS</strong> (or <strong>Alarm → Video Detection</strong> for basic motion)</p>
  </div>
  <div className="card__body">
    <h4>IVS Configuration (Recommended)</h4>
    <ol>
      <li>Select camera. Click <strong>+</strong> to add a rule</li>
      <li>Choose <strong>Tripwire</strong> or <strong>Intrusion</strong></li>
      <li>Draw rule/region</li>
      <li>Set <strong>Action</strong>: Appear or Cross</li>
      <li>Set <strong>Tracking duration</strong>: 30s</li>
      <li><strong>Effective target</strong>: Human, Motor Vehicle</li>
      <li>Set <strong>Schedule</strong></li>
    </ol>
    
    <img src={require('./images/Dahua pic 3.gif').default} alt="Dahua IVS Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Make Events Available to GCXONE</h4>
    <ol>
      <li>Open <strong>More → Log → Report Alarm</strong></li>
      <li>Enable and save</li>
    </ol>
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> If you must use Motion, tune <strong>Sensitivity ~70</strong> and <strong>Threshold 5</strong>; avoid noisy areas. However, IVS (Tripwire/Intrusion) is strongly recommended over Motion Detection.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Dahua generates IVS alarms and reports them to GCXONE</p>
  </div>
</div>

## Step 2b: Alarm Configuration (Optional)

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2b: Alarm Configuration (Optional)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Alarm → Video Detection</strong></p>
  </div>
  <div className="card__body">
    <div className="alert alert--warning">
      <strong>Note:</strong> Avoid <strong>Motion Detection</strong> when possible; it can flood alerts on legacy Genesis. Prefer IVS.
    </div>
    
    <h4>Applies To</h4>
    <ul>
      <li>Motion Detection</li>
      <li>Video Tampering</li>
      <li>Video Loss</li>
      <li>Similar alarm types</li>
    </ul>
    
    <h4 style={{marginTop: '1.5rem'}}>Configuration Steps</h4>
    <ol>
      <li>Choose the camera</li>
      <li>Click <strong>Setting</strong> to the right of <strong>Channel</strong></li>
      <li>Select the region(s) to monitor</li>
      <li>Click <strong>OK</strong> to save</li>
    </ol>
    
    <h4 style={{marginTop: '1.5rem'}}>Make Alarms Available to GCXONE</h4>
    <ol>
      <li>Go to <strong>More → Log → Report Alarm</strong></li>
      <li>Enable. Click <strong>OK</strong></li>
    </ol>
    
    <img src={require('./images/Dahua pic 2.gif').default} alt="Dahua Alarm Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
  </div>
</div>

## Step 3: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Customer → Site → Devices → Add Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select <strong>Dahua</strong></li>
      <li>Fill: <strong>Serial Number, Username, Password, Ports, Time Zone</strong></li>
      <li>For NVR: pick <strong>Channel</strong> for each sensor you add</li>
      <li>Click <strong>Discover</strong>. Review discovered sensors and I/O</li>
      <li>Click <strong>Save</strong></li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--4">
        <img src={require('./images/Adding device 1.png').default} alt="Adding Device Step 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/Adding device 2.png').default} alt="Adding Device Step 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/Adding device 3.png').default} alt="Adding Device Step 3" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Note:</strong> For multi-channel NVRs, repeat Step 3 per channel you need in GCXONE.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> GCXONE lists sensors under the Dahua device</p>
  </div>
</div>

## Step 4: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ <strong>Live</strong> opens without stutter</li>
          <li>✅ Recent IVS events appear in <strong>Video Activity</strong> with clips</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ PTZ moves to presets if supported</li>
          <li>✅ Time synchronization is working</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Dahua integration with GCXONE platform</p>
  </div>
</div>

## Related Articles

- [Dahua Overview](/docs/devices/dahua/overview)
- [Dahua Dolynk Setup](/docs/devices/dahua/dolynk-setup)
- [Dahua Supported Features](/docs/devices/dahua/supported-features)
- [Dahua Troubleshooting](/docs/devices/dahua/troubleshooting)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/dahua/troubleshooting) or [contact support](/docs/support).
