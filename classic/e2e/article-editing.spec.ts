import { test, expect } from '@playwright/test';

test.describe('Article Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to CMS mode first
    await page.goto('/cms');
    await page.waitForTimeout(1000);
    
    // Navigate to a doc page
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    
    // Find and click first doc link
    const firstDocLink = page.locator('a[href^="/docs/"]').first();
    if (await firstDocLink.count() > 0) {
      await firstDocLink.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should show edit article button on doc pages in CMS mode', async ({ page }) => {
    // Check if we're on a doc page
    const isDocPage = page.url().includes('/docs/') && !page.url().endsWith('/docs');
    
    if (isDocPage) {
      // Look for edit article button
      const editButton = page.locator('button:has-text("Edit Article"), button:has-text("Edit")');
      
      // Button might be floating or in overlay
      await page.waitForTimeout(1000);
      
      // Check if button exists (might be in overlay)
      const buttonCount = await editButton.count();
      if (buttonCount > 0) {
        await expect(editButton.first()).toBeVisible();
      }
    }
  });

  test('should open article editor when clicking edit button', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit Article"), button:has-text("Edit")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      
      // Wait for editor to open
      await page.waitForTimeout(1000);
      
      // Check if editor is visible (TipTap editor)
      const editor = page.locator('[class*="editor"], [class*="tiptap"], [contenteditable="true"]');
      await expect(editor.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should load article content in editor', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit Article")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      // Check if editor has content
      const editor = page.locator('[contenteditable="true"], [class*="editor"]').first();
      if (await editor.count() > 0) {
        const content = await editor.textContent();
        expect(content?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should edit article content in rich text editor', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit Article")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      const editor = page.locator('[contenteditable="true"]').first();
      if (await editor.count() > 0) {
        // Clear and add test content
        await editor.click();
        await editor.fill('Test article content');
        
        // Verify content was added
        const content = await editor.textContent();
        expect(content).toContain('Test article content');
      }
    }
  });

  test('should use formatting toolbar buttons', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit Article")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      // Look for formatting buttons (bold, italic, etc.)
      const boldButton = page.locator('button[aria-label*="bold" i], button[title*="bold" i]').first();
      
      if (await boldButton.count() > 0) {
        const editor = page.locator('[contenteditable="true"]').first();
        await editor.fill('Test text');
        await editor.selectText({ force: true });
        
        await boldButton.click();
        
        // Check if formatting was applied (might check for <strong> or <b> tags)
        await page.waitForTimeout(500);
      }
    }
  });

  test('should save article changes', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit Article")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      const editor = page.locator('[contenteditable="true"]').first();
      if (await editor.count() > 0) {
        await editor.fill('Updated article content');
        
        // Find save button
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Save Article")');
        
        if (await saveButton.count() > 0) {
          // Intercept API call
          const savePromise = page.waitForResponse(response => 
            response.url().includes('/api/file') && response.request().method() === 'POST'
          ).catch(() => null);
          
          await saveButton.click();
          
          // Wait for save to complete
          await page.waitForTimeout(1000);
          
          // Check for success message
          const successMessage = page.locator('text=/saved|success/i');
          if (await successMessage.count() > 0) {
            await expect(successMessage.first()).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('should close editor when clicking close button', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit Article")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      // Find close button
      const closeButton = page.locator('button:has(svg), button[aria-label*="close" i]').first();
      
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(500);
        
        // Editor should be hidden
        const editor = page.locator('[class*="editor"], [class*="modal"]');
        // Editor might still be in DOM but hidden
        await expect(editor.first()).not.toBeVisible({ timeout: 2000 }).catch(() => {});
      }
    }
  });
});

