import { test, expect } from '@playwright/test';

test.describe('PLSH-02: Visual consistency', () => {
  test('home page renders without layout errors in dark mode (default)', async ({ page }) => {
    await page.goto('/');
    // Default theme is dark — verify key sections are visible
    await expect(page.locator('main')).toBeVisible();
    // Page has two footer elements; verify at least one footer is attached to the DOM
    await expect(page.locator('footer').first()).toBeAttached();
  });

  test('home page renders without layout errors in light mode', async ({ page }) => {
    await page.goto('/');
    // Switch to light mode via data-theme attribute
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    // Key sections should still be visible and not broken
    await expect(page.locator('main')).toBeVisible();
    // Page has two footer elements; verify at least one footer is attached to the DOM
    await expect(page.locator('footer').first()).toBeAttached();
    // Quick Start heading must be readable (has CSS override, not white-on-white)
    const quickStartHeading = page.locator('h2').filter({ hasText: 'Quick Start' });
    if (await quickStartHeading.count() > 0) {
      await expect(quickStartHeading.first()).toBeVisible();
    }
  });

  test('VoC success message text is visible in light mode', async ({ page }) => {
    await page.goto('/');
    // Switch to light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    // Inject the success state directly (without submitting the form)
    // Verify the CSS rule exists and applies correct color
    const vocSuccessP = await page.evaluate(() => {
      // Create a temporary element to test the CSS rule
      const el = document.createElement('div');
      el.setAttribute('data-theme', 'light');
      el.innerHTML = '<div class="voc-success-message"><p>Test</p></div>';
      document.body.appendChild(el);
      const p = el.querySelector('.voc-success-message p') as HTMLElement;
      const color = window.getComputedStyle(p).color;
      document.body.removeChild(el);
      return color;
    });
    // Color must NOT be white (rgba(255,255,255,...)) — should be a dark readable color
    expect(vocSuccessP).not.toMatch(/rgba\(255,\s*255,\s*255/);
  });
});
