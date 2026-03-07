---
phase: 5
slug: polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-07
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright ^1.48.0 |
| **Config file** | `classic/playwright.config.ts` |
| **Quick run command** | `cd classic && npx playwright test e2e/navigation.spec.ts --project=chromium` |
| **Full suite command** | `cd classic && npm run test:e2e` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd classic && npx playwright test e2e/navigation.spec.ts --project=chromium`
- **After every plan wave:** Run `cd classic && npm run test:e2e`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 1 | PLSH-01 | smoke/e2e | `npx playwright test e2e/navigation.spec.ts` | ❌ W0 | ⬜ pending |
| 5-02-01 | 02 | 1 | PLSH-01 | smoke/e2e | `npx playwright test e2e/search.spec.ts` | ❌ W0 | ⬜ pending |
| 5-03-01 | 03 | 2 | PLSH-02 | visual/e2e | `npx playwright test e2e/visual-consistency.spec.ts` | ❌ W0 | ⬜ pending |
| 5-04-01 | 04 | 2 | PLSH-02 | visual/e2e | `npx playwright test e2e/visual-consistency.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `classic/e2e/navigation.spec.ts` — two-click navigation rule for PLSH-01
- [ ] `classic/e2e/search.spec.ts` — Algolia search returns results for PLSH-01
- [ ] `classic/e2e/visual-consistency.spec.ts` — light/dark mode consistency for PLSH-02

*Existing `classic/e2e/sanity-content.spec.ts` can be unskipped in Wave 0 once Phase 4 produces real documents.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Algolia crawler has `renderJavaScript: true` | PLSH-01 | Crawler config lives in Algolia dashboard, not in repo | Log into Algolia dashboard → Crawler → Config → verify `renderJavaScript: true` |
| Correct Algolia App ID is canonical | PLSH-01 | Two App IDs exist (`V5T3AW2AU9` vs `0QV3FAFAD5`) — only the dashboard shows which has live data | Log into Algolia → check which index has records — update `docusaurus.config.ts` to match |
| Fresh crawl triggered after Phase 4 | PLSH-01 | Crawl is a manual dashboard action | Algolia Crawler dashboard → Restart crawl → verify record count increases |
| VoC modal success text visible in light mode | PLSH-02 | Requires browser visual check | Open site in light mode → submit feedback → confirm success message is readable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
