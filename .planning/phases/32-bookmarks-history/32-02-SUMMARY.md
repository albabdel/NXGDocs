---
phase: 32-bookmarks-history
plan: 02
subsystem: history
tags: [supabase, history, tracking, hooks, react, rls, postgres]

# Dependency graph
requires:
  - phase: 32-01
    provides: Supabase client integration and authentication context
  - phase: 31-01
    provides: Supabase client setup with Auth0 JWT integration
provides:
  - Reading history database schema with RLS
  - History service with CRUD operations
  - useReadingHistory hook for state management
  - usePageTracking hook for automatic tracking
  - ContinueReading widget for homepage
  - HistoryList component with date grouping
  - Full history page with filtering and search
affects: [profile-pages, homepage, doc-tracking]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Supabase upsert for insert-or-update semantics"
    - "Debounced progress tracking (30s interval)"
    - "Row Level Security with Auth0 sub claim matching"
    - "Date grouping for history list (Today, Yesterday, This Week, Older)"
    - "Time tracking with interval-based updates"

key-files:
  created:
    - .supabase/schema/user-history.sql
    - classic/src/services/history.ts
    - classic/src/hooks/useReadingHistory.ts
    - classic/src/hooks/usePageTracking.ts
    - classic/src/components/History/ContinueReading.tsx
    - classic/src/components/History/HistoryList.tsx
    - classic/src/components/History/index.ts
    - classic/src/pages/profile/history.tsx
    - classic/src/css/components/history.css
  modified:
    - classic/src/theme/Navbar/Content/index.tsx

key-decisions:
  - "Use upsert for visit recording to handle unique constraint on (user_id, item_slug)"
  - "Debounce progress updates to 30 seconds to avoid excessive database writes"
  - "Track scroll progress as percentage for document completion"
  - "Group history items by relative date for better UX"
  - "Support export of history as JSON for data portability"

patterns-established:
  - "Pattern: Automatic page tracking with usePageTracking hook"
  - "Pattern: History state management with useReadingHistory hook"
  - "Pattern: RLS policies matching Auth0 sub claim from JWT"
  - "Pattern: Date grouping in list components"

requirements-completed: [AUTH-04]

# Metrics
duration: 45min
completed: 2026-04-01
---

# Phase 32: Reading History Summary

**Automatic reading history tracking with Supabase storage, "Continue Reading" widget, and full history management page with RLS-enforced user isolation**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-04-01T15:30:00Z
- **Completed:** 2026-04-01T16:15:00Z
- **Tasks:** 3 of 4 completed
- **Files modified:** 10

## Accomplishments
- Reading history database schema with Row Level Security for user isolation
- History service with full CRUD operations (getHistory, recordVisit, updateProgress, delete, clear)
- useReadingHistory hook for React state management with loading states
- usePageTracking hook for automatic page visit tracking with debounced updates
- ContinueReading widget showing incomplete pages with progress bars
- HistoryList component with date grouping and item management
- Full history page at /profile/history with filtering, search, and export
- Comprehensive CSS styles with responsive design

## Task Commits

Each task was committed atomically:

1. **task 1: Create reading history database schema** - `bf53637` (feat)
2. **task 2: Create reading history hooks and tracking** - `327994c` (feat)
3. **task 3: Create Continue Reading widget and history page** - `4c4a346` (feat - combined with bookmarks)

**Plan metadata:** Pending

_Note: Task 4 (homepage integration) not yet completed - see Next Phase Readiness_

## Files Created/Modified

### Created
- `.supabase/schema/user-history.sql` - PostgreSQL schema with RLS policies for reading history table
- `classic/src/services/history.ts` - History service with CRUD operations (getHistory, recordVisit, updateProgress, deleteHistoryItem, clearHistory, getHistoryStats)
- `classic/src/hooks/useReadingHistory.ts` - React hook for history state management with auth-aware loading
- `classic/src/hooks/usePageTracking.ts` - Automatic page tracking hook with debounced updates and scroll progress
- `classic/src/components/History/ContinueReading.tsx` - Homepage widget showing recent incomplete pages
- `classic/src/components/History/HistoryList.tsx` - Date-grouped history list with delete functionality
- `classic/src/components/History/index.ts` - Barrel export for history components
- `classic/src/pages/profile/history.tsx` - Full history page with filtering, search, export, and clear all
- `classic/src/css/components/history.css` - Comprehensive styles for history components

### Modified
- `classic/src/theme/Navbar/Content/index.tsx` - Fixed Auth import path (blocking issue)

## Decisions Made

### 1. Upsert for Visit Recording
Used Supabase upsert with `onConflict: 'user_id,item_slug'` to handle the unique constraint. This ensures one history entry per user per page, updating existing entries on revisit rather than creating duplicates.

### 2. Debounced Progress Updates
Set default debounce interval to 30 seconds for progress updates. This balances accurate time tracking with database write performance. Final update sent on component unmount to capture total time spent.

### 3. Scroll Progress Tracking
Implemented optional scroll progress tracking as percentage (0-100) using window scroll events. Progress stored in database and displayed as progress bar in history list.

### 4. Date Grouping Pattern
History items grouped by relative date (Today, Yesterday, This Week, Older) for better UX. Each group shows items sorted by last_accessed_at descending.

### 5. Export as JSON
Added export functionality to allow users to download their history as JSON file for data portability.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Auth import path in Navbar/Content**
- **Found during:** task 2 (build verification)
- **Issue:** Relative import `../../components/Auth` failed in Navbar/Content/index.tsx
- **Fix:** Changed to alias import `@site/src/components/Auth`
- **Files modified:** classic/src/theme/Navbar/Content/index.tsx
- **Verification:** Import resolves correctly
- **Committed in:** 327994c (task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minimal - one import path fix required for build. No scope creep.

### Deferred Items

Pre-existing build issues in `classic/src/pages/updates.tsx` were logged to `deferred-items.md` but not fixed (out of scope - Rule 4 doesn't apply, these are unrelated files).

## Issues Encountered

- Build verification blocked by pre-existing issues in `updates.tsx` (missing component imports). These were logged as deferred items and not fixed as they are unrelated to history tracking implementation.

## User Setup Required

**Database schema must be applied manually.** After deploying this phase, run the SQL in Supabase Dashboard:

1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Paste contents of `.supabase/schema/user-history.sql`
4. Execute the script

Verification commands:
```sql
SELECT * FROM user_history LIMIT 1;
SELECT * FROM pg_policies WHERE tablename = 'user_history';
```

## Next Phase Readiness

### Completed
- All history infrastructure (schema, service, hooks, components, page)
- Ready for homepage integration

### Pending - Task 4 Integration
The following integration work from task 4 remains incomplete:

1. **Homepage Integration:**
   - Add ContinueReading widget to `classic/src/pages/index.tsx`
   - Show widget after hero section when authenticated
   - Include "Welcome back" message for returning users

2. **DocItem/Layout Swizzle:**
   - Update `classic/src/theme/DocItem/Layout/index.tsx`
   - Add usePageTracking hook call with current page metadata
   - Enable automatic tracking for all documentation pages

3. **Other Page Types:**
   - Add tracking to regular pages (not docs)
   - Add tracking to video pages if applicable
   - Add tracking to landing pages

**Recommendation:** Create a follow-up task or plan to complete homepage and DocItem/Layout integration to enable automatic tracking.

---
*Phase: 32-bookmarks-history*
*Completed: 2026-04-01*
