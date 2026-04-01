import {defineField} from 'sanity'

export const productField = defineField({
  name: 'product',
  title: 'Product',
  type: 'string',
  description: "Which product(s) this content belongs to. Use 'shared' for content that appears in all products.",
  options: {
    list: [
      {title: 'GCXONE', value: 'gcxone'},
      {title: 'GC Surge', value: 'gcsurge'},
      {title: 'Shared (All Products)', value: 'shared'},
    ],
    layout: 'radio',
  },
  initialValue: 'gcxone',
  validation: (rule) => rule.required(),
})
