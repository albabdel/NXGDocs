#!/usr/bin/env node
/**
 * Seed sidebar categories and configurations to Sanity.
 * This script creates the sidebar structure based on the existing sidebars.ts configuration.
 * 
 * Usage:
 *   node scripts/seed-sidebar-config.js
 *
 * Environment variables:
 *   SANITY_PROJECT_ID - Sanity project ID
 *   SANITY_API_TOKEN - Sanity API token (with write permissions)
 *   SANITY_DATASET - Sanity dataset (default: production)
 */
'use strict';

const SIDEBAR_STRUCTURE = {
  mainCategories: [
    {
      title: 'Getting Started',
      slug: 'getting-started',
      icon: '🚀',
      position: 1,
      description: 'Getting Started',
      collapsed: false,
      subcategories: [],
      docs: [],
    },
    {
      title: 'Platform Fundamentals',
      slug: 'platform-fundamentals',
      icon: '🏢',
      position: 2,
      description: 'Platform Architecture and Concepts',
      collapsed: false,
      subcategories: [
        { title: 'Talos Integration', slug: 'talos-integration', icon: '🔗', position: 1, docs: [] },
        { title: 'Core Processes', slug: 'core-processes', icon: '⚙️', position: 2, docs: [] },
        { title: 'User Management', slug: 'user-management', icon: '👥', position: 3, docs: [] },
        { title: 'General', slug: 'general', icon: '📝', position: 4, docs: [] }
      ],
      docs: [],
    },
    {
      title: 'Devices',
      slug: 'devices',
      icon: '📱',
      position: 3,
      description: 'Device Integration and Management',
      collapsed: false,
      subcategories: [
        { title: 'IP Cameras', slug: 'ip-cameras', icon: '📹', position: 1, docs: [] },
        { title: 'VMS & Platforms', slug: 'vms-platforms', icon: '🖥️', position: 2, docs: [] },
        { title: 'Security & Sensors', slug: 'security-sensors', icon: '🚨', position: 3, docs: [] },
        { title: 'Power & Infrastructure', slug: 'power-infrastructure', icon: '🔋', position: 4, docs: [] }
      ],
      docs: ['add-a-device-to-gcxone'],
    },
    {
      title: 'Platform Functions',
      slug: 'platform-functions',
      icon: '⚙️',
      position: 4,
      description: 'Core platform functionalities',
      collapsed: false,
      subcategories: [
        { title: 'Video Monitoring', slug: 'video-monitoring', icon: '👁️', position: 1, docs: [] },
        { title: 'Alarms & AI', slug: 'alarms-ai', icon: '🤖', position: 2, docs: [] },
        { title: 'Navigation & Search', slug: 'navigation-search', icon: '🔍', position: 3, docs: [] },
        { title: 'Operational Modes', slug: 'operational-modes', icon: '🎛️', position: 4, docs: [] }
      ],
      docs: [],
    },
    {
      title: 'Breakthroughs',
      slug: 'breakthroughs',
      icon: '💡',
      position: 5,
      description: 'Advanced Features and Innovations',
      collapsed: false,
      subcategories: [],
      docs: [],
    },
    {
      title: 'Installer Guide',
      slug: 'installer-guide',
      icon: '🔧',
      position: 6,
      description: 'Installation and setup procedures',
      collapsed: false,
      subcategories: [
        { title: 'Pre-Installation', slug: 'pre-installation', icon: '📋', position: 1, docs: [] },
        { title: 'Installation', slug: 'installation', icon: '🔨', position: 2, docs: [] },
        { title: 'Post-Installation', slug: 'post-installation', icon: '✅', position: 3, docs: [] }
      ],
      docs: ['installation-overview'],
    },
    {
      title: 'Operator Guide',
      slug: 'operator-guide',
      icon: '👨‍💻',
      position: 7,
      description: 'Daily operations and usage',
      collapsed: false,
      subcategories: [
        { title: 'Handling Alarms', slug: 'handling-alarms', icon: '🔔', position: 1, docs: [] }
      ],
      docs: [],
    },
    {
      title: 'Alarm Management',
      slug: 'alarm-management',
      icon: '🚨',
      position: 8,
      description: 'Alarm configurations and routing',
      collapsed: false,
      subcategories: [
        { title: 'Redundant Alarms', slug: 'redundant-alarms', icon: '🔄', position: 1, docs: [] }
      ],
      docs: [],
    },
    {
      title: 'Reporting',
      slug: 'reporting',
      icon: '📊',
      position: 9,
      description: 'System reports and analytics',
      collapsed: false,
      subcategories: [],
      docs: [],
    },
    {
      title: 'API Reference',
      slug: 'api-reference',
      icon: '🔌',
      position: 10,
      description: 'Developer APIs and integrations',
      collapsed: false,
      subcategories: [],
      docs: [],
    },
    {
      title: 'Knowledge Base',
      slug: 'knowledge-base',
      icon: '📚',
      position: 11,
      description: 'Troubleshooting and FAQs',
      collapsed: false,
      subcategories: [],
      docs: [],
    }
  ],
  audiences: [
    { name: 'Default Sidebar', audience: 'all', showHomeLink: true },
    { name: 'Admin Sidebar', audience: 'admin', showHomeLink: true },
    { name: 'Manager Sidebar', audience: 'manager', showHomeLink: true },
    { name: 'Operator Sidebar', audience: 'operator', showHomeLink: true },
    { name: 'Operator Minimal Sidebar', audience: 'operator-minimal', showHomeLink: true },
    { name: 'Internal Sidebar', audience: 'internal', showHomeLink: true },
  ],
};

async function run() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const apiToken = process.env.SANITY_API_TOKEN;

  if (!projectId) {
    throw new Error('[seed-sidebar] Missing SANITY_PROJECT_ID env var');
  }
  if (!apiToken) {
    throw new Error('[seed-sidebar] Missing SANITY_API_TOKEN env var');
  }

  const dataset = process.env.SANITY_DATASET || 'production';

  const { createClient } = require('@sanity/client');

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  });

  console.log('[seed-sidebar] Connecting to Sanity...');
  console.log(`[seed-sidebar] Project: ${projectId}, Dataset: ${dataset}`);

  // Track created category IDs for reference
  const categoryIdMap = new Map();
  const subcategoryIdMap = new Map();

  // Step 1: Create main categories
  console.log('\n[seed-sidebar] Creating main sidebar categories...');
  
  for (const mainCat of SIDEBAR_STRUCTURE.mainCategories) {
    // Check if category already exists
    const existing = await client.fetch(
      `*[_type == "sidebarCategory" && slug.current == $slug][0]._id`,
      { slug: mainCat.slug }
    );

    if (existing) {
      console.log(`[seed-sidebar] Category "${mainCat.title}" already exists, updating...`);
      const updated = await client
        .patch(existing)
        .set({
          title: mainCat.title,
          icon: mainCat.icon,
          position: mainCat.position,
          description: mainCat.description,
          collapsed: mainCat.collapsed,
          collapsible: true,
          targetAudience: ['all'],
          link: { type: 'generated-index' },
        })
        .commit();
      categoryIdMap.set(mainCat.slug, updated._id);
    } else {
      const doc = await client.create({
        _type: 'sidebarCategory',
        title: mainCat.title,
        slug: { _type: 'slug', current: mainCat.slug },
        icon: mainCat.icon,
        position: mainCat.position,
        description: mainCat.description,
        collapsed: mainCat.collapsed,
        collapsible: true,
        targetAudience: ['all'],
        link: { type: 'generated-index' },
      });
      categoryIdMap.set(mainCat.slug, doc._id);
      console.log(`[seed-sidebar] Created: ${mainCat.icon} ${mainCat.title} (position ${mainCat.position})`);
    }
  }

  // Step 2: Create subcategories
  console.log('\n[seed-sidebar] Creating subcategories...');
  
  for (const mainCat of SIDEBAR_STRUCTURE.mainCategories) {
    if (!mainCat.subcategories || mainCat.subcategories.length === 0) continue;
    
    const parentId = categoryIdMap.get(mainCat.slug);
    if (!parentId) continue;

    for (const subCat of mainCat.subcategories) {
      const subSlug = `${mainCat.slug}/${subCat.slug}`;
      
      const existing = await client.fetch(
        `*[_type == "sidebarCategory" && slug.current == $slug][0]._id`,
        { slug: subSlug }
      );

      if (existing) {
        console.log(`[seed-sidebar] Subcategory "${subCat.title}" already exists, updating...`);
        const updated = await client
          .patch(existing)
          .set({
            title: subCat.title,
            icon: subCat.icon,
            position: subCat.position,
            parent: { _type: 'reference', _ref: parentId },
            collapsible: true,
            collapsed: false,
            targetAudience: ['all'],
            link: { type: 'generated-index' },
          })
          .commit();
        subcategoryIdMap.set(subSlug, updated._id);
      } else {
        const doc = await client.create({
          _type: 'sidebarCategory',
          title: subCat.title,
          slug: { _type: 'slug', current: subSlug },
          icon: subCat.icon,
          position: subCat.position,
          parent: { _type: 'reference', _ref: parentId },
          collapsible: true,
          collapsed: false,
          targetAudience: ['all'],
          link: { type: 'generated-index' },
        });
        subcategoryIdMap.set(subSlug, doc._id);
        console.log(`[seed-sidebar] Created subcategory: ${subCat.icon} ${subCat.title} → ${mainCat.title}`);
      }
    }
  }

  // Step 3: Create sidebar configurations for each audience
  console.log('\n[seed-sidebar] Creating sidebar configurations...');

  for (const config of SIDEBAR_STRUCTURE.audiences) {
    const existing = await client.fetch(
      `*[_type == "sidebarConfig" && audience == $audience && isActive == true][0]._id`,
      { audience: config.audience }
    );

    if (existing) {
      console.log(`[seed-sidebar] Sidebar config for "${config.audience}" already exists, skipping...`);
      continue;
    }

    // Build category references
    const categoryRefs = SIDEBAR_STRUCTURE.mainCategories.map((cat, idx) => ({
      _key: `cat-${idx}`,
      _type: 'sidebarCategoryRef',
      category: { _type: 'reference', _ref: categoryIdMap.get(cat.slug) },
      position: cat.position,
    }));

    const doc = await client.create({
      _type: 'sidebarConfig',
      name: config.name,
      audience: config.audience,
      showHomeLink: config.showHomeLink,
      homeLinkLabel: 'Home',
      categories: categoryRefs,
      isActive: true,
    });
    console.log(`[seed-sidebar] Created sidebar config: ${config.name} for ${config.audience}`);
  }

  // Step 4: Update existing docs to reference their categories
  console.log('\n[seed-sidebar] Updating documents with sidebar category references...');

  // Fetch all existing docs
  const existingDocs = await client.fetch(`
    *[_type == "doc" && defined(slug.current)] {
      _id,
      "slug": slug.current,
      title
    }
  `);

  console.log(`[seed-sidebar] Found ${existingDocs.length} documents to process`);

  let updatedCount = 0;

  for (const mainCat of SIDEBAR_STRUCTURE.mainCategories) {
    const mainCategoryId = categoryIdMap.get(mainCat.slug);
    
    // Update docs directly in main category
    for (const docSlug of mainCat.docs) {
      const doc = existingDocs.find(d => d.slug === docSlug);
      if (!doc) {
        console.log(`[seed-sidebar] Document not found: ${docSlug}`);
        continue;
      }

      try {
        await client
          .patch(doc._id)
          .set({
            sidebarCategory: { _type: 'reference', _ref: mainCategoryId },
            sidebarPosition: mainCat.docs.indexOf(docSlug) + 1,
          })
          .commit();
        updatedCount++;
        console.log(`[seed-sidebar] Linked "${doc.title}" → ${mainCat.title}`);
      } catch (err) {
        console.warn(`[seed-sidebar] Failed to update ${doc.slug}: ${err.message}`);
      }
    }

    // Update docs in subcategories
    for (const subCat of mainCat.subcategories || []) {
      const subSlug = `${mainCat.slug}/${subCat.slug}`;
      const subCategoryId = subcategoryIdMap.get(subSlug);
      if (!subCategoryId) continue;

      for (const docSlug of subCat.docs) {
        const fullSlug = `devices/${subCat.slug}/${docSlug.split('/').pop()}`;
        const doc = existingDocs.find(d => 
          d.slug === docSlug || 
          d.slug === fullSlug ||
          d.slug.endsWith(docSlug.split('/').pop())
        );
        
        if (!doc) {
          console.log(`[seed-sidebar] Document not found: ${docSlug} (tried: ${fullSlug})`);
          continue;
        }

        try {
          await client
            .patch(doc._id)
            .set({
              sidebarCategory: { _type: 'reference', _ref: subCategoryId },
              sidebarPosition: subCat.docs.indexOf(docSlug) + 1,
            })
            .commit();
          updatedCount++;
          console.log(`[seed-sidebar] Linked "${doc.title}" → ${mainCat.title} > ${subCat.title}`);
        } catch (err) {
          console.warn(`[seed-sidebar] Failed to update ${doc.slug}: ${err.message}`);
        }
      }
    }
  }

  console.log(`\n[seed-sidebar] ✅ Done!`);
  console.log(`[seed-sidebar] Created/updated ${categoryIdMap.size + subcategoryIdMap.size} categories`);
  console.log(`[seed-sidebar] Updated ${updatedCount} documents with category references`);
  console.log(`[seed-sidebar] Created ${SIDEBAR_STRUCTURE.audiences.length} sidebar configurations`);
  console.log('\n[seed-sidebar] Next steps:');
  console.log('  1. Open Sanity Studio to verify the sidebar structure');
  console.log('  2. Run "node scripts/generate-sidebars-from-sanity.js" to generate Docusaurus sidebars');
  console.log('  3. Build the site to see changes reflected in production');
}

module.exports = { run };

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
