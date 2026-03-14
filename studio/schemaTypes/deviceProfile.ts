import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const deviceProfileType = defineType({
  name: 'deviceProfile',
  title: 'Device Profile',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      model: 'model',
      manufacturer: 'manufacturer',
      deviceType: 'deviceType',
      media: 'images.0',
    },
    prepare({title, model, manufacturer, deviceType, media}) {
      const typeEmoji: Record<string, string> = {
        camera: '📷',
        sensor: '📡',
        gateway: '🔌',
        controller: '🎛️',
        router: '📶',
        server: '🖥️',
        ups: '🔋',
        other: '📦',
      }
      const emoji = typeEmoji[deviceType as string] ?? '📦'
      return {
        title: title ?? 'Untitled Device',
        subtitle: manufacturer && model ? `${manufacturer} ${model}` : deviceType ?? 'Unknown',
        media,
      }
    },
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Device Name',
      type: 'string',
      description: 'Human-readable device name (e.g., "PTZ Outdoor Camera Pro")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL identifier for this device profile',
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
      name: 'model',
      title: 'Model Number',
      type: 'string',
      description: 'Manufacturer model number/SKU',
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
      description: 'Device manufacturer or brand',
    }),
    defineField({
      name: 'deviceType',
      title: 'Device Type',
      type: 'string',
      description: 'Category of monitoring device',
      options: {
        list: [
          {title: '📷 Camera', value: 'camera'},
          {title: '📡 Sensor', value: 'sensor'},
          {title: '🔌 Gateway', value: 'gateway'},
          {title: '🎛️ Controller', value: 'controller'},
          {title: '📶 Router/Network', value: 'router'},
          {title: '🖥️ Server', value: 'server'},
          {title: '🔋 UPS/Power', value: 'ups'},
          {title: '🌡️ Environmental', value: 'environmental'},
          {title: '🔒 Access Control', value: 'access'},
          {title: '📦 Other', value: 'other'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief overview of the device and its purpose',
    }),

    // ── Specifications ────────────────────────────────────────────────────
    defineField({
      name: 'specifications',
      title: 'Technical Specifications',
      type: 'array',
      description: 'Key technical specifications (key-value pairs)',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Specification Name',
              type: 'string',
              description: 'e.g., "Power Consumption", "Resolution", "Operating Temperature"',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g., "12W", "4K Ultra HD", "-20°C to 60°C"',
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
              description: 'Optional unit of measurement',
            }),
          ],
          preview: {
            select: {
              title: 'key',
              subtitle: 'value',
            },
          },
        },
      ],
      options: {
        layout: 'grid',
      },
    }),

    // ── Compatibility ─────────────────────────────────────────────────────
    defineField({
      name: 'compatibleWith',
      title: 'Compatibility',
      type: 'array',
      description: 'Compatible systems, platforms, or protocols',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'ONVIF', value: 'onvif'},
          {title: 'RTSP', value: 'rtsp'},
          {title: 'Modbus', value: 'modbus'},
          {title: 'MQTT', value: 'mqtt'},
          {title: 'SNMP', value: 'snmp'},
          {title: 'BACnet', value: 'bacnet'},
          {title: 'LoRaWAN', value: 'lorawan'},
          {title: 'Zigbee', value: 'zigbee'},
          {title: 'Z-Wave', value: 'zwave'},
          {title: 'HTTP/REST API', value: 'http'},
        ],
      },
    }),
    defineField({
      name: 'compatibleDevices',
      title: 'Compatible Devices',
      type: 'array',
      description: 'Other device profiles this works with',
      of: [
        {
          type: 'reference',
          to: [{type: 'deviceProfile'}],
        },
      ],
    }),

    // ── Media ─────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Product photos and diagrams',
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
    defineField({
      name: 'datasheet',
      title: 'Datasheet',
      type: 'file',
      description: 'Official product datasheet PDF',
      options: {
        accept: '.pdf',
      },
    }),

    // ── Documentation Links ───────────────────────────────────────────────
    defineField({
      name: 'setupGuide',
      title: 'Setup Guide Reference',
      type: 'reference',
      to: [{type: 'doc'}],
      description: 'Link to setup/installation documentation',
    }),
    defineField({
      name: 'troubleshootingLinks',
      title: 'Troubleshooting Resources',
      type: 'array',
      description: 'Links to troubleshooting guides',
      of: [
        {
          type: 'reference',
          to: [{type: 'doc'}],
        },
      ],
    }),
    defineField({
      name: 'documentationLinks',
      title: 'External Documentation',
      type: 'array',
      description: 'External documentation URLs',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Link Title'}),
            defineField({name: 'url', type: 'url', title: 'URL'}),
          ],
        },
      ],
    }),

    // ── Firmware ──────────────────────────────────────────────────────────
    defineField({
      name: 'firmwareVersions',
      title: 'Firmware Versions',
      type: 'array',
      description: 'Available firmware versions for this device',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'version',
              title: 'Version',
              type: 'string',
              description: 'e.g., "v2.1.4"',
            }),
            defineField({
              name: 'releaseDate',
              title: 'Release Date',
              type: 'date',
            }),
            defineField({
              name: 'releaseNotes',
              title: 'Release Notes',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'downloadUrl',
              title: 'Download URL',
              type: 'url',
            }),
            defineField({
              name: 'recommended',
              title: 'Recommended Version',
              type: 'boolean',
              description: 'Mark as the recommended firmware version',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'version',
              subtitle: 'releaseDate',
            },
          },
        },
      ],
    }),

    // ── Status & Tags ─────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Device Status',
      type: 'string',
      description: 'Lifecycle status of this device model',
      options: {
        list: [
          {title: '🟢 Active', value: 'active'},
          {title: '🟡 End of Life', value: 'eol'},
          {title: '🔴 Discontinued', value: 'discontinued'},
          {title: '🔵 Pre-release', value: 'prerelease'},
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Searchable tags for filtering',
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
