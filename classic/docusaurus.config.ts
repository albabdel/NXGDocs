import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { getCurrentConfig, getCurrentProduct } from './product.config';

const productConfig = getCurrentConfig();
const productId = getCurrentProduct();
console.log('[Docusaurus Config] Building for product: ' + productId);

const config: Config = {
  title: productConfig.title,
  tagline: productConfig.tagline,
  favicon: productConfig.favicon,
  headTags: [
    { tagName: 'meta', attributes: { name: 'theme-color', content: productConfig.theme.primaryColor } },
    { tagName: 'meta', attributes: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' } },
    { tagName: 'meta', attributes: { name: 'keywords', content: productConfig.metadata.keywords.join(', ') } },
  ],
  scripts: [{ src: '/api-config.js', async: false }],
  url: productConfig.url,
  baseUrl: productConfig.baseUrl,
  organizationName: 'nxgen',
  projectName: 'nxgen-docs',
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: (image, file, options) => { console.warn('[Warning] Broken image "' + image + '" in ' + file.path); return; },
    },
    mermaid: true,
  },
  i18n: { defaultLocale: 'en', locales: ['en'], localeConfigs: { en: { label: 'English', direction: 'ltr', htmlLang: 'en-US' } } },
  presets: [
    ['classic', {
      docs: false,
      blog: false,
      theme: {
        customCss: [
          './src/css/tokens.css',
          './src/css/product-themes.css',
          './src/css/typography.css',
          './src/css/components/sidebar.css',
          './src/css/components/code-blocks.css',
          './src/css/components/cards.css',
          './src/css/components/zoho-tickets.css',
          './src/css/custom.css',
        ],
      },
      sitemap: { changefreq: 'weekly', priority: 0.8 },
    } satisfies Preset.Options],
  ],
  plugins: [
    './plugins/webpack-config-plugin',
    './plugins/docusaurus-plugin-sanity-content',
    './plugins/docusaurus-plugin-sanity-landing-pages',
    './plugins/docusaurus-plugin-release-pages',
    './plugins/docusaurus-plugin-last-update',
    ['posthog-docusaurus', {
      apiKey: 'phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS',
      appUrl: 'https://us.i.posthog.com',
      enableInDevelopment: true,
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
      session_recording: { maskAllInputs: false },
      person_profiles: 'identified_only',
    }],
    ['@docusaurus/plugin-content-docs', { id: 'internal', path: 'docs-internal', routeBasePath: 'internal', sidebarPath: './sidebars-internal.ts', showLastUpdateTime: false, showLastUpdateAuthor: false, editUrl: undefined }],
    ['@docusaurus/plugin-content-docs', { id: 'sanity-docs', path: productConfig.docsPath, routeBasePath: 'docs', sidebarPath: './sidebars.ts', showLastUpdateTime: false, showLastUpdateAuthor: false, editUrl: undefined, sidebarCollapsible: true, sidebarCollapsed: true, breadcrumbs: true }],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    image: productConfig.socialCard,
    navbar: { hideOnScroll: false, logo: { alt: productConfig.logo.alt, src: productConfig.logo.src }, items: [] },
    footer: { style: 'dark', links: [], copyright: 'Copyright (c) ' + new Date().getFullYear() + ' ' + productConfig.title.split(' ')[0] + '. Built with Docusaurus.' },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json', 'typescript', 'javascript'],
      magicComments: [
        { className: 'theme-code-block-highlighted-line', line: 'highlight-next-line', block: { start: 'highlight-start', end: 'highlight-end' } },
        { className: 'code-block-error-line', line: 'error-next-line', block: { start: 'error-start', end: 'error-end' } },
      ],
    },
    colorMode: { defaultMode: 'dark', disableSwitch: false, respectPrefersColorScheme: false },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
  } satisfies Preset.ThemeConfig,
};

export default config;
