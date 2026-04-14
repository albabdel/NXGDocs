#!/usr/bin/env node
/**
 * reformat-confluence-pages.js
 *
 * Transforms Confluence pages in the Surge and Nxgen Technology spaces
 * to follow the standard .md structure:
 *
 *   # Device Title       → Confluence page title (unchanged)
 *   ## Summary           → extracted from <h1>Summary: ...</h1>
 *   ## Key Features      → detected from <p><strong>Key Features...</strong></p>
 *   ## Overview          → remaining body content
 *
 * Before:
 *   <h1>Summary: [text]</h1>
 *   <h1>[article title]</h1>   (Surge pages only)
 *   <p><strong>Key Features...</strong></p>
 *   <p>content...</p>
 *
 * After:
 *   <h2>Summary</h2><p>[text]</p>
 *   <h2>Key Features</h2>      (if detected)
 *   <h2>Overview</h2>
 *   <p>content...</p>
 *
 * Usage:
 *   node scripts/reformat-confluence-pages.js [--dry-run] [--space SPACE_KEY]
 */
'use strict';

const https = require('https');

// ── Credentials ──────────────────────────────────────────────────────────────
const CONFLUENCE_EMAIL = 'abed.badarnah@nxgen.io';
const CONFLUENCE_API_TOKEN = 'ATATT3xFfGF0G_l2FOSmUPk2kcPmrUzVeTUH5_b2PIisN3jbAJpOM_IsmWVIwhrhicZXx9Z-W04_QyRb0ZXhUZjoeGKC7CCrgzpw_k-hYKaenDdeTAIjU665swe2YtWkNa9MLM9XhnAvqfASjQ0C2TIeYbhCRxxqSwc9MUFU9GaspPlofg1ZuKo=FA7F33B2';
const SITE = 'https://nxgen-team-f1bs1n7p.atlassian.net';
const AUTH = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`).toString('base64');

// ── Space keys ────────────────────────────────────────────────────────────────
const SPACES = {
  Surge: 'Surge',
  NxgenTechnology: '~712020877e7015fc0d4cb2b71046b57b872b5d',
};

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SPACE_IDX = args.indexOf('--space');
const ONLY_SPACE = SPACE_IDX !== -1 ? args[SPACE_IDX + 1] : null;

// ── HTTP helper ───────────────────────────────────────────────────────────────
function req(method, urlStr, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const opts = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method,
      headers: {
        Authorization: `Basic ${AUTH}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const r = https.request(opts, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${d.slice(0, 400)}`));
        try { resolve(JSON.parse(d)); } catch { resolve(d); }
      });
    });
    r.on('error', reject);
    if (body) r.write(typeof body === 'string' ? body : JSON.stringify(body));
    r.end();
  });
}

async function fetchAllPages(spaceKey) {
  const pages = [];
  let start = 0;
  const limit = 50;
  while (true) {
    const url = `${SITE}/wiki/rest/api/space/${encodeURIComponent(spaceKey)}/content?type=page&expand=body.storage,version&start=${start}&limit=${limit}`;
    const data = await req('GET', url);
    const results = (data.page && data.page.results) || data.results || [];
    pages.push(...results);
    const size = (data.page && data.page.size) || results.length;
    if (size < limit) break;
    start += limit;
  }
  return pages;
}

// ── Content transformation ────────────────────────────────────────────────────

/**
 * Strips HTML tags and decodes common entities to get plain text.
 */
function htmlToText(html) {
  return html
    .replace(/<ac:[^>]*>[\s\S]*?<\/ac:[^>]*>/gi, '')
    .replace(/<ac:[^/][^>]*\/>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Escapes HTML entities for safe text insertion.
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Transforms Confluence storage HTML to follow the standard structure:
 *
 *   <h2>Summary</h2><p>[summary]</p>
 *   [<h2>Key Features</h2>] (if detected)
 *   <h2>Overview</h2>
 *   [remaining content]
 *
 * Returns { newBody, changed, summary } or null if already correct.
 */
function transformBody(storageHtml, pageTitle) {
  let html = storageHtml;

  // ── 1. Extract summary from <h1>Summary: ...</h1> ─────────────────────────
  const summaryH1Match = html.match(/^\s*<h1[^>]*>Summary:\s*([\s\S]*?)<\/h1>/i);
  if (!summaryH1Match) {
    // Already reformatted or no summary H1 found — check if it has <h2>Summary</h2>
    if (/<h2[^>]*>\s*Summary\s*<\/h2>/i.test(html)) {
      return null; // Already in correct format
    }
    // No summary at all — skip
    return null;
  }

  const summaryText = htmlToText(summaryH1Match[1]);
  // Remove the summary H1 from the beginning
  html = html.replace(/^\s*<h1[^>]*>Summary:\s*[\s\S]*?<\/h1>/i, '').trimStart();

  // ── 2. Remove a redundant H1 that repeats the page title ─────────────────
  // (Surge pages have a second H1 like "<h1>ADPRO SMTP setup</h1>")
  html = html.replace(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>/i, (match, innerHtml) => {
    const text = htmlToText(innerHtml);
    // If it's essentially the same as the page title, remove it
    const titleNorm = pageTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    const textNorm = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (titleNorm.includes(textNorm) || textNorm.includes(titleNorm) || textNorm.length < 5) {
      return ''; // Drop it
    }
    // Otherwise convert to <h2> under Overview
    return `<h2>${escapeHtml(text)}</h2>`;
  });

  // ── 3. Detect and upgrade "Key Features" bold paragraph ──────────────────
  // Pattern: <p><strong>Key Features...</strong></p> or <p>Key Features...</p>
  let hasKeyFeatures = false;
  html = html.replace(
    /<p[^>]*>\s*<strong[^>]*>(Key Features[^<]*)<\/strong>\s*<\/p>/gi,
    (_, innerText) => {
      hasKeyFeatures = true;
      return `<h2>Key Features</h2>`;
    }
  );

  // ── 4. Build the new body ─────────────────────────────────────────────────
  const summaryBlock = `<h2>Summary</h2>\n<p>${escapeHtml(summaryText)}</p>`;

  // Determine if remaining content is substantial enough for Overview
  const remainingText = htmlToText(html);
  const overviewHeader = remainingText.length > 10 ? '<h2>Overview</h2>\n' : '';

  // Only add Overview header if there's no existing H2/H3 structure in the body
  const hasExistingH2 = /<h[23][^>]*>/i.test(html);
  const newBody = hasExistingH2
    ? `${summaryBlock}\n${html.trimStart()}`
    : `${summaryBlock}\n${overviewHeader}${html.trimStart()}`;

  return { newBody, summary: summaryText };
}

// ── Process a single space ────────────────────────────────────────────────────
async function processSpace(spaceKey, spaceName) {
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`  Space: ${spaceName} (${spaceKey})`);
  console.log(`╚══════════════════════════════════════════════════════╝\n`);

  const pages = await fetchAllPages(spaceKey);
  console.log(`Found ${pages.length} pages\n`);

  let updated = 0, skipped = 0, errors = 0;

  for (const page of pages) {
    const title = page.title || '(untitled)';
    const id = page.id;
    const version = page.version && page.version.number;
    const storageHtml = page.body && page.body.storage && page.body.storage.value;

    if (!storageHtml || storageHtml.trim() === '') {
      console.log(`  [skip] "${title}" — empty body`);
      skipped++;
      continue;
    }

    const result = transformBody(storageHtml, title);

    if (!result) {
      console.log(`  [ok]   "${title}" — already in correct format or no summary to extract`);
      skipped++;
      continue;
    }

    const { newBody, summary } = result;
    console.log(`  [fix]  "${title}"`);
    console.log(`         Summary: "${summary.slice(0, 80)}${summary.length > 80 ? '...' : ''}"`);

    if (DRY_RUN) {
      updated++;
      continue;
    }

    try {
      await req('PUT', `${SITE}/wiki/rest/api/content/${id}`, {
        version: { number: version + 1 },
        title,
        type: 'page',
        body: { storage: { value: newBody, representation: 'storage' } },
      });
      console.log(`         ✓ Updated page ${id} → v${version + 1}`);
      updated++;
    } catch (err) {
      console.error(`         ✗ Failed: ${err.message}`);
      errors++;
    }

    // Rate-limit guard
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\n  Updated: ${updated}  Skipped: ${skipped}  Errors: ${errors}`);
  return { updated, skipped, errors };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n[reformat-confluence] Starting — dry run: ${DRY_RUN}`);
  if (ONLY_SPACE) console.log(`[reformat-confluence] Only processing space: ${ONLY_SPACE}\n`);

  const spacesToProcess = ONLY_SPACE
    ? Object.entries(SPACES).filter(([, key]) => key === ONLY_SPACE || key.startsWith(ONLY_SPACE))
    : Object.entries(SPACES);

  let totalUpdated = 0, totalErrors = 0;

  for (const [name, key] of spacesToProcess) {
    try {
      const { updated, errors } = await processSpace(key, name);
      totalUpdated += updated;
      totalErrors += errors;
    } catch (err) {
      console.error(`\n[fatal] Failed to process space ${name}: ${err.message}`);
      totalErrors++;
    }
  }

  console.log(`\n${'═'.repeat(54)}`);
  console.log(`  Total updated: ${totalUpdated}   Total errors: ${totalErrors}`);
  if (DRY_RUN) console.log('\n  (Dry run — no changes written to Confluence)');
  console.log(`${'═'.repeat(54)}\n`);
}

run().catch((err) => {
  console.error('[fatal]', err.message);
  process.exit(1);
});
