---
title: "Microservices Architecture Explained"
description: "Understanding GCXONE's microservices architecture and how it enables universal device support and scalable operations"
tags:
  - role:admin
  - category:configuration
  - difficulty:advanced
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Microservices Architecture Explained

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      GCXONE employs a <strong>microservices architecture</strong> built on Kubernetes to provide scalable, resilient, and maintainable cloud services. This architecture enables the platform to support hundreds of device manufacturers while maintaining a unified interface and API.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>⚙️</div>
      <h3 style={{color: 'white', margin: 0}}>Microservices</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Scalable & Resilient</p>
    </div>
  </div>
</div>

## Architecture Benefits

<div className="row margin-bottom--lg">
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #6366F1', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🌐</div>
      <h4>Universal Support</h4>
      <p style={{fontSize: '0.85rem'}}>Specialized proxies handle device-specific protocols</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📈</div>
      <h4>Scalability</h4>
      <p style={{fontSize: '0.85rem'}}>Each service scales independently based on demand</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🛡️</div>
      <h4>Resilience</h4>
      <p style={{fontSize: '0.85rem'}}>Service failures are isolated and don't cascade</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #D946EF', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🚀</div>
      <h4>Rapid Development</h4>
      <p style={{fontSize: '0.85rem'}}>New device support without affecting core services</p>
    </div>
  </div>
</div>

![Microservices Architecture](/img/getting-started/key-benefits/key-benefits-page-8-img-1.png)

---

## The Universal Translator: Proxy Architecture

<div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{marginBottom: '1.5rem'}}>How Proxy Architecture Works</h2>
  
  ```mermaid
  graph TB
      subgraph "GCXONE Core"
          API["API Gateway
Standardized Interface"]
      end
      
      subgraph "Proxy Layer"
          HikProxy[Hikvision Proxy]
          DahuaProxy[Dahua Proxy]
          AxisProxy[Axis Proxy]
          OtherProxy[Other Proxies...]
      end
      
      subgraph "Device Layer"
          HikDev[Hikvision Devices]
          DahuaDev[Dahua Devices]
          AxisDev[Axis Devices]
          OtherDev[Other Devices...]
      end
      
      API -->|Standardized JSON| HikProxy
      API -->|Standardized JSON| DahuaProxy
      API -->|Standardized JSON| AxisProxy
      API -->|Standardized JSON| OtherProxy
      
      HikProxy -->|SDK/ISAPI| HikDev
      DahuaProxy -->|DoLynk/REST| DahuaDev
      AxisProxy -->|HTTP/Webhook| AxisDev
      OtherProxy -->|Various Protocols| OtherDev
      
      style API fill:#4F46E5,stroke:#fff,stroke-width:3px,color:#fff
      style HikProxy fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
      style DahuaProxy fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
      style AxisProxy fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
      style OtherProxy fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
  ```
  
  <p className="text--center" style={{marginTop: '1rem', color: 'var(--ifm-color-emphasis-700)'}}>
    Proxies act as "universal translators" between GCXONE's standardized API and device-specific protocols
  </p>
</div>

### Core Concept

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%'}}>
      <div className="card__header">
        <h3>🔌 Standardized Interface</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>GCXONE Core uses the same API for all proxies</li>
          <li>Consistent input signatures</li>
          <li>Unified output schemas</li>
          <li>Device complexity hidden from core</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{height: '100%'}}>
      <div className="card__header">
        <h3>🔄 Protocol Translation</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>Each proxy understands manufacturer protocols</li>
          <li>Translates between protocols and standards</li>
          <li>New devices = new proxy service</li>
          <li>No core system changes needed</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Communication Flow

<div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{marginBottom: '1.5rem'}}>Request Flow Through Microservices</h2>
  
  ```mermaid
  sequenceDiagram
      participant User as "👤 User
(Web/Mobile)"
      participant API as "🌐 GCXONE API
(Gateway)"
      participant Proxy as "⚙️ Device Proxy
(e.g., HikProxy)"
      participant Device as 📹 Physical Device

      User->>API: "1. Initiates Request
(e.g., PTZ Move)"
      Note over API: "2. Identifies request type
& device manufacturer"
      API->>API: "3. Consults proxy
endpoint dictionary"
      API->>Proxy: "4. HTTP Call
(Standardized JSON)"
      Note over Proxy: "5. Translates to native
protocol (SDK/ISAPI)"
      Proxy->>Device: "6. Native Command
(e.g., Move Right)"
      Device-->>Proxy: 7. Acknowledge/Result
      Proxy-->>API: 8. Standardized Response
      API-->>User: 9. Update UI
  ```
</div>

<Tabs>
  <TabItem value="step1" label="Step 1-3: Request Initiation" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #4F46E5', marginTop: '1rem'}}>
      <div className="card__body">
        <div className="row">
          <div className="col col--6">
            <h4>1. User Request</h4>
            <p>User initiates an action through web or mobile interface (e.g., PTZ control, live stream, playback).</p>
            <h4>2. API Gateway</h4>
            <p>Request goes to GCXONE API, the single entry point for all client requests.</p>
            <h4>3. Routing</h4>
            <p>API identifies the request type and device manufacturer, then consults a dictionary of proxy endpoints.</p>
          </div>
          <div className="col col--6">
            <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
              <h4>Example Endpoint Dictionary</h4>
              <pre style={{background: 'white', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.85rem'}}>
{`{
  "Hikvision": "hikproxy.nxgen.cloud",
  "Dahua": "dahuaproxy.nxgen.cloud",
  "Axis": "axisproxy.nxgen.cloud",
  "Hanwha": "hanwhaproxy.nxgen.cloud"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabItem>

  <TabItem value="step2" label="Step 4-6: Protocol Translation">
    <div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem'}}>
      <div className="card__body">
        <div className="row">
          <div className="col col--6">
            <h4>4. Proxy Call</h4>
            <p>API makes an HTTP call to the appropriate proxy with standardized JSON payload.</p>
            <h4>5. Protocol Translation</h4>
            <p>Proxy translates the standardized request to device-specific protocol (SDK, REST, TCP, etc.).</p>
            <h4>6. Device Communication</h4>
            <p>Proxy communicates with the physical device using the native protocol.</p>
          </div>
          <div className="col col--6">
            <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
              <h4>Translation Example</h4>
              <div style={{background: 'white', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.85rem'}}>
                <p><strong>Standardized Request:</strong></p>
                <code>{`{"action": "ptz_move", "direction": "right"}`}</code>
                <p style={{marginTop: '1rem'}}><strong>Hikvision Protocol:</strong></p>
                <code>ISAPI/PTZCtrl/channels/1/continuous</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabItem>

  <TabItem value="step3" label="Step 7-9: Response Handling">
    <div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem'}}>
      <div className="card__body">
        <div className="row">
          <div className="col col--6">
            <h4>7. Device Response</h4>
            <p>Device sends acknowledgment or result back to the proxy.</p>
            <h4>8. Response Translation</h4>
            <p>Proxy translates device response to standardized format.</p>
            <h4>9. UI Update</h4>
            <p>API receives standardized response and updates the user interface.</p>
          </div>
          <div className="col col--6">
            <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
              <h4>Benefits</h4>
              <ul style={{margin: 0, fontSize: '0.9rem'}}>
                <li>✅ Consistent API regardless of device</li>
                <li>✅ Device-specific logic isolated</li>
                <li>✅ Easy to add new device support</li>
                <li>✅ Fault isolation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabItem>
</Tabs>

## Device Protocol Support

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>📡 Supported Protocols</h3>
  </div>
  <div className="card__body">
    <table>
      <thead>
        <tr>
          <th>Protocol Type</th>
          <th>Usage Examples</th>
          <th>Device Examples</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>HTTP/REST/Open API</strong></td>
          <td>Device info, camera lists, PTZ control</td>
          <td>Hikvision, Hik-Connect Pro</td>
          <td>Not suitable for streaming</td>
        </tr>
        <tr>
          <td><strong>SDK</strong></td>
          <td>Live stream, playback, video files, two-way audio</td>
          <td>Hikvision (.NET HcNetSDK)</td>
          <td>Provides TCP layer for streaming</td>
        </tr>
        <tr>
          <td><strong>TCP/Native TCP</strong></td>
          <td>Legacy devices, alarm transmission</td>
          <td>ADPRO</td>
          <td>Event push via TCP</td>
        </tr>
        <tr>
          <td><strong>Webhooks/HTTP</strong></td>
          <td>Event transmission from IP cameras</td>
          <td>Axis, Hanwha</td>
          <td>HTTP requests to camera rules</td>
        </tr>
        <tr>
          <td><strong>WebSocket Subscription</strong></td>
          <td>Real-time event streaming</td>
          <td>Axxon</td>
          <td>Pulled by GCXONE via websocket</td>
        </tr>
        <tr>
          <td><strong>SIA DC-09</strong></td>
          <td>Alarm transmission</td>
          <td>Reconeyez</td>
          <td>Routed through Talos receiver</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Infrastructure & Scaling

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>☁️ Kubernetes Orchestration</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li><strong>Private EKS Clusters</strong>: 75% of logic on secure nodes</li>
        <li><strong>Containerized Services</strong>: All services in Docker containers</li>
        <li><strong>Service Mesh</strong>: Kubernetes networking</li>
        <li><strong>Load Balancing</strong>: Automatic load distribution</li>
        <li><strong>High Availability</strong>: Automatic failover</li>
      </ul>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>📈 Auto-Scaling (HPA)</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li><strong>Horizontal Scaling</strong>: Add pods, not vertical scaling</li>
        <li><strong>75% CPU Threshold</strong>: Triggers new pod creation</li>
        <li><strong>2-3 Minute Lead Time</strong>: Ensures pods ready before 100%</li>
        <li><strong>Service-Specific</strong>: Each service scales independently</li>
        <li><strong>Resource Efficiency</strong>: Scale only what's needed</li>
      </ul>
    </div>
  </div>
</div>

### Services Requiring Autoscaling

<div className="row margin-bottom--lg">
  <div className="col col--3">
    <div className="card shadow--md" style={{textAlign: 'center', padding: '1rem', borderTop: '4px solid #EF4444'}}>
      <div style={{fontSize: '2rem'}}>🧠</div>
      <h4>CVIDR</h4>
      <p style={{fontSize: '0.85rem'}}>AI engine for event detection and image processing</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{textAlign: 'center', padding: '1rem', borderTop: '4px solid #06B6D4'}}>
      <div style={{fontSize: '2rem'}}>📹</div>
      <h4>Streaming</h4>
      <p style={{fontSize: '0.85rem'}}>Video streaming and transcoding services</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{textAlign: 'center', padding: '1rem', borderTop: '4px solid #10B981'}}>
      <div style={{fontSize: '2rem'}}>⚙️</div>
      <h4>Proxies</h4>
      <p style={{fontSize: '0.85rem'}}>Device proxy services (e.g., Adpro proxy)</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{textAlign: 'center', padding: '1rem', borderTop: '4px solid #D946EF'}}>
      <div style={{fontSize: '2rem'}}>🔔</div>
      <h4>Events</h4>
      <p style={{fontSize: '0.85rem'}}>Alarm and event processing services</p>
    </div>
  </div>
</div>

## Microservices Components

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #4F46E5'}}>
      <div className="card__header">
        <h3>🌐 Core Services</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>API Gateway</strong>: Single entry point</li>
          <li><strong>Authentication</strong>: Auth0 integration</li>
          <li><strong>Device Management</strong>: Registration & monitoring</li>
          <li><strong>User Management</strong>: Accounts & permissions</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>⚙️ Proxy Services</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>Hikvision Proxy</strong>: SDK & ISAPI</li>
          <li><strong>Dahua Proxy</strong>: DoLynk & native</li>
          <li><strong>Axis Proxy</strong>: HTTP/Webhook</li>
          <li><strong>Other Proxies</strong>: Manufacturer-specific</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>🔧 Supporting Services</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>Streaming</strong>: Video & WebRTC</li>
          <li><strong>AI/ML (CVIDR)</strong>: Event detection</li>
          <li><strong>Messaging</strong>: MQTT routing</li>
          <li><strong>Storage</strong>: Video & snapshots</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Architecture Benefits

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>✅ Advantages</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li><strong>Scalability</strong>: Independent scaling per service</li>
        <li><strong>Resilience</strong>: Fault isolation prevents cascading failures</li>
        <li><strong>Maintainability</strong>: Isolated device-specific logic</li>
        <li><strong>Development Speed</strong>: Rapid feature addition</li>
        <li><strong>Technology Diversity</strong>: Different tech stacks per service</li>
      </ul>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>🎯 Best Practices</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li><strong>Single Responsibility</strong>: One clear purpose per service</li>
        <li><strong>API-First Design</strong>: Well-defined service APIs</li>
        <li><strong>Stateless Services</strong>: No session state</li>
        <li><strong>Circuit Breakers</strong>: Prevent cascading failures</li>
        <li><strong>Monitoring</strong>: Service-specific metrics</li>
      </ul>
    </div>
  </div>
</div>

## Related Articles

- [Proxy Architecture & Communication Flow](/docs/platform-fundamentals/proxy-architecture)
- [Cloud Architecture Overview](/docs/getting-started/cloud-architecture)
- [Multi-Tenant Architecture](/docs/platform-fundamentals/multi-tenant)
- [Hierarchy Model](/docs/platform-fundamentals/hierarchy-model)

---

## Need Help?

If you have questions about the microservices architecture or need technical assistance, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
