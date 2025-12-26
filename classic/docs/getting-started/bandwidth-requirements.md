---
title: "Network Bandwidth Requirements"
description: "Complete guide for calculating and planning network bandwidth requirements for GCXONE video surveillance"
tags:
  - role:installer
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 9
last_updated: 2025-12-04
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Network Bandwidth Requirements

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Proper bandwidth planning is essential for reliable video surveillance operations with GCXONE. This guide helps you calculate bandwidth requirements, understand factors affecting bandwidth consumption, and implement best practices for optimal performance.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📊</div>
      <h3 style={{color: 'white', margin: 0}}>Bandwidth</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Smart Planning</p>
    </div>
  </div>
</div>

## Key Factors

<div className="row margin-bottom--lg">
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #4F46E5', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📹</div>
      <h4>Camera Count</h4>
      <p style={{fontSize: '0.85rem'}}>More cameras = more bandwidth</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎬</div>
      <h4>Video Quality</h4>
      <p style={{fontSize: '0.85rem'}}>Resolution & frame rate impact</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💾</div>
      <h4>Compression</h4>
      <p style={{fontSize: '0.85rem'}}>H.264 vs H.265 codec</p>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #D946EF', textAlign: 'center', padding: '1rem', height: '100%'}}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👥</div>
      <h4>Concurrent Viewers</h4>
      <p style={{fontSize: '0.85rem'}}>Multiple operators viewing</p>
    </div>
  </div>
</div>

![Bandwidth Planning](/img/getting-started/key-benefits/key-benefits-page-7-img-1.png)

## Bandwidth Calculation Formula

<div className="card shadow--lg" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', marginBottom: '2rem', padding: '2rem'}}>
  <h2 className="text--center" style={{color: 'white', marginBottom: '1.5rem'}}>📐 Calculation Formula</h2>
  
  <div style={{background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem'}}>
    <div style={{marginBottom: '1rem'}}>
      <strong style={{color: '#22d3ee'}}>Total Bandwidth =</strong>
    </div>
    <div style={{marginLeft: '2rem', marginBottom: '0.5rem'}}>
      (Number of Cameras × Bitrate per Camera) +
    </div>
    <div style={{marginLeft: '2rem', marginBottom: '0.5rem'}}>
      (Concurrent Viewers × Stream Bitrate) +
    </div>
    <div style={{marginLeft: '2rem'}}>
      Overhead (20-30%)
    </div>
  </div>
</div>

## Bitrate Guidelines

<div className="card shadow--md" style={{marginBottom: '2rem'}}>
  <div className="card__header">
    <h3>📊 Bitrate by Resolution & Codec</h3>
  </div>
  <div className="card__body">
    <Tabs>
      <TabItem value="h264" label="H.264 Codec" default>
        <table>
          <thead>
            <tr>
              <th>Resolution</th>
              <th>Frame Rate</th>
              <th>Bitrate Range</th>
              <th>Typical</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>720p (HD)</strong></td>
              <td>30 fps</td>
              <td>2-4 Mbps</td>
              <td>3 Mbps</td>
              <td>Standard definition</td>
            </tr>
            <tr>
              <td><strong>1080p (Full HD)</strong></td>
              <td>30 fps</td>
              <td>4-8 Mbps</td>
              <td>6 Mbps</td>
              <td>High definition</td>
            </tr>
            <tr>
              <td><strong>2MP (1080p)</strong></td>
              <td>30 fps</td>
              <td>4-8 Mbps</td>
              <td>6 Mbps</td>
              <td>Common IP camera</td>
            </tr>
            <tr>
              <td><strong>4MP (1440p)</strong></td>
              <td>30 fps</td>
              <td>8-12 Mbps</td>
              <td>10 Mbps</td>
              <td>High resolution</td>
            </tr>
            <tr>
              <td><strong>5MP</strong></td>
              <td>30 fps</td>
              <td>10-15 Mbps</td>
              <td>12 Mbps</td>
              <td>Very high resolution</td>
            </tr>
            <tr>
              <td><strong>8MP (4K)</strong></td>
              <td>30 fps</td>
              <td>20-30 Mbps</td>
              <td>25 Mbps</td>
              <td>Ultra high definition</td>
            </tr>
          </tbody>
        </table>
      </TabItem>

      <TabItem value="h265" label="H.265 Codec (50% Savings)">
        <table>
          <thead>
            <tr>
              <th>Resolution</th>
              <th>Frame Rate</th>
              <th>Bitrate Range</th>
              <th>Typical</th>
              <th>Savings vs H.264</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>720p (HD)</strong></td>
              <td>30 fps</td>
              <td>1-2 Mbps</td>
              <td>1.5 Mbps</td>
              <td>50% reduction</td>
            </tr>
            <tr>
              <td><strong>1080p (Full HD)</strong></td>
              <td>30 fps</td>
              <td>2-4 Mbps</td>
              <td>3 Mbps</td>
              <td>50% reduction</td>
            </tr>
            <tr>
              <td><strong>2MP (1080p)</strong></td>
              <td>30 fps</td>
              <td>2-4 Mbps</td>
              <td>3 Mbps</td>
              <td>50% reduction</td>
            </tr>
            <tr>
              <td><strong>4MP (1440p)</strong></td>
              <td>30 fps</td>
              <td>4-6 Mbps</td>
              <td>5 Mbps</td>
              <td>50% reduction</td>
            </tr>
            <tr>
              <td><strong>5MP</strong></td>
              <td>30 fps</td>
              <td>5-8 Mbps</td>
              <td>6 Mbps</td>
              <td>50% reduction</td>
            </tr>
            <tr>
              <td><strong>8MP (4K)</strong></td>
              <td>30 fps</td>
              <td>10-15 Mbps</td>
              <td>12 Mbps</td>
              <td>50% reduction</td>
            </tr>
          </tbody>
        </table>
        <div className="alert alert--success" style={{marginTop: '1rem'}}>
          <strong>H.265 Advantage:</strong> H.265 (HEVC) codec provides approximately 50% bandwidth savings compared to H.264 at the same quality level. Use H.265 when available.
        </div>
      </TabItem>
    </Tabs>
  </div>
</div>

## Example Calculations

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #4F46E5', height: '100%'}}>
      <div className="card__header">
        <h3>🏠 Small Installation</h3>
        <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>10 Cameras, 1080p</p>
      </div>
      <div className="card__body">
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Upload:</strong><br/>
          10 cameras × 6 Mbps = <strong>60 Mbps</strong>
        </div>
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Download:</strong><br/>
          3 viewers × 6 Mbps = <strong>18 Mbps</strong>
        </div>
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Overhead (20%):</strong><br/>
          <strong>15.6 Mbps</strong>
        </div>
        <div style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center'}}>
          <strong style={{fontSize: '1.2rem'}}>Total: ~94 Mbps</strong>
        </div>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>🏢 Medium Installation</h3>
        <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>50 Cameras, Mixed</p>
      </div>
      <div className="card__body">
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Upload:</strong><br/>
          30×6 + 20×10 = <strong>380 Mbps</strong>
        </div>
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Download:</strong><br/>
          10 viewers × 6 = <strong>60 Mbps</strong>
        </div>
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Overhead (25%):</strong><br/>
          <strong>110 Mbps</strong>
        </div>
        <div style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center'}}>
          <strong style={{fontSize: '1.2rem'}}>Total: ~550 Mbps</strong>
        </div>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>🏭 Large Installation</h3>
        <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>200 Cameras, Mixed</p>
      </div>
      <div className="card__body">
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Upload:</strong><br/>
          100×6 + 80×10 + 20×25 = <strong>1,900 Mbps</strong>
        </div>
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Download:</strong><br/>
          20 viewers × 8 = <strong>160 Mbps</strong>
        </div>
        <div style={{background: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
          <strong>Overhead (30%):</strong><br/>
          <strong>618 Mbps</strong>
        </div>
        <div style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center'}}>
          <strong style={{fontSize: '1.2rem'}}>Total: ~2.7 Gbps</strong>
        </div>
      </div>
    </div>
  </div>
</div>

## Network Planning Guidelines

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>📤 Upload Bandwidth</h3>
      <p style={{color: 'rgba(255,255,255,0.9)'}}><strong>Critical for Device Connectivity</strong></p>
      <table style={{color: 'white', marginTop: '1rem', width: '100%'}}>
        <thead>
          <tr>
            <th>Installation</th>
            <th>Cameras</th>
            <th>Recommended</th>
            <th>Minimum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Small</td>
            <td>1-20</td>
            <td>100 Mbps</td>
            <td>50 Mbps</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>21-100</td>
            <td>500 Mbps</td>
            <td>250 Mbps</td>
          </tr>
          <tr>
            <td>Large</td>
            <td>101-500</td>
            <td>1 Gbps</td>
            <td>500 Mbps</td>
          </tr>
          <tr>
            <td>Enterprise</td>
            <td>500+</td>
            <td>10 Gbps</td>
            <td>1 Gbps</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', padding: '2rem', height: '100%'}}>
      <h3 style={{color: 'white'}}>📥 Download Bandwidth</h3>
      <p style={{color: 'rgba(255,255,255,0.9)'}}><strong>For Operator Viewing</strong></p>
      <table style={{color: 'white', marginTop: '1rem', width: '100%'}}>
        <thead>
          <tr>
            <th>Viewers</th>
            <th>Recommended</th>
            <th>Minimum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1-5</td>
            <td>50 Mbps</td>
            <td>25 Mbps</td>
          </tr>
          <tr>
            <td>6-20</td>
            <td>200 Mbps</td>
            <td>100 Mbps</td>
          </tr>
          <tr>
            <td>21-50</td>
            <td>500 Mbps</td>
            <td>250 Mbps</td>
          </tr>
          <tr>
            <td>50+</td>
            <td>1 Gbps</td>
            <td>500 Mbps</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

## Optimization Strategies

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>💾 Codec Selection</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>Use H.265:</strong> 50% bandwidth savings</li>
          <li><strong>Variable Bitrate:</strong> Adapts to scene complexity</li>
          <li><strong>Optimize Settings:</strong> Balance quality vs bandwidth</li>
          <li><strong>Lower for Static:</strong> Reduce bitrate for static scenes</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>🎬 Recording Optimization</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>Motion-Based:</strong> 50-80% bandwidth reduction</li>
          <li><strong>Smart Scheduling:</strong> Continuous during business hours</li>
          <li><strong>Pre/Post Buffer:</strong> 30 seconds recommended</li>
          <li><strong>Event-Based:</strong> Minimal when idle</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #D946EF', height: '100%'}}>
      <div className="card__header">
        <h3>🌐 Network Optimization</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li><strong>Quality of Service:</strong> Prioritize video traffic</li>
          <li><strong>Network Segmentation:</strong> Separate video traffic</li>
          <li><strong>Bandwidth Throttling:</strong> Limit per-camera if needed</li>
          <li><strong>Dedicated VLANs:</strong> Isolate security devices</li>
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
      <TabItem value="quality" label="Poor Video Quality" default>
        <ul>
          <li><strong>Symptom:</strong> Pixelation, freezing, or artifacts</li>
          <li><strong>Cause:</strong> Insufficient bandwidth</li>
          <li><strong>Solution:</strong> Reduce bitrate or upgrade connection</li>
        </ul>
      </TabItem>
      <TabItem value="drops" label="Connection Drops">
        <ul>
          <li><strong>Symptom:</strong> Devices frequently disconnecting</li>
          <li><strong>Cause:</strong> Bandwidth saturation</li>
          <li><strong>Solution:</strong> Increase bandwidth or reduce camera count</li>
        </ul>
      </TabItem>
      <TabItem value="delays" label="Delayed Alarms">
        <ul>
          <li><strong>Symptom:</strong> Alarms arriving late</li>
          <li><strong>Cause:</strong> Network congestion</li>
          <li><strong>Solution:</strong> Prioritize alarm traffic with QoS</li>
        </ul>
      </TabItem>
    </Tabs>
  </div>
</div>

## Best Practices Checklist

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981'}}>
      <div className="card__header">
        <h3>✅ Planning Phase</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Calculate requirements using formulas</li>
          <li>Plan for 20-30% headroom for growth</li>
          <li>Consider peak usage scenarios</li>
          <li>Test before deployment</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4'}}>
      <div className="card__header">
        <h3>⚙️ Configuration Phase</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Optimize codec settings (use H.265)</li>
          <li>Configure motion-based recording</li>
          <li>Set appropriate bitrates</li>
          <li>Enable QoS for video traffic</li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Related Articles

- [Firewall Configuration Guide](/docs/getting-started/firewall-configuration)
- [IP Whitelisting Guide](/docs/getting-started/ip-whitelisting)
- [Required Ports & Endpoints](/docs/getting-started/required-ports)
- [Quick Start Checklist](/docs/getting-started/quick-start-checklist)

---

## Need Help?

If you need assistance calculating bandwidth requirements or optimizing your network configuration, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
