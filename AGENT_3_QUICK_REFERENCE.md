# Agent 3 - Quick Reference Card

**Your Mission:** Build a CMS (Content Management System) for documentation writers

---

## 🎯 What You're Building

A web interface where writers can create documentation articles without coding.

**Think:** WordPress for documentation

**Login:** http://localhost:1337/admin

---

## 📋 7-Phase Checklist

### Phase 1: Verify Installation ✅
```bash
cd c:/nxgen-docs/strapi-cms
npm run develop
# Open http://localhost:1337/admin
```

### Phase 2: Check Content Types ✅
- Look for "Categories" and "Documentation Articles" in admin panel
- If missing, run: `node scripts/setup-content-types.js`

### Phase 3: Create 13 Categories ✅
Create these in Strapi admin (Content Manager → Categories → Create):
1. Getting Started (order: 1, icon: 🚀)
2. Platform Fundamentals (order: 2, icon: 📊)
3. Admin Guide (order: 3, icon: 🎛️)
4. Devices (order: 4, icon: 🔧)
5. Features (order: 5, icon: ⚡)
6. Alarm Management (order: 6, icon: 🚨)
7. Reporting (order: 7, icon: 📈)
8. Operator Guide (order: 8, icon: 👥)
9. Installer Guide (order: 9, icon: 🔧)
10. Troubleshooting (order: 10, icon: 🛠️)
11. Knowledge Base (order: 11, icon: 📚)
12. Release Notes (order: 12, icon: 🔄)
13. Support (order: 13, icon: 📞)

### Phase 4: Create Sample Articles ✅
Create 5-10 articles (Content Manager → Documentation Articles → Create):
- "What is NXGEN GCXONE?" (Getting Started)
- "Creating Customers" (Admin Guide)
- "Hikvision Configuration" (Devices)
- "AI Analytics" (Features)
- "Connection Issues" (Troubleshooting)

### Phase 5: Configure API ✅
Settings → Users & Permissions → Roles → Public:
- Enable: `find`, `findOne`, `count` for both content types

### Phase 6: Generate Token ✅
Settings → API Tokens → Create:
- Name: Docusaurus Sync
- Duration: Unlimited
- Type: Full access
- Save token to: `strapi-cms/API_TOKEN.txt`

### Phase 7: Writer's Guide ✅
Create: `strapi-cms/WRITERS_GUIDE.md`
- How to log in
- How to create articles
- Field explanations
- Best practices

---

## 🆘 Common Issues

**Strapi won't start:**
```bash
rm -rf .tmp .cache
npm run develop
```

**Content types missing:**
```bash
node scripts/setup-content-types.js
npm run develop
```

**API returns "Forbidden":**
- Check Settings → Roles → Public permissions

**Port conflict:**
```bash
npx kill-port 1337
npm run develop
```

---

## ✅ Done When...

- [ ] Strapi starts without errors
- [ ] 13 categories exist
- [ ] 5+ articles exist
- [ ] Can create new article via web UI
- [ ] API returns data: `curl http://localhost:1337/api/categories`
- [ ] Token saved in API_TOKEN.txt
- [ ] Writer's guide exists

---

## 📁 Files

- **Full Instructions:** `AGENT_3_HANDOVER_PROMPT.md` (read this!)
- **Task File:** `AGENT_3_BACKEND_TASKS.md`
- **Working Dir:** `c:\nxgen-docs\strapi-cms\`
- **Dashboard:** `PROJECT_STATUS_DASHBOARD.md` (update when done)

---

## ⏱️ Time Budget

- Phase 1: 15 min
- Phase 2: 30 min
- Phase 3: 45 min (creating categories)
- Phase 4: 60 min (sample articles)
- Phase 5: 30 min
- Phase 6: 15 min
- Phase 7: 60 min (writer's guide)

**Total: 6-8 hours**

---

**Read AGENT_3_HANDOVER_PROMPT.md for detailed step-by-step instructions!**
