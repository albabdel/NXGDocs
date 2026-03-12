import {defineType, defineField} from 'sanity'

export const folderType = defineType({
  name: 'folder',
  title: 'Folder',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      description: 'description',
      parentFolder: 'parent.name',
      icon: 'icon',
    },
    prepare({title, description, parentFolder, icon}) {
      return {
        title: `${icon || '📁'} ${title}`,
        subtitle: parentFolder ? `Inside: ${parentFolder}` : description || 'Root folder',
      }
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Folder Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'parent',
      title: 'Parent Folder',
      type: 'reference',
      to: [{type: 'folder'}],
      description: 'Place this folder inside another folder (optional)',
    }),
    defineField({
      name: 'icon',
      title: 'Folder Icon',
      type: 'string',
      options: {
        list: [
          {title: '📁 Folder', value: '📁'},
          {title: '📂 Open Folder', value: '📂'},
          {title: '📚 Documentation', value: '📚'},
          {title: '📖 Book', value: '📖'},
          {title: '🎓 Learning', value: '🎓'},
          {title: '💼 Business', value: '💼'},
          {title: '🏢 Corporate', value: '🏢'},
          {title: '📊 Reports', value: '📊'},
          {title: '📈 Analytics', value: '📈'},
          {title: '🔧 Settings', value: '🔧'},
          {title: '⚙️ Configuration', value: '⚙️'},
          {title: '🎯 Goals', value: '🎯'},
          {title: '📋 Tasks', value: '📋'},
          {title: '✅ Checklist', value: '✅'},
          {title: '📝 Notes', value: '📝'},
          {title: '💡 Ideas', value: '💡'},
          {title: '🔍 Research', value: '🔍'},
          {title: '🔬 Science', value: '🔬'},
          {title: '💻 Development', value: '💻'},
          {title: '🚀 Deployment', value: '🚀'},
          {title: '🐛 Bugs', value: '🐛'},
          {title: '🔒 Security', value: '🔒'},
          {title: '👥 Users', value: '👥'},
          {title: '📞 Support', value: '📞'},
          {title: '❓ Help', value: '❓'},
          {title: '🎨 Design', value: '🎨'},
          {title: '🎭 Creative', value: '🎭'},
          {title: '🎬 Media', value: '🎬'},
          {title: '📷 Images', value: '📷'},
          {title: '🎵 Audio', value: '🎵'},
          {title: '🎬 Video', value: '🎬'},
          {title: '📁 Archive', value: '🗄️'},
          {title: '📦 Package', value: '📦'},
          {title: '🏷️ Tags', value: '🏷️'},
          {title: '📅 Calendar', value: '📅'},
          {title: '📍 Location', value: '📍'},
          {title: '🌐 Global', value: '🌐'},
          {title: '⚡ Quick', value: '⚡'},
          {title: '⭐ Important', value: '⭐'},
          {title: '🔥 Hot', value: '🔥'},
          {title: '💎 Premium', value: '💎'},
        ],
      },
      initialValue: '📁',
    }),
    defineField({
      name: 'color',
      title: 'Folder Color',
      type: 'color',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'permissions',
      title: 'Access Permissions',
      type: 'object',
      fields: [
        defineField({
          name: 'read',
          title: 'Who can view',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Everyone', value: 'public'},
              {title: 'Logged in users', value: 'authenticated'},
              {title: 'Editors only', value: 'editor'},
              {title: 'Admins only', value: 'admin'},
            ],
          },
        }),
        defineField({
          name: 'write',
          title: 'Who can edit',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Editors', value: 'editor'},
              {title: 'Admins only', value: 'admin'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        defineField({
          name: 'createdBy',
          title: 'Created By',
          type: 'string',
        }),
        defineField({
          name: 'createdAt',
          title: 'Created At',
          type: 'datetime',
        }),
        defineField({
          name: 'lastModifiedBy',
          title: 'Last Modified By',
          type: 'string',
        }),
        defineField({
          name: 'lastModifiedAt',
          title: 'Last Modified At',
          type: 'datetime',
        }),
      ],
    }),
  ],
})

export const documentFolderType = defineType({
  name: 'documentFolder',
  title: 'Document in Folder',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      folder: 'folder.name',
      type: 'documentType',
      status: 'status',
    },
    prepare({title, folder, type, status}) {
      const typeEmoji: Record<string, string> = {
        doc: '📄',
        article: '📰',
        releaseNote: '📋',
        referencePage: '📖',
      }
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        approved: '🔵',
        published: '🟢',
        archived: '⚪',
      }
      return {
        title: `${typeEmoji[type as string] || '📄'} ${title}`,
        subtitle: folder ? `📁 ${folder}` : statusEmoji[status as string] || '🔘',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'folder',
      title: 'Folder',
      type: 'reference',
      to: [{type: 'folder'}],
      description: 'Select which folder this document belongs to',
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      options: {
        list: [
          {title: '📄 Documentation Page', value: 'doc'},
          {title: '📰 Article', value: 'article'},
          {title: '📋 Release Note', value: 'releaseNote'},
          {title: '📖 Reference Page', value: 'referencePage'},
        ],
      },
      initialValue: 'doc',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '🔘 Draft', value: 'draft'},
          {title: '🟡 In Review', value: 'review'},
          {title: '🔵 Approved', value: 'approved'},
          {title: '🟢 Published', value: 'published'},
          {title: '⚪ Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'order',
      title: 'Order in Folder',
      type: 'number',
      description: 'Position within the folder',
      initialValue: 0,
    }),
    defineField({
      name: 'embeddedContent',
      title: 'Embed External Content',
      type: 'array',
      of: [
        defineField({
          name: 'embed',
          title: 'Embed',
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Embed Type',
              type: 'string',
              options: {
                list: [
                  {title: '🔗 External Link', value: 'external'},
                  {title: '📄 Internal Document', value: 'internal'},
                  {title: '📁 Another Folder', value: 'folder'},
                  {title: '📎 File Attachment', value: 'file'},
                ],
              },
            }),
            defineField({
              name: 'title',
              title: 'Display Title',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
            defineField({
              name: 'reference',
              title: 'Internal Reference',
              type: 'reference',
              to: [{type: 'doc'}, {type: 'article'}, {type: 'releaseNote'}, {type: 'referencePage'}, {type: 'folder'}],
            }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
            }),
          ],
        }),
      ],
    }),
  ],
})
