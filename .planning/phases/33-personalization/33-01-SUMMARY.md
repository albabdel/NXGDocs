---
phase: 33-personalization
plan: 01
subsystem: personalization
tags: [personalization, role-based-content, quick-links, user-preferences]
requires:
  - 32-01 (Bookmarks system)
  - 32-02 (Reading history)
provides:
  - Role-based content filtering
  - Quick links sidebar component
  - Quick links management page
  - Recommended reading by role
affects:
  - Homepage personalization
  - User profile preferences
tech_stack:
  added:
    - RoleBasedContent component
    - RecommendedReading component
    - QuickLinks component
    - AddQuickLinkModal component
    - useQuickLinks hook
  patterns:
    - Role-based content filtering
    - User preference persistence
    - Sidebar customization
key_files:
  created:
    - classic/src/components/Personalization/RoleBasedContent.tsx
    - classic/src/components/Personalization/RecommendedReading.tsx
    - classic/src/components/Personalization/QuickLinks.tsx
    - classic/src/components/Personalization/AddQuickLinkModal.tsx
    - classic/src/components/Personalization/index.ts
    - classic/src/hooks/useQuickLinks.ts
    - classic/src/pages/profile/quick-links.tsx
    - classic/src/css/components/personalization.css
  modified:
    - classic/src/pages/index.tsx
    - classic/src/services/user-profile.ts
    - classic/src/components/History/ContinueReading.tsx
decisions:
  - Store quick_links in user_preferences table via Supabase
  - Max 10 quick links per user
  - Role-based recommendations use static mapping (can be enhanced with ML later)
  - RecommendedReading uses role-to-interest mapping for content suggestions
metrics:
  duration: 45 minutes
  completed_date: 2026-04-01
  files_created: 8
  files_modified: 3
  lines_added: ~2400
---

# Phase 33 Plan 01: Role-Based Personalization Summary

## One-Liner

Implemented role-based content filtering with recommended reading and user-customizable quick links that persist in Supabase.

## What Was Built

### Task 1: Role-Based Content Filtering

Created components for displaying content based on user roles:

- **RoleBasedContent.tsx** - Wrapper component that shows/hides content based on user role
  - Accepts `allowedRoles` prop with array of roles
  - Supports optional `fallback` content for non-matching roles
  - Handles unauthenticated users gracefully

- **RecommendedReading.tsx** - Role-specific documentation recommendations
  - Maps roles to interest areas (operator → alarms, monitoring, etc.)
  - Shows curated reading list based on role
  - Uses static recommendations with fallback support

- **personalization.css** - Complete styling for personalization components
  - Role badges with color-coded styling
  - Recommended reading card styles
  - Quick links sidebar styles
  - Modal and management page styles

### Task 2: Quick Links System

Created a complete quick links management system:

- **useQuickLinks.ts** - Hook for quick links state management
  - CRUD operations (add, update, remove, reorder)
  - Persists to `user_preferences.quick_links` in Supabase
  - Max 10 links per user limit

- **QuickLinks.tsx** - Sidebar component for quick links
  - Displays user's custom links
  - Add/remove functionality inline
  - Navigation to management page

- **AddQuickLinkModal.tsx** - Modal for adding/editing links
  - Title and URL inputs
  - Validates internal (/path) and external (https://) URLs
  - Edit existing links support

- **quick-links.tsx** - Full management page at `/profile/quick-links`
  - List view with edit/delete actions
  - Preview of sidebar appearance
  - Empty state with add prompt

### Task 3: Homepage Integration

Integrated personalization into the main homepage:

- Added welcome message for logged-in users
- Added ContinueReading widget for reading history
- Added RoleBasedContent wrappers for role-specific recommendations
- Added RecommendedReading sections for operator, manager, engineer, and admin roles

## Architecture Decisions

1. **Quick Links Storage**: Stored in `user_preferences.quick_links` JSON field in Supabase
   - Rationale: Keeps user data in one place, easy to query and update

2. **Max 10 Quick Links**: Enforced limit to prevent clutter and ensure performance
   - Rationale: Sidebar real estate is limited, 10 is a practical maximum

3. **Static Role Recommendations**: Using predefined role-to-interest mappings
   - Rationale: Simple to implement, can be enhanced with ML recommendations later

4. **CSS Import Pattern**: Using relative paths to `../../css/components/personalization.css`
   - Rationale: Consistent with existing component patterns in the codebase

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] CSS import path resolution**
- **Found during:** Task 1 build verification
- **Issue:** Components used `./personalization.css` but file was in `css/components/`
- **Fix:** Updated imports to use `../../css/components/personalization.css` pattern
- **Files modified:** All Personalization components
- **Commit:** fa27559

**2. [Rule 3 - Blocking] ContinueReading CSS import**
- **Found during:** Task 3 build verification
- **Issue:** ContinueReading component expected `./history.css` in same folder
- **Fix:** Copied history.css to History component folder and updated import path
- **Files modified:** ContinueReading.tsx, history.css
- **Commit:** f93b80b

**3. [Rule 2 - Missing] UserPreferences type missing quick_links**
- **Found during:** useQuickLinks hook development
- **Issue:** TypeScript type didn't include quick_links field
- **Fix:** Added QuickLink type and quick_links field to UserPreferences and UpdateUserPreferencesInput
- **Files modified:** user-profile.ts
- **Commit:** fa27559

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `RoleBasedContent.tsx` | Role-based content filtering wrapper | ~80 |
| `RecommendedReading.tsx` | Role-specific reading recommendations | ~280 |
| `QuickLinks.tsx` | Sidebar quick links component | ~180 |
| `AddQuickLinkModal.tsx` | Add/edit link modal | ~180 |
| `useQuickLinks.ts` | Quick links state hook | ~160 |
| `quick-links.tsx` | Quick links management page | ~320 |
| `personalization.css` | Complete styling | ~600 |
| `index.tsx` | Homepage integration | +130 |

## Testing Notes

- Build passes with `npm run build --prefix classic`
- All components render without TypeScript errors
- Role-based content filtering works for all defined roles
- Quick links CRUD operations work with Supabase persistence
- Homepage shows personalized content for authenticated users

## Next Steps

1. Add role selection to profile settings page
2. Integrate QuickLinks into sidebar navigation
3. Add dynamic recommendations from Sanity content
4. Implement drag-and-drop reordering on management page

---

## Self-Check: PASSED

**Files verified:**
- ✅ classic/src/components/Personalization/RoleBasedContent.tsx
- ✅ classic/src/components/Personalization/RecommendedReading.tsx
- ✅ classic/src/components/Personalization/QuickLinks.tsx
- ✅ classic/src/components/Personalization/AddQuickLinkModal.tsx
- ✅ classic/src/components/Personalization/index.ts
- ✅ classic/src/hooks/useQuickLinks.ts
- ✅ classic/src/pages/profile/quick-links.tsx
- ✅ classic/src/css/components/personalization.css

**Commits verified:**
- ✅ fa27559: feat(33-01): add role-based content filtering and quick links system
- ✅ f93b80b: feat(33-01): integrate personalization into homepage
