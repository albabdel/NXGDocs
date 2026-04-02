// classic/src/lib/supabase.ts
// Supabase client with Auth0 third-party authentication
//
// Purpose:
//   - Provide Supabase client configured with Auth0 JWT
//   - Enable Row Level Security based on Auth0 user ID
//   - Support both React context and standalone usage
//
// Usage:
//   // In React components (recommended):
//   const { getAccessTokenSilently } = useAuth0();
//   const supabase = createSupabaseClient(() => getAccessTokenSilently());
//
//   // Or use the hook:
//   const supabase = useSupabase();
//
// Reference:
//   - https://supabase.com/docs/guides/auth/third-party/auth0
//   - .planning/research/auth0-upgrade-SUPABASE.md

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Supabase URL and anon key are safe to expose publicly (they're meant for client-side use)
// The anon key is a publishable key with Row Level Security enforcing data access
const SUPABASE_URL = 'https://temmzrunmzjiivogsbzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3UX';

/**
 * Get Supabase URL from environment or use default.
 * In Docusaurus, environment variables need special handling for client-side.
 */
function getSupabaseUrl(): string {
  // For client-side (browser), process.env may not be available
  let url = SUPABASE_URL;

  // Try to get from environment (works in Node.js/server context)
  if (typeof process !== 'undefined' && process.env) {
    url = process.env.SUPABASE_URL || url;
  }

  return url;
}

/**
 * Get Supabase anon key from environment or use default.
 * The anon key is public and safe to expose - RLS enforces security.
 */
function getSupabaseAnonKey(): string {
  let key = SUPABASE_ANON_KEY;

  if (typeof process !== 'undefined' && process.env) {
    key = process.env.SUPABASE_ANON_KEY || key;
  }

  return key;
}

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TokenGetter = () => Promise<string | null | undefined>;

export interface SupabaseClientOptions {
  accessToken: TokenGetter;
}

// ---------------------------------------------------------------------------
// Client Factory
// ---------------------------------------------------------------------------

// Singleton for non-React contexts (cleared on logout)
let supabaseClientSingleton: SupabaseClient | null = null;
let currentTokenGetter: TokenGetter | null = null;

/**
 * Create a Supabase client configured with Auth0 token provider.
 *
 * @param getToken - Function that returns the Auth0 access token
 * @returns Supabase client instance
 */
export function createSupabaseClient(getToken: TokenGetter): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: async () => {
      try {
        const token = await getToken();
        return token ?? null;
      } catch (error) {
        // Not authenticated or token expired
        console.debug('[Supabase] Token fetch failed:', error);
        return null;
      }
    },
  });
}

/**
 * Get or create the singleton Supabase client.
 * Use this for non-React contexts where you have a token getter.
 *
 * @param getToken - Function that returns the Auth0 access token
 * @returns Supabase client instance (singleton)
 */
export function getSupabaseClient(getToken: TokenGetter): SupabaseClient {
  // If token getter changed or client doesn't exist, create new one
  if (!supabaseClientSingleton || currentTokenGetter !== getToken) {
    supabaseClientSingleton = createSupabaseClient(getToken);
    currentTokenGetter = getToken;
  }
  return supabaseClientSingleton;
}

/**
 * Clear the singleton Supabase client.
 * Call this on logout to ensure fresh client on next login.
 */
export function clearSupabaseClient(): void {
  supabaseClientSingleton = null;
  currentTokenGetter = null;
}

// ---------------------------------------------------------------------------
// React Hook (for use with @auth0/auth0-react)
// ---------------------------------------------------------------------------

/**
 * React hook for Supabase client with Auth0 integration.
 *
 * Usage:
 *   ```tsx
 *   import { useSupabase } from '@site/src/lib/supabase';
 *   import { useAuth0 } from '@auth0/auth0-react';
 *
 *   function MyComponent() {
 *     const { getAccessTokenSilently } = useAuth0();
 *     const supabase = useSupabase(getAccessTokenSilently);
 *
 *     // Use supabase client...
 *   }
 *   ```
 *
 * Note: This is not a true React hook (no useState/useEffect) but follows
 * React hook naming convention for consistency.
 */
export function useSupabase(getToken: TokenGetter): SupabaseClient {
  return getSupabaseClient(getToken);
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default {
  createSupabaseClient,
  getSupabaseClient,
  clearSupabaseClient,
  useSupabase,
};
