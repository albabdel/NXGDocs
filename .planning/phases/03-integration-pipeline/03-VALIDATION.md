---
phase: 3
slug: integration-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-07
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.48.0 |
| **Config file** | `classic/playwright.config.ts` |
| **Quick run command** | `cd classic && npm run build` |
| **Full suite command** | `cd classic && npx playwright test` |
| **Estimated runtime** | ~120 seconds (build) + ~30 seconds (Playwright) |

---

## Sampling Rate

- **After every task commit:** Run `cd classic && npm run build` (verifies plugin runs without error)
- **After every plan wave:** Run `cd classic && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green + manual INTG-02 and INTG-03 verification complete
- **Max feedback latency:** 120 seconds (build smoke test)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | INTG-01 | file presence | `test -f classic/e2e/sanity-content.spec.ts` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 0 | INTG-01 | file presence | `grep -q '.sanity-cache' classic/.gitignore` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | INTG-01 | build smoke | `cd classic && npm run build` | ❌ W0 | ⬜ pending |
| 3-02-02 | 02 | 1 | INTG-01 | file presence | `test -d classic/.sanity-cache/docs` | ❌ W0 | ⬜ pending |
| 3-03-01 | 03 | 1 | INTG-01 | Playwright e2e | `cd classic && npx playwright test e2e/sanity-content.spec.ts` | ❌ W0 | ⬜ pending |
| 3-04-01 | 04 | 2 | INTG-02 | manual | `curl -X POST [CF_DEPLOY_HOOK_URL]` | N/A — manual | ⬜ pending |
| 3-04-02 | 04 | 2 | INTG-02 | manual | Watch CF Pages dashboard after Studio publish | N/A — manual | ⬜ pending |
| 3-05-01 | 05 | 2 | INTG-03 | manual | `curl -X POST https://docs.nxgen.cloud/functions/page-feedback [...]` | N/A — manual | ⬜ pending |
| 3-05-02 | 05 | 2 | INTG-03 | file absence | `test ! -f classic/api/page-feedback.ts && test ! -d netlify/` | N/A — grep | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `classic/e2e/sanity-content.spec.ts` — stub spec for INTG-01 (Sanity page renders at slug URL after build)
- [ ] npm packages installed: `cd classic && npm install @sanity/client @portabletext/markdown`
- [ ] `.sanity-cache/` added to `classic/.gitignore` and root `.gitignore`

*Note: The existing `classic/e2e/docusaurus-integration.spec.ts` tests reference a `/cms` route from a deleted CMS integration — they are stale and are not authoritative for Phase 3.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cloudflare Pages deploy hook returns non-4xx when POSTed | INTG-02 | Hook URL contains a secret — cannot be stored in code; must be tested from local terminal | `curl -X POST [CF_DEPLOY_HOOK_URL]` — check for 200 response |
| Publishing in Studio triggers CF Pages rebuild within 5 minutes | INTG-02 | End-to-end integration across two external services (Sanity → CF Pages) | Open Studio, publish a doc, watch CF Pages dashboard for new deployment within 5 minutes |
| `POST /functions/page-feedback` returns 200 with valid payload | INTG-03 | Requires live deployed function with ZEPTO_API_KEY set in CF Pages env | `curl -X POST https://docs.nxgen.cloud/functions/page-feedback -H "Content-Type: application/json" -d '{"type":"page_feedback","rating":"helpful","context":{"pageTitle":"smoke test","pageUrl":"https://docs.nxgen.cloud/docs/test"}}'` — expect `{"success":true}` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
