---
phase: 16-auth-foundation
plan: 01
subsystem: admin-auth
tags: [authentication, oauth, session-management, admin-dashboard]
duration: 1 day
completed_date: 2026-03-17
dependencies:
  requires: []
  provides: [admin-authentication, session-management, protected-routes]
  affects: [admin-pages, sanity-user-tracking]
tech_stack:
  added: []
  patterns: [HMAC-signed-cookies, React-Context, HttpOnly-session]
key_files:
  created:
    - functions/lib/admin-session.ts
    - functions/lib/sync-admin-user.ts
    - functions/admin-auth-callback.ts
    - functions/admin-session.ts
    - functions/admin-logout.ts
    - classic/src/contexts/AdminAuthContext.tsx
    - classic/src/hooks/useAdminAuth.ts
    - classic/src/hooks/useCurrentUser.ts
    - classic/src/components/Admin/ProtectedRoute.tsx
    - classic/src/pages/admin-login.tsx
    - classic/src/pages/admin/index.tsx
    - studio/schemaTypes/adminUser.ts
  modified:
    - classic/src/theme/Root.tsx
    - studio/schemaTypes/index.ts
decisions:
  - "Reuse Zoho OAuth for admin authentication (already working, org-scoped)"
  - "HttpOnly cookies for session (secure, no JS access)"
  - "HMAC-SHA256 signing with ZOHO_SESSION_SECRET"
  - "All org members are admins initially (role system extensible)"
  - "Non-blocking Sanity user sync on login"
metrics:
  files_created: 12
  files_modified: 2
  total_lines_added: 1107
  total_lines_changed: 2307
  commit_hash: d132d57
---

# Phase 16 Plan 01: Auth Foundation Summary

## One-Liner
Implemented admin authentication foundation with Zoho OAuth, HMAC-signed HttpOnly session cookies, React context/hooks, protected routes, and Sanity user tracking for the v2.0 Admin Command Center.

## What Was Built

### 1. Admin Session Management
- **File:** `functions/lib/admin-session.ts`
- HMAC-SHA256 signed session cookies (reusing crypto utilities from zoho-session.ts)
- Cookie: `nxgen_admin_session`, HttpOnly, Secure, SameSite=Lax, 24h expiry
- Functions: `createAdminSession`, `validateAdminSession`, `destroyAdminSession`, `refreshAdminSession`

### 2. OAuth Callback Handler
- **File:** `functions/admin-auth-callback.ts`
- Exchanges Zoho OAuth code for access token
- Fetches user profile from Zoho userinfo endpoint
- Verifies org membership (OrganizationId matches ZOHO_ORG_ID)
- Creates session and redirects to /admin
- Non-blocking Sanity user sync

### 3. Session Endpoints
- **File:** `functions/admin-session.ts` - GET endpoint validates session, returns user data
- **File:** `functions/admin-logout.ts` - POST endpoint clears session cookie

### 4. React Auth Context
- **File:** `classic/src/contexts/AdminAuthContext.tsx`
- `AdminAuthProvider` wraps app in Root.tsx
- `useAdminAuth` hook returns user, isAuthenticated, isLoading, login, logout
- Session validation on mount via /admin-session endpoint

### 5. Auth Hooks
- **File:** `classic/src/hooks/useAdminAuth.ts` - Re-export from context
- **File:** `classic/src/hooks/useCurrentUser.ts` - Returns user with isAdmin flag

### 6. Protected Routes
- **File:** `classic/src/components/Admin/ProtectedRoute.tsx`
- Shows loading spinner while checking session
- Redirects to /admin-login if not authenticated
- Wraps admin pages

### 7. Admin Pages
- **File:** `classic/src/pages/admin-login.tsx` - Login page with Zoho OAuth button
- **File:** `classic/src/pages/admin/index.tsx` - Protected admin dashboard placeholder

### 8. Sanity Schema
- **File:** `studio/schemaTypes/adminUser.ts`
- Fields: zohoId, email, name, role, orgId, lastLoginAt, loginCount, isActive, createdAt
- Roles: admin, editor, reviewer (extensible)

### 9. User Sync
- **File:** `functions/lib/sync-admin-user.ts`
- Creates/updates admin users in Sanity on login
- Tracks login count and last login timestamp

## Authentication Flow

```
1. User visits /admin → ProtectedRoute checks session
2. If not authenticated → redirect to /admin-login
3. User clicks "Sign in with Zoho" → OAuth redirect
4. Zoho authentication → redirect to /admin-auth-callback
5. Callback exchanges code → fetches profile → verifies org
6. Session cookie created → user synced to Sanity → redirect to /admin
7. /admin-session validates cookie → returns user data
```

## Environment Variables Required

| Variable | Source |
|----------|--------|
| `ZOHO_CLIENT_ID` | Zoho API Console |
| `ZOHO_CLIENT_SECRET` | Zoho API Console |
| `ZOHO_ORG_ID` | Zoho Desk Admin |
| `ZOHO_SESSION_SECRET` | Generate 32-char secret |
| `SANITY_PROJECT_ID` | Sanity Dashboard |
| `SANITY_DATASET` | Sanity Dashboard |
| `SANITY_API_TOKEN` | Sanity API Settings |

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- ✅ Build passes (`npm run build --prefix classic`)
- ✅ All files exist with correct content
- ✅ AdminAuthProvider wraps app in Root.tsx
- ✅ Sanity schema validates correctly
- ✅ Commit created: d132d57

## Self-Check: PASSED

All files verified:
- 12 files created
- 2 files modified
- Build exits 0 with SUCCESS
- Commit d132d57 exists in git log

## Next Steps

Phase 17: Admin Shell & Sidebar Navigation
- Build AdminLayout component with sidebar
- Create admin route structure (/admin/*)
- Implement collapsible sidebar with navigation
- Add header with user menu and notifications
