---
title: "What is Evalink Talos?"
description: "Complete guide to understanding Evalink Talos - the cloud-based alarm management platform that works seamlessly with GCXONE"
tags:
  - role:all
  - category:overview
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 2
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# What is Evalink Talos?

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Evalink Talos is a sophisticated, cloud-based alarm management platform designed specifically for monitoring stations and security service providers. Built on Amazon Web Services (AWS) with global redundancy, Talos provides enterprise-grade reliability and scalability for managing security alarms across multiple sites and customers.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🚨</div>
      <h3 style={{color: 'white', margin: 0}}>Talos</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Alarm Management</p>
    </div>
  </div>
</div>

## Platform Overview

**Evalink Talos** is the alarm management component of the NXGEN ecosystem, working in perfect harmony with **GCXONE** to provide a complete security management solution. While GCXONE focuses on video analytics, device management, and AI-powered threat detection, Talos specializes in alarm workflows, operator interfaces, and dispatch management.

<div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{marginBottom: '1.5rem'}}>GCXONE + Talos Integration</h2>
  
  ```mermaid
  graph LR
      subgraph "🏢 Customer Site"
          Device["📹 Security Device<br/>(Camera/Sensor)"]
      end
      
      subgraph "☁️ NXGEN Cloud"
          GCXONE["🧠 GCXONE<br/>Video Analytics & AI"]
          Talos["🚨 Evalink Talos<br/>Alarm Management"]
      end
      
      subgraph "👥 Monitoring Station"
          Operator["👨‍💼 Security Operator"]
      end
      
      Device -->|"Raw Alarms"| GCXONE
      GCXONE -->|"AI-Verified Alarms"| Talos
      Talos -->|"Enriched Alerts"| Operator
      
      style Device fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
      style GCXONE fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
      style Talos fill:#8B5CF6,stroke:#fff,stroke-width:2px,color:#fff
      style Operator fill:#10B981,stroke:#fff,stroke-width:2px,color:#fff
  ```
</div>

## Core Capabilities

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #8B5CF6', height: '100%'}}>
      <div className="card__header">
        <h3>🚨 Alarm Processing</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Real-time alarm reception</li>
          <li>Intelligent alarm routing</li>
          <li>Priority-based queuing</li>
          <li>Automated workflows</li>
          <li>Escalation management</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>👥 Operator Interface</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Intuitive dashboard</li>
          <li>Multi-site management</li>
          <li>Real-time notifications</li>
          <li>Mobile accessibility</li>
          <li>Customizable workflows</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>📊 Reporting & Analytics</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Comprehensive reporting</li>
          <li>Performance metrics</li>
          <li>Compliance tracking</li>
          <li>Historical analysis</li>
          <li>Custom dashboards</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Architecture & Reliability

### Cloud-Native Design

Talos is built using modern **microservices architecture** on Amazon Web Services (AWS), ensuring:

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>🌐 Global Availability</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li>Multi-region deployment (US, Europe, Asia)</li>
        <li>99.9% uptime guarantee</li>
        <li>Automatic failover capabilities</li>
        <li>Load balancing across zones</li>
      </ul>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>⚡ Scalable Performance</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li>Auto-scaling based on demand</li>
        <li>Independent service updates</li>
        <li>Containerized microservices</li>
        <li>Real-time processing capabilities</li>
      </ul>
    </div>
  </div>
</div>

### Microservices Benefits

- **Independent Updates**: Each feature can be updated without affecting others
- **High Availability**: If one service has issues, others continue operating
- **Scalability**: Services scale independently based on demand
- **Reliability**: Distributed architecture prevents single points of failure

## Key Features in Detail

<Tabs>
  <TabItem value="sites" label="🏢 Site Management" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #8B5CF6', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Comprehensive Site Organization</h3>
      </div>
      <div className="card__body">
        <p>Talos provides flexible site management capabilities that adapt to your organizational structure:</p>
        
        <h4>Site Hierarchy</h4>
        <ul>
          <li><strong>Sites</strong>: Individual locations (buildings, facilities, areas)</li>
          <li><strong>Site Groups</strong>: Regional or functional groupings</li>
          <li><strong>Organizational Units</strong>: Company or division level</li>
          <li><strong>Service Companies</strong>: Third-party service providers</li>
        </ul>
        
        <h4>Site Status Management</h4>
        <ul>
          <li><strong>Active</strong>: Fully operational, accepts alarms, counts toward billing</li>
          <li><strong>Inactive</strong>: No alarm processing, no billing charges</li>
          <li><strong>Test Mode</strong>: Special handling for maintenance or testing</li>
        </ul>
        
        <div className="alert alert--info" style={{marginTop: '1rem'}}>
          <strong>Pro Tip:</strong> Create sites as "inactive" during setup to avoid billing charges until they're ready for production.
        </div>
      </div>
    </div>
  </TabItem>

  <TabItem value="alarms" label="🚨 Alarm Processing">
    <div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Intelligent Alarm Management</h3>
      </div>
      <div className="card__body">
        <p>Talos processes alarms through sophisticated workflows that ensure the right information reaches the right operator at the right time:</p>
        
        <h4>Alarm Lifecycle</h4>
        <ol>
          <li><strong>Reception</strong>: Alarms received from devices or GCXONE</li>
          <li><strong>Enrichment</strong>: AI analysis and metadata addition</li>
          <li><strong>Routing</strong>: Intelligent assignment to operators</li>
          <li><strong>Processing</strong>: Operator review and action</li>
          <li><strong>Resolution</strong>: Closure and documentation</li>
        </ol>
        
        <h4>Advanced Features</h4>
        <ul>
          <li><strong>Priority Queuing</strong>: Critical alarms processed first</li>
          <li><strong>Escalation Rules</strong>: Automatic escalation for unhandled alarms</li>
          <li><strong>Workflow Automation</strong>: Custom rules for alarm handling</li>
          <li><strong>Follow-up Alarms</strong>: AI-verified results from GCXONE</li>
        </ul>
      </div>
    </div>
  </TabItem>

  <TabItem value="operators" label="👥 Operator Experience">
    <div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Optimized Operator Interface</h3>
      </div>
      <div className="card__body">
        <p>Talos provides operators with an intuitive, efficient interface designed for high-stress security environments:</p>
        
        <h4>Dashboard Features</h4>
        <ul>
          <li><strong>Real-time Overview</strong>: Live alarm counts and status</li>
          <li><strong>Personal Queue</strong>: Alarms assigned to specific operators</li>
          <li><strong>Team Visibility</strong>: Workload distribution across team</li>
          <li><strong>Performance Metrics</strong>: Response times and resolution rates</li>
        </ul>
        
        <h4>Alarm Handling Tools</h4>
        <ul>
          <li><strong>One-Click Actions</strong>: Common responses with single clicks</li>
          <li><strong>Video Integration</strong>: Embedded GCXONE video streams</li>
          <li><strong>Contact Management</strong>: Quick access to customer contacts</li>
          <li><strong>Notes & Documentation</strong>: Detailed incident logging</li>
        </ul>
        
        <h4>Mobile Accessibility</h4>
        <ul>
          <li><strong>Responsive Design</strong>: Works on tablets and smartphones</li>
          <li><strong>Push Notifications</strong>: Critical alerts on mobile devices</li>
          <li><strong>Offline Capability</strong>: Basic functions work without internet</li>
        </ul>
      </div>
    </div>
  </TabItem>

  <TabItem value="integration" label="🔗 GCXONE Integration">
    <div className="card shadow--md" style={{borderLeft: '6px solid #D946EF', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Seamless GCXONE Integration</h3>
      </div>
      <div className="card__body">
        <p>The integration between Talos and GCXONE creates a powerful, unified security platform:</p>
        
        <h4>Automatic Synchronization</h4>
        <ul>
          <li><strong>Site Data</strong>: Sites created in GCXONE appear automatically in Talos</li>
          <li><strong>Device Status</strong>: Real-time device health monitoring</li>
          <li><strong>Contact Information</strong>: Customer details synchronized across platforms</li>
          <li><strong>Configuration</strong>: Settings changes propagate automatically</li>
        </ul>
        
        <h4>AI-Enhanced Alarms</h4>
        <ul>
          <li><strong>False Alarm Reduction</strong>: 80% reduction through AI verification</li>
          <li><strong>Bounding Boxes</strong>: Visual indicators of detected objects</li>
          <li><strong>Threat Classification</strong>: AI-powered threat assessment</li>
          <li><strong>Context Enrichment</strong>: Additional metadata for better decisions</li>
        </ul>
        
        <h4>Workflow Automation</h4>
        <ul>
          <li><strong>Test Mode Handling</strong>: Automatic disarming during maintenance</li>
          <li><strong>Overflow Protection</strong>: Prevents system overload</li>
          <li><strong>Health Monitoring</strong>: Proactive device maintenance alerts</li>
          <li><strong>Arm/Disarm Scheduling</strong>: Automated site security management</li>
        </ul>
      </div>
    </div>
  </TabItem>
</Tabs>

## Business Benefits

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>✅ Operational Efficiency</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>80% False Alarm Reduction</strong> through AI integration</li>
          <li><strong>Faster Response Times</strong> with enriched alarm data</li>
          <li><strong>Automated Workflows</strong> reduce manual tasks</li>
          <li><strong>Centralized Management</strong> for multiple sites</li>
          <li><strong>Mobile Access</strong> for field operations</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>💰 Cost Savings</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>No Infrastructure Costs</strong> - fully cloud-based</li>
          <li><strong>Reduced Operator Workload</strong> through automation</li>
          <li><strong>Lower False Alarm Costs</strong> with AI verification</li>
          <li><strong>Scalable Pricing</strong> - pay only for active sites</li>
          <li><strong>Reduced Training</strong> with intuitive interface</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Who Uses Talos?

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center', height: '100%'}}>
      <h3 style={{color: 'white'}}>🏢 Monitoring Stations</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem'}}>Central monitoring stations managing multiple customer sites and requiring professional alarm handling workflows.</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center', height: '100%'}}>
      <h3 style={{color: 'white'}}>🛡️ Security Providers</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem'}}>Security service companies offering managed security services to enterprise and commercial clients.</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1.5rem', textAlign: 'center', height: '100%'}}>
      <h3 style={{color: 'white'}}>🏭 Enterprise Security</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem'}}>Large organizations with multiple facilities requiring centralized security management and compliance.</p>
    </div>
  </div>
</div>

## Getting Started with Talos

<div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{marginBottom: '1.5rem'}}>Quick Start Steps</h2>
  
  <div className="row">
    <div className="col col--6">
      <h3>1. Account Setup</h3>
      <ul>
        <li>✅ Create Talos account or use existing</li>
        <li>✅ Configure organizational structure</li>
        <li>✅ Set up user roles and permissions</li>
        <li>✅ Configure notification preferences</li>
      </ul>
      
      <h3 style={{marginTop: '1.5rem'}}>2. Site Configuration</h3>
      <ul>
        <li>✅ Create sites in GCXONE (auto-sync to Talos)</li>
        <li>✅ Configure site groups and hierarchies</li>
        <li>✅ Set up custom fields and metadata</li>
        <li>✅ Configure alarm routing rules</li>
      </ul>
    </div>
    <div className="col col--6">
      <h3>3. Integration Setup</h3>
      <ul>
        <li>✅ Enable GCXONE-Talos integration</li>
        <li>✅ Configure alarm forwarding workflows</li>
        <li>✅ Set up AI filtering rules</li>
        <li>✅ Test alarm flow end-to-end</li>
      </ul>
      
      <h3 style={{marginTop: '1.5rem'}}>4. Operator Training</h3>
      <ul>
        <li>✅ Train operators on Talos interface</li>
        <li>✅ Configure personal dashboards</li>
        <li>✅ Set up mobile access</li>
        <li>✅ Practice alarm handling procedures</li>
      </ul>
    </div>
  </div>
</div>

## Technical Specifications

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>🔧 System Requirements & Capabilities</h3>
  </div>
  <div className="card__body">
    <div className="row">
      <div className="col col--6">
        <h4>Platform Specifications</h4>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Infrastructure</strong></td>
              <td>Amazon Web Services (AWS)</td>
            </tr>
            <tr>
              <td><strong>Architecture</strong></td>
              <td>Microservices, containerized</td>
            </tr>
            <tr>
              <td><strong>Availability</strong></td>
              <td>99.9% uptime SLA</td>
            </tr>
            <tr>
              <td><strong>Regions</strong></td>
              <td>US, Europe, Asia-Pacific</td>
            </tr>
            <tr>
              <td><strong>Scalability</strong></td>
              <td>Auto-scaling, unlimited sites</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col col--6">
        <h4>Access Requirements</h4>
        <table>
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Browser</strong></td>
              <td>Modern web browser (Chrome, Firefox, Safari, Edge)</td>
            </tr>
            <tr>
              <td><strong>Internet</strong></td>
              <td>Stable internet connection</td>
            </tr>
            <tr>
              <td><strong>Mobile</strong></td>
              <td>iOS/Android compatible</td>
            </tr>
            <tr>
              <td><strong>Ports</strong></td>
              <td>HTTPS (443) for web access</td>
            </tr>
            <tr>
              <td><strong>Authentication</strong></td>
              <td>Multi-factor authentication supported</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

## Comparison: Talos vs Traditional Systems

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>📊 Platform Comparison</h3>
  </div>
  <div className="card__body">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Evalink Talos</th>
          <th>Traditional CMS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Deployment</strong></td>
          <td>✅ Cloud-based, instant access</td>
          <td>❌ On-premise servers required</td>
        </tr>
        <tr>
          <td><strong>Scalability</strong></td>
          <td>✅ Unlimited, auto-scaling</td>
          <td>❌ Hardware-limited capacity</td>
        </tr>
        <tr>
          <td><strong>Updates</strong></td>
          <td>✅ Automatic, no downtime</td>
          <td>❌ Manual updates, downtime required</td>
        </tr>
        <tr>
          <td><strong>AI Integration</strong></td>
          <td>✅ Native GCXONE integration</td>
          <td>❌ Limited or no AI capabilities</td>
        </tr>
        <tr>
          <td><strong>Mobile Access</strong></td>
          <td>✅ Full mobile functionality</td>
          <td>❌ Limited or no mobile support</td>
        </tr>
        <tr>
          <td><strong>Maintenance</strong></td>
          <td>✅ Zero maintenance required</td>
          <td>❌ Regular IT maintenance needed</td>
        </tr>
        <tr>
          <td><strong>Disaster Recovery</strong></td>
          <td>✅ Built-in redundancy</td>
          <td>❌ Requires separate DR planning</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Related Articles

- [GCXONE & Talos Interaction](/docs/getting-started/gcxone-talos-interaction)
- [Getting to Know Evalink Talos - Complete Guide](/docs/getting-started/getting-to-know-evalink-talos)
- [Genesis Alarm Forwarding](/docs/getting-started/genesis-alarm-forwarding)
- [What is NXGEN GCXONE?](/docs/getting-started/what-is-nxgen-gcxone)
- [Key Benefits & Value Propositions](/docs/getting-started/key-benefits)

---

## Need Help?

If you have questions about Evalink Talos or need assistance with setup and configuration:

- 📖 Check our [Troubleshooting Guide](/docs/troubleshooting)
- 💬 Contact [Support](/docs/support)
- 📧 Email: support@nxgen.cloud
- 🌐 Visit [Evalink Documentation](https://documentation.evalink.io/)

---

*For comprehensive Evalink Talos documentation and advanced configuration options, visit the [official Evalink documentation portal](https://documentation.evalink.io/).*
