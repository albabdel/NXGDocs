---
phase: 6
slug: schema-and-data-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-13
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — content pipeline project; no Jest/Vitest/pytest config found |
| **Config file** | none |
| **Quick run command** | `node classic/scripts/fetch-sanity-content.js` |
| **Full suite command** | `SANITY_FETCH_STRICT=true node classic/scripts/fetch-sanity-content.js` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node classic/scripts/fetch-sanity-content.js` (verify non-empty output in console)
- **After every plan wave:** Run `SANITY_FETCH_STRICT=true node classic/scripts/fetch-sanity-content.js` + smoke count checks
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | SCHEMA-01 | manual | Open Sanity Studio, click "+ New", verify release type appears | N/A (Studio compile) | ⬜ pending |
| 6-01-02 | 01 | 1 | SCHEMA-02 | manual | Create a release item with all fields (title, body, changeType, screenshot, videoEmbed) | N/A (Studio compile) | ⬜ pending |
| 6-01-03 | 01 | 1 | SCHEMA-03 | manual | Create a roadmap item with all fields populated | N/A (Studio compile) | ⬜ pending |
| 6-01-04 | 01 | 1 | SCHEMA-04 | manual | Set releaseRef on a Shipped roadmap item; verify in Vision tab | N/A (Studio compile) | ⬜ pending |
| 6-02-01 | 02 | 1 | SCHEMA-01 | smoke | `node -e "const r=require('./classic/src/data/sanity-releases.generated.json');process.exit(r.length>0?0:1)"` | ❌ W0 | ⬜ pending |
| 6-02-02 | 02 | 1 | SCHEMA-03 | smoke | `node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');process.exit(r.length>0?0:1)"` | ❌ W0 | ⬜ pending |
| 6-02-03 | 02 | 1 | SCHEMA-04 | smoke | `node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');const s=r.find(i=>i.releaseSlug);process.exit(s?0:1)"` | ❌ W0 | ⬜ pending |
| 6-03-01 | 03 | 2 | MOCK-01 | manual+smoke | Count check: `node -e "const r=require('./classic/src/data/sanity-releases.generated.json');process.exit(r.length>=2?0:1)"` | ❌ W0 | ⬜ pending |
| 6-03-02 | 03 | 2 | MOCK-02 | manual+smoke | Count check: `node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');process.exit(r.length>=5?0:1)"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — there is no automated test framework to install. The test strategy for Phase 6 is manual Studio verification + fetch script smoke checks. The smoke commands are Node one-liners runnable without any test framework. The "❌ W0" entries above become runnable as soon as the generated JSON files are created by the fetch script.

*Existing infrastructure covers all phase requirements that can be automated.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `release` type appears in Studio | SCHEMA-01 | Studio TypeScript compile is the gate; no headless API to check types | Open Sanity Studio (`cd studio && npx sanity dev`), click "+ New", verify "Release" type appears in list |
| Release item fields render in Studio | SCHEMA-02 | Visual field inspection required | Create a release item; verify title, body, changeType, affectedAreas, screenshot, videoEmbed fields all appear |
| `roadmapItem` type appears in Studio | SCHEMA-03 | Studio TypeScript compile is the gate | Open Studio, click "+ New", verify "Roadmap Item" type appears |
| Shipped roadmap item references release | SCHEMA-04 | Reference field requires Studio UI interaction | Create roadmap item with status=Shipped, set releaseRef; run GROQ Vision: `*[_type == "roadmapItem" && defined(releaseRef)]{"releaseSlug": releaseRef->slug.current}` |
| Old `releaseNote` references removed | SCHEMA-01 | grep/code check (not runtime) | Verify zero references in schemaTypes/index.ts, sanity.config.ts, src/structure.ts |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
