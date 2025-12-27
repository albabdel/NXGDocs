# 🚀 QUICK START - Upload 1,073 Images to Hygraph

## ✅ Everything is Ready!

I've built your site and created the automated upload script. You just need to:
1. Deploy to Netlify (2 minutes)
2. Run the upload script (36 minutes)

---

## Copy & Paste These Commands

### 1️⃣ Deploy to Netlify

```bash
cd c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic
netlify deploy --prod --dir=build
```

**What will happen:**
- Netlify CLI will ask you to select a team (use arrow keys, press Enter)
- It may ask to create a new site (say yes)
- Upload will take ~2 minutes
- You'll get a URL like: `https://nxgen-docs-12345.netlify.app`

**📋 Copy the URL!** You need it for step 2.

---

### 2️⃣ Upload All 1,073 Images

Replace `YOUR_URL_HERE` with the URL from step 1:

```bash
npm run upload:bulk YOUR_URL_HERE
```

**Example:**
```bash
npm run upload:bulk https://nxgen-docs-12345.netlify.app
```

---

## That's It!

The script will automatically:
- ✅ Find all 1,073 images
- ✅ Map each to its public Netlify URL
- ✅ Upload to Hygraph Assets
- ✅ Show progress: `[1/1073]`, `[2/1073]`, etc.
- ✅ Save `image-mapping.json` when complete

**Total time**: ~38 minutes

---

## Alternative: Manual Netlify Deployment

If the command doesn't work:

1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `classic/build` folder
4. Get the site URL
5. Run: `npm run upload:bulk YOUR_SITE_URL`

---

## What You'll See

```
============================================================
  BULK IMAGE UPLOAD TO HYGRAPH
============================================================

📦 Scanning for images...
✅ Found 1,073 images

🚀 Starting upload...

[1/1073] static/img/Background.jpg
   Public URL: https://your-site.netlify.app/img/Background.jpg
   ✅ Uploaded: https://eu-west-2.graphassets.com/.../asset-id

[2/1073] docs/devices/adpro/images/device.png
   ✅ Uploaded: https://eu-west-2.graphassets.com/.../asset-id

💾 Progress saved (50/1073)

...

============================================================
  UPLOAD COMPLETE
============================================================

📊 SUMMARY:
   Total Images: 1,073
   ✅ Successful: 1,070
   ❌ Failed: 3
```

---

## ✨ After Completion

You'll have:
- ✅ All 1,073 images in Hygraph Assets
- ✅ Complete `image-mapping.json` file
- ✅ Production CDN URLs for all images
- ✅ Ready for the next phase (sync & design editing)

---

**Ready?** Run the commands above and watch the magic happen!
