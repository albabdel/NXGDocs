# Supabase Integration for User Data Storage (Auth0 + Cloudflare)

**Researched:** 2026-04-01
**Domain:** Auth0 + Supabase integration, Cloudflare Pages deployment
**Confidence:** HIGH (Official Supabase documentation, first-party Auth0 support)

## Summary

Supabase provides **first-class support for Auth0 as a third-party authentication provider**, meaning your existing Auth0 JWTs can be used directly with Supabase APIs without migrating users or implementing custom JWT translation. This is the recommended approach for your use case.

**Primary recommendation:** Use Supabase's native Third-Party Auth integration with Auth0. This allows Auth0 to handle authentication while Supabase handles data storage with Row Level Security (RLS) enforcing user isolation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │ Auth0 SPA SDK   │    │ Supabase Client │    │ Zoho Portal     │          │
│  │ (auth0-spa-js)  │    │ (supabase-js)   │    │ (existing)      │          │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘          │
│           │                      │                      │                    │
│           │ id_token             │ + Auth0 JWT         │ session cookie     │
│           ▼                      ▼                      ▼                    │
└───────────┼──────────────────────┼──────────────────────┼────────────────────┘
            │                      │                      │
            │                      │                      │
┌───────────┼──────────────────────┼──────────────────────┼────────────────────┐
│           ▼                      ▼                      ▼                    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │ Auth0 Tenant    │    │ Supabase APIs   │    │ Cloudflare      │          │
│  │ nxgen.eu.auth0  │    │ • REST/GraphQL  │    │ Pages Functions │          │
│  │                 │    │ • Realtime      │    │ • zoho-auth     │          │
│  │ Issues JWTs     │    │ • Storage       │    │ • user-data     │          │
│  │ (RS256/ES256)   │    │                 │    │                 │          │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘          │
│           │                      │                      │                    │
│           │ JWKS discovery       │ RLS policies         │                    │
│           │ (public keys)        │ enforce user_id      │                    │
│           ▼                      ▼                      ▼                    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │ .well-known/    │    │ PostgreSQL DB   │    │ Session cookies │          │
│  │ jwks.json       │    │ (Supabase)      │    │ (HttpOnly)      │          │
│  └─────────────────┘    │                 │    └─────────────────┘          │
│                         │ • user_data     │                                 │
│                         │ • bookmarks     │                                 │
│                         │ • preferences   │                                 │
│                         │ • history       │                                 │
│                         └─────────────────┘                                 │
│                                                                              │
│                    CLOUDFLARE PAGES / SUPABASE CLOUD                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User clicks "Sign in with Auth0"
   └── Browser redirects to Auth0 Universal Login

2. Auth0 authenticates user
   └── Auth0 Action adds `role: 'authenticated'` claim
   └── Returns id_token (JWT signed with RS256 or ES256)

3. Browser receives JWT
   └── Supabase client configured with: accessToken: () => auth0.getTokenSilently()

4. Supabase API calls
   └── Authorization: Bearer <Auth0 JWT>
   └── Supabase verifies JWT using Auth0 JWKS (cached 10 min)
   └── RLS policies use auth.jwt() -> 'sub' as user_id

5. Data isolation enforced
   └── Each user only sees their own data via RLS
```

---

## Supabase + Auth0 Integration

### Official Third-Party Auth Support

Supabase has **native, first-class support** for Auth0 as a third-party auth provider. This is documented at:
- https://supabase.com/docs/guides/auth/third-party/auth0
- https://supabase.com/docs/guides/auth/third-party/overview

### Setup Steps

**1. Enable Third-Party Auth in Supabase Dashboard**

Navigate to: Authentication → Third-Party Auth → Add Integration

```toml
# supabase/config.toml
[auth.third_party.auth0]
enabled = true
tenant = "nxgen.eu"  # your Auth0 tenant ID
tenant_region = "eu"  # if your tenant has a region
```

**2. Add Auth0 Action for Role Claim**

Auth0 JWTs don't include a `role` claim by default. Supabase requires this for RLS. Add an Auth0 Action:

```javascript
// Auth0 Action: onExecutePostLogin
exports.onExecutePostLogin = async (event, api) => {
  // Required: Add authenticated role for Supabase RLS
  api.accessToken.setCustomClaim('role', 'authenticated');
  
  // Optional: Add user metadata for easier RLS access
  api.accessToken.setCustomClaim('user_email', event.user.email);
};
```

**3. Configure Supabase Client in Your App**

```typescript
import { createClient } from '@supabase/supabase-js';
import Auth0Client from '@auth0/auth0-spa-js';

// Initialize Auth0
const auth0 = new Auth0Client({
  domain: 'nxgen.eu.auth0.com',
  clientId: 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm',
  authorizationParams: {
    redirect_uri: window.location.origin + '/auth/callback',
  },
});

// Initialize Supabase with Auth0 token provider
const supabase = createClient(
  'https://temmzrunmzjiivogsbzz.supabase.co',
  'sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3U',
  {
    accessToken: async () => {
      // Auth0 access token (recommended) or ID token
      return await auth0.getTokenSilently();
    },
  }
);
```

### JWT Verification Process

Supabase verifies Auth0 JWTs using the OIDC discovery endpoint:

```
GET https://nxgen.eu.auth0.com/.well-known/jwks.json
→ Returns public keys for RS256/ES256 verification
```

The JWKS is cached for 10 minutes at multiple levels:
- Supabase Edge servers: 10 min cache
- Client libraries: 10 min in-memory cache

### Key Limitations

⚠️ **Not supported:**
- HS256 (HMAC symmetric) signing algorithm
- PS256 (RSA-PSS) signing algorithm

✅ **Supported:**
- RS256 (RSA with SHA-256) — most common
- ES256 (Elliptic Curve P-256) — faster, smaller signatures

Your Auth0 tenant likely uses RS256 by default, which is fully supported.

---

## Row Level Security (RLS) with Auth0 User IDs

### How RLS Works with Third-Party JWTs

When using Auth0 JWTs, Supabase extracts claims from the JWT and makes them available via:

| Function | Returns | Use Case |
|----------|---------|----------|
| `auth.uid()` | `sub` claim from JWT | Primary user identifier |
| `auth.jwt()` | Full JWT payload | Access custom claims |

### Example RLS Policies

```sql
-- Enable RLS on user data tables
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own bookmarks"
ON user_bookmarks FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own bookmarks"
ON user_bookmarks FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own bookmarks"
ON user_bookmarks FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own bookmarks"
ON user_bookmarks FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));
```

### Using Custom Claims in RLS

If you add custom claims via Auth0 Actions:

```sql
-- Access email claim directly in RLS
CREATE POLICY "Users can view by email"
ON user_bookmarks FOR SELECT
TO authenticated
USING (user_email = (SELECT auth.jwt() ->> 'user_email'));

-- Or use app_metadata for role-based access
CREATE POLICY "Admins can view all"
ON user_bookmarks FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
```

---

## Database Schema Design

### Recommended Schema for User Features

```sql
-- User profile (linked to Auth0 user ID)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_user_id TEXT UNIQUE NOT NULL,  -- Auth0 'sub' claim
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Index for RLS lookups
  INDEX idx_user_profiles_auth0_id (auth0_user_id)
);

-- Bookmarks (documents, pages, videos)
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- Auth0 'sub' claim
  item_type TEXT NOT NULL CHECK (item_type IN ('document', 'page', 'video', 'external')),
  item_id TEXT,           -- Sanity document ID or external URL
  item_title TEXT,
  item_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate bookmarks per user
  UNIQUE (user_id, item_type, item_id),
  
  -- Index for RLS + common queries
  INDEX idx_user_bookmarks_user_id (user_id),
  INDEX idx_user_bookmarks_created (user_id, created_at DESC)
);

-- User preferences (UI settings, notifications)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,  -- Auth0 'sub' claim
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  notification_settings JSONB DEFAULT '{
    "email": true,
    "browser": true,
    "updates": true
  }',
  sidebar_collapsed BOOLEAN DEFAULT FALSE,
  homepage_view TEXT DEFAULT 'dashboard',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_preferences_user_id (user_id)
);

-- Reading/watch history
CREATE TABLE user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('document', 'page', 'video')),
  item_id TEXT NOT NULL,
  item_title TEXT,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- One history entry per user per item
  UNIQUE (user_id, item_type, item_id),
  
  INDEX idx_user_history_user_id (user_id),
  INDEX idx_user_history_accessed (user_id, last_accessed_at DESC)
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
```

### Real-Time Subscriptions

Supabase Realtime works with Auth0 JWTs out of the box:

```typescript
// Subscribe to bookmark changes for current user
const channel = supabase
  .channel('user-bookmarks-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_bookmarks',
      filter: `user_id=eq.${userId}`,  // RLS enforces this anyway
    },
    (payload) => {
      console.log('Bookmark changed:', payload);
    }
  )
  .subscribe();
```

---

## Cloudflare Pages + Supabase Patterns

### Connection Pooling for Edge Functions

Cloudflare Pages Functions are serverless and create transient connections. Use **Supavisor transaction mode** for optimal performance:

```
Transaction mode connection string:
postgres://postgres:[PASSWORD]@db.temmzrunmzjiivogsbzz.supabase.co:6543/postgres
```

⚠️ **Important:** Turn off prepared statements when using transaction mode:
```typescript
// In your ORM/config
prepareStatements: false
```

### Recommended Pattern: Direct API Calls from Client

**Don't route through Cloudflare Functions for simple CRUD.** The Supabase client handles this efficiently:

```typescript
// ❌ DON'T: Proxy through Cloudflare Function
const res = await fetch('/api/bookmarks');
const bookmarks = await res.json();

// ✅ DO: Direct Supabase call (RLS enforces security)
const { data: bookmarks, error } = await supabase
  .from('user_bookmarks')
  .select('*')
  .order('created_at', { ascending: false });
```

### When to Use Cloudflare Functions

Use Cloudflare Pages Functions for:
1. **Zoho integration** (existing pattern) — API proxying for Zoho Desk
2. **Webhook handlers** — receiving external events
3. **Server-side rendering** — SSR with user context
4. **Complex business logic** — operations not suited for Postgres functions

### Caching Strategy

```typescript
// Cache Supabase responses at Cloudflare edge
export const onRequestGet: PagesFunction = async (context) => {
  const cacheKey = new Request(context.request.url, context.request);
  const cache = caches.default;
  
  // Check cache first
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  
  // Fetch from Supabase
  const supabase = createClient(/* ... */);
  const { data } = await supabase.from('public_content').select('*');
  
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300', // 5 min
    },
  });
  
  // Store in cache
  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
```

---

## Auth0 Metadata vs Supabase Storage

### Comparison

| Aspect | Auth0 user_metadata | Auth0 app_metadata | Supabase Tables |
|--------|---------------------|--------------------|-----------------| 
| **Who can modify** | User (via API) | Admin only | Via RLS policies |
| **Size limit** | ~16KB total | ~16KB total | Unlimited |
| **Searchable** | No | No | Yes (indexed) |
| **Real-time sync** | No (JWT refresh needed) | No (JWT refresh needed) | Yes (Realtime) |
| **Query complexity** | Simple key-value | Simple key-value | Full SQL |
| **Relationships** | No | No | Yes (foreign keys) |
| **Audit trail** | Limited | Limited | Full (triggers) |

### Recommendation Matrix

| Data Type | Recommended Storage | Reason |
|-----------|--------------------| -------|
| **Bookmarks** | Supabase | Need search, ordering, unlimited size |
| **Reading history** | Supabase | Need timestamps, progress tracking, queries |
| **Preferences** | Either | Small, simple — Supabase for consistency |
| **Display name** | Auth0 user_metadata | Fast JWT access, user-editable |
| **Admin flags** | Auth0 app_metadata | Protected, included in JWT for RLS |
| **Team memberships** | Supabase | Relational data, complex queries |

### Auth0 Metadata Structure (if used)

```json
// user_metadata (user can modify)
{
  "display_name": "John Doe",
  "avatar_url": "https://...",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}

// app_metadata (admin only, used for RLS)
{
  "role": "user",
  "teams": ["team-123", "team-456"],
  "permissions": ["read", "write"]
}
```

### Migration Path

If starting with Auth0 metadata, migration to Supabase is straightforward:

1. **Export metadata** via Auth0 Management API
2. **Create Supabase tables** with matching schema
3. **Write migration script** to copy data
4. **Update Auth0 Action** to include user_id claim
5. **Deploy new client code** using Supabase client

---

## Pricing & Limits

### Supabase Pricing (as of 2026)

| Plan | Database | Third-Party MAUs | Storage | Bandwidth |
|------|----------|------------------|---------|-----------|
| Free | 500MB | 50,000 | 1GB | 5GB |
| Pro | 8GB | 100,000 | 100GB | 250GB |
| Team | 8GB | 100,000 | 100GB | 250GB |

### Third-Party MAU Pricing

- **Free tier:** 50,000 Third-Party MAUs included
- **Overage:** $0.00325 per additional Third-Party MAU (Pro/Team plans)

**Calculation for your use case:**
- If you have 5,000 active users/month: **Well within free tier**
- If you have 75,000 active users/month: ~$81.25/month overage on Pro

### Storage Considerations

- **User profiles:** ~1KB per user → 1MB per 1,000 users
- **Bookmarks:** ~500 bytes each → 100 bookmarks = 50KB per user
- **History:** ~200 bytes each → 500 items = 100KB per user

**Estimate:** ~150KB per active user → 1,000 users = ~150MB (well under 500MB free tier)

---

## Implementation Complexity Assessment

### Complexity Rating: LOW (2/10)

| Component | Complexity | Reason |
|-----------|------------|--------|
| Auth0 Integration | Low | Native third-party auth support |
| Supabase Client Setup | Low | Standard SDK configuration |
| RLS Policies | Low-Medium | Simple user_id-based policies |
| Database Schema | Low | Straightforward relational design |
| Realtime Subscriptions | Low | Built-in feature, no extra setup |
| Migration | Low | Clean path from Auth0 metadata |

### Estimated Implementation Time

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 1 day | Enable third-party auth, configure Auth0 Action |
| Schema | 1 day | Create tables, add RLS policies |
| Client Integration | 2 days | Supabase client setup, auth flow testing |
| Features | 3-5 days | Bookmarks, preferences, history UI |
| Testing | 1 day | RLS verification, edge cases |
| **Total** | **8-10 days** | |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| JWT claim mismatch | Low | High | Test Auth0 Action thoroughly |
| RLS policy bypass | Low | Critical | Use restrictive policies, audit |
| Connection limits | Low | Medium | Use transaction mode pooling |
| CORS issues | Low | Low | Standard CORS headers |

---

## Code Examples

### 1. Complete Auth0 + Supabase Setup

```typescript
// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import { Auth0Client } from '@auth0/auth0-spa-js';

let auth0Client: Auth0Client | null = null;
let supabaseClient: ReturnType<typeof createClient> | null = null;

export async function getAuth0Client() {
  if (!auth0Client) {
    auth0Client = new Auth0Client({
      domain: 'nxgen.eu.auth0.com',
      clientId: 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm',
      authorizationParams: {
        redirect_uri: window.location.origin + '/auth/callback',
        audience: 'https://nxgen.eu.auth0.com/api/v2/',
      },
    });
  }
  return auth0Client;
}

export async function getSupabaseClient() {
  if (!supabaseClient) {
    const auth0 = await getAuth0Client();
    
    supabaseClient = createClient(
      'https://temmzrunmzjiivogsbzz.supabase.co',
      'sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3U',
      {
        accessToken: async () => {
          try {
            return await auth0.getTokenSilently();
          } catch {
            return null; // Not authenticated
          }
        },
      }
    );
  }
  return supabaseClient;
}
```

### 2. Bookmark Service

```typescript
// services/bookmarks.ts
import { getSupabaseClient } from '../lib/supabase-client';

export interface Bookmark {
  id: string;
  item_type: 'document' | 'page' | 'video' | 'external';
  item_id: string;
  item_title: string;
  item_url: string;
  created_at: string;
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('id, item_type, item_id, item_title, item_url, created_at')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data ?? [];
}

export async function addBookmark(
  item: Omit<Bookmark, 'id' | 'created_at'>
): Promise<Bookmark> {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_bookmarks')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeBookmark(id: string): Promise<void> {
  const supabase = await getSupabaseClient();
  
  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
```

### 3. Realtime Subscription Hook

```typescript
// hooks/useRealtimeBookmarks.ts
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase-client';
import type { Bookmark } from '../services/bookmarks';

export function useRealtimeBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let channel: ReturnType<ReturnType<typeof getSupabaseClient>['channel']> | null;
    
    async function setup() {
      const supabase = await getSupabaseClient();
      
      // Initial fetch
      const { data } = await supabase
        .from('user_bookmarks')
        .select('*')
        .order('created_at', { ascending: false });
      
      setBookmarks(data ?? []);
      setLoading(false);
      
      // Subscribe to changes
      channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_bookmarks',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setBookmarks(prev => [payload.new as Bookmark, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setBookmarks(prev => prev.filter(b => b.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setBookmarks(prev =>
                prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b)
              );
            }
          }
        )
        .subscribe();
    }
    
    setup();
    
    return () => {
      if (channel) {
        getSupabaseClient().then(s => s.removeChannel(channel!));
      }
    };
  }, [userId]);

  return { bookmarks, loading };
}
```

### 4. Auth0 Action for Custom Claims

```javascript
// Auth0 Action: onExecutePostLogin
/**
 * Adds custom claims required for Supabase integration.
 * 
 * Required claims:
 * - role: 'authenticated' (required for Supabase RLS)
 * 
 * Optional claims:
 * - user_email: for easier RLS access
 * - app_metadata: for role-based access
 */

exports.onExecutePostLogin = async (event, api) => {
  // REQUIRED: Add authenticated role for Supabase RLS
  api.accessToken.setCustomClaim('role', 'authenticated');
  
  // OPTIONAL: Include email for RLS policies
  if (event.user.email) {
    api.accessToken.setCustomClaim('user_email', event.user.email);
  }
  
  // OPTIONAL: Include app_metadata roles
  const appMeta = event.user.app_metadata || {};
  if (appMeta.role) {
    api.accessToken.setCustomClaim('app_role', appMeta.role);
  }
  if (appMeta.teams) {
    api.accessToken.setCustomClaim('teams', appMeta.teams);
  }
};
```

---

## Sources

### Primary (HIGH confidence)
- Supabase Third-Party Auth: https://supabase.com/docs/guides/auth/third-party/overview
- Auth0 Integration: https://supabase.com/docs/guides/auth/third-party/auth0
- JWT Documentation: https://supabase.com/docs/guides/auth/jwts
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Connection Pooling: https://supabase.com/docs/guides/database/connecting-to-postgres

### Secondary (MEDIUM confidence)
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- CORS for Edge Functions: https://supabase.com/docs/guides/functions/cors
- Auth0 Actions: https://auth0.com/docs/customize/actions/triggers/post-user-registration

### Project Context
- Existing Auth0 setup: `nxgen.eu.auth0.com` with client ID `jqiJJISVmCmWWB46m0wMI7CO91KyliIm`
- Supabase project: `temmzrunmzjiivogsbzz`
- Deployment: Cloudflare Pages

---

## Metadata

**Confidence breakdown:**
- Third-party auth integration: HIGH — Official Supabase documentation, first-party Auth0 support
- RLS patterns: HIGH — Well-documented PostgreSQL feature, Supabase helpers
- Cloudflare integration: MEDIUM — Connection pooling documented, caching patterns standard
- Pricing: HIGH — Current Supabase pricing page verified

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (30 days — stable APIs, pricing may change quarterly)
