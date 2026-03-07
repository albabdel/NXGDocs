import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const releaseNoteType = defineType({
  name: 'releaseNote',
  title: 'Release Note',
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
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sprintId',
      title: 'Sprint ID',
      type: 'string',
      description: 'Sprint identifier, e.g. "2026-01-a"',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    bodyField,
  ],
})
