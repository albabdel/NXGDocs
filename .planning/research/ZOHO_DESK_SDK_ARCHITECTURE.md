# Architecture Patterns: Zoho Desk Web Integration

**Domain:** Customer Support Help Desk SDK
**Researched:** March 16, 2026

## Recommended Architecture

Since no official web JS SDK exists, web applications must build their own integration layer.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              WEB APPLICATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐    │
│  │   React/Vue  │───▶│  Auth Layer  │───▶│      API Client Layer        │    │
│  │   Components │    │              │    │                              │    │
│  └──────────────┘    │ - Token Mgmt │    │  - Request building          │    │
│         │            │ - Refresh    │    │  - Error handling            │    │
│         │            │ - Storage    │    │  - Retry logic               │    │
│         │            └──────────────┘    │  - Rate limiting             │    │
│         │                    │           └──────────────────────────────┘    │
│         │                    │                       │                       │
│         ▼                    ▼                       ▼                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐    │
│  │ Custom Hooks │    │ Token Store  │    │    Zoho Desk REST API        │    │
│  │              │    │              │    │                              │    │
│  │ - useTickets │    │ - Memory/    │    │  desk.zoho.com/api/v1/...    │    │
│  │ - useAuth    │    │   Cookies     │    │                              │    │
│  └──────────────┘    └──────────────┘    └──────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Authentication Flows

### Flow 1: Agent Authentication (OAuth 2.0)

For applications where staff/agents access Zoho Desk:

```
┌──────────┐     ┌──────────┐     ┌───────────────┐     ┌──────────────┐
│   User   │     │   App    │     │ Zoho Accounts │     │  Zoho Desk   │
│  (Agent) │     │ Frontend │     │    (OAuth)    │     │     API      │
└────┬─────┘     └────┬─────┘     └───────┬───────┘     └──────┬───────┘
     │                │                   │                    │
     │ 1. Click Login │                   │                    │
     │───────────────▶│                   │                    │
     │                │                   │                    │
     │                │ 2. Redirect to    │                    │
     │                │    /oauth/v2/auth │                    │
     │                │──────────────────▶│                    │
     │                │                   │                    │
     │ 3. Authorize   │                   │                    │
     │────────────────────────────────────▶│                    │
     │                │                   │                    │
     │                │ 4. Redirect with  │                    │
     │                │    code           │                    │
     │                │◀──────────────────│                    │
     │                │                   │                    │
     │                │ 5. Exchange code  │                    │
     │                │    for tokens     │                    │
     │                │──────────────────▶│                    │
     │                │                   │                    │
     │                │ 6. access_token,  │                    │
     │                │    refresh_token  │                    │
     │                │◀──────────────────│                    │
     │                │                   │                    │
     │                │ 7. API calls with │                    │
     │                │    Bearer token   │                    │
     │                │────────────────────────────────────────▶│
     │                │                   │                    │
     │                │ 8. JSON response  │                    │
     │                │◀────────────────────────────────────────│
     │                │                   │                    │
```

**Implementation:**

```javascript
// Step 1: Redirect to Zoho OAuth
const loginUrl = new URL('https://accounts.zoho.com/oauth/v2/auth');
loginUrl.searchParams.set('response_type', 'code');
loginUrl.searchParams.set('client_id', CLIENT_ID);
loginUrl.searchParams.set('redirect_uri', REDIRECT_URI);
loginUrl.searchParams.set('scope', 'Desk.tickets.READ Desk.tickets.CREATE');
loginUrl.searchParams.set('access_type', 'offline'); // Important for refresh token

window.location.href = loginUrl.toString();

// Step 2: Handle callback (in your redirect URI route)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Step 3: Exchange code for tokens (via backend proxy recommended)
const tokens = await fetch('/api/auth/zoho/callback', {
  method: 'POST',
  body: JSON.stringify({ code })
}).then(r => r.json());

// Store tokens securely
storeTokens(tokens);
```

### Flow 2: Portal User Authentication (JWT)

For applications where end customers access their tickets:

```
┌──────────┐     ┌──────────┐     ┌───────────────┐     ┌──────────────┐
│   User   │     │   App    │     │    Your       │     │  Zoho Desk   │
│(Customer)│     │ Frontend │     │   Backend     │     │Portal API    │
└────┬─────┘     └────┬─────┘     └───────┬───────┘     └──────┬───────┘
     │                │                   │                    │
     │ 1. Login with  │                   │                    │
     │    your system │                   │                    │
     │───────────────▶│                   │                    │
     │                │                   │                    │
     │                │ 2. Request Zoho   │                    │
     │                │    JWT token      │                    │
     │                │──────────────────▶│                    │
     │                │                   │                    │
     │                │                   │ 3. Generate JWT    │
     │                │                   │    (Zoho SDK/Secret)│
     │                │                   │                    │
     │                │ 4. JWT token      │                    │
     │                │◀──────────────────│                    │
     │                │                   │                    │
     │                │ 5. API calls with │                    │
     │                │    JWT token      │                    │
     │                │────────────────────────────────────────▶│
     │                │                   │                    │
     │                │ 6. User's tickets │                    │
     │                │◀────────────────────────────────────────│
     │                │                   │                    │
```

**Note:** The exact JWT generation process for web apps requires backend integration with Zoho Desk Portal. The React Native SDK uses `loginWithJWTToken()` but the JWT generation must happen on your backend.

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Auth Provider | Token management, login/logout, refresh | Token Store, API Client |
| Token Store | Secure token persistence | Auth Provider |
| API Client | Request building, error handling, retries | Zoho Desk API |
| Custom Hooks | React-friendly API access | API Client |
| UI Components | Ticket display, forms, lists | Custom Hooks |

## Data Flow

### Ticket List Flow
```
Component → useTickets() → API Client → GET /api/v1/tickets?orgId=X → Zoho Desk
    │                          │
    │◀─────────────────────────│
    │   { tickets: [...] }     │
```

### Create Ticket Flow
```
Component → useCreateTicket() → API Client → POST /api/v1/tickets → Zoho Desk
    │         (with form data)      │
    │                              │
    │◀─────────────────────────────│
    │   { ticket: { id: ... } }    │
```

## Patterns to Follow

### Pattern 1: Centralized API Client

**What:** Single module handles all Zoho Desk API communication.
**When:** Always - prevents scattered auth logic.

```javascript
// api/zoho-desk.js
class ZohoDeskClient {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'https://desk.zoho.com/api/v1';
    this.orgId = config.orgId;
    this.getAccessToken = config.getAccessToken;
  }

  async request(path, options = {}) {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired - trigger refresh
      throw new TokenExpiredError();
    }

    return response.json();
  }

  // Ticket methods
  async getTickets(params = {}) {
    const query = new URLSearchParams({ orgId: this.orgId, ...params });
    return this.request(`/tickets?${query}`);
  }

  async getTicket(ticketId) {
    return this.request(`/tickets/${ticketId}?orgId=${this.orgId}`);
  }

  async createTicket(data) {
    return this.request(`/tickets?orgId=${this.orgId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateTicket(ticketId, data) {
    return this.request(`/tickets/${ticketId}?orgId=${this.orgId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}

export const zohoDeskClient = new ZohoDeskClient({
  orgId: process.env.ZOHO_ORG_ID,
  getAccessToken: () => authManager.getAccessToken()
});
```

### Pattern 2: Token Refresh Interceptor

**What:** Automatically refresh tokens on 401 errors.
**When:** All applications using OAuth.

```javascript
// auth/token-manager.js
class TokenManager {
  constructor() {
    this.tokens = null;
    this.refreshPromise = null;
  }

  async getAccessToken() {
    if (this.isTokenExpired()) {
      return this.refreshTokens();
    }
    return this.tokens.accessToken;
  }

  isTokenExpired() {
    if (!this.tokens) return true;
    // Refresh 5 minutes before expiry
    return Date.now() > this.tokens.expiresAt - 300000;
  }

  async refreshTokens() {
    // Prevent concurrent refreshes
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefresh();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  async doRefresh() {
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: this.tokens.refreshToken
      })
    });

    const newTokens = await response.json();
    this.tokens = {
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token || this.tokens.refreshToken,
      expiresAt: Date.now() + (newTokens.expires_in * 1000)
    };

    return this.tokens.accessToken;
  }
}
```

### Pattern 3: React Custom Hooks

**What:** Wrap API client in React hooks for component use.
**When:** React applications.

```javascript
// hooks/useTickets.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zohoDeskClient } from '../api/zoho-desk';

export function useTickets(filters = {}) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => zohoDeskClient.getTickets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTicket(ticketId) {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => zohoDeskClient.getTicket(ticketId),
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => zohoDeskClient.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct Fetch in Components

**What:** Calling fetch directly in React components.
**Why bad:** No error handling, no retry, scattered auth.
**Instead:** Use centralized client via custom hooks.

### Anti-Pattern 2: Storing Tokens in Redux/State

**What:** Keeping tokens in application state.
**Why bad:** Lost on refresh, exposed to XSS.
**Instead:** Use HttpOnly cookies or secure storage.

### Anti-Pattern 3: Ignoring Error Codes

**What:** Only catching network errors.
**Why bad:** Zoho returns structured error codes.
**Instead:** Parse `errorCode` from response body.

```javascript
// Error handling example
const ERROR_CODES = {
  INVALID_OAUTH: 'Token invalid or expired',
  SCOPE_MISMATCH: 'Required scope not granted',
  LICENSE_ACCESS_LIMITED: 'Feature not available in plan',
  INVALID_DATA: 'Validation failed - check errors array'
};

function handleApiError(error) {
  if (error.errorCode) {
    switch (error.errorCode) {
      case 'INVALID_OAUTH':
        authManager.logout();
        break;
      case 'INVALID_DATA':
        return { fieldErrors: error.errors };
      default:
        console.error(ERROR_CODES[error.errorCode] || error.message);
    }
  }
  throw error;
}
```

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Token refresh | Per-session | Connection pool | Token caching service |
| API rate limits | Not an issue | Implement backoff | Queue + worker pattern |
| Caching | Memory | Redis | Distributed cache |

## Sources

- React Native SDK: `github.com/zoho/react-native-zohodesk-portal-sdk`
- OpenAPI spec: `github.com/zoho/zohodesk-oas`
- Zoho CRM SDK patterns: `www.zoho.com/crm/developer/docs/sdk`
