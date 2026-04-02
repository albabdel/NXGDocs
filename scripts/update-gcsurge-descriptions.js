#!/usr/bin/env node
'use strict';

/**
 * Migration Script: Create product-specific content for GC Surge
 * 
 * GCXONE and GC Surge are two separate platforms with distinct branding.
 * This script:
 * 1. Creates GC Surge-specific copies of shared documents with GC Surge branding
 * 2. Updates shared documents to be explicitly GCXONE documents (product=gcxone)
 * 3. Ensures each product has its own branded content
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
 * Replace GCXONE references with GC Surge references for GC Surge documents
 */
function toGcSurgeDescription(description) {
  if (!description) return description;
  
  return description
    .replace(/GCXONE\s+Technical\s+Documentation/gi, 'GC Surge Documentation')
    .replace(/GCXONE\s+Product\s+Roadmap/gi, 'GC Surge Product Roadmap')
    .replace(/NXGEN\s+GCXONE/gi, 'NXGEN GC Surge')
    .replace(/GCXONE/gi, 'GC Surge');
}

/**
 * Ensure GCXONE branding is explicit (for documents being converted from shared to gcxone)
 */
function toGcxoneDescription(description) {
  if (!description) return description;
  // Already has GCXONE, keep it
  if (/GCXONE/i.test(description)) return description;
  // Add GCXONE where it makes sense
  return description;
}

async function main() {
  console.log('='.repeat(70));
  console.log('  Product-Specific Content Migration for GC Surge');
  console.log('='.repeat(70));
  console.log();
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be committed');
    console.log('   Run with --commit flag to apply changes');
  } else {
    console.log('✍️  COMMIT MODE - Changes will be applied to Sanity');
  }
  console.log();
  
  console.log('📋 Strategy:');
  console.log('   1. Find shared documents with GCXONE references');
  console.log('   2. Create GC Surge copies with GC Surge branding');
  console.log('   3. Convert shared documents to GCXONE documents (product=gcxone)');
  console.log();
  
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: SANITY_API_TOKEN,
  });
  
  // Query for shared documents with GCXONE references
  console.log('📡 Querying Sanity for shared documents with GCXONE references...');
  
  const query = `*[
    product == "shared" && 
    (description match "*GCXONE*" || description match "*gcxone*" ||
     title match "*GCXONE*" || title match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description,
    body,
    tags,
    sidebarCategory,
    sidebarPosition,
    sidebarLabel,
    targetAudience,
    status,
    workflowConfig
  } | order(title asc)`;
  
  let sharedDocsWithGcxone;
  try {
    sharedDocsWithGcxone = await client.fetch(query);
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    process.exit(1);
  }
  
  console.log(`   Found ${sharedDocsWithGcxone.length} shared documents with GCXONE references`);
  console.log();
  
  // Also check for any gcsurge documents that might have GCXONE references
  const gcsurgeQuery = `*[
    product == "gcsurge" && 
    (description match "*GCXONE*" || description match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description
  } | order(title asc)`;
  
  let gcsurgeDocsWithGcxone;
  try {
    gcsurgeDocsWithGcxone = await client.fetch(gcsurgeQuery);
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    process.exit(1);
  }
  
  if (gcsurgeDocsWithGcxone.length > 0) {
    console.log(`   Found ${gcsurgeDocsWithGcxone.length} GC Surge documents with GCXONE references (need fixing)`);
  }
  console.log();
  
  if (sharedDocsWithGcxone.length === 0 && gcsurgeDocsWithGcxone.length === 0) {
    console.log('✅ No documents need updating. Migration complete.');
    process.exit(0);
  }
  
  // Display planned changes
  console.log('='.repeat(70));
  console.log('  PLANNED CHANGES');
  console.log('='.repeat(70));
  
  const operations = [];
  
  // Process shared documents
  if (sharedDocsWithGcxone.length > 0) {
    console.log('\n📚 SHARED DOCUMENTS (will be split into product-specific versions):');
    console.log('-'.repeat(70));
    
    sharedDocsWithGcxone.forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.title}`);
      console.log(`   ID: ${doc._id}`);
      console.log(`   Type: ${doc._type}`);
      console.log(`   Slug: ${doc.slug || 'N/A'}`);
      console.log(`   Current: product=shared, description="${doc.description || 'N/A'}"`);
      console.log();
      console.log(`   Planned actions:`);
      console.log(`   a) Create GC Surge copy (product=gcsurge) with:` );
      console.log(`      - description: "${toGcSurgeDescription(doc.description) || 'N/A'}"`);
      console.log(`      - slug: "${doc.slug}-gcsurge" (to avoid conflict)`);
      console.log(`   b) Convert original to GCXONE (product=gcxone)`);
      console.log(`      - description: unchanged (keeps GCXONE branding)`);
      
      operations.push({
        type: 'split',
        originalId: doc._id,
        originalDoc: doc,
        gcsurgeDescription: toGcSurgeDescription(doc.description)
      });
    });
  }
  
  // Process GC Surge documents that need fixing
  if (gcsurgeDocsWithGcxone.length > 0) {
    console.log('\n\n🔧 GC SURGE DOCUMENTS (need description fix):');
    console.log('-'.repeat(70));
    
    gcsurgeDocsWithGcxone.forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.title}`);
      console.log(`   ID: ${doc._id}`);
      console.log(`   Type: ${doc._type}`);
      console.log(`   Slug: ${doc.slug || 'N/A'}`);
      console.log(`   Current description: "${doc.description || 'N/A'}"`);
      console.log(`   New description: "${toGcSurgeDescription(doc.description) || 'N/A'}"`);
      
      operations.push({
        type: 'fix',
        docId: doc._id,
        doc: doc,
        newDescription: toGcSurgeDescription(doc.description)
      });
    });
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('  SUMMARY');
  console.log('='.repeat(70));
  console.log(`Documents to split (shared → gcxone + gcsurge): ${sharedDocsWithGcxone.length}`);
  console.log(`GC Surge documents to fix: ${gcsurgeDocsWithGcxone.length}`);
  console.log(`Total operations: ${operations.length}`);
  
  if (DRY_RUN) {
    console.log('\n' + '='.repeat(70));
    console.log('  DRY RUN COMPLETE');
    console.log('='.repeat(70));
    console.log(`\nTo apply these changes, run:`);
    console.log(`  node scripts/update-gcsurge-descriptions.js --commit`);
    console.log('\n⚠️  Note: This will:');
    console.log(`   - Create ${sharedDocsWithGcxone.length} new GC Surge documents`);
    console.log(`   - Convert ${sharedDocsWithGcxone.length} shared documents to GCXONE`);
    console.log(`   - Fix ${gcsurgeDocsWithGcxone.length} existing GC Surge documents`);
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
  const createdIds = [];
  
  for (const op of operations) {
    try {
      if (op.type === 'fix') {
        // Fix existing GC Surge document
        console.log(`Fixing ${op.docId} (${op.doc.title})...`);
        
        const result = await client
          .patch(op.docId)
          .set({ description: op.newDescription })
          .commit();
        
        console.log(`   ✅ Updated description`);
        successCount++;
        
      } else if (op.type === 'split') {
        // Step 1: Create GC Surge copy
        console.log(`Creating GC Surge copy of "${op.originalDoc.title}"...`);
        
        const newDoc = {
          _type: op.originalDoc._type,
          title: op.originalDoc.title,
          slug: {
            _type: 'slug',
            current: op.originalDoc.slug ? `${op.originalDoc.slug}` : undefined
          },
          product: 'gcsurge',
          description: op.gcsurgeDescription,
          status: op.originalDoc.status || 'published',
          tags: op.originalDoc.tags,
          sidebarCategory: op.originalDoc.sidebarCategory,
          sidebarPosition: op.originalDoc.sidebarPosition,
          sidebarLabel: op.originalDoc.sidebarLabel,
          targetAudience: op.originalDoc.targetAudience,
          // Copy workflow config if exists
          workflowConfig: op.originalDoc.workflowConfig ? {
            ...op.originalDoc.workflowConfig,
            migratedFrom: op.originalId,
            migratedAt: new Date().toISOString()
          } : undefined
        };
        
        // Remove undefined fields
        Object.keys(newDoc).forEach(key => {
          if (newDoc[key] === undefined) delete newDoc[key];
        });
        
        const gcsurgeDoc = await client.create(newDoc);
        console.log(`   ✅ Created GC Surge document: ${gcsurgeDoc._id}`);
        createdIds.push(gcsurgeDoc._id);
        
        // Step 2: Convert original to GCXONE
        console.log(`   Converting original to GCXONE...`);
        
        await client
          .patch(op.originalId)
          .set({ product: 'gcxone' })
          .commit();
        
        console.log(`   ✅ Converted original to product=gcxone`);
        successCount++;
      }
      
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      errorCount++;
      errors.push({ 
        operation: op.type, 
        id: op.originalId || op.docId, 
        error: error.message 
      });
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('  MIGRATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`Operations successful: ${successCount}`);
  console.log(`Operations failed: ${errorCount}`);
  console.log(`GC Surge documents created: ${createdIds.length}`);
  
  if (createdIds.length > 0) {
    console.log('\nCreated GC Surge document IDs:');
    createdIds.forEach(id => console.log(`  - ${id}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(e => {
      console.log(`   - ${e.operation} ${e.id}: ${e.error}`);
    });
    process.exit(1);
  }
  
  console.log('\n✅ Migration complete!');
  console.log('\n📚 Next steps:');
  console.log('   1. Verify changes in Sanity Studio');
  console.log('   2. Check that GCXONE documents show GCXONE branding');
  console.log('   3. Check that GC Surge documents show GC Surge branding');
  console.log('   4. Rebuild both products: npm run build:multi');
  console.log('   5. Deploy to Cloudflare Pages');
  
  process.exit(0);
}

// Run the migration
main().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});