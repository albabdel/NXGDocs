// functions/lib/supabase-admin.ts
// Server-side Supabase client with service role key
//
// Purpose:
//   - Provide Supabase admin client for server-side operations
//   - Bypass Row Level Security for admin operations
//   - Used by Cloudflare Pages Functions for backend operations
//
// Environment variables required:
//   SUPABASE_URL         — Supabase project URL
//   SUPABASE_SERVICE_KEY — Service role key (keep secret!)
//
// Security:
//   - Service role key bypasses RLS - only use server-side
//   - Never expose service key to client
//   - Use anon key for client-side operations
//
// Reference:
//   - https://supabase.com/docs/guides/api#api-keys
//   - .planning/research/auth0-upgrade-SUPABASE.md

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SupabaseEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

// ---------------------------------------------------------------------------
// Admin Client Factory
// ---------------------------------------------------------------------------

/**
 * Create a Supabase admin client with service role key.
 * 
 * Service role key bypasses Row Level Security, so use carefully.
 * Only call this from server-side code (Cloudflare Functions).
 *
 * @param env - Environment with SUPABASE_URL and SUPABASE_SERVICE_KEY
 * @returns Supabase client with admin privileges
 */
export function getSupabaseAdmin(env: SupabaseEnv): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ---------------------------------------------------------------------------
// Default values (for local development)
// ---------------------------------------------------------------------------

const SUPABASE_URL = 'https://temmzrunmzjiivogsbzz.supabase.co';
// Service key must come from environment - NEVER hardcode this!

/**
 * Create Supabase admin client with optional URL override.
 * Falls back to hardcoded URL if env.SUPABASE_URL not set.
 * Service key MUST be provided via environment.
 */
export function createSupabaseAdmin(
  serviceKey: string,
  url?: string,
): SupabaseClient {
  return createClient(url || SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
