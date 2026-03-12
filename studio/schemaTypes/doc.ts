import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const docType = defineType({
  name: 'doc',
  title: 'Documentation Page',
  type: 'document',
  // Show audience tags as a subtitle in list views
  preview: {
    select: {
      title: 'title',
      status: 'status',
      targetAudience: 'targetAudience',
      media: 'coverImage',
    },
    prepare({title, status, targetAudience, media}) {
      const audiences = Array.isArray(targetAudience)
        ? targetAudience.join(', ')
        : 'all'
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        published: '🟢',
      }
      const emoji = statusEmoji[status as string] ?? '🔘'
      return {
        title: `${emoji} ${title ?? 'Untitled'}`,
        subtitle: `Audience: ${audiences}`,
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
      options: {
        aiAssist: {
          instructions: 'Write a clear, concise documentation title (3-8 words, sentence case). Use action verbs for guides (e.g., "Configure", "Set up", "Install"). Use nouns for reference pages.',
        },
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this page (auto-generated from title)',
      options: {
        source: 'title',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 200),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Used in search previews and meta descriptions (aim for 120–160 characters)',
      options: {
        aiAssist: {
          instructions: 'Write a 120-160 character SEO-friendly description that summarizes the page purpose and includes relevant keywords naturally.',
        },
      },
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
      title: 'Page Icon',
      type: 'iconPicker',
      description: 'Icon displayed in navigation and page header',
      options: {
        providers: ['mdi', 'fa', 'hi'],
        outputFormat: 'react',
      },
    }),
    defineField({
      name: 'video',
      title: 'Tutorial Video',
      type: 'mux.video',
      description: 'Optional tutorial or walkthrough video for this page',
    }),

    // ── Taxonomy ─────────────────────────────────────────────────────────
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      description: 'Which audience role(s) should see this page',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: '👥 All users', value: 'all'},
          {title: '🛡️ Admin', value: 'admin'},
          {title: '📊 Manager', value: 'manager'},
          {title: '🖥️ Operator', value: 'operator'},
          {title: '🖥️ Operator (Minimal)', value: 'operator-minimal'},
          {title: '🔒 Internal only', value: 'internal'},
        ],
      },
      initialValue: ['all'],
    }),
    defineField({
      name: 'sidebarCategory',
      title: 'Sidebar Category',
      type: 'reference',
      to: [{type: 'sidebarCategory'}],
      description: 'Which sidebar category this page belongs to. Determines placement in the navigation.',
    }),
    defineField({
      name: 'category',
      title: 'Section / Category (Legacy)',
      type: 'string',
      description: 'Groups docs in the sidebar (e.g. "getting-started", "devices"). Use Sidebar Category field instead for proper structure.',
      hidden: ({document}) => !!document?.sidebarCategory,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Free-form labels for filtering and search',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    // ── Layout / ordering ─────────────────────────────────────────────────
    defineField({
      name: 'sidebarPosition',
      title: 'Sidebar Position',
      type: 'number',
      description: 'Controls ordering within a category — lower number appears first (e.g., 1, 2, 3...)',
      initialValue: 99,
      validation: (rule) => rule.min(1).max(999),
    }),
    defineField({
      name: 'sidebarLabel',
      title: 'Custom Sidebar Label',
      type: 'string',
      description: 'Override the title in the sidebar (optional). Use shorter text for cleaner navigation.',
    }),
    defineField({
      name: 'sidebarClassName',
      title: 'Sidebar CSS Class',
      type: 'string',
      description: 'Custom CSS class for this sidebar item (optional)',
    }),
    defineField({
      name: 'hideFromSidebar',
      title: 'Hide from Sidebar',
      type: 'boolean',
      description: 'Exclude this page from the sidebar navigation while keeping it accessible via direct link',
      initialValue: false,
    }),

    // ── Editorial workflow ────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Editorial workflow state. Only "published" documents appear on the live site.',
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
      name: 'hiddenFromProduction',
      title: 'Hide from Production',
      type: 'boolean',
      description: 'When enabled, this document will not appear on the live site (useful for placeholders or internal-only content)',
      initialValue: false,
    }),
    defineField({
      name: 'isPlaceholder',
      title: 'Is Placeholder',
      type: 'boolean',
      description: 'Marks this as placeholder content that needs to be filled in',
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'string',
      description: 'Name of the person who last reviewed this document',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    }),

    // ── Body ──────────────────────────────────────────────────────────────
    enhancedBodyField,

    // ── SEO & Meta ────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMetadata',
      description: 'Search engine optimization settings for this page',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
})
