#!/usr/bin/env node
'use strict';

const { spawn } = require('child_process');
const path = require('path');

const PRODUCTS = ['gcxone', 'gcsurge'];

const SITE_DIR = path.join(__dirname, '..');
const FETCH_CONTENT_PATH = path.join(SITE_DIR, 'scripts', 'fetch-sanity-content.js');
const FETCH_CONFLUENCE_PATH = path.join(SITE_DIR, 'scripts', 'fetch-confluence-gcsurge.js');
const GENERATE_SIDEBAR_PATH = path.join(SITE_DIR, '..', 'scripts', 'generate-sidebar-from-sanity.js');

async function buildProduct(product) {
  const startTime = Date.now();
  console.log(`[multi-build] Starting build for: ${product}`);

  process.env.PRODUCT = product;

  if (product === 'gcsurge') {
    // GC Surge uses Confluence as its content source (not Sanity)
    delete require.cache[require.resolve(FETCH_CONFLUENCE_PATH)];
    try {
      console.log(`[${product}] Fetching Confluence content...`);
      const { run: fetchConfluence } = require(FETCH_CONFLUENCE_PATH);
      await fetchConfluence();
    } catch (err) {
      console.error(`[${product}] Failed to fetch Confluence content: ${err.message}`);
      throw err;
    }
    // sidebars.ts is written by fetch-confluence-gcsurge.js — skip separate generation
  } else {
    delete require.cache[require.resolve(FETCH_CONTENT_PATH)];
    delete require.cache[require.resolve(GENERATE_SIDEBAR_PATH)];

    try {
      console.log(`[${product}] Fetching Sanity content...`);
      const { run: fetchContent } = require(FETCH_CONTENT_PATH);
      await fetchContent();
    } catch (err) {
      console.error(`[${product}] Failed to fetch Sanity content: ${err.message}`);
      throw err;
    }

    try {
      console.log(`[${product}] Generating sidebar configuration...`);
      const { run: generateSidebars } = require(GENERATE_SIDEBAR_PATH);
      await generateSidebars();
    } catch (err) {
      console.warn(`[${product}] Warning: Failed to generate sidebar: ${err.message}`);
    }
  }

  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'docusaurus', '--', 'build', '--out-dir', `build/${product}`], {
      cwd: SITE_DIR,
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      if (code === 0) {
        console.log(`[${product}] Build complete in ${duration}s`);
        resolve({ product, success: true, duration });
      } else {
        console.error(`[${product}] Build failed with code ${code} after ${duration}s`);
        reject(new Error(`Build failed for ${product} with code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.error(`[${product}] Build process error: ${err.message}`);
      reject(err);
    });
  });
}

async function buildAllProducts(products = PRODUCTS, parallel = true) {
  const startTime = Date.now();
  console.log(`[multi-build] Starting builds for: ${products.join(', ')}`);
  console.log(`[multi-build] Mode: ${parallel ? 'parallel' : 'sequential'}`);

  const results = [];
  const errors = [];

  if (parallel && products.length > 1) {
    const promises = products.map(async (product) => {
      try {
        const result = await buildProduct(product);
        results.push(result);
      } catch (err) {
        errors.push({ product, error: err.message });
      }
    });

    await Promise.all(promises);
  } else {
    for (const product of products) {
      try {
        const result = await buildProduct(product);
        results.push(result);
      } catch (err) {
        errors.push({ product, error: err.message });
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n[multi-build] Build Summary:');
  console.log('─'.repeat(50));

  for (const result of results) {
    console.log(`  ✓ ${result.product}: ${result.duration}s`);
  }

  for (const error of errors) {
    console.log(`  ✗ ${error.product}: ${error.error}`);
  }

  console.log('─'.repeat(50));
  console.log(`[multi-build] All builds complete in ${duration}s`);
  console.log(`[multi-build] Success: ${results.length}/${products.length}`);

  if (errors.length > 0) {
    console.error(`[multi-build] ${errors.length} build(s) failed`);
    process.exit(1);
  }
}

module.exports = { buildAllProducts, buildProduct, PRODUCTS };

if (require.main === module) {
  const args = process.argv.slice(2);
  const products = args.filter((arg) => !arg.startsWith('--'));
  const finalProducts = products.length > 0 ? products : PRODUCTS;
  const parallel = !args.includes('--sequential');

  buildAllProducts(finalProducts, parallel).catch((err) => {
    console.error(`[multi-build] Error: ${err.message}`);
    process.exit(1);
  });
}
