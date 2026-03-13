import {defineType, defineField} from 'sanity'

export const importJobType = defineType({
  name: 'importJob',
  title: 'Import Job',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      status: 'status',
      fileType: 'fileType',
      documentCount: 'documentCount',
    },
    prepare({title, status, fileType, documentCount}) {
      const statusEmojis: Record<string, string> = {
        pending: '⏳',
        processing: '🔄',
        completed: '✅',
        failed: '❌',
        needs_review: '👀',
      }
      const typeEmojis: Record<string, string> = {
        docx: '📄',
        pdf: '📑',
        markdown: '📝',
        html: '🌐',
        json: '📊',
        csv: '📈',
        wordpress: '🎨',
        contentful: '📦',
      }
      return {
        title: `${statusEmojis[status as string] || '⏳'} ${title}`,
        subtitle: `${typeEmojis[fileType as string] || '📄'} ${documentCount || 0} documents • ${status}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Import Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '⏳ Pending', value: 'pending'},
          {title: '🔄 Processing', value: 'processing'},
          {title: '✅ Completed', value: 'completed'},
          {title: '❌ Failed', value: 'failed'},
          {title: '👀 Needs Review', value: 'needs_review'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'fileType',
      title: 'File Type',
      type: 'string',
      options: {
        list: [
          {title: '📄 DOCX (Word)', value: 'docx'},
          {title: '📑 PDF', value: 'pdf'},
          {title: '📝 Markdown', value: 'markdown'},
          {title: '🌐 HTML', value: 'html'},
          {title: '📊 JSON', value: 'json'},
          {title: '📈 CSV', value: 'csv'},
          {title: '🎨 WordPress Export', value: 'wordpress'},
          {title: '📦 Contentful Export', value: 'contentful'},
          {title: '🗄️ Strapi Export', value: 'strapi'},
          {title: '🔗 URL Import', value: 'url'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceFile',
      title: 'Source File',
      type: 'file',
      description: 'Upload the file to import',
      hidden: ({document}) => document?.fileType === 'url',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'URL to import from',
      hidden: ({document}) => document?.fileType !== 'url',
    }),
    defineField({
      name: 'importSettings',
      title: 'Import Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'targetFolder',
          title: 'Target Folder',
          type: 'reference',
          to: [{type: 'folder'}],
          description: 'Import documents into this folder',
        }),
        defineField({
          name: 'documentType',
          title: 'Convert To Document Type',
          type: 'string',
          options: {
            list: [
              {title: '📄 Documentation Page', value: 'doc'},
              {title: '📰 Article', value: 'article'},
              {title: '🚢 Sprint Release', value: 'release'},
              {title: '🗺️ Roadmap Item', value: 'roadmapItem'},
              {title: '📖 Reference Page', value: 'referencePage'},
            ],
          },
          initialValue: 'doc',
        }),
        defineField({
          name: 'preserveFormatting',
          title: 'Preserve Formatting',
          type: 'boolean',
          description: 'Keep original formatting where possible',
          initialValue: true,
        }),
        defineField({
          name: 'extractImages',
          title: 'Extract Images',
          type: 'boolean',
          description: 'Extract embedded images from documents',
          initialValue: true,
        }),
        defineField({
          name: 'createSlugs',
          title: 'Generate Slugs',
          type: 'boolean',
          description: 'Automatically generate URL slugs from titles',
          initialValue: true,
        }),
        defineField({
          name: 'setStatus',
          title: 'Set Document Status',
          type: 'string',
          options: {
            list: [
              {title: '🔘 Draft', value: 'draft'},
              {title: '🟡 In Review', value: 'review'},
              {title: '🟢 Published', value: 'published'},
            ],
          },
          initialValue: 'draft',
        }),
        defineField({
          name: 'addTags',
          title: 'Auto-Add Tags',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'tag'}],
            },
          ],
          description: 'Automatically add these tags to imported documents',
        }),
        defineField({
          name: 'assignTo',
          title: 'Assign To',
          type: 'string',
          description: 'Assign imported documents to this user',
        }),
      ],
    }),
    defineField({
      name: 'documentCount',
      title: 'Documents Found',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'processedCount',
      title: 'Documents Processed',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'errorCount',
      title: 'Errors',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'importedDocuments',
      title: 'Imported Documents',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          name: 'importedDoc',
          fields: [
            defineField({
              name: 'document',
              title: 'Document',
              type: 'reference',
              to: [{type: 'doc'}, {type: 'article'}, {type: 'release'}, {type: 'roadmapItem'}, {type: 'referencePage'}],
            }),
            defineField({
              name: 'originalName',
              title: 'Original Name',
              type: 'string',
            }),
            defineField({
              name: 'status',
              title: 'Import Status',
              type: 'string',
              options: {
                list: [
                  {title: 'Success', value: 'success'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Error', value: 'error'},
                ],
              },
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'errors',
      title: 'Error Log',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          name: 'error',
          fields: [
            defineField({
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
            }),
            defineField({
              name: 'severity',
              title: 'Severity',
              type: 'string',
              options: {
                list: [
                  {title: 'Error', value: 'error'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Info', value: 'info'},
                ],
              },
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'context',
              title: 'Context',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'progress',
      title: 'Progress %',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'startedAt',
      title: 'Started At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
})

export const pasteSettingsType = defineType({
  name: 'pasteSettings',
  title: 'Paste Settings',
  type: 'document',
  singleton: true,
  fields: [
    defineField({
      name: 'title',
      title: 'Settings Title',
      type: 'string',
      initialValue: 'Global Paste Settings',
    }),
    defineField({
      name: 'imageHandling',
      title: 'Image Paste Handling',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Image Paste',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'autoUpload',
          title: 'Auto-Upload to Sanity',
          type: 'boolean',
          description: 'Automatically upload pasted images to Sanity',
          initialValue: true,
        }),
        defineField({
          name: 'optimizeImages',
          title: 'Optimize Images',
          type: 'boolean',
          description: 'Compress and optimize pasted images',
          initialValue: true,
        }),
        defineField({
          name: 'maxFileSize',
          title: 'Max File Size (MB)',
          type: 'number',
          initialValue: 10,
        }),
        defineField({
          name: 'allowedFormats',
          title: 'Allowed Formats',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'PNG', value: 'image/png'},
              {title: 'JPEG', value: 'image/jpeg'},
              {title: 'GIF', value: 'image/gif'},
              {title: 'WebP', value: 'image/webp'},
              {title: 'SVG', value: 'image/svg+xml'},
            ],
          },
          initialValue: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        }),
        defineField({
          name: 'autoGenerateAlt',
          title: 'Auto-Generate Alt Text',
          type: 'boolean',
          description: 'Use AI to generate alt text for pasted images',
          initialValue: false,
        }),
        defineField({
          name: 'defaultWidth',
          title: 'Default Display Width',
          type: 'string',
          options: {
            list: [
              {title: 'Full width', value: 'full'},
              {title: '75%', value: '75'},
              {title: '50%', value: '50'},
              {title: 'Original size', value: 'original'},
            ],
          },
          initialValue: 'full',
        }),
      ],
    }),
    defineField({
      name: 'richTextHandling',
      title: 'Rich Text Paste Handling',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Rich Text Paste',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'stripFormatting',
          title: 'Strip Formatting',
          type: 'boolean',
          description: 'Remove all formatting and paste as plain text',
          initialValue: false,
        }),
        defineField({
          name: 'preserveLinks',
          title: 'Preserve Links',
          type: 'boolean',
          description: 'Keep hyperlinks when pasting',
          initialValue: true,
        }),
        defineField({
          name: 'preserveLists',
          title: 'Preserve Lists',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'preserveHeadings',
          title: 'Preserve Headings',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'convertTables',
          title: 'Convert Tables',
          type: 'boolean',
          description: 'Convert pasted tables to Sanity table blocks',
          initialValue: true,
        }),
        defineField({
          name: 'convertCode',
          title: 'Convert Code Blocks',
          type: 'boolean',
          description: 'Detect and convert code blocks',
          initialValue: true,
        }),
        defineField({
          name: 'smartPaste',
          title: 'Smart Paste Detection',
          type: 'boolean',
          description: 'Intelligently detect and convert URLs, emails, etc.',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'fileHandling',
      title: 'File Paste Handling',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable File Paste',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'autoUpload',
          title: 'Auto-Upload Files',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'createAttachments',
          title: 'Create Attachment Blocks',
          type: 'boolean',
          description: 'Automatically create file attachment blocks',
          initialValue: true,
        }),
        defineField({
          name: 'maxFileSize',
          title: 'Max File Size (MB)',
          type: 'number',
          initialValue: 50,
        }),
        defineField({
          name: 'allowedExtensions',
          title: 'Allowed File Extensions',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'PDF', value: '.pdf'},
              {title: 'DOCX', value: '.docx'},
              {title: 'DOC', value: '.doc'},
              {title: 'TXT', value: '.txt'},
              {title: 'ZIP', value: '.zip'},
              {title: 'RAR', value: '.rar'},
              {title: 'XLSX', value: '.xlsx'},
              {title: 'CSV', value: '.csv'},
              {title: 'JSON', value: '.json'},
            ],
          },
          initialValue: ['.pdf', '.docx', '.txt', '.zip', '.csv'],
        }),
      ],
    }),
    defineField({
      name: 'urlHandling',
      title: 'URL Paste Handling',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable URL Paste Handling',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'autoEmbed',
          title: 'Auto-Embed Media URLs',
          type: 'boolean',
          description: 'Automatically embed YouTube, Vimeo, etc.',
          initialValue: true,
        }),
        defineField({
          name: 'fetchMetadata',
          title: 'Fetch Link Metadata',
          type: 'boolean',
          description: 'Fetch title and description for pasted links',
          initialValue: true,
        }),
        defineField({
          name: 'createBookmarks',
          title: 'Create Bookmark Cards',
          type: 'boolean',
          description: 'Convert URLs to rich bookmark cards',
          initialValue: false,
        }),
      ],
    }),
  ],
})

export const contentTemplateType = defineType({
  name: 'contentTemplate',
  title: 'Content Template',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      description: 'description',
      category: 'category',
    },
    prepare({title, description, category}) {
      const categoryEmojis: Record<string, string> = {
        article: '📰',
        documentation: '📄',
        marketing: '📢',
        legal: '⚖️',
        tutorial: '🎓',
        release: '📋',
        other: '📎',
      }
      return {
        title: `${categoryEmojis[category as string] || '📎'} ${title}`,
        subtitle: description,
      }
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Template Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: '📰 Article', value: 'article'},
          {title: '📄 Documentation', value: 'documentation'},
          {title: '📢 Marketing', value: 'marketing'},
          {title: '⚖️ Legal', value: 'legal'},
          {title: '🎓 Tutorial', value: 'tutorial'},
          {title: '📋 Release Notes', value: 'release'},
          {title: '📎 Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: '📝 Document', value: '📝'},
          {title: '📄 Page', value: '📄'},
          {title: '📰 Article', value: '📰'},
          {title: '📋 List', value: '📋'},
          {title: '📊 Chart', value: '📊'},
          {title: '📷 Image', value: '📷'},
          {title: '🎬 Video', value: '🎬'},
          {title: '📢 Announcement', value: '📢'},
          {title: '🎓 Tutorial', value: '🎓'},
          {title: '📦 Package', value: '📦'},
          {title: '🔧 Settings', value: '🔧'},
          {title: '💡 Idea', value: '💡'},
        ],
      },
      initialValue: '📝',
    }),
    defineField({
      name: 'documentType',
      title: 'Target Document Type',
      type: 'string',
      options: {
        list: [
          {title: 'Documentation Page', value: 'doc'},
          {title: 'Article', value: 'article'},
          {title: 'Sprint Release', value: 'release'},
          {title: 'Reference Page', value: 'referencePage'},
        ],
      },
      initialValue: 'doc',
    }),
    defineField({
      name: 'templateContent',
      title: 'Template Content',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'object',
          name: 'placeholder',
          title: 'Placeholder Field',
          fields: [
            defineField({
              name: 'fieldName',
              title: 'Field Name',
              type: 'string',
            }),
            defineField({
              name: 'fieldType',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Text', value: 'text'},
                  {title: 'Rich Text', value: 'richText'},
                  {title: 'Image', value: 'image'},
                  {title: 'Date', value: 'date'},
                ],
              },
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder Text',
              type: 'string',
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'defaultValues',
      title: 'Default Field Values',
      type: 'object',
      fields: [
        defineField({
          name: 'status',
          title: 'Default Status',
          type: 'string',
          options: {
            list: [
              {title: 'Draft', value: 'draft'},
              {title: 'In Review', value: 'review'},
            ],
          },
          initialValue: 'draft',
        }),
        defineField({
          name: 'tags',
          title: 'Default Tags',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'tag'}],
            },
          ],
        }),
        defineField({
          name: 'folder',
          title: 'Default Folder',
          type: 'reference',
          to: [{type: 'folder'}],
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Template',
      type: 'boolean',
      description: 'Show in quick access templates',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
})
