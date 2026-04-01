# Phase 29: Updates Hub — Research

**Researched:** 2026-04-01
**Domain:** Sanity schema design, type-driven rendering, unified filtering, detail pages
**Confidence:** HIGH (based on existing release/roadmap patterns and established architecture)
**Dependency:** Phase 28 (v3.0 complete)

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UHUB-01 | Create Sanity `update` schema with type enum and conditional fields | Use `hidden: ({parent}) => parent?.type !== 'release'` pattern from landingPage.ts |
| UHUB-02 | Build `/updates` hub page with tabs and filtering | Adapt roadmap.tsx filtering pattern; tabs replace status buttons |
| UHUB-03 | Create type-specific card components | Type-driven switch statement; Card component from UI library |
| UHUB-04 | Build detail page `/updates/[slug]` with type-specific layouts | Docusaurus dynamic route pattern: `src/pages/updates/[slug].tsx` |
| UHUB-05 | Create GROQ queries for efficient fetching | Extend fetch-sanity-content.js with `getUpdatesQuery()` |
| UHUB-06 | Migrate existing release/roadmap data to update schema (optional) | Data migration scripts; not required for launch |

---

## Summary

Phase 29 creates a unified Updates Hub that consolidates all platform updates into a single, filterable interface. The key innovation is using ONE Sanity `update` document type with a `type` enum, rather than separate schemas per category. This approach:

- Provides a single query for all updates
- Enables consistent UI across update types
- Makes adding new types trivial
- Keeps Studio UX clean and discoverable

**Critical constraint from user:** Single `update` document type — NOT separate schemas per category.

---

## Standard Stack

### Core (all already installed — zero new dependencies)

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| `react` | ^18.x | Component framework | Already installed |
| `framer-motion` | ^11.x | Animations | Already installed (see roadmap.tsx) |
| `lucide-react` | ^0.x | Icons | Already installed |
| `@docusaurus/theme-common` | ^3.x | Layout, Link | Docusaurus built-in |
| `class-variance-authority` | ^0.7.1 | Type-safe variants | Already installed (Phase 26) |

### Existing UI Components Available

| Component | Location | Usage |
|-----------|----------|-------|
| `Card` | `src/components/ui/card.tsx` | Base card with glassmorphism styling |
| `Button` | `src/components/ui/button.tsx` | CVA-based button variants |
| `Dialog` | `src/components/ui/dialog.tsx` | Modal dialogs |

---

## Architecture Patterns

### Pattern 1: Single Schema with Type Enum

**What:** One `update` document type with `type` field controlling conditional fields and UI rendering.

**Why:** Consistent data model, single GROQ query, easy to extend with new types.

**Sanity Schema Structure:**
```typescript
// studio/schemaTypes/update.ts
export const updateType = defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  fields: [
    // Main group (always visible)
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Announcement', value: 'announcement' },
          { title: 'Release', value: 'release' },
          { title: 'Bug Fix', value: 'bugfix' },
          { title: 'Roadmap', value: 'roadmap' },
        ],
        layout: 'radio',
      },
      initialValue: 'announcement',
    }),
    defineField({
      name: 'publishedAt',
      type: 'date',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    
    // Content group
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 2,
      description: 'Short summary for card display',
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    
    // Type-specific: Release
    defineField({
      name: 'version',
      type: 'string',
      hidden: ({parent}) => parent?.type !== 'release',
    }),
    defineField({
      name: 'releaseNotes',
      type: 'object',
      hidden: ({parent}) => parent?.type !== 'release',
      fields: [
        defineField({ name: 'new', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'improvements', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'fixes', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    
    // Type-specific: Bug Fix
    defineField({
      name: 'bugfixStatus',
      type: 'string',
      options: {
        list: [
          { title: 'Fixed', value: 'fixed' },
          { title: 'Monitoring', value: 'monitoring' },
        ],
      },
      hidden: ({parent}) => parent?.type !== 'bugfix',
    }),
    defineField({
      name: 'severity',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
        ],
      },
      hidden: ({parent}) => parent?.type !== 'bugfix',
    }),
    
    // Type-specific: Roadmap
    defineField({
      name: 'roadmapStatus',
      type: 'string',
      options: {
        list: [
          { title: 'Planned', value: 'planned' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Completed', value: 'completed' },
        ],
      },
      hidden: ({parent}) => parent?.type !== 'roadmap',
    }),
    defineField({
      name: 'targetDate',
      type: 'string',
      description: 'e.g., "Q2 2026" or "Sprint 2026-06"',
      hidden: ({parent}) => parent?.type !== 'roadmap',
    }),
  ],
});
```

**Pattern from existing code:** See `landingPage.ts:360` for `hidden: ({parent}) => parent?.videoSource !== 'mux'` conditional field pattern.

### Pattern 2: Type-Driven Card Rendering

**What:** A single card component that renders different layouts based on `update.type`.

**Implementation:**
```tsx
// src/components/UpdateCard.tsx
function UpdateCard({ update }: { update: Update }) {
  switch (update.type) {
    case 'release':
      return (
        <Card variant="default">
          <div className="flex items-center gap-2">
            <span className="version-badge">{update.version}</span>
            <span className="date">{formatDate(update.publishedAt)}</span>
          </div>
          <h3>{update.title}</h3>
          <p>{update.excerpt}</p>
          {/* Release-specific: new/improvements/fixes preview */}
        </Card>
      );
    case 'bugfix':
      return (
        <Card variant="default" className="bugfix-card">
          <span className="status-badge">{update.bugfixStatus}</span>
          <h3>{update.title}</h3>
          <p>{update.excerpt}</p>
          {/* Minimal - no version, no sections */}
        </Card>
      );
    case 'roadmap':
      return (
        <Card variant="default">
          <span className="roadmap-status-badge">{update.roadmapStatus}</span>
          <h3>{update.title}</h3>
          <p>{update.excerpt}</p>
          {update.targetDate && <span>{update.targetDate}</span>}
        </Card>
      );
    case 'announcement':
    default:
      return (
        <Card variant="default">
          <span className="date">{formatDate(update.publishedAt)}</span>
          <h3>{update.title}</h3>
          <p>{update.excerpt}</p>
          {/* Blog-style title + excerpt */}
        </Card>
      );
  }
}
```

### Pattern 3: Tab Navigation (Not Separate Pages)

**What:** Single `/updates` page with tab filtering, not `/updates/announcements`, `/updates/releases`, etc.

**Implementation:** Adapt the roadmap.tsx status filter pattern (lines 393-405) for tabs:

```tsx
// src/pages/updates.tsx
const tabs = ['All', 'Announcements', 'Releases', 'Bug Fixes', 'Roadmap'];
const [activeTab, setActiveTab] = useState('All');

const filteredUpdates = useMemo(() => {
  return updates.filter(update => {
    if (activeTab === 'All') return true;
    const tabToType: Record<string, string> = {
      'Announcements': 'announcement',
      'Releases': 'release',
      'Bug Fixes': 'bugfix',
      'Roadmap': 'roadmap',
    };
    return update.type === tabToType[activeTab];
  });
}, [activeTab, updates]);
```

### Pattern 4: Detail Page with Type-Specific Layout

**What:** Single dynamic route `/updates/[slug].tsx` that renders type-specific layouts.

**Implementation:**
```tsx
// src/pages/updates/[slug].tsx
import { useParam } from '@docusaurus/theme-common';
import updatesData from '../data/sanity-updates.generated.json';

export default function UpdateDetailPage() {
  const { slug } = useParam<{ slug: string }>('slug');
  const update = updatesData.find(u => u.slug?.current === slug);
  
  if (!update) return <NotFound />;
  
  switch (update.type) {
    case 'release':
      return <ReleaseDetail update={update} />;
    case 'bugfix':
      return <BugfixDetail update={update} />;
    case 'roadmap':
      return <RoadmapDetail update={update} />;
    case 'announcement':
      return <AnnouncementDetail update={update} />;
  }
}
```

### Pattern 5: GROQ Query for Updates

**What:** Single GROQ query fetching all update types with conditional projections.

**Implementation in fetch-sanity-content.js:**
```javascript
function getUpdatesQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return `*[_type == "update" && ${filter}] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    type,
    publishedAt,
    excerpt,
    content,
    version,
    releaseNotes,
    bugfixStatus,
    severity,
    roadmapStatus,
    targetDate
  }`;
}
```

---

## UX Rules (Locked by User)

| Rule | Implementation |
|------|----------------|
| Bug fixes stay SHORT | No rich content; title + excerpt only; minimal card |
| Roadmap feels like progress tracking | Status badge + target date; not blog-style |
| Announcements render as blog-style | Title + excerpt + rich content on detail |
| Release cards show version badge | Version field prominently displayed |

---

## File Changes

| File | Action | Notes |
|------|--------|-------|
| `studio/schemaTypes/update.ts` | CREATE | Single schema with type enum and conditional fields |
| `studio/schemaTypes/index.ts` | MODIFY | Add `updateType` to exports |
| `classic/scripts/fetch-sanity-content.js` | MODIFY | Add `getUpdatesQuery()` and `fetchUpdates()` |
| `classic/src/data/sanity-updates.generated.json` | CREATE | Build artifact |
| `classic/src/pages/updates.tsx` | CREATE | Hub page with tabs |
| `classic/src/pages/updates/[slug].tsx` | CREATE | Detail page |
| `classic/src/components/UpdateCard.tsx` | CREATE | Type-driven card component |
| `classic/src/components/UpdateDetail.tsx` | CREATE | Type-switched detail renderer |

---

## Common Pitfalls

### Pitfall 1: Creating Separate Schemas Per Type

**What goes wrong:** Creating `announcement.ts`, `releaseNote.ts`, `bugfix.ts` as separate document types.

**Why it's wrong:** User explicitly locked this decision: "Single `update` document type (NOT separate schemas)". Violates the unified hub concept.

**How to avoid:** Use ONE schema with `type` enum and `hidden: ({parent}) => parent?.type !== 'release'` for conditional fields.

### Pitfall 2: Separate Pages Per Category

**What goes wrong:** Creating `/updates/announcements`, `/updates/releases`, etc.

**Why it's wrong:** User locked: "One hub page only. `/updates` is the only entry point."

**How to avoid:** Tab navigation on single page. Filter in React, not routing.

### Pitfall 3: Over-Engineering Bug Fix Cards

**What goes wrong:** Bug fix cards with rich content, screenshots, version numbers.

**Why it's wrong:** User locked: "Keep bug fixes SHORT — don't let them look like blog posts."

**How to avoid:** Minimal card: title, status badge, one-line excerpt. No rich content field for bugfixes.

### Pitfall 4: Missing Dynamic Detail Route

**What goes wrong:** Creating `src/pages/updates.tsx` but forgetting `src/pages/updates/[slug].tsx`.

**Why it's wrong:** Card links to `/updates/my-slug` return 404.

**How to avoid:** Create both files in same plan. Docusaurus file-based routing requires `[param].tsx`.

---

## Validation Strategy

### Test Commands

| Requirement | Test Type | Command/Action |
|-------------|-----------|----------------|
| UHUB-01 | smoke | Open Sanity Studio, verify `update` document type with conditional fields |
| UHUB-02 | smoke | Visit `/updates`, verify tab navigation (All/Announcements/Releases/Bug Fixes/Roadmap) |
| UHUB-03 | visual | Verify each card type renders correctly (version badge for releases, status for bugfixes) |
| UHUB-04 | smoke | Click update card, verify detail page at `/updates/[slug]` |
| UHUB-05 | smoke | Verify JSON contains updates from all types |
| UHUB-06 | deferred | Data migration is optional; skip for initial implementation |

### Sampling Rate

- **Per task commit:** Visual check in `npm run start`
- **Per phase gate:** All 6 requirements verified with test data

---

## Migration Considerations

### UHUB-06: Optional Data Migration

The `update` schema can coexist with existing `release` and `roadmapItem` schemas. Migration is NOT required for launch.

**Migration path (if desired later):**
1. Create migration script to copy `release` documents to `update` with `type: 'release'`
2. Create migration script to copy `roadmapItem` documents to `update` with `type: 'roadmap'`
3. Update GROQ query to fetch from `update` instead of `release`/`roadmapItem`
4. Archive old schemas

**Recommendation:** Launch with `update` schema for NEW content. Migrate historical data in a follow-up task.

---

## Sources

- `.planning/ROADMAP-updates-hub.md` — Phase requirements and decisions
- `.planning/phases/29-updates-hub/29-CONTEXT.md` — User decisions and constraints
- `.planning/research/ARCHITECTURE.md` — Standard architecture patterns
- `studio/schemaTypes/release.ts` — Existing release schema for field reference
- `studio/schemaTypes/roadmapItem.ts` — Existing roadmap schema for field reference
- `studio/schemaTypes/landingPage.ts:360` — Conditional field pattern (`hidden: ({parent})`)
- `classic/src/pages/roadmap.tsx` — Filtering, search, accordion patterns
- `classic/src/pages/releases.tsx` — Card layout and release display patterns
- `classic/scripts/fetch-sanity-content.js` — GROQ query patterns
- `classic/src/components/ui/index.ts` — Available UI components

---

## Key Questions for Planning

### 1. Schema Design Questions

| Question | Research Finding |
|----------|------------------|
| How to implement conditional fields? | Use `hidden: ({parent}) => parent?.type !== 'release'` pattern |
| How to group fields in Studio? | Use `options: { collapsible: true, collapsed: true }` on object fields |
| What fields are shared vs type-specific? | Shared: title, type, publishedAt, slug, excerpt, content. Type-specific: version, releaseNotes, bugfixStatus, severity, roadmapStatus, targetDate |

### 2. UI Implementation Questions

| Question | Research Finding |
|----------|------------------|
| How to implement tabs? | Adapt roadmap.tsx filter button pattern (lines 393-405) for tab styling |
| How to render different cards? | Switch statement in UpdateCard component based on `update.type` |
| How to handle detail page routing? | Docusaurus dynamic route: `src/pages/updates/[slug].tsx` |
| What animations to use? | Framer Motion patterns from roadmap.tsx (AnimatePresence, motion.div) |

### 3. Data Pipeline Questions

| Question | Research Finding |
|----------|------------------|
| Where to add GROQ query? | Add `getUpdatesQuery()` and `fetchUpdates()` to fetch-sanity-content.js |
| What is the JSON output file? | `sanity-updates.generated.json` in `src/data/` |
| How to import in React? | Static import: `import updatesData from '../data/sanity-updates.generated.json'` |

### 4. Styling Questions

| Question | Research Finding |
|----------|------------------|
| What card component to use? | `Card` from `src/components/ui/` with glassmorphism styling |
| What badge styles to use? | Adapt changeTypeConfig from releases.tsx (lines 72-78) |
| How to handle responsive? | Follow roadmap.tsx grid patterns; container queries from Phase 28 |

---

*Research date: 2026-04-01*
*Confidence: HIGH — all patterns derived from existing codebase*
