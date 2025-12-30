import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NXGEN GCXONE Documentation',
  tagline: 'Complete documentation for NXGEN GCXONE platform',
  favicon: 'img/favicon.ico',

  // Future flags
  // future: {
  //   v4: true,
  // },

  // Enhanced metadata
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: '30877B7953347DD6',
      },
    },
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

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',
  onBrokenAnchors: 'ignore',

  markdown: {
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
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs', // Serve docs at /docs
          showLastUpdateTime: false, // Disabled for Vercel builds (no git access)
          showLastUpdateAuthor: false,
          editUrl: undefined, // Disable "Edit this page" to avoid git dependency
          sidebarCollapsible: true,
          sidebarCollapsed: true,
          breadcrumbs: true,
        },
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
    './plugins/docusaurus-plugin-last-update',
    // Internal docs plugin (keeping for now)
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'internal',
        path: 'docs-internal',
        routeBasePath: 'internal',
        sidebarPath: './sidebars-internal.ts',
        showLastUpdateTime: true,
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
        showLastUpdateTime: false, // Disabled for Vercel builds (no git access)
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
        showLastUpdateTime: false, // Disabled for Vercel builds (no git access)
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
        showLastUpdateTime: false, // Disabled for Vercel builds (no git access)
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
        showLastUpdateTime: false, // Disabled for Vercel builds (no git access)
        showLastUpdateAuthor: false,
        editUrl: undefined,
        sidebarCollapsible: true,
        sidebarCollapsed: true,
        breadcrumbs: true,
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/nxgen-social-card.jpg',

    // Algolia DocSearch Configuration
    algolia: {
      appId: 'V5T3AW2AU9',
      apiKey: 'faaa9ffb8640ba49520a0cf44dc9f7ef', // Search-only API key
      indexName: 'Documentation site',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
      insights: false,
    },

    navbar: {
      title: 'NXGEN GCXONE',
      logo: {
        alt: 'NXGEN GCXONE Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
        href: '/',
        width: 32,
        height: 32,
      },
      hideOnScroll: false,
      style: 'primary',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'custom-RoleSwitcher',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Quick Links',
          position: 'left',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Devices',
              to: '/docs/devices',
            },
            {
              label: 'Features',
              to: '/docs/features',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting',
            },
          ],
        },
        {
          href: 'https://github.com/nxgen/nxgen-docs',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Devices',
              to: '/docs/devices',
            },
            {
              label: 'Features',
              to: '/docs/features',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Support',
              to: '/docs/support',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/nxgen/nxgen-docs',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'NXGEN Website',
              href: 'https://nxgen.cloud',
            },
            {
              label: 'Release Notes',
              to: '/docs/release-notes',
            },
            {
              label: 'Privacy Policy',
              href: 'https://nxgen.cloud/privacy',
            },
          ],
        },
      ],
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
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
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
