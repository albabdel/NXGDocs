import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const monitoringStationType = defineType({
  name: 'monitoringStation',
  title: 'Monitoring Station',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      stationId: 'stationId',
      stationType: 'stationType',
      status: 'status',
      media: 'images.0',
    },
    prepare({title, stationId, stationType, status, media}) {
      const statusEmoji: Record<string, string> = {
        active: '🟢',
        maintenance: '🟡',
        offline: '🔴',
        planned: '🔵',
        decommissioned: '⚫',
      }
      const typeEmoji: Record<string, string> = {
        tower: '🗼',
        building: '🏢',
        remote: '🏔️',
        datacenter: '🖥️',
        mobile: '🚐',
      }
      const emoji = statusEmoji[status as string] ?? '⚪'
      const typeIcon = typeEmoji[stationType as string] ?? '📍'
      return {
        title: title ?? 'Untitled Station',
        subtitle: `${stationId ?? 'No ID'} • ${typeIcon} ${stationType ?? 'Unknown'} • ${emoji}`,
        media,
      }
    },
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Station Name',
      type: 'string',
      description: 'Human-readable station name',
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
      name: 'stationId',
      title: 'Station ID',
      type: 'string',
      description: 'Unique identifier code for this station',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stationType',
      title: 'Station Type',
      type: 'string',
      description: 'Type of monitoring station',
      options: {
        list: [
          {title: '🗼 Tower Site', value: 'tower'},
          {title: '🏢 Building/ Rooftop', value: 'building'},
          {title: '🏔️ Remote Site', value: 'remote'},
          {title: '🖥️ Datacenter', value: 'datacenter'},
          {title: '🚐 Mobile Unit', value: 'mobile'},
          {title: '🏭 Industrial Facility', value: 'industrial'},
          {title: '🌊 Environmental Station', value: 'environmental'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief overview of this station and its purpose',
    }),

    // ── Location ─────────────────────────────────────────────────────────
    defineField({
      name: 'location',
      title: 'Location Details',
      type: 'object',
      fields: [
        defineField({
          name: 'address',
          title: 'Address',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'region',
          title: 'State/Province/Region',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        }),
        defineField({
          name: 'coordinates',
          title: 'GPS Coordinates',
          type: 'geopoint',
          description: 'Latitude and longitude for map display',
        }),
      ],
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      description: 'Station timezone (e.g., "Europe/Zurich")',
      options: {
        list: [
          {title: 'Europe/Zurich (CET/CEST)', value: 'Europe/Zurich'},
          {title: 'Europe/London (GMT/BST)', value: 'Europe/London'},
          {title: 'America/New_York (EST/EDT)', value: 'America/New_York'},
          {title: 'America/Los_Angeles (PST/PDT)', value: 'America/Los_Angeles'},
          {title: 'Asia/Tokyo (JST)', value: 'Asia/Tokyo'},
          {title: 'UTC', value: 'UTC'},
        ],
      },
    }),

    // ── Equipment Inventory ──────────────────────────────────────────────
    defineField({
      name: 'equipment',
      title: 'Equipment Inventory',
      type: 'array',
      description: 'Devices installed at this station',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'device',
              title: 'Device Profile',
              type: 'reference',
              to: [{type: 'deviceProfile'}],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'deviceIdentifier',
              title: 'Device ID/Serial',
              type: 'string',
              description: 'Unique identifier for this specific device instance',
            }),
            defineField({
              name: 'installedDate',
              title: 'Installation Date',
              type: 'date',
            }),
            defineField({
              name: 'location',
              title: 'Location on Site',
              type: 'string',
              description: 'e.g., "Tower level 3", "Rooftop east", "Server room rack A"',
            }),
            defineField({
              name: 'status',
              title: 'Device Status',
              type: 'string',
              options: {
                list: [
                  {title: '🟢 Operational', value: 'operational'},
                  {title: '🟡 Degraded', value: 'degraded'},
                  {title: '🔴 Offline', value: 'offline'},
                  {title: '🔧 Maintenance', value: 'maintenance'},
                ],
              },
              initialValue: 'operational',
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'device.name',
              subtitle: 'deviceIdentifier',
              media: 'device.images.0',
            },
          },
        },
      ],
    }),

    // ── Configuration ─────────────────────────────────────────────────────
    defineField({
      name: 'configurationTemplates',
      title: 'Configuration Templates',
      type: 'array',
      description: 'Configuration profiles applied to this station',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Standard Security', value: 'standard-security'},
          {title: 'High Availability', value: 'high-availability'},
          {title: 'Environmental Monitoring', value: 'environmental'},
          {title: 'Industrial IoT', value: 'industrial-iot'},
        ],
      },
    }),
    defineField({
      name: 'alertThresholds',
      title: 'Alert Thresholds',
      type: 'array',
      description: 'Custom alert thresholds for this station',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'metric', type: 'string', title: 'Metric'}),
            defineField({name: 'warningThreshold', type: 'number', title: 'Warning Threshold'}),
            defineField({name: 'criticalThreshold', type: 'number', title: 'Critical Threshold'}),
            defineField({name: 'unit', type: 'string', title: 'Unit'}),
          ],
        },
      ],
    }),

    // ── Maintenance ───────────────────────────────────────────────────────
    defineField({
      name: 'maintenanceSchedule',
      title: 'Maintenance Schedule',
      type: 'object',
      fields: [
        defineField({
          name: 'frequency',
          title: 'Maintenance Frequency',
          type: 'string',
          options: {
            list: [
              {title: 'Weekly', value: 'weekly'},
              {title: 'Monthly', value: 'monthly'},
              {title: 'Quarterly', value: 'quarterly'},
              {title: 'Annually', value: 'annually'},
              {title: 'As needed', value: 'asneeded'},
            ],
          },
        }),
        defineField({
          name: 'nextScheduled',
          title: 'Next Scheduled Maintenance',
          type: 'date',
        }),
        defineField({
          name: 'lastMaintenance',
          title: 'Last Maintenance Date',
          type: 'date',
        }),
        defineField({
          name: 'assignedTechnician',
          title: 'Assigned Technician',
          type: 'string',
        }),
        defineField({
          name: 'notes',
          title: 'Maintenance Notes',
          type: 'text',
          rows: 3,
        }),
      ],
    }),

    // ── Alert Templates ───────────────────────────────────────────────────
    defineField({
      name: 'alertTemplates',
      title: 'Applied Alert Templates',
      type: 'array',
      description: 'Alert/notification templates applied to this station',
      of: [
        {
          type: 'reference',
          to: [{type: 'alertTemplate'}],
        },
      ],
    }),

    // ── Status ────────────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Station Status',
      type: 'string',
      options: {
        list: [
          {title: '🟢 Active', value: 'active'},
          {title: '🟡 Maintenance', value: 'maintenance'},
          {title: '🔴 Offline', value: 'offline'},
          {title: '🔵 Planned', value: 'planned'},
          {title: '⚫ Decommissioned', value: 'decommissioned'},
        ],
      },
      initialValue: 'active',
    }),

    // ── Images ────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Station Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Alt text'},
            {name: 'caption', type: 'string', title: 'Caption'},
          ],
        },
      ],
    }),

    // ── Contact & Ownership ───────────────────────────────────────────────
    defineField({
      name: 'owner',
      title: 'Station Owner',
      type: 'string',
      description: 'Person or organization responsible for this station',
    }),
    defineField({
      name: 'primaryContact',
      title: 'Primary Contact',
      type: 'object',
      fields: [
        defineField({name: 'name', type: 'string', title: 'Name'}),
        defineField({name: 'email', type: 'email', title: 'Email'}),
        defineField({name: 'phone', type: 'string', title: 'Phone'}),
      ],
    }),
    defineField({
      name: 'emergencyContact',
      title: 'Emergency Contact',
      type: 'object',
      fields: [
        defineField({name: 'name', type: 'string', title: 'Name'}),
        defineField({name: 'phone', type: 'string', title: 'Phone'}),
      ],
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
