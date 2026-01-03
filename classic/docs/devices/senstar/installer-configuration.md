---
title: "Senstar Installer Configuration"
description: "Step-by-step guide for configuring Senstar perimeter security devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:senstar
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Senstar Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Senstar perimeter security devices to integrate with GCXONE. Follow these steps to ensure proper video streaming, event detection, and alarm management.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
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
      <li>✅ Administrator privileges on your system</li>
      <li>✅ System meets minimum hardware and OS requirements for the Senstar installer</li>
      <li>✅ Network access to the target Senstar device is available</li>
      <li>✅ Senstar Symphony Server installer downloaded</li>
    </ul>
  </div>
</div>

## Step 1: Install Senstar Software

<div className="card shadow--md" style={{borderLeft: '6px solid #14B8A6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Install Senstar Software</h3>
  </div>
  <div className="card__body">
    <h4>Download Installer</h4>
    <ul>
      <li>Download Senstar Installer (Senstar Server) from the official website</li>
    </ul>
    
    <h4 style={{marginTop: '1.5rem'}}>Run the Installer</h4>
    <ol>
      <li>Double-click the downloaded .exe file</li>
      <li>Proceed with default options unless specified by IT policies</li>
      <li>Finish installation and launch the application</li>
    </ol>
    
    <h4 style={{marginTop: '1.5rem'}}>Installation Note</h4>
    <p>Upon installation, a pop up will be displayed. Uncheck the selected checkbox and click on "Next" button to continue the installation</p>
    
    <img src={require('./images/senstar 1.png').default} alt="Senstar Installation" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Post Installation</h4>
    <ul>
      <li>Once installed successfully you will be able to see the client in your desktop (or mentioned in your path)</li>
    </ul>
    
    <img src={require('./images/senstar 2.png').default} alt="Senstar Client Desktop" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p>Upon opening the client you will be asked for the authorization with IP address, username, password and able to see the live stream</p>
    
    <img src={require('./images/senstar 3.png').default} alt="Senstar Client Login" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Senstar client installed and accessible</p>
  </div>
</div>

## Step 2: Verify Streaming and Events in Senstar Client

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Verify Streaming and Events in Senstar Client</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Senstar Client</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Open the installed <strong>Senstar client</strong> from your desktop or start menu</li>
      <li>Enter the <strong>IP address</strong>, <strong>username</strong>, and <strong>password</strong> of the Senstar unit</li>
      <li>Click <strong>Connect</strong></li>
      <li>Navigate to the <strong>Live View</strong> tab</li>
      <li>Confirm the live video feed is working as expected</li>
      <li>Go to the <strong>Events</strong> or <strong>Logs</strong> section</li>
      <li>Confirm that real-time motion or intrusion events are being logged correctly</li>
    </ol>
    
    <img src={require('./images/senstar 4.png').default} alt="Senstar Events Verification" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Device is online and in working state</p>
  </div>
</div>

## Step 3: Add Senstar Parameters to GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Add Senstar Parameters to GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Configuration App → Service Provider → Overview → Edit → Additional Settings → Custom Property</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login to GCXONE</li>
      <li>Navigate to configuration app</li>
      <li>At service provider level, click on edit button under overview tab</li>
      <li>Click on additional settings tab → Custom property</li>
      <li>Scroll down and click on "Add +" button</li>
      <li>
        Enter parameter details:
        <ul>
          <li><strong>Parameter Type</strong>: string</li>
          <li><strong>Parameter Name</strong>: SenStar_Device_Custom_baseUrl</li>
          <li><strong>Parameter Value</strong>: https://universalproxy.nxgen.cloud/</li>
        </ul>
      </li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 5.png').default} alt="Senstar Parameters Overview" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 6.png').default} alt="Senstar Edit Overview" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 7.png').default} alt="Senstar Custom Property" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 8.png').default} alt="Senstar Parameter Details" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Custom property added successfully</p>
  </div>
</div>

## Step 4: Add Senstar Device Under the Required Site

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Add Senstar Device Under the Required Site</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Configuration → Site → Devices → Add New Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Go to the <strong>Configuration</strong> section in GCXONE</li>
      <li>Select the <strong>target site</strong> under which the Senstar device should be registered</li>
      <li>Navigate to <strong>Devices</strong> → <strong>Add New Device</strong></li>
      <li>
        Fill in the following details:
        <ul>
          <li><strong>Device Name</strong>: e.g., "Senstar Camera - Gate A"</li>
          <li><strong>Device Type</strong>: SenStar</li>
          <li><strong>IP Address/Host</strong>: xxx.xxx.xxx.xxx</li>
          <li><strong>Http/s Port</strong>: Default or customized (e.g., 5000)</li>
          <li><strong>Enable HTTPS</strong>: switch ON the toggle if the device supports HTTPS, If not it can be in OFF</li>
          <li><strong>Username</strong>: xxx</li>
          <li><strong>Password</strong>: xxx</li>
          <li><strong>RTSP Port</strong>: for streaming</li>
          <li><strong>Enable event polling</strong> check box for events to flow with 10 sec interval</li>
        </ul>
      </li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 9.png').default} alt="Senstar Site Selection" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 10.png').default} alt="Senstar Add Device" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <img src={require('./images/senstar 11.png').default} alt="Senstar Default Ports" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> <strong>Streaming Key</strong>: The protected RTSP password should be provided in this field. See Step 5 for how to generate the encoded password.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Device configuration page ready for password encoding</p>
  </div>
</div>

## Step 5: Generate Streaming Password

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Generate Streaming Password</h3>
  </div>
  <div className="card__body">
    <h4>Background</h4>
    <p>The Senstar device requires an encoded password to access the RTSP-based live stream. The encoder cannot be downloaded and installed directly. You need to install the Senstar server exe in your machine as mentioned in prerequisite conditions.</p>
    
    <h4 style={{marginTop: '1.5rem'}}>Steps to Get Encoded Password</h4>
    <ol>
      <li>
        Access the Password encoder from your system in the following path:
        <ul>
          <li><strong>PATH</strong>: Local disk C → Program files → Senstar → Symphony server V7 → _Tools → PasswordEncoder (File type - Application)</li>
        </ul>
      </li>
      <li>Run PasswordEncoder.exe</li>
      <li>Enter device password</li>
      <li>Copy and paste the Encoded Password in Device Configuration page</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 12.png').default} alt="Senstar Password Encoder Path" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 13.png').default} alt="Senstar Password Encoder" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <img src={require('./images/senstar 14.png').default} alt="Senstar VLC Note" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Info:</strong> The note above is needed to stream the live via <strong>VLC media player</strong> and is not required in GCXONE.
    </div>
    
    <h4 style={{marginTop: '1.5rem'}}>Enable Events</h4>
    <p>Check the event polling enabled checkbox</p>
    
    <img src={require('./images/senstar 15.png').default} alt="Senstar Event Polling" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p>Click <strong>Save & Verify</strong> to confirm that the device is reachable and data (stream/events) is being received</p>
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Note:</strong> Make sure RTSP URL works in VLC media player for testing purposes.
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 16.png').default} alt="Senstar Live Stream" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 17.png').default} alt="Senstar Events in Video Activity" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Device added successfully with live stream and events</p>
  </div>
</div>

## Step 6: Configuring Senstar for Alarms

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 6: Configuring Senstar for Alarms</h3>
  </div>
  <div className="card__body">
    <h4>Background Information</h4>
    <p>The Senstar Symphony Server can generate alarms from rules. Rules include events, action sets, and schedules:</p>
    <ul>
      <li><strong>Event</strong>: Triggers a rule. Examples include events from video analytics, camera inputs, and access devices</li>
      <li><strong>Action Set</strong>: Defines the actions that the Senstar Symphony Server takes when an event triggers a rule</li>
      <li><strong>Schedule</strong>: Defines when a rule is active. An event must occur during an active time in the schedule to trigger a rule</li>
    </ul>
    
    <p>When a rule is enabled, the occurrence of an event associated with the rule during an active period in the rule's schedule causes the Senstar Symphony Server to perform the actions defined in the rule's action set.</p>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Reference:</strong> Please refer to <a href="https://xnet.senstar.com/webhelp/Symphony/8.0/en/topic_task/air_server_rules_rule_create_8.html?hl=add%2Crule" target="_blank">Senstar Webhelp</a> on how to create new rule.
    </div>
    
    <h4 style={{marginTop: '1.5rem'}}>Steps to Add Rule in Senstar Client</h4>
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Note:</strong> The below configuration should be configured by admin user.
    </div>
    
    <ol>
      <li><strong>Step 1</strong>: Open the symphony client from your machine</li>
      <li><strong>Step 2</strong>: Login to the device in the symphony client</li>
      <li><strong>Step 3</strong>: Click on the server configuration option</li>
      <li><strong>Step 4</strong>: User will be redirected to the Senstar portal</li>
      <li><strong>Step 5</strong>: Login to the portal with username and password</li>
      <li><strong>Step 6</strong>: User will be landed up in the configuration</li>
      <li><strong>Step 7</strong>: Click on the Rules tab</li>
      <li><strong>Step 8</strong>: Click on the add button</li>
      <li><strong>Step 9</strong>: Provide the mandatory fields required to add a rule</li>
      <li><strong>Step 10</strong>: Click on save</li>
      <li><strong>Step 11</strong>: The added rule will be listed under rules tab</li>
      <li><strong>Step 12</strong>: Now the events should flow according to the rule set in client</li>
      <li><strong>Step 13</strong>: The event generated in client will be received in GCXONE</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--4">
        <img src={require('./images/senstar 18.png').default} alt="Senstar Symphony Client" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/senstar 19.png').default} alt="Senstar Server Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/senstar 20.png').default} alt="Senstar Portal Login" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 21.png').default} alt="Senstar Configuration Portal" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 22.png').default} alt="Senstar Add Rule" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 23.png').default} alt="Senstar Rule Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 24.png').default} alt="Senstar Rules List" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/senstar 25.png').default} alt="Senstar Events in Client" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/senstar 26.png').default} alt="Senstar Events in GCXONE" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Rules should be enabled for the alarms to be generated in client. Alarms will not be generated if no rules is enabled in client.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Rules configured and events flowing to GCXONE</p>
  </div>
</div>

## Step 7: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 7: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ Live Stream appears in GCXONE</li>
          <li>✅ Events appear in Video Activity Search and Device Dashboard</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Make sure RTSP URL works in VLC media player</li>
          <li>✅ Rules are enabled and generating alarms</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Full integration working with live stream and events</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="streaming" label="Streaming Issues" default>
        <ul>
          <li>Verify RTSP URL works in VLC media player</li>
          <li>Check that encoded password is correctly generated and entered</li>
          <li>Verify RTSP port is correct and accessible</li>
          <li>Ensure network connectivity to device</li>
        </ul>
      </TabItem>

      <TabItem value="events" label="No Events Received">
        <ul>
          <li>Verify event polling is enabled in device configuration</li>
          <li>Check that rules are created and enabled in Senstar Symphony Server</li>
          <li>Confirm rules have active schedules</li>
          <li>Verify events are being generated in Senstar client</li>
        </ul>
      </TabItem>

      <TabItem value="password" label="Password Encoding Issues">
        <ul>
          <li>Ensure Senstar Server is installed to access PasswordEncoder</li>
          <li>Verify password encoder path: C:\Program files\Senstar\Symphony server V7\_Tools\PasswordEncoder</li>
          <li>Check that encoded password is copied correctly without extra spaces</li>
        </ul>
      </TabItem>

      <TabItem value="rules" label="Rules Not Working">
        <ul>
          <li>Verify rules are enabled in Senstar Symphony Server</li>
          <li>Check that events are associated with rules</li>
          <li>Confirm schedules are active for rules</li>
          <li>Ensure action sets are properly configured</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Troubleshooting Tools

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Additional Tools</h3>
  </div>
  <div className="card__body">
    <p><strong>Senstar SDK Mobile</strong>: Mobile Bridge application is used to get connected sensors lists</p>
  </div>
</div>

## Related Articles

- [Senstar Overview](/docs/devices/senstar/overview)
- [Senstar Supported Features](/docs/devices/senstar/supported-features)
- [Senstar Troubleshooting](/docs/devices/senstar/troubleshooting)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/senstar/troubleshooting) or [contact support](/docs/support).

