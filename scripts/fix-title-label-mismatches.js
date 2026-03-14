#!/usr/bin/env node
'use strict';

const projectId = 'fjjuacab';
const dataset = 'production';
const apiToken = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const docTitleUpdates = [
  { slug: 'devices/camect', newTitle: 'Camect Configuration Guide' },
  { slug: 'operator-guide/multi-site-monitoring', newTitle: 'Multi-Site Monitoring' },
  { slug: 'operator-guide/notes-annotations', newTitle: 'Notes & Annotations' },
  { slug: 'operator-guide/ptz-control', newTitle: 'PTZ Control' },
  { slug: 'operator-guide/shortcuts-tips', newTitle: 'Shortcuts & Tips' },
  { slug: 'knowledge-base/faq', newTitle: 'FAQ' },
];

const sidebarLabelUpdates = [
  { slug: 'index', newLabel: 'Documentation Home' },
  { slug: 'alarm-management/arm-disarm-isolate', newLabel: 'Arm/Disarm and Isolate' },
  { slug: 'alarm-management/priority-whitelist-blacklist', newLabel: 'Priority List, Whitelist and Blacklist' },
  { slug: 'knowledge-base/glossary', newLabel: 'Glossary of Terms' },
];

async function run() {
  const { createClient } = require('@sanity/client');
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  });

  console.log('Updating Sanity document titles...');
  
  for (const update of docTitleUpdates) {
    const doc = await client.fetch(
      `*[_type == "doc" && slug.current == $slug][0]{_id, title}`,
      { slug: update.slug }
    );
    
    if (doc) {
      await client.patch(doc._id).set({ title: update.newTitle }).commit();
      console.log(`Updated "${update.slug}": title → "${update.newTitle}"`);
    } else {
      console.warn(`Document not found: ${update.slug}`);
    }
  }

  console.log('\nUpdating sidebar labels...');
  
  for (const update of sidebarLabelUpdates) {
    if (update.slug === 'index') {
      const config = await client.fetch(
        `*[_type == "sidebarConfig" && audience == "all"][0]{_id, homeLinkLabel}`
      );
      if (config) {
        await client.patch(config._id).set({ homeLinkLabel: update.newLabel }).commit();
        console.log(`Updated sidebarConfig: homeLinkLabel → "${update.newLabel}"`);
      }
      continue;
    }
    
    const doc = await client.fetch(
      `*[_type == "doc" && slug.current == $slug][0]{_id, title, sidebarLabel}`,
      { slug: update.slug }
    );
    
    if (doc) {
      await client.patch(doc._id).set({ sidebarLabel: update.newLabel }).commit();
      console.log(`Updated "${update.slug}": sidebarLabel → "${update.newLabel}"`);
    } else {
      console.warn(`Document not found: ${update.slug}`);
    }
  }

  console.log('\nDone! Run generate-sidebars-from-sanity.js to regenerate sidebars.ts');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
