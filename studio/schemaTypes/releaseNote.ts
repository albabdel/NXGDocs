import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const releaseNoteType = defineType({
  name: 'releaseNote',
  title: 'Release Note',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      status: 'status',
      version: 'version',
      publishedAt: 'publishedAt',
    },
    prepare({title, status, version, publishedAt}) {
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        published: '🟢',
      }
      const emoji = statusEmoji[status as string] ?? '🔘'
      const sub = [version, publishedAt].filter(Boolean).join(' · ')
      return {
        title: `${emoji} ${title ?? 'Untitled'}`,
        subtitle: sub || undefined,
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

    // ── Release metadata ─────────────────────────────────────────────────
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Semantic version string, e.g. "3.12.0"',
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
    defineField({
      name: 'changeType',
      title: 'Change Types',
      type: 'array',
      description: 'Categorize the kind of changes in this release',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: '✨ New Feature', value: 'feature'},
          {title: '🐛 Bug Fix', value: 'fix'},
          {title: '⚡ Improvement', value: 'improvement'},
          {title: '💥 Breaking Change', value: 'breaking'},
          {title: '🔒 Security', value: 'security'},
          {title: '🗑️ Deprecation', value: 'deprecation'},
        ],
      },
    }),
    defineField({
      name: 'affectedAreas',
      title: 'Affected Areas',
      type: 'array',
      description: 'Which product areas are affected',
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
          {title: 'Studio / Admin', value: 'studio'},
        ],
        layout: 'tags',
      },
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
