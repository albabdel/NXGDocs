#!/usr/bin/env node
'use strict';

/**
 * Query Sanity for documents with GCXONE references
 * Used to identify content that needs product-specific handling
 * 
 * GCXONE and GC Surge are separate platforms:
 * - GCXONE content should have GCXONE branding
 * - GC Surge content should have GC Surge branding
 * - Shared content with GCXONE refs needs to be split into product-specific versions
 */

const { createClient } = require('@sanity/client');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_DATASET = 'production';
const SANITY_API_TOKEN = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

async function queryGCXONEReferences() {
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: SANITY_API_TOKEN,
  });

  console.log('='.repeat(70));
  console.log('  Querying Sanity for GCXONE References');
  console.log('='.repeat(70));
  console.log();
  console.log('📋 Product Strategy:');
  console.log('   - GCXONE (product=gcxone): Documents with GCXONE branding');
  console.log('   - GC Surge (product=gcsurge): Documents with GC Surge branding');
  console.log('   - Shared (product=shared): Shared documents - need product separation');
  console.log();

  // Query 1: Shared documents with GCXONE (need to be split)
  const sharedQuery = `*[
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
    "matchField": "shared"
  }`;

  // Query 2: GC Surge documents with GCXONE (need fixing - wrong branding)
  const gcsurgeQuery = `*[
    product == "gcsurge" && 
    (description match "*GCXONE*" || description match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description,
    "matchField": "gcsurge"
  }`;

  // Query 3: Landing pages with GCXONE
  const landingQuery = `*[
    _type == "landingPage" && 
    (product == "gcsurge" || product == "shared") &&
    (tagline match "*GCXONE*" || tagline match "*gcxone*" || 
     description match "*GCXONE*" || description match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    tagline,
    description,
    "matchField": "landingPage"
  }`;

  console.log('Running GROQ queries...');
  console.log();

  try {
    const [sharedResults, gcsurgeResults, landingResults] = await Promise.all([
      client.fetch(sharedQuery),
      client.fetch(gcsurgeQuery),
      client.fetch(landingQuery)
    ]);

    // Deduplicate by _id
    const allResults = [...sharedResults, ...gcsurgeResults, ...landingResults];
    const seenIds = new Set();
    const uniqueResults = [];
    
    allResults.forEach(doc => {
      if (!seenIds.has(doc._id)) {
        seenIds.add(doc._id);
        uniqueResults.push(doc);
      }
    });

    // Categorize results
    const sharedDocs = sharedResults;
    const gcsurgeDocs = gcsurgeResults;
    const landingPages = landingResults;

    console.log('='.repeat(70));
    console.log('  RESULTS');
    console.log('='.repeat(70));
    console.log();

    // SHARED documents - need to be split into product-specific versions
    if (sharedDocs.length > 0) {
      console.log('📁 SHARED DOCUMENTS (need product separation):');
      console.log(`   Count: ${sharedDocs.length}`);
      console.log('   Action: Split into GCXONE + GC Surge versions');
      console.log();
      
      sharedDocs.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.title}`);
        console.log(`      ID: ${doc._id}`);
        console.log(`      Slug: ${doc.slug || 'N/A'}`);
        console.log(`      Description: "${doc.description || 'N/A'}"`);
        console.log();
      });
    }

    // GC SURGE documents - have wrong branding (need fix)
    if (gcsurgeDocs.length > 0) {
      console.log('❌ GC SURGE DOCUMENTS (have wrong branding):');
      console.log(`   Count: ${gcsurgeDocs.length}`);
      console.log('   Action: Replace GCXONE with GC Surge in descriptions');
      console.log();
      
      gcsurgeDocs.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.title}`);
        console.log(`      ID: ${doc._id}`);
        console.log(`      Description: "${doc.description || 'N/A'}"`);
        console.log();
      });
    }

    // LANDING PAGES
    if (landingPages.length > 0) {
      console.log('📄 LANDING PAGES:');
      console.log(`   Count: ${landingPages.length}`);
      console.log();
      
      landingPages.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.title}`);
        console.log(`      ID: ${doc._id}`);
        console.log(`      Product: ${doc.product}`);
        if (doc.description) console.log(`      Description: "${doc.description}"`);
        if (doc.tagline) console.log(`      Tagline: "${doc.tagline}"`);
        console.log();
      });
    }

    // Summary
    console.log('='.repeat(70));
    console.log('  SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total documents found: ${uniqueResults.length}`);
    console.log(`Shared (need split): ${sharedDocs.length}`);
    console.log(`GC Surge (need fix): ${gcsurgeDocs.length}`);
    console.log(`Landing pages: ${landingPages.length}`);
    console.log();

    if (sharedDocs.length > 0) {
      console.log('🔧 RECOMMENDED ACTION:');
      console.log('   Run: node scripts/update-gcsurge-descriptions.js --commit');
      console.log('   This will:');
      console.log('   1. Create GC Surge copies with GC Surge branding');
      console.log('   2. Convert shared docs to GCXONE (product=gcxone)');
      console.log('   3. Each platform gets its own branded content');
    }

    return uniqueResults;
  } catch (error) {
    console.error('Error querying Sanity:', error.message);
    process.exit(1);
  }
}

// Run the query
queryGCXONEReferences();