#!/usr/bin/env node
'use strict';

/**
 * Image Audit Script
 *
 * Finds Sanity docs/articles that still contain:
 *   - Confluence attachment URLs (atlassian.net)
 *   - External image URLs in Markdown body (![alt](http://...))
 *   - Portable Text image blocks pointing to external URLs
 *
 * These need to be re-uploaded to Sanity's asset pipeline.
 *
 * Usage:
 *   node scripts/audit-images.js              # Full audit
 *   node scripts/audit-images.js --product gcsurge
 *   node scripts/audit-images.js --json       # Machine-readable output
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_READ_TOKEN = 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi';

const JSON_OUTPUT = process.argv.includes('--json');
const PRODUCT_ARG = (() => {
  const idx = process.argv.indexOf('--product');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: SANITY_READ_TOKEN,
});

// Patterns that indicate externally-hosted images that should be migrated
const EXTERNAL_IMG_PATTERNS = [
  /https?:\/\/[a-z0-9-]+\.atlassian\.net\/wiki\/download\/[^\s"')]+/gi,  // Confluence attachments
  /https?:\/\/[a-z0-9-]+\.atlassian\.net\/wiki\/rest\/[^\s"')]+/gi,       // Confluence REST API images
  /!\[[^\]]*\]\((https?:\/\/(?!images\.unsplash|cdn\.sanity)[^\s)]+)\)/g, // External Markdown images (non-Sanity/stock)
];

function findExternalImages(text) {
  if (!text || typeof text !== 'string') return [];
  const found = new Set();
  for (const pattern of EXTERNAL_IMG_PATTERNS) {
    let match;
    const re = new RegExp(pattern.source, pattern.flags);
    while ((match = re.exec(text)) !== null) {
      found.add(match[0]);
    }
  }
  return [...found];
}

function scanPortableTextForImages(body) {
  if (!Array.isArray(body)) return [];
  const found = [];
  for (const block of body) {
    // Check image blocks with external URL
    if (block._type === 'image' && block.url && /^https?:\/\//.test(block.url)) {
      if (!block.url.includes('cdn.sanity.io')) {
        found.push(block.url);
      }
    }
    // Check image blocks in children spans
    if (block.children) {
      for (const child of block.children) {
        if (child._type === 'image' && child.url && /^https?:\/\//.test(child.url)) {
          if (!child.url.includes('cdn.sanity.io')) {
            found.push(child.url);
          }
        }
      }
    }
  }
  return found;
}

async function main() {
  const productFilter = PRODUCT_ARG ? ` && product == "${PRODUCT_ARG}"` : '';

  console.log('Loading documents from Sanity...');

  const [docs, articles] = await Promise.all([
    client.fetch(`*[_type == "doc"${productFilter} && defined(slug.current)] {
      _id, _type, title, "slug": slug.current, product, status, markdownBody, body
    }`),
    client.fetch(`*[_type == "article"${productFilter} && defined(slug.current)] {
      _id, _type, title, "slug": slug.current, product, status, body
    }`),
  ]);

  const all = [...docs, ...articles];
  console.log(`Scanning ${all.length} documents...\n`);

  const results = [];

  for (const doc of all) {
    const issues = [];

    // Check markdownBody (GC Surge / Confluence-synced docs)
    if (doc.markdownBody) {
      const found = findExternalImages(doc.markdownBody);
      for (const url of found) {
        issues.push({ field: 'markdownBody', url });
      }
    }

    // Check Portable Text body for external image blocks
    if (doc.body) {
      const found = scanPortableTextForImages(doc.body);
      for (const url of found) {
        issues.push({ field: 'body (portable text)', url });
      }
    }

    if (issues.length > 0) {
      results.push({
        id: doc._id,
        type: doc._type,
        slug: doc.slug,
        product: doc.product,
        status: doc.status,
        title: doc.title,
        issueCount: issues.length,
        issues,
      });
    }
  }

  if (JSON_OUTPUT) {
    const outPath = path.join(process.cwd(), 'audit-images-report.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`Report written to: ${outPath}`);
    return;
  }

  if (results.length === 0) {
    console.log('✅ No external image references found. All images are Sanity-hosted.');
    return;
  }

  console.log(`Found ${results.length} docs with external image references:\n`);

  // Group by product
  const byProduct = {};
  for (const r of results) {
    const p = r.product || 'unknown';
    byProduct[p] = byProduct[p] || [];
    byProduct[p].push(r);
  }

  for (const [product, docs] of Object.entries(byProduct)) {
    console.log(`${product.toUpperCase()} (${docs.length} docs)`);
    console.log('─'.repeat(50));
    for (const r of docs) {
      console.log(`  [${r.status || 'unknown'}] ${r.slug}`);
      console.log(`  Title: ${r.title}`);
      for (const issue of r.issues) {
        const url = issue.url.length > 80 ? issue.url.slice(0, 77) + '...' : issue.url;
        console.log(`    • ${issue.field}: ${url}`);
      }
      console.log();
    }
  }

  console.log('─'.repeat(50));
  console.log(`Total: ${results.length} docs, ${results.reduce((s, r) => s + r.issueCount, 0)} external images`);
  console.log();
  console.log('Action: Upload these images to Sanity Assets and update references.');
  console.log('Run with --json to export a machine-readable report.');
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
