# ✅ Strapi Setup - Ready to Complete

I've created automated scripts to finish your Strapi configuration.

## 🚀 Option 1: Automated Setup (Recommended)

### Run this command from the root directory:

```bash
COMPLETE_STRAPI_SETUP.bat
```

This will:
1. Install dependencies
2. Start Strapi
3. Create 13 categories
4. Create 5 sample articles

**Time:** ~2 minutes

---

## 🔧 Option 2: Manual Setup

### Step 1: Start Strapi
```bash
cd strapi-cms
npm install
npm run develop
```

Wait for: "Server started on http://localhost:1337"

### Step 2: Run Setup Script
```bash
npm run setup
```

---

## 📋 Final Manual Steps (3 minutes)

After running the automated setup, you need to:

### 1. Configure API Permissions
- Open http://localhost:1337/admin
- Go to **Settings** → **Users & Permissions** → **Roles** → **Public**
- Enable these permissions:
  - **Category**: ✅ find, ✅ findOne
  - **Documentation-article**: ✅ find, ✅ findOne
- Click **Save**

### 2. Generate API Token
- Go to **Settings** → **API Tokens**
- Click **Create new API Token**
- Name: `Docusaurus Sync`
- Token type: `Full access`
- Click **Save**
- **Copy the token** (shows only once!)

### 3. Test API
```bash
curl http://localhost:1337/api/categories
curl http://localhost:1337/api/documentation-articles
```

Should return JSON with your data.

---

## ✅ What Gets Created

### 13 Categories:
1. Getting Started 🚀
2. Platform Fundamentals 📊
3. Admin & Configuration Guide 🎛️
4. Devices 🔧
5. Features ⚡
6. Alarm Management (Talos) 🚨
7. Reporting & Analytics 📈
8. Operator Guide 👥
9. Installer Guide 🔧
10. Troubleshooting 🛠️
11. Knowledge Base 📚
12. Release Notes 🔄
13. Support & Resources 📞

### 5 Sample Articles:
1. What is NXGEN GCXONE? (Getting Started)
2. Creating Customers (Admin Guide)
3. Hikvision - Admin Configuration (Devices)
4. AI Analytics Overview (Features)
5. Connection Issues (Troubleshooting)

---

## 🎯 After Setup

Your Strapi CMS will be ready to:
- ✅ Create/edit documentation via web interface
- ✅ Manage categories and articles
- ✅ Upload images
- ✅ Provide API for Docusaurus integration

**Admin Panel:** http://localhost:1337/admin

---

## 🆘 Troubleshooting

**Strapi won't start:**
```bash
npx kill-port 1337
npm run develop
```

**Setup script fails:**
- Make sure Strapi is running first
- Check strapi.log for errors

**API returns 403:**
- Configure public permissions (Step 1 above)
- Restart Strapi after changing permissions

---

**Total Time:** 5 minutes (2 min automated + 3 min manual)
