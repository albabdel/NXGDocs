import { test, expect } from '@playwright/test';

test.describe('PLSH-01: Algolia search', () => {
  test('search button is present on page', async ({ page }) => {
    await page.goto('/');
    // DocSearch button must exist
    const searchButton = page.locator('.DocSearch-Button, [aria-label*="Search"], button[class*="DocSearch"]').first();
    await expect(searchButton).toBeVisible();
  });

  test.fixme('search returns results for "getting started"', async ({ page }) => {
    // Enable after Phase 4 content is indexed in Algolia
    // Requires: Algolia credential unification (Plan 02) + fresh crawl after Phase 4
    await page.goto('/');
    await page.keyboard.press('Control+k');
    const modal = page.locator('.DocSearch-Modal');
    await expect(modal).toBeVisible();
    await page.keyboard.type('getting started');
    const results = page.locator('.DocSearch-Hits');
    await expect(results).toBeVisible();
    const hitCount = await results.locator('.DocSearch-Hit').count();
    expect(hitCount).toBeGreaterThan(0);
  });
});
