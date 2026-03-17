import { defineType, defineField } from 'sanity';

export const workflowConfigType = defineType({
  name: 'workflowConfig',
  title: 'Workflow Configuration',
  type: 'object',
  fields: [
    defineField({
      name: 'workflowStatus',
      type: 'string',
      title: 'Workflow Status',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending Review', value: 'pending_review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'source',
      type: 'string',
      title: 'Content Source',
      options: {
        list: [
          { title: 'Sanity', value: 'sanity' },
          { title: 'Confluence', value: 'confluence' },
        ],
      },
      initialValue: 'sanity',
    }),
    defineField({
      name: 'submittedAt',
      type: 'datetime',
      title: 'Submitted At',
    }),
    defineField({
      name: 'submittedBy',
      type: 'reference',
      title: 'Submitted By',
      to: [{ type: 'adminUser' }],
    }),
    defineField({
      name: 'reviewedBy',
      type: 'reference',
      title: 'Reviewed By',
      to: [{ type: 'adminUser' }],
    }),
    defineField({
      name: 'reviewedAt',
      type: 'datetime',
      title: 'Reviewed At',
    }),
    defineField({
      name: 'reviewNotes',
      type: 'text',
      title: 'Review Notes',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    }),
    defineField({
      name: 'publishedBy',
      type: 'reference',
      title: 'Published By',
      to: [{ type: 'adminUser' }],
    }),
    defineField({
      name: 'reviewHistory',
      type: 'array',
      title: 'Review History',
      of: [
        defineType({
          type: 'object',
          name: 'reviewEntry',
          fields: [
            defineField({ name: 'action', type: 'string', title: 'Action' }),
            defineField({ name: 'by', type: 'reference', to: [{ type: 'adminUser' }] }),
            defineField({ name: 'at', type: 'datetime', title: 'Timestamp' }),
            defineField({ name: 'notes', type: 'text', title: 'Notes' }),
          ],
        }),
      ],
    }),
  ],
});

export default workflowConfigType;
