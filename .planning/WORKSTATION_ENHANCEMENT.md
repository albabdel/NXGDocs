# Support Workstation Enhancement — Implementation Plan

> Last updated: 2026-03-16
> Status: **PLANNING**

---

## Overview

Transform the `/support` Staff Login into a complete workstation integrating:
- **Zoho Desk** (Tickets) — existing, working
- **Zoho Mail** — full email client
- **Zoho Calendar** — full calendar management
- **Zoho CRM** — customer context panel

### Target User
NXGEN support staff (agents) who need a unified workspace to:
1. Manage support tickets
2. Communicate via email
3. Schedule and track meetings
4. Access customer context from CRM

### UI Layout
Dashboard with widgets showing overview of each service, with expandable full views.

---

## Architecture

### Key Principle: No MCP in Browser

MCP endpoints (`*.zohomcp.eu`) are **admin-level keys** that bypass all tenant isolation. They must NEVER be exposed in browser code.

Instead, use the same pattern as existing tickets:
1. **OAuth** for user authentication (user-scoped tokens)
2. **Cloudflare proxy functions** for API calls (avoids CORS)

### Data Flow

```
User (browser)
  ↓ signs in via Zoho OAuth
Zoho OAuth (accounts.zoho.eu)
  ↓ returns access token with scopes for all services
NXGEN Docs /support page
  ↓ calls proxy functions with user token
Cloudflare Functions
  ↓ proxies to Zoho APIs
Zoho APIs (desk.zoho.eu, mail.zoho.eu, calendar.zoho.eu, crm.zoho.eu)
  ↓ returns user-authorized data only
```

### Required OAuth Scopes

```typescript
const WORKSTATION_SCOPES = [
  // Zoho Desk (existing)
  'Desk.tickets.READ',
  'Desk.tickets.UPDATE',
  'Desk.tickets.CREATE',
  'Desk.contacts.READ',
  'Desk.agents.READ',
  'Desk.search.READ',
  'Desk.basic.READ',

  // Zoho Mail
  'ZohoMail.accounts.READ',
  'ZohoMail.folders.READ',
  'ZohoMail.messages.READ',
  'ZohoMail.messages.CREATE',
  'ZohoMail.messages.UPDATE',

  // Zoho Calendar
  'ZohoCalendar.calendar.READ',
  'ZohoCalendar.event.READ',
  'ZohoCalendar.event.CREATE',
  'ZohoCalendar.event.UPDATE',
  'ZohoCalendar.event.DELETE',

  // Zoho CRM
  'ZohoCRM.modules.READ',
  'ZohoCRM.modules.contacts.READ',
  'ZohoCRM.modules.accounts.READ',

  // Profile
  'aaaserver.profile.read',
].join(',');  // IMPORTANT: Use commas, not spaces!
```

> **Note**: Zoho requires scopes separated by commas, not spaces.

---

## File Structure

### New Files

```
classic/src/
├── components/
│   ├── ZohoTickets/           # Existing
│   │   └── ...
│   ├── Workstation/           # NEW — Dashboard container
│   │   ├── WorkstationDashboard.tsx
│   │   ├── WorkstationHeader.tsx
│   │   └── types.ts
│   ├── MailWidget/            # NEW — Email widget & full view
│   │   ├── MailWidget.tsx
│   │   ├── MailFullView.tsx
│   │   ├── MailCompose.tsx
│   │   ├── MailList.tsx
│   │   ├── MailThread.tsx
│   │   ├── mailApi.ts
│   │   └── types.ts
│   ├── CalendarWidget/        # NEW — Calendar widget & full view
│   │   ├── CalendarWidget.tsx
│   │   ├── CalendarFullView.tsx
│   │   ├── EventModal.tsx
│   │   ├── calendarApi.ts
│   │   └── types.ts
│   └── CRMPanel/              # NEW — Customer context panel
│       ├── CRMPanel.tsx
│       ├── ContactSearch.tsx
│       ├── ContactCard.tsx
│       ├── AccountInfo.tsx
│       ├── crmApi.ts
│       └── types.ts
│
└── pages/
    └── support.tsx            # Modified — route to dashboard for agents

functions/
├── zoho-proxy/                # Existing — Desk API proxy
│   └── [[path]].ts
├── zoho-mail-proxy/           # NEW — Mail API proxy
│   └── [[path]].ts
├── zoho-calendar-proxy/       # NEW — Calendar API proxy
│   └── [[path]].ts
└── zoho-crm-proxy/            # NEW — CRM API proxy
│   └── [[path]].ts
```

### Modified Files

| File | Changes |
|------|---------|
| `classic/src/pages/support.tsx` | Route agents to WorkstationDashboard |
| `classic/src/components/ZohoTickets/useZohoAuth.ts` | Add new OAuth scopes |
| `.mcp.json` | Add new MCP servers for dev exploration |

---

## Implementation Phases

### Phase 1: Foundation (Infrastructure)
**Goal**: Set up proxies, OAuth scopes, and dashboard shell

**Tasks**:
1. [ ] Update OAuth scopes in `useZohoAuth.ts`
2. [ ] Create `WorkstationDashboard.tsx` with widget placeholders
3. [ ] Create `zoho-mail-proxy/[[path]].ts`
4. [ ] Create `zoho-calendar-proxy/[[path]].ts`
5. [ ] Create `zoho-crm-proxy/[[path]].ts`
6. [ ] Modify `support.tsx` to show dashboard for agents

**Deliverable**: Dashboard shell with "Coming soon" widgets, working proxies

### Phase 2: CRM Integration (Customer Context)
**Goal**: Show customer info when handling tickets

**Why first**: Highest value-add for support workflow — agents can see customer context while working tickets

**Tasks**:
1. [ ] Create `crmApi.ts` with functions:
   - `searchContactByEmail(token, email)`
   - `getContact(token, id)`
   - `getAccount(token, accountId)`
   - `getAccountTickets(token, accountId)` — cross-reference with Desk
2. [ ] Create `CRMPanel.tsx` with:
   - Search by email/name
   - Contact card (name, email, phone, company)
   - Account info (name, SLA level, open tickets count)
   - Quick links: open tickets, recent interactions
3. [ ] Integrate into `TicketDetail.tsx`:
   - Auto-load contact when viewing ticket
   - Show CRM panel alongside ticket conversation

**Deliverable**: Customer context panel in ticket view

### Phase 3: Mail Integration
**Goal**: Full email client in workstation

**Tasks**:
1. [ ] Create `mailApi.ts` with functions:
   - `listFolders(token)` — inbox, sent, drafts, etc.
   - `listMessages(token, folderId, page)`
   - `getMessage(token, messageId)`
   - `sendMessage(token, data)`
   - `searchMessages(token, query)`
2. [ ] Create `MailWidget.tsx`:
   - Unread count badge
   - Last 3 emails preview
   - "Open Mail" button
3. [ ] Create `MailFullView.tsx`:
   - Folder sidebar
   - Email list with preview
   - Email detail with threading
   - Reply/forward actions
4. [ ] Create `MailCompose.tsx`:
   - To, Cc, Bcc fields
   - Rich text editor
   - Attachments

**Deliverable**: Full email client accessible from workstation

### Phase 4: Calendar Integration
**Goal**: Full calendar management

**Tasks**:
1. [ ] Create `calendarApi.ts` with functions:
   - `listCalendars(token)`
   - `listEvents(token, calendarId, start, end)`
   - `getEvent(token, eventId)`
   - `createEvent(token, data)`
   - `updateEvent(token, eventId, data)`
   - `deleteEvent(token, eventId)`
2. [ ] Create `CalendarWidget.tsx`:
   - Next event countdown
   - Today's events list
   - "Open Calendar" button
3. [ ] Create `CalendarFullView.tsx`:
   - Month/week/day views
   - Event creation modal
   - Event detail panel

**Deliverable**: Full calendar accessible from workstation

### Phase 5: Polish & Integration
**Goal**: Seamless workflow between all services

**Tasks**:
1. [ ] Cross-service linking:
   - Email → Create ticket from email
   - Calendar → Link meeting to ticket
   - CRM → Quick email to contact
2. [ ] Keyboard shortcuts
3. [ ] Notification badges
4. [ ] Loading states and error handling
5. [ ] Mobile responsiveness
6. [ ] Dark mode support (already partially done)

**Deliverable**: Production-ready workstation

---

## API Reference

### Zoho Mail API (EU)

```
Base: https://mail.zoho.eu/api/v1
Headers: 
  Authorization: Zoho-oauthtoken {token}

GET  /accounts                                    — list mail accounts
GET  /accounts/{accountId}/folders                — list folders
GET  /accounts/{accountId}/folders/{folderId}     — folder details
GET  /accounts/{accountId}/folders/{folderId}/messages — list messages
GET  /accounts/{accountId}/folders/{folderId}/messages/{messageId} — message detail
POST /accounts/{accountId}/messages               — send email
```

### Zoho Calendar API (EU)

```
Base: https://calendar.zoho.eu/api/v1
Headers:
  Authorization: Zoho-oauthtoken {token}

GET  /calendars                                   — list calendars
GET  /calendars/{calendarId}/events               — list events
GET  /events/{eventId}                            — event detail
POST /calendars/{calendarId}/events               — create event
PUT  /calendars/{calendarId}/events/{eventId}     — update event
DELETE /calendars/{calendarId}/events/{eventId}   — delete event
```

### Zoho CRM API (EU)

```
Base: https://www.zohoapis.eu/crm/v8
Headers:
  Authorization: Zoho-oauthtoken {token}

GET  /Contacts                                    — list contacts
GET  /Contacts/{id}                               — contact detail
GET  /Contacts/search?email={email}               — search by email
GET  /Accounts                                    — list accounts
GET  /Accounts/{id}                               — account detail
GET  /Accounts/search?word={query}                — search accounts
```

---

## MCP Server Configuration (Dev Only)

Add to `.mcp.json` for development exploration:

```json
{
  "mcpServers": {
    "zoho-desk": {
      "type": "http",
      "url": "https://desk-20110877848.zohomcp.eu/mcp/message?key=228863b8c981ddad376c42a98ed36f04"
    },
    "zoho-mail": {
      "type": "http",
      "url": "https://nxgs-20110877848.zohomcp.eu/mcp/message?key=f50510b3755828f703e81112e180373a"
    },
    "zoho-calendar": {
      "type": "http",
      "url": "https://calendar-20110877848.zohomcp.eu/mcp/message?key=fbf99eb19f7517bbf700100abf90387d"
    },
    "zoho-crm": {
      "type": "http",
      "url": "https://mcp2-20110877848.zohomcp.eu/mcp/message?key=143d7fe3ce88efe14ac703e0ef7cae39"
    }
  }
}
```

**WARNING**: These MCP URLs must NEVER be exposed in browser code. They are for Claude/Cursor to explore API structures during development only.

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Dashboard shows for agent login
- [ ] All 3 proxy functions exist and respond to requests
- [ ] OAuth scopes updated in Zoho Console

### Phase 2 Complete When:
- [ ] CRM panel shows customer info when viewing ticket
- [ ] Search works by email
- [ ] Account info shows ticket count

### Phase 3 Complete When:
- [ ] Mail widget shows unread count
- [ ] Full mail view lists, reads, sends emails
- [ ] Compose works with attachments

### Phase 4 Complete When:
- [ ] Calendar widget shows next event
- [ ] Full calendar view shows month/week/day
- [ ] Event creation and editing works

### Phase 5 Complete When:
- [ ] Cross-service linking works
- [ ] Mobile responsive
- [ ] Production deployed

---

## Open Questions

1. **Zoho OAuth Client**: Does the existing OAuth client (`1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN`) support Mail, Calendar, and CRM scopes? May need to create a new client or update scopes in Zoho API Console.

2. **Authentication Refresh**: Current OAuth uses `access_type: online` (short-lived tokens). For a workstation that's open all day, should we implement refresh tokens?

---

## MCP Exploration Results (2026-03-16)

### Services Status

| Service | MCP URL | Auth Status | Tools Available |
|---------|---------|-------------|-----------------|
| Mail | `nxgs-*.zohomcp.eu` | Requires OAuth | Folders, Messages, Tags, Accounts, Tasks |
| Calendar | `calendar-*.zohomcp.eu` | Requires OAuth | Calendars, Events, Reminders |
| CRM | `mcp2-*.zohomcp.eu` | Requires OAuth | Contacts, Accounts, Modules, Search |

### Confirmed OAuth Scopes

```typescript
const WORKSTATION_SCOPES = [
  // Desk (existing)
  'Desk.tickets.READ',
  'Desk.tickets.UPDATE',
  'Desk.tickets.CREATE',
  'Desk.contacts.READ',
  'Desk.agents.READ',
  'Desk.search.READ',
  'Desk.basic.READ',
  
  // Mail
  'ZohoMail.accounts.READ',
  'ZohoMail.folders.READ',
  'ZohoMail.messages.READ',
  'ZohoMail.messages.CREATE',
  'ZohoMail.messages.UPDATE',
  
  // Calendar
  'ZohoCalendar.calendar.READ',
  'ZohoCalendar.event.READ',
  'ZohoCalendar.event.CREATE',
  'ZohoCalendar.event.UPDATE',
  'ZohoCalendar.event.DELETE',
  
  // CRM
  'ZohoCRM.modules.READ',
  'ZohoCRM.modules.contacts.READ',
  'ZohoCRM.modules.accounts.READ',
  
  // Profile
  'aaaserver.profile.read',
].join(',');  // IMPORTANT: Use commas, not spaces!
```

### Scope Formatting Rules
- Separator: **commas** (`,`), NOT spaces
- Pattern: `ServiceName.operation.READ/CREATE/UPDATE/DELETE/ALL`
- Case-sensitive: operation types are UPPERCASE

---

## Timeline Estimate

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1 | 1-2 days | None |
| Phase 2 | 2-3 days | Phase 1 |
| Phase 3 | 3-4 days | Phase 1 |
| Phase 4 | 2-3 days | Phase 1 |
| Phase 5 | 2-3 days | Phases 2-4 |

**Total**: ~10-15 days

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-16 | Use OAuth + proxy pattern, not MCP | MCP is admin-level, no tenant isolation. Same pattern as existing tickets. |
| 2026-03-16 | Dashboard with widgets layout | User preference; allows overview + drill-down. |
| 2026-03-16 | CRM phase before Mail/Calendar | Highest value for support workflow; can start while exploring Mail/Calendar APIs. |
