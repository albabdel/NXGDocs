import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const docType = defineType({
  name: 'doc',
  title: 'Documentation Page',
  type: 'document',
  fields: [
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
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'All', value: 'all'},
          {title: 'Admin', value: 'admin'},
          {title: 'Manager', value: 'manager'},
          {title: 'Operator', value: 'operator'},
          {title: 'Operator (Minimal)', value: 'operator-minimal'},
          {title: 'Internal', value: 'internal'},
        ],
      },
      initialValue: ['all'],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Used to group docs in sidebar (e.g. "getting-started", "devices")',
    }),
    defineField({
      name: 'sidebarPosition',
      title: 'Sidebar Position',
      type: 'number',
      description: 'Controls ordering within a category — lower number appears first',
    }),
    bodyField,
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    }),
  ],
})
