#!/usr/bin/env node
'use strict';

/**
 * Post-build link validator.
 *
 * Scans all Markdown files in .sanity-cache/ and reports:
 *   - Internal links that point to slugs that don't exist
 *   - Absolute links to old/dead paths
 *
 * Run after `sanity:pull` or as a CI check.
 *
 * Usage:
 *   node classic/scripts/validate-links.js              # Check all products
 *   node classic/scripts/validate-links.js --fail       # Exit 1 on any broken link
 */

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');
const CACHE_ROOT = path.join(SITE_DIR, '.sanity-cache');

const FAIL_ON_BROKEN = process.argv.includes('--fail');
const PRODUCT_ARG = (() => {
  const idx = process.argv.indexOf('--product');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// Patterns to extract links from markdown
const MD_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const REF_LINK_RE = /^\s*\[[^\]]+\]:\s*(\S+)/gm;

function collectMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function buildSlugSet(cacheDir) {
  const slugs = new Set();
  const files = collectMarkdownFiles(cacheDir);
  for (const file of files) {
    const rel = path.relative(cacheDir, file).replace(/\\/g, '/');
    // Strip .md/.mdx and /index suffix to get the effective route slug
    const slug = rel
      .replace(/\.(md|mdx)$/, '')
      .replace(/\/index$/, '')
      .replace(/^index$/, '');
    slugs.add(slug);
    slugs.add('/' + slug);
  }
  return slugs;
}

function extractLinks(content) {
  const links = [];
  let match;
  // Inline links
  MD_LINK_RE.lastIndex = 0;
  while ((match = MD_LINK_RE.exec(content)) !== null) {
    links.push(match[2].split('#')[0].trim()); // strip anchors
  }
  // Reference links
  REF_LINK_RE.lastIndex = 0;
  while ((match = REF_LINK_RE.exec(content)) !== null) {
    links.push(match[1].split('#')[0].trim());
  }
  return links.filter(Boolean);
}

function isInternalLink(href) {
  if (!href) return false;
  if (href.startsWith('http://') || href.startsWith('https://')) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (href.startsWith('#')) return false;
  return true;
}

function normalizeLink(href, fromFile, cacheDir) {
  if (path.isAbsolute(href)) return href.replace(/\\/g, '/');
  const fromDir = path.dirname(fromFile);
  const resolved = path.resolve(fromDir, href);
  const rel = path.relative(cacheDir, resolved).replace(/\\/g, '/');
  return '/' + rel;
}

function checkProduct(productDir, productName) {
  const slugs = buildSlugSet(productDir);
  const files = collectMarkdownFiles(productDir);

  const broken = [];

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    const links = extractLinks(content);
    const relFile = path.relative(productDir, file).replace(/\\/g, '/');

    for (const href of links) {
      if (!isInternalLink(href)) continue;
      const normalized = normalizeLink(href, file, productDir);
      // Strip leading slash for lookup
      const slug = normalized.replace(/^\//, '');
      if (!slugs.has(slug) && !slugs.has('/' + slug) && !slugs.has(normalized)) {
        broken.push({ file: relFile, href, normalized });
      }
    }
  }

  return { files: files.length, slugs: slugs.size, broken };
}

function main() {
  if (!fs.existsSync(CACHE_ROOT)) {
    console.error(`Cache directory not found: ${CACHE_ROOT}`);
    console.error('Run `npm run sanity:pull` first.');
    process.exit(1);
  }

  const products = PRODUCT_ARG
    ? [PRODUCT_ARG]
    : fs
        .readdirSync(CACHE_ROOT, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);

  if (products.length === 0) {
    console.log('No product cache directories found.');
    return;
  }

  let totalBroken = 0;

  for (const product of products) {
    const productDir = path.join(CACHE_ROOT, product);
    if (!fs.existsSync(productDir)) {
      console.warn(`Cache directory not found for product: ${product}`);
      continue;
    }

    const { files, slugs, broken } = checkProduct(productDir, product);
    console.log(`\n${product.toUpperCase()} — ${files} files, ${slugs} routes`);

    if (broken.length === 0) {
      console.log('  ✅ No broken internal links');
    } else {
      totalBroken += broken.length;
      for (const b of broken) {
        console.log(`  ✗ ${b.file}`);
        console.log(`    → ${b.href} (resolved: ${b.normalized})`);
      }
      console.log(`  ${broken.length} broken link(s)`);
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  if (totalBroken === 0) {
    console.log('✅ All internal links are valid.');
  } else {
    console.log(`⚠️  ${totalBroken} broken internal link(s) found.`);
    if (FAIL_ON_BROKEN) {
      process.exit(1);
    }
  }
}

main();
