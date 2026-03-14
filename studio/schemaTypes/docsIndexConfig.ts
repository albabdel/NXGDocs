import {defineType, defineField} from 'sanity'

export const docsIndexConfigType = defineType({
  name: 'docsIndexConfig',
  title: 'Docs Index Configuration',
  type: 'document',
  description: 'Configuration for the documentation index/home page',
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'hero.subtitle',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Docs Index Config',
        subtitle: subtitle || 'Documentation homepage configuration',
      }
    },
  },
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      description: 'Main hero section at the top of the docs index page',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          description: 'Main headline displayed in the hero section',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
          description: 'Supporting text below the main headline',
        }),
        defineField({
          name: 'badge',
          title: 'Badge/Tag',
          type: 'object',
          fields: [
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)', description: 'e.g., "BookOpen", "FileText"'}),
            defineField({name: 'text', type: 'string', title: 'Badge Text'}),
          ],
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {hotspot: true},
          description: 'Optional background image for the hero section',
        }),
      ],
    }),

    defineField({
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      description: 'Quick navigation links displayed prominently',
      of: [
        defineType({
          name: 'docsQuickLink',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (e.g., "Rocket", "Plug", "Video", "MessageCircle")',
            }),
            defineField({
              name: 'title',
              title: 'Link Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Link Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'color',
              title: 'Accent Color',
              type: 'string',
              description: 'Accent color (hex, e.g., "#10B981")',
            }),
          ],
          preview: {
            select: {title: 'title', icon: 'icon', href: 'href'},
            prepare({title, icon, href}) {
              return {
                title: title || 'Quick Link',
                subtitle: `${icon ? `${icon} • ` : ''}${href}`,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'featuredCategories',
      title: 'Featured Categories',
      type: 'array',
      description: 'Sidebar categories to feature prominently on the docs index',
      of: [
        defineField({
          name: 'category',
          title: 'Category',
          type: 'reference',
          to: [{type: 'sidebarCategory'}],
        }),
      ],
    }),

    defineField({
      name: 'quickAccessBanner',
      title: 'Quick Access Banner',
      type: 'object',
      description: 'Banner for quick access links (e.g., Return to Home)',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'text',
          title: 'Banner Text',
          type: 'string',
          description: 'Text to display in the banner',
        }),
        defineField({
          name: 'href',
          title: 'Link URL',
          type: 'string',
          description: 'URL for the banner link',
        }),
        defineField({
          name: 'icon',
          title: 'Icon',
          type: 'string',
          description: 'Lucide icon name (e.g., "Home", "ArrowLeft")',
        }),
        defineField({
          name: 'position',
          title: 'Banner Position',
          type: 'string',
          options: {
            list: [
              {title: 'Top Right', value: 'top-right'},
              {title: 'Top Left', value: 'top-left'},
              {title: 'Bottom', value: 'bottom'},
            ],
          },
          initialValue: 'top-right',
        }),
        defineField({
          name: 'variant',
          title: 'Banner Style',
          type: 'string',
          options: {
            list: [
              {title: 'Subtle', value: 'subtle'},
              {title: 'Prominent', value: 'prominent'},
              {title: 'Minimal', value: 'minimal'},
            ],
          },
          initialValue: 'subtle',
        }),
      ],
    }),

    defineField({
      name: 'sections',
      title: 'Additional Sections',
      type: 'array',
      description: 'Additional content sections for the docs index page',
      of: [
        {type: 'landingSectionFeatures'},
        {type: 'landingSectionContentGrid'},
        {type: 'landingSectionCTA'},
        {type: 'landingSectionCustom'},
      ],
      options: {
        insertMenu: {
          show: true,
        },
      },
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Editorial workflow state',
      options: {
        list: [
          {title: '🔘 Draft', value: 'draft'},
          {title: '🟡 In Review', value: 'review'},
          {title: '🟢 Published', value: 'published'},
          {title: '📦 Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    }),

    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMetadata',
      description: 'Search engine optimization settings',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
})
