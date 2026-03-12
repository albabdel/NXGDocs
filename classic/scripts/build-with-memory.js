#!/usr/bin/env node
/**
 * Cross-platform wrapper script to run docusaurus build with increased memory.
 * If SANITY_PROJECT_ID is set, runs Sanity content fetch before build so that
 * plugin-content-docs finds populated .sanity-cache/ directories on startup.
 * Also generates sidebar configuration from Sanity sidebarConfig documents.
 */
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { spawn } = require('child_process');
const path = require('path');

async function main() {
  // Pre-fetch Sanity content if env vars are present
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN) {
    // First, generate sidebars from Sanity configuration
    console.log('[build] Generating sidebar configuration from Sanity...');
    try {
      const { run: generateSidebars } = require(path.join(__dirname, '..', '..', 'scripts', 'generate-sidebars-from-sanity'));
      await generateSidebars();
    } catch (err) {
      console.warn(`[build] Warning: Failed to generate sidebars from Sanity: ${err.message}`);
      console.warn('[build] Falling back to existing sidebar files.');
    }

    // Then fetch content
    const { run } = require('./fetch-sanity-content');
    await run();
  }

  // Run Docusaurus build
  await new Promise((resolve, reject) => {
    const child = spawn('npx', ['docusaurus', 'build'], {
      stdio: 'inherit',
      shell: true,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`docusaurus build exited with code ${code}`));
    });
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
