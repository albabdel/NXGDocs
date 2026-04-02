#!/usr/bin/env node
'use strict';

/**
 * Migration Script: Reassign shared documents to specific products
 * 
 * GCXONE and GC Surge are two separate platforms with distinct branding.
 * No documents should remain as "shared" - shared will be added later as needed.
 * 
 * This script reassigns shared documents to the appropriate product
 * and updates branding to match.
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
 * Product assignment rules based on document content
 * 
 * All shared documents must be assigned to either GCXONE or GC Surge.
 * Assignment based on:
 * - Document title and description content
 * - Feature type (alarm management, monitoring, etc.)
 * - Product-specific keywords (GC Surge, etc.)
 */
const PRODUCT_ASSIGNMENTS = {
  // GCXONE documents - alarm management, monitoring, platform features
  'article-feature-ams': {
    product: 'gcxone',
    reason: 'AMS (Alarm Management System) integration is GCXONE feature',
    updateDescription: false,
  },
  'article-feature-autostream': {
    product: 'gcxone',
    reason: 'AutoStream video streaming on alarm is GCXONE monitoring feature',
    updateDescription: false,
  },
  'article-autostream-guide': {
    product: 'gcxone',
    reason: 'AutoStream camera streaming guide for GCXONE monitoring',
    updateDescription: false,
  },
  'article-alarm-best-practices': {
    product: 'gcxone',
    reason: 'Alarm configuration best practices for GCXONE',
    updateDescription: false,
  },
  'article-ams-integration': {
    product: 'gcxone',
    reason: 'Alarm management is core GCXONE feature',
    updateDescription: false,
  },
  'article-feature-healthcheck': {
    product: 'gcxone',
    reason: 'HealthCheck device monitoring is GCXONE feature',
    updateDescription: false,
  },
  'article-feature-maps': {
    product: 'gcxone',
    reason: 'Maps is monitoring/visualization feature for GCXONE',
    updateDescription: false,
  },
  'article-rbac-roles-permissions': {
    product: 'gcxone',
    reason: 'RBAC is for GCXONE platform',
    updateDescription: false,
  },
  'article-uploaded-features': {
    product: 'gcxone',
    reason: 'Feature documentation for GCXONE platform',
    updateDescription: false,
  },
  
  // GC Surge documents
  'article-gc-surge': {
    product: 'gcsurge',
    reason: 'Document is specifically about GC Surge product',
    updateDescription: true, // May need to ensure GC Surge branding
  },
};

/**
 * Replace GCXONE references with GC Surge references
 */
function toGcSurgeDescription(description) {
  if (!description) return description;
  
  return description
    .replace(/GCXONE\s+Technical\s+Documentation/gi, 'GC Surge Documentation')
    .replace(/GCXONE\s+Product\s+Roadmap/gi, 'GC Surge Product Roadmap')
    .replace(/NXGEN\s+GCXONE/gi, 'NXGEN GC Surge')
    .replace(/GCXONE/gi, 'GC Surge');
}

async function main() {
  console.log('='.repeat(70));
  console.log('  Product Assignment Migration');
  console.log('='.repeat(70));
  console.log();
  console.log('📋 Strategy:');
  console.log('   - Reassign shared documents to specific products');
  console.log('   - GCXONE documents keep GCXONE branding');
  console.log('   - GC Surge documents get GC Surge branding');
  console.log('   - No "shared" documents remain (shared added later as needed)');
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
  
  // Query for shared documents
  console.log('📡 Querying Sanity for shared documents...');
  
  const query = `*[
    product == "shared"
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description
  } | order(title asc)`;
  
  let sharedDocs;
  try {
    sharedDocs = await client.fetch(query);
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    process.exit(1);
  }
  
  console.log(`   Found ${sharedDocs.length} shared documents`);
  console.log();
  
  if (sharedDocs.length === 0) {
    console.log('✅ No shared documents found. Migration complete.');
    process.exit(0);
  }
  
  // Display planned changes
  console.log('='.repeat(70));
  console.log('  PLANNED CHANGES');
  console.log('='.repeat(70));
  
  const operations = [];
  
  sharedDocs.forEach((doc, i) => {
    const assignment = PRODUCT_ASSIGNMENTS[doc._id];
    
    if (!assignment) {
      console.log(`\n⚠️  No assignment rule for: ${doc.title} (${doc._id})`);
      console.log('   Will need manual assignment');
      return;
    }
    
    const newProduct = assignment.product;
    const newDescription = assignment.updateDescription 
      ? (newProduct === 'gcsurge' ? toGcSurgeDescription(doc.description) : doc.description)
      : doc.description;
    
    console.log(`\n${i + 1}. ${doc.title}`);
    console.log(`   ID: ${doc._id}`);
    console.log(`   Type: ${doc._type}`);
    console.log(`   Slug: ${doc.slug || 'N/A'}`);
    console.log(`   Current: product=shared`);
    console.log(`   New: product=${newProduct}`);
    console.log(`   Reason: ${assignment.reason}`);
    
    if (assignment.updateDescription && doc.description !== newDescription) {
      console.log(`   Description change:`);
      console.log(`     OLD: "${doc.description || 'N/A'}"`);
      console.log(`     NEW: "${newDescription || 'N/A'}"`);
    } else {
      console.log(`   Description: unchanged (already correct branding)`);
    }
    
    operations.push({
      id: doc._id,
      title: doc.title,
      newProduct,
      newDescription,
      updateDescription: assignment.updateDescription,
    });
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('  SUMMARY');
  console.log('='.repeat(70));
  console.log(`Documents to reassign: ${operations.length}`);
  console.log(`  → GCXONE: ${operations.filter(o => o.newProduct === 'gcxone').length}`);
  console.log(`  → GC Surge: ${operations.filter(o => o.newProduct === 'gcsurge').length}`);
  
  if (DRY_RUN) {
    console.log('\n' + '='.repeat(70));
    console.log('  DRY RUN COMPLETE');
    console.log('='.repeat(70));
    console.log(`\nTo apply these changes, run:`);
    console.log(`  node scripts/update-gcsurge-descriptions.js --commit`);
    process.exit(0);
  }
  
  // Apply changes
  console.log('\n' + '='.repeat(70));
  console.log('  APPLYING CHANGES');
  console.log('='.repeat(70));
  console.log();
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const op of operations) {
    try {
      console.log(`Reassigning ${op.id} (${op.title})...`);
      
      const updates = { product: op.newProduct };
      if (op.updateDescription) {
        updates.description = op.newDescription;
      }
      
      await client
        .patch(op.id)
        .set(updates)
        .commit();
      
      console.log(`   ✅ Assigned to ${op.newProduct}`);
      successCount++;
      
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      errorCount++;
      errors.push({ id: op.id, title: op.title, error: error.message });
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('  MIGRATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Documents reassigned: ${successCount}`);
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
  console.log('   2. Rebuild sites: npm run build:multi');
  console.log('   3. Deploy to Cloudflare Pages');
  console.log('\n📝 Note: "shared" product option remains in schema for future use.');
  
  process.exit(0);
}

// Run the migration
main().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});