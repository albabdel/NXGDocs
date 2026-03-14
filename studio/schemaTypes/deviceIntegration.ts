import {defineType, defineField} from 'sanity'
import {enhancedBodyField} from './portableText-ultimate'

export const deviceIntegrationType = defineType({
  name: 'deviceIntegration',
  title: 'Device Integration',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      manufacturer: 'manufacturer',
      brand: 'brand',
      deviceType: 'deviceType',
      gcxReady: 'gcxReady',
      status: 'status',
      logo: 'logo',
    },
    prepare({title, manufacturer, brand, deviceType, gcxReady, status, logo}) {
      const statusEmoji: Record<string, string> = {
        draft: '🔘',
        review: '🟡',
        active: '🟢',
        beta: '🔵',
        archived: '📦',
        deprecated: '🔴',
      }
      const typeEmoji: Record<string, string> = {
        nvr: '📼',
        camera: '📷',
        vms: '🖥️',
        gateway: '🔌',
        sensor: '📡',
        access: '🔒',
        intrusion: '🚨',
        audio: '🔊',
        other: '📦',
      }
      const emoji = statusEmoji[status as string] ?? '⚪'
      const typeIcon = typeEmoji[deviceType as string] ?? '📦'
      const gcxBadge = gcxReady ? '✓ GCX' : ''
      return {
        title: title ?? 'Untitled Integration',
        subtitle: `${emoji} ${manufacturer ?? ''} ${brand ?? ''} ${typeIcon} ${gcxBadge}`.trim(),
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
      description: 'Device or integration name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL identifier for this device integration',
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
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
      description: 'Device manufacturer',
      options: {
        list: [
          {title: 'Axis Communications', value: 'axis'},
          {title: 'Bosch', value: 'bosch'},
          {title: 'Hikvision', value: 'hikvision'},
          {title: 'Dahua', value: 'dahua'},
          {title: 'Hanwha Vision', value: 'hanwha'},
          {title: 'Vivotek', value: 'vivotek'},
          {title: 'Mobotix', value: 'mobotix'},
          {title: 'Panasonic', value: 'panasonic'},
          {title: 'Sony', value: 'sony'},
          {title: 'Pelco', value: 'pelco'},
          {title: 'Genetec', value: 'genetec'},
          {title: 'Milestone', value: 'milestone'},
          {title: 'Avigilon', value: 'avigilon'},
          {title: 'Verkada', value: 'verkada'},
          {title: 'Honeywell', value: 'honeywell'},
          {title: 'DMP', value: 'dmp'},
          {title: 'DSC', value: 'dsc'},
          {title: 'Bosch Security', value: 'bosch_security'},
          {title: 'Interlogix', value: 'interlogix'},
          {title: 'Napco', value: 'napco'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      description: 'Brand name if different from manufacturer',
    }),
    defineField({
      name: 'deviceType',
      title: 'Device Type',
      type: 'string',
      description: 'Category of device or system',
      options: {
        list: [
          {title: '📹 NVR', value: 'nvr'},
          {title: '📷 Camera', value: 'camera'},
          {title: '🖥️ VMS', value: 'vms'},
          {title: '🔌 Gateway', value: 'gateway'},
          {title: '📡 Sensor', value: 'sensor'},
          {title: '🔒 Access Control', value: 'access'},
          {title: '🚨 Intrusion', value: 'intrusion'},
          {title: '🔊 Audio', value: 'audio'},
          {title: '📦 Other', value: 'other'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gcxReady',
      title: 'GCX Ready',
      type: 'boolean',
      description: 'Is this integration GCX (Genesis Cloud eXchange) ready?',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Integration lifecycle status',
      options: {
        list: [
          {title: '🔘 Draft', value: 'draft'},
          {title: '🟡 In Review', value: 'review'},
          {title: '🟢 Active', value: 'active'},
          {title: '🔵 Beta', value: 'beta'},
          {title: '📦 Archived', value: 'archived'},
          {title: '🔴 Deprecated', value: 'deprecated'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),

    // ── Cloud Mode Features ───────────────────────────────────────────────
    defineField({
      name: 'cloudModeFeatures',
      title: 'Cloud Mode Features',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'discovery',
          title: 'Discovery',
          type: 'string',
          description: 'Device discovery capability',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'live',
          title: 'Live View',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'playback',
          title: 'Playback',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'timeline',
          title: 'Timeline',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'events',
          title: 'Events',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'armDisarm',
          title: 'Arm/Disarm',
          type: 'string',
          description: 'Security panel arm/disarm capability',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'genesisAudio',
          title: 'Genesis Audio',
          type: 'string',
          description: 'Audio streaming through Genesis',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'ptz',
          title: 'PTZ Control',
          type: 'string',
          description: 'Pan-Tilt-Zoom camera control',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'io',
          title: 'I/O Control',
          type: 'string',
          description: 'Input/Output control capability',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'eventAck',
          title: 'Event Acknowledgment',
          type: 'string',
          description: 'Event acknowledgment capability',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'playAudio',
          title: 'Play Audio',
          type: 'string',
          description: 'Audio playback to device',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'timeSync',
          title: 'Time Sync',
          type: 'string',
          description: 'Device time synchronization',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
      ],
    }),

    // ── Local Mode Features ────────────────────────────────────────────────
    defineField({
      name: 'localModeFeatures',
      title: 'Local Mode Features',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'live',
          title: 'Live View',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'playback',
          title: 'Playback',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'sdkAudio',
          title: 'SDK Audio',
          type: 'string',
          description: 'Audio via SDK integration',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'ptz',
          title: 'PTZ Control',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'io',
          title: 'I/O Control',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
        defineField({
          name: 'timeline',
          title: 'Timeline',
          type: 'string',
          options: {
            list: [
              {title: '✅ Full Support', value: 'full'},
              {title: '⚡ Partial', value: 'partial'},
              {title: '❌ Not Supported', value: 'none'},
              {title: '🔄 In Development', value: 'development'},
            ],
          },
        }),
      ],
    }),

    // ── Device Health Features ─────────────────────────────────────────────
    defineField({
      name: 'deviceHealthFeatures',
      title: 'Device Health Features',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'pollFromCloud',
          title: 'Poll from Cloud',
          type: 'boolean',
          description: 'Can be polled for health status from cloud',
          initialValue: false,
        }),
        defineField({
          name: 'heartbeat',
          title: 'Heartbeat',
          type: 'boolean',
          description: 'Device sends heartbeat signals',
          initialValue: false,
        }),
        defineField({
          name: 'mobileApp',
          title: 'Mobile App',
          type: 'boolean',
          description: 'Health monitoring via mobile app',
          initialValue: false,
        }),
      ],
    }),

    // ── Camera Health Features ─────────────────────────────────────────────
    defineField({
      name: 'cameraHealthFeatures',
      title: 'Camera Health Features',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'basic',
          title: 'Basic',
          type: 'boolean',
          description: 'Basic camera health monitoring',
          initialValue: false,
        }),
        defineField({
          name: 'basicPlus',
          title: 'Basic Plus',
          type: 'boolean',
          description: 'Enhanced basic health monitoring',
          initialValue: false,
        }),
        defineField({
          name: 'advanced',
          title: 'Advanced',
          type: 'boolean',
          description: 'Advanced camera health diagnostics',
          initialValue: false,
        }),
      ],
    }),

    // ── Timelapse Features ─────────────────────────────────────────────────
    defineField({
      name: 'timelapseFeatures',
      title: 'Timelapse Features',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'timelapse',
          title: 'Timelapse',
          type: 'boolean',
          description: 'Timelapse recording support',
          initialValue: false,
        }),
        defineField({
          name: 'highRes',
          title: 'High Resolution',
          type: 'boolean',
          description: 'High resolution timelapse support',
          initialValue: false,
        }),
        defineField({
          name: 'clipExport',
          title: 'Clip Export',
          type: 'boolean',
          description: 'Timelapse clip export capability',
          initialValue: false,
        }),
      ],
    }),

    // ── Connectivity ───────────────────────────────────────────────────────
    defineField({
      name: 'connectivity',
      title: 'Connectivity',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'integrationProtocol',
          title: 'Integration Protocol',
          type: 'text',
          rows: 2,
          description: 'Protocol used for integration (e.g., ONVIF, RTSP, SDK)',
        }),
        defineField({
          name: 'eventIntegrationMethod',
          title: 'Event Integration Method',
          type: 'text',
          rows: 2,
          description: 'How events are received from the device',
        }),
        defineField({
          name: 'videoStreaming',
          title: 'Video Streaming',
          type: 'string',
          description: 'Video streaming method',
          options: {
            list: [
              {title: 'RTSP', value: 'rtsp'},
              {title: 'RTMP', value: 'rtmp'},
              {title: 'WebRTC', value: 'webrtc'},
              {title: 'HLS', value: 'hls'},
              {title: 'SDK', value: 'sdk'},
              {title: 'Proprietary', value: 'proprietary'},
              {title: 'Multiple', value: 'multiple'},
            ],
          },
        }),
        defineField({
          name: 'loginSecurityProfile',
          title: 'Login Security Profile',
          type: 'string',
          description: 'Security profile for device login',
        }),
        defineField({
          name: 'customerPorts',
          title: 'Customer Ports',
          type: 'text',
          rows: 2,
          description: 'Ports required on customer network',
        }),
        defineField({
          name: 'genesisPorts',
          title: 'Genesis Ports',
          type: 'text',
          rows: 2,
          description: 'Ports required for Genesis connectivity',
        }),
      ],
    }),

    // ── Documentation Links ────────────────────────────────────────────────
    defineField({
      name: 'documentation',
      title: 'Documentation',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'helpManualUrl',
          title: 'Help Manual URL',
          type: 'url',
          description: 'Link to device help manual',
        }),
        defineField({
          name: 'helpdeskUrl',
          title: 'Helpdesk URL',
          type: 'url',
          description: 'Link to manufacturer helpdesk',
        }),
        defineField({
          name: 'configurationArticle',
          title: 'Configuration Article',
          type: 'reference',
          to: [{type: 'doc'}],
          description: 'Link to configuration documentation',
        }),
        defineField({
          name: 'troubleshootingArticle',
          title: 'Troubleshooting Article',
          type: 'reference',
          to: [{type: 'doc'}],
          description: 'Link to troubleshooting documentation',
        }),
      ],
    }),

    // ── Notes & Issues ─────────────────────────────────────────────────────
    defineField({
      name: 'notesAndIssues',
      title: 'Notes & Issues',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'notes',
          title: 'Notes',
          type: 'text',
          rows: 4,
          description: 'General notes about this integration',
        }),
        defineField({
          name: 'currentIssues',
          title: 'Current Issues',
          type: 'text',
          rows: 4,
          description: 'Known current issues with this integration',
        }),
        defineField({
          name: 'dependencies',
          title: 'Dependencies',
          type: 'text',
          rows: 3,
          description: 'Required dependencies or prerequisites',
        }),
        defineField({
          name: 'commonIssues',
          title: 'Common Issues',
          type: 'text',
          rows: 4,
          description: 'Frequently encountered issues and solutions',
        }),
      ],
    }),

    // ── Architecture ───────────────────────────────────────────────────────
    defineField({
      name: 'architecture',
      title: 'Architecture',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'singletonScaled',
          title: 'Singleton Scaled',
          type: 'string',
          description: 'Singleton scaling architecture type',
        }),
        defineField({
          name: 'apiType',
          title: 'API Type',
          type: 'string',
          description: 'API integration type',
          options: {
            list: [
              {title: 'REST API', value: 'rest'},
              {title: 'SOAP', value: 'soap'},
              {title: 'SDK', value: 'sdk'},
              {title: 'WebSocket', value: 'websocket'},
              {title: 'MQTT', value: 'mqtt'},
              {title: 'Proprietary', value: 'proprietary'},
              {title: 'ONVIF', value: 'onvif'},
            ],
          },
        }),
        defineField({
          name: 'actionType',
          title: 'Action Type',
          type: 'string',
          description: 'Type of actions supported',
        }),
      ],
    }),

    // ── Media ──────────────────────────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
      description: 'Integration or device logo',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief overview of the integration capabilities',
    }),

    // ── Body Content ───────────────────────────────────────────────────────
    enhancedBodyField,

    // ── SEO ────────────────────────────────────────────────────────────────
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
