#!/usr/bin/env node
'use strict';

/**
 * Register Sanity webhooks for:
 *   1. /api/sanity-webhook  — triggers CF Pages deploy when docs are published
 *   2. /api/editorial-webhook — sends Slack/email when workflow status changes
 *
 * Usage:
 *   node scripts/setup-webhooks.js --list
 *   node scripts/setup-webhooks.js --create
 *   node scripts/setup-webhooks.js --delete <webhook-id>
 */

const https = require('https');
const crypto = require('crypto');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_API_TOKEN = 'skrDjnhpDRzNNkD5IgIwEY1c9wiC3JEpfLRqz34aV2U4JQ1JTpHayqmau4LrZzmkig2ekdkfSoHzpJkAOkWVfjjBdmgE3FtPZPl2OchAHjU4pAL3Xe7jxcoAVnKUitg8zmiFgBeYqIoOMS7Ndv0pbwagOubDqRFXLh6LxCbdFqTcJ0yQkVpE';

const SITE_URL = 'https://gcxone.pages.dev';

// Shared secret for both webhooks (set this in CF Pages env vars as SANITY_WEBHOOK_SECRET)
const SHARED_SECRET = process.env.SANITY_WEBHOOK_SECRET || crypto.randomBytes(32).toString('hex');

const WEBHOOKS = [
  {
    name: 'NXGen — Deploy Trigger (published docs)',
    url: `${SITE_URL}/api/sanity-webhook`,
    filter: 'status == "published"',
    projection: '{ _id, _type, title, "slug": slug.current, product, status }',
    on: { create: true, update: true, delete: false },
  },
  {
    name: 'NXGen — Editorial Workflow Notifications',
    url: `${SITE_URL}/api/editorial-webhook`,
    filter: 'defined(workflowConfig.workflowStatus)',
    projection: `{
      _id, _type, title, "slug": slug.current, product,
      workflowConfig { workflowStatus, reviewNotes,
        "submittedBy": submittedBy->name,
        "reviewedBy": reviewedBy->name
      }
    }`,
    on: { create: false, update: true, delete: false },
  },
];

function sanityRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.sanity.io',
        path: `/v1/hooks/projects/${SANITY_PROJECT_ID}${path}`,
        method,
        headers: {
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            res.statusCode < 300 ? resolve(json) : reject(new Error(JSON.stringify(json.error || json)));
          } catch {
            reject(new Error(data));
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function listWebhooks() {
  const result = await sanityRequest('GET', '');
  const hooks = result.hooks || result || [];
  console.log(`\nExisting webhooks (${hooks.length}):`);
  for (const h of hooks) {
    console.log(`  [${h.id}] ${h.name}`);
    console.log(`    URL: ${h.url}`);
    console.log(`    Filter: ${h.filter || 'none'}`);
    console.log();
  }
  return hooks;
}

async function createWebhooks() {
  console.log(`\nCreating ${WEBHOOKS.length} webhooks...\n`);
  console.log(`Using shared secret. Save this in CF Pages → Settings → Env Vars:`);
  console.log(`  SANITY_WEBHOOK_SECRET=${SHARED_SECRET}\n`);

  for (const wh of WEBHOOKS) {
    console.log(`Creating: ${wh.name}`);
    try {
      const result = await sanityRequest('POST', '', {
        name: wh.name,
        url: wh.url,
        dataset: 'production',
        filter: wh.filter,
        projection: wh.projection,
        secret: SHARED_SECRET,
        httpMethod: 'POST',
        apiVersion: '2021-03-25',
        includeDrafts: false,
        on: wh.on,
      });
      console.log(`  ✓ Created (id: ${result.id})`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  console.log('\nAlso set these in CF Pages → Settings → Env Vars:');
  console.log(`  CF_API_TOKEN=cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039`);
  console.log(`  CF_ACCOUNT_ID=ff9df0a2daf8c9eb1032f67dd551c784`);
  console.log(`  SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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`);
  console.log(`  ZEPTOMAIL_TOKEN=Zoho-enczapikey yA6KbHtd7gqjwGxTFEE7hJPeoIZhqaA8jn63tnridJAkI9Poi6Fs0htkJ9S+LzSO34CD56oAOItHdtjqt9BXeplmY4RZepTGTuv4P2uV48xh8ciEYNYjgZ+gBLQWGqZMcBonDSw0QvgpWA==`);
}

async function deleteWebhook(id) {
  await sanityRequest('DELETE', `/${id}`);
  console.log(`Deleted webhook: ${id}`);
}

const args = process.argv.slice(2);
if (args[0] === '--list') {
  listWebhooks().catch(console.error);
} else if (args[0] === '--create') {
  createWebhooks().catch(console.error);
} else if (args[0] === '--delete' && args[1]) {
  deleteWebhook(args[1]).catch(console.error);
} else {
  console.log('Usage:');
  console.log('  node scripts/setup-webhooks.js --list');
  console.log('  node scripts/setup-webhooks.js --create');
  console.log('  node scripts/setup-webhooks.js --delete <id>');
}
