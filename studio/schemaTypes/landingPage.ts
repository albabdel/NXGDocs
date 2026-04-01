import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'
import {productField} from './fields/product'

export const landingPageType = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      status: 'status',
      slug: 'slug',
      product: 'product',
      heroImage: 'hero.backgroundImage',
    },
    prepare({title, status, slug, product, heroImage}) {
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
        media: heroImage,
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
      description: 'URL path for this landing page (e.g., "quick-start/platform-overview")',
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
    productField,
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'SEO description (120-160 characters) - used in meta tags and search previews',
    }),
    defineField({
      name: 'layoutType',
      title: 'Layout Type',
      type: 'string',
      description: 'Predefined layout template for this landing page',
      options: {
        list: [
          {title: 'Standard Landing Page', value: 'standard'},
          {title: 'Quick Start Page', value: 'quick-start'},
          {title: 'Release Notes Page', value: 'releases'},
          {title: 'Tower Guide Page', value: 'tower-guide'},
          {title: 'Role Page', value: 'role'},
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'showBackground',
      title: 'Show Landing Page Background',
      type: 'boolean',
      description: 'Display the animated landing page background pattern',
      initialValue: true,
    }),
    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumbs',
      type: 'array',
      description: 'Navigation breadcrumbs shown at the top of the page',
      of: [
        defineType({
          name: 'breadcrumb',
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Label'}),
            defineField({name: 'href', type: 'string', title: 'Link (optional)'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      description: 'Main hero section at the top of the page',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'badge',
          title: 'Badge/Tag',
          type: 'object',
          fields: [
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)', description: 'e.g., "Cpu", "Radio", "Zap"'}),
            defineField({name: 'text', type: 'string', title: 'Badge Text'}),
          ],
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Main H1 headline text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          rows: 2,
          description: 'Supporting text below the headline',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {hotspot: true},
        }),
        defineField({
          name: 'metrics',
          title: 'Metrics Display',
          type: 'array',
          description: 'Key metrics/stats shown in the hero section',
          of: [
            defineType({
              name: 'heroMetric',
              type: 'object',
              fields: [
                defineField({name: 'label', type: 'string', title: 'Label'}),
                defineField({name: 'value', type: 'string', title: 'Value'}),
                defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
                defineField({name: 'color', type: 'string', title: 'Color (hex)', description: 'e.g., "#10B981"'}),
              ],
            }),
          ],
        }),
        defineField({
          name: 'ctaButtons',
          title: 'Call-to-Action Buttons',
          type: 'array',
          of: [
            defineType({
              name: 'ctaButton',
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
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Modular content sections that make up the landing page',
      of: [
        {type: 'landingSectionVideo'},
        {type: 'landingSectionFeatures'},
        {type: 'landingSectionSteps'},
        {type: 'landingSectionCapabilities'},
        {type: 'landingSectionHierarchy'},
        {type: 'landingSectionTabs'},
        {type: 'landingSectionReleases'},
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

    // ── SEO & Meta ────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMetadata',
      description: 'Search engine optimization settings for this landing page',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // ── Workflow Configuration ─────────────────────────────────────────────
    defineField({
      name: 'workflowConfig',
      title: 'Workflow Configuration',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'workflowStatus',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              { title: 'Draft', value: 'draft' },
              { title: 'Pending Review', value: 'pending_review' },
              { title: 'Approved', value: 'approved' },
              { title: 'Rejected', value: 'rejected' },
              { title: 'Published', value: 'published' },
              { title: 'Archived', value: 'archived' },
            ],
          },
          initialValue: 'draft',
        }),
        defineField({
          name: 'source',
          title: 'Content Source',
          type: 'string',
          options: {
            list: [
              { title: 'Sanity', value: 'sanity' },
              { title: 'Confluence', value: 'confluence' },
            ],
          },
          initialValue: 'sanity',
        }),
        defineField({
          name: 'submittedAt',
          title: 'Submitted At',
          type: 'datetime',
        }),
        defineField({
          name: 'submittedBy',
          title: 'Submitted By',
          type: 'reference',
          to: [{ type: 'adminUser' }],
        }),
        defineField({
          name: 'reviewedBy',
          title: 'Reviewed By',
          type: 'reference',
          to: [{ type: 'adminUser' }],
        }),
        defineField({
          name: 'reviewedAt',
          title: 'Reviewed At',
          type: 'datetime',
        }),
        defineField({
          name: 'reviewNotes',
          title: 'Review Notes',
          type: 'text',
        }),
        defineField({
          name: 'publishedAt',
          title: 'Published At',
          type: 'datetime',
        }),
        defineField({
          name: 'publishedBy',
          title: 'Published By',
          type: 'reference',
          to: [{ type: 'adminUser' }],
        }),
      ],
    }),
  ],
})

export const landingSectionVideo = defineType({
  name: 'landingSectionVideo',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'videoSource',
      type: 'string',
      title: 'Video Source',
      options: {
        list: [
          {title: 'Mux Video (Recommended)', value: 'mux'},
          {title: 'Embed URL (YouTube/Vimeo)', value: 'embed'},
          {title: 'Upload Video File', value: 'upload'},
        ],
        layout: 'radio',
      },
      initialValue: 'mux',
    }),
    defineField({
      name: 'muxVideo',
      type: 'mux.video',
      title: 'Mux Video',
      description: 'High-quality streaming video via Mux',
      hidden: ({parent}) => parent?.videoSource !== 'mux',
    }),
    defineField({
      name: 'videoUrl',
      type: 'string',
      title: 'Video URL (YouTube/Vimeo)',
      description: 'Full embed URL or video ID',
      hidden: ({parent}) => parent?.videoSource !== 'embed',
    }),
    defineField({
      name: 'videoFile',
      type: 'file',
      title: 'Uploaded Video File',
      options: {
        accept: 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v',
      },
      description: 'Recommended formats: MP4 (H.264) or WebM',
      hidden: ({parent}) => parent?.videoSource !== 'upload',
    }),
    defineField({
      name: 'posterImage',
      type: 'image',
      title: 'Poster Image',
      options: {hotspot: true},
      description: 'Thumbnail shown before playback',
      hidden: ({parent}) => parent?.videoSource === 'embed',
    }),
    defineField({
      name: 'videoControls',
      type: 'boolean',
      title: 'Show Video Controls',
      initialValue: true,
      hidden: ({parent}) => parent?.videoSource === 'embed',
    }),
    defineField({
      name: 'autoplay',
      type: 'boolean',
      title: 'Autoplay',
      initialValue: false,
      hidden: ({parent}) => parent?.videoSource === 'embed',
    }),
    defineField({
      name: 'muted',
      type: 'boolean',
      title: 'Muted',
      initialValue: true,
      hidden: ({parent}) => parent?.videoSource === 'embed',
    }),
    defineField({
      name: 'loop',
      type: 'boolean',
      title: 'Loop',
      initialValue: false,
      hidden: ({parent}) => parent?.videoSource === 'embed',
    }),
    defineField({
      name: 'videoTitle',
      type: 'string',
      title: 'Video Title',
    }),
    defineField({
      name: 'videoDescription',
      type: 'text',
      rows: 2,
      title: 'Video Description',
    }),
  ],
  preview: {
    select: {title: 'title', videoUrl: 'videoUrl', videoFile: 'videoFile', muxVideo: 'muxVideo', videoSource: 'videoSource'},
    prepare({title, videoUrl, videoFile, muxVideo, videoSource}) {
      const hasMux = Boolean(muxVideo?.asset?._ref);
      const hasUpload = Boolean(videoFile?.asset?._ref);
      const sourceLabel = videoSource === 'mux' || hasMux ? 'Mux Video' : videoSource === 'upload' || hasUpload ? 'Uploaded Video' : videoUrl ? 'YouTube/Vimeo' : 'No video source';
      return {
        title: title || 'Video Section',
        subtitle: sourceLabel,
      }
    },
  },
})

export const landingSectionFeatures = defineType({
  name: 'landingSectionFeatures',
  title: 'Features Grid Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Grid Columns',
      options: {list: [{title: '2', value: 2}, {title: '3', value: 3}, {title: '4', value: 4}]},
      initialValue: 3,
    }),
    defineField({
      name: 'features',
      type: 'array',
      title: 'Features',
      of: [
        defineType({
          name: 'featureItem',
          type: 'object',
          fields: [
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
            defineField({name: 'color', type: 'string', title: 'Accent Color (hex)'}),
            defineField({name: 'value', type: 'string', title: 'Value/Stat (optional)'}),
            defineField({name: 'link', type: 'string', title: 'Link URL (optional)'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', features: 'features'},
    prepare({title, features}) {
      return {
        title: title || 'Features Grid',
        subtitle: `${features?.length || 0} features`,
      }
    },
  },
})

export const landingSectionSteps = defineType({
  name: 'landingSectionSteps',
  title: 'Steps/Guide Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'phases',
      type: 'array',
      title: 'Phases',
      of: [
        defineType({
          name: 'stepPhase',
          type: 'object',
          fields: [
            defineField({name: 'phaseNumber', type: 'number', title: 'Phase Number'}),
            defineField({name: 'title', type: 'string', title: 'Phase Title'}),
            defineField({name: 'description', type: 'string', title: 'Phase Description'}),
            defineField({
              name: 'steps',
              type: 'array',
              title: 'Steps',
              of: [
                defineType({
                  name: 'stepItem',
                  type: 'object',
                  fields: [
                    defineField({name: 'stepNumber', type: 'number', title: 'Step Number'}),
                    defineField({name: 'title', type: 'string', title: 'Step Title'}),
                    defineField({name: 'description', type: 'text', rows: 2, title: 'Step Description'}),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', phases: 'phases'},
    prepare({title, phases}) {
      const totalSteps = phases?.reduce((acc: number, p: any) => acc + (p.steps?.length || 0), 0) || 0
      return {
        title: title || 'Steps Guide',
        subtitle: `${phases?.length || 0} phases, ${totalSteps} steps`,
      }
    },
  },
})

export const landingSectionCapabilities = defineType({
  name: 'landingSectionCapabilities',
  title: 'Platform Capabilities Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'capabilities',
      type: 'array',
      title: 'Capabilities',
      of: [
        defineType({
          name: 'capabilityItem',
          type: 'object',
          fields: [
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'value', type: 'string', title: 'Value/Stat'}),
            defineField({name: 'description', type: 'string', title: 'Description'}),
            defineField({name: 'color', type: 'string', title: 'Accent Color (hex)'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Platform Capabilities',
        subtitle: 'Stats/metrics display',
      }
    },
  },
})

export const landingSectionHierarchy = defineType({
  name: 'landingSectionHierarchy',
  title: 'Hierarchy Model Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'levels',
      type: 'array',
      title: 'Hierarchy Levels',
      of: [
        defineType({
          name: 'hierarchyLevel',
          type: 'object',
          fields: [
            defineField({name: 'level', type: 'string', title: 'Level Number'}),
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'description', type: 'string', title: 'Description'}),
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
            defineField({name: 'color', type: 'string', title: 'Color (hex)'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      title: 'Key Benefits',
      of: [
        defineType({
          name: 'hierarchyBenefit',
          type: 'object',
          fields: [
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'description', type: 'string', title: 'Description'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Hierarchy Model',
        subtitle: '5-level hierarchy display',
      }
    },
  },
})

export const landingSectionTabs = defineType({
  name: 'landingSectionTabs',
  title: 'Tabbed Content Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'tabs',
      type: 'array',
      title: 'Tabs',
      of: [
        defineType({
          name: 'tabItem',
          type: 'object',
          fields: [
            defineField({name: 'id', type: 'string', title: 'Tab ID'}),
            defineField({name: 'label', type: 'string', title: 'Tab Label'}),
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
            defineField({
              name: 'content',
              type: 'object',
              title: 'Tab Content',
              fields: [
                defineField({name: 'title', type: 'string', title: 'Content Title'}),
                defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
                defineField({
                  name: 'items',
                  type: 'array',
                  title: 'Content Items',
                  of: [
                    defineType({
                      name: 'tabContentItem',
                      type: 'object',
                      fields: [
                        defineField({name: 'icon', type: 'string', title: 'Icon Name'}),
                        defineField({name: 'title', type: 'string', title: 'Title'}),
                        defineField({name: 'description', type: 'string', title: 'Description'}),
                        defineField({name: 'status', type: 'string', title: 'Status (optional)'}),
                        defineField({name: 'value', type: 'string', title: 'Value (optional)'}),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', tabs: 'tabs'},
    prepare({title, tabs}) {
      return {
        title: title || 'Tabbed Content',
        subtitle: `${tabs?.length || 0} tabs`,
      }
    },
  },
})

export const landingSectionReleases = defineType({
  name: 'landingSectionReleases',
  title: 'Releases List Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'showCurrentSprint',
      type: 'boolean',
      title: 'Show Current Sprint',
      description: 'Display current sprint progress',
      initialValue: true,
    }),
    defineField({
      name: 'showCompleted',
      type: 'boolean',
      title: 'Show Completed Releases',
      initialValue: true,
    }),
    defineField({
      name: 'showRoadmapLink',
      type: 'boolean',
      title: 'Show Roadmap Link',
      initialValue: true,
    }),
    defineField({
      name: 'releaseType',
      type: 'string',
      title: 'Release Type',
      description: 'Customer-facing or Internal releases',
      options: {
        list: [
          {title: 'Customer Releases', value: 'customer'},
          {title: 'Internal Releases', value: 'internal'},
        ],
      },
      initialValue: 'customer',
    }),
  ],
  preview: {
    select: {title: 'title', releaseType: 'releaseType'},
    prepare({title, releaseType}) {
      return {
        title: title || 'Releases Section',
        subtitle: releaseType === 'internal' ? 'Internal Releases' : 'Customer Releases',
      }
    },
  },
})

export const landingSectionContentGrid = defineType({
  name: 'landingSectionContentGrid',
  title: 'Content Grid Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'Section Description'}),
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Grid Columns',
      options: {list: [{title: '2', value: 2}, {title: '3', value: 3}]},
      initialValue: 2,
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Content Items',
      of: [
        defineType({
          name: 'contentGridItem',
          type: 'object',
          fields: [
            defineField({name: 'icon', type: 'string', title: 'Icon Name (Lucide)'}),
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'description', type: 'text', rows: 3, title: 'Description'}),
            defineField({name: 'link', type: 'string', title: 'Link URL'}),
            defineField({
              name: 'listItems',
              type: 'array',
              title: 'List Items',
              of: [{type: 'string'}],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'Content Grid',
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})

export const landingSectionCTA = defineType({
  name: 'landingSectionCTA',
  title: 'Call-to-Action Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'CTA Title'}),
    defineField({name: 'description', type: 'text', rows: 2, title: 'CTA Description'}),
    defineField({
      name: 'buttons',
      type: 'array',
      title: 'CTA Buttons',
      of: [
        defineType({
          name: 'ctaSectionButton',
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
                ],
              },
              initialValue: 'primary',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'CTA Section',
        subtitle: 'Call-to-action block',
      }
    },
  },
})

export const landingSectionCustom = defineType({
  name: 'landingSectionCustom',
  title: 'Custom Content Section',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Section Title'}),
    defineField({
      name: 'customBody',
      title: 'Custom Content',
      ...enhancedBodyField,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Custom Section',
        subtitle: 'Rich text content',
      }
    },
  },
})
