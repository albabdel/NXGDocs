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

const DOC_TO_INTEGRATION_MAP = {
  'bosch': ['Bosch'],
  'mobotix': ['Mobotix'],
  'uniview': ['Uniview'],
  'geutebruck': ['Geutebrück', 'Geutebruck'],
  'honeywell': ['Honeywell ADPRO', 'Honeywell 35 Series'],
  'eneo': ['ENEO', 'ENEOIP'],
  'ganz': ['Ganz'],
  'avigilon': ['Avigilon', 'Avigilon Unity'],
  'heitel': ['Heitel'],
  'netvu': ['NetVu'],
};

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

  const titleNorm = normalizeForMatch(integration.title);
  const manufacturerNorm = normalizeForMatch(integration.manufacturer);
  const brandNorm = normalizeForMatch(integration.brand);

  if (titleNorm === searchNorm) return true;
  if (manufacturerNorm === searchNorm) return true;
  if (brandNorm && brandNorm === searchNorm) return true;

  return false;
}

async function linkNewDeviceDocs() {
  console.log('Linking new device docs to device integrations...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  console.log('Fetching device integrations...');
  const integrations = await client.fetch(
    `*[_type == "deviceIntegration"]{
      _id,
      title,
      slug,
      manufacturer,
      brand,
      documentation
    }`
  );
  console.log(`Found ${integrations.length} device integrations\n`);

  console.log('Fetching new doc articles...\n');
  const docSlugs = Object.keys(DOC_TO_INTEGRATION_MAP);
  const docs = await client.fetch(
    `*[_type == "doc" && slug.current in $slugs]{
      _id,
      title,
      "slug": slug.current
    }`,
    { slugs: docSlugs.map(s => `devices/${s}`) }
  );
  console.log(`Found ${docs.length} matching doc articles\n`);

  for (const doc of docs) {
    console.log(`Doc: "${doc.title}" (${doc.slug})`);
  }
  console.log('');

  console.log('--- Matching and Linking ---\n');

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of docs) {
    const docSlug = doc.slug.replace('devices/', '');
    const integrationNames = DOC_TO_INTEGRATION_MAP[docSlug];

    if (!integrationNames) {
      console.log(`No mapping found for doc: ${docSlug}`);
      skipped++;
      continue;
    }

    console.log(`Processing: ${doc.title}`);
    console.log(`  Target integrations: ${integrationNames.join(', ')}`);

    for (const name of integrationNames) {
      const matchingIntegration = integrations.find(int => matchesIntegration(int, name));

      if (!matchingIntegration) {
        console.log(`  ⚠ No match found for: ${name}`);
        continue;
      }

      try {
        const existingDoc = matchingIntegration.documentation || {};
        const docUrl = `/docs/${doc.slug}`;

        const documentation = {
          _type: 'documentationInfo',
          configurationArticle: { _type: 'reference', _ref: doc._id },
          helpManualUrl: docUrl,
          helpdeskUrl: existingDoc.helpdeskUrl || null,
        };

        await client
          .patch(matchingIntegration._id)
          .set({ documentation })
          .commit();

        console.log(`  ✓ Linked: ${matchingIntegration.title}`);
        console.log(`    - Config article: ${doc.title}`);
        console.log(`    - Help manual URL: ${docUrl}`);
        updated++;
      } catch (err) {
        console.error(`  ✗ Error linking ${matchingIntegration.title}:`, err.message);
        errors++;
      }
    }
    console.log('');
  }

  console.log('--- Summary ---');
  console.log(`Docs processed: ${docs.length}`);
  console.log(`Integrations updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);

  console.log('\nLinking complete!');
}

linkNewDeviceDocs().catch(console.error);
