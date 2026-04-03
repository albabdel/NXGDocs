import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'GC Surge Documentation',
  tagline: 'Documentation for NXGEN GC Surge platform',
  favicon: 'img/favicon-gcsurge.png',
  url: 'https://docs.gcsurge.com',
  baseUrl: '/',
  organizationName: 'nxgen',
  projectName: 'gcsurge-docs',
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  markdown: {
    format: 'detect',
    mermaid: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    ['classic', {
      docs: false,
      blog: false,
      theme: {
        customCss: './src/css/custom.css',
      },
      sitemap: { changefreq: 'weekly', priority: 0.8 },
    } satisfies Preset.Options],
  ],
  plugins: [
    ['@docusaurus/plugin-content-docs', {
      id: 'surge-docs',
      path: '.sanity-cache/docs',
      routeBasePath: 'docs',
      sidebarPath: './sidebars.ts',
      showLastUpdateTime: false,
      showLastUpdateAuthor: false,
      editUrl: undefined,
      sidebarCollapsible: true,
      sidebarCollapsed: true,
      breadcrumbs: true,
    }],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    image: 'img/gcsurge-social-card.jpg',
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: 'GC Surge Logo',
        src: 'img/gcsurge-logo.png',
        href: '/',
      },
      items: [
        {
          to: '/docs',
          label: 'Documentation',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} NXGEN. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json', 'typescript', 'javascript'],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
  } satisfies Preset.ThemeConfig,
};

export default config;
