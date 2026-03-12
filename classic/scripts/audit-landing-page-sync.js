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

function discoverHardcodedLandingRoutes() {
  const files = walkTsxFiles(PAGES_DIR);
  const landingFiles = files.filter((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('LandingPageBackground') || content.includes('SanityLandingPageRoute');
  });

  return landingFiles
    .map((file) => {
      const content = fs.readFileSync(file, 'utf8');
      return {
        route: fileToRoute(file),
        file: path.relative(SITE_DIR, file).replace(/\\/g, '/'),
        usesSanityWrapper: content.includes('SanityLandingPageRoute'),
      };
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}

function parseArgs(argv) {
  const flags = new Set(argv || []);
  return {
    strict: flags.has('--strict'),
    strictCollisions: flags.has('--strict-collisions'),
  };
}

async function fetchSanityLandingPages(client) {
  return client.fetch(`*[_type == "landingPage" && !(_id in path("drafts.**"))]{
    _id,
    title,
    status,
    "slug": slug.current,
    _updatedAt
  }`);
}

async function run(options = {}) {
  const projectId = process.env.SANITY_PROJECT_ID || 'fjjuacab';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    throw new Error('[landing-audit] Missing SANITY_API_TOKEN env var');
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token,
  });

  const hardcoded = discoverHardcodedLandingRoutes();
  const sanityPages = await fetchSanityLandingPages(client);

  const sanityByRoute = new Map();
  for (const page of sanityPages) {
    if (!page.slug) continue;
    const route = page.slug.startsWith('/') ? page.slug : `/${page.slug}`;
    if (!sanityByRoute.has(route)) sanityByRoute.set(route, []);
    sanityByRoute.get(route).push(page);
  }

  const hardcodedRouteSet = new Set(hardcoded.map((entry) => entry.route));
  const sanityRouteSet = new Set([...sanityByRoute.keys()]);

  const hardcodedMissingInSanity = hardcoded.filter((entry) => !sanityRouteSet.has(entry.route));
  const sanityNotInCode = [...sanityRouteSet]
    .filter((route) => !hardcodedRouteSet.has(route))
    .map((route) => ({
      route,
      pages: sanityByRoute.get(route) || [],
    }))
    .sort((a, b) => a.route.localeCompare(b.route));

  const collisions = hardcoded
    .filter((entry) => sanityRouteSet.has(entry.route))
    .map((entry) => ({
      route: entry.route,
      file: entry.file,
      usesSanityWrapper: entry.usesSanityWrapper,
      sanityPages: sanityByRoute.get(entry.route) || [],
    }));

  const hardCollisions = collisions.filter((entry) => !entry.usesSanityWrapper);

  const summary = {
    projectId,
    dataset,
    hardcodedRouteCount: hardcoded.length,
    sanityLandingPageCount: sanityPages.length,
    hardcodedMissingInSanityCount: hardcodedMissingInSanity.length,
    sanityNotInCodeCount: sanityNotInCode.length,
    routeCollisionCount: collisions.length,
    hardCollisionCount: hardCollisions.length,
  };

  console.log(JSON.stringify({
    summary,
    hardcodedMissingInSanity,
    sanityNotInCode,
    collisions,
  }, null, 2));

  if (options.strict) {
    const strictFailures =
      hardcodedMissingInSanity.length +
      sanityNotInCode.length +
      (options.strictCollisions ? collisions.length : hardCollisions.length);
    if (strictFailures > 0) {
      throw new Error(
        `[landing-audit] Strict mode failed (${strictFailures} issue(s)).`
      );
    }
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
