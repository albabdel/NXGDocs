#!/usr/bin/env node
'use strict';

const https = require('https');

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ff9df0a2daf8c9eb1032f67dd551c784';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const PROJECTS = {
  gcxone: 'gcxone',
  gcsurge: 'gcsurge',
};

function triggerBuild(projectName) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ branch: 'main' });
    
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${projectName}/deployments`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, project: projectName, url: json.result?.url });
          } else {
            reject(new Error(`API error: ${JSON.stringify(json.errors || json)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function triggerProductBuild(product, dryRun = false) {
  const projectName = PROJECTS[product];
  if (!projectName) {
    console.error(`Unknown product: ${product}. Valid: ${Object.keys(PROJECTS).join(', ')}`);
    process.exit(1);
  }

  console.log(`Triggering build for: ${product}`);
  console.log(`  Project: ${projectName}`);
  console.log(`  Subdomain: https://${projectName}.pages.dev`);

  if (dryRun) {
    console.log('  [DRY RUN] Would trigger deployment');
    return;
  }

  if (!CLOUDFLARE_API_TOKEN) {
    console.error('ERROR: CLOUDFLARE_API_TOKEN required');
    console.error('Set from keys.md: cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039');
    process.exit(1);
  }

  try {
    const result = await triggerBuild(projectName);
    console.log(`  ✓ Build triggered: ${result.url || 'check dashboard'}`);
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    process.exit(1);
  }
}

async function triggerAllBuilds(dryRun = false) {
  const products = Object.keys(PROJECTS);
  console.log(`Triggering builds for: ${products.join(', ')}`);
  console.log('');

  for (const product of products) {
    await triggerProductBuild(product, dryRun);
    console.log('');
  }
}

function showHelp() {
  console.log('Usage: node trigger-product-build.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --product <name>  Trigger build for specific product');
  console.log('  --all             Trigger builds for all products');
  console.log('  --dry-run         Show what would happen without triggering');
  console.log('  --help            Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/trigger-product-build.js --product gcxone');
  console.log('  node scripts/trigger-product-build.js --all');
  console.log('');
  console.log('Environment:');
  console.log('  CLOUDFLARE_API_TOKEN - Token with Pages deployment permissions');
}

const args = process.argv.slice(2);

if (args.includes('--help')) {
  showHelp();
} else if (args.includes('--dry-run')) {
  triggerAllBuilds(true);
} else if (args.includes('--product')) {
  const idx = args.indexOf('--product');
  const product = args[idx + 1];
  triggerProductBuild(product, args.includes('--dry-run'));
} else if (args.includes('--all') || args.length === 0) {
  triggerAllBuilds(false);
} else {
  showHelp();
}
