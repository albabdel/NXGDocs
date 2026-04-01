#!/usr/bin/env node
'use strict';

const { spawn } = require('child_process');
const path = require('path');

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ff9df0a2daf8c9eb1032f67dd551c784';

const PROJECTS = {
  gcxone: {
    projectName: 'gcxone',
    buildDir: 'classic/build/gcxone',
    subdomain: 'https://gcxone.pages.dev',
  },
  gcsurge: {
    projectName: 'gcsurge',
    buildDir: 'classic/build/gcsurge',
    subdomain: 'https://gcsurge.pages.dev',
  },
};

async function deployProduct(product) {
  const config = PROJECTS[product];
  if (!config) {
    throw new Error(`Unknown product: ${product}. Valid products: ${Object.keys(PROJECTS).join(', ')}`);
  }

  const buildPath = path.resolve(config.buildDir);
  console.log(`[deploy] Deploying ${product} to Cloudflare Pages...`);
  console.log(`  Project: ${config.projectName}`);
  console.log(`  Build dir: ${buildPath}`);
  console.log(`  Subdomain: ${config.subdomain}`);

  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['wrangler', 'pages', 'deploy', buildPath, '--project-name', config.projectName], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`[deploy] ✓ ${product} deployed to ${config.subdomain}`);
        resolve({ product, success: true, subdomain: config.subdomain });
      } else {
        console.error(`[deploy] ✗ ${product} deployment failed with code ${code}`);
        reject(new Error(`Deployment failed for ${product}`));
      }
    });

    child.on('error', (err) => {
      console.error(`[deploy] Process error: ${err.message}`);
      reject(err);
    });
  });
}

async function deployAllProducts() {
  const products = Object.keys(PROJECTS);
  console.log(`[deploy] Deploying all products: ${products.join(', ')}`);
  console.log('');

  const results = [];
  const errors = [];

  for (const product of products) {
    try {
      const result = await deployProduct(product);
      results.push(result);
    } catch (err) {
      errors.push({ product, error: err.message });
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('Deployment Summary:');
  console.log('─'.repeat(50));

  for (const result of results) {
    console.log(`  ✓ ${result.product}: ${result.subdomain}`);
  }

  for (const error of errors) {
    console.log(`  ✗ ${error.product}: ${error.error}`);
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} deployment(s) failed`);
    process.exit(1);
  }

  console.log('\nAll products deployed successfully!');
  console.log('');
  console.log('Live URLs:');
  for (const result of results) {
    console.log(`  ${result.product}: ${result.subdomain}`);
  }
}

function showHelp() {
  console.log('Usage: node deploy-multi-product.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --product <name>  Deploy specific product (gcxone, gcsurge)');
  console.log('  --all             Deploy all products (default)');
  console.log('  --help            Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/deploy-multi-product.js --product gcxone');
  console.log('  node scripts/deploy-multi-product.js --product gcsurge');
  console.log('  node scripts/deploy-multi-product.js --all');
  console.log('');
  console.log('Prerequisites:');
  console.log('  - Build must exist in classic/build/{product}');
  console.log('  - Run: npm run build:multi first');
  console.log('  - wrangler CLI installed (npx wrangler works)');
  console.log('');
  console.log('Environment:');
  console.log('  CLOUDFLARE_API_TOKEN - Set from keys.md for deployment');
}

const args = process.argv.slice(2);

if (args.includes('--help')) {
  showHelp();
} else if (args.includes('--product')) {
  const productIndex = args.indexOf('--product');
  const product = args[productIndex + 1];
  if (!product) {
    console.error('ERROR: --product requires a product name (gcxone or gcsurge)');
    process.exit(1);
  }
  deployProduct(product).catch((err) => {
    console.error(`Deployment failed: ${err.message}`);
    process.exit(1);
  });
} else {
  deployAllProducts().catch((err) => {
    console.error(`Deployment failed: ${err.message}`);
    process.exit(1);
  });
}
