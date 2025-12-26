---
title: "Avigilon Installer Configuration"
description: "Step-by-step guide for configuring Avigilon VMS devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:avigilon
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Avigilon Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring Avigilon Video Management System (VMS) to integrate with GCXONE. Follow these steps to ensure proper video streaming, analytics, event detection, and device connectivity.
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

## Prerequisites

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Before You Begin</h3>
  </div>
  <div className="card__body">
    <ul>
      <li>✅ Avigilon ACC client software installed</li>
      <li>✅ ACC 7 Web Endpoint Service installed</li>
      <li>✅ IT team responsible to set up port forwarding on firewall or router</li>
      <li>✅ Administrative access to Avigilon system</li>
      <li>✅ Network connectivity to Avigilon ACC server</li>
    </ul>
  </div>
</div>

## Step 1: Install Essential Software Components

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Install Essential Software Components</h3>
  </div>
  <div className="card__body">
    <h4>Install WebAPI Endpoint</h4>
    <ul>
      <li>In case of having Avigilon VMS, install WebAPI Endpoint</li>
      <li>Install the Avigilon WebAPI endpoint by following the instructions provided in the Avigilon WebAPI Endpoint Quick Start Guide</li>
      <li>This endpoint facilitates communication between the VMS and external applications</li>
    </ul>
    
    <h4 style={{marginTop: '1.5rem'}}>Ensure ACC Server Accessibility</h4>
    <ul>
      <li>Confirm that the ACC (Avigilon Control Center) server is properly installed and operational</li>
      <li>The ACC server communicates with the external world through the configured server port, ensuring that the VMS can send and receive data as needed</li>
    </ul>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> WebAPI Endpoint installation is mandatory for external communication with GCXONE. Ensure proper port forwarding is configured by your IT team.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> WebAPI Endpoint installed and ACC server accessible</p>
  </div>
</div>

## Step 2: Login to Avigilon ACC Client

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Login to Avigilon ACC Client</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ACC Client → Login</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>In the ACC client login screen, locate the field to enter the device's IP address in the search bar</li>
      <li>Enter your username and password for the ACC client</li>
    </ol>
    
    <img src={require('./images/Avigilon 1.png').default} alt="Avigilon ACC Client Login" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Successfully logged into ACC client</p>
  </div>
</div>

## Step 3: Navigate to Camera Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Navigate to Camera Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ACC Client → Camera Selection</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Once logged in, use the client interface to navigate to the specific camera or device you need to configure</li>
    </ol>
    
    <img src={require('./images/Avigilon 2.png').default} alt="Avigilon Camera Selection" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Camera interface accessible for configuration</p>
  </div>
</div>

## Step 4: Access Camera Setup

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Access Camera Setup</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Camera → Right-Click → Setup</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Right-Click on the Camera you want to configure</li>
      <li>In the context menu that appears, click on "Setup"</li>
      <li>This will open the camera's configuration page</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Avigilon 3.png').default} alt="Avigilon Camera Right-Click" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Avigilon 4.png').default} alt="Avigilon Camera Setup" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Camera configuration page opened</p>
  </div>
</div>

## Step 5: Configure Motion Detection Analytics

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Configure Motion Detection Analytics</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Camera Setup → Analytics → Motion Detection</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Choose and Configure the Type of Analytics</li>
      <li>After selecting the desired analytics type, you will be able to adjust various settings and parameters specific to that type</li>
      <li>
        <p>Configure Motion Detection parameters:</p>
        <ul>
          <li><strong>Object Types</strong>: Select types of objects (Person, Vehicle)</li>
          <li><strong>Sensitivity</strong>: Set sensitivity level (recommended 8-10)</li>
          <li><strong>Threshold Time</strong>: Set minimum duration (recommended 2 seconds)</li>
          <li><strong>Pre-Motion Record Time</strong>: Set recording time before event (recommended 10 seconds)</li>
          <li><strong>Post-Motion Record Time</strong>: Set recording time after event (recommended 10 seconds)</li>
        </ul>
      </li>
    </ol>
    
    <img src={require('./images/Avigilon 5.png').default} alt="Avigilon Motion Detection Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Motion detection analytics configured</p>
  </div>
</div>

## Step 6: Configure Analytic Events

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 6: Configure Analytic Events</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Camera Setup → Analytics → Analytic Events</strong></p>
  </div>
  <div className="card__body">
    <h4>Setup Analytic Events</h4>
    <ol>
      <li>Analytics process the video feed in real-time to detect and respond to specific activities or conditions</li>
      <li>Click on the button "Add"</li>
      <li>Define your Area of interest by clicking the icon on the top left of the screen</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Avigilon 6.png').default} alt="Avigilon Add Analytic Event" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Avigilon 7.png').default} alt="Avigilon Area of Interest" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <h4 style={{marginTop: '1.5rem'}}>Configure Event Parameters</h4>
    <p>After you add the area of interest, setup the following:</p>
    <ul>
      <li><strong>Enabled Checkbox</strong>: Check to enable the analytic event</li>
      <li><strong>Activity</strong>: Select the type of activity to monitor within the defined zone</li>
      <li><strong>Object Types</strong>: Specify what kinds of objects the system should detect</li>
      <li><strong>Sensitivity</strong>: Set sensitivity level (recommended 8-10)</li>
      <li><strong>Threshold Time</strong>: Set minimum duration (recommended 2 seconds)</li>
      <li><strong>Number of Objects</strong>: Specify number of objects required to trigger event</li>
      <li><strong>Timeout</strong>: Set wait time before resetting (recommended 10 seconds)</li>
      <li><strong>Distance (feet)</strong>: Set minimum distance an object must travel</li>
    </ul>
    
    <img src={require('./images/Avigilon 8.png').default} alt="Avigilon Event Parameters" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Analytic events configured with area of interest</p>
  </div>
</div>

## Step 7: Setup User Group for GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 7: Setup User Group for GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Site → Right-Click → Setup → User and Groups</strong></p>
  </div>
  <div className="card__body">
    <h4>Access Site Configuration</h4>
    <ol>
      <li>Right-Click on the Site you want to configure</li>
      <li>In the context menu that appears, click on "Setup"</li>
      <li>This will open the Site's configuration page</li>
      <li>Navigate to "User and groups"</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Avigilon 9.png').default} alt="Avigilon Site Setup" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Avigilon 10.png').default} alt="Avigilon User and Groups" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> User and groups configuration accessed</p>
  </div>
</div>

## Step 8: Create User Group

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 8: Create User Group</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Groups → Add</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Navigate to "Groups" and then click "Add"</li>
      <li>Add a copy permission, "Restricted Users" for NXGEN</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Avigilon 11.png').default} alt="Avigilon Add Group" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Avigilon 12.png').default} alt="Avigilon Copy Permissions" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> New user group created</p>
  </div>
</div>

## Step 9: Configure Group Settings

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 9: Configure Group Settings</h3>
  </div>
  <div className="card__body">
    <h4>Configure Group Details</h4>
    <ol>
      <li>Add the "Name" of the user, recommended to use "NXGEN" or "NXG" in the Name field</li>
      <li>
        Add the privileges listed below in "Group Privileges":
        <ul>
          <li>
            <strong>View Live Images</strong>:
            <ul>
              <li>Use PTZ controls</li>
              <li>Lock PTZ controls</li>
              <li>Trigger Digital Outputs</li>
              <li>Broadcast to speakers</li>
            </ul>
          </li>
          <li><strong>Receive live events with identifying features</strong></li>
          <li><strong>View high resolution images</strong></li>
          <li>
            <strong>View Recorded Images</strong>:
            <ul>
              <li>Export images</li>
              <li>View images recorded before login</li>
              <li>Licensed search for identifying features</li>
            </ul>
          </li>
          <li>
            <strong>View Maps</strong>:
            <ul>
              <li>Manage Maps</li>
            </ul>
          </li>
          <li><strong>Manage user sessions</strong></li>
          <li><strong>Listen to microphones</strong></li>
        </ul>
      </li>
    </ol>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Group privileges configured</p>
  </div>
</div>

## Step 10: Add Cameras to Group

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 10: Add Cameras to Group</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Add the cameras you want to appear on GCXONE platform</li>
      <li>Click "Ok" to save the changes</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--4">
        <img src={require('./images/Avigilon 13.png').default} alt="Avigilon Add Cameras Step 1" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/Avigilon 14.png').default} alt="Avigilon Add Cameras Step 2" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--4">
        <img src={require('./images/Avigilon 15.png').default} alt="Avigilon Add Cameras Step 3" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Cameras assigned to user group</p>
  </div>
</div>

## Step 11: Configure Alarms

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 11: Configure Alarms</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Setup → Alarms</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Back to the Setup page from previous step, Navigate to "Alarms"</li>
      <li>Click "Add"</li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/Avigilon 16.png').default} alt="Avigilon Alarms Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/Avigilon 17.png').default} alt="Avigilon Add Alarm" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Alarm configuration page accessed</p>
  </div>
</div>

## Step 12: Set Alarm Trigger Source

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 12: Set Alarm Trigger Source</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Set the alarm trigger source, and select the cameras you are interested in</li>
      <li>Then click "Next"</li>
    </ol>
    
    <img src={require('./images/Avigilon 18.png').default} alt="Avigilon Alarm Trigger Source" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Alarm trigger source configured</p>
  </div>
</div>

## Step 13: Configure Alarm Recording Settings

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 13: Configure Alarm Recording Settings</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select the devices you want to associate the type of alarm with</li>
      <li>Setup the "Pre-alarm recording time" (recommended 10 seconds)</li>
      <li>Setup the recording duration below</li>
      <li>Then click "Next"</li>
    </ol>
    
    <img src={require('./images/Avigilon 19.png').default} alt="Avigilon Alarm Recording Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Alarm recording settings configured</p>
  </div>
</div>

## Step 14: Configure Alarm Recipients

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 14: Configure Alarm Recipients</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Alarm Recipients → Add Recipients</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select alarm recipients</li>
      <li>Click on "Add Recipients" and ensure to select the group you configured earlier</li>
      <li>Click "Next"</li>
    </ol>
    
    <img src={require('./images/Avigilon 20.png').default} alt="Avigilon Alarm Recipients" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Alarm recipients configured</p>
  </div>
</div>

## Step 15: Finalize Alarm Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 15: Finalize Alarm Configuration</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select the user as configured</li>
      <li>Then click "Add"</li>
      <li>Select the duration needed to notify the recipient when an alarm is triggered</li>
      <li>Don't forget to Save the changes</li>
    </ol>
    
    <img src={require('./images/Avigilon 21.png').default} alt="Avigilon Finalize Alarm" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Alarm configuration completed and saved</p>
  </div>
</div>

## Step 16: Configure Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 16: Configure Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Site → Configuration App → Devices</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Go into the Site that you want to add the device to in GCXONE Configuration App</li>
      <li>Choose Avigilon as your device, and Fill in the Serial Number, UserName, and Password of the device</li>
      <li>Once the details are filled, click on Discover and you should see the sensors discovered</li>
    </ol>
    
    <img src={require('./images/Avigilon 22.png').default} alt="Avigilon GCXONE Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Sensors discovered successfully in GCXONE</p>
  </div>
</div>

## Step 17: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 17: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ Verify WebAPI endpoint is functional</li>
          <li>✅ Test user group access and permissions</li>
          <li>✅ Confirm analytics are generating appropriate events</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Test alarm notifications</li>
          <li>✅ Verify camera access through configured user group</li>
          <li>✅ Check live view and playback functionality</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete Avigilon integration with GCXONE platform</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="webapi" label="WebAPI Endpoint Issues" default>
        <ul>
          <li>Verify WebAPI endpoint is properly installed</li>
          <li>Check port forwarding configuration</li>
          <li>Ensure ACC server is accessible externally</li>
        </ul>
      </TabItem>

      <TabItem value="user-access" label="User Access Problems">
        <ul>
          <li>Verify user group permissions are correctly configured</li>
          <li>Check camera assignments to user group</li>
          <li>Ensure proper privileges are granted</li>
        </ul>
      </TabItem>

      <TabItem value="analytics" label="Analytics Not Working">
        <ul>
          <li>Check sensitivity settings (recommended 8-10)</li>
          <li>Verify area of interest is properly defined</li>
          <li>Confirm threshold time and timeout settings</li>
        </ul>
      </TabItem>

      <TabItem value="alarms" label="Alarm Configuration Issues">
        <ul>
          <li>Verify alarm trigger sources are correctly selected</li>
          <li>Check recipient configuration matches user group</li>
          <li>Ensure recording settings are properly configured</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [Avigilon Overview](/docs/devices/avigilon/overview)
- [Avigilon Supported Features](/docs/devices/avigilon/supported-features)
- [Avigilon Troubleshooting](/docs/devices/avigilon/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/avigilon/troubleshooting) or [contact support](/docs/support).
