---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: complete
stopped_at: milestone complete
last_updated: "2026-03-08T00:00:00Z"
last_activity: 2026-03-08 — Phase 5 checkpoint approved; Phase 4 confirmed complete; v1.0 milestone done
progress:
  total_phases: 5
  completed_phases: 5
  total_plans: 21
  completed_plans: 21
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-06)

**Core value:** Non-technical editors can open a web UI, write content, and publish it — without a developer as a bottleneck.
**Current focus:** Milestone v1.0 complete

## Current Position

Phase: 5 of 5 — ALL PHASES COMPLETE
Status: Milestone v1.0 complete
Last activity: 2026-03-08 — Phase 5 human checkpoint approved; Phase 4 content migration confirmed complete

Progress: [██████████] 100%

## Milestone Summary

All 5 phases of v1.0 complete:
- Phase 1 (Cleanup): Dead CMS code removed, CSS consolidated, build stabilized
- Phase 2 (CMS Setup): Sanity Studio deployed, all 4 schemas locked
- Phase 3 (Integration Pipeline): Docusaurus-Sanity plugin built, publish webhook wired
- Phase 4 (Content Migration): All MDX content migrated to Sanity
- Phase 5 (Polish): Search (docusaurus-search-local), hero redesign, light mode contrast, visual consistency

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
- [Phase 02-cms-setup]: Studio URL confirmed as nxgen-docs.sanity.studio — hostname was available, no alternate needed — CF Pages uses unprefixed SANITY_* vars (not SANITY_STUDIO_*) for Phase 3 plugin build-time access — two separate namespaces for two separate consumers
- [Phase 02-cms-setup]: referencePage confirmed as Phase 3 GROQ contract via human Studio verification — Phase 3 must use _type == referencePage in all queries — Sanity reserves reference as a built-in cross-document reference type; referencePage is the actual document type name after Plan 02 rename
- [Phase 03-integration-pipeline]: Install @sanity/client and @portabletext/markdown into classic/ (not root/studio) — plugin runs inside Docusaurus build process
- [Phase 03-integration-pipeline]: Use test.skip for page-presence Playwright test until Plan 02 plugin is complete — Nyquist scaffold before implementation
- [Phase 03-integration-pipeline]: portableTextToMarkdown is the correct export from @portabletext/markdown v1 (not toMarkdown)
- [Phase 03-integration-pipeline]: docusaurus-plugin-sanity-content must be first in plugins[] — Docusaurus runs loadContent() in order, so cache must be populated before plugin-content-docs reads it
- [Phase 03-integration-pipeline]: Task 2 smoke test deferred until ZEPTO_API_KEY confirmed in CF Pages production — email delivery requires live deployment
- [Phase 03-integration-pipeline]: netlify/ directory exists as empty untracked git dir — no function files, plan intent met
- [Phase 05-polish]: Checkpoint not approved — 3 gaps identified: Pagefind migration (Gap 1), hero light mode design (Gap 2), general light mode contrast sweep (Gap 3)
- [Phase 05-polish]: playwright.config.ts: admin:server webServer block removed — script not in package.json, Decap CMS not required for nav/search/visual e2e tests
- [Phase 05-polish]: footer selector fix: toBeAttached() used instead of toBeVisible() — Docusaurus layout renders two footer elements, first is CSS-hidden
- [Phase 05-polish]: Background image opacity set to 0.40 in light mode (raised from 0.15) — threshold above which Background.jpg is visually meaningful on warm cream base
- [Phase 05-polish]: White overlay reduced from from-white/40...to-white/60 to from-white/10...to-white/25 — gradient no longer dominates top of hero
- [Phase 05-polish]: Light mode contrast sweep (05-06): all 4 #E8B058 instances in index.tsx confirmed covered — 3 text instances by line 1753 override, 1 decorative gradient needing no override
- [Phase 05-polish]: NXGENSphereHero Reimagined. subtitle already conditionally uses text-[#996B1F] directly in light mode — no CSS override needed for this element
- [Phase 05-polish]: Search: switched from @getcanary/docusaurus-theme-search-pagefind (shadow DOM, invisible modal) to @easyops-cn/docusaurus-search-local v0.55.1; docsPluginIdForPreferredVersion: 'sanity-docs' required (no default plugin ID); SearchBar rendered in Root.tsx with fixed positioning (navbar CSS-hidden globally)
- [Phase 05-polish]: Hero "How can we help?" search button replaced with "Explore Documentation" quick-link pills
- [Phase 05-polish]: ShareSection moved inside .theme-doc-toc-desktop container (not sibling) so padding-top clearance applies; sits directly above "ON THIS PAGE"
- [Phase 05-polish]: Phase 5 human checkpoint approved 2026-03-08

### Pending Todos

None — milestone v1.0 complete.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-03-08T00:00:00Z
Stopped at: Milestone v1.0 complete
Resume file: None
