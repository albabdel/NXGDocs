import {defineType, defineField} from 'sanity'

export const tagType = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      description: 'description',
      color: 'color.hex',
      count: 'usageCount',
    },
    prepare({title, description, count}) {
      return {
        title: `${title}`,
        subtitle: `${count || 0} documents • ${description || ''}`.slice(0, 50),
      }
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(50),
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
      description: 'Brief description of what this tag represents',
    }),
    defineField({
      name: 'color',
      title: 'Tag Color',
      type: 'color',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Tag Category',
      type: 'string',
      options: {
        list: [
          {title: 'Topic', value: 'topic'},
          {title: 'Difficulty', value: 'difficulty'},
          {title: 'Audience', value: 'audience'},
          {title: 'Format', value: 'format'},
          {title: 'Status', value: 'status'},
          {title: 'Department', value: 'department'},
          {title: 'Product', value: 'product'},
          {title: 'Version', value: 'version'},
          {title: 'Priority', value: 'priority'},
          {title: 'Custom', value: 'custom'},
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: '🏷️ Tag', value: '🏷️'},
          {title: '📌 Pin', value: '📌'},
          {title: '🔖 Bookmark', value: '🔖'},
          {title: '📎 Paperclip', value: '📎'},
          {title: '⭐ Star', value: '⭐'},
          {title: '🔥 Hot', value: '🔥'},
          {title: '💡 Idea', value: '💡'},
          {title: '🎯 Target', value: '🎯'},
          {title: '⚡ Quick', value: '⚡'},
          {title: '📢 Announcement', value: '📢'},
          {title: '🔔 Notification', value: '🔔'},
          {title: '❗ Important', value: '❗'},
          {title: '❓ Question', value: '❓'},
          {title: '✅ Complete', value: '✅'},
          {title: '⏳ Pending', value: '⏳'},
          {title: '🔒 Private', value: '🔒'},
          {title: '🌐 Public', value: '🌐'},
          {title: '🔧 Settings', value: '🔧'},
          {title: '📊 Data', value: '📊'},
          {title: '📈 Trending', value: '📈'},
        ],
      },
    }),
    defineField({
      name: 'parent',
      title: 'Parent Tag',
      type: 'reference',
      to: [{type: 'tag'}],
      description: 'Create tag hierarchies',
    }),
    defineField({
      name: 'synonyms',
      title: 'Synonyms',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Alternative names for this tag',
    }),
    defineField({
      name: 'autoApply',
      title: 'Auto-Apply Rules',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'rule',
          fields: [
            defineField({
              name: 'field',
              title: 'Field',
              type: 'string',
              options: {
                list: [
                  {title: 'Title contains', value: 'title'},
                  {title: 'Content contains', value: 'body'},
                  {title: 'Category is', value: 'category'},
                  {title: 'Author is', value: 'author'},
                ],
              },
            }),
            defineField({
              name: 'operator',
              title: 'Operator',
              type: 'string',
              options: {
                list: [
                  {title: 'Contains', value: 'contains'},
                  {title: 'Equals', value: 'equals'},
                  {title: 'Starts with', value: 'startsWith'},
                  {title: 'Ends with', value: 'endsWith'},
                  {title: 'Matches regex', value: 'regex'},
                ],
              },
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'usageCount',
      title: 'Usage Count',
      type: 'number',
      readOnly: true,
      description: 'Automatically updated',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Tag',
      type: 'boolean',
      description: 'Show in tag cloud/suggestions',
      initialValue: false,
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
          name: 'lastUsed',
          title: 'Last Used',
          type: 'datetime',
        }),
      ],
    }),
  ],
})

export const tagGroupType = defineType({
  name: 'tagGroup',
  title: 'Tag Group',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      tagCount: 'tagCount',
    },
    prepare({title, tagCount}) {
      return {
        title: `${title}`,
        subtitle: `${tagCount || 0} tags in group`,
      }
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Group Name',
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
      name: 'tags',
      title: 'Tags in Group',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
    }),
    defineField({
      name: 'allowMultiple',
      title: 'Allow Multiple Selections',
      type: 'boolean',
      description: 'Can documents have multiple tags from this group?',
      initialValue: true,
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      description: 'Must documents have at least one tag from this group?',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
})
