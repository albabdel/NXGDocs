/**
 * GCXONE Documentation sidebar — manually managed.
 * Structure reflects the 9-section content taxonomy agreed with the content team.
 *
 * Doc IDs match the slug field in Sanity (after sanitization via sanitizeSlugForPath).
 * Items marked "TODO" are planned docs that don't exist in Sanity yet.
 */
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  sanityDocsSidebar: [

    // ─── 1. Getting Started ──────────────────────────────────────────────────
    {
      type: 'category',
      label: '1. Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'getting-started/what-is-gcxone',              label: 'What is GCXOne' },
        { type: 'doc', id: 'getting-started/pre-deployment-requirements',  label: 'Pre-Deployment Requirements' },
        { type: 'doc', id: 'getting-started/first-time-login-access',      label: 'First-Time Login & Access' },
        { type: 'doc', id: 'getting-started/organization-setup',           label: 'Organization & Hierarchy Setup' },
        { type: 'doc', id: 'getting-started/user-management-setup',        label: 'User Management Setup' },
        { type: 'doc', id: 'features/alarm-management-system',             label: 'Alarm Management System' },
        { type: 'doc', id: 'getting-started/quick-start-checklist',        label: 'Quick Start Checklist' },
      ],
    },

    // ─── 2. Platform Fundamentals ────────────────────────────────────────────
    {
      type: 'category',
      label: '2. Platform Fundamentals',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Architecture',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'platform-fundamentals/cloud-architecture',  label: 'Cloud Architecture' },
            { type: 'doc', id: 'platform-fundamentals/hierarchy-model',     label: 'Tenant–Customer–Site–Device Model' },
          ],
        },
        {
          type: 'category',
          label: 'Talos Integration',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'platform-fundamentals/what-is-evalink-talos',    label: 'What is Evalink Talos?' },
            { type: 'doc', id: 'platform-fundamentals/getting-to-know-talos',    label: 'Getting to Know Talos' },
            { type: 'doc', id: 'platform-fundamentals/gcxone-talos-interaction', label: 'GCXONE & Talos Interaction' },
            { type: 'doc', id: 'platform-fundamentals/talos-workflows',          label: 'Talos Workflows' },
          ],
        },
        {
          type: 'category',
          label: 'Core Processes',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'platform-fundamentals/event-processing',    label: 'Event Processing' },
            { type: 'doc', id: 'platform-fundamentals/alarm-flow',          label: 'Alarm Flow' },
            { type: 'doc', id: 'platform-fundamentals/site-synchronization', label: 'Site Synchronization' },
          ],
        },
        {
          type: 'category',
          label: 'User Management',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'platform-fundamentals/roles-permissions',      label: 'Roles & Permissions' },
            { type: 'doc', id: 'platform-fundamentals/privilege-deep-dive',   label: 'Privilege Deep Dive' },
            { type: 'doc', id: 'platform-fundamentals/talos-user-management', label: 'Talos User Management' },
            { type: 'doc', id: 'platform-fundamentals/inviting-users',        label: 'Inviting Users' },
            { type: 'doc', id: 'platform-fundamentals/managing-users',        label: 'Managing Users' },
          ],
        },
      ],
    },

    // ─── 3. Devices & Integrations ───────────────────────────────────────────
    {
      type: 'category',
      label: '3. Devices & Integrations',
      collapsible: true,
      collapsed: true,
      items: [
        { type: 'doc', id: 'devices/add-a-device-to-gcxone', label: 'Add a Device to GCXONE' },

        // NVR
        {
          type: 'category',
          label: 'NVR',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'devices/hikvision',           label: 'Hikvision' },
            { type: 'doc', id: 'devices/dahua',               label: 'Dahua' },
            { type: 'doc', id: 'devices/hanwha-device-configuration', label: 'Hanwha' },
            { type: 'doc', id: 'devices/eagle-eye',           label: 'Eagle Eye' },
            { type: 'doc', id: 'devices/senstar',             label: 'SenStar' },
            { type: 'doc', id: 'devices/adpro',               label: 'ADPRO' },
            { type: 'doc', id: 'devices/autoaid',             label: 'Autoaid' },
            { type: 'doc', id: 'devices/bosch',               label: 'Bosch' },
            { type: 'doc', id: 'devices/eneo',                label: 'ENEO' },
            { type: 'doc', id: 'devices/eneoip',              label: 'ENEOIP' },
            { type: 'doc', id: 'devices/heitel',              label: 'Heitel' },
            { type: 'doc', id: 'devices/honeywell',           label: 'Honeywell' },
            { type: 'doc', id: 'devices/miwi-urmet-grundig',  label: 'Miwi Urmet / Grundig' },
            { type: 'doc', id: 'devices/rosenberger',         label: 'Rosenberger' },
            { type: 'doc', id: 'devices/spykebox',            label: 'Spykebox' },
            { type: 'doc', id: 'devices/uniview',             label: 'Uniview' },
            { type: 'doc', id: 'devices/viasys-shieldbox',    label: 'Viasys / ShieldBox' },
          ],
        },

        // IP Camera
        {
          type: 'category',
          label: 'IP Camera',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'devices/axis-ip-camera', label: 'Axis IP Camera' },
            { type: 'doc', id: 'devices/mobotix',        label: 'Mobotix' },
            { type: 'doc', id: 'devices/netvu',          label: 'NetVu' },
            { type: 'doc', id: 'devices/onvif',          label: 'Onvif' },
            { type: 'doc', id: 'devices/vivotek',        label: 'Vivotek' },
          ],
        },

        // Cloud VMS
        {
          type: 'category',
          label: 'Cloud VMS',
          collapsible: true,
          collapsed: true,
          items: [
            // Note: slug sanitized from "devices/Cloud VMS/hikproconnect-troubleshoot"
            { type: 'doc', id: 'devices/Cloud-VMS/hikproconnect-troubleshoot', label: 'Hik-ProConnect' },
            { type: 'doc', id: 'devices/dahua-cloud-arc',                      label: 'Dahua Cloud ARC' },
            { type: 'doc', id: 'devices/axis-camera-station',                  label: 'Axis Camera Station' },
            { type: 'doc', id: 'devices/axis-communications-family-integration-guide', label: 'Axis Communications Family' },
            { type: 'doc', id: 'devices/axxon',                                label: 'Axxon' },
            { type: 'doc', id: 'devices/avigilon',                             label: 'Avigilon' },
            { type: 'doc', id: 'devices/avigilon-unity',                       label: 'Avigilon Unity' },
            { type: 'doc', id: 'devices/geutebruck',                           label: 'Geutebrück' },
            { type: 'doc', id: 'devices/milestone-gcx-one',                    label: 'Milestone GCX-ONE' },
            { type: 'doc', id: 'devices/nxg-cloud-nvr',                        label: 'NXG Cloud NVR' },
            { type: 'doc', id: 'devices/vivotek-onpremise',                    label: 'Vivotek OnPremise' },
            { type: 'doc', id: 'devices/vivotek-vortex',                       label: 'Vivotek Vortex' },
            { type: 'doc', id: 'devices/dc09-alarm-management-system',         label: 'DC09 Alarm Management System' },
          ],
        },

        // AI Box
        {
          type: 'category',
          label: 'AI Box',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'devices/camect',          label: 'Camect' },
            { type: 'doc', id: 'devices/davantis',        label: 'Davantis' },
            { type: 'doc', id: 'devices/ganz',            label: 'Ganz' },
            { type: 'doc', id: 'devices/dahua-air-shield', label: 'Dahua Air Shield' },
            { type: 'doc', id: 'devices/innovi',          label: 'Innovi' },
          ],
        },

        // Router
        {
          type: 'category',
          label: 'Router',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'devices/teltonika',     label: 'Teltonika' },
            { type: 'doc', id: 'devices/teltonika-iot', label: 'Teltonika IOT' },
            { type: 'doc', id: 'devices/victron',       label: 'Victron' },
            { type: 'doc', id: 'devices/efoy-fuel-cell', label: 'EFOY Fuel Cell' },
            { type: 'doc', id: 'devices/efoy',          label: 'EFOY' },
            { type: 'doc', id: 'devices/auraigateway',  label: 'Auraigateway' },
          ],
        },

        // PIR CAM
        {
          type: 'category',
          label: 'PIR CAM',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'devices/dahua-pir-cam',    label: 'Dahua PIR CAM' },
            { type: 'doc', id: 'devices/essence-my-shield', label: 'Essence My Shield' },
            { type: 'doc', id: 'devices/reconeyez',        label: 'Reconeyez' },
          ],
        },

        // Other
        {
          type: 'category',
          label: 'Other',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'devices/ajax',         label: 'AJAX' },
            { type: 'doc', id: 'devices/genesis-audio', label: 'Genesis Audio' },
          ],
        },
      ],
    },

    // ─── 4. Platform Features ────────────────────────────────────────────────
    {
      type: 'category',
      label: '4. Platform Features',
      collapsible: true,
      collapsed: true,
      items: [
        // Video Monitoring
        {
          type: 'category',
          label: 'Video Monitoring',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'features/video-monitoring/live-view/overview',            label: 'Live View Overview' },
            { type: 'doc', id: 'features/video-monitoring/live-view/troubleshooting',     label: 'Live View Troubleshooting' },
            { type: 'doc', id: 'features/live-view-advanced-troubleshooting',             label: 'Live View Advanced Troubleshooting' },
            { type: 'doc', id: 'features/video-monitoring/video-streaming/overview',      label: 'Video Streaming Overview' },
            { type: 'doc', id: 'features/video-monitoring/video-streaming/configuration', label: 'Video Streaming Configuration' },
            { type: 'doc', id: 'features/video-monitoring/video-streaming/troubleshooting', label: 'Video Streaming Troubleshooting' },
            { type: 'doc', id: 'features/video-monitoring/playback/overview',             label: 'Playback Overview' },
            { type: 'doc', id: 'features/video-monitoring/playback/troubleshooting',      label: 'Playback Troubleshooting' },
            { type: 'doc', id: 'features/video-monitoring/ptz-control/overview',          label: 'PTZ Control Overview' },
            { type: 'doc', id: 'features/video-monitoring/ptz-control/configuration',     label: 'PTZ Control Configuration' },
            { type: 'doc', id: 'features/video-monitoring/event-clips/overview',          label: 'Event Clips Overview' },
            { type: 'doc', id: 'features/video-monitoring/autostream',          label: 'Auto Streaming' },
            { type: 'doc', id: 'features/video-monitoring/multi-monitor',     label: 'Multi Monitor' },
            { type: 'doc', id: 'alarm-management/arm-disarm-isolate',         label: 'Isolate' },
            { type: 'doc', id: 'features/video-monitoring/edit-properties',   label: 'Edit Properties' },
          ],
        },

        // Alarms & AI
        {
          type: 'category',
          label: 'Alarms & AI',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'features/ai-automation/overview',              label: 'AI Analytics Overview' },
            { type: 'doc', id: 'features/auto-stream-new',                   label: 'Auto Stream' },
            { type: 'doc', id: 'alarm-management/technical-alarms',          label: 'Technical Alarm' },
            { type: 'doc', id: 'features/alarms-ai/alarm-mapping',           label: 'Alarm Mapping' },
            { type: 'doc', id: 'features/alarms-ai/workflows',               label: 'Workflows' },
            { type: 'doc', id: 'features/alarms-ai/dc09',                    label: 'DC09' },
            { type: 'doc', id: 'features/alarms-ai/standard-vs-smart-alarm', label: 'Standard Motion Alarm vs Smart Alarm' },
            { type: 'doc', id: 'alarm-management/event-overflow',            label: 'Event Overflow' },
          ],
        },

        // Audio
        {
          type: 'category',
          label: 'Audio',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'features/operational-modes/audio-routing-conference-mode', label: 'Audio Routing & Conference Mode' },
            { type: 'doc', id: 'features/audio/speaker-on-help-desk',                    label: 'Speaker on Help Desk' },
            { type: 'doc', id: 'features/audio/audio-io',                                label: 'Audio I/O' },
          ],
        },

        // Navigation & Search
        {
          type: 'category',
          label: 'Navigation & Search',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'features/maps',            label: 'Maps' },
            { type: 'doc', id: 'features/universal-search', label: 'Universal Search' },
          ],
        },

        // Operational Tools
        {
          type: 'category',
          label: 'Operational Tools',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'features/operational-modes/local-mode/overview',      label: 'Local Mode Overview' },
            { type: 'doc', id: 'features/operational-modes/local-mode/configuration', label: 'Local Mode Configuration' },
            { type: 'doc', id: 'features/operational-tools/analytics',                label: 'Analytics' },
            { type: 'doc', id: 'features/operational-tools/tags',                     label: 'Tags' },
            { type: 'doc', id: 'features/operational-tools/audit',                    label: 'Audit' },
            { type: 'doc', id: 'features/data-export-import',                         label: 'Export' },
            { type: 'doc', id: 'operator-guide/operator-dashboard',                   label: 'Dashboard (per level)' },
          ],
        },
      ],
    },

    // ─── 5. Breakthroughs & Add-ons ──────────────────────────────────────────
    {
      type: 'category',
      label: '5. Breakthroughs & Add-ons',
      collapsible: true,
      collapsed: true,
      items: [
        { type: 'doc', id: 'features/nova99x',                      label: 'NOVA99x' },
        { type: 'doc', id: 'features/zenmode',                      label: 'ZenMode' },
        { type: 'doc', id: 'features/healthcheck',                  label: 'HealthCheck' },
        { type: 'doc', id: 'features/system-monitoring/towerguard', label: 'TowerGuard' },
        { type: 'doc', id: 'features/ai-automation/genie-ai-assistant', label: 'Genie AI Assistant' },
        { type: 'doc', id: 'features/bulkimport',                   label: 'BulkImport' },
        { type: 'doc', id: 'features/customview',                   label: 'CustomView' },
        { type: 'doc', id: 'features/pulseview',                    label: 'PulseView' },
        { type: 'doc', id: 'features/timesync',                     label: 'TimeSync' },
        { type: 'doc', id: 'features/platform/marketplace',         label: 'Marketplace' },
      ],
    },

    // ─── 6. Installer Guide ──────────────────────────────────────────────────
    {
      type: 'category',
      label: '6. Installer Guide',
      collapsible: true,
      collapsed: true,
      items: [
        // Pre-Installation
        {
          type: 'category',
          label: 'Pre-Installation',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'installer-guide/installation-overview',  label: 'Installation Overview' },
            { type: 'doc', id: 'installer-guide/environmental',           label: 'Environmental Requirements' },
            { type: 'doc', id: 'installer-guide/network-setup',           label: 'Network Setup' },
            { type: 'doc', id: 'installer-guide/firewall-configuration',  label: 'Firewall Configuration' },
            { type: 'doc', id: 'installer-guide/ip-whitelisting',         label: 'IP Whitelisting' },
            { type: 'doc', id: 'installer-guide/bandwidth-requirements',  label: 'Bandwidth Requirements' },
          ],
        },

        // Installation
        {
          type: 'category',
          label: 'Installation',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'installer-guide/device-installation', label: 'Device Configuration' },
            { type: 'doc', id: 'installer-guide/device-registration',  label: 'Device Integration' },
          ],
        },

        // Post-Installation
        {
          type: 'category',
          label: 'Post-Installation',
          collapsible: true,
          collapsed: true,
          items: [
            { type: 'doc', id: 'installer-guide/post-installation', label: 'Post Installation Checklist' },
            { type: 'doc', id: 'installer-guide/troubleshooting',   label: 'Troubleshooting' },
          ],
        },
      ],
    },

    // ─── 7. Operator Guide ───────────────────────────────────────────────────
    {
      type: 'category',
      label: '7. Operator Guide',
      collapsible: true,
      collapsed: true,
      items: [
        { type: 'doc', id: 'operator-guide/training-guide',        label: 'Operator Quick Start' },
        { type: 'doc', id: 'operator-guide/multi-site-monitoring', label: 'Daily Monitoring Workflow' },
        { type: 'doc', id: 'operator-guide/handling-alarms',       label: 'Handling Alarms' },
        { type: 'doc', id: 'operator-guide/live-video',            label: 'Using Live View & Playback' },
        { type: 'doc', id: 'operator-guide/site-navigation',         label: 'Audio & Communication' },
        { type: 'doc', id: 'operator-guide/escalation-procedures', label: 'Escalation Procedures' },
      ],
    },

    // ─── 8. Admin Guide ──────────────────────────────────────────────────────
    {
      type: 'category',
      label: '8. Admin Guide',
      collapsible: true,
      collapsed: true,
      items: [
        { type: 'doc', id: 'admin-guide/overview',               label: 'Admin Overview' },
        { type: 'doc', id: 'operator-guide/site-management',   label: 'Managing Sites & Devices' },
        { type: 'doc', id: 'getting-started/user-management',  label: 'User & Role Management' },
        { type: 'doc', id: 'admin-guide/alarm-configuration',  label: 'Alarm Configuration' },
        { type: 'doc', id: 'reporting/reporting-overview',     label: 'Reports & Audit' },
        { type: 'doc', id: 'features/system-health-monitoring', label: 'System Health & Alerts' },
        { type: 'doc', id: 'admin-guide/admin-training',       label: 'Admin Training' },
      ],
    },

    // ─── 9. Datasheets & Specs ───────────────────────────────────────────────
    {
      type: 'category',
      label: '9. Datasheets & Specs',
      collapsible: true,
      collapsed: true,
      items: [
        { type: 'doc', id: 'knowledge-base/compliance',   label: 'Compliance' },
        { type: 'doc', id: 'knowledge-base/data-privacy', label: 'Data Privacy' },
        { type: 'doc', id: 'knowledge-base/glossary',     label: 'Glossary' },
        { type: 'doc', id: 'knowledge-base/faq',          label: 'FAQ' },
      ],
    },

  ],
};

export default sidebars;
