#!/usr/bin/env node
/**
 * fix-confluence-headings.js
 *
 * Fixes article summaries in a Confluence space:
 * - Finds articles where the first content is a <p><strong>…</strong></p> (bold paragraph acting as a heading)
 * - Replaces it with a proper <h1>…</h1> element
 * - Updates the page in Confluence via REST API
 *
 * Usage:
 *   node scripts/fix-confluence-headings.js [--dry-run] [--space SPACE_KEY]
 *
 * Default space: ~712020877e7015fc0d4cb2b71046b57b872b5d (Nxgen Technology personal space)
 */
'use strict';

const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

// ── Load .env if present ──────────────────────────────────────────────────────
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '.env.local'),
  path.join(__dirname, '..', 'gcsurge', '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (key && !(key in process.env)) process.env[key] = value;
    }
  }
}

// ── Config ────────────────────────────────────────────────────────────────────
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL || 'abed.badarnah@nxgen.io';
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN || 'ATATT3xFfGF0G_l2FOSmUPk2kcPmrUzVeTUH5_b2PIisN3jbAJpOM_IsmWVIwhrhicZXx9Z-W04_QyRb0ZXhUZjoeGKC7CCrgzpw_k-hYKaenDdeTAIjU665swe2YtWkNa9MLM9XhnAvqfASjQ0C2TIeYbhCRxxqSwc9MUFU9GaspPlofg1ZuKo=FA7F33B2';
const CONFLUENCE_SITE_URL = process.env.CONFLUENCE_SITE_URL || 'https://nxgen-team-f1bs1n7p.atlassian.net';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SPACE_IDX = args.indexOf('--space');
const SPACE_KEY = SPACE_IDX !== -1 ? args[SPACE_IDX + 1] : '~712020877e7015fc0d4cb2b71046b57b872b5d';

const AUTH = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`).toString('base64');

console.log(`[fix-headings] Space: ${SPACE_KEY}`);
console.log(`[fix-headings] Dry run: ${DRY_RUN}`);
console.log(`[fix-headings] Site: ${CONFLUENCE_SITE_URL}`);

// ── HTTP helpers ──────────────────────────────────────────────────────────────
function request(method, urlStr, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: `Basic ${AUTH}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', reject);

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function fetchAllPages(spaceKey) {
  const pages = [];
  let start = 0;
  const limit = 50;

  while (true) {
    const url = `${CONFLUENCE_SITE_URL}/wiki/rest/api/space/${encodeURIComponent(spaceKey)}/content?type=page&expand=body.storage,version&start=${start}&limit=${limit}`;
    const data = await request('GET', url);
    const results = (data.page && data.page.results) || data.results || [];
    pages.push(...results);
    const size = (data.page && data.page.size) || results.length;
    if (size < limit) break;
    start += limit;
  }

  return pages;
}

// ── Heading detection & fix ───────────────────────────────────────────────────

/**
 * Strips Confluence-specific markup (ac:structured-macro etc.) entirely,
 * then strips remaining HTML tags, returning only visible text.
 */
function cleanHeadingText(html) {
  return html
    // Remove entire Confluence macro blocks (including their text content)
    .replace(/<ac:[^>]*>[\s\S]*?<\/ac:[^>]*>/gi, '')
    .replace(/<ac:[^/][^>]*\/>/gi, '')   // self-closing ac: tags
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if the content starts with a bold-only paragraph (acting as a summary/heading).
 * Returns the regex match array if found, null otherwise.
 * Only matches when the <strong> content is substantial (≥50 chars) — avoids
 * matching short labels like "<strong>Summary:</strong> rest of sentence..."
 */
function findFirstBoldParagraph(storageHtml) {
  // Exact case: <p><strong>…</strong></p> with nothing else (or only whitespace/macros after)
  const match = storageHtml.match(
    /^\s*<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/p>/i
  );
  if (match) {
    const text = cleanHeadingText(match[1]);
    if (text.length >= 50) return match;
  }

  // Loose case: first paragraph starts with a <strong> block that contains the bulk of the text
  const firstPara = storageHtml.match(/^\s*(<p[^>]*>[\s\S]*?<\/p>)/i);
  if (!firstPara) return null;
  const paraContent = firstPara[1];
  const innerMatch = paraContent.match(/<p[^>]*>\s*(<strong[^>]*>[\s\S]*?<\/strong>)[\s\S]*?<\/p>/i);
  if (!innerMatch) return null;
  // Only proceed if the strong content is a full sentence (≥50 chars)
  const strongText = cleanHeadingText(innerMatch[1]);
  if (strongText.length < 50) return null;
  return innerMatch;
}

/**
 * Extracts the clean summary text from the first bold paragraph in storage HTML.
 * Returns the text that should become the H1.
 */
function extractSummaryText(storageHtml) {
  // First try exact match: <p><strong>text</strong></p>
  const exact = storageHtml.match(/^\s*<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/p>/i);
  if (exact) return cleanHeadingText(exact[1]);

  // Loose match: get only what's inside the first <strong>…</strong> in the first paragraph
  const firstPara = storageHtml.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!firstPara) return null;
  const strongMatch = firstPara[1].match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
  if (!strongMatch) return null;
  return cleanHeadingText(strongMatch[1]);
}

/**
 * Replaces the first bold paragraph with a clean H1 tag.
 * Only uses text from inside the <strong> element, properly stripping macros.
 */
function fixFirstHeading(storageHtml) {
  const summaryText = extractSummaryText(storageHtml);
  if (!summaryText) return storageHtml;

  // Replace the entire first paragraph (whether it's exact <p><strong>…</strong></p>
  // or a loose paragraph starting with <strong>)
  return storageHtml.replace(
    /^\s*<p[^>]*>[\s\S]*?<\/p>/i,
    `<h1>${summaryText}</h1>`
  );
}

/**
 * Checks if an article already has an H1 that looks garbled
 * (contains confluence macro text leakage or trailing non-sentence text).
 * Returns the garbled text if the H1 needs fixing, null if it's fine.
 */
function findGarbledH1(storageHtml) {
  const h1Match = storageHtml.match(/^\s*<h1>([\s\S]*?)<\/h1>/i);
  if (!h1Match) return null;

  const h1Text = h1Match[1];

  // Sign 1: Confluence status lozenge residue — concatenated words like "Greenpublished"
  // or standalone "published"/"draft" in the middle of non-sentence context
  const hasStatusResidue = /Green(published|draft|review)|published [A-Z][a-z]/.test(h1Text);

  // Sign 2: Period immediately followed by uppercase (no space) — title was appended without separator
  // e.g. "...alarm receiver setup.Ajax Configuration Guide"
  const hasTitleAppendedNospace = /\.[A-Z][a-z]/.test(h1Text);

  // Sign 3: Sentence ends (". ") followed by what looks like an article/section title
  // — 2+ Title Case words that don't form a sentence continuation
  // e.g. "...alarm receiver setup. Greenpublished AJAX Device Configuration"
  // But avoid false positives where the sentence genuinely ends and a new sentence starts.
  // Heuristic: if the last word after ". " is followed only by Title Case words (no verb pattern), flag it.
  const afterLastPeriod = h1Text.match(/\.\s+([A-Z][^\.]*)$/);
  const hasTrailingTitleAfterSpace =
    afterLastPeriod && /^([A-Z][a-zA-Z]+\s?){2,}$/.test(afterLastPeriod[1].trim());

  if (hasStatusResidue || hasTitleAppendedNospace || hasTrailingTitleAfterSpace) return h1Text;
  return null;
}

/**
 * Cleans up a garbled H1 text by removing trailing non-summary cruft.
 */
function cleanGarbledH1(h1Text) {
  return h1Text
    // Remove confluence macro residue patterns
    .replace(/\s*Green(published|draft|review)\s*/gi, ' ')
    .replace(/\s+published\s+(?=[A-Z])/g, ' ')
    // Remove trailing title-case text after the last sentence-ending period (with or without space)
    .replace(/(\.)([A-Z][a-zA-Z\s\-–—,()]{5,})$/, '$1')       // no space: ".Title Here"
    .replace(/(\.\s+)([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)$/, '$1') // with space: ". Title Here" (2+ TC words)
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n[fix-headings] Fetching pages...');
  const pages = await fetchAllPages(SPACE_KEY);
  console.log(`[fix-headings] Found ${pages.length} pages\n`);

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const page of pages) {
    const title = page.title || '(untitled)';
    const id = page.id;
    const version = page.version && page.version.number;
    const storageBody = page.body && page.body.storage && page.body.storage.value;

    if (!storageBody) {
      console.log(`  [skip] "${title}" — no body content`);
      skipped++;
      continue;
    }

    // Check if this article already has a garbled H1 (from a previous run with bad stripping)
    const garbledH1 = findGarbledH1(storageBody);
    if (garbledH1) {
      console.log(`  [refix] "${title}" — garbled H1 detected, cleaning up`);
      console.log(`          Was: "${garbledH1.slice(0, 80)}"`);

      if (DRY_RUN) { fixed++; continue; }

      const cleanedH1 = cleanGarbledH1(garbledH1);

      const newBody = storageBody.replace(/^\s*<h1>[\s\S]*?<\/h1>/i, `<h1>${cleanedH1}</h1>`);
      console.log(`          Now: "${cleanedH1.slice(0, 80)}"`);

      try {
        await request('PUT', `${CONFLUENCE_SITE_URL}/wiki/rest/api/content/${id}`, {
          version: { number: version + 1 },
          title,
          type: 'page',
          body: { storage: { value: newBody, representation: 'storage' } },
        });
        console.log(`         ✓ Re-fixed page ${id}`);
        fixed++;
      } catch (err) {
        console.error(`         ✗ Failed to refix "${title}": ${err.message}`);
        errors++;
      }
      await new Promise((r) => setTimeout(r, 300));
      continue;
    }

    const matchResult = findFirstBoldParagraph(storageBody);
    if (!matchResult) {
      console.log(`  [ok]   "${title}" — already has correct heading`);
      skipped++;
      continue;
    }

    const headingText = extractSummaryText(storageBody) || '(unknown)';
    console.log(`  [fix]  "${title}" — converting bold summary to H1: "${headingText.slice(0, 60)}"`);

    if (DRY_RUN) {
      fixed++;
      continue;
    }

    const newBody = fixFirstHeading(storageBody);

    try {
      await request('PUT', `${CONFLUENCE_SITE_URL}/wiki/rest/api/content/${id}`, {
        version: { number: version + 1 },
        title,
        type: 'page',
        body: {
          storage: {
            value: newBody,
            representation: 'storage',
          },
        },
      });
      console.log(`         ✓ Updated page ${id}`);
      fixed++;
    } catch (err) {
      console.error(`         ✗ Failed to update "${title}": ${err.message}`);
      errors++;
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('\n── Summary ─────────────────────────────────────────────');
  console.log(`  Fixed:   ${fixed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);
  if (DRY_RUN) console.log('\n  (Dry run — no changes were written to Confluence)');
  console.log('──────────────────────────────────────────────────────\n');
}

run().catch((err) => {
  console.error('[fix-headings] Fatal error:', err.message);
  process.exit(1);
});
