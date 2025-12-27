---
title: "Dahua Dolynk Cloud Setup"
description: "Step-by-step guide for configuring Dahua Dolynk devices through cloud service"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:dahua
sidebar_position: 2
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dahua Dolynk Cloud Setup

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Dahua Dolynk devices integrate with GCXONE through the Dolynk Care cloud service, enabling cloud-based device integration and Alarm Receiving Center (ARC) functionality.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>☁️</div>
      <h3 style={{color: 'white', margin: 0}}>Dolynk</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Cloud Integration</p>
    </div>
  </div>
</div>

## Overview

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h3>What is Dahua Dolynk?</h3>
  <p>Dahua Dolynk is a cloud-based service that enables remote device management and Alarm Receiving Center (ARC) functionality. Devices configured through Dolynk Care can be integrated with GCXONE for centralized monitoring and alarm management.</p>
  
  <div className="alert alert--info" style={{marginTop: '1rem'}}>
    <strong>Key Difference:</strong> Dolynk integration uses cloud service, while standard Dahua integration uses direct device connection. Choose Dolynk if you need cloud-based management and ARC functionality.
  </div>
</div>

## Prerequisites

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Information Required from Installer</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>Forward this data to the NXGEN team before configuration</p>
  </div>
  <div className="card__body">
    <ul>
      <li>✅ <strong>Serial Number</strong> of the device</li>
      <li>✅ <strong>Device Password</strong></li>
      <li>✅ <strong>User Name</strong></li>
      <li>✅ <strong>Ports</strong></li>
    </ul>
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important:</strong> Device must be online for discovery to work. Device must not be bound to another account.
    </div>
  </div>
</div>

## Step 1: Log in to Dolynk Care Account

<div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 1: Log in to Dolynk Care Account</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Log in to your Dolynk Care account through this URL: <a href="https://care.dolynkcloud.com/" target="_blank">https://care.dolynkcloud.com/</a></li>
    </ol>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Successfully logged into Dolynk Care portal</p>
  </div>
</div>

## Step 2: Add Site

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 2: Add Site</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Site → Add</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Go to <strong>Site</strong> and click on <strong>Add</strong></li>
    </ol>
    
    <img src={require('./images/Dolynk 1.png').default} alt="Dolynk Site Addition" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Site creation page opened</p>
  </div>
</div>

## Step 3: Fill Site Details

<div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 3: Fill Site Details</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ul>
      <li>Fill in the details of the site such as <strong>Timezone</strong> and <strong>Name</strong></li>
    </ul>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Site created in Dolynk Care</p>
  </div>
</div>

## Step 4: Add Device to Site

<div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 4: Add Device to Site</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Site → Add Device → Serial Number (SN)</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Click on the <strong>Site</strong> that was created, then click on <strong>Add Device</strong> through <strong>Serial Number (SN)</strong></li>
      <li>Fill in the details of the device</li>
    </ol>
    
    <img src={require('./images/Dolynk 2.png').default} alt="Dolynk Device Addition" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--warning" style={{marginTop: '1rem'}}>
      <strong>Important Note:</strong> Please ensure that the device is online before adding it to the site.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Device added to the site</p>
  </div>
</div>

## Step 5: Set up ARC and Share Device with NXGEN

<div className="card shadow--md" style={{borderLeft: '6px solid #F59E0B', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 5: Set up ARC and Share Device with NXGEN</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>Security Service</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Now that the device is added to your Dolynk Care account, we need to set up GCXONE as your ARC (Alarm Receiving Center) for that device by selecting the <strong>Security Service</strong> option</li>
    </ol>
    
    <img src={require('./images/Dolynk 3.png').default} alt="Dolynk Security Service" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Select Devices and Company</h4>
    <ol>
      <li>In the menu that shows, select the device/sensors you want to share with GCXONE then click on <strong>Next</strong></li>
      <li>In the <strong>Company Name/email</strong> field please use our email to search: <code>dev@nxgen.info</code></li>
      <li>Once that is done, you should see <strong>NXGEN Technology AG</strong>, click on the shield icon next to it</li>
    </ol>
    
    <img src={require('./images/Dolynk 4.png').default} alt="Dolynk ARC Selection" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <div className="alert alert--info" style={{marginTop: '1rem'}}>
      <strong>Note:</strong> Use <code>dev@nxgen.info</code> for company search in Dolynk Care to find NXGEN Technology AG.
    </div>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> NXGEN Technology AG selected as ARC</p>
  </div>
</div>

## Step 6: Apply and Save Configuration

<div className="card shadow--md" style={{borderLeft: '6px solid #EF4444', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 6: Apply and Save Configuration</h3>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Click on <strong>Apply</strong> to save and notify your ARC</li>
    </ol>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> ARC configuration saved and NXGEN notified</p>
  </div>
</div>

## Step 7: Configure Device in GCXONE

<div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>Step 7: Configure Device in GCXONE</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>UI path: <strong>GCXONE → Site → Configuration App → Devices</strong></p>
  </div>
  <div className="card__body">
    <h4>Configuration Steps</h4>
    <ol>
      <li>Go into the Site that you want to add the device to in GCXONE Configuration App</li>
      <li>Choose <strong>Dahua Cloud</strong> as your device</li>
      <li>Fill in the <strong>Serial Number, UserName, and Password</strong> of the device</li>
    </ol>
    
    <img src={require('./images/Dolynk 5.png').default} alt="Dolynk GCXONE Configuration" style={{maxWidth: '100%', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid var(--ifm-color-emphasis-300)'}} />
    
    <h4 style={{marginTop: '1.5rem'}}>Discover Sensors</h4>
    <ol>
      <li>Once the details are filled, click on <strong>Discover</strong></li>
      <li>You should see the sensors discovered</li>
    </ol>
    
    <p style={{marginTop: '1rem'}}><strong>Expected result:</strong> Sensors discovered successfully in GCXONE</p>
  </div>
</div>

## Important Notes

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginTop: '1rem', marginBottom: '2rem', padding: '2rem'}}>
  <h3>⚠️ Critical Requirements</h3>
  <ul>
    <li><strong>Device must be online</strong> for successful configuration</li>
    <li><strong>Device must not be bound</strong> to another account</li>
    <li>Use <code>dev@nxgen.info</code> for company search in Dolynk Care</li>
    <li>Ensure device is properly shared with NXGEN before attempting discovery in GCXONE</li>
  </ul>
</div>

## Related Articles

- [Dahua Overview](/docs/devices/dahua/overview)
- [Dahua Installer Configuration](/docs/devices/dahua/installer-configuration)
- [Dahua Troubleshooting](/docs/devices/dahua/troubleshooting)

---

## Need Help?

If you're experiencing issues with Dolynk configuration, check our [Troubleshooting Guide](/docs/devices/dahua/troubleshooting) or [contact support](/docs/support).
