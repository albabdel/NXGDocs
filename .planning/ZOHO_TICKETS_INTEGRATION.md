# Zoho Desk Ticket Integration — Tracking & Handover Doc

> Last updated: 2026-03-15
> Status: **READY TO BUILD — Zoho explored, data structure confirmed, OAuth working**

---

## Overview

Embed a full Zoho Desk ticket portal inside the NXGEN docs site so customers can track and manage their support tickets without leaving the platform. The integration is **completely independent** from the main SaaS product — no changes to the SaaS backend.

### Goals
- View all tickets (status, priority, subject, thread)
- Write comments on tickets
- Open / close tickets
- Two login modes:
  - **Internal (Agent)** — NXGEN staff, sees all tickets with no tenant restriction
  - **End User (Contact)** — customer, sees only their org's tickets (tenant-isolated via Zoho)

---

## Architecture Decision

**Approach: Zoho OAuth with browser-direct API calls**

Users sign in with their own Zoho accounts (agent or contact). The browser gets a user-scoped OAuth token, which is then used to call the Zoho Desk REST API directly. Tenant isolation is enforced by Zoho itself — a Contact's token only returns tickets linked to their Contact record / Account.

```
User (browser)
  ↓ clicks "Sign in with Zoho"
Zoho OAuth (accounts.zoho.eu)
  ↓ returns access token scoped to that user
NXGEN Docs /support page
  ↓ calls Zoho Desk REST API with user token
Zoho Desk API (desk.zoho.eu/api/v1)
  ↓ returns tickets the user is authorized to see
```

No proxy backend needed for Phase 1 (agent login). May need a lightweight Cloudflare Worker in Phase 2 if CORS becomes an issue with Contact portal tokens.

**Why not the MCP endpoint for live user calls?**
The MCP URL (`desk-20110877848.zohomcp.eu/mcp/message?key=...`) is an admin key for AI tool use only. It must never be exposed in the browser — it bypasses all tenant isolation. It is only used by Claude during development to inspect the Zoho configuration.

---

## Known Configuration Values

| Key | Value | Source |
|-----|-------|--------|
| Zoho Org ID | `20067436506` | Confirmed via MCP `getOrganizations` |
| Zoho Company | NXGEN Technology AG, Zurich, CH | Confirmed via MCP |
| Zoho Portal Name | `nxgentechnology` | Confirmed via MCP |
| Zoho Portal URL | `https://helpdesk.nxgen.io/agent/nxgentechnology` | Confirmed via MCP |
| Main Department ID | `17599000000007061` | "NXGEN Technology AG" — only enabled dept |
| Zoho Datacenter | EU | MCP URL uses `.eu` TLD |
| API Base URL | `https://desk.zoho.eu/api/v1` | EU datacenter |
| Auth Endpoint | `https://accounts.zoho.eu/oauth/v2/auth` | EU datacenter |
| Token Endpoint | `https://accounts.zoho.eu/oauth/v2/token` | EU datacenter |
| Required Headers | `Authorization: Zoho-oauthtoken {token}` + `orgId: 20067436506` | Confirmed working |
| MCP Endpoint | `https://desk-20110877848.zohomcp.eu/mcp/message?key=...` | Dev/AI use only |
| MCP OAuth Client ID | `1000.74OGCXOVDQ7CEELAD7VUSDCCDS433P` | Dynamic registration |
| Docs OAuth Client ID | `1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN` | User-created in API Console |

> Note: `20110877848` in the MCP subdomain is NOT the orgId — it's a Zoho-internal MCP routing ID. The real orgId is `20067436506`.

---

## Phases

### Phase 1 — Internal Login (Agent, no tenant restriction)
**Status: COMPLETE ✅ — tested locally 2026-03-15, all features working**

Deliverables:
- [x] `/support` page — Zoho OAuth login (implicit grant, no secret in browser)
- [x] Ticket list with status filters (All / Open / On Hold / Closed) + pagination
- [x] Priority + status + overdue badges
- [x] Ticket detail with full conversation thread (agent/customer avatars)
- [x] Add comment (Cmd+Enter shortcut)
- [x] Open ↔ Close ticket toggle
- [x] Sign out (clears sessionStorage)
- [x] Build passes ✓

Files: `classic/src/pages/support.tsx` + `classic/src/components/ZohoTickets/` (7 files)

**Known limitation**: Zoho's native portal auto-translates ticket content for agents, but this doesn't come through the REST API — content arrives in the original language (German for most customers). Browser translate (right-click → Translate) works as a workaround. A native translate button can be added if needed.

### Phase 2 — End User Login (Contact, tenant-isolated)
**Status: NOT STARTED**

End customers sign in with their Zoho contact portal credentials. Zoho's own OAuth scoping ensures they only see tickets associated with their Contact record (which is linked to their org Account). No server-side filtering needed.

Deliverables:
- Same UI as Phase 1
- OAuth flow for Contacts (may require Help Center portal to be enabled in Zoho)
- Login mode toggle: "I'm a customer" / "NXGEN Staff"

### Phase 3 — Polish & Features
**Status: NOT STARTED**

- Create new ticket from within the docs site
- File attachments
- Ticket search and filtering
- Ticket status badges with NXGEN Gold branding
- Mobile responsive layout

---

## Action Items

### Zoho Console Actions (you must do these)

#### Step 1 — Finish creating the OAuth app
Go to: **https://api-console.zoho.eu** → Add Client

| Field | What to enter |
|-------|---------------|
| Client Type | **Single Page Application** (no client secret, uses PKCE) |
| Client Name | `NXGEN Docs Portal` (or similar) |
| Homepage URL | `https://<your-docs-domain>` |
| Authorized Redirect URI #1 | `http://localhost:3000/support` |
| Authorized Redirect URI #2 | `https://<your-docs-domain>/support` |
| JavaScript Domain #1 | `http://localhost:3000` |
| JavaScript Domain #2 | `https://<your-docs-domain>` |

> Replace `<your-docs-domain>` with wherever the docs site is deployed (e.g. `docs.nxgen.cloud`).
> If you don't have a production URL yet, just the localhost entries are fine to start.

After creating, note:
- **Client ID** — record it below

#### Step 2 — Enable Multi-DC support (so EU users work correctly)
In the OAuth app settings → enable "Multi DC" or "Support across datacenters". This ensures the EU `accounts.zoho.eu` endpoint is used.

#### Step 3 — Note your orgId
Already known: `20110877848` — confirm this is correct by checking **Zoho Desk → Setup → Developer Space → API → OrgId**.

#### Step 4 — Check Contact Portal is enabled (for Phase 2)
**Zoho Desk → Setup → Channels → Help Center → Settings**
- Confirm the Help Center (customer portal) is enabled
- Note the portal domain (e.g. `support.nxgen.cloud` or `nxgen.zohodesk.eu`)

---

### Dev Actions (Claude will do these)

- [ ] Build `/support` page with OAuth PKCE login flow
- [ ] Implement ticket list component (table + cards)
- [ ] Implement ticket detail + comment thread
- [ ] Add comment (POST to Zoho API)
- [ ] Change ticket status (PATCH to Zoho API)
- [ ] Sign out / clear token
- [ ] Route guard: redirect to login if no token
- [ ] Style in NXGEN Gold design system (match existing pages)
- [ ] Phase 2: Contact login mode
- [ ] Phase 2: Login mode selector on the support page

---

## Credentials Record

```
Docs OAuth Client ID:     1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN
Docs OAuth Client Type:   Client-based / SPA (PKCE)
Zoho Org ID:              20067436506
Main Department ID:       17599000000007061
Zoho Datacenter:          EU
MCP OAuth Client ID:      1000.74OGCXOVDQ7CEELAD7VUSDCCDS433P (dynamic, dev only)
```

> Client secret obtained but should NOT be committed to git or put in the browser.
> MCP refresh token stored in dev environment only — do NOT commit.
> See .env.local for secrets.

---

## MCP Server — Dev Use Only

The Zoho MCP server can be added to Claude Code during development so Claude can inspect the live Zoho configuration (ticket fields, statuses, departments, contact structure) without guessing.

**To add to Claude Code (run once in this project):**
```bash
claude mcp add zoho-desk --transport http "https://desk-20110877848.zohomcp.eu/mcp/message?key=228863b8c981ddad376c42a98ed36f04"
```

This gives Claude tools like `list_tickets`, `get_ticket`, `list_contacts` to understand the real data structure during development. Remove or keep private — this key is admin-level.

---

## API Scopes Required

Request these scopes during the OAuth authorization redirect:

```
Desk.tickets.READ
Desk.tickets.UPDATE
Desk.contacts.READ
Desk.search.READ
Desk.basic.READ
aaaserver.profile.read
```

---

## Key API Endpoints (EU)

```
Base:          https://desk.zoho.eu/api/v1
Headers:       Authorization: Zoho-oauthtoken {token}
               orgId: 20110877848

GET  /tickets                        — list tickets
GET  /tickets/{id}                   — ticket detail
GET  /tickets/{id}/conversations     — full thread + comments
POST /tickets/{id}/comments          — add comment
PATCH /tickets/{id}                  — update status (open/close)
GET  /contacts                       — list contacts
GET  /contacts/{id}                  — contact detail
GET  /tickets/search?word={q}        — search
```

---

## Confirmed Data Structure (from live MCP exploration 2026-03-15)

### Ticket fields
```
id, ticketNumber, subject, description (HTML), status, statusType, priority
createdTime, modifiedTime, closedTime, dueDate
contactId, accountId, departmentId
channel, email, threadCount, commentCount
customFields: { "Sub Clasification", "Device Type", "SLA Level", "Revenue Impact", ... }
webUrl (direct link to ticket in Zoho portal)
```

### Conversation item fields
```
id, type ("comment" | thread), content, contentType ("html")
commentedTime, isPublic
commenter: { id, firstName, lastName, name, email, photoURL, roleName, type ("END_USER"|"AGENT") }
isDescriptionThread (true for original message)
```

### Accounts (tenant isolation)
Each ticket has an `accountId`. Real accounts: FireSense, control Sicherheit, AXIS, VCA Technology, etc.
For Phase 2 tenant isolation: filter tickets by `accountId` matching the logged-in contact's account.

### Departments
Only one active department: `17599000000007061` ("NXGEN Technology AG")
All ticket queries require `departmentId` as a mandatory param.

---

## Open Questions

- [ ] What is the deployed docs domain? Redirect URIs added: `https://docs.nxgen.cloud` and `https://gcxone.pages.dev` — confirm which is production
- [ ] Are internal NXGEN staff set up as **Agents** in Zoho Desk? (needed for Phase 1 agent login)
- [ ] Are customers set up with **portal access** (Help Center login)? (needed for Phase 2)

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-15 | Use Zoho OAuth directly, not SaaS login | Keeps the ticket portal independent from the main SaaS product. Tenant isolation handled by Zoho's own token scoping. |
| 2026-03-15 | Start with Agent login (Phase 1) before Contact login | Simpler OAuth flow, no tenant scoping logic needed, validates the full UI before tackling the contact portal auth mechanism. |
| 2026-03-15 | SPA / PKCE OAuth app (no client secret) | Docs site is a static Docusaurus site with no persistent backend. PKCE is the secure alternative for public clients. |
| 2026-03-15 | MCP key = dev-only tool for Claude | Admin key, would expose all data if put in the browser. Used by Claude to inspect Zoho config during development. |
