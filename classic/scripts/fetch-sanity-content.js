#!/usr/bin/env node
/**
 * Pre-build Sanity content fetch.
 * Writes markdown files to .sanity-cache/ before docusaurus build starts.
 *
 * Called from build-with-memory.js. Can also be run standalone:
 *   node scripts/fetch-sanity-content.js
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function stripEmojis(text) {
  if (!text) return text;
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}]|[\u{2935}]|[\u{3030}]|[\u{3297}]|[\u{3299}]|[\u{203C}]|[\u{2049}]/gu;
  return text.replace(emojiRegex, '').replace(/[^\S\n]+/g, ' ').trim();
}

// Load .env.local if present
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

const SITE_DIR = path.join(__dirname, '..');
const CACHE_ROOT = path.join(SITE_DIR, process.env.SANITY_CACHE_PATH || '.sanity-cache');
const LANDING_PAGES_CACHE_DIR = path.join(SITE_DIR, '.sanity-landing-pages');
const LANDING_PAGES_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-landing-pages.generated.json'
);
const RELEASE_NOTES_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-release-notes.generated.json'
);
const RELEASES_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-releases.generated.json'
);
const ROADMAP_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-roadmap.generated.json'
);
const UPDATES_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-updates.generated.json'
);
const INTEGRATIONS_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-integrations.generated.json'
);
const NEWLY_ADDED_GENERATED_FILE = path.join(
  SITE_DIR,
  'src',
  'data',
  'sanity-newly-added.generated.json'
);
const BACKUP_ROOT = path.join(SITE_DIR, '.sanity-backups');
const VERSION_HISTORY_DIR = path.join(SITE_DIR, '.sanity-version-history');
const DEFAULT_BACKUP_KEEP = 10;

const ALL_CACHE_DIRS = ['docs'];

function statusFilterClause(includeDrafts) {
  if (includeDrafts) return 'defined(slug.current)';
  return 'defined(slug.current) && (!defined(status) || status == "published") && hiddenFromProduction != true';
}

function getProductFilter() {
  const PRODUCT = process.env.PRODUCT || 'gcxone';
  return `(product == "${PRODUCT}" || product == "shared")`;
}

function getLandingPageQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  const productFilter = getProductFilter();
  return `*[_type == "landingPage" && ${filter} && ${productFilter}] {
    title, slug, description, layoutType, showBackground, breadcrumbs, hero, sections, status, publishedAt, lastUpdated, product
  }`;
}

function getQueries(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  const productFilter = getProductFilter();
  return [
    {
      type: 'doc',
      query: `*[_type == "doc" && ${filter} && ${productFilter}] | order(sidebarPosition asc) {
        _id, _createdAt, title, slug, category, sidebarPosition, sidebarLabel, hideFromSidebar, body, lastUpdated, description, tags, status, reviewedBy, product,
        "categoryId": sidebarCategory->_id,
        "categorySlug": sidebarCategory->slug.current,
        "categoryTitle": sidebarCategory->title,
        "coverImageUrl": coverImage.asset->url
      }`,
    },
    {
      type: 'article',
      query: `*[_type == "article" && ${filter} && ${productFilter}] | order(publishedAt desc) {
        title, slug, tags, publishedAt, body, description, author, featured, status, product,
        "coverImageUrl": coverImage.asset->url
      }`,
    },
    {
      type: 'referencePage',
      query: `*[_type == "referencePage" && ${filter} && ${productFilter}] {
        title, slug, body, description, apiVersion, status, product
      }`,
    },
  ];
}

function formatRunId(date) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function toAssetRef(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value._ref === 'string') return value._ref;
  if (value.asset && typeof value.asset._ref === 'string') return value.asset._ref;
  return '';
}

function sanitizeSlugForPath(slug) {
  const normalized = String(slug || '').trim().replace(/\\/g, '/');
  if (!normalized) return null;

  const safeSegments = normalized
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .map((segment) => {
      const safe = segment.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+|-+$/g, '');
      return safe || 'untitled';
    });

  return safeSegments.length ? safeSegments.join('/') : null;
}

function isDirectoryNonEmpty(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory() && fs.readdirSync(dirPath).length > 0;
  } catch {
    return false;
  }
}

function isFilePresent(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function pruneBackupDirectories(keepBackups) {
  if (!fs.existsSync(BACKUP_ROOT)) return;

  const directories = fs
    .readdirSync(BACKUP_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  directories.slice(keepBackups).forEach((dirName) => {
    fs.rmSync(path.join(BACKUP_ROOT, dirName), { recursive: true, force: true });
  });
}

function createBackupSnapshot(runId, keepBackups) {
  const sources = [
    { source: CACHE_ROOT, name: 'sanity-cache', kind: 'directory' },
    { source: LANDING_PAGES_CACHE_DIR, name: 'sanity-landing-pages', kind: 'directory' },
    { source: LANDING_PAGES_GENERATED_FILE, name: 'sanity-landing-pages.generated.json', kind: 'file' },
    { source: RELEASE_NOTES_GENERATED_FILE, name: 'sanity-release-notes.generated.json', kind: 'file' },
    { source: RELEASES_GENERATED_FILE, name: 'sanity-releases.generated.json', kind: 'file' },
    { source: ROADMAP_GENERATED_FILE, name: 'sanity-roadmap.generated.json', kind: 'file' },
    { source: INTEGRATIONS_GENERATED_FILE, name: 'sanity-integrations.generated.json', kind: 'file' },
  ].filter((entry) =>
    entry.kind === 'directory' ? isDirectoryNonEmpty(entry.source) : isFilePresent(entry.source)
  );

  if (sources.length === 0) return null;

  const backupDir = path.join(BACKUP_ROOT, runId);
  fs.mkdirSync(backupDir, { recursive: true });

  for (const { source, name, kind } of sources) {
    const target = path.join(backupDir, name);
    if (kind === 'directory') {
      fs.cpSync(source, target, { recursive: true });
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(source, target);
  }

  pruneBackupDirectories(keepBackups);
  return backupDir;
}

function writeVersionSnapshot(manifest) {
  fs.mkdirSync(VERSION_HISTORY_DIR, { recursive: true });
  const runFilePath = path.join(VERSION_HISTORY_DIR, `${manifest.runId}.json`);
  const latestPath = path.join(VERSION_HISTORY_DIR, 'latest.json');

  fs.writeFileSync(runFilePath, JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(latestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return runFilePath;
}

function getGitHead() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: SITE_DIR,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function writeTrackedFile(filePath, content, tracker) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');

  const normalizedPath = path.relative(SITE_DIR, filePath).replace(/\\/g, '/');
  tracker.push({
    path: normalizedPath,
    bytes: Buffer.byteLength(content, 'utf8'),
    sha256: crypto.createHash('sha256').update(content).digest('hex'),
  });
}

function parseKeepBackups(value) {
  const parsed = Number.parseInt(value || String(DEFAULT_BACKUP_KEEP), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_BACKUP_KEEP;
  return parsed;
}

function parseBooleanEnv(value, defaultValue) {
  if (value == null || value === '') return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

function escapeYaml(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function getReleasesQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  const productFilter = getProductFilter();
  return `*[_type == "release" && ${filter} && ${productFilter}] | order(publishedAt desc) {
    _id,
    displayTitle,
    sprintId,
    slug,
    publishedAt,
    summary,
    product,
    items[] {
      _key,
      title,
      description,
      changeType,
      affectedAreas,
      "screenshotUrl": screenshot.asset->url,
      videoUrl,
      articleUrl
    }
  }`;
}

function getRoadmapQuery(includeDrafts) {
  const filter = includeDrafts ? 'true' : '!(_id in path("drafts.**"))';
  const productFilter = getProductFilter();
  return `*[_type == "roadmapItem" && ${filter} && ${productFilter}] | order(_createdAt desc) {
    _id,
    _updatedAt,
    title,
    description,
    status,
    businessValue,
    changeType,
    uiChange,
    entitiesImpacted,
    projectedRelease,
    product,
    "releaseSlug": releaseRef->slug.current
  }`;
}

function getUpdatesQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  const productFilter = getProductFilter();
  return `*[_type == "update" && ${filter} && ${productFilter}] | order(publishedAt desc) {
    _id,
    _updatedAt,
    title,
    slug,
    type,
    publishedAt,
    excerpt,
    product,
    "releaseFields": {
      "version": releaseFields.version,
      "releaseNotes": releaseFields.releaseNotes
    },
    "bugfixFields": {
      "status": bugfixFields.status,
      "severity": bugfixFields.severity
    },
    "roadmapFields": {
      "roadmapStatus": roadmapFields.roadmapStatus,
      "targetDate": roadmapFields.targetDate
    }
  }`;
}

function getDeviceIntegrationsQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  const productFilter = getProductFilter();
  return `*[_type == "deviceIntegration" && ${filter} && ${productFilter}] | order(name asc) {
    _id,
    _type,
    name,
    slug,
    manufacturer,
    brand,
    deviceType,
    gcxReady,
    status,
    description,
    product,
    cloudModeFeatures,
    localModeFeatures,
    deviceHealthFeatures,
    cameraHealthFeatures,
    timelapseFeatures,
    connectivity,
    documentation,
    notesAndIssues,
    architecture,
    "logoUrl": logo.asset->url
  }`;
}

async function run() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const apiToken = process.env.SANITY_API_TOKEN;
  const dataset = process.env.SANITY_DATASET || 'production';
  const includeDrafts = parseBooleanEnv(process.env.SANITY_INCLUDE_DRAFTS, false);
  const strictMode = parseBooleanEnv(process.env.SANITY_FETCH_STRICT, false);
  const backupEnabled = parseBooleanEnv(process.env.SANITY_ENABLE_BACKUPS, true);
  const keepBackups = parseKeepBackups(process.env.SANITY_BACKUP_KEEP);
  const runStartedAt = new Date();
  const runId = formatRunId(runStartedAt);
  const queries = getQueries(includeDrafts);
  const writtenFiles = [];
  const stats = {
    fetched: {},
    written: {
      doc: 0,
      releaseNote: 0,
      releaseNoteJson: 0,
      article: 0,
      referencePage: 0,
      landingPageJson: 0,
      placeholders: 0,
      release: 0,
      roadmapItem: 0,
      deviceIntegration: 0,
    },
    warnings: 0,
  };

  if (!projectId) {
    throw new Error('[sanity-content] Missing SANITY_PROJECT_ID env var');
  }
  if (!apiToken) {
    throw new Error('[sanity-content] Missing SANITY_API_TOKEN env var');
  }

  let backupDir = null;
  if (backupEnabled) {
    backupDir = createBackupSnapshot(runId, keepBackups);
    if (backupDir) {
      console.log(`[sanity-content] Backup created -> ${path.relative(SITE_DIR, backupDir).replace(/\\/g, '/')}`);
    }
  }

  // Prune stale generated files before writing the latest snapshot.
  fs.rmSync(CACHE_ROOT, { recursive: true, force: true });
  fs.rmSync(LANDING_PAGES_CACHE_DIR, { recursive: true, force: true });
  fs.mkdirSync(CACHE_ROOT, { recursive: true });
  fs.mkdirSync(LANDING_PAGES_CACHE_DIR, { recursive: true });
  for (const dir of ALL_CACHE_DIRS) {
    fs.mkdirSync(path.join(CACHE_ROOT, dir), { recursive: true });
  }

  const { createClient } = require('@sanity/client');
  const { portableTextToMarkdown } = require('@portabletext/markdown');
  const { createImageUrlBuilder } = require('@sanity/image-url');

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    perspective: includeDrafts ? 'drafts' : 'published',
    token: apiToken,
  });

  console.log(
    `[sanity-content] Fetch mode: ${includeDrafts ? 'drafts (includes drafts)' : 'published-only'}`
  );
  const PRODUCT = process.env.PRODUCT || 'gcxone';
  console.log(`[sanity-content] Product filter: ${PRODUCT} (includes shared)`);

  const builder = createImageUrlBuilder(client);

  async function writeRunLogToSanity(manifest) {
    const syncLogEnabled = String(process.env.SANITY_SYNC_LOG_TO_DATASET || 'true').toLowerCase() !== 'false';
    if (!syncLogEnabled) return;

    const sampleLimitRaw = Number.parseInt(process.env.SANITY_SYNC_LOG_FILE_SAMPLE || '200', 10);
    const sampleLimit = Number.isFinite(sampleLimitRaw) && sampleLimitRaw > 0 ? sampleLimitRaw : 200;
    const sampleFiles = manifest.files.slice(0, sampleLimit).map((file) => ({
      path: file.path,
      bytes: file.bytes,
      sha256: file.sha256,
    }));
    const filesDigest = crypto
      .createHash('sha256')
      .update(
        JSON.stringify(
          manifest.files.map((file) => ({
            path: file.path,
            bytes: file.bytes,
            sha256: file.sha256,
          }))
        ),
        'utf8'
      )
      .digest('hex');

    const logDoc = {
      _id: `sanitySyncRun.${manifest.runId}`,
      _type: 'sanitySyncRun',
      runId: manifest.runId,
      mode: 'pull',
      source: 'classic/scripts/fetch-sanity-content.js',
      startedAt: manifest.startedAt,
      finishedAt: manifest.finishedAt,
      gitHead: manifest.gitHead || null,
      projectId: manifest.projectId,
      dataset: manifest.dataset,
      options: manifest.mode,
      backup: manifest.backup,
      stats: manifest.stats,
      fileCount: manifest.files.length,
      filesDigest,
      fileSampleLimit: sampleLimit,
      files: sampleFiles,
    };

    try {
      await client.createOrReplace(logDoc);
      console.log(`[sanity-content] Sync log written to Sanity -> ${logDoc._id}`);
    } catch (err) {
      stats.warnings += 1;
      console.warn(`[sanity-content] Warning: Failed to write sync log to Sanity: ${err.message}`);
    }
  }

  function sanityImageUrl(imageRef) {
    try {
      return builder.image(imageRef).url();
    } catch {
      return '';
    }
  }

  function sanityFileUrl(fileRef) {
    const ref = toAssetRef(fileRef);
    if (!ref) return '';

    const match = ref.match(/^file-(.+)-([a-z0-9]+)$/i);
    if (!match) return '';

    const assetId = match[1];
    const ext = match[2];
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${ext}`;
  }

  function sanityRawImageUrl(imageRef) {
    const ref = toAssetRef(imageRef);
    if (!ref) return '';

    const match = ref.match(/^image-(.+)-\d+x\d+-([a-z0-9]+)$/i);
    if (!match) return '';

    const assetId = match[1];
    const ext = match[2];
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}.${ext}`;
  }

  // @portabletext/markdown v1 does not serialize non-"block" custom types via handlers.
  // We flush normal block runs to the library and manually serialize custom blocks.
  const markHandlers = {
    underline: ({ children }) => `<u>${children}</u>`,
    link: ({ value, children }) => {
      const href = value?.href || '';
      const target = value?.blank ? ' target="_blank" rel="noopener noreferrer"' : '';
      return target ? `<a href="${href}"${target}>${children}</a>` : `[${children}](${href})`;
    },
    internalLink: ({ value, children }) => {
      const slug = value?.reference?.slug?.current || '#';
      return `[${children}](/${slug})`;
    },
    footnote: ({ value, children }) => `${children}[^${value?._key?.slice(0, 5) || 'fn'}]`,
  };

  function serializeCustomBlock(block) {
    const type = block?._type;

    if (type === 'image') {
      const assetRef = toAssetRef(block.asset);
      const isGif = block.isGif === true || /-gif$/i.test(assetRef);
      const gifUrl = assetRef ? (sanityRawImageUrl(assetRef) || sanityImageUrl(block)) : '';
      const url = assetRef ? (isGif ? gifUrl : sanityImageUrl(block)) : '';
      const alt = block.alt || '';
      const caption = block.caption ? ` "${String(block.caption).replace(/"/g, '\\"')}"` : '';
      const alignClass = block.alignment && block.alignment !== 'full' ? `{align="${block.alignment}"}` : '';
      if (!url) return '';

      if (isGif) {
        const gifCaptionParts = [];
        if (block.caption) gifCaptionParts.push(escapeHtml(block.caption));
        if (block.credit) gifCaptionParts.push(`Credit: ${escapeHtml(block.credit)}`);
        const gifImg = `<img src="${escapeHtmlAttr(url)}" alt="${escapeHtmlAttr(alt || 'Animated GIF')}" loading="lazy" />`;
        if (gifCaptionParts.length > 0) {
          return `<figure>\n  ${gifImg}\n  <figcaption>${gifCaptionParts.join(' | ')}</figcaption>\n</figure>\n`;
        }
        return `${gifImg}\n`;
      }

      const widthValueNormalized = String(block.width || '')
        .trim()
        .toLowerCase();
      const hasCustomWidth = Boolean(widthValueNormalized) && !['auto', 'full', '100', '100%'].includes(widthValueNormalized);
      const hasAdvancedOptions =
        hasCustomWidth ||
        Boolean(block.linkUrl) ||
        Boolean(block.title) ||
        Boolean(block.credit) ||
        Boolean(block.rounded) ||
        Boolean(block.shadow) ||
        Boolean(block.withBorder) ||
        Boolean(block.withBackground);

      if (!hasAdvancedOptions) {
        return `![${alt}](${url}${caption})${alignClass}\n`;
      }

      const styles = ['display: block;', 'max-width: 100%;', 'height: auto;'];
      const widthValue = String(block.width || '').trim();
      if (widthValue) {
        if (widthValue === 'full' || widthValue === '100' || widthValue === '100%') {
          styles.push('width: 100%;');
        } else if (widthValue !== 'auto') {
          const widthStyle = /^\d+$/.test(widthValue) ? `${widthValue}%` : widthValue;
          styles.push(`width: ${widthStyle};`);
        }
      }

      const alignment = String(block.alignment || 'full');
      if (alignment === 'left') styles.push('margin: 0 auto 0 0;');
      if (alignment === 'center') styles.push('margin: 0 auto;');
      if (alignment === 'right') styles.push('margin: 0 0 0 auto;');

      if (block.rounded) styles.push('border-radius: 12px;');
      if (block.shadow) styles.push('box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);');
      if (block.withBorder) styles.push('border: 1px solid rgba(128, 128, 128, 0.35);');
      if (block.withBackground) styles.push('background: rgba(128, 128, 128, 0.12); padding: 10px;');

      const imgTag = `<img src="${escapeHtmlAttr(url)}" alt="${escapeHtmlAttr(alt)}"${
        block.title ? ` title="${escapeHtmlAttr(block.title)}"` : ''
      } style="${styles.join(' ')}" />`;

      let visual = imgTag;
      if (block.linkUrl) {
        const target = block.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        visual = `<a href="${escapeHtmlAttr(block.linkUrl)}"${target}>${imgTag}</a>`;
      }

      const captionParts = [];
      if (block.caption) captionParts.push(escapeHtml(block.caption));
      if (block.credit) captionParts.push(`Credit: ${escapeHtml(block.credit)}`);
      if (captionParts.length > 0) {
        return `<figure>\n  ${visual}\n  <figcaption>${captionParts.join(' | ')}</figcaption>\n</figure>\n`;
      }

      return `${visual}\n`;
    }

    if (type === 'gif') {
      const gifAssetRef = toAssetRef(block?.file?.asset || block?.asset || block?.file);
      const url = sanityFileUrl(gifAssetRef) || sanityRawImageUrl(gifAssetRef);
      const alt = block.alt || 'Animated GIF';
      const caption = block.caption ? `\n*${block.caption}*` : '';
      const width = block.width || '100%';
      const align = ['left', 'center', 'right'].includes(block.alignment) ? block.alignment : 'center';
      const widthAttr = width !== '100%' ? ` width="${width}"` : '';
      if (url) {
        return `<img src="${url}" alt="${alt}"${widthAttr} loading="lazy" style="display: block; margin: auto; text-align: ${align};" />${caption}\n`;
      }
      return `![${alt}](#gif-unavailable)${caption}\n`;
    }

    if (type === 'code') {
      const lang = block.language || 'text';
      const filename = block.filename ? ` title="${block.filename}"` : '';
      return `\`\`\`${lang}${filename}\n${block.code || ''}\n\`\`\`\n`;
    }

    if (type === 'callout') {
      const calloutType = block.type || 'note';
      const title = block.title ? ` ${block.title}` : '';
      const body = serializeBody(block.body);
      return `:::${calloutType}${title}\n\n${body}\n\n:::\n`;
    }

    if (type === 'table' && Array.isArray(block.rows) && block.rows.length > 0) {
      const rows = block.rows.map((row) => '| ' + (row.cells || []).join(' | ') + ' |');
      const columns = (block.rows[0].cells || []).length;
      rows.splice(1, 0, '| ' + Array(columns).fill('---').join(' | ') + ' |');
      return rows.join('\n') + '\n';
    }

    if (type === 'videoEmbed' && block.url) {
      const caption = block.caption ? `\n\n*${block.caption}*\n` : '';
      return `<div className="video-container">\n  <iframe src="${block.url}" frameBorder="0" allowFullScreen></iframe>\n</div>${caption}\n`;
    }

    if (type === 'fileAttachment') {
      const label = block.label || 'Download File';
      const url = sanityFileUrl(block?.file?.asset || block?.asset || block?.file);
      return url ? `[${label}](${url})\n` : `[${label}](#file-unavailable)\n`;
    }

    if (type === 'divider') {
      return '\n---\n';
    }

    if (type === 'procedure') {
      const title = block.title ? `### ${block.title}\n\n` : '';
      const steps = (block.steps || [])
        .map((step, index) => {
          const stepTitle = `**Step ${index + 1}: ${step.title}**`;
          const stepBody = serializeBody(step.body);
          return `${stepTitle}\n\n${stepBody}`;
        })
        .join('\n\n');
      return `${title}${steps}\n`;
    }

    if (type === 'rawHtml') {
      return block.html ? block.html + '\n' : '';
    }

    return '';
  }

  function serializeBody(body) {
    if (!body || !Array.isArray(body)) return '';
    const parts = [];
    let blockRun = [];

    const flushRun = () => {
      if (blockRun.length === 0) return;
      try {
        const markdown = portableTextToMarkdown(blockRun, { components: { marks: markHandlers } });
        if (markdown) parts.push(markdown);
      } catch (err) {
        stats.warnings += 1;
        console.warn(`[sanity-content] Serialize warning: ${err.message}`);
      }
      blockRun = [];
    };

    for (const block of body) {
      if (block._type === 'block') {
        blockRun.push(block);
      } else {
        flushRun();
        const custom = serializeCustomBlock(block);
        if (custom) parts.push(custom);
      }
    }
    flushRun();

    const footnotes = [];
    const seenFootnotes = new Set();
    body.forEach((block) => {
      if (block._type !== 'block' || !Array.isArray(block.markDefs)) return;
      block.markDefs.forEach((def) => {
        if (def?._type !== 'footnote') return;
        const id = def?._key?.slice(0, 5) || 'fn';
        if (seenFootnotes.has(id)) return;
        seenFootnotes.add(id);
        footnotes.push(`[^${id}]: ${def?.text || ''}`);
      });
    });
    if (footnotes.length > 0) {
      parts.push('\n---\n\n' + footnotes.join('\n'));
    }

    return convertBoldToHeadings(parts.join('\n'));
  }

  function convertBoldToHeadings(markdown) {
    if (!markdown) return markdown;

    const lines = markdown.split('\n');
    const result = [];
    let prevWasHeading = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const inner = trimmed.slice(2, -2).trim();
        const cleanText = inner.replace(/[:\s]+$/, '');

        if (cleanText.length > 2 && cleanText.length < 80) {
          const numberedMatch = cleanText.match(/^(\d+)\.\s*(.+)$/);
          if (numberedMatch) {
            result.push(`### ${numberedMatch[1]}. ${numberedMatch[2]}`);
            prevWasHeading = true;
            continue;
          }

          if (!prevWasHeading || cleanText.split(/\s+/).length > 3) {
            result.push(`## ${cleanText}`);
            prevWasHeading = true;
            continue;
          }
        }
      }

      if (trimmed.startsWith('****') && trimmed.endsWith('****')) {
        const inner = trimmed.slice(4, -4).trim();
        if (inner.startsWith('**') && inner.endsWith('**')) {
          const text = inner.slice(2, -2).trim().replace(/[:\s]+$/, '');
          if (text.length > 2 && text.length < 80) {
            result.push(`### ${text}`);
            prevWasHeading = true;
            continue;
          }
        }
      }

      prevWasHeading = false;
      result.push(line);
    }

    return result.join('\n');
  }

  function buildDocFrontmatter(doc) {
    const lines = ['---', `title: "${escapeYaml(stripEmojis(doc.title))}"`];
    if (doc.description) lines.push(`description: "${escapeYaml(stripEmojis(doc.description))}"`);
    if (doc.sidebarPosition != null) lines.push(`sidebar_position: ${doc.sidebarPosition}`);
    if (doc.sidebarLabel) {
      lines.push(`sidebar_label: "${escapeYaml(stripEmojis(doc.sidebarLabel))}"`);
    }
    if (doc.categorySlug) lines.push(`sidebar_class: "${escapeYaml(doc.categorySlug)}"`);
    if (doc.hideFromSidebar) lines.push('hide_from_sidebar: true');
    if (doc.lastUpdated) lines.push(`last_update:\n  date: ${doc.lastUpdated}`);
    if (doc.tags && doc.tags.length) {
      lines.push(`tags: [${doc.tags.map((tag) => `"${escapeYaml(tag)}"`).join(', ')}]`);
    }
    if (doc.status) lines.push(`status: "${doc.status}"`);
    lines.push('---');
    return lines.join('\n');
  }

  function buildGenericFrontmatter(doc, extraFields = {}) {
    const lines = ['---', `title: "${escapeYaml(stripEmojis(doc.title))}"`];
    if (doc.description) lines.push(`description: "${escapeYaml(stripEmojis(doc.description))}"`);
    if (doc.publishedAt) lines.push(`date: ${doc.publishedAt}`);
    Object.entries(extraFields).forEach(([key, value]) => {
      if (value) lines.push(`${key}: "${escapeYaml(value)}"`);
    });
    lines.push('---');
    return lines.join('\n');
  }

  function enrichLandingMedia(value) {
    if (Array.isArray(value)) {
      return value.map((item) => enrichLandingMedia(item));
    }
    if (!value || typeof value !== 'object') {
      return value;
    }

    const enriched = {};
    for (const [key, nested] of Object.entries(value)) {
      enriched[key] = enrichLandingMedia(nested);
    }

    const assetRef = toAssetRef(enriched.asset);
    const nodeType = typeof enriched._type === 'string' ? enriched._type : '';

    if (nodeType === 'file' && assetRef) {
      const fileUrl = sanityFileUrl(assetRef);
      if (fileUrl) enriched.url = fileUrl;
    }

    if (nodeType === 'image' && assetRef) {
      const isGifLike = enriched.isGif === true || /-gif$/i.test(assetRef);
      const imageUrl = isGifLike ? (sanityRawImageUrl(assetRef) || sanityImageUrl(enriched)) : sanityImageUrl(enriched);
      if (imageUrl) enriched.url = imageUrl;
      if (isGifLike && !enriched.rawUrl) {
        const rawUrl = sanityRawImageUrl(assetRef);
        if (rawUrl) enriched.rawUrl = rawUrl;
      }
    }

    if (nodeType === 'gif') {
      const gifRef = toAssetRef(enriched?.file?.asset || enriched?.file || enriched?.asset);
      const gifUrl = sanityFileUrl(gifRef) || sanityRawImageUrl(gifRef);
      if (gifUrl) enriched.url = gifUrl;
    }

    if (nodeType === 'landingSectionVideo') {
      const videoRef = toAssetRef(enriched?.videoFile?.asset || enriched?.videoFile);
      const videoFileUrl = sanityFileUrl(videoRef);
      if (videoFileUrl) enriched.videoFileUrl = videoFileUrl;

      const posterRef = toAssetRef(enriched?.posterImage?.asset || enriched?.posterImage);
      if (posterRef) {
        const posterImageUrl = sanityImageUrl(enriched.posterImage);
        if (posterImageUrl) enriched.posterImageUrl = posterImageUrl;
      }
    }

    return enriched;
  }

  async function fetchLandingPages() {
    console.log('[sanity-content] Fetching landing pages...');

    let landingPages;
    try {
      landingPages = await client.fetch(getLandingPageQuery(includeDrafts));
    } catch (err) {
      stats.warnings += 1;
      console.warn(`[sanity-content] Warning: Failed to fetch landing pages: ${err.message}`);
      landingPages = [];
    }

    const enrichedLandingPages = landingPages.map((page) => enrichLandingMedia(page));

    stats.fetched.landingPage = enrichedLandingPages.length;
    console.log(`[sanity-content] -> ${enrichedLandingPages.length} landing page(s)`);

    const landingPagesPath = path.join(LANDING_PAGES_CACHE_DIR, 'landing-pages.json');
    writeTrackedFile(landingPagesPath, JSON.stringify(enrichedLandingPages, null, 2), writtenFiles);
    stats.written.landingPageJson += 1;
    console.log('[sanity-content] Wrote landing pages -> .sanity-landing-pages/landing-pages.json');

    // Frontend import target used by Sanity-backed route wrappers.
    writeTrackedFile(
      LANDING_PAGES_GENERATED_FILE,
      JSON.stringify(enrichedLandingPages, null, 2),
      writtenFiles
    );
    stats.written.landingPageJson += 1;
    console.log('[sanity-content] Wrote landing pages -> src/data/sanity-landing-pages.generated.json');

    for (const page of enrichedLandingPages) {
      const slug = page.slug?.current;
      const safeSlug = sanitizeSlugForPath(slug);
      if (!safeSlug) {
        stats.warnings += 1;
        console.warn(`[sanity-content] Warning: Invalid landing page slug skipped: "${slug}"`);
        continue;
      }

      const pagePath = path.join(LANDING_PAGES_CACHE_DIR, `${safeSlug.replace(/\//g, '-')}.json`);
      writeTrackedFile(pagePath, JSON.stringify(page, null, 2), writtenFiles);
      stats.written.landingPageJson += 1;
      console.log(`[sanity-content] Wrote landing page -> ${safeSlug}.json`);
    }
  }

  // Collect docs as we process them so we can write the "newly added" feed
  const allFetchedDocs = [];

  for (const { type, query } of queries) {
    console.log(`[sanity-content] Fetching ${type} documents...`);
    let docs;
    try {
      docs = await client.fetch(query);
    } catch (err) {
      throw new Error(`[sanity-content] GROQ query failed for type "${type}": ${err.message}`);
    }
    stats.fetched[type] = docs.length;
    console.log(`[sanity-content] -> ${docs.length} ${type} document(s)`);

    for (const doc of docs) {
      try {
        const slug = doc.slug?.current;
        const safeSlug = sanitizeSlugForPath(slug);
        if (!safeSlug) {
          stats.warnings += 1;
          console.warn(`[sanity-content] Warning: Invalid ${type} slug skipped: "${slug}"`);
          continue;
        }

        const bodyMd = stripEmojis(serializeBody(doc.body));

        if (type === 'doc') {
          const frontmatter = buildDocFrontmatter(doc);
          const content = frontmatter + (bodyMd ? '\n\n' + bodyMd : '');
          const filePath = path.join(CACHE_ROOT, 'docs', `${safeSlug}.md`);
          writeTrackedFile(filePath, content, writtenFiles);
          stats.written.doc += 1;
          console.log(`[sanity-content] Wrote doc -> docs/${safeSlug}.md`);

          // Collect for newly-added feed
          if (doc._id && doc.title && !doc.hideFromSidebar) {
            allFetchedDocs.push({
              _id: doc._id,
              title: doc.title,
              slug: safeSlug,
              categoryTitle: doc.categoryTitle || doc.category || null,
              categorySlug: doc.categorySlug || null,
              description: doc.description || null,
              tags: Array.isArray(doc.tags) ? doc.tags : [],
              createdAt: doc._createdAt || null,
              lastUpdated: doc.lastUpdated || null,
            });
          }
        } else {
          const extra = {};
          if (type === 'article') {
            extra.author = doc.author;
          } else if (type === 'referencePage') {
            extra.apiVersion = doc.apiVersion;
          }

          const frontmatter = buildGenericFrontmatter(doc, extra);
          const content = frontmatter + (bodyMd ? '\n\n' + bodyMd : '');
          const filePath = path.join(CACHE_ROOT, 'docs', `${safeSlug}.md`);
          writeTrackedFile(filePath, content, writtenFiles);
          stats.written[type] += 1;
          console.log(`[sanity-content] Wrote ${type} -> docs/${safeSlug}.md`);
        }
      } catch (err) {
        stats.warnings += 1;
        console.warn(`[sanity-content] Warning: Failed to process ${type} "${doc?.slug?.current}": ${err.message}`);
      }
    }
  }

  // Write newly-added feed: top 12 docs sorted by creation date descending
  const newlyAdded = allFetchedDocs
    .filter(d => d.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);
  writeTrackedFile(NEWLY_ADDED_GENERATED_FILE, JSON.stringify(newlyAdded, null, 2), writtenFiles);
  console.log(`[sanity-content] Wrote ${newlyAdded.length} newly-added docs -> src/data/sanity-newly-added.generated.json`);

  // Ensure plugin-content-docs never fails on empty cache dirs.
  for (const dir of ALL_CACHE_DIRS) {
    const dirPath = path.join(CACHE_ROOT, dir);
    if (fs.readdirSync(dirPath).length === 0) {
      const placeholderPath = path.join(dirPath, '_placeholder.mdx');
      const placeholderContent =
        '---\n' +
        'title: "Sanity Content"\n' +
        'hide_table_of_contents: true\n' +
        'draft: true\n' +
        '---\n\n' +
        'Content from Sanity will appear here once documents are published.\n';
      writeTrackedFile(placeholderPath, placeholderContent, writtenFiles);
      stats.written.placeholders += 1;
    }
  }

  async function fetchReleases() {
    console.log('[sanity-content] Fetching releases...');
    let releases;
    try {
      releases = await client.fetch(getReleasesQuery(includeDrafts));
    } catch (err) {
      stats.warnings += 1;
      console.warn(`[sanity-content] Warning: Failed to fetch releases: ${err.message}`);
      releases = [];
    }
    stats.fetched.release = releases.length;
    console.log(`[sanity-content] -> ${releases.length} release(s)`);
    writeTrackedFile(
      RELEASES_GENERATED_FILE,
      JSON.stringify(releases, null, 2),
      writtenFiles
    );
    stats.written.releaseJson = (stats.written.releaseJson || 0) + 1;
    console.log('[sanity-content] Wrote releases -> src/data/sanity-releases.generated.json');
  }

  async function fetchRoadmapItems() {
    console.log('[sanity-content] Fetching roadmap items...');
    let items;
    try {
      items = await client.fetch(getRoadmapQuery(includeDrafts));
    } catch (err) {
      stats.warnings += 1;
      console.warn(`[sanity-content] Warning: Failed to fetch roadmap items: ${err.message}`);
      items = [];
    }
    stats.fetched.roadmapItem = items.length;
    console.log(`[sanity-content] -> ${items.length} roadmap item(s)`);
    writeTrackedFile(
      ROADMAP_GENERATED_FILE,
      JSON.stringify(items, null, 2),
      writtenFiles
    );
    stats.written.roadmapJson = (stats.written.roadmapJson || 0) + 1;
    console.log('[sanity-content] Wrote roadmap items -> src/data/sanity-roadmap.generated.json');
  }

  async function fetchDeviceIntegrations() {
    console.log('[sanity-content] Fetching device integrations...');
    let integrations;
    try {
      integrations = await client.fetch(getDeviceIntegrationsQuery(includeDrafts));
    } catch (err) {
      stats.warnings += 1;
      console.warn(`[sanity-content] Warning: Failed to fetch device integrations: ${err.message}`);
      integrations = [];
    }
    stats.fetched.deviceIntegration = integrations.length;
    console.log(`[sanity-content] -> ${integrations.length} device integration(s)`);
    writeTrackedFile(
      INTEGRATIONS_GENERATED_FILE,
      JSON.stringify(integrations, null, 2),
      writtenFiles
    );
    stats.written.deviceIntegration += 1;
    console.log('[sanity-content] Wrote device integrations -> src/data/sanity-integrations.generated.json');
  }

  async function fetchUpdates() {
    console.log('[sanity-content] Fetching updates...');
    let updates;
    try {
      updates = await client.fetch(getUpdatesQuery(includeDrafts));
    } catch (err) {
      stats.warnings += 1;
      console.warn(`[sanity-content] Warning: Failed to fetch updates: ${err.message}`);
      updates = [];
    }
    stats.fetched.update = updates.length;
    console.log(`[sanity-content] -> ${updates.length} update(s)`);
    writeTrackedFile(
      UPDATES_GENERATED_FILE,
      JSON.stringify(updates, null, 2),
      writtenFiles
    );
    stats.written.update = (stats.written.update || 0) + 1;
    console.log('[sanity-content] Wrote updates -> src/data/sanity-updates.generated.json');
  }

  await fetchLandingPages();
  await fetchReleases();
  await fetchRoadmapItems();
  await fetchDeviceIntegrations();
  await fetchUpdates();

  const manifest = {
    runId,
    startedAt: runStartedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    gitHead: getGitHead(),
    projectId,
    dataset,
    mode: {
      includeDrafts,
      strict: strictMode,
    },
    backup: {
      enabled: backupEnabled,
      keepBackups,
      path: backupDir ? path.relative(SITE_DIR, backupDir).replace(/\\/g, '/') : null,
    },
    stats,
    files: writtenFiles,
  };

  const runManifestPath = writeVersionSnapshot(manifest);
  console.log(
    `[sanity-content] Version snapshot -> ${path.relative(SITE_DIR, runManifestPath).replace(/\\/g, '/')}`
  );
  await writeRunLogToSanity(manifest);
  if (strictMode && stats.warnings > 0) {
    throw new Error(
      `[sanity-content] Strict mode failed: encountered ${stats.warnings} warning(s). Resolve warnings or disable SANITY_FETCH_STRICT.`
    );
  }
  console.log('[sanity-content] Done - content written to .sanity-cache/');
}

module.exports = { run };

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
