#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'fjjuacab';
const DATASET = 'production';
const RELEASES_DIR = path.resolve(__dirname, '../.planning/releases');

async function run() {
  const apiToken = process.env.SANITY_API_TOKEN;

  if (!apiToken) {
    throw new Error('[create-release] Missing SANITY_API_TOKEN env var');
  }

  const { createClient } = require('@sanity/client');

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2025-03-15',
    useCdn: false,
    token: apiToken,
  });

  console.log('[create-release] Connecting to Sanity...');
  console.log(`[create-release] Project: ${PROJECT_ID}, Dataset: ${DATASET}`);
  console.log(`[create-release] Reading from: ${RELEASES_DIR}`);

  if (!fs.existsSync(RELEASES_DIR)) {
    throw new Error(`[create-release] Releases directory not found: ${RELEASES_DIR}`);
  }

  const jsonFiles = fs.readdirSync(RELEASES_DIR).filter(f => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.log('[create-release] No release JSON files found.');
    return;
  }

  console.log(`[create-release] Found ${jsonFiles.length} release file(s) to process\n`);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const file of jsonFiles) {
    const filePath = path.join(RELEASES_DIR, file);
    console.log(`[create-release] Processing: ${file}`);

    let releases;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      releases = JSON.parse(content);
    } catch (err) {
      console.error(`[create-release] Failed to parse ${file}: ${err.message}`);
      failed++;
      continue;
    }

    if (!Array.isArray(releases)) {
      console.error(`[create-release] ${file}: Expected array of releases, got ${typeof releases}`);
      failed++;
      continue;
    }

    for (const release of releases) {
      const result = await processRelease(client, release);
      if (result === 'created') created++;
      else if (result === 'updated') updated++;
      else failed++;
    }
  }

  console.log('\n[create-release] Done!');
  console.log(`[create-release] Created: ${created}, Updated: ${updated}, Failed: ${failed}`);
}

async function processRelease(client, release) {
  const { displayTitle, sprintId, slug, publishedAt, summary, items } = release;

  if (!displayTitle || !slug || !publishedAt) {
    console.error(`[create-release] Missing required fields: displayTitle, slug, or publishedAt`);
    return 'failed';
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error(`[create-release] Release "${displayTitle}" has no items`);
    return 'failed';
  }

  const docId = `release-${slug}`;
  const sanitySlug = typeof slug === 'string' ? slug : slug.current || slug;

  const formattedItems = items.map((item, idx) => ({
    _key: `item-${idx}-${Date.now()}`,
    _type: 'releaseItem',
    title: item.title || 'Untitled',
    description: item.description || '',
    changeType: item.changeType || undefined,
    affectedAreas: Array.isArray(item.affectedAreas)
      ? item.affectedAreas.map(area => area)
      : undefined,
    videoUrl: item.videoUrl || undefined,
  }));

  const doc = {
    _id: docId,
    _type: 'release',
    displayTitle,
    sprintId: sprintId || undefined,
    slug: { _type: 'slug', current: sanitySlug },
    publishedAt,
    summary: summary || undefined,
    items: formattedItems,
  };

  try {
    const existing = await client.fetch(
      `*[_type == "release" && _id == $id][0]._id`,
      { id: docId }
    );

    if (existing) {
      console.log(`[create-release] Updating: ${displayTitle} (${docId})`);
      await client
        .patch(existing)
        .set({
          displayTitle,
          sprintId: sprintId || undefined,
          slug: { _type: 'slug', current: sanitySlug },
          publishedAt,
          summary: summary || undefined,
        })
        .setIfMissing({ items: [] })
        .unset(['items'])
        .set({ items: formattedItems })
        .commit();
      console.log(`[create-release] Updated: ${displayTitle}`);
      return 'updated';
    } else {
      console.log(`[create-release] Creating: ${displayTitle} (${docId})`);
      await client.create(doc);
      console.log(`[create-release] Created: ${displayTitle}`);
      return 'created';
    }
  } catch (err) {
    console.error(`[create-release] Failed to process "${displayTitle}": ${err.message}`);
    return 'failed';
  }
}

module.exports = { run, processRelease };

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
