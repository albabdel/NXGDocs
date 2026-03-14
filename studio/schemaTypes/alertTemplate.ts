import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const alertTemplateType = defineType({
  name: 'alertTemplate',
  title: 'Alert Template',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      alertType: 'alertType',
      severity: 'severity',
    },
    prepare({title, alertType, severity}) {
      const severityEmoji: Record<string, string> = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🔵',
        info: '⚪',
      }
      const typeEmoji: Record<string, string> = {
        threshold: '📊',
        anomaly: '📈',
        heartbeat: '💓',
        schedule: '⏰',
        compound: '🔗',
      }
      const emoji = severityEmoji[severity as string] ?? '⚪'
      const typeIcon = typeEmoji[alertType as string] ?? '🔔'
      return {
        title: title ?? 'Untitled Alert',
        subtitle: `${emoji} ${severity ?? 'Unknown'} • ${typeIcon} ${alertType ?? 'Unknown'}`,
      }
    },
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Alert Name',
      type: 'string',
      description: 'Descriptive name for this alert template',
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
      description: 'What this alert monitors and when it triggers',
    }),
    defineField({
      name: 'alertType',
      title: 'Alert Type',
      type: 'string',
      description: 'Category of alert trigger',
      options: {
        list: [
          {title: '📊 Threshold Alert', value: 'threshold'},
          {title: '📈 Anomaly Detection', value: 'anomaly'},
          {title: '💓 Heartbeat/Ping', value: 'heartbeat'},
          {title: '⏰ Schedule-Based', value: 'schedule'},
          {title: '🔗 Compound/Logical', value: 'compound'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'severity',
      title: 'Default Severity',
      type: 'string',
      description: 'Default severity level for alerts from this template',
      options: {
        list: [
          {title: '🔴 Critical', value: 'critical'},
          {title: '🟠 High', value: 'high'},
          {title: '🟡 Medium', value: 'medium'},
          {title: '🔵 Low', value: 'low'},
          {title: '⚪ Informational', value: 'info'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (rule) => rule.required(),
    }),

    // ── Conditions/Triggers ──────────────────────────────────────────────
    defineField({
      name: 'conditions',
      title: 'Trigger Conditions',
      type: 'array',
      description: 'Conditions that trigger this alert',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'metric',
              title: 'Metric',
              type: 'string',
              description: 'The metric to monitor (e.g., "cpu_usage", "temperature", "response_time")',
            }),
            defineField({
              name: 'operator',
              title: 'Operator',
              type: 'string',
              options: {
                list: [
                  {title: 'Greater than (>)', value: 'gt'},
                  {title: 'Greater than or equal (>=)', value: 'gte'},
                  {title: 'Less than (<)', value: 'lt'},
                  {title: 'Less than or equal (<=)', value: 'lte'},
                  {title: 'Equals (==)', value: 'eq'},
                  {title: 'Not equals (!=)', value: 'neq'},
                  {title: 'Between', value: 'between'},
                ],
              },
            }),
            defineField({
              name: 'threshold',
              title: 'Threshold Value',
              type: 'number',
              description: 'The value to compare against',
            }),
            defineField({
              name: 'thresholdMax',
              title: 'Maximum Threshold',
              type: 'number',
              description: 'For "between" operator',
            }),
            defineField({
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'How long the condition must persist (e.g., "5m", "1h")',
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
              description: 'Unit of measurement (e.g., "%", "°C", "ms")',
            }),
          ],
          preview: {
            select: {
              title: 'metric',
              subtitle: 'threshold',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'conditionLogic',
      title: 'Condition Logic',
      type: 'string',
      description: 'How to combine multiple conditions',
      options: {
        list: [
          {title: 'All conditions (AND)', value: 'and'},
          {title: 'Any condition (OR)', value: 'or'},
        ],
      },
      initialValue: 'and',
    }),

    // ── Notification Channels ─────────────────────────────────────────────
    defineField({
      name: 'notificationChannels',
      title: 'Notification Channels',
      type: 'array',
      description: 'Where to send alerts',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'channelType',
              title: 'Channel Type',
              type: 'string',
              options: {
                list: [
                  {title: '📧 Email', value: 'email'},
                  {title: '📱 SMS', value: 'sms'},
                  {title: '💬 Slack', value: 'slack'},
                  {title: '💬 Microsoft Teams', value: 'teams'},
                  {title: '🔔 Push Notification', value: 'push'},
                  {title: '📞 Voice Call', value: 'voice'},
                  {title: '🔗 Webhook', value: 'webhook'},
                  {title: '🎫 Ticket System', value: 'ticket'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'recipients',
              title: 'Recipients',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Email addresses, phone numbers, or channel IDs',
            }),
            defineField({
              name: 'template',
              title: 'Message Template',
              type: 'text',
              rows: 2,
              description: 'Custom message template for this channel',
            }),
          ],
          preview: {
            select: {
              title: 'channelType',
              subtitle: 'recipients.0',
            },
          },
        },
      ],
    }),

    // ── Escalation Rules ──────────────────────────────────────────────────
    defineField({
      name: 'escalationRules',
      title: 'Escalation Rules',
      type: 'array',
      description: 'Escalation steps if alert is not acknowledged',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'step',
              title: 'Step Number',
              type: 'number',
            }),
            defineField({
              name: 'afterDuration',
              title: 'After Duration',
              type: 'string',
              description: 'Time before escalating (e.g., "15m", "1h", "24h")',
            }),
            defineField({
              name: 'escalateTo',
              title: 'Escalate To',
              type: 'string',
              description: 'User, team, or channel to escalate to',
            }),
            defineField({
              name: 'severityOverride',
              title: 'Override Severity',
              type: 'string',
              options: {
                list: [
                  {title: '🔴 Critical', value: 'critical'},
                  {title: '🟠 High', value: 'high'},
                  {title: '🟡 Medium', value: 'medium'},
                  {title: '🔵 Low', value: 'low'},
                ],
              },
              description: 'Optionally change severity on escalation',
            }),
          ],
          preview: {
            select: {
              title: 'escalateTo',
              subtitle: 'afterDuration',
            },
          },
        },
      ],
    }),

    // ── Related Devices ───────────────────────────────────────────────────
    defineField({
      name: 'relatedDevices',
      title: 'Related Device Types',
      type: 'array',
      description: 'Device profiles this alert template is relevant for',
      of: [
        {
          type: 'reference',
          to: [{type: 'deviceProfile'}],
        },
      ],
    }),
    defineField({
      name: 'applicableStationTypes',
      title: 'Applicable Station Types',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: '🗼 Tower Site', value: 'tower'},
          {title: '🏢 Building/Rooftop', value: 'building'},
          {title: '🏔️ Remote Site', value: 'remote'},
          {title: '🖥️ Datacenter', value: 'datacenter'},
          {title: '🚐 Mobile Unit', value: 'mobile'},
          {title: '🏭 Industrial Facility', value: 'industrial'},
        ],
      },
    }),

    // ── Settings ──────────────────────────────────────────────────────────
    defineField({
      name: 'cooldownPeriod',
      title: 'Cooldown Period',
      type: 'string',
      description: 'Minimum time between repeated alerts (e.g., "5m", "1h")',
    }),
    defineField({
      name: 'autoResolve',
      title: 'Auto-Resolve',
      type: 'boolean',
      description: 'Automatically resolve alert when condition clears',
      initialValue: true,
    }),
    defineField({
      name: 'autoResolveAfter',
      title: 'Auto-Resolve After',
      type: 'string',
      description: 'Time after condition clears before auto-resolving',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Whether this alert template is active',
      initialValue: true,
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
  ],
})
