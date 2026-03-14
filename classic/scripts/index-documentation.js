/**
 * ALGOLIA DOCUMENTATION INDEXER — Sanity Edition
 * ================================================
 * Indexes all content from the Sanity content pipeline into Algolia.
 *
 * Content sources:
 *   .sanity-cache/docs/              → /docs/      (all audiences)
 *   .sanity-cache/docs-admin/        → /role-admin/
 *   .sanity-cache/docs-manager/      → /manager/
 *   .sanity-cache/docs-operator/     → /operator/
 *   .sanity-cache/docs-operator-minimal/ → /operator-minimal/
 *   .sanity-cache/docs-internal/     → /internal/
 *   src/data/sanity-releases.generated.json → /releases/
 *
 * Run AFTER `npm run sanity:pull` so that .sanity-cache/ is populated.
 *
 * Usage:
 *   ALGOLIA_ADMIN_KEY=<your-admin-key> npm run index:algolia
 *
 * Admin API key: https://www.algolia.com/account/api-keys
 * (Only the Admin key has write access — never expose it in frontend code)
 */

'use strict';

const algoliasearch = require('algoliasearch');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ─── Credentials ─────────────────────────────────────────────────────────────

const ALGOLIA_APP_ID    = process.env.ALGOLIA_APP_ID    || '0QV3FAFAD5';
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || '';
const INDEX_NAME        = process.env.ALGOLIA_INDEX_NAME || 'NXG Docs';
const SITE_URL          = process.env.SITE_URL           || 'https://docs.nxgen.cloud';

if (!ALGOLIA_ADMIN_KEY) {
  console.error('\n❌  ALGOLIA_ADMIN_KEY is not set.');
  console.error('    Get it from: https://www.algolia.com/account/api-keys');
  console.error('    Then run: ALGOLIA_ADMIN_KEY=<key> npm run index:algolia\n');
  process.exit(1);
}

// ─── Sanity content paths ─────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');

const CACHE_DIRS = [
  { dir: '.sanity-cache/docs',                  routeBase: '/docs',             section: 'Documentation' },
  { dir: '.sanity-cache/docs-admin',            routeBase: '/role-admin',       section: 'Admin Guide' },
  { dir: '.sanity-cache/docs-manager',          routeBase: '/manager',          section: 'Manager Guide' },
  { dir: '.sanity-cache/docs-operator',         routeBase: '/operator',         section: 'Operator Guide' },
  { dir: '.sanity-cache/docs-operator-minimal', routeBase: '/operator-minimal', section: 'Quick-Start Guide' },
  { dir: '.sanity-cache/docs-internal',         routeBase: '/internal',         section: 'Internal Knowledge Base' },
];

const RELEASES_FILE = path.join(ROOT, 'src/data/sanity-releases.generated.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip markdown syntax — returns plain searchable text */
function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')            // fenced code blocks
    .replace(/`[^`]+`/g, '')                    // inline code
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')  // images (keep alt)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // links (keep text)
    .replace(/^#{1,6}\s+/gm, '')               // headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2')        // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')           // italic
    .replace(/^>\s+/gm, '')                    // blockquotes
    .replace(/^[-*+]\s+/gm, '')               // list bullets
    .replace(/^\d+\.\s+/gm, '')               // ordered lists
    .replace(/^---+$/gm, '')                   // HR
    .replace(/<[^>]*>/g, '')                   // HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

/** Split text into chunks ≤ maxLen chars, trying to break at sentence boundaries */
function chunkText(text, maxLen = 5000) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLen;
    if (end < text.length) {
      const boundary = text.lastIndexOf('. ', end);
      if (boundary > start + maxLen / 2) end = boundary + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}

/** Recurse a directory, returning all .md / .mdx file paths */
function collectMarkdownFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      collectMarkdownFiles(full, results);
    } else if (/\.(md|mdx)$/i.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

/** Convert a cache-dir-relative file path to a URL path */
function fileToUrlPath(filePath, cacheDir, routeBase) {
  const rel = path.relative(cacheDir, filePath)
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/i, '');
  return rel ? `${routeBase}/${rel}` : routeBase;
}

// ─── Indexing logic ───────────────────────────────────────────────────────────

/** Build Algolia records from a single markdown file */
function processMarkdownFile(filePath, cacheDir, routeBase, section) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return [];
  }

  const { data: fm, content: md } = matter(raw);

  const h1    = md.match(/^#\s+(.+)$/m);
  const title = fm.title || (h1 ? h1[1].trim() : path.basename(filePath, path.extname(filePath)));

  const text   = stripMarkdown(md);
  const url    = SITE_URL + fileToUrlPath(filePath, cacheDir, routeBase);
  const baseId = fileToUrlPath(filePath, cacheDir, routeBase).replace(/\//g, '-').replace(/^-/, '');

  const chunks = chunkText(text);
  return chunks.map((chunk, i) => ({
    objectID: chunks.length === 1 ? baseId : `${baseId}--${i}`,
    type: 'content',
    url,
    url_without_anchor: url,
    content: chunk,
    hierarchy: {
      lvl0: section,
      lvl1: title,
      lvl2: fm.category || null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    weight: {
      pageRank: i === 0 ? 1 : 0,
      level: 70,
      position: i,
    },
  }));
}

/** Build Algolia records from the Sanity releases JSON */
function processReleasesJson() {
  if (!fs.existsSync(RELEASES_FILE)) {
    console.log('  ⚠  sanity-releases.generated.json not found — skipping releases');
    return [];
  }

  let releases;
  try {
    releases = JSON.parse(fs.readFileSync(RELEASES_FILE, 'utf-8'));
  } catch (e) {
    console.warn(`  ⚠  Could not parse releases JSON: ${e.message}`);
    return [];
  }

  if (!Array.isArray(releases)) return [];

  const records = [];
  for (const release of releases) {
    const slug = release.slug?.current || release.slug;
    if (!slug) continue;

    const title     = release.displayTitle || release.title || slug;
    const summary   = release.summary || '';
    const itemsText = Array.isArray(release.items)
      ? release.items.map(i => `${i.title || ''} ${i.description || ''}`).join(' ')
      : '';
    const content = stripMarkdown([summary, itemsText].filter(Boolean).join(' '));
    const url     = `${SITE_URL}/releases/${slug}`;

    if (!content && !title) continue;

    records.push({
      objectID: `release-${slug}`,
      type: 'content',
      url,
      url_without_anchor: url,
      content: content.slice(0, 5000),
      hierarchy: {
        lvl0: 'Releases',
        lvl1: title,
        lvl2: release.sprintId || null,
        lvl3: null,
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
      weight: {
        pageRank: 2,
        level: 80,
        position: 0,
      },
    });
  }
  return records;
}

// ─── Algolia index settings ────────────────────────────────────────────────────

const INDEX_SETTINGS = {
  searchableAttributes: [
    'unordered(hierarchy.lvl0)',
    'unordered(hierarchy.lvl1)',
    'unordered(hierarchy.lvl2)',
    'unordered(hierarchy.lvl3)',
    'unordered(hierarchy.lvl4)',
    'unordered(hierarchy.lvl5)',
    'unordered(hierarchy.lvl6)',
    'content',
  ],
  attributesToRetrieve: [
    'hierarchy',
    'content',
    'anchor',
    'url',
    'url_without_anchor',
    'type',
  ],
  attributesToHighlight: ['hierarchy', 'content'],
  attributesToSnippet: ['content:20'],
  attributesForFaceting: ['searchable(hierarchy.lvl0)'],
  customRanking: ['desc(weight.pageRank)', 'desc(weight.level)'],
  distinct: true,
  attributeForDistinct: 'url_without_anchor',
  allowTyposOnNumericTokens: false,
  ignorePlurals: ['en'],
  advancedSyntax: true,
  attributeCriteriaComputedByMinProximity: true,
  removeWordsIfNoResults: 'allOptional',
  hitsPerPage: 20,
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  NXGEN ALGOLIA INDEXER — Sanity Edition');
  console.log('═'.repeat(60));
  console.log(`  App ID     : ${ALGOLIA_APP_ID}`);
  console.log(`  Index      : ${INDEX_NAME}`);
  console.log(`  Site URL   : ${SITE_URL}`);
  console.log('═'.repeat(60) + '\n');

  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  const index  = client.initIndex(INDEX_NAME);

  const allRecords = [];

  // ── Markdown docs from Sanity cache ─────────────────────────────────────────
  for (const { dir, routeBase, section } of CACHE_DIRS) {
    const absDir = path.join(ROOT, dir);
    const files  = collectMarkdownFiles(absDir);

    if (files.length === 0) {
      console.log(`  ⚠  ${dir} — empty (run: npm run sanity:pull)`);
      continue;
    }

    console.log(`  📂  ${dir} — ${files.length} files → ${section}`);
    for (const f of files) {
      const records = processMarkdownFile(f, absDir, routeBase, section);
      allRecords.push(...records);
    }
  }

  // ── Releases from Sanity JSON ────────────────────────────────────────────────
  console.log('\n  📋  Processing releases...');
  const releaseRecords = processReleasesJson();
  allRecords.push(...releaseRecords);
  console.log(`       → ${releaseRecords.length} release records`);

  console.log(`\n  Total records to upload: ${allRecords.length}\n`);

  if (allRecords.length === 0) {
    console.error('  ❌  Nothing to index. Run `npm run sanity:pull` first.\n');
    process.exit(1);
  }

  // ── Clear stale records & upload ─────────────────────────────────────────────
  console.log('  🚀  Uploading to Algolia (replaceAllObjects)...');
  await index.replaceAllObjects(allRecords, { safe: true });

  // ── Apply index settings ─────────────────────────────────────────────────────
  console.log('  ⚙   Applying index settings...');
  await index.setSettings(INDEX_SETTINGS);

  console.log('\n' + '═'.repeat(60));
  console.log('  ✨  INDEXING COMPLETE');
  console.log('═'.repeat(60));
  console.log(`  Records   : ${allRecords.length}`);
  console.log(`  Dashboard : https://www.algolia.com/apps/${ALGOLIA_APP_ID}/explorer/browse/${INDEX_NAME}`);
  console.log('═'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('\n❌  Indexing failed:', err.message);
  process.exit(1);
});
