---
title: "Reconeyez Installer Configuration"
description: "Step-by-step guide for configuring Reconeyez devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:reconeyez
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Reconeyez Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Reconeyez battery-powered event cameras to integrate with GCXONE. Follow these steps to ensure proper event-driven video capture, cloud integration, and device connectivity.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
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
      <li>✅ Valid SIM card with data plan (for LTE connectivity) or Wi-Fi access</li>
      <li>✅ Reconeyez mobile app or cloud platform access</li>
      <li>✅ Device ID from Reconeyez client (used as Serial number)</li>
      <li>✅ Network connectivity allowing outgoing connections to cloud platform</li>
    </ul>
  </div>
</div>

## Step 1: Network Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #6366F1', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Network Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Reconeyez Device → Network Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>For LTE/4G Connection</h4>
    <ul>
      <li>Insert SIM card with valid data plan</li>
      <li>Ensure adequate signal strength for mobile data</li>
    </ul>
    
    <h4 style={{marginTop: '1.5rem'}}>For Wi-Fi Connection</h4>
    <ul>
      <li>Configure network settings through mobile app or cloud platform</li>
      <li>Set SSID and password</li>
      <li>Ensure Wi-Fi coverage and signal strength</li>
    </ul>
    
    <h4 style={{marginTop: '1.5rem'}}>General Network Setup</h4>
    <ul>
      <li>Devices automatically connect to Reconeyez Cloud (minimal manual IP configuration needed)</li>
      <li>Ensure firewall and proxy settings allow outgoing connections to cloud platform</li>
      <li>Verify network connectivity for cloud communication</li>
    </ul>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Network connectivity established for cloud communication</p>
  </div>
</div>

## Step 2: Event Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Event Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Reconeyez Cloud Portal/Mobile App → Event Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configure Event-Driven Capture</h4>
    <ol>
      <li>Access Reconeyez cloud portal or mobile app</li>
      <li>Configure event triggers for video capture</li>
      <li>Set up snapshots or video clips (typically 10-15 seconds) upon event trigger</li>
      <li>Configure number of photos and time interval for snapshots</li>
      <li>Set event detection parameters and sensitivity</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Reconeyez 1.png').default} alt="Reconeyez Event Configuration 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Reconeyez 2.png').default} alt="Reconeyez Event Configuration 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Note:</strong> Reconeyez devices are optimized for event-driven video capture, not continuous streaming. Event clips are typically 10-15 seconds long for optimal storage and transmission.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Event capture settings configured for optimal surveillance</p>
  </div>
</div>

## Step 3: Platform Integration Setup

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Platform Integration Setup</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Reconeyez Platform → Integration Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configure Third-Party Integration</h4>
    <ol>
      <li>Set up API access for event forwarding and video access</li>
      <li>Configure email/FTP notifications to external systems</li>
      <li>Set up central monitoring station integration using protocols like SIA or Contact ID</li>
      <li>Configure optional cloud-to-cloud integration with platforms</li>
      <li>In GCXONE, configure workflow to add webhook for event notifications</li>
    </ol>
    
    <img src={require('./images/Reconeyez 3.png').default} alt="Reconeyez Platform Integration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Webhook configuration in GCXONE is essential for receiving event notifications from Reconeyez devices.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Platform integration configured for event forwarding</p>
  </div>
</div>

## Step 4: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Configuration App → Site → Devices → Add → Reconeyez</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login to GCXONE platform</li>
      <li>Navigate to configuration app</li>
      <li>Go to Site → Devices → Add → Reconeyez</li>
      <li>
        <p>Provide the mandatory details:</p>
        <ul>
          <li><strong>Device Name</strong>: Descriptive name for the device</li>
          <li><strong>Serial Number</strong>: Use Device ID from Reconeyez client (mandatory)</li>
          <li><strong>Connection details</strong>: Network and authentication parameters</li>
          <li><strong>Integration settings</strong>: Webhook and API configuration</li>
        </ul>
      </li>
      <li>Click on "Discover" to detect the device</li>
      <li>Verify device discovery is successful</li>
      <li>Click "Save" to complete registration</li>
    </ol>
    
    <img src={require('./images/Reconeyez 4.png').default} alt="Reconeyez GCXONE Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important Note:</strong> Device ID from client is used as Serial number in Reconeyez and is mandatory for registration.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Reconeyez device successfully added and configured in GCXONE</p>
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
          <li>✅ Verify network connectivity (LTE/4G or Wi-Fi) is operational</li>
          <li>✅ Test event-driven video capture functionality</li>
          <li>✅ Confirm snapshots are being captured at configured intervals</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Verify cloud platform integration is working</li>
          <li>✅ Test webhook notifications to GCXONE</li>
          <li>✅ Check API access for event forwarding</li>
          <li>✅ Confirm historical event review capability</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Reconeyez integration with GCXONE platform</p>
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
          <li>Verify SIM card is properly inserted and activated with data plan</li>
          <li>Check mobile signal strength for LTE/4G connectivity</li>
          <li>Ensure Wi-Fi credentials are correct and signal is adequate</li>
          <li>Confirm firewall settings allow outgoing cloud connections</li>
          <li>Test internet connectivity and DNS resolution</li>
        </ul>
      </TabItem>

      <TabItem value="events" label="Event Capture Problems">
        <ul>
          <li>Verify event triggers are properly configured</li>
          <li>Check device battery level for optimal performance</li>
          <li>Ensure adequate lighting and positioning for motion detection</li>
          <li>Test snapshot interval and count settings</li>
          <li>Verify storage capacity for captured events</li>
        </ul>
      </TabItem>

      <TabItem value="integration" label="Platform Integration Issues">
        <ul>
          <li>Check API credentials and access permissions</li>
          <li>Verify webhook configuration in GCXONE</li>
          <li>Test email/FTP notification settings</li>
          <li>Confirm SIA or Contact ID protocol configuration</li>
          <li>Ensure cloud-to-cloud integration is properly set up</li>
        </ul>
      </TabItem>

      <TabItem value="registration" label="Device Registration Problems">
        <ul>
          <li>Verify Device ID from client is used correctly as Serial number</li>
          <li>Check device discovery process in GCXONE</li>
          <li>Ensure all mandatory fields are properly filled</li>
          <li>Confirm device compatibility with GCXONE platform</li>
        </ul>
      </TabItem>

      <TabItem value="power" label="Power and Performance Issues">
        <ul>
          <li>Monitor battery levels for battery-powered devices</li>
          <li>Optimize event trigger sensitivity to conserve power</li>
          <li>Balance capture frequency with power consumption</li>
          <li>Verify live video limitations due to power conservation</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [Reconeyez Overview](/docs/devices/reconeyez/overview)
- [Reconeyez Supported Features](/docs/devices/reconeyez/supported-features)
- [Reconeyez Troubleshooting](/docs/devices/reconeyez/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/reconeyez/troubleshooting) or [contact support](/docs/support).
