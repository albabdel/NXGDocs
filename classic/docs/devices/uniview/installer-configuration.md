---
title: "Uniview Installer Configuration"
description: "Step-by-step guide for configuring Uniview devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:uniview
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Uniview Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Uniview IP cameras to integrate with GCXONE. Follow these steps to ensure proper network configuration, time synchronization, alarm management, and device connectivity.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
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
      <li>✅ Administrative access to Uniview device configuration</li>
      <li>✅ Network connectivity to device</li>
      <li>✅ Proper firewall configuration for device communication</li>
    </ul>
  </div>
</div>

## Step 1: Network Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #EC4899', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Network Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Uniview Device → Network Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Set up the client's network settings so it can communicate with other devices or servers</li>
      <li>Configure IP address (static or DHCP), subnet mask, default gateway, DNS servers, and possibly proxy settings</li>
      <li>Proper network configuration ensures the client device can access local network resources and the internet securely and reliably</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Uniview 1.png').default} alt="Uniview Network Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Uniview 2.png').default} alt="Uniview Network Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Network connectivity established for device communication</p>
  </div>
</div>

## Step 2: Time Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Time Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Uniview Device → Time Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Set the correct time, date, and time zone on the client device</li>
      <li>Time synchronization is often handled via NTP (Network Time Protocol) servers</li>
      <li>Accurate time configuration is crucial for logging, security protocols (like SSL/TLS), and scheduled tasks to function correctly</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Uniview 3.png').default} alt="Uniview Time Settings 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Uniview 4.png').default} alt="Uniview Time Settings 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Time synchronization via NTP servers is crucial for accurate logging and security protocols. Ensure NTP is properly configured.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Time synchronization configured with NTP servers</p>
  </div>
</div>

## Step 3: Alarm Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Alarm Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Uniview Device → Alarm Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Alarm configuration allows the client device to generate alerts or notifications based on certain events or conditions, such as system failures, high resource usage, or connectivity issues</li>
      <li>These alarms can be set to trigger visual indicators, sounds, or even send notifications via email or SMS, depending on the system's capabilities</li>
    </ol>
    
    <img src={require('./images/Uniview 5.png').default} alt="Uniview Alarm Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Alarm notifications configured for event detection</p>
  </div>
</div>

## Step 4: Basic Setup

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Basic Setup</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Uniview Device → Basic Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Basic setup refers to the initial configuration of the client device to prepare it for operation</li>
      <li>
        This can include:
        <ul>
          <li>Language and region settings</li>
          <li>Setting up user accounts</li>
          <li>Installing essential software</li>
          <li>Configuring input/output devices</li>
          <li>Performing initial security configurations (like enabling firewalls or antivirus)</li>
        </ul>
      </li>
    </ol>
    
    <img src={require('./images/Uniview 6.png').default} alt="Uniview Basic Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Basic device configuration completed</p>
  </div>
</div>

## Step 5: Configure Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Configure Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Configuration App → Site → Devices → Add</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login to GCXONE</li>
      <li>Navigate to configuration app</li>
      <li>Navigate to Site → Devices → Add</li>
      <li>Provide the mandatory details</li>
      <li>Click on Discover</li>
      <li>Click Save</li>
    </ol>
    
    <img src={require('./images/Uniview 7.png').default} alt="Uniview GCXONE Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Uniview device successfully added and discovered in GCXONE</p>
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
          <li>✅ Verify network connectivity is working</li>
          <li>✅ Test time synchronization with NTP servers</li>
          <li>✅ Confirm alarm notifications are functioning</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Check basic settings are properly applied</li>
          <li>✅ Verify device discovery in GCXONE</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Uniview integration with GCXONE platform</p>
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
          <li>Check DNS server settings</li>
          <li>Ensure proxy settings are correct if applicable</li>
          <li>Test local network access and internet connectivity</li>
        </ul>
      </TabItem>

      <TabItem value="time" label="Time Synchronization Problems">
        <ul>
          <li>Verify NTP server is reachable</li>
          <li>Check time zone settings</li>
          <li>Ensure network connectivity allows NTP traffic</li>
          <li>Confirm accurate time configuration for logging and security</li>
        </ul>
      </TabItem>

      <TabItem value="alarms" label="Alarm Configuration Issues">
        <ul>
          <li>Check alarm trigger conditions and thresholds</li>
          <li>Verify notification methods (email, SMS) are properly configured</li>
          <li>Test alarm generation for various event conditions</li>
          <li>Ensure visual and audio indicators are working</li>
        </ul>
      </TabItem>

      <TabItem value="basic" label="Basic Setup Problems">
        <ul>
          <li>Verify language and region settings</li>
          <li>Check user account configuration</li>
          <li>Ensure security configurations (firewall, antivirus) are properly set</li>
          <li>Confirm input/output device configurations</li>
        </ul>
      </TabItem>

      <TabItem value="integration" label="GCXONE Integration Issues">
        <ul>
          <li>Verify device credentials and connection details</li>
          <li>Check device discovery process</li>
          <li>Ensure proper network connectivity between device and GCXONE</li>
          <li>Confirm device compatibility with GCXONE platform</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- 
- [Uniview Supported Features](/docs/devices/uniview/supported-features)
- [Uniview Troubleshooting](/docs/devices/uniview/troubleshooting)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/uniview/troubleshooting) or [contact support](/docs/support).

