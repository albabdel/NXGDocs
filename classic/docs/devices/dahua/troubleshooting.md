---
title: "Dahua Troubleshooting"
description: "Common issues and solutions for Dahua device integration"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:intermediate
  - platform:GCXONE
  - device:dahua
sidebar_position: 6
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dahua Troubleshooting

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      This guide covers common issues encountered when configuring and operating Dahua devices with GCXONE, along with step-by-step solutions.
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

## Event Transmission Issues

<Tabs>
  <TabItem value="no-events" label="No Events in Video Activity" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>No Events Appearing in GCXONE</h3>
      </div>
      <div className="card__body">
        <h4>Symptoms</h4>
        <ul>
          <li>Events not appearing in Video Activity</li>
          <li>Alarms not being received</li>
          <li>Event clips not generated</li>
        </ul>
        
        <h4>Solutions</h4>
        <ol>
          <li>
            <strong>Verify Report Alarm is Enabled</strong>
            <ul>
              <li>Recheck <strong>More → Log → Report Alarm</strong> is enabled</li>
              <li>This is critical for GCXONE to receive events</li>
              <li>Save configuration after enabling</li>
            </ul>
          </li>
          <li>
            <strong>Check IVS Rule Status</strong>
            <ul>
              <li>Confirm IVS rule is armed and scheduled for current time</li>
              <li>Verify rule is active and not disabled</li>
              <li>Test rule by triggering event manually if possible</li>
            </ul>
          </li>
          <li>
            <strong>Verify Time Synchronization</strong>
            <ul>
              <li>Check time sync/NTP is working</li>
              <li>Ensure device time matches GCXONE time</li>
              <li>Verify time zone settings are correct</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </TabItem>

  <TabItem value="too-many-alerts" label="Too Many Alerts">
    <div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Excessive Alerts</h3>
      </div>
      <div className="card__body">
        <h4>Symptoms</h4>
        <ul>
          <li>Too many false alarms</li>
          <li>Alerts flooding the system</li>
          <li>Performance issues due to alert volume</li>
        </ul>
        
        <h4>Solutions</h4>
        <ol>
          <li>
            <strong>Tighten IVS Zones</strong>
            <ul>
              <li>Refine detection zones to focus on critical areas</li>
              <li>Exclude areas with frequent non-threat movement</li>
              <li>Adjust zone boundaries to reduce false positives</li>
            </ul>
          </li>
          <li>
            <strong>Avoid Generic Motion</strong>
            <ul>
              <li>Disable Motion Detection if possible</li>
              <li>Use IVS (Tripwire/Intrusion) instead</li>
              <li>If Motion is required, tune Sensitivity ~70 and Threshold 5</li>
              <li>Avoid noisy areas for Motion Detection</li>
            </ul>
          </li>
          <li>
            <strong>Adjust Detection Parameters</strong>
            <ul>
              <li>Fine-tune sensitivity levels</li>
              <li>Adjust effective target settings (Human, Motor Vehicle)</li>
              <li>Review tracking duration settings</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </TabItem>
</Tabs>

## Discovery Issues

<div className="card shadow--md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Device Discovery Failures</h3>
  </div>
  <div className="card__body">
    <h4>Symptoms</h4>
    <ul>
      <li>Device not discovered in GCXONE</li>
      <li>Discovery process fails</li>
      <li>Sensors not appearing</li>
    </ul>
    
    <h4>Solutions</h4>
    <ol>
      <li>
        <strong>Verify Credentials</strong>
        <ul>
          <li>Check username and password are correct</li>
          <li>Use the dedicated NXG user created in Step 1</li>
          <li>Test credentials in Dahua web interface</li>
        </ul>
      </li>
      <li>
        <strong>Check Role Permissions</strong>
        <ul>
          <li>Verify user has required permissions (Manual control, System, Camera, System info, Event)</li>
          <li>Ensure Search and Live permissions are granted for cameras</li>
          <li>Check camera-specific permissions are applied</li>
        </ul>
      </li>
      <li>
        <strong>Verify Network Connectivity</strong>
        <ul>
          <li>Check ports (80/443/554/HTTP API) are open</li>
          <li>Test device reachability from GCXONE</li>
          <li>Verify correct VLAN configuration</li>
          <li>Check IP allowlist if site uses whitelisting</li>
        </ul>
      </li>
      <li>
        <strong>Try Different Protocols</strong>
        <ul>
          <li>Try HTTP vs HTTPS based on site policy</li>
          <li>Test ONVIF discovery if proprietary fails</li>
          <li>Verify protocol settings match device configuration</li>
        </ul>
      </li>
    </ol>
  </div>
</div>

## Live View Issues

<div className="card shadow--md" style={{marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Live View Stuttering</h3>
  </div>
  <div className="card__body">
    <h4>Symptoms</h4>
    <ul>
      <li>Live view stutters or freezes</li>
      <li>Poor video quality</li>
      <li>Buffering issues</li>
    </ul>
    
    <h4>Solutions</h4>
    <ol>
      <li>
        <strong>Lower Substream Bitrate/FPS</strong>
        <ul>
          <li>Reduce substream bitrate to decrease bandwidth usage</li>
          <li>Lower frame rate if necessary</li>
          <li>Adjust resolution if bandwidth is limited</li>
        </ul>
      </li>
      <li>
        <strong>Confirm Dual-Stream Profile</strong>
        <ul>
          <li>Verify dual-stream is properly configured</li>
          <li>Check main stream and substream profiles</li>
          <li>Ensure GCXONE is using appropriate stream</li>
        </ul>
      </li>
      <li>
        <strong>Check Network Bandwidth</strong>
        <ul>
          <li>Verify sufficient bandwidth is available</li>
          <li>Check for network congestion</li>
          <li>Review bandwidth requirements for your setup</li>
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
          <li>Enable Log → Report Alarm</li>
          <li>Verify IVS rules are armed and scheduled</li>
          <li>Check time sync/NTP</li>
          <li>Verify credentials and permissions</li>
          <li>Test network connectivity</li>
          <li>Use IVS instead of Motion Detection</li>
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
          <li>Not enabling Report Alarm</li>
          <li>Using Motion Detection instead of IVS</li>
          <li>Incorrect credentials or permissions</li>
          <li>Network connectivity issues</li>
          <li>Time zone mismatch</li>
          <li>Using admin account instead of dedicated user</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Related Articles

- [Dahua Overview](/docs/devices/dahua/overview)
- [Dahua Installer Configuration](/docs/devices/dahua/installer-configuration)
- [Dahua Dolynk Setup](/docs/devices/dahua/dolynk-setup)
- [Dahua Supported Features](/docs/devices/dahua/supported-features)

---

## Need Help?

If you're still experiencing issues after trying these solutions, check our [General Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
