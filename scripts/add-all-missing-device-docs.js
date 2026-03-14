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

function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createPortableTextBody(device) {
  const name = device.name || device.title || device.manufacturer || 'Device';
  const manufacturer = device.manufacturer || device.brand || name;
  const slug = slugify(manufacturer);
  
  const deviceTypes = device.deviceTypes || ['IP Devices', 'Network Equipment'];
  const features = device.features || ['Live streaming', 'Event handling', 'Remote monitoring'];
  const protocol = device.protocol || 'ONVIF, RTSP, HTTP API';

  return [
    {
      _type: 'block',
      _key: `overview-${slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `overview-span-${slug}`, text: 'Overview' }],
    },
    {
      _type: 'block',
      _key: `overview-content-${slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `overview-text-${slug}`,
          text: `${manufacturer} devices integrate with GCXONE to provide comprehensive video monitoring and surveillance capabilities. This guide covers the configuration steps required to connect your ${manufacturer} devices to the GCXONE platform.`,
        },
      ],
    },
    {
      _type: 'block',
      _key: `prerequisites-${slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `prereq-span-${slug}`, text: 'Prerequisites' }],
    },
    {
      _type: 'block',
      _key: `prereq-content-${slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `prereq-text-${slug}`,
          text: 'Before configuring your device, ensure you have:',
        },
      ],
    },
    {
      _type: 'block',
      _key: `prereq-list-1-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-1-${slug}`, text: 'Network connectivity between the device and GCXONE servers' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-2-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-2-${slug}`, text: 'Device administrator credentials' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-3-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-3-${slug}`, text: 'Appropriate ports open on your firewall' }],
    },
    {
      _type: 'block',
      _key: `prereq-list-4-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `prereq-4-${slug}`, text: `Protocol support: ${protocol}` }],
    },
    {
      _type: 'block',
      _key: `connection-${slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `conn-span-${slug}`, text: 'Connection Steps' }],
    },
    {
      _type: 'procedure',
      _key: `procedure-${slug}`,
      title: `${manufacturer} Device Configuration`,
      difficulty: 'intermediate',
      estimatedTime: '15-20 min',
      steps: [
        {
          title: 'Access Device Settings',
          body: [
            {
              _type: 'block',
              _key: `step1-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step1-text-${slug}`,
                  text: `Log in to your ${manufacturer} device's web interface using administrator credentials. Navigate to the network or integration settings section.`,
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
              _key: `step2-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step2-text-${slug}`,
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
              _key: `step3-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step3-text-${slug}`,
                  text: `Enable the required protocols (${protocol}) in the device settings. For ONVIF, ensure the ONVIF service is enabled and configure the appropriate port.`,
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
              _key: `step4-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step4-text-${slug}`,
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
              _key: `step5-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `step5-text-${slug}`,
                  text: 'In the GCXONE portal, navigate to Devices > Add Device. Select the device type, enter the connection details, and test the connection before saving.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      _type: 'block',
      _key: `config-${slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `config-span-${slug}`, text: 'Configuration Options' }],
    },
    {
      _type: 'block',
      _key: `config-content-${slug}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `config-text-${slug}`,
          text: 'The following configuration options are available when setting up the device in GCXONE:',
        },
      ],
    },
    {
      _type: 'block',
      _key: `config-list-1-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `config-1-${slug}`, text: 'Connection timeout and retry settings' }],
    },
    {
      _type: 'block',
      _key: `config-list-2-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `config-2-${slug}`, text: 'Stream quality and resolution preferences' }],
    },
    {
      _type: 'block',
      _key: `config-list-3-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `config-3-${slug}`, text: 'Event notification and alarm settings' }],
    },
    {
      _type: 'block',
      _key: `config-list-4-${slug}`,
      style: 'normal',
      listItem: 'bullet',
      children: [{ _type: 'span', _key: `config-4-${slug}`, text: 'Recording schedules and retention policies' }],
    },
    {
      _type: 'callout',
      _key: `callout-${slug}`,
      type: 'tip',
      title: 'Best Practice',
      body: [
        {
          _type: 'block',
          _key: `callout-body-${slug}`,
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: `callout-text-${slug}`,
              text: 'Always test the connection after configuration. Use the diagnostic tools in GCXONE to verify video streaming and event reception before deploying to production.',
            },
          ],
        },
      ],
    },
    {
      _type: 'block',
      _key: `troubleshooting-${slug}`,
      style: 'h2',
      children: [{ _type: 'span', _key: `troubleshoot-span-${slug}`, text: 'Troubleshooting' }],
    },
    {
      _type: 'accordion',
      _key: `accordion-${slug}`,
      items: [
        {
          title: 'Connection Failed',
          content: [
            {
              _type: 'block',
              _key: `trouble1-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble1-text-${slug}`,
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
              _key: `trouble2-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble2-text-${slug}`,
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
              _key: `trouble3-body-${slug}`,
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  _key: `trouble3-text-${slug}`,
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

function createDeviceDoc(integration) {
  const name = integration.name || integration.title || integration.manufacturer || 'Device';
  const manufacturer = integration.manufacturer || integration.brand || name;
  const slug = slugify(manufacturer);
  const today = new Date().toISOString().slice(0, 10);

  return {
    _id: `doc-devices-${slug}`,
    _type: 'doc',
    title: `${manufacturer} Configuration Guide`,
    slug: { _type: 'slug', current: `devices/${slug}` },
    description: `Configuration guide for ${manufacturer} devices in GCXONE platform. Learn how to connect, configure, and troubleshoot ${manufacturer} integrations.`,
    targetAudience: ['installer', 'admin'],
    status: 'published',
    lastUpdated: today,
    sidebarPosition: 100,
    tags: ['devices', 'configuration', slug, manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '')],
    body: createPortableTextBody(integration),
  };
}

async function addAllMissingConfigGuides() {
  console.log('Querying for device integrations missing documentation...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  const integrations = await client.fetch(
    `*[_type == "deviceIntegration" && !defined(documentation.configurationArticle)]{
      _id,
      name,
      title,
      slug,
      manufacturer,
      brand,
      deviceTypes,
      features,
      protocol,
      documentation
    }`
  );
  
  console.log(`Found ${integrations.length} device integrations without configuration docs\n`);

  if (integrations.length === 0) {
    console.log('No devices need configuration guides. All devices have documentation linked.');
    return;
  }

  console.log('Devices needing documentation:');
  integrations.forEach((int, i) => {
    const name = int.name || int.title || int.manufacturer || 'Unknown';
    console.log(`  ${i + 1}. ${name} (${int._id})`);
  });
  console.log('');

  const existingDocs = await client.fetch(
    `*[_type == "doc" && slug.current match "devices/*"]{ _id, title, "slug": slug.current }`
  );
  const existingSlugs = new Set(existingDocs.map(d => d.slug));

  let created = 0;
  let skipped = 0;
  let linked = 0;
  let errors = 0;

  for (const integration of integrations) {
    const manufacturer = integration.manufacturer || integration.brand || integration.name || integration.title || 'Device';
    const slug = `devices/${slugify(manufacturer)}`;

    console.log(`\n--- Processing: ${manufacturer} ---`);

    let docId;
    
    if (existingSlugs.has(slug)) {
      console.log(`  Doc exists at /${slug}, will link to integration`);
      docId = `doc-devices-${slugify(manufacturer)}`;
      skipped++;
    } else {
      try {
        const doc = createDeviceDoc(integration);
        const createdDoc = await client.create(doc);
        docId = createdDoc._id;
        console.log(`  Created: ${manufacturer} Configuration Guide (/${slug})`);
        created++;
        existingSlugs.add(slug);
      } catch (err) {
        console.error(`  Error creating doc: ${err.message}`);
        errors++;
        continue;
      }
    }

    try {
      const existingDoc = integration.documentation || {};
      const docUrl = `/docs/${slug}`;

      const documentation = {
        _type: 'documentationInfo',
        configurationArticle: { _type: 'reference', _ref: docId },
        helpManualUrl: docUrl,
        helpdeskUrl: existingDoc.helpdeskUrl || null,
      };

      await client
        .patch(integration._id)
        .set({ documentation })
        .commit();

      console.log(`  Linked integration to documentation`);
      linked++;
    } catch (linkErr) {
      console.error(`  Error linking: ${linkErr.message}`);
      errors++;
    }
  }

  console.log('\n\n========== SUMMARY ==========');
  console.log(`Total integrations processed: ${integrations.length}`);
  console.log(`Docs created: ${created}`);
  console.log(`Docs skipped (already existed): ${skipped}`);
  console.log(`Integrations linked: ${linked}`);
  console.log(`Errors: ${errors}`);
  console.log('\nDone!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

addAllMissingConfigGuides().catch(console.error);
