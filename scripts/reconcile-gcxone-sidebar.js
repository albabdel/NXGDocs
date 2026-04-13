#!/usr/bin/env node
'use strict';

/**
 * Reconcile Sanity sidebar data with published doc slugs.
 *
 * What this does:
 * 1) Ensures required root sidebar categories exist.
 * 2) Ensures active sidebar configs include those root categories in order.
 * 3) Assigns missing sidebarCategory references on docs using slug-based matching.
 *
 * Usage:
 *   node scripts/reconcile-sanity-sidebar.js           # dry run
 *   node scripts/reconcile-sanity-sidebar.js --apply   # apply changes
 */

const APPLY_MODE = process.argv.includes('--apply');

const ROOT_CATEGORY_BLUEPRINT = [
  { slug: 'getting-started', title: 'Getting Started', position: 1, description: 'Getting Started Guide' },
  { slug: 'platform-fundamentals', title: 'Platform Fundamentals', position: 2, description: 'Platform Architecture and Concepts' },
  { slug: 'devices', title: 'Devices', position: 3, description: 'Device Integration and Management' },
  { slug: 'platform-functions', title: 'Platform Functions', position: 4, description: 'Core platform functionalities' },
  { slug: 'breakthroughs', title: 'Breakthroughs', position: 5, description: 'Advanced Features and Innovations' },
  { slug: 'installer-guide', title: 'Installer Guide', position: 6, description: 'Installation and setup procedures' },
  { slug: 'operator-guide', title: 'Operator Guide', position: 7, description: 'Daily operations and usage' },
  { slug: 'alarm-management', title: 'Alarm Management', position: 8, description: 'Alarm configurations and routing' },
  { slug: 'reporting', title: 'Reporting', position: 9, description: 'System reports and analytics' },
  { slug: 'api-reference', title: 'API Reference', position: 10, description: 'Developer APIs and integrations' },
  { slug: 'knowledge-base', title: 'Knowledge Base', position: 11, description: 'Troubleshooting and FAQs' },
];

function normalizePath(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function normalizeSegment(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeForMatch(value) {
  const normalized = normalizePath(value);
  if (!normalized) return '';
  return normalized
    .split('/')
    .map((segment) => normalizeSegment(segment))
    .filter(Boolean)
    .join('/');
}

function sortByPositionThenTitle(a, b) {
  const aPos = Number.isFinite(a?.position) ? a.position : 1000;
  const bPos = Number.isFinite(b?.position) ? b.position : 1000;
  if (aPos !== bPos) return aPos - bPos;
  return String(a?.title || '').localeCompare(String(b?.title || ''));
}

function titleFromSlug(slug) {
  const cleaned = String(slug || '')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!cleaned) return 'Uncategorized';
  return cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function slugPrefixScore(docSlug, categorySlug) {
  if (!docSlug || !categorySlug) return 0;
  if (docSlug === categorySlug) return categorySlug.length + 1000;
  if (docSlug.startsWith(`${categorySlug}/`)) return categorySlug.length;
  return 0;
}

function chooseBestCategory(doc, categories) {
  const slugNorm = normalizeForMatch(doc.slug);
  if (!slugNorm) return null;

  const withScores = categories
    .map((category) => ({
      category,
      score: slugPrefixScore(slugNorm, category.slugNorm),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (withScores.length > 0) return withScores[0].category;

  const top = slugNorm.split('/')[0];
  if (!top) return null;
  return categories.find((category) => category.slugNorm === top) || null;
}

function parseBooleanEnv(value, defaultValue) {
  if (value == null || value === '') return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

async function run() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const apiToken = process.env.SANITY_API_TOKEN;
  if (!projectId) throw new Error('[sidebar-reconcile] Missing SANITY_PROJECT_ID env var');
  if (!apiToken) throw new Error('[sidebar-reconcile] Missing SANITY_API_TOKEN env var');

  const dataset = process.env.SANITY_DATASET || 'production';
  const includeDrafts = parseBooleanEnv(process.env.SANITY_INCLUDE_DRAFTS, false);

  const {createClient} = require('@sanity/client');
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    perspective: includeDrafts ? 'drafts' : 'published',
    token: apiToken,
  });

  console.log(`[sidebar-reconcile] Mode: ${APPLY_MODE ? 'apply' : 'dry-run'}`);
  console.log('[sidebar-reconcile] Fetching categories, configs, and docs...');

  const categories = await client.fetch(`
    *[_type == "sidebarCategory"] | order(position asc) {
      _id,
      title,
      "slug": slug.current,
      position,
      description,
      collapsed,
      collapsible,
      "parentId": parent->_id
    }
  `);

  const configs = await client.fetch(`
    *[_type == "sidebarConfig" && isActive == true]{
      _id,
      name,
      audience,
      categories
    }
  `);

  const docs = await client.fetch(`
    *[_type == "doc" && defined(slug.current) && hiddenFromProduction != true]{
      _id,
      title,
      "slug": slug.current,
      "categoryId": sidebarCategory->_id,
      category,
      sidebarPosition,
      hideFromSidebar
    }
  `);

  const categoriesBySlug = new Map(
    categories
      .filter((category) => category.slug)
      .map((category) => [normalizeForMatch(category.slug), category])
  );
  const categoriesById = new Map(categories.map((category) => [category._id, category]));

  const createdCategoryIds = new Map();
  let createdCategories = 0;
  let updatedCategories = 0;

  for (const blueprint of ROOT_CATEGORY_BLUEPRINT) {
    const slugNorm = normalizeForMatch(blueprint.slug);
    const existing = categoriesBySlug.get(slugNorm);

    if (existing) {
      createdCategoryIds.set(blueprint.slug, existing._id);
      const shouldPatchParent = Boolean(existing.parentId);
      const shouldPatch =
        shouldPatchParent ||
        !existing.title ||
        !Number.isFinite(existing.position) ||
        existing.collapsible == null ||
        existing.collapsed == null;

      if (shouldPatch) {
        updatedCategories += 1;
        console.log(`[sidebar-reconcile] Root category normalize -> ${blueprint.slug}`);
        if (APPLY_MODE) {
          const patch = client.patch(existing._id).set({
            title: existing.title || blueprint.title,
            position: Number.isFinite(existing.position) ? existing.position : blueprint.position,
            description: existing.description || blueprint.description,
            collapsible: existing.collapsible == null ? true : existing.collapsible,
            collapsed: existing.collapsed == null ? false : existing.collapsed,
          });
          if (shouldPatchParent) patch.unset(['parent']);
          await patch.commit();
        }
      }
      continue;
    }

    createdCategories += 1;
    console.log(`[sidebar-reconcile] Root category create -> ${blueprint.slug}`);
    if (APPLY_MODE) {
      const created = await client.create({
        _type: 'sidebarCategory',
        title: blueprint.title,
        slug: {_type: 'slug', current: blueprint.slug},
        position: blueprint.position,
        description: blueprint.description,
        collapsible: true,
        collapsed: false,
        targetAudience: ['all'],
        link: {type: 'generated-index'},
      });
      createdCategoryIds.set(blueprint.slug, created._id);
      categoriesById.set(created._id, created);
      categoriesBySlug.set(slugNorm, created);
    } else {
      const synthetic = {
        _id: `dry-root-${slugNorm}`,
        title: blueprint.title,
        slug: blueprint.slug,
        position: blueprint.position,
        description: blueprint.description,
        parentId: null,
      };
      createdCategoryIds.set(blueprint.slug, synthetic._id);
      categoriesById.set(synthetic._id, synthetic);
      categoriesBySlug.set(slugNorm, synthetic);
    }
  }

  if (!APPLY_MODE) {
    for (const blueprint of ROOT_CATEGORY_BLUEPRINT) {
      const slugNorm = normalizeForMatch(blueprint.slug);
      const existing = categoriesBySlug.get(slugNorm);
      if (existing) {
        createdCategoryIds.set(blueprint.slug, existing._id);
      }
    }
  }

  // Ensure every top-level doc prefix has a root sidebar category.
  const discoveredRootSegments = new Set();
  for (const doc of docs) {
    const slugNorm = normalizeForMatch(doc.slug);
    if (!slugNorm) continue;
    const top = slugNorm.split('/')[0];
    if (!top || top === 'index' || top === 'readme') continue;
    discoveredRootSegments.add(top);
  }

  let nextAutoPosition =
    Math.max(
      ...[...categoriesBySlug.values()].map((category) =>
        Number.isFinite(category?.position) ? Number(category.position) : 0
      ),
      ...ROOT_CATEGORY_BLUEPRINT.map((entry) => Number(entry.position) || 0),
      0
    ) + 1;

  for (const topSegment of [...discoveredRootSegments].sort()) {
    if (categoriesBySlug.has(topSegment)) continue;
    createdCategories += 1;
    console.log(`[sidebar-reconcile] Root category auto-create -> ${topSegment}`);
    if (APPLY_MODE) {
      const created = await client.create({
        _type: 'sidebarCategory',
        title: titleFromSlug(topSegment),
        slug: {_type: 'slug', current: topSegment},
        position: nextAutoPosition,
        description: `Auto-created from existing doc slugs (${topSegment})`,
        collapsible: true,
        collapsed: false,
        targetAudience: ['all'],
        link: {type: 'generated-index'},
      });
      categoriesById.set(created._id, created);
      categoriesBySlug.set(topSegment, created);
    } else {
      const synthetic = {
        _id: `dry-auto-${topSegment}`,
        title: titleFromSlug(topSegment),
        slug: topSegment,
        position: nextAutoPosition,
        description: `Auto-created from existing doc slugs (${topSegment})`,
        parentId: null,
      };
      categoriesById.set(synthetic._id, synthetic);
      categoriesBySlug.set(topSegment, synthetic);
    }
    nextAutoPosition += 1;
  }

  const rootOrder = ROOT_CATEGORY_BLUEPRINT
    .map((blueprint) => ({
      ...blueprint,
      categoryId: createdCategoryIds.get(blueprint.slug) || categoriesBySlug.get(normalizeForMatch(blueprint.slug))?._id,
    }))
    .filter((entry) => entry.categoryId);

  const autoRootOrder = [...discoveredRootSegments]
    .filter((segment) => !rootOrder.some((entry) => normalizeForMatch(entry.slug) === segment))
    .map((segment) => {
      const category = categoriesBySlug.get(segment);
      if (!category) return null;
      return {
        slug: segment,
        categoryId: category._id,
        position: Number.isFinite(category.position) ? Number(category.position) : 1000,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.position - b.position);

  const completeRootOrder = [
    ...rootOrder,
    ...autoRootOrder.map((entry) => ({
      slug: entry.slug,
      categoryId: entry.categoryId,
    })),
  ];

  let updatedConfigs = 0;
  for (const config of configs) {
    const refs = Array.isArray(config.categories) ? config.categories : [];
    const existingCategoryRefs = refs
      .map((entry) => {
        const categoryId = entry?.category?._ref;
        if (!categoryId) return null;
        return {
          _type: 'sidebarCategoryRef',
          _key: entry._key || `cat-${categoryId.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`,
          category: {_type: 'reference', _ref: categoryId},
          position: Number.isFinite(entry.position) ? entry.position : 1000,
        };
      })
      .filter(Boolean);

    const pinnedRootRefs = completeRootOrder.map((entry, idx) => ({
      _type: 'sidebarCategoryRef',
      _key: `root-${entry.slug.replace(/[^a-zA-Z0-9]/g, '-')}-${idx}`,
      category: {_type: 'reference', _ref: entry.categoryId},
      position: idx + 1,
    }));
    const pinnedRootIds = new Set(pinnedRootRefs.map((entry) => entry.category._ref));

    const extraRefs = existingCategoryRefs
      .filter((entry) => !pinnedRootIds.has(entry.category._ref))
      .sort((a, b) => (a.position || 1000) - (b.position || 1000))
      .map((entry, idx) => ({
        ...entry,
        position: completeRootOrder.length + idx + 1,
      }));

    const mergedRefs = [...pinnedRootRefs, ...extraRefs];
    const before = JSON.stringify(
      existingCategoryRefs
        .sort((a, b) => (a.position || 1000) - (b.position || 1000))
        .map((entry) => `${entry.category._ref}:${entry.position}`)
    );
    const after = JSON.stringify(mergedRefs.map((entry) => `${entry.category._ref}:${entry.position}`));

    if (before !== after) {
      updatedConfigs += 1;
      console.log(`[sidebar-reconcile] Sidebar config update -> ${config.audience || config.name}`);
      if (APPLY_MODE) {
        try {
          await client.patch(config._id).set({categories: mergedRefs}).commit();
        } catch (err) {
          console.warn(
            `[sidebar-reconcile] Warning: Failed to update sidebar config ${config._id}: ${err.message}`
          );
        }
      }
    }
  }

  const allCategories = [...categoriesById.values()]
    .map((category) => ({
      _id: category._id,
      title: category.title,
      slug: category.slug,
      slugNorm: normalizeForMatch(category.slug),
      position: category.position,
      parentId: category.parentId,
    }))
    .filter((category) => category.slugNorm)
    .sort(sortByPositionThenTitle);

  const validCategoryIds = new Set(allCategories.map((category) => category._id));

  const positionByCategory = new Map();
  for (const doc of docs) {
    if (!doc.categoryId || !validCategoryIds.has(doc.categoryId)) continue;
    const current = positionByCategory.get(doc.categoryId) || 0;
    const next = Number.isFinite(doc.sidebarPosition) ? Math.max(current, Number(doc.sidebarPosition)) : current;
    positionByCategory.set(doc.categoryId, next);
  }

  const docsNeedingCategory = docs
    .filter((doc) => !doc.hideFromSidebar)
    .filter((doc) => !doc.categoryId || !validCategoryIds.has(doc.categoryId))
    .sort((a, b) => String(a.slug || '').localeCompare(String(b.slug || '')));

  let updatedDocs = 0;
  let stillUncategorized = 0;

  for (const doc of docsNeedingCategory) {
    const bestCategory = chooseBestCategory(doc, allCategories);
    if (!bestCategory) {
      stillUncategorized += 1;
      continue;
    }

    const currentMax = positionByCategory.get(bestCategory._id) || 0;
    const hasPosition = Number.isFinite(doc.sidebarPosition);
    const nextPosition = hasPosition ? Number(doc.sidebarPosition) : currentMax + 1;
    positionByCategory.set(bestCategory._id, Math.max(currentMax, nextPosition));

    updatedDocs += 1;
    console.log(
      `[sidebar-reconcile] Doc category link -> ${doc.slug} => ${bestCategory.slug}${hasPosition ? '' : ` (sidebarPosition ${nextPosition})`}`
    );

    if (APPLY_MODE) {
      const patch = client.patch(doc._id).set({
        sidebarCategory: {_type: 'reference', _ref: bestCategory._id},
      });
      if (!hasPosition) patch.set({sidebarPosition: nextPosition});
      try {
        await patch.commit();
      } catch (err) {
        console.warn(
          `[sidebar-reconcile] Warning: Failed to update doc ${doc._id} (${doc.slug}): ${err.message}`
        );
      }
    }
  }

  console.log('');
  console.log('[sidebar-reconcile] Summary');
  console.log(`  root categories created: ${createdCategories}`);
  console.log(`  root categories normalized: ${updatedCategories}`);
  console.log(`  sidebar configs updated: ${updatedConfigs}`);
  console.log(`  docs category-linked: ${updatedDocs}`);
  console.log(`  docs still uncategorized: ${stillUncategorized}`);
  console.log(`  mode: ${APPLY_MODE ? 'apply' : 'dry-run'}`);
}

module.exports = {run};

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
