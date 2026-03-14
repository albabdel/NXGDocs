#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN,
  useCdn: false,
});

const today = new Date().toISOString().slice(0, 10);

const integrationHubPage = {
  _id: 'landing-page-integration-hub',
  _type: 'landingPage',
  title: 'Integration Hub',
  slug: { _type: 'slug', current: 'integration-hub' },
  description: 'Browse supported devices and integrations for the NXGEN monitoring platform',
  layoutType: 'standard',
  showBackground: true,
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Integration Hub' }
  ],
  hero: {
    badge: { icon: 'Cpu', text: 'Devices' },
    headline: 'Integration Hub',
    subheadline: 'Browse 50 supported devices and integrations for your monitoring infrastructure',
    metrics: [
      { label: 'Supported Devices', value: '50+', icon: 'Cpu', color: '#10B981' },
      { label: 'Manufacturers', value: '25+', icon: 'Building', color: '#3B82F6' },
      { label: 'Features', value: '15+', icon: 'Zap', color: '#F59E0B' }
    ],
    ctaButtons: [
      { label: 'Browse Devices', href: '#device-grid', variant: 'primary' },
      { label: 'View Integrations', href: '#device-grid', variant: 'secondary' }
    ]
  },
  sections: [
    {
      _type: 'landingSectionFeatures',
      _key: 'integration-categories',
      title: 'Integration Categories',
      description: 'Explore supported device types and integration options for your monitoring infrastructure.',
      columns: 4,
      features: [
        { icon: 'Video', title: 'Video & CCTV', description: 'IP cameras, NVRs, and video management systems for visual monitoring.', color: '#3B82F6', value: '20+' },
        { icon: 'Cpu', title: 'IoT Sensors', description: 'Environmental sensors, power meters, and industrial controllers.', color: '#10B981', value: '15+' },
        { icon: 'RadioTower', title: 'Network Devices', description: 'Routers, switches, and network infrastructure monitoring.', color: '#8B5CF6', value: '10+' },
        { icon: 'Zap', title: 'Power Systems', description: 'UPS, generators, rectifiers, and power distribution units.', color: '#F59E0B', value: '5+' }
      ]
    },
    {
      _type: 'landingSectionContentGrid',
      _key: 'device-grid',
      title: 'Supported Devices',
      description: 'Browse our growing library of supported devices and integrations.',
      columns: 3,
      items: [
        { icon: 'Video', title: 'Dahua', description: 'Cameras, NVRs, XVRs with native integration', link: '/integrations/dahua', listItems: ['IP Cameras', 'NVR/XVR', 'PTZ Control', 'Smart Events'] },
        { icon: 'Camera', title: 'Hikvision', description: 'Full device support with alarm events', link: '/integrations/hikvision', listItems: ['IP Cameras', 'NVR', 'ANPR', 'Face Detection'] },
        { icon: 'Circle', title: 'Axis', description: 'Axis cameras and encoders', link: '/integrations/axis', listItems: ['Network Cameras', 'Encoders', 'Analytics', 'ONVIF'] },
        { icon: 'Videotape', title: 'Milestone', description: 'XProtect VMS integration', link: '/integrations/milestone', listItems: ['XProtect', 'Camera Sync', 'Live View', 'Playback'] },
        { icon: 'Cpu', title: 'Modbus', description: 'Industrial protocol support', link: '/integrations/modbus', listItems: ['Modbus TCP', 'Modbus RTU', 'PLCs', 'RTUs'] },
        { icon: 'Network', title: 'SNMP', description: 'Network device monitoring', link: '/integrations/snmp', listItems: ['SNMP v1/v2c/v3', 'Routers', 'Switches', 'UPS'] },
        { icon: 'Radio', title: 'MQTT', description: 'IoT pub/sub protocol', link: '/integrations/mqtt', listItems: ['Sensors', 'Telemetry', 'Commands', 'Real-time'] },
        { icon: 'Cloud', title: 'AWS IoT', description: 'Amazon Web Services integration', link: '/integrations/aws-iot', listItems: ['IoT Core', 'Kinesis', 'S3', 'Lambda'] }
      ]
    },
    {
      _type: 'landingSectionCapabilities',
      _key: 'integration-features',
      title: 'Integration Features',
      description: 'Enterprise-grade integration capabilities for seamless monitoring.',
      capabilities: [
        { icon: 'RefreshCw', title: 'Auto-Discovery', value: 'Zero-Config', description: 'Automatic device detection reduces setup time significantly.', color: '#3B82F6' },
        { icon: 'Shield', title: 'Secure', value: 'TLS/SSL', description: 'Encrypted communications for all device connections.', color: '#10B981' },
        { icon: 'Globe', title: 'Multi-Vendor', value: '50+', description: 'Support for devices from multiple manufacturers.', color: '#8B5CF6' },
        { icon: 'Zap', title: 'Real-Time', value: '<1s', description: 'Sub-second data collection and alerting.', color: '#F59E0B' },
        { icon: 'Database', title: 'Historical', value: '7 Years', description: 'Long-term data retention for compliance.', color: '#06B6D4' },
        { icon: 'Code', title: 'API Access', value: 'REST+GraphQL', description: 'Full API access for custom integrations.', color: '#EC4899' }
      ]
    },
    {
      _type: 'landingSectionCTA',
      _key: 'integration-hub-cta',
      title: 'Need a Custom Integration?',
      description: 'Our team can help integrate your specific devices and systems.',
      buttons: [
        { label: 'Contact Us', href: '/contact', variant: 'primary' },
        { label: 'API Documentation', href: '/docs/api', variant: 'secondary' }
      ]
    }
  ],
  status: 'published',
  publishedAt: today,
  lastUpdated: today
};

async function seedIntegrationHubPage() {
  console.log('Seeding Integration Hub landing page to Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  try {
    const existing = await client.getDocument(integrationHubPage._id);
    if (existing) {
      console.log('Found existing page, updating...');
    }
  } catch (err) {
    console.log('No existing page found, creating new...');
  }

  try {
    await client.createOrReplace(integrationHubPage);
    console.log(`Created: ${integrationHubPage.title} (/${integrationHubPage.slug.current})`);
  } catch (err) {
    console.error(`Error creating ${integrationHubPage.title}:`, err.message);
  }

  console.log('\nSeeding complete!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

seedIntegrationHubPage().catch(console.error);
