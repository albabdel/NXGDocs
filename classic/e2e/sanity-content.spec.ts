/**
 * Phase 3 — INTG-01 Sanity Content Integration Tests
 *
 * Test 1 (build smoke): Verifies .sanity-cache/docs/ exists after build.
 *   Run manually: cd classic && npm run build && test -d .sanity-cache/docs
 *   This spec covers the Playwright-testable surface: that the server
 *   serves a Sanity-sourced page at its slug URL.
 *
 * Test 2 (page presence): Skipped until Plan 02 plugin is built.
 *   Enable by removing test.skip after Plan 02 is complete.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('INTG-01: Sanity content plugin', () => {

  test('sanity-cache/docs directory exists after build', async () => {
    // This test does not need a browser — it checks the filesystem artifact.
    // Run AFTER `npm run build` has executed.
    const cacheDir = path.resolve(__dirname, '../.sanity-cache/docs');
    const exists = fs.existsSync(cacheDir);
    expect(exists, `.sanity-cache/docs must exist after npm run build`).toBe(true);
  });

  test.skip('Sanity-sourced page renders at /sanity-docs/{slug}', async ({ page }) => {
    // Enable after Plan 02 (plugin) is complete and a test document exists in Studio.
    // The test slug must match a published document's slug.current in Sanity.
    const testSlug = 'test-integration-doc'; // update after creating test doc in Studio
    await page.goto(`/sanity-docs/${testSlug}`);
    await expect(page).toHaveTitle(/./); // any non-empty title
    await expect(page.locator('h1')).toBeVisible();
  });

});
