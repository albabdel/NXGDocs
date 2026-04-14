#!/usr/bin/env node
/**
 * Seed the correct sidebarCategory hierarchy in Sanity.
 *
 * Run from repo root:
 *   node studio/scripts/seed-sidebar-categories.js
 *
 * Requires env vars: SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID), SANITY_API_TOKEN
 *
 * The script is fully idempotent — safe to run multiple times.
 * It uses stable _id values derived from slugs so repeated runs
 * update rather than duplicate.
 */

import { readFileSync } from 'fs';
import { createClient } from '@sanity/client';

// Load .env manually (no dotenv dependency needed)
try {
  const envPath = new URL('../../.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env not found — rely on environment
}

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const apiToken = process.env.SANITY_API_TOKEN;
const dataset =
  process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  console.error('ERROR: Missing SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID env var');
  process.exit(1);
}
if (!apiToken) {
  console.error('ERROR: Missing SANITY_API_TOKEN env var');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-06',
  useCdn: false,
  token: apiToken,
});

/** Derive a stable Sanity _id from a slug */
function catId(slug) {
  return `sidebar-cat-${slug.replace(/[^a-zA-Z0-9]/g, '-')}`;
}

/**
 * Category definitions.
 * `parent` is the slug of the parent category (omit for root categories).
 * `link.type` one of: 'generated-index' | 'none'
 */
const CATEGORIES = [
  // ────────────────────────────────────────────────────────────────────────────
  // ROOT CATEGORIES
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to get up and running with GCXONE.',
    position: 1,
    collapsed: false,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'platform-fundamentals',
    title: 'Platform Fundamentals',
    description: 'Core architecture and system fundamentals.',
    position: 2,
    collapsed: true,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices-integrations',
    title: 'Devices & Integrations',
    description: 'Connect, configure, and monitor devices and integrations.',
    position: 3,
    collapsed: true,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'platform-features',
    title: 'Platform Features',
    description: 'Explore the full capabilities of the GCXONE platform.',
    position: 4,
    collapsed: true,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'breakthroughs-add-ons',
    title: 'Breakthroughs & Add-ons',
    description: 'Advanced features, AI capabilities, and premium add-ons.',
    position: 5,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'installer-guide',
    title: 'Installer Guide',
    description: 'Installation and setup procedures.',
    position: 6,
    collapsed: true,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'operator-guide',
    title: 'Operator Guide',
    description: 'Daily operations and monitoring workflows.',
    position: 7,
    collapsed: true,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'admin-guide',
    title: 'Admin Guide',
    description: 'System administration and configuration.',
    position: 8,
    collapsed: true,
    collapsible: true,
    linkType: 'generated-index',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'datasheets-specs',
    title: 'Datasheets & Specs',
    description: 'Compliance, privacy, glossary, and FAQ.',
    position: 9,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    targetAudience: ['all'],
    product: 'gcxone',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PLATFORM FUNDAMENTALS  — sub-categories
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'platform-fundamentals/architecture',
    title: 'Architecture',
    position: 1,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-fundamentals',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'platform-fundamentals/talos-integration',
    title: 'Talos Integration',
    position: 2,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-fundamentals',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'platform-fundamentals/core-processes',
    title: 'Core Processes',
    position: 3,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-fundamentals',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'platform-fundamentals/user-management',
    title: 'User Management',
    position: 4,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-fundamentals',
    targetAudience: ['all'],
    product: 'gcxone',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // DEVICES & INTEGRATIONS  — sub-categories
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'devices/nvr',
    title: 'NVR',
    position: 1,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices/ip-camera',
    title: 'IP Camera',
    position: 2,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices/cloud-vms',
    title: 'Cloud VMS',
    position: 3,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices/ai-box',
    title: 'AI Box',
    position: 4,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices/router',
    title: 'Router',
    position: 5,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices/pir-cam',
    title: 'PIR CAM',
    position: 6,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'devices/other',
    title: 'Other',
    position: 7,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'devices-integrations',
    targetAudience: ['all'],
    product: 'gcxone',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PLATFORM FEATURES  — sub-categories
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'features/video-monitoring',
    title: 'Video Monitoring',
    position: 1,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-features',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'features/alarms-ai',
    title: 'Alarms & AI',
    position: 2,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-features',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'features/audio',
    title: 'Audio',
    position: 3,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-features',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'features/navigation-search',
    title: 'Navigation & Search',
    position: 4,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-features',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'features/operational-tools',
    title: 'Operational Tools',
    position: 5,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'platform-features',
    targetAudience: ['all'],
    product: 'gcxone',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // INSTALLER GUIDE  — sub-categories
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'installer-guide/pre-installation',
    title: 'Pre-Installation',
    position: 1,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'installer-guide',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'installer-guide/installation',
    title: 'Installation',
    position: 2,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'installer-guide',
    targetAudience: ['all'],
    product: 'gcxone',
  },
  {
    slug: 'installer-guide/post-installation',
    title: 'Post-Installation',
    position: 3,
    collapsed: true,
    collapsible: true,
    linkType: 'none',
    parent: 'installer-guide',
    targetAudience: ['all'],
    product: 'gcxone',
  },
];

// ──────────────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`[seed] Connecting to Sanity project ${projectId} / dataset ${dataset}`);

  // Build _id → slug map for parent resolution
  const slugToId = new Map(
    CATEGORIES.map((cat) => [cat.slug, catId(cat.slug)])
  );

  // Fetch existing categories to report what's new vs updated
  const existing = await client.fetch(
    `*[_type == "sidebarCategory"]{_id, "slug": slug.current}`
  );
  const existingIds = new Set(existing.map((d) => d._id));
  console.log(`[seed] Found ${existing.length} existing sidebarCategory documents`);

  let created = 0;
  let updated = 0;

  for (const cat of CATEGORIES) {
    const id = catId(cat.slug);

    const doc = {
      _id: id,
      _type: 'sidebarCategory',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      position: cat.position,
      collapsed: cat.collapsed,
      collapsible: cat.collapsible,
      targetAudience: cat.targetAudience,
      product: cat.product,
    };

    if (cat.description) {
      doc.description = cat.description;
    }

    if (cat.linkType && cat.linkType !== 'none') {
      doc.link = { type: cat.linkType };
      if (cat.description) doc.link.description = cat.description;
    }

    if (cat.parent) {
      const parentId = slugToId.get(cat.parent);
      if (!parentId) {
        console.warn(`[seed] WARNING: parent slug "${cat.parent}" not found for "${cat.slug}" — skipping parent ref`);
      } else {
        doc.parent = { _type: 'reference', _ref: parentId };
      }
    }

    await client.createOrReplace(doc);

    if (existingIds.has(id)) {
      console.log(`  [updated] ${cat.title} (${cat.slug})`);
      updated++;
    } else {
      console.log(`  [created] ${cat.title} (${cat.slug})`);
      created++;
    }
  }

  console.log(`\n[seed] Done — ${created} created, ${updated} updated`);
  console.log('[seed] Next: run the sidebar generation script to regenerate sidebars.ts');
  console.log('  node scripts/generate-sidebars-from-sanity.js');
}

run().catch((err) => {
  console.error('[seed] Error:', err.message);
  process.exit(1);
});
