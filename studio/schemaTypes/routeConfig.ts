import {defineType, defineField} from 'sanity'

export const routeConfigType = defineType({
  name: 'routeConfig',
  title: 'Route Configuration',
  type: 'document',
  description: 'Dynamic route configuration for the documentation site',
  fields: [
    defineField({
      name: 'path',
      type: 'string',
      title: 'Route Path',
      description: 'URL path (e.g., /docs/getting-started)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Route Title',
    }),
    defineField({
      name: 'contentRef',
      type: 'reference',
      title: 'Content Reference',
      to: [
        {type: 'doc'},
        {type: 'article'},
        {type: 'release'},
        {type: 'roadmapItem'},
        {type: 'landingPage'},
      ],
    }),
    defineField({
      name: 'component',
      type: 'string',
      title: 'Component Type',
      options: {
        list: [
          {title: 'Doc Page', value: 'DocPage'},
          {title: 'Landing Page', value: 'LandingPage'},
          {title: 'Article', value: 'Article'},
          {title: 'Release Notes', value: 'ReleasePage'},
          {title: 'Redirect', value: 'Redirect'},
        ],
      },
      initialValue: 'DocPage',
    }),
    defineField({
      name: 'redirectUrl',
      type: 'string',
      title: 'Redirect URL',
      description: 'If component is Redirect, the destination URL',
      hidden: ({parent}) => parent?.component !== 'Redirect',
    }),
    defineField({
      name: 'isPublished',
      type: 'boolean',
      title: 'Published',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'For ordering in navigation',
    }),
    defineField({
      name: 'navConfig',
      type: 'object',
      title: 'Navigation Config',
      fields: [
        defineField({
          name: 'showInNav',
          type: 'boolean',
          title: 'Show in Navigation',
          initialValue: true,
        }),
        defineField({
          name: 'navLabel',
          type: 'string',
          title: 'Navigation Label',
        }),
        defineField({
          name: 'navIcon',
          type: 'string',
          title: 'Icon Name',
        }),
      ],
    }),
    defineField({
      name: 'workflowConfig',
      type: 'workflowConfig',
      title: 'Workflow',
    }),
  ],
  preview: {
    select: {
      title: 'path',
      subtitle: 'title',
    },
  },
})
