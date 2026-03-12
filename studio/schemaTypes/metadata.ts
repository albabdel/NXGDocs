import {defineType, defineField} from 'sanity'

export const seoMetadataType = defineType({
  name: 'seoMetadata',
  title: 'SEO Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title for search engines (50-60 characters recommended)',
      validation: (rule) => rule.max(70).warning('Longer than 60 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Description for search results (150-160 characters recommended)',
      validation: (rule) => rule.max(200).warning('Longer than 160 characters'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Keywords for SEO (optional)',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Override the canonical URL for this page',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'No Follow',
      type: 'boolean',
      description: 'Prevent search engines from following links',
      initialValue: false,
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for social sharing (Facebook, LinkedIn)',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 2,
      description: 'Description for social sharing',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image for social sharing (1200x630 recommended)',
    }),
    defineField({
      name: 'ogType',
      title: 'Open Graph Type',
      type: 'string',
      options: {
        list: [
          {title: 'Article', value: 'article'},
          {title: 'Website', value: 'website'},
          {title: 'Profile', value: 'profile'},
        ],
      },
      initialValue: 'article',
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      options: {
        list: [
          {title: 'Summary', value: 'summary'},
          {title: 'Summary Large Image', value: 'summary_large_image'},
          {title: 'App', value: 'app'},
          {title: 'Player', value: 'player'},
        ],
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter Title',
      type: 'string',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image for Twitter sharing (1200x600 recommended)',
    }),
    defineField({
      name: 'twitterCreator',
      title: 'Twitter Creator',
      type: 'string',
      description: '@username of content creator',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'text',
      description: 'Custom JSON-LD schema markup',
      rows: 5,
    }),
  ],
})

export const analyticsMetadataType = defineType({
  name: 'analyticsMetadata',
  title: 'Analytics',
  type: 'object',
  fields: [
    defineField({
      name: 'trackingId',
      title: 'Custom Tracking ID',
      type: 'string',
      description: 'Override default analytics tracking',
    }),
    defineField({
      name: 'events',
      title: 'Custom Events',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'event',
          fields: [
            defineField({
              name: 'name',
              title: 'Event Name',
              type: 'string',
            }),
            defineField({
              name: 'trigger',
              title: 'Trigger',
              type: 'string',
              options: {
                list: [
                  {title: 'Page View', value: 'pageview'},
                  {title: 'Click', value: 'click'},
                  {title: 'Scroll', value: 'scroll'},
                  {title: 'Form Submit', value: 'submit'},
                ],
              },
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
          ],
        },
      ],
    }),
  ],
})

export const publishingMetadataType = defineType({
  name: 'publishingMetadata',
  title: 'Publishing',
  type: 'object',
  fields: [
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      description: 'When to publish this document',
    }),
    defineField({
      name: 'unpublishDate',
      title: 'Unpublish Date',
      type: 'datetime',
      description: 'When to unpublish this document',
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      options: {
        list: [
          {title: 'UTC', value: 'UTC'},
          {title: 'Eastern Time (ET)', value: 'America/New_York'},
          {title: 'Central Time (CT)', value: 'America/Chicago'},
          {title: 'Mountain Time (MT)', value: 'America/Denver'},
          {title: 'Pacific Time (PT)', value: 'America/Los_Angeles'},
          {title: 'London (GMT)', value: 'Europe/London'},
          {title: 'Paris (CET)', value: 'Europe/Paris'},
          {title: 'Berlin (CET)', value: 'Europe/Berlin'},
          {title: 'Tokyo (JST)', value: 'Asia/Tokyo'},
          {title: 'Sydney (AEDT)', value: 'Australia/Sydney'},
          {title: 'Dubai (GST)', value: 'Asia/Dubai'},
        ],
      },
      initialValue: 'UTC',
    }),
    defineField({
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          {title: 'Public', value: 'public'},
          {title: 'Password Protected', value: 'password'},
          {title: 'Private (Logged in users)', value: 'private'},
          {title: 'Draft (Only editors)', value: 'draft'},
        ],
      },
      initialValue: 'public',
    }),
    defineField({
      name: 'password',
      title: 'Access Password',
      type: 'string',
      description: 'Required if visibility is password protected',
      hidden: ({document}) => document?.visibility !== 'password',
    }),
    defineField({
      name: 'sticky',
      title: 'Sticky/Pinned',
      type: 'boolean',
      description: 'Keep this at the top of lists',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark as featured content',
      initialValue: false,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Higher numbers appear first in featured sections',
      initialValue: 0,
    }),
  ],
})

export const collaborationMetadataType = defineType({
  name: 'collaborationMetadata',
  title: 'Collaboration',
  type: 'object',
  fields: [
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'author',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
            }),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              options: {
                list: [
                  {title: 'Writer', value: 'writer'},
                  {title: 'Editor', value: 'editor'},
                  {title: 'Reviewer', value: 'reviewer'},
                  {title: 'Approver', value: 'approver'},
                  {title: 'Contributor', value: 'contributor'},
                ],
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'assignedTo',
      title: 'Assigned To',
      type: 'string',
      description: 'Who is currently responsible for this document',
    }),
    defineField({
      name: 'dueDate',
      title: 'Due Date',
      type: 'datetime',
    }),
    defineField({
      name: 'reviewDate',
      title: 'Review Date',
      type: 'datetime',
      description: 'When this document should be reviewed next',
    }),
    defineField({
      name: 'approvers',
      title: 'Approvers Required',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'approvedBy',
      title: 'Approved By',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'approvalDate',
      title: 'Approval Date',
      type: 'datetime',
    }),
  ],
})

export const versionMetadataType = defineType({
  name: 'versionMetadata',
  title: 'Version Control',
  type: 'object',
  fields: [
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Semantic version (e.g., 1.2.3)',
    }),
    defineField({
      name: 'changeLog',
      title: 'Change Log',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'change',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'datetime',
            }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Added', value: 'added'},
                  {title: 'Changed', value: 'changed'},
                  {title: 'Deprecated', value: 'deprecated'},
                  {title: 'Removed', value: 'removed'},
                  {title: 'Fixed', value: 'fixed'},
                  {title: 'Security', value: 'security'},
                ],
              },
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'author',
              title: 'Author',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'majorChanges',
      title: 'Major Changes',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of significant changes in this version',
    }),
  ],
})

export const importMetadataType = defineType({
  name: 'importMetadata',
  title: 'Import Information',
  type: 'object',
  fields: [
    defineField({
      name: 'source',
      title: 'Import Source',
      type: 'string',
      options: {
        list: [
          {title: 'DOCX File', value: 'docx'},
          {title: 'PDF File', value: 'pdf'},
          {title: 'Markdown File', value: 'markdown'},
          {title: 'HTML File', value: 'html'},
          {title: 'WordPress', value: 'wordpress'},
          {title: 'Contentful', value: 'contentful'},
          {title: 'Strapi', value: 'strapi'},
          {title: 'Manual', value: 'manual'},
        ],
      },
    }),
    defineField({
      name: 'originalFile',
      title: 'Original File',
      type: 'file',
    }),
    defineField({
      name: 'importDate',
      title: 'Import Date',
      type: 'datetime',
    }),
    defineField({
      name: 'importedBy',
      title: 'Imported By',
      type: 'string',
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original URL',
      type: 'url',
      description: 'If imported from web',
    }),
    defineField({
      name: 'originalId',
      title: 'Original ID',
      type: 'string',
      description: 'ID from source system',
    }),
    defineField({
      name: 'conversionStatus',
      title: 'Conversion Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'In Progress', value: 'in_progress'},
          {title: 'Completed', value: 'completed'},
          {title: 'Failed', value: 'failed'},
          {title: 'Needs Review', value: 'needs_review'},
        ],
      },
    }),
    defineField({
      name: 'conversionNotes',
      title: 'Conversion Notes',
      type: 'text',
      rows: 3,
      description: 'Notes about the conversion process',
    }),
    defineField({
      name: 'originalContent',
      title: 'Original Content (Backup)',
      type: 'text',
      rows: 10,
      description: 'Backup of original content before conversion',
    }),
  ],
})
