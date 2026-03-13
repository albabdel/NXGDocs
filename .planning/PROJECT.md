# NXGEN GCXONE Documentation Platform

## What This Is

A public knowledge base for the NXGEN GCXONE platform, built on Docusaurus and deployed to Cloudflare Pages. The site covers product documentation, release notes, long-form articles, and reference content. This project connects a headless CMS (Sanity) to the existing frontend so content can be edited and published through a web UI — no code required.

## Core Value

Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.

## Current Milestone: v1.1 Releases & Roadmap

**Goal:** Give customers a proper public releases page and a browseable product roadmap — both managed entirely through Sanity Studio.

**Target features:**
- Bi-weekly release entries (one doc per sprint, items inside) with text, screenshots, and/or video per item
- Public /releases page replacing legacy /releases and /internal-releases/
- Hero banner dynamically shows latest release title + date from Sanity
- Public /roadmap page with search, items tagged by status (Planned / In Progress / Shipped)
- Roadmap item fields: business value, change type, UI change, UX fixes, entities impacted
- Shipped roadmap items link to their release note

## Requirements

### Validated

- ✓ Sanity CMS integrated as content source — v1.0
- ✓ Content editable via Sanity Studio web UI — v1.0
- ✓ Publishing in Sanity triggers automatic Cloudflare Pages rebuild — v1.0
- ✓ All dead CMS code removed — v1.0
- ✓ Unused dependencies removed — v1.0
- ✓ Broken links resolved — v1.0
- ✓ CSS consolidated — v1.0
- ✓ Search and navigation improved — v1.0
- ✓ Visual polish — v1.0

### Active

- [ ] Release entries managed in Sanity (one doc per sprint, items as array)
- [ ] Each release item supports text, screenshots, and/or video
- [ ] Public /releases page displays all releases in reverse-chronological order
- [ ] Hero banner shows latest release title + date, dynamically pulled from Sanity
- [ ] Legacy /releases and /internal-releases/ replaced and archived
- [ ] Public /roadmap page displays all backlog items with status filter and search
- [ ] Roadmap items have: title, status, business value, change type, UI change flag, UX fixes flag, entities impacted
- [ ] Shipped roadmap items link to their corresponding release note

### Out of Scope

- Mobile app — web-first
- Multi-language support — disabled in current config, not a priority
- Self-hosted CMS — no backend for the user to configure
- Building a new frontend from scratch — polish and extend what exists
- Real-time collaborative editing — not needed for solo/small team
- Zoho Sprints sync — too complex for now; Sanity Studio is the source of truth
- Private/internal roadmap view — public only for v1.1

### Out of Scope

- Mobile app — web-first
- Multi-language support — disabled in current config, not a priority
- Self-hosted CMS — no backend for the user to configure
- Building a new frontend from scratch — polish and extend what exists
- Real-time collaborative editing — not needed for solo/small team

## Context

- **Frontend**: Docusaurus (TypeScript), deployed to Cloudflare Pages at docs.nxgen.cloud
- **Current content**: MDX files in git repo, organized across ~15 doc sections
- **Previous CMS attempts**: Hygraph, Storyblok, Strapi, TinaCMS, Payload — all abandoned due to configuration complexity
- **Editing workflow today**: Edit MDX files in VS Code, commit, deploy — too technical
- **Images**: Cloudinary (keep — working well)
- **Search**: docusaurus-search-local (replaced Algolia in v1.0 — working well)
- **Code style**: Vibe-coded, maintained via Claude — favor simple, readable over clever
- **Codebase health**: Clean after v1.0 — dead code removed, CSS consolidated, Sanity integrated and live
- **Release cadence**: Bi-weekly sprints (e.g. Sprint 2025.12-A/B) — existing Sprint 2025.12-A and B to be archived

## Constraints

- **CMS**: Must have MCP server — Claude manages all schema/config, user only handles content and vision
- **Hosting**: Cloudflare Pages — build pipeline must support webhook-triggered rebuilds from Sanity
- **No backend maintenance**: User cannot configure or maintain servers — all infrastructure must be cloud-managed
- **Docusaurus**: Keep the existing frontend as the foundation; don't rebuild from scratch
- **Backwards compatibility**: Existing live URLs must continue to work after cleanup

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sanity as CMS | MCP server available, cloud-hosted, excellent web Studio editor, API-driven | — Pending |
| Deep clean before CMS integration | Dead code from 5 previous CMS attempts creates risk of conflicts and confusion | — Pending |
| Keep Docusaurus | Working frontend with good structure; rebuild cost not justified | — Pending |
| Keep Cloudinary + Algolia | Both are working integrations worth preserving | — Pending |
| Docusaurus fetches from Sanity at build time | Keeps static site benefits; webhook triggers rebuild on publish | — Pending |

| Replace releaseNote schema with release (one doc, items array) | Single doc per sprint matches bi-weekly publish workflow; simpler Studio UX | — Pending |
| Roadmap in Sanity, no Zoho sync | Too complex to sync; Sanity Studio is the editing surface the user already knows | — Pending |

---
*Last updated: 2026-03-13 after v1.1 milestone start*
