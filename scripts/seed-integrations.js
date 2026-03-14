#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN,
  useCdn: false,
});

const integrations = [
  {
    _id: 'integration-slack',
    _type: 'integration',
    name: 'Slack',
    slug: { _type: 'slug', current: 'slack' },
    description: 'Send real-time alerts and notifications to Slack channels. Keep your team informed with rich message formatting, interactive buttons, and channel-specific routing.',
    integrationType: 'notification',
    provider: 'Slack Technologies',
    website: 'https://slack.com',
    status: 'active',
    authentication: [
      {
        authType: 'oauth2',
        description: 'OAuth 2.0 authentication for secure Slack workspace integration.',
        setupSteps: [
          'Click "Add to Slack" in NXGEN integration settings',
          'Select your Slack workspace and authorize the app',
          'Choose channels where alerts should be posted',
          'Configure alert routing rules in NXGEN'
        ]
      },
      {
        authType: 'webhook',
        description: 'Incoming Webhook for direct message posting to a single channel.',
        setupSteps: [
          'Create an Incoming Webhook in Slack app settings',
          'Copy the Webhook URL',
          'Paste the URL in NXGEN Slack integration configuration',
          'Test the connection with a sample alert'
        ]
      }
    ],
    capabilities: ['send_alerts', 'receive_webhooks', 'bidirectional'],
    limitations: [
      'Rate limit: 1 message per second per webhook',
      'Maximum 100 alerts per minute per channel',
      'Message formatting limited to Slack Block Kit'
    ],
    requirements: [
      'Slack workspace admin access for OAuth setup',
      'Existing Slack channels for alert routing',
      'Network access to slack.com'
    ],
    setupSteps: [
      { step: 1, title: 'Choose Authentication Method', description: 'Select between OAuth 2.0 (recommended) or Incoming Webhook.' },
      { step: 2, title: 'Authorize NXGEN', description: 'Follow the OAuth flow or configure your webhook URL.' },
      { step: 3, title: 'Configure Channel Mapping', description: 'Map alert severities and types to specific Slack channels.' },
      { step: 4, title: 'Test Integration', description: 'Send a test alert to verify message formatting and delivery.' },
      { step: 5, title: 'Enable Alert Routing', description: 'Configure which NXGEN alerts should trigger Slack notifications.' }
    ],
    rateLimits: {
      requestsPerSecond: 1,
      requestsPerMinute: 100,
      notes: 'Rate limits apply per webhook. Multiple webhooks can be configured for high-volume scenarios.'
    },
    tags: ['notifications', 'team-collaboration', 'real-time'],
    body: [
      {
        _type: 'block',
        _key: 'slack-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Slack integration enables real-time alert notifications directly in your team channels. With rich message formatting and interactive actions, your team can respond faster to critical incidents.' }
        ]
      },
      {
        _type: 'block',
        _key: 'slack-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Key Features' }]
      },
      {
        _type: 'block',
        _key: 'slack-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Rich alert cards with station details, severity, and quick actions' }]
      },
      {
        _type: 'block',
        _key: 'slack-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Interactive buttons for acknowledge, escalate, and view details' }]
      },
      {
        _type: 'block',
        _key: 'slack-features-list-3',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-5', text: 'Channel-based routing for team-specific alerting' }]
      },
      {
        _type: 'callout',
        _key: 'slack-tip',
        type: 'tip',
        title: 'Pro Tip',
        body: [
          {
            _type: 'block',
            _key: 'slack-tip-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-6', text: 'Use Slack channel mentions (@channel, @here) for critical alerts to ensure immediate visibility.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-pagerduty',
    _type: 'integration',
    name: 'PagerDuty',
    slug: { _type: 'slug', current: 'pagerduty' },
    description: 'Integrate with PagerDuty for advanced incident management. Automatically create incidents, manage on-call rotations, and leverage escalation policies.',
    integrationType: 'ticketing',
    provider: 'PagerDuty, Inc.',
    website: 'https://pagerduty.com',
    status: 'active',
    authentication: [
      {
        authType: 'apikey',
        description: 'PagerDuty API key for service integration. Supports both Events API and REST API operations.',
        setupSteps: [
          'Navigate to PagerDuty Services > Integrations',
          'Create a new service or select existing',
          'Add "NXGEN" as integration type',
          'Copy the Integration Key'
        ]
      }
    ],
    capabilities: ['send_alerts', 'create_tickets', 'update_tickets', 'bidirectional'],
    limitations: [
      'Events API v2 rate limit: 120 events per minute',
      'REST API rate limit: 60 requests per minute',
      'Auto-resolution requires matching dedup keys'
    ],
    requirements: [
      'PagerDuty account with API access',
      'Configured PagerDuty services and escalation policies',
      'Integration key from PagerDuty'
    ],
    setupSteps: [
      { step: 1, title: 'Create PagerDuty Service', description: 'Set up a dedicated PagerDuty service for NXGEN alerts.' },
      { step: 2, title: 'Get Integration Key', description: 'Add an integration and copy the Integration Key.' },
      { step: 3, title: 'Configure NXGEN Integration', description: 'Enter the Integration Key in NXGEN PagerDuty settings.' },
      { step: 4, title: 'Set Up Escalation Policies', description: 'Configure PagerDuty escalation policies for automatic incident routing.' },
      { step: 5, title: 'Enable Auto-Resolution', description: 'Configure deduplication keys for automatic incident resolution.' }
    ],
    rateLimits: {
      requestsPerMinute: 120,
      requestsPerDay: 10000,
      notes: 'Events API v2 supports burst limits. Contact PagerDuty for enterprise rate limits.'
    },
    tags: ['incident-management', 'on-call', 'escalation'],
    body: [
      {
        _type: 'block',
        _key: 'pd-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'PagerDuty integration bridges NXGEN monitoring with enterprise-grade incident management. Leverage on-call rotations, escalation policies, and automated incident workflows.' }
        ]
      },
      {
        _type: 'block',
        _key: 'pd-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Integration Capabilities' }]
      },
      {
        _type: 'block',
        _key: 'pd-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Automatic incident creation from NXGEN alerts' }]
      },
      {
        _type: 'block',
        _key: 'pd-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Severity mapping to PagerDuty priorities (P1-P5)' }]
      },
      {
        _type: 'callout',
        _key: 'pd-warning',
        type: 'warning',
        title: 'Deduplication Keys',
        body: [
          {
            _type: 'block',
            _key: 'pd-warning-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'Ensure unique deduplication keys are used for each alert source to enable proper incident correlation.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-microsoft-teams',
    _type: 'integration',
    name: 'Microsoft Teams',
    slug: { _type: 'slug', current: 'microsoft-teams' },
    description: 'Send alerts and notifications to Microsoft Teams channels. Display interactive Adaptive Cards with alert details and action buttons.',
    integrationType: 'notification',
    provider: 'Microsoft Corporation',
    website: 'https://teams.microsoft.com',
    status: 'active',
    authentication: [
      {
        authType: 'webhook',
        description: 'Office 365 Connectors (Incoming Webhook) for posting messages to Teams channels.',
        setupSteps: [
          'In Teams, navigate to the desired channel',
          'Click "..." > Connectors',
          'Search for "Incoming Webhook" and configure',
          'Copy the generated webhook URL'
        ]
      }
    ],
    capabilities: ['send_alerts'],
    limitations: [
      'Rate limit: 100 requests per minute per webhook',
      'Adaptive Cards schema version 1.4 supported',
      'No bidirectional sync (webhook only)'
    ],
    requirements: [
      'Microsoft Teams with Office 365 subscription',
      'Channel admin access to configure webhooks',
      'Network access to outlook.office.com'
    ],
    setupSteps: [
      { step: 1, title: 'Create Teams Webhook', description: 'Add an Incoming Webhook connector to your Teams channel.' },
      { step: 2, title: 'Configure in NXGEN', description: 'Add the webhook URL to NXGEN Teams integration settings.' },
      { step: 3, title: 'Customize Alert Format', description: 'Choose between simple message format or Adaptive Cards.' },
      { step: 4, title: 'Set Up Routing Rules', description: 'Configure which alerts should be sent to Teams.' },
      { step: 5, title: 'Test and Deploy', description: 'Send test alerts to verify formatting and delivery.' }
    ],
    rateLimits: {
      requestsPerMinute: 100,
      notes: 'Teams webhooks are per-channel. Create multiple webhooks for high-volume alerting.'
    },
    tags: ['notifications', 'microsoft-365', 'collaboration'],
    body: [
      {
        _type: 'block',
        _key: 'teams-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Microsoft Teams integration delivers NXGEN alerts directly to your team collaboration channels with rich Adaptive Cards formatting.' }
        ]
      },
      {
        _type: 'block',
        _key: 'teams-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Features' }]
      },
      {
        _type: 'block',
        _key: 'teams-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Adaptive Cards with station and alert details' }]
      },
      {
        _type: 'block',
        _key: 'teams-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Interactive action buttons for quick response' }]
      },
      {
        _type: 'callout',
        _key: 'teams-info',
        type: 'info',
        title: 'Adaptive Cards',
        body: [
          {
            _type: 'block',
            _key: 'teams-info-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'NXGEN uses Adaptive Cards schema version 1.4 for rich message formatting.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-milestone-xprotect',
    _type: 'integration',
    name: 'Milestone XProtect',
    slug: { _type: 'slug', current: 'milestone-xprotect' },
    description: 'Integrate with Milestone XProtect VMS for comprehensive video management. Discover cameras, embed live views, and synchronize events bi-directionally.',
    integrationType: 'automation',
    provider: 'Milestone Systems',
    website: 'https://www.milestonesys.com',
    status: 'active',
    authentication: [
      {
        authType: 'basic',
        description: 'Basic authentication with XProtect Management Server credentials.',
        setupSteps: [
          'Create a dedicated XProtect user for NXGEN integration',
          'Assign appropriate camera and system permissions',
          'Enter credentials in NXGEN XProtect configuration',
          'Test connection to Management Server'
        ]
      }
    ],
    capabilities: ['sync_devices', 'streaming', 'bidirectional', 'import_data'],
    limitations: [
      'Requires XProtect 2020 R2 or later',
      'Maximum 500 cameras per integration instance',
      'Video streaming requires direct network access'
    ],
    requirements: [
      'Milestone XProtect Management Server 2020 R2+',
      'Network access to XProtect servers',
      'Valid XProtect license with API access'
    ],
    setupSteps: [
      { step: 1, title: 'Configure XProtect User', description: 'Create a dedicated Windows user account with appropriate permissions.' },
      { step: 2, title: 'Enter Connection Details', description: 'Configure Management Server address, credentials, and port.' },
      { step: 3, title: 'Run Camera Discovery', description: 'Execute automatic camera discovery to import all cameras.' },
      { step: 4, title: 'Map Cameras to Stations', description: 'Associate discovered cameras with NXGEN monitoring stations.' },
      { step: 5, title: 'Configure Event Sync', description: 'Set up bidirectional event synchronization for alarms.' }
    ],
    rateLimits: {
      requestsPerSecond: 10,
      notes: 'Streaming bandwidth depends on camera count and resolution settings.'
    },
    tags: ['vms', 'video', 'camera', 'cctv'],
    body: [
      {
        _type: 'block',
        _key: 'xprotect-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Milestone XProtect integration provides native video management capabilities within NXGEN. Access live feeds, playback, and camera events directly from monitoring dashboards.' }
        ]
      },
      {
        _type: 'block',
        _key: 'xprotect-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Integration Features' }]
      },
      {
        _type: 'block',
        _key: 'xprotect-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Automatic camera discovery and import' }]
      },
      {
        _type: 'block',
        _key: 'xprotect-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Live video embedding in NXGEN dashboards' }]
      },
      {
        _type: 'callout',
        _key: 'xprotect-note',
        type: 'note',
        title: 'Version Requirements',
        body: [
          {
            _type: 'block',
            _key: 'xprotect-note-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'This integration requires XProtect 2020 R2 or later with the Milestone Integration Platform (MIP) enabled.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-genetec-security-center',
    _type: 'integration',
    name: 'Genetec Security Center',
    slug: { _type: 'slug', current: 'genetec-security-center' },
    description: 'Connect Genetec Security Center PSIM for unified security operations. Enable bidirectional sync for alarms, camera management, and map integration.',
    integrationType: 'security',
    provider: 'Genetec Inc.',
    website: 'https://www.genetec.com',
    status: 'active',
    authentication: [
      {
        authType: 'apikey',
        description: 'Genetec Web SDK API key authentication for Security Center integration.',
        setupSteps: [
          'In Config Tool, create a new user for NXGEN',
          'Assign appropriate privileges and roles',
          'Generate API key from Security Center',
          'Configure API endpoint and key in NXGEN'
        ]
      },
      {
        authType: 'certificate',
        description: 'Client certificate authentication for enhanced security in enterprise deployments.',
        setupSteps: [
          'Generate a client certificate from your CA',
          'Import certificate to Security Center',
          'Configure NXGEN to use the certificate',
          'Test mutual TLS connection'
        ]
      }
    ],
    capabilities: ['sync_devices', 'bidirectional', 'historical', 'streaming'],
    limitations: [
      'Requires Security Center 5.9 or later',
      'Map integration requires AutoVu or Synergis license',
      'Maximum 1000 entities per sync operation'
    ],
    requirements: [
      'Genetec Security Center 5.9+',
      'Web SDK license',
      'Network access to Security Center servers'
    ],
    setupSteps: [
      { step: 1, title: 'Configure Security Center User', description: 'Create a dedicated user account with appropriate privileges.' },
      { step: 2, title: 'Set Up API Access', description: 'Enable Web SDK and generate API credentials.' },
      { step: 3, title: 'Connect NXGEN to Security Center', description: 'Enter connection details and credentials in NXGEN.' },
      { step: 4, title: 'Configure Entity Sync', description: 'Select cameras, doors, and other entities to synchronize.' },
      { step: 5, title: 'Set Up Alarm Forwarding', description: 'Configure which Genetec alarms should create NXGEN alerts.' }
    ],
    rateLimits: {
      requestsPerSecond: 5,
      requestsPerMinute: 200,
      notes: 'Streaming and event throughput depends on Security Center server capacity.'
    },
    tags: ['psim', 'video', 'access-control', 'security'],
    body: [
      {
        _type: 'block',
        _key: 'genetec-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Genetec Security Center integration provides unified security monitoring within NXGEN. Access cameras, access control events, and alarms from a single platform.' }
        ]
      },
      {
        _type: 'block',
        _key: 'genetec-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Key Capabilities' }]
      },
      {
        _type: 'block',
        _key: 'genetec-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Bidirectional alarm synchronization' }]
      },
      {
        _type: 'block',
        _key: 'genetec-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Camera entity import and live view' }]
      },
      {
        _type: 'callout',
        _key: 'genetec-warning',
        type: 'warning',
        title: 'License Requirements',
        body: [
          {
            _type: 'block',
            _key: 'genetec-warning-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'Web SDK license is required. Map integration additionally requires AutoVu or Synergis license.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-salesforce',
    _type: 'integration',
    name: 'Salesforce',
    slug: { _type: 'slug', current: 'salesforce' },
    description: 'Integrate with Salesforce CRM to sync customer data, create cases from alerts, and track asset information across platforms.',
    integrationType: 'data',
    provider: 'Salesforce, Inc.',
    website: 'https://www.salesforce.com',
    status: 'active',
    authentication: [
      {
        authType: 'oauth2',
        description: 'OAuth 2.0 with connected app for secure Salesforce integration.',
        setupSteps: [
          'Create a Connected App in Salesforce',
          'Configure OAuth scopes for NXGEN',
          'Authorize NXGEN to access your Salesforce org',
          'Select objects to synchronize'
        ]
      }
    ],
    capabilities: ['import_data', 'export_data', 'create_tickets', 'bidirectional'],
    limitations: [
      'API limits based on Salesforce edition',
      'Maximum 200 records per bulk operation',
      'Custom objects require field mapping'
    ],
    requirements: [
      'Salesforce Enterprise edition or higher',
      'Connected App with OAuth enabled',
      'API access permission in Salesforce'
    ],
    setupSteps: [
      { step: 1, title: 'Create Connected App', description: 'Set up a Salesforce Connected App with OAuth 2.0.' },
      { step: 2, title: 'Authorize NXGEN', description: 'Complete OAuth flow to grant NXGEN access.' },
      { step: 3, title: 'Configure Object Mapping', description: 'Map NXGEN stations and devices to Salesforce objects.' },
      { step: 4, title: 'Set Up Case Creation', description: 'Configure rules for automatic case creation from alerts.' },
      { step: 5, title: 'Enable Asset Tracking', description: 'Link NXGEN devices to Salesforce assets.' }
    ],
    rateLimits: {
      requestsPerDay: 15000,
      notes: 'API limits vary by Salesforce edition.'
    },
    tags: ['crm', 'customer-data', 'cases', 'assets'],
    body: [
      {
        _type: 'block',
        _key: 'sf-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Salesforce integration connects NXGEN monitoring with your customer relationship management. Automatically create cases, track assets, and maintain customer context.' }
        ]
      },
      {
        _type: 'block',
        _key: 'sf-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Integration Features' }]
      },
      {
        _type: 'block',
        _key: 'sf-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Customer account synchronization' }]
      },
      {
        _type: 'block',
        _key: 'sf-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Automatic case creation from alerts' }]
      },
      {
        _type: 'callout',
        _key: 'sf-tip',
        type: 'tip',
        title: 'Case Escalation',
        body: [
          {
            _type: 'block',
            _key: 'sf-tip-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'Configure Salesforce escalation rules to automatically route cases created from NXGEN alerts.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-zendesk',
    _type: 'integration',
    name: 'Zendesk',
    slug: { _type: 'slug', current: 'zendesk' },
    description: 'Create and manage Zendesk tickets from NXGEN alerts. Sync ticket status, auto-assign agents, and maintain complete incident history.',
    integrationType: 'ticketing',
    provider: 'Zendesk, Inc.',
    website: 'https://www.zendesk.com',
    status: 'active',
    authentication: [
      {
        authType: 'apikey',
        description: 'Zendesk API token authentication for ticket management operations.',
        setupSteps: [
          'Navigate to Zendesk Admin > API',
          'Enable Token Access',
          'Generate a new API token',
          'Configure in NXGEN with email and token'
        ]
      },
      {
        authType: 'oauth2',
        description: 'OAuth 2.0 for secure integration with enhanced permissions.',
        setupSteps: [
          'Register NXGEN as an OAuth client in Zendesk',
          'Authorize NXGEN to access your Zendesk account',
          'Grant ticket read/write permissions',
          'Complete OAuth flow in NXGEN settings'
        ]
      }
    ],
    capabilities: ['create_tickets', 'update_tickets', 'bidirectional'],
    limitations: [
      'Rate limit: 700 requests per minute',
      'Custom fields require mapping configuration',
      'Attachments limited to 50MB per ticket'
    ],
    requirements: [
      'Zendesk Support Professional or Enterprise',
      'API access enabled',
      'Zendesk admin access for initial setup'
    ],
    setupSteps: [
      { step: 1, title: 'Generate API Credentials', description: 'Create an API token or OAuth client in Zendesk Admin.' },
      { step: 2, title: 'Configure NXGEN Integration', description: 'Enter Zendesk subdomain, email, and API token.' },
      { step: 3, title: 'Map Alert Types to Ticket Fields', description: 'Configure how NXGEN alert attributes map to ticket fields.' },
      { step: 4, title: 'Set Up Auto-Assignment', description: 'Configure rules for automatic ticket assignment.' },
      { step: 5, title: 'Enable Status Sync', description: 'Activate bidirectional sync for ticket status updates.' }
    ],
    rateLimits: {
      requestsPerMinute: 700,
      notes: 'Rate limits may vary based on Zendesk plan.'
    },
    tags: ['ticketing', 'support', 'helpdesk'],
    body: [
      {
        _type: 'block',
        _key: 'zd-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Zendesk integration automates ticket creation from NXGEN alerts, ensuring every incident is tracked and resolved through your support workflow.' }
        ]
      },
      {
        _type: 'block',
        _key: 'zd-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Capabilities' }]
      },
      {
        _type: 'block',
        _key: 'zd-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Automatic ticket creation from alerts' }]
      },
      {
        _type: 'block',
        _key: 'zd-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Bidirectional status synchronization' }]
      },
      {
        _type: 'callout',
        _key: 'zd-info',
        type: 'info',
        title: 'Status Mapping',
        body: [
          {
            _type: 'block',
            _key: 'zd-info-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'NXGEN alert status syncs with Zendesk ticket status. When a ticket is solved, the alert can auto-resolve.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-splunk',
    _type: 'integration',
    name: 'Splunk',
    slug: { _type: 'slug', current: 'splunk' },
    description: 'Forward NXGEN logs and events to Splunk for SIEM analysis. Correlate alerts, build dashboards, and leverage Splunk search capabilities.',
    integrationType: 'analytics',
    provider: 'Splunk Inc.',
    website: 'https://www.splunk.com',
    status: 'active',
    authentication: [
      {
        authType: 'bearer',
        description: 'Splunk HEC (HTTP Event Collector) token for log and event forwarding.',
        setupSteps: [
          'Enable HTTP Event Collector in Splunk',
          'Create a new HEC token',
          'Configure index settings for NXGEN data',
          'Copy token to NXGEN integration settings'
        ]
      }
    ],
    capabilities: ['export_data', 'historical', 'streaming'],
    limitations: [
      'HEC throughput limits based on Splunk license',
      'Indexer capacity determines ingestion rate',
      'Dashboard sync requires additional configuration'
    ],
    requirements: [
      'Splunk Enterprise or Splunk Cloud',
      'HTTP Event Collector enabled',
      'Sufficient indexing capacity'
    ],
    setupSteps: [
      { step: 1, title: 'Enable HEC in Splunk', description: 'Activate HTTP Event Collector and create a dedicated token.' },
      { step: 2, title: 'Configure NXGEN Forwarding', description: 'Enter HEC URL and token in NXGEN Splunk settings.' },
      { step: 3, title: 'Select Event Types', description: 'Choose which NXGEN events to forward: alerts, device status, logs.' },
      { step: 4, title: 'Set Up Index Mapping', description: 'Configure Splunk index destinations for different data types.' },
      { step: 5, title: 'Create Dashboards', description: 'Build Splunk dashboards and alerts using NXGEN data.' }
    ],
    rateLimits: {
      requestsPerSecond: 100,
      notes: 'HEC limits depend on indexer capacity and Splunk license tier.'
    },
    tags: ['siem', 'log-management', 'analytics', 'security'],
    body: [
      {
        _type: 'block',
        _key: 'splunk-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'Splunk integration enables enterprise security monitoring by forwarding NXGEN events for correlation, analysis, and long-term retention.' }
        ]
      },
      {
        _type: 'block',
        _key: 'splunk-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Integration Features' }]
      },
      {
        _type: 'block',
        _key: 'splunk-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Real-time log forwarding via HEC' }]
      },
      {
        _type: 'block',
        _key: 'splunk-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Alert correlation with security events' }]
      },
      {
        _type: 'callout',
        _key: 'splunk-note',
        type: 'note',
        title: 'Index Planning',
        body: [
          {
            _type: 'block',
            _key: 'splunk-note-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-5', text: 'Plan your Splunk indexes before enabling forwarding. Separate indexes for alerts, device telemetry, and system logs are recommended.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-aws-s3',
    _type: 'integration',
    name: 'AWS S3',
    slug: { _type: 'slug', current: 'aws-s3' },
    description: 'Backup video clips and exports to AWS S3. Automate archival workflows with lifecycle policies and secure cloud storage.',
    integrationType: 'storage',
    provider: 'Amazon Web Services',
    website: 'https://aws.amazon.com/s3/',
    status: 'active',
    authentication: [
      {
        authType: 'apikey',
        description: 'AWS Access Key ID and Secret Access Key for S3 API access.',
        setupSteps: [
          'Create an IAM user in AWS Console',
          'Attach S3 permissions policy (s3:PutObject, s3:GetObject)',
          'Generate Access Key ID and Secret Access Key',
          'Configure credentials in NXGEN AWS S3 settings'
        ]
      },
      {
        authType: 'oauth2',
        description: 'IAM Role with OIDC federation for temporary credentials.',
        setupSteps: [
          'Create an IAM OIDC provider for NXGEN',
          'Create IAM Role with S3 permissions',
          'Configure trust relationship for NXGEN',
          'Enter Role ARN in NXGEN settings'
        ]
      }
    ],
    capabilities: ['export_data', 'historical', 'import_data'],
    limitations: [
      'Maximum 5TB per object',
      'Multipart uploads required for files >100MB',
      'Cross-region replication requires additional setup'
    ],
    requirements: [
      'AWS account with S3 access',
      'S3 bucket created and configured',
      'IAM user or role with appropriate permissions'
    ],
    setupSteps: [
      { step: 1, title: 'Create S3 Bucket', description: 'Create an S3 bucket for NXGEN video backups and exports.' },
      { step: 2, title: 'Configure IAM Access', description: 'Set up IAM user or role with S3 permissions.' },
      { step: 3, title: 'Enter AWS Credentials', description: 'Configure Access Key or IAM Role in NXGEN AWS S3 settings.' },
      { step: 4, title: 'Set Up Backup Rules', description: 'Configure automatic video clip backup triggers and schedules.' },
      { step: 5, title: 'Configure Lifecycle Policies', description: 'Set up S3 lifecycle rules for automatic archival and cleanup.' }
    ],
    rateLimits: {
      requestsPerSecond: 3500,
      notes: 'S3 rate limits are per-prefix. Use key prefixes for high-throughput scenarios.'
    },
    tags: ['cloud-storage', 'backup', 'video-archive', 'aws'],
    body: [
      {
        _type: 'block',
        _key: 's3-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'AWS S3 integration provides secure cloud storage for video clip backups and automated export workflows. Configure lifecycle policies for cost-effective long-term archival.' }
        ]
      },
      {
        _type: 'block',
        _key: 's3-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'Storage Features' }]
      },
      {
        _type: 'block',
        _key: 's3-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Automatic video clip backup' }]
      },
      {
        _type: 'block',
        _key: 's3-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Export automation with scheduling' }]
      },
      {
        _type: 'block',
        _key: 's3-features-list-3',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-5', text: 'S3 lifecycle policies for archival (Glacier)' }]
      },
      {
        _type: 'callout',
        _key: 's3-tip',
        type: 'tip',
        title: 'Cost Optimization',
        body: [
          {
            _type: 'block',
            _key: 's3-tip-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-6', text: 'Use S3 Intelligent-Tiering or lifecycle policies to automatically transition older backups to S3 Glacier for significant cost savings.' }]
          }
        ]
      }
    ]
  },
  {
    _id: 'integration-mqtt-broker',
    _type: 'integration',
    name: 'MQTT Broker',
    slug: { _type: 'slug', current: 'mqtt-broker' },
    description: 'Connect to MQTT brokers for IoT sensor data ingestion. Receive real-time telemetry, send device commands, and integrate with IoT ecosystems.',
    integrationType: 'automation',
    provider: 'Generic MQTT',
    website: 'https://mqtt.org',
    status: 'active',
    authentication: [
      {
        authType: 'basic',
        description: 'Username and password authentication for MQTT broker connection.',
        setupSteps: [
          'Create MQTT user credentials in your broker',
          'Configure username and password in NXGEN MQTT settings',
          'Set the broker URL and port',
          'Test connection to verify authentication'
        ]
      },
      {
        authType: 'certificate',
        description: 'TLS client certificate authentication for secure MQTT connections.',
        setupSteps: [
          'Generate client certificate from your CA',
          'Configure broker to accept client certificates',
          'Upload certificate to NXGEN MQTT settings',
          'Test TLS connection'
        ]
      }
    ],
    capabilities: ['streaming', 'import_data', 'bidirectional', 'receive_webhooks'],
    limitations: [
      'Message size limited by broker configuration',
      'QoS levels depend on broker support',
      'Retained messages may affect performance'
    ],
    requirements: [
      'MQTT broker (Mosquitto, HiveMQ, EMQX, etc.)',
      'Network access to broker',
      'Topics configured for NXGEN data exchange'
    ],
    setupSteps: [
      { step: 1, title: 'Configure Broker Connection', description: 'Enter MQTT broker URL, port, and authentication details.' },
      { step: 2, title: 'Define Topic Structure', description: 'Configure topics for sensor data, alerts, and commands.' },
      { step: 3, title: 'Map Sensors to Stations', description: 'Associate MQTT topics with NXGEN stations and devices.' },
      { step: 4, title: 'Configure Data Parsing', description: 'Set up JSON payload parsing rules for sensor telemetry.' },
      { step: 5, title: 'Enable Alert Rules', description: 'Create alert rules based on MQTT sensor data thresholds.' }
    ],
    rateLimits: {
      requestsPerSecond: 1000,
      notes: 'Throughput depends on broker capacity and network conditions.'
    },
    tags: ['iot', 'mqtt', 'sensors', 'telemetry', 'real-time'],
    body: [
      {
        _type: 'block',
        _key: 'mqtt-intro',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span-1', text: 'MQTT integration enables real-time IoT sensor data ingestion from any MQTT-compatible broker. Receive telemetry, process sensor events, and send commands to connected devices.' }
        ]
      },
      {
        _type: 'block',
        _key: 'mqtt-features-title',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span-2', text: 'IoT Capabilities' }]
      },
      {
        _type: 'block',
        _key: 'mqtt-features-list',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-3', text: 'Real-time sensor data ingestion' }]
      },
      {
        _type: 'block',
        _key: 'mqtt-features-list-2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-4', text: 'Device command publishing' }]
      },
      {
        _type: 'block',
        _key: 'mqtt-features-list-3',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-5', text: 'Alert generation from sensor thresholds' }]
      },
      {
        _type: 'block',
        _key: 'mqtt-features-list-4',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span-6', text: 'Support for JSON and custom payload formats' }]
      },
      {
        _type: 'callout',
        _key: 'mqtt-warning',
        type: 'warning',
        title: 'Topic Design',
        body: [
          {
            _type: 'block',
            _key: 'mqtt-warning-body',
            style: 'normal',
            children: [{ _type: 'span', _key: 'span-7', text: 'Plan your MQTT topic hierarchy before deployment. Use hierarchical topics like nxgen/station/{id}/sensor/{type} for better organization and filtering.' }]
          }
        ]
      }
    ]
  }
];

async function seedIntegrations() {
  console.log('Seeding integrations to Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  for (const integration of integrations) {
    try {
      await client.createOrReplace(integration);
      console.log(`Created: ${integration.name} (/integrations/${integration.slug.current})`);
    } catch (err) {
      console.error(`Error creating ${integration.name}:`, err.message);
    }
  }

  console.log('\nSeeding complete!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

seedIntegrations().catch(console.error);
