# Payload CMS Port Updated

## Port Change

Payload CMS has been moved from port **3001** to port **4000** to avoid conflicts.

## Why the Change?

Port 3001 was already in use by:
- `admin-server-simple.js` - Docusaurus admin server

## New Access URLs

- **Payload Admin Panel:** http://localhost:4000/admin
- **Payload API:** http://localhost:4000/api
- **Payload GraphQL:** http://localhost:4000/api/graphql

## Updated Files

All documentation and configuration files have been updated:
- ✅ `payload-cms/payload.config.ts`
- ✅ `payload-cms/src/index.ts`
- ✅ `scripts/sync-payload.js`
- ✅ `payload-cms/README.md`
- ✅ `payload-cms/QUICK_START.md`
- ✅ `payload-cms/SETUP_GUIDE.md`

## Port Usage Summary

- **Port 3000:** Docusaurus (if running)
- **Port 3001:** Docusaurus Admin Server (`admin-server-simple.js`)
- **Port 1337:** Strapi CMS
- **Port 4000:** Payload CMS ✅

---

**Access Payload CMS at:** http://localhost:4000/admin




