---
phase: 31-user-profile
plan: 01
subsystem: auth-data
tags: [supabase, auth0, rls, user-profile, database]
dependencies:
  requires: [30-01, 30-02, 30-03]
  provides: [supabase-client, user-profile-service, database-schema]
  affects: []
tech_stack:
  added: ["@supabase/supabase-js@^2.45.0"]
  patterns: ["third-party-auth", "row-level-security", "service-layer"]
key_files:
  created:
    - path: classic/src/lib/supabase.ts
      purpose: Supabase client with Auth0 token integration
    - path: .supabase/schema/user-tables.sql
      purpose: Database schema with RLS policies
    - path: functions/lib/supabase-admin.ts
      purpose: Server-side Supabase admin client
    - path: classic/src/services/user-profile.ts
      purpose: User profile and preferences CRUD service
  modified:
    - path: classic/package.json
      change: Added @supabase/supabase-js dependency
decisions:
  - Use Auth0 JWT directly with Supabase third-party auth (no Auth0 Actions for role claim)
  - Create service-layer for user profile operations
  - Use auth.jwt() ->> 'sub' pattern for RLS policies
metrics:
  duration: "15 minutes"
  tasks_completed: 3
  files_created: 4
  files_modified: 1
  completed_date: "2026-04-01"
---

# Phase 31 Plan 01: Supabase Setup Summary

## One-Liner

Supabase integration with Auth0 third-party authentication, user profile database schema with Row Level Security, and service layer for profile/preferences operations.

## What Was Done

### Task 1: Supabase Client with Auth0 Integration
- Installed @supabase/supabase-js dependency
- Created `classic/src/lib/supabase.ts` with:
  - Factory function for Supabase client with Auth0 token provider
  - Singleton pattern for non-React contexts
  - React hook wrapper for use with @auth0/auth0-react
  - Clear function for logout handling

### Task 2: Database Schema with Row Level Security
- Created `.supabase/schema/user-tables.sql` with:
  - `user_profiles` table (id, auth0_user_id, email, display_name, avatar_url, role)
  - `user_preferences` table (user_id, theme, language, sidebar_collapsed, notifications)
  - RLS policies using `auth.jwt() ->> 'sub'` for user isolation
  - Updated_at triggers for automatic timestamp management

### Task 3: Server-Side and Client-Side Services
- Created `functions/lib/supabase-admin.ts`:
  - Server-side Supabase client with service role key
  - Bypasses RLS for admin operations
- Created `classic/src/services/user-profile.ts`:
  - Full CRUD operations for user profiles
  - Preferences management with defaults
  - Convenience functions for common updates (theme, language, sidebar)

## Deviations from Plan

None - plan executed exactly as written.

## User Actions Required

After this plan is complete, the user must perform manual configuration in Supabase:

### 1. Enable Third-Party Auth
1. Go to Supabase Dashboard
2. Navigate to Authentication > Third-Party Auth
3. Click "Add Integration"
4. Select Auth0
5. Enter tenant: `nxgen.eu`
6. Save

### 2. Run SQL Schema Migration
1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Copy SQL from `.supabase/schema/user-tables.sql`
4. Run the script
5. Verify tables created with RLS enabled

### 3. Set Environment Variables (Production)
- `SUPABASE_URL`: https://temmzrunmzjiivogsbzz.supabase.co
- `SUPABASE_ANON_KEY`: sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3U
- `SUPABASE_SERVICE_KEY`: (from Supabase Dashboard - Settings > API)

## Key Technical Details

### Auth0 + Supabase Integration
- Supabase verifies Auth0 JWTs using JWKS endpoint
- RLS policies access JWT claims via `auth.jwt() ->> 'sub'`
- Client passes Auth0 token via `accessToken` option in createClient

### Row Level Security Pattern
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth0_user_id = (SELECT auth.jwt() ->> 'sub'));
```

### Service Layer Pattern
```typescript
// Client-side usage
const { getAccessTokenSilently } = useAuth0();
const supabase = createSupabaseClient(() => getAccessTokenSilently());
const profile = await getUserProfile(supabase);
```

## Commits

| Commit | Message |
|--------|---------|
| ecd925e | feat(31-01): install Supabase client and create Auth0 integration |
| cc1337a | feat(31-01): create database schema with Row Level Security |
| 2b31cd9 | feat(31-01): create server-side and client-side Supabase services |

## Verification

### Automated (Passed)
- [x] @supabase/supabase-js installed
- [x] Supabase client exports correctly
- [x] Schema file created
- [x] Services export correctly
- [x] TypeScript compiles without errors in new files

### Manual (Requires User Action)
- [ ] Enable Third-Party Auth in Supabase dashboard
- [ ] Run SQL schema in Supabase SQL Editor
- [ ] Verify tables created with RLS enabled
- [ ] Test profile creation after Auth0 login

## Next Steps

1. User completes manual Supabase configuration
2. Phase 31 Plan 02: Implement user profile UI components
3. Phase 31 Plan 03: Integrate profile with navigation
4. Phase 31 Plan 04: Add bookmarks feature

---

*SUMMARY.md created: 2026-04-01T18:30:00Z*

## Self-Check: PASSED

- [x] All 4 created files verified on disk
- [x] All 3 commits verified in git history
- [x] SUMMARY.md created at correct location
