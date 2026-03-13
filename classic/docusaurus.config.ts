import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NXGEN GCXONE Documentation',
  tagline: 'Complete documentation for NXGEN GCXONE platform',
  favicon: 'img/favicon.png',

  // Future flags
  // future: {
  //   v4: true,
  // },

  // Enhanced metadata
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#E8B058',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'NXGEN, GCXONE, Talos, Evalink, documentation, security, alarm management, video management',
      },
    },
  ],

  // Load API config
  scripts: [
    {
      src: '/api-config.js',
      async: false,
    },
  ],

  // Production URL
  url: 'https://docs.nxgen.cloud',
  baseUrl: '/',

  // GitHub config
  organizationName: 'nxgen',
  projectName: 'nxgen-docs',

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  // Handle broken markdown links/images (pre-existing issues in migrated content)
  markdown: {
    // .md files → CommonMark (safe for AI-generated/migrated content with {} chars)
    // .mdx files → MDX (for hand-authored pages with React components)
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: (image, file, options) => {
        console.warn(`[Warning] Broken image "${image}" in ${file.path}`);
        return;
      },
    },
    mermaid: true,
  },

  // English only - multilingual support disabled
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.8,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    './plugins/docusaurus-plugin-sanity-content',  // MUST be first — populates .sanity-cache/ before content-docs reads
    './plugins/docusaurus-plugin-sanity-landing-pages',  // Landing pages from Sanity
    './plugins/docusaurus-plugin-release-pages',   // Release detail pages from Sanity
    './plugins/docusaurus-plugin-last-update',
    // Internal docs plugin (keeping for now)
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'internal',
        path: 'docs-internal',
        routeBasePath: 'internal',
        sidebarPath: './sidebars-internal.ts',
        showLastUpdateTime: false,
        showLastUpdateAuthor: false,
        editUrl: undefined,
      },
    ],
    // Role-based documentation instances
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'admin',
        path: 'docs-admin',
        routeBasePath: 'role-admin',
        sidebarPath: './sidebars-admin.ts',
        showLastUpdateTime: false,
        showLastUpdateAuthor: false,
        editUrl: undefined,
        sidebarCollapsible: true,
        sidebarCollapsed: true,
        breadcrumbs: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'manager',
        path: 'docs-manager',
        routeBasePath: 'manager',
        sidebarPath: './sidebars-manager.ts',
        showLastUpdateTime: false,
        showLastUpdateAuthor: false,
        editUrl: undefined,
        sidebarCollapsible: true,
        sidebarCollapsed: true,
        breadcrumbs: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'operator',
        path: 'docs-operator',
        routeBasePath: 'operator',
        sidebarPath: './sidebars-operator.ts',
        showLastUpdateTime: false,
        showLastUpdateAuthor: false,
        editUrl: undefined,
        sidebarCollapsible: true,
        sidebarCollapsed: true,
        breadcrumbs: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'operator-minimal',
        path: 'docs-operator-minimal',
        routeBasePath: 'operator-minimal',
        sidebarPath: './sidebars-operator-minimal.ts',
        showLastUpdateTime: false,
        showLastUpdateAuthor: false,
        editUrl: undefined,
        sidebarCollapsible: true,
        sidebarCollapsed: true,
        breadcrumbs: true,
      },
    ],
    // Sanity CMS content — populated at build time by docusaurus-plugin-sanity-content
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sanity-docs',
        path: '.sanity-cache/docs',
        routeBasePath: 'docs',
        sidebarPath: './sidebars.ts',
        showLastUpdateTime: false,
        showLastUpdateAuthor: false,
        editUrl: undefined,
        sidebarCollapsible: true,
        sidebarCollapsed: true,
        breadcrumbs: true,
      },
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        indexDocs: true,
        docsRouteBasePath: ['docs', 'role-admin', 'internal', 'manager', 'operator', 'operator-minimal'],
        docsPluginIdForPreferredVersion: 'sanity-docs',
        language: ['en'],
      },
    ],
  ],

  themeConfig: {
    image: 'img/nxgen-social-card.jpg',

    navbar: {
      // Navbar disabled - using custom Navbar component in Root.tsx
      hideOnScroll: false,
      logo: {
        alt: 'NXGEN GCXONE',
        src: 'img/XoLogo.png',
      },
      items: [],
    },
    footer: {
      // Footer customized in Root.tsx
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} NXGEN. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json', 'typescript', 'javascript'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
          block: { start: 'error-start', end: 'error-end' },
        },
      ],
    },

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
