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

const REMAINING_MANUFACTURERS = [
  {
    name: 'Teltonika IOT',
    slug: 'teltonika-iot',
    description: 'Configuration guide for Teltonika IOT devices, routers, and telemetry gateways in GCXONE',
    deviceTypes: ['Routers', 'Telemetry Gateways', 'GPS Trackers', 'IoT Sensors'],
    features: ['Remote monitoring', 'Data collection', 'GPS tracking', 'Telemetry reporting'],
    protocol: 'MQTT, HTTP API, Modbus',
  },
  {
    name: 'Vivotek',
    slug: 'vivotek',
    description: 'Configuration guide for Vivotek IP cameras and video surveillance systems in GCXONE',
    deviceTypes: ['IP Cameras', 'Network Video Recorders', 'Video Encoders', 'Accessories'],
    features: ['Live streaming', 'Recording playback', 'Smart analytics', 'Motion detection'],
    protocol: 'ONVIF, RTSP, Vivotek API',
  },
  {
    name: 'Vivotek Vortex',
    slug: 'vivotek-vortex',
    description: 'Configuration guide for Vivotek Vortex cloud-based video surveillance in GCXONE',
    deviceTypes: ['Cloud Cameras', 'Vortex NVRs', 'Cloud Storage'],
    features: ['Cloud recording', 'Remote access', 'AI analytics', 'Smart search'],
    protocol: 'Vortex Cloud API, RTSP',
  },
  {
    name: 'Reconeyez',
    slug: 'reconeyez',
    description: 'Configuration guide for Reconeyez wireless surveillance and video verification systems in GCXONE',
    deviceTypes: ['Wireless Cameras', 'PIR Sensors', 'Video Verification Devices', 'Hubs'],
    features: ['Wireless operation', 'Battery powered', 'Video verification', 'Instant alerts'],
    protocol: 'Reconeyez Cloud API, Webhook',
  },
  {
    name: 'EFOY',
    slug: 'efoy',
    description: 'Configuration guide for EFOY fuel cell power systems and monitoring in GCXONE',
    deviceTypes: ['Fuel Cells', 'Power Systems', 'Monitoring Controllers'],
    features: ['Power monitoring', 'Fuel level tracking', 'Maintenance alerts', 'Status reporting'],
    protocol: 'Modbus, HTTP API',
  },
  {
    name: 'Innovi',
    slug: 'innovi',
    description: 'Configuration guide for Innovi video analytics and intrusion detection systems in GCXONE',
    deviceTypes: ['Analytics Servers', 'Video Analytics Software', 'Intrusion Systems'],
    features: ['Video analytics', 'Intrusion detection', 'Perimeter protection', 'AI classification'],
    protocol: 'ONVIF, RTSP, Innovi API',
  },
  {
    name: 'Davantis',
    slug: 'davantis',
    description: 'Configuration guide for Davantis perimeter protection and video analytics in GCXONE',
    deviceTypes: ['Analytics Appliances', 'Perimeter Systems', 'Video Analytics'],
    features: ['Perimeter protection', 'Video analytics', 'False alarm reduction', 'Zone monitoring'],
    protocol: 'ONVIF, RTSP, HTTP API',
  },
  {
    name: 'Rosenberger',
    slug: 'rosenberger',
    description: 'Configuration guide for Rosenberger antennas and RF equipment monitoring in GCXONE',
    deviceTypes: ['Antennas', 'RF Equipment', 'Monitoring Systems', 'DAS'],
    features: ['Signal monitoring', 'RF performance tracking', 'Equipment status', 'Maintenance alerts'],
    protocol: 'SNMP, HTTP API',
  },
  {
    name: 'Autoaid',
    slug: 'autoaid',
    description: 'Configuration guide for Autoaid vehicle diagnostic and tracking systems in GCXONE',
    deviceTypes: ['OBD Dongles', 'GPS Trackers', 'Diagnostic Tools', 'Fleet Devices'],
    features: ['Vehicle diagnostics', 'GPS tracking', 'Fleet management', 'Maintenance alerts'],
    protocol: 'HTTP API, MQTT',
  },
  {
    name: 'Auraigateway',
    slug: 'auraigateway',
    description: 'Configuration guide for Auraigateway IoT integration platform in GCXONE',
    deviceTypes: ['IoT Gateways', 'Integration Hubs', 'Protocol Converters'],
    features: ['Multi-protocol support', 'Data aggregation', 'Cloud connectivity', 'Edge processing'],
    protocol: 'MQTT, HTTP, Modbus, BACnet',
  },
  {
    name: 'Onvif',
    slug: 'onvif',
    description: 'Configuration guide for generic ONVIF-compliant devices and cameras in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'Video Encoders', 'Access Control'],
    features: ['Standard protocol support', 'Device discovery', 'Live streaming', 'PTZ control'],
    protocol: 'ONVIF Profile S, G, T, RTSP',
  },
  {
    name: 'Spykebox',
    slug: 'spykebox',
    description: 'Configuration guide for Spykebox video verification and alarm systems in GCXONE',
    deviceTypes: ['Video Verification Units', 'Alarm Panels', 'PIR Cameras', 'Hubs'],
    features: ['Video verification', 'Alarm monitoring', 'Wireless sensors', 'Instant notifications'],
    protocol: 'Spykebox API, Webhook',
  },
  {
    name: 'Viasys/ShieldBox',
    slug: 'viasys-shieldbox',
    description: 'Configuration guide for Viasys ShieldBox cybersecurity and network protection in GCXONE',
    deviceTypes: ['ShieldBox Appliances', 'Security Gateways', 'Network Protection'],
    features: ['Network security', 'Threat detection', 'Access control', 'Monitoring'],
    protocol: 'HTTPS API, SNMP',
  },
  {
    name: 'Essence My Shield',
    slug: 'essence-my-shield',
    description: 'Configuration guide for Essence My Shield personal safety and PERS devices in GCXONE',
    deviceTypes: ['Personal Alarms', 'PERS Devices', 'Wearables', 'Fall Detectors'],
    features: ['Personal safety', 'Fall detection', 'GPS tracking', 'Emergency alerts'],
    protocol: 'Essence Cloud API, Webhook',
  },
  {
    name: 'Miwi Urmet/Grundig',
    slug: 'miwi-urmet-grundig',
    description: 'Configuration guide for Miwi Urmet Grundig intercom and access systems in GCXONE',
    deviceTypes: ['Intercoms', 'Access Panels', 'IP Cameras', 'Door Stations'],
    features: ['Video intercom', 'Access control', 'Two-way audio', 'Door release'],
    protocol: 'SIP, ONVIF, RTSP',
  },
  {
    name: 'NXG Cloud NVR',
    slug: 'nxg-cloud-nvr',
    description: 'Configuration guide for NXG Cloud NVR video recording and storage platform in GCXONE',
    deviceTypes: ['Cloud NVR', 'Video Storage', 'Recording Services'],
    features: ['Cloud recording', 'Remote playback', 'Scalable storage', 'Multi-site support'],
    protocol: 'NXG Cloud API, RTSP, ONVIF',
  },
];

function createPortableTextBody(manufacturer) {
  return [
    {
      _type: 'block',
      _key: `overview-${manufacturer.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `overview-span-${manufacturer.slug}`, text: 'Overview' }],
    },
    {
      _type: 'block',
      _key: `overview-content-${manufacturer.slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `overview-text-${manufacturer.slug}`,
          text: `${manufacturer.name} devices integrate with GCXONE to provide comprehensive monitoring and management capabilities. This guide covers the configuration steps required to connect your ${manufacturer.name} devices to the GCXONE platform.`,
        },
      ],
    },
    {
      _type: 'block',
      _key: `supported-devices-${manufacturer.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `supported-span-${manufacturer.slug}`, text: 'Supported Devices' }],
    },
    {
      _type: 'block',
      _key: `devices-list-${manufacturer.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: manufacturer.deviceTypes.map((type, i) => ({
        _type: 'span',
        _key: `device-${manufacturer.slug}-${i}`,
        text: type,
      })),
    },
    {
      _type: 'block',
      _key: `features-${manufacturer.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `features-span-${manufacturer.slug}`, text: 'Integration Features' }],
    },
    {
      _type: 'block',
      _key: `features-list-${manufacturer.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: manufacturer.features.map((feature, i) => ({
        _type: 'span',
        _key: `feature-${manufacturer.slug}-${i}`,
        text: feature,
      })),
    },
    {
      _type: 'block',
      _key: `prerequisites-${manufacturer.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `prereq-span-${manufacturer.slug}`, text: 'Prerequisites' }],
    },
    {
      _type: 'block',
      _key: `prereq-content-${manufacturer.slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `prereq-text-${manufacturer.slug}`,
          text: 'Before configuring your device, ensure you have:',
        },
      ],
    },
    {
      _type: 'block',
      _key: `prereq-list-1-${manufacturer.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-1-${manufacturer.slug}`, text: 'Network connectivity between the device and GCXONE servers' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-2-${manufacturer.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-2-${manufacturer.slug}`, text: 'Device administrator credentials' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-3-${manufacturer.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-3-${manufacturer.slug}`, text: 'Appropriate ports open on your firewall' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-4-${manufacturer.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-4-${manufacturer.slug}`, text: `Protocol support: ${manufacturer.protocol}` }],
    },
    {
      _type: 'block',
      _key: `config-${manufacturer.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `config-span-${manufacturer.slug}`, text: 'Configuration Steps' }],
    },
    {
      _type: 'procedure',
      _key: `procedure-${manufacturer.slug}`,
      title: `${manufacturer.name} Device Configuration`,
      difficulty: 'intermediate',
      estimatedTime: '15-20 min',
      steps: [
        {
          title: 'Access Device Settings',
          body: [
            {
              _type: 'block',
              _key: `step1-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step1-text-${manufacturer.slug}`,
                  text: `Log in to your ${manufacturer.name} device's web interface or management portal using administrator credentials. Navigate to the network or integration settings section.`,
                },
              ],
            },
          ],
        },
        {
          title: 'Configure Network Settings',
          body: [
            {
              _type: 'block',
              _key: `step2-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step2-text-${manufacturer.slug}`,
                  text: 'Ensure the device has a static IP address or reliable DNS resolution. Configure the gateway settings to allow communication with GCXONE servers.',
                },
              ],
            },
          ],
        },
        {
          title: 'Enable Protocol Support',
          body: [
            {
              _type: 'block',
              _key: `step3-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step3-text-${manufacturer.slug}`,
                  text: `Enable the required protocols (${manufacturer.protocol}) in the device settings. For ONVIF devices, ensure the ONVIF service is enabled and configure the appropriate port.`,
                },
              ],
            },
          ],
        },
        {
          title: 'Create Integration Account',
          body: [
            {
              _type: 'block',
              _key: `step4-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step4-text-${manufacturer.slug}`,
                  text: 'Create a dedicated user account for GCXONE integration with appropriate permissions. Assign operator-level access for monitoring and event reception.',
                },
              ],
            },
          ],
        },
        {
          title: 'Add Device to GCXONE',
          body: [
            {
              _type: 'block',
              _key: `step5-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step5-text-${manufacturer.slug}`,
                  text: 'In the GCXONE portal, navigate to Devices > Add Device. Select the device type, enter the connection details, and test the connection before saving.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      _type: 'callout',
      _key: `callout-${manufacturer.slug}`,
      type: 'tip',
      title: 'Best Practice',
      body: [
        {
          _type: 'block',
          _key: `callout-body-${manufacturer.slug}`,
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: `callout-text-${manufacturer.slug}`,
              text: 'Always test the connection after configuration. Use the diagnostic tools in GCXONE to verify data streaming and event reception before deploying to production.',
            },
          ],
        },
      ],
    },
    {
      _type: 'block',
      _key: `troubleshooting-${manufacturer.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `troubleshoot-span-${manufacturer.slug}`, text: 'Troubleshooting' }],
    },
    {
      _type: 'accordion',
      _key: `accordion-${manufacturer.slug}`,
      items: [
        {
          title: 'Connection Failed',
          content: [
            {
              _type: 'block',
              _key: `trouble1-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble1-text-${manufacturer.slug}`,
                  text: 'Verify network connectivity, check firewall rules, and ensure the correct ports are open. Confirm the device credentials are correct.',
                },
              ],
            },
          ],
        },
        {
          title: 'No Data Received',
          content: [
            {
              _type: 'block',
              _key: `trouble2-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble2-text-${manufacturer.slug}`,
                  text: 'Check that the appropriate protocol is enabled and configured correctly. Verify API endpoints, stream URLs, or data subscription settings.',
                },
              ],
            },
          ],
        },
        {
          title: 'Events Not Received',
          content: [
            {
              _type: 'block',
              _key: `trouble3-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble3-text-${manufacturer.slug}`,
                  text: 'Configure event notifications in the device settings. Verify webhook URLs or event subscription settings are correctly configured.',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

function createDeviceDoc(manufacturer) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    _id: `doc-devices-${manufacturer.slug}`,
    _type: 'doc',
    title: `${manufacturer.name} Integration Guide`,
    slug: { _type: 'slug', current: `devices/${manufacturer.slug}` },
    description: manufacturer.description,
    targetAudience: ['operator', 'admin'],
    status: 'published',
    lastUpdated: today,
    sidebarPosition: 100,
    tags: ['devices', 'integration', manufacturer.slug, manufacturer.name.toLowerCase().replace(/[^a-z0-9]/g, '-')],
    body: createPortableTextBody(manufacturer),
  };
}

async function seedRemainingDeviceDocs() {
  console.log('Seeding remaining device documentation to Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  console.log('Checking existing device docs...\n');

  const existingDocs = await client.fetch(
    `*[_type == "doc" && slug.current match "devices/*"]{ _id, title, "slug": slug.current }`
  );
  console.log(`Found ${existingDocs.length} existing device docs:`);
  existingDocs.forEach(doc => console.log(`  - ${doc.title} (${doc.slug})`));
  console.log('');

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const manufacturer of REMAINING_MANUFACTURERS) {
    const doc = createDeviceDoc(manufacturer);
    const slug = doc.slug.current;

    try {
      const existing = existingDocs.find(d => d.slug === slug);

      if (existing) {
        console.log(`Skipping: ${manufacturer.name} (doc already exists at /${slug})`);
        skipped++;
        continue;
      }

      await client.create(doc);
      console.log(`Created: ${manufacturer.name} Integration Guide (/${slug})`);
      created++;
    } catch (err) {
      console.error(`Error creating ${manufacturer.name}:`, err.message);
      errors++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total manufacturers to process: ${REMAINING_MANUFACTURERS.length}`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log('\nSeeding complete!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

seedRemainingDeviceDocs().catch(console.error);
