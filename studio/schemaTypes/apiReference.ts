import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const apiReferenceType = defineType({
  name: 'apiReference',
  title: 'API Reference',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      method: 'method',
      endpoint: 'endpoint',
    },
    prepare({title, method, endpoint}) {
      const methodColors: Record<string, string> = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
      }
      const m = methodColors[method as string] ?? method
      return {
        title: title ?? 'Untitled Endpoint',
        subtitle: `[${m}] ${endpoint ?? '/unknown'}`,
      }
    },
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Endpoint Name',
      type: 'string',
      description: 'Human-readable name for this endpoint',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 200),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of what this endpoint does',
    }),
    defineField({
      name: 'endpoint',
      title: 'Endpoint Path',
      type: 'string',
      description: 'API path (e.g., /api/v1/stations)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'method',
      title: 'HTTP Method',
      type: 'string',
      options: {
        list: [
          {title: 'GET', value: 'GET'},
          {title: 'POST', value: 'POST'},
          {title: 'PUT', value: 'PUT'},
          {title: 'PATCH', value: 'PATCH'},
          {title: 'DELETE', value: 'DELETE'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'API Category',
      type: 'string',
      description: 'Group this endpoint belongs to',
      options: {
        list: [
          {title: 'Stations', value: 'stations'},
          {title: 'Devices', value: 'devices'},
          {title: 'Alerts', value: 'alerts'},
          {title: 'Integrations', value: 'integrations'},
          {title: 'Users', value: 'users'},
          {title: 'Authentication', value: 'auth'},
          {title: 'Data', value: 'data'},
          {title: 'Webhooks', value: 'webhooks'},
          {title: 'System', value: 'system'},
        ],
      },
    }),
    defineField({
      name: 'deprecated',
      title: 'Deprecated',
      type: 'boolean',
      description: 'Mark this endpoint as deprecated',
      initialValue: false,
    }),
    defineField({
      name: 'deprecationNotice',
      title: 'Deprecation Notice',
      type: 'text',
      rows: 2,
      description: 'Information about deprecation and alternatives',
      hidden: ({document}) => !document?.deprecated,
    }),

    // ── Request Schema ───────────────────────────────────────────────────
    defineField({
      name: 'requestSchema',
      title: 'Request Schema',
      type: 'object',
      fields: [
        defineField({
          name: 'headers',
          title: 'Headers',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({name: 'name', type: 'string', title: 'Header Name'}),
                defineField({name: 'required', type: 'boolean', title: 'Required'}),
                defineField({name: 'description', type: 'string', title: 'Description'}),
                defineField({name: 'example', type: 'string', title: 'Example Value'}),
              ],
            },
          ],
        }),
        defineField({
          name: 'pathParams',
          title: 'Path Parameters',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({name: 'name', type: 'string', title: 'Parameter Name'}),
                defineField({name: 'type', type: 'string', title: 'Type'}),
                defineField({name: 'required', type: 'boolean', title: 'Required'}),
                defineField({name: 'description', type: 'string', title: 'Description'}),
                defineField({name: 'example', type: 'string', title: 'Example Value'}),
              ],
            },
          ],
        }),
        defineField({
          name: 'queryParams',
          title: 'Query Parameters',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({name: 'name', type: 'string', title: 'Parameter Name'}),
                defineField({name: 'type', type: 'string', title: 'Type'}),
                defineField({name: 'required', type: 'boolean', title: 'Required'}),
                defineField({name: 'default', type: 'string', title: 'Default Value'}),
                defineField({name: 'description', type: 'string', title: 'Description'}),
                defineField({name: 'example', type: 'string', title: 'Example Value'}),
              ],
            },
          ],
        }),
        defineField({
          name: 'bodySchema',
          title: 'Request Body Schema',
          type: 'code',
          description: 'JSON schema for request body',
          options: {
            language: 'json',
          },
        }),
        defineField({
          name: 'bodyDescription',
          title: 'Body Description',
          type: 'text',
          rows: 3,
          description: 'Description of request body fields',
        }),
      ],
    }),

    // ── Response Schema ──────────────────────────────────────────────────
    defineField({
      name: 'responseSchema',
      title: 'Response Schema',
      type: 'object',
      fields: [
        defineField({
          name: 'successResponse',
          title: 'Success Response (2xx)',
          type: 'code',
          options: {
            language: 'json',
          },
        }),
        defineField({
          name: 'successDescription',
          title: 'Success Response Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'errorResponses',
          title: 'Error Responses',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({name: 'statusCode', type: 'number', title: 'Status Code'}),
                defineField({name: 'error', type: 'string', title: 'Error Type'}),
                defineField({name: 'description', type: 'string', title: 'Description'}),
                defineField({
                  name: 'example',
                  type: 'code',
                  title: 'Example Response',
                  options: {language: 'json'},
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── Authentication ────────────────────────────────────────────────────
    defineField({
      name: 'authentication',
      title: 'Authentication Required',
      type: 'array',
      description: 'Authentication methods accepted for this endpoint',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'API Key', value: 'apikey'},
          {title: 'Bearer Token', value: 'bearer'},
          {title: 'OAuth 2.0', value: 'oauth2'},
          {title: 'None', value: 'none'},
        ],
      },
    }),
    defineField({
      name: 'permissions',
      title: 'Required Permissions',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Permissions needed to access this endpoint',
    }),

    // ── Rate Limits ───────────────────────────────────────────────────────
    defineField({
      name: 'rateLimit',
      title: 'Rate Limit',
      type: 'object',
      fields: [
        defineField({
          name: 'limit',
          title: 'Request Limit',
          type: 'number',
          description: 'Number of requests allowed',
        }),
        defineField({
          name: 'window',
          title: 'Time Window',
          type: 'string',
          description: 'Time period (e.g., "1s", "1m", "1h")',
        }),
        defineField({
          name: 'headers',
          title: 'Rate Limit Headers',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Headers returned for rate limiting info',
        }),
      ],
    }),

    // ── Code Examples ─────────────────────────────────────────────────────
    defineField({
      name: 'codeExamples',
      title: 'Code Examples / SDK Samples',
      type: 'array',
      description: 'Code examples in various languages',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'Python', value: 'python'},
                  {title: 'cURL', value: 'curl'},
                  {title: 'Go', value: 'go'},
                  {title: 'Java', value: 'java'},
                  {title: 'C#', value: 'csharp'},
                  {title: 'PHP', value: 'php'},
                  {title: 'Ruby', value: 'ruby'},
                ],
              },
            }),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'code',
              options: {
                language: (_: unknown, context: {parent?: {language?: string}}) =>
                  context.parent?.language ?? 'javascript',
              },
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'language',
            },
          },
        },
      ],
    }),

    // ── Examples ──────────────────────────────────────────────────────────
    defineField({
      name: 'examples',
      title: 'Usage Examples',
      type: 'array',
      description: 'Real-world usage examples',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Example Title'}),
            defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
            defineField({
              name: 'request',
              type: 'code',
              title: 'Request Example',
              options: {language: 'json'},
            }),
            defineField({
              name: 'response',
              type: 'code',
              title: 'Response Example',
              options: {language: 'json'},
            }),
          ],
        },
      ],
    }),

    // ── Related ───────────────────────────────────────────────────────────
    defineField({
      name: 'relatedEndpoints',
      title: 'Related Endpoints',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'apiReference'}],
        },
      ],
    }),
    defineField({
      name: 'relatedIntegration',
      title: 'Related Integration',
      type: 'reference',
      to: [{type: 'integration'}],
    }),

    // ── Tags ──────────────────────────────────────────────────────────────
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    // ── Body Content ──────────────────────────────────────────────────────
    enhancedBodyField,

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoMetadata',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
})
