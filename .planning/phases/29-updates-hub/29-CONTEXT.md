# Phase 29: Updates Hub — Context

**Created:** 2026-04-01
**Status:** Planning

---

## User Vision

A unified Updates Hub that consolidates all platform updates into a single, filterable, searchable interface. No more scattered pages — one hub for everything.

---

## Decisions

### LOCKED — Must Implement Exactly

| Decision | Rationale |
|----------|-----------|
| Single `update` document type | NOT separate schemas per category. One schema with `type` enum. |
| Type enum: announcement, release, bugfix, roadmap | These four categories cover all update needs. |
| Type-specific conditional fields | Releases get `version`, bugfixes get `status`, roadmap gets `roadmapStatus`. |
| One hub page only | NOT separate pages per category. `/updates` is the only entry point. |
| Tab navigation | Tabs: All, Announcements, Releases, Bug Fixes, Roadmap. Filter by type. |
| Card design varies by type | Release cards show version badge. Bugfix cards are minimal. Roadmap cards show status badge. |
| Detail page at `/updates/[slug]` | Single detail route, type determines layout. |
| Sanity Studio field groups | Group fields: Main (title, type, publishedAt), Content (excerpt, content), Type-specific (conditional). |

### Type-Specific Fields (Locked)

**For Releases:**
- `version` (string)
- `releaseNotes` object with `new[]`, `improvements[]`, `fixes[]` arrays

**For Bug Fixes:**
- `status`: fixed | monitoring
- `severity`: low | medium | high (optional)

**For Roadmap:**
- `roadmapStatus`: planned | in_progress | completed
- `targetDate` (optional)

### UX Rules (Locked)

1. Keep bug fixes SHORT — don't let them look like blog posts
2. Roadmap should feel like progress tracking, not content dumping
3. Announcements render as blog-style title + excerpt
4. Release cards show version badge and sections preview

---

## OpenCode's Discretion

| Area | Guidance |
|------|----------|
| Search implementation | Use existing search patterns from roadmap page |
| Card styling | Use existing glass tokens and design system |
| GROQ query optimization | Optimize for common filters (type, date desc) |
| Mobile responsiveness | Follow existing responsive patterns |
| Empty states | Create helpful empty states for each tab |

---

## Deferred Ideas

| Idea | Why Deferred |
|------|--------------|
| Tags system | Can add later without breaking structure |
| Relations (release → bugfixes) | Complexity for future |
| Localization | Not a current priority |
| RSS feed | Future enhancement |

---

## Technical Context

**Existing patterns to follow:**
- `/roadmap` page — filtering, search, accordion (Phase 08)
- `/releases` page — card list, detail pages (Phase 07)
- Sanity GROQ queries — already established pattern
- CSS tokens — use glassmorphism system from v3.0

**Schema location:** `studio/schemaTypes/`
**Frontend location:** `classic/src/pages/`
**Data pipeline:** `scripts/fetch-sanity-content.js`

---

## Reference PRD

See user-provided PRD in workflow prompt for full field definitions and UX specifications.
