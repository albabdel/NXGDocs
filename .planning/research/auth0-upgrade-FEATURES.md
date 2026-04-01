# Auth0 Integration Upgrade - Research

**Researched:** 2026-04-01
**Domain:** Auth0 authentication for Docusaurus documentation sites
**Confidence:** HIGH

## Summary

This research covers Auth0 capabilities for upgrading the NXGEN documentation site from limited /support portal authentication to full product-wide authentication. The existing implementation uses Auth0 implicit flow with id_token verification via Cloudflare Pages Functions, HttpOnly session cookies for security, and SSO-aware login (no `prompt=login`).

**Primary recommendation:** Extend the existing Auth0 + Cloudflare Functions architecture to support documentation-specific features using Auth0's user metadata for preferences/bookmarks, Organizations for B2B customer segmentation, and Actions for custom logic like tracking and notifications. The current HttpOnly cookie pattern should be maintained for security.

---

## Key Auth0 Features for Documentation Sites

### 1. User Metadata Storage

| Type | Field | Use Case for Docs | Security |
|------|-------|-------------------|----------|
| `user_metadata` | Preferences, bookmarks, last visited | User-editable via Management API | Can be modified by authenticated users |
| `app_metadata` | Permissions, roles, organization ID | Access control, feature flags | Server-side only, users cannot modify |

**Documentation site use cases:**
- **Bookmarks:** Store array of page paths in `user_metadata.bookmarks`
- **Reading history:** Last visited pages, reading progress
- **Preferences:** Theme, sidebar state, notification settings
- **Role-based content:** `app_metadata.role` for Admin/Operator/Manager content access

**Implementation pattern:**
```javascript
// Post-login Action to add custom claims
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://docs.nxgen.cloud';
  
  // Add user metadata to ID token for frontend access
  if (event.user.user_metadata) {
    api.idToken.setCustomClaim(`${namespace}/bookmarks`, 
      event.user.user_metadata.bookmarks || []);
    api.idToken.setCustomClaim(`${namespace}/preferences`, 
      event.user.user_metadata.preferences || {});
  }
  
  // Add app metadata for role-based access
  if (event.user.app_metadata) {
    api.idToken.setCustomClaim(`${namespace}/role`, 
      event.user.app_metadata.role || 'reader');
    api.idToken.setCustomClaim(`${namespace}/org_id`, 
      event.user.app_metadata.org_id || null);
  }
};
```

### 2. Auth0 Organizations (B2B Feature)

**Availability:** Auth0 B2B plans (verify subscription tier)

Organizations provide:
- **Customer isolation:** Each customer company has their own organization
- **Federated login:** Enterprise SSO per organization (SAML, OIDC)
- **Organization-specific branding:** Custom login pages per org
- **Role assignment per organization:** Different permissions per customer

**For documentation sites:**
- Segment content by organization membership
- Enable enterprise SSO for customer companies
- Provide organization-specific documentation views

**Token claims:**
```json
{
  "org_id": "org_9ybsU1dN2dKfDkBi",
  "org_name": "acme-corp",
  "https://docs.nxgen.cloud/org_role": "admin"
}
```

**Implementation consideration:** 
- Requires passing `organization` parameter to `/authorize` endpoint
- ID token includes `org_id` claim
- Backend must validate `org_id` for access control

### 3. Auth0 Actions (Extensibility)

**Post-login triggers relevant for docs:**

| Trigger | Use Case |
|---------|----------|
| `post-login` | Add custom claims, track login events, sync to analytics |
| `post-user-registration` | Welcome notification, initial metadata setup |
| `credentials-exchange` | M2M token for backend services |

**Common patterns:**
```javascript
// Track documentation logins
exports.onExecutePostLogin = async (event, api) => {
  // Log to analytics service
  await fetch('https://analytics.example.com/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'docs_login',
      userId: event.user.user_id,
      email: event.user.email,
      timestamp: new Date().toISOString(),
      client: event.client.name
    })
  });
};

// Set default preferences for new users
exports.onExecutePostUserRegistration = async (event, api) => {
  api.user.setUserMetadata('preferences', {
    theme: 'dark',
    sidebarCollapsed: false,
    notifications: true
  });
};
```

### 4. Silent Authentication (SSO)

**Current implementation already supports SSO:**
- No `prompt=login` in Auth0 URL (preserves SSO session)
- Users logged into other NXGEN apps automatically authenticated

**For documentation personalization:**
```javascript
// Check session without full redirect
const checkAuth = async () => {
  try {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://docs.nxgen.cloud/api',
        scope: 'openid profile email'
      }
    });
    // User has valid session - show personalized content
  } catch (e) {
    // No session - show public content, offer login
  }
};
```

**Recommendation:** Use `getAccessTokenSilently()` from `@auth0/auth0-react` to check authentication status without disrupting user experience.

---

## Docusaurus + Auth0 Integration Patterns

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docusaurus (Static Site)                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Browser                                                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   ││
│  │  │ Auth0Provider│  │ useAuth0()  │  │ Protected Routes │   ││
│  │  │ (React SDK)  │  │   Hook      │  │   (Bookmarks)    │   ││
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────────┘   ││
│  │         │                 │                                  ││
│  └─────────┼─────────────────┼──────────────────────────────────┘│
│            │                 │                                   │
│            ▼                 ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  sessionStorage (in-memory only, not persistent)            ││
│  │  - ID token claims (safe to store)                          ││
│  │  - User profile data                                        ││
│  │  - NOT: access tokens (use HttpOnly cookies)                ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Cloudflare Pages Functions (Serverless)            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  /auth/session - Validate Auth0 session                     ││
│  │  /auth/metadata - Read/write user metadata                  ││
│  │  /auth/logout - Clear session + Auth0 logout                ││
│  │  /api/protected/* - API endpoints with session validation   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  HttpOnly Cookies (JavaScript cannot access)                ││
│  │  - session_token (HMAC-signed, 24h expiry)                  ││
│  │  - SameSite=Lax (CSRF protection)                           ││
│  │  - Secure (HTTPS only)                                      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Auth0 (nxgen.eu.auth0.com)                   │
│  - User authentication                                          │
│  - User metadata storage                                        │
│  - Organizations (B2B)                                          │
│  - Actions (custom logic)                                       │
└─────────────────────────────────────────────────────────────────┘
```

### React SDK Integration

**Installation:**
```bash
npm install @auth0/auth0-react
```

**Provider setup (wrap Docusaurus Root):**
```tsx
// classic/src/theme/Root.tsx
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import OriginalRoot from '@theme-original/Root';

const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm';

export default function Root(props) {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' 
          ? window.location.origin 
          : 'https://docs.nxgen.cloud',
        audience: 'https://docs.nxgen.cloud/api',
        scope: 'openid profile email read:bookmarks write:bookmarks'
      }}
      useRefreshTokens={true}
      cacheLocation="memory"  // NOT localStorage for security
    >
      <OriginalRoot {...props} />
    </Auth0Provider>
  );
}
```

### Protected Routes vs Public Content Pattern

```tsx
// classic/src/components/Bookmarks/index.tsx
import React from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

function BookmarksContent() {
  const { user, isLoading, getAccessTokenSilently } = useAuth0();
  const [bookmarks, setBookmarks] = React.useState([]);

  React.useEffect(() => {
    if (!user) return;
    
    (async () => {
      const token = await getAccessTokenSilently();
      const res = await fetch('/api/user/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBookmarks(data.bookmarks || []);
    })();
  }, [user, getAccessTokenSilently]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Bookmarks</h2>
      <ul>
        {bookmarks.map(b => (
          <li key={b.path}><a href={b.path}>{b.title}</a></li>
        ))}
      </ul>
    </div>
  );
}

// Require authentication for this component
export default withAuthenticationRequired(BookmarksContent, {
  onRedirecting: () => <div>Redirecting to login...</div>
});
```

### Progressive Enhancement Pattern

```tsx
// Show enhanced UI for logged-in users, basic UI for anonymous
function DocsPage({ path, title }) {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div>
      {/* Public content - always visible */}
      <article>{/* docs content */}</article>
      
      {/* Enhanced features - only for logged-in users */}
      {isAuthenticated && (
        <div className="docs-sidebar">
          <BookmarkButton path={path} title={title} />
          <ReadingProgress path={path} />
          <PersonalizedRecommendations userId={user.sub} />
        </div>
      )}
      
      {/* Login prompt for anonymous users */}
      {!isAuthenticated && (
        <div className="login-prompt">
          <p>Sign in to save bookmarks and track reading progress</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
}
```

---

## Security Best Practices

### Token Storage (CRITICAL)

| Storage Method | Security | Persistence | Recommendation |
|----------------|----------|-------------|----------------|
| **In-memory** | HIGH | Lost on tab close | **RECOMMENDED** for SPAs |
| **HttpOnly cookie** | HIGHEST | Session-based | **REQUIRED** for sensitive data |
| **localStorage** | LOW | Persistent | **AVOID** for tokens |
| **sessionStorage** | MEDIUM | Tab-only | OK for non-sensitive claims |

**Auth0's official recommendation:**
> "Store tokens in browser memory as the most secure option. Using Web Workers to handle the transmission and storage of tokens is the best way to protect the tokens."

### Why NOT localStorage for tokens:

1. **XSS vulnerability:** Any JavaScript (including third-party scripts) can read localStorage
2. **Persistent attack surface:** Tokens survive page reloads, giving attackers more time
3. **Docusaurus has many dependencies:** Any compromised dependency could steal tokens

### Recommended Pattern for This Project

```typescript
// functions/auth-session.ts
// Server-side session with HttpOnly cookie (already used in project)

export async function createSession(user: Auth0User): Promise<string> {
  const session = {
    userId: user.sub,
    email: user.email,
    role: user.app_metadata?.role || 'reader',
    orgId: user.app_metadata?.org_id,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Sign with HMAC-SHA256 (same pattern as existing zoho-session.ts)
  return await createSignedSession(session, process.env.SESSION_SECRET);
}

// Browser receives HttpOnly cookie - JavaScript cannot read it
// Frontend only stores non-sensitive profile data in memory
```

### HttpOnly Cookies vs Token-based Auth

| Aspect | HttpOnly Cookies | Token-based |
|--------|-----------------|-------------|
| XSS protection | JavaScript cannot access | Vulnerable if stored in JS |
| CSRF protection | Requires SameSite/CSRF token | Not applicable |
| Cross-domain | Same domain only | Works across domains |
| Implementation | Server-side session | Client-side storage |
| **For docs site** | **Preferred** | Acceptable for public APIs |

**Recommendation for this project:**
- Use HttpOnly cookies for session management (already implemented)
- Use Auth0 React SDK's `cacheLocation: "memory"` for ID token
- Never store access tokens in localStorage

### Rate Limiting and Abuse Prevention

**Auth0 built-in protections:**
- Suspicious IP throttling
- Brute-force protection
- Breached password detection
- Bot detection (JA4 fingerprinting)

**Cloudflare additional protections:**
```javascript
// Cloudflare Pages Function with rate limiting
export const onRequest: PagesFunction = async (context) => {
  const ip = context.request.headers.get('CF-Connecting-IP');
  
  // Use Cloudflare's built-in rate limiting
  // Configure in Cloudflare dashboard: Security > WAF > Rate Limiting
  
  // Or implement custom rate limiting with KV
  const key = `rate_limit:${ip}`;
  const count = await context.env.KV.get(key);
  
  if (count && parseInt(count) > 100) {
    return new Response('Too many requests', { status: 429 });
  }
  
  await context.env.KV.put(key, (parseInt(count || '0') + 1).toString(), {
    expirationTtl: 60 // 1 minute window
  });
  
  return context.next();
};
```

---

## User Experience Patterns

### Non-intrusive Login Prompts

**Pattern 1: Silent check, show subtle UI**
```tsx
// Don't redirect immediately - check auth state first
function useAuthState() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      // Try silent auth to see if user has SSO session
      getAccessTokenSilently()
        .then(() => {}) // User has valid session
        .catch(() => {
          // No session - show login prompt after delay
          setTimeout(() => setShowLoginPrompt(true), 3000);
        });
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return { showLoginPrompt };
}
```

**Pattern 2: Progressive disclosure**
```tsx
// Show public content immediately, enhance with login
function DocsPage() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div>
      {/* Always show docs content */}
      <Article />
      
      {/* Non-modal login prompt */}
      {!isAuthenticated && (
        <aside className="auth-prompt">
          <span>Want to save your progress?</span>
          <button onClick={() => loginWithRedirect({
            authorizationParams: {
              screen_hint: 'signup', // or 'login'
              prompt: 'login' // ONLY if user explicitly clicked login
            }
          })}>
            Sign in
          </button>
        </aside>
      )}
    </div>
  );
}
```

### Single Sign-On (SSO) Integration

**Current SSO setup (already working):**
- No `prompt=login` in Auth0 URL
- Users authenticated at gcx.nxgen.cloud are automatically authenticated at docs.nxgen.cloud
- Same Auth0 tenant (nxgen.eu.auth0.com)

**Key rules from SUPPORT-CONTEXT.md:**
> "Do not add `prompt: 'login'` to the Auth0 URL. This breaks SSO — users already logged into other NXGEN apps should be automatically signed in without re-entering credentials."

**Implementation:**
```tsx
// Correct: SSO-aware login
const login = () => loginWithRedirect(); // No prompt parameter

// Wrong: Breaks SSO
const badLogin = () => loginWithRedirect({
  authorizationParams: { prompt: 'login' } // AVOID
});

// Correct: Explicit logout (user requested)
const logout = () => logout({
  logoutParams: {
    returnTo: window.location.origin,
    federated: true // Also log out from IdP
  }
});
```

### Session Management Across Tabs

```tsx
// Listen for storage events from other tabs
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'auth_logout') {
      // Another tab logged out - refresh this tab
      window.location.reload();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## Implementation Recommendations

### Phase 1: Foundation (Minimal Viable Auth)

1. **Add Auth0Provider to Docusaurus Root component**
   - Wrap existing Root.tsx with Auth0Provider
   - Configure for SSO (no prompt=login)
   - Use `cacheLocation: "memory"`

2. **Create session validation endpoint**
   - `/auth/session` Cloudflare Function
   - Validate Auth0 session or existing Zoho session
   - Return user profile data

3. **Add login/logout UI components**
   - Subtle login button in navbar
   - User profile dropdown when authenticated

### Phase 2: User Metadata

1. **Create metadata API endpoints**
   - `GET /api/user/preferences`
   - `PATCH /api/user/preferences`
   - `GET /api/user/bookmarks`
   - `POST /api/user/bookmarks`

2. **Add bookmark functionality**
   - Bookmark button on docs pages
   - Bookmarks page showing saved pages

3. **Add reading progress tracking**
   - Store last visited pages
   - Show "Continue reading" suggestions

### Phase 3: Organizations (B2B)

1. **Enable Organizations in Auth0 dashboard**
   - Create organizations for customer companies
   - Configure enterprise connections (SAML/OIDC)

2. **Add organization-based content filtering**
   - Tag docs content by organization
   - Filter visible content based on user's org

3. **Add organization admin features**
   - Organization dashboard
   - Member management

### Phase 4: Actions & Analytics

1. **Add post-login Actions**
   - Track login events
   - Sync user data to analytics

2. **Add notification integrations**
   - New release notifications
   - Document update alerts

---

## Code Examples

### Auth0Provider for Docusaurus

```tsx
// classic/src/theme/Root.tsx
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import OriginalRoot from '@theme-original/Root';

export default function Root(props) {
  const domain = 'nxgen.eu.auth0.com';
  const clientId = 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm';

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' 
          ? `${window.location.origin}/auth/callback`
          : undefined,
        scope: 'openid profile email'
      }}
      useRefreshTokens={true}
      cacheLocation="memory"
    >
      <OriginalRoot {...props} />
    </Auth0Provider>
  );
}
```

### Auth Callback Page

```tsx
// classic/src/pages/auth/callback.tsx
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function CallbackHandler() {
  const { handleRedirectCallback, isLoading, error } = useAuth0();

  useEffect(() => {
    handleRedirectCallback()
      .then(() => {
        window.location.href = localStorage.getItem('auth_redirect') || '/';
      })
      .catch(console.error);
  }, [handleRedirectCallback]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>Completing login...</div>;
}

export default function AuthCallback() {
  return (
    <Layout>
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <CallbackHandler />}
      </BrowserOnly>
    </Layout>
  );
}
```

### Cloudflare Function for Session Validation

```typescript
// functions/auth-session.ts
import { getSessionFromHeader } from './lib/zoho-session';

interface Env {
  AUTH0_DOMAIN: string;
  SESSION_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Check for existing Zoho session
  const zohoSession = await getSessionFromHeader(
    context.request.headers.get('Cookie'),
    context.env.SESSION_SECRET
  );

  if (zohoSession) {
    return new Response(JSON.stringify({
      authenticated: true,
      provider: 'zoho',
      user: {
        contactId: zohoSession.contactId,
        displayName: zohoSession.displayName,
        accountId: zohoSession.accountId
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check for Auth0 session via ID token in Authorization header
  const authHeader = context.request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const idToken = authHeader.substring(7);
    const claims = await verifyAuth0IdToken(idToken, context.env.AUTH0_DOMAIN);
    
    return new Response(JSON.stringify({
      authenticated: true,
      provider: 'auth0',
      user: {
        userId: claims.sub,
        email: claims.email,
        name: claims.name
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    authenticated: false
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### User Metadata API

```typescript
// functions/user-metadata.ts
import { getSessionFromHeader } from './lib/zoho-session';

interface Env {
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  SESSION_SECRET: string;
}

// Get Management API token
async function getManagementToken(env: Env): Promise<string> {
  const res = await fetch(`https://${env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.AUTH0_CLIENT_ID,
      client_secret: env.AUTH0_CLIENT_SECRET,
      audience: `https://${env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

// GET /api/user/preferences
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const session = await getSessionFromHeader(
    context.request.headers.get('Cookie'),
    context.env.SESSION_SECRET
  );

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401 
    });
  }

  const token = await getManagementToken(context.env);
  const res = await fetch(
    `https://${context.env.AUTH0_DOMAIN}/api/v2/users/${session.userId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const user = await res.json();
  
  return new Response(JSON.stringify({
    preferences: user.user_metadata?.preferences || {},
    bookmarks: user.user_metadata?.bookmarks || []
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

// PATCH /api/user/preferences
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const session = await getSessionFromHeader(
    context.request.headers.get('Cookie'),
    context.env.SESSION_SECRET
  );

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401 
    });
  }

  const updates = await context.request.json();
  const token = await getManagementToken(context.env);

  const res = await fetch(
    `https://${context.env.AUTH0_DOMAIN}/api/v2/users/${session.userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user_metadata: updates
      })
    }
  );

  const user = await res.json();
  
  return new Response(JSON.stringify({
    ok: true,
    user_metadata: user.user_metadata
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## Sources

### Primary (HIGH confidence)
- Auth0 Official Documentation: User Metadata - https://auth0.com/docs/manage-users/user-accounts/metadata
- Auth0 Official Documentation: Organizations - https://auth0.com/docs/manage-users/organizations
- Auth0 Official Documentation: Actions - https://auth0.com/docs/customize/actions
- Auth0 Official Documentation: Post-login Trigger - https://auth0.com/docs/customize/actions/triggers/post-login
- Auth0 Official Documentation: Token Storage - https://auth0.com/docs/secure/security-guidance/data-security/token-storage
- Auth0 Official Documentation: Token Best Practices - https://auth0.com/docs/secure/tokens/token-best-practices
- Auth0 React SDK GitHub - https://github.com/auth0/auth0-react

### Project Context (HIGH confidence)
- SUPPORT-CONTEXT.md - Project authentication rules and security model
- functions/zoho-customer-auth.ts - Existing Auth0 integration code
- functions/lib/zoho-session.ts - Session management utilities

### Secondary (MEDIUM confidence)
- Auth0 React SDK Documentation - https://auth0.com/docs/libraries/auth0-react
- Auth0 Organizations Token Claims - https://auth0.com/docs/manage-users/organizations/using-tokens

---

## Metadata

**Confidence breakdown:**
- Auth0 capabilities: HIGH - Official Auth0 documentation
- Integration patterns: HIGH - Auth0 React SDK documentation + existing project code
- Security practices: HIGH - Auth0 official security guidance
- User experience: MEDIUM - Best practices inferred from Auth0 docs

**Research date:** 2026-04-01
**Valid until:** 2026-07-01 (Auth0 features are stable, but verify Organizations availability for your plan)
