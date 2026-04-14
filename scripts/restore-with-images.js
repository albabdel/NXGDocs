#!/usr/bin/env node
/**
 * restore-with-images.js
 *
 * For each Surge Confluence page:
 *  1. Fetch the ORIGINAL v1 content (which has proper <ac:image> tags in place)
 *  2. Clean up the formatting:
 *     - Convert <p><strong>Heading</strong></p> → <h2>Heading</h2>
 *     - Remove local-id attributes and &nbsp; blank lines
 *     - Strip ri:version-at-save attributes (avoids stale-version errors)
 *  3. Prepend the H1 summary header
 *  4. Push as a new version
 *
 * For pages WITHOUT images (FTP + overview articles), just ensure they have
 * the correct H1 summary (they already do from the previous rewrite).
 *
 * Usage: node scripts/restore-with-images.js [--dry-run] [--page PAGE_ID]
 */
'use strict';

const https = require('https');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_PAGE = (() => { const i = args.indexOf('--page'); return i !== -1 ? args[i + 1] : null; })();

const SITE = 'https://nxgen-team-f1bs1n7p.atlassian.net';
const AUTH = Buffer.from(
  'abed.badarnah@nxgen.io:ATATT3xFfGF0G_l2FOSmUPk2kcPmrUzVeTUH5_b2PIisN3jbAJpOM_IsmWVIwhrhicZXx9Z-W04_QyRb0ZXhUZjoeGKC7CCrgzpw_k-hYKaenDdeTAIjU665swe2YtWkNa9MLM9XhnAvqfASjQ0C2TIeYbhCRxxqSwc9MUFU9GaspPlofg1ZuKo=FA7F33B2'
).toString('base64');

// Pages that have local images and need v1 content restored
// (pages without images keep the clean markdown rewrite from previous script)
const ARTICLES_WITH_IMAGES = [
  {
    id: '22478849',
    title: 'GC Surge Device Integration with NxGen Platform: API, Email, and FTP Methods',
    originalVersion: 1,
    summary: 'This document explains how GCXSurge devices integrate with the NxGen platform using the Add Device API, covering all three integration types — API token, SMTP email, and FTP — with full request/response examples and the event processing pipeline.',
  },
  {
    id: '22446083',
    title: 'ADPRO SMTP',
    originalVersion: 1,
    summary: 'This guide explains how to configure ADPRO XoClient to send email alerts to GC Surge via ZeptoMail SMTP, covering connection settings, email address book setup, and alarm profile email transmission.',
  },
  {
    id: '23461896',
    title: 'Axis Camera Station Pro SMTP',
    originalVersion: 1,
    summary: 'This guide covers configuring AXIS Camera Station Pro to send email notifications to GC Surge via SMTP, including server settings and action rule creation for triggered email delivery.',
  },
  {
    id: '23461889',
    title: 'Axis SMTP',
    originalVersion: 1,
    summary: 'This guide walks through configuring an AXIS IP camera to send email alerts with images to GC Surge via ZeptoMail SMTP, including recipient setup and event rule configuration.',
  },
  {
    id: '23101441',
    title: 'Dahua SMTP',
    originalVersion: 1,
    summary: 'This guide explains how to configure a Dahua NVR or camera to send email alert notifications to GC Surge via ZeptoMail SMTP, including network email settings and receiver configuration.',
  },
  {
    id: '22052883',
    title: 'HikProConnect SMTP',
    originalVersion: 1,
    summary: 'This guide explains how to configure email alerts on Hikvision devices via the Hik-Partner Pro cloud portal (HikProConnect) to send events to GC Surge using ZeptoMail SMTP, without requiring local device access.',
  },
  {
    id: '23330817',
    title: 'Hikvision SMTP',
    originalVersion: 1,
    summary: 'This guide walks through configuring a Hikvision NVR or camera web portal to send email alerts with attached images to GC Surge via ZeptoMail SMTP.',
  },
  {
    id: '22970379',
    title: 'NXWiTTNeSS/Hanhwa SMPT',
    originalVersion: 1,
    summary: 'This guide explains how to configure NX Witness (used with Hanwha and Spyke Box cameras) to send motion-triggered email alerts to GC Surge via SMTP, including camera rules and motion detection setup.',
  },
  {
    id: '22937611',
    title: 'Vivotek SMTP',
    originalVersion: 1,
    summary: 'This guide covers configuring a Vivotek NVR to send email alarm notifications with snapshots to GC Surge via ZeptoMail SMTP, including SMTP server setup, recipient configuration, and alarm rule creation.',
  },
];

// ── HTTP helper ───────────────────────────────────────────────────────────────
function req(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: 443, path: u.pathname + u.search, method,
      headers: { Authorization: `Basic ${AUTH}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    };
    const r = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${d.slice(0, 400)}`));
        try { resolve(JSON.parse(d)); } catch { resolve(d); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

// ── HTML cleaner ──────────────────────────────────────────────────────────────
function cleanConfluenceHtml(html) {
  // 1. Remove ALL local-id attributes (they're internal Confluence IDs, cause no-op noise)
  html = html.replace(/ local-id="[^"]*"/g, '');
  html = html.replace(/ ac:local-id="[^"]*"/g, '');

  // 2. Remove ri:version-at-save (causes attachment reference errors on new versions)
  html = html.replace(/ ri:version-at-save="[^"]*"/g, '');

  // 3. Remove purely blank paragraphs (<p>&nbsp;</p> and <p />  and <p></p>)
  html = html.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/g, '');
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');
  html = html.replace(/<p[^>]*\/>/g, '');

  // 4. Convert <p><strong>Heading text</strong></p> → <h2>Heading text</h2>
  //    Only when the paragraph contains ONLY a strong tag (no other content)
  html = html.replace(
    /<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/p>/g,
    (match, inner) => {
      // Skip if inner content is empty or very short (likely a label, not a heading)
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (text.length < 3) return match;
      // Skip figure captions (they should stay as <em>)
      if (/^Figure\s+\d+/i.test(text)) return match;
      return `<h2>${inner}</h2>`;
    }
  );

  // 5. The FIRST <h2> that is the article title-level heading — demote the very first one to h1
  //    (it's the article title like "HIKVISION", "ADPRO SMTP setup", etc.)
  //    We only do this if there's no h1 already in the content
  if (!/<h1[^>]*>/.test(html)) {
    html = html.replace(/<h2>/, '<h1>');
    html = html.replace(/<\/h2>/, '</h1>');  // only first occurrence
  }

  // 6. Collapse multiple consecutive blank paragraphs
  html = html.replace(/(\s*<p[^>]*>\s*<\/p>\s*){2,}/g, '');

  // 7. Clean up extra whitespace between tags
  html = html.replace(/>\s{2,}</g, '>\n<');

  return html.trim();
}

// ── Process one article ───────────────────────────────────────────────────────
async function processArticle(article) {
  console.log(`\n[${article.id}] "${article.title}"`);

  // Step 1: Fetch original v1 content
  let originalHtml;
  try {
    const data = await req('GET', `${SITE}/wiki/rest/api/content/${article.id}?version=${article.originalVersion}&expand=body.storage`);
    originalHtml = data.body.storage.value;
    console.log(`  ✓ Fetched v${article.originalVersion} (${originalHtml.length} chars)`);
  } catch (err) {
    console.error(`  ✗ Failed to fetch v${article.originalVersion}: ${err.message}`);
    return false;
  }

  // Step 2: Clean up the HTML
  const cleanedHtml = cleanConfluenceHtml(originalHtml);

  // Count images in original
  const imgCount = (originalHtml.match(/<ac:image/g) || []).length;
  console.log(`  ✓ Images in original: ${imgCount}`);
  console.log(`  ✓ Images preserved after clean: ${(cleanedHtml.match(/<ac:image/g) || []).length}`);

  // Step 3: Prepend H1 summary
  const fullHtml = `<h1>Summary: ${article.summary}</h1>\n${cleanedHtml}`;

  if (DRY_RUN) {
    console.log(`  → (dry run) Would push ${fullHtml.length} chars with ${imgCount} images`);
    console.log(`  → First 300: ${fullHtml.slice(0, 300)}`);
    return true;
  }

  // Step 4: Get current version and push
  let currentVersion;
  try {
    const data = await req('GET', `${SITE}/wiki/rest/api/content/${article.id}?expand=version`);
    currentVersion = data.version.number;
  } catch (err) {
    console.error(`  ✗ Failed to get current version: ${err.message}`);
    return false;
  }

  try {
    await req('PUT', `${SITE}/wiki/rest/api/content/${article.id}`, {
      version: { number: currentVersion + 1 },
      title: article.title,
      type: 'page',
      body: { storage: { value: fullHtml, representation: 'storage' } },
    });
    console.log(`  ✓ Updated to v${currentVersion + 1} (${imgCount} images included)`);
    return true;
  } catch (err) {
    console.error(`  ✗ PUT failed: ${err.message}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n[restore-with-images] dry-run=${DRY_RUN}\n`);
  let ok = 0, fail = 0;

  const toProcess = ONLY_PAGE
    ? ARTICLES_WITH_IMAGES.filter(a => a.id === ONLY_PAGE)
    : ARTICLES_WITH_IMAGES;

  for (const article of toProcess) {
    const success = await processArticle(article);
    if (success) ok++; else fail++;
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n── Done ─────────────────────────────────────────`);
  console.log(`  Restored: ${ok}  Failed: ${fail}`);
  console.log(`─────────────────────────────────────────────────\n`);
}

run().catch(err => { console.error('[fatal]', err.message); process.exit(1); });
