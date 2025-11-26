---
title: API Reference
description: Documentation for the GCXONE REST API.
tags: [api, developer, integration]
---

# API Reference

The GCXONE API allows developers to integrate third-party applications with the platform. It is a RESTful API that uses JSON for request and response bodies.

## Base URL

All API requests should be made to:

```
https://api.gcxone.com/v1
```

## Authentication

The API uses **Bearer Token** authentication. You must include your API Key in the `Authorization` header of each request.

```http
Authorization: Bearer YOUR_API_KEY
```

### Generating an API Key
1.  Log in to the Console as an Admin.
2.  Go to **Settings > API Keys**.
3.  Click **Generate New Key**.

## Endpoints

### Devices

#### `GET /devices`
Returns a list of all devices assigned to your organization.

**Response:**
```json
[
  {
    "id": "dev_12345",
    "name": "Main Gateway",
    "status": "online",
    "last_seen": "2023-10-27T10:00:00Z"
  }
]
```

#### `GET /devices/{id}`
Returns details for a specific device.

### Alarms

#### `GET /alarms`
Returns a list of active alarms.

#### `POST /alarms/{id}/acknowledge`
Acknowledges an alarm.

**Request Body:**
```json
{
  "user_id": "usr_98765",
  "note": "Investigating..."
}
```

## Rate Limiting
The API is rate-limited to **100 requests per minute** per IP address. Exceeding this limit will result in a `429 Too Many Requests` response.
