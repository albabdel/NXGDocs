#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { createClient } = require('@sanity/client');
const { htmlToBlocks } = require('@sanity/block-tools');
const { JSDOM } = require('jsdom');
const { Schema } = require('@sanity/schema');

const SITE_DIR = path.join(__dirname, '..');
const BACKUP_ROOT = path.join(SITE_DIR, '.sanity-backups');
const HISTORY_ROOT = path.join(SITE_DIR, '.sanity-version-history');

const SOURCE_DIRS = [
  { dir: 'docs', audience: 'all' },
  { dir: 'docs-admin', audience: 'admin' },
  { dir: 'docs-manager', audience: 'manager' },
  { dir: 'docs-operator', audience: 'operator' },
  { dir: 'docs-operator-minimal', audience: 'operator-minimal' },
  { dir: 'docs-internal', audience: 'internal' },
];

const defaultSchema = Schema.compile({
  name: 'syncSchema',
  types: [
    {
      name: 'body',
      type: 'object',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }, { type: 'code' }],
        },
      ],
    },
  ],
});

const blockContentType = defaultSchema.get('body').fields.find((field) => field.name === 'body').type;

function parseArgs(argv) {
  const flags = new Set(argv || []);
  return {
    apply: flags.has('--apply'),
    includeNoFrontmatter: flags.has('--include-no-frontmatter'),
    force: flags.has('--force'),
  };
}

function formatRunId(date) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function sha256(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function sanitizeSlugForPath(slug) {
  const normalized = String(slug || '').trim().replace(/\\/g, '/');
  if (!normalized) return null;
  const segments = normalized
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .map((segment) => {
      const safe = segment.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+|-+$/g, '');
      return safe || 'untitled';
    });
  return segments.length > 0 ? segments.join('/') : null;
}

function deterministicDocId(type, slug) {
  return `${type}.${slug.replace(/\//g, '--').replace(/[^a-zA-Z0-9._-]/g, '-')}`;
}

function walkMarkdownFiles(dirPath, fileList = []) {
  if (!fs.existsSync(dirPath)) return fileList;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.gitkeep' || entry.name === '.DS_Store') continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, fileList);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.md') && !entry.name.endsWith('.mdx')) continue;
    fileList.push(fullPath);
  }
  return fileList;
}

function isFrontmatterFile(raw) {
  return String(raw || '').trimStart().startsWith('---');
}

function inferTypeFromSlug(slug, frontmatterType) {
  if (frontmatterType && ['doc', 'article', 'releaseNote', 'referencePage'].includes(frontmatterType)) {
    return frontmatterType;
  }
  if (slug.startsWith('articles/')) return 'article';
  if (slug.startsWith('releases/')) return 'releaseNote';
  if (slug.startsWith('release-notes/')) return 'releaseNote';
  if (slug.startsWith('knowledge-base/glossary/')) return 'referencePage';
  if (slug.startsWith('reference/')) return 'referencePage';
  return 'doc';
}

function parseStringList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeDate(value) {
  if (!value) return null;
  const str = String(value).trim();
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function markdownToPortableText(markdown) {
  const stripped = String(markdown || '')
    .replace(/^import .+$/gm, '')
    .replace(/^export .+$/gm, '')
    .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, '')
    .trim();

  if (!stripped) return [];

  try {
    const html = marked.parse(stripped);
    const blocks = htmlToBlocks(html, blockContentType, {
      parseHtml: (htmlContent) => new JSDOM(htmlContent).window.document,
    });
    if (Array.isArray(blocks) && blocks.length > 0) return blocks;
  } catch {
    // Fall back to a plain paragraph block below.
  }

  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text: stripped,
          marks: [],
        },
      ],
    },
  ];
}

function loadSourceEntries(options) {
  const records = new Map();
  const conflictedKeys = new Set();
  const warnings = [];
  const counters = {
    scannedFiles: 0,
    skippedNoFrontmatter: 0,
    skippedInvalidSlug: 0,
    skippedConflicts: 0,
    deduplicated: 0,
  };

  for (const source of SOURCE_DIRS) {
    const sourceDirPath = path.join(SITE_DIR, source.dir);
    const files = walkMarkdownFiles(sourceDirPath);
    counters.scannedFiles += files.length;

    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, 'utf8');
      if (!options.includeNoFrontmatter && !isFrontmatterFile(raw)) {
        counters.skippedNoFrontmatter += 1;
        continue;
      }

      const parsed = matter(raw);
      const relativePath = path.relative(sourceDirPath, filePath).replace(/\\/g, '/');
      const slugBase = relativePath
        .replace(/\.mdx?$/i, '')
        .replace(/\/index$/i, '')
        .toLowerCase();
      const safeSlug = sanitizeSlugForPath(slugBase);
      if (!safeSlug) {
        counters.skippedInvalidSlug += 1;
        warnings.push(`Skipped invalid slug from ${path.relative(SITE_DIR, filePath).replace(/\\/g, '/')}`);
        continue;
      }

      const frontmatter = parsed.data || {};
      const type = inferTypeFromSlug(safeSlug, frontmatter.sanityType);
      const key = `${type}:${safeSlug}`;
      const sourcePath = path.relative(SITE_DIR, filePath).replace(/\\/g, '/');
      const content = String(parsed.content || '').trim();
      const sourceFingerprint = sha256(
        JSON.stringify({
          sourcePath,
          frontmatter,
          content,
          type,
          slug: safeSlug,
        })
      );

      const audiences = new Set(
        type === 'doc'
          ? [...parseStringList(frontmatter.targetAudience), source.audience].filter(Boolean)
          : []
      );

      if (conflictedKeys.has(key)) {
        counters.skippedConflicts += 1;
        continue;
      }

      if (records.has(key)) {
        counters.deduplicated += 1;
        const existing = records.get(key);
        for (const audience of audiences) existing.audiences.add(audience);
        if (existing.content !== content) {
          warnings.push(
            `Conflicting duplicate slug detected for ${key}; skipped both ${existing.sourcePath} and ${sourcePath}`
          );
          conflictedKeys.add(key);
          records.delete(key);
          counters.skippedConflicts += 2;
          continue;
        }
        continue;
      }

      records.set(key, {
        type,
        slug: safeSlug,
        sourcePath,
        frontmatter,
        content,
        sourceFingerprint,
        audiences,
      });
    }
  }

  return {
    entries: Array.from(records.values()),
    counters,
    warnings,
  };
}

function buildSanityDocument(entry, runStartedAt) {
  const fm = entry.frontmatter || {};
  const title = String(fm.title || entry.slug.split('/').pop().replace(/-/g, ' ')).trim() || entry.slug;
  const description = fm.description ? String(fm.description) : undefined;
  const body = markdownToPortableText(entry.content);
  const status = String(fm.status || 'draft');
  const tags = parseStringList(fm.tags);

  const doc = {
    _type: entry.type,
    title,
    slug: {
      _type: 'slug',
      current: entry.slug,
    },
    body,
    status,
    syncSourceHash: entry.sourceFingerprint,
    syncSourcePath: entry.sourcePath,
    syncSourceMode: 'local-to-sanity',
    syncUpdatedAt: runStartedAt.toISOString(),
  };

  if (description) doc.description = description;
  if (tags.length > 0) doc.tags = tags;

  if (entry.type === 'doc') {
    const sidebarPosition = Number.isFinite(Number(fm.sidebar_position))
      ? Number(fm.sidebar_position)
      : Number.isFinite(Number(fm.sidebarPosition))
      ? Number(fm.sidebarPosition)
      : undefined;
    if (sidebarPosition != null) doc.sidebarPosition = sidebarPosition;
    if (fm.sidebar_label) doc.sidebarLabel = String(fm.sidebar_label);
    if (fm.sidebarLabel) doc.sidebarLabel = String(fm.sidebarLabel);
    if (fm.category) doc.category = String(fm.category);
    if (fm.hide_from_sidebar === true || fm.hideFromSidebar === true) doc.hideFromSidebar = true;
    const lastUpdated = sanitizeDate(fm.last_update?.date || fm.lastUpdated);
    if (lastUpdated) doc.lastUpdated = lastUpdated;
    if (fm.reviewedBy) doc.reviewedBy = String(fm.reviewedBy);

    const audiences = Array.from(entry.audiences);
    doc.targetAudience = audiences.length > 0 ? audiences : ['all'];
  } else if (entry.type === 'article') {
    if (fm.author) doc.author = String(fm.author);
    if (fm.featured === true) doc.featured = true;
    const publishedAt = sanitizeDate(fm.date || fm.publishedAt);
    if (publishedAt) doc.publishedAt = publishedAt;
  } else if (entry.type === 'releaseNote') {
    if (fm.version) doc.version = String(fm.version);
    if (fm.sprintId) doc.sprintId = String(fm.sprintId);
    const publishedAt = sanitizeDate(fm.date || fm.publishedAt);
    if (publishedAt) doc.publishedAt = publishedAt;
    const changeType = parseStringList(fm.changeType);
    const affectedAreas = parseStringList(fm.affectedAreas);
    if (changeType.length > 0) doc.changeType = changeType;
    if (affectedAreas.length > 0) doc.affectedAreas = affectedAreas;
  } else if (entry.type === 'referencePage') {
    if (fm.apiVersion) doc.apiVersion = String(fm.apiVersion);
  }

  return doc;
}

function writeBackupFile(runId, type, slug, existingDoc) {
  const backupPath = path.join(
    BACKUP_ROOT,
    `push-${runId}`,
    'before',
    type,
    `${slug.replace(/\//g, '__')}.json`
  );
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, JSON.stringify(existingDoc, null, 2), 'utf8');
  return path.relative(SITE_DIR, backupPath).replace(/\\/g, '/');
}

function writeLocalRunSnapshot(runId, payload) {
  fs.mkdirSync(HISTORY_ROOT, { recursive: true });
  const runPath = path.join(HISTORY_ROOT, `push-${runId}.json`);
  const latestPath = path.join(HISTORY_ROOT, 'push-latest.json');
  fs.writeFileSync(runPath, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(latestPath, JSON.stringify(payload, null, 2), 'utf8');
  return path.relative(SITE_DIR, runPath).replace(/\\/g, '/');
}

async function writeRunLogToSanity(client, runSummary, warnings) {
  const sampleEntries = runSummary.entries.slice(0, 300).map((entry) => ({
    _key: sha256(`${entry.type}:${entry.slug}:${entry.action}`).slice(0, 16),
    type: entry.type,
    slug: entry.slug,
    action: entry.action,
    sourcePath: entry.sourcePath,
    docId: entry.docId || null,
    beforeRev: entry.beforeRev || null,
    afterRev: entry.afterRev || null,
  }));

  const doc = {
    _id: `sanitySyncRun.${runSummary.runId}`,
    _type: 'sanitySyncRun',
    runId: runSummary.runId,
    mode: runSummary.mode,
    source: 'classic/scripts/sync-local-to-sanity.js',
    startedAt: runSummary.startedAt,
    finishedAt: runSummary.finishedAt,
    projectId: runSummary.projectId,
    dataset: runSummary.dataset,
    gitHead: runSummary.gitHead || null,
    summary: runSummary.summary,
    warningCount: warnings.length,
    warnings: warnings.slice(0, 200),
    entryCount: runSummary.entries.length,
    entries: sampleEntries,
  };

  await client.createOrReplace(doc);
  return doc._id;
}

async function run(options = {}) {
  const args = {
    apply: !!options.apply,
    includeNoFrontmatter: !!options.includeNoFrontmatter,
    force: !!options.force,
  };

  const projectId = process.env.SANITY_PROJECT_ID || 'fjjuacab';
  const dataset = process.env.SANITY_DATASET || 'production';
  const apiToken = process.env.SANITY_API_TOKEN;
  const runStartedAt = new Date();
  const runId = formatRunId(runStartedAt);

  if (!apiToken) {
    throw new Error('[sanity-sync] Missing SANITY_API_TOKEN env var');
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  });

  const { entries, counters, warnings } = loadSourceEntries(args);
  const summary = {
    scannedFiles: counters.scannedFiles,
    skippedNoFrontmatter: counters.skippedNoFrontmatter,
    skippedInvalidSlug: counters.skippedInvalidSlug,
    skippedConflicts: counters.skippedConflicts,
    deduplicated: counters.deduplicated,
    discoveredEntries: entries.length,
    unchanged: 0,
    plannedCreates: 0,
    plannedUpdates: 0,
    created: 0,
    updated: 0,
    failed: 0,
    backupFiles: 0,
  };

  const entryResults = [];

  for (const entry of entries) {
    const docPayload = buildSanityDocument(entry, runStartedAt);
    let existing = null;
    try {
      existing = await client.fetch(`*[_type == $type && slug.current == $slug][0]`, {
        type: entry.type,
        slug: entry.slug,
      });
    } catch (err) {
      summary.failed += 1;
      warnings.push(`Lookup failed for ${entry.type}:${entry.slug}: ${err.message}`);
      entryResults.push({
        type: entry.type,
        slug: entry.slug,
        sourcePath: entry.sourcePath,
        action: 'failed',
        error: err.message,
      });
      continue;
    }

    const sameFingerprint =
      !args.force && existing && typeof existing.syncSourceHash === 'string' && existing.syncSourceHash === entry.sourceFingerprint;
    if (sameFingerprint) {
      summary.unchanged += 1;
      entryResults.push({
        type: entry.type,
        slug: entry.slug,
        sourcePath: entry.sourcePath,
        action: 'unchanged',
        docId: existing._id,
        beforeRev: existing._rev,
        afterRev: existing._rev,
      });
      continue;
    }

    const action = existing ? 'update' : 'create';
    if (!args.apply) {
      if (action === 'create') summary.plannedCreates += 1;
      if (action === 'update') summary.plannedUpdates += 1;
      entryResults.push({
        type: entry.type,
        slug: entry.slug,
        sourcePath: entry.sourcePath,
        action: action === 'create' ? 'planned-create' : 'planned-update',
        docId: existing?._id || deterministicDocId(entry.type, entry.slug),
        beforeRev: existing?._rev || null,
      });
      continue;
    }

    try {
      let backupPath = null;
      if (existing) {
        backupPath = writeBackupFile(runId, entry.type, entry.slug, existing);
        summary.backupFiles += 1;
      }

      let committed;
      if (existing) {
        committed = await client.patch(existing._id).set(docPayload).commit({ autoGenerateArrayKeys: true });
        summary.updated += 1;
      } else {
        const createPayload = { _id: deterministicDocId(entry.type, entry.slug), ...docPayload };
        committed = await client.createIfNotExists(createPayload);
        summary.created += 1;
      }

      entryResults.push({
        type: entry.type,
        slug: entry.slug,
        sourcePath: entry.sourcePath,
        action,
        docId: committed?._id || existing?._id || deterministicDocId(entry.type, entry.slug),
        beforeRev: existing?._rev || null,
        afterRev: committed?._rev || null,
        backupPath,
      });
    } catch (err) {
      summary.failed += 1;
      warnings.push(`Write failed for ${entry.type}:${entry.slug}: ${err.message}`);
      entryResults.push({
        type: entry.type,
        slug: entry.slug,
        sourcePath: entry.sourcePath,
        action: 'failed',
        error: err.message,
      });
    }
  }

  const runSummary = {
    runId,
    mode: args.apply ? 'push-apply' : 'push-dry-run',
    startedAt: runStartedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    projectId,
    dataset,
    gitHead: null,
    summary,
    entries: entryResults,
    warnings,
  };

  const localSnapshotPath = writeLocalRunSnapshot(runId, runSummary);
  let sanityRunLogId = null;
  try {
    sanityRunLogId = await writeRunLogToSanity(client, runSummary, warnings);
  } catch (err) {
    warnings.push(`Failed to write run log in Sanity: ${err.message}`);
  }

  console.log(`[sanity-sync] Mode: ${runSummary.mode}`);
  console.log(
    `[sanity-sync] Files scanned=${summary.scannedFiles}, discovered entries=${summary.discoveredEntries}, unchanged=${summary.unchanged}`
  );
  if (args.apply) {
    console.log(
      `[sanity-sync] Applied: created=${summary.created}, updated=${summary.updated}, failed=${summary.failed}, backups=${summary.backupFiles}`
    );
  } else {
    console.log(
      `[sanity-sync] Planned: create=${summary.plannedCreates}, update=${summary.plannedUpdates}, failed=${summary.failed}`
    );
  }
  console.log(`[sanity-sync] Local run snapshot -> ${localSnapshotPath}`);
  if (sanityRunLogId) {
    console.log(`[sanity-sync] Sanity run log -> ${sanityRunLogId}`);
  }
  if (warnings.length > 0) {
    console.warn(`[sanity-sync] Warnings: ${warnings.length}`);
    warnings.slice(0, 5).forEach((warning, index) => {
      console.warn(`[sanity-sync]   ${index + 1}. ${warning}`);
    });
  }

  return runSummary;
}

module.exports = { run };

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  run(args).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
