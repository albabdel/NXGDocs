# Zoho MCP Server Integration Research

## Executive Summary

Zoho MCP (Model Context Protocol) is Zoho's implementation of the open MCP standard that enables AI agents to interact with Zoho business applications. The endpoints you provided use a **custom HTTP transport** that requires both an API key (in URL) and OAuth authentication.

---

## 1. What is Zoho MCP Message API Format?

Zoho MCP uses the **standard MCP protocol** which is built on **JSON-RPC 2.0**:

### Request Format
```json
{
  "jsonrpc": "2.0",
  "method": "<method_name>",
  "params": { ... },
  "id": 1
}
```

### Response Format
```json
{
  "jsonrpc": "2.0",
  "result": { ... },
  "id": 1
}
```

### Error Response Format
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid Request"
  },
  "id": 1
}
```

### Core MCP Methods
| Method | Description |
|--------|-------------|
| `initialize` | Establish connection, negotiate protocol version |
| `tools/list` | List available tools/actions |
| `tools/call` | Execute a tool with arguments |
| `resources/list` | List available resources |
| `resources/read` | Read a specific resource |
| `prompts/list` | List available prompts |
| `prompts/get` | Get a prompt template |

---

## 2. Your Endpoints Analysis

### Endpoint Structure
```
https://<subdomain>.zohomcp.eu/mcp/message?key=<api_key>
```

### Provided Endpoints
| Service | Endpoint URL |
|---------|-------------|
| Mail MCP | `https://nxgs-20110877848.zohomcp.eu/mcp/message?key=f50510b3755828f703e81112e180373a` |
| Calendar MCP | `https://calendar-20110877848.zohomcp.eu/mcp/message?key=fbf99eb19f7517bbf700100abf90387d` |
| CRM MCP | `https://mcp2-20110877848.zohomcp.eu/mcp/message?key=143d7fe3ce88efe14ac703e0ef7cae39` |

### Testing Results

```bash
# Test 1: Without key parameter
curl -X POST "https://nxgs-20110877848.zohomcp.eu/mcp/message" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}'
# Response: "Missing key param."

# Test 2: With key parameter
curl -X POST "https://nxgs-20110877848.zohomcp.eu/mcp/message?key=f50510b3755828f703e81112e180373a" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}'
# Response: "Authentication required"
```

**Key Finding**: The API key in the URL is validated, but additional OAuth authentication is required.

---

## 3. Authentication Requirements

### Two-Layer Authentication

Based on Zoho's documentation and testing:

1. **URL Parameter (`key`)**: Required for initial endpoint access validation
2. **OAuth 2.0**: Required for actual API operations

### OAuth Flow (Per Zoho MCP Documentation)

Zoho MCP uses OAuth 2.0 for authorization. The flow typically involves:

```
1. User authorizes your application with Zoho
2. Zoho returns an access token
3. Include the access token in requests
```

### Authentication Methods Supported

| Method | Use Case | Implementation |
|--------|----------|---------------|
| **Client Credentials** | Service-to-service | `ClientCredentialsProvider` |
| **Private Key JWT** | Secure machine-to-machine | `PrivateKeyJwtProvider` |
| **Authorization Code** | User-facing apps | Full OAuth flow with browser redirect |
| **Cross-App Access** | Enterprise IdP integration | `CrossAppAccessProvider` |

### Token Usage

Based on testing, tokens can be passed via:
- `Authorization: Bearer <token>` header (returned "invalid oauth token" in test, indicating this is the expected format)
- The `key` URL parameter appears to be a server-specific identifier, not an OAuth token

---

## 4. Request/Response Details

### Required Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <oauth_access_token>  # Required after OAuth flow
```

### Initialize Request Example

```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "my-react-app",
      "version": "1.0.0"
    }
  },
  "id": 1
}
```

### Initialize Response (Expected)

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {},
      "resources": {}
    },
    "serverInfo": {
      "name": "zoho-mail-mcp",
      "version": "1.0.0"
    },
    "instructions": "This server provides access to Zoho Mail..."
  },
  "id": 1
}
```

---

## 5. Browser/React Integration Approaches

### Approach A: Direct Fetch (Simple but Limited)

```typescript
// Simple direct API calls - requires CORS support
async function callMCPTool(
  endpoint: string,
  apiKey: string,
  accessToken: string,
  toolName: string,
  args: Record<string, unknown>
) {
  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      },
      id: Date.now()
    })
  });
  
  return response.json();
}
```

### Approach B: Using MCP TypeScript SDK (Recommended)

```bash
npm install @modelcontextprotocol/client zod
```

```typescript
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

// Create MCP client for Zoho Mail
const mailClient = new Client({
  name: 'zoho-mail-client',
  version: '1.0.0'
});

// Custom transport with API key in URL
const mailTransport = new StreamableHTTPClientTransport(
  new URL('https://nxgs-20110877848.zohomcp.eu/mcp/message?key=f50510b3755828f703e81112e180373a'),
  {
    // OAuth provider for authentication
    authProvider: {
      // Implement OAuth flow here
      async ready() {
        return { accessToken: 'your-oauth-token' };
      }
    }
  }
);

await mailClient.connect(mailTransport);

// List available tools
const { tools } = await mailClient.listTools();
console.log('Available tools:', tools);

// Call a tool
const result = await mailClient.callTool({
  name: 'send-email',
  arguments: {
    to: 'recipient@example.com',
    subject: 'Hello',
    body: 'Test email from MCP'
  }
});
```

### Approach C: Backend Proxy (Best for Browser Security)

Since MCP servers may not support CORS for browser requests, a backend proxy is recommended:

```typescript
// Backend: /api/mcp-proxy.ts (Express example)
import express from 'express';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

const app = express();
app.use(express.json());

// Store connected MCP clients
const clients = new Map<string, Client>();

async function getMCPLient(service: string) {
  if (clients.has(service)) return clients.get(service)!;
  
  const endpoints = {
    mail: 'https://nxgs-20110877848.zohomcp.eu/mcp/message?key=f50510b3755828f703e81112e180373a',
    calendar: 'https://calendar-20110877848.zohomcp.eu/mcp/message?key=fbf99eb19f7517bbf700100abf90387d',
    crm: 'https://mcp2-20110877848.zohomcp.eu/mcp/message?key=143d7fe3ce88efe14ac703e0ef7cae39'
  };
  
  const client = new Client({ name: 'proxy-client', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(endpoints[service]));
  
  await client.connect(transport);
  clients.set(service, client);
  return client;
}

// Proxy endpoint
app.post('/api/mcp/:service/:method', async (req, res) => {
  try {
    const client = await getMCPLient(req.params.service);
    const { method } = req.params;
    const params = req.body;
    
    // Handle different MCP methods
    if (method === 'tools/list') {
      const result = await client.listTools(params);
      res.json(result);
    } else if (method === 'tools/call') {
      const result = await client.callTool(params);
      res.json(result);
    } else if (method === 'resources/list') {
      const result = await client.listResources(params);
      res.json(result);
    } else {
      res.status(400).json({ error: 'Unknown method' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```

```typescript
// Frontend: React hook
import { useState, useEffect } from 'react';

function useZohoMCP(service: string) {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/mcp/${service}/tools/list`)
      .then(res => res.json())
      .then(data => {
        setTools(data.tools || []);
        setLoading(false);
      });
  }, [service]);
  
  const callTool = async (name: string, arguments: any) => {
    const response = await fetch(`/api/mcp/${service}/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, arguments })
    });
    return response.json();
  };
  
  return { tools, callTool, loading };
}

// Usage in component
function EmailSender() {
  const { tools, callTool, loading } = useZohoMCP('mail');
  
  const sendEmail = async () => {
    const result = await callTool('send-email', {
      to: 'user@example.com',
      subject: 'Test',
      body: 'Hello from React!'
    });
    console.log(result);
  };
  
  if (loading) return <div>Loading tools...</div>;
  
  return (
    <div>
      <h2>Available Tools: {tools.map(t => t.name).join(', ')}</h2>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
}
```

---

## 6. Important Considerations

### CORS Limitations

**Browser-based applications may face CORS restrictions** because:
1. MCP servers typically run locally or in controlled environments
2. The `Origin` header validation is a security requirement
3. Zoho's servers may not allow browser origins

**Solution**: Use a backend proxy (Approach C) for production applications.

### OAuth Flow Required

The "Authentication required" response indicates you need to:
1. Register your application with Zoho
2. Implement OAuth 2.0 authorization
3. Store and refresh access tokens
4. Include tokens in all requests

### API Key Purpose

The `key` parameter in the URL appears to:
- Identify the specific MCP server instance
- Serve as a server-specific credential
- NOT replace OAuth authentication

---

## 7. Next Steps for Integration

### Step 1: OAuth Setup
1. Register your application in Zoho API Console
2. Obtain `client_id` and `client_secret`
3. Configure redirect URIs
4. Implement authorization code flow

### Step 2: Test Connection
```bash
# After obtaining OAuth token
curl -X POST "https://nxgs-20110877848.zohomcp.eu/mcp/message?key=f50510b3755828f703e81112e180373a" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}},"id":1}'
```

### Step 3: Integrate with React
1. Create backend proxy service
2. Implement MCP client connections
3. Build React components for tool invocation
4. Handle authentication state

---

## 8. Resources

- [Zoho MCP Product Page](https://www.zoho.com/mcp/)
- [MCP Specification](https://modelcontextprotocol.io/specification/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/)

---

## Summary

The Zoho MCP endpoints use standard MCP protocol (JSON-RPC 2.0) over HTTP. Integration requires:

1. **URL API Key**: Include `key` parameter in endpoint URL
2. **OAuth 2.0**: Complete authorization flow to get access token
3. **JSON-RPC Format**: All requests follow JSON-RPC 2.0 structure
4. **Backend Proxy Recommended**: For browser/React apps due to CORS

The MCP TypeScript SDK (`@modelcontextprotocol/client`) provides the best developer experience for building MCP clients in JavaScript/TypeScript applications.
