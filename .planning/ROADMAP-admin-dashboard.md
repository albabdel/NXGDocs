# Roadmap: Admin Command Center (v2.0)

## Milestone Overview

**Milestone Goal:** Transform staff login into a full admin command center with content workflow management, routing editor, analytics dashboard, and comprehensive audit trail — all within the existing Docusaurus platform.

**Key Outcomes:**
- OAuth authentication with org-based access (anyone in org = admin)
- Content approval workflow (Editors submit → Admins review/approve/reject/edit)
- Dynamic routing and block editing for logged-in admins
- Analytics dashboard with content performance metrics
- Audit trail tracking all admin actions
- Unified ticketing oversight in admin sidebar
- Source attribution (Sanity vs Confluence)

**Phase Numbering:** v2.0 starts at Phase 16 (continuing from v1.2 which ends at Phase 15).

---

## Architecture Decision: Admin Dashboard Approach

**Decision:** Build admin dashboard as **integrated Docusaurus pages** rather than a separate application.

**Rationale:**
- Existing infrastructure (Cloudflare Pages, Sanity, Zoho auth) works seamlessly
- No additional hosting/deployment complexity
- Single codebase = easier maintenance
- Docusaurus already has the routing, theming, and build system
- Can share components between public site and admin

**Tech Stack Additions:**
- `@tanstack/react-table` - Data tables with sorting/filtering
- `@dnd-kit/core` - Drag-and-drop for block editor
- `zustand` - Lightweight state management (no Redux overhead)
- `date-fns` - Date handling for scheduling/analytics
- `@blocknote/react` - Notion-like block editor (optional, Phase 19)

---

## Phases

### Phase 16: Authentication Foundation
**Goal:** OAuth org-based authentication where anyone in the organization can log in as an admin, with session management and role tracking
**Depends on:** Phase 15 (or standalone — can start now)
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**Success Criteria** (what must be TRUE):
1. User can click "Sign in as Staff" and authenticate via Zoho OAuth (existing flow extended)
2. OAuth is configured to accept only users from the NXGEN organization (org-scoped)
3. Upon successful login, user session is created with admin role and persisted in HttpOnly cookie
4. Session includes: userId, email, name, role, orgId, loginTimestamp
5. Admin-only routes (/admin/*) are protected — unauthenticated users redirect to login
6. Current user info is accessible via React context/hook throughout the app
7. Logout clears session and redirects to home page
8. All authentication attempts (success and failure) are logged

**Plans:** 3 plans

Plans:
- [ ] 16-01-PLAN.md — Extend Zoho OAuth for org-scoped authentication; create admin session cookie
- [ ] 16-02-PLAN.md — Build auth context, hooks (useAuth, useCurrentUser), and protected route wrapper
- [ ] 16-03-PLAN.md — Create user schema in Sanity for tracking; implement session validation middleware

---

### Phase 17: Admin Shell & Sidebar Navigation
**Goal:** Admin dashboard layout with collapsible sidebar, header with user menu, and admin-only visibility
**Depends on:** Phase 16
**Requirements:** SHELL-01, SHELL-02, SHELL-03, SHELL-04

**Success Criteria** (what must be TRUE):
1. Logged-in admins see a sidebar on the left with navigation to all admin sections
2. Sidebar includes: Dashboard, Content Queue, Routing, Analytics, Tickets, Users, Audit Logs, Settings
3. Sidebar is collapsible (icon-only mode) and responsive (mobile drawer)
4. Header shows: current user avatar, org name, notifications badge, logout button
5. Admin sidebar is completely hidden for non-logged-in users (no visual indication it exists)
6. Admin pages use a consistent layout wrapper with sidebar + header
7. Theme matches existing Docusaurus design (dark/light mode support)

**Plans:** 2 plans

Plans:
- [ ] 17-01-PLAN.md — Build AdminLayout component with sidebar, header, and responsive behavior
- [ ] 17-02-PLAN.md — Create admin route structure (/admin/*) with protected route wrapper

---

### Phase 18: Content Approval Workflow
**Goal:** Admins can review, approve, reject, and edit content submitted by editors with full source tracking
**Depends on:** Phase 17
**Requirements:** WF-01, WF-02, WF-03, WF-04, WF-05, WF-06, WF-07

**Success Criteria** (what must be TRUE):
1. Content Queue page shows all items with status: Draft, Pending Review, Approved, Rejected, Published
2. Each item displays: title, type, source (Sanity/Confluence), submitted by, submitted date, current status
3. Admin can click an item to see full content preview with diff view if edited
4. Admin can approve, reject, or request changes with optional comment
5. Approved content is automatically published to live site (triggers rebuild)
6. Rejected content returns to editor with feedback
7. Admin can edit content directly: modify title, body, slug, placement/routing
8. All edits are reflected back in Sanity (and Confluence if applicable)
9. Source attribution is visible and preserved throughout workflow
10. Workflow status history is tracked (who approved/rejected, when, why)

**Plans:** 4 plans

Plans:
- [ ] 18-01-PLAN.md — Create workflow schema in Sanity (workflowStatus, reviewHistory, assignedReviewer, source)
- [ ] 18-02-PLAN.md — Build Content Queue page with TanStack Table, filters, and status badges
- [ ] 18-03-PLAN.md — Create Content Review modal with preview, approve/reject/edit actions
- [ ] 18-04-PLAN.md — Implement workflow state machine and Sanity/Confluence sync on approval

---

### Phase 19: Routing & Block Editor
**Goal:** Admins can edit routing configuration and UI blocks (buttons, links, placements) when logged in
**Depends on:** Phase 18
**Requirements:** ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, ROUTE-05

**Success Criteria** (what must be TRUE):
1. Route Config schema exists in Sanity with: path, title, component, blocks, redirects, parent, isPublished
2. Route Editor page shows tree view of all routes with add/edit/delete capabilities
3. Admin can modify any route's path, title, parent, and published status
4. Admin can add/edit/delete redirects for any route
5. When logged in, admin sees "Edit" button on any public page that opens that page's config in admin
6. Block Editor allows modifying: button destinations, link targets, hero content, feature cards
7. Changes to routes/blocks trigger Sanity update and site rebuild
8. Invalid route configurations are caught and displayed with clear error messages

**Plans:** 4 plans

Plans:
- [ ] 19-01-PLAN.md — Create routeConfig schema in Sanity; migrate existing routes to schema
- [ ] 19-02-PLAN.md — Build Route Editor page with tree view and inline editing
- [ ] 19-03-PLAN.md — Create Block Editor component with drag-and-drop reordering
- [ ] 19-04-PLAN.md — Add "Edit on page" floating button for logged-in admins

---

### Phase 20: Analytics Dashboard
**Goal:** Admins can view platform analytics: content views, engagement, approval metrics, and performance trends
**Depends on:** Phase 17 (can run parallel with 18/19)
**Requirements:** ANALYT-01, ANALYT-02, ANALYT-03, ANALYT-04, ANALYT-05

**Success Criteria** (what must be TRUE):
1. Dashboard page shows KPI cards: Total Views, Active Users, Pending Reviews, Avg Approval Time
2. Time-series chart shows content views over time (filterable: 7d, 30d, 90d, custom)
3. Pie chart shows content distribution by status (Draft, Pending, Published, Rejected)
4. Table shows top-performing content with views, unique visitors, avg time on page
5. Metrics for admin operations: approval rate, rejection reasons breakdown, review turnaround time
6. All data is fetched from Sanity (content metrics) and analytics provider (Umami/Plausible)
7. Real-time updates via Server-Sent Events for new content submissions
8. Export functionality (CSV, PDF) for reports

**Plans:** 3 plans

Plans:
- [ ] 20-01-PLAN.md — Integrate Umami/Plausible analytics; create content metrics schema
- [ ] 20-02-PLAN.md — Build Analytics Dashboard with Recharts components and KPI cards
- [ ] 20-03-PLAN.md — Implement real-time updates via SSE and export functionality

---

### Phase 21: Audit & Compliance
**Goal:** Complete audit trail of all admin actions with retention policies and compliance features
**Depends on:** Phase 16 (can run parallel with 17-20)
**Requirements:** AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04, AUDIT-05

**Success Criteria** (what must be TRUE):
1. Every admin action is logged: content create/update/delete, route changes, approvals/rejections, user management
2. Audit log includes: timestamp, actor (userId, email), action type, resource type, resource ID, changes (before/after), IP address
3. Audit Log Viewer page with filters: date range, user, action type, resource
4. Audit entries are immutable (append-only, no modifications allowed)
5. Retention policies are configurable (default: 90 days read, 1 year write, 7 years delete)
6. GDPR compliance: DSAR (Data Subject Access Request) handling for audit logs
7. Export functionality for compliance reporting

**Plans:** 3 plans

Plans:
- [ ] 21-01-PLAN.md — Create auditLog schema in Sanity; build AuditService class
- [ ] 21-02-PLAN.md — Integrate audit logging into all admin operations (content, routes, users)
- [ ] 21-03-PLAN.md — Build Audit Log Viewer with filters, export, and retention policies

---

### Phase 22: Ticketing Integration
**Goal:** Ticketing system is embedded in admin dashboard with full oversight and bulk operations
**Depends on:** Phase 17
**Requirements:** TICK-01, TICK-02, TICK-03, TICK-04

**Success Criteria** (what must be TRUE):
1. Tickets page in admin shows all tickets (not just user's own) with full Zoho Desk data
2. Admin can filter by: status, priority, assignee, customer, date range
3. Admin can perform bulk operations: assign, change status, add tags to multiple tickets
4. Ticket detail view shows full conversation history, attachments, and customer info
5. Quick actions: reply, change status, assign, escalate
6. Ticket metrics widget on main dashboard: open tickets, avg response time, SLA status
7. Link between tickets and content (if ticket references a doc, show link)

**Plans:** 2 plans

Plans:
- [ ] 22-01-PLAN.md — Extend ZohoTickets component for admin mode with full access
- [ ] 22-02-PLAN.md — Add ticket metrics to dashboard and bulk operation support

---

### Phase 23: Polish, Testing & Documentation
**Goal:** Admin dashboard is production-ready with tests, accessibility compliance, and documentation
**Depends on:** Phase 18, 19, 20, 21, 22
**Requirements:** POLISH-01, POLISH-02, POLISH-03, POLISH-04

**Success Criteria** (what must be TRUE):
1. E2E tests cover: login flow, content approval, route editing, analytics viewing
2. All pages are accessible (WCAG 2.1 AA): keyboard navigation, ARIA labels, color contrast
3. Performance: admin pages load < 2s, table interactions < 100ms
4. Error boundaries with user-friendly messages for failed operations
5. Loading states and skeleton loaders for async operations
6. Admin user guide documentation (how to use each section)
7. Developer documentation for extending admin functionality

**Plans:** 3 plans

Plans:
- [ ] 23-01-PLAN.md — E2E tests for admin flows using Playwright
- [ ] 23-02-PLAN.md — Accessibility audit and fixes (WCAG 2.1 AA)
- [ ] 23-03-PLAN.md — Performance optimization and documentation

---

## Dependency Graph

```
Phase 16 (Auth) ─────────────────────────────────────────────────┐
       │                                                         │
       ▼                                                         │
Phase 17 (Shell) ──┬─────────────────────────────────────────────┤
       │           │           │           │                     │
       │           ▼           ▼           ▼                     │
       │    Phase 18     Phase 20     Phase 21                   │
       │    (Workflow)   (Analytics)  (Audit)                    │
       │           │           │           │                     │
       │           ▼           │           │                     │
       │    Phase 19           │           │                     │
       │    (Routing)          │           │                     │
       │           │           │           │                     │
       │           ▼           │           │                     │
       │    Phase 22 ◄─────────┴───────────┘                     │
       │    (Ticketing)                                           │
       │           │                                              │
       ▼           ▼                                              │
Phase 23 (Polish) ◄──────────────────────────────────────────────┘
```

**Wave Execution:**
- Wave 1: Phase 16 (Auth) → Phase 17 (Shell)
- Wave 2: Phase 18 (Workflow), Phase 20 (Analytics), Phase 21 (Audit) - parallel
- Wave 3: Phase 19 (Routing), Phase 22 (Ticketing) - after their dependencies
- Wave 4: Phase 23 (Polish) - final

---

## Requirements Index

### Authentication (Phase 16)
- AUTH-01: OAuth org-scoped authentication
- AUTH-02: HttpOnly session cookie with admin role
- AUTH-03: Protected routes (/admin/*)
- AUTH-04: Auth context and hooks
- AUTH-05: Login/logout flow with audit

### Admin Shell (Phase 17)
- SHELL-01: Collapsible sidebar navigation
- SHELL-02: Header with user menu
- SHELL-03: Admin-only visibility
- SHELL-04: Responsive design (mobile drawer)

### Content Workflow (Phase 18)
- WF-01: Content queue with status filtering
- WF-02: Content preview with diff view
- WF-03: Approve/reject/request changes actions
- WF-04: Edit content directly (title, body, slug, placement)
- WF-05: Sanity/Confluence sync on approval
- WF-06: Source attribution tracking
- WF-07: Workflow history

### Routing (Phase 19)
- ROUTE-01: Route config schema in Sanity
- ROUTE-02: Route tree editor with add/edit/delete
- ROUTE-03: Redirect management
- ROUTE-04: Block editor with drag-and-drop
- ROUTE-05: "Edit on page" floating button

### Analytics (Phase 20)
- ANALYT-01: KPI cards (views, users, pending, approval time)
- ANALYT-02: Time-series charts with date filtering
- ANALYT-03: Content performance table
- ANALYT-04: Real-time updates via SSE
- ANALYT-05: Export functionality (CSV/PDF)

### Audit (Phase 21)
- AUDIT-01: Immutable audit log schema
- AUDIT-02: Audit logging for all admin actions
- AUDIT-03: Audit log viewer with filters
- AUDIT-04: Retention policies
- AUDIT-05: GDPR DSAR handling

### Ticketing (Phase 22)
- TICK-01: Full ticket access for admins
- TICK-02: Bulk operations
- TICK-03: Ticket metrics on dashboard
- TICK-04: Content-ticket linking

### Polish (Phase 23)
- POLISH-01: E2E tests
- POLISH-02: WCAG 2.1 AA accessibility
- POLISH-03: Performance optimization
- POLISH-04: Documentation

---

## Estimated Timeline

| Phase | Estimated Duration | Parallel Execution |
|-------|-------------------|-------------------|
| 16. Auth | 1 week | No |
| 17. Shell | 1 week | After 16 |
| 18. Workflow | 2 weeks | Parallel with 20, 21 |
| 19. Routing | 1.5 weeks | After 18 |
| 20. Analytics | 1 week | Parallel with 18, 21 |
| 21. Audit | 1 week | Parallel with 18, 20 |
| 22. Ticketing | 1 week | After 18 |
| 23. Polish | 1 week | Final |

**Total Estimated Duration:** 6-8 weeks

---

## Open Questions

1. **Auth Provider Choice:** Extend existing Zoho OAuth or switch to Clerk/Auth0 for better org support?
   - Recommendation: Extend Zoho OAuth (already working, org-scoped via Zoho organization)
   
2. **Analytics Provider:** Umami (self-hosted) or Plausible (cloud)?
   - Recommendation: Umami (privacy-first, self-hosted, free)

3. **Block Editor:** Build custom or use BlockNote.js?
   - Recommendation: Start with custom (simpler), add BlockNote later if needed

4. **Confluence Sync:** Real-time or scheduled batch?
   - Recommendation: Real-time via webhooks (already planned in v1.2)

---

*Roadmap created: 2026-03-17*
*For: Admin Command Center Milestone (v2.0)*
