---
phase: 2
slug: cms-setup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-07
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (existing in `classic/`) for smoke tests; manual Studio verification |
| **Config file** | `classic/playwright.config.ts` |
| **Quick run command** | `cd classic && npx playwright test --grep "@cms"` |
| **Full suite command** | `cd classic && npx playwright test` |
| **Estimated runtime** | ~30 seconds (smoke) / ~2 min (full) |

> Phase 2 success criteria are primarily manual/interactive: an editor must log into Studio, create a document, fill all fields, and publish. Playwright covers URL smoke tests only.

---

## Sampling Rate

- **After every task commit:** Manual check — confirm `studio/` files committed, no TypeScript errors
- **After every plan wave:** Manual Studio smoke test: create one document of each type, verify all fields, publish
- **Before `/gsd:verify-work`:** All four success criteria verified manually in Studio
- **Max feedback latency:** ~5 minutes (manual Studio verification per wave)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | CMS-01 | manual | (Claude invokes MCP `get_initial_context` tool) | N/A | ⬜ pending |
| 2-01-02 | 01 | 1 | CMS-01 | smoke | `cd studio && npx sanity schema deploy --dry-run` | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 1 | CMS-02 | smoke | `cd classic && npx playwright test --grep "@studio-url"` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 1 | CMS-02 | manual | (human logs in, verifies 4 doc types in sidebar) | N/A | ⬜ pending |
| 2-03-01 | 03 | 2 | CMS-03 | manual | (human creates test doc, verifies fields, publishes) | N/A | ⬜ pending |
| 2-03-02 | 03 | 2 | CMS-03 | manual | (human verifies slug auto-generates from title) | N/A | ⬜ pending |
| 2-03-03 | 03 | 2 | CMS-03 | manual | (check CF Pages dashboard for 3 env vars) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `studio/` directory — created by `sanity init`; all schema files live here
- [ ] `studio/schemaTypes/` — Wave 0 deliverable containing all 4 schema type files
- [ ] Studio URL smoke test — `classic/tests/cms-smoke.spec.ts` with `@studio-url` tag (optional; low priority given manual verification)

*If no automated test gaps surface: "Phase 2 is primarily infrastructure setup verified manually through Studio UI."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| MCP `get_initial_context` responds | CMS-01 | MCP is a Claude conversation tool, not a CLI | Run a chat with Claude using the Sanity MCP server; invoke any schema tool |
| All 4 doc types visible in Studio sidebar | CMS-02 | Requires browser + Sanity login | Navigate to `*.sanity.studio`, sign in, confirm sidebar shows doc, releaseNote, article, reference |
| Test doc creates, saves draft, publishes | CMS-03 | Requires Studio interaction per content type | Create one document of each type; fill all fields; save draft; publish; verify no validation errors |
| Slug auto-generates from title | CMS-03 | Requires Studio field observation | Type a title in Studio; confirm slug field populates automatically |
| CF Pages env vars present | CMS-03 | Requires Cloudflare dashboard access | Navigate to CF Pages project settings → Environment variables; confirm SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5 minutes
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
