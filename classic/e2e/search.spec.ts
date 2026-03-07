import { test, expect } from '@playwright/test';

test.describe('PLSH-01: Pagefind search', () => {
  test('pagefind search UI is present on page', async ({ page }) => {
    await page.goto('/');
    // @getcanary/docusaurus-theme-search-pagefind renders a <canary-pagefind> custom element
    // Check for DOM presence — may be CSS-hidden at certain viewport widths
    const searchEl = page.locator('canary-pagefind, [class*="pagefind"], [data-pagefind-ui]');
    await expect(searchEl).not.toHaveCount(0);
  });

  test.fixme('pagefind search returns results for "getting started"', async ({ page }) => {
    // Enable after Phase 4 content is indexed (npm run build generates build/pagefind/)
    await page.goto('/');
    const searchInput = page.locator('.pagefind-ui__search-input, canary-pagefind input');
    await searchInput.first().click();
    await searchInput.first().fill('getting started');
    const results = page.locator('.pagefind-ui__results, canary-pagefind [part="result"]');
    await expect(results.first()).toBeVisible({ timeout: 5000 });
    const hitCount = await results.count();
    expect(hitCount).toBeGreaterThan(0);
  });
});
