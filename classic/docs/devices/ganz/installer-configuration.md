---
title: "Ganz Installer Configuration"
description: "Step-by-step guide for configuring Ganz devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:ganz
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ganz Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Ganz IP cameras to integrate with GCXONE. Follow these steps to ensure proper video streaming, event detection, and device connectivity.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
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
      <li>✅ Network connectivity to Ganz device</li>
      <li>✅ Administrative access to device configuration</li>
      <li>✅ Proper firewall configuration for HTTP/HTTPS and RTSP ports</li>
      <li>✅ NTP server access for time synchronization</li>
    </ul>
  </div>
</div>

## Step 1: Network Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Network Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Ganz Device → Network Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Assign a Static IP or use DHCP</li>
      <li>
        Configure:
        <ul>
          <li>IP Address</li>
          <li>Subnet Mask</li>
          <li>Default Gateway</li>
          <li>DNS Server</li>
        </ul>
      </li>
      <li>Ensure port forwarding is set up if accessing the device over the internet</li>
      <li>Make sure firewall settings allow access on HTTP/HTTPS and RTSP ports (typically 80/443 and 554)</li>
    </ol>
    
    <img src={require('./images/ganz 1.png').default} alt="Ganz Network Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Network connectivity established to Ganz device</p>
  </div>
</div>

## Step 2: Time Settings Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Time Settings Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Ganz Device → Time Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Set the time zone correctly</li>
      <li>Enable NTP (Network Time Protocol) to sync time with a reliable time server (e.g., pool.ntp.org)</li>
      <li>Ensure both the camera and VMS server are time-synced</li>
    </ol>
    
    <img src={require('./images/ganz 2.png').default} alt="Ganz Time Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Time synchronization is crucial for accurate event timestamps. Ensure NTP is properly configured.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Time settings configured with NTP synchronization for accurate event timestamps</p>
  </div>
</div>

## Step 3: Alarm/Event Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Alarm/Event Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Ganz Device → Alarm/Event Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configure Event Detection</h4>
    <ol>
      <li>Configure motion detection zones in the camera settings</li>
      <li>Set up alarm input/output (if the device has I/O ports)</li>
      <li>
        Enable event triggers such as:
        <ul>
          <li>Motion detection</li>
          <li>Tampering</li>
          <li>Line crossing</li>
          <li>Intrusion detection</li>
        </ul>
      </li>
      <li>Set notification methods (email, snapshot upload, or VMS alert)</li>
      <li>Test event triggers to verify correct operation</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/ganz 3.png').default} alt="Ganz Event Configuration 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/ganz 4.png').default} alt="Ganz Event Configuration 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/ganz 5.png').default} alt="Ganz Event Configuration 3" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/ganz 6.png').default} alt="Ganz Event Configuration 4" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Event triggers configured and tested for proper operation</p>
  </div>
</div>

## Step 4: Live View Settings

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Live View Settings</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Ganz Device → Live View/Stream Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configure Stream Settings</h4>
    <ol>
      <li>Select stream type (main stream/sub-stream)</li>
      <li>Set resolution, frame rate, and compression (H.264/H.265) for performance optimization</li>
      <li>Enable ONVIF if using with third-party platforms</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/ganz 7.png').default} alt="Ganz Stream Settings 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/ganz 8.png').default} alt="Ganz Stream Settings 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Live stream configured and optimized for GCXONE integration</p>
  </div>
</div>

## Step 5: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Configuration App → Site → Devices → Add → GanzAI</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login to GCXONE</li>
      <li>Navigate to configuration app</li>
      <li>Navigate to Site → Devices → Add → GanzAI</li>
      <li>
        Provide the mandatory details:
        <ul>
          <li>Device Name</li>
          <li>IP Address</li>
          <li>Username and Password</li>
          <li>Port configuration</li>
        </ul>
      </li>
      <li>Click on Discover</li>
      <li>Click Save</li>
    </ol>
    
    <img src={require('./images/ganz 9.png').default} alt="Ganz GCXONE Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Ganz device successfully added and discovered in GCXONE</p>
  </div>
</div>

## Step 6: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 6: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ Verify live stream appears in GCXONE</li>
          <li>✅ Test event detection and alarm notifications</li>
          <li>✅ Confirm time synchronization is working</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Check ONVIF compatibility</li>
          <li>✅ Verify all configured event triggers are functioning</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Ganz integration with GCXONE platform</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="network" label="Network Connectivity Issues" default>
        <ul>
          <li>Verify IP address, subnet mask, and gateway configuration</li>
          <li>Check firewall settings for required ports (80/443, 554)</li>
          <li>Ensure port forwarding is configured correctly for remote access</li>
        </ul>
      </TabItem>

      <TabItem value="time" label="Time Synchronization Problems">
        <ul>
          <li>Verify NTP server is reachable</li>
          <li>Check time zone settings match GCXONE</li>
          <li>Ensure both camera and VMS server are time-synced</li>
        </ul>
      </TabItem>

      <TabItem value="events" label="Event Detection Issues">
        <ul>
          <li>Test motion detection zones and sensitivity settings</li>
          <li>Verify alarm input/output configuration</li>
          <li>Check notification methods are properly configured</li>
          <li>Ensure event triggers are enabled and tested</li>
        </ul>
      </TabItem>

      <TabItem value="stream" label="Stream Quality Problems">
        <ul>
          <li>Adjust resolution, frame rate, and compression settings</li>
          <li>Check network bandwidth availability</li>
          <li>Verify stream type configuration (main/sub-stream)</li>
        </ul>
      </TabItem>

      <TabItem value="onvif" label="ONVIF Compatibility Issues">
        <ul>
          <li>Ensure ONVIF is enabled on the device</li>
          <li>Verify ONVIF profile compatibility with GCXONE</li>
          <li>Check device discovery settings</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [Ganz Overview](/docs/devices/ganz/overview)
- [Ganz Supported Features](/docs/devices/ganz/supported-features)
- [Ganz Troubleshooting](/docs/devices/ganz/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/ganz/troubleshooting) or [contact support](/docs/support).

