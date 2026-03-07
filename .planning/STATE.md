---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Completed 02-cms-setup 02-02-PLAN.md
last_updated: "2026-03-07T07:09:00.758Z"
last_activity: 2026-03-06 — Roadmap created; 5 phases derived from 18 v1 requirements
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 11
  completed_plans: 10
  percent: 17
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-06)

**Core value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.
**Current focus:** Phase 1 — Cleanup

## Current Position

Phase: 1 of 5 (Cleanup)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-03-06 — Roadmap created; 5 phases derived from 18 v1 requirements

Progress: [██░░░░░░░░] 17%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01-cleanup P01 | 6 | 2 tasks | 35 files |
| Phase 01-cleanup P02 | 8min | 2 tasks | 24 files |
| Phase 01-cleanup P03 | 16min | 2 tasks | 3 files |
| Phase 01-cleanup P06 | 3min | 2 tasks | 5 files |
| Phase 01-cleanup P04 | 70 | 2 tasks | 1 files |
| Phase 01-cleanup P05 | 29 | 2 tasks | 135 files |
| Phase 02-cms-setup P02 | 42 | 2 tasks | 6 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Merged Phase 3 (plugin) and Phase 4 (webhook) from research into one Integration Pipeline phase — they share the same env vars and are verified together end-to-end
- [Roadmap]: INTG-04 (broken links) assigned to Phase 1 (Cleanup) not Phase 3 — it is a cleanup concern that unblocks stable builds, not a CMS concern
- [Research flag]: Phase 2 requires experimentation on how Docusaurus `<Tabs>` and `<Steps>` map to Sanity Portable Text custom block types — resolve during Phase 2 planning
- [Research flag]: Phase 4 requires evaluation of markdown-to-Portable-Text library (`sanity-markdown-to-blocks` vs `mdast-util-to-portable-text` vs manual) — JSX-heavy MDX makes this the most ambiguous technical choice
- [Phase 01-cleanup]: Delete sanitize.ts: SSG-unsafe DOMPurify wrapper whose only consumer was Storyblok
- [Phase 01-cleanup]: Delete scripts/lib/markdown-to-richtext.js: sole consumer (migrate-articles) was deleted in same plan
- [Phase 01-cleanup]: Keep index:algolia in package.json scripts despite not being in explicit target shape — plan says preserve Algolia scripts
- [Phase 01-cleanup]: All 15 components confirmed orphaned via grep before deletion - no active callers in pages/, theme/, or docs/
- [Phase 01-cleanup]: CSS custom.css baseline for Plan 04: 3,832 lines - deleted components used CSS modules not global rules, no global CSS removal needed
- [Phase 01-cleanup]: Keep framer-motion: 25+ active import calls across pages/ and components/ - confirmed active library
- [Phase 01-cleanup]: Keep nodemailer + @types/nodemailer: reserved for Plan 01-06 Cloudflare Pages Function
- [Phase 01-cleanup]: Delete src/i18n/index.ts: orphaned module with no consumers, references now-removed packages
- [Phase 01-cleanup]: Use ZeptoMail HTTP API (fetch) for page feedback emails: Cloudflare Workers have no TCP socket support, making nodemailer SMTP incompatible
- [Phase 01-cleanup]: Delete classic/api/page-feedback.ts (Vercel) and netlify/functions/page-feedback.mjs: both platform-incompatible with Cloudflare Pages and now superseded by classic/functions/page-feedback.ts
- [Phase 01-cleanup]: ZEPTO_API_KEY must be added to Cloudflare Pages env vars; SMTP_USER/SMTP_PASS no longer needed by feedback function
- [Phase 01-cleanup]: CSS feature card global rules confirmed dead: active components use CSS modules; global .feature-card system removed as orphaned
- [Phase 01-cleanup]: CSS stops at 3531 lines (not 2000): remaining rules are all live Docusaurus theme elements — plan stopping condition 'only genuinely-shared rules remain' met
- [Phase 01-cleanup]: Create docs/support/contact.md stub as target for 92 broken support-ticket links rather than mass link removal
- [Phase 01-cleanup]: onBrokenLinks set to throw: build now fails on any future broken internal link - regression gate active
- [Phase 02-cms-setup]: referencePage not reference: Sanity reserves 'reference' as a built-in type — document type renamed to 'referencePage'; Phase 3 GROQ must use _type == 'referencePage'
- [Phase 02-cms-setup]: Shared bodyField pattern: portableText.ts exports one bodyField imported by all 4 document types, preventing copy-paste drift
- [Phase 02-cms-setup]: Callout body uses type: 'text' not nested array: nested Portable Text inside defineArrayMember causes Studio recursion issues

### Pending Todos

None yet.

### Blockers/Concerns

- [Pre-Phase 1]: Dead `prebuild` hook calls `fetchHygraphContent.js` — remove from `package.json` on day one before any other build attempts
- [Pre-Phase 1]: Storyblok pages and lib must be deleted atomically — delete pages first, then components, then lib, then npm packages; partial deletion causes TypeScript module resolution errors
- [Pre-Phase 4]: Decision required before Phase 2 schema work — whether to keep, consolidate, or remove the six role-based `@docusaurus/plugin-content-docs` instances; affects `targetAudience` field design in Sanity schema

## Session Continuity

Last session: 2026-03-07T07:09:00.756Z
Stopped at: Completed 02-cms-setup 02-02-PLAN.md
Resume file: None
