import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

// Note: "reference" is a reserved Sanity type name (used for cross-document references).
// This document type is named "referencePage" to avoid the naming conflict.
export const referenceType = defineType({
  name: 'referencePage',
  title: 'Reference Page',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      status: 'status',
      apiVersion: 'apiVersion',
    },
    prepare({title, status, apiVersion}) {
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        published: '🟢',
      }
      const emoji = statusEmoji[status as string] ?? '🔘'
      return {
        title: `${emoji} ${title ?? 'Untitled'}`,
        subtitle: apiVersion ? `API ${apiVersion}` : undefined,
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
      description: 'Brief summary of what this reference page covers',
    }),

    // ── API metadata ──────────────────────────────────────────────────────
    defineField({
      name: 'apiVersion',
      title: 'API Version',
      type: 'string',
      description: 'e.g. "v2", "v2.1", "legacy"',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    // ── Editorial workflow ────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '🔘 Draft', value: 'draft'},
          {title: '🟡 In Review', value: 'review'},
          {title: '🟢 Published', value: 'published'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),

    // ── Body ──────────────────────────────────────────────────────────────
    enhancedBodyField,
  ],
})
