# Test Payload CMS

## Quick Test

1. **Update your credentials** in `payload-cms\.env`:
   - Replace `admin@example.com` with your actual email
   - Replace `password` with your actual password

2. **Create a test article in Payload**:
   - Go to: http://localhost:4000/admin
   - Click "Pages" → "Create New"
   - Title: "Test Article"
   - Content: "This is a test from Payload CMS"
   - Click "Save"

3. **Run sync**:
   ```cmd
   cd c:\nxgen-docs\scripts
   node sync-new-articles.js
   ```

4. **Check result**:
   - Look in `classic/docs/` for `test-article.md`
   - Start Docusaurus to see it live

## Next Steps

Once test works:
- Create real articles in Payload
- Run sync script after each article
- All existing docs stay untouched
