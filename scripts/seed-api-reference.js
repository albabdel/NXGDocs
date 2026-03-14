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

const apiReferences = [
  // AUTHENTICATION
  {
    _id: 'api-ref-auth-api-key',
    _type: 'apiReference',
    name: 'API Key Authentication',
    slug: { _type: 'slug', current: 'api-key-authentication' },
    category: 'auth',
    description: 'Authenticate API requests using API keys. API keys are scoped to specific organizations and can have restricted permissions.',
    endpoint: '/api/v1/auth/api-key',
    method: 'POST',
    authentication: ['none'],
    permissions: [],
    deprecated: false,
    requestSchema: {
      headers: [{ name: 'Content-Type', required: true, description: 'Must be application/json', example: 'application/json' }],
      pathParams: [],
      queryParams: [],
      bodySchema: JSON.stringify({ type: 'object', properties: { apiKey: { type: 'string' }, apiSecret: { type: 'string' } }, required: ['apiKey', 'apiSecret'] }, null, 2),
      bodyDescription: 'Provide your API key and secret to obtain an access token.'
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', tokenType: 'Bearer', expiresIn: 3600, scope: 'read write' } }, null, 2),
      successDescription: 'Returns an access token for subsequent API calls.',
      errorResponses: [
        { statusCode: 401, error: 'Unauthorized', description: 'Invalid API key or secret', example: JSON.stringify({ error: 'invalid_credentials', message: 'Invalid API key or secret' }, null, 2) },
        { statusCode: 403, error: 'Forbidden', description: 'API key disabled', example: JSON.stringify({ error: 'api_key_disabled', message: 'API key has been disabled' }, null, 2) }
      ]
    },
    rateLimit: { limit: 10, window: '1m', headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'] },
    codeExamples: [
      { language: 'curl', code: "curl -X POST 'https://api.nxgen.io/api/v1/auth/api-key' -H 'Content-Type: application/json' -d '{\"apiKey\":\"nxg_ak_xxx\",\"apiSecret\":\"nxg_as_xxx\"}'", description: 'Authenticate with API key' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/auth/api-key', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: process.env.NXGEN_API_KEY, apiSecret: process.env.NXGEN_API_SECRET }) }); const { data } = await res.json();", description: 'JavaScript example' },
      { language: 'python', code: "import requests\nres = requests.post('https://api.nxgen.io/api/v1/auth/api-key', json={'apiKey': os.environ['NXGEN_API_KEY'], 'apiSecret': os.environ['NXGEN_API_SECRET']})\ndata = res.json()", description: 'Python example' }
    ],
    tags: ['authentication', 'api-key', 'security'],
    body: []
  },
  {
    _id: 'api-ref-auth-oauth',
    _type: 'apiReference',
    name: 'OAuth 2.0 Authorization',
    slug: { _type: 'slug', current: 'oauth-authorization' },
    category: 'auth',
    description: 'OAuth 2.0 authorization flow for third-party applications.',
    endpoint: '/api/v1/auth/oauth/authorize',
    method: 'GET',
    authentication: ['none'],
    permissions: [],
    deprecated: false,
    requestSchema: {
      headers: [],
      pathParams: [],
      queryParams: [
        { name: 'client_id', type: 'string', required: true, description: 'OAuth client ID', example: 'nxg_client_xxxxx' },
        { name: 'redirect_uri', type: 'string', required: true, description: 'Redirect URL', example: 'https://app.example.com/callback' },
        { name: 'response_type', type: 'string', required: true, default: 'code', description: 'Response type', example: 'code' },
        { name: 'scope', type: 'string', required: false, default: 'read', description: 'Permissions', example: 'read write' },
        { name: 'state', type: 'string', required: false, description: 'CSRF token', example: 'random_state' }
      ],
      bodySchema: null,
      bodyDescription: null
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { authorizationUrl: 'https://auth.nxgen.io/authorize?client_id=...' } }, null, 2),
      successDescription: 'Redirects to authorization page.',
      errorResponses: [
        { statusCode: 400, error: 'Bad Request', description: 'Invalid parameters', example: JSON.stringify({ error: 'invalid_request', message: 'Missing client_id' }, null, 2) }
      ]
    },
    rateLimit: { limit: 100, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl 'https://api.nxgen.io/api/v1/auth/oauth/authorize?client_id=nxg_client_xxx&redirect_uri=https://app.example.com/callback&response_type=code'", description: 'Initiate OAuth flow' },
      { language: 'javascript', code: "const url = new URL('https://api.nxgen.io/api/v1/auth/oauth/authorize');\nurl.searchParams.set('client_id', process.env.NXGEN_CLIENT_ID);\nurl.searchParams.set('redirect_uri', 'https://app.example.com/callback');\nwindow.location.href = url.toString();", description: 'JavaScript OAuth redirect' },
      { language: 'python', code: "from urllib.parse import urlencode\nparams = {'client_id': os.environ['NXGEN_CLIENT_ID'], 'redirect_uri': 'https://app.example.com/callback', 'response_type': 'code'}\nauth_url = f\"https://api.nxgen.io/api/v1/auth/oauth/authorize?{urlencode(params)}\"", description: 'Python OAuth URL' }
    ],
    tags: ['authentication', 'oauth2', 'security'],
    body: []
  },
  {
    _id: 'api-ref-auth-jwt',
    _type: 'apiReference',
    name: 'JWT Token Verification',
    slug: { _type: 'slug', current: 'jwt-token-verification' },
    category: 'auth',
    description: 'Verify and decode a JWT token.',
    endpoint: '/api/v1/auth/verify',
    method: 'POST',
    authentication: ['bearer'],
    permissions: [],
    deprecated: false,
    requestSchema: {
      headers: [
        { name: 'Authorization', required: true, description: 'Bearer token', example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        { name: 'Content-Type', required: true, description: 'application/json', example: 'application/json' }
      ],
      pathParams: [],
      queryParams: [],
      bodySchema: null,
      bodyDescription: null
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { valid: true, payload: { sub: 'usr_123456', org: 'org_abc123', role: 'admin', permissions: ['read', 'write', 'admin'] } } }, null, 2),
      successDescription: 'Returns token validation status.',
      errorResponses: [{ statusCode: 401, error: 'Unauthorized', description: 'Token invalid', example: JSON.stringify({ error: 'invalid_token', message: 'Token has expired' }, null, 2) }]
    },
    rateLimit: { limit: 1000, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl -X POST 'https://api.nxgen.io/api/v1/auth/verify' -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json'", description: 'Verify JWT token' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/auth/verify', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); const { data } = await res.json();", description: 'JavaScript verify' },
      { language: 'python', code: "import requests\nres = requests.post('https://api.nxgen.io/api/v1/auth/verify', headers={'Authorization': f'Bearer {token}'})\ndata = res.json()", description: 'Python verify' }
    ],
    tags: ['authentication', 'jwt', 'security'],
    body: []
  },

  // STATIONS API
  {
    _id: 'api-ref-stations-list',
    _type: 'apiReference',
    name: 'List All Stations',
    slug: { _type: 'slug', current: 'list-stations' },
    category: 'stations',
    description: 'Retrieve a paginated list of all monitoring stations.',
    endpoint: '/api/v1/stations',
    method: 'GET',
    authentication: ['apikey', 'bearer', 'oauth2'],
    permissions: ['read'],
    deprecated: false,
    requestSchema: {
      headers: [{ name: 'Authorization', required: true, description: 'Bearer token or API key', example: 'Bearer <token>' }],
      pathParams: [],
      queryParams: [
        { name: 'page', type: 'integer', required: false, default: '1', description: 'Page number', example: '1' },
        { name: 'limit', type: 'integer', required: false, default: '20', description: 'Items per page', example: '50' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'active' },
        { name: 'type', type: 'string', required: false, description: 'Filter by type', example: 'tower' },
        { name: 'search', type: 'string', required: false, description: 'Search by name', example: 'site-001' }
      ],
      bodySchema: null,
      bodyDescription: null
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: [{ id: 'sta_123456', name: 'Tower Site Alpha', code: 'TSA-001', type: 'tower', status: 'active', healthScore: 98.5 }], pagination: { page: 1, limit: 20, total: 156 } }, null, 2),
      successDescription: 'Returns paginated list of stations.',
      errorResponses: [{ statusCode: 401, error: 'Unauthorized', description: 'Authentication required', example: JSON.stringify({ error: 'unauthorized' }, null, 2) }]
    },
    rateLimit: { limit: 1000, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl 'https://api.nxgen.io/api/v1/stations?limit=50&status=active' -H 'Authorization: Bearer <token>'", description: 'List stations' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/stations?limit=50', { headers: { 'Authorization': `Bearer ${token}` } }); const { data } = await res.json();", description: 'JavaScript list' },
      { language: 'python', code: "import requests\nres = requests.get('https://api.nxgen.io/api/v1/stations', params={'limit': 50}, headers={'Authorization': f'Bearer {token}'})\ndata = res.json()", description: 'Python list' }
    ],
    tags: ['stations', 'monitoring', 'list'],
    body: []
  },
  {
    _id: 'api-ref-stations-get',
    _type: 'apiReference',
    name: 'Get Station Details',
    slug: { _type: 'slug', current: 'get-station' },
    category: 'stations',
    description: 'Retrieve detailed station information.',
    endpoint: '/api/v1/stations/{id}',
    method: 'GET',
    authentication: ['apikey', 'bearer', 'oauth2'],
    permissions: ['read'],
    deprecated: false,
    requestSchema: {
      headers: [{ name: 'Authorization', required: true, description: 'Bearer token', example: 'Bearer <token>' }],
      pathParams: [{ name: 'id', type: 'string', required: true, description: 'Station ID', example: 'sta_123456' }],
      queryParams: [{ name: 'include', type: 'string', required: false, description: 'Include related data', example: 'devices,alerts' }],
      bodySchema: null,
      bodyDescription: null
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { id: 'sta_123456', name: 'Tower Site Alpha', type: 'tower', status: 'active', deviceCount: 24, healthScore: 98.5 } }, null, 2),
      successDescription: 'Returns station details.',
      errorResponses: [{ statusCode: 404, error: 'Not Found', description: 'Station not found', example: JSON.stringify({ error: 'not_found' }, null, 2) }]
    },
    rateLimit: { limit: 1000, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl 'https://api.nxgen.io/api/v1/stations/sta_123456' -H 'Authorization: Bearer <token>'", description: 'Get station' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/stations/sta_123456', { headers: { 'Authorization': `Bearer ${token}` } }); const { data } = await res.json();", description: 'JavaScript get' },
      { language: 'python', code: "import requests\nres = requests.get('https://api.nxgen.io/api/v1/stations/sta_123456', headers={'Authorization': f'Bearer {token}'})\ndata = res.json()['data']", description: 'Python get' }
    ],
    tags: ['stations', 'monitoring'],
    body: []
  },
  {
    _id: 'api-ref-stations-create',
    _type: 'apiReference',
    name: 'Create Station',
    slug: { _type: 'slug', current: 'create-station' },
    category: 'stations',
    description: 'Create a new monitoring station.',
    endpoint: '/api/v1/stations',
    method: 'POST',
    authentication: ['apikey', 'bearer', 'oauth2'],
    permissions: ['write'],
    deprecated: false,
    requestSchema: {
      headers: [
        { name: 'Authorization', required: true, description: 'Bearer token', example: 'Bearer <token>' },
        { name: 'Content-Type', required: true, description: 'application/json', example: 'application/json' }
      ],
      pathParams: [],
      queryParams: [],
      bodySchema: JSON.stringify({ type: 'object', properties: { name: { type: 'string' }, code: { type: 'string' }, type: { type: 'string', enum: ['tower', 'datacenter', 'industrial'] }, regionId: { type: 'string' }, location: { type: 'object' } }, required: ['name', 'code', 'type', 'regionId', 'location'] }, null, 2),
      bodyDescription: 'Station details.'
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { id: 'sta_789012', name: 'New Site', status: 'pending' } }, null, 2),
      successDescription: 'Returns created station.',
      errorResponses: [{ statusCode: 400, error: 'Bad Request', description: 'Validation error', example: JSON.stringify({ error: 'validation_error' }, null, 2) }]
    },
    rateLimit: { limit: 100, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl -X POST 'https://api.nxgen.io/api/v1/stations' -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{\"name\":\"New Site\",\"code\":\"NS-001\",\"type\":\"tower\",\"regionId\":\"reg_123\"}'", description: 'Create station' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/stations', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'New Site', code: 'NS-001', type: 'tower', regionId: 'reg_123' }) });", description: 'JavaScript create' },
      { language: 'python', code: "import requests\nres = requests.post('https://api.nxgen.io/api/v1/stations', headers={'Authorization': f'Bearer {token}'}, json={'name': 'New Site', 'code': 'NS-001', 'type': 'tower', 'regionId': 'reg_123'})", description: 'Python create' }
    ],
    tags: ['stations', 'create', 'admin'],
    body: []
  },
  {
    _id: 'api-ref-stations-update',
    _type: 'apiReference',
    name: 'Update Station',
    slug: { _type: 'slug', current: 'update-station' },
    category: 'stations',
    description: 'Update an existing station.',
    endpoint: '/api/v1/stations/{id}',
    method: 'PUT',
    authentication: ['apikey', 'bearer', 'oauth2'],
    permissions: ['write'],
    deprecated: false,
    requestSchema: {
      headers: [
        { name: 'Authorization', required: true, description: 'Bearer token', example: 'Bearer <token>' },
        { name: 'Content-Type', required: true, description: 'application/json', example: 'application/json' }
      ],
      pathParams: [{ name: 'id', type: 'string', required: true, description: 'Station ID', example: 'sta_123456' }],
      queryParams: [],
      bodySchema: JSON.stringify({ type: 'object', properties: { name: { type: 'string' }, status: { type: 'string' } } }, null, 2),
      bodyDescription: 'Fields to update.'
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { id: 'sta_123456', name: 'Updated Name' } }, null, 2),
      successDescription: 'Returns updated station.',
      errorResponses: [{ statusCode: 404, error: 'Not Found', description: 'Station not found', example: JSON.stringify({ error: 'not_found' }, null, 2) }]
    },
    rateLimit: { limit: 100, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl -X PUT 'https://api.nxgen.io/api/v1/stations/sta_123456' -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{\"name\":\"Updated\"}'", description: 'Update station' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/stations/sta_123456', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Updated' }) });", description: 'JavaScript update' },
      { language: 'python', code: "import requests\nres = requests.put('https://api.nxgen.io/api/v1/stations/sta_123456', headers={'Authorization': f'Bearer {token}'}, json={'name': 'Updated'})", description: 'Python update' }
    ],
    tags: ['stations', 'update'],
    body: []
  },
  {
    _id: 'api-ref-stations-delete',
    _type: 'apiReference',
    name: 'Delete Station',
    slug: { _type: 'slug', current: 'delete-station' },
    category: 'stations',
    description: 'Delete a monitoring station.',
    endpoint: '/api/v1/stations/{id}',
    method: 'DELETE',
    authentication: ['apikey', 'bearer', 'oauth2'],
    permissions: ['admin'],
    deprecated: false,
    requestSchema: {
      headers: [{ name: 'Authorization', required: true, description: 'Bearer token', example: 'Bearer <token>' }],
      pathParams: [{ name: 'id', type: 'string', required: true, description: 'Station ID', example: 'sta_123456' }],
      queryParams: [{ name: 'archive', type: 'boolean', required: false, default: 'true', description: 'Archive data', example: 'true' }],
      bodySchema: null,
      bodyDescription: null
    },
    responseSchema: {
      successResponse: JSON.stringify({ success: true, data: { id: 'sta_123456', deleted: true } }, null, 2),
      successDescription: 'Returns deletion confirmation.',
      errorResponses: [{ statusCode: 403, error: 'Forbidden', description: 'Admin required', example: JSON.stringify({ error: 'forbidden' }, null, 2) }]
    },
    rateLimit: { limit: 50, window: '1m', headers: ['X-RateLimit-Limit'] },
    codeExamples: [
      { language: 'curl', code: "curl -X DELETE 'https://api.nxgen.io/api/v1/stations/sta_123456' -H 'Authorization: Bearer <token>'", description: 'Delete station' },
      { language: 'javascript', code: "const res = await fetch('https://api.nxgen.io/api/v1/stations/sta_123456', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });", description: 'JavaScript delete' },
      { language: 'python', code: "import requests\nres = requests.delete('https://api.nxgen.io/api/v1/stations/sta_123456', headers={'Authorization': f'Bearer {token}'})", description: 'Python delete' }
    ],
    tags: ['stations', 'delete', 'admin'],
    body: []
  }
];
