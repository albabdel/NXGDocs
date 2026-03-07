import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const referenceType = defineType({
  name: 'reference',
  title: 'Reference Page',
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
    bodyField,
  ],
})
