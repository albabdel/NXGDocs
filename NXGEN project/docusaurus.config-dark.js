// @ts-check
// GCXONE Documentation - Authentic NXGEN Dark Theme Configuration

const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GCXONE Documentation',
  tagline: 'Proactive Monitoring Operating System',
  favicon: 'img/favicon.ico',

  url: 'https://docs.gcxone.com',
  baseUrl: '/',

  organizationName: 'nxgen',
  projectName: 'gcxone-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/nxgen/gcxone-docs/edit/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // NXGEN Authentic Dark Theme - Gold Accents
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true, // NXGEN brand is dark-first
        respectPrefersColorScheme: false,
      },

      navbar: {
        title: 'GCXONE',
        logo: {
          alt: 'GCXONE by NXGEN',
          src: 'img/gcxone-logo-gold.svg', // Gold logo for dark background
          href: '/',
          width: 140,
          height: 40,
        },
        items: [
          {
            type: 'dropdown',
            label: 'Explore By',
            position: 'left',
            items: [
              {
                label: 'Breakthroughs',
                to: '/explore/breakthroughs',
              },
              {
                label: 'Job Functions',
                to: '/explore/job-functions',
              },
              {
                label: 'Core Benefits',
                to: '/explore/core-benefits',
              },
              {
                label: 'Solution Kits',
                to: '/explore/solution-kits',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Resources',
            position: 'left',
            items: [
              {
                label: 'News',
                to: '/resources/news',
              },
              {
                label: 'Events',
                to: '/resources/events',
              },
              {
                label: '24/7 Support',
                to: '/resources/support',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Support',
            position: 'left',
            items: [
              {
                label: 'Knowledge Base',
                to: '/support/knowledge-base',
              },
              {
                label: 'Download Integration',
                to: '/support/downloads',
              },
              {
                label: 'System Live Status',
                href: 'https://status.gcxone.com',
              },
              {
                label: 'Contact',
                to: '/support/contact',
              },
            ],
          },
          {
            to: '/about',
            label: 'About Us',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://marketplace.nxgen.io',
            label: 'Market Place',
            position: 'right',
            className: 'navbar-marketplace-link',
          },
          {
            href: 'https://app.gcxone.com/trial',
            label: 'Free Trial',
            position: 'right',
            className: 'button button--primary navbar-cta',
          },
        ],
        hideOnScroll: false,
      },

      footer: {
        style: 'dark',
        logo: {
          alt: 'NXGEN Technology',
          src: 'img/nxgen-logo-gold.svg', // Gold logo for footer
          href: 'https://nxgen.io',
          width: 160,
          height: 50,
        },
        links: [
          {
            title: 'EXPLORE BY',
            items: [
              {
                label: 'Breakthroughs',
                to: '/explore/breakthroughs',
              },
              {
                label: 'Job Functions',
                to: '/explore/job-functions',
              },
              {
                label: 'Core Benefits',
                to: '/explore/core-benefits',
              },
              {
                label: 'Solution Kits',
                to: '/explore/solution-kits',
              },
            ],
          },
          {
            title: 'RESOURCES',
            items: [
              {
                label: 'News',
                to: '/resources/news',
              },
              {
                label: 'Events',
                to: '/resources/events',
              },
              {
                label: '24/7 Support',
                to: '/resources/support',
              },
            ],
          },
          {
            title: 'SUPPORT',
            items: [
              {
                label: 'Knowledge Base',
                to: '/support/knowledge-base',
              },
              {
                label: 'Download Integration',
                to: '/support/downloads',
              },
              {
                label: 'System Live Status',
                href: 'https://status.gcxone.com',
              },
              {
                label: 'Contact',
                to: '/support/contact',
              },
            ],
          },
          {
            title: 'OFFICE',
            items: [
              {
                html: `
                  <div style="color: #AAAAAA; line-height: 1.7;">
                    <strong style="color: #FFFFFF;">Technoparkstrasse 1</strong><br/>
                    CH-8005 Zurich, Switzerland<br/><br/>
                    <a href="tel:+41445528850" style="color: #D4A574;">+41 44 552 8850</a><br/>
                    <a href="tel:+41445528851" style="color: #D4A574;">+41 44 552 8851</a><br/><br/>
                    <a href="mailto:info@nxgen.io" style="color: #D4A574;">info@nxgen.io</a><br/><br/>
                    <span style="color: #666666;">CHE-420.077.858</span>
                  </div>
                `,
              },
            ],
          },
        ],
        copyright: `
          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #2A2A2A;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="color: #666666;">
                © Copyright ${new Date().getFullYear()} NXGEN Technology AG
              </div>
              <div style="display: flex; gap: 2rem;">
                <a href="/terms-conditions" style="color: #888888;">Terms & Conditions</a>
                <a href="/privacy" style="color: #888888;">Privacy Policy</a>
              </div>
            </div>
          </div>
        `,
      },

      // Prism theme for code blocks - dark theme
      prism: {
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'json', 'yaml', 'python', 'javascript', 'typescript'],
      },

      // Algolia search configuration
      algolia: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_SEARCH_API_KEY',
        indexName: 'gcxone-docs',
        contextualSearch: true,
        searchParameters: {},
        searchPagePath: 'search',
      },

      // Announcement bar with gold accent
      announcementBar: {
        id: 'new_features',
        content:
          '⚡ <strong>New:</strong> Enhanced AI-powered false alarm filtering now available. <a href="/release-notes" style="color: #E0B688; font-weight: 600;">Learn more →</a>',
        backgroundColor: '#1A1A1A',
        textColor: '#DDDDDD',
        isCloseable: true,
      },

      metadata: [
        {
          name: 'keywords',
          content: 'gcxone, nxgen, security management, alarm monitoring, video surveillance, proactive monitoring',
        },
        {name: 'author', content: 'NXGEN Technology AG'},
        {name: 'theme-color', content: '#C89446'},
      ],

      image: 'img/gcxone-social-card.jpg',

      // Additional metadata for premium appearance
      headTags: [
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
          },
        },
      ],
    }),

  plugins: [
    // Add custom webpack config if needed for premium fonts/assets
  ],

  stylesheets: [
    // Add premium fonts if needed
    // 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ],

  scripts: [
    // Add analytics or custom scripts
  ],
};

module.exports = config;
