# Payload CMS - Quick Setup Guide

## ✅ Current Status
- MongoDB: Running
- Payload CMS: Running at http://localhost:4000/admin
- Database: Empty (fresh install)

## Next Steps

### 1. Create Your First Admin User

1. Go to: http://localhost:4000/admin
2. Fill in the registration form:
   - Email: your@email.com
   - Password: (choose a secure password)
3. Click "Create First User"

### 2. Start Creating Content

Once logged in, you can:
- Click "Pages" to create new documentation pages
- Add title and content using the rich text editor
- Click "Save" to publish

### 3. Import Existing Docs (Optional)

To import your existing Docusaurus content:

```cmd
cd c:\nxgen-docs\scripts
node import-to-payload.js
```

**Before running:**
1. Create admin user first (step 1 above)
2. Edit `import-to-payload.js` and update:
   - Email (line 13)
   - Password (line 14)
3. Uncomment lines 48-49
4. Run the script

### 4. Sync to Docusaurus

After creating content in Payload, sync it back to Docusaurus:

```cmd
cd c:\nxgen-docs\scripts
node sync-payload.js
```

**Note:** You'll need to set `PAYLOAD_API_TOKEN` in `.env` first.
Generate it in Payload Admin → Settings → API Keys

## Collections Available

- **Users**: Admin users who can access the CMS
- **Pages**: Your documentation pages

## Useful Commands

```cmd
# Start Payload CMS
cd c:\nxgen-docs\payload-cms
npm run dev

# Check MongoDB status
sc query MongoDB

# Stop MongoDB
net stop MongoDB

# Start MongoDB
net start MongoDB
```

## Troubleshooting

**Can't access admin panel:**
- Make sure Payload is running: `npm run dev`
- Check URL: http://localhost:4000/admin

**MongoDB not running:**
```cmd
net start MongoDB
```

**Port 4000 already in use:**
- Change PORT in `.env` file
- Or stop the other process using port 4000
