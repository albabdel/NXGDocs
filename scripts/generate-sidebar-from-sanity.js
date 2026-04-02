#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SANITY_PROJECT_ID = 'fjjuacab';
const SANITY_DATASET = 'production';
const SANITY_API_TOKEN = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const OUTPUT_FILE = path.join(__dirname, '..', 'classic', 'sidebars.ts');
const DOCS_DIR = path.join(__dirname, '..', 'classic', '.sanity-cache', 'docs');

const PRODUCT = process.env.PRODUCT || 'gcxone';

function getProductFilter() {
  return `(product == "${PRODUCT}" || product == "shared")`;
}

function stripEmojis(str) {
  if (!str) return '';
  return str
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toDocId(slug) {
  if (!slug) return '';
  return slug
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/-+$/, '');
}

function normalizeSlug(slug) {
  if (!slug) return '';
  return slug
    .toLowerCase()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

/**
 * Scan the on-disk docs directory and return a Map of
 *   lowercased-doc-id -> actual-cased-doc-id
 * This lets us validate sidebar entries against what was really written to disk
 * and correct case mismatches (e.g. Sanity slug "Devices/foo" vs file "devices/foo").
 */
function getOnDiskDocIds() {
  const ids = new Map();

  function walk(dir, prefix) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else if (entry.name.endsWith('.md')) {
        const docId = rel.slice(0, -3); // strip .md
        ids.set(docId.toLowerCase(), docId);
      }
    }
  }

  walk(DOCS_DIR, '');
  return ids;
}

async function fetchSanityData() {
  const { createClient } = require('@sanity/client');
  
  const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: SANITY_API_TOKEN,
  });

  console.log('Fetching sidebarCategory documents from Sanity...');
  console.log(`Product filter: ${PRODUCT} (includes shared)`);
  
  const productFilter = getProductFilter();
  
  const categories = await client.fetch(`
    *[_type == "sidebarCategory" && ${productFilter}] | order(position asc) {
      _id,
      title,
      slug,
      icon,
      position,
      parent,
      collapsed,
      collapsible,
      link,
      targetAudience,
      product
    }
  `);

  console.log(`Found ${categories.length} sidebarCategory documents`);

  console.log('Fetching published docs from Sanity...');
  
  const docs = await client.fetch(`
    *[_type == "doc" && status == "published" && ${productFilter}] {
      _id,
      title,
      "slug": slug.current,
      targetAudience,
      category,
      "categoryId": sidebarCategory->_id,
      sidebarPosition,
      sidebarLabel,
      product
    }
  `);

  // Only include docs written to the main `docs/` directory (audience "all").
  // Docs with other audiences (admin, manager, operator) are served from separate
  // Docusaurus plugins and their IDs don't exist in the main sidebar.
  const filteredDocs = docs.filter((doc) => {
    const audiences = Array.isArray(doc.targetAudience) && doc.targetAudience.length
      ? doc.targetAudience
      : ['all'];
    return audiences.includes('all');
  });

  console.log(`Found ${docs.length} published docs (${filteredDocs.length} with audience "all")`);
  const docs_all = filteredDocs;

  console.log('Fetching sidebarConfig from Sanity...');
  
  const sidebarConfig = await client.fetch(`
    *[_type == "sidebarConfig" && audience == "all" && isActive == true][0] {
      homeLinkLabel,
      showHomeLink
    }
  `);

  console.log(`Found sidebarConfig: ${sidebarConfig ? 'yes' : 'no'}`);

  return { categories, docs: docs_all, sidebarConfig };
}

function buildSidebarStructure(categories, docs) {
  const categoryMap = new Map();
  
  for (const cat of categories) {
    const slug = cat.slug?.current || cat.slug || '';
    categoryMap.set(cat._id, {
      ...cat,
      normalizedSlug: normalizeSlug(slug),
      children: [],
      docs: [],
    });
  }

  const roots = [];
  
  for (const cat of categories) {
    const node = categoryMap.get(cat._id);
    if (!node) continue;

    const parentId = cat.parent?._ref || cat.parent;
    
    if (parentId && categoryMap.has(parentId)) {
      categoryMap.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const node of categoryMap.values()) {
    node.children.sort((a, b) => {
      const aPos = a.position ?? 1000;
      const bPos = b.position ?? 1000;
      if (aPos !== bPos) return aPos - bPos;
      return (a.title || '').localeCompare(b.title || '');
    });
    
    const seenChildIds = new Set();
    node.children = node.children.filter(child => {
      if (seenChildIds.has(child._id)) return false;
      seenChildIds.add(child._id);
      return true;
    });
  }
  
  roots.sort((a, b) => {
    const aPos = a.position ?? 1000;
    const bPos = b.position ?? 1000;
    if (aPos !== bPos) return aPos - bPos;
    return (a.title || '').localeCompare(b.title || '');
  });

  const assignedDocIds = new Set();

  for (const doc of docs) {
    if (!doc.slug) continue;
    
    let targetCategory = null;

    if (doc.categoryId && categoryMap.has(doc.categoryId)) {
      targetCategory = categoryMap.get(doc.categoryId);
    }
    
    if (!targetCategory) {
      const docNormalizedCategory = normalizeSlug(doc.category || '');
      
      for (const node of categoryMap.values()) {
        if (node.normalizedSlug === docNormalizedCategory) {
          targetCategory = node;
          break;
        }
        const nodeTitleLower = normalizeSlug(node.title || '');
        if (nodeTitleLower === docNormalizedCategory) {
          targetCategory = node;
          break;
        }
      }
      
      if (!targetCategory && docNormalizedCategory) {
        const docSlugNormalized = normalizeSlug(doc.slug);
        for (const node of categoryMap.values()) {
          if (docSlugNormalized.startsWith(node.normalizedSlug + '/') || 
              node.normalizedSlug.startsWith(docSlugNormalized + '/')) {
            targetCategory = node;
            break;
          }
        }
      }
    }

    if (targetCategory) {
      const docId = toDocId(doc.slug);
      if (!assignedDocIds.has(docId)) {
        targetCategory.docs.push({
          _id: doc._id,
          title: doc.title,
          slug: docId,
          sidebarPosition: doc.sidebarPosition,
          sidebarLabel: doc.sidebarLabel,
        });
        assignedDocIds.add(docId);
      }
    }
  }

  for (const node of categoryMap.values()) {
    node.docs.sort((a, b) => {
      const aPos = a.sidebarPosition ?? 1000;
      const bPos = b.sidebarPosition ?? 1000;
      if (aPos !== bPos) return aPos - bPos;
      return (a.title || '').localeCompare(b.title || '');
    });
  }

  const seenRootSlugs = new Set();
  const dedupedRoots = [];
  for (const root of roots) {
    const key = root.normalizedSlug || root.title?.toLowerCase();
    if (!seenRootSlugs.has(key)) {
      seenRootSlugs.add(key);
      dedupedRoots.push(root);
    }
  }

  return { roots: dedupedRoots, categoryMap };
}

function buildCategoryItem(node, onDiskIds, depth = 0) {
  const items = [];
  const seenDocIds = new Set();

  for (const child of node.children) {
    const childItem = buildCategoryItem(child, onDiskIds, depth + 1);
    if (childItem) items.push(childItem);
  }

  for (const doc of node.docs) {
    // Resolve the actual on-disk ID (handles case mismatches).
    // Skip entirely if the file doesn't exist on disk.
    const onDiskId = onDiskIds.get(doc.slug.toLowerCase());
    if (!onDiskId) continue;
    // Skip duplicates within the same category.
    if (seenDocIds.has(onDiskId)) continue;
    seenDocIds.add(onDiskId);
    items.push({
      type: 'doc',
      id: onDiskId,
      label: stripEmojis(doc.sidebarLabel || doc.title) || doc.slug,
    });
  }

  if (items.length === 0) {
    return null;
  }

  let link = null;
  const linkType = node.link?.type;
  
  if (linkType === 'generated-index') {
    link = { type: 'generated-index' };
    if (depth === 0 && node.normalizedSlug) {
      link.slug = `/${node.normalizedSlug}`;
    }
  } else if (linkType === 'doc' && node.link?.doc?.slug?.current) {
    link = {
      type: 'doc',
      id: toDocId(node.link.doc.slug.current),
    };
  }

  const label = stripEmojis(node.title) || node.normalizedSlug || 'Category';

  return {
    type: 'category',
    label,
    collapsible: node.collapsible !== false,
    collapsed: node.collapsed === true,
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

function generateSidebarFile(items) {
  return `/**
 * Auto-generated sidebar configuration from Sanity.
 * This file is generated by scripts/generate-sidebar-from-sanity.js
 * DO NOT EDIT MANUALLY - changes will be overwritten.
 */
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  sanityDocsSidebar: ${renderTsObject(items, 1)},
};

export default sidebars;
`;
}

async function run() {
  try {
    const { categories, docs, sidebarConfig } = await fetchSanityData();

    const { roots, categoryMap } = buildSidebarStructure(categories, docs);

    const onDiskIds = getOnDiskDocIds();
    console.log(`Found ${onDiskIds.size} doc files on disk in .sanity-cache/docs/`);

    const sidebarItems = [];

    const homeLabel = sidebarConfig?.homeLinkLabel || 'Home';
    // Only add index link if the index.md file exists on disk
    if (onDiskIds.has('index')) {
      sidebarItems.push({
        type: 'doc',
        id: 'index',
        label: homeLabel,
      });
    }

    for (const root of roots) {
      const categoryItem = buildCategoryItem(root, onDiskIds);
      if (categoryItem) {
        sidebarItems.push(categoryItem);
      }
    }

    let totalDocs = 0;
    for (const node of categoryMap.values()) {
      totalDocs += node.docs.length;
    }
    
    console.log(`Built sidebar with ${sidebarItems.length} top-level items, ${totalDocs} docs in categories`);

    const tsContent = generateSidebarFile(sidebarItems);
    
    fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
    
    console.log(`Generated: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error generating sidebar:', error.message);
    process.exit(1);
  }
}

module.exports = { run };

if (require.main === module) {
  run();
}
