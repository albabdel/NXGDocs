# 📂 MEDIA FILES LOCATION GUIDE

## Where Your Files Are Stored

All your images and videos are in the `static` folder of your project:

```
c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static\
```

---

## 🖼️ IMAGES (80 files)

### Main Images Folder
**Location**: `c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static\img\`

### Image Categories

#### Background Images
- `Background.jpg` (739 KB) - Main background
- `curved-lines-bg.jpg` (30 KB)

#### Dashboard Screenshots (SVG)
- `dashboard-analytics.svg`
- `dashboard-gcxone-main.svg`
- `dashboard-reports.svg`
- `dashboard-talos-alarms.svg`

#### Device Screenshots (SVG)
- `device-adpro-setup.svg`
- `device-dahua-config.svg`
- `device-hanwha-interface.svg`
- `device-hikvision-dashboard.svg`
- `device-milestone-view.svg`

#### Diagrams (SVG)
- `diagram-alarm-flow.svg`
- `diagram-architecture.svg`
- `diagram-network.svg`

#### Feature Screenshots (SVG)
- `feature-ai-analytics-config.svg`
- `feature-event-clips.svg`
- `feature-live-view.svg`
- `feature-playback.svg`
- `feature-ptz-control.svg`

#### Troubleshooting Screenshots (SVG)
- `troubleshooting-connection.svg`
- `troubleshooting-login.svg`
- `troubleshooting-video.svg`

#### Logos
- `Xo.png`
- `xo-logo.png`
- `XoLogo.png`

#### Subfolder: Getting Started
**Location**: `static\img\getting-started\`
- Contains additional tutorial images
- Organized by topic (e.g., `evalink-talos/`, `towers/`, etc.)

---

## 🎥 VIDEOS (5 files)

**Location**: `c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static\videos\`

1. **add-and-configure-mobile-tower.mp4**
   - Tutorial: Adding mobile towers

2. **dashboard-deep-dive.mp4**
   - Dashboard walkthrough

3. **first-time-login-setup.mp4**
   - Getting started guide

4. **key-features-value.mp4**
   - Platform features overview

5. **platform-walkthrough.mp4**
   - Complete platform tour

---

## 📋 HOW TO ACCESS THESE FILES

### Option 1: File Explorer (Easiest)
1. Open Windows File Explorer
2. Paste this path in the address bar:
   ```
   c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static
   ```
3. Press Enter
4. You'll see two folders:
   - `img\` - Contains all 80 images
   - `videos\` - Contains all 5 videos

### Option 2: VS Code
1. In VS Code, look at the left sidebar (Explorer)
2. Navigate to: `classic` → `static`
3. You'll see `img` and `videos` folders

---

## 🚀 UPLOADING TO HYGRAPH

### Step-by-Step Guide

#### 1. Open File Explorer
```
c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\static
```

#### 2. Go to Hygraph Dashboard
Open: https://app.hygraph.com/bf5aa53f-7e4c-43a5-8d33-696cfa2520e3

#### 3. Navigate to Assets
- Click **Content** in left sidebar
- Click **Assets**
- Click **Add Asset** or **Upload** button

#### 4. Upload Images
**Start with priority images:**

**High Priority (Upload First):**
1. All images in `img\getting-started\` folder
2. Logo files (`Xo.png`, `xo-logo.png`, `XoLogo.png`)
3. Diagrams (`diagram-*.svg`)
4. Dashboard screenshots (`dashboard-*.svg`)

**Medium Priority:**
5. Feature screenshots (`feature-*.svg`)
6. Device screenshots (`device-*.svg`)
7. Background images

**Low Priority:**
8. Other SVG files
9. Additional graphics

#### 5. Upload Videos
**All videos are important:**
1. `first-time-login-setup.mp4` - **Upload first!**
2. `platform-walkthrough.mp4`
3. `dashboard-deep-dive.mp4`
4. `key-features-value.mp4`
5. `add-and-configure-mobile-tower.mp4`

#### 6. After Upload - Get URLs
For each uploaded file:
1. Click on the asset in Hygraph
2. Copy the **URL** (looks like: `https://...hygraph.com/...`)
3. Save these URLs - we'll need them to update articles

---

## 💡 TIPS

### Batch Upload
- You can select multiple files at once in Hygraph
- Ctrl+Click to select multiple files
- Or drag and drop entire folders

### File Organization in Hygraph
- Create folders in Hygraph Assets to organize:
  - `logos/` - For logo files
  - `diagrams/` - For diagram SVGs
  - `screenshots/` - For UI screenshots
  - `videos/` - For all video files
  - `getting-started/` - For tutorial images

### Naming Convention
- Hygraph will keep the original filenames
- Makes it easier to match with article references

---

## 📊 QUICK STATS

| Type | Count | Location | Total Size |
|------|-------|----------|------------|
| Images | 80 | `static/img/` | ~10 MB |
| Videos | 5 | `static/videos/` | ~50 MB |
| **Total** | **85** | `static/` | **~60 MB** |

---

## 🔄 NEXT STEPS AFTER UPLOAD

Once you've uploaded files to Hygraph:

1. **Keep track of URLs**
   - Create a spreadsheet or text file
   - Format: `original-filename.jpg → hygraph-url`

2. **Tell me when done**
   - I'll create a script to update article references
   - Articles will point to your new Hygraph URLs

3. **Test a few articles**
   - Pick an article with images
   - Update it manually to test
   - Verify images display correctly

---

## ❓ NEED HELP?

If you have trouble finding files:
- Tell me which files you can't find
- I can create a script to copy specific files to a temporary folder
- Or I can generate a detailed file list with full paths

---

**Created**: 2025-12-25
**Total Files**: 85 media files
**Ready to Upload**: ✅ Yes - All files are in the `static` folder
