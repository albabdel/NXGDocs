---
title: "Firewall Configuration Guide"
description: "Complete guide for configuring firewalls to allow GCXONE connectivity and ensure secure communication"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 8
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Firewall Configuration Guide

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Proper firewall configuration is essential for GCXONE to communicate with your devices and provide full platform functionality. This guide covers all aspects of firewall configuration, including IP whitelisting, port requirements, and security best practices.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🔥</div>
      <h3 style={{color: 'white', margin: 0}}>Firewall</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Secure Configuration</p>
    </div>
  </div>
</div>

## Quick Checklist

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #EF4444', height: '100%'}}>
      <div className="card__header">
        <h3>✅ Mandatory IPs</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Primary Gateway: 18.185.17.113</li>
          <li>Secondary Gateway: 3.124.50.242</li>
          <li>Streaming Gateways (3 IPs)</li>
          <li>Messaging Services: 3.127.50.212</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>🔌 Required Ports</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>HTTP/HTTPS: 80, 443</li>
          <li>RTSP: 554</li>
          <li>WebRTC: 10001-10500</li>
          <li>Messaging: 5671, 5672</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>🌐 Domains</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>*.nxgen.cloud</li>
          <li>Auth0 domains</li>
          <li>AWS S3 domains</li>
          <li>Twilio domains</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Network Architecture

<div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{marginBottom: '1.5rem'}}>Network Flow Diagram</h2>
  
  ```mermaid
  graph LR
      subgraph "🏢 Customer Site"
          Device["📹 Device
(Camera/NVR)"]
          Firewall["🔥 Firewall"]
      end

      subgraph "🌐 Internet"
          Internet["Public Internet"]
      end

      subgraph "☁️ NXGEN Cloud"
          Gateway["🌐 GCXONE Gateways
Primary/Secondary"]
          Streaming["📹 Streaming Servers"]
          Services["⚙️ Platform Services"]
      end

      Device -->|"Device Traffic"| Firewall
      Firewall -->|"Whitelisted IPs
Ports 80/443/554/10001-10500"| Internet
      Internet --> Gateway
      Internet --> Streaming
      Internet --> Services
      Gateway --> Services
      Streaming --> Services
      
      style Device fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
      style Firewall fill:#EF4444,stroke:#fff,stroke-width:2px,color:#fff
      style Gateway fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
      style Streaming fill:#10B981,stroke:#fff,stroke-width:2px,color:#fff
      style Services fill:#8B5CF6,stroke:#fff,stroke-width:2px,color:#fff
  ```
</div>

## Mandatory IP Addresses

<div className="alert alert--warning" style={{marginBottom: '2rem'}}>
  <strong>Critical:</strong> These IP addresses are mandatory for all installations. Without whitelisting these IPs, GCXONE cannot communicate with your devices.
</div>

<Tabs>
  <TabItem value="gateways" label="🌐 Primary Gateways" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #4F46E5', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Primary & Secondary Gateways</h3>
      </div>
      <div className="card__body">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>IP Address</th>
              <th>Description</th>
              <th>Ports</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>GCXONE Gateway (Primary)</strong></td>
              <td><code>18.185.17.113</code></td>
              <td>Primary platform communication gateway</td>
              <td>80, 443, 10001-10500</td>
            </tr>
            <tr>
              <td><strong>GCXONE Gateway (Secondary)</strong></td>
              <td><code>3.124.50.242</code></td>
              <td>Secondary/backup gateway</td>
              <td>80, 443, 10001-10500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </TabItem>

  <TabItem value="streaming" label="📹 Streaming Gateways">
    <div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Video Streaming Servers</h3>
      </div>
      <div className="card__body">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>IP Address</th>
              <th>Description</th>
              <th>Ports</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Streaming Gateway (Primary)</strong></td>
              <td><code>3.126.237.150</code></td>
              <td>Primary video streaming server</td>
              <td>10001-10500 (UDP/TCP)</td>
            </tr>
            <tr>
              <td><strong>Streaming Gateway (Secondary 1)</strong></td>
              <td><code>3.75.73.51</code></td>
              <td>Secondary streaming server</td>
              <td>10001-10500 (UDP/TCP)</td>
            </tr>
            <tr>
              <td><strong>Streaming Gateway (Secondary 2)</strong></td>
              <td><code>18.156.39.63</code></td>
              <td>Additional streaming server</td>
              <td>10001-10500 (UDP/TCP)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </TabItem>

  <TabItem value="messaging" label="💬 Messaging Services">
    <div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Messaging & Event Delivery</h3>
      </div>
      <div className="card__body">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>IP Address</th>
              <th>Description</th>
              <th>Ports</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Messaging Services</strong></td>
              <td><code>3.127.50.212</code></td>
              <td>Core messaging and event delivery</td>
              <td>443, 5671, 5672</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </TabItem>
</Tabs>

## Device-Specific Gateways

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>📱 Manufacturer-Specific IPs</h3>
    <p style={{margin: '0.5rem 0 0 0', color: 'var(--ifm-color-emphasis-600)'}}>Only whitelist IPs for devices you actually use</p>
  </div>
  <div className="card__body">
    <table>
      <thead>
        <tr>
          <th>Manufacturer</th>
          <th>IP Address</th>
          <th>Role</th>
          <th>Ports</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Camect</strong></td>
          <td><code>3.122.169.231</code></td>
          <td>Camect Alarm Receiver</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Dahua</strong></td>
          <td><code>52.59.60.20</code></td>
          <td>Dahua Alarm Receiver</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Hikvision</strong></td>
          <td><code>35.156.60.98</code></td>
          <td>Hikvision Alarm Receiver</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Hanwha</strong></td>
          <td><code>18.184.110.24</code></td>
          <td>Hanwha Alarm Receiver</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Milestone</strong></td>
          <td><code>3.66.98.181</code></td>
          <td>Milestone Alarm Receiver</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Uniview</strong></td>
          <td><code>18.158.140.99</code></td>
          <td>Uniview Alarm Receiver</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Heitel (Live)</strong></td>
          <td><code>3.123.206.197</code></td>
          <td>Heitel Gateway 1 - Live Video</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>Heitel (Events)</strong></td>
          <td><code>3.124.38.48</code></td>
          <td>Heitel Gateway 2 - Events</td>
          <td>443, 554</td>
        </tr>
        <tr>
          <td><strong>ADPRO</strong></td>
          <td><em>Contact Support</em></td>
          <td>ADPRO Alarm Receiver</td>
          <td>10000 (TCP)</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Required Ports & Protocols

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #4F46E5', height: '100%'}}>
      <div className="card__header">
        <h3>🔌 Core Platform Ports</h3>
      </div>
      <div className="card__body">
        <table style={{fontSize: '0.9rem'}}>
          <thead>
            <tr>
              <th>Port</th>
              <th>Protocol</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>80</strong></td>
              <td>HTTP</td>
              <td>Web redirects, initial connections</td>
            </tr>
            <tr>
              <td><strong>443</strong></td>
              <td>HTTPS/WSS</td>
              <td>Secured web, API, WebSockets</td>
            </tr>
            <tr>
              <td><strong>554</strong></td>
              <td>RTSP</td>
              <td>Video streaming (fallback)</td>
            </tr>
            <tr>
              <td><strong>10001-10500</strong></td>
              <td>UDP/TCP</td>
              <td>WebRTC video streaming</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>💬 Additional Ports</h3>
      </div>
      <div className="card__body">
        <table style={{fontSize: '0.9rem'}}>
          <thead>
            <tr>
              <th>Port</th>
              <th>Protocol</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>5671</strong></td>
              <td>AMQPS</td>
              <td>Secure messaging (TLS)</td>
            </tr>
            <tr>
              <td><strong>5672</strong></td>
              <td>AMQP</td>
              <td>Messaging (if TLS not required)</td>
            </tr>
            <tr>
              <td><strong>10000</strong></td>
              <td>TCP</td>
              <td>ADPRO alarm transmission</td>
            </tr>
          </tbody>
        </table>
        <div className="alert alert--info" style={{marginTop: '1rem'}}>
          <strong>Note:</strong> The large port range (10001-10500) is necessary for WebRTC, which uses dynamic port allocation for optimal performance.
        </div>
      </div>
    </div>
  </div>
</div>

## Step-by-Step Configuration

<div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{marginBottom: '1.5rem'}}>Configuration Checklist</h2>
  
  <div className="row">
    <div className="col col--6">
      <h3>Step 1: Identify Your Devices</h3>
      <ul>
        <li>✅ List all devices needing GCXONE connectivity</li>
        <li>✅ Identify device manufacturers</li>
        <li>✅ Note special requirements (ADPRO, Talos, etc.)</li>
      </ul>
      
      <h3 style={{marginTop: '1.5rem'}}>Step 2: Configure IP Whitelisting</h3>
      <ul>
        <li>✅ Access firewall administration interface</li>
        <li>✅ Create firewall rules for each required IP</li>
        <li>✅ Set direction: outbound from devices</li>
        <li>✅ Specify ports: 80, 443, 554, 10001-10500</li>
        <li>✅ Save and apply firewall rules</li>
      </ul>
    </div>
    <div className="col col--6">
      <h3>Step 3: Configure Port Forwarding</h3>
      <ul>
        <li>✅ Identify device internal IP addresses</li>
        <li>✅ Forward required ports to device IPs</li>
        <li>✅ Test connectivity</li>
      </ul>
      
      <h3 style={{marginTop: '1.5rem'}}>Step 4: Configure Domain Whitelisting</h3>
      <ul>
        <li>✅ Access DNS/proxy settings</li>
        <li>✅ Whitelist required domains</li>
        <li>✅ Test DNS resolution</li>
      </ul>
      
      <h3 style={{marginTop: '1.5rem'}}>Step 5: Test Connectivity</h3>
      <ul>
        <li>✅ Register device in GCXONE</li>
        <li>✅ Test live stream</li>
        <li>✅ Trigger test alarm</li>
        <li>✅ Access web interface</li>
      </ul>
    </div>
  </div>
</div>

## Security Best Practices

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #EF4444', height: '100%'}}>
      <div className="card__header">
        <h3>🔒 Least Privilege</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Whitelist only required IPs</li>
          <li>Allow only required ports</li>
          <li>Regular rule audits</li>
          <li>Remove unused rules</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>🌐 Network Segmentation</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Isolate security devices</li>
          <li>Separate management networks</li>
          <li>Consider DMZ configuration</li>
          <li>VLAN separation</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>📊 Monitoring</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Enable connection logging</li>
          <li>Monitor failed attempts</li>
          <li>Regular log reviews</li>
          <li>Maintain audit trails</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Troubleshooting

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>🔧 Common Issues & Solutions</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="devices" label="Devices Not Connecting" default>
        <ul>
          <li><strong>Check IP Whitelisting:</strong> Verify mandatory IPs are whitelisted</li>
          <li><strong>Verify Ports:</strong> Ensure required ports are open</li>
          <li><strong>Test Connectivity:</strong> Use ping/telnet to test connections</li>
          <li><strong>Check Firewall Logs:</strong> Review logs for blocked connections</li>
        </ul>
      </TabItem>
      <TabItem value="streaming" label="Video Streaming Issues">
        <ul>
          <li><strong>Verify WebRTC Ports:</strong> Ensure ports 10001-10500 are open</li>
          <li><strong>Check Streaming Gateways:</strong> Verify streaming gateway IPs whitelisted</li>
          <li><strong>Test RTSP:</strong> Try RTSP (port 554) as fallback</li>
          <li><strong>Bandwidth Check:</strong> Verify sufficient bandwidth available</li>
        </ul>
      </TabItem>
      <TabItem value="alarms" label="Alarms Not Received">
        <ul>
          <li><strong>Device-Specific IPs:</strong> Verify device-specific gateway IPs whitelisted</li>
          <li><strong>Port Configuration:</strong> Check alarm transmission ports</li>
          <li><strong>Device Configuration:</strong> Verify device alarm settings</li>
          <li><strong>Network Path:</strong> Test network path to alarm receivers</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Diagnostic Tools

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>🛠️ Testing Commands</h3>
  </div>
  <div className="card__body">
    <div className="row">
      <div className="col col--4">
        <h4>Ping Test</h4>
        <pre style={{background: 'var(--ifm-color-emphasis-100)', padding: '1rem', borderRadius: '0.5rem'}}>
{`ping 18.185.17.113
ping 3.124.50.242`}
        </pre>
      </div>
      <div className="col col--4">
        <h4>Port Test (Telnet)</h4>
        <pre style={{background: 'var(--ifm-color-emphasis-100)', padding: '1rem', borderRadius: '0.5rem'}}>
{`telnet 18.185.17.113 443
telnet 3.126.237.150 10001`}
        </pre>
      </div>
      <div className="col col--4">
        <h4>DNS Test</h4>
        <pre style={{background: 'var(--ifm-color-emphasis-100)', padding: '1rem', borderRadius: '0.5rem'}}>
{`nslookup api.nxgen.cloud
nslookup nxgen.eu.auth0.com`}
        </pre>
      </div>
    </div>
  </div>
</div>

## Related Articles

- [IP Whitelisting Guide](/docs/getting-started/ip-whitelisting)
- [Required Ports & Endpoints](/docs/getting-started/required-ports)
- [Bandwidth Requirements](/docs/getting-started/bandwidth-requirements)
- [Quick Start Checklist](/docs/getting-started/quick-start-checklist)

---

## Need Help?

If you're experiencing firewall configuration issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support). For custom port-forwarding requirements, visit our [HelpDesk](https://helpdesk.nxgen.io/portal/en/kb/articles/ipwhitelist).
