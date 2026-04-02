#!/usr/bin/env node
'use strict';

/**
 * Query Sanity for full document content to determine product assignment
 * Each document should be assigned to ONE product (GCXONE or GC Surge)
 * No "shared" documents - shared will be added later as needed
 */

const { createClient } = require('@sanity/client');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_DATASET = 'production';
const SANITY_API_TOKEN = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

async function analyzeDocuments() {
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: SANITY_API_TOKEN,
  });

  console.log('='.repeat(70));
  console.log('  Analyzing Shared Documents for Product Assignment');
  console.log('='.repeat(70));
  console.log();

  // Query shared documents with GCXONE references
  const query = `*[
    product == "shared" && 
    (description match "*GCXONE*" || description match "*gcxone*")
  ] {
    _id,
    _type,
    title,
    "slug": slug.current,
    product,
    description,
    tags,
    "bodyText": body[0...3].children[].text
  } | order(title asc)`;

  try {
    const docs = await client.fetch(query);
    console.log(`Found ${docs.length} shared documents with GCXONE references`);
    console.log();

    docs.forEach((doc, i) => {
      console.log('='.repeat(70));
      console.log(`${i + 1}. ${doc.title}`);
      console.log('='.repeat(70));
      console.log(`ID: ${doc._id}`);
      console.log(`Type: ${doc._type}`);
      console.log(`Slug: ${doc.slug || 'N/A'}`);
      console.log();
      console.log('Description:');
      console.log(`  "${doc.description || 'N/A'}"`);
      console.log();
      console.log('Tags:');
      console.log(`  ${doc.tags?.join(', ') || 'None'}`);
      console.log();
      console.log('Body preview:');
      const bodyPreview = doc.bodyText?.join(' ').slice(0, 300) || 'No content';
      console.log(`  ${bodyPreview}${bodyPreview.length >= 300 ? '...' : ''}`);
      console.log();
      
      // Suggest assignment based on content
      let suggestedProduct = 'gcxone'; // Default
      let reason = '';
      
      const titleLower = doc.title.toLowerCase();
      const descLower = (doc.description || '').toLowerCase();
      const tagsLower = (doc.tags || []).join(' ').toLowerCase();
      
      // Check for GC Surge specific keywords
      if (titleLower.includes('surge') || descLower.includes('surge') || tagsLower.includes('surge')) {
        suggestedProduct = 'gcsurge';
        reason = 'Contains "Surge" keyword';
      }
      // Check for GCXONE specific features
      else if (titleLower.includes('alarm') || titleLower.includes('cms') || 
               descLower.includes('alarm') || descLower.includes('monitoring')) {
        suggestedProduct = 'gcxone';
        reason = 'Alarm management / monitoring is core GCXONE feature';
      }
      else if (titleLower.includes('rbac') || titleLower.includes('role') || titleLower.includes('permission')) {
        suggestedProduct = 'gcxone';
        reason = 'RBAC is platform-level feature, currently references GCXONE';
      }
      else if (titleLower.includes('map')) {
        suggestedProduct = 'gcxone';
        reason = 'Maps is monitoring/visualization feature (GCXONE)';
      }
      else {
        suggestedProduct = 'gcxone';
        reason = 'Default - references GCXONE in description';
      }
      
      console.log(`Suggested assignment: ${suggestedProduct.toUpperCase()}`);
      console.log(`Reason: ${reason}`);
      console.log();
    });

    console.log('='.repeat(70));
    console.log('  SUMMARY');
    console.log('='.repeat(70));
    console.log();
    console.log('Each document should be assigned to ONE product:');
    console.log('  - GCXONE (gcxone): Keep GCXONE branding in description');
    console.log('  - GC Surge (gcsurge): Update description to GC Surge branding');
    console.log();
    console.log('Run the migration with:');
    console.log('  node scripts/update-gcsurge-descriptions.js --commit');

  } catch (error) {
    console.error('Error querying Sanity:', error.message);
    process.exit(1);
  }
}

analyzeDocuments();