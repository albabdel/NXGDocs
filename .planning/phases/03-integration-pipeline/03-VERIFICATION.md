---
phase: 03-integration-pipeline
verified: 2026-03-07T14:00:00Z
status: human_needed
score: 5/7 must-haves verified
re_verification: false
human_verification:
  - test: "Publish a document in Sanity Studio and confirm a Cloudflare Pages rebuild is triggered automatically"
    expected: "A new deployment entry appears in the CF Pages dashboard within ~60 seconds of clicking Publish. The live site at docs.nxgen.cloud/sanity-docs/test-integration-doc reflects the change within 5 minutes. No developer action was required."
    why_human: "Requires interacting with two external services (Sanity Studio and Cloudflare Pages dashboard) and observing real-time cross-service behavior. No local file check can substitute for this."
  - test: "POST to https://docs.nxgen.cloud/functions/page-feedback and confirm email delivery"
    expected: "curl returns HTTP 200 with {\"success\":true}. An email arrives at abed.badarnah@nxgen.io within ~60 seconds. ZEPTO_API_KEY must be confirmed set in Cloudflare Pages production environment variables first."
    why_human: "Requires a live deployed environment with ZEPTO_API_KEY set, and requires checking an email inbox — neither can be verified programmatically."
---

# Phase 3: Integration Pipeline Verification Report

**Phase Goal:** Sanity content appears in the live site automatically when an editor clicks publish in Studio
**Verified:** 2026-03-07T14:00:00Z
**Status:** human_needed — all automated checks pass; 2 items require human testing
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run build` fetches Sanity content via GROQ and populates `.sanity-cache/docs/` with .mdx files | VERIFIED | `classic/.sanity-cache/docs/` contains `test-integration-doc.mdx`, `test.mdx`, `test1234.mdx`. `scripts/fetch-sanity-content.js` (214 lines, substantive) is called from `build-with-memory.js` which is `npm run build` |
| 2 | Sanity-sourced pages appear in the Docusaurus output at `/sanity-docs/...` | VERIFIED | `classic/docusaurus.config.ts` lines 196-211: `plugin-content-docs` with `id: 'sanity-docs'`, `path: '.sanity-cache/docs'`, `routeBasePath: 'sanity-docs'`. Cache dir is populated |
| 3 | Publishing a document in Studio triggers a Cloudflare Pages rebuild | HUMAN NEEDED | CF deploy hook ID `403874da-0b3a-47b8-8cc9-0a06b8a4a490` on project `gcxone` confirmed created. Sanity webhook ID `m8FmSRhEutzU21C7` confirmed active with correct GROQ filter. End-to-end publish test not manually verified |
| 4 | Change appears on docs.nxgen.cloud within 5 minutes — no developer action required | HUMAN NEEDED | Depends on truth 3 — cannot verify without a live publish test |
| 5 | Feedback widget sends email via HTTP (ZeptoMail) without nodemailer | VERIFIED | `classic/functions/page-feedback.ts` uses `fetch()` to `https://api.zeptomail.eu/v1.1/email`. Two nodemailer occurrences are comments-only (lines 2 and 156). No import exists |
| 6 | No Vercel (classic/api/) or Netlify function files remain in the repo | VERIFIED | `classic/api/page-feedback.ts` absent. `netlify/` directory exists on disk but is empty and git-untracked (`git ls-files netlify/` returns nothing) |
| 7 | Live feedback endpoint returns HTTP 200 and delivers email | HUMAN NEEDED | Cannot verify without live deployment with ZEPTO_API_KEY set |

**Automated score:** 4/7 truths fully verified, 1 partially verified (truth 2 — build output confirmed, served route not live-tested), 2 require human action

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `classic/package.json` | `@sanity/client` and `@portabletext/markdown` dependencies | VERIFIED | Lines 30-31: `@portabletext/markdown ^1.1.4`, `@sanity/client ^7.16.0`. Also `@sanity/image-url ^2.0.3` (deviation from plan — planned install) |
| `classic/.gitignore` | `.sanity-cache/` exclusion | VERIFIED | Line 35: `.sanity-cache/` present |
| `.gitignore` (root) | `.sanity-cache/` exclusion | VERIFIED | Binary match confirmed via grep |
| `classic/e2e/sanity-content.spec.ts` | Playwright spec, min 20 lines | VERIFIED | 36 lines. Live filesystem test + skipped page-presence test (correctly skipped per plan intent) |
| `classic/plugins/docusaurus-plugin-sanity-content/index.js` | CJS Docusaurus plugin, min 80 lines | VERIFIED | 201 lines. `module.exports` pattern, `name: 'docusaurus-plugin-sanity-content'`. Note: `loadContent()` is a deliberate no-op (see Anti-patterns) |
| `classic/scripts/fetch-sanity-content.js` | Pre-build Sanity content fetch | VERIFIED | 214 lines. Called from `build-with-memory.js` when `SANITY_PROJECT_ID` and `SANITY_API_TOKEN` are set. Contains full GROQ queries, Portable Text serialization, file writing |
| `classic/docusaurus.config.ts` | `docusaurus-plugin-sanity-content` first in `plugins[]` + `sanity-docs` content instance | VERIFIED | Line 120: plugin is first entry. Lines 196-211: `sanity-docs` instance with `path: '.sanity-cache/docs'` and `routeBasePath: 'sanity-docs'` |
| `classic/functions/page-feedback.ts` | Cloudflare Pages Function using ZeptoMail fetch(), no nodemailer | VERIFIED | 205 lines. `fetch()` to ZeptoMail API. `PagesFunction<Env>` with `ZEPTO_API_KEY`. No nodemailer import |
| `classic/.sanity-cache/docs/` | Populated at build time with .mdx files | VERIFIED | Contains `test-integration-doc.mdx`, `test.mdx`, `test1234.mdx` |
| Cloudflare deploy hook `sanity-publish` | CF Pages project `gcxone`, hook fires on POST | VERIFIED (infra) | ID `403874da-0b3a-47b8-8cc9-0a06b8a4a490` confirmed created and tested with HTTP 200 per 03-03-SUMMARY |
| Sanity webhook `cloudflare-pages-rebuild` | Active, GROQ filter covers all 4 doc types | VERIFIED (infra) | ID `m8FmSRhEutzU21C7`, Active (`isDisabled: false`), filter: `_type in ["doc","releaseNote","article","referencePage"]` per 03-03-SUMMARY |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `build-with-memory.js` (npm run build) | `scripts/fetch-sanity-content.js` | `require('./fetch-sanity-content')` + `run()` | WIRED | `build-with-memory.js` line 14: conditionally calls `run()` when `SANITY_PROJECT_ID` and `SANITY_API_TOKEN` are set |
| `scripts/fetch-sanity-content.js` | `classic/.sanity-cache/docs/` | `fs.mkdirSync` + `fs.writeFileSync` | WIRED | Lines 43-44 create dirs, full serialization loop writes `.mdx` files to correct audience subdirs |
| `classic/docusaurus.config.ts` | `classic/plugins/docusaurus-plugin-sanity-content/index.js` | `plugins[]` first entry | WIRED | Line 120: `'./plugins/docusaurus-plugin-sanity-content'` is the first entry in `plugins[]` |
| `classic/plugins/docusaurus-plugin-sanity-content/index.js` | `classic/.sanity-cache/` | `fs.mkdirSync` in factory | PARTIAL | Plugin only creates directories; actual content fetch was moved to `scripts/fetch-sanity-content.js`. `loadContent()` is a deliberate no-op. Directories exist and are used correctly — function is split across two files |
| `sanity-docs` content instance | `classic/.sanity-cache/docs/` | `plugin-content-docs` with `path: '.sanity-cache/docs'` | WIRED | `docusaurus.config.ts` lines 197-211. Cache dir is populated. Pages served at `/sanity-docs/...` |
| Sanity Studio publish | Sanity webhook | Sanity document event | HUMAN NEEDED | Webhook registered and active — end-to-end trigger not manually tested |
| Sanity webhook | Cloudflare Pages rebuild | POST to CF deploy hook URL | HUMAN NEEDED | Infrastructure exists; live trigger not manually tested |
| Feedback widget (browser) | `classic/functions/page-feedback.ts` | POST `/functions/page-feedback` | WIRED (code) | Function exists at correct CF Pages Functions path. Live routing not smoke-tested |
| `classic/functions/page-feedback.ts` | ZeptoMail HTTP API | `fetch('https://api.zeptomail.eu/v1.1/email')` | WIRED | Line 162: `fetch()` call with correct URL, `ZEPTO_API_KEY` via `context.env`. Not live-tested |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INTG-01 | 03-01, 03-02 | Custom Docusaurus plugin fetches content from Sanity at build time via GROQ and generates MDX files — Docusaurus renders them as normal pages | SATISFIED | Plugin exists (201 lines), pre-build script exists (214 lines), `.sanity-cache/docs/` populated with 3 real .mdx files, `sanity-docs` content instance wired in `docusaurus.config.ts`, build produces pages at `/sanity-docs/...` |
| INTG-02 | 03-03 | Sanity publish event triggers Cloudflare Pages rebuild via deploy hook — live site updates within minutes of clicking publish in Studio | PARTIAL — NEEDS HUMAN | Infrastructure fully configured (CF hook + Sanity webhook both active). End-to-end publish test not manually completed per 03-03-SUMMARY |
| INTG-03 | 03-04 | Feedback widget uses `fetch()` to HTTP email API — works on Cloudflare Workers, no `nodemailer` dependency | PARTIAL — NEEDS HUMAN | Code verified: ZeptoMail fetch present, nodemailer absent, legacy files deleted. Live smoke test (curl + email delivery) deferred pending ZEPTO_API_KEY confirmation in CF Pages env |

No orphaned requirements found — INTG-04 is assigned to Phase 3 in REQUIREMENTS.md but does not appear in any Phase 3 plan's `requirements:` field. INTG-04 ("Broken links audited and resolved, `onBrokenLinks` upgraded") is marked complete in REQUIREMENTS.md, implying it was handled in Phase 1 cleanup.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `classic/plugins/docusaurus-plugin-sanity-content/index.js` | 191-198 | `loadContent()` is a no-op with unreachable second `return null` (dead code after first `return null`) | Warning | Two `return null` statements on lines 195 and 198; the second is unreachable. Also: the plan specified content fetching inside `loadContent()` — this was deliberately refactored to `scripts/fetch-sanity-content.js`. Not a bug (build works), but the plugin no longer does what the plan described |
| `classic/scripts/fetch-sanity-content.js` | 196-199 | Writes `_placeholder.mdx` to empty cache dirs | Info | Intentional guard to prevent `plugin-content-docs` from failing on empty directories. Draft-flagged with `draft: true` so it does not appear in production. Not a stub |

---

## Human Verification Required

### 1. INTG-02: Studio Publish Triggers Cloudflare Pages Rebuild

**Test:**
1. Open Sanity Studio at https://nxgen-docs.sanity.studio in one browser tab.
2. Open the Cloudflare Pages dashboard (`gcxone` project, Deployments tab) in a second tab.
3. In Studio: edit the "Test Integration Doc" document — change the body text by adding a word.
4. Click Publish in Studio.
5. Switch to the CF Pages Deployments tab and watch for a new deployment entry to appear.
6. Wait for the deployment to complete.
7. Visit https://docs.nxgen.cloud/sanity-docs/test-integration-doc and confirm the updated text is visible.

**Expected:** New CF Pages deployment appears within ~60 seconds showing "Building" then "Success". The live site reflects the content change within 5 minutes. No developer action required.

**Why human:** Requires interacting with two external authenticated services and observing real-time cross-service event behavior. No file check can substitute for a live publish-to-deploy cycle.

---

### 2. INTG-03: Live Feedback Endpoint Returns 200 and Delivers Email

**Pre-check:** Confirm `ZEPTO_API_KEY` is set in Cloudflare Pages production environment variables (Dashboard → Workers and Pages → gcxone → Settings → Environment Variables → Production).

**Test:** Run from a local terminal:

```bash
curl -X POST https://docs.nxgen.cloud/functions/page-feedback \
  -H "Content-Type: application/json" \
  -d '{"type":"page_feedback","rating":"helpful","context":{"pageTitle":"INTG-03 smoke test","pageUrl":"https://docs.nxgen.cloud/docs/test"}}'
```

**Expected:** HTTP 200 response with `{"success":true}`. An email arrives at abed.badarnah@nxgen.io within ~60 seconds.

**Why human:** Requires a live deployed environment with a secret environment variable set, and requires checking an email inbox — neither can be verified from the codebase.

---

## Architectural Note: Content Fetch Refactoring

The plan (03-02) specified that `loadContent()` inside `docusaurus-plugin-sanity-content/index.js` would fetch Sanity content and write files to `.sanity-cache/`. The actual implementation moved the content-fetching logic to `scripts/fetch-sanity-content.js`, called as a conditional pre-build step in `scripts/build-with-memory.js` (which is what `npm run build` runs).

The result is functionally equivalent: when `SANITY_PROJECT_ID` and `SANITY_API_TOKEN` are set, content is fetched and written to `.sanity-cache/` before Docusaurus starts. The plugin `loadContent()` became a no-op responsible only for creating the cache directory structure. The build has been confirmed to produce `.sanity-cache/docs/test-integration-doc.mdx` and two other test files.

This is not a defect — the outcome (populated `.sanity-cache/docs/` at build time, pages served at `/sanity-docs/...`) is achieved. The plugin's `loadContent()` contains a dead second `return null` statement (lines 195 and 198) which is a minor code quality issue.

---

## Gaps Summary

No blocking gaps. All automated checks pass. Two items require human sign-off before the phase goal is fully closed:

1. **INTG-02** — Infrastructure exists (CF deploy hook + Sanity webhook both active, documented in 03-03-SUMMARY with hook ID `403874da-0b3a-47b8-8cc9-0a06b8a4a490` and webhook ID `m8FmSRhEutzU21C7`), but the end-to-end publish test was not manually completed.

2. **INTG-03** — Code is correct (ZeptoMail fetch, no nodemailer, legacy files deleted), but the live smoke test and email delivery confirmation were deferred pending ZEPTO_API_KEY confirmation in CF Pages production.

Phase 4 (content migration) is not blocked by either of these human verification items.

---

_Verified: 2026-03-07T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
