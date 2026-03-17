import { defineType, defineField } from 'sanity';

export const adminUserType = defineType({
  name: 'adminUser',
  title: 'Admin User',
  type: 'document',
  fields: [
    defineField({
      name: 'zohoId',
      type: 'string',
      title: 'Zoho User ID',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Display Name',
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role',
      options: {
        list: [
          { title: 'Admin', value: 'admin' },
          { title: 'Editor', value: 'editor' },
          { title: 'Reviewer', value: 'reviewer' },
        ],
      },
      initialValue: 'admin',
    }),
    defineField({
      name: 'orgId',
      type: 'string',
      title: 'Organization ID',
    }),
    defineField({
      name: 'lastLoginAt',
      type: 'datetime',
      title: 'Last Login',
    }),
    defineField({
      name: 'loginCount',
      type: 'number',
      title: 'Total Logins',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Active',
      initialValue: true,
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
});

export default adminUserType;
