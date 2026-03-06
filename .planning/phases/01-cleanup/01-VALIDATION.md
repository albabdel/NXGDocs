---
phase: 1
slug: cleanup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Build verification (`npm run build`) + static grep checks |
| **Config file** | `classic/docusaurus.config.ts` |
| **Quick run command** | `cd classic && npm run build` |
| **Full suite command** | `cd classic && npm run build && npm ls --depth=0` |
| **Estimated runtime** | ~2-3 minutes |

---

## Sampling Rate

- **After every task commit:** Run `cd classic && npm run build`
- **After every plan wave:** Run full suite + grep checks below
- **Before `/gsd:verify-work`:** Full suite must be green, CSS under 2,000 lines, `onBrokenLinks: 'throw'` set
- **Max feedback latency:** ~3 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| Build passes, no dead CMS refs | 01 | 1 | CLEN-01 | build | `cd classic && npm run build` | ⬜ pending |
| Dead packages absent from lockfile | 01 | 1 | CLEN-01 | build | `cd classic && npm ls --depth=0` | ⬜ pending |
| Prebuild hook removed | 01 | 1 | CLEN-02 | static | `grep "prebuild" classic/package.json` → exit 1 | ⬜ pending |
| Build log clean of fetchHygraph | 01 | 1 | CLEN-02 | build | `cd classic && npm run build 2>&1 \| grep -c "fetchHygraph"` → 0 | ⬜ pending |
| No deleted package imports remain | 02 | 1 | CLEN-03 | build | `cd classic && npm run build` (TypeScript gate) | ⬜ pending |
| CSS under 2,000 lines | 03 | 2 | CLEN-04 | static | `wc -l classic/src/css/custom.css` → < 2000 | ⬜ pending |
| Visual design unchanged | 03 | 2 | CLEN-04 | manual | Launch `npm run serve`, spot-check homepage + docs page + dark mode | ⬜ pending |
| onBrokenLinks set to warn/throw | 04 | 2 | INTG-04 | static | `grep "onBrokenLinks" classic/docusaurus.config.ts` | ⬜ pending |
| No broken link warnings in build | 04 | 2 | INTG-04 | build | `cd classic && npm run build 2>&1 \| grep -i "broken"` → empty | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

No new test files are needed. `npm run build` (TypeScript compile + Docusaurus SSG) is the authoritative gate for every task in this phase. A clean build after each deletion step is sufficient validation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual design unchanged after CSS cleanup | CLEN-04 | CSS visual correctness cannot be reliably automated without screenshot baselines | Run `cd classic && npm run serve`, compare homepage, a docs page, and dark mode against pre-cleanup screenshots |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 3 minutes
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
