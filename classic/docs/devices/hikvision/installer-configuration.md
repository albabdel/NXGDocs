---
title: "Hikvision Installer Configuration"
description: "Step-by-step guide for configuring Hikvision devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:hikvision
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Hikvision Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Hikvision IP cameras and NVRs to integrate with GCXONE. Follow these steps in order to ensure proper video streaming, event detection, and device connectivity.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>⚙️</div>
      <h3 style={{color: 'white', margin: 0}}>Configuration</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Step-by-Step</p>
    </div>
  </div>
</div>

## Step 1: System Configuration (Time Management)

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: System Configuration (Time Management)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Configuration → System → System Settings → Time Settings</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login into your Hikvision portal by providing the credentials needed</li>
      <li>Navigate to the <strong>Configuration</strong> page, then select <strong>System</strong></li>
      <li>Proceed to <strong>System Settings</strong> and choose <strong>Time Settings</strong></li>
      <li>Choose the <strong>time zone</strong> of your device and make sure to enable the <strong>NTP</strong></li>
      <li>If your device supports DST we recommend you also have it enabled</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Hik 1.png').default} alt="Hikvision Time Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
        <p style={{textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--ifm-color-emphasis-600)'}}>Time Configuration</p>
      </div>
      <div className="col col--6">
        <img src={require('./images/Hik 2.png').default} alt="Hikvision NTP Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
        <p style={{textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--ifm-color-emphasis-600)'}}>NTP Settings</p>
      </div>
    </div>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Purpose:</strong>
      <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
        <li>NTP is a protocol used to synchronize the clocks of computers and other devices over a network</li>
        <li>The primary goal of DST is to make better use of daylight during the longer days of summer</li>
      </ul>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Time zone configured with NTP and DST enabled</p>
  </div>
</div>

## Step 2: User Management

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: User Management</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Configuration → System → User management → Add</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Navigate to the <strong>Configuration</strong> page, then select <strong>System</strong></li>
      <li>Proceed to <strong>User management</strong> then click on "Add"</li>
      <li>Enter the username and password for NXGEN</li>
      <li>We recommend setting the username to <strong>"NXG"</strong> with the specified permissions</li>
      <li>Select the specific cameras you want to apply these permissions to</li>
      <li>Don't forget to click on "OK" to save the changes</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Hik 3.png').default} alt="Hikvision User Management" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Hik 4.png').default} alt="Hikvision User Permissions" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <h4 style={{marginTop: '1.5rem'}}>Required Permissions for "NXG" user</h4>
    <div className="row">
      <div className="col col--6">
        <h5>Local Permissions</h5>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Parameters Settings</li>
          <li>Log Search</li>
          <li>Playback</li>
          <li>Manual Operation</li>
          <li>PTZ Control</li>
          <li>Video Export</li>
        </ul>
      </div>
      <div className="col col--6">
        <h5>Remote Permissions</h5>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Parameters Settings</li>
          <li>Log Search / Interrogate Working</li>
          <li>Two-way Audio</li>
          <li>Notify Surveillance Center / Trigger</li>
          <li>Video Output Control</li>
          <li>Live View</li>
          <li>PTZ Control</li>
          <li>Playback/Download</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> NXG user created with proper permissions</p>
  </div>
</div>

## Step 3: Security Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Security Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Configuration → System → Security</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ul>
      <li>Configure both <strong>RTSP</strong> and <strong>WEB</strong> authentication as <strong>Digest</strong></li>
      <li>This enhances security by ensuring that your credentials are protected with stronger encryption, reducing the risk of unauthorized access</li>
    </ul>
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> We highly recommend configuring both RTSP and WEB authentication as Digest for enhanced security. This is a critical security best practice.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Authentication set to Digest for enhanced security</p>
  </div>
</div>

## Step 4: Network Configuration (Integration Protocol)

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Network Configuration (Integration Protocol)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Configuration → Network → Advanced Settings → Integration Protocol</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Under "Network," go to "Advanced Settings," and then select "Integration Protocol"</li>
      <li>Enable the <strong>ISAPI</strong> by simply clicking on the check box</li>
    </ol>
    
    <img src={require('./images/Hik 5.png').default} alt="Hikvision ISAPI Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>ISAPI Protocol:</strong> The Internet Server Application Programming Interface (ISAPI) is required for GCXONE to communicate with Hikvision devices. This protocol enables device discovery, configuration, and event transmission.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> ISAPI protocol enabled</p>
  </div>
</div>

## Step 5: Basic Events Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Basic Events Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Configuration → Event → Basic Event</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>On the "Configuration" page, under the "Event" application, click on "Basic Event"</li>
      <li>Choose the camera you want to configure</li>
      <li>Draw your area of interest</li>
      <li>Choose the Arming Schedule under the "Arming Schedule" tab</li>
      <li>In the "Linkage Method" tab, enable the checkbox under the camera and check <strong>"Notify Surveillance Center"</strong></li>
      <li>To trigger alarms from other cameras, use the "Trigger Alarm Output" options in the "Normal Linkage" section</li>
    </ol>
    
    <img src={require('./images/Hik 6.png').default} alt="Hikvision Basic Events Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important Note:</strong> Avoid setting up Motion events; they can trigger too many alarms and cause issues. Use Basic Events like Video Tampering instead.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Basic events configured for selected cameras</p>
  </div>
</div>

## Step 6: Smart Events Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 6: Smart Events Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Configuration → Event → Smart Event</strong></p>
  </div>
  <div className="card__body">
    <h4>Available Smart Events</h4>
    <div className="row">
      <div className="col col--6">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Line Crossing Detection</h5>
          <p style={{fontSize: '0.9rem'}}>This feature identifies when an object crosses a predefined virtual line, useful for monitoring entry and exit points</p>
        </div>
      </div>
      <div className="col col--6">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Intrusion Detection</h5>
          <p style={{fontSize: '0.9rem'}}>It detects when an object enters or moves within a designated area, ideal for securing restricted zones</p>
        </div>
      </div>
    </div>
    
    <h4 style={{marginTop: '1.5rem'}}>Configuration Steps</h4>
    <ol>
      <li>On the "Configuration" page, under the "Event" application, click on "Smart Event"</li>
      <li>Choose the camera you want to configure</li>
      <li>Draw lines on the area of interest</li>
      <li>Choose the Arming Schedule under the "Arming Schedule" tab</li>
      <li>In the "Linkage Method" tab, enable the checkbox under the camera and check <strong>"Notify Surveillance Center"</strong></li>
      <li>To trigger alarms from other cameras, use the "Trigger Alarm Output" options in the "Normal Linkage" section</li>
    </ol>
    
    <img src={require('./images/Hik 7.png').default} alt="Hikvision Smart Events Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Smart events configured to enhance security system's effectiveness and responsiveness</p>
  </div>
</div>

## Step 7: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 7: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Customer → Site → Devices → Add Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select <strong>Hikvision</strong></li>
      <li>Fill: <strong>Host/Serial, Username, Password, Ports, Time Zone</strong></li>
      <li>Click <strong>Discover</strong>. Review discovered sensors and I/O</li>
      <li>Click <strong>Save</strong></li>
    </ol>
    
    <img src={require('./images/Hik 8.png').default} alt="Hikvision Device Configuration in GCXONE" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> GCXONE lists sensors under the Hikvision device</p>
  </div>
</div>

## Step 8: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 8: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ Verify time synchronization is working</li>
          <li>✅ Test NXG user login and permissions</li>
          <li>✅ Confirm ISAPI protocol is active</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Test basic and smart events are triggering properly</li>
          <li>✅ Verify "Notify Surveillance Center" is working</li>
          <li>✅ Check live view and playback functionality</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Hikvision integration with GCXONE platform</p>
  </div>
</div>

## Related Articles

- 
- 
- 

---

## Need Help?

If you're experiencing issues during configuration, check our  or [contact support](/docs/support).
