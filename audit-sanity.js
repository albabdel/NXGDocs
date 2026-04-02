#!/usr/bin/env node
/**
 * Comprehensive Sanity Content Audit
 * Checks for broken links, invalid slugs, missing fields, duplicates, etc.
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

const issues = {
  brokenLinks: [],
  invalidSlugs: [],
  missingFields: [],
  duplicateSlugs: [],
  invalidAudiences: [],
  invalidProducts: [],
  orphanedDocs: [],
  warnings: [],
};

async function fetchAllContent() {
  console.log('Fetching all content from Sanity...\n');
  
  const [docs, articles, categories, sidebarCategories, landingPages, releases] = await Promise.all([
    client.fetch(`*[_type == "doc"] { _id, title, slug, targetAudience, product, status, body, sidebarCategory, category }`),
    client.fetch(`*[_type == "article"] { _id, title, slug, targetAudience, product, status, body }`),
    client.fetch(`*[_type == "sidebarCategory"] { _id, title, slug, product }`),
    client.fetch(`*[_type == "sidebarCategory"] { _id, title, slug, product }`),
    client.fetch(`*[_type == "landingPage"] { _id, title, slug, product, status }`),
    client.fetch(`*[_type == "release"] { _id, title, slug, product }`),
  ]);
  
  return { docs, articles, categories, sidebarCategories, landingPages, releases };
}

function extractLinksFromBody(body) {
  if (!body) return [];
  
  const links = [];
  const bodyStr = JSON.stringify(body);
  
  // Match markdown links: [text](/docs/slug)
  const mdLinkRegex = /\]\(\/docs\/([a-zA-Z0-9_\/-]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(bodyStr)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

function validateSlug(slug, docId, docTitle) {
  if (!slug || !slug.current) {
    issues.missingFields.push({ docId, docTitle, field: 'slug' });
    return false;
  }
  
  const slugStr = slug.current;
  
  // Check for double hyphens
  if (slugStr.includes('--')) {
    issues.invalidSlugs.push({ docId, docTitle, slug: slugStr, issue: 'double hyphen' });
  }
  
  // Check for spaces
  if (slugStr.includes(' ')) {
    issues.invalidSlugs.push({ docId, docTitle, slug: slugStr, issue: 'contains space' });
  }
  
  // Check for uppercase
  if (slugStr !== slugStr.toLowerCase()) {
    issues.invalidSlugs.push({ docId, docTitle, slug: slugStr, issue: 'contains uppercase' });
  }
  
  // Check for special characters (allow a-z, 0-9, -, /)
  if (!/^[a-z0-9\/-]+$/.test(slugStr)) {
    issues.invalidSlugs.push({ docId, docTitle, slug: slugStr, issue: 'contains special characters' });
  }
  
  // Check for leading/trailing hyphens
  if (slugStr.startsWith('-') || slugStr.endsWith('-')) {
    issues.invalidSlugs.push({ docId, docTitle, slug: slugStr, issue: 'leading/trailing hyphen' });
  }
  
  return true;
}

function validateAudience(audiences, docId, docTitle) {
  if (!audiences || !Array.isArray(audiences) || audiences.length === 0) {
    return; // Default to 'all' is fine
  }
  
  for (const aud of audiences) {
    if (!VALID_AUDIENCES.includes(aud)) {
      issues.invalidAudiences.push({ docId, docTitle, audience: aud });
    }
  }
}

function validateProduct(product, docId, docTitle) {
  if (!product) {
    issues.missingFields.push({ docId, docTitle, field: 'product' });
    return;
  }
  
  if (!VALID_PRODUCTS.includes(product)) {
    issues.invalidProducts.push({ docId, docTitle, product });
  }
}

function checkDuplicateSlugs(docs) {
  const slugMap = new Map();
  
  for (const doc of docs) {
    if (!doc.slug?.current) continue;
    
    const slug = doc.slug.current;
    if (slugMap.has(slug)) {
      issues.duplicateSlugs.push({ 
        slug, 
        doc1: slugMap.get(slug), 
        doc2: { id: doc._id, title: doc.title } 
      });
    } else {
      slugMap.set(slug, { id: doc._id, title: doc.title });
    }
  }
}

function checkBrokenLinks(docs, allSlugs) {
  const slugSet = new Set(allSlugs);
  
  for (const doc of docs) {
    const links = extractLinksFromBody(doc.body);
    
    for (const link of links) {
      // Check if link target exists
      if (!slugSet.has(link)) {
        // Check if it's a link to an index page (might exist as category)
        const baseLink = link.replace(/\/index$/, '');
        if (!slugSet.has(baseLink) && !slugSet.has(link + '/index')) {
          issues.brokenLinks.push({ 
            docId: doc._id, 
            docTitle: doc.title, 
            brokenLink: link 
          });
        }
      }
    }
  }
}

async function runAudit() {
  try {
    const { docs, articles, categories, landingPages, releases } = await fetchAllContent();
    
    const allDocs = [...docs, ...articles];
    const allSlugs = allDocs
      .filter(d => d.slug?.current)
      .map(d => d.slug.current);
    
    console.log(`Found ${docs.length} docs, ${articles.length} articles, ${categories.length} categories\n`);
    
    // 1. Validate slugs
    console.log('1. Checking slugs...');
    for (const doc of allDocs) {
      validateSlug(doc.slug, doc._id, doc.title);
    }
    
    // 2. Check for duplicate slugs
    console.log('2. Checking for duplicate slugs...');
    checkDuplicateSlugs(allDocs);
    
    // 3. Validate audiences
    console.log('3. Checking target audiences...');
    for (const doc of allDocs) {
      validateAudience(doc.targetAudience, doc._id, doc.title);
    }
    
    // 4. Validate products
    console.log('4. Checking products...');
    for (const doc of allDocs) {
      validateProduct(doc.product, doc._id, doc.title);
    }
    
    // 5. Check broken links
    console.log('5. Checking broken internal links...');
    checkBrokenLinks(allDocs, allSlugs);
    
    // 6. Check for orphaned docs (no category)
    console.log('6. Checking for orphaned docs...');
    for (const doc of docs) {
      if (!doc.sidebarCategory && !doc.category) {
        issues.orphanedDocs.push({ docId: doc._id, docTitle: doc.title });
      }
    }
    
    // Print results
    console.log('\n' + '='.repeat(60));
    console.log('AUDIT RESULTS');
    console.log('='.repeat(60) + '\n');
    
    if (issues.brokenLinks.length > 0) {
      console.log(`❌ BROKEN LINKS (${issues.brokenLinks.length}):`);
      for (const item of issues.brokenLinks) {
        console.log(`   ${item.docTitle} -> /docs/${item.brokenLink}`);
      }
      console.log('');
    }
    
    if (issues.invalidSlugs.length > 0) {
      console.log(`❌ INVALID SLUGS (${issues.invalidSlugs.length}):`);
      for (const item of issues.invalidSlugs) {
        console.log(`   ${item.docTitle}: "${item.slug}" (${item.issue})`);
      }
      console.log('');
    }
    
    if (issues.duplicateSlugs.length > 0) {
      console.log(`❌ DUPLICATE SLUGS (${issues.duplicateSlugs.length}):`);
      for (const item of issues.duplicateSlugs) {
        console.log(`   "${item.slug}" used by: ${item.doc1.title} AND ${item.doc2.title}`);
      }
      console.log('');
    }
    
    if (issues.invalidAudiences.length > 0) {
      console.log(`⚠️  INVALID AUDIENCES (${issues.invalidAudiences.length}):`);
      for (const item of issues.invalidAudiences) {
        console.log(`   ${item.docTitle}: "${item.audience}" (valid: ${VALID_AUDIENCES.join(', ')})`);
      }
      console.log('');
    }
    
    if (issues.invalidProducts.length > 0) {
      console.log(`❌ INVALID PRODUCTS (${issues.invalidProducts.length}):`);
      for (const item of issues.invalidProducts) {
        console.log(`   ${item.docTitle}: "${item.product}" (valid: ${VALID_PRODUCTS.join(', ')})`);
      }
      console.log('');
    }
    
    if (issues.missingFields.length > 0) {
      console.log(`⚠️  MISSING FIELDS (${issues.missingFields.length}):`);
      for (const item of issues.missingFields) {
        console.log(`   ${item.docTitle}: missing "${item.field}"`);
      }
      console.log('');
    }
    
    if (issues.orphanedDocs.length > 0) {
      console.log(`⚠️  ORPHANED DOCS (${issues.orphanedDocs.length}):`);
      for (const item of issues.orphanedDocs) {
        console.log(`   ${item.docTitle} (no category)`);
      }
      console.log('');
    }
    
    // Summary
    const totalIssues = issues.brokenLinks.length + issues.invalidSlugs.length + 
                        issues.duplicateSlugs.length + issues.invalidAudiences.length +
                        issues.invalidProducts.length + issues.missingFields.length +
                        issues.orphanedDocs.length;
    
    console.log('='.repeat(60));
    console.log(`TOTAL ISSUES: ${totalIssues}`);
    console.log('='.repeat(60));
    
    if (totalIssues === 0) {
      console.log('✅ No issues found!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runAudit();
