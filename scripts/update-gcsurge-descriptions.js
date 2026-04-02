#!/usr/bin/env node
'use strict';

/**
 * Migration Script: Update GC Surge descriptions
 * 
 * Removes GCXONE branding references from Sanity documents
 * to ensure GC Surge site shows only GC Surge branding.
 * 
 * Usage:
 *   npm run update:gcsurge-descriptions          # Dry run (shows changes)
 *   npm run update:gcsurge-descriptions -- --commit  # Apply changes
 */

const { createClient } = require('@sanity/client');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_DATASET = 'production';
const SANITY_API_TOKEN = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const DRY_RUN = !process.argv.includes('--commit');

/**
 * Clean description of GCXONE references based on product type
 */
function cleanDescription(description, productId) {
  if (!description) return description;
  
  if (productId === 'gcsurge') {
    // For GC Surge documents: Replace GCXONE with GC Surge
    return description
      .replace(/GCXONE\s+Technical\s+Documentation/gi, 'GC Surge Documentation')
      .replace(/GCXONE\s+Product\s+Roadmap/gi, 'GC Surge Product Roadmap')
      .replace(/NXGEN\s+GCXONE/gi, 'NXGEN GC Surge')
      .replace(/GCXONE/gi, 'GC Surge');
  }
  
  // For shared content: Make product-agnostic
  return description
    .replace(/GCXONE\s+Technical\s+Documentation/gi, 'NXGEN Documentation')
    .replace(/GCXONE\s+Product\s+Roadmap/gi, 'Product Roadmap')
    .replace(/NXGEN\s+GCXONE/gi, 'NXGEN')
    .replace(/GCXONE/gi, 'the platform');
}

/**
 * Clean title of GCXONE references
 */
function cleanTitle(title, productId) {
  if (!title) return title;
  
  if (productId === 'gcsurge') {
    return title
      .replace(/GCXONE/gi, 'GC Surge');
  }
  
  // Shared content: Keep title as-is (titles are usually fine)
  return title;
}

/**
 * Clean tagline of GCXONE references
 */
function cleanTagline(tagline, productId) {
  if (!tagline) return tagline;
  
  if (productId === 'gcsurge') {
    return tagline
      .replace(/GCXONE/gi, 'GC Surge');
  }
  
  return tagline
    .replace(/GCXONE/gi, 'the platform');
}

async function main() {
  console.log('='.repeat(60));
  console.log('  GC Surge Description Migration');
  console.log('='.repeat(60));
  console.log();
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be committed');
    console.log('   Run with --commit flag to apply changes');
  } else {
    console.log('✍️  COMMIT MODE - Changes will be applied to Sanity');
  }
  console.log();
  
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: SANITY_API_TOKEN,
  });
  
  // Query for documents with GCXONE references
  console.log('📡 Querying Sanity for documents with GCXONE references...');
  
  const query = `*[
    (product == "gcsurge" || product == "shared") && 
    (description match "*GCXONE*" || description match "*gcxone*" ||
     title match "*GCXONE*" || title match "*gcxone*" ||
     tagline match "*GCXONE*" || tagline match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description,
    tagline
  } | order(product asc, title asc)`;
  
  let results;
  try {
    results = await client.fetch(query);
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    process.exit(1);
  }
  
  console.log(`   Found ${results.length} documents with GCXONE references`);
  console.log();
  
  if (results.length === 0) {
    console.log('✅ No documents need updating. Migration complete.');
    process.exit(0);
  }
  
  // Categorize results
  const gcsurgeDocs = results.filter(d => d.product === 'gcsurge');
  const sharedDocs = results.filter(d => d.product === 'shared');
  
  console.log('='.repeat(60));
  console.log('  PLANNED CHANGES');
  console.log('='.repeat(60));
  console.log();
  
  const changes = [];
  
  results.forEach(doc => {
    const updates = {};
    const changesList = [];
    
    // Check description
    if (doc.description && /GCXONE/i.test(doc.description)) {
      const newDesc = cleanDescription(doc.description, doc.product);
      if (newDesc !== doc.description) {
        updates.description = newDesc;
        changesList.push({
          field: 'description',
          old: doc.description,
          new: newDesc
        });
      }
    }
    
    // Check title
    if (doc.title && /GCXONE/i.test(doc.title)) {
      const newTitle = cleanTitle(doc.title, doc.product);
      if (newTitle !== doc.title) {
        updates.title = newTitle;
        changesList.push({
          field: 'title',
          old: doc.title,
          new: newTitle
        });
      }
    }
    
    // Check tagline
    if (doc.tagline && /GCXONE/i.test(doc.tagline)) {
      const newTagline = cleanTagline(doc.tagline, doc.product);
      if (newTagline !== doc.tagline) {
        updates.tagline = newTagline;
        changesList.push({
          field: 'tagline',
          old: doc.tagline,
          new: newTagline
        });
      }
    }
    
    if (Object.keys(updates).length > 0) {
      changes.push({
        id: doc._id,
        type: doc._type,
        title: doc.title,
        product: doc.product,
        slug: doc.slug,
        updates,
        changesList
      });
    }
  });
  
  // Display changes
  console.log(`Documents to update: ${changes.length}`);
  console.log(`  GC Surge documents: ${changes.filter(c => c.product === 'gcsurge').length}`);
  console.log(`  Shared documents: ${changes.filter(c => c.product === 'shared').length}`);
  console.log();
  
  changes.forEach((change, i) => {
    console.log(`\n${i + 1}. ${change.title}`);
    console.log(`   ID: ${change.id}`);
    console.log(`   Type: ${change.type}`);
    console.log(`   Product: ${change.product}`);
    console.log(`   Slug: ${change.slug || 'N/A'}`);
    console.log(`   Changes:`);
    
    change.changesList.forEach(c => {
      console.log(`     - ${c.field}:`);
      console.log(`       OLD: "${c.old}"`);
      console.log(`       NEW: "${c.new}"`);
    });
  });
  
  if (DRY_RUN) {
    console.log('\n' + '='.repeat(60));
    console.log('  DRY RUN COMPLETE');
    console.log('='.repeat(60));
    console.log(`\nTo apply these changes, run:`);
    console.log(`  npm run update:gcsurge-descriptions -- --commit`);
    console.log(`\nOr directly:`);
    console.log(`  node scripts/update-gcsurge-descriptions.js --commit`);
    process.exit(0);
  }
  
  // Apply changes
  console.log('\n' + '='.repeat(60));
  console.log('  APPLYING CHANGES');
  console.log('='.repeat(60));
  console.log();
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const change of changes) {
    try {
      console.log(`Updating ${change.id} (${change.title})...`);
      
      const result = await client
        .patch(change.id)
        .set(change.updates)
        .commit();
      
      console.log(`   ✅ Updated successfully`);
      successCount++;
      
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      errorCount++;
      errors.push({ id: change.id, title: change.title, error: error.message });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('  MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total documents found: ${results.length}`);
  console.log(`Documents updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(e => {
      console.log(`   - ${e.id} (${e.title}): ${e.error}`);
    });
    process.exit(1);
  }
  
  console.log('\n✅ Migration complete!');
  console.log('\n📚 Next steps:');
  console.log('   1. Verify changes in Sanity Studio');
  console.log('   2. Rebuild GC Surge site: npm run build:multi (or PRODUCT=gcsurge npm run build)');
  console.log('   3. Deploy to Cloudflare Pages');
  
  process.exit(0);
}

// Run the migration
main().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});