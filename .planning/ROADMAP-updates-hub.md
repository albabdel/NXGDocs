# Roadmap: v4.0 Updates Hub

## Milestone Goal

Create a unified, Sanity-powered Updates Hub that consolidates all platform updates (announcements, releases, bug fixes, roadmap items) into a single, filterable, searchable interface. One hub, not separate pages per category.

## Why This Matters

**Current Pain Points:**
- Updates scattered across multiple pages (/releases, /roadmap)
- No central place for announcements or bug fixes
- Separate schemas create duplicated logic and inconsistent UI
- Users must navigate multiple pages to understand platform evolution

**Target State:**
- Single `update` document type in Sanity (type-driven, not schema-per-type)
- One `/updates` hub with tab filtering
- Card layouts that adapt to update type
- Detail pages at `/updates/[slug]`
- Clean, unified editing experience in Sanity Studio

---

## Phases

### Phase 29: Updates Hub Foundation
**Goal**: Build the unified Updates Hub with Sanity schema, frontend page, and filtering.
**Depends on**: Phase 28 (v3.0 complete)
**Requirements**: UHUB-01, UHUB-02, UHUB-03, UHUB-04, UHUB-05, UHUB-06
**Success Criteria** (what must be TRUE):
  1. Sanity `update` schema exists with type enum (announcement, release, bugfix, roadmap)
  2. Type-specific conditional fields exist (version for releases, status for bugfixes, roadmapStatus for roadmap)
  3. `/updates` page exists with tab navigation (All, Announcements, Releases, Bug Fixes, Roadmap)
  4. Card components render differently based on type
  5. Detail page `/updates/[slug]` exists with type-specific layouts
  6. GROQ queries fetch and filter updates efficiently
**Plans**: 3 plans

Plans:
- [x] 29-01-PLAN.md — Create Sanity update schema with type enum and conditional fields
- [ ] 29-02-PLAN.md — Add GROQ queries and generate sanity-updates.generated.json
- [ ] 29-03-PLAN.md — Build Updates hub page, type-specific cards, and detail page

---

## Requirements Index

### Phase 29: Updates Hub
- **UHUB-01**: Create Sanity `update` schema with type enum and conditional fields
- **UHUB-02**: Build `/updates` hub page with tabs and filtering
- **UHUB-03**: Create type-specific card components
- **UHUB-04**: Build detail page `/updates/[slug]` with type-specific layouts
- **UHUB-05**: Create GROQ queries for efficient fetching
- **UHUB-06**: Migrate existing release/roadmap data to update schema (optional)

---

## Architecture Decisions

### Single Schema Approach
Use ONE `update` document type with a `type` field, NOT separate schemas per category.

**Why:**
- Consistent UI across all update types
- Single query for all updates
- Easy to add new types later
- Studio UX stays clean

### Type-Driven Rendering
Card and detail layouts adapt based on `type` field, not route.

**Pattern:**
```tsx
switch (update.type) {
  case 'release': return <ReleaseCard {...update} />
  case 'bugfix': return <BugfixCard {...update} />
  case 'roadmap': return <RoadmapCard {...update} />
  case 'announcement': return <AnnouncementCard {...update} />
}
```

### Sanity Studio Field Groups
Group fields to keep editor experience clean:
- Main: title, type, publishedAt
- Content: excerpt, content
- Type-specific: conditional fields based on type

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Voting/upvoting | Requires auth + storage |
| Comments | Requires auth + storage |
| Email subscriptions | Operational overhead |
| RSS feed | Deferred to future |
| Search across all content | Scope - focus on updates |

---

*Created: 2026-04-01*
*Based on: User PRD for Updates Hub*
