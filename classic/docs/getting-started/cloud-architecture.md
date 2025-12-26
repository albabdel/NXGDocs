---
title: "Cloud Architecture Overview"
description: "Detailed overview of the NXGEN GCXONE Cloud-native VSaaS architecture"
tags:
  - role:all
  - category:architecture
  - platform:Cloud
sidebar_position: 4
---

import Head from '@docusaurus/Head';

<Head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
</Head>

# Cloud Architecture Overview

Welcome to the technical overview of the NXGEN GCXONE architecture. This platform is built on modern cloud-native principles to provide a unified Video Surveillance as a Service (VSaaS) and IoT security management ecosystem.

---

## 1. The Core SaaS Model

GCXONE operates entirely in the cloud, eliminating the heavy lifting of traditional on-premise systems. By shifting to a SaaS model, organizations gain agility, scalability, and freedom from hardware maintenance.

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md margin-bottom--md" style={{borderLeft: '4px solid #4F46E5', background: 'var(--ifm-card-background-color)'}}>
      <div className="card__body">
        <h3>No More "Box" Maintenance</h3>
        <p>Elimination of dedicated local servers. No purchasing, maintaining, or manually updating hardware.</p>
      </div>
    </div>
    <div className="card shadow--md margin-bottom--md" style={{borderLeft: '4px solid #06B6D4', background: 'var(--ifm-card-background-color)'}}>
      <div className="card__body">
        <h3>Infinite Scalability</h3>
        <p>Add sites, cameras, and sensors instantly without hitting the physical limits of a local NVR or DVR.</p>
      </div>
    </div>
    <div className="card shadow--md" style={{borderLeft: '4px solid #D946EF', background: 'var(--ifm-card-background-color)'}}>
      <div className="card__body">
        <h3>Centralized Updates</h3>
        <p>Security patches and new features are deployed automatically across the entire fleet.</p>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md padding--md" style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--ifm-card-background-color)'}}>
       <h4 style={{color: 'var(--ifm-color-emphasis-600)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem'}}>Traditional vs. GCXONE SaaS</h4>
       <div style={{width: '100%', height: '350px'}}>
         <canvas id="saasRadarChart"></canvas>
       </div>
       <p style={{fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-500)', marginTop: '1rem', textAlign: 'center'}}>GCXONE outperforms traditional setups in scalability, access, and ease of updates.</p>
    </div>
  </div>
</div>

---

## 2. Robust AWS Infrastructure

Built primarily on Amazon Web Services (AWS), the platform ensures high reliability and global reach. The architecture is heavily containerized using Kubernetes (EKS) for efficient microservices management.

<div className="row margin-bottom--lg" style={{background: 'var(--ifm-color-emphasis-100)', borderRadius: '1rem', overflow: 'hidden', margin: '0'}}>
  <div className="col col--7 padding--lg">
    <h2 style={{color: 'var(--ifm-color-primary-darker)'}}>Infrastructure Stack</h2>
    <p>Leveraging world-class cloud services to deliver mission-critical security.</p>
    <ul style={{listStyle: 'none', padding: 0}}>
      <li style={{marginBottom: '1rem'}}>
        <span style={{background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', fontWeight: 'bold'}}>✓</span>
        <strong>Private EKS Clusters:</strong> 75% of application logic runs on secure, private worker nodes.
      </li>
      <li style={{marginBottom: '1rem'}}>
        <span style={{background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', fontWeight: 'bold'}}>✓</span>
        <strong>Auto-Scaling:</strong> Node groups adjust resources in real-time based on system load.
      </li>
      <li style={{marginBottom: '1rem'}}>
        <span style={{background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', fontWeight: 'bold'}}>✓</span>
        <strong>Amazon MQ:</strong> Asynchronous messaging orchestration for platform-wide event sync.
      </li>
    </ul>
  </div>
  <div className="col col--5 padding--lg" style={{background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <h4 style={{color: 'white', marginBottom: '1.5rem'}}>Compute Composition</h4>
    <div style={{width: '100%', height: '300px'}}>
      <canvas id="infraDoughnutChart"></canvas>
    </div>
  </div>
</div>

---

## 3. The Universal Translator (Proxy Architecture)

The "Proxy Architecture" is the core innovation. It allows GCXONE to speak the language of diverse manufacturers (Hikvision, Dahua, Axis) by translating their specific protocols into a standard system command.

<div className="margin-bottom--xl" style={{position: 'relative', padding: '2rem 0'}}>
  <div className="row" style={{display: 'flex', justifyContent: 'space-between', gap: '1rem', position: 'relative', zIndex: 2}}>
    {[
      {emoji: '📹', title: 'Diverse Hardware', desc: 'SDK/HTTP Protocols', color: 'var(--ifm-color-emphasis-200)'},
      {emoji: '⚙️', title: 'Proxy Layer', desc: 'Protocol Translation', color: '#4F46E5', text: 'white'},
      {emoji: '🔌', title: 'Unified Interface', desc: 'Standardized Stream', color: '#06B6D4', text: 'white'},
      {emoji: '🧠', title: 'GCXONE Core', desc: 'SaaS & AI Engine', color: '#D946EF', text: 'white'}
    ].map((step, i) => (
      <div key={i} className="col" style={{flex: 1}}>
        <div className="card shadow--md text--center padding--md" style={{background: step.color, color: step.text || 'inherit', height: '100%'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{step.emoji}</div>
          <h4 style={{marginBottom: '0.25rem'}}>{step.title}</h4>
          <p style={{fontSize: '0.8rem', margin: 0, opacity: 0.8}}>{step.desc}</p>
        </div>
      </div>
    ))}
  </div>
</div>

---

## 4. Logical Hierarchy & Multi-Tenancy

Data isolation is enforced through a strict Multi-Tenant Architecture. Each organization lives in a dedicated "Tenant" space, with a nested logical structure for granular management.

<div className="row">
  <div className="col col--4">
    <div className="card shadow--md padding--md" style={{background: 'var(--ifm-color-primary-darkest)', color: 'white', height: '100%'}}>
      <h3>Entity Structure</h3>
      <p style={{color: 'rgba(255,255,255,0.7)'}}>Isolation at every level ensures customer data never spills over.</p>
      <ul style={{listStyle: 'none', padding: 0, fontSize: '1.1rem'}}>
        <li>🏢 <strong>Tenant</strong></li>
        <li style={{paddingLeft: '1.5rem'}}>└─ 👤 <strong>Customer</strong></li>
        <li style={{paddingLeft: '3rem'}}>└─ 📍 <strong>Site</strong></li>
        <li style={{paddingLeft: '4.5rem'}}>└─ 📟 <strong>Device</strong></li>
        <li style={{paddingLeft: '6rem'}}>└─ 🎥 <strong>Sensor</strong></li>
      </ul>
    </div>
  </div>
  <div className="col col--8">
    <div className="card shadow--md padding--md" style={{background: 'var(--ifm-card-background-color)'}}>
      <h4 className="text--center" style={{color: 'var(--ifm-color-emphasis-600)'}}>Interactive Hierarchy Navigator</h4>
      <div id="hierarchySunburst" style={{width: '100%', height: '400px'}}></div>
      <p className="text--center" style={{fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-500)'}}>Visual representation of nested entity relationships.</p>
    </div>
  </div>
</div>

---

## 5. Performance Metrics

GCXONE integrates advanced AI to transform raw video data into actionable security intelligence, resulting in significant operational efficiency.

<div className="row">
  <div className="col col--6">
    <div className="card shadow--md padding--lg" style={{background: '#0f172a', color: 'white'}}>
      <h3 className="text--center" style={{color: '#22d3ee'}}>Noise Reduction Efficiency</h3>
      <div style={{height: '250px'}}>
        <canvas id="alarmPieChart"></canvas>
      </div>
      <p className="text--center margin-top--md">AI filtering reduces false alarms by <strong>~80%</strong>.</p>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md padding--lg" style={{background: '#0f172a', color: 'white'}}>
      <h3 className="text--center" style={{color: '#f472b6'}}>SLA Response Speed</h3>
      <div id="responseGauge" style={{height: '250px'}}></div>
      <p className="text--center margin-top--md">Average threat processing time: <strong>60-90 seconds</strong>.</p>
    </div>
  </div>
</div>

---

## 6. Security Standards

Security is woven into the architecture, not added as an after-thought.

| Security Pillar    | Implementation                                                                       |
| :----------------- | :----------------------------------------------------------------------------------- |
| **Encryption**     | All data at rest and in transit secured with **AES-256** standards.                  |
| **Access Control** | Strict RBAC (Role-Based Access Control) with **Jump Server** gating for infra nodes. |
| **Compliance**     | Infrastructure designed for **GDPR, SOC 2, and ISO 27001** certification readiness.  |

<script dangerouslySetInnerHTML={{
  __html: `
  (function() {
    function initCharts() {
      if (!window.Chart || !window.Plotly) {
        setTimeout(initCharts, 200);
        return;
      }

      // Radar Chart
      new Chart(document.getElementById('saasRadarChart'), {
        type: 'radar',
        data: {
          labels: ['Remote Access', 'Scalability', 'Auto Updates', 'Hardware-Free', 'Cost Efficiency', 'Deployment'],
          datasets: [{
            label: 'GCXONE Cloud',
            data: [100, 100, 100, 95, 85, 90],
            backgroundColor: 'rgba(79, 70, 229, 0.4)',
            borderColor: '#4F46E5',
            pointBackgroundColor: '#4F46E5'
          }, {
            label: 'Traditional',
            data: [30, 40, 20, 10, 50, 40],
            backgroundColor: 'rgba(148, 163, 184, 0.4)',
            borderColor: '#94a3b8',
            pointBackgroundColor: '#94a3b8'
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          scales: { r: { ticks: { display: false }, grid: { color: 'rgba(128,128,128,0.2)' } } },
          plugins: { legend: { labels: { color: 'var(--ifm-font-color-base)' } } }
        }
      });

      // Doughnut Chart
      new Chart(document.getElementById('infraDoughnutChart'), {
        type: 'doughnut',
        data: {
          labels: ['EKS (Apps)', 'MongoDB', 'S3 Storage', 'Messaging', 'Other'],
          datasets: [{
            data: [75, 10, 5, 5, 5],
            backgroundColor: ['#4F46E5', '#06B6D4', '#a855f7', '#f472b6', '#94a3b8'],
            borderWidth: 0
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: 'white', padding: 20 } } },
          cutout: '70%'
        }
      });

      // Pie Chart
      new Chart(document.getElementById('alarmPieChart'), {
        type: 'pie',
        data: {
          labels: ['Noise (Filtered)', 'True Threats'],
          datasets: [{
            data: [80, 20],
            backgroundColor: ['#334155', '#22d3ee'],
            borderWidth: 0
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: 'white' } } }
        }
      });

      // Sunburst
      Plotly.newPlot('hierarchySunburst', [{
        type: "sunburst",
        labels: ["Tenant", "Client A", "Client B", "Site 1", "Site 2", "Cam 1", "Cam 2"],
        parents: ["", "Tenant", "Tenant", "Client A", "Client A", "Site 1", "Site 1"],
        values: [100, 50, 50, 25, 25, 12, 12],
        marker: {line: {width: 1}, colorscale: 'Viridis'}
      }], {
        margin: {l:0, r:0, b:0, t:0},
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: {family: 'Inter, sans-serif'}
      }, {displayModeBar: false, responsive: true});

      // Gauge
      Plotly.newPlot('responseGauge', [{
        type: "indicator",
        mode: "gauge+number",
        value: 75,
        number: { suffix: "s", font: {color: 'white'} },
        gauge: {
          axis: { range: [0, 120], tickcolor: "#94a3b8" },
          bar: { color: "#22d3ee" },
          bgcolor: "#1e293b",
          steps: [{ range: [0, 90], color: "rgba(34, 211, 238, 0.2)" }],
          threshold: { line: { color: "#F43F5E", width: 4 }, value: 90 }
        }
      }], {
        margin: { t: 30, b: 30, l: 30, r: 30 },
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { color: "#94a3b8", family: "Inter" }
      }, {displayModeBar: false, responsive: true});
    }

    if (document.readyState === 'complete') initCharts();
    else window.addEventListener('load', initCharts);
  })();
  `
}} />
