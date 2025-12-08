# Agent 4 Phase 2 - Quick Reference Card

**Your Status:** Phase 1 ✅ Complete | Phase 2 ⏳ Starting
**Time Budget:** 2-3 hours
**Goal:** Fix build → Test → Deploy

---

## 🎯 4 Tasks

### 1. Fix Build (1-2 hours)
```bash
cd c:/nxgen-docs/classic
npm run build  # Will fail
# Read error → Fix config → Retry
```

**Common Fixes:**
- Edit `postcss.config.js` (array vs object syntax)
- Edit `tailwind.config.js` (content paths, darkMode)
- Edit `src/css/custom.css` (Tailwind imports at top)
- Clear cache: `rm -rf .docusaurus build`

### 2. Test Dev (30 min)
```bash
npm run start
# Visit http://localhost:3000
# Check all 13 sections work
# Verify your 303 articles load
```

**Test Checklist:**
- [ ] All sections in sidebar
- [ ] Articles load correctly
- [ ] Search works
- [ ] Dark mode works
- [ ] Mobile responsive

### 3. Test Production (30 min)
```bash
npm run build  # Should succeed now
npx serve build
# Visit http://localhost:3000
# Quick smoke test
```

### 4. Update Docs (30 min)
- Update PROJECT_STATUS_DASHBOARD.md
- Create AGENT_4_FINAL_COMPLETE.md
- Mark as READY FOR DEPLOYMENT

---

## 🆘 Quick Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Articles 404:**
- Check `classic/docs/` has your files
- Check `sidebars.ts` paths match

**Images missing:**
- Check `classic/static/img/` has 20 SVGs

---

## ✅ Done When

1. `npm run build` ✅ succeeds
2. All 303 articles ✅ accessible
3. Navigation ✅ works
4. Production build ✅ serves
5. Docs ✅ updated

---

## 📁 Files

**Full Instructions:** AGENT_4_PHASE_2_HANDOVER.md
**Your Content:** classic/docs/ (303 articles)
**Config to Fix:** classic/tailwind.config.js, postcss.config.js

---

**You created the content. Now make it shine! 🚀**
