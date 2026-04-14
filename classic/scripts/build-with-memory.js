#!/usr/bin/env node
/**
 * Cross-platform wrapper script to run docusaurus build with increased memory.
 * If SANITY_PROJECT_ID is set, runs Sanity content fetch before build so that
 * plugin-content-docs finds populated cache directories on startup.
 * It also generates the Docusaurus sidebar file from Sanity.
 */
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SITE_DIR = path.join(__dirname, '..');

async function main() {
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN) {
    const product = process.env.PRODUCT || 'gcxone';
    process.env.PRODUCT = product;
    process.env.SANITY_CACHE_PATH =
      process.env.SANITY_CACHE_PATH || `.sanity-cache/${product}-docs`;

    console.log('[build] Fetching content from Sanity...');
    const { run } = require('./fetch-sanity-content');
    await run();

    console.log('[build] Generating sidebar from Sanity...');
    const { run: generateSidebars } = require('../../scripts/generate-sidebars-from-sanity');
    await generateSidebars();
  }

  console.log('[build] Generating search index...');
  try {
    require('./generate-search-index');
  } catch (err) {
    console.warn(`[build] Warning: Failed to generate search index: ${err.message}`);
  }

  const binSuffix = process.platform === 'win32' ? '.cmd' : '';
  const docusaurusBin = path.join(SITE_DIR, 'node_modules', '.bin', `docusaurus${binSuffix}`);

  if (!fs.existsSync(docusaurusBin)) {
    throw new Error(`docusaurus binary not found at ${docusaurusBin} - did npm install run?`);
  }

  execSync(`"${docusaurusBin}" build`, { cwd: SITE_DIR, stdio: 'inherit' });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
