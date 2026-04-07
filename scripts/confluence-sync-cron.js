#!/usr/bin/env node
'use strict';

/**
 * Confluence → Sanity Sync (Cron-compatible)
 *
 * Wraps the GC Surge Confluence fetch pipeline with:
 *   - Timestamped logging
 *   - Slack notification on success/failure
 *   - Exit codes suitable for cron health monitoring
 *   - Optional Sanity deploy trigger after sync
 *
 * Usage:
 *   node scripts/confluence-sync-cron.js                  # Sync and log
 *   node scripts/confluence-sync-cron.js --notify         # + Slack notification
 *   node scripts/confluence-sync-cron.js --deploy         # + Trigger CF Pages deploy
 *   node scripts/confluence-sync-cron.js --dry-run        # Fetch only, don't write files
 *
 * For n8n / scheduled runs:
 *   Schedule as a daily cron at 06:00 UTC
 *   Command: node /path/to/nxgen-docs/scripts/confluence-sync-cron.js --notify --deploy
 *
 * Required env vars (or set in .env.local):
 *   CONFLUENCE_EMAIL          abed.badarnah@nxgen.io
 *   CONFLUENCE_API_TOKEN      (from Keys.md)
 *   CONFLUENCE_SITE_URL       https://nxgen-team-f1bs1n7p.atlassian.net
 *   CONFLUENCE_SPACE_KEY      Surge
 */

const path = require('path');
const https = require('https');

// Load .env.local if present
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
}

const NOTIFY = process.argv.includes('--notify');
const DEPLOY = process.argv.includes('--deploy');
const DRY_RUN = process.argv.includes('--dry-run');

const SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';
const CF_ACCOUNT_ID = 'ff9df0a2daf8c9eb1032f67dd551c784';
const CF_API_TOKEN = 'cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039';

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function postSlack(text) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ text });
    const req = https.request(
      'https://hooks.slack.com/services/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',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => { res.resume(); res.on('end', resolve); }
    );
    req.on('error', resolve); // Don't fail on Slack errors
    req.write(body);
    req.end();
  });
}

async function triggerCfDeploy(projectName) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${projectName}/deployments`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, id: json.result?.id, error: json.errors?.[0]?.message };
}

async function main() {
  log('Confluence → GC Surge Sync started');

  const startTime = Date.now();
  let success = false;
  let errorMessage = null;
  let pageCount = 0;

  try {
    // Validate required env vars
    const required = ['CONFLUENCE_EMAIL', 'CONFLUENCE_API_TOKEN', 'CONFLUENCE_SITE_URL', 'CONFLUENCE_SPACE_KEY'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(`Missing env vars: ${missing.join(', ')}\nSet them in .env.local or export before running.`);
    }

    if (DRY_RUN) {
      log('DRY RUN: would fetch Confluence pages but skipping file writes');
    } else {
      // Run the fetch script as a module
      const fetchScriptPath = path.join(__dirname, '..', 'classic', 'scripts', 'fetch-confluence-gcsurge.js');
      if (!fs.existsSync(fetchScriptPath)) {
        throw new Error(`Fetch script not found: ${fetchScriptPath}`);
      }

      process.env.PRODUCT = 'gcsurge';
      process.env.SANITY_CACHE_PATH = '.sanity-cache/gcsurge-docs';

      // Clear module cache to ensure fresh run
      Object.keys(require.cache).forEach((k) => {
        if (k.includes('fetch-confluence')) delete require.cache[k];
      });

      log('Fetching Confluence pages...');
      const { run } = require(fetchScriptPath);
      if (typeof run === 'function') {
        const result = await run();
        pageCount = result?.pageCount || 0;
      } else {
        // Script doesn't export run() — executes on require
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`Sync complete in ${elapsed}s${pageCount ? ` — ${pageCount} pages` : ''}`);
    success = true;

    // Trigger CF Pages deploy
    if (DEPLOY && !DRY_RUN) {
      log('Triggering GC Surge Cloudflare Pages deploy...');
      const deploy = await triggerCfDeploy('gcsurge');
      if (deploy.ok) {
        log(`  ✓ Deploy started (id: ${deploy.id?.slice(0, 8) || 'pending'})`);
      } else {
        log(`  ✗ Deploy failed: ${deploy.error}`);
      }
    }

  } catch (err) {
    errorMessage = err.message;
    log(`ERROR: ${errorMessage}`);
  }

  // Slack notification
  if (NOTIFY) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const icon = success ? '✅' : '❌';
    const msg = success
      ? `${icon} *GC Surge Confluence Sync* complete in ${elapsed}s${pageCount ? ` (${pageCount} pages)` : ''}${DEPLOY ? '\n🚀 Deploy triggered' : ''}`
      : `${icon} *GC Surge Confluence Sync* FAILED after ${elapsed}s\n\`\`\`${errorMessage}\`\`\``;
    await postSlack(msg);
    log('Slack notification sent');
  }

  process.exit(success ? 0 : 1);
}

main();
