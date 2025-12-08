# Payload CMS Troubleshooting

## Server Not Starting

If the server isn't starting, check:

1. **Dependencies installed?**
   ```bash
   cd payload-cms
   npm install
   ```

2. **Check for errors:**
   ```bash
   npm run dev
   ```
   Look for error messages in the terminal.

3. **Verify Node version:**
   ```bash
   node --version
   ```
   Should be >= 18.0.0

4. **Check if port 4000 is available:**
   ```bash
   netstat -ano | findstr :4000
   ```

5. **Try accessing the API directly:**
   ```bash
   curl http://localhost:4000/api
   ```

## Common Issues

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

### "Port already in use"
- Change PORT in `.env` file
- Or kill the process using port 4000

### "Admin route not found"
- Make sure `routes.admin` is set in `payload.config.ts`
- Try accessing `/admin` first (default route)
- Then try `/payload-admin` if configured

## Manual Start

If `npm run dev` doesn't work, try:

```bash
cd payload-cms
npx tsx src/index.ts
```

This will show any errors directly.




