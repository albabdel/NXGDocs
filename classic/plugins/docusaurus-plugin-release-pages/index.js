/**
 * Docusaurus Plugin: Release Pages
 * 
 * Generates static routes for release detail pages from sanity-releases.generated.json.
 * Each release gets its own route at /releases/[slug].
 */
'use strict';

const fs = require('fs');
const path = require('path');

const RELEASES_DATA_FILE = 'src/data/sanity-releases.generated.json';

module.exports = function (context, options) {
  const releasesPath = path.join(context.siteDir, RELEASES_DATA_FILE);
  
  return {
    name: 'docusaurus-plugin-release-pages',

    async loadContent() {
      return null;
    },

    async contentLoaded({ actions }) {
      const { addRoute, createData } = actions;
      
      if (!fs.existsSync(releasesPath)) {
        console.log('[release-pages] No releases data found. Run fetch-sanity-content.js first.');
        return;
      }

      let releases;
      try {
        releases = JSON.parse(fs.readFileSync(releasesPath, 'utf8'));
      } catch (err) {
        console.warn('[release-pages] Failed to parse releases:', err.message);
        return;
      }

      if (!Array.isArray(releases) || releases.length === 0) {
        console.log('[release-pages] No releases to generate.');
        return;
      }

      console.log(`[release-pages] Generating ${releases.length} release detail route(s)...`);

      for (const release of releases) {
        const slug = release.slug?.current;
        if (!slug) continue;

        const routePath = `/releases/${slug}`;

        const pageDataPath = await createData(
          `release-data-${slug}.json`,
          JSON.stringify(release)
        );

        addRoute({
          path: routePath,
          component: '@site/src/components/ReleaseDetailRenderer',
          modules: {
            releaseData: pageDataPath,
          },
          exact: true,
        });

        console.log(`[release-pages] → Added route: ${routePath}`);
      }
    },
  };
};
