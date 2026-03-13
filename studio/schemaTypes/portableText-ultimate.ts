import {defineArrayMember, defineField} from 'sanity'
import type {Rule} from 'sanity'
import {PortableTextPasteImageInput} from '../src/components/PortableTextPasteImageInput'

export const enhancedBlockContent = [
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
      {title: 'Lead Paragraph', value: 'lead'},
      {title: 'Small Text', value: 'small'},
      {title: 'Code Block (inline)', value: 'code'},
    ],
    lists: [
      {title: 'Bullet', value: 'bullet'},
      {title: 'Numbered', value: 'number'},
      {title: 'Checklist', value: 'checklist'},
    ],
    marks: {
      decorators: [
        {title: 'Bold', value: 'strong'},
        {title: 'Italic', value: 'em'},
        {title: 'Underline', value: 'underline'},
        {title: 'Strike-through', value: 'strike-through'},
        {title: 'Code', value: 'code'},
        {title: 'Superscript', value: 'sup'},
        {title: 'Subscript', value: 'sub'},
        {title: 'Highlight', value: 'highlight'},
        {title: 'Keyboard Key', value: 'kbd'},
        {title: 'Small Caps', value: 'small-caps'},
        {title: 'Abbreviation', value: 'abbr'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'External Link',
          fields: [
            {name: 'href', type: 'url', title: 'URL'},
            {name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true},
            {name: 'nofollow', type: 'boolean', title: 'Add nofollow'},
          ],
        },
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
            {name: 'anchor', type: 'string', title: 'Anchor (optional)'},
          ],
        },
        {
          name: 'footnote',
          type: 'object',
          title: 'Footnote',
          fields: [
            {name: 'text', type: 'text', title: 'Footnote text', rows: 2},
          ],
        },
        {
          name: 'abbreviation',
          type: 'object',
          title: 'Abbreviation',
          fields: [
            {name: 'fullForm', type: 'string', title: 'Full form'},
          ],
        },
        {
          name: 'definition',
          type: 'object',
          title: 'Definition',
          fields: [
            {name: 'term', type: 'string', title: 'Term'},
            {name: 'definition', type: 'text', title: 'Definition', rows: 2},
          ],
        },
        {
          name: 'citation',
          type: 'object',
          title: 'Citation',
          fields: [
            {name: 'source', type: 'string', title: 'Source'},
            {name: 'url', type: 'url', title: 'URL'},
            {name: 'title', type: 'string', title: 'Title'},
          ],
        },
        {
          name: 'keyboardShortcut',
          type: 'object',
          title: 'Keyboard Shortcut',
          fields: [
            {name: 'keys', type: 'string', title: 'Keys (e.g., Ctrl+S)'},
            {name: 'description', type: 'string', title: 'Description'},
          ],
        },
        {
          name: 'comment',
          type: 'object',
          title: 'Editor Comment',
          fields: [
            {name: 'text', type: 'text', title: 'Comment', rows: 2},
            {name: 'author', type: 'string', title: 'Author'},
          ],
        },
      ],
    },
  }),

  defineArrayMember({
    type: 'code',
    options: {
      language: 'javascript',
      languageAlternatives: [
        {title: 'JavaScript', value: 'javascript'},
        {title: 'TypeScript', value: 'typescript'},
        {title: 'JSX', value: 'jsx'},
        {title: 'TSX', value: 'tsx'},
        {title: 'Bash / Shell', value: 'bash'},
        {title: 'PowerShell', value: 'powershell'},
        {title: 'Python', value: 'python'},
        {title: 'Java', value: 'java'},
        {title: 'C#', value: 'csharp'},
        {title: 'C++', value: 'cpp'},
        {title: 'Go', value: 'go'},
        {title: 'Rust', value: 'rust'},
        {title: 'Ruby', value: 'ruby'},
        {title: 'PHP', value: 'php'},
        {title: 'Swift', value: 'swift'},
        {title: 'Kotlin', value: 'kotlin'},
        {title: 'SQL', value: 'sql'},
        {title: 'GraphQL', value: 'graphql'},
        {title: 'JSON', value: 'json'},
        {title: 'YAML', value: 'yaml'},
        {title: 'XML', value: 'xml'},
        {title: 'HTML', value: 'html'},
        {title: 'CSS', value: 'css'},
        {title: 'SCSS', value: 'scss'},
        {title: 'Markdown', value: 'markdown'},
        {title: 'Dockerfile', value: 'dockerfile'},
        {title: 'TOML', value: 'toml'},
        {title: 'INI', value: 'ini'},
        {title: 'Plaintext', value: 'text'},
      ],
      withFilename: true,
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'callout',
    title: 'Callout / Admonition',
    fields: [
      {
        name: 'type',
        type: 'string',
        title: 'Type',
        options: {
          list: [
            {title: '📝 Note', value: 'note'},
            {title: '💡 Tip', value: 'tip'},
            {title: 'ℹ️ Info', value: 'info'},
            {title: '⚠️ Warning', value: 'warning'},
            {title: '🚫 Danger', value: 'danger'},
            {title: '✅ Success', value: 'success'},
            {title: '❌ Error', value: 'error'},
            {title: '🐛 Bug', value: 'bug'},
            {title: '❓ Question', value: 'question'},
            {title: '📄 Abstract', value: 'abstract'},
            {title: '📝 Example', value: 'example'},
            {title: '🔧 Quote', value: 'quote'},
          ],
          layout: 'grid',
        },
        initialValue: 'note',
      },
      {name: 'title', type: 'string', title: 'Title (optional)'},
      {
        name: 'body',
        type: 'array',
        title: 'Content',
        of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}]}],
      },
      {name: 'collapsible', type: 'boolean', title: 'Collapsible', initialValue: false},
    ],
    preview: {
      select: {type: 'type', title: 'title'},
      prepare({type, title}: {type?: string; title?: string}) {
        const icons: Record<string, string> = {
          note: '📝', tip: '💡', info: 'ℹ️', warning: '⚠️', danger: '🚫',
          success: '✅', error: '❌', bug: '🐛', question: '❓', abstract: '📄',
          example: '📝', quote: '🔧',
        }
        return {title: `${icons[type ?? 'note'] ?? '📝'} ${title ?? type ?? 'Callout'}`}
      },
    },
  }),

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
        validation: (r: Rule) => r.max(180).warning('Add alt text for accessibility before publishing.'),
      },
      {name: 'caption', type: 'string', title: 'Caption'},
      {name: 'credit', type: 'string', title: 'Credit / Attribution'},
      {
        name: 'alignment',
        type: 'string',
        title: 'Alignment',
        options: {
          list: [
            {title: 'Full Width', value: 'full'},
            {title: 'Left', value: 'left'},
            {title: 'Center', value: 'center'},
            {title: 'Right', value: 'right'},
          ],
        },
        initialValue: 'full',
      },
      {
        name: 'width',
        type: 'string',
        title: 'Width',
        options: {
          list: [
            {title: 'Auto', value: 'auto'},
            {title: '100%', value: '100'},
            {title: '75%', value: '75'},
            {title: '50%', value: '50'},
            {title: '33%', value: '33'},
            {title: '25%', value: '25'},
          ],
        },
        initialValue: 'auto',
      },
      {name: 'rounded', type: 'boolean', title: 'Rounded corners', initialValue: false},
      {name: 'shadow', type: 'boolean', title: 'Drop shadow', initialValue: false},
      {name: 'withBorder', type: 'boolean', title: 'Add border'},
      {name: 'withBackground', type: 'boolean', title: 'Add background'},
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
      {
        name: 'isGif',
        type: 'boolean',
        title: 'This is an animated GIF',
        description: 'Check this if uploading a GIF to preserve animation. The raw file URL will be used instead of processed images.',
        initialValue: false,
      },
    ],
  }),

  defineArrayMember({
    type: 'gif',
    title: 'Animated GIF',
  }),

  defineArrayMember({type: 'table'}),

  defineArrayMember({
    type: 'object',
    name: 'videoEmbed',
    title: 'Video Embed',
    fields: [
      {
        name: 'provider',
        type: 'string',
        title: 'Provider',
        options: {
          list: [
            {title: 'YouTube', value: 'youtube'},
            {title: 'Vimeo', value: 'vimeo'},
            {title: 'Loom', value: 'loom'},
            {title: 'Wistia', value: 'wistia'},
          ],
        },
        initialValue: 'youtube',
      },
      {name: 'url', type: 'url', title: 'Video URL'},
      {name: 'videoId', type: 'string', title: 'Video ID (auto-extracted)'},
      {name: 'caption', type: 'string', title: 'Caption'},
      {name: 'startTime', type: 'number', title: 'Start time (seconds)'},
      {name: 'endTime', type: 'number', title: 'End time (seconds)'},
      {name: 'autoplay', type: 'boolean', title: 'Autoplay', initialValue: false},
      {name: 'loop', type: 'boolean', title: 'Loop', initialValue: false},
      {name: 'muted', type: 'boolean', title: 'Muted', initialValue: false},
      {name: 'showControls', type: 'boolean', title: 'Show controls', initialValue: true},
    ],
    preview: {
      select: {url: 'url', caption: 'caption'},
      prepare: ({url, caption}) => ({title: `▶️ ${caption ?? url ?? 'Video'}`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'fileAttachment',
    title: 'File Attachment',
    fields: [
      {name: 'file', type: 'file', title: 'File'},
      {name: 'label', type: 'string', title: 'Button label'},
      {name: 'description', type: 'string', title: 'Description'},
      {
        name: 'style',
        type: 'string',
        title: 'Button style',
        options: {
          list: [
            {title: 'Primary', value: 'primary'},
            {title: 'Secondary', value: 'secondary'},
            {title: 'Outline', value: 'outline'},
          ],
        },
        initialValue: 'primary',
      },
    ],
    preview: {
      select: {label: 'label'},
      prepare: ({label}) => ({title: `📎 ${label ?? 'File Attachment'}`}),
    },
  }),

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
            {title: '─── Solid', value: 'solid'},
            {title: '··· Dotted', value: 'dotted'},
            {title: '- - Dashed', value: 'dashed'},
            {title: '✦ Decorative', value: 'decorative'},
          ],
        },
        initialValue: 'solid',
      },
    ],
    preview: {
      select: {style: 'style'},
      prepare: ({style}) => {
        const labels: Record<string, string> = {solid: '───', dotted: '···', dashed: '- -', decorative: '✦'}
        return {title: `${labels[style ?? 'solid']} Divider`}
      },
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'tabs',
    title: 'Tabs',
    fields: [
      {
        name: 'tabs',
        type: 'array',
        title: 'Tab Items',
        of: [{
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'Tab Label', validation: (r: Rule) => r.required()},
            {name: 'icon', type: 'string', title: 'Icon (optional)'},
            {
              name: 'content',
              type: 'array',
              title: 'Content',
              of: [{type: 'block'}],
            },
          ],
          preview: {
            select: {label: 'label'},
            prepare: ({label}) => ({title: label ?? 'Tab'}),
          },
        }],
        validation: (r: Rule) => r.min(2).max(10),
      },
      {
        name: 'variant',
        type: 'string',
        title: 'Tab Style',
        options: {
          list: [
            {title: 'Default', value: 'default'},
            {title: 'Underline', value: 'underline'},
            {title: 'Pills', value: 'pills'},
            {title: 'Cards', value: 'cards'},
          ],
        },
        initialValue: 'default',
      },
    ],
    preview: {
      select: {tabs: 'tabs'},
      prepare: ({tabs}: {tabs?: unknown[]}) => ({title: `📑 Tabs (${tabs?.length ?? 0} items)`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'accordion',
    title: 'Accordion / FAQ',
    fields: [
      {
        name: 'items',
        type: 'array',
        title: 'Items',
        of: [{
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Question / Title', validation: (r: Rule) => r.required()},
            {
              name: 'content',
              type: 'array',
              title: 'Answer / Content',
              of: [{type: 'block'}],
            },
            {name: 'isOpenByDefault', type: 'boolean', title: 'Open by default', initialValue: false},
          ],
          preview: {
            select: {title: 'title'},
            prepare: ({title}) => ({title: title ?? 'Item'}),
          },
        }],
      },
      {name: 'allowMultiple', type: 'boolean', title: 'Allow multiple open', initialValue: false},
    ],
    preview: {
      select: {items: 'items'},
      prepare: ({items}: {items?: unknown[]}) => ({title: `📚 Accordion (${items?.length ?? 0} items)`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'procedure',
    title: 'Step-by-Step Procedure',
    fields: [
      {name: 'title', type: 'string', title: 'Procedure title'},
      {
        name: 'difficulty',
        type: 'string',
        title: 'Difficulty',
        options: {
          list: [
            {title: '🟢 Beginner', value: 'beginner'},
            {title: '🟡 Intermediate', value: 'intermediate'},
            {title: '🟠 Advanced', value: 'advanced'},
            {title: '🔴 Expert', value: 'expert'},
          ],
        },
      },
      {name: 'estimatedTime', type: 'string', title: 'Estimated time (e.g., "15 min")'},
      {name: 'prerequisites', type: 'text', title: 'Prerequisites'},
      {
        name: 'steps',
        type: 'array',
        title: 'Steps',
        of: [{
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Step title', validation: (r: Rule) => r.required()},
            {
              name: 'body',
              type: 'array',
              title: 'Instructions',
              of: [{type: 'block'}],
            },
            {name: 'image', type: 'image', title: 'Screenshot', options: {hotspot: true}},
            {name: 'tip', type: 'text', title: 'Pro tip (optional)'},
            {name: 'warning', type: 'text', title: 'Warning (optional)'},
            {name: 'isOptional', type: 'boolean', title: 'Optional step'},
          ],
          preview: {
            select: {title: 'title'},
            prepare: ({title}) => ({title: title ?? 'Step'}),
          },
        }],
      },
    ],
    preview: {
      select: {title: 'title', steps: 'steps'},
      prepare: ({title, steps}: {title?: string; steps?: unknown[]}) => ({
        title: `📋 ${title ?? 'Procedure'} (${steps?.length ?? 0} steps)`,
      }),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'card',
    title: 'Card',
    fields: [
      {name: 'title', type: 'string', title: 'Title'},
      {name: 'description', type: 'text', title: 'Description', rows: 2},
      {name: 'image', type: 'image', title: 'Image', options: {hotspot: true}},
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          {name: 'url', type: 'string', title: 'URL'},
          {name: 'label', type: 'string', title: 'Link label'},
          {name: 'openInNewTab', type: 'boolean', title: 'Open in new tab'},
        ],
      },
    ],
    preview: {
      select: {title: 'title'},
      prepare: ({title}) => ({title: `🃏 ${title ?? 'Card'}`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'cardGrid',
    title: 'Card Grid',
    fields: [
      {
        name: 'columns',
        type: 'number',
        title: 'Columns',
        options: {list: [{title: '2', value: 2}, {title: '3', value: 3}, {title: '4', value: 4}]},
        initialValue: 3,
      },
      {
        name: 'cards',
        type: 'array',
        title: 'Cards',
        of: [{type: 'object', name: 'gridCard', fields: [
          {name: 'title', type: 'string', title: 'Title'},
          {name: 'description', type: 'text', title: 'Description', rows: 2},
          {name: 'icon', type: 'string', title: 'Icon name'},
          {name: 'link', type: 'string', title: 'Link URL'},
        ]}],
      },
    ],
    preview: {
      select: {cards: 'cards'},
      prepare: ({cards}: {cards?: unknown[]}) => ({title: `🎴 Card Grid (${cards?.length ?? 0} cards)`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'timeline',
    title: 'Timeline',
    fields: [
      {
        name: 'items',
        type: 'array',
        title: 'Events',
        of: [{
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Title'},
            {name: 'date', type: 'date', title: 'Date'},
            {name: 'description', type: 'text', title: 'Description'},
            {name: 'icon', type: 'string', title: 'Icon'},
          ],
        }],
      },
    ],
    preview: {
      select: {items: 'items'},
      prepare: ({items}: {items?: unknown[]}) => ({title: `📅 Timeline (${items?.length ?? 0} events)`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'comparison',
    title: 'Comparison Table',
    fields: [
      {name: 'title', type: 'string', title: 'Title'},
      {
        name: 'headers',
        type: 'array',
        title: 'Column Headers',
        of: [{type: 'string'}],
      },
      {
        name: 'rows',
        type: 'array',
        title: 'Rows',
        of: [{
          type: 'object',
          fields: [
            {name: 'label', type: 'string', title: 'Row Label'},
            {
              name: 'cells',
              type: 'array',
              title: 'Cell Values',
              of: [{type: 'string'}],
            },
          ],
        }],
      },
    ],
    preview: {
      select: {title: 'title'},
      prepare: ({title}) => ({title: `⚖️ ${title ?? 'Comparison'}`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'codeComparison',
    title: 'Code Comparison (Before/After)',
    fields: [
      {name: 'beforeTitle', type: 'string', title: 'Before label', initialValue: 'Before'},
      {name: 'beforeCode', type: 'code', title: 'Before Code'},
      {name: 'afterTitle', type: 'string', title: 'After label', initialValue: 'After'},
      {name: 'afterCode', type: 'code', title: 'After Code'},
      {name: 'language', type: 'string', title: 'Language'},
    ],
    preview: {
      select: {},
      prepare: () => ({title: '⬅️➡️ Code Comparison'}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'apiEndpoint',
    title: 'API Endpoint',
    fields: [
      {
        name: 'method',
        type: 'string',
        title: 'HTTP Method',
        options: {
          list: [
            {title: 'GET', value: 'GET'},
            {title: 'POST', value: 'POST'},
            {title: 'PUT', value: 'PUT'},
            {title: 'PATCH', value: 'PATCH'},
            {title: 'DELETE', value: 'DELETE'},
          ],
        },
        initialValue: 'GET',
      },
      {name: 'path', type: 'string', title: 'Endpoint Path'},
      {name: 'description', type: 'text', title: 'Description', rows: 2},
      {
        name: 'parameters',
        type: 'array',
        title: 'Parameters',
        of: [{
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Name'},
            {name: 'type', type: 'string', title: 'Type'},
            {name: 'required', type: 'boolean', title: 'Required'},
            {name: 'description', type: 'string', title: 'Description'},
          ],
        }],
      },
      {name: 'requestBody', type: 'code', title: 'Request Body Example'},
      {name: 'response', type: 'code', title: 'Response Example'},
    ],
    preview: {
      select: {method: 'method', path: 'path'},
      prepare: ({method, path}) => ({title: `${method ?? 'GET'} ${path ?? '/api'}`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'mermaidDiagram',
    title: 'Mermaid Diagram',
    fields: [
      {
        name: 'type',
        type: 'string',
        title: 'Diagram Type',
        options: {
          list: [
            {title: 'Flowchart', value: 'flowchart'},
            {title: 'Sequence', value: 'sequenceDiagram'},
            {title: 'Class', value: 'classDiagram'},
            {title: 'State', value: 'stateDiagram'},
            {title: 'ER Diagram', value: 'erDiagram'},
            {title: 'Gantt', value: 'gantt'},
            {title: 'Pie Chart', value: 'pie'},
            {title: 'Mindmap', value: 'mindmap'},
          ],
        },
        initialValue: 'flowchart',
      },
      {name: 'code', type: 'text', title: 'Mermaid Code', rows: 10},
      {name: 'caption', type: 'string', title: 'Caption'},
    ],
    preview: {
      select: {type: 'type'},
      prepare: ({type}) => ({title: `📊 ${type ?? 'Mermaid'} Diagram`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'mathBlock',
    title: 'Math / LaTeX',
    fields: [
      {
        name: 'type',
        type: 'string',
        title: 'Display',
        options: {list: [{title: 'Inline', value: 'inline'}, {title: 'Block', value: 'block'}]},
        initialValue: 'block',
      },
      {name: 'latex', type: 'text', title: 'LaTeX Expression', rows: 3},
    ],
    preview: {
      select: {latex: 'latex'},
      prepare: ({latex}) => ({title: `∑ ${latex?.slice(0, 30) ?? 'Math'}...`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'embed',
    title: 'External Embed',
    fields: [
      {name: 'url', type: 'url', title: 'Embed URL'},
      {name: 'title', type: 'string', title: 'Title'},
      {
        name: 'type',
        type: 'string',
        title: 'Embed Type',
        options: {
          list: [
            {title: 'CodePen', value: 'codepen'},
            {title: 'CodeSandbox', value: 'codesandbox'},
            {title: 'StackBlitz', value: 'stackblitz'},
            {title: 'Figma', value: 'figma'},
            {title: 'Canva', value: 'canva'},
            {title: 'Google Docs', value: 'googledocs'},
            {title: 'Google Slides', value: 'googleslides'},
            {title: 'Calendly', value: 'calendly'},
            {title: 'Typeform', value: 'typeform'},
            {title: 'Lottie', value: 'lottie'},
            {title: 'Custom iFrame', value: 'iframe'},
          ],
        },
      },
      {name: 'height', type: 'number', title: 'Height (px)'},
    ],
    preview: {
      select: {type: 'type', url: 'url'},
      prepare: ({type, url}) => ({title: `🔗 ${type ?? 'Embed'}: ${url?.slice(0, 30)}`}),
    },
  }),

  defineArrayMember({
    type: 'object',
    name: 'rawHtml',
    title: 'Raw HTML / MDX',
    fields: [
      {
        name: 'format',
        type: 'string',
        title: 'Format',
        options: {list: [{title: 'HTML', value: 'html'}, {title: 'MDX', value: 'mdx'}]},
        initialValue: 'html',
      },
      {name: 'code', type: 'text', title: 'Code', rows: 15},
      {name: 'sanitize', type: 'boolean', title: 'Sanitize HTML', initialValue: true},
    ],
    preview: {
      select: {code: 'code'},
      prepare: ({code}) => ({title: `</> ${code?.slice(0, 40) ?? 'Raw HTML'}...`}),
    },
  }),
]

export const enhancedBodyField = defineField({
  name: 'body',
  title: 'Body Content',
  type: 'array',
  components: {
    input: PortableTextPasteImageInput,
  },
  of: enhancedBlockContent,
})
