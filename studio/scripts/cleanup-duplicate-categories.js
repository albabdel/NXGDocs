#!/usr/bin/env node
/**
 * Delete all sidebarCategory documents that are NOT from the seed script
 * (i.e., don't have a stable 'sidebar-cat-' prefixed _id).
 *
 * Run from repo root:
 *   node studio/scripts/cleanup-duplicate-categories.js
 */

import { readFileSync } from 'fs';
import { createClient } from '@sanity/client';

// Load .env manually
try {
  const envPath = new URL('../../.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* rely on environment */ }

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const apiToken  = process.env.SANITY_API_TOKEN;
const dataset   = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) { console.error('Missing SANITY_PROJECT_ID'); process.exit(1); }
if (!apiToken)  { console.error('Missing SANITY_API_TOKEN');  process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion: '2025-02-06', useCdn: false, token: apiToken });

async function run() {
  const all = await client.fetch(`*[_type == "sidebarCategory"]{_id, title, "slug": slug.current}`);
  console.log(`[cleanup] Found ${all.length} sidebarCategory documents`);

  const toDelete = all.filter(doc => !doc._id.startsWith('sidebar-cat-'));
  const toKeep   = all.filter(doc =>  doc._id.startsWith('sidebar-cat-'));

  console.log(`[cleanup] Keeping  ${toKeep.length}  (stable seeded IDs)`);
  console.log(`[cleanup] Deleting ${toDelete.length} (legacy/duplicate IDs)`);

  if (toDelete.length === 0) {
    console.log('[cleanup] Nothing to delete.');
    return;
  }

  const deleteIds = new Set(toDelete.map(d => d._id));

  // Step 1: clear ALL references to legacy categories across every document type
  console.log('\n[cleanup] Scanning for any document referencing legacy categories...');
  const allReferencing = await client.fetch(
    `*[references($ids)]{_id, _type, title, name}`,
    { ids: [...deleteIds] }
  );
  console.log(`[cleanup] Found ${allReferencing.length} documents with stale references`);

  const PATCH_BATCH = 10;

  // Group by type so we know how to patch each
  const byType = {};
  for (const d of allReferencing) {
    (byType[d._type] = byType[d._type] || []).push(d);
  }

  for (const [type, docs] of Object.entries(byType)) {
    console.log(`  [type: ${type}] ${docs.length} documents`);
  }

  for (let i = 0; i < allReferencing.length; i += PATCH_BATCH) {
    const batch = allReferencing.slice(i, i + PATCH_BATCH);
    const tx = client.transaction();

    for (const refDoc of batch) {
      const label = refDoc.title || refDoc.name || refDoc._id;
      if (refDoc._type === 'doc') {
        // Clear sidebarCategory reference
        tx.patch(refDoc._id, { unset: ['sidebarCategory'] });
        console.log(`  [unset doc.sidebarCategory] ${label}`);
      } else if (refDoc._type === 'sidebarCategory') {
        // Clear parent reference (child of a legacy category)
        tx.patch(refDoc._id, { unset: ['parent'] });
        console.log(`  [unset sidebarCategory.parent] ${label}`);
      } else if (refDoc._type === 'sidebarConfig') {
        // Remove category entries that reference any legacy ID from the array
        const full = await client.fetch(
          `*[_id == $id][0]{"categories": categories[!(category._ref in $ids)]}`,
          { id: refDoc._id, ids: [...deleteIds] }
        );
        tx.patch(refDoc._id, { set: { categories: full.categories || [] } });
        console.log(`  [filter sidebarConfig.categories] ${label}`);
      } else if (refDoc._type === 'docsIndexConfig') {
        // Remove featuredCategories entries that reference any legacy ID
        const full = await client.fetch(
          `*[_id == $id][0]{"featuredCategories": featuredCategories[!(_ref in $ids)]}`,
          { id: refDoc._id, ids: [...deleteIds] }
        );
        tx.patch(refDoc._id, { set: { featuredCategories: full.featuredCategories || [] } });
        console.log(`  [filter docsIndexConfig.featuredCategories] ${label}`);
      } else if (refDoc._type === 'folder') {
        // Folders may have a category reference — just unset it
        tx.patch(refDoc._id, { unset: ['category', 'sidebarCategory'] });
        console.log(`  [unset folder.category] ${label}`);
      } else if (refDoc._type === 'deviceIntegration') {
        // deviceIntegration may have a sidebarCategory reference — unset it
        tx.patch(refDoc._id, { unset: ['sidebarCategory', 'category'] });
        console.log(`  [unset deviceIntegration.category] ${label}`);
      } else {
        // Generic fallback: log and attempt to unset common reference fields
        console.warn(`  [SKIP unknown type ${refDoc._type}] ${label} — check manually`);
      }
    }

    await tx.commit();
  }

  // Step 2: delete the legacy categories
  console.log('\n[cleanup] Deleting legacy categories...');
  const DEL_BATCH = 20;
  for (let i = 0; i < toDelete.length; i += DEL_BATCH) {
    const batch = toDelete.slice(i, i + DEL_BATCH);
    const tx = client.transaction();
    for (const doc of batch) {
      tx.delete(doc._id);
      console.log(`  [delete] ${doc.title} (${doc._id})`);
    }
    await tx.commit();
  }

  console.log(`\n[cleanup] Done — cleared ${allReferencing.length} stale refs, deleted ${toDelete.length} legacy categories`);
}

run().catch(err => { console.error('[cleanup] Error:', err.message); process.exit(1); });
