// @ts-check
'use strict';

const { execSync } = require('child_process');
const path = require('path');

/**
 * docusaurus-plugin-pagefind
 *
 * Runs `pagefind --site build` after every Docusaurus build to generate a
 * static full-text search index in build/pagefind/.
 *
 * This replaces the Algolia DocSearch integration (removed Phase 5, Plan 02).
 * Pagefind needs no API keys, no external crawler, and no re-index step —
 * the index is generated automatically every time the site builds.
 *
 * Options:
 */
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-pagefind',

    async postBuild({ outDir }) {
      const siteDir = outDir || path.join(context.siteDir, 'build');
      const cmd = `npx pagefind --site "${siteDir}"`;

      console.log('\n[docusaurus-plugin-pagefind] Generating Pagefind search index...');
      console.log(`[docusaurus-plugin-pagefind] Running: ${cmd}\n`);

      try {
        execSync(cmd, { stdio: 'inherit', cwd: context.siteDir });
        console.log('\n[docusaurus-plugin-pagefind] Search index generated successfully.');
      } catch (err) {
        console.error('\n[docusaurus-plugin-pagefind] ERROR: Failed to generate search index.');
        console.error(err.message);
        throw err;
      }
    },
  };
};
