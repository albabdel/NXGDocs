#!/usr/bin/env node
/**
 * Generates a client-side Fuse.js search index from all content sources:
 *   - .sanity-cache/docs/ (main docs)
 *   - src/data/sanity-releases.generated.json
 *   - src/data/sanity-roadmap.generated.json
 *   - Code blocks extracted from documentation
 *
 * Output: static/search-index.json (served as a static file by Docusaurus)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');

// Import code extraction module
const {
  extractCodeBlocksFromDirectory,
  codeBlockToSearchRecord,
} = require('./extract-code-blocks');

// Determine the docs cache path.
//
// Resolution order:
//   1. SANITY_CACHE_PATH env var (set by .cfpages.yaml / CI)   → <SANITY_CACHE_PATH>/docs
//   2. PRODUCT env var (local dev builds)                       → .sanity-cache/<PRODUCT>-docs/docs
//   3. Fallback                                                  → .sanity-cache/gcxone-docs/docs
const _PRODUCT = process.env.PRODUCT || 'gcxone';
const _CACHE_BASE = process.env.SANITY_CACHE_PATH || `.sanity-cache/${_PRODUCT}-docs`;

// Only index the canonical "all" docs to avoid duplicates from role-specific copies
const DOC_SOURCES = [
  { dir: path.join(ROOT, _CACHE_BASE, 'docs'), routeBase: '/docs', section: 'Documentation' },
];

function stripMarkdown(text) {
  return text
    .replace(/^import\s+.+$/gm, '')
    .replace(/^export\s+.+$/gm, '')
    .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/?>/g, '')
    .replace(/<\/[A-Z][A-Za-z0-9]*>/g, '')
    // Keep code blocks for context but remove fences for plain text
    .replace(/```[\w]*\n?/g, '\n')
    .replace(/```/g, '')
    // Keep inline code but remove backticks
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s*/gm, '')
    .replace(/\|[^\n]+\|/g, ' ')
    .replace(/^---+$/gm, '')
    .replace(/\{[^}]+\}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function collectFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full));
    } else if (/\.(md|mdx)$/.test(entry.name) && !entry.name.startsWith('_')) {
      files.push(full);
    }
  }
  return files;
}

function fileToUrl(filePath, cacheDir, routeBase) {
  const rel = path.relative(cacheDir, filePath)
    .replace(/\.(md|mdx)$/, '')
    .replace(/\\/g, '/');
  // Remove /index suffix (index pages map to parent route)
  return routeBase + '/' + rel.replace(/\/index$/, '');
}

const records = [];

// ── 1. Documentation ────────────────────────────────────────────────────────
for (const { dir, routeBase, section } of DOC_SOURCES) {
  const files = collectFiles(dir);
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const { data: fm, content } = matter(raw);
      const plain = stripMarkdown(content);
      if (!plain.trim() && !fm.title) continue;

      const url = fileToUrl(file, dir, routeBase);
      records.push({
        id: `doc:${url}`,
        type: 'page',
        title: fm.title || path.basename(file, path.extname(file)),
        excerpt: plain.slice(0, 250).trim(),
        content: plain.slice(0, 5000),
        url,
        section,
        category: fm.sidebar_label || fm.sidebar_class || '',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
      });
    } catch {
      // skip unparseable files
    }
  }
}

// ── 2. Releases ──────────────────────────────────────────────────────────────
const releasesPath = path.join(ROOT, 'src', 'data', 'sanity-releases.generated.json');
if (fs.existsSync(releasesPath)) {
  try {
    const releases = JSON.parse(fs.readFileSync(releasesPath, 'utf8'));
    for (const release of releases) {
      const slug = release.slug?.current || release.slug || release.sprintId;
      if (!slug) continue;
      const itemsText = (release.items || [])
        .map(i => `${i.title || ''} ${i.description || ''}`)
        .join(' ');
      const fullText = [release.displayTitle, release.summary, itemsText].filter(Boolean).join(' ');
      records.push({
        id: `release:${slug}`,
        type: 'page',
        title: release.displayTitle || release.sprintId || slug,
        excerpt: (release.summary || '').slice(0, 250).trim(),
        content: fullText.slice(0, 5000),
        url: `/releases/${slug}`,
        section: 'Releases',
        category: '',
        tags: [],
      });
    }
  } catch (err) {
    console.warn('[search-index] Could not parse releases:', err.message);
  }
}

// ── 3. Roadmap ───────────────────────────────────────────────────────────────
const roadmapPath = path.join(ROOT, 'src', 'data', 'sanity-roadmap.generated.json');
if (fs.existsSync(roadmapPath)) {
  try {
    const items = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
    for (const item of items) {
      const fullText = [item.title, item.description, item.businessValue].filter(Boolean).join(' ');
      records.push({
        id: `roadmap:${item._id}`,
        type: 'page',
        title: item.title || 'Roadmap Item',
        excerpt: (item.description || '').slice(0, 250).trim(),
        content: fullText.slice(0, 5000),
        url: '/roadmap',
        section: 'Roadmap',
        category: item.status || '',
        tags: [],
      });
    }
  } catch (err) {
    console.warn('[search-index] Could not parse roadmap:', err.message);
  }
}

// ── 4. Code Blocks ────────────────────────────────────────────────────────────
for (const { dir, routeBase, section } of DOC_SOURCES) {
  if (fs.existsSync(dir)) {
    try {
      const codeBlocks = extractCodeBlocksFromDirectory(dir);
      const codeRecords = codeBlocks.map(codeBlockToSearchRecord);
      // Update section to match parent document section
      for (const record of codeRecords) {
        record.section = section;
      }
      records.push(...codeRecords);
      console.log(`[search-index] Extracted ${codeRecords.length} code blocks from ${routeBase}`);
    } catch (err) {
      console.warn('[search-index] Could not extract code blocks:', err.message);
    }
  }
}

// ── Output ───────────────────────────────────────────────────────────────────
const staticDir = path.join(ROOT, 'static');
if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir, { recursive: true });

const outputPath = path.join(staticDir, 'search-index.json');
fs.writeFileSync(outputPath, JSON.stringify(records));
console.log(`[search-index] ${records.length} records → static/search-index.json`);
