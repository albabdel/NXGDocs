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
      options: {
        list: [
          {title: 'Planned', value: 'Planned'},
          {title: 'In Progress', value: 'In Progress'},
          {title: 'Shipped', value: 'Shipped'},
        ],
        layout: 'radio',
      },
      initialValue: 'Planned',
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
  ],
  preview: {
    select: {title: 'title', status: 'status'},
    prepare({title, status}: {title?: string; status?: string}) {
      const badge = status === 'Shipped' ? '[Shipped]' : status === 'In Progress' ? '[In Progress]' : '[Planned]'
      return {title: `${badge} ${title ?? 'Untitled'}`, subtitle: status ?? ''}
    },
  },
})
