---
title: "Camect Installer Configuration"
description: "Step-by-step guide for configuring Camect devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:camect
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Camect Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Camect Hub/NVR devices to integrate with GCXONE. Follow these steps to ensure proper video streaming, AI event detection, and device connectivity.
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

## Prerequisites

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Before You Begin</h3>
  </div>
  <div className="card__body">
    <ul>
      <li>✅ Network: Reachable IP, correct VLAN and ports (80/443/554/RTSP/TCP as used)</li>
      <li>✅ Time sync: Match Camect time zone with GCXONE. Enable NTP</li>
      <li>✅ Access: Admin to Camect UI and GCXONE Config App</li>
      <li>✅ IP allowlist: Update if your site uses whitelisting</li>
      <li>✅ Test account: Create a dedicated user for GCXONE</li>
    </ul>
  </div>
</div>

## Step 1: Prepare Camect (Users, Time, RTSP)

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Prepare Camect (Users, Time, RTSP)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Users</strong></p>
  </div>
  <div className="card__body">
    <h4>User Configuration</h4>
    <ol>
      <li>Create a local user (e.g., <code>NXG</code>) with password</li>
      <li>
        Grant the following permissions:
        <ul>
          <li>Live view</li>
          <li>Query Cameras</li>
          <li>Pan/Tilt Cameras</li>
          <li>View alerts</li>
          <li>View footage</li>
          <li>Share cameras</li>
          <li>Change operating modes</li>
        </ul>
      </li>
    </ol>
    
    <img src={require('./images/Camect 1.gif').default} alt="Camect User Setup" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Time/NTP Configuration</h4>
    <ul>
      <li>Set time zone to match GCXONE</li>
      <li>Enable NTP</li>
      <li>Save configuration</li>
    </ul>
    
    <h4 style={{marginTop: '1.5rem'}}>RTSP Configuration</h4>
    <ul>
      <li>Ensure RTSP is enabled on the hub</li>
    </ul>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Best Practice:</strong> Use a dedicated least-privilege user for GCXONE. Do not reuse admin account.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Dedicated user exists; time is correct; RTSP is on</p>
  </div>
</div>

## Step 2: Configure Alerts and Monitoring

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Configure Alerts and Monitoring</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Hub Settings → Alert</strong></p>
  </div>
  <div className="card__body">
    <h4>Enable Alert Detection</h4>
    <ol>
      <li>Check <strong>Detect alerts</strong></li>
      <li>Choose objects under <strong>Detect objects in alerts</strong></li>
      <li>Select required alert types</li>
    </ol>
    
    <img src={require('./images/Camect 2.gif').default} alt="Camect Alert Detection" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Make Events Available to GCXONE</h4>
    <ol>
      <li>Click <strong>Add Monitoring</strong> → choose <strong>NXGEN</strong></li>
      <li>
        On the NXGEN page set:
        <ul>
          <li><strong>Site ID</strong> = 1 (or as provided by NXGEN support)</li>
          <li><strong>TCP address</strong> = <code>3.122.169.231:10520</code> (or as provided by NXGEN support)</li>
        </ul>
      </li>
      <li>Click <strong>Add camera</strong> for each camera to forward</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Camect 3.gif').default} alt="Camect Monitoring Setup" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Camect 4.gif').default} alt="Camect Camera Addition" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Enable <strong>Detect alerts</strong> and set <strong>Monitoring → NXGEN</strong> so GCXONE receives events. This is critical for event transmission.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Camect generates alerts and forwards them to GCXONE</p>
  </div>
</div>

## Step 3: Enable Secondary Stream (Recommended)

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Enable Secondary Stream (Recommended)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Camera → Settings → Information → Edit Substream</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Change <strong>Substream</strong> from <code>0</code> to <code>1</code></li>
      <li>Save the changes</li>
    </ol>
    
    <img src={require('./images/Camect 5.gif').default} alt="Camect Substream Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Purpose:</strong> Expose a smooth substream for Live view. This helps prevent stuttering in the GCXONE live view interface.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Substream enabled for smooth live viewing</p>
  </div>
</div>

## Step 4: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Customer → Site → Devices → Add Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select <strong>Camect</strong></li>
      <li>Fill: <strong>Host/Serial, Username, Password, Ports, Time Zone</strong></li>
      <li>Click <strong>Discover</strong>. Review discovered sensors and I/O</li>
      <li>Click <strong>Save</strong></li>
    </ol>
    
    <img src={require('./images/CAMECT ADDING DEVICE.png').default} alt="Camect Device Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> GCXONE lists sensors under the Camect device</p>
  </div>
</div>

## Step 5: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ Send a test alert. It appears in <strong>Video Activity</strong></li>
          <li>✅ <strong>Live</strong> opens without stutter</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ PTZ presets move if enabled</li>
          <li>✅ Time synchronization is working</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Camect integration with GCXONE platform</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="no-events" label="No Events in Video Activity" default>
        <ul>
          <li>Ensure <strong>Detect alerts</strong> is on</li>
          <li>Confirm <strong>Monitoring → NXGEN</strong> is configured with the correct <strong>TCP address</strong> and <strong>Site ID</strong></li>
          <li>Add the camera under NXGEN monitoring</li>
          <li>Check time sync/NTP</li>
        </ul>
      </TabItem>

      <TabItem value="discovery" label="Discovery Fails">
        <ul>
          <li>Verify credentials, ports, and reachability</li>
          <li>Check network connectivity</li>
          <li>Ensure time zone matches GCXONE</li>
        </ul>
      </TabItem>

      <TabItem value="stutter" label="Live View Stutters">
        <ul>
          <li>Enable the substream (set to <code>1</code>)</li>
          <li>Check network bandwidth</li>
          <li>Verify RTSP is enabled</li>
        </ul>
      </TabItem>

      <TabItem value="ptz" label="No PTZ Control">
        <ul>
          <li>Grant <strong>Pan/Tilt Cameras</strong> permission to the GCXONE user</li>
          <li>Verify camera supports PTZ</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [Camect Overview](/docs/devices/camect/overview)
- [Camect Supported Features](/docs/devices/camect/supported-features)
- [Camect Troubleshooting](/docs/devices/camect/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/camect/troubleshooting) or [contact support](/docs/support).
