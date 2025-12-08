# End-to-End Tests for CMS

This directory contains comprehensive end-to-end tests for the Visual CMS system and its integration with existing Docusaurus features.

## Test Structure

### Test Files

1. **`cms-landing-page.spec.ts`** - Tests for landing page editing features:
   - Hero text editing (title and subtitle)
   - Section heading/subtitle editing
   - Card CRUD operations (add, edit, delete)
   - Card reordering via drag and drop
   - Save functionality
   - Config export

2. **`cms-article-editing.spec.ts`** - Tests for article editing:
   - Opening article editor
   - Rich text editor functionality
   - Formatting tools (bold, headings, lists, etc.)
   - Table insertion
   - Article saving
   - Creating new articles

3. **`cms-sidebar-editing.spec.ts`** - Tests for sidebar management:
   - Opening sidebar editor
   - Renaming sidebar items
   - Deleting sidebar items
   - Adding new folders
   - Reordering sidebar items

4. **`cms-integration.spec.ts`** - Tests for integration with existing features:
   - Edit mode persistence across navigation
   - Exit edit mode functionality
   - Integration with Docusaurus search
   - Sidebar structure maintenance
   - Admin server offline handling
   - Config export/import
   - Browser navigation (back/forward)
   - localStorage persistence

5. **`admin-server.spec.ts`** - Tests for admin server API:
   - Health check endpoint
   - Docs directory listing
   - File read operations
   - CMS config save
   - File save operations
   - Error handling
   - CORS configuration
   - Large payload handling

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running All Tests

```bash
npm run test:e2e
```

This will:
- Start the admin server (port 3001)
- Start the Docusaurus dev server (port 3000)
- Run all E2E tests
- Generate an HTML report

### Running Tests in UI Mode

```bash
npm run test:e2e:ui
```

Opens Playwright's interactive UI for running and debugging tests.

### Running Tests in Headed Mode

```bash
npm run test:e2e:headed
```

Runs tests with browser visible (useful for debugging).

### Running Tests in Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright's debugger for step-by-step test execution.

### Running Specific Test Files

```bash
npx playwright test cms-landing-page
npx playwright test cms-article-editing
npx playwright test cms-sidebar-editing
npx playwright test cms-integration
npx playwright test admin-server
```

## Test Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./e2e`
- **Browsers**: Chromium (Desktop Chrome)
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

## What Gets Tested

### CMS Features
- ✅ Landing page editing (hero, sections, cards)
- ✅ Card management (add, edit, delete, reorder)
- ✅ Sidebar editing and management
- ✅ Article editing with rich text editor
- ✅ Edit mode toggling and persistence
- ✅ Save/load functionality
- ✅ Config export/import

### Integration Points
- ✅ Navigation between pages
- ✅ Edit mode persistence
- ✅ Docusaurus sidebar integration
- ✅ Search functionality
- ✅ Browser navigation (back/forward)
- ✅ localStorage persistence

### Admin Server
- ✅ Health check
- ✅ File operations (read, write)
- ✅ CMS config save
- ✅ Error handling
- ✅ CORS configuration

## Test Reports

After running tests, an HTML report is generated. Open it with:

```bash
npx playwright show-report
```

## Troubleshooting

### Tests Fail to Start

1. Ensure admin server is not already running on port 3001
2. Ensure dev server is not already running on port 3000
3. Check that all dependencies are installed

### Tests Timeout

- Increase timeout in `playwright.config.ts` if needed
- Check that servers are starting correctly
- Verify network connectivity

### Tests Fail Intermittently

- Some tests may need adjustment based on actual UI structure
- Check for race conditions (use `waitFor` appropriately)
- Verify selectors match actual DOM structure

## Writing New Tests

When adding new CMS features, add corresponding tests:

1. Create or update test file in `e2e/` directory
2. Use descriptive test names
3. Wait for elements to be visible before interacting
4. Use appropriate assertions
5. Handle async operations properly
6. Clean up after tests if needed

Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cms');
    await page.waitForSelector('text=Visual CMS - Edit Mode');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## CI/CD Integration

These tests can be integrated into CI/CD pipelines. The configuration already includes CI-specific settings:

- Retries enabled on CI
- Single worker on CI
- Proper timeout handling

Add to your CI workflow:

```yaml
- name: Install dependencies
  run: npm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

