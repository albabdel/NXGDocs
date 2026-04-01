---
phase: 30-auth-foundation
plan: 01
subsystem: auth
tags: [auth0, react, authentication, navbar, sso]

# Dependency graph
requires: []
provides:
  - Auth0Provider wrapper for entire Docusaurus app
  - Authentication UI in navbar (login button, profile dropdown)
  - Auth callback page handling both Auth0 SDK and Zoho flows
  - Session state available via useAuth0() hook throughout app
affects: [31-user-profile, 32-bookmarks-history, 33-personalization]

# Tech tracking
tech-stack:
  added: ["@auth0/auth0-react@^2.16.1"]
  patterns: ["Auth0Provider wrapper", "useAuth0 hook", "conditional auth UI"]

key-files:
  created:
    - classic/src/components/Auth/LoginButton.tsx
    - classic/src/components/Auth/ProfileDropdown.tsx
    - classic/src/components/Auth/AuthCallback.tsx
    - classic/src/components/Auth/index.ts
    - classic/src/css/components/navbar-auth.css
  modified:
    - classic/src/theme/Root.tsx
    - classic/src/pages/auth/callback.tsx
    - classic/src/theme/Navbar/Content/index.tsx
    - classic/package.json

key-decisions:
  - "Use existing Auth0 application (same Client ID as support portal) for seamless SSO"
  - "Use cacheLocation=memory for security (not localStorage)"
  - "No prompt:login in authorization params to preserve SSO across NXGEN apps"
  - "Dual callback handling: Auth0 SDK for general auth, Zoho for support portal"

patterns-established:
  - "Auth0Provider wraps entire app at Root.tsx level"
  - "useAuth0 hook provides auth state anywhere in component tree"
  - "Conditional navbar rendering: loading → spinner, authenticated → profile, unauthenticated → login"

requirements-completed: [AUTH-01]

# Metrics
duration: 15min
completed: 2026-04-01
---

# Phase 30 Plan 01: Auth0Provider Integration and Navbar Auth UI Summary

**Auth0Provider wrapper with existing Auth0 app for SSO, navbar authentication UI with login button and profile dropdown, dual callback handling for Auth0 SDK and Zoho flows.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-01T17:59:42Z
- **Completed:** 2026-04-01T18:15:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Auth0Provider wraps entire Docusaurus application for site-wide auth
- Login button in navbar when unauthenticated with gold/blue styling
- Profile dropdown in navbar when authenticated with avatar, profile/settings/logout options
- Dual callback handler preserves existing Zoho support portal auth flow
- SSO preserved using same Auth0 app as support portal

## Task Commits

Each task was committed atomically:

1. **task 1: Install Auth0 SDK and create Auth components** - `21d34ab` (feat) - *previously committed*
2. **task 2: Wrap Docusaurus with Auth0Provider** - `3b28416` (feat)
3. **task 3: Add authentication UI to navbar** - `9931f0c` (feat)

**Plan metadata:** Pending final commit (docs: complete plan)

## Files Created/Modified

- `classic/src/components/Auth/LoginButton.tsx` - Login button with Auth0 loginWithRedirect, gold/blue styling
- `classic/src/components/Auth/ProfileDropdown.tsx` - User avatar dropdown with profile/settings/logout menu
- `classic/src/components/Auth/AuthCallback.tsx` - Auth0 SDK callback handler with redirect state
- `classic/src/components/Auth/index.ts` - Barrel export for Auth components
- `classic/src/theme/Root.tsx` - Auth0Provider wrapper with memory cache, refresh tokens
- `classic/src/pages/auth/callback.tsx` - Dual callback handler (Auth0 SDK + Zoho)
- `classic/src/theme/Navbar/Content/index.tsx` - Navbar auth section with conditional rendering
- `classic/src/css/components/navbar-auth.css` - Styles for login button, profile dropdown, mobile responsive
- `classic/package.json` - Added @auth0/auth0-react dependency

## Decisions Made

1. **Use existing Auth0 application** - Same Client ID as support portal (`jqiJJISVmCmWWB46m0wMI7CO91KyliIm`) enables seamless SSO across all NXGEN apps
2. **cacheLocation="memory"** - Using memory cache instead of localStorage for security (prevents XSS token access)
3. **No prompt:login** - Deliberately omitted to preserve SSO; users authenticated in other NXGEN apps are auto-authenticated
4. **Dual callback handler** - Auth callback page detects callback type (code vs id_token) and routes to appropriate handler

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components compiled and committed successfully.

## User Setup Required

**External services require manual configuration.** See plan frontmatter `user_setup` section for:

1. **Auth0 Dashboard Configuration:**
   - Add docs URLs to existing Auth0 Application allowed callbacks:
     - `https://docs.gcxone.com/auth/callback`
     - `http://localhost:3000/auth/callback`
   - Add allowed logout URLs:
     - `https://docs.gcxone.com`
     - `http://localhost:3000`
   - Add allowed web origins:
     - `https://docs.gcxone.com`
     - `http://localhost:3000`

2. **Environment Variables:**
   - `AUTH0_CLIENT_SECRET` - For Management API access (from Auth0 Dashboard → Applications → Settings)

## Next Phase Readiness

- Auth foundation complete with Auth0Provider and navbar UI
- useAuth0() hook available throughout app for auth state
- Ready for Phase 30-02: Session management and validation
- Ready for Phase 30-03: Auth0 Actions for custom claims
- Blocker: Auth0 dashboard URLs must be configured before production testing

---
*Phase: 30-auth-foundation*
*Completed: 2026-04-01*
