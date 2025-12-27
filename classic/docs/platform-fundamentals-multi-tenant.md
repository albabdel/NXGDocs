---
id: "platform-fundamentals-multi-tenant"
title: "Multi-Tenant Architecture"
slug: "platform-fundamentals-multi-tenant"
description: "Understanding how GCXONE's multi-tenant architecture ensures data isolation, security, and scalability"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multi-Tenant Architecture

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      GCXONE employs a sophisticated <strong>multi-tenant architecture</strong> that enables multiple organizations to use the same cloud infrastructure while maintaining complete data isolation, security, and independent configuration.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🏢</div>
      <h3 style={{color: 'white', margin: 0}}>Multi-Tenant</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Complete Isolation</p>
    </div>
  </div>
</div>

## Architecture Overview

<div className="row margin-bottom--lg">
  <div className="col col--12">
    <div className="card shadow--lg" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', padding: '2rem'}}>
      <h2 className="text--center" style={{marginBottom: '2rem'}}>How Multi-Tenancy Works</h2>
      
      ```mermaid
      graph TB
          subgraph "Shared Cloud Infrastructure"
              subgraph "Tenant A"
                  TA1[Tenant A<br/>Data]
                  TA2[Tenant A<br/>Config]
                  TA3[Tenant A<br/>Users]
              end
              subgraph "Tenant B"
                  TB1[Tenant B<br/>Data]
                  TB2[Tenant B<br/>Config]
                  TB3[Tenant B<br/>Users]
              end
              subgraph "Tenant C"
                  TC1[Tenant C<br/>Data]
                  TC2[Tenant C<br/>Config]
                  TC3[Tenant C<br/>Users]
              end
          end
          
          style TA1 fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
          style TA2 fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
          style TA3 fill:#4F46E5,stroke:#fff,stroke-width:2px,color:#fff
          style TB1 fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
          style TB2 fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
          style TB3 fill:#06B6D4,stroke:#fff,stroke-width:2px,color:#fff
          style TC1 fill:#10B981,stroke:#fff,stroke-width:2px,color:#fff
          style TC2 fill:#10B981,stroke:#fff,stroke-width:2px,color:#fff
          style TC3 fill:#10B981,stroke:#fff,stroke-width:2px,color:#fff
      ```
      
      <p className="text--center" style={{marginTop: '1rem', color: 'var(--ifm-color-emphasis-700)'}}>
        Each tenant operates in complete isolation while sharing the same cloud infrastructure
      </p>
    </div>
  </div>
</div>

## Core Principles

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #4F46E5', height: '100%'}}>
      <div className="card__header">
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔒</div>
        <h3>Data Isolation</h3>
      </div>
      <div className="card__body">
        <p>Each tenant's data is completely separate and inaccessible to other tenants. Isolation is enforced at database, application, and infrastructure levels.</p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Database-level separation</li>
          <li>Application-level scoping</li>
          <li>Infrastructure isolation</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚙️</div>
        <h3>Independent Config</h3>
      </div>
      <div className="card__body">
        <p>Each tenant can have custom settings, branding, and integrations. Configuration changes in one tenant never affect others.</p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Custom branding</li>
          <li>Feature flags</li>
          <li>Integration settings</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📈</div>
        <h3>Scalable Infrastructure</h3>
      </div>
      <div className="card__body">
        <p>Shared resources scale efficiently across all tenants. Infrastructure costs are shared while maintaining security and performance.</p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Auto-scaling</li>
          <li>Resource efficiency</li>
          <li>Cost optimization</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Data Isolation Mechanisms

<Tabs>
  <TabItem value="database" label="🗄️ Database Level" default>
    <div className="card shadow--md" style={{borderLeft: '6px solid #4F46E5', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Database-Level Isolation</h3>
      </div>
      <div className="card__body">
        <div className="row">
          <div className="col col--6">
            <h4>Implementation</h4>
            <ul>
              <li><strong>Logical Separation</strong>: Each tenant has logically separated data within shared databases</li>
              <li><strong>Tenant ID Embedding</strong>: Tenant ID embedded in every database query</li>
              <li><strong>Query Scoping</strong>: Cross-tenant queries prevented at application layer</li>
              <li><strong>Index Optimization</strong>: Indexes optimized for tenant-scoped queries</li>
            </ul>
          </div>
          <div className="col col--6">
            <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
              <h4>MongoDB Architecture</h4>
              <ul style={{margin: 0, fontSize: '0.9rem'}}>
                <li>✅ Shared MongoDB clusters</li>
                <li>✅ Logical tenant separation</li>
                <li>✅ Tenant ID in all queries</li>
                <li>✅ Efficient query patterns</li>
                <li>✅ Tenant-aware backups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabItem>

  <TabItem value="application" label="💻 Application Level">
    <div className="card shadow--md" style={{borderLeft: '6px solid #06B6D4', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Application-Level Isolation</h3>
      </div>
      <div className="card__body">
        <div className="row">
          <div className="col col--6">
            <h4>Implementation</h4>
            <ul>
              <li><strong>Request Scoping</strong>: All API requests scoped to authenticated tenant</li>
              <li><strong>Context Validation</strong>: Tenant context validated on every request</li>
              <li><strong>Access Prevention</strong>: No cross-tenant data access possible</li>
              <li><strong>Service Awareness</strong>: Each microservice is tenant-aware</li>
            </ul>
          </div>
          <div className="col col--6">
            <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
              <h4>API Gateway</h4>
              <ul style={{margin: 0, fontSize: '0.9rem'}}>
                <li>✅ Single entry point</li>
                <li>✅ Tenant identification</li>
                <li>✅ Request routing</li>
                <li>✅ Rate limiting per tenant</li>
                <li>✅ Authentication & authorization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabItem>

  <TabItem value="infrastructure" label="☁️ Infrastructure Level">
    <div className="card shadow--md" style={{borderLeft: '6px solid #10B981', marginTop: '1rem'}}>
      <div className="card__header">
        <h3>Infrastructure-Level Isolation</h3>
      </div>
      <div className="card__body">
        <div className="row">
          <div className="col col--6">
            <h4>Implementation</h4>
            <ul>
              <li><strong>Network Isolation</strong>: VPCs and security groups separate tenant resources</li>
              <li><strong>Resource Tagging</strong>: All resources tagged with tenant identifiers</li>
              <li><strong>Monitoring</strong>: Tenant-aware monitoring and logging</li>
              <li><strong>IAM Roles</strong>: Role-based access control for infrastructure</li>
            </ul>
          </div>
          <div className="col col--6">
            <div className="card" style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem'}}>
              <h4>AWS Infrastructure</h4>
              <ul style={{margin: 0, fontSize: '0.9rem'}}>
                <li>✅ VPC isolation</li>
                <li>✅ Security groups</li>
                <li>✅ Resource tagging</li>
                <li>✅ IAM roles</li>
                <li>✅ Geographic redundancy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TabItem>
</Tabs>

## Subdomain-Based Access

<div className="card shadow--lg" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3 style={{color: 'white', margin: 0}}>🌐 Unique Subdomain Access</h3>
  </div>
  <div className="card__body">
    <div className="row">
      <div className="col col--6">
        <h4 style={{color: 'white'}}>Domain Patterns</h4>
        <div style={{background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem'}}>
          <code style={{color: '#22d3ee', fontSize: '1.1rem'}}>company.nxgen.cloud</code>
          <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>Primary domain pattern</p>
        </div>
        <div style={{background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem'}}>
          <code style={{color: '#22d3ee', fontSize: '1.1rem'}}>customer.inexchange.cloud</code>
          <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>Alternative domain pattern</p>
        </div>
      </div>
      <div className="col col--6">
        <h4 style={{color: 'white'}}>Benefits</h4>
        <ul style={{color: 'rgba(255,255,255,0.9)'}}>
          <li>✅ <strong>Easy Identification</strong>: Clear tenant identification from URL</li>
          <li>✅ <strong>SSL/TLS Management</strong>: Simplified certificate management</li>
          <li>✅ <strong>DNS-Based Routing</strong>: Efficient request routing</li>
          <li>✅ <strong>Branding</strong>: Custom domains support white-label</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Security Features

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #EF4444', height: '100%'}}>
      <div className="card__header">
        <h3>🔐 Authentication & Authorization</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>
            <strong>Multi-Factor Authentication (MFA)</strong>
            <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
              <li>Optional MFA for enhanced security</li>
              <li>Tenant-specific MFA policies</li>
              <li>Auth0 integration</li>
            </ul>
          </li>
          <li>
            <strong>Role-Based Access Control (RBAC)</strong>
            <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
              <li>Granular permissions at every level</li>
              <li>Tenant administrators manage scope</li>
              <li>Customer-level user management</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>🔒 Encryption</h3>
      </div>
      <div className="card__body">
        <ul>
          <li>
            <strong>Data in Transit</strong>
            <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
              <li>TLS 1.2+ for all communications</li>
              <li>End-to-end encryption for sensitive data</li>
              <li>Certificate management per tenant</li>
            </ul>
          </li>
          <li>
            <strong>Data at Rest</strong>
            <ul style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
              <li>AES-256 encryption</li>
              <li>AWS KMS key management</li>
              <li>Tenant-specific keys where required</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>✅ Compliance Standards</h3>
  </div>
  <div className="card__body">
    <div className="row">
      <div className="col col--4">
        <div className="card" style={{background: 'white', padding: '1rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🇪🇺</div>
          <h4>GDPR</h4>
          <p style={{fontSize: '0.9rem'}}>Data protection and privacy compliance</p>
        </div>
      </div>
      <div className="col col--4">
        <div className="card" style={{background: 'white', padding: '1rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🛡️</div>
          <h4>SOC 2</h4>
          <p style={{fontSize: '0.9rem'}}>Security and availability controls</p>
        </div>
      </div>
      <div className="col col--4">
        <div className="card" style={{background: 'white', padding: '1rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📋</div>
          <h4>ISO 27001</h4>
          <p style={{fontSize: '0.9rem'}}>Information security management</p>
        </div>
      </div>
    </div>
  </div>
</div>

## Use Cases

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #4F46E5'}}>
      <div className="card__header">
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏢</div>
        <h3>MSSPs</h3>
      </div>
      <div className="card__body">
        <p><strong>Managed Security Service Providers</strong></p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Multiple customers per tenant</li>
          <li>White-label options</li>
          <li>Centralized management</li>
          <li>Isolated operations</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏭</div>
        <h3>Enterprises</h3>
      </div>
      <div className="card__body">
        <p><strong>Large Enterprise Organizations</strong></p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>Division separation</li>
          <li>Geographic organization</li>
          <li>Departmental control</li>
          <li>Centralized oversight</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{height: '100%', borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🚀</div>
        <h3>Service Providers</h3>
      </div>
      <div className="card__body">
        <p><strong>Platform Service Providers</strong></p>
        <ul style={{fontSize: '0.9rem'}}>
          <li>White-label deployment</li>
          <li>Custom integrations</li>
          <li>Scalable growth</li>
          <li>Resource efficiency</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Benefits Comparison

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>For Tenants</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li>✅ Complete data isolation</li>
        <li>✅ Custom configuration</li>
        <li>✅ Scalability without infrastructure concerns</li>
        <li>✅ Enterprise-grade security</li>
        <li>✅ Cost efficiency</li>
      </ul>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>For Platform</h3>
      <ul style={{color: 'rgba(255,255,255,0.9)'}}>
        <li>✅ Resource efficiency</li>
        <li>✅ Scalable growth</li>
        <li>✅ Centralized maintenance</li>
        <li>✅ Innovation deployment</li>
        <li>✅ Cost optimization</li>
      </ul>
    </div>
  </div>
</div>

## Related Articles

- [Hierarchy Model](/docs/platform-fundamentals/hierarchy-model)
- [Microservices Architecture](/docs/platform-fundamentals/microservices-architecture)
- [Cloud Architecture Overview](/docs/getting-started/cloud-architecture)
- [Key Benefits & Value Propositions](/docs/getting-started/key-benefits)

---

## Need Help?

If you have questions about multi-tenant architecture or need assistance with tenant configuration, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).


