import {defineArrayMember, defineField} from 'sanity'
import type {Rule} from 'sanity'

export const bodyField = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    // Standard paragraph/heading block
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {name: 'href', type: 'url', title: 'URL'},
              {name: 'blank', type: 'boolean', title: 'Open in new tab'},
            ],
          },
        ],
      },
    }),
    // Code block with language selector (via @sanity/code-input)
    defineArrayMember({
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'Bash', value: 'bash'},
          {title: 'JSON', value: 'json'},
          {title: 'YAML', value: 'yaml'},
          {title: 'Python', value: 'python'},
          {title: 'SQL', value: 'sql'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Plaintext', value: 'text'},
        ],
      },
    }),
    // Admonition/Callout — body is plain text (type: 'text') NOT nested Portable Text
    // Reason: nested PT causes Studio recursion issues; plain text is the Phase 2 decision
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              {title: 'Note', value: 'note'},
              {title: 'Tip', value: 'tip'},
              {title: 'Warning', value: 'warning'},
              {title: 'Danger', value: 'danger'},
            ],
          },
          initialValue: 'note',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'body',
          type: 'text',
          title: 'Content',
          validation: (rule: Rule) => rule.required(),
        },
      ],
      preview: {
        select: {type: 'type', body: 'body'},
        prepare({type, body}: {type?: string; body?: string}) {
          return {title: `[${type?.toUpperCase() ?? 'CALLOUT'}] ${body?.slice(0, 60) ?? ''}`}
        },
      },
    }),
    // Image with required alt text and optional caption
    defineArrayMember({
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    // Table (via @sanity/table — cells are plain strings, not Portable Text)
    defineArrayMember({type: 'table'}),
    // Raw HTML / MDX passthrough — content is written verbatim into the rendered page.
    // Use for: Docusaurus <Tabs>, <details>, custom HTML, or any markup not
    // expressible as standard Portable Text blocks.
    // On the live site this renders as raw HTML inside the markdown file.
    defineArrayMember({
      type: 'object',
      name: 'rawHtml',
      title: 'Raw HTML / MDX',
      fields: [
        {
          name: 'html',
          type: 'text',
          title: 'HTML / MDX',
          description:
            'Paste raw HTML or Docusaurus MDX markup. Rendered verbatim on the live site.',
          rows: 10,
        },
      ],
      preview: {
        select: {html: 'html'},
        prepare({html}: {html?: string}) {
          return {title: `[HTML] ${html?.slice(0, 80) ?? ''}`}
        },
      },
    }),
  ],
})
