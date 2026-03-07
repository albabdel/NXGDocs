import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

// Note: "reference" is a reserved Sanity type name (used for cross-document references).
// This document type is named "referencePage" to avoid the conflict.
// Phase 3 GROQ queries should use: _type == 'referencePage'
export const referenceType = defineType({
  name: 'referencePage',
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
