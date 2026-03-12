#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const SITE_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(SITE_DIR, 'src', 'pages');

function walkTsxFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTsxFiles(fullPath, out);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith('.tsx')) out.push(fullPath);
  }
  return out;
}

function fileToRoute(filePath) {
  const relative = path.relative(PAGES_DIR, filePath).replace(/\\/g, '/');
  const withoutExt = relative.replace(/\.tsx$/, '');
  if (withoutExt === 'index') return '/';
  if (withoutExt.endsWith('/index')) return `/${withoutExt.replace(/\/index$/, '')}`;
  return `/${withoutExt}`;
}

function toTitleCaseSegment(segment) {
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function guessTitleFromRoute(route) {
  const cleaned = route.replace(/^\/+/, '');
  if (!cleaned) return 'Home';
  const segments = cleaned.split('/').filter(Boolean);
  return segments.map(toTitleCaseSegment).join(' - ');
}

function inferLayoutType(route) {
  if (route.startsWith('/roles/')) return 'role';
  if (route.startsWith('/quick-start/') || route === '/getting-started') return 'quick-start';
  if (route.startsWith('/internal-releases')) return 'internal-releases';
  if (route.startsWith('/releases')) return 'releases';
  if (route === '/towers') return 'tower-guide';
  return 'standard';
}

function inferBadge(layoutType) {
  if (layoutType === 'role') return { icon: 'Users', text: 'Role Workspace' };
  if (layoutType === 'quick-start') return { icon: 'Rocket', text: 'Quick Start' };
  if (layoutType === 'releases') return { icon: 'Calendar', text: 'Release Notes' };
  if (layoutType === 'internal-releases') return { icon: 'Shield', text: 'Internal Releases' };
  if (layoutType === 'tower-guide') return { icon: 'RadioTower', text: 'Tower Guide' };
  return { icon: 'FileText', text: 'Landing Page' };
}

function readLayoutMeta(filePath, route) {
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/title="([^"]+)"/);
  const descriptionMatch = content.match(/description="([^"]+)"/);

  const title = titleMatch?.[1]?.trim() || guessTitleFromRoute(route);
  const description =
    descriptionMatch?.[1]?.trim() ||
    `Landing page for ${title}. This page is now managed via Sanity CMS.`;

  return { title, description };
}

function buildBreadcrumbs(route, title) {
  const cleaned = route.replace(/^\/+/, '');
  const segments = cleaned.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const items = [{ label: 'Home', href: '/' }];
  let accum = '';
  segments.forEach((segment, idx) => {
    accum += `/${segment}`;
    items.push({
      label: idx === segments.length - 1 ? title : toTitleCaseSegment(segment),
      href: idx === segments.length - 1 ? undefined : accum,
    });
  });
  return items;
}

function discoverLandingFiles() {
  const files = walkTsxFiles(PAGES_DIR);
  return files
    .filter((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('LandingPageBackground');
    })
    .map((filePath) => ({
      filePath,
      route: fileToRoute(filePath),
      slug: fileToRoute(filePath).replace(/^\/+/, ''),
    }))
    .filter((entry) => entry.slug)
    .sort((a, b) => a.route.localeCompare(b.route));
}

function sanitizeIdPart(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseArgs(argv) {
  const flags = new Set(argv || []);
  return {
    apply: flags.has('--apply'),
    force: flags.has('--force'),
  };
}

async function run(options = {}) {
  const projectId = process.env.SANITY_PROJECT_ID || 'fjjuacab';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;
  const apply = !!options.apply;
  const force = !!options.force;

  if (!token) {
    throw new Error('[landing-seed] Missing SANITY_API_TOKEN env var');
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token,
  });

  const routes = discoverLandingFiles();
  let plannedCreates = 0;
  let plannedUpdates = 0;
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const routeEntry of routes) {
    const { filePath, route, slug } = routeEntry;
    const existing = await client.fetch(`*[_type == "landingPage" && slug.current == $slug][0]{_id,status,title}`, {
      slug,
    });

    const { title, description } = readLayoutMeta(filePath, route);
    const layoutType = inferLayoutType(route);
    const badge = inferBadge(layoutType);
    const today = new Date().toISOString().slice(0, 10);

    const doc = {
      _type: 'landingPage',
      title,
      slug: { _type: 'slug', current: slug },
      description,
      layoutType,
      showBackground: true,
      breadcrumbs: buildBreadcrumbs(route, title),
      hero: {
        badge,
        headline: title,
        subheadline: description,
        ctaButtons: [
          { label: 'Browse Documentation', href: '/docs', variant: 'primary' },
        ],
      },
      sections: [
        {
          _type: 'landingSectionCustom',
          title: 'Migration Notice',
          customBody: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  text: `This landing page route (${route}) is now managed in Sanity. You can edit this content in Studio and publish updates without code changes.`,
                  marks: [],
                },
              ],
            },
          ],
        },
      ],
      status: 'published',
      publishedAt: today,
      lastUpdated: today,
    };

    if (!existing) {
      plannedCreates += 1;
      if (apply) {
        const docId = `landingPage.${sanitizeIdPart(slug.replace(/\//g, '--'))}`;
        await client.createIfNotExists({ _id: docId, ...doc });
        created += 1;
      }
      continue;
    }

    if (!force) {
      skipped += 1;
      continue;
    }

    plannedUpdates += 1;
    if (apply) {
      await client.patch(existing._id).set(doc).commit({ autoGenerateArrayKeys: true });
      updated += 1;
    }
  }

  console.log(`[landing-seed] Routes discovered: ${routes.length}`);
  console.log(`[landing-seed] Planned creates: ${plannedCreates}, planned updates: ${plannedUpdates}, skipped existing: ${skipped}`);
  if (apply) {
    console.log(`[landing-seed] Applied creates: ${created}, applied updates: ${updated}`);
  } else {
    console.log('[landing-seed] Dry run only. Use --apply to write to Sanity.');
  }
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  run(args).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { run };
