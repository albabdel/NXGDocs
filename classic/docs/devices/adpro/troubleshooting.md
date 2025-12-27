---
title: "ADPRO Troubleshooting"
description: "Common issues and solutions for ADPRO device integration"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:intermediate
  - platform:GCXONE
  - device:adpro
sidebar_position: 6
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ADPRO Troubleshooting

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide covers common issues encountered when configuring and operating ADPRO devices with GCXONE, along with step-by-step solutions.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🔧</div>
      <h3 style={{color: 'white', margin: 0}}>Troubleshooting</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Quick Solutions</p>
    </div>
  </div>
</div>

## Alarm Transmission Issues

<Tabs>
  <TabItem value="no-transmission" label="No Alarm Transmission" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>No Alarm Transmission</h3>
      </div>
      <div className="card__body">
        <h4>Symptoms</h4>
        <ul>
          <li>Alarms not appearing in GCXONE</li>
          <li>No communication between ADPRO and GCXONE</li>
          <li>Site pulse not working</li>
        </ul>
        
        <h4>Solutions</h4>
        <ol>
          <li>
            <strong>Verify Unique Server ID</strong>
            <ul>
              <li>Ensure each device has a unique Server Unit ID</li>
              <li>Check that the same ID is not used on multiple devices</li>
              <li>Server IDs must be unique across all ADPRO devices</li>
            </ul>
            <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 2.png" alt="ADPRO General Settings - Server Unit ID" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
          </li>
          <li>
            <strong>Check IP Addresses</strong>
            <ul>
              <li>Verify primary receiver IP address provided by NXG support team</li>
              <li>Confirm secondary receiver IP address if configured</li>
              <li>Test network connectivity to receiver IPs</li>
            </ul>
            <div className="row" style={{marginTop: '1rem'}}>
              <div className="col col--6">
                <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 3.png" alt="ADPRO Primary Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
              </div>
              <div className="col col--6">
                <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 4.png" alt="ADPRO Secondary Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
              </div>
            </div>
          </li>
          <li>
            <strong>Verify Network Connectivity</strong>
            <ul>
              <li>Test connection to virtual receiver</li>
              <li>Check firewall rules allow traffic to receiver</li>
              <li>Verify VPN connection if using VPN</li>
              <li>Confirm whitelisting is configured correctly</li>
            </ul>
            <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 1.png" alt="ADPRO CMS Alarm Transmission" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
          </li>
          <li>
            <strong>Test Transmission Paths</strong>
            <ul>
              <li>Test both primary and secondary transmission paths</li>
              <li>Verify site pulse/lifecheck is configured</li>
              <li>Check alarm profiles are properly configured</li>
            </ul>
            <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 5.png" alt="ADPRO Site Pulse Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
          </li>
        </ol>
      </div>
    </div>
  </TabItem>

  <TabItem value="partial-transmission" label="Partial Alarm Transmission">
    <div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Partial Alarm Transmission</h3>
      </div>
      <div className="card__body">
        <h4>Symptoms</h4>
        <ul>
          <li>Some alarms appear, others don't</li>
          <li>Intermittent alarm transmission</li>
          <li>Delayed alarm delivery</li>
        </ul>
        
        <h4>Solutions</h4>
        <ol>
          <li>
            <strong>Check Alarm Profiles</strong>
            <ul>
              <li>Verify alarm profiles are configured correctly</li>
              <li>Ensure profiles are active for current operational state</li>
              <li>Check that "Notify Surveillance Center" is enabled</li>
            </ul>
            <div className="row" style={{marginTop: '1rem'}}>
              <div className="col col--6">
                <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 10.png" alt="ADPRO Alarms Profile" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
              </div>
              <div className="col col--6">
                <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 11.png" alt="ADPRO Profile Settings" style={{maxWidth: '100%', borderRadius: '0.5rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
              </div>
            </div>
          </li>
          <li>
            <strong>Review Input/Output Behavior</strong>
            <ul>
              <li>Verify event responses are configured</li>
              <li>Check camera assignments are correct</li>
              <li>Ensure view styles are properly set</li>
            </ul>
          </li>
          <li>
            <strong>Network Issues</strong>
            <ul>
              <li>Check for network congestion</li>
              <li>Verify bandwidth is sufficient</li>
              <li>Test both primary and secondary paths</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </TabItem>

  <TabItem value="duplicate-ids" label="Duplicate Server IDs">
    <div className="card shadow--md" style={{borderLeft: '6px solid #DC2626', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Duplicate Server IDs</h3>
      </div>
      <div className="card__body">
        <h4>Symptoms</h4>
        <ul>
          <li>Alarm attribution conflicts</li>
              <li>Cannot identify which device triggered event</li>
              <li>Multiple devices showing same alarms</li>
        </ul>
        
        <h4>Solutions</h4>
        <ol>
          <li>
            <strong>Verify Server IDs</strong>
            <ul>
              <li>Check all ADPRO devices have unique Server Unit IDs</li>
              <li>Document Server IDs for each device</li>
              <li>Update any duplicate IDs immediately</li>
            </ul>
            <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 2.png" alt="ADPRO General Settings - Server Unit ID" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
          </li>
          <li>
            <strong>Update Configuration</strong>
            <ul>
              <li>Change duplicate Server IDs to unique values</li>
              <li>Restart ADPRO XO client after changes</li>
              <li>Verify changes are saved</li>
            </ul>
          </li>
        </ol>
        
        <div className="alert alert--warning" style={{marginTop: '1rem'}}>
          <strong>Critical:</strong> Each ADPRO device MUST have a unique Server Unit ID. Duplicate IDs will cause alarm attribution conflicts and make it impossible to identify which device triggered an event.
        </div>
      </div>
    </div>
  </TabItem>
</Tabs>

## Analytics Issues

<div className="card shadow--md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Analytics False Alarms</h3>
  </div>
  <div className="card__body">
    <h4>Symptoms</h4>
    <ul>
      <li>Too many false alarms from analytics</li>
      <li>Alarms triggered by non-threat objects</li>
      <li>Missing actual security events</li>
    </ul>
    
    <h4>Solutions</h4>
    <ol>
      <li>
        <strong>Adjust Sensitivity Levels</strong>
        <ul>
          <li>Reduce sensitivity for detection zones</li>
          <li>Fine-tune size and speed criteria for moving objects</li>
          <li>Test different sensitivity settings</li>
        </ul>
        <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 8.png" alt="ADPRO Detection Parameters" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </li>
      <li>
        <strong>Refine Detection Zones</strong>
        <ul>
          <li>Review and modify detection zone boundaries</li>
          <li>Exclude areas with frequent non-threat movement</li>
          <li>Focus zones on critical entry points</li>
        </ul>
      </li>
      <li>
        <strong>Configure Analytics Types</strong>
        <ul>
          <li>Use Intrusion Trace for entry point monitoring</li>
          <li>Configure Loiter Trace for restricted areas</li>
          <li>Set up Motion Sabotage for camera protection</li>
        </ul>
        <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 7.png" alt="ADPRO Analytics Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </li>
    </ol>
  </div>
</div>

## Scheduling Issues

<div className="card shadow--md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Arm/Disarm Schedule Problems</h3>
  </div>
  <div className="card__body">
    <h4>Symptoms</h4>
    <ul>
      <li>System not arming/disarming at scheduled times</li>
      <li>Incorrect time-based behavior</li>
      <li>Schedule not saving properly</li>
    </ul>
    
    <h4>Solutions</h4>
    <ol>
      <li>
        <strong>Verify Time Zone Configuration</strong>
        <ul>
          <li>Ensure time zone matches customer location</li>
          <li>Check DST settings if applicable</li>
          <li>Verify time zone is correctly set in ADPRO XO client</li>
        </ul>
        <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 15.png" alt="ADPRO Time Zone Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </li>
      <li>
        <strong>Check NTP Synchronization</strong>
        <ul>
          <li>Confirm NTP server is reachable</li>
          <li>Verify NTP synchronization is working</li>
          <li>Check device time matches GCXONE time</li>
        </ul>
      </li>
      <li>
        <strong>Review Schedule Settings</strong>
        <ul>
          <li>Verify arm/disarm schedule is properly configured</li>
          <li>Check schedule times are correct</li>
          <li>Ensure schedule is saved and active</li>
        </ul>
        <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 9.png" alt="ADPRO Arm/Disarm Schedule" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </li>
    </ol>
  </div>
</div>

## User Access Problems

<div className="card shadow--md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>User Access Issues</h3>
  </div>
  <div className="card__body">
    <h4>Symptoms</h4>
    <ul>
      <li>NXG user cannot access device</li>
      <li>Insufficient permissions for operations</li>
      <li>User credentials not working</li>
    </ul>
    
    <h4>Solutions</h4>
    <ol>
      <li>
        <strong>Verify User Rights</strong>
        <ul>
          <li>Check NXG user has appropriate rights (Administrative preferred)</li>
          <li>Verify User rights if Administrative is not possible</li>
          <li>Confirm user account is active</li>
        </ul>
        <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 16.png" alt="ADPRO Users Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </li>
      <li>
        <strong>Check User Credentials</strong>
        <ul>
          <li>Verify username and password are correct</li>
          <li>Test credentials in ADPRO XO client</li>
          <li>Reset password if necessary</li>
        </ul>
      </li>
      <li>
        <strong>Review Permissions</strong>
        <ul>
          <li>Ensure all required permissions are granted</li>
          <li>Check camera-specific permissions if applicable</li>
          <li>Verify permissions match GCXONE requirements</li>
        </ul>
      </li>
    </ol>
  </div>
</div>

## iFT Gateway Issues

<div className="card shadow--md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>iFT Gateway Configuration Problems</h3>
  </div>
  <div className="card__body">
    <h4>Symptoms</h4>
    <ul>
      <li>Event clips not recording</li>
      <li>Custom properties not working</li>
      <li>iFT Gateway not functioning properly</li>
    </ul>
    
    <h4>Solutions</h4>
    <ol>
      <li>
        <strong>Verify Custom Properties</strong>
        <ul>
          <li>Check eventClipRecord is set to "True"</li>
          <li>Verify eventClipRecordAlarmCode is set to "motion.perimeter"</li>
          <li>Ensure custom properties are saved in GCXONE</li>
        </ul>
        <img src="/docs/getting-started/devices/ADPRO/images/ADPRO 18.png" alt="GC-X-ONE Custom Properties" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
      </li>
      <li>
        <strong>Check Device Subtype</strong>
        <ul>
          <li>Confirm device is actually iFT Gateway subtype</li>
          <li>Verify device model supports iFT Gateway features</li>
        </ul>
      </li>
      <li>
        <strong>Review GCXONE Configuration</strong>
        <ul>
          <li>Navigate to Device → Edit → Additional Settings → Custom Property</li>
          <li>Verify all custom properties are correctly configured</li>
          <li>Save changes and restart device if necessary</li>
        </ul>
      </li>
    </ol>
  </div>
</div>

## Quick Reference

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>✅ Common Fixes</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Verify unique Server Unit ID</li>
          <li>Check IP addresses from NXG support</li>
          <li>Test network connectivity</li>
          <li>Verify time zone and NTP</li>
          <li>Check user permissions</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #EF4444'}}>
      <div className="card__header">
        <h3>❌ Common Mistakes</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Using duplicate Server IDs</li>
          <li>Incorrect IP addresses</li>
          <li>Missing site pulse configuration</li>
          <li>Wrong time zone settings</li>
          <li>Insufficient user permissions</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Related Articles

- [ADPRO Overview](/docs/devices/adpro/overview)
- [ADPRO Installer Configuration](/docs/devices/adpro/installer-configuration)
- [ADPRO Supported Features](/docs/devices/adpro/supported-features)
- [Device Registration](/docs/installer-guide/device-registration)

---

## Need Help?

If you're still experiencing issues after trying these solutions, check our [General Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
