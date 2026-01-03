import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'generated-index', description: 'Get started with NXGEN GCXONE platform' },
      items: [
        'getting-started/GCXONE-talos-interaction',
        'getting-started/bandwidth-requirements',
      ],
    },
    {
      type: 'category',
      label: 'Admin & Configuration',
      link: { type: 'generated-index', description: 'Administration and configuration guides' },
      items: [
        'admin-guide/dashboard-overview',
        'admin-guide/active-sites-widget',
        'admin-guide/alarm-volume-analytics',
        'admin-guide/device-health-status',
        'admin-guide/creating-customers',
        'admin-guide/creating-sites',
        'admin-guide/site-groups',
        'admin-guide/creating-users',
        'admin-guide/rbac',
        'admin-guide/permissions-matrix',
        'admin-guide/custom-properties-overview',
        'admin-guide/custom-property-hierarchy',
        'admin-guide/event-clip-configuration',
        'admin-guide/timezone-management',
      ],
    },
    {
      type: 'category',
      label: 'Devices',
      link: { type: 'generated-index', description: 'Device configuration guides for all supported devices' },
      items: [
        {
          type: 'category',
          label: 'ADPRO',
          items: [
            'devices/adpro/installer-configuration',
          ],
        },
        {
          type: 'category',
          label: 'Hikvision',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Dahua',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Hanwha',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Milestone',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Axxon',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Camect',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Axis',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Heitel',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Reconeyez',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Teltonika',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'GCXONE Audio',
          items: [
            'devices/GCXONE-audio/installer-configuration',
            'devices/GCXONE-audio/operator-view',
          ],
        },
        {
          type: 'category',
          label: 'Avigilon',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'InnoVi',
          items: [
            'devices/innovi/admin-configuration',
          ],
        },
        {
          type: 'category',
          label: 'Ajax',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'EagleEye',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Ganz',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Uniview',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Generic Devices',
          items: [
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Features',
      link: { type: 'generated-index', description: 'Feature guides and configuration' },
      items: [
        {
          type: 'category',
          label: 'AI Analytics',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Video Streaming',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'PTZ Control',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Event Clips',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Playback',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Live View',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Motion Detection',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Line Crossing',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Intrusion Detection',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Face Detection',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'License Plate Recognition',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Audio Detection',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Tamper Detection',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'People Counting',
          items: [
          ],
        },
        {
          type: 'category',
          label: 'Heat Mapping',
          items: [
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Alarm Management (Talos)',
      link: { type: 'generated-index', description: 'Alarm management and monitoring with Talos' },
      items: [
        'alarm-management/talos-dashboard',
        'alarm-management/alarm-queue',
        'alarm-management/alarm-prioritization',
        'alarm-management/alarm-actions',
        'alarm-management/escalation-rules',
        'alarm-management/alarm-filtering',
        'alarm-management/alarm-history',
        'alarm-management/alarm-notifications',
        'alarm-management/alarm-routing',
        'alarm-management/alarm-metrics',
        'alarm-management/false-alarms',
        'alarm-management/alarm-verification',
        'alarm-management/multi-site-alarms',
        'alarm-management/alarm-sla',
        'alarm-management/alarm-integration',
        'alarm-management/alarm-reporting',
        'alarm-management/alarm-troubleshooting',
        'alarm-management/alarm-best-practices',
        'alarm-management/operator-training',
        'alarm-management/system-health',
      ],
    },
  ],
};

export default sidebars;
