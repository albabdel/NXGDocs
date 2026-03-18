import { defineType, defineField } from 'sanity';

export const notificationType = defineType({
  name: 'notification',
  title: 'Notification',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      title: 'Notification Type',
      options: {
        list: [
          { title: 'Content Submitted for Review', value: 'content.submitted' },
          { title: 'Content Approved', value: 'content.approved' },
          { title: 'Content Rejected', value: 'content.rejected' },
          { title: 'Ticket Assigned', value: 'ticket.assigned' },
          { title: 'Ticket Status Changed', value: 'ticket.status_changed' },
          { title: 'System Alert', value: 'system.alert' },
          { title: 'New Device Login', value: 'user.new_device_login' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recipient',
      type: 'reference',
      title: 'Recipient',
      to: [{ type: 'adminUser' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      type: 'text',
      title: 'Message',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'read',
      type: 'boolean',
      title: 'Read',
      initialValue: false,
    }),
    defineField({
      name: 'readAt',
      type: 'datetime',
      title: 'Read At',
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
          { title: 'Ticket', value: 'ticket' },
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
      name: 'priority',
      type: 'string',
      title: 'Priority',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'metadata',
      type: 'object',
      title: 'Metadata',
      fields: [
        defineField({
          name: 'ticketId',
          type: 'string',
          title: 'Ticket ID',
        }),
        defineField({
          name: 'ticketStatus',
          type: 'string',
          title: 'Ticket Status',
        }),
        defineField({
          name: 'contentTitle',
          type: 'string',
          title: 'Content Title',
        }),
        defineField({
          name: 'deviceName',
          type: 'string',
          title: 'Device Name',
        }),
        defineField({
          name: 'location',
          type: 'string',
          title: 'Location',
        }),
        defineField({
          name: 'ipAddress',
          type: 'string',
          title: 'IP Address',
        }),
        defineField({
          name: 'alertLevel',
          type: 'string',
          title: 'Alert Level',
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
      title: 'title',
      subtitle: 'timestamp',
      media: 'type',
    },
  },
  orderings: [
    {
      title: 'Timestamp New -> Old',
      name: 'timestampDesc',
      by: [{ field: 'timestamp', direction: 'desc' }],
    },
    {
      title: 'Timestamp Old -> New',
      name: 'timestampAsc',
      by: [{ field: 'timestamp', direction: 'asc' }],
    },
  ],
});

export default notificationType;
