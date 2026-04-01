#!/usr/bin/env node
'use strict';

const https = require('https');

const PRODUCTS = {
  gcxone: {
    url: 'https://gcxone.pages.dev',
    title: 'GCXONE Documentation',
    projectName: 'gcxone',
  },
  gcsurge: {
    url: 'https://gcsurge.pages.dev',
    title: 'GC Surge Documentation',
    projectName: 'gcsurge',
  },
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verifyProduct(name, config) {
  console.log(`\nVerifying: ${name}`);
  console.log(`  URL: ${config.url}`);
  
  const results = { name, passed: [], failed: [] };

  try {
    const response = await fetch(config.url);
    
    if (response.status === 200) {
      results.passed.push('Domain accessible (200 OK)');
    } else {
      results.failed.push(`Domain returned status ${response.status}`);
    }

    const titleMatch = response.data.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1];
      if (title.includes(config.title.split(' ')[0])) {
        results.passed.push(`Title contains product name: "${title}"`);
      } else {
        results.failed.push(`Title mismatch: expected "${config.title}", got "${title}"`);
      }
    } else {
      results.failed.push('No <title> tag found');
    }

    const otherProduct = name === 'gcxone' ? 'gcsurge' : 'gcxone';
    const otherConfig = PRODUCTS[otherProduct];
    
    if (response.data.toLowerCase().includes(otherConfig.url.toLowerCase())) {
      results.failed.push(`Contains reference to ${otherProduct} domain`);
    } else {
      results.passed.push(`No ${otherProduct} domain references`);
    }

    if (response.data.includes('product=')) {
      const productMatch = response.data.match(/product["']?\s*[:=]\s*["']([^"']+)/i);
      if (productMatch) {
        if (productMatch[1] === name) {
          results.passed.push(`PRODUCT env var correct: ${name}`);
        } else {
          results.failed.push(`PRODUCT env var wrong: expected ${name}, got ${productMatch[1]}`);
        }
      }
    }

  } catch (err) {
    results.failed.push(`Fetch error: ${err.message}`);
  }

  return results;
}

async function verifyAllProducts() {
  console.log('Multi-Product Deployment Verification');
  console.log('═'.repeat(50));

  const allResults = [];

  for (const [name, config] of Object.entries(PRODUCTS)) {
    const results = await verifyProduct(name, config);
    allResults.push(results);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('Verification Summary');
  console.log('─'.repeat(50));

  let totalPassed = 0;
  let totalFailed = 0;

  for (const results of allResults) {
    console.log(`\n${results.name}:`);
    for (const p of results.passed) {
      console.log(`  ✓ ${p}`);
      totalPassed++;
    }
    for (const f of results.failed) {
      console.log(`  ✗ ${f}`);
      totalFailed++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`Total: ${totalPassed} passed, ${totalFailed} failed`);

  if (totalFailed > 0) {
    console.log('\n⚠ Some verifications failed. Check deployment configuration.');
    process.exit(1);
  } else {
    console.log('\n✓ All verifications passed!');
  }
}

async function verifySingleProduct(product) {
  const config = PRODUCTS[product];
  if (!config) {
    console.error(`Unknown product: ${product}. Valid: ${Object.keys(PRODUCTS).join(', ')}`);
    process.exit(1);
  }

  console.log('Product Deployment Verification');
  console.log('═'.repeat(50));

  const results = await verifyProduct(product, config);

  console.log('\n' + '─'.repeat(50));
  for (const p of results.passed) {
    console.log(`  ✓ ${p}`);
  }
  for (const f of results.failed) {
    console.log(`  ✗ ${f}`);
  }

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

function showHelp() {
  console.log('Usage: node verify-deployment.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --product <name>  Verify specific product');
  console.log('  --all             Verify all products (default)');
  console.log('  --help            Show this help');
  console.log('');
  console.log('Products:');
  console.log('  gcxone  - https://gcxone.pages.dev');
  console.log('  gcsurge - https://gcsurge.pages.dev');
}

const args = process.argv.slice(2);

if (args.includes('--help')) {
  showHelp();
} else if (args.includes('--product')) {
  const idx = args.indexOf('--product');
  const product = args[idx + 1];
  verifySingleProduct(product);
} else {
  verifyAllProducts();
}
