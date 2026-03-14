#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const SANITY_CONFIG = {
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
};

const OUTPUT_PATH = path.resolve(__dirname, '../classic/src/data/docs-index-data.json');

async function fetchDocsIndexData() {
  const client = createClient({
    projectId: SANITY_CONFIG.projectId,
    dataset: SANITY_CONFIG.dataset,
    apiVersion: SANITY_CONFIG.apiVersion,
    token: SANITY_CONFIG.token,
    useCdn: false,
  });

  console.log('[fetch-docs-index] Connecting to Sanity...');
  console.log(`[fetch-docs-index] Project: ${SANITY_CONFIG.projectId}, Dataset: ${SANITY_CONFIG.dataset}`);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [
    sidebarCategories,
    publishedDocs,
    landingPages,
    docsIndexConfig,
    recentlyUpdatedDocs,
  ] = await Promise.all([
    fetchSidebarCategories(client),
    fetchPublishedDocs(client),
    fetchLandingPages(client),
    fetchDocsIndexConfig(client),
    fetchRecentlyUpdatedDocs(client, sevenDaysAgo),
  ]);

  const categoriesWithCounts = calculateDocCounts(sidebarCategories, publishedDocs);

  const indexData = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCategories: sidebarCategories.length,
      totalDocs: publishedDocs.length,
      totalLandingPages: landingPages.length,
      recentlyUpdatedCount: recentlyUpdatedDocs.length,
    },
    sidebarCategories: categoriesWithCounts,
    landingPages: landingPages.map(formatLandingPage),
    docsIndexConfig: docsIndexConfig || null,
    recentlyUpdatedDocs: recentlyUpdatedDocs.map(formatDoc),
    articleCountsByCategory: calculateArticleCountsByCategory(publishedDocs),
    articleCountsByAudience: calculateArticleCountsByAudience(publishedDocs),
  };

  return indexData;
}

async function fetchSidebarCategories(client) {
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
      "parentTitle": parent->title,
      targetAudience,
      link
    }
  `);
  console.log(`[fetch-docs-index] Fetched ${categories.length} sidebar categories`);
  return categories;
}

async function fetchPublishedDocs(client) {
  const docs = await client.fetch(`
    *[_type == "doc" && status == "published" && !hiddenFromProduction] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "categorySlug": sidebarCategory->slug.current,
      "categoryTitle": sidebarCategory->title,
      "category": category,
      targetAudience,
      tags,
      sidebarPosition,
      sidebarLabel,
      hideFromSidebar,
      status,
      lastUpdated,
      "coverImageUrl": coverImage.asset->url
    }
  `);
  console.log(`[fetch-docs-index] Fetched ${docs.length} published docs`);
  return docs;
}

async function fetchLandingPages(client) {
  const pages = await client.fetch(`
    *[_type == "landingPage" && status == "published"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      layoutType,
      status,
      publishedAt,
      lastUpdated,
      "heroHeadline": hero.headline,
      "heroSubheadline": hero.subheadline
    }
  `);
  console.log(`[fetch-docs-index] Fetched ${pages.length} landing pages`);
  return pages;
}

async function fetchDocsIndexConfig(client) {
  const config = await client.fetch(`
    *[_type == "docsIndexConfig" && isActive == true][0] {
      _id,
      title,
      description,
      featuredDocs[]->{
        _id,
        title,
        "slug": slug.current,
        description
      },
      pinnedCategories[]->{
        _id,
        title,
        "slug": slug.current
      },
      customSections
    }
  `);
  if (config) {
    console.log(`[fetch-docs-index] Found docs index config: ${config.title}`);
  } else {
    console.log(`[fetch-docs-index] No active docs index config found`);
  }
  return config;
}

async function fetchRecentlyUpdatedDocs(client, sinceDate) {
  const docs = await client.fetch(`
    *[_type == "doc" && status == "published" && !hiddenFromProduction && lastUpdated >= $sinceDate] 
    | order(lastUpdated desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "categorySlug": sidebarCategory->slug.current,
      "categoryTitle": sidebarCategory->title,
      lastUpdated,
      targetAudience
    }
  `, { sinceDate });
  console.log(`[fetch-docs-index] Fetched ${docs.length} recently updated docs (since ${sinceDate})`);
  return docs;
}

function calculateDocCounts(categories, docs) {
  const categoryDocCounts = new Map();
  
  docs.forEach(doc => {
    const categorySlug = doc.categorySlug || doc.category || 'uncategorized';
    categoryDocCounts.set(categorySlug, (categoryDocCounts.get(categorySlug) || 0) + 1);
  });

  return categories.map(cat => ({
    id: cat._id,
    title: cat.title,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    position: cat.position,
    parentId: cat.parentId,
    parentTitle: cat.parentTitle,
    targetAudience: cat.targetAudience,
    collapsed: cat.collapsed,
    collapsible: cat.collapsible,
    link: cat.link,
    docCount: categoryDocCounts.get(cat.slug) || 0,
  }));
}

function calculateArticleCountsByCategory(docs) {
  const counts = {};
  docs.forEach(doc => {
    const category = doc.categorySlug || doc.category || 'uncategorized';
    counts[category] = (counts[category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

function calculateArticleCountsByAudience(docs) {
  const counts = {};
  docs.forEach(doc => {
    const audiences = doc.targetAudience || ['all'];
    audiences.forEach(audience => {
      counts[audience] = (counts[audience] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([audience, count]) => ({ audience, count }))
    .sort((a, b) => b.count - a.count);
}

function formatLandingPage(page) {
  return {
    id: page._id,
    title: page.title,
    slug: page.slug,
    description: page.description,
    layoutType: page.layoutType,
    status: page.status,
    publishedAt: page.publishedAt,
    lastUpdated: page.lastUpdated,
    heroHeadline: page.heroHeadline,
    heroSubheadline: page.heroSubheadline,
  };
}

function formatDoc(doc) {
  return {
    id: doc._id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    categorySlug: doc.categorySlug || doc.category,
    categoryTitle: doc.categoryTitle,
    targetAudience: doc.targetAudience,
    tags: doc.tags,
    sidebarPosition: doc.sidebarPosition,
    sidebarLabel: doc.sidebarLabel,
    hideFromSidebar: doc.hideFromSidebar,
    status: doc.status,
    lastUpdated: doc.lastUpdated,
    coverImageUrl: doc.coverImageUrl,
  };
}

async function ensureOutputDirectory() {
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[fetch-docs-index] Created directory: ${dir}`);
  }
}

async function main() {
  try {
    console.log('[fetch-docs-index] Starting docs index data generation...\n');

    const indexData = await fetchDocsIndexData();

    await ensureOutputDirectory();

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(indexData, null, 2));

    console.log(`\n[fetch-docs-index] ✅ Generated docs index data successfully!`);
    console.log(`[fetch-docs-index] Output: ${OUTPUT_PATH}`);
    console.log(`[fetch-docs-index] Summary:`);
    console.log(`  - Categories: ${indexData.summary.totalCategories}`);
    console.log(`  - Docs: ${indexData.summary.totalDocs}`);
    console.log(`  - Landing Pages: ${indexData.summary.totalLandingPages}`);
    console.log(`  - Recently Updated: ${indexData.summary.recentlyUpdatedCount}`);

  } catch (error) {
    console.error('[fetch-docs-index] ❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { fetchDocsIndexData, main };

if (require.main === module) {
  main();
}
