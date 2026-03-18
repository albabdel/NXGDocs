import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      status: 'status',
      author: 'author',
      media: 'coverImage',
    },
    prepare({title, status, author, media}) {
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        published: '🟢',
        archived: '📦',
      }
      const emoji = statusEmoji[status as string] ?? '🔘'
      return {
        title: `${emoji} ${title ?? 'Untitled'}`,
        subtitle: author ? `by ${author}` : undefined,
        media,
      }
    },
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Brief excerpt used in listing pages and meta tags (120–160 characters)',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Alt text'},
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Article Icon',
      type: 'iconPicker',
      description: 'Icon displayed with the article',
      options: {
        providers: ['mdi', 'fa', 'hi'],
        outputFormat: 'react',
      },
    }),
    defineField({
      name: 'video',
      title: 'Featured Video',
      type: 'mux.video',
      description: 'Optional featured video for this article',
    }),

    // ── Metadata ─────────────────────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Byline displayed with the article',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Searchable tags for this article',
    }),

    // ── Visibility ────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured article',
      type: 'boolean',
      description: 'Pin this article to the top of the listing page',
      initialValue: false,
    }),

    // ── Editorial workflow ────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Editorial workflow state. Only "published" articles appear on the live site.',
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

    // ── Body ──────────────────────────────────────────────────────────────
    enhancedBodyField,

    // ── SEO & Meta ────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMetadata',
      description: 'Search engine optimization settings for this article',
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
