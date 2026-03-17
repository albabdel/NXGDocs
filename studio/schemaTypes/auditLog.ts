import { defineType, defineField } from 'sanity';

export const auditLogType = defineType({
  name: 'auditLog',
  title: 'Audit Log',
  type: 'document',
  fields: [
    defineField({
      name: 'action',
      type: 'string',
      title: 'Action Type',
      options: {
        list: [
          { title: 'Content Create', value: 'content.create' },
          { title: 'Content Update', value: 'content.update' },
          { title: 'Content Delete', value: 'content.delete' },
          { title: 'Content Publish', value: 'content.publish' },
          { title: 'Content Approve', value: 'content.approve' },
          { title: 'Content Reject', value: 'content.reject' },
          { title: 'Route Create', value: 'route.create' },
          { title: 'Route Update', value: 'route.update' },
          { title: 'Route Delete', value: 'route.delete' },
          { title: 'User Login', value: 'user.login' },
          { title: 'User Logout', value: 'user.logout' },
          { title: 'Settings Update', value: 'settings.update' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'actor',
      type: 'reference',
      title: 'Actor',
      to: [{ type: 'adminUser' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resourceType',
      type: 'string',
      title: 'Resource Type',
      options: {
        list: [
          { title: 'Document', value: 'doc' },
          { title: 'Article', value: 'article' },
          { title: 'Release', value: 'release' },
          { title: 'Roadmap Item', value: 'roadmapItem' },
          { title: 'Route Config', value: 'routeConfig' },
          { title: 'Admin User', value: 'adminUser' },
        ],
      },
    }),
    defineField({
      name: 'resourceId',
      type: 'string',
      title: 'Resource ID',
    }),
    defineField({
      name: 'resourceTitle',
      type: 'string',
      title: 'Resource Title',
    }),
    defineField({
      name: 'changes',
      type: 'object',
      title: 'Changes',
      fields: [
        defineField({
          name: 'before',
          type: 'text',
          title: 'Before (JSON)',
        }),
        defineField({
          name: 'after',
          type: 'text',
          title: 'After (JSON)',
        }),
      ],
    }),
    defineField({
      name: 'metadata',
      type: 'object',
      title: 'Metadata',
      fields: [
        defineField({
          name: 'ipAddress',
          type: 'string',
          title: 'IP Address',
        }),
        defineField({
          name: 'userAgent',
          type: 'string',
          title: 'User Agent',
        }),
        defineField({
          name: 'source',
          type: 'string',
          title: 'Source',
        }),
      ],
    }),
    defineField({
      name: 'timestamp',
      type: 'datetime',
      title: 'Timestamp',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'action',
      subtitle: 'timestamp',
    },
  },
});

export default auditLogType;
