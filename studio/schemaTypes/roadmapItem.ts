import {defineType, defineField} from 'sanity'

export const roadmapItemType = defineType({
  name: 'roadmapItem',
  title: 'Roadmap Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Roadmap item lifecycle status',
      options: {
        list: [
          {title: '🔘 Draft', value: 'draft'},
          {title: '🔵 Planned', value: 'planned'},
          {title: '🟡 In Progress', value: 'in_progress'},
          {title: '🟢 Shipped', value: 'published'},
          {title: '📦 Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'businessValue',
      title: 'Business Value',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'changeType',
      title: 'Change Type',
      type: 'string',
      options: {
        list: [
          {title: 'New Feature', value: 'feature'},
          {title: 'Improvement', value: 'improvement'},
          {title: 'Bug Fix', value: 'fix'},
          {title: 'Breaking Change', value: 'breaking'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'uiChange',
      title: 'UI Change?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'entitiesImpacted',
      title: 'Entities Impacted',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'projectedRelease',
      title: 'Projected Release',
      type: 'string',
      description: 'Human-readable e.g. "Q2 2026" or "Sprint 2026-06"',
    }),
    defineField({
      name: 'releaseRef',
      title: 'Sprint Release',
      type: 'reference',
      to: [{type: 'release'}],
      description: 'Link to the sprint release this shipped in (Shipped items only)',
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
  preview: {
    select: {title: 'title', status: 'status'},
    prepare({title, status}: {title?: string; status?: string}) {
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        planned: '🔵',
        in_progress: '🟡',
        published: '🟢',
        archived: '📦',
      }
      const statusLabel: Record<string, string> = {
        draft: 'Draft',
        planned: 'Planned',
        in_progress: 'In Progress',
        published: 'Shipped',
        archived: 'Archived',
      }
      const emoji = statusEmoji[status as string] ?? '🔘'
      const label = statusLabel[status as string] ?? 'Unknown'
      return {title: `${emoji} ${title ?? 'Untitled'}`, subtitle: label}
    },
  },
})
