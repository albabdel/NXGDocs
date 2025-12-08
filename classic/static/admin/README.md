# NXGEN Documentation Admin Panel

This admin panel uses Decap CMS (formerly Netlify CMS) to provide a user-friendly interface for editing documentation without needing developer access.

## Quick Start

### For Local Development

1. **Start the Decap Server** (in one terminal):
   ```bash
   cd classic
   npx decap-server
   ```

2. **Start Docusaurus** (in another terminal):
   ```bash
   cd classic
   npm start
   ```

3. **Access the Admin Panel**:
   Open http://localhost:3000/admin in your browser

4. **Login**:
   When using local mode, you can bypass authentication and work directly with local files.

---

## Production Setup (GitHub OAuth)

For production use, you need to configure GitHub OAuth authentication.

### GitHub OAuth App Configuration

You already have an OAuth app created:
- **Client ID**: `Ov23li9blz1jXftvVJzk`

### Steps to Complete OAuth Setup:

1. **Update the Admin Configuration**

   Edit `static/admin/index.html` and update the backend configuration:

   ```javascript
   backend: {
     name: 'github',
     repo: 'albabdel/documentation', // Your GitHub repo
     branch: 'main',
     base_url: 'https://your-oauth-server.com', // Your OAuth server
     auth_endpoint: '/auth',
   }
   ```

2. **Set up OAuth Backend**

   You'll need an OAuth backend server. Options:

   **Option A: Netlify (Easiest)**
   - Deploy to Netlify
   - Netlify handles OAuth automatically
   - Add GitHub client ID and secret in Netlify dashboard

   **Option B: Vercel/Custom Server**
   - Use a serverless function to handle OAuth
   - Example: https://github.com/vencax/netlify-cms-github-oauth-provider

3. **Configure GitHub OAuth App**

   In your GitHub OAuth App settings (https://github.com/settings/developers):
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/admin/`

4. **Environment Variables**

   Add these to your deployment:
   ```bash
   GITHUB_CLIENT_ID=Ov23li9blz1jXftvVJzk
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

---

## Features

### What You Can Edit

1. **Device Guides** - Documentation for integrating different devices
2. **Features** - Platform feature documentation
3. **Platform Documentation** - General platform information
4. **Internal Documentation** - Internal-only documentation

### Content Structure

All content uses Markdown with frontmatter:

```markdown
---
title: Document Title
sidebar_label: Short Label
sidebar_position: 1
description: Brief description
tags: [tag1, tag2]
---

# Your content here
```

---

## Troubleshooting

### "Config Error: YAMLSyntaxError"
- **Cause**: Conflicting configuration files
- **Fix**: Ensure only `index.html` exists (no `config.yml`)

### "Cannot load repository"
- **Cause**: Local backend not running
- **Fix**: Run `npx decap-server` in the classic directory

### "Authentication failed"
- **Cause**: OAuth not configured
- **Fix**: Use local mode for development or configure OAuth for production

### "Media files not uploading"
- **Cause**: Upload folder doesn't exist
- **Fix**: Folder should be created automatically at `classic/static/img/uploads`

---

## Switching Between Local and Production

### Local Development Mode (Current)
```javascript
backend: {
  name: 'github',
  repo: 'albabdel/documentation',
  branch: 'main',
},
local_backend: true, // ← This enables local mode
```

### Production Mode
```javascript
backend: {
  name: 'github',
  repo: 'albabdel/documentation',
  branch: 'main',
  base_url: 'https://your-oauth-server.com',
},
local_backend: false, // ← Disable for production
```

---

## Advanced: Adding TipTap Editor

To use TipTap rich text editor instead of the default markdown editor:

1. **Install Dependencies**:
   ```bash
   npm install @tiptap/react @tiptap/starter-kit
   ```

2. **Create Custom Widget** in `static/admin/`:
   See TipTap documentation for custom widget integration with Decap CMS

---

## Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Configuration Reference](https://decapcms.org/docs/configuration-options/)
- [Custom Widgets](https://decapcms.org/docs/custom-widgets/)
- [GitHub Backend](https://decapcms.org/docs/github-backend/)
