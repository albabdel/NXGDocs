import { test, expect } from '@playwright/test';

test.describe('CMS Integration with Existing Features', () => {
  test('should persist edit mode across navigation', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Verify edit mode is active using test ID
    const toolbar = page.locator('[data-testid="cms-toolbar"]');
    await expect(toolbar).toBeVisible();
    
    // Navigate to a doc page
    const docLink = page.locator('a[href^="/docs/"]').first();
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify edit mode is still active (toolbar should still be visible)
        await expect(toolbar).toBeVisible({ timeout: 5000 });
        
        // Verify edit button is visible on doc page using test ID
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await expect(editButton).toBeVisible();
      }
    }
  });

  test('should exit edit mode and return to normal view', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Click exit edit mode button using test ID
    const exitButton = page.locator('[data-testid="exit-edit-mode-button"]');
    await expect(exitButton).toBeVisible();
    await exitButton.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify toolbar is gone
    const toolbar = page.locator('[data-testid="cms-toolbar"]');
    await expect(toolbar).not.toBeVisible();
  });

  test('should work with Docusaurus search', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.click();
      
      // Type search query
      await searchInput.fill('test');
      
      // Wait for search results (if modal appears)
      await page.waitForTimeout(1000);
    }
  });

  test('should maintain sidebar structure after editing', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Navigate to a doc page to see sidebar
    const docLink = page.locator('a[href^="/docs/"]').first();
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check if sidebar is visible
        const sidebar = page.locator('[class*="sidebar"], [class*="menu"]');
        if (await sidebar.isVisible()) {
          // Verify sidebar has items
          const sidebarItems = sidebar.locator('a, [class*="menuItem"]');
          const itemCount = await sidebarItems.count();
          expect(itemCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should handle admin server offline state', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Check for server status indicator using test ID
    const serverStatus = page.locator('[data-testid="server-offline-indicator"], [data-testid="server-online-indicator"]');
    const statusVisible = await serverStatus.isVisible().catch(() => false);
    
    // Make a change using test ID
    const heroTitleInput = page.locator('[data-testid="hero-title-input"]');
    if (await heroTitleInput.isVisible()) {
      await heroTitleInput.clear();
      await heroTitleInput.fill('Test Title');
      
      // Try to save using test ID (should show error if server is offline)
      const saveButton = page.locator('[data-testid="save-button"]');
      await saveButton.click();
      
      // Wait for either success or error message
      await page.waitForSelector(
        '.Toastify__toast',
        { timeout: 10000 }
      );
    }
  });

  test('should export and import config correctly', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Export config using test ID
    const exportButton = page.locator('[data-testid="export-button"]');
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await exportButton.click();
    
    const download = await downloadPromise;
    const path = await download.path();
    
    if (path) {
      const fs = require('fs');
      const content = fs.readFileSync(path, 'utf-8');
      const config = JSON.parse(content);
      
      // Verify config structure
      expect(config).toHaveProperty('landingPage');
      expect(config.landingPage).toHaveProperty('heroTitle');
      expect(config.landingPage).toHaveProperty('coreResources');
      expect(config).toHaveProperty('sidebar');
      expect(config).toHaveProperty('articles');
      
      // Verify config has valid data
      expect(typeof config.landingPage.heroTitle).toBe('string');
      expect(Array.isArray(config.landingPage.coreResources)).toBe(true);
      expect(Array.isArray(config.sidebar)).toBe(true);
    }
  });

  test('should work with browser back/forward navigation', async ({ page }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Navigate to a doc page
    const docLink = page.locator('a[href^="/docs/"]').first();
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        // Go back
        await page.goBack();
        await page.waitForLoadState('networkidle');
        
        // Verify we're back on CMS page and edit mode is still active using test ID
        const toolbar = page.locator('[data-testid="cms-toolbar"]');
        await expect(toolbar).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should handle localStorage persistence', async ({ page, context }) => {
    // Navigate to CMS page
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
    
    // Make a change using test ID
    const heroTitleInput = page.locator('[data-testid="hero-title-input"]');
    if (await heroTitleInput.isVisible()) {
      await heroTitleInput.clear();
      await heroTitleInput.fill('Persisted Title');
      
      // Wait a bit for auto-save to localStorage
      await page.waitForTimeout(2000);
      
      // Check localStorage
      const cmsConfig = await page.evaluate(() => {
        return localStorage.getItem('cms_config');
      });
      
      expect(cmsConfig).not.toBeNull();
      
      if (cmsConfig) {
        const config = JSON.parse(cmsConfig);
        expect(config.landingPage.heroTitle).toBe('Persisted Title');
      }
    }
  });
});
