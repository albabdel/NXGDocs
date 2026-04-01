#!/usr/bin/env node
'use strict';

const { execSync, spawn } = require('child_process');

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ff9df0a2daf8c9eb1032f67dd551c784';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const PROJECTS = [
  {
    name: 'gcxone',
    projectName: 'gcxone',
    subdomain: 'gcxone.pages.dev',
    product: 'gcxone',
    envVars: {
      PRODUCT: 'gcxone',
      SANITY_PROJECT_ID: 'fjjuacab',
      SANITY_DATASET: 'production',
    },
  },
  {
    name: 'gcsurge',
    projectName: 'gcsurge',
    subdomain: 'gcsurge.pages.dev',
    product: 'gcsurge',
    envVars: {
      PRODUCT: 'gcsurge',
      SANITY_PROJECT_ID: 'fjjuacab',
      SANITY_DATASET: 'production',
    },
  },
];

function runWrangler(args, silent = false) {
  const env = {
    ...process.env,
    CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID,
  };
  try {
    const result = execSync(`npx wrangler ${args.join(' ')}`, {
      encoding: 'utf8',
      env,
      stdio: silent ? 'pipe' : 'inherit',
    });
    return { success: true, output: result };
  } catch (err) {
    return { success: false, error: err.message, output: err.stdout || '' };
  }
}

async function listProjects() {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('ERROR: CLOUDFLARE_API_TOKEN environment variable required');
    process.exit(1);
  }

  console.log('Cloudflare Pages Projects:');
  console.log('');

  runWrangler(['pages', 'project', 'list']);
}

async function createProject(config) {
  console.log(`\nProject: ${config.projectName}`);
  console.log(`  Subdomain: ${config.subdomain}`);
  console.log(`  Product: ${config.product}`);

  const result = runWrangler(['pages', 'project', 'create', config.projectName, '--production-branch', 'main'], true);

  if (result.success || result.output.includes('already exists')) {
    console.log('  ✓ Project ready');
    return true;
  } else if (result.output.includes('already exists')) {
    console.log('  ✓ Project already exists');
    return true;
  } else {
    console.log(`  ✗ Failed to create: ${result.error}`);
    return false;
  }
}

async function createProjects(dryRun = false) {
  if (!CLOUDFLARE_API_TOKEN) {
    console.error('ERROR: CLOUDFLARE_API_TOKEN environment variable required');
    console.error('Set it from keys.md: cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039');
    process.exit(1);
  }

  console.log('Cloudflare Pages Project Setup');
  console.log('═'.repeat(50));
  console.log(`Account ID: ${CLOUDFLARE_ACCOUNT_ID}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  for (const config of PROJECTS) {
    if (dryRun) {
      console.log(`[DRY RUN] Would create: ${config.projectName} (${config.subdomain})`);
      continue;
    }

    await createProject(config);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('Projects ready for deployment.');
  console.log('');
  console.log('Environment variables to set in Cloudflare dashboard:');
  for (const config of PROJECTS) {
    console.log(`\n  ${config.projectName}:`);
    for (const [key, value] of Object.entries(config.envVars)) {
      console.log(`    ${key}=${value}`);
    }
    console.log(`    SANITY_API_TOKEN=<from secrets>`);
    console.log(`    SANITY_WEBHOOK_SECRET=<generate new>`);
  }
  console.log('');
  console.log('Dashboard: https://dash.cloudflare.com/' + CLOUDFLARE_ACCOUNT_ID + '/pages');
}

const args = process.argv.slice(2);
const command = args[0];

if (command === '--dry-run') {
  createProjects(true);
} else if (command === '--list') {
  listProjects();
} else if (command === '--help' || !command) {
  console.log('Usage: node create-cloudflare-projects.js [command]');
  console.log('');
  console.log('Commands:');
  console.log('  --create    Create/update Pages projects (requires CLOUDFLARE_API_TOKEN)');
  console.log('  --dry-run   Show what would be created without making changes');
  console.log('  --list      List existing Pages projects');
  console.log('  --help      Show this help');
  console.log('');
  console.log('Environment variables:');
  console.log('  CLOUDFLARE_API_TOKEN  - API token with Pages edit permissions');
  console.log('');
  console.log('From keys.md:');
  console.log('  CLOUDFLARE_API_TOKEN=cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039');
} else if (command === '--create') {
  createProjects(false);
} else {
  console.log('Unknown command. Use --help for usage.');
}
