import {defineArrayMember, defineField} from 'sanity'
import type {Rule} from 'sanity'
import {PortableTextPasteImageInput} from '../src/components/PortableTextPasteImageInput'

// ---------------------------------------------------------------------------
// Restricted Portable Text for nested contexts (e.g. callout body)
// — only standard blocks, no custom objects to avoid recursion
// ---------------------------------------------------------------------------
export const restrictedBodyContent = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
    ],
    marks: {
      decorators: [
        {title: 'Bold', value: 'strong'},
        {title: 'Italic', value: 'em'},
        {title: 'Underline', value: 'underline'},
        {title: 'Code', value: 'code'},
        {title: 'Strike-through', value: 'strike-through'},
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
]

// ---------------------------------------------------------------------------
// Main body field — full rich Portable Text with all extensions
// ---------------------------------------------------------------------------
export const bodyField = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  components: {
    input: PortableTextPasteImageInput,
  },
  of: [
    // ── Standard paragraph/heading block ──────────────────────────────────
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'H5', value: 'h5'},
        {title: 'H6', value: 'h6'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Code', value: 'code'},
          {title: 'Strike-through', value: 'strike-through'},
          {title: 'Superscript', value: 'sup'},
          {title: 'Subscript', value: 'sub'},
          {title: 'Highlight', value: 'highlight'},
        ],
        annotations: [
          // External links
          {
            name: 'link',
            type: 'object',
            title: 'External Link',
            fields: [
              {name: 'href', type: 'url', title: 'URL'},
              {name: 'blank', type: 'boolean', title: 'Open in new tab'},
            ],
          },
          // Internal cross-document reference link
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Page Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Target page',
                to: [
                  {type: 'doc'},
                  {type: 'article'},
                  {type: 'referencePage'},
                  {type: 'release'},
                ],
              },
            ],
          },
          // Footnote annotation
          {
            name: 'footnote',
            type: 'object',
            title: 'Footnote',
            fields: [
              {
                name: 'text',
                type: 'text',
                title: 'Footnote text',
                rows: 2,
                validation: (rule: Rule) => rule.required(),
              },
            ],
          },
        ],
      },
    }),

    // ── Code block (via @sanity/code-input) ───────────────────────────────
    defineArrayMember({
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'Bash / Shell', value: 'bash'},
          {title: 'JSON', value: 'json'},
          {title: 'YAML', value: 'yaml'},
          {title: 'Python', value: 'python'},
          {title: 'SQL', value: 'sql'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'XML', value: 'xml'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'Plaintext', value: 'text'},
        ],
        withFilename: true,
      },
    }),

    // ── Callout / Admonition (rich body via restricted PT) ────────────────
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {
          name: 'type',
          type: 'string',
          title: 'Callout type',
          options: {
            list: [
              {title: '📝 Note', value: 'note'},
              {title: '💡 Tip', value: 'tip'},
              {title: '⚠️ Warning', value: 'warning'},
              {title: '🚫 Danger', value: 'danger'},
              {title: 'ℹ️ Info', value: 'info'},
            ],
            layout: 'radio',
          },
          initialValue: 'note',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'title',
          type: 'string',
          title: 'Title (optional override)',
          description: 'Leave blank to use the callout type as the title',
        },
        {
          name: 'body',
          type: 'array',
          title: 'Content',
          of: restrictedBodyContent,
          validation: (rule: Rule) => rule.required(),
        },
      ],
      preview: {
        select: {type: 'type', title: 'title'},
        prepare({type, title}: {type?: string; title?: string}) {
          const icons: Record<string, string> = {
            note: '📝', tip: '💡', warning: '⚠️', danger: '🚫', info: 'ℹ️',
          }
          const icon = icons[type ?? 'note'] ?? '📝'
          return {title: `${icon} ${title ?? (type ?? 'Callout').toUpperCase()}`}
        },
      },
    }),

    // ── Image block ───────────────────────────────────────────────────────
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette', 'blurhash', 'exif', 'location'],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Recommended for accessibility. Add before publishing.',
          validation: (rule: Rule) => rule.max(180).warning('Add alt text for accessibility before publishing.'),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'credit',
          type: 'string',
          title: 'Credit / Attribution',
        },
        {
          name: 'width',
          type: 'string',
          title: 'Display width',
          options: {
            list: [
              {title: 'Full width', value: 'full'},
              {title: '75%', value: '75'},
              {title: '50%', value: '50'},
              {title: '25%', value: '25'},
            ],
          },
          initialValue: 'full',
        },
        {
          name: 'rounded',
          type: 'boolean',
          title: 'Rounded corners',
          initialValue: false,
        },
        {
          name: 'shadow',
          type: 'boolean',
          title: 'Drop shadow',
          initialValue: false,
        },
        {
          name: 'linkUrl',
          type: 'url',
          title: 'Link URL (optional)',
        },
        {
          name: 'openInNewTab',
          type: 'boolean',
          title: 'Open link in new tab',
          initialValue: false,
          hidden: ({parent}) => !parent?.linkUrl,
        },
      ],
    }),

    // ── Table (via @sanity/table) ─────────────────────────────────────────
    defineArrayMember({type: 'table'}),

    // ── YouTube / Video embed ─────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'YouTube or Vimeo URL',
          description: 'e.g. https://www.youtube.com/watch?v=xxxxx',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption (optional)',
        },
        {
          name: 'autoplay',
          type: 'boolean',
          title: 'Autoplay',
          initialValue: false,
        },
      ],
      preview: {
        select: {url: 'url', caption: 'caption'},
        prepare({url, caption}: {url?: string; caption?: string}) {
          return {title: `▶ ${caption ?? url ?? 'Video Embed'}`}
        },
      },
    }),

    // ── File attachment / download ────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'fileAttachment',
      title: 'File Attachment',
      fields: [
        {
          name: 'file',
          type: 'file',
          title: 'File',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'label',
          type: 'string',
          title: 'Download label',
          description: 'Text for the download link, e.g. "Download Installation Guide (PDF)"',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'description',
          type: 'string',
          title: 'Description (optional)',
        },
      ],
      preview: {
        select: {label: 'label', description: 'description'},
        prepare({label, description}: {label?: string; description?: string}) {
          return {title: `📎 ${label ?? 'File Attachment'}`, subtitle: description}
        },
      },
    }),

    // ── Horizontal divider (HR) ───────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      fields: [
        {
          name: 'style',
          type: 'string',
          title: 'Style',
          options: {
            list: [
              {title: '─── Simple line', value: 'line'},
              {title: '· · · Dotted', value: 'dotted'},
              {title: '✦ Decorative', value: 'decorative'},
            ],
          },
          initialValue: 'line',
        },
      ],
      preview: {
        select: {style: 'style'},
        prepare({style}: {style?: string}) {
          const labels: Record<string, string> = {
            line: '─── Divider', dotted: '· · · Divider', decorative: '✦ Divider',
          }
          return {title: labels[style ?? 'line'] ?? '─── Divider'}
        },
      },
    }),

    // ── Step-by-step procedure ────────────────────────────────────────────
    defineArrayMember({
      type: 'object',
      name: 'procedure',
      title: 'Step-by-step Procedure',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Procedure title',
          description: 'e.g. "How to set up NXGEN"',
        },
        {
          name: 'steps',
          type: 'array',
          title: 'Steps',
          of: [
            {
              type: 'object',
              name: 'step',
              fields: [
                {
                  name: 'title',
                  type: 'string',
                  title: 'Step title',
                  validation: (rule: Rule) => rule.required(),
                },
                {
                  name: 'body',
                  type: 'array',
                  title: 'Instructions',
                  of: restrictedBodyContent,
                },
              ],
              preview: {
                select: {title: 'title'},
                prepare({title}: {title?: string}) {
                  return {title: title ?? 'Step'}
                },
              },
            },
          ],
          validation: (rule: Rule) => rule.min(1),
        },
      ],
      preview: {
        select: {title: 'title', steps: 'steps'},
        prepare({title, steps}: {title?: string; steps?: unknown[]}) {
          const count = steps?.length ?? 0
          return {title: `📋 ${title ?? 'Procedure'} (${count} step${count !== 1 ? 's' : ''})`}
        },
      },
    }),

    // ── Raw HTML / MDX passthrough ────────────────────────────────────────
    // Use for: Docusaurus <Tabs>, <details>, custom HTML / MDX.
    // Content is written verbatim into the rendered .md file.
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
          return {title: `</> ${html?.slice(0, 80) ?? 'Raw HTML/MDX'}`}
        },
      },
    }),
  ],
})
