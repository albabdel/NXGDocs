# End-to-End Testing Guide

This document provides information about the E2E testing setup for the Visual CMS system.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```

2. **Run all tests:**
   ```bash
   npm run test:e2e
   ```

3. **View test report:**
   ```bash
   npx playwright show-report
   ```

## Test Coverage

The E2E test suite covers:

### ✅ CMS Landing Page Features
- Hero text editing (title and subtitle)
- Section heading/subtitle editing
- Card management (add, edit, delete, reorder)
- Save functionality
- Config export

### ✅ Article Editing
- Opening article editor
- Rich text editor functionality
- Formatting tools (bold, headings, lists, tables)
- Article saving
- Creating new articles

### ✅ Sidebar Management
- Opening sidebar editor
- Renaming/deleting sidebar items
- Adding new folders
- Reordering items

### ✅ Integration Testing
- Edit mode persistence across navigation
- Integration with Docusaurus features
- Browser navigation handling
- localStorage persistence
- Admin server integration

### ✅ Admin Server API
- Health check
- File operations
- CMS config save
- Error handling

## Test Structure

```
e2e/
├── README.md              # Detailed test documentation
├── helpers.ts             # Test utility functions
├── cms-landing-page.spec.ts
├── cms-article-editing.spec.ts
├── cms-sidebar-editing.spec.ts
├── cms-integration.spec.ts
└── admin-server.spec.ts
```

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Headed Mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug Mode
```bash
npm run test:e2e:debug
```

### Specific Test File
```bash
npx playwright test cms-landing-page
```

## Test Configuration

Tests automatically:
- Start admin server on port 3001
- Start dev server on port 3000
- Wait for both to be ready
- Run tests in Chromium browser
- Generate HTML reports

Configuration is in `playwright.config.ts`.

## Writing New Tests

When adding new CMS features:

1. **Add tests to appropriate spec file** or create new one
2. **Use helper functions** from `e2e/helpers.ts`
3. **Wait for elements** before interacting
4. **Use descriptive test names**
5. **Handle async operations** properly

Example:
```typescript
import { test, expect } from '@playwright/test';
import { waitForEditMode } from './helpers';

test.describe('New Feature', () => {
  test('should do something', async ({ page }) => {
    await waitForEditMode(page);
    // Test implementation
  });
});
```

## Troubleshooting

### Tests Won't Start
- Ensure ports 3000 and 3001 are available
- Check that dependencies are installed
- Verify Node.js version (>=18.0)

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check server startup logs
- Verify network connectivity

### Tests Fail
- Check test report for details
- Run in headed mode to see what's happening
- Use debug mode for step-by-step execution
- Verify selectors match actual DOM structure

## CI/CD Integration

Tests are ready for CI/CD integration:

```yaml
- name: Install dependencies
  run: npm install

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Tests should clean up after themselves
3. **Wait**: Always wait for elements before interacting
4. **Assertions**: Use meaningful assertions
5. **Error Handling**: Handle expected errors gracefully

## Next Steps

- Add more test coverage as features are added
- Update tests when UI changes
- Run tests before committing changes
- Review test reports regularly

For detailed information, see `e2e/README.md`.

