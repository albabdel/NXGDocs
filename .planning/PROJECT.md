# NXGEN GCXONE Documentation Platform

## What This Is

A public knowledge base for the NXGEN GCXONE platform, built on Docusaurus and deployed to Cloudflare Pages. The site covers product documentation, release notes, long-form articles, and reference content. This project connects a headless CMS (Sanity) to the existing frontend so content can be edited and published through a web UI — no code required.

## Core Value

Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Sanity CMS integrated as content source for all content types
- [ ] Content editable via Sanity Studio web UI (write, click publish)
- [ ] Publishing in Sanity triggers automatic Cloudflare Pages rebuild
- [ ] All dead CMS code removed (Storyblok, TinaCMS, Hygraph, Strapi, Payload, Tiptap, Monaco)
- [ ] Unused dependencies audited and removed (~60+ packages → lean bundle)
- [ ] Component library simplified and documented (50+ → only what's actually used)
- [ ] Broken links resolved (currently ignored with `onBrokenLinks: 'ignore'`)
- [ ] 3,800-line CSS cleaned and consolidated
- [ ] Search and navigation improved — users find content faster
- [ ] Content structure and sidebar organization refined
- [ ] Visual polish — current direction refined, inconsistencies fixed
- [ ] Sanity schemas configured via MCP (Claude handles technical setup)

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
- **Search**: Algolia (keep — working well)
- **Code style**: Vibe-coded, maintained via Claude — favor simple, readable over clever
- **Codebase health**: Significant dead weight from past experiments; deep clean is a prerequisite before adding anything new

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

---
*Last updated: 2026-03-06 after initialization*
