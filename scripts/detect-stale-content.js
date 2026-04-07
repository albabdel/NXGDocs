#!/usr/bin/env node
'use strict';

/**
 * Stale Content Detection
 *
 * Queries Sanity for published docs not updated in X days (default: 90).
 * Sends a digest email via ZeptoMail and posts a summary to Slack.
 *
 * Usage:
 *   node scripts/detect-stale-content.js              # 90-day threshold
 *   node scripts/detect-stale-content.js --days 60    # Custom threshold
 *   node scripts/detect-stale-content.js --dry-run    # Print report, don't send
 *   node scripts/detect-stale-content.js --product gcxone
 */

const https = require('https');
const { createClient } = require('@sanity/client');

const SANITY_READ_TOKEN = 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi';
const ZEPTOMAIL_TOKEN = 'Zoho-enczapikey yA6KbHtd7gqjwGxTFEE7hJPeoIZhqaA8jn63tnridJAkI9Poi6Fs0htkJ9S+LzSO34CD56oAOItHdtjqt9BXeplmY4RZepTGTuv4P2uV48xh8ciEYNYjgZ+gBLQWGqZMcBonDSw0QvgpWA==';
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const NOTIFY_EMAIL = 'abed.badarnah@nxgen.io';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DAYS = (() => {
  const idx = args.indexOf('--days');
  return idx !== -1 ? parseInt(args[idx + 1], 10) : 90;
})();
const PRODUCT_ARG = (() => {
  const idx = args.indexOf('--product');
  return idx !== -1 ? args[idx + 1] : null;
})();

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: SANITY_READ_TOKEN,
});

function postJson(hostname, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(
      {
        hostname,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function sendSlack(stale, noDate, days, product) {
  const total = stale.length + noDate.length;
  const productLabel = product ? ` (${product.toUpperCase()})` : '';
  const text = [
    `📋 *Stale Content Report${productLabel}* — ${new Date().toLocaleDateString('en-GB')}`,
    `Threshold: ${days} days`,
    ``,
    `*${stale.length}* docs not updated in ${days}+ days`,
    `*${noDate.length}* published docs with no lastUpdated date`,
    `*${total}* total need review`,
    ``,
    stale.slice(0, 8).map((d) => `• <https://www.sanity.io/manage/project/fjjuacab/dataset/production/doc/${d._id}|${d.title}> — last updated ${d.lastUpdated}`).join('\n'),
    stale.length > 8 ? `_…and ${stale.length - 8} more_` : '',
  ]
    .filter((l) => l !== '')
    .join('\n');

  return postJson('hooks.slack.com', '/services/THH89K1BJ/B0AMU6GAVP0/mi1ytVd0uJeybKHTD28sU48w', { text });
}

async function sendEmail(stale, noDate, days, product) {
  const productLabel = product ? ` (${product.toUpperCase()})` : '';
  const date = new Date().toLocaleDateString('en-GB');
  const total = stale.length + noDate.length;

  const rowsStale = stale
    .map(
      (d) =>
        `<tr><td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.title}</td>
         <td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.slug}</td>
         <td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.product || '—'}</td>
         <td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.lastUpdated || '—'}</td></tr>`
    )
    .join('');

  const rowsNoDate = noDate
    .map(
      (d) =>
        `<tr><td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.title}</td>
         <td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.slug}</td>
         <td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">${d.product || '—'}</td>
         <td style="padding:4px 8px;border-bottom:1px solid #e5e7eb;">No date set</td></tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1f2937;max-width:800px;margin:0 auto;padding:24px;">
<h2 style="color:#C9A227;border-bottom:2px solid #C9A227;padding-bottom:8px;">
  📋 Stale Content Report${productLabel} — ${date}
</h2>
<p>Threshold: <strong>${days} days</strong>. Total docs needing review: <strong>${total}</strong></p>

${stale.length > 0 ? `
<h3>Not updated in ${days}+ days (${stale.length})</h3>
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead><tr style="background:#f3f4f6;">
    <th style="padding:6px 8px;text-align:left;">Title</th>
    <th style="padding:6px 8px;text-align:left;">Slug</th>
    <th style="padding:6px 8px;text-align:left;">Product</th>
    <th style="padding:6px 8px;text-align:left;">Last Updated</th>
  </tr></thead>
  <tbody>${rowsStale}</tbody>
</table>` : ''}

${noDate.length > 0 ? `
<h3 style="margin-top:24px;">Published with no lastUpdated date (${noDate.length})</h3>
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead><tr style="background:#f3f4f6;">
    <th style="padding:6px 8px;text-align:left;">Title</th>
    <th style="padding:6px 8px;text-align:left;">Slug</th>
    <th style="padding:6px 8px;text-align:left;">Product</th>
    <th style="padding:6px 8px;text-align:left;">Last Updated</th>
  </tr></thead>
  <tbody>${rowsNoDate}</tbody>
</table>` : ''}

<p style="margin-top:24px;color:#6b7280;font-size:12px;">
  Review in <a href="https://www.sanity.io/manage/project/fjjuacab">Sanity Studio</a>
</p>
</body></html>`;

  return postJson(
    'api.zeptomail.eu',
    '/v1.1/email',
    {
      from: { address: 'no-reply@nxgen.io', name: 'NXGen Docs Bot' },
      to: [{ email_address: { address: NOTIFY_EMAIL, name: 'Abed Badarnah' } }],
      subject: `[NXGen Docs] Stale Content Report${productLabel} — ${date} (${total} docs)`,
      htmlbody: html,
    },
    { Authorization: ZEPTOMAIL_TOKEN }
  );
}

async function main() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const productFilter = PRODUCT_ARG ? ` && product == "${PRODUCT_ARG}"` : '';

  console.log(`Checking for stale content (threshold: ${DAYS} days, cutoff: ${cutoffStr})...`);

  const [stale, noDate] = await Promise.all([
    client.fetch(
      `*[_type == "doc" && status == "published"${productFilter} && defined(lastUpdated) && lastUpdated < $cutoff] {
        _id, title, "slug": slug.current, product, lastUpdated, status
      } | order(lastUpdated asc)`,
      { cutoff: cutoffStr }
    ),
    client.fetch(
      `*[_type == "doc" && status == "published"${productFilter} && !defined(lastUpdated)] {
        _id, title, "slug": slug.current, product, status
      } | order(title asc)`
    ),
  ]);

  const total = stale.length + noDate.length;

  console.log(`\nResults:`);
  console.log(`  Not updated in ${DAYS}+ days: ${stale.length}`);
  console.log(`  Published with no date:       ${noDate.length}`);
  console.log(`  Total needing review:         ${total}`);

  if (total === 0) {
    console.log('\n✅ All published content is up to date!');
    return;
  }

  if (stale.length > 0) {
    console.log(`\nStale docs (oldest first):`);
    stale.slice(0, 10).forEach((d) => {
      console.log(`  [${d.lastUpdated}] ${d.slug} — "${d.title}"`);
    });
    if (stale.length > 10) console.log(`  … and ${stale.length - 10} more`);
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN: notifications not sent. Remove --dry-run to send.');
    return;
  }

  console.log('\nSending notifications...');

  try {
    await sendSlack(stale, noDate, DAYS, PRODUCT_ARG);
    console.log('  ✓ Slack notification sent');
  } catch (err) {
    console.error(`  ✗ Slack failed: ${err.message}`);
  }

  try {
    const res = await sendEmail(stale, noDate, DAYS, PRODUCT_ARG);
    if (res.status >= 200 && res.status < 300) {
      console.log('  ✓ Email sent via ZeptoMail');
    } else {
      console.error(`  ✗ Email failed: HTTP ${res.status} — ${res.body}`);
    }
  } catch (err) {
    console.error(`  ✗ Email failed: ${err.message}`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
