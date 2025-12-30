# GCXONE API Reference Documentation

Complete API reference for device management, integration, and automation.

## Authentication

All API requests require authentication via JWT token.

### Get Access Token

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="curl" label="cURL">
    ```bash
    curl -X POST https://api.nxgen.cloud/v1/auth/token \
      -H "Content-Type: application/json" \
      -d '{
        "username": "your-email@company.com",
        "password": "your-password"
      }'
    ```
  </TabItem>

  <TabItem value="javascript" label="JavaScript">
    ```javascript
    const response = await fetch('https://api.nxgen.cloud/v1/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'your-email@company.com',
        password: 'your-password'
      })
    });
    const { token } = await response.json();
    ```
  </TabItem>

  <TabItem value="python" label="Python">
    ```python
    import requests

    response = requests.post(
        'https://api.nxgen.cloud/v1/auth/token',
        json={
            'username': 'your-email@company.com',
            'password': 'your-password'
        }
    )
    token = response.json()['token']
    ```
  </TabItem>
</Tabs>

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshToken": "refresh_token_here"
}
```

## Base URL

```
https://api.nxgen.cloud/v1
```

## Rate Limiting

- **Rate Limit:** 1000 requests per hour per API key
- **Burst Limit:** 100 requests per minute
- **Headers:** `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Device with ID 'device-123' not found",
    "details": {
      "deviceId": "device-123",
      "timestamp": "2025-12-28T10:30:00Z"
    }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Rate Limited
- `500` - Internal Server Error

---

## Devices API

### List Devices

**GET** `/devices`

Retrieve a list of all devices in your account.

**Query Parameters:**
- `customerId` (string, optional) - Filter by customer ID
- `siteId` (string, optional) - Filter by site ID
- `manufacturer` (string, optional) - Filter by manufacturer
- `status` (string, optional) - Filter by status: `online`, `offline`, `error`
- `limit` (integer, optional) - Number of results (default: 50, max: 200)
- `offset` (integer, optional) - Pagination offset (default: 0)

**Example Request:**
```bash
curl -X GET "https://api.nxgen.cloud/v1/devices?manufacturer=hikvision&status=online" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "devices": [
    {
      "id": "device-abc123",
      "manufacturer": "Hikvision",
      "model": "DS-2CD2347G2-LU",
      "serverUnitId": "HIK-CAM-001",
      "ipAddress": "192.168.1.100",
      "port": 80,
      "status": "online",
      "lastSeen": "2025-12-28T10:25:00Z",
      "firmwareVersion": "v5.7.15",
      "customerId": "customer-123",
      "siteId": "site-456",
      "capabilities": {
        "liveStreaming": true,
        "playback": true,
        "ptzControl": true,
        "twoWayAudio": false,
        "analytics": true
      },
      "createdAt": "2025-12-20T14:30:00Z",
      "updatedAt": "2025-12-28T10:25:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get Device Details

**GET** `/devices/{deviceId}`

Retrieve detailed information about a specific device.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Example Request:**
```bash
curl -X GET "https://api.nxgen.cloud/v1/devices/device-abc123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "device-abc123",
  "manufacturer": "Hikvision",
  "model": "DS-2CD2347G2-LU",
  "serverUnitId": "HIK-CAM-001",
  "ipAddress": "192.168.1.100",
  "port": 80,
  "credentials": {
    "username": "NXG"
  },
  "status": "online",
  "lastSeen": "2025-12-28T10:25:00Z",
  "firmwareVersion": "v5.7.15",
  "customerId": "customer-123",
  "siteId": "site-456",
  "location": {
    "name": "Front Entrance",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "capabilities": {
    "liveStreaming": true,
    "playback": true,
    "ptzControl": true,
    "twoWayAudio": false,
    "analytics": true,
    "nightVision": true,
    "weatherproof": "IP67"
  },
  "configuration": {
    "timezone": "America/New_York",
    "ntpServer": "time1.nxgen.cloud",
    "recordingEnabled": true,
    "motionDetection": {
      "enabled": true,
      "sensitivity": 50
    },
    "analytics": {
      "lineCrossing": true,
      "intrusion": true,
      "faceDetection": false
    }
  },
  "health": {
    "overall": "healthy",
    "uptime": "99.8%",
    "lastHealthCheck": "2025-12-28T10:20:00Z",
    "issues": []
  },
  "createdAt": "2025-12-20T14:30:00Z",
  "updatedAt": "2025-12-28T10:25:00Z"
}
```

### Create Device

**POST** `/devices`

Add a new device to GCXONE.

**Request Body:**
```json
{
  "manufacturer": "Hikvision",
  "model": "DS-2CD2347G2-LU",
  "serverUnitId": "HIK-CAM-002",
  "ipAddress": "192.168.1.101",
  "port": 80,
  "credentials": {
    "username": "NXG",
    "password": "secure_password"
  },
  "customerId": "customer-123",
  "siteId": "site-456",
  "location": {
    "name": "Rear Exit",
    "coordinates": {
      "latitude": 40.7130,
      "longitude": -74.0062
    }
  },
  "configuration": {
    "timezone": "America/New_York",
    "ntpServer": "time1.nxgen.cloud",
    "recordingEnabled": true
  }
}
```

**Example Request:**
```bash
curl -X POST "https://api.nxgen.cloud/v1/devices" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "manufacturer": "Hikvision",
    "model": "DS-2CD2347G2-LU",
    "serverUnitId": "HIK-CAM-002",
    "ipAddress": "192.168.1.101",
    "port": 80,
    "credentials": {
      "username": "NXG",
      "password": "secure_password"
    },
    "customerId": "customer-123",
    "siteId": "site-456"
  }'
```

**Response (201 Created):**
```json
{
  "id": "device-def456",
  "manufacturer": "Hikvision",
  "model": "DS-2CD2347G2-LU",
  "serverUnitId": "HIK-CAM-002",
  "status": "connecting",
  "message": "Device added successfully. Testing connection...",
  "createdAt": "2025-12-28T10:30:00Z"
}
```

**Errors:**
- `400` - Invalid request body or missing required fields
- `401` - Unauthorized - invalid or missing token
- `403` - Forbidden - insufficient permissions
- `409` - Device already exists with same serverUnitId
- `422` - Device unreachable or invalid credentials

### Update Device

**PUT** `/devices/{deviceId}`

Update device configuration.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Request Body:**
```json
{
  "serverUnitId": "HIK-CAM-001-UPDATED",
  "location": {
    "name": "Main Entrance Camera"
  },
  "configuration": {
    "recordingEnabled": false,
    "motionDetection": {
      "enabled": true,
      "sensitivity": 75
    }
  }
}
```

**Response (200 OK):**
```json
{
  "id": "device-abc123",
  "message": "Device updated successfully",
  "updatedAt": "2025-12-28T10:35:00Z"
}
```

### Delete Device

**DELETE** `/devices/{deviceId}`

Remove a device from GCXONE.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Query Parameters:**
- `force` (boolean, optional) - Force deletion even if device is online

**Example Request:**
```bash
curl -X DELETE "https://api.nxgen.cloud/v1/devices/device-abc123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (204 No Content)**

### Test Device Connection

**POST** `/devices/{deviceId}/test`

Test connectivity and functionality of a device.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Request Body:**
```json
{
  "tests": ["connectivity", "authentication", "streaming", "events"]
}
```

**Response (200 OK):**
```json
{
  "deviceId": "device-abc123",
  "testResults": {
    "connectivity": {
      "status": "passed",
      "responseTime": "45ms",
      "message": "Device is reachable"
    },
    "authentication": {
      "status": "passed",
      "message": "Credentials are valid"
    },
    "streaming": {
      "status": "passed",
      "mainStream": true,
      "subStream": true,
      "message": "Both streams available"
    },
    "events": {
      "status": "warning",
      "message": "Motion events disabled (recommended)"
    }
  },
  "overall": "passed",
  "testedAt": "2025-12-28T10:40:00Z"
}
```

---

## Device Discovery API

### Discover Devices

**POST** `/devices/discover`

Discover devices on the network.

**Request Body:**
```json
{
  "ipRange": "192.168.1.1-192.168.1.254",
  "ports": [80, 443, 8000],
  "protocols": ["ONVIF", "ISAPI"],
  "timeout": 30
}
```

**Response (200 OK):**
```json
{
  "discoveredDevices": [
    {
      "ipAddress": "192.168.1.100",
      "port": 80,
      "manufacturer": "Hikvision",
      "model": "DS-2CD2347G2-LU",
      "firmwareVersion": "v5.7.15",
      "protocol": "ISAPI",
      "capabilities": ["streaming", "ptz", "analytics"],
      "status": "available"
    },
    {
      "ipAddress": "192.168.1.101", 
      "port": 80,
      "manufacturer": "Dahua",
      "model": "IPC-HFW4431R-Z",
      "firmwareVersion": "v2.800.0000000.25.R",
      "protocol": "ONVIF",
      "capabilities": ["streaming", "ptz"],
      "status": "available"
    }
  ],
  "summary": {
    "total": 2,
    "available": 2,
    "inUse": 0,
    "unsupported": 0
  },
  "scanDuration": "28.5s"
}
```

---

## Bulk Operations API

### Bulk Create Devices

**POST** `/devices/bulk`

Add multiple devices at once.

**Request Body:**
```json
{
  "devices": [
    {
      "manufacturer": "Hikvision",
      "model": "DS-2CD2347G2-LU",
      "serverUnitId": "HIK-CAM-003",
      "ipAddress": "192.168.1.102",
      "port": 80,
      "credentials": {
        "username": "NXG",
        "password": "secure_password"
      },
      "customerId": "customer-123",
      "siteId": "site-456"
    },
    {
      "manufacturer": "Hikvision",
      "model": "DS-2CD2347G2-LU", 
      "serverUnitId": "HIK-CAM-004",
      "ipAddress": "192.168.1.103",
      "port": 80,
      "credentials": {
        "username": "NXG",
        "password": "secure_password"
      },
      "customerId": "customer-123",
      "siteId": "site-456"
    }
  ],
  "options": {
    "continueOnError": true,
    "testConnection": true,
    "applyTemplate": "hikvision-default"
  }
}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "serverUnitId": "HIK-CAM-003",
      "status": "success",
      "deviceId": "device-ghi789",
      "message": "Device added successfully"
    },
    {
      "serverUnitId": "HIK-CAM-004",
      "status": "error",
      "error": "Device unreachable at 192.168.1.103",
      "code": "CONNECTION_FAILED"
    }
  ],
  "summary": {
    "total": 2,
    "successful": 1,
    "failed": 1
  },
  "processedAt": "2025-12-28T10:45:00Z"
}
```

### Bulk Update Devices

**PUT** `/devices/bulk`

Update multiple devices with the same configuration.

**Request Body:**
```json
{
  "deviceIds": ["device-abc123", "device-def456", "device-ghi789"],
  "updates": {
    "configuration": {
      "recordingEnabled": true,
      "motionDetection": {
        "enabled": false
      },
      "analytics": {
        "lineCrossing": true,
        "intrusion": true
      }
    }
  }
}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "deviceId": "device-abc123",
      "status": "success",
      "message": "Device updated successfully"
    },
    {
      "deviceId": "device-def456", 
      "status": "success",
      "message": "Device updated successfully"
    },
    {
      "deviceId": "device-ghi789",
      "status": "error",
      "error": "Device is offline",
      "code": "DEVICE_OFFLINE"
    }
  ],
  "summary": {
    "total": 3,
    "successful": 2,
    "failed": 1
  }
}
```

---

## Events API

### Get Device Events

**GET** `/devices/{deviceId}/events`

Retrieve events from a specific device.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Query Parameters:**
- `startTime` (string, optional) - ISO 8601 timestamp
- `endTime` (string, optional) - ISO 8601 timestamp  
- `eventType` (string, optional) - Filter by event type
- `limit` (integer, optional) - Number of results (default: 50)
- `offset` (integer, optional) - Pagination offset

**Example Request:**
```bash
curl -X GET "https://api.nxgen.cloud/v1/devices/device-abc123/events?startTime=2025-12-28T00:00:00Z&eventType=motion" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "id": "event-123",
      "deviceId": "device-abc123",
      "type": "motion",
      "subType": "lineCrossing",
      "timestamp": "2025-12-28T10:15:30Z",
      "confidence": 0.85,
      "metadata": {
        "direction": "A->B",
        "objectType": "human",
        "zone": "entrance"
      },
      "media": {
        "thumbnail": "https://media.nxgen.cloud/thumbnails/event-123.jpg",
        "video": "https://media.nxgen.cloud/clips/event-123.mp4",
        "duration": 10
      }
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

## Streaming API

### Get Stream URLs

**GET** `/devices/{deviceId}/streams`

Get streaming URLs for a device.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Query Parameters:**
- `streamType` (string, optional) - `main`, `sub`, or `both` (default: both)
- `protocol` (string, optional) - `rtsp`, `hls`, `webrtc` (default: rtsp)

**Response (200 OK):**
```json
{
  "deviceId": "device-abc123",
  "streams": {
    "main": {
      "rtsp": "rtsp://192.168.1.100:554/Streaming/Channels/101",
      "hls": "https://stream.nxgen.cloud/device-abc123/main/playlist.m3u8",
      "webrtc": "wss://stream.nxgen.cloud/device-abc123/main/webrtc"
    },
    "sub": {
      "rtsp": "rtsp://192.168.1.100:554/Streaming/Channels/102", 
      "hls": "https://stream.nxgen.cloud/device-abc123/sub/playlist.m3u8",
      "webrtc": "wss://stream.nxgen.cloud/device-abc123/sub/webrtc"
    }
  },
  "authentication": {
    "required": true,
    "method": "digest",
    "token": "stream_token_here"
  }
}
```

---

## PTZ Control API

### PTZ Commands

**POST** `/devices/{deviceId}/ptz`

Send PTZ commands to a device.

**Path Parameters:**
- `deviceId` (string, required) - Unique device identifier

**Request Body:**
```json
{
  "command": "move",
  "direction": "up",
  "speed": 5,
  "duration": 2000
}
```

**Available Commands:**
- `move` - Pan/tilt movement
- `zoom` - Zoom in/out
- `preset` - Go to preset position
- `tour` - Start/stop tour
- `stop` - Stop all movement

**Response (200 OK):**
```json
{
  "deviceId": "device-abc123",
  "command": "move",
  "status": "executed",
  "message": "PTZ command executed successfully",
  "executedAt": "2025-12-28T10:50:00Z"
}
```

### Get PTZ Presets

**GET** `/devices/{deviceId}/ptz/presets`

Get available PTZ presets for a device.

**Response (200 OK):**
```json
{
  "deviceId": "device-abc123",
  "presets": [
    {
      "id": 1,
      "name": "Entrance",
      "description": "Main entrance view"
    },
    {
      "id": 2,
      "name": "Parking Lot",
      "description": "Parking area overview"
    }
  ]
}
```

---

## Configuration Templates API

### Get Templates

**GET** `/templates`

Retrieve available configuration templates.

**Query Parameters:**
- `manufacturer` (string, optional) - Filter by manufacturer
- `deviceType` (string, optional) - Filter by device type

**Response (200 OK):**
```json
{
  "templates": [
    {
      "id": "hikvision-default",
      "name": "Hikvision Default Configuration",
      "manufacturer": "Hikvision",
      "deviceType": "camera",
      "description": "Standard configuration for Hikvision IP cameras",
      "configuration": {
        "timezone": "America/New_York",
        "ntpServer": "time1.nxgen.cloud",
        "recordingEnabled": true,
        "motionDetection": {
          "enabled": false
        },
        "analytics": {
          "lineCrossing": true,
          "intrusion": true
        }
      },
      "createdAt": "2025-12-01T00:00:00Z"
    }
  ]
}
```

### Apply Template

**POST** `/devices/{deviceId}/template`

Apply a configuration template to a device.

**Request Body:**
```json
{
  "templateId": "hikvision-default",
  "overrides": {
    "timezone": "America/Los_Angeles"
  }
}
```

**Response (200 OK):**
```json
{
  "deviceId": "device-abc123",
  "templateId": "hikvision-default",
  "status": "applied",
  "message": "Template applied successfully",
  "appliedAt": "2025-12-28T10:55:00Z"
}
```

---

## Webhooks API

### Create Webhook

**POST** `/webhooks`

Create a webhook for device events.

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["device.online", "device.offline", "device.event"],
  "filters": {
    "deviceIds": ["device-abc123"],
    "eventTypes": ["motion", "lineCrossing"]
  },
  "secret": "webhook_secret_key",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "id": "webhook-123",
  "url": "https://your-server.com/webhook",
  "events": ["device.online", "device.offline", "device.event"],
  "secret": "webhook_secret_key",
  "active": true,
  "createdAt": "2025-12-28T11:00:00Z"
}
```

### Webhook Payload Example

```json
{
  "id": "event-456",
  "type": "device.event",
  "timestamp": "2025-12-28T11:05:00Z",
  "data": {
    "deviceId": "device-abc123",
    "eventType": "motion",
    "eventSubType": "lineCrossing",
    "confidence": 0.92,
    "metadata": {
      "direction": "A->B",
      "objectType": "human"
    }
  },
  "signature": "sha256=signature_here"
}
```

---

## SDK Examples

### JavaScript SDK

```javascript
import { GCXONEClient } from '@nxgen/gcxone-sdk';

const client = new GCXONEClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.nxgen.cloud/v1'
});

// Add a device
const device = await client.devices.create({
  manufacturer: 'Hikvision',
  model: 'DS-2CD2347G2-LU',
  ipAddress: '192.168.1.100',
  credentials: {
    username: 'NXG',
    password: 'secure_password'
  }
});

// Get device events
const events = await client.devices.getEvents(device.id, {
  startTime: '2025-12-28T00:00:00Z',
  eventType: 'motion'
});

// Control PTZ
await client.devices.ptz(device.id, {
  command: 'preset',
  presetId: 1
});
```

### Python SDK

```python
from gcxone import GCXONEClient

client = GCXONEClient(
    api_key='your-api-key',
    base_url='https://api.nxgen.cloud/v1'
)

# Add a device
device = client.devices.create(
    manufacturer='Hikvision',
    model='DS-2CD2347G2-LU',
    ip_address='192.168.1.100',
    credentials={
        'username': 'NXG',
        'password': 'secure_password'
    }
)

# Get device events
events = client.devices.get_events(
    device.id,
    start_time='2025-12-28T00:00:00Z',
    event_type='motion'
)

# Control PTZ
client.devices.ptz(device.id, command='preset', preset_id=1)
```

---

## Rate Limits & Best Practices

### Rate Limits
- **Standard:** 1000 requests/hour
- **Burst:** 100 requests/minute
- **Streaming:** No limit on stream access
- **Webhooks:** 10,000 events/hour

### Best Practices
1. **Use bulk operations** for multiple devices
2. **Implement exponential backoff** for retries
3. **Cache device information** to reduce API calls
4. **Use webhooks** instead of polling for events
5. **Validate requests** before sending to API
6. **Handle errors gracefully** with proper error codes

### Error Handling
```javascript
try {
  const device = await client.devices.create(deviceData);
} catch (error) {
  if (error.status === 422) {
    console.log('Device unreachable:', error.message);
  } else if (error.status === 409) {
    console.log('Device already exists');
  } else {
    console.log('Unexpected error:', error);
  }
}
```