---
title: "ADPRO Installer Configuration"
description: "Step-by-step guide for configuring ADPRO devices with GCXONE"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:adpro
sidebar_position: 3
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ADPRO Installer Configuration

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide provides step-by-step instructions for configuring ADPRO security control panels to integrate with GCXONE. Follow these steps in order to ensure proper alarm transmission and device connectivity.
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
      <li>✅ ADPRO XO client software installed</li>
      <li>✅ Network connectivity to NXGEN's ADPRO virtual receiver</li>
      <li>✅ Dedicated virtual receiver IP address (provided by NXGEN CMS team)</li>
      <li>✅ Network configuration (Public Network, VPN, or Whitelisting setup)</li>
      <li>✅ Administrative access to ADPRO XO client</li>
      <li>✅ GCXONE account with appropriate permissions</li>
    </ul>
  </div>
</div>

## Step 1: Network Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #4F46E5', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Network Configuration</h3>
  </div>
  <div className="card__body">
    <h4>Network Options</h4>
    <div className="row">
      <div className="col col--4">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Public Network</h5>
          <p style={{fontSize: '0.9rem'}}>Use public IP address of receiver and associated ports</p>
        </div>
      </div>
      <div className="col col--4">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>VPN</h5>
          <p style={{fontSize: '0.9rem'}}>Connect through network tunnel using private IP addressing</p>
        </div>
      </div>
      <div className="col col--4">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Whitelisting</h5>
          <p style={{fontSize: '0.9rem'}}>Request NXG tech support for dedicated receiver IP address</p>
        </div>
      </div>
    </div>
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Important Notes:</strong>
      <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
        <li>For ADPRO devices there is a dedicated virtual receiver for each customer</li>
        <li>Your NXGEN CMS team will provide you with the IP address for your ADPRO virtual receiver when your GCXONE tenant is setup</li>
        <li>GCXONE supports both primary receiver and backup receiver</li>
        <li>If you want to avoid opening your existing RTSP to the external world, you'll need to provide an external RTSP address as well as the control port</li>
      </ul>
    </div>
    
    <p><strong>Expected result:</strong> Network connectivity established to NXGEN ADPRO virtual receiver</p>
  </div>
</div>

## Step 2: CMS Alarm Transmission

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: CMS Alarm Transmission</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → CMS Alarm Transmission</strong></p>
  </div>
  <div className="card__body">
    <img src={require('./images/ADPRO 1.png').default} alt="ADPRO CMS Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <Tabs>
      <TabItem value="general" label="General Settings" default>
        <h4>Configure General Settings</h4>
        <ul>
          <li>On "General" provide your <strong>Server unit ID</strong></li>
          <li>Keep in mind that each device should have a <strong>unique server ID</strong>, which means you can't use the same value twice</li>
        </ul>
        <img src={require('./images/ADPRO 2.png').default} alt="ADPRO General Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </TabItem>

      <TabItem value="primary" label="Primary Alarm Transmission">
        <h4>Configure Primary Alarm Transmission</h4>
        <ul>
          <li>In the 'Primary Alarm Transmission' section, enter the IP address provided by the NXG support team</li>
          <li>This IP address corresponds to the customer device on the GCXONE</li>
        </ul>
        <img src={require('./images/ADPRO 3.png').default} alt="ADPRO Primary Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </TabItem>

      <TabItem value="secondary" label="Secondary Alarm Transmission">
        <h4>Configure Secondary Alarm Transmission (Optional)</h4>
        <ul>
          <li>To add an additional backup IP address, include it under the "Secondary Alarm Transmission" section</li>
          <li>Use the secondary IP address provided by the NXG support team</li>
          <li>Ensure you have verified the new IP address with NXG support to avoid any configuration issues</li>
          <li>This secondary IP address will serve as a backup communication pathway, enhancing reliability and redundancy</li>
        </ul>
        <img src={require('./images/ADPRO 4.png').default} alt="ADPRO Secondary Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </TabItem>

      <TabItem value="site-pulse" label="Site Pulse (Lifecheck)">
        <h4>Configure Lifecheck - Site Pulse (Recommended)</h4>
        <ul>
          <li>Under both Primary Alarm Transmission and Secondary, you will find a section dedicated to site pulse activity monitoring</li>
          <li>Regularly check the site activity</li>
          <li>Select the interval at which pulses are sent to the GCXONE</li>
          <li>This allows for precise control over the frequency of status updates, ensuring device is active</li>
        </ul>
        <img src={require('./images/ADPRO 5.png').default} alt="ADPRO Site Pulse Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </TabItem>
    </Tabs>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Primary and secondary alarm transmission configured with site pulse monitoring</p>
  </div>
</div>

## Step 3: Parallel Alarm Transmission (Optional)

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Parallel Alarm Transmission (Optional)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → Parallel Alarm Transmission</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ul>
      <li>In the 'Parallel Alarm' section, you have the option to add an additional IP address for alarm transmission</li>
      <li>This can be useful for other purposes, such as integrating with a different alarm management system or generating reports</li>
      <li>Keep in mind that this feature is optional and intended for customer use</li>
      <li>The same steps mentioned in Step 2 can be done in this chapter as well</li>
    </ul>
    
    <img src={require('./images/ADPRO 6.png').default} alt="ADPRO Parallel Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Additional parallel alarm transmission configured if needed</p>
  </div>
</div>

## Step 4: Analytics Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Analytics Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → Analytics</strong></p>
  </div>
  <div className="card__body">
    <h4>Available Analytics Features</h4>
    <div className="row">
      <div className="col col--4">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Intrusion Trace</h5>
          <p style={{fontSize: '0.9rem'}}>Define specific areas within camera's field of view for unauthorized entry monitoring</p>
        </div>
      </div>
      <div className="col col--4">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Loiter Trace</h5>
          <p style={{fontSize: '0.9rem'}}>Configure detection for prolonged presence in restricted areas</p>
        </div>
      </div>
      <div className="col col--4">
        <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
          <h5>Motion Sabotage</h5>
          <p style={{fontSize: '0.9rem'}}>Set up detection for camera tampering or obstruction</p>
        </div>
      </div>
    </div>
    
    <img src={require('./images/ADPRO 7.png').default} alt="ADPRO Analytics Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Configure Detection Parameters</h4>
    <ul>
      <li>Set up and adjust parameters for motion alarms</li>
      <li>Define specific zones, sensitivity levels, and rules for detecting various activities or threats</li>
      <li>Configure detection zones for entry points or perimeters</li>
      <li>Adjust sensitivity levels to distinguish between minor movements and actual intrusions</li>
      <li>Specify conditions such as size and speed of moving objects that will trigger alerts</li>
    </ul>
    
    <img src={require('./images/ADPRO 8.png').default} alt="ADPRO Detection Parameters" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Analytics configured to reduce false alarms and enhance security accuracy</p>
  </div>
</div>

## Step 5: Arm and Disarm Schedule

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Arm and Disarm Schedule</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → Arm/Disarm Schedule</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ul>
      <li>Set the system to either armed or disarmed mode by selecting your desired times</li>
      <li>Use the right side of the screen to configure scheduling</li>
      <li>Define when the system should be automatically armed or disarmed</li>
    </ul>
    
    <img src={require('./images/ADPRO 9.png').default} alt="ADPRO Arm/Disarm Schedule" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Automated arm/disarm schedule configured</p>
  </div>
</div>

## Step 6: Alarms Profile

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 6: Alarms Profile</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → Alarms Profile</strong></p>
  </div>
  <div className="card__body">
    <h4>Configure Alarm Profiles</h4>
    <ul>
      <li>Alarm Profiles are customizable settings that determine how the system responds to various alarm events</li>
      <li>Specify different parameters such as the type of alarm, conditions for triggering, and subsequent actions</li>
    </ul>
    
    <img src={require('./images/ADPRO 10.png').default} alt="ADPRO Alarms Profile" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Edit Profile Settings</h4>
    <p>When you press "Edit", configure the following:</p>
    <ul>
      <li><strong>Profile Type</strong>: Select the type of profile (alarm or other event type)</li>
      <li><strong>Operational State</strong>: Specify whether profile should be active when disarmed, armed, or both</li>
      <li><strong>Alarm Behaviour - Armed</strong>: Define system behavior when armed</li>
      <li><strong>Alarm Behaviour - Disarmed</strong>: Define system behavior when disarmed (suppress alarms, transmissions, email notifications)</li>
    </ul>
    
    <img src={require('./images/ADPRO 11.png').default} alt="ADPRO Profile Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Note:</strong> You can also add a profile of your choice as an administrator
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Custom alarm profiles configured for different operational states</p>
  </div>
</div>

## Step 7: Input/Output Behaviour

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 7: Input/Output Behaviour</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → Input/Output Behaviour</strong></p>
  </div>
  <div className="card__body">
    <h4>Configure Event Responses</h4>
    <ul>
      <li>The configuration screen lets users manage system event responses</li>
      <li>Left panel has navigation tree</li>
      <li>Middle panel lists events like "SYSTEM STARTUP" and "SYSTEM ARMED"</li>
      <li>Right panel allows detailed settings for each event</li>
    </ul>
    
    <img src={require('./images/ADPRO 12.png').default} alt="ADPRO Input/Output Behaviour" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Configure Camera Assignment</h4>
    <p>Configure the event to its corresponding Camera for email or alarm reports</p>
    
    <img src={require('./images/ADPRO 13.png').default} alt="ADPRO Camera Assignment" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Configure Camera View Style</h4>
    <ul>
      <li>After configuring the camera, select a camera view style</li>
      <li><strong>Live View</strong>: See live feed on both ADPRO XO client and GCXONE</li>
      <li><strong>Quad View</strong> or <strong>Duress</strong>: Receive still images on both platforms</li>
    </ul>
    
    <img src={require('./images/ADPRO 14.png').default} alt="ADPRO Camera View Style" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Automated security actions configured with proper camera assignments and view styles</p>
  </div>
</div>

## Step 8: Time Zone Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 8: Time Zone Configuration</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → General → Date/Time</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ul>
      <li>Configure the time zone as the customer's device time zone</li>
      <li>We recommend you sync the NTP server, in this case you don't need to configure it manually</li>
      <li>The device will read the server day-time</li>
    </ul>
    
    <img src={require('./images/ADPRO 15.png').default} alt="ADPRO Time Zone Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Time zone configured with NTP synchronization</p>
  </div>
</div>

## Step 9: Configure NXG Users

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 9: Configure NXG Users</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>ADPRO XO Client → Users</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ul>
      <li>In the "Users" section, identify NXG users of the system and define their access rights</li>
      <li>We recommend granting Administrative rights; however, if that's not possible, User rights will also suffice</li>
    </ul>
    
    <img src={require('./images/ADPRO 16.png').default} alt="ADPRO Users Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> NXG user configured with appropriate access rights</p>
  </div>
</div>

## Step 10: Configure iFT Gateway (If Applicable)

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 10: Configure iFT Gateway (If Applicable)</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Device → Edit → Additional Settings → Custom Property</strong></p>
  </div>
  <div className="card__body">
    <div className="alert alert--warning">
      <strong>Note:</strong> This step only applies to ADPRO device sub-type [iFT] Gateway
    </div>
    
    <h4>Configuration Steps</h4>
    <ol>
      <li>Login into GCXONE using your credentials</li>
      <li>Navigate to your device then click on "edit"</li>
      <li>
        Go to "Additional Settings" then "Custom property" and add the following parameters:
        <ul style={{marginTop: '0.5rem'}}>
          <li><strong>Parameter type</strong>: String</li>
          <li><strong>Parameter name</strong>: eventClipRecord</li>
          <li><strong>Parameter value</strong>: True</li>
          <li><strong>Parameter type</strong>: String</li>
          <li><strong>Parameter name</strong>: eventClipRecordAlarmCode</li>
          <li><strong>Parameter Value</strong>: motion.perimeter</li>
        </ul>
      </li>
    </ol>
    
    <img src={require('./images/ADPRO 17.png').default} alt="GCXONE Login" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <img src={require('./images/ADPRO 18.png').default} alt="GCXONE Custom Properties" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> iFT Gateway configured with custom properties for event clip recording</p>
  </div>
</div>

## Step 11: Add Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 11: Add Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Customer → Site → Devices → Add Device</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Select <strong>ADPRO</strong></li>
      <li>Fill: <strong>Host/Serial, Username, Password, Ports, Time Zone</strong></li>
      <li>Click <strong>Discover</strong>. Review discovered sensors and I/O</li>
      <li>Click <strong>Save</strong></li>
    </ol>
    
    <div className="row" style={{marginTop: '1rem'}}>
      <div className="col col--6">
        <img src={require('./images/ADPRO 17.png').default} alt="Adding Device Step 1" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
      <div className="col col--6">
        <img src={require('./images/ADPRO 18.png').default} alt="Adding Device Step 2" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </div>
    </div>
    
    <img src={require('./images/ADPRO 19.png').default} alt="ADPRO Device Added" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> GCXONE lists sensors under the ADPRO device</p>
  </div>
</div>

## Step 12: Verify Integration

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <div className="card__header">
    <h3>Step 12: Verify Integration</h3>
  </div>
  <div className="card__body">
    <h4>Verification Checks</h4>
    <div className="row">
      <div className="col col--6">
        <ul>
          <li>✅ Verify alarm transmission is working (primary and secondary)</li>
          <li>✅ Test site pulse/lifecheck functionality</li>
          <li>✅ Confirm analytics are generating appropriate events</li>
        </ul>
      </div>
      <div className="col col--6">
        <ul>
          <li>✅ Test arm/disarm schedule functionality</li>
          <li>✅ Verify user access and permissions</li>
          <li>✅ Check time synchronization</li>
        </ul>
      </div>
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Complete ADPRO integration with GCXONE platform</p>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Common Issues and Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="alarm" label="Alarm Transmission Issues" default>
        <ul>
          <li>Verify unique server ID is configured</li>
          <li>Check IP addresses provided by NXG support team</li>
          <li>Confirm network connectivity to virtual receiver</li>
          <li>Test both primary and secondary transmission paths</li>
        </ul>
      </TabItem>

      <TabItem value="analytics" label="Analytics False Alarms">
        <ul>
          <li>Adjust sensitivity levels for detection zones</li>
          <li>Refine size and speed criteria for moving objects</li>
          <li>Review and modify detection zone boundaries</li>
        </ul>
      </TabItem>

      <TabItem value="scheduling" label="Scheduling Issues">
        <ul>
          <li>Verify time zone configuration matches customer location</li>
          <li>Confirm NTP synchronization is working</li>
          <li>Check arm/disarm schedule settings</li>
        </ul>
      </TabItem>

      <TabItem value="user-access" label="User Access Problems">
        <ul>
          <li>Verify NXG user has appropriate rights (Administrative preferred)</li>
          <li>Check user credentials and permissions</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Related Articles

- [ADPRO Overview](/docs/devices/adpro/overview)
- [ADPRO Supported Features](/docs/devices/adpro/supported-features)
- [ADPRO Troubleshooting](/docs/devices/adpro/troubleshooting)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're experiencing issues during configuration, check our [Troubleshooting Guide](/docs/devices/adpro/troubleshooting) or [contact support](/docs/support).
