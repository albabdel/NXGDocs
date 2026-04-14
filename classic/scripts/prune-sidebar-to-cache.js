#!/usr/bin/env node
/**
 * Prune sidebars.ts to remove { type: 'doc', id: '...' } entries whose
 * corresponding markdown file was NOT written to the Sanity cache.
 *
 * Called from build-multi-product.js after fetch-sanity-content.js so that
 * Docusaurus never sees a sidebar reference to a doc that doesn't exist.
 * This prevents build failures when Sanity content changes (docs deleted,
 * renamed, or unpublished) without a matching sidebar update.
 *
 * The modification is ephemeral — CF Pages gets a fresh git checkout each build.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');

module.exports = function pruneSidebarToCache() {
  const cachePath = process.env.SANITY_CACHE_PATH || '.sanity-cache';
  const docsDir = path.join(SITE_DIR, cachePath, 'docs');
  const sidebarsFile = path.join(SITE_DIR, 'sidebars.ts');

  // Build set of available doc IDs from written cache files
  const availableIds = new Set();

  function scan(dir, prefix) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (/\.(md|mdx)$/.test(entry.name) && !entry.name.startsWith('_')) {
        const base = entry.name.replace(/\.(md|mdx)$/, '');
        const id = prefix ? `${prefix}/${base}` : base;
        availableIds.add(id);
      }
    }
  }

  scan(docsDir, '');
  console.log(`[prune-sidebar] ${availableIds.size} doc(s) available in cache at ${cachePath}/docs`);

  if (!fs.existsSync(sidebarsFile)) {
    console.warn('[prune-sidebar] sidebars.ts not found, skipping.');
    return;
  }

  const original = fs.readFileSync(sidebarsFile, 'utf8');
  const lines = original.split('\n');
  const pruned = [];
  let removed = 0;

  for (const line of lines) {
    // Match lines like: { type: 'doc', id: 'path/to/doc', label: 'Label' },
    // Handles varying whitespace and single/double quotes.
    const match = line.match(/\{\s*type\s*:\s*['"]doc['"]\s*,\s*id\s*:\s*['"]([^'"]+)['"]/);
    if (match) {
      const id = match[1];
      if (!availableIds.has(id)) {
        console.log(`[prune-sidebar] Removing missing doc from sidebar: ${id}`);
        removed++;
        continue; // drop the line
      }
    }
    pruned.push(line);
  }

  if (removed === 0) {
    console.log('[prune-sidebar] All sidebar entries are present in cache — no changes needed.');
    return;
  }

  // Collapse runs of 3+ blank lines left by removed entries down to 2
  const collapsed = pruned.join('\n').replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(sidebarsFile, collapsed, 'utf8');
  console.log(`[prune-sidebar] Removed ${removed} missing sidebar entry(s). sidebars.ts updated.`);
};
