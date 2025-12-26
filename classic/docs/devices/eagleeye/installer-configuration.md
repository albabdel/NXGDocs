---
title: "EagleEye Installer Configuration"
description: "Step-by-step guide for configuring EagleEye Bridge devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:eagleeye
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EagleEye Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring EagleEye Bridge devices to integrate with GCXONE. Follow these steps to ensure proper bridge connectivity, camera network management, and device registration.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
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
      <li>✅ Administrative access to EagleEye Bridge configuration</li>
      <li>✅ Network connectivity to bridge device</li>
      <li>✅ Active internet connection for cloud system integration</li>
      <li>✅ ESN (Equipment Serial Number) from bridge device</li>
    </ul>
  </div>
</div>

## Step 1: Obtain Bridge Information

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Obtain Bridge Information</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>EagleEye Bridge → Bridge Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Collect Bridge Details</h4>
    <ol>
      <li>Access EagleEye Bridge configuration interface</li>
      <li>Navigate to Bridge Settings section</li>
      <li>
        <p>Record the following hardware and network information:</p>
        <ul>
          <li><strong>SSN</strong>: Serial number of the bridge</li>
          <li><strong>IP Address</strong>: Local IP address assigned to the bridge on internal network</li>
          <li><strong>ESN</strong>: Equipment Serial Number (Required for GCXONE registration)</li>
          <li><strong>GUID</strong>: Unique global identifier for the device in cloud system</li>
          <li><strong>WAN</strong>: 1000Mb/s - WAN (uplink) connection supports gigabit speeds</li>
          <li><strong>CamLan</strong>: 1000Mb/s - Bridge's camera network interface supports gigabit speeds</li>
          <li><strong>CamLan+</strong>: Confirms camera LAN supports up to 1000Mb/s (Gigabit) for high-throughput support</li>
        </ul>
      </li>
    </ol>
    
    <img src={require('./images/EagleEye 1.png').default} alt="EagleEye Bridge Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> ESN (Equipment Serial Number) is required for GCXONE registration. Make sure to copy it exactly as shown.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Bridge information collected for registration and configuration</p>
  </div>
</div>

## Step 2: Configure User Settings

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Configure User Settings</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>EagleEye Bridge → User Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Navigate to User Settings section in bridge interface</li>
      <li>Configure user accounts and permissions as required</li>
      <li>Set up authentication parameters</li>
      <li>Configure access levels and security settings</li>
      <li>Ensure proper user management for system access</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--4">
        <img src={require('./images/EagleEye 2.png').default} alt="EagleEye User Settings 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/EagleEye 3.png').default} alt="EagleEye User Settings 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/EagleEye 4.png').default} alt="EagleEye User Settings 3" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> User settings properly configured for bridge access and management</p>
  </div>
</div>

## Step 3: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Configuration App → Site → Devices → Add → EagleEye</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login to GCXONE platform</li>
      <li>Navigate to configuration app</li>
      <li>Go to Site → Devices → Add → EagleEye</li>
      <li>
        Provide the mandatory details:
        <ul>
          <li><strong>Device Name</strong>: Descriptive name for the bridge</li>
          <li><strong>ESN</strong>: Equipment Serial Number obtained from Step 1</li>
          <li><strong>IP Address</strong>: Bridge IP address</li>
          <li><strong>Authentication credentials</strong>: As configured in user settings</li>
        </ul>
      </li>
      <li>Click on "Discover" to detect the device</li>
      <li>Verify device discovery is successful</li>
      <li>Click "Save" to complete registration</li>
    </ol>
    
    <img src={require('./images/EagleEye 5.png').default} alt="EagleEye GCXONE Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> EagleEye bridge successfully added and discovered in GCXONE</p>
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
          <li>✅ Verify bridge appears in GCXONE device list</li>
          <li>✅ Confirm network connectivity is established</li>
          <li>✅ Test camera network functionality (CamLan)</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Verify WAN connection is operational</li>
          <li>✅ Check GUID registration in cloud system</li>
          <li>✅ Confirm user authentication is working</li>
          <li>✅ Test high-throughput camera support</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete EagleEye integration with GCXONE platform</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="connectivity" label="Bridge Connectivity Issues" default>
        <ul>
          <li>Verify IP address configuration is correct</li>
          <li>Check WAN connection supports gigabit speeds</li>
          <li>Ensure proper network routing and firewall settings</li>
          <li>Confirm internet connectivity for cloud integration</li>
        </ul>
      </TabItem>

      <TabItem value="esn" label="ESN Registration Problems">
        <ul>
          <li>Verify ESN is copied correctly from bridge settings</li>
          <li>Ensure no extra characters or spaces in ESN entry</li>
          <li>Check device type selection matches EagleEye in GCXONE</li>
          <li>Confirm ESN is valid and active</li>
        </ul>
      </TabItem>

      <TabItem value="authentication" label="User Authentication Failures">
        <ul>
          <li>Verify user settings are properly configured</li>
          <li>Check authentication credentials are correct</li>
          <li>Ensure user accounts have appropriate permissions</li>
          <li>Confirm access levels are set correctly</li>
        </ul>
      </TabItem>

      <TabItem value="camera-network" label="Camera Network Issues">
        <ul>
          <li>Verify CamLan interface supports 1000Mb/s</li>
          <li>Check camera connections to bridge</li>
          <li>Ensure adequate bandwidth for multiple cameras</li>
          <li>Test high-resolution camera support</li>
        </ul>
      </TabItem>

      <TabItem value="cloud" label="Cloud Integration Problems">
        <ul>
          <li>Verify GUID is properly registered</li>
          <li>Check internet connectivity for cloud services</li>
          <li>Ensure firewall allows cloud communication</li>
          <li>Confirm bridge is properly authenticated with cloud system</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [EagleEye Overview](/docs/devices/eagleeye/overview)
- [EagleEye Supported Features](/docs/devices/eagleeye/supported-features)
- [EagleEye Troubleshooting](/docs/devices/eagleeye/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/eagleeye/troubleshooting) or [contact support](/docs/support).

