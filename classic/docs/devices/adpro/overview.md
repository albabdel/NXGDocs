---
title: "ADPRO Overview"
description: "Complete guide for ADPRO device integration with GCXONE"
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
  - device:adpro
sidebar_position: 1
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ADPRO Overview

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      ADPRO (Honeywell) security control panels integrate seamlessly with GCXONE to provide comprehensive alarm monitoring, event management, and security automation capabilities.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🔐</div>
      <h3 style={{color: 'white', margin: 0}}>ADPRO</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Security Control Panel</p>
    </div>
  </div>
</div>

## Device Information

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__body">
    <table>
      <tbody>
        <tr>
          <td><strong>Device Type</strong></td>
          <td>Security Control Panel</td>
        </tr>
        <tr>
          <td><strong>Vendor</strong></td>
          <td>ADPRO (Honeywell)</td>
        </tr>
        <tr>
          <td><strong>Model</strong></td>
          <td>Various</td>
        </tr>
        <tr>
          <td><strong>Discovery Protocol</strong></td>
          <td>Custom ADPRO Protocol</td>
        </tr>
        <tr>
          <td><strong>Platform</strong></td>
          <td>GCXONE</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Summary

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #4F46E5', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎯</div>
      <h4>Purpose</h4>
      <p style={{fontSize: '0.85rem'}}>Configure ADPRO devices to successfully transmit alarms into the GCXONE platform</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
      <h4>Outcome</h4>
      <p style={{fontSize: '0.85rem'}}>Seamless alarm transmission and reliable connection with GCXONE for security monitoring</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👥</div>
      <h4>Audience</h4>
      <p style={{fontSize: '0.85rem'}}>Installers / Field engineers / Support</p>
    </div>
  </div>
</div>

## Device Profile

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h3>Key Characteristics</h3>
  
  <div className="row">
    <div className="col col--6">
      <h4>Event Types</h4>
      <ul>
        <li><strong>Intrusion</strong> - Unauthorized entry detection</li>
        <li><strong>Motion</strong> - Motion-based alerts</li>
        <li>
          <strong>Analytics</strong> - Advanced detection features
          <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
            <li>Intrusion Trace</li>
            <li>Loiter Trace</li>
            <li>Motion Sabotage</li>
          </ul>
        </li>
      </ul>
    </div>
    <div className="col col--6">
      <h4>Network Configuration</h4>
      <ul>
        <li><strong>Ports</strong> - Custom alarm transmission ports</li>
        <li><strong>Primary Receiver</strong> - Supported</li>
        <li><strong>Secondary Receiver</strong> - Supported (backup)</li>
        <li><strong>Site Pulse</strong> - Lifecheck monitoring</li>
      </ul>
    </div>
  </div>
</div>

<div className="alert alert--warning">
  <strong>Important Requirements:</strong>
  <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
    <li>Each device requires a <strong>unique Server Unit ID</strong> - cannot use the same value twice</li>
    <li>Dedicated virtual receiver IP address provided by NXGEN CMS team</li>
    <li><strong>iFT Gateway subtype</strong> requires additional custom properties in GCXONE</li>
  </ul>
</div>

## Supported Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #4F46E5'}}>
      <div className="card__header">
        <h3>✅ Core Functions</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Alarm Transmission</strong> - Primary and Secondary</li>
          <li><strong>Events</strong> - Analytics, Motion, Intrusion</li>
          <li><strong>ARM / DISARM</strong> - Schedule-based</li>
          <li><strong>Live View</strong> - Supported</li>
          <li><strong>User Management</strong> - Supported</li>
          <li><strong>Time Sync</strong> - NTP Supported</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>🔧 Advanced Features</h3>
      </div>
      <div className="card__body">
        <ul>
          <li><strong>Analytics Configuration</strong> - Intrusion Trace, Loiter Trace, Motion Sabotage</li>
          <li><strong>Arm/Disarm Schedule</strong> - Automated scheduling</li>
          <li><strong>Alarm Profiles</strong> - Customizable alarm responses</li>
          <li><strong>Input/Output Behavior</strong> - Event response configuration</li>
          <li><strong>Parallel Alarm Transmission</strong> - Optional additional transmission</li>
          <li><strong>Site Pulse Monitoring</strong> - Device health checks</li>
        </ul>
      </div>
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

## Quick Start

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h3>Getting Started</h3>
  <p>To configure ADPRO devices with GCXONE, follow these main steps:</p>
  <ol>
    <li><strong>Network Configuration</strong> - Set up connectivity to NXGEN's ADPRO virtual receiver</li>
    <li><strong>CMS Alarm Transmission</strong> - Configure primary and secondary alarm transmission</li>
    <li><strong>Analytics Setup</strong> - Configure intrusion detection and motion analytics</li>
    <li><strong>Device Registration</strong> - Add device in GCXONE platform</li>
  </ol>
  <p style={{marginTop: '1rem', marginBottom: 0}}>
    <strong>👉 For detailed step-by-step instructions, see the <a href="/docs/devices/adpro/installer-configuration">ADPRO Installer Configuration Guide</a></strong>
  </p>
</div>

## Related Articles

- [ADPRO Installer Configuration](/docs/devices/adpro/installer-configuration)
- [ADPRO Supported Features](/docs/devices/adpro/supported-features)
- [ADPRO Troubleshooting](/docs/devices/adpro/troubleshooting)
- [Firewall Configuration](/docs/getting-started/firewall-configuration)

---

## Need Help?

If you need assistance with ADPRO integration, check our [Troubleshooting Guide](/docs/devices/adpro/troubleshooting) or [contact support](/docs/support).
