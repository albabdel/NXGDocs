#!/usr/bin/env node
/**
 * rewrite-surge-confluence.js
 *
 * Reads each GC Surge markdown source file, converts it to clean
 * Confluence storage-format HTML (with a proper H1 summary header),
 * and pushes it to the corresponding Confluence page.
 *
 * Usage: node scripts/rewrite-surge-confluence.js [--dry-run] [--page PAGE_ID]
 */
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Credentials ──────────────────────────────────────────────────────────────
const CONFLUENCE_EMAIL = 'abed.badarnah@nxgen.io';
const CONFLUENCE_API_TOKEN = 'ATATT3xFfGF0G_l2FOSmUPk2kcPmrUzVeTUH5_b2PIisN3jbAJpOM_IsmWVIwhrhicZXx9Z-W04_QyRb0ZXhUZjoeGKC7CCrgzpw_k-hYKaenDdeTAIjU665swe2YtWkNa9MLM9XhnAvqfASjQ0C2TIeYbhCRxxqSwc9MUFU9GaspPlofg1ZuKo=FA7F33B2';
const SITE = 'https://nxgen-team-f1bs1n7p.atlassian.net';
const AUTH = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`).toString('base64');

const DOCS_DIR = path.join(__dirname, '..', 'gcsurge', '.sanity-cache', 'gcsurge-docs');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_PAGE = (() => { const i = args.indexOf('--page'); return i !== -1 ? args[i + 1] : null; })();

// ── Article map: pageId → { title, file, summary } ──────────────────────────
const ARTICLES = [
  {
    id: '22478849',
    title: 'GC Surge Device Integration with NxGen Platform: API, Email, and FTP Methods',
    file: 'gc-surge-device-integration-with-nxgen-platform-api-email-and-ftp-methods.md',
    summary: 'This document explains how GCXSurge devices integrate with the NxGen platform using the Add Device API, covering all three integration types — API token, SMTP email, and FTP — with full request/response examples and the event processing pipeline.',
  },
  {
    id: '22740993',
    title: 'GC Surge API Integration Guide for Sending Events to NxGen Platform',
    file: 'gc-surge-api-integration-guide-for-sending-events-to-nxgen-platform.md',
    summary: 'This guide describes the GC Surge REST API for submitting security events with images or video clips to the NxGen platform, including authentication, request format, quota tracking, and error handling.',
  },
  {
    id: '23232517',
    title: 'GC Surge Pricing Model',
    file: 'gc-surge-pricing-model.md',
    summary: 'This document outlines the GC Surge camera-based usage pricing model, including volume-tiered monthly rates, alarm inclusions and overage charges, trial terms, and billing rules.',
  },
  {
    id: '22446083',
    title: 'ADPRO SMTP',
    file: 'adpro-smtp.md',
    summary: 'This guide explains how to configure ADPRO XoClient to send email alerts to GC Surge via ZeptoMail SMTP, covering connection settings, email address book setup, and alarm profile email transmission.',
  },
  {
    id: '23461896',
    title: 'Axis Camera Station Pro SMTP',
    file: 'axis-camera-station-pro-smtp.md',
    summary: 'This guide covers configuring AXIS Camera Station Pro to send email notifications to GC Surge via SMTP, including server settings and action rule creation for triggered email delivery.',
  },
  {
    id: '23461889',
    title: 'Axis SMTP',
    file: 'axis-smtp.md',
    summary: 'This guide walks through configuring an AXIS IP camera to send email alerts with images to GC Surge via ZeptoMail SMTP, including recipient setup and event rule configuration.',
  },
  {
    id: '23101441',
    title: 'Dahua SMTP',
    file: 'dahua-smtp.md',
    summary: 'This guide explains how to configure a Dahua NVR or camera to send email alert notifications to GC Surge via ZeptoMail SMTP, including network email settings and receiver configuration.',
  },
  {
    id: '22052883',
    title: 'HikProConnect SMTP',
    file: 'hikproconnect-smtp.md',
    summary: 'This guide explains how to configure email alerts on Hikvision devices via the Hik-Partner Pro cloud portal (HikProConnect) to send events to GC Surge using ZeptoMail SMTP, without requiring local device access.',
  },
  {
    id: '23330817',
    title: 'Hikvision SMTP',
    file: 'hikvision-smtp.md',
    summary: 'This guide walks through configuring a Hikvision NVR or camera web portal to send email alerts with attached images to GC Surge via ZeptoMail SMTP.',
  },
  {
    id: '22970379',
    title: 'NXWiTTNeSS/Hanhwa SMPT',
    file: 'nxwittness-hanhwa-smpt.md',
    summary: 'This guide explains how to configure NX Witness (used with Hanwha and Spyke Box cameras) to send motion-triggered email alerts to GC Surge via SMTP, including camera rules and motion detection setup.',
  },
  {
    id: '22937611',
    title: 'Vivotek SMTP',
    file: 'vivotek-smtp.md',
    summary: 'This guide covers configuring a Vivotek NVR to send email alarm notifications with snapshots to GC Surge via ZeptoMail SMTP, including SMTP server setup, recipient configuration, and alarm rule creation.',
  },
  {
    id: '22413322',
    title: 'Axis FTP',
    file: 'axis-ftp.md',
    summary: 'This guide explains how to configure an AXIS camera to upload event images to GC Surge via FTP, covering FTP recipient setup and event rule configuration for perimeter intrusion detection.',
  },
  {
    id: '23592962',
    title: 'Dahua FTP',
    file: 'dahua-ftp.md',
    summary: 'This guide explains how to configure a Dahua device to upload event snapshots to GC Surge via FTP, covering storage path configuration and FTP server connection settings.',
  },
  {
    id: '22904851',
    title: 'Ganz FTP',
    file: 'ganz-ftp.md',
    summary: 'This guide covers configuring a Ganz AI camera to upload triggered snapshots to GC Surge via FTP, including FTP connection settings, file path token configuration, and connection testing.',
  },
  {
    id: '22249718',
    title: 'HikVision FTP',
    file: 'hikvision-ftp.md',
    summary: 'This guide walks through registering a Hikvision device via the NxGen API to obtain FTP credentials, then configuring the camera for FTP upload of motion-triggered snapshots to GC Surge.',
  },
  {
    id: '22413329',
    title: 'Vivotek IP Camera FTP',
    file: 'vivotek-ip-camera-ftp.md',
    summary: 'This guide explains how to configure a Vivotek IP camera to upload event snapshots to GC Surge via FTP, including FTP service activation, event server setup, and event rule linkage.',
  },
];

// ── HTTP helper ───────────────────────────────────────────────────────────────
function req(method, urlStr, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
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
    if (body) r.write(typeof body === 'string' ? body : JSON.stringify(body));
    r.end();
  });
}

// ── Markdown → Confluence HTML converter ──────────────────────────────────────
function mdToConfluence(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  function escape(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function inlineFormat(text) {
    // Bold+italic
    text = text.replace(/\*\*\*([\s\S]+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold
    text = text.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Images  ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      const filename = src.split('/').pop().split('\\').pop();
      // For relative paths (local images), use ri:attachment; for http URLs, use ri:url
      if (src.startsWith('http')) {
        return `<ac:image ac:height="400"><ri:url ri:value="${src}"/></ac:image>`;
      }
      return `<ac:image ac:height="400"><ri:attachment ri:filename="${escape(filename)}"/></ac:image>`;
    });
    return text;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Skip frontmatter
    if (i === 0 && line.trim() === '---') {
      i++;
      while (i < lines.length && lines[i].trim() !== '---') i++;
      i++; // skip closing ---
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h3) { out.push(`<h3>${inlineFormat(h3[1].trim())}</h3>`); i++; continue; }
    if (h2) { out.push(`<h2>${inlineFormat(h2[1].trim())}</h2>`); i++; continue; }
    if (h1) { out.push(`<h1>${inlineFormat(h1[1].trim())}</h1>`); i++; continue; }

    // Fenced code block
    if (line.match(/^```/)) {
      const lang = line.replace(/^```/, '').trim() || 'text';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join('\n');
      out.push(`<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">${escape(lang)}</ac:parameter><ac:parameter ac:name="linenumbers">false</ac:parameter><ac:plain-text-body><![CDATA[${code}]]></ac:plain-text-body></ac:structured-macro>`);
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/)) {
      out.push('<hr/>');
      i++;
      continue;
    }

    // Table
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      // Filter out separator rows (---|---)
      const dataRows = tableLines.filter(l => !l.match(/^\|[\s\-|:]+\|$/));
      if (dataRows.length > 0) {
        out.push('<table><tbody>');
        dataRows.forEach((row, idx) => {
          const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1);
          const tag = idx === 0 ? 'th' : 'td';
          out.push(`<tr>${cells.map(c => `<${tag}>${inlineFormat(c.trim())}</${tag}>`).join('')}</tr>`);
        });
        out.push('</tbody></table>');
      }
      continue;
    }

    // Unordered list
    if (line.match(/^(\s*)[*\-+] /)) {
      const listItems = [];
      const baseIndent = line.match(/^(\s*)/)[1].length;
      while (i < lines.length && lines[i].match(/^(\s*)[*\-+] /)) {
        const indent = lines[i].match(/^(\s*)/)[1].length;
        const text = lines[i].replace(/^\s*[*\-+] /, '');
        listItems.push({ indent, text });
        i++;
      }
      // Simple flat list (ignore nesting for now)
      out.push('<ul>');
      listItems.forEach(item => {
        out.push(`<li>${inlineFormat(item.text)}</li>`);
      });
      out.push('</ul>');
      continue;
    }

    // Ordered list
    if (line.match(/^\s*\d+\. /)) {
      out.push('<ol>');
      while (i < lines.length && lines[i].match(/^\s*\d+\. /)) {
        const text = lines[i].replace(/^\s*\d+\. /, '');
        out.push(`<li>${inlineFormat(text)}</li>`);
        i++;
      }
      out.push('</ol>');
      continue;
    }

    // Blockquote
    if (line.match(/^> /)) {
      const bqLines = [];
      while (i < lines.length && lines[i].match(/^> /)) {
        bqLines.push(lines[i].replace(/^> /, ''));
        i++;
      }
      out.push(`<blockquote><p>${inlineFormat(bqLines.join(' '))}</p></blockquote>`);
      continue;
    }

    // Blank line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    const paraLines = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^[#>*\-+]/) && !lines[i].match(/^\d+\. /) && !lines[i].match(/^```/) && !lines[i].includes('|')) {
      paraLines.push(lines[i]);
      i++;
    }
    out.push(`<p>${inlineFormat(paraLines.join(' '))}</p>`);
  }

  return out.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function processArticle(article) {
  const mdPath = path.join(DOCS_DIR, article.file);
  if (!fs.existsSync(mdPath)) {
    console.log(`  [skip] "${article.title}" — file not found: ${mdPath}`);
    return false;
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const body = mdToConfluence(md);

  // Prepend the H1 summary
  const fullHtml = `<h1>Summary: ${article.summary}</h1>\n${body}`;

  console.log(`  [convert] "${article.title}"`);
  console.log(`            H1: "Summary: ${article.summary.slice(0, 80)}..."`);

  if (DRY_RUN) {
    console.log('            (dry run — skipping API call)');
    return true;
  }

  // Get current version
  let currentVersion;
  try {
    const data = await req('GET', `${SITE}/wiki/rest/api/content/${article.id}?expand=version`);
    currentVersion = data.version.number;
  } catch (err) {
    console.error(`  [error] Could not fetch version for "${article.title}": ${err.message}`);
    return false;
  }

  // Update the page
  try {
    await req('PUT', `${SITE}/wiki/rest/api/content/${article.id}`, {
      version: { number: currentVersion + 1 },
      title: article.title,
      type: 'page',
      body: { storage: { value: fullHtml, representation: 'storage' } },
    });
    console.log(`  [ok]     "${article.title}" → v${currentVersion + 1}`);
    return true;
  } catch (err) {
    console.error(`  [error] Failed to update "${article.title}": ${err.message}`);
    return false;
  }
}

async function run() {
  console.log(`\n[rewrite-surge] Starting — dry run: ${DRY_RUN}\n`);
  let ok = 0, fail = 0;

  const toProcess = ONLY_PAGE
    ? ARTICLES.filter(a => a.id === ONLY_PAGE)
    : ARTICLES;

  for (const article of toProcess) {
    const success = await processArticle(article);
    if (success) ok++; else fail++;
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n── Done ───────────────────────────────────────────────`);
  console.log(`  Updated: ${ok}  Failed: ${fail}`);
  console.log(`──────────────────────────────────────────────────────\n`);
}

run().catch(err => { console.error('[fatal]', err.message); process.exit(1); });
