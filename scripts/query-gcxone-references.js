#!/usr/bin/env node
'use strict';

/**
 * Query Sanity for documents with GCXONE references in descriptions
 * Used to identify content that needs product-specific descriptions for GC Surge
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

  console.log('='.repeat(60));
  console.log('  Querying Sanity for GCXONE References');
  console.log('='.repeat(60));
  console.log();

  // Query 1: Documents with GCXONE in description
  const descQuery = `*[
    (product == "gcsurge" || product == "shared") && 
    (description match "*GCXONE*" || description match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description,
    "matchField": "description"
  }`;

  // Query 2: Documents with GCXONE in title
  const titleQuery = `*[
    (product == "gcsurge" || product == "shared") && 
    (title match "*GCXONE*" || title match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description,
    "matchField": "title"
  }`;

  // Query 3: Landing pages with GCXONE in tagline or description
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
  console.log('Checking: description, title, tagline fields');
  console.log('Filter: product=gcsurge OR product=shared');
  console.log('Pattern: contains "GCXONE" (case-insensitive)');
  console.log();

  try {
    const [descResults, titleResults, landingResults] = await Promise.all([
      client.fetch(descQuery),
      client.fetch(titleQuery),
      client.fetch(landingQuery)
    ]);

    // Deduplicate by _id (documents may match multiple queries)
    const allResults = [...descResults, ...titleResults, ...landingResults];
    const seenIds = new Set();
    const uniqueResults = [];
    const resultsByField = { description: [], title: [], landingPage: [] };
    
    allResults.forEach(doc => {
      if (!seenIds.has(doc._id)) {
        seenIds.add(doc._id);
        uniqueResults.push(doc);
      }
      if (!resultsByField[doc.matchField].find(d => d._id === doc._id)) {
        resultsByField[doc.matchField].push(doc);
      }
    });

    // Group by product
    const gcsurgeDocs = uniqueResults.filter(d => d.product === 'gcsurge');
    const sharedDocs = uniqueResults.filter(d => d.product === 'shared');

    console.log('='.repeat(60));
    console.log('  RESULTS BY FIELD');
    console.log('='.repeat(60));
    console.log(`Description field matches: ${resultsByField.description.length}`);
    console.log(`Title field matches: ${resultsByField.title.length}`);
    console.log(`Landing page matches: ${resultsByField.landingPage.length}`);
    console.log();

    console.log('='.repeat(60));
    console.log('  GC SURGE DOCUMENTS');
    console.log('='.repeat(60));
    console.log(`Count: ${gcsurgeDocs.length}`);
    console.log();
    
    gcsurgeDocs.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.title}`);
      console.log(`   ID: ${doc._id}`);
      console.log(`   Type: ${doc._type}`);
      console.log(`   Slug: ${doc.slug || 'N/A'}`);
      console.log(`   Product: ${doc.product}`);
      console.log(`   Match: ${doc.matchField}`);
      if (doc.description) console.log(`   Description: ${doc.description}`);
      if (doc.tagline) console.log(`   Tagline: ${doc.tagline}`);
      console.log();
    });

    console.log('='.repeat(60));
    console.log('  SHARED DOCUMENTS');
    console.log('='.repeat(60));
    console.log(`Count: ${sharedDocs.length}`);
    console.log();

    sharedDocs.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.title}`);
      console.log(`   ID: ${doc._id}`);
      console.log(`   Type: ${doc._type}`);
      console.log(`   Slug: ${doc.slug || 'N/A'}`);
      console.log(`   Product: ${doc.product}`);
      console.log(`   Match: ${doc.matchField}`);
      if (doc.description) console.log(`   Description: ${doc.description}`);
      if (doc.tagline) console.log(`   Tagline: ${doc.tagline}`);
      console.log();
    });

    // Summary
    console.log('='.repeat(60));
    console.log('  SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total unique documents found: ${uniqueResults.length}`);
    console.log(`GC Surge documents: ${gcsurgeDocs.length}`);
    console.log(`Shared documents: ${sharedDocs.length}`);
    console.log();

    // Output document IDs for migration script
    console.log('Document IDs for migration:');
    uniqueResults.forEach(doc => {
      console.log(`  ${doc._id} (${doc.product}, ${doc.matchField})`);
    });

    return uniqueResults;
  } catch (error) {
    console.error('Error querying Sanity:', error.message);
    process.exit(1);
  }
}

// Run the query
queryGCXONEReferences();