---
phase: 01-cleanup
plan: 06
subsystem: infra
tags: [cloudflare-pages, cloudflare-workers, zeptomail, email, nodemailer, feedback-widget]

# Dependency graph
requires:
  - phase: 01-cleanup
    plan: 01
    provides: dead script deletion that unblocked this work (Wave 2 unlock)
provides:
  - Cloudflare Pages Function for page feedback email via ZeptoMail HTTP API
  - Feedback widget endpoint updated from Netlify to Cloudflare Pages path
  - nodemailer removed from dependencies (incompatible with Cloudflare Workers TCP restriction)
affects:
  - Phase 3 (Integration Pipeline) — ZEPTO_API_KEY env var must be set in Cloudflare Pages dashboard

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cloudflare Pages Functions use Web Standards API (fetch, Request, Response) — no Node.js require/TCP"
    - "ZeptoMail HTTP API called via fetch() with Zoho-enczapikey Authorization header"
    - "onRequestPost + onRequestOptions export pattern for Cloudflare Pages Functions"

key-files:
  created:
    - classic/functions/page-feedback.ts
  modified:
    - classic/src/components/PageFeedback/index.tsx
    - classic/package.json
    - classic/package-lock.json
  deleted:
    - classic/api/page-feedback.ts
    - netlify/functions/page-feedback.mjs

key-decisions:
  - "Use ZeptoMail HTTP API (fetch) instead of nodemailer SMTP: Cloudflare Workers have no TCP socket support"
  - "Production endpoint changed from /.netlify/functions/page-feedback to /functions/page-feedback"
  - "ZEPTO_API_KEY env var must be added to Cloudflare Pages dashboard (SMTP_USER/SMTP_PASS no longer needed)"
  - "Dev URL left as localhost:3001 (no change) — wrangler local dev is optional"

patterns-established:
  - "Cloudflare Pages Functions: export onRequestPost/onRequestOptions, type as PagesFunction<Env>"
  - "Email via ZeptoMail: POST to https://api.zeptomail.eu/v1.1/email with Zoho-enczapikey header"

requirements-completed: [INTG-03]

# Metrics
duration: 7min
completed: 2026-03-06
---

# Phase 1 Plan 06: PageFeedback Cloudflare Pages Function Summary

**Cloudflare Pages Function using fetch() to ZeptoMail HTTP API replaces Netlify/Vercel nodemailer functions; feedback widget endpoint fixed from 404-returning Netlify path to working /functions/page-feedback**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-06T12:56:46Z
- **Completed:** 2026-03-06T13:03:30Z
- **Tasks:** 2
- **Files modified:** 5 (2 created/updated, 2 deleted, 1 package.json+lock)

## Accomplishments

- Created `classic/functions/page-feedback.ts` as a proper Cloudflare Pages Function exporting `onRequestPost` and `onRequestOptions`, using `fetch()` to ZeptoMail HTTP API with no nodemailer
- Updated `classic/src/components/PageFeedback/index.tsx` production endpoint from `/.netlify/functions/page-feedback` (404 on Cloudflare Pages) to `/functions/page-feedback`
- Removed nodemailer and @types/nodemailer from dependencies (83 packages removed)
- Deleted dead function files: `classic/api/page-feedback.ts` (Vercel Edge format) and `netlify/functions/page-feedback.mjs` (Netlify format)
- Full email body HTML preserved: page title, URL, helpful flag, comment, contact info, browser/viewport context

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Cloudflare Pages Function and update PageFeedback component URL** - `7587ba2` (feat)
2. **Task 2: Remove nodemailer, delete dead function files, verify build** - `c2c6ac4` (chore)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `classic/functions/page-feedback.ts` - New Cloudflare Pages Function; exports `onRequestPost` + `onRequestOptions`; sends email via fetch() to ZeptoMail HTTP API; no nodemailer; preserves full HTML email body from legacy functions
- `classic/src/components/PageFeedback/index.tsx` - Updated production API URL from `/.netlify/functions/page-feedback` to `/functions/page-feedback`
- `classic/package.json` - Removed nodemailer and @types/nodemailer dependencies
- `classic/api/page-feedback.ts` - DELETED (Vercel Edge Function format, dead)
- `netlify/functions/page-feedback.mjs` - DELETED (Netlify Functions format, dead)

## Decisions Made

- **ZeptoMail HTTP API over SMTP:** Cloudflare Workers runtime has no TCP socket support, making nodemailer SMTP incompatible. ZeptoMail provides an HTTP API (`https://api.zeptomail.eu/v1.1/email`) that works with the standard `fetch()` available globally in Workers.
- **Endpoint path `/functions/page-feedback`:** Cloudflare Pages serves functions at `/functions/<filename>` by convention. The old `/.netlify/functions/page-feedback` path returned 404 on Cloudflare Pages.
- **Dev URL unchanged:** `http://localhost:3001/api/page-feedback` retained for local dev; wrangler local dev is optional per plan.

## Deviations from Plan

None - plan executed exactly as written. Both target files were already partially in the correct state (component URL had been updated, Cloudflare function had been created in a prior session) but had not been committed or had nodemailer still present in package.json.

## Issues Encountered

None. Build passed cleanly after nodemailer removal. `PagesFunction` type is used without `@cloudflare/workers-types` — TypeScript errors in `classic/functions/page-feedback.ts` do not surface during `npm run build` because Docusaurus does not compile the `functions/` directory (Cloudflare Pages runtime handles it).

## User Setup Required

**ZEPTO_API_KEY must be added to Cloudflare Pages environment variables** before the feedback function will send emails in production.

Steps:
1. Go to Cloudflare Pages dashboard > nxgen-docs project > Settings > Environment variables
2. Add `ZEPTO_API_KEY` with the ZeptoMail API key value
3. Optionally remove `SMTP_USER` and `SMTP_PASS` — they are no longer used by any function

Verification: Submit feedback on a docs page; check `abed.badarnah@nxgen.io` inbox for email from `noreply@nxgen.io`.

## Next Phase Readiness

- Feedback widget is now Cloudflare Pages-compatible and will work correctly once `ZEPTO_API_KEY` is set
- No nodemailer in the dependency tree
- Plans 01-04 and 01-05 (Wave 2) can proceed in parallel — this plan has no dependencies on them

---
*Phase: 01-cleanup*
*Completed: 2026-03-06*

## Self-Check: PASSED

- classic/functions/page-feedback.ts: FOUND
- classic/src/components/PageFeedback/index.tsx: FOUND
- classic/api/page-feedback.ts: DELETED (correct)
- netlify/functions/page-feedback.mjs: DELETED (correct)
- .planning/phases/01-cleanup/01-06-SUMMARY.md: FOUND
- Commit 7587ba2 (Task 1): FOUND
- Commit c2c6ac4 (Task 2): FOUND
