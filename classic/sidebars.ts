import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index',
    'quick-start-guide',
    'platform-architecture-overview',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/what-is-gcxone',
        'getting-started/pre-deployment-requirements',
        'getting-started/first-time-login-access',
        'getting-started/organization-hierarchy-setup',
        'getting-started/user-management-setup',
        'getting-started/quick-start-checklist',
      ],
    },
    {
      type: 'category',
      label: 'Platform Fundamentals',
      items: [
        'platform-fundamentals/cloud-architecture',
        'platform-fundamentals/hierarchy-model',
        'platform-fundamentals/what-is-evalink-talos',
        'platform-fundamentals/getting-to-know-talos',
        'platform-fundamentals/gcxone-talos-interaction',
        'platform-fundamentals/talos-workflows',
        'platform-fundamentals/event-processing',
        'platform-fundamentals/alarm-flow',
        'platform-fundamentals/site-synchronization',
        'platform-fundamentals/talos-user-management',
        'platform-fundamentals/inviting-users',
        'platform-fundamentals/managing-users',
        'platform-fundamentals/roles-permissions',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-overview',
        'api-graphql',
        'api-rest',
        'api-sdks',
        'api-webhooks',
      ],
    },
    {
      type: 'category',
      label: 'Devices',
      items: [
        'devices/add-a-device-to-gcxone',
        'devices/ajax',
        'devices/axxon',
        'devices/axis-camera-station',
        'devices/axis-communications-family-integration-guide',
        'devices/axis-cs-pro',
        'devices/axis-ip-camera',
        'devices/axis-ip-camera-2',
        'devices/camect',
        'devices/dahua',
        'devices/dahua-cloud-arc',
        'devices/eagle-eye',
        'devices/genesis-audio',
        'devices/hanwha-device-configuration',
        'devices/hikproconnect-troubleshoot',
        'devices/hikvision',
        'devices/milestone-gcx-one',
        'devices/senstar',
        'devices/victron',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        {
          type: 'category',
          label: 'AI Automation',
          items: [
            'features/ai-automation/overview',
            'features/ai-automation/genie-ai-assistant',
          ],
        },
        {
          type: 'category',
          label: 'Operational Modes',
          items: [
            'features/operational-modes/audio-routing-conference-mode',
            {
              type: 'category',
              label: 'Local Mode',
              items: [
                'features/operational-modes/local-mode/overview',
                'features/operational-modes/local-mode/configuration',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Platform',
          items: [
            'features/platform/feature-list',
            'features/platform/marketplace',
          ],
        },
        {
          type: 'category',
          label: 'System Monitoring',
          items: [
            'features/system-monitoring/healthcheck',
            'features/system-monitoring/towerguard',
          ],
        },
        {
          type: 'category',
          label: 'Video Monitoring',
          items: [
            {
              type: 'category',
              label: 'Event Clips',
              items: [
                'features/video-monitoring/event-clips/overview',
              ],
            },
            {
              type: 'category',
              label: 'Live View',
              items: [
                'features/video-monitoring/live-view/overview',
                'features/video-monitoring/live-view/troubleshooting',
              ],
            },
            {
              type: 'category',
              label: 'Playback',
              items: [
                'features/video-monitoring/playback/overview',
                'features/video-monitoring/playback/troubleshooting',
              ],
            },
            {
              type: 'category',
              label: 'PTZ Control',
              items: [
                'features/video-monitoring/ptz-control/overview',
                'features/video-monitoring/ptz-control/configuration',
              ],
            },
            {
              type: 'category',
              label: 'Video Streaming',
              items: [
                'features/video-monitoring/video-streaming/overview',
                'features/video-monitoring/video-streaming/configuration',
                'features/video-monitoring/video-streaming/troubleshooting',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Installer Guide',
      items: [
        'installer-guide/installation-overview',
        'installer-guide/device-installation',
        'installer-guide/device-registration',
        'installer-guide/environmental',
        'installer-guide/network-setup',
        'installer-guide/network-configuration',
        'installer-guide/firewall-configuration',
        'installer-guide/ip-whitelisting',
        'installer-guide/bandwidth-requirements',
        'installer-guide/maintenance-schedule',
        'installer-guide/post-installation',
        'installer-guide/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Operator Guide',
      items: [
        'operator-guide/handling-alarms',
        'operator-guide/notes-annotations',
        'operator-guide/site-navigation',
        'operator-guide/training-guide',
      ],
    },
    {
      type: 'category',
      label: 'Alarm Management',
      items: [
        'alarm-management/redundant-alarms',
        'alarm-management/technical-alarms',
      ],
    },
    'best-practices-alarm-configuration',
    {
      type: 'category',
      label: 'Reporting',
      items: [
        'reporting/reporting-overview',
        'reporting/standard-reports',
        'reporting/scheduled-reports',
        'reporting/report-sharing',
        'reporting/report-troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Knowledge Base',
      items: [
        'knowledge-base/compliance',
        'knowledge-base/data-privacy',
        'knowledge-base/faq',
        'knowledge-base/glossary',
        'knowledge-base/browser-errors',
        'knowledge-base/image-video-display-issues',
        'knowledge-base/integration-guides',
        'knowledge-base/migration-guides',
        'knowledge-base/network-requirements',
        'knowledge-base/quick-reference',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      items: [
        'support/contact',
      ],
    },
  ],
};

export default sidebars;
