import {defineType, defineField, defineArrayMember} from 'sanity'

export const releaseType = defineType({
  name: 'release',
  title: 'Sprint Release',
  type: 'document',
  fields: [
    defineField({
      name: 'displayTitle',
      title: 'Display Title',
      type: 'string',
      description: 'Customer-facing sprint name. E.g. "December 2025 Release B" — not an internal sprint ID.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sprintId',
      title: 'Sprint ID',
      type: 'string',
      description: 'Internal sprint identifier for engineering reference only. Not shown to customers.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'displayTitle'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short summary shown on the releases index card',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Release Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'releaseItem',
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
              rows: 4,
            }),
            defineField({
              name: 'changeType',
              title: 'Change Type',
              type: 'string',
              options: {
                list: [
                  {title: 'New Feature', value: 'feature'},
                  {title: 'Bug Fix', value: 'fix'},
                  {title: 'Improvement', value: 'improvement'},
                  {title: 'Breaking Change', value: 'breaking'},
                  {title: 'Security', value: 'security'},
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'affectedAreas',
              title: 'Affected Areas',
              type: 'array',
              of: [{type: 'string'}],
              options: {
                list: [
                  {title: 'Alarm Management', value: 'alarm-management'},
                  {title: 'Devices', value: 'devices'},
                  {title: 'Features', value: 'features'},
                  {title: 'Operator Guide', value: 'operator-guide'},
                  {title: 'Installer Guide', value: 'installer-guide'},
                  {title: 'Platform Fundamentals', value: 'platform-fundamentals'},
                  {title: 'Reporting', value: 'reporting'},
                  {title: 'Knowledge Base', value: 'knowledge-base'},
                  {title: 'API / Integrations', value: 'api'},
                ],
                layout: 'tags',
              },
            }),
            defineField({
              name: 'screenshot',
              title: 'Screenshot',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video Embed URL',
              type: 'url',
              description: 'YouTube or Vimeo embed URL',
            }),
          ],
          preview: {
            select: {title: 'title', changeType: 'changeType'},
            prepare({title, changeType}: {title?: string; changeType?: string}) {
              return {title: title ?? 'Untitled item', subtitle: changeType ?? ''}
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'displayTitle', publishedAt: 'publishedAt'},
    prepare({title, publishedAt}: {title?: string; publishedAt?: string}) {
      return {title: title ?? 'Untitled', subtitle: publishedAt ?? ''}
    },
  },
})
