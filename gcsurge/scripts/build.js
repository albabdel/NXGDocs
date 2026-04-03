#!/usr/bin/env node
/**
 * GC Surge build script
 * 1. Fetch Confluence content → .sanity-cache/docs/ + sidebars.ts
 * 2. Run docusaurus build
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SITE_DIR = path.join(__dirname, '..');

async function main() {
  const docsCacheDir = path.join(SITE_DIR, '.sanity-cache', 'docs');
  const docsExist = fs.existsSync(docsCacheDir) && fs.readdirSync(docsCacheDir).length > 2;
  const skipFetch = process.env.SKIP_CONFLUENCE_FETCH === 'true' || docsExist;

  console.log('\n── Step 1: Fetching Confluence content ────────────────────────');

  if (skipFetch) {
    console.log('   ℹ️  Skipping Confluence fetch (docs already cached or SKIP_CONFLUENCE_FETCH=true)');
  } else {
    const required = ['CONFLUENCE_EMAIL', 'CONFLUENCE_API_TOKEN', 'CONFLUENCE_SITE_URL', 'CONFLUENCE_SPACE_KEY'];
    const missing = required.filter(v => !process.env[v]);
    if (missing.length > 0) {
      console.error(`\n❌ Missing required env vars: ${missing.join(', ')}`);
      console.error('   Set them in CF Pages → Settings → Environment Variables');
      process.exit(1);
    }
    const fetchScript = path.join(__dirname, 'fetch-confluence-gcsurge.js');
    const { run } = require(fetchScript);
    await run();
  }

  console.log('\n── Step 2: Building Docusaurus ─────────────────────────────────');

  // Detect the docusaurus binary
  const docusaurusBin = path.join(SITE_DIR, 'node_modules', '.bin', 'docusaurus');
  if (!fs.existsSync(docusaurusBin) && !fs.existsSync(docusaurusBin + '.cmd')) {
    console.error('❌ docusaurus binary not found — did npm install run?');
    process.exit(1);
  }

  try {
    execSync(
      `"${docusaurusBin}${process.platform === 'win32' ? '.cmd' : ''}" build --out-dir build`,
      { cwd: SITE_DIR, stdio: 'inherit', env: { ...process.env } }
    );
  } catch (err) {
    console.error('\n❌ Docusaurus build failed');
    process.exit(1);
  }

  console.log('\n✅ GC Surge build complete → gcsurge/build/');
}

main().catch(err => {
  console.error('\n❌ Build failed:', err.message || err);
  process.exit(1);
});
