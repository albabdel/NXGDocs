#!/usr/bin/env node
/**
 * Cross-platform wrapper script to run docusaurus build with increased memory.
 * If SANITY_PROJECT_ID is set, runs Sanity content fetch before build so that
 * plugin-content-docs finds populated .sanity-cache/ directories on startup.
 */
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { spawn } = require('child_process');

async function main() {
  // Pre-fetch Sanity content if env vars are present
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN) {
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
