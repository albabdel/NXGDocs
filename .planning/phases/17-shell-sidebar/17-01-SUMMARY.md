---
phase: 17-shell-sidebar
plan: 01
subsystem: admin-ui
tags: [ui, sidebar, layout, navigation, responsive]
duration: 1 day
completed_date: 2026-03-17
dependencies:
  requires: [16-auth-foundation]
  provides: [admin-layout, admin-sidebar, admin-header, admin-routes]
  affects: [admin-pages]
tech_stack:
  added: []
  patterns: [React-components, responsive-design, collapsible-sidebar]
key_files:
  created:
    - classic/src/components/Admin/AdminLayout.tsx
    - classic/src/components/Admin/AdminSidebar.tsx
    - classic/src/components/Admin/AdminHeader.tsx
    - classic/src/pages/admin/content.tsx
    - classic/src/pages/admin/routing.tsx
    - classic/src/pages/admin/analytics.tsx
    - classic/src/pages/admin/tickets.tsx
    - classic/src/pages/admin/users.tsx
    - classic/src/pages/admin/audit.tsx
    - classic/src/pages/admin/settings.tsx
  modified:
    - classic/src/pages/admin/index.tsx
decisions:
  - "Collapsible sidebar with icon-only mode"
  - "Mobile drawer for responsive design"
  - "Fixed header with user menu dropdown"
  - "Separate pages for each admin section"
  - "Gold accent color (#E8B058) throughout"
metrics:
  files_created: 10
  files_modified: 1
  total_lines_added: 1493
  commit_hash: 2fcf577
---

# Phase 17 Plan 01: Admin Shell & Sidebar Summary

## One-Liner
Implemented admin dashboard layout with collapsible sidebar navigation, responsive mobile drawer, header with user menu, and placeholder pages for all admin sections.

## What Was Built

### 1. AdminLayout Component
- **File:** `classic/src/components/Admin/AdminLayout.tsx`
- Main layout wrapper for all admin pages
- Collapsible sidebar (64px collapsed, 220px expanded)
- Mobile drawer with overlay
- Responsive design (hidden sidebar on mobile, hamburger menu)

### 2. AdminSidebar Component
- **File:** `classic/src/components/Admin/AdminSidebar.tsx`
- Navigation items: Dashboard, Content Queue, Routing, Analytics, Tickets, Users, Audit Logs, Settings
- Active state highlighting with gold accent
- Collapsible with icon-only mode
- Uses @docusaurus/Link for navigation

### 3. AdminHeader Component
- **File:** `classic/src/components/Admin/AdminHeader.tsx`
- Fixed header at 64px height
- Hamburger menu for mobile
- Collapse toggle for desktop
- Notifications bell (placeholder)
- User dropdown with name, email, role badge
- Logout button

### 4. Admin Route Pages
All pages use AdminLayout and ProtectedRoute:
- **Dashboard:** `/admin` - Overview with section cards
- **Content Queue:** `/admin/content` - Pending content review (placeholder)
- **Routing:** `/admin/routing` - Route configuration (placeholder)
- **Analytics:** `/admin/analytics` - Metrics dashboard (placeholder)
- **Tickets:** `/admin/tickets` - Ticket management (placeholder)
- **Users:** `/admin/users` - User management (placeholder)
- **Audit Logs:** `/admin/audit` - Audit trail (placeholder)
- **Settings:** `/admin/settings` - Admin settings (placeholder)

## Navigation Structure

```
/admin                 → Dashboard (index.tsx)
/admin/content         → Content Queue
/admin/routing         → Routing Editor
/admin/analytics       → Analytics Dashboard
/admin/tickets         → Tickets
/admin/users           → Users
/admin/audit           → Audit Logs
/admin/settings        → Settings
```

## Responsive Behavior

- **Desktop (≥1024px):** Fixed sidebar, collapse toggle
- **Mobile (<1024px):** Hidden sidebar, hamburger menu opens drawer

## Styling

- Gold accent color: `#E8B058`
- Dark/light mode support via CSS variables
- Backdrop blur on header
- Smooth transitions for collapse/expand

## Verification

- ✅ Build passes (`npm run build --prefix classic`)
- ✅ All 8 admin pages created
- ✅ Sidebar navigation works
- ✅ Header with user menu functional
- ✅ Responsive design implemented
- ✅ Commit created: 2fcf577

## Self-Check: PASSED

All files verified:
- 10 files created
- 1 file modified
- Build exits 0 with SUCCESS
- Commit 2fcf577 exists in git log

## Next Steps

Phase 18: Content Approval Workflow
- Content queue with status filtering
- Review modal with preview
- Approve/reject/edit actions
- Sanity/Confluence sync on approval

Phase 20: Analytics Dashboard
- Integrate Umami/Plausible
- KPI cards and charts
- Content performance metrics

Phase 21: Audit & Compliance
- Audit logging for all actions
- Audit log viewer with filters
- Retention policies
