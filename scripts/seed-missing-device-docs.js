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

const MISSING_MANUFACTURERS = [
  {
    name: 'Bosch',
    slug: 'bosch',
    description: 'Configuration guide for Bosch security cameras, NVRs, and video management systems in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'Encoders'],
    features: ['Live streaming', 'Recording playback', 'Motion detection', 'PTZ control'],
    protocol: 'ONVIF, RTSP, Bosch VCA',
  },
  {
    name: 'Mobotix',
    slug: 'mobotix',
    description: 'Configuration guide for Mobotix IP cameras and video door stations in GCXONE',
    deviceTypes: ['IP Cameras', 'Video Door Stations', 'Thermal Cameras'],
    features: ['Decentralized recording', 'Event detection', 'Two-way audio', 'Thermal imaging'],
    protocol: 'ONVIF, RTSP, MxPEG',
  },
  {
    name: 'Uniview',
    slug: 'uniview',
    description: 'Configuration guide for Uniview IP cameras, NVRs, and video surveillance systems in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'PTZ Cameras', 'Thermal Cameras'],
    features: ['Live streaming', 'Recording playback', 'Smart events', 'PTZ control'],
    protocol: 'ONVIF, RTSP, Uniview SDK',
  },
  {
    name: 'Geutebrück',
    slug: 'geutebruck',
    description: 'Configuration guide for Geutebrück video management systems and IP devices in GCXONE',
    deviceTypes: ['VMS', 'IP Cameras', 'NVRs', 'Encoders'],
    features: ['Video management', 'Live monitoring', 'Recording', 'Event handling'],
    protocol: 'ONVIF, RTSP, Geutebrück API',
  },
  {
    name: 'Honeywell',
    slug: 'honeywell',
    description: 'Configuration guide for Honeywell ADPRO, NVRs, and IP cameras in GCXONE',
    deviceTypes: ['ADPRO NVRs', 'IP Cameras', '35 Series NVRs'],
    features: ['Live streaming', 'Recording playback', 'Alarm events', 'Arm/disarm'],
    protocol: 'ADPRO SDK, RTSP, ONVIF',
  },
  {
    name: 'ENEO',
    slug: 'eneo',
    description: 'Configuration guide for ENEO IP cameras, NVRs, and surveillance systems in GCXONE',
    deviceTypes: ['IP Cameras', 'NVRs', 'DVRs'],
    features: ['Live streaming', 'Recording playback', 'Motion detection', 'Remote access'],
    protocol: 'ONVIF, RTSP',
  },
  {
    name: 'Ganz',
    slug: 'ganz',
    description: 'Configuration guide for Ganz AI boxes, IP cameras, and video systems in GCXONE',
    deviceTypes: ['AI Boxes', 'IP Cameras', 'Video Analytics'],
    features: ['AI detection', 'Live streaming', 'Event alerts', 'Analytics'],
    protocol: 'HTTP API, RTSP, Webhook',
  },
  {
    name: 'Avigilon',
    slug: 'avigilon',
    description: 'Configuration guide for Avigilon video management systems and IP cameras in GCXONE',
    deviceTypes: ['VMS', 'IP Cameras', 'NVRs', 'Access Control'],
    features: ['Live streaming', 'Recording playback', 'Event handling', 'PTZ control'],
    protocol: 'Avigilon API, HTTP Streaming',
  },
  {
    name: 'Heitel',
    slug: 'heitel',
    description: 'Configuration guide for Heitel NVRs and video recording systems in GCXONE',
    deviceTypes: ['NVRs', 'Video Recorders'],
    features: ['Live streaming', 'Event handling', 'Recording'],
    protocol: 'Heitel TCP Protocol',
  },
  {
    name: 'NetVu',
    slug: 'netvu',
    description: 'Configuration guide for NetVu IP cameras and video surveillance systems in GCXONE',
    deviceTypes: ['IP Cameras', 'Video Systems'],
    features: ['Live streaming', 'Audio support', 'Timeline playback'],
    protocol: 'HTTP API, RTSP',
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
          text: `${manufacturer.name} devices integrate with GCXONE to provide comprehensive video monitoring and surveillance capabilities. This guide covers the configuration steps required to connect your ${manufacturer.name} devices to the GCXONE platform.`,
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
                  text: `Log in to your ${manufacturer.name} device's web interface using administrator credentials. Navigate to the network or integration settings section.`,
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
                  text: `Enable the required protocols (${manufacturer.protocol}) in the device settings. For ONVIF, ensure the ONVIF service is enabled and configure the appropriate port.`,
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
              _key: `step4-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step4-text-${manufacturer.slug}`,
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
              text: 'Always test the connection after configuration. Use the diagnostic tools in GCXONE to verify video streaming and event reception before deploying to production.',
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
          title: 'No Video Stream',
          content: [
            {
              _type: 'block',
              _key: `trouble2-body-${manufacturer.slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble2-text-${manufacturer.slug}`,
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
    tags: ['devices', 'integration', manufacturer.slug, manufacturer.name.toLowerCase()],
    body: createPortableTextBody(manufacturer),
  };
}

async function seedMissingDeviceDocs() {
  console.log('Seeding missing device documentation to Sanity...\n');
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
  let updated = 0;
  let errors = 0;

  for (const manufacturer of MISSING_MANUFACTURERS) {
    const doc = createDeviceDoc(manufacturer);
    const slug = doc.slug.current;

    try {
      const existing = existingDocs.find(d => d.slug === slug);

      if (existing) {
        console.log(`Skipping: ${manufacturer.name} (doc already exists at /${slug})`);
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
  console.log(`Total manufacturers to process: ${MISSING_MANUFACTURERS.length}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log('\nSeeding complete!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

seedMissingDeviceDocs().catch(console.error);
