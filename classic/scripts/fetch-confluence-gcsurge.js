#!/usr/bin/env node
/**
 * Confluence Surge → Markdown pipeline for GC Surge product build.
 *
 * Fetches all pages from the Confluence "Surge" space, converts them to
 * Markdown, downloads images, and writes everything into .sanity-cache/docs/
 * (the same directory the Docusaurus build reads from). Also writes
 * classic/sidebars.ts with the correct GC Surge navigation structure.
 *
 * Env vars required (same as scripts/import-confluence-surge-config.ts):
 *   CONFLUENCE_EMAIL          e.g. abed.badarnah@nxgen.io
 *   CONFLUENCE_API_TOKEN      Atlassian personal API token
 *   CONFLUENCE_SITE_URL       https://nxgen-team-f1bs1n7p.atlassian.net
 *   CONFLUENCE_SPACE_KEY      Surge
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const url = require('url');

// ─── Paths ────────────────────────────────────────────────────────────────────
const SITE_DIR = path.join(__dirname, '..');
const CACHE_DOCS_DIR = path.join(SITE_DIR, '.sanity-cache', 'docs');
const STATIC_IMG_DIR = path.join(SITE_DIR, 'static', 'img', 'surge-docs');
const SIDEBARS_FILE = path.join(SITE_DIR, 'sidebars.ts');

// ─── Known Confluence page IDs ─────────────────────────────────────────────
const HOMEPAGE_ID = '22249648'; // "Surge" - Confluence template, skip

// Pages that belong to the top "Surge" section (General Docs category in Confluence)
const GENERAL_DOC_IDS = ['22478849', '22740993', '23232517'];

// Pages grouped by their Confluence parent
const EMAIL_PAGE_IDS = ['22052883', '22446083', '22937611', '22970379', '23101441', '23330817', '23461889', '23461896'];
const FTP_PAGE_IDS = ['22249718', '22413322', '22413329', '22904851', '23592962'];

// Sidebar positions for top-level docs (lower = first)
const TOP_LEVEL_ORDER = {
  '22478849': 1, // Overview / Device Integration Guide
  '22740993': 2, // API Integration Guide
  '23232517': 3, // Pricing Model
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[\/\\:*?"<>|]/g, '-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function fetchJson(reqUrl, authHeader) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(reqUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      headers: { Authorization: authHeader, Accept: 'application/json' },
    };
    const req = lib.get(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        }
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (e) {
          reject(new Error(`JSON parse error for ${reqUrl}: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout fetching ${reqUrl}`)); });
  });
}

function downloadFile(fileUrl, destPath, authHeader) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    function doRequest(reqUrl, redirects = 0) {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      const parsed = new url.URL(reqUrl);
      const lib = parsed.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        headers: { Authorization: authHeader },
      };
      const req = lib.get(options, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
          return doRequest(res.headers.location, redirects + 1);
        }
        if (res.statusCode >= 400) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} downloading image`));
        }
        const out = fs.createWriteStream(destPath);
        res.pipe(out);
        out.on('finish', () => resolve(destPath));
        out.on('error', reject);
      });
      req.on('error', reject);
      req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout downloading image')); });
    }

    doRequest(fileUrl);
  });
}

// ─── HTML → Markdown conversion ───────────────────────────────────────────────

function htmlToMarkdown(html, pageSlug, authHeader) {
  // We do this synchronously to keep the code simple; image downloads are
  // collected and done in parallel after conversion.
  const imageDownloads = []; // { srcUrl, localPath, mdPlaceholder, localRef }

  // Remove Confluence-specific wrapper divs / spans that add noise
  let md = html
    // Remove script/style tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove Confluence "recently-updated" macros (dynamic, useless static)
    .replace(/<div[^>]*class="recently-updated[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    // Remove Confluence hidden parameters
    .replace(/<div[^>]*class="hidden parameters"[^>]*>[\s\S]*?<\/div>/gi, '')
    // Confluence panel → admonition
    .replace(/<div[^>]*class="[^"]*confluence-information-macro-warning[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (_, body) => {
      const inner = stripTags(body).trim();
      return inner ? `\n:::warning\n\n${inner}\n\n:::\n` : '';
    })
    .replace(/<div[^>]*class="[^"]*confluence-information-macro-note[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (_, body) => {
      const inner = stripTags(body).trim();
      return inner ? `\n:::note\n\n${inner}\n\n:::\n` : '';
    })
    .replace(/<div[^>]*class="[^"]*confluence-information-macro-information[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (_, body) => {
      const inner = stripTags(body).trim();
      return inner ? `\n:::info\n\n${inner}\n\n:::\n` : '';
    })
    .replace(/<div[^>]*class="[^"]*panel[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (_, body) => {
      const inner = stripTags(body).trim();
      return inner ? `\n:::info\n\n${inner}\n\n:::\n` : '';
    });

  // ── Images ──
  // Confluence image wrapper:
  // <span class="confluence-embedded-file-wrapper ...">
  //   <img ... data-image-src="https://...atlassian.net/wiki/download/attachments/ID/file.png?..."
  //            data-linked-resource-default-alias="file.png" ...>
  // </span>
  md = md.replace(/<span[^>]*class="[^"]*confluence-embedded-file-wrapper[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, (_, inner) => {
    const srcMatch = inner.match(/data-image-src="([^"]+)"/);
    const aliasMatch = inner.match(/data-linked-resource-default-alias="([^"]+)"/);
    const altMatch = inner.match(/alt="([^"]*)"/);
    if (!srcMatch) return '';

    const srcUrl = srcMatch[1].replace(/&amp;/g, '&');
    const filename = aliasMatch ? aliasMatch[1] : path.basename(srcUrl.split('?')[0]);
    const alt = altMatch ? altMatch[1] : filename;
    const localPath = path.join(STATIC_IMG_DIR, pageSlug, filename);
    const localRef = `/img/surge-docs/${pageSlug}/${filename}`;

    imageDownloads.push({ srcUrl, localPath, authHeader });
    return `\n![${alt}](${localRef})\n`;
  });

  // ── Headings ──
  for (let i = 6; i >= 1; i--) {
    const hashes = '#'.repeat(i);
    md = md.replace(new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\/h${i}>`, 'gi'), (_, inner) => {
      return `\n${hashes} ${stripTags(inner).trim()}\n`;
    });
  }

  // ── Block elements ──
  md = md
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => `\n\`\`\`\n${decodeEntities(inner)}\n\`\`\`\n`)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => `\`${decodeEntities(stripTags(inner))}\``)
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
      return stripTags(inner).split('\n').map(l => `> ${l}`).join('\n') + '\n';
    });

  // ── Tables ──
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableBody) => {
    const rows = [];
    const rowMatches = tableBody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    for (const [, rowContent] of rowMatches) {
      const cells = [];
      const cellMatches = rowContent.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi);
      for (const [, cell] of cellMatches) {
        cells.push(stripTags(cell).replace(/\|/g, '\\|').trim());
      }
      rows.push('| ' + cells.join(' | ') + ' |');
    }
    if (rows.length === 0) return '';
    const cols = rows[0].split('|').length - 2;
    const sep = '| ' + Array(cols).fill('---').join(' | ') + ' |';
    rows.splice(1, 0, sep);
    return '\n' + rows.join('\n') + '\n';
  });

  // ── Lists ──
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, item) => `- ${stripTags(item).trim()}\n`) + '\n';
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, item) => `${++n}. ${stripTags(item).trim()}\n`) + '\n';
  });

  // ── Inline formatting ──
  md = md
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${stripTags(t).trim()}**`)
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${stripTags(t).trim()}**`)
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `*${stripTags(t).trim()}*`)
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `*${stripTags(t).trim()}*`)
    .replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, (_, t) => `<u>${stripTags(t).trim()}</u>`);

  // ── Links ──
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = stripTags(text).trim();
    const cleanHref = href.replace(/&amp;/g, '&');
    if (!cleanText) return '';
    return `[${cleanText}](${cleanHref})`;
  });

  // ── Paragraphs / line breaks ──
  md = md
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
      const text = stripTags(inner).trim();
      return text ? `\n${text}\n` : '';
    });

  // ── Strip remaining tags ──
  md = stripTags(md);

  // ── Decode HTML entities ──
  md = decodeEntities(md);

  // ── Clean up whitespace ──
  md = md
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();

  return { markdown: md, imageDownloads };
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// ─── Sidebar generator ────────────────────────────────────────────────────────

function buildSidebarsTs(pages) {
  // pages: array of { id, slug, docId, category }
  // category: 'general' | 'email' | 'ftp'

  const generalPages = pages
    .filter(p => p.category === 'general')
    .sort((a, b) => (TOP_LEVEL_ORDER[a.id] || 99) - (TOP_LEVEL_ORDER[b.id] || 99));

  const emailPages = pages.filter(p => p.category === 'email');
  const ftpPages = pages.filter(p => p.category === 'ftp');

  const toDocEntry = (p) => `      { type: 'doc', id: '${p.docId}', label: '${p.title.replace(/'/g, "\\'")}' },`;

  const generalEntries = generalPages.map(toDocEntry).join('\n');
  const emailEntries = emailPages.map(toDocEntry).join('\n');
  const ftpEntries = ftpPages.map(toDocEntry).join('\n');

  return `/**
 * Auto-generated sidebar configuration from Confluence Surge space.
 * Generated by classic/scripts/fetch-confluence-gcsurge.js
 * DO NOT EDIT MANUALLY - changes will be overwritten on next build.
 */
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  sanityDocsSidebar: [
${generalEntries}
    {
      type: 'category',
      label: 'Device Integrations',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Email (SMTP)',
          collapsible: true,
          collapsed: true,
          items: [
${emailEntries}
          ],
        },
        {
          type: 'category',
          label: 'FTP',
          collapsible: true,
          collapsed: true,
          items: [
${ftpEntries}
          ],
        },
      ],
    },
  ],
};

export default sidebars;
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const email = process.env.CONFLUENCE_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN;
  const siteUrl = (process.env.CONFLUENCE_SITE_URL || 'https://nxgen-team-f1bs1n7p.atlassian.net').replace(/\/$/, '');
  const spaceKey = process.env.CONFLUENCE_SPACE_KEY || 'Surge';

  if (!email || !token) {
    console.error('[confluence-gcsurge] Missing CONFLUENCE_EMAIL or CONFLUENCE_API_TOKEN');
    console.error('  Set these env vars to fetch GC Surge content from Confluence.');
    // Write placeholder so build doesn't fail
    fs.mkdirSync(CACHE_DOCS_DIR, { recursive: true });
    const placeholder = '---\ntitle: "GC Surge Documentation"\nhide_table_of_contents: true\ndraft: true\n---\n\nContent coming soon.\n';
    fs.writeFileSync(path.join(CACHE_DOCS_DIR, '_placeholder.mdx'), placeholder, 'utf8');
    const emptySidebar = `import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';\nconst sidebars: SidebarsConfig = { sanityDocsSidebar: [] };\nexport default sidebars;\n`;
    fs.writeFileSync(SIDEBARS_FILE, emptySidebar, 'utf8');
    return;
  }

  const authHeader = 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');

  console.log('[confluence-gcsurge] Fetching pages from Confluence Surge space...');
  console.log(`[confluence-gcsurge] Site: ${siteUrl}, Space: ${spaceKey}`);

  // Fetch all pages with rendered HTML body and ancestors
  const listUrl = `${siteUrl}/wiki/rest/api/space/${spaceKey}/content?limit=100&expand=body.view,ancestors`;
  let allPages;
  try {
    const data = await fetchJson(listUrl, authHeader);
    allPages = (data.page || data).results || [];
  } catch (err) {
    console.error('[confluence-gcsurge] Failed to fetch page list:', err.message);
    throw err;
  }
  console.log(`[confluence-gcsurge] Found ${allPages.length} pages`);

  // Prepare output dirs
  fs.rmSync(CACHE_DOCS_DIR, { recursive: true, force: true });
  fs.mkdirSync(CACHE_DOCS_DIR, { recursive: true });
  fs.mkdirSync(STATIC_IMG_DIR, { recursive: true });

  const processedPages = [];
  const allImageDownloads = [];

  for (const page of allPages) {
    const pageId = page.id;

    // Skip the Confluence homepage (it's a boilerplate template)
    if (pageId === HOMEPAGE_ID) {
      console.log(`[confluence-gcsurge] Skipping homepage: ${page.title}`);
      continue;
    }

    // Determine category from ancestors
    const ancestorTitles = (page.ancestors || []).map(a => a.title.toLowerCase());
    let category = 'general';
    if (ancestorTitles.includes('email') || EMAIL_PAGE_IDS.includes(pageId)) category = 'email';
    else if (ancestorTitles.includes('ftp') || FTP_PAGE_IDS.includes(pageId)) category = 'ftp';

    const pageSlug = slugify(page.title);
    const docId = pageSlug;
    const html = (page.body && page.body.view && page.body.view.value) || '';

    console.log(`[confluence-gcsurge] Converting: ${page.title} (${pageId}, ${category})`);

    const { markdown, imageDownloads } = htmlToMarkdown(html, pageSlug, authHeader);

    // Queue image downloads
    imageDownloads.forEach(d => allImageDownloads.push(d));

    // Sidebar position
    const sidebarPosition = TOP_LEVEL_ORDER[pageId] || 10;

    // Build frontmatter
    const frontmatter = [
      '---',
      `title: "${page.title.replace(/"/g, '\\"')}"`,
      `sidebar_position: ${sidebarPosition}`,
      '---',
      '',
    ].join('\n');

    const content = frontmatter + '\n' + markdown + '\n';
    const filePath = path.join(CACHE_DOCS_DIR, `${pageSlug}.md`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[confluence-gcsurge]   Wrote -> docs/${pageSlug}.md`);

    processedPages.push({ id: pageId, slug: pageSlug, docId, title: page.title, category });
  }

  // Ensure cache dir has at least something (Docusaurus plugin crashes on empty dir)
  if (fs.readdirSync(CACHE_DOCS_DIR).length === 0) {
    const placeholder = '---\ntitle: "GC Surge Documentation"\nhide_table_of_contents: true\ndraft: true\n---\n\nContent coming soon.\n';
    fs.writeFileSync(path.join(CACHE_DOCS_DIR, '_placeholder.mdx'), placeholder, 'utf8');
  }

  // Download all images in parallel (best-effort; don't fail build on missing images)
  if (allImageDownloads.length > 0) {
    console.log(`[confluence-gcsurge] Downloading ${allImageDownloads.length} image(s)...`);
    await Promise.all(
      allImageDownloads.map(async ({ srcUrl, localPath, authHeader: auth }) => {
        try {
          await downloadFile(srcUrl, localPath, auth);
          console.log(`[confluence-gcsurge]   Downloaded -> ${path.relative(SITE_DIR, localPath)}`);
        } catch (err) {
          console.warn(`[confluence-gcsurge]   Warning: Failed to download image ${srcUrl}: ${err.message}`);
        }
      })
    );
  }

  // Write sidebars.ts
  const sidebarContent = buildSidebarsTs(processedPages);
  fs.writeFileSync(SIDEBARS_FILE, sidebarContent, 'utf8');
  console.log('[confluence-gcsurge] Wrote sidebars.ts');

  console.log(`[confluence-gcsurge] Done — ${processedPages.length} pages converted.`);
  console.log(`[confluence-gcsurge]   General: ${processedPages.filter(p => p.category === 'general').length}`);
  console.log(`[confluence-gcsurge]   Email:   ${processedPages.filter(p => p.category === 'email').length}`);
  console.log(`[confluence-gcsurge]   FTP:     ${processedPages.filter(p => p.category === 'ftp').length}`);
}

module.exports = { run };

if (require.main === module) {
  run().catch(err => {
    console.error('[confluence-gcsurge] Fatal:', err.message);
    process.exit(1);
  });
}
