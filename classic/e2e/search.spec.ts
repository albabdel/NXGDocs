import { test, expect } from '@playwright/test';

test.describe('PLSH-01: Local search', () => {
  test('search UI is present on page', async ({ page }) => {
    await page.goto('/');
    // docusaurus-search-local renders a search button in the navbar
    const searchEl = page.locator('.navbar__search-input, [class*="searchBar"], button[aria-label*="Search"]');
    await expect(searchEl).not.toHaveCount(0);
  });

  test.fixme('search returns results for "getting started"', async ({ page }) => {
    // Enable after confirming index is generated in production build
    await page.goto('/');
    const searchInput = page.locator('.navbar__search-input');
    await searchInput.first().click();
    await searchInput.first().fill('getting started');
    const results = page.locator('.search-result-item, [class*="searchResultItem"]');
    await expect(results.first()).toBeVisible({ timeout: 5000 });
    expect(await results.count()).toBeGreaterThan(0);
  });
});
