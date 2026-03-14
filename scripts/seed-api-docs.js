#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

const today = new Date().toISOString().slice(0, 10);

const sidebarCategories = [
  {
    _id: 'sidebar-cat-api',
    _type: 'sidebarCategory',
    title: 'API',
    slug: { _type: 'slug', current: 'api' },
    description: 'NXGEN API documentation - REST, GraphQL, Webhooks, and SDKs',
    icon: 'Code',
    position: 50,
    collapsed: false,
    collapsible: true,
    link: { type: 'doc' },
    targetAudience: ['all', 'admin', 'developer']
  },
  {
    _id: 'sidebar-cat-api-overview',
    _type: 'sidebarCategory',
    title: 'Overview',
    slug: { _type: 'slug', current: 'api-overview' },
    description: 'API overview and getting started',
    icon: 'BookOpen',
    position: 1,
    targetAudience: ['all']
  },
  {
    _id: 'sidebar-cat-api-rest',
    _type: 'sidebarCategory',
    title: 'REST API',
    slug: { _type: 'slug', current: 'api-rest' },
    description: 'REST API reference documentation',
    icon: 'Globe',
    position: 2,
    targetAudience: ['all', 'developer']
  },
  {
    _id: 'sidebar-cat-api-graphql',
    _type: 'sidebarCategory',
    title: 'GraphQL API',
    slug: { _type: 'slug', current: 'api-graphql' },
    description: 'GraphQL API documentation',
    icon: 'GitBranch',
    position: 3,
    targetAudience: ['all', 'developer']
  },
  {
    _id: 'sidebar-cat-api-webhooks',
    _type: 'sidebarCategory',
    title: 'Webhooks',
    slug: { _type: 'slug', current: 'api-webhooks' },
    description: 'Webhook integration documentation',
    icon: 'Webhook',
    position: 4,
    targetAudience: ['all', 'developer']
  },
  {
    _id: 'sidebar-cat-api-sdks',
    _type: 'sidebarCategory',
    title: 'SDKs & Libraries',
    slug: { _type: 'slug', current: 'api-sdks' },
    description: 'Official SDKs and client libraries',
    icon: 'Package',
    position: 5,
    targetAudience: ['all', 'developer']
  }
];

function createPortableTextBlocks(content) {
  return content.map((block, index) => {
    if (typeof block === 'string') {
      return {
        _type: 'block',
        _key: `block-${index}`,
        style: 'normal',
        children: [{ _type: 'span', _key: `span-${index}`, text: block, marks: [] }],
        markDefs: []
      };
    }
    return { ...block, _key: block._key || `block-${index}` };
  });
}

const apiDocs = [
  {
    _id: 'doc-api-overview',
    _type: 'doc',
    title: 'API Overview',
    slug: { _type: 'slug', current: 'api-overview' },
    description: 'Complete guide to NXGEN APIs - authentication, rate limits, SDKs, and getting started with API integration.',
    sidebarCategory: { _type: 'reference', _ref: 'sidebar-cat-api-overview' },
    sidebarPosition: 1,
    status: 'published',
    targetAudience: ['all'],
    tags: ['api', 'overview', 'getting-started'],
    lastUpdated: today,
    body: createPortableTextBlocks([
      'The NXGEN API provides programmatic access to your monitoring platform. Build custom integrations, automate workflows, and extend NXGEN capabilities with our comprehensive REST and GraphQL APIs.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Introduction', marks: [] }], markDefs: [] },
      'NXGEN offers a modern, well-documented API that enables you to integrate monitoring capabilities into your existing systems. Whether you\'re building a custom dashboard, automating alert responses, or syncing data with external tools, our APIs provide the flexibility you need.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Authentication Methods', marks: [] }], markDefs: [] },
      'NXGEN supports multiple authentication methods to secure your API access:',
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'API Key Authentication', marks: [] }], markDefs: [] },
      'API keys are the simplest way to authenticate. Generate keys from your account settings and include them in the X-API-Key header. Keys can be scoped to specific permissions and organizations.',
      { _type: 'codeBlock', code: "curl -H 'X-API-Key: nxg_ak_your_key_here' \\\n     -H 'X-API-Secret: nxg_as_your_secret_here' \\\n     https://api.nxgen.io/api/v1/stations", language: 'bash', filename: 'API Key Example' },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'OAuth 2.0', marks: [] }], markDefs: [] },
      'For third-party applications and user-authorized access, use OAuth 2.0. This provides fine-grained permission control and secure token-based authentication with automatic refresh.',
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'JWT Bearer Tokens', marks: [] }], markDefs: [] },
      'After initial authentication, you\'ll receive a JWT bearer token. Include this in the Authorization header for subsequent requests.',
      { _type: 'codeBlock', code: "curl -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...' \\\n     https://api.nxgen.io/api/v1/stations", language: 'bash', filename: 'Bearer Token Example' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Rate Limits', marks: [] }], markDefs: [] },
      'API requests are rate-limited to ensure fair usage and platform stability. Limits vary by endpoint and authentication method.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Available SDKs', marks: [] }], markDefs: [] },
      'Official SDKs are available for popular programming languages including JavaScript/TypeScript, Python, Go, Java, C#/.NET, and PHP.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Next Steps', marks: [] }], markDefs: [] },
      'Ready to start integrating? Check out the REST API Reference, GraphQL API, Webhooks, and SDK Documentation sections.'
    ])
  },
  {
    _id: 'doc-api-rest',
    _type: 'doc',
    title: 'REST API Reference',
    slug: { _type: 'slug', current: 'api-rest' },
    description: 'Complete REST API reference for NXGEN - endpoints, request/response formats, authentication, and error handling.',
    sidebarCategory: { _type: 'reference', _ref: 'sidebar-cat-api-rest' },
    sidebarPosition: 1,
    status: 'published',
    targetAudience: ['all', 'developer'],
    tags: ['api', 'rest', 'reference'],
    lastUpdated: today,
    body: createPortableTextBlocks([
      'The NXGEN REST API provides comprehensive access to all platform features. All endpoints use standard HTTP methods and return JSON responses.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Base URL', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'https://api.nxgen.io/api/v1', language: 'text', filename: 'Base URL' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Available Endpoints', marks: [] }], markDefs: [] },
      'The API is organized into resource categories: Authentication (/auth), Stations (/stations), Devices (/devices), Alerts (/alerts), Users (/users), Organizations (/organizations), Integrations (/integrations), Data (/data), and Webhooks (/webhooks).',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Request/Response Format', marks: [] }], markDefs: [] },
      'All requests and responses use JSON format. Include Content-Type: application/json for POST/PUT requests.',
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Success Response', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: JSON.stringify({ success: true, data: { id: 'sta_123456', name: 'Tower Site Alpha', status: 'active' }, meta: { requestId: 'req_abc123', timestamp: '2024-01-15T10:30:00Z' }}, null, 2), language: 'json', filename: 'Success Response' },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Error Response', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: JSON.stringify({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request parameters', details: [{ field: 'name', message: 'Name is required' }] }}, null, 2), language: 'json', filename: 'Error Response' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'HTTP Status Codes', marks: [] }], markDefs: [] },
      'Standard HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Rate Limited, 500 Server Error, 503 Unavailable.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Pagination', marks: [] }], markDefs: [] },
      'List endpoints support pagination using page and limit query parameters. Responses include pagination metadata with total count and navigation flags.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Filtering & Sorting', marks: [] }], markDefs: [] },
      'Most list endpoints support filtering and sorting via query parameters. Use status, type, search, sort, and order parameters.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Error Codes Reference', marks: [] }], markDefs: [] },
      'Common error codes: INVALID_CREDENTIALS (401), TOKEN_EXPIRED (401), INSUFFICIENT_PERMISSIONS (403), RESOURCE_NOT_FOUND (404), VALIDATION_ERROR (422), RATE_LIMIT_EXCEEDED (429), DUPLICATE_RESOURCE (409), SERVICE_UNAVAILABLE (503).'
    ])
  },
  {
    _id: 'doc-api-graphql',
    _type: 'doc',
    title: 'GraphQL API',
    slug: { _type: 'slug', current: 'api-graphql' },
    description: 'NXGEN GraphQL API documentation - schema overview, queries, mutations, subscriptions, and best practices.',
    sidebarCategory: { _type: 'reference', _ref: 'sidebar-cat-api-graphql' },
    sidebarPosition: 1,
    status: 'published',
    targetAudience: ['all', 'developer'],
    tags: ['api', 'graphql', 'reference'],
    lastUpdated: today,
    body: createPortableTextBlocks([
      'The NXGEN GraphQL API provides a flexible, efficient way to query and mutate your monitoring data. Request exactly the data you need with a single endpoint.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Endpoint', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'https://api.nxgen.io/graphql', language: 'text', filename: 'GraphQL Endpoint' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Authentication', marks: [] }], markDefs: [] },
      'Include your bearer token in the Authorization header for all GraphQL requests.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Schema Overview', marks: [] }], markDefs: [] },
      'The GraphQL schema includes types: Station, Device, Alert, User, Organization, Region, Cluster, and DataPoint.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Queries', marks: [] }], markDefs: [] },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Query Stations', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'query GetStations($filter: StationFilter, $page: PaginationInput) {\n  stations(filter: $filter, page: $page) {\n    id\n    name\n    status\n    healthScore\n    devices { id name type }\n  }\n}', language: 'graphql', filename: 'Stations Query' },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Query Devices with Data', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'query GetDeviceData($deviceId: ID!, $range: DateRangeInput) {\n  device(id: $deviceId) {\n    id\n    name\n    type\n    data(range: $range) { timestamp value metric unit }\n  }\n}', language: 'graphql', filename: 'Device Data Query' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Mutations', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'mutation CreateStation($input: CreateStationInput!) {\n  createStation(input: $input) { id name code status }\n}', language: 'graphql', filename: 'Create Station' },
      { _type: 'codeBlock', code: 'mutation AcknowledgeAlert($alertId: ID!, $notes: String) {\n  acknowledgeAlert(alertId: $alertId, notes: $notes) {\n    id\n    acknowledgedAt\n    acknowledgedBy { id name }\n  }\n}', language: 'graphql', filename: 'Acknowledge Alert' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Subscriptions', marks: [] }], markDefs: [] },
      'Subscribe to real-time updates via WebSocket connection.',
      { _type: 'codeBlock', code: 'subscription OnAlertCreated($filter: AlertFilter) {\n  alertCreated(filter: $filter) {\n    id\n    severity\n    message\n    station { id name }\n    createdAt\n  }\n}', language: 'graphql', filename: 'Alert Subscription' }
    ])
  },
  {
    _id: 'doc-api-webhooks',
    _type: 'doc',
    title: 'Webhooks',
    slug: { _type: 'slug', current: 'api-webhooks' },
    description: 'Webhook integration guide - event types, payload formats, security, and best practices for real-time notifications.',
    sidebarCategory: { _type: 'reference', _ref: 'sidebar-cat-api-webhooks' },
    sidebarPosition: 1,
    status: 'published',
    targetAudience: ['all', 'developer'],
    tags: ['api', 'webhooks', 'integration'],
    lastUpdated: today,
    body: createPortableTextBlocks([
      'Webhooks allow you to receive real-time notifications when events occur in your NXGEN environment. Configure endpoints to receive push notifications for alerts, device status changes, and other critical events.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Event Types', marks: [] }], markDefs: [] },
      'Available webhook event types: alert.created, alert.acknowledged, alert.resolved, station.created, station.updated, station.status_changed, device.created, device.updated, device.offline, device.online, data.threshold_exceeded.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Payload Format', marks: [] }], markDefs: [] },
      'All webhook payloads follow a consistent JSON structure with event type, timestamp, data, and metadata fields.',
      { _type: 'codeBlock', code: JSON.stringify({
        event: 'alert.created',
        timestamp: '2024-01-15T10:30:00Z',
        data: {
          id: 'alt_123456',
          severity: 'critical',
          message: 'Temperature threshold exceeded',
          station: { id: 'sta_123', name: 'Tower Site Alpha' },
          device: { id: 'dev_456', name: 'Temperature Sensor 1' }
        },
        metadata: {
          organizationId: 'org_abc',
          deliveryAttempt: 1
        }
      }, null, 2), language: 'json', filename: 'Webhook Payload' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Security', marks: [] }], markDefs: [] },
      'Each webhook delivery includes an X-NXGEN-Signature header containing a HMAC-SHA256 signature of the payload. Verify this signature using your webhook secret to ensure authenticity.',
      { _type: 'codeBlock', code: 'const crypto = require("crypto");\n\nfunction verifySignature(payload, signature, secret) {\n  const expected = crypto\n    .createHmac("sha256", secret)\n    .update(payload)\n    .digest("hex");\n  return signature === `sha256=${expected}`;\n}', language: 'javascript', filename: 'Signature Verification' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Retry Policy', marks: [] }], markDefs: [] },
      'Failed deliveries are retried with exponential backoff: 1m, 5m, 15m, 1h, 6h, 24h. After 24 hours, the webhook is marked as failed.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Best Practices', marks: [] }], markDefs: [] },
      'Return 200 OK quickly, process asynchronously. Verify signatures, handle duplicates with idempotency keys, implement retry logic for your endpoint failures, and monitor delivery logs.'
    ])
  },
  {
    _id: 'doc-api-sdks',
    _type: 'doc',
    title: 'SDKs & Libraries',
    slug: { _type: 'slug', current: 'api-sdks' },
    description: 'Official SDKs and client libraries for JavaScript, Python, and mobile platforms.',
    sidebarCategory: { _type: 'reference', _ref: 'sidebar-cat-api-sdks' },
    sidebarPosition: 1,
    status: 'published',
    targetAudience: ['all', 'developer'],
    tags: ['api', 'sdk', 'libraries'],
    lastUpdated: today,
    body: createPortableTextBlocks([
      'NXGEN provides official SDKs for popular programming languages, making it easy to integrate with your applications.',
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'JavaScript/TypeScript SDK', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'npm install @nxgen/sdk', language: 'bash', filename: 'Install' },
      { _type: 'codeBlock', code: "import { NxgenClient } from '@nxgen/sdk';\n\nconst client = new NxgenClient({\n  apiKey: process.env.NXGEN_API_KEY,\n  apiSecret: process.env.NXGEN_API_SECRET\n});\n\n// List stations\nconst stations = await client.stations.list({ status: 'active' });\n\n// Get device data\nconst device = await client.devices.get('dev_123');\nconst data = await device.getData({ range: '24h' });\n\n// Create alert\nawait client.alerts.create({\n  stationId: 'sta_123',\n  severity: 'warning',\n  message: 'Manual alert created'\n});", language: 'javascript', filename: 'JavaScript Example' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Python SDK', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: 'pip install nxgen-sdk', language: 'bash', filename: 'Install' },
      { _type: 'codeBlock', code: "from nxgen import NxgenClient\n\nclient = NxgenClient(\n    api_key=os.environ['NXGEN_API_KEY'],\n    api_secret=os.environ['NXGEN_API_SECRET']\n)\n\n# List stations\nstations = client.stations.list(status='active')\n\n# Get device data\ndevice = client.devices.get('dev_123')\ndata = device.get_data(range='24h')\n\n# Acknowledge alert\nclient.alerts.acknowledge('alt_456', notes='Investigated and resolved')", language: 'python', filename: 'Python Example' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Mobile SDKs', marks: [] }], markDefs: [] },
      'Mobile SDKs are available for iOS (Swift) and Android (Kotlin). The mobile SDKs provide optimized features for mobile applications including push notifications, offline support, and location-based features.',
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'iOS (Swift)', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: "// Package.swift\ndependencies: [\n    .package(url: \"https://github.com/nxgen/swift-sdk\", from: \"1.0.0\")\n]", language: 'swift', filename: 'iOS Install' },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Android (Kotlin)', marks: [] }], markDefs: [] },
      { _type: 'codeBlock', code: "// build.gradle.kts\nimplementation(\"io.nxgen:sdk-android:1.0.0\")", language: 'kotlin', filename: 'Android Install' },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Other Languages', marks: [] }], markDefs: [] },
      'SDKs are also available for Go, Java, C#/.NET, PHP, and Ruby. See the GitHub repository for installation instructions and examples.'
    ])
  }
];

async function seedApiDocs() {
  console.log('Seeding API documentation to Sanity...\n');
  
  let created = 0;
  let updated = 0;
  
  try {
    console.log('Creating sidebar categories...');
    for (const category of sidebarCategories) {
      const existing = await client.fetch(`*[_id == $id][0]`, { id: category._id });
      if (existing) {
        await client.createOrReplace(category);
        console.log(`  Updated: ${category.title}`);
        updated++;
      } else {
        await client.createIfNotExists(category);
        console.log(`  Created: ${category.title}`);
        created++;
      }
    }
    
    console.log('\nCreating API documentation pages...');
    for (const doc of apiDocs) {
      const existing = await client.fetch(`*[_id == $id][0]`, { id: doc._id });
      if (existing) {
        await client.createOrReplace(doc);
        console.log(`  Updated: ${doc.title}`);
        updated++;
      } else {
        await client.createIfNotExists(doc);
        console.log(`  Created: ${doc.title}`);
        created++;
      }
    }
    
    console.log('\n--- Summary ---');
    console.log(`Created: ${created} documents`);
    console.log(`Updated: ${updated} documents`);
    console.log('\nAPI Documentation sections created:');
    console.log('  - API Overview (api-overview)');
    console.log('  - REST API Reference (api-rest)');
    console.log('  - GraphQL API (api-graphql)');
    console.log('  - Webhooks (api-webhooks)');
    console.log('  - SDKs & Libraries (api-sdks)');
    
  } catch (err) {
    console.error('Error seeding API docs:', err.message);
    process.exit(1);
  }
}

seedApiDocs().catch(console.error);
