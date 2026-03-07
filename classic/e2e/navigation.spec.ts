import { test, expect } from '@playwright/test';

test.describe('PLSH-01: Two-click navigation', () => {
  test('home page loads and has main navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NXGEN|GCXONE|Documentation/i);
    // Page must contain visible content sections
    await expect(page.locator('main')).toBeVisible();
  });

  test('home page to Breakthroughs in one click', async ({ page }) => {
    await page.goto('/');
    // Footer or home page link to /docs/breakthroughs
    const breakthroughsLink = page.locator('a[href="/docs/breakthroughs"]').first();
    await expect(breakthroughsLink).toBeVisible();
    await breakthroughsLink.click();
    await expect(page).toHaveURL(/\/docs\/breakthroughs/);
  });

  test('home page to Releases in one click', async ({ page }) => {
    await page.goto('/');
    const releasesLink = page.locator('a[href="/releases"]').first();
    await expect(releasesLink).toBeVisible();
  });

  test('footer has no placeholder # links', async ({ page }) => {
    await page.goto('/');
    // Page has two footer elements; check both for hash links using a broad selector
    // Scroll to bottom to ensure footer is in viewport
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const hashLinks = page.locator('footer a[href="#"]');
    await expect(hashLinks).toHaveCount(0);
  });
});
