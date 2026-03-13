---
phase: 7
slug: releases-page
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-03-13
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — visual/manual testing via `npm run start` |
| **Config file** | none |
| **Quick run command** | `npm run start` (dev server) |
| **Full suite command** | Visual walkthrough of /releases and /releases/[slug] |
| **Estimated runtime** | ~2 minutes manual |

---

## Sampling Rate

- **After every task commit:** Visual check in dev server
- **After every plan wave:** Full page walkthrough
- **Before `/gsd:verify-work`:** All 9 requirements verified
- **Max feedback latency:** ~30 seconds (hot reload)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Verification | Status |
|---------|------|------|-------------|-----------|--------------|--------|
| 7-01-01 | 01 | 1 | REL-01 | visual | Visit /releases, verify list appears | ⬜ pending |
| 7-01-02 | 01 | 1 | REL-02 | visual | Check cards show title, date, summary, badges | ⬜ pending |
| 7-01-03 | 01 | 1 | REL-03 | visual | First card shows "Latest" badge | ⬜ pending |
| 7-01-04 | 01 | 1 | REL-04 | smoke | Click card, verify /releases/[slug] navigation | ⬜ pending |
| 7-02-01 | 02 | 1 | REL-05 | visual | Detail page shows item title, body, type tag | ⬜ pending |
| 7-02-02 | 02 | 1 | REL-06 | visual | Screenshots display inline | ⬜ pending |
| 7-02-03 | 02 | 1 | REL-07 | visual | Video embeds render correctly | ⬜ pending |
| 7-02-04 | 02 | 1 | REL-08 | visual | Affected-areas tags appear on items | ⬜ pending |
| 7-02-05 | 02 | 1 | REL-09 | visual | "Read the docs" link appears where applicable | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — this is a UI-only phase with no automated test framework. All validation is manual visual inspection.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Release list renders | REL-01 | Visual layout verification | `npm run start`, visit /releases |
| Cards show correct data | REL-02 | Visual inspection | Check each card matches JSON data |
| Latest badge on first | REL-03 | Visual conditional | Verify only first card has badge |
| Detail page renders | REL-05-09 | Visual with mock data | Navigate to /releases/[slug], inspect all fields |

---

## Prerequisite Check

Before Phase 7 verification can succeed:

```bash
# Verify Phase 6 produced the JSON file
node -e "const r=require('./classic/src/data/sanity-releases.generated.json');process.exit(r.length>0?0:1)" || echo "Phase 6 JSON not ready"
```

If Phase 6 JSON is empty, Phase 7 pages will show empty state. This is expected during parallel development.

---

## Validation Sign-Off

- [ ] All tasks have verification method defined
- [ ] Prerequisite check passes (Phase 6 JSON exists)
- [ ] All 9 requirements verified with mock data
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
