import {defineType, defineField} from 'sanity'
import {productField} from './fields/product'

export const updateType = defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      type: 'type',
      publishedAt: 'publishedAt',
      product: 'product',
    },
    prepare({title, type, publishedAt, product}) {
      const typeEmoji: Record<string, string> = {
        announcement: '📢',
        release: '🚀',
        bugfix: '🔧',
        roadmap: '🗺️',
      }
      const emoji = typeEmoji[type as string] ?? '📰'
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
        : 'No date'
      const productLabel = product?.toUpperCase() || 'GCXONE'
      return {
        title: title ?? 'Untitled Update',
        subtitle: `${productLabel} - ${emoji} ${type ?? 'announcement'} • ${date}`,
      }
    },
  },
  groups: [
    {
      name: 'main',
      title: 'Main',
      default: true,
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'releaseFields',
      title: 'Release Fields',
      options: {collapsible: true},
    },
    {
      name: 'bugfixFields',
      title: 'Bugfix Fields',
      options: {collapsible: true},
    },
    {
      name: 'roadmapFields',
      title: 'Roadmap Fields',
      options: {collapsible: true},
    },
  ],
  fields: [
    // ── Main Fields ───────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The update title',
      validation: (rule) => rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'URL path for this update (e.g., "v3.2.1-release")',
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
      group: 'main',
    }),
    productField,
    defineField({
      name: 'type',
      title: 'Update Type',
      type: 'string',
      description: 'The category of this update',
      options: {
        list: [
          {title: '📢 Announcement', value: 'announcement'},
          {title: '🚀 Release', value: 'release'},
          {title: '🔧 Bugfix', value: 'bugfix'},
          {title: '🗺️ Roadmap', value: 'roadmap'},
        ],
        layout: 'radio',
      },
      initialValue: 'announcement',
      validation: (rule) => rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this update was published',
      group: 'main',
    }),

    // ── Content Fields ────────────────────────────────────────────────────────
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 2,
      description: 'Short summary for card display',
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Full update content (portable text)',
      group: 'content',
    }),

    // ── Release-Specific Fields ───────────────────────────────────────────────
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'e.g., v3.2.1',
      hidden: ({parent}) => parent?.type !== 'release',
      group: 'releaseFields',
    }),
    defineField({
      name: 'releaseNotes',
      title: 'Release Notes',
      type: 'object',
      description: 'Structured release notes by category',
      hidden: ({parent}) => parent?.type !== 'release',
      group: 'releaseFields',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'new',
          title: 'New Features',
          type: 'array',
          description: 'New features in this release',
          of: [
            defineType({
              name: 'releaseNoteItem',
              type: 'object',
              fields: [
                defineField({name: 'title', type: 'string', title: 'Title'}),
                defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
              ],
            }),
          ],
        }),
        defineField({
          name: 'improvements',
          title: 'Improvements',
          type: 'array',
          description: 'Improvements in this release',
          of: [
            defineType({
              name: 'improvementItem',
              type: 'object',
              fields: [
                defineField({name: 'title', type: 'string', title: 'Title'}),
                defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
              ],
            }),
          ],
        }),
        defineField({
          name: 'fixes',
          title: 'Bug Fixes',
          type: 'array',
          description: 'Bug fixes in this release',
          of: [
            defineType({
              name: 'fixItem',
              type: 'object',
              fields: [
                defineField({name: 'title', type: 'string', title: 'Title'}),
                defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Bugfix-Specific Fields ────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Current status of the bug fix',
      options: {
        list: [
          {title: '✅ Fixed', value: 'fixed'},
          {title: '👀 Monitoring', value: 'monitoring'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.type !== 'bugfix',
      group: 'bugfixFields',
    }),
    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      description: 'Severity level of the bug',
      options: {
        list: [
          {title: 'Low', value: 'low'},
          {title: 'Medium', value: 'medium'},
          {title: 'High', value: 'high'},
        ],
      },
      hidden: ({parent}) => parent?.type !== 'bugfix',
      group: 'bugfixFields',
    }),

    // ── Roadmap-Specific Fields ───────────────────────────────────────────────
    defineField({
      name: 'roadmapStatus',
      title: 'Roadmap Status',
      type: 'string',
      description: 'Current status of the roadmap item',
      options: {
        list: [
          {title: '📋 Planned', value: 'planned'},
          {title: '🔄 In Progress', value: 'in_progress'},
          {title: '✅ Completed', value: 'completed'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.type !== 'roadmap',
      group: 'roadmapFields',
    }),
    defineField({
      name: 'targetDate',
      title: 'Target Date',
      type: 'date',
      description: 'Target completion date',
      hidden: ({parent}) => parent?.type !== 'roadmap',
      group: 'roadmapFields',
    }),
  ],
})
