#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(SITE_DIR, 'src', 'pages');
const LEGACY_DIR = path.join(SITE_DIR, 'src', 'legacy-pages');

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

function toPascalCase(input) {
  return String(input || '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function discoverLandingPageFiles() {
  return walkTsxFiles(PAGES_DIR)
    .filter((filePath) => fs.readFileSync(filePath, 'utf8').includes('LandingPageBackground'))
    .sort();
}

function relativeImport(fromFile, toFileNoExt) {
  let rel = path.relative(path.dirname(fromFile), toFileNoExt).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

function parseArgs(argv) {
  const flags = new Set(argv || []);
  return { apply: flags.has('--apply') };
}

function run(options = {}) {
  const apply = !!options.apply;
  const landingFiles = discoverLandingPageFiles();

  let planned = 0;
  let migrated = 0;
  let skipped = 0;

  for (const filePath of landingFiles) {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    if (originalContent.includes('SanityLandingPageRoute')) {
      skipped += 1;
      continue;
    }

    const route = fileToRoute(filePath);
    const relativeInPages = path.relative(PAGES_DIR, filePath);
    const legacyPath = path.join(LEGACY_DIR, relativeInPages);

    planned += 1;
    if (!apply) continue;

    fs.mkdirSync(path.dirname(legacyPath), { recursive: true });
    fs.renameSync(filePath, legacyPath);

    const legacyImport = relativeImport(filePath, legacyPath.replace(/\.tsx$/, ''));
    const routeComponentImport = relativeImport(
      filePath,
      path.join(SITE_DIR, 'src', 'components', 'SanityLandingPageRoute')
    );
    const routeSlug = route.replace(/^\/+/, '');
    const componentName = `${toPascalCase(routeSlug || 'index')}Route`;

    const wrapper = [
      "import React from 'react';",
      `import SanityLandingPageRoute from '${routeComponentImport}';`,
      `import LegacyPage from '${legacyImport}';`,
      '',
      `export default function ${componentName}() {`,
      `  return <SanityLandingPageRoute slug="${routeSlug}" fallback={LegacyPage} />;`,
      '}',
      '',
    ].join('\n');

    fs.writeFileSync(filePath, wrapper, 'utf8');
    migrated += 1;
  }

  console.log(`[landing-migrate] Landing pages discovered: ${landingFiles.length}`);
  console.log(`[landing-migrate] Planned migrations: ${planned}, skipped already migrated: ${skipped}`);
  if (apply) {
    console.log(`[landing-migrate] Migrated files: ${migrated}`);
  } else {
    console.log('[landing-migrate] Dry run only. Use --apply to move files and write wrappers.');
  }
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  run(args);
}

module.exports = { run };
