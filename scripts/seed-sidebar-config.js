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
      description: 'Get started with NXGEN GCXONE platform',
      collapsed: false,
      subcategories: [],
      docs: [
        'getting-started/GCXONE-talos-interaction',
        'getting-started/bandwidth-requirements',
      ],
    },
    {
      title: 'Admin & Configuration',
      slug: 'admin-guide',
      icon: '🛡️',
      position: 2,
      description: 'Administration and configuration guides',
      collapsed: false,
      subcategories: [],
      docs: [
        'admin-guide/dashboard-overview',
        'admin-guide/active-sites-widget',
        'admin-guide/alarm-volume-analytics',
        'admin-guide/device-health-status',
        'admin-guide/creating-customers',
        'admin-guide/creating-sites',
        'admin-guide/site-groups',
        'admin-guide/creating-users',
        'admin-guide/rbac',
        'admin-guide/permissions-matrix',
        'admin-guide/custom-properties-overview',
        'admin-guide/custom-property-hierarchy',
        'admin-guide/event-clip-configuration',
        'admin-guide/timezone-management',
      ],
    },
    {
      title: 'Devices',
      slug: 'devices',
      icon: '📱',
      position: 3,
      description: 'Device configuration guides for all supported devices',
      collapsed: false,
      subcategories: [
        { title: 'ADPRO', slug: 'adpro', icon: '📷', position: 1, docs: ['devices/adpro/installer-configuration'] },
        { title: 'Hikvision', slug: 'hikvision', icon: '📷', position: 2, docs: [] },
        { title: 'Dahua', slug: 'dahua', icon: '📷', position: 3, docs: [] },
        { title: 'Hanwha', slug: 'hanwha', icon: '📷', position: 4, docs: [] },
        { title: 'Milestone', slug: 'milestone', icon: '📷', position: 5, docs: [] },
        { title: 'Axxon', slug: 'axxon', icon: '📷', position: 6, docs: [] },
        { title: 'Camect', slug: 'camect', icon: '📷', position: 7, docs: [] },
        { title: 'Axis', slug: 'axis', icon: '📷', position: 8, docs: [] },
        { title: 'Heitel', slug: 'heitel', icon: '📷', position: 9, docs: [] },
        { title: 'Reconeyez', slug: 'reconeyez', icon: '📷', position: 10, docs: [] },
        { title: 'Teltonika', slug: 'teltonika', icon: '📷', position: 11, docs: [] },
        { title: 'GCXONE Audio', slug: 'GCXONE-audio', icon: '🎵', position: 12, docs: ['devices/GCXONE-audio/installer-configuration', 'devices/GCXONE-audio/operator-view'] },
        { title: 'Avigilon', slug: 'avigilon', icon: '📷', position: 13, docs: [] },
        { title: 'InnoVi', slug: 'innovi', icon: '📷', position: 14, docs: ['devices/innovi/admin-configuration'] },
        { title: 'Ajax', slug: 'ajax', icon: '📷', position: 15, docs: [] },
        { title: 'EagleEye', slug: 'eagleeye', icon: '📷', position: 16, docs: [] },
        { title: 'Ganz', slug: 'ganz', icon: '📷', position: 17, docs: [] },
        { title: 'Uniview', slug: 'uniview', icon: '📷', position: 18, docs: [] },
        { title: 'Generic Devices', slug: 'generic-devices', icon: '📷', position: 19, docs: [] },
      ],
      docs: [],
    },
    {
      title: 'Features',
      slug: 'features',
      icon: '⚡',
      position: 4,
      description: 'Feature guides and configuration',
      collapsed: false,
      subcategories: [
        { title: 'AI Analytics', slug: 'ai-analytics', icon: '🤖', position: 1, docs: [] },
        { title: 'Video Streaming', slug: 'video-streaming', icon: '🎥', position: 2, docs: [] },
        { title: 'PTZ Control', slug: 'ptz-control', icon: '🎮', position: 3, docs: [] },
        { title: 'Event Clips', slug: 'event-clips', icon: '🎬', position: 4, docs: [] },
        { title: 'Playback', slug: 'playback', icon: '▶️', position: 5, docs: [] },
        { title: 'Live View', slug: 'live-view', icon: '👁️', position: 6, docs: [] },
        { title: 'Motion Detection', slug: 'motion-detection', icon: '🔍', position: 7, docs: [] },
        { title: 'Line Crossing', slug: 'line-crossing', icon: '📏', position: 8, docs: [] },
        { title: 'Intrusion Detection', slug: 'intrusion-detection', icon: '🚨', position: 9, docs: [] },
        { title: 'Face Detection', slug: 'face-detection', icon: '😊', position: 10, docs: [] },
        { title: 'License Plate Recognition', slug: 'lpr', icon: '🚗', position: 11, docs: [] },
        { title: 'Audio Detection', slug: 'audio-detection', icon: '🔊', position: 12, docs: [] },
        { title: 'Tamper Detection', slug: 'tamper-detection', icon: '🔧', position: 13, docs: [] },
        { title: 'People Counting', slug: 'people-counting', icon: '👥', position: 14, docs: [] },
        { title: 'Heat Mapping', slug: 'heat-mapping', icon: '🗺️', position: 15, docs: [] },
      ],
      docs: [],
    },
    {
      title: 'Alarm Management (Talos)',
      slug: 'alarm-management',
      icon: '🔔',
      position: 5,
      description: 'Alarm management and monitoring with Talos',
      collapsed: false,
      subcategories: [],
      docs: [
        'alarm-management/talos-dashboard',
        'alarm-management/alarm-queue',
        'alarm-management/alarm-prioritization',
        'alarm-management/alarm-actions',
        'alarm-management/escalation-rules',
        'alarm-management/alarm-filtering',
        'alarm-management/alarm-history',
        'alarm-management/alarm-notifications',
        'alarm-management/alarm-routing',
        'alarm-management/alarm-metrics',
        'alarm-management/false-alarms',
        'alarm-management/alarm-verification',
        'alarm-management/multi-site-alarms',
        'alarm-management/alarm-sla',
        'alarm-management/alarm-integration',
        'alarm-management/alarm-reporting',
        'alarm-management/alarm-troubleshooting',
        'alarm-management/alarm-best-practices',
        'alarm-management/operator-training',
        'alarm-management/system-health',
      ],
    },
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
