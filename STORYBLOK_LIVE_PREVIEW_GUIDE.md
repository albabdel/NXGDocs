# Storyblok Live Preview Setup Guide

This guide will help you set up live preview functionality for your Storyblok CMS integration with Docusaurus.

## 🎯 What is Live Preview?

Live Preview allows you to see changes in real-time as you edit content in Storyblok, without needing to rebuild or redeploy your site. Any changes you make in the Storyblok editor will instantly appear in the preview pane.

## 📋 Prerequisites

- Node.js installed
- npm or yarn package manager
- Admin access to your Storyblok space

## 🚀 Quick Start

### Step 1: Install mkcert

mkcert is a tool for creating locally-trusted SSL certificates. Choose one installation method:

**Option A - Using Chocolatey (Recommended for Windows):**
```bash
choco install mkcert
```

**Option B - Using Scoop:**
```bash
scoop bucket add extras
scoop install mkcert
```

**Option C - Manual Download:**
1. Download from [mkcert releases](https://github.com/FiloSottile/mkcert/releases)
2. Rename the downloaded file to `mkcert.exe`
3. Add the directory containing `mkcert.exe` to your PATH

### Step 2: Run Setup Script

This will create SSL certificates for localhost:

```bash
npm run setup:preview
```

This script will:
- ✅ Install local Certificate Authority
- ✅ Create SSL certificates (`localhost.pem` and `localhost-key.pem`)
- ✅ Verify setup is complete

### Step 3: Start Preview Server

Start both the Docusaurus dev server and HTTPS proxy:

```bash
npm run preview
```

This will:
- 🚀 Start Docusaurus on `http://localhost:3000`
- 🔒 Start HTTPS proxy on `https://localhost:3010`
- 🔴 Enable live preview mode

### Step 4: Configure Storyblok Visual Editor

1. Go to your [Storyblok dashboard](https://app.storyblok.com/)
2. Navigate to **Settings** → **Visual Editor**
3. Set the **Default Environment** to:
   ```
   https://localhost:3010/storyblok-preview
   ```

4. Configure the **Preview URL** pattern:
   ```
   https://localhost:3010/storyblok-preview?_storyblok={STORY_ID}
   ```

5. Save the settings

### Step 5: Test Live Preview

1. Open any story in Storyblok
2. Click the **Visual Editor** tab
3. You should see your content in the preview pane
4. Make changes to the content - they will appear instantly!

## 📝 How It Works

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│  Storyblok  │─────▶│ HTTPS Proxy  │─────▶│  Docusaurus    │
│   Editor    │      │ (port 3010)  │      │  (port 3000)   │
└─────────────┘      └──────────────┘      └────────────────┘
     │                                              │
     │                                              │
     └────────── Real-time updates ─────────────────┘
```

1. **You edit** content in Storyblok's Visual Editor
2. **Storyblok Bridge** detects changes and sends them to the preview page
3. **Preview page** updates instantly without page reload
4. **HTTPS proxy** ensures secure communication between Storyblok and your local server

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup:preview` | One-time setup for SSL certificates |
| `npm run preview` | Start preview server with HTTPS |
| `npm run dev:preview` | Alias for `npm run preview` |
| `npm start` | Start regular Docusaurus dev server (HTTP only) |

## 🎨 Preview Page Features

The preview page at `/storyblok-preview` includes:

- ✅ **Live Updates**: See changes instantly as you type
- ✅ **Draft Content**: Preview unpublished changes
- ✅ **Visual Indicator**: "LIVE PREVIEW" badge shows preview mode
- ✅ **Error Handling**: Clear error messages if something goes wrong

## 🛠️ Troubleshooting

### Certificate Errors

If you see SSL/TLS errors:
1. Make sure you ran `npm run setup:preview`
2. Check that `localhost.pem` and `localhost-key.pem` exist in the `classic/` folder
3. Restart your browser after installing mkcert

### Preview Not Loading

If the preview pane is blank:
1. Check that the preview server is running (`npm run preview`)
2. Verify the Visual Editor URL in Storyblok settings
3. Check browser console for errors
4. Ensure your preview token is correct in `.env.local`

### Changes Not Appearing

If edits don't show up:
1. Wait a few seconds - there may be a slight delay
2. Check that you're in the Visual Editor tab (not Content tab)
3. Verify the Storyblok Bridge script is loading (check browser console)
4. Try refreshing the preview pane

### Port Already in Use

If port 3000 or 3010 is already in use:
1. Stop other services using these ports
2. Or modify the ports in `start-preview.ps1`
3. Update Storyblok Visual Editor URL accordingly

## 📚 Additional Resources

- [Storyblok Visual Editor Documentation](https://www.storyblok.com/docs/guide/essentials/visual-editor)
- [mkcert Documentation](https://github.com/FiloSottile/mkcert)
- [Docusaurus Documentation](https://docusaurus.io/)

## 🔐 Security Notes

- The SSL certificates created by mkcert are **only trusted on your local machine**
- Never commit `localhost.pem` or `localhost-key.pem` to version control
- The preview server should only be used for local development
- For production deployments, use the standard `npm run build` workflow

## 💡 Tips

1. **Keep preview running**: Leave the preview server running while editing multiple stories
2. **Use split screen**: Open Storyblok editor on one monitor, preview on another
3. **Test on different devices**: The HTTPS proxy allows testing on mobile devices on your local network
4. **Keyboard shortcuts**: Most Storyblok editor shortcuts work in preview mode

## 🎉 You're All Set!

Your live preview is now configured! Edit content in Storyblok and watch it update in real-time. Happy editing! 🚀
