#!/usr/bin/env node
/**
 * Generate Docusaurus sidebar files from Sanity sidebar documents.
 *
 * Refactor goals:
 * - Keep production sidebar deterministic from Sanity.
 * - Auto-place docs that are missing explicit sidebarCategory using slug fallback.
 * - Keep role/internal sidebars safe by only including docs that exist in their docs directories.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(SITE_DIR, 'classic');

const AUDIENCE_FILE_MAP = {
  all: 'sidebars.ts',
  admin: 'sidebars-admin.ts',
  manager: 'sidebars-manager.ts',
  operator: 'sidebars-operator.ts',
  'operator-minimal': 'sidebars-operator-minimal.ts',
  internal: 'sidebars-internal.ts',
};

// Used only as an allowlist for audiences that point to static docs paths.
const AUDIENCE_DOCS_DIR_MAP = {
  all: null,
  admin: 'docs-admin',
  manager: 'docs-manager',
  operator: 'docs-operator',
  'operator-minimal': 'docs-operator-minimal',
  internal: 'docs-internal',
};

const DEFAULT_AUDIENCE = 'all';
const SIDEBAR_NAME_MAP = {
  all: 'sanityDocsSidebar',
  admin: 'adminSidebar',
  manager: 'managerSidebar',
  operator: 'operatorSidebar',
  'operator-minimal': 'operatorMinimalSidebar',
  internal: 'internalSidebar',
};

function parseBooleanEnv(value, defaultValue) {
  if (value == null || value === '') return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function toDocId(value) {
  const normalized = normalizeSlug(value);
  if (!normalized) return '';

  const safeSegments = normalized
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .map((segment) => {
      const safe = segment.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+|-+$/g, '');
      return safe || 'untitled';
    });

  return safeSegments.join('/');
}

function toCategoryLinkSlug(value) {
  const docId = toDocId(value);
  return docId ? `/${docId}` : null;
}

function sortByPositionThenTitle(a, b) {
  const aPos = Number.isFinite(a?.position) ? a.position : 1000;
  const bPos = Number.isFinite(b?.position) ? b.position : 1000;
  if (aPos !== bPos) return aPos - bPos;
  return String(a?.title || '').localeCompare(String(b?.title || ''));
}

function sortDocs(a, b) {
  const aPos = Number.isFinite(a?.sidebarPosition) ? a.sidebarPosition : 1000;
  const bPos = Number.isFinite(b?.sidebarPosition) ? b.sidebarPosition : 1000;
  if (aPos !== bPos) return aPos - bPos;
  return String(a?.title || '').localeCompare(String(b?.title || ''));
}

function isVisibleToAudience(targetAudience, audience) {
  if (!Array.isArray(targetAudience) || targetAudience.length === 0) return true;
  if (targetAudience.includes('all')) return true;
  return targetAudience.includes(audience);
}

function collectDocIdsFromDocsDir(relativeDir) {
  if (!relativeDir) return null;

  const absDir = path.join(OUTPUT_DIR, relativeDir);
  if (!fs.existsSync(absDir)) return new Set();

  /** @type {Set<string>} */
  const ids = new Set();

  function walk(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs, `${prefix}${entry.name}/`);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!/\.(md|mdx)$/i.test(entry.name)) continue;

      const base = entry.name.replace(/\.(md|mdx)$/i, '');
      const id = base.toLowerCase() === 'index' ? `${prefix}index` : `${prefix}${base}`;
      ids.add(toDocId(id));
    }
  }

  walk(absDir);
  return ids;
}

function collectAllDocIds() {
  const docsDirs = ['docs', 'docs-admin', 'docs-manager', 'docs-operator', 'docs-operator-minimal', 'docs-internal'];
  const allIds = new Set();
  
  for (const dir of docsDirs) {
    const ids = collectDocIdsFromDocsDir(dir);
    if (ids) {
      for (const id of ids) {
        allIds.add(id);
      }
    }
  }
  
  return allIds;
}

function resolveHomeDocId(allowedDocIds) {
  if (!allowedDocIds) return 'index';

  const candidates = ['index', 'README', 'readme'];
  for (const candidate of candidates) {
    if (allowedDocIds.has(toDocId(candidate))) return toDocId(candidate);
  }
  return null;
}

function buildCategoryTree(categories) {
  const categoryMap = new Map(
    categories.map((category) => [
      category._id,
      {
        ...category,
        normalizedSlug: normalizeSlug(category.slug),
        children: [],
        docs: [],
      },
    ])
  );

  /** @type {any[]} */
  const roots = [];

  for (const category of categories) {
    const node = categoryMap.get(category._id);
    if (!node) continue;

    if (category.parentId && categoryMap.has(category.parentId)) {
      categoryMap.get(category.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const node of categoryMap.values()) {
    node.children.sort(sortByPositionThenTitle);
  }
  roots.sort(sortByPositionThenTitle);

  return { categoryMap, roots };
}

function findBestCategoryBySlug(slug, categories) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;

  const matches = categories.filter((category) => {
    const catSlug = normalizeSlug(category.normalizedSlug || category.slug);
    if (!catSlug) return false;
    return normalized === catSlug || normalized.startsWith(`${catSlug}/`);
  });

  if (matches.length === 0) return null;
  matches.sort((a, b) => normalizeSlug(b.normalizedSlug || b.slug).length - normalizeSlug(a.normalizedSlug || a.slug).length);
  return matches[0];
}

function findCategoryFromLegacyField(categoryValue, categories) {
  const normalized = normalizeSlug(categoryValue);
  if (!normalized) return null;

  const exact = categories.find((category) => normalizeSlug(category.normalizedSlug || category.slug) === normalized);
  if (exact) return exact;

  const prefixMatches = categories
    .filter((category) => normalizeSlug(category.normalizedSlug || category.slug).startsWith(`${normalized}/`))
    .sort((a, b) => normalizeSlug(a.normalizedSlug || a.slug).length - normalizeSlug(b.normalizedSlug || b.slug).length);

  return prefixMatches[0] || null;
}

function assignDocsToCategories(docs, categoryMap) {
  const allCategories = [...categoryMap.values()];
  /** @type {any[]} */
  const unmatchedDocs = [];

  for (const doc of docs) {
    if (doc.hideFromSidebar) continue;

    const normalizedSlug = normalizeSlug(doc.slug);
    if (!normalizedSlug) continue;

    let categoryNode = null;

    if (doc.categoryId && categoryMap.has(doc.categoryId)) {
      categoryNode = categoryMap.get(doc.categoryId);
    }

    if (!categoryNode && doc.category) {
      categoryNode = findCategoryFromLegacyField(doc.category, allCategories);
    }

    if (!categoryNode) {
      categoryNode = findBestCategoryBySlug(normalizedSlug, allCategories);
    }

    const hydratedDoc = {
      ...doc,
      slug: toDocId(normalizedSlug),
    };

    if (categoryNode) {
      categoryNode.docs.push(hydratedDoc);
      continue;
    }

    unmatchedDocs.push(hydratedDoc);
  }

  for (const node of categoryMap.values()) {
    node.docs.sort(sortDocs);
  }
  unmatchedDocs.sort(sortDocs);

  return unmatchedDocs;
}

function categoryHasAudienceContent(node, audience, options) {
  if (!isVisibleToAudience(node.targetAudience, audience)) return false;

  const visibleDocs = node.docs.filter((doc) => {
    if (!isVisibleToAudience(doc.targetAudience, audience)) return false;
    if (options.allowedDocIds && !options.allowedDocIds.has(doc.slug)) return false;
    return true;
  });
  if (visibleDocs.length > 0) return true;

  return node.children.some((child) => categoryHasAudienceContent(child, audience, options));
}

function buildCategoryItem(node, audience, options, depth = 0) {
  if (!isVisibleToAudience(node.targetAudience, audience)) return null;

  const items = [];

  for (const child of node.children) {
    const childItem = buildCategoryItem(child, audience, options, depth + 1);
    if (childItem) items.push(childItem);
  }

  for (const doc of node.docs) {
    if (!isVisibleToAudience(doc.targetAudience, audience)) continue;
    if (options.allowedDocIds && !options.allowedDocIds.has(doc.slug)) continue;
    if (options.allExistingDocIds && !options.allExistingDocIds.has(doc.slug)) {
      console.warn(`[generate-sidebars] Skipping doc "${doc.slug}" in category "${node.title}" - doc file not found on disk`);
      continue;
    }

    items.push({
      type: 'doc',
      id: doc.slug,
      label: doc.sidebarLabel || doc.title,
    });
  }

  if (items.length === 0 && !options.keepEmptyCategories) {
    return null;
  }

  let link = null;
  if (node.link?.type === 'generated-index') {
    link = { type: 'generated-index' };
    if (node.description) link.description = node.description;
    const categorySlug = depth === 0 ? toCategoryLinkSlug(node.normalizedSlug || node.slug) : null;
    if (categorySlug) link.slug = categorySlug;
  } else if (node.link?.type === 'doc' && node.link?.docId) {
    link = { type: 'doc', id: toDocId(node.link.docId) };
  } else if (node.link?.type === 'external' && node.link?.url) {
    // Docusaurus category link does not support external URLs directly in the same way as doc links.
    // Keep category expandable only.
    link = null;
  }

  return {
    type: 'category',
    label: `${node.icon || ''} ${node.title}`.trim(),
    collapsible: node.collapsible !== false,
    collapsed: Boolean(node.collapsed),
    link,
    items,
  };
}

function renderTsObject(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const nextPad = '  '.repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const lines = value.map((item) => `${nextPad}${renderTsObject(item, indent + 1)}`);
    return `[\n${lines.join(',\n')}\n${pad}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return '{}';
    const lines = entries.map(([key, val]) => `${nextPad}${key}: ${renderTsObject(val, indent + 1)}`);
    return `{\n${lines.join(',\n')}\n${pad}}`;
  }

  return JSON.stringify(value);
}

function generateSidebarFile(sidebarName, items) {
  return `/**
 * Auto-generated sidebar configuration from Sanity.
 * This file is generated by scripts/generate-sidebars-from-sanity.js
 * DO NOT EDIT MANUALLY - changes will be overwritten.
 */
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  ${sidebarName}: ${renderTsObject(items, 1)},
};

export default sidebars;
`;
}

async function run() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const apiToken = process.env.SANITY_API_TOKEN;
  if (!projectId) throw new Error('[generate-sidebars] Missing SANITY_PROJECT_ID env var');
  if (!apiToken) throw new Error('[generate-sidebars] Missing SANITY_API_TOKEN env var');

  const dataset = process.env.SANITY_DATASET || 'production';
  const keepEmptyCategories = parseBooleanEnv(process.env.SANITY_SIDEBAR_KEEP_EMPTY_CATEGORIES, false);

  const { createClient } = require('@sanity/client');
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  });

  console.log('[generate-sidebars] Fetching sidebar categories/config/docs from Sanity...');

  const categories = await client.fetch(`
    *[_type == "sidebarCategory"] | order(position asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      icon,
      position,
      collapsed,
      collapsible,
      "parentId": parent->_id,
      targetAudience,
      "link": {
        "type": link.type,
        "url": link.url,
        "docId": link.doc->slug.current
      }
    }
  `);

  const configs = await client.fetch(`
    *[_type == "sidebarConfig" && isActive == true] {
      _id,
      name,
      audience,
      showHomeLink,
      homeLinkLabel,
      "categoryRefs": categories[]{
        _key,
        "categoryId": category->_id,
        position
      },
      customItems
    }
  `);

  const docs = await client.fetch(`
    *[_type == "doc" && defined(slug.current) && status == "published" && hiddenFromProduction != true] | order(sidebarPosition asc) {
      _id,
      title,
      "slug": slug.current,
      targetAudience,
      "categoryId": sidebarCategory->_id,
      category,
      sidebarPosition,
      sidebarLabel,
      hideFromSidebar
    }
  `);

  /** @type {Map<string, any>} */
  const docsBySlug = new Map();
  for (const doc of docs) {
    const docId = toDocId(doc.slug);
    if (!docId) continue;

    const existing = docsBySlug.get(docId);
    if (!existing) {
      docsBySlug.set(docId, doc);
      continue;
    }

    // Prefer explicit sidebarCategory assignment and lower sidebarPosition.
    const existingScore =
      (existing.categoryId ? 100 : 0) +
      (Number.isFinite(existing.sidebarPosition) ? 50 - Math.min(existing.sidebarPosition, 49) : 0);
    const candidateScore =
      (doc.categoryId ? 100 : 0) +
      (Number.isFinite(doc.sidebarPosition) ? 50 - Math.min(doc.sidebarPosition, 49) : 0);

    if (candidateScore > existingScore) {
      docsBySlug.set(docId, doc);
    }
  }
  const dedupedDocs = [...docsBySlug.values()];

  console.log(
    `[generate-sidebars] Categories: ${categories.length}, configs: ${configs.length}, docs: ${docs.length}, deduped docs: ${dedupedDocs.length}`
  );

  const { categoryMap, roots } = buildCategoryTree(categories);
  const unmatchedDocs = assignDocsToCategories(dedupedDocs, categoryMap);
  if (unmatchedDocs.length > 0) {
    console.log(`[generate-sidebars] Docs without direct category link: ${unmatchedDocs.length} (will be auto-grouped or uncategorized)`);
  }

  const allExistingDocIds = collectAllDocIds();
  console.log(`[generate-sidebars] Found ${allExistingDocIds.size} existing doc files on disk`);

  const configsByAudience = new Map(configs.map((config) => [config.audience || DEFAULT_AUDIENCE, config]));
  const generatedFiles = [];

  for (const [audience, outputFile] of Object.entries(AUDIENCE_FILE_MAP)) {
    const config = configsByAudience.get(audience) || configsByAudience.get(DEFAULT_AUDIENCE) || null;
    if (!config) {
      console.warn(`[generate-sidebars] No sidebarConfig found for audience "${audience}" and no default config. Skipping ${outputFile}.`);
      continue;
    }

    const allowedDocIds = collectDocIdsFromDocsDir(AUDIENCE_DOCS_DIR_MAP[audience]);
    const options = {
      keepEmptyCategories,
      allowedDocIds,
      allExistingDocIds,
    };

    /** @type {any[]} */
    const items = [];

    if (config.showHomeLink) {
      const homeDocId = resolveHomeDocId(allowedDocIds);
      if (homeDocId) {
        items.push({
          type: 'doc',
          id: homeDocId,
          label: config.homeLinkLabel || 'Home',
        });
      } else {
        console.warn(`[generate-sidebars] Skipping home link for audience "${audience}" (no compatible home doc id found).`);
      }
    }

    if (Array.isArray(config.customItems)) {
      const customItems = [...config.customItems]
        .sort((a, b) => (Number.isFinite(a?.position) ? a.position : 0) - (Number.isFinite(b?.position) ? b.position : 0))
        .filter((item) => item && !item.external && item.href)
        .map((item) => ({
          type: 'doc',
          id: toDocId(item.href),
          label: item.label,
        }))
        .filter((item) => {
          if (!allExistingDocIds.has(item.id)) {
            console.warn(`[generate-sidebars] Skipping custom item "${item.id}" - doc file not found on disk`);
            return false;
          }
          if (!allowedDocIds) return true;
          return allowedDocIds.has(item.id);
        });
      items.push(...customItems);
    }

    const configuredRootIds = Array.isArray(config.categoryRefs)
      ? config.categoryRefs
          .filter((entry) => entry && entry.categoryId)
          .sort((a, b) => (Number.isFinite(a?.position) ? a.position : 1000) - (Number.isFinite(b?.position) ? b.position : 1000))
          .map((entry) => entry.categoryId)
      : [];

    const orderedRoots = configuredRootIds.length > 0
      ? configuredRootIds.map((id) => categoryMap.get(id)).filter(Boolean)
      : [...roots];

    const orderedRootIdSet = new Set(orderedRoots.map((node) => node._id));
    const extraRoots = roots.filter(
      (node) =>
        !orderedRootIdSet.has(node._id) &&
        categoryHasAudienceContent(node, audience, options)
    );
    extraRoots.sort(sortByPositionThenTitle);

    const rootsForAudience = [...orderedRoots, ...extraRoots];

    for (const root of rootsForAudience) {
      const categoryItem = buildCategoryItem(root, audience, options);
      if (categoryItem) items.push(categoryItem);
    }

    const unmatchedForAudience = unmatchedDocs.filter((doc) => {
      if (!isVisibleToAudience(doc.targetAudience, audience)) return false;
      if (allowedDocIds && !allowedDocIds.has(doc.slug)) return false;
      if (!allExistingDocIds.has(doc.slug)) {
        console.warn(`[generate-sidebars] Skipping unmatched doc "${doc.slug}" - doc file not found on disk`);
        return false;
      }
      return true;
    });

    if (unmatchedForAudience.length > 0) {
      items.push({
        type: 'category',
        label: '🗂️ Uncategorized',
        collapsible: true,
        collapsed: false,
        link: {
          type: 'generated-index',
          description: 'Docs automatically included in production sidebar without explicit sidebarCategory references.',
          slug: '/uncategorized',
        },
        items: unmatchedForAudience.map((doc) => ({
          type: 'doc',
          id: doc.slug,
          label: doc.sidebarLabel || doc.title,
        })),
      });
    }

    const sidebarName = SIDEBAR_NAME_MAP[audience] || `${audience}Sidebar`;
    const tsContent = generateSidebarFile(sidebarName, items);
    const outputPath = path.join(OUTPUT_DIR, outputFile);
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    generatedFiles.push(outputFile);

    console.log(
      `[generate-sidebars] Wrote ${outputFile} (audience=${audience}, items=${items.length}, uncategorized=${unmatchedForAudience.length})`
    );
  }

  console.log(`[generate-sidebars] Done - generated ${generatedFiles.length} sidebar file(s).`);
}

module.exports = { run };

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
