# Quick Start: Running E2E Tests

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Running Tests

### Option 1: Automatic (Recommended)

The Playwright config automatically starts both servers. Just run:

```bash
npm run test:e2e
```

This will:
- ✅ Start admin server on port 3001
- ✅ Start Docusaurus dev server on port 3000
- ✅ Run all E2E tests
- ✅ Generate HTML report

### Option 2: Manual Server Start

If you prefer to start servers manually:

**Terminal 1 - Admin Server:**
```bash
npm run admin:server
```

**Terminal 2 - Dev Server:**
```bash
npm start
```

**Terminal 3 - Run Tests:**
```bash
npm run test:e2e
```

## Test Modes

### Interactive UI Mode
```bash
npm run test:e2e:ui
```
Opens Playwright UI for visual test execution and debugging.

### Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```
Runs tests with visible browser windows.

### Debug Mode
```bash
npm run test:e2e:debug
```
Opens Playwright Inspector for step-by-step debugging.

## Viewing Results

After tests complete, view the HTML report:

```bash
npx playwright show-report
```

## Common Issues

### "Cannot connect to server"
- Ensure ports 3000 and 3001 are free
- Wait for servers to fully start (can take 30-60 seconds)
- Check server logs for errors

### Tests timeout
- Increase timeout: `test.setTimeout(60000)` in test file
- Check if servers are running: `curl http://localhost:3001/api/health`

### Element not found
- Add wait: `await page.waitForTimeout(1000)`
- Use more specific selectors
- Check if element is conditionally rendered

## Test Files

- `e2e/cms-page.spec.ts` - CMS page functionality
- `e2e/article-editing.spec.ts` - Article editor
- `e2e/sidebar-editing.spec.ts` - Sidebar management
- `e2e/admin-server-api.spec.ts` - API endpoints
- `e2e/docusaurus-integration.spec.ts` - Docusaurus integration

## Next Steps

See [E2E_TESTING.md](./E2E_TESTING.md) for detailed documentation.

