#!/usr/bin/env node
/**
 * Cross-platform wrapper script to run docusaurus build with increased memory.
 * If SANITY_PROJECT_ID is set, runs Sanity content fetch before build so that
 * plugin-content-docs finds populated .sanity-cache/ directories on startup.
 * Also generates sidebar configuration from Sanity sidebarConfig documents.
 */
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SITE_DIR = path.join(__dirname, '..');

async function main() {
  // Pre-fetch Sanity content if env vars are present
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN) {
    // First fetch content so files exist on disk for sidebar validation
    console.log('[build] Fetching content from Sanity...');
    const { run } = require('./fetch-sanity-content');
    await run();

    // Then generate sidebars from Sanity configuration (validates against fetched files)
    console.log('[build] Generating sidebar configuration from Sanity...');
    try {
      const { run: generateSidebars } = require(path.join(__dirname, '..', '..', 'scripts', 'generate-sidebars-from-sanity'));
      await generateSidebars();
    } catch (err) {
      console.warn(`[build] Warning: Failed to generate sidebars from Sanity: ${err.message}`);
      console.warn('[build] Falling back to existing sidebar files.');
    }
  }

  // Generate client-side search index
  console.log('[build] Generating search index...');
  try {
    require('./generate-search-index');
  } catch (err) {
    console.warn(`[build] Warning: Failed to generate search index: ${err.message}`);
  }

  // Run Docusaurus build — use local binary directly to avoid npx resolution
  // issues on Windows (npx with shell:true can't resolve the local bin).
  // .cmd files on Windows must be invoked via execSync (which uses cmd.exe internally).
  const binSuffix = process.platform === 'win32' ? '.cmd' : '';
  const docusaurusBin = path.join(SITE_DIR, 'node_modules', '.bin', `docusaurus${binSuffix}`);

  if (!fs.existsSync(docusaurusBin)) {
    throw new Error(`docusaurus binary not found at ${docusaurusBin} — did npm install run?`);
  }

  execSync(`"${docusaurusBin}" build`, { cwd: SITE_DIR, stdio: 'inherit' });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
