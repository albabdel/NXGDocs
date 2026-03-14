#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

const today = new Date().toISOString().slice(0, 10);

const landingPages = [
  {
    _id: 'landing-page-platform-overview',
    _type: 'landingPage',
    title: 'Platform Overview',
    slug: { _type: 'slug', current: 'platform-overview' },
    description: 'Comprehensive monitoring platform for tower sites, data centers, and critical infrastructure. Real-time visibility, intelligent alerting, and seamless integrations.',
    layoutType: 'standard',
    showBackground: true,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Platform Overview' }
    ],
    hero: {
      badge: { icon: 'Cpu', text: 'NXGEN Platform' },
      headline: 'Complete Infrastructure Visibility',
      subheadline: 'Monitor thousands of sites from a single pane of glass. NXGEN Technology AG delivers enterprise-grade monitoring for towers, data centers, and critical infrastructure.',
      metrics: [
        { label: 'Stations Monitored', value: '12,500+', icon: 'RadioTower', color: '#3B82F6' },
        { label: 'Platform Uptime', value: '99.99%', icon: 'ShieldCheck', color: '#10B981' },
        { label: 'Alerts Processed', value: '2.4M/mo', icon: 'BellRing', color: '#F59E0B' },
        { label: 'Response Time', value: '<100ms', icon: 'Zap', color: '#8B5CF6' }
      ],
      ctaButtons: [
        { label: 'Get Started', href: '/quick-start', variant: 'primary' },
        { label: 'View Demo', href: '/docs/demo', variant: 'secondary' }
      ]
    },
    sections: [
      {
        _type: 'landingSectionFeatures',
        _key: 'platform-features',
        title: 'Why NXGEN?',
        description: 'Built for scale, designed for operators. Our platform combines powerful monitoring with intuitive interfaces.',
        columns: 4,
        features: [
          { icon: 'Globe', title: 'Multi-Site Dashboard', description: 'Monitor all your sites from a unified dashboard with real-time status updates and drill-down capabilities.', color: '#3B82F6', value: '500+ sites' },
          { icon: 'Bell', title: 'Intelligent Alerting', description: 'AI-powered alert correlation reduces noise by 90%. Get notified only when it matters.', color: '#10B981', value: '-90% noise' },
          { icon: 'Video', title: 'Video Integration', description: 'Seamless CCTV integration with live feeds, playback, and AI-powered video analytics.', color: '#8B5CF6', value: '50+ cameras' },
          { icon: 'Shield', title: 'Enterprise Security', description: 'SOC 2 Type II certified with end-to-end encryption and role-based access control.', color: '#F59E0B', value: 'SOC 2' },
          { icon: 'Cloud', title: 'Cloud-Native', description: 'Deploy on-premise or cloud. Auto-scaling infrastructure handles any load.', color: '#06B6D4', value: '99.99% SLA' },
          { icon: 'Link', title: 'API-First', description: 'RESTful APIs and webhooks for seamless integration with your existing tools.', color: '#EC4899', value: 'REST + GraphQL' },
          { icon: 'Map', title: 'GIS Mapping', description: 'Interactive maps with real-time station overlays, coverage areas, and incident visualization.', color: '#84CC16', value: 'Real-time' },
          { icon: 'BarChart3', title: 'Advanced Analytics', description: 'Custom dashboards, trend analysis, and automated reporting for data-driven decisions.', color: '#F97316', value: 'Custom KPIs' }
        ]
      },
      {
        _type: 'landingSectionCapabilities',
        _key: 'platform-capabilities',
        title: 'Platform Capabilities',
        description: 'Enterprise features designed for mission-critical monitoring operations.',
        capabilities: [
          { icon: 'Activity', title: 'Real-Time Monitoring', value: '24/7', description: 'Continuous monitoring with sub-second data collection and instant anomaly detection.', color: '#3B82F6' },
          { icon: 'Users', title: 'Multi-Tenant', value: 'Unlimited', description: 'Support for multiple organizations with complete data isolation and independent configurations.', color: '#10B981' },
          { icon: 'RefreshCw', title: 'Auto-Discovery', value: 'Zero-Config', description: 'Automatic device and sensor discovery reduces setup time from days to minutes.', color: '#8B5CF6' },
          { icon: 'Database', title: 'Data Retention', value: '7 Years', description: 'Long-term data storage for compliance, trend analysis, and historical investigations.', color: '#F59E0B' },
          { icon: 'Globe2', title: 'Global Scale', value: '50+ Regions', description: 'Distributed edge nodes ensure low-latency access from anywhere in the world.', color: '#06B6D4' },
          { icon: 'Lock', title: 'Compliance', value: 'ISO 27001', description: 'Built-in compliance controls for telecommunications and critical infrastructure regulations.', color: '#EC4899' }
        ]
      },
      {
        _type: 'landingSectionCTA',
        _key: 'platform-cta',
        title: 'Ready to Transform Your Operations?',
        description: 'Join hundreds of organizations using NXGEN to monitor their critical infrastructure.',
        buttons: [
          { label: 'Start Free Trial', href: '/trial', variant: 'primary' },
          { label: 'Contact Sales', href: '/contact', variant: 'secondary' }
        ]
      }
    ],
    status: 'published',
    publishedAt: today,
    lastUpdated: today
  },
  {
    _id: 'landing-page-monitoring-stations',
    _type: 'landingPage',
    title: 'Monitoring Stations',
    slug: { _type: 'slug', current: 'monitoring-stations' },
    description: 'Complete tower and site monitoring solution. Track equipment health, environmental conditions, and security status across your entire infrastructure.',
    layoutType: 'tower-guide',
    showBackground: true,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Monitoring Stations' }
    ],
    hero: {
      badge: { icon: 'RadioTower', text: 'Tower Monitoring' },
      headline: 'Monitor Every Site, Anywhere',
      subheadline: 'From remote cell towers to urban data centers, NXGEN provides comprehensive site monitoring with real-time visibility into equipment health, environmental conditions, and security status.',
      metrics: [
        { label: 'Tower Sites', value: '8,200+', icon: 'RadioTower', color: '#3B82F6' },
        { label: 'Active Sensors', value: '156K', icon: 'Cpu', color: '#10B981' },
        { label: 'Avg Resolution', value: '<15 min', icon: 'Clock', color: '#F59E0B' }
      ],
      ctaButtons: [
        { label: 'View Station Types', href: '#station-types', variant: 'primary' },
        { label: 'Integration Options', href: '#integrations', variant: 'outline' }
      ]
    },
    sections: [
      {
        _type: 'landingSectionHierarchy',
        _key: 'station-hierarchy',
        title: 'Station Hierarchy',
        description: 'Organize your infrastructure with our flexible 5-level hierarchy model.',
        levels: [
          { level: 'L1', title: 'Organization', description: 'Top-level entity representing a company or business unit', icon: 'Building2', color: '#3B82F6' },
          { level: 'L2', title: 'Region', description: 'Geographic or operational regions within an organization', icon: 'Globe', color: '#10B981' },
          { level: 'L3', title: 'Cluster', description: 'Grouped sites sharing common infrastructure or management', icon: 'Cluster', color: '#8B5CF6' },
          { level: 'L4', title: 'Station', description: 'Individual monitoring station (tower, data center, facility)', icon: 'RadioTower', color: '#F59E0B' },
          { level: 'L5', title: 'Device', description: 'Sensors, cameras, controllers, and equipment at each station', icon: 'Cpu', color: '#EC4899' }
        ],
        benefits: [
          { icon: 'Search', title: 'Quick Navigation', description: 'Drill down from organization to device level in seconds' },
          { icon: 'Layers', title: 'Aggregated Views', description: 'See status at any level with roll-up metrics' },
          { icon: 'UserCheck', title: 'Role-Based Access', description: 'Control visibility by organizational scope' },
          { icon: 'GitBranch', title: 'Flexible Structure', description: 'Adapt hierarchy to your operational needs' }
        ]
      },
      {
        _type: 'landingSectionFeatures',
        _key: 'station-types',
        title: 'Station Types',
        description: 'Support for diverse infrastructure types with specialized monitoring capabilities.',
        columns: 3,
        features: [
          { icon: 'RadioTower', title: 'Telecom Towers', description: 'Cell towers, radio sites, and broadcast facilities with generator, rectifier, and environmental monitoring.', color: '#3B82F6', link: '/docs/towers' },
          { icon: 'Server', title: 'Data Centers', description: 'Server rooms and data halls with power, cooling, and access control integration.', color: '#10B981', link: '/docs/datacenters' },
          { icon: 'Warehouse', title: 'Industrial Sites', description: 'Factories, warehouses, and production facilities with equipment health monitoring.', color: '#8B5CF6', link: '/docs/industrial' },
          { icon: 'Zap', title: 'Power Substations', description: 'Electrical substations with SCADA integration and transformer monitoring.', color: '#F59E0B', link: '/docs/substations' },
          { icon: 'Building', title: 'Smart Buildings', description: 'Commercial buildings with HVAC, lighting, and occupancy monitoring.', color: '#06B6D4', link: '/docs/buildings' },
          { icon: 'Satellite', title: 'Remote Sites', description: 'Off-grid locations with solar power, satellite connectivity, and environmental sensors.', color: '#EC4899', link: '/docs/remote' }
        ]
      },
      {
        _type: 'landingSectionContentGrid',
        _key: 'station-integrations',
        title: 'Integration Capabilities',
        description: 'Connect with your existing systems and protocols out of the box.',
        columns: 2,
        items: [
          { icon: 'Video', title: 'Video Management', description: 'Native integration with major VMS platforms and camera manufacturers.', link: '/integrations#video', listItems: ['Dahua', 'Hikvision', 'Axis', 'Milestone', 'Genetec'] },
          { icon: 'Cpu', title: 'IoT Protocols', description: 'Support for industrial and building automation protocols.', link: '/integrations#iot', listItems: ['Modbus TCP/RTU', 'SNMP v1/v2c/v3', 'MQTT', 'BACnet', 'OPC-UA'] },
          { icon: 'Cloud', title: 'Cloud Services', description: 'Seamless integration with major cloud platforms.', link: '/integrations#cloud', listItems: ['AWS IoT Core', 'Azure IoT Hub', 'Google Cloud IoT', 'Custom REST APIs'] },
          { icon: 'Bell', title: 'Notification Systems', description: 'Multi-channel alerting and incident management.', link: '/integrations#notifications', listItems: ['SMS/Email', 'Slack/Teams', 'PagerDuty', 'ServiceNow'] }
        ]
      },
      {
        _type: 'landingSectionCTA',
        _key: 'station-cta',
        title: 'Ready to Monitor Your Sites?',
        description: 'Deploy monitoring across your entire infrastructure in days, not months.',
        buttons: [
          { label: 'Start Setup', href: '/quick-start', variant: 'primary' },
          { label: 'Request Demo', href: '/demo', variant: 'secondary' }
        ]
      }
    ],
    status: 'published',
    publishedAt: today,
    lastUpdated: today
  },
  {
    _id: 'landing-page-quick-start',
    _type: 'landingPage',
    title: 'Quick Start Guide',
    slug: { _type: 'slug', current: 'quick-start' },
    description: 'Get up and running with NXGEN in minutes. Step-by-step guides for administrators, managers, and operators.',
    layoutType: 'quick-start',
    showBackground: true,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Quick Start' }
    ],
    hero: {
      badge: { icon: 'Rocket', text: 'Getting Started' },
      headline: 'Start Monitoring in Minutes',
      subheadline: 'Whether you are an administrator setting up the platform, a manager configuring alerts, or an operator responding to incidents, we have guides tailored for you.',
      ctaButtons: [
        { label: 'Admin Guide', href: '#admin', variant: 'primary' },
        { label: 'Operator Guide', href: '#operator', variant: 'secondary' }
      ]
    },
    sections: [
      {
        _type: 'landingSectionSteps',
        _key: 'admin-steps',
        title: 'Administrator Setup',
        description: 'Configure your NXGEN platform for your organization.',
        phases: [
          {
            phaseNumber: 1,
            title: 'Initial Configuration',
            description: 'Set up the foundation for your monitoring environment',
            steps: [
              { stepNumber: 1, title: 'Create Organization', description: 'Define your organization structure with regions and clusters to match your operational footprint.' },
              { stepNumber: 2, title: 'Configure Users & Roles', description: 'Set up user accounts with appropriate role-based permissions (Admin, Manager, Operator, Viewer).' },
              { stepNumber: 3, title: 'Define Alert Rules', description: 'Create alert policies with severity levels, notification channels, and escalation workflows.' }
            ]
          },
          {
            phaseNumber: 2,
            title: 'Station Onboarding',
            description: 'Add your monitoring stations and devices',
            steps: [
              { stepNumber: 4, title: 'Add Stations', description: 'Create station records with location, type, and ownership details. Use bulk import for large deployments.' },
              { stepNumber: 5, title: 'Connect Devices', description: 'Configure device connections using SNMP, Modbus, MQTT, or API integrations. Auto-discovery available.' },
              { stepNumber: 6, title: 'Verify Data Flow', description: 'Confirm telemetry is flowing correctly and sensors are reporting expected values.' }
            ]
          },
          {
            phaseNumber: 3,
            title: 'Video Integration',
            description: 'Connect your video surveillance systems',
            steps: [
              { stepNumber: 7, title: 'Configure VMS Connection', description: 'Link your Video Management System (Dahua, Hikvision, Milestone, or generic ONVIF).' },
              { stepNumber: 8, title: 'Associate Cameras', description: 'Map cameras to stations for context-aware video access during incidents.' },
              { stepNumber: 9, title: 'Test Video Feeds', description: 'Verify live view and playback functionality from the monitoring dashboard.' }
            ]
          }
        ]
      },
      {
        _type: 'landingSectionTabs',
        _key: 'role-tabs',
        title: 'Role-Based Quick Starts',
        description: 'Jump to the guide most relevant to your role.',
        tabs: [
          {
            id: 'admin',
            label: 'Administrator',
            icon: 'Shield',
            content: {
              title: 'Administrator Tasks',
              description: 'System configuration and user management',
              items: [
                { icon: 'Users', title: 'User Management', description: 'Create and manage user accounts, assign roles', status: 'Required' },
                { icon: 'Settings', title: 'System Settings', description: 'Configure global platform settings and integrations', status: 'Required' },
                { icon: 'Database', title: 'Data Retention', description: 'Set retention policies for historical data', status: 'Recommended' },
                { icon: 'Key', title: 'API Access', description: 'Generate API keys for third-party integrations', status: 'Optional' }
              ]
            }
          },
          {
            id: 'manager',
            label: 'Manager',
            icon: 'UserCog',
            content: {
              title: 'Manager Tasks',
              description: 'Configure monitoring policies and team workflows',
              items: [
                { icon: 'Bell', title: 'Alert Policies', description: 'Define alert rules, thresholds, and severity levels', status: 'Required' },
                { icon: 'Users2', title: 'Team Assignment', description: 'Assign operators to stations and shifts', status: 'Required' },
                { icon: 'FileText', title: 'Reports', description: 'Configure scheduled reports and dashboards', status: 'Recommended' },
                { icon: 'GitBranch', title: 'Escalation Rules', description: 'Set up escalation workflows for critical alerts', status: 'Recommended' }
              ]
            }
          },
          {
            id: 'operator',
            label: 'Operator',
            icon: 'Monitor',
            content: {
              title: 'Operator Tasks',
              description: 'Daily monitoring and incident response',
              items: [
                { icon: 'Eye', title: 'View Dashboard', description: 'Monitor real-time status of assigned stations', status: 'Daily' },
                { icon: 'AlertTriangle', title: 'Acknowledge Alerts', description: 'Respond to incoming alerts and document actions', status: 'As Needed' },
                { icon: 'Video', title: 'Check Video', description: 'Review camera feeds for visual confirmation', status: 'As Needed' },
                { icon: 'ClipboardList', title: 'Update Tickets', description: 'Log incident details and resolution notes', status: 'Required' }
              ]
            }
          }
        ]
      },
      {
        _type: 'landingSectionVideo',
        _key: 'video-tutorials',
        title: 'Video Tutorials',
        description: 'Watch step-by-step video guides for common tasks.',
        videoSource: 'embed',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoTitle: 'Getting Started with NXGEN',
        videoDescription: '10-minute overview of platform setup and basic operations.'
      },
      {
        _type: 'landingSectionCTA',
        _key: 'quickstart-cta',
        title: 'Need Help Getting Started?',
        description: 'Our support team is ready to help you configure your monitoring environment.',
        buttons: [
          { label: 'Contact Support', href: '/support', variant: 'primary' },
          { label: 'Browse Docs', href: '/docs', variant: 'secondary' }
        ]
      }
    ],
    status: 'published',
    publishedAt: today,
    lastUpdated: today
  },
  {
    _id: 'landing-page-integrations',
    _type: 'landingPage',
    title: 'Integrations Hub',
    slug: { _type: 'slug', current: 'integrations' },
    description: 'Connect NXGEN with your existing systems. Native integrations for video, IoT protocols, cloud services, and notification channels.',
    layoutType: 'standard',
    showBackground: true,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Integrations' }
    ],
    hero: {
      badge: { icon: 'Plug', text: 'Integrations' },
      headline: 'Connect Everything',
      subheadline: 'NXGEN integrates with your existing infrastructure out of the box. From video systems to IoT sensors, cloud platforms to incident management tools.',
      metrics: [
        { label: 'Integrations', value: '75+', icon: 'Plug', color: '#3B82F6' },
        { label: 'Protocols', value: '15+', icon: 'Cpu', color: '#10B981' },
        { label: 'API Calls/day', value: '50M', icon: 'Code', color: '#F59E0B' }
      ],
      ctaButtons: [
        { label: 'Browse All', href: '#categories', variant: 'primary' },
        { label: 'API Docs', href: '/docs/api', variant: 'outline' }
      ]
    },
    sections: [
      {
        _type: 'landingSectionFeatures',
        _key: 'featured-integrations',
        title: 'Featured Integrations',
        description: 'Most popular integrations used by NXGEN customers.',
        columns: 4,
        features: [
          { icon: 'Video', title: 'Dahua', description: 'Native integration with Dahua cameras and NVRs. Live view, playback, and alarm events.', color: '#3B82F6', value: 'Certified' },
          { icon: 'Camera', title: 'Hikvision', description: 'Full support for Hikvision devices including smart events and ANPR.', color: '#EF4444', value: 'Certified' },
          { icon: 'Videotape', title: 'Milestone', description: 'Integration with Milestone XProtect for enterprise video management.', color: '#F59E0B', value: 'Certified' },
          { icon: 'Disc', title: 'Genetec', description: 'Connect Genetec Security Center for unified security operations.', color: '#10B981', value: 'Certified' },
          { icon: 'Cpu', title: 'Modbus', description: 'Industrial protocol support for PLCs, RTUs, and SCADA systems.', color: '#8B5CF6', value: 'Native' },
          { icon: 'Network', title: 'SNMP', description: 'Network device monitoring with support for all SNMP versions.', color: '#06B6D4', value: 'Native' },
          { icon: 'Cloud', title: 'AWS IoT', description: 'Cloud connector for AWS IoT Core and related services.', color: '#F97316', value: 'Native' },
          { icon: 'MessageSquare', title: 'Slack', description: 'Real-time alert notifications to Slack channels.', color: '#4A154B', value: 'Native' }
        ]
      },
      {
        _type: 'landingSectionTabs',
        _key: 'category-tabs',
        title: 'Integration Categories',
        description: 'Browse integrations by category.',
        tabs: [
          {
            id: 'video',
            label: 'Video',
            icon: 'Video',
            content: {
              title: 'Video Management Systems',
              description: 'Integrate CCTV and video surveillance platforms',
              items: [
                { icon: 'Video', title: 'Dahua', description: 'Cameras, NVRs, XVRs', status: 'Certified' },
                { icon: 'Camera', title: 'Hikvision', description: 'Full device support', status: 'Certified' },
                { icon: 'Circle', title: 'Axis', description: 'Axis cameras and encoders', status: 'Certified' },
                { icon: 'Videotape', title: 'Milestone', description: 'XProtect integration', status: 'Certified' },
                { icon: 'Disc', title: 'Genetec', description: 'Security Center', status: 'Certified' },
                { icon: 'Scan', title: 'ONVIF', description: 'Generic ONVIF support', status: 'Compatible' }
              ]
            }
          },
          {
            id: 'iot',
            label: 'IoT',
            icon: 'Cpu',
            content: {
              title: 'IoT & Industrial Protocols',
              description: 'Connect sensors and industrial equipment',
              items: [
                { icon: 'Cpu', title: 'Modbus TCP/RTU', description: 'Industrial standard protocol', status: 'Native' },
                { icon: 'Network', title: 'SNMP v1/v2c/v3', description: 'Network device monitoring', status: 'Native' },
                { icon: 'Radio', title: 'MQTT', description: 'Lightweight pub/sub protocol', status: 'Native' },
                { icon: 'Building2', title: 'BACnet', description: 'Building automation', status: 'Native' },
                { icon: 'Factory', title: 'OPC-UA', description: 'Industrial connectivity', status: 'Native' },
                { icon: 'Wifi', title: 'LoRaWAN', description: 'Long-range IoT sensors', status: 'Native' }
              ]
            }
          },
          {
            id: 'cloud',
            label: 'Cloud',
            icon: 'Cloud',
            content: {
              title: 'Cloud Platforms',
              description: 'Connect to major cloud providers',
              items: [
                { icon: 'Cloud', title: 'AWS IoT Core', description: 'Amazon Web Services', status: 'Native' },
                { icon: 'Cloud', title: 'Azure IoT Hub', description: 'Microsoft Azure', status: 'Native' },
                { icon: 'Cloud', title: 'Google Cloud IoT', description: 'Google Cloud Platform', status: 'Native' },
                { icon: 'Database', title: 'InfluxDB', description: 'Time-series database', status: 'Native' },
                { icon: 'BarChart', title: 'Grafana', description: 'Visualization platform', status: 'Compatible' }
              ]
            }
          },
          {
            id: 'notifications',
            label: 'Notifications',
            icon: 'Bell',
            content: {
              title: 'Notification Channels',
              description: 'Alert delivery and incident management',
              items: [
                { icon: 'Mail', title: 'Email/SMS', description: 'Direct notifications', status: 'Native' },
                { icon: 'MessageSquare', title: 'Slack', description: 'Channel notifications', status: 'Native' },
                { icon: 'Users', title: 'Microsoft Teams', description: 'Team notifications', status: 'Native' },
                { icon: 'Phone', title: 'PagerDuty', description: 'Incident management', status: 'Native' },
                { icon: 'ClipboardList', title: 'ServiceNow', description: 'IT service management', status: 'Native' },
                { icon: 'Webhook', title: 'Webhooks', description: 'Custom integrations', status: 'Native' }
              ]
            }
          }
        ]
      },
      {
        _type: 'landingSectionContentGrid',
        _key: 'api-options',
        title: 'API Integration Options',
        description: 'Build custom integrations with our comprehensive APIs.',
        columns: 2,
        items: [
          { icon: 'Code', title: 'REST API', description: 'Full-featured RESTful API for all platform operations. OpenAPI 3.0 specification available.', link: '/docs/api/rest', listItems: ['CRUD operations', 'Bulk imports', 'Real-time queries', 'Webhook callbacks'] },
          { icon: 'Graphql', title: 'GraphQL API', description: 'Flexible query language for efficient data retrieval. Request exactly what you need.', link: '/docs/api/graphql', listItems: ['Flexible queries', 'Single endpoint', 'Type safety', 'Introspection'] },
          { icon: 'Webhook', title: 'Webhooks', description: 'Event-driven notifications for real-time integrations.', link: '/docs/api/webhooks', listItems: ['Alert events', 'Status changes', 'Custom triggers', 'Retry logic'] },
          { icon: 'Download', title: 'SDKs', description: 'Native SDKs for popular programming languages.', link: '/docs/api/sdks', listItems: ['JavaScript/Node.js', 'Python', 'Go', 'Java'] }
        ]
      },
      {
        _type: 'landingSectionCTA',
        _key: 'integrations-cta',
        title: 'Need a Custom Integration?',
        description: 'Our team can help build integrations for your specific requirements.',
        buttons: [
          { label: 'Contact Us', href: '/contact', variant: 'primary' },
          { label: 'API Documentation', href: '/docs/api', variant: 'secondary' }
        ]
      }
    ],
    status: 'published',
    publishedAt: today,
    lastUpdated: today
  },
  {
    _id: 'landing-page-alerts',
    _type: 'landingPage',
    title: 'Alert Management',
    slug: { _type: 'slug', current: 'alerts' },
    description: 'Comprehensive alert management for critical infrastructure. Intelligent alerting, multi-channel notifications, and automated escalation workflows.',
    layoutType: 'standard',
    showBackground: true,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Alert Management' }
    ],
    hero: {
      badge: { icon: 'BellRing', text: 'Alert System' },
      headline: 'Never Miss a Critical Alert',
      subheadline: 'Intelligent alerting reduces noise by 90% while ensuring critical issues reach the right people instantly. Configure once, respond faster.',
      metrics: [
        { label: 'Noise Reduction', value: '90%', icon: 'Filter', color: '#10B981' },
        { label: 'Alert Latency', value: '<5 sec', icon: 'Zap', color: '#F59E0B' },
        { label: 'Channels', value: '12+', icon: 'Bell', color: '#3B82F6' }
      ],
      ctaButtons: [
        { label: 'Configure Alerts', href: '/docs/alerts/setup', variant: 'primary' },
        { label: 'View Best Practices', href: '#best-practices', variant: 'outline' }
      ]
    },
    sections: [
      {
        _type: 'landingSectionFeatures',
        _key: 'alert-types',
        title: 'Alert Types & Severity',
        description: 'Flexible alert classification for appropriate response prioritization.',
        columns: 4,
        features: [
          { icon: 'AlertOctagon', title: 'Critical', description: 'Immediate action required. Service impact or safety risk. Auto-escalation enabled.', color: '#EF4444', value: 'P1' },
          { icon: 'AlertTriangle', title: 'High', description: 'Urgent attention needed. Potential service degradation if unaddressed.', color: '#F97316', value: 'P2' },
          { icon: 'AlertCircle', title: 'Medium', description: 'Important but not urgent. Address within SLA timeframes.', color: '#F59E0B', value: 'P3' },
          { icon: 'Info', title: 'Low', description: 'Informational alerts for awareness. No immediate action required.', color: '#3B82F6', value: 'P4' }
        ]
      },
      {
        _type: 'landingSectionFeatures',
        _key: 'notification-channels',
        title: 'Notification Channels',
        description: 'Multi-channel alert delivery ensures your team gets notified.',
        columns: 3,
        features: [
          { icon: 'Mail', title: 'Email', description: 'Rich HTML emails with alert details, context, and action links.', color: '#3B82F6', value: 'Native' },
          { icon: 'Smartphone', title: 'SMS', description: 'Text message alerts for critical incidents. Global coverage.', color: '#10B981', value: 'Native' },
          { icon: 'Phone', title: 'Voice Call', description: 'Automated voice calls for critical alerts. Text-to-speech.', color: '#EF4444', value: 'Native' },
          { icon: 'MessageSquare', title: 'Slack', description: 'Real-time notifications to Slack channels with interactive buttons.', color: '#4A154B', value: 'Native' },
          { icon: 'Users', title: 'Teams', description: 'Microsoft Teams notifications with adaptive cards.', color: '#5059C9', value: 'Native' },
          { icon: 'Phone', title: 'PagerDuty', description: 'Integration with PagerDuty for on-call management.', color: '#06AC38', value: 'Native' },
          { icon: 'ClipboardList', title: 'ServiceNow', description: 'Auto-create incidents in ServiceNow.', color: '#00C654', value: 'Native' },
          { icon: 'Webhook', title: 'Webhooks', description: 'Custom webhook endpoints for any integration.', color: '#8B5CF6', value: 'Native' },
          { icon: 'App', title: 'Mobile Push', description: 'iOS and Android push notifications via NXGEN app.', color: '#EC4899', value: 'Native' }
        ]
      },
      {
        _type: 'landingSectionSteps',
        _key: 'escalation-steps',
        title: 'Escalation Workflows',
        description: 'Automated escalation ensures critical alerts are never missed.',
        phases: [
          {
            phaseNumber: 1,
            title: 'Initial Alert',
            description: 'Alert triggered by threshold breach or event',
            steps: [
              { stepNumber: 1, title: 'Alert Generated', description: 'System detects anomaly or receives external event and creates alert record.' },
              { stepNumber: 2, title: 'Enrichment', description: 'Alert enriched with context: station info, related devices, historical data.' },
              { stepNumber: 3, title: 'Routing', description: 'Alert routed to appropriate team based on station assignment and alert type.' }
            ]
          },
          {
            phaseNumber: 2,
            title: 'First Response',
            description: 'Initial notification and response window',
            steps: [
              { stepNumber: 4, title: 'Notification Sent', description: 'Primary on-call operator receives notification via configured channels.' },
              { stepNumber: 5, title: 'Acknowledge Window', description: 'Operator has configurable window (default: 15 min) to acknowledge alert.' },
              { stepNumber: 6, title: 'Response Logged', description: 'Acknowledgment and response actions logged for audit trail.' }
            ]
          },
          {
            phaseNumber: 3,
            title: 'Escalation',
            description: 'Automated escalation if unacknowledged',
            steps: [
              { stepNumber: 7, title: 'Level 2 Escalation', description: 'If unacknowledged, alert escalated to secondary on-call or team lead.' },
              { stepNumber: 8, title: 'Level 3 Escalation', description: 'Critical alerts escalate to management after extended window.' },
              { stepNumber: 9, title: 'Auto-Resolution', description: 'Non-critical alerts auto-resolve if conditions return to normal.' }
            ]
          }
        ]
      },
      {
        _type: 'landingSectionContentGrid',
        _key: 'best-practices',
        title: 'Alert Best Practices',
        description: 'Optimize your alert configuration for maximum effectiveness.',
        columns: 2,
        items: [
          { icon: 'Filter', title: 'Reduce Alert Noise', description: 'Use correlation rules to group related alerts and prevent notification storms.', listItems: ['Set appropriate thresholds', 'Use alert suppression windows', 'Configure maintenance windows', 'Enable smart grouping'] },
          { icon: 'Target', title: 'Right-Size Routing', description: 'Ensure alerts reach the right people at the right time.', listItems: ['Define clear on-call schedules', 'Use station-based routing', 'Configure escalation policies', 'Set business hours rules'] },
          { icon: 'FileText', title: 'Document Everything', description: 'Maintain audit trails and enable continuous improvement.', listItems: ['Require acknowledgment notes', 'Track resolution times', 'Review alert metrics weekly', 'Tune thresholds monthly'] },
          { icon: 'Users', title: 'Train Your Team', description: 'Ensure operators can respond effectively to any alert scenario.', listItems: ['Conduct regular drills', 'Review past incidents', 'Update runbooks', 'Share lessons learned'] }
        ]
      },
      {
        _type: 'landingSectionCTA',
        _key: 'alerts-cta',
        title: 'Ready to Optimize Your Alerting?',
        description: 'Configure intelligent alerting that reduces noise while ensuring critical issues are never missed.',
        buttons: [
          { label: 'Setup Alerts', href: '/docs/alerts/setup', variant: 'primary' },
          { label: 'View Integration Options', href: '/integrations#notifications', variant: 'secondary' }
        ]
      }
    ],
    status: 'published',
    publishedAt: today,
    lastUpdated: today
  }
];

async function seedLandingPages() {
  console.log('Seeding landing pages to Sanity...\n');
  
  for (const page of landingPages) {
    try {
      await client.createOrReplace(page);
      console.log(`Created: ${page.title} (/ ${page.slug.current})`);
    } catch (err) {
      console.error(`Error creating ${page.title}:`, err.message);
    }
  }
  
  console.log('\nSeeding complete!');
}

seedLandingPages().catch(console.error);
