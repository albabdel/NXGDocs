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

const MISSING_DEVICES = [
  {
    name: 'Honeywell',
    slug: 'honeywell',
    description: 'Configuration guide for Honeywell security devices including ADPRO NVRs and IP cameras in GCXONE',
    deviceTypes: ['ADPRO NVRs', 'IP Cameras', '35 Series NVRs', 'Performance Series'],
    features: ['Live streaming', 'Recording playback', 'Alarm events', 'Arm/disarm', 'Motion detection'],
    protocol: 'ADPRO SDK, RTSP, ONVIF',
    integrations: ['Honeywell', 'Honeywell ADPRO', 'Honeywell 35 Series'],
  },
  {
    name: 'ADPRO',
    slug: 'adpro',
    description: 'Configuration guide for ADPRO NVRs and video surveillance systems in GCXONE',
    deviceTypes: ['ADPRO NVRs', 'Video Transmitters', 'Hybrid Recorders'],
    features: ['Live streaming', 'Recording playback', 'Alarm transmission', 'Remote monitoring'],
    protocol: 'ADPRO SDK, RTSP',
    integrations: ['ADPRO', 'ADPRO NVR'],
  },
  {
    name: 'NXG Cloud NVR',
    slug: 'nxg-cloud-nvr',
    description: 'Configuration guide for NXG Cloud NVR systems in GCXONE',
    deviceTypes: ['Cloud NVR', 'Video Storage', 'Hybrid Systems'],
    features: ['Cloud recording', 'Live streaming', 'Event triggers', 'Remote access'],
    protocol: 'HTTP API, WebRTC',
    integrations: ['NXG Cloud NVR', 'NXG'],
  },
  {
    name: 'SPYKEBOX',
    slug: 'spykebox',
    description: 'Configuration guide for SPYKEBOX video surveillance devices in GCXONE',
    deviceTypes: ['NVR', 'Video Systems', 'Mobile DVR'],
    features: ['Live streaming', 'Recording', 'GPS tracking', 'Event handling'],
    protocol: 'HTTP API, RTSP',
    integrations: ['SPYKEBOX', 'Spykebox'],
  },
  {
    name: 'Ganz',
    slug: 'ganz',
    description: 'Configuration guide for Ganz AI boxes, IP cameras, and video systems in GCXONE',
    deviceTypes: ['AI Boxes', 'IP Cameras', 'Video Analytics', 'NVRs'],
    features: ['AI detection', 'Live streaming', 'Event alerts', 'Analytics', 'Object detection'],
    protocol: 'HTTP API, RTSP, Webhook',
    integrations: ['Ganz', 'Ganz AI'],
  },
  {
    name: 'Heitel',
    slug: 'heitel',
    description: 'Configuration guide for Heitel NVRs and video recording systems in GCXONE',
    deviceTypes: ['NVRs', 'Video Recorders', 'Hybrid Systems'],
    features: ['Live streaming', 'Event handling', 'Recording', 'Alarm integration'],
    protocol: 'Heitel TCP Protocol, RTSP',
    integrations: ['Heitel', 'Heitel NVR'],
  },
  {
    name: 'Uniview',
    slug: 'uniview',
    description: 'Configuration guide for Uniview IP cameras, NVRs, and video surveillance systems in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'PTZ Cameras', 'Thermal Cameras', 'Video Intercoms'],
    features: ['Live streaming', 'Recording playback', 'Smart events', 'PTZ control', 'ANPR'],
    protocol: 'ONVIF, RTSP, Uniview SDK',
    integrations: ['Uniview', 'UNV'],
  },
  {
    name: 'Davantis',
    slug: 'davantis',
    description: 'Configuration guide for Davantis video analytics and perimeter protection systems in GCXONE',
    deviceTypes: ['Video Analytics', 'Perimeter Protection', 'AI Detection Systems'],
    features: ['Perimeter detection', 'Video analytics', 'AI classification', 'Alarm events'],
    protocol: 'HTTP API, ONVIF, RTSP',
    integrations: ['Davantis', 'Davantis Analytics'],
  },
  {
    name: 'EFOY',
    slug: 'efoy',
    description: 'Configuration guide for EFOY fuel cell systems and power management in GCXONE',
    deviceTypes: ['Fuel Cells', 'Power Systems', 'Remote Power'],
    features: ['Power monitoring', 'Status alerts', 'Fuel level tracking', 'Remote diagnostics'],
    protocol: 'Modbus, HTTP API',
    integrations: ['EFOY', 'EFOY Fuel Cell'],
  },
  {
    name: 'Innovi',
    slug: 'innovi',
    description: 'Configuration guide for Innovi video surveillance and detection systems in GCXONE',
    deviceTypes: ['Video Detection', 'Analytics Systems', 'IP Cameras'],
    features: ['Motion detection', 'Video analytics', 'Alarm events', 'Live streaming'],
    protocol: 'ONVIF, RTSP, HTTP API',
    integrations: ['Innovi', 'Innovi Detection'],
  },
  {
    name: 'Rosenberger',
    slug: 'rosenberger',
    description: 'Configuration guide for Rosenberger antenna and communication systems in GCXONE',
    deviceTypes: ['Antenna Systems', 'Communication Equipment', 'RF Systems'],
    features: ['Signal monitoring', 'Status alerts', 'Performance tracking'],
    protocol: 'SNMP, HTTP API',
    integrations: ['Rosenberger', 'Rosenberger Antenna'],
  },
  {
    name: 'Autoaid',
    slug: 'autoaid',
    description: 'Configuration guide for Autoaid vehicle tracking and telematics systems in GCXONE',
    deviceTypes: ['Vehicle Tracking', 'Telematics', 'Fleet Management'],
    features: ['GPS tracking', 'Vehicle diagnostics', 'Alarm events', 'Geofencing'],
    protocol: 'HTTP API, MQTT',
    integrations: ['Autoaid', 'Autoaid Tracking'],
  },
  {
    name: 'Auraigateway',
    slug: 'auraigateway',
    description: 'Configuration guide for Aurai gateway systems in GCXONE',
    deviceTypes: ['Gateway', 'Protocol Converter', 'Integration Hub'],
    features: ['Protocol translation', 'Data aggregation', 'Event routing'],
    protocol: 'Multiple protocols, HTTP API',
    integrations: ['Aurai', 'Auraigateway', 'Aurai Gateway'],
  },
  {
    name: 'Onvif',
    slug: 'onvif',
    description: 'Configuration guide for generic ONVIF-compatible devices in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'Encoders', 'Decoders', 'Access Control'],
    features: ['Live streaming', 'Recording playback', 'PTZ control', 'Event handling', 'I/O control'],
    protocol: 'ONVIF Profile S, G, T, RTSP',
    integrations: ['ONVIF', 'Generic ONVIF'],
  },
  {
    name: 'ENEO',
    slug: 'eneo',
    description: 'Configuration guide for ENEO IP cameras, NVRs, and surveillance systems in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'DVRs', 'Thermal Cameras'],
    features: ['Live streaming', 'Recording playback', 'Motion detection', 'Remote access', 'PTZ control'],
    protocol: 'ONVIF, RTSP, HTTP API',
    integrations: ['ENEO', 'Eneo'],
  },
  {
    name: 'ENEOIP',
    slug: 'eneoip',
    description: 'Configuration guide for ENEO IP camera devices in GCXONE',
    deviceTypes: ['IP Cameras', 'Network Cameras', 'PTZ Cameras'],
    features: ['Live streaming', 'Motion detection', 'Event triggers', 'Recording'],
    protocol: 'ONVIF, RTSP',
    integrations: ['ENEOIP', 'ENEO IP'],
  },
  {
    name: 'Geutebruck',
    slug: 'geutebruck',
    description: 'Configuration guide for Geutebruck video management systems and IP devices in GCXONE',
    deviceTypes: ['VMS', 'IP Cameras', 'NVRs', 'Encoders', 'Video Servers'],
    features: ['Video management', 'Live monitoring', 'Recording', 'Event handling', 'Analytics'],
    protocol: 'ONVIF, RTSP, Geutebruck API, G-Core',
    integrations: ['Geutebruck', 'Geutebrück', 'Geutebruck'],
  },
  {
    name: 'Miwi Urmet/Grundig',
    slug: 'miwi-urmet-grundig',
    description: 'Configuration guide for Miwi, Urmet, and Grundig video intercom and surveillance systems in GCXONE',
    deviceTypes: ['Video Intercoms', 'IP Cameras', 'Access Control', 'NVRs'],
    features: ['Video intercom', 'Live streaming', 'Access control', 'Event handling'],
    protocol: 'SIP, ONVIF, RTSP, HTTP API',
    integrations: ['Miwi', 'Urmet', 'Grundig', 'Miwi Urmet', 'Urmet Grundig'],
  },
  {
    name: 'Avigilon Unity',
    slug: 'avigilon-unity',
    description: 'Configuration guide for Avigilon Unity video management systems in GCXONE',
    deviceTypes: ['VMS', 'Video Management', 'Access Control', 'Cloud Services'],
    features: ['Video management', 'Live streaming', 'Recording', 'Access control', 'Analytics'],
    protocol: 'Avigilon API, ONVIF, HTTP Streaming',
    integrations: ['Avigilon Unity', 'Avigilon Unity VMS'],
  },
  {
    name: 'Vivotek OnPremise',
    slug: 'vivotek-onpremise',
    description: 'Configuration guide for Vivotek OnPremise NVRs and video management systems in GCXONE',
    deviceTypes: ['NVRs', 'VMS', 'IP Cameras', 'Video Recorders'],
    features: ['Live streaming', 'Recording playback', 'Event handling', 'PTZ control', 'Analytics'],
    protocol: 'ONVIF, RTSP, Vivotek API',
    integrations: ['Vivotek OnPremise', 'Vivotek On-Premise', 'Vivotek NVR'],
  },
  {
    name: 'Vivotek Vortex',
    slug: 'vivotek-vortex',
    description: 'Configuration guide for Vivotek Vortex cloud video surveillance systems in GCXONE',
    deviceTypes: ['Cloud VMS', 'Cloud Cameras', 'Hybrid Systems'],
    features: ['Cloud recording', 'Live streaming', 'AI analytics', 'Remote access', 'Smart search'],
    protocol: 'Vivotek Cloud API, WebRTC, RTSP',
    integrations: ['Vivotek Vortex', 'Vortex', 'Vivotek Cloud'],
  },
  {
    name: 'Dahua PIR CAM',
    slug: 'dahua-pir-cam',
    description: 'Configuration guide for Dahua PIR (Passive Infrared) camera devices in GCXONE',
    deviceTypes: ['PIR Cameras', 'Motion Detection Cameras', 'Battery Cameras'],
    features: ['PIR detection', 'Battery operation', 'Live streaming', 'Motion alerts', 'Smart events'],
    protocol: 'ONVIF, RTSP, Dahua API',
    integrations: ['Dahua PIR CAM', 'Dahua PIR', 'Dahua Motion Camera'],
  },
  {
    name: 'Dahua Air Shield',
    slug: 'dahua-air-shield',
    description: 'Configuration guide for Dahua Air Shield wireless security systems in GCXONE',
    deviceTypes: ['Wireless Security', 'PIR Detectors', 'Door/Window Sensors', 'Hubs'],
    features: ['Wireless detection', 'Arm/disarm', 'Alarm events', 'Battery monitoring', 'RF communication'],
    protocol: 'Dahua Air Shield Protocol, HTTP API',
    integrations: ['Dahua Air Shield', 'Air Shield', 'Dahua Wireless'],
  },
];

function createPortableTextBody(device) {
  return [
    {
      _type: 'block',
      _key: `overview-${device.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `overview-span-${device.slug}`, text: 'Overview' }],
    },
    {
      _type: 'block',
      _key: `overview-content-${device.slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `overview-text-${device.slug}`,
          text: `${device.name} devices integrate with GCXONE to provide comprehensive video monitoring and surveillance capabilities. This guide covers the configuration steps required to connect your ${device.name} devices to the GCXONE platform.`,
        },
      ],
    },
    {
      _type: 'block',
      _key: `supported-devices-${device.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `supported-span-${device.slug}`, text: 'Supported Devices' }],
    },
    {
      _type: 'block',
      _key: `devices-list-${device.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: device.deviceTypes.map((type, i) => ({
        _type: 'span',
        _key: `device-${device.slug}-${i}`,
        text: type,
      })),
    },
    {
      _type: 'block',
      _key: `features-${device.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `features-span-${device.slug}`, text: 'Integration Features' }],
    },
    {
      _type: 'block',
      _key: `features-list-${device.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: device.features.map((feature, i) => ({
        _type: 'span',
        _key: `feature-${device.slug}-${i}`,
        text: feature,
      })),
    },
    {
      _type: 'block',
      _key: `prerequisites-${device.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `prereq-span-${device.slug}`, text: 'Prerequisites' }],
    },
    {
      _type: 'block',
      _key: `prereq-content-${device.slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `prereq-text-${device.slug}`,
          text: 'Before configuring your device, ensure you have:',
        },
      ],
    },
    {
      _type: 'block',
      _key: `prereq-list-1-${device.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-1-${device.slug}`, text: 'Network connectivity between the device and GCXONE servers' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-2-${device.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-2-${device.slug}`, text: 'Device administrator credentials' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-3-${device.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-3-${device.slug}`, text: 'Appropriate ports open on your firewall' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-4-${device.slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-4-${device.slug}`, text: `Protocol support: ${device.protocol}` }],
    },
    {
      _type: 'block',
      _key: `config-${device.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `config-span-${device.slug}`, text: 'Configuration Steps' }],
    },
    {
      _type: 'procedure',
      _key: `procedure-${device.slug}`,
      title: `${device.name} Device Configuration`,
      difficulty: 'intermediate',
      estimatedTime: '15-20 min',
      steps: [
        {
          title: 'Access Device Settings',
          body: [
            {
              _type: 'block',
              _key: `step1-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step1-text-${device.slug}`,
                  text: `Log in to your ${device.name} device's web interface using administrator credentials. Navigate to the network or integration settings section.`,
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
              _key: `step2-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step2-text-${device.slug}`,
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
              _key: `step3-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step3-text-${device.slug}`,
                  text: `Enable the required protocols (${device.protocol}) in the device settings. For ONVIF, ensure the ONVIF service is enabled and configure the appropriate port.`,
                },
              ],
            },
          ],
        },
        {
          title: 'Create User Account',
          body: [
            {
              _type: 'block',
              _key: `step4-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step4-text-${device.slug}`,
                  text: 'Create a dedicated user account for GCXONE integration with appropriate permissions. Assign operator-level access for video streaming and event reception.',
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
              _key: `step5-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step5-text-${device.slug}`,
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
      _key: `callout-${device.slug}`,
      type: 'tip',
      title: 'Best Practice',
      body: [
        {
          _type: 'block',
          _key: `callout-body-${device.slug}`,
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: `callout-text-${device.slug}`,
              text: 'Always test the connection after configuration. Use the diagnostic tools in GCXONE to verify video streaming and event reception before deploying to production.',
            },
          ],
        },
      ],
    },
    {
      _type: 'block',
      _key: `troubleshooting-${device.slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `troubleshoot-span-${device.slug}`, text: 'Troubleshooting' }],
    },
    {
      _type: 'accordion',
      _key: `accordion-${device.slug}`,
      items: [
        {
          title: 'Connection Failed',
          content: [
            {
              _type: 'block',
              _key: `trouble1-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble1-text-${device.slug}`,
                  text: 'Verify network connectivity, check firewall rules, and ensure the correct ports are open. Confirm the device credentials are correct.',
                },
              ],
            },
          ],
        },
        {
          title: 'No Video Stream',
          content: [
            {
              _type: 'block',
              _key: `trouble2-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble2-text-${device.slug}`,
                  text: 'Check that RTSP or the appropriate streaming protocol is enabled. Verify the stream URL format and ensure bandwidth is sufficient.',
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
              _key: `trouble3-body-${device.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble3-text-${device.slug}`,
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

function createDeviceDoc(device) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    _id: `doc-devices-${device.slug}`,
    _type: 'doc',
    title: `${device.name} Configuration Guide`,
    slug: { _type: 'slug', current: `devices/${device.slug}` },
    description: device.description,
    targetAudience: ['installer', 'admin'],
    status: 'published',
    lastUpdated: today,
    sidebarPosition: 100,
    tags: ['devices', 'configuration', device.slug, device.name.toLowerCase().replace(/[^a-z0-9]/g, '')],
    body: createPortableTextBody(device),
  };
}

function normalizeForMatch(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function matchesIntegration(integration, searchName) {
  const searchNorm = normalizeForMatch(searchName);
  if (!searchNorm) return false;

  const titleNorm = normalizeForMatch(integration.name || integration.title);
  const manufacturerNorm = normalizeForMatch(integration.manufacturer);
  const brandNorm = normalizeForMatch(integration.brand);

  if (titleNorm === searchNorm) return true;
  if (manufacturerNorm === searchNorm) return true;
  if (brandNorm && brandNorm === searchNorm) return true;

  return false;
}

async function addMissingConfigGuides() {
  console.log('Adding missing configuration guides to Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  console.log('Fetching existing device docs...');
  const existingDocs = await client.fetch(
    `*[_type == "doc" && slug.current match "devices/*"]{ _id, title, "slug": slug.current }`
  );
  console.log(`Found ${existingDocs.length} existing device docs`);
  const existingSlugs = new Set(existingDocs.map(d => d.slug));
  console.log('');

  console.log('Fetching device integrations...');
  const integrations = await client.fetch(
    `*[_type == "deviceIntegration"]{
      _id,
      name,
      title,
      slug,
      manufacturer,
      brand,
      documentation
    }`
  );
  console.log(`Found ${integrations.length} device integrations\n`);

  let created = 0;
  let skipped = 0;
  let linked = 0;
  let linkErrors = 0;
  let errors = 0;

  for (const device of MISSING_DEVICES) {
    const doc = createDeviceDoc(device);
    const slug = doc.slug.current;

    console.log(`\n--- Processing: ${device.name} ---`);

    if (existingSlugs.has(slug)) {
      console.log(`  Skipping: Doc already exists at /${slug}`);
      skipped++;
    } else {
      try {
        const createdDoc = await client.create(doc);
        console.log(`  Created: ${device.name} Configuration Guide (/${slug})`);
        created++;
        existingSlugs.add(slug);

        for (const integrationName of device.integrations || []) {
          const matchingIntegration = integrations.find(int => matchesIntegration(int, integrationName));

          if (!matchingIntegration) {
            console.log(`  No match found for integration: ${integrationName}`);
            continue;
          }

          try {
            const existingDoc = matchingIntegration.documentation || {};
            const docUrl = `/docs/${slug}`;

            const documentation = {
              _type: 'documentationInfo',
              configurationArticle: { _type: 'reference', _ref: createdDoc._id },
              helpManualUrl: docUrl,
              helpdeskUrl: existingDoc.helpdeskUrl || null,
            };

            await client
              .patch(matchingIntegration._id)
              .set({ documentation })
              .commit();

            console.log(`  Linked to: ${matchingIntegration.name || matchingIntegration.title}`);
            linked++;
          } catch (linkErr) {
            console.error(`  Error linking to ${matchingIntegration.name || matchingIntegration.title}:`, linkErr.message);
            linkErrors++;
          }
        }
      } catch (err) {
        console.error(`  Error creating ${device.name}:`, err.message);
        errors++;
      }
    }
  }

  console.log('\n\n========== SUMMARY ==========');
  console.log(`Total devices to process: ${MISSING_DEVICES.length}`);
  console.log(`Docs created: ${created}`);
  console.log(`Docs skipped (already exist): ${skipped}`);
  console.log(`Integrations linked: ${linked}`);
  console.log(`Link errors: ${linkErrors}`);
  console.log(`Create errors: ${errors}`);
  console.log('\nDone!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

addMissingConfigGuides().catch(console.error);
