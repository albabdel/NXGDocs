/**
 * Docusaurus Plugin: Sanity Landing Pages
 * 
 * Fetches landing pages from Sanity CMS and generates static page JSON files.
 * The landing page template reads these JSON files and renders them dynamically.
 * 
 * Usage:
 * 1. Run fetch-sanity-content.js to fetch landing pages from Sanity
 * 2. This plugin registers routes for each landing page
 * 3. LandingPageTemplate.tsx renders the page based on the JSON data
 */
'use strict';

const fs = require('fs');
const path = require('path');

const LANDING_PAGES_CACHE_DIR = '.sanity-landing-pages';
const STATIC_PAGE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.mdx', '.md'];

module.exports = function (context, options) {
  const cacheDir = path.join(context.siteDir, LANDING_PAGES_CACHE_DIR);
  const pagesDir = path.join(context.siteDir, 'src', 'pages');

  function staticPageExistsForRoute(routePath) {
    const normalized = String(routePath || '')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    if (!normalized) return false;

    const directCandidates = STATIC_PAGE_EXTENSIONS.map((ext) =>
      path.join(pagesDir, `${normalized}${ext}`)
    );
    const indexCandidates = STATIC_PAGE_EXTENSIONS.map((ext) =>
      path.join(pagesDir, normalized, `index${ext}`)
    );

    return [...directCandidates, ...indexCandidates].some((candidate) => fs.existsSync(candidate));
  }
  
  return {
    name: 'docusaurus-plugin-sanity-landing-pages',

    async loadContent() {
      return null;
    },

    async contentLoaded({ actions }) {
      const { addRoute, createData } = actions;
      
      const landingPagesPath = path.join(cacheDir, 'landing-pages.json');
      
      if (!fs.existsSync(landingPagesPath)) {
        console.log('[sanity-landing-pages] No landing pages found. Run fetch-sanity-content.js first.');
        return;
      }

      let landingPages;
      try {
        landingPages = JSON.parse(fs.readFileSync(landingPagesPath, 'utf8'));
      } catch (err) {
        console.warn('[sanity-landing-pages] Failed to parse landing pages:', err.message);
        return;
      }

      if (!Array.isArray(landingPages) || landingPages.length === 0) {
        console.log('[sanity-landing-pages] No landing pages to generate.');
        return;
      }

      console.log(`[sanity-landing-pages] Generating ${landingPages.length} landing page route(s)...`);

      for (const page of landingPages) {
        const slug = page.slug?.current;
        if (!slug) continue;

        const routePath = slug.startsWith('/') ? slug : `/${slug}`;

        if (staticPageExistsForRoute(routePath)) {
          console.log(`[sanity-landing-pages] Skipping route with static page owner: ${routePath}`);
          continue;
        }
        
        const pageDataPath = await createData(
          `landing-page-data-${slug.replace(/\//g, '--')}.json`,
          JSON.stringify(page)
        );

        addRoute({
          path: routePath,
          component: '@site/src/components/LandingPageRenderer',
          modules: {
            pageData: pageDataPath,
          },
          exact: true,
        });

        console.log(`[sanity-landing-pages] → Added route: ${routePath}`);
      }
    },
  };
};
