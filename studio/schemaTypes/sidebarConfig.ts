import {defineType, defineField} from 'sanity'
import {productField} from './fields/product'

export const sidebarCategoryType = defineType({
  name: 'sidebarCategory',
  title: 'Sidebar Category',
  type: 'document',
  description: 'A category in the sidebar navigation. Organizes documentation into sections.',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      description: 'Display name shown in the sidebar (e.g., "Getting Started", "Devices")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / ID',
      type: 'slug',
      description: 'Unique identifier for this category (used in URLs and references)',
      options: {
        source: 'title',
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 96),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description shown on category index pages',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      description: 'Visual icon for the category',
      options: {
        providers: ['mdi', 'fa', 'hi'],
        outputFormat: 'react',
      },
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'number',
      description: 'Order in the sidebar (lower numbers appear first)',
      initialValue: 100,
      validation: (rule) => rule.min(1).max(999),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'sidebarCategory'}],
      description: 'Nest this category under another category (optional)',
    }),
    defineField({
      name: 'collapsed',
      title: 'Collapsed by Default',
      type: 'boolean',
      description: 'Whether this category should be collapsed when page loads',
      initialValue: false,
    }),
    defineField({
      name: 'collapsible',
      title: 'Collapsible',
      type: 'boolean',
      description: 'Allow users to collapse/expand this category',
      initialValue: true,
    }),
    defineField({
      name: 'link',
      title: 'Category Link',
      type: 'object',
      description: 'Link behavior when clicking the category header',
      fields: [
        defineField({
          name: 'type',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              {title: 'Generated Index', value: 'generated-index'},
              {title: 'Specific Document', value: 'doc'},
              {title: 'External URL', value: 'external'},
              {title: 'None (expandable only)', value: 'none'},
            ],
          },
          initialValue: 'generated-index',
        }),
        defineField({
          name: 'doc',
          title: 'Target Document',
          type: 'reference',
          to: [{type: 'doc'}],
          hidden: ({parent}) => parent?.type !== 'doc',
        }),
        defineField({
          name: 'url',
          title: 'External URL',
          type: 'url',
          hidden: ({parent}) => parent?.type !== 'external',
        }),
      ],
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Which audience(s) should see this category',
      options: {
        list: [
          {title: '👥 All users', value: 'all'},
          {title: '🛡️ Admin', value: 'admin'},
          {title: '📊 Manager', value: 'manager'},
          {title: '🖥️ Operator', value: 'operator'},
          {title: '🖥️ Operator (Minimal)', value: 'operator-minimal'},
          {title: '🔒 Internal only', value: 'internal'},
        ],
      },
      initialValue: ['all'],
    }),
    productField,
  ],
  orderings: [
    {
      title: 'By Position',
      name: 'positionAsc',
      by: [{field: 'position', direction: 'asc'}],
    },
    {
      title: 'By Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
      position: 'position',
      parent: 'parent.title',
      product: 'product',
    },
    prepare({title, icon, position, parent, product}) {
      const productLabel = product?.toUpperCase() || 'GCXONE'
      return {
        title: `${icon || '📁'} ${title}`,
        subtitle: `${productLabel} - ${parent ? `Position ${position} → Inside: ${parent}` : `Position ${position}`}`,
      }
    },
  },
})

export const sidebarConfigType = defineType({
  name: 'sidebarConfig',
  title: 'Sidebar Configuration',
  type: 'document',
  description: 'Master sidebar configuration for a specific audience view',
  fields: [
    defineField({
      name: 'name',
      title: 'Configuration Name',
      type: 'string',
      description: 'e.g., "Admin Sidebar", "Operator Sidebar"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'audience',
      title: 'Target Audience',
      type: 'string',
      description: 'Which audience this sidebar configuration applies to',
      options: {
        list: [
          {title: '👥 All users (Default)', value: 'all'},
          {title: '🛡️ Admin', value: 'admin'},
          {title: '📊 Manager', value: 'manager'},
          {title: '🖥️ Operator', value: 'operator'},
          {title: '🖥️ Operator (Minimal)', value: 'operator-minimal'},
          {title: '🔒 Internal', value: 'internal'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Sidebar Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sidebarCategoryRef',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'reference',
              to: [{type: 'sidebarCategory'}],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'position',
              title: 'Position Override',
              type: 'number',
              description: 'Override the category\'s default position',
            }),
          ],
          preview: {
            select: {
              title: 'category.title',
              icon: 'category.icon',
              position: 'position',
            },
            prepare({title, icon, position}) {
              return {
                title: `${icon || '📁'} ${title || 'Category'}`,
                subtitle: position ? `Position: ${position}` : 'Default position',
              }
            },
          },
        },
      ],
      description: 'Ordered list of categories to include in this sidebar',
    }),
    defineField({
      name: 'showHomeLink',
      title: 'Show Home Link',
      type: 'boolean',
      description: 'Include a "Home" link at the top of the sidebar',
      initialValue: true,
    }),
    defineField({
      name: 'homeLinkLabel',
      title: 'Home Link Label',
      type: 'string',
      initialValue: 'Home',
      hidden: ({parent}) => !parent?.showHomeLink,
    }),
    defineField({
      name: 'customItems',
      title: 'Custom Sidebar Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sidebarLink',
          title: 'Link',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Label', validation: (r) => r.required()}),
            defineField({name: 'href', type: 'string', title: 'URL', validation: (r) => r.required()}),
            defineField({
              name: 'position',
              type: 'number',
              title: 'Position',
              initialValue: 0,
            }),
            defineField({
              name: 'external',
              type: 'boolean',
              title: 'Open in new tab',
              initialValue: false,
            }),
          ],
          preview: {
            select: {label: 'label', href: 'href'},
            prepare({label, href}) {
              return {title: `🔗 ${label}`, subtitle: href}
            },
          },
        },
      ],
      description: 'Additional custom links to add to the sidebar',
    }),
    defineField({
      name: 'isActive',
      title: 'Active Configuration',
      type: 'boolean',
      description: 'Only one configuration per audience can be active',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      audience: 'audience',
      isActive: 'isActive',
    },
    prepare({name, audience, isActive}) {
      const audienceLabels: Record<string, string> = {
        all: 'All Users',
        admin: 'Admin',
        manager: 'Manager',
        operator: 'Operator',
        'operator-minimal': 'Operator (Minimal)',
        internal: 'Internal',
      }
      return {
        title: `${isActive ? '✅' : '⚪'} ${name}`,
        subtitle: `Audience: ${audienceLabels[audience as string] || audience}`,
      }
    },
  },
})
