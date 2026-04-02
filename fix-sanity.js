#!/usr/bin/env node
/**
 * Fix Sanity Content Issues
 */
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

const VALID_PRODUCTS = ['gcxone', 'gcsurge', 'shared'];
const VALID_AUDIENCES = ['all', 'admin', 'manager', 'operator'];

const fixes = {
  slugFixes: [],
  audienceFixes: [],
  productFixes: [],
  duplicateDeletions: [],
};

async function fetchAllDocs() {
  return client.fetch(`*[_type == "doc" || _type == "article"] { 
    _id, _rev, _type, title, slug, targetAudience, product, status 
  }`);
}

function fixSlug(slug) {
  if (!slug || !slug.current) return null;
  
  let fixed = slug.current;
  
  // Lowercase
  fixed = fixed.toLowerCase();
  
  // Remove trailing hyphens
  fixed = fixed.replace(/-+$/, '');
  
  // Remove leading hyphens
  fixed = fixed.replace(/^-+/, '');
  
  // Replace double hyphens with single
  fixed = fixed.replace(/--+/g, '-');
  
  // Remove spaces
  fixed = fixed.replace(/\s+/g, '-');
  
  // Remove special characters (keep a-z, 0-9, -, /)
  fixed = fixed.replace(/[^a-z0-9\/-]/g, '-');
  
  // Clean up multiple hyphens again
  fixed = fixed.replace(/--+/g, '-');
  fixed = fixed.replace(/-+$/, '');
  fixed = fixed.replace(/^-+/, '');
  
  return fixed !== slug.current ? fixed : null;
}

function fixAudience(audiences) {
  if (!audiences || !Array.isArray(audiences)) return null;
  
  // Map invalid audiences to valid ones
  const mapping = {
    'installer': 'admin',
    'integrator': 'admin',
    'developer': 'all',
  };
  
  const fixed = audiences.map(aud => mapping[aud] || aud);
  
  // Remove duplicates
  const unique = [...new Set(fixed)];
  
  // Check if actually changed
  if (JSON.stringify(unique) !== JSON.stringify(audiences)) {
    return unique;
  }
  
  return null;
}

async function runFixes(dryRun = true) {
  console.log(dryRun ? 'DRY RUN - No changes will be made\n' : 'LIVE RUN - Changes will be made\n');
  
  const docs = await fetchAllDocs();
  console.log(`Found ${docs.length} documents\n`);
  
  // Track slug usage for duplicate detection
  const slugUsage = new Map();
  
  for (const doc of docs) {
    const id = doc._id;
    const rev = doc._rev;
    
    // Skip drafts
    if (id.startsWith('drafts.')) continue;
    
    const updates = {};
    
    // 1. Fix slug
    if (doc.slug?.current) {
      const fixedSlug = fixSlug(doc.slug);
      if (fixedSlug) {
        console.log(`[SLUG] ${doc.title}: "${doc.slug.current}" -> "${fixedSlug}"`);
        fixes.slugFixes.push({ id, old: doc.slug.current, new: fixedSlug });
        updates.slug = { current: fixedSlug };
      }
      
      // Track slug usage
      const slugKey = updates.slug?.current || doc.slug.current;
      if (!slugUsage.has(slugKey)) {
        slugUsage.set(slugKey, []);
      }
      slugUsage.get(slugKey).push({ id, title: doc.title, rev });
    }
    
    // 2. Fix audience
    if (doc.targetAudience && Array.isArray(doc.targetAudience)) {
      const fixedAud = fixAudience(doc.targetAudience);
      if (fixedAud) {
        console.log(`[AUDIENCE] ${doc.title}: ${JSON.stringify(doc.targetAudience)} -> ${JSON.stringify(fixedAud)}`);
        fixes.audienceFixes.push({ id, old: doc.targetAudience, new: fixedAud });
        updates.targetAudience = fixedAud;
      }
    }
    
    // 3. Fix product (default to 'shared' if missing)
    if (!doc.product || !VALID_PRODUCTS.includes(doc.product)) {
      const defaultProduct = 'shared';
      console.log(`[PRODUCT] ${doc.title}: "${doc.product}" -> "${defaultProduct}"`);
      fixes.productFixes.push({ id, old: doc.product, new: defaultProduct });
      updates.product = defaultProduct;
    }
    
    // Apply updates if not dry run
    if (!dryRun && Object.keys(updates).length > 0) {
      try {
        await client.patch(id).set(updates).commit();
        console.log(`  ✓ Updated ${doc.title}`);
      } catch (err) {
        console.error(`  ✗ Failed to update ${doc.title}: ${err.message}`);
      }
    }
  }
  
  // 4. Handle duplicates
  console.log('\n\nDUPLICATE SLUGS:');
  for (const [slug, docs] of slugUsage) {
    if (docs.length > 1) {
      console.log(`\n  "${slug}" used by ${docs.length} documents:`);
      for (const d of docs) {
        console.log(`    - ${d.title} (${d.id})`);
      }
      
      // Mark duplicates for deletion (keep first one)
      for (let i = 1; i < docs.length; i++) {
        fixes.duplicateDeletions.push({ id: docs[i].id, title: docs[i].title, slug });
      }
    }
  }
  
  // Delete duplicates if not dry run
  if (!dryRun && fixes.duplicateDeletions.length > 0) {
    console.log('\n\nDELETING DUPLICATES:');
    for (const d of fixes.duplicateDeletions) {
      try {
        await client.delete(d.id);
        console.log(`  ✓ Deleted ${d.title} (${d.id})`);
      } catch (err) {
        console.error(`  ✗ Failed to delete ${d.title}: ${err.message}`);
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Slug fixes: ${fixes.slugFixes.length}`);
  console.log(`Audience fixes: ${fixes.audienceFixes.length}`);
  console.log(`Product fixes: ${fixes.productFixes.length}`);
  console.log(`Duplicates to delete: ${fixes.duplicateDeletions.length}`);
  console.log('='.repeat(60));
  
  if (dryRun) {
    console.log('\nRun with --live to apply changes');
  }
}

const args = process.argv.slice(2);
const liveMode = args.includes('--live');

runFixes(!liveMode).catch(console.error);
