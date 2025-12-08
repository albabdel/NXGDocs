# 🚀 Strapi CMS - Complete Setup

## One Command Setup

```bash
setup-strapi.bat
```

That's it! Then follow the 2 manual steps shown on screen.

---

## What This Does

### Automated (2 minutes):
✅ Installs dependencies  
✅ Starts Strapi server at http://localhost:1337  
✅ Creates 13 categories  
✅ Creates 5 sample articles  

### Manual (3 minutes):
📋 Configure API permissions  
🔑 Generate API token  

**Total time: 5 minutes**

---

## Files Reference

| File | What It Does |
|------|--------------|
| `setup-strapi.bat` | **Main setup script - run this** |
| `scripts/complete-setup.js` | Creates categories and articles |
| `SETUP_COMPLETE.md` | Detailed setup instructions |
| `MANUAL_STEPS_GUIDE.md` | Visual guide for manual steps |
| `QUICK_START.md` | Quick reference |

---

## After Setup

### Admin Panel
http://localhost:1337/admin

### API Endpoints
- `GET /api/categories`
- `GET /api/documentation-articles`

### What You Get
- 13 pre-configured categories
- 5 sample articles
- Full CRUD API
- Media upload capability
- Rich text editor

---

## Quick Commands

```bash
# Start Strapi
npm run develop

# Run setup (after Strapi is running)
npm run setup

# Stop Strapi
Ctrl+C

# Restart Strapi
npx kill-port 1337
npm run develop
```

---

## Need Help?

1. Check `strapi.log` for errors
2. See `MANUAL_STEPS_GUIDE.md` for detailed instructions
3. See `SETUP_COMPLETE.md` for troubleshooting

---

**Ready? Run:** `setup-strapi.bat`
