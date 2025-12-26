---
title: "Ajax Installer Configuration"
description: "Step-by-step guide for configuring Ajax devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:ajax
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ajax Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Ajax security hubs and NVRs to integrate with GCXONE. Follow these steps to ensure proper alarm monitoring, event detection, and device connectivity.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
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
      <li>✅ Ajax PRO Desktop application installed</li>
      <li>✅ Valid Ajax Hub or NVR with devices/cameras</li>
      <li>✅ Access to GCXONE platform</li>
      <li>✅ Email invitation capability for Ajax system</li>
    </ul>
  </div>
</div>

## Step 1: Invite NXGEN Technologies to Your Hub

<div className="card shadow--md" style={{borderLeft: '6px solid #4F46E5', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Invite NXGEN Technologies to Your Hub</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>AJAX PRO Desktop → Space Setting → Security Companies → Invite via Email</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Open <strong>AJAX PRO Desktop</strong></li>
      <li>Navigate to: <strong>Space Setting → Security Companies → Invite via Email</strong></li>
      <li>Enter the following email address for the invitation: <code>ajax@nxgen.io</code></li>
      <li>Send the invitation and ensure it's accepted by NXGEN Technologies</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Ajax 1.png').default} alt="Ajax PRO Desktop Space Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Ajax 2.png').default} alt="Ajax Email Invitation" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> NXGEN Technologies successfully invited and accepted to Ajax Hub</p>
  </div>
</div>

## Step 2: Add Ajax Device in GCXONE Platform

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Add Ajax Device in GCXONE Platform</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Devices → Add Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login to the GCXONE platform with your credentials</li>
      <li>Navigate to <strong>Devices</strong> and choose <strong>Add Device</strong></li>
      <li>
        In the configuration form:
        <ul>
          <li><strong>Type</strong>: Select either Ajax Hub or Ajax NVR from the dropdown</li>
          <li>
            <strong>Hub ID / Device ID</strong>:
            <ul>
              <li>If you selected Ajax Hub, enter your Hub ID</li>
              <li>If you selected Ajax NVR, enter your Device ID</li>
            </ul>
          </li>
          <li><strong>Timezone</strong>: Select the location's time zone</li>
        </ul>
      </li>
      <li>Click <strong>Discover</strong></li>
      <li>The platform will connect and verify the Hub/NVR</li>
      <li>
        On success:
        <ul>
          <li>For Hub: All devices associated with the Hub will be automatically fetched and displayed in a list</li>
          <li>For NVR: All cameras associated with the NVR will be automatically fetched and displayed in a list</li>
        </ul>
      </li>
      <li>Review the discovered devices or cameras</li>
      <li>Click <strong>Save</strong> to add them to your account</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Ajax 3.png').default} alt="Ajax Device Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Ajax 4.png').default} alt="Ajax Hub Selection" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Ajax 5.png').default} alt="Ajax Device Discovery" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Ajax 6.png').default} alt="Ajax Device List" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Ajax device successfully added to GCXONE with all associated devices/cameras discovered</p>
  </div>
</div>

## Step 3: Find SIA-DC09 Receiver Details on GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Find SIA-DC09 Receiver Details on GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Devices → View Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>After adding the device, locate your newly registered AJAX device in the device list</li>
      <li>Click the <strong>View</strong> button beside the device</li>
      <li>
        On the device overview page, you will find the SIA-DC09 receiver information including:
        <ul>
          <li><strong>Account number</strong></li>
          <li><strong>Encryption key</strong></li>
          <li><strong>Receiver IP/Port</strong></li>
        </ul>
      </li>
    </ol>
    
    <img src={require('./images/Ajax 7.png').default} alt="Ajax SIA-DC09 Receiver Details" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> SIA-DC09 receiver details obtained from GCXONE device overview</p>
  </div>
</div>

## Step 4: Configure the Receiver in AJAX PRO Desktop

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Configure the Receiver in AJAX PRO Desktop</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>AJAX PRO Desktop → Company → CMS connection → Add Receiver</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Open <strong>AJAX PRO Desktop</strong></li>
      <li>Navigate to: <strong>Company → CMS connection → Add Receiver</strong></li>
      <li>
        Input the receiver details from the GCXONE platform's device details page:
        <ul>
          <li>Use the <strong>receiver IP/hostname</strong>, <strong>port</strong>, and the <strong>encryption key</strong></li>
        </ul>
      </li>
      <li>If you plan to use encrypted communication, <strong>enable encryption</strong> and copy the <strong>exact encryption key</strong> from GCXONE</li>
      <li>Enable <strong>"Transfer device or group name to CMS events"</strong> checkbox</li>
      <li><strong>Save</strong> the receiver configuration</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Ajax 8.png').default} alt="Ajax Receiver Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Ajax 9.png').default} alt="Ajax Encryption Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Receiver configured in Ajax PRO Desktop with GCXONE connection details</p>
  </div>
</div>

## Step 5: Enable the Receiver & Map Account Numbers

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Enable the Receiver & Map Account Numbers</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>AJAX PRO Desktop → Objects → Object → Maintenance → Monitoring via [Receiver Name]</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Go to the <strong>Objects</strong> section in AJAX PRO Desktop</li>
      <li>Click the <strong>Object</strong> from which you'd like to monitor events</li>
      <li>Open the <strong>Maintenance</strong> tab</li>
      <li>Find the <strong>Monitoring via [Receiver Name]</strong> option (where [Receiver Name] is the name you assigned to the receiver in step 4)</li>
      <li>On the right panel, you'll see a list of all the Hub and NVR associated with the object</li>
      <li>Select the device that you want to monitor and enter the account number as shown in the GCXONE device overview page and click save</li>
    </ol>
    
    <img src={require('./images/Ajax 10.png').default} alt="Ajax Account Mapping" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Account number mapping is essential for proper event routing. Make sure the account number matches exactly what is shown in GCXONE device overview.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Account numbers mapped for monitored devices with receiver enabled</p>
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
          <li>✅ Ensure the receiver status in AJAX PRO Desktop is active</li>
          <li>✅ Verify account number mapping matches GCXONE device overview</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Trigger a test event on your AJAX device to verify that alerts populate in GCXONE</li>
          <li>✅ Confirm events are received with proper device/group names</li>
        </ul>
      </div>
    </div>
    
    <img src={require('./images/Ajax 11.png').default} alt="Ajax Integration Verification" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Live AJAX device events received within GCXONE platform with integrated reporting and false alarm filtering</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="invitation" label="Invitation Issues" default>
        <ul>
          <li>Verify <code>ajax@nxgen.io</code> email address is correct</li>
          <li>Check that invitation was sent successfully</li>
          <li>Contact NXGEN support if invitation remains pending</li>
        </ul>
      </TabItem>

      <TabItem value="discovery" label="Device Discovery Fails">
        <ul>
          <li>Verify Hub ID or Device ID is entered correctly</li>
          <li>Check network connectivity between Ajax system and GCXONE</li>
          <li>Ensure timezone selection is accurate</li>
        </ul>
      </TabItem>

      <TabItem value="events" label="No Events Received">
        <ul>
          <li>Verify receiver status is active in Ajax PRO Desktop</li>
          <li>Check account number mapping matches GCXONE device overview</li>
          <li>Confirm encryption key is copied exactly if using encrypted communication</li>
          <li>Verify "Transfer device or group name to CMS events" is enabled</li>
        </ul>
      </TabItem>

      <TabItem value="connection" label="Receiver Connection Issues">
        <ul>
          <li>Double-check receiver IP/hostname and port from GCXONE</li>
          <li>Verify encryption settings match between Ajax PRO Desktop and GCXONE</li>
          <li>Test network connectivity to receiver endpoint</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [Ajax Overview](/docs/devices/ajax/overview)
- [Ajax Supported Features](/docs/devices/ajax/supported-features)
- [Ajax Troubleshooting](/docs/devices/ajax/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/ajax/troubleshooting) or [contact support](/docs/support).

