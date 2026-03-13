# Phase 8: Roadmap Page & Hero Banner — Validation

**Purpose:** Verify all Phase 8 requirements are met through automated and manual testing.

---

## Requirements Traceability

| Req ID | Description | Test Type | Verification Method | Status |
|--------|-------------|-----------|---------------------|--------|
| ROAD-01 | View all roadmap items at /roadmap (Sanity-driven) | smoke | Visit /roadmap, verify items from JSON appear | Pending |
| ROAD-02 | Filter by status (Planned / In Progress / Shipped) | smoke | Click each status filter button, verify correct filtering | Pending |
| ROAD-03 | Search by keyword (title and description) | smoke | Type keyword, verify results match title/description | Pending |
| ROAD-04 | Expand item to see all fields | visual | Click item, verify: business value, change type, UI change, entities, projected release | Pending |
| ROAD-05 | Shipped items show release link | smoke | Click Shipped item's release link, verify navigation to /releases/[slug] | Pending |
| ROAD-06 | Results count and empty state | visual | Filter to no results, verify count shows 0, empty state renders with "Clear" | Pending |
| ROAD-07 | Footer shows "Last updated" date | visual | Check footer for date, verify matches max _updatedAt from data | Pending |
| HERO-01 | Hero shows latest release dynamically | smoke | Visit home page, verify hero chip shows latest release displayTitle | Pending |

---

## Pre-Execution Checklist

Before executing Phase 8, verify:

- [ ] Phase 6 complete: `sanity-roadmap.generated.json` contains 7 items
- [ ] Phase 6 complete: `sanity-releases.generated.json` contains 3 releases
- [ ] Gap fix: Phase 6 GROQ includes `_updatedAt` for roadmap items
- [ ] Phase 7 complete: `/releases/[slug]` routes exist and work

---

## Test Commands

### Smoke Tests (Quick Validation)

```bash
# Verify roadmap JSON exists and has items
node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');console.log('Roadmap items:',r.length);process.exit(r.length>0?0:1)"

# Verify releases JSON exists and has releases
node -e "const r=require('./classic/src/data/sanity-releases.generated.json');console.log('Releases:',r.length);process.exit(r.length>0?0:1)"

# Verify at least one Shipped item has releaseSlug
node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');const s=r.find(i=>i.status==='Shipped'&&i.releaseSlug);console.log('Shipped with releaseSlug:',s?.title);process.exit(s?0:1)"

# Build succeeds
cd classic && npm run build
```

### Visual Tests (Manual Browser)

1. **Start dev server:** `cd classic && npm run start`
2. **Visit /roadmap:**
   - [ ] Items render from Sanity data
   - [ ] Status filter buttons visible (All, Planned, In Progress, Shipped)
   - [ ] Search input visible
   - [ ] Results count visible
3. **Test filtering:**
   - [ ] Click "Planned" — shows only Planned items
   - [ ] Click "In Progress" — shows only In Progress items
   - [ ] Click "Shipped" — shows only Shipped items
   - [ ] Click "All" — shows all items
4. **Test search:**
   - [ ] Type "device" — filters to matching items
   - [ ] Clear search — shows all items
5. **Test expand/collapse:**
   - [ ] Click item header — expands to show details
   - [ ] Click another item — first collapses, second expands
   - [ ] Verify all fields visible: description, business value, change type, UI change, entities
6. **Test Shipped release link:**
   - [ ] Find Shipped item
   - [ ] Click "Released in [Sprint X]" link
   - [ ] Verify navigates to `/releases/[slug]`
7. **Test empty state:**
   - [ ] Type "zzzzzz" in search (no matches)
   - [ ] Verify empty state shows "Clear filters" button
   - [ ] Click "Clear filters" — resets to all items
8. **Test footer:**
   - [ ] Verify "Last updated: [date]" visible
9. **Visit home page:**
   - [ ] Hero chip shows latest release title (not hardcoded)
   - [ ] Click chip — navigates to release detail page
   - [ ] Home page releases section shows Sanity data (if implemented)

---

## Regression Tests

Ensure existing functionality still works:

- [ ] `/releases` index page renders
- [ ] `/releases/[slug]` detail pages render
- [ ] Search modal works (Cmd+K)
- [ ] Light/dark mode toggle works
- [ ] All navigation links work

---

## Completion Criteria

Phase 8 is complete when:

1. All 8 requirements marked "Verified" in traceability table
2. All smoke tests pass
3. All visual tests confirmed by human
4. No regression in existing functionality
5. `npm run build` succeeds

---

## Next Phase

After Phase 8 verification complete:

- Proceed to Phase 9 (Cleanup & URL Continuity)
- Or address any gaps found during verification
