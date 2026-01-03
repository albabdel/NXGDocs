#!/usr/bin/env node
/**
 * Cross-platform wrapper script to run docusaurus build with increased memory
 */
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { spawn } = require('child_process');

const child = spawn('npx', ['docusaurus', 'build'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

