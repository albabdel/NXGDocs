#!/usr/bin/env node
'use strict';

const https = require('https');
const crypto = require('crypto');

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'fjjuacab';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://gcxone.pages.dev/api/sanity-webhook';

function generateWebhookSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function sanityRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.sanity.io',
      path: `/v1${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${SANITY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Sanity API error: ${JSON.stringify(json.error || json)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function listWebhooks() {
  try {
    const result = await sanityRequest('GET', `/projects/${SANITY_PROJECT_ID}/hooks`);
    const hooks = result.hooks || [];
    
    console.log('Sanity Webhooks:');
    console.log('');
    for (const hook of hooks) {
      console.log(`- ${hook.name}`);
      console.log(`  ID: ${hook.id}`);
      console.log(`  URL: ${hook.url}`);
      console.log(`  Dataset: ${hook.dataset || 'all'}`);
      console.log('');
    }
    
    return hooks;
  } catch (err) {
    console.error('Error listing webhooks:', err.message);
    return [];
  }
}

async function createWebhook() {
  if (!SANITY_API_TOKEN) {
    console.error('ERROR: SANITY_API_TOKEN required');
    console.error('Get from Sanity Studio: https://www.sanity.io/manage/project/fjjuacab/api');
    process.exit(1);
  }

  const secret = generateWebhookSecret();
  
  const body = {
    name: 'Cloudflare Multi-Product Deploy',
    url: WEBHOOK_URL,
    dataset: 'production',
    triggerOn: {
      create: true,
      update: true,
      delete: true,
    },
    projection: '{ _id, _type, product, slug, title, status }',
    secret: secret,
  };

  console.log('Creating Sanity webhook...');
  console.log(`  URL: ${WEBHOOK_URL}`);
  console.log(`  Dataset: production`);
  console.log('');

  try {
    const result = await sanityRequest('POST', `/projects/${SANITY_PROJECT_ID}/hooks`, body);
    console.log('✓ Webhook created successfully');
    console.log(`  ID: ${result.id}`);
    console.log('');
    console.log('IMPORTANT: Save this secret in Cloudflare environment variables:');
    console.log(`  SANITY_WEBHOOK_SECRET=${secret}`);
    console.log('');
    console.log('Set in Cloudflare dashboard:');
    console.log('  https://dash.cloudflare.com/ff9df0a2daf8c9eb1032f67dd551c784/pages');
    console.log('  Settings → Environment variables → Add variable');
    console.log('');
    console.log('Set for BOTH projects:');
    console.log('  - gcxone (production)');
    console.log('  - gcsurge (production)');
    
    return { id: result.id, secret };
  } catch (err) {
    console.error('Failed to create webhook:', err.message);
    process.exit(1);
  }
}

function showManualInstructions() {
  const secret = generateWebhookSecret();
  
  console.log('Manual Sanity Webhook Configuration');
  console.log('═'.repeat(50));
  console.log('');
  console.log('1. Go to Sanity Studio:');
  console.log('   https://www.sanity.io/manage/project/fjjuacab/api');
  console.log('');
  console.log('2. Create new webhook with:');
  console.log('   Name: Cloudflare Multi-Product Deploy');
  console.log('   URL: https://gcxone.pages.dev/api/sanity-webhook');
  console.log('   Dataset: production');
  console.log('   Triggers: Create, Update, Delete');
  console.log('   Projection: { _id, _type, product, slug, title, status }');
  console.log('   Secret: (generate in Sanity dashboard)');
  console.log('');
  console.log('3. Set environment variables in Cloudflare:');
  console.log('   Dashboard: https://dash.cloudflare.com/ff9df0a2daf8c9eb1032f67dd551c784/pages');
  console.log('');
  console.log('   For gcxone project:');
  console.log('     SANITY_WEBHOOK_SECRET=<secret from Sanity>');
  console.log('     CLOUDFLARE_API_TOKEN=cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039');
  console.log('');
  console.log('   For gcsurge project:');
  console.log('     SANITY_WEBHOOK_SECRET=<same secret>');
  console.log('     CLOUDFLARE_API_TOKEN=cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039');
  console.log('');
  console.log('4. Test webhook:');
  console.log('   Publish a document in Sanity with product=gcxone');
  console.log('   Check Cloudflare Pages deployments dashboard');
}

function showHelp() {
  console.log('Usage: node configure-sanity-webhook.js [command]');
  console.log('');
  console.log('Commands:');
  console.log('  --create         Create webhook via Sanity API');
  console.log('  --list           List existing webhooks');
  console.log('  --instructions   Show manual configuration instructions');
  console.log('  --help           Show this help');
  console.log('');
  console.log('Environment:');
  console.log('  SANITY_API_TOKEN - Sanity API token with project edit permissions');
  console.log('  WEBHOOK_URL      - Override webhook URL (default: https://gcxone.pages.dev/api/sanity-webhook)');
}

const args = process.argv.slice(2);
const command = args[0];

if (command === '--create') {
  createWebhook();
} else if (command === '--list') {
  listWebhooks();
} else if (command === '--instructions' || !command) {
  showManualInstructions();
} else if (command === '--help') {
  showHelp();
} else {
  console.log('Unknown command. Use --help for usage.');
}
