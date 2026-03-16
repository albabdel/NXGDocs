# Technology Stack: Zoho Desk Web Integration

**Project:** Zoho Desk JavaScript SDK Research
**Researched:** March 16, 2026

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **No official SDK** | N/A | Web applications | Zoho does not provide a browser JS SDK - must use REST API directly |

### Authentication
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| OAuth 2.0 Authorization Code Flow | Standard | Agent authentication | Required for Zoho Desk API access from backend |
| JWT Tokens | Custom | Portal user authentication | Used for end-user/customer portal access |

### Data Fetching
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| REST API (direct) | v1 | API calls | Only option - no SDK abstraction available |
| fetch / axios | Any | HTTP client | Standard HTTP request handling |

## Official SDKs (Not for Web)

### React Native SDK
| Package | Version | Purpose |
|---------|---------|---------|
| `@zohocorp/zohodesk-portal-core` | 3.4.5 | Portal home wrapper |
| `@zohocorp/zohodesk-portal-configuration` | 3.4.5 | SDK configuration |
| `@zohocorp/zohodesk-portal-ticket` | 3.4.5 | Ticket operations UI |
| `@zohocorp/zohodesk-portal-apikit` | 3.4.5 | Core API toolkit |
| `@zohocorp/zohodesk-portal-kb` | 3.4.5 | Knowledge base |
| `@zohocorp/zohodesk-portal-community` | 3.4.5 | Community features |

**Installation (React Native only):**
```bash
npm install @zohocorp/zohodesk-portal-core @zohocorp/zohodesk-portal-apikit
```

### Embedded App JS SDK
| Package | Source | Purpose |
|---------|--------|---------|
| embeddedApp-js-sdk | GitHub/zoho | For widgets inside Zoho CRM/Desk |

**Installation:**
```html
<script src="https://live.zwidgets.com/js-sdk/1.5/ZohoEmbeddedAppSDK.min.js"></script>
```

**Note:** This SDK only works when embedded inside Zoho products - not for standalone web apps.

## API Authentication Patterns

### OAuth 2.0 for Agents (Server-Side)

```javascript
// Token generation from grant token
const generateTokens = async (grantToken) => {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: grantToken
    })
  });
  return response.json();
  // Returns: { access_token, refresh_token, expires_in }
};
```

### JWT for Portal Users (End Customers)

```javascript
// React Native SDK method - JWT login
ZohoDeskPortalSDK.loginWithJWTToken(jwtToken, successCallback, errorCallback);
```

**For web apps, you must implement:**
1. Backend endpoint to generate JWT tokens
2. Frontend to send JWT to Zoho Desk Portal API
3. Manual session management

## API Base URLs

| Data Center | API URL |
|-------------|---------|
| US | `https://desk.zoho.com/api/v1/` |
| EU | `https://desk.zoho.eu/api/v1/` |
| IN | `https://desk.zoho.in/api/v1/` |
| CN | `https://desk.zoho.com.cn/api/v1/` |
| AU | `https://desk.zoho.com.au/api/v1/` |

## OAuth Scopes (from OpenAPI spec)

```json
{
  "Desk.tickets.create": "CREATE Tickets and its sub resources",
  "Desk.tickets.update": "UPDATE Tickets and its sub resources",
  "Desk.tickets.read": "READ Tickets and its sub resources",
  "Desk.tickets.delete": "DELETE Tickets and its sub resources",
  "Desk.contacts.create": "CREATE Contacts and its sub resources",
  "Desk.contacts.read": "READ Contacts and its sub resources",
  "Desk.articles.read": "READ Articles and its sub resources",
  "Desk.basic.read": "READ Basic desk data (orgs, agents, departments)",
  "Desk.settings.read": "READ Settings data"
}
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Web SDK | REST API direct | React Native SDK | Incompatible platform |
| Web SDK | REST API direct | Embedded App SDK | Only works inside Zoho |
| Auth | OAuth 2.0 + JWT | API Key | Not supported by Zoho Desk |

## Sources

- GitHub: `zoho/react-native-zohodesk-portal-sdk` - Package.json files
- GitHub: `zoho/zohodesk-oas` - OAuth scopes definition
- Zoho Developer Console: `api-console.zoho.com` - Client registration
- Zoho CRM SDK docs - OAuth flow patterns (similar to Desk)
