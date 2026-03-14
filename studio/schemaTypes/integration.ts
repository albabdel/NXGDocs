import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const integrationType = defineType({
  name: 'integration',
  title: 'Integration',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      integrationType: 'integrationType',
      status: 'status',
      logo: 'logo',
    },
    prepare({title, integrationType, status, logo}) {
      const statusEmoji: Record<string, string> = {
        active: 'active',
        beta: 'beta',
        coming_soon: 'soon',
        deprecated: 'deprecated',
      }
      const typeEmoji: Record<string, string> = {
        notification: 'bell',
        ticketing: 'ticket',
        analytics: 'chart',
        storage: 'database',
        security: 'lock',
        automation: 'bolt',
        communication: 'chat',
        data: 'graph',
      }
      const emoji = statusEmoji[status as string] ?? 'unknown'
      const typeIcon = typeEmoji[integrationType as string] ?? 'plug'
      return {
        title: title ?? 'Untitled Integration',
        subtitle: `${status ?? 'Unknown'} - ${integrationType ?? 'Unknown'}`,
        media: logo,
      }
    },
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Integration Name',
      type: 'string',
      description: 'Display name for the integration',
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
      description: 'Brief overview of what this integration provides',
    }),
    defineField({
      name: 'integrationType',
      title: 'Integration Type',
      type: 'string',
      description: 'Category of integration',
      options: {
        list: [
          {title: 'Notification', value: 'notification'},
          {title: 'Ticketing', value: 'ticketing'},
          {title: 'Analytics', value: 'analytics'},
          {title: 'Storage', value: 'storage'},
          {title: 'Security', value: 'security'},
          {title: 'Automation', value: 'automation'},
          {title: 'Communication', value: 'communication'},
          {title: 'Data Export', value: 'data'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      description: 'Third-party provider name (e.g., Slack, PagerDuty, ServiceNow)',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    }),
    defineField({
      name: 'website',
      title: 'Provider Website',
      type: 'url',
      description: 'Link to provider website',
    }),

    // ── API Details ──────────────────────────────────────────────────────
    defineField({
      name: 'apiDetails',
      title: 'API Details',
      type: 'object',
      fields: [
        defineField({
          name: 'apiType',
          title: 'API Type',
          type: 'string',
          options: {
            list: [
              {title: 'REST API', value: 'rest'},
              {title: 'GraphQL', value: 'graphql'},
              {title: 'Webhook', value: 'webhook'},
              {title: 'SOAP', value: 'soap'},
              {title: 'WebSocket', value: 'websocket'},
              {title: 'MQTT', value: 'mqtt'},
            ],
          },
        }),
        defineField({
          name: 'baseUrl',
          title: 'Base URL',
          type: 'url',
          description: 'API base URL',
        }),
        defineField({
          name: 'apiVersion',
          title: 'API Version',
          type: 'string',
          description: 'API version (e.g., v1, v2)',
        }),
        defineField({
          name: 'documentationUrl',
          title: 'API Documentation URL',
          type: 'url',
        }),
      ],
    }),

    // ── Authentication ────────────────────────────────────────────────────
    defineField({
      name: 'authentication',
      title: 'Authentication Methods',
      type: 'array',
      description: 'Supported authentication methods',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'authType',
              title: 'Authentication Type',
              type: 'string',
              options: {
                list: [
                  {title: 'API Key', value: 'apikey'},
                  {title: 'OAuth 2.0', value: 'oauth2'},
                  {title: 'Basic Auth', value: 'basic'},
                  {title: 'Bearer Token', value: 'bearer'},
                  {title: 'JWT', value: 'jwt'},
                  {title: 'Certificate', value: 'certificate'},
                  {title: 'Custom', value: 'custom'},
                ],
              },
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'How to configure this authentication method',
            }),
            defineField({
              name: 'setupSteps',
              title: 'Setup Steps',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Step-by-step instructions for setup',
            }),
          ],
          preview: {
            select: {
              title: 'authType',
            },
          },
        },
      ],
    }),

    // ── Capabilities ──────────────────────────────────────────────────────
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      description: 'What this integration can do',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Send Alerts', value: 'send_alerts'},
          {title: 'Receive Webhooks', value: 'receive_webhooks'},
          {title: 'Create Tickets', value: 'create_tickets'},
          {title: 'Update Tickets', value: 'update_tickets'},
          {title: 'Sync Devices', value: 'sync_devices'},
          {title: 'Import Data', value: 'import_data'},
          {title: 'Export Data', value: 'export_data'},
          {title: 'Real-time Streaming', value: 'streaming'},
          {title: 'Historical Data', value: 'historical'},
          {title: 'Bi-directional Sync', value: 'bidirectional'},
        ],
      },
    }),
    defineField({
      name: 'limitations',
      title: 'Limitations',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Known limitations or constraints',
    }),

    // ── Setup Instructions ────────────────────────────────────────────────
    defineField({
      name: 'setupGuide',
      title: 'Setup Guide Reference',
      type: 'reference',
      to: [{type: 'doc'}],
      description: 'Link to detailed setup documentation',
    }),
    defineField({
      name: 'setupSteps',
      title: 'Quick Setup Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'step', type: 'number', title: 'Step Number'}),
            defineField({name: 'title', type: 'string', title: 'Step Title'}),
            defineField({name: 'description', type: 'text', rows: 2, title: 'Description'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Prerequisites for using this integration',
    }),

    // ── Rate Limits ───────────────────────────────────────────────────────
    defineField({
      name: 'rateLimits',
      title: 'Rate Limits',
      type: 'object',
      fields: [
        defineField({
          name: 'requestsPerSecond',
          title: 'Requests per Second',
          type: 'number',
        }),
        defineField({
          name: 'requestsPerMinute',
          title: 'Requests per Minute',
          type: 'number',
        }),
        defineField({
          name: 'requestsPerDay',
          title: 'Requests per Day',
          type: 'number',
        }),
        defineField({
          name: 'notes',
          title: 'Notes',
          type: 'text',
          rows: 2,
        }),
      ],
    }),

    // ── Status ────────────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Beta', value: 'beta'},
          {title: 'Coming Soon', value: 'coming_soon'},
          {title: 'Deprecated', value: 'deprecated'},
        ],
      },
      initialValue: 'active',
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
