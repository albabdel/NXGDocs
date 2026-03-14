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

const DOC_TO_MANUFACTURER_MAP = {
  'axis-communications-family-integration-guide': ['axis'],
  'axis-ip-camera': ['axis'],
  'axis-camera-station': ['axiscamerastation', 'axis camera station'],
  'axis-cs-pro': ['axis cs pro', 'axiscspro'],
  'dahua': ['dahua'],
  'dahua-cloud-arc': ['dahua', 'cloud arc'],
  'hikvision': ['hikvision'],
  'hikproconnect-troubleshoot': ['hikproconnect', 'hik proconnect', 'hikvision'],
  'hanwha-device-configuration': ['hanwha', 'nxwitness', 'nx witness'],
  'milestone-gcx-one': ['milestone'],
  'axxon': ['axxon'],
  'ajax': ['ajax'],
  'camect': ['camect'],
  'eagle-eye': ['eagleeye', 'eagle eye'],
  'senstar': ['senstar'],
  'victron': ['victron'],
  'genesis-audio': ['genesisaudio', 'genesis audio'],
};

function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function normalizeForSearch(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function matchesDoc(integration, docSlug, docKeywords) {
  const manufacturer = normalizeForSearch(integration.manufacturer);
  const brand = normalizeForSearch(integration.brand);
  const title = normalizeForSearch(integration.title);
  const manufacturerNorm = normalizeName(integration.manufacturer);
  const brandNorm = normalizeName(integration.brand);
  
  for (const keyword of docKeywords) {
    const keywordNorm = normalizeName(keyword);
    const keywordSearch = normalizeForSearch(keyword);
    
    if (manufacturer.includes(keywordSearch)) return true;
    if (brand.includes(keywordSearch)) return true;
    if (title.includes(keywordSearch)) return true;
    if (manufacturerNorm.includes(keywordNorm)) return true;
    if (brandNorm.includes(keywordNorm)) return true;
  }
  
  return false;
}

async function linkAllDeviceDocs() {
  console.log('Linking all device docs to device integrations...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  console.log('Fetching doc articles with slug starting "devices/"...');
  const allDocArticles = await client.fetch(
    `*[_type == "doc"]{
      _id,
      title,
      "slug": slug.current
    }`
  );
  const docArticles = allDocArticles.filter(doc => doc.slug && doc.slug.startsWith('devices/'));
  console.log(`Found ${docArticles.length} doc articles\n`);

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

  const linkMap = new Map();
  
  for (const doc of docArticles) {
    const docSlug = doc.slug.replace('devices/', '');
    const keywords = DOC_TO_MANUFACTURER_MAP[docSlug] || [docSlug.replace(/-/g, '')];
    
    const matchingIntegrations = integrations.filter(integration => 
      matchesDoc(integration, docSlug, keywords)
    );
    
    linkMap.set(doc, matchingIntegrations);
  }

  console.log('--- Matching Results ---\n');
  for (const [doc, matches] of linkMap) {
    console.log(`Doc: "${doc.title}" (${doc.slug})`);
    console.log(`  Matches ${matches.length} integrations:`);
    for (const m of matches) {
      console.log(`    - ${m.title}`);
    }
    console.log('');
  }

  console.log('\n--- Applying Updates ---\n');
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [doc, matchingIntegrations] of linkMap) {
    const docUrl = `/docs/${doc.slug}`;
    
    for (const integration of matchingIntegrations) {
      try {
        const existingDoc = integration.documentation || {};
        
        const documentation = {
          _type: 'documentationInfo',
          configurationArticle: { _type: 'reference', _ref: doc._id },
          helpManualUrl: docUrl,
          helpdeskUrl: existingDoc.helpdeskUrl || null,
        };

        await client
          .patch(integration._id)
          .set({ documentation })
          .commit();

        console.log(`Updated: ${integration.title}`);
        console.log(`  - Config article: ${doc.title}`);
        console.log(`  - Help manual URL: ${docUrl}`);
        updated++;
      } catch (err) {
        console.error(`Error updating ${integration.title}:`, err.message);
        errors++;
      }
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total doc articles: ${docArticles.length}`);
  console.log(`Total integrations: ${integrations.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  
  console.log('\nLinking complete!');
}

linkAllDeviceDocs().catch(console.error);
