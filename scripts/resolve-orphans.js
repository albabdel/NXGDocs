#!/usr/bin/env node
'use strict';

/**
 * Resolve Orphaned Sanity Documents
 *
 * Finds all `doc` documents that have no sidebarCategory reference and
 * auto-assigns them based on slug prefix patterns matching existing categories.
 *
 * Usage:
 *   node scripts/resolve-orphans.js              # Dry run (safe to run any time)
 *   node scripts/resolve-orphans.js --apply      # Apply changes to Sanity
 *   node scripts/resolve-orphans.js --product gcsurge  # Filter by product
 */

const { createClient } = require('@sanity/client');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_DATASET = 'production';
const SANITY_WRITE_TOKEN = 'skrDjnhpDRzNNkD5IgIwEY1c9wiC3JEpfLRqz34aV2U4JQ1JTpHayqmau4LrZzmkig2ekdkfSoHzpJkAOkWVfjjBdmgE3FtPZPl2OchAHjU4pAL3Xe7jxcoAVnKUitg8zmiFgBeYqIoOMS7Ndv0pbwagOubDqRFXLh6LxCbdFqTcJ0yQkVpE';

const APPLY = process.argv.includes('--apply');
const PRODUCT_ARG = (() => {
  const idx = process.argv.indexOf('--product');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2025-01-01',
  useCdn: false,
  token: SANITY_WRITE_TOKEN,
});

async function main() {
  console.log('═'.repeat(60));
  console.log('  Orphan Document Resolver');
  console.log('═'.repeat(60));
  console.log();
  if (!APPLY) {
    console.log('DRY RUN — pass --apply to commit changes\n');
  }

  // 1. Load all sidebar categories
  console.log('Loading sidebar categories from Sanity...');
  const categories = await client.fetch(
    `*[_type == "sidebarCategory"] { _id, "slug": slug.current, title, position } | order(position asc)`
  );
  console.log(`  Found ${categories.length} categories\n`);

  if (categories.length === 0) {
    console.error('No sidebar categories found. Run seed-sidebar-categories.js first.');
    process.exit(1);
  }

  // Build prefix lookup: slug-prefix → category _id
  // e.g., "alarm-management" matches docs whose slug starts with "alarm-management/"
  const prefixMap = new Map();
  for (const cat of categories) {
    if (cat.slug) {
      prefixMap.set(cat.slug, { id: cat._id, title: cat.title });
    }
  }

  // 2. Load all orphan docs (no sidebarCategory)
  const productFilter = PRODUCT_ARG ? ` && product == "${PRODUCT_ARG}"` : '';
  console.log(`Loading orphaned docs (no sidebarCategory)${PRODUCT_ARG ? ` for product: ${PRODUCT_ARG}` : ''}...`);
  const orphans = await client.fetch(
    `*[_type == "doc" && !defined(sidebarCategory)${productFilter} && defined(slug.current)] {
      _id, title, "slug": slug.current, product, status
    } | order(slug.current asc)`
  );
  console.log(`  Found ${orphans.length} orphaned docs\n`);

  if (orphans.length === 0) {
    console.log('No orphans found.');
    return;
  }

  // 3. Match each orphan to a category
  const matched = [];
  const unmatched = [];

  for (const doc of orphans) {
    const slug = doc.slug || '';
    const segments = slug.split('/');

    // Try progressively shorter prefixes (longest first)
    let categoryMatch = null;
    for (let len = segments.length - 1; len >= 1; len--) {
      const prefix = segments.slice(0, len).join('/');
      if (prefixMap.has(prefix)) {
        categoryMatch = { prefix, ...prefixMap.get(prefix) };
        break;
      }
    }

    if (categoryMatch) {
      matched.push({ doc, category: categoryMatch });
    } else {
      unmatched.push(doc);
    }
  }

  // 4. Report matches
  console.log(`═`.repeat(60));
  console.log(`  MATCHES (${matched.length})`);
  console.log(`═`.repeat(60));
  for (const { doc, category } of matched) {
    console.log(`  ✓ [${doc.product || 'no-product'}] ${doc.slug}`);
    console.log(`    → ${category.title} (${category.prefix})`);
  }

  if (unmatched.length > 0) {
    console.log();
    console.log(`═`.repeat(60));
    console.log(`  UNMATCHED (${unmatched.length}) — manual assignment needed`);
    console.log(`═`.repeat(60));
    for (const doc of unmatched) {
      console.log(`  ✗ [${doc.product || 'no-product'}] ${doc.slug} — "${doc.title}"`);
    }
  }

  console.log();
  console.log(`Summary: ${matched.length} can be auto-assigned, ${unmatched.length} need manual review`);

  if (!APPLY) {
    console.log('\nRun with --apply to commit these assignments.');
    return;
  }

  // 5. Apply changes
  console.log();
  console.log(`Applying ${matched.length} assignments...`);
  let success = 0;
  let errors = 0;

  for (const { doc, category } of matched) {
    try {
      await client
        .patch(doc._id)
        .set({ sidebarCategory: { _type: 'reference', _ref: category.id } })
        .commit();
      console.log(`  ✓ ${doc.slug} → ${category.title}`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${doc.slug}: ${err.message}`);
      errors++;
    }
  }

  console.log();
  console.log(`Done: ${success} assigned, ${errors} errors`);
  if (unmatched.length > 0) {
    console.log(`${unmatched.length} docs still need manual category assignment in Sanity Studio.`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
