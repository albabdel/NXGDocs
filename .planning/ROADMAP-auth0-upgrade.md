# Roadmap: v5.0 Auth0 Integration Upgrade

## Milestone Overview

**Goal:** Upgrade Auth0 from limited /support portal authentication to full product-wide authentication with a "next level" logged-in experience that motivates users to voluntarily log in.

**Target State:**
- Site loads normally without login (no content gating)
- Logged-in users get personalized experience (bookmarks, history, preferences)
- Unified authentication across all NXGEN products (SSO)
- Supabase for user data storage with Row Level Security
- Automatic Zoho contact registration for matching domains

**Success Criteria:**
1. Users can log in via Auth0 from anywhere on the site
2. Logged-in users see: bookmarks, reading history, personalized homepage
3. SSO works across docs.nxgen.cloud and other NXGEN apps
4. User data stored securely in Supabase with RLS
5. Zoho contacts auto-created for users with matching email domains

---

## Requirements

### AUTH-01: Unified Auth0 Provider
- Auth0Provider wraps entire Docusaurus application
- SSO-aware login (no prompt=login)
- Silent authentication for returning users
- Session management via HttpOnly cookies

### AUTH-02: User Profile System
- Profile dropdown in navbar showing user avatar/name
- User preferences synced across devices
- Role-based content filtering (operator/manager/admin)
- Integration with existing Zoho contact data

### AUTH-03: Bookmarks Feature
- Bookmark button on every documentation page
- Bookmark list in sidebar
- Bookmarks page with search/filter
- Bookmarks stored in Supabase

### AUTH-04: Reading History
- Automatic tracking of visited pages
- "Continue reading" widget on homepage
- Reading history page with pagination
- Time spent tracking (opt-in)

### AUTH-05: Personalization
- Role-based homepage customization
- Dark mode preference sync
- Quick links (custom sidebar links)
- Notification preferences

### ZOHO-REG-01: Automatic Zoho Contact Registration
- When user logs in without existing Zoho contact
- If email domain matches allowed list (e.g., nxgen.io, partner domains)
- Automatically create Zoho Desk contact via API
- Only for users who should have support access

---

## Architecture Decision Record

### Decision 1: Supabase for User Data
**Context:** Need to store bookmarks, history, preferences for users.
**Options:**
- Auth0 user_metadata (16KB limit, not searchable)
- Cloudflare KV (already used, but limited query)
- Supabase PostgreSQL (full SQL, RLS, real-time)
**Decision:** Use Supabase with native Auth0 third-party auth.
**Rationale:** 
- Native Auth0 integration (first-class support)
- Row Level Security for automatic user isolation
- Unlimited storage, searchable, real-time sync
- Already have Supabase credentials in Keys.md

### Decision 2: HttpOnly Cookies for Sessions
**Context:** Need secure session management for static site.
**Options:**
- localStorage tokens (XSS vulnerable)
- sessionStorage tokens (still vulnerable, lost on close)
- HttpOnly cookies (most secure)
**Decision:** Maintain existing HttpOnly cookie pattern.
**Rationale:**
- JavaScript cannot access session tokens
- Already implemented in existing codebase
- Aligns with Auth0 best practices

---

## Phases

| Phase | Name | Status | Plans |
|-------|------|--------|-------|
| 30 | Auth Foundation Upgrade | Planned | 3 plans |
| 31 | User Profile & Preferences | Planned | 2 plans |
| 32 | Bookmarks & History | Planned | 2 plans |
| 33 | Personalization Features | Planned | 2 plans |

---

## Phase 30: Auth Foundation Upgrade

**Goal:** Extend Auth0 to entire documentation site with unified session management.

**Requirements:** AUTH-01, AUTH-02 (partial)

**Success Criteria:**
1. Auth0Provider wraps entire Docusaurus app
2. Login/logout buttons in navbar
3. Silent authentication for returning users
4. Session validation endpoint works
5. SSO preserved (no prompt=login)

**Plans:**
- [x] 30-01-PLAN.md — Auth0Provider integration and navbar auth UI ✓
- [x] 30-02-PLAN.md — Session management and validation ✓
- [ ] 30-03-PLAN.md — Auth0 Actions for custom claims

---

## Phase 31: User Profile & Preferences

**Goal:** Create user profile system with synced preferences.

**Requirements:** AUTH-02, AUTH-05 (partial)

**Success Criteria:**
1. Profile dropdown shows user avatar, name, email
2. Preferences page with theme, notification settings
3. Dark mode preference synced across devices
4. Profile data stored in Supabase

**Plans:**
- [ ] 31-01-PLAN.md — Supabase setup with Auth0 third-party auth
- [ ] 31-02-PLAN.md — User profile UI and preferences sync

---

## Phase 32: Bookmarks & History

**Goal:** Implement core "next level" features that motivate login.

**Requirements:** AUTH-03, AUTH-04

**Success Criteria:**
1. Bookmark button on every docs page
2. Bookmark list in sidebar (last 10) and dedicated page
3. Reading history tracked automatically
4. "Continue reading" widget on homepage
5. All data stored in Supabase with RLS

**Plans:**
- [ ] 32-01-PLAN.md — Bookmark system (UI + API)
- [ ] 32-02-PLAN.md — Reading history and continue reading widget

---

## Phase 33: Personalization Features

**Goal:** Add personalization that makes the site feel customized.

**Requirements:** AUTH-05

**Success Criteria:**
1. Role-based homepage sections
2. Quick links (custom sidebar links)
3. Search history
4. Reading progress tracking

**Plans:**
- [ ] 33-01-PLAN.md — Role-based homepage and quick links
- [ ] 33-02-PLAN.md — Search history and reading progress

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SSO breaks | Low | High | Preserve no-prompt pattern, test with GCXONE |
| Existing sessions invalid | Medium | Medium | Grace period for session migration |
| Supabase RLS bypass | Low | Critical | Restrictive policies, security audit |
| Auth0 rate limits | Low | Medium | Implement caching, monitor usage |

---

## Dependencies

### External Services
- Auth0 (nxgen.eu.auth0.com) — Authentication
- Supabase (temmzrunmzjiivogsbzz) — User data storage
- Cloudflare Pages — Hosting and functions
- Cloudflare KV — Session caching

### NPM Packages to Add
- `@supabase/supabase-js` — Supabase client
- `@auth0/auth0-react` — Auth0 React SDK (may already be installed)

### Environment Variables to Add
- `SUPABASE_URL` — https://temmzrunmzjiivogsbzz.supabase.co
- `SUPABASE_ANON_KEY` — From Keys.md
- `AUTH0_CLIENT_SECRET` — For Management API

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 30. Auth Foundation | 1 week | None |
| 31. User Profile | 1 week | Phase 30 |
| 32. Bookmarks & History | 1.5 weeks | Phase 31 |
| 33. Personalization | 1 week | Phase 32 |
| **Total** | **4.5 weeks** | |

---

## Sources

- `.planning/research/auth0-upgrade-FEATURES.md` — Auth0 capabilities research
- `.planning/research/auth0-upgrade-UX-PATTERNS.md` — UX patterns research
- `.planning/research/auth0-upgrade-SUPABASE.md` — Supabase integration research
- `.planning/research/auth0-upgrade-EXISTING-AUTH.md` — Current auth analysis
- `SUPPORT-CONTEXT.md` — Existing auth flow documentation
- `Keys.md` — Service credentials

---

*Created: 2026-04-01*
*Last updated: 2026-04-01*
