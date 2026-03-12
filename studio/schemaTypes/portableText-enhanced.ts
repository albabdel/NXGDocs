import { defineArrayMember, defineField } from 'sanity'

export default defineField({
  name: 'portableText',
  type: 'array',
  of: [
    // ============ CUSTOM BLOCK TYPES ============
    
    // Code block
    defineArrayMember({
      type: 'object',
      name: 'code',
      title: 'Code Block',
      fields: [
        defineField({
          name: 'language',
          type: 'string',
          options: {
            list: [
              { title: 'Plain Text', value: 'text' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JSX', value: 'jsx' },
              { title: 'TSX', value: 'tsx' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'SCSS', value: 'scss' },
              { title: 'Python', value: 'python' },
              { title: 'Java', value: 'java' },
              { title: 'C', value: 'c' },
              { title: 'C++', value: 'cpp' },
              { title: 'C#', value: 'csharp' },
              { title: 'Go', value: 'go' },
              { title: 'Rust', value: 'rust' },
              { title: 'Ruby', value: 'ruby' },
              { title: 'PHP', value: 'php' },
              { title: 'Swift', value: 'swift' },
              { title: 'Kotlin', value: 'kotlin' },
              { title: 'Dart', value: 'dart' },
              { title: 'Shell', value: 'shell' },
              { title: 'Bash', value: 'bash' },
              { title: 'PowerShell', value: 'powershell' },
              { title: 'SQL', value: 'sql' },
              { title: 'GraphQL', value: 'graphql' },
              { title: 'JSON', value: 'json' },
              { title: 'YAML', value: 'yaml' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'XML', value: 'xml' },
              { title: 'Dockerfile', value: 'dockerfile' },
              { title: 'Makefile', value: 'makefile' },
              { title: 'Lua', value: 'lua' },
              { title: 'R', value: 'r' },
              { title: 'MATLAB', value: 'matlab' },
              { title: 'Perl', value: 'perl' }
            ]
          }
        }),
        defineField({ name: 'code', type: 'text' }),
        defineField({ name: 'filename', type: 'string' }),
        defineField({ name: 'highlightLines', type: 'array', of: [{ type: 'number' }] }),
        defineField({ name: 'showLineNumbers', type: 'boolean', initialValue: true })
      ]
    }),

    // Callout
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          options: {
            list: [
              { title: 'Note', value: 'note' },
              { title: 'Tip', value: 'tip' },
              { title: 'Warning', value: 'warning' },
              { title: 'Danger', value: 'danger' },
              { title: 'Info', value: 'info' },
              { title: 'Abstract', value: 'abstract' },
              { title: 'Success', value: 'success' },
              { title: 'Failure', value: 'failure' },
              { title: 'Question', value: 'question' },
              { title: 'Bug', value: 'bug' },
              { title: 'Quote', value: 'quote' }
            ]
          }
        }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'content', type: 'array', of: [{ type: 'block' }] })
      ]
    }),

    // Image with hotspot
    defineArrayMember({
      type: 'object',
      name: 'imageEnhanced',
      title: 'Enhanced Image',
      fields: [
        defineField({
          name: 'image',
          type: 'image',
          options: { hotspot: true }
        }),
        defineField({ name: 'alt', type: 'string' }),
        defineField({ name: 'caption', type: 'string' }),
        defineField({
          name: 'alignment',
          type: 'string',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' },
              { title: 'Full Width', value: 'full' }
            ]
          }
        }),
        defineField({ name: 'enableLightbox', type: 'boolean', initialValue: true }),
        defineField({ name: 'lazyLoad', type: 'boolean', initialValue: true })
      ]
    }),

    // Table
    defineArrayMember({
      type: 'object',
      name: 'table',
      title: 'Table',
      fields: [
        defineField({
          name: 'rows',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({
                name: 'cells',
                type: 'array',
                of: [{ type: 'string' }]
              }),
              defineField({ name: 'isHeader', type: 'boolean' })
            ]
          }]
        }),
        defineField({ name: 'caption', type: 'string' }),
        defineField({ name: 'enableSorting', type: 'boolean', initialValue: false }),
        defineField({ name: 'enableFiltering', type: 'boolean', initialValue: false })
      ]
    }),

    // Video Embed
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        defineField({
          name: 'provider',
          type: 'string',
          options: {
            list: [
              { title: 'YouTube', value: 'youtube' },
              { title: 'Vimeo', value: 'vimeo' }
            ]
          }
        }),
        defineField({ name: 'videoId', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'startTime', type: 'number', description: 'Start time in seconds' }),
        defineField({ name: 'autoplay', type: 'boolean', initialValue: false }),
        defineField({ name: 'muted', type: 'boolean', initialValue: false }),
        defineField({ name: 'showControls', type: 'boolean', initialValue: true }),
        defineField({ name: 'loop', type: 'boolean', initialValue: false }),
        defineField({
          name: 'aspectRatio',
          type: 'string',
          options: {
            list: [
              { title: '16:9', value: '16:9' },
              { title: '4:3', value: '4:3' },
              { title: '1:1', value: '1:1' },
              { title: '21:9', value: '21:9' }
            ]
          }
        })
      ]
    }),

    // File Attachment
    defineArrayMember({
      type: 'object',
      name: 'fileAttachment',
      title: 'File Attachment',
      fields: [
        defineField({ name: 'file', type: 'file' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'description', type: 'string' }),
        defineField({
          name: 'buttonStyle',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Outline', value: 'outline' },
              { title: 'Ghost', value: 'ghost' }
            ]
          }
        }),
        defineField({ name: 'showFileSize', type: 'boolean', initialValue: true }),
        defineField({ name: 'showFileType', type: 'boolean', initialValue: true })
      ]
    }),

    // Divider
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      fields: [
        defineField({
          name: 'style',
          type: 'string',
          options: {
            list: [
              { title: 'Solid', value: 'solid' },
              { title: 'Dashed', value: 'dashed' },
              { title: 'Dotted', value: 'dotted' },
              { title: 'Gradient', value: 'gradient' },
              { title: 'Decorative', value: 'decorative' }
            ]
          }
        }),
        defineField({ name: 'text', type: 'string' })
      ]
    }),

    // Procedure
    defineArrayMember({
      type: 'object',
      name: 'procedure',
      title: 'Procedure',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'difficulty',
          type: 'string',
          options: {
            list: [
              { title: 'Beginner', value: 'beginner' },
              { title: 'Intermediate', value: 'intermediate' },
              { title: 'Advanced', value: 'advanced' },
              { title: 'Expert', value: 'expert' }
            ]
          }
        }),
        defineField({ name: 'estimatedTime', type: 'string', description: 'e.g., 30 minutes' }),
        defineField({
          name: 'steps',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string' }),
              defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
              defineField({
                name: 'image',
                type: 'image',
                options: { hotspot: true }
              }),
              defineField({
                name: 'tips',
                type: 'array',
                of: [{ type: 'string' }]
              }),
              defineField({ name: 'isOptional', type: 'boolean', initialValue: false })
            ]
          }]
        })
      ]
    }),

    // Tabs
    defineArrayMember({
      type: 'object',
      name: 'tabs',
      title: 'Tabs',
      fields: [
        defineField({
          name: 'tabs',
          type: 'array',
          validation: (Rule) => Rule.min(2).max(10),
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'label', type: 'string' }),
              defineField({
                name: 'content',
                type: 'array',
                of: [{ type: 'block' }]
              }),
              defineField({ name: 'icon', type: 'string' })
            ]
          }]
        }),
        defineField({
          name: 'variant',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Underline', value: 'underline' },
              { title: 'Pills', value: 'pills' },
              { title: 'Cards', value: 'cards' }
            ]
          }
        })
      ]
    }),

    // Accordion
    defineArrayMember({
      type: 'object',
      name: 'accordion',
      title: 'Accordion',
      fields: [
        defineField({
          name: 'items',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string' }),
              defineField({
                name: 'content',
                type: 'array',
                of: [{ type: 'block' }]
              }),
              defineField({ name: 'isOpenByDefault', type: 'boolean', initialValue: false })
            ]
          }]
        }),
        defineField({
          name: 'allowMultiple',
          type: 'boolean',
          initialValue: false,
          description: 'Allow multiple items to be open at once'
        })
      ]
    }),

    // Card
    defineArrayMember({
      type: 'object',
      name: 'card',
      title: 'Card',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'content', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'icon', type: 'string' }),
        defineField({
          name: 'borderColor',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Success', value: 'success' },
              { title: 'Warning', value: 'warning' },
              { title: 'Danger', value: 'danger' }
            ]
          }
        }),
        defineField({
          name: 'link',
          type: 'object',
          fields: [
            defineField({ name: 'url', type: 'string' }),
            defineField({ name: 'isInternal', type: 'boolean', initialValue: true }),
            defineField({ name: 'openInNewTab', type: 'boolean', initialValue: false })
          ]
        })
      ]
    }),

    // Comparison Table
    defineArrayMember({
      type: 'object',
      name: 'comparison',
      title: 'Comparison',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'headers',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'rows',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({
                name: 'cells',
                type: 'array',
                of: [{ type: 'string' }]
              }),
              defineField({ name: 'highlightColumn', type: 'number' })
            ]
          }]
        })
      ]
    }),

    // Timeline
    defineArrayMember({
      type: 'object',
      name: 'timeline',
      title: 'Timeline',
      fields: [
        defineField({
          name: 'orientation',
          type: 'string',
          options: {
            list: [
              { title: 'Vertical', value: 'vertical' },
              { title: 'Horizontal', value: 'horizontal' }
            ]
          }
        }),
        defineField({
          name: 'items',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string' }),
              defineField({ name: 'date', type: 'date' }),
              defineField({ name: 'description', type: 'text' }),
              defineField({
                name: 'status',
                type: 'string',
                options: {
                  list: [
                    { title: 'Completed', value: 'completed' },
                    { title: 'In Progress', value: 'in-progress' },
                    { title: 'Pending', value: 'pending' },
                    { title: 'Upcoming', value: 'upcoming' }
                  ]
                }
              }),
              defineField({ name: 'icon', type: 'string' })
            ]
          }]
        })
      ]
    }),

    // Quiz
    defineArrayMember({
      type: 'object',
      name: 'quiz',
      title: 'Quiz',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'questions',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'question', type: 'text' }),
              defineField({
                name: 'options',
                type: 'array',
                of: [{
                  type: 'object',
                  fields: [
                    defineField({ name: 'text', type: 'string' }),
                    defineField({ name: 'isCorrect', type: 'boolean' }),
                    defineField({ name: 'explanation', type: 'text' })
                  ]
                }]
              }),
              defineField({ name: 'points', type: 'number', initialValue: 1 })
            ]
          }]
        }),
        defineField({ name: 'showResultsImmediately', type: 'boolean', initialValue: true }),
        defineField({ name: 'allowMultipleAttempts', type: 'boolean', initialValue: false })
      ]
    }),

    // Chart
    defineArrayMember({
      type: 'object',
      name: 'chart',
      title: 'Chart',
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          options: {
            list: [
              { title: 'Bar', value: 'bar' },
              { title: 'Line', value: 'line' },
              { title: 'Pie', value: 'pie' },
              { title: 'Doughnut', value: 'doughnut' }
            ]
          }
        }),
        defineField({ name: 'title', type: 'string' }),
        defineField({
          name: 'data',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'label', type: 'string' }),
              defineField({ name: 'value', type: 'number' }),
              defineField({ name: 'color', type: 'string' })
            ]
          }]
        }),
        defineField({ name: 'showLegend', type: 'boolean', initialValue: true }),
        defineField({ name: 'enableTooltips', type: 'boolean', initialValue: true })
      ]
    }),

    // Math/LaTeX
    defineArrayMember({
      type: 'object',
      name: 'math',
      title: 'Math',
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          options: {
            list: [
              { title: 'Inline', value: 'inline' },
              { title: 'Block', value: 'block' }
            ]
          }
        }),
        defineField({
          name: 'expression',
          type: 'text',
          description: 'LaTeX expression'
        })
      ]
    }),

    // Mermaid Diagram
    defineArrayMember({
      type: 'object',
      name: 'mermaid',
      title: 'Mermaid Diagram',
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          options: {
            list: [
              { title: 'Flowchart', value: 'flowchart' },
              { title: 'Sequence', value: 'sequence' },
              { title: 'Class', value: 'class' },
              { title: 'State', value: 'state' },
              { title: 'ER', value: 'er' },
              { title: 'User Journey', value: 'journey' },
              { title: 'Gantt', value: 'gantt' },
              { title: 'Pie', value: 'pie' },
              { title: 'Git Graph', value: 'git' },
              { title: 'Mindmap', value: 'mindmap' }
            ]
          }
        }),
        defineField({
          name: 'code',
          type: 'text',
          description: 'Mermaid diagram code'
        }),
        defineField({ name: 'caption', type: 'string' })
      ]
    }),

    // Raw HTML
    defineArrayMember({
      type: 'object',
      name: 'rawHtml',
      title: 'Raw HTML/MDX',
      fields: [
        defineField({
          name: 'format',
          type: 'string',
          options: {
            list: [
              { title: 'HTML', value: 'html' },
              { title: 'MDX', value: 'mdx' }
            ]
          }
        }),
        defineField({
          name: 'code',
          type: 'text',
          description: 'Raw HTML or MDX code'
        }),
        defineField({
          name: 'sanitize',
          type: 'boolean',
          initialValue: true,
          description: 'Sanitize HTML to prevent XSS'
        })
      ]
    }),

    // ============ STANDARD BLOCK WITH ANNOTATIONS ============
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
        { title: 'Lead', value: 'lead' },
        { title: 'Small', value: 'small' }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Code', value: 'code' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Superscript', value: 'sup' },
          { title: 'Subscript', value: 'sub' },
          { title: 'Highlight', value: 'highlight' },
          { title: 'Low Importance', value: 'low-importance' }
        ],
        annotations: [
          // Link
          {
            type: 'object',
            name: 'link',
            title: 'External Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              }),
              defineField({ name: 'openInNewTab', type: 'boolean', initialValue: true })
            ]
          },
          // Internal Link
          {
            type: 'object',
            name: 'internalLink',
            title: 'Internal Link',
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                to: [
                  { type: 'post' },
                  { type: 'page' },
                  { type: 'product' },
                  { type: 'category' }
                ]
              }),
              defineField({ name: 'anchor', type: 'string' })
            ]
          },
          // Footnote
          {
            type: 'object',
            name: 'footnote',
            title: 'Footnote',
            fields: [
              defineField({ name: 'id', type: 'string' }),
              defineField({ name: 'content', type: 'text' })
            ]
          },
          // Abbreviation
          {
            type: 'object',
            name: 'abbreviation',
            title: 'Abbreviation',
            fields: [
              defineField({ name: 'term', type: 'string' }),
              defineField({ name: 'fullForm', type: 'string' })
            ]
          },
          // Definition
          {
            type: 'object',
            name: 'definition',
            title: 'Definition',
            fields: [
              defineField({ name: 'term', type: 'string' }),
              defineField({ name: 'definition', type: 'text' })
            ]
          },
          // Citation
          {
            type: 'object',
            name: 'citation',
            title: 'Citation',
            fields: [
              defineField({ name: 'author', type: 'string' }),
              defineField({ name: 'title', type: 'string' }),
              defineField({ name: 'year', type: 'number' }),
              defineField({ name: 'url', type: 'url' }),
              defineField({ name: 'pageNumber', type: 'string' })
            ]
          },
          // Keyboard shortcut
          {
            type: 'object',
            name: 'kbd',
            title: 'Keyboard',
            fields: [
              defineField({ name: 'keys', type: 'array', of: [{ type: 'string' }] }),
              defineField({ name: 'description', type: 'string' })
            ]
          },
          // Comment
          {
            type: 'object',
            name: 'comment',
            title: 'Comment',
            fields: [
              defineField({ name: 'id', type: 'string' }),
              defineField({ name: 'text', type: 'text' }),
              defineField({ name: 'author', type: 'string' }),
              defineField({ name: 'timestamp', type: 'datetime' }),
              defineField({
                name: 'visibility',
                type: 'string',
                options: {
                  list: [
                    { title: 'Public', value: 'public' },
                    { title: 'Internal', value: 'internal' }
                  ]
                }
              })
            ]
          },
          // Language
          {
            type: 'object',
            name: 'lang',
            title: 'Language',
            fields: [
              defineField({
                name: 'code',
                type: 'string',
                options: {
                  list: [
                    { title: 'English', value: 'en' },
                    { title: 'Spanish', value: 'es' },
                    { title: 'French', value: 'fr' },
                    { title: 'German', value: 'de' },
                    { title: 'Italian', value: 'it' },
                    { title: 'Portuguese', value: 'pt' },
                    { title: 'Chinese', value: 'zh' },
                    { title: 'Japanese', value: 'ja' },
                    { title: 'Korean', value: 'ko' },
                    { title: 'Russian', value: 'ru' },
                    { title: 'Arabic', value: 'ar' },
                    { title: 'Hindi', value: 'hi' },
                    { title: 'Dutch', value: 'nl' },
                    { title: 'Polish', value: 'pl' },
                    { title: 'Turkish', value: 'tr' }
                  ]
                }
              })
            ]
          }
        ]
      }
    })
  ]
})
