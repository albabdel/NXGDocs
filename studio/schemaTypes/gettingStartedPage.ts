import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'
import {productField} from './fields/product'

export const gettingStartedPageType = defineType({
  name: 'gettingStartedPage',
  title: 'Getting Started Page',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      status: 'status',
      slug: 'slug',
      product: 'product',
    },
    prepare({title, status, slug, product}) {
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        published: '🟢',
        archived: '📦',
      }
      const emoji = statusEmoji[status as string] ?? '🔘'
      const productLabel = product?.toUpperCase() || 'GCXONE'
      return {
        title: `${emoji} ${title ?? 'Untitled'}`,
        subtitle: `${productLabel} - ${slug?.current ? `/${slug.current}` : 'No slug'}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The main title displayed on the page (H1)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'URL path for this page (e.g., "getting-started")',
      options: {
        source: 'title',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .slice(0, 200),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'SEO description (120-160 characters) - used in meta tags and search previews',
    }),
    productField,

    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      description: 'Main hero section at the top of the page',
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
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)', description: 'e.g., "Rocket", "Zap", "Play"'}),
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
        defineField({
          name: 'video',
          title: 'Hero Video',
          type: 'mux.video',
          description: 'Optional hero background or featured video',
        }),
        defineField({
          name: 'videoId',
          title: 'YouTube Video ID',
          type: 'string',
          description: 'YouTube video ID for embedded video (e.g., "dQw4w9WgXcQ")',
        }),
        defineField({
          name: 'ctaButtons',
          title: 'Call-to-Action Buttons',
          type: 'array',
          of: [
            defineType({
              name: 'heroCtaButton',
              type: 'object',
              fields: [
                defineField({name: 'label', type: 'string', title: 'Button Label'}),
                defineField({name: 'href', type: 'string', title: 'Link URL'}),
                defineField({
                  name: 'variant',
                  type: 'string',
                  title: 'Button Style',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                      {title: 'Outline', value: 'outline'},
                    ],
                  },
                  initialValue: 'primary',
                }),
                defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'quickStartSteps',
      title: 'Quick Start Steps',
      type: 'array',
      description: 'Quick start guide steps displayed prominently at the top',
      of: [
        defineType({
          name: 'quickStartStep',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (e.g., "Download", "Settings", "Play")',
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'link',
              title: 'Link URL',
              type: 'string',
              description: 'URL or path for this step',
            }),
            defineField({
              name: 'linkText',
              title: 'Link Text',
              type: 'string',
              description: 'Text for the link button',
              initialValue: 'Learn more',
            }),
            defineField({
              name: 'videoId',
              title: 'YouTube Video ID',
              type: 'string',
              description: 'YouTube video ID for a step tutorial video',
            }),
            defineField({
              name: 'estimatedTime',
              title: 'Estimated Time',
              type: 'string',
              description: 'Time estimate (e.g., "5 min", "2 hours")',
            }),
            defineField({
              name: 'status',
              title: 'Step Status',
              type: 'string',
              options: {
                list: [
                  {title: 'Required', value: 'required'},
                  {title: 'Optional', value: 'optional'},
                  {title: 'Recommended', value: 'recommended'},
                ],
              },
            }),
          ],
          preview: {
            select: {title: 'title', icon: 'icon'},
            prepare({title, icon}) {
              return {
                title: title || 'Quick Start Step',
                subtitle: icon ? `Icon: ${icon}` : 'No icon',
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'onboardingPhases',
      title: 'Onboarding Phases',
      type: 'array',
      description: 'Structured onboarding phases with detailed steps',
      of: [{type: 'onboardingPhase'}],
      options: {
        insertMenu: {
          show: true,
        },
      },
    }),

    defineField({
      name: 'videoResources',
      title: 'Video Resources',
      type: 'array',
      description: 'YouTube video tutorials and resources',
      of: [
        defineType({
          name: 'videoResource',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Video Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'videoId',
              title: 'YouTube Video ID',
              type: 'string',
              description: 'YouTube video ID (e.g., "dQw4w9WgXcQ")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Video Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'Video duration (e.g., "12:34")',
            }),
            defineField({
              name: 'thumbnail',
              title: 'Custom Thumbnail',
              type: 'image',
              options: {hotspot: true},
              description: 'Override YouTube thumbnail with custom image',
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              description: 'Video category for grouping',
              options: {
                list: [
                  {title: 'Getting Started', value: 'getting-started'},
                  {title: 'Tutorial', value: 'tutorial'},
                  {title: 'Feature Overview', value: 'feature-overview'},
                  {title: 'Best Practices', value: 'best-practices'},
                  {title: 'Troubleshooting', value: 'troubleshooting'},
                ],
              },
            }),
            defineField({
              name: 'roles',
              title: 'Target Roles',
              type: 'array',
              of: [{type: 'string'}],
              options: {
                list: [
                  {title: 'Admin', value: 'admin'},
                  {title: 'Operator', value: 'operator'},
                  {title: 'Installer', value: 'installer'},
                  {title: 'Manager', value: 'manager'},
                ],
              },
            }),
          ],
          preview: {
            select: {title: 'title', videoId: 'videoId', category: 'category'},
            prepare({title, videoId, category}) {
              return {
                title: title || 'Video Resource',
                subtitle: `${category || 'Uncategorized'} • ${videoId || 'No ID'}`,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'featuredArticles',
      title: 'Featured Articles',
      type: 'array',
      description: 'Featured documentation articles for further reading',
      of: [
        defineField({
          name: 'article',
          title: 'Article',
          type: 'reference',
          to: [{type: 'doc'}],
        }),
      ],
    }),

    defineField({
      name: 'systemRequirements',
      title: 'System Requirements',
      type: 'object',
      description: 'System requirements and prerequisites',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'System Requirements',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'requirements',
          title: 'Requirements List',
          type: 'array',
          of: [
            defineType({
              name: 'systemRequirement',
              type: 'object',
              fields: [
                defineField({
                  name: 'category',
                  title: 'Category',
                  type: 'string',
                  description: 'e.g., "Browser", "Hardware", "Network"',
                }),
                defineField({
                  name: 'items',
                  title: 'Requirements',
                  type: 'array',
                  of: [{type: 'string'}],
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  description: 'Lucide icon name',
                }),
              ],
              preview: {
                select: {category: 'category', items: 'items'},
                prepare({category, items}) {
                  return {
                    title: category || 'Requirement Category',
                    subtitle: `${items?.length || 0} items`,
                  }
                },
              },
            }),
          ],
        }),
        defineField({
          name: 'minimumRequirements',
          title: 'Minimum Requirements',
          type: 'object',
          fields: [
            defineField({name: 'browser', type: 'string', title: 'Browser'}),
            defineField({name: 'os', type: 'string', title: 'Operating System'}),
            defineField({name: 'ram', type: 'string', title: 'RAM'}),
            defineField({name: 'storage', type: 'string', title: 'Storage'}),
            defineField({name: 'network', type: 'string', title: 'Network'}),
          ],
        }),
        defineField({
          name: 'recommendedRequirements',
          title: 'Recommended Requirements',
          type: 'object',
          fields: [
            defineField({name: 'browser', type: 'string', title: 'Browser'}),
            defineField({name: 'os', type: 'string', title: 'Operating System'}),
            defineField({name: 'ram', type: 'string', title: 'RAM'}),
            defineField({name: 'storage', type: 'string', title: 'Storage'}),
            defineField({name: 'network', type: 'string', title: 'Network'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'nextSteps',
      title: 'Next Steps CTA',
      type: 'object',
      description: 'Call-to-action section for next steps after onboarding',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Next Steps',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'steps',
          title: 'Next Steps',
          type: 'array',
          of: [
            defineType({
              name: 'nextStep',
              type: 'object',
              fields: [
                defineField({name: 'icon', type: 'string', title: 'Icon (Lucide)'}),
                defineField({name: 'title', type: 'string', title: 'Title'}),
                defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
                defineField({name: 'href', type: 'string', title: 'Link URL'}),
                defineField({
                  name: 'type',
                  type: 'string',
                  title: 'Step Type',
                  options: {
                    list: [
                      {title: 'Documentation', value: 'docs'},
                      {title: 'Tutorial', value: 'tutorial'},
                      {title: 'Video', value: 'video'},
                      {title: 'External Link', value: 'external'},
                    ],
                  },
                }),
              ],
              preview: {
                select: {title: 'title', type: 'type'},
                prepare({title, type}) {
                  return {
                    title: title || 'Next Step',
                    subtitle: type || 'No type',
                  }
                },
              },
            }),
          ],
        }),
        defineField({
          name: 'ctaButtons',
          title: 'CTA Buttons',
          type: 'array',
          of: [
            defineType({
              name: 'nextStepsCtaButton',
              type: 'object',
              fields: [
                defineField({name: 'label', type: 'string', title: 'Button Label'}),
                defineField({name: 'href', type: 'string', title: 'Link URL'}),
                defineField({
                  name: 'variant',
                  type: 'string',
                  title: 'Button Style',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                      {title: 'Outline', value: 'outline'},
                    ],
                  },
                  initialValue: 'primary',
                }),
                defineField({name: 'icon', type: 'string', title: 'Icon (Lucide)'}),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'additionalResources',
      title: 'Additional Resources',
      type: 'object',
      description: 'Additional helpful resources and links',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Additional Resources',
        }),
        defineField({
          name: 'resources',
          title: 'Resources',
          type: 'array',
          of: [
            defineType({
              name: 'additionalResource',
              type: 'object',
              fields: [
                defineField({name: 'icon', type: 'string', title: 'Icon (Lucide)'}),
                defineField({name: 'title', type: 'string', title: 'Title'}),
                defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
                defineField({name: 'href', type: 'string', title: 'Link URL'}),
                defineField({
                  name: 'type',
                  type: 'string',
                  title: 'Resource Type',
                  options: {
                    list: [
                      {title: 'Documentation', value: 'docs'},
                      {title: 'API Reference', value: 'api'},
                      {title: 'Community', value: 'community'},
                      {title: 'Support', value: 'support'},
                      {title: 'External', value: 'external'},
                    ],
                  },
                }),
              ],
              preview: {
                select: {title: 'title', type: 'type'},
                prepare({title, type}) {
                  return {
                    title: title || 'Resource',
                    subtitle: type || 'No type',
                  }
                },
              },
            }),
          ],
        }),
      ],
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

    defineField({
      name: 'customContent',
      title: 'Custom Content',
      description: 'Additional custom content section',
      ...enhancedBodyField,
    }),
  ],
})

export const onboardingPhaseType = defineType({
  name: 'onboardingPhase',
  title: 'Onboarding Phase',
  type: 'object',
  fields: [
    defineField({
      name: 'phaseNumber',
      title: 'Phase Number',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Phase Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Phase Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Phase Icon',
      type: 'string',
      description: 'Lucide icon name (e.g., "Rocket", "Settings", "Users")',
    }),
    defineField({
      name: 'color',
      title: 'Phase Color',
      type: 'string',
      description: 'Accent color (hex, e.g., "#10B981")',
    }),
    defineField({
      name: 'estimatedTime',
      title: 'Estimated Time',
      type: 'string',
      description: 'Time estimate for completing this phase (e.g., "30 min")',
    }),
    defineField({
      name: 'roles',
      title: 'Target Roles',
      type: 'array',
      description: 'Which user roles should complete this phase',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Admin', value: 'admin'},
          {title: 'Operator', value: 'operator'},
          {title: 'Installer', value: 'installer'},
          {title: 'Manager', value: 'manager'},
        ],
      },
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Optional YouTube video for this phase',
    }),
    defineField({
      name: 'videoThumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      options: {hotspot: true},
      description: 'Custom thumbnail for the phase video',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      description: 'Individual steps within this phase',
      of: [{type: 'onboardingStep'}],
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Prerequisites for this phase',
    }),
    defineField({
      name: 'outcome',
      title: 'Expected Outcome',
      type: 'text',
      rows: 2,
      description: 'What the user will achieve after completing this phase',
    }),
    defineField({
      name: 'troubleshooting',
      title: 'Troubleshooting Tips',
      type: 'array',
      of: [
        defineType({
          name: 'troubleshootingTip',
          type: 'object',
          fields: [
            defineField({name: 'issue', type: 'string', title: 'Common Issue'}),
            defineField({name: 'solution', type: 'text', rows: 2, title: 'Solution'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      phaseNumber: 'phaseNumber',
      title: 'title',
      estimatedTime: 'estimatedTime',
      steps: 'steps',
    },
    prepare({phaseNumber, title, estimatedTime, steps}) {
      return {
        title: `Phase ${phaseNumber}: ${title || 'Untitled'}`,
        subtitle: `${steps?.length || 0} steps • ${estimatedTime || 'No time estimate'}`,
      }
    },
  },
})

export const onboardingStepType = defineType({
  name: 'onboardingStep',
  title: 'Onboarding Step',
  type: 'object',
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Step Number',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Step Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Step Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'type',
      title: 'Step Type',
      type: 'string',
      description: 'Type of action required for this step',
      options: {
        list: [
          {title: 'Action', value: 'ACTION'},
          {title: 'Confirmation', value: 'CONFIRMATION'},
          {title: 'Validation', value: 'VALIDATION'},
        ],
        layout: 'radio',
      },
      initialValue: 'ACTION',
    }),
    defineField({
      name: 'icon',
      title: 'Step Icon',
      type: 'string',
      description: 'Lucide icon name',
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'URL or path for this step',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Text for the link button',
      initialValue: 'Go to step',
    }),
    defineField({
      name: 'roles',
      title: 'Target Roles',
      type: 'array',
      description: 'Which user roles should complete this step',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Admin', value: 'admin'},
          {title: 'Operator', value: 'operator'},
          {title: 'Installer', value: 'installer'},
          {title: 'Manager', value: 'manager'},
        ],
      },
    }),
    defineField({
      name: 'estimatedTime',
      title: 'Estimated Time',
      type: 'string',
      description: 'Time estimate (e.g., "5 min")',
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Optional YouTube video for this step',
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      description: 'Screenshots or images for this step',
      of: [
        defineType({
          name: 'stepScreenshot',
          type: 'object',
          fields: [
            defineField({name: 'image', type: 'image', title: 'Image', options: {hotspot: true}}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'tips',
      title: 'Tips',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Helpful tips for this step',
    }),
    defineField({
      name: 'warnings',
      title: 'Warnings',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Important warnings or cautions',
    }),
    defineField({
      name: 'isRequired',
      title: 'Required',
      type: 'boolean',
      description: 'Whether this step is required',
      initialValue: true,
    }),
    defineField({
      name: 'status',
      title: 'Step Status',
      type: 'string',
      options: {
        list: [
          {title: 'Not Started', value: 'not-started'},
          {title: 'In Progress', value: 'in-progress'},
          {title: 'Completed', value: 'completed'},
          {title: 'Skipped', value: 'skipped'},
        ],
      },
      initialValue: 'not-started',
    }),
  ],
  preview: {
    select: {
      stepNumber: 'stepNumber',
      title: 'title',
      type: 'type',
      estimatedTime: 'estimatedTime',
    },
    prepare({stepNumber, title, type, estimatedTime}) {
      const typeEmoji: Record<string, string> = {
        ACTION: '▶️',
        CONFIRMATION: '✅',
        VALIDATION: '🔍',
      }
      const emoji = typeEmoji[type as string] ?? '▶️'
      return {
        title: `Step ${stepNumber}: ${title || 'Untitled'}`,
        subtitle: `${emoji} ${type || 'ACTION'} • ${estimatedTime || 'No time estimate'}`,
      }
    },
  },
})
