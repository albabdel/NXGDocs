import {defineField} from 'sanity'

export const markdownField = defineField({
  name: 'markdownBody',
  title: 'Body (Markdown)',
  type: 'markdown',
  description: 'Edit content using Markdown syntax. Supports images, code blocks, tables, and more.',
})

export const markdownAlternative = defineField({
  name: 'contentMode',
  title: 'Content Mode',
  type: 'string',
  options: {
    list: [
      {title: 'Visual Editor (Portable Text)', value: 'portable'},
      {title: 'Markdown Editor', value: 'markdown'},
    ],
    layout: 'radio',
  },
  initialValue: 'portable',
})
