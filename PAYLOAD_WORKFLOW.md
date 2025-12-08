# Payload CMS Workflow - New Articles Only

## Setup (One Time)

1. **Update credentials** in `payload-cms\.env`:
   ```
   PAYLOAD_EMAIL=your-actual-email@example.com
   PAYLOAD_PASSWORD=your-actual-password
   ```

2. **Install sync script dependencies**:
   ```cmd
   cd c:\nxgen-docs
   npm install axios
   ```

## Daily Workflow

### Creating New Articles

1. **Open Payload Admin**: http://localhost:4000/admin

2. **Create New Page**:
   - Click "Pages" → "Create New"
   - Add title and content
   - Click "Save"

3. **Sync to Docusaurus**:
   ```cmd
   cd c:\nxgen-docs\scripts
   node sync-new-articles.js
   ```

4. **View in Docusaurus**:
   ```cmd
   cd c:\nxgen-docs\classic
   npm run start
   ```
   Open: http://localhost:3000

## What This Does

- ✅ Keeps all existing articles in Docusaurus
- ✅ Only new articles created in Payload
- ✅ Simple one-command sync
- ✅ No database imports needed

## Quick Commands

```cmd
# Start Payload CMS
cd c:\nxgen-docs\payload-cms
npm run dev

# Sync new articles
cd c:\nxgen-docs\scripts
node sync-new-articles.js

# Start Docusaurus
cd c:\nxgen-docs\classic
npm run start
```

## Example

1. Create article "Getting Started" in Payload
2. Run sync script
3. File created: `classic/docs/getting-started.md`
4. Appears in Docusaurus automatically
