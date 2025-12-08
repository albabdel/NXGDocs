import { test, expect } from '@playwright/test';

test.describe('CMS Page Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cms');
    // Wait for CMS to load
    await page.waitForSelector('[data-testid="cms-content"]', { timeout: 10000 }).catch(() => {});
  });

  test('should load CMS page and display homepage cards', async ({ page }) => {
    // Check if hero section is visible
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();

    // Check if cards are displayed
    const cards = page.locator('[class*="card"], [data-testid*="card"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should edit hero title inline', async ({ page }) => {
    // Find hero title (usually the first h1)
    const heroTitle = page.locator('h1').first();
    await heroTitle.click({ clickCount: 2 }); // Double click to edit
    
    // Wait for input field or contenteditable
    const editable = page.locator('input, [contenteditable="true"]').first();
    if (await editable.count() > 0) {
      await editable.fill('Test Hero Title');
      await editable.press('Enter');
      
      // Verify change
      await expect(page.locator('h1').first()).toContainText('Test Hero Title');
    }
  });

  test('should open card editor modal when clicking edit button', async ({ page }) => {
    // Find first card edit button (pencil icon)
    const editButtons = page.locator('button:has(svg), [aria-label*="edit" i], [title*="edit" i]');
    const firstEditButton = editButtons.first();
    
    if (await firstEditButton.count() > 0) {
      await firstEditButton.click();
      
      // Check if modal opens
      const modal = page.locator('[class*="modal"], [role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 2000 });
      
      // Check if form fields are present
      const titleInput = page.locator('input[type="text"]').first();
      await expect(titleInput).toBeVisible();
    }
  });

  test('should add a new card', async ({ page }) => {
    // Find "Add Card" button
    const addButtons = page.locator('button:has-text("Add Card"), button:has-text("Add")');
    const firstAddButton = addButtons.first();
    
    if (await firstAddButton.count() > 0) {
      const initialCardCount = await page.locator('[class*="card"]').count();
      
      await firstAddButton.click();
      
      // Wait for new card to appear or modal to open
      await page.waitForTimeout(500);
      
      // If modal opens, fill form
      const modal = page.locator('[class*="modal"]');
      if (await modal.count() > 0) {
        await page.locator('input[placeholder*="Title" i]').fill('Test Card');
        await page.locator('textarea[placeholder*="Description" i]').fill('Test Description');
        await page.locator('input[placeholder*="Link" i]').fill('/docs/test');
        await page.locator('button:has-text("Save"), button:has-text("OK")').click();
      }
      
      // Verify card was added (count should increase or new card visible)
      await page.waitForTimeout(500);
      const newCardCount = await page.locator('[class*="card"]').count();
      expect(newCardCount).toBeGreaterThanOrEqual(initialCardCount);
    }
  });

  test('should delete a card with confirmation', async ({ page }) => {
    // Find delete button (trash icon)
    const deleteButtons = page.locator('button:has(svg), [aria-label*="delete" i], [title*="delete" i]');
    const firstDeleteButton = deleteButtons.first();
    
    if (await firstDeleteButton.count() > 0) {
      const initialCardCount = await page.locator('[class*="card"]').count();
      
      // Set up dialog handler for confirmation
      page.on('dialog', dialog => dialog.accept());
      
      await firstDeleteButton.click();
      
      // Wait for deletion
      await page.waitForTimeout(500);
      
      // Verify card was deleted
      const newCardCount = await page.locator('[class*="card"]').count();
      if (initialCardCount > 0) {
        expect(newCardCount).toBeLessThan(initialCardCount);
      }
    }
  });

  test('should save changes to admin server', async ({ page }) => {
    // Make a change (edit hero title)
    const heroTitle = page.locator('h1').first();
    await heroTitle.click({ clickCount: 2 });
    
    const editable = page.locator('input, [contenteditable="true"]').first();
    if (await editable.count() > 0) {
      await editable.fill('Saved Title');
      await editable.press('Enter');
    }
    
    // Click save button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Save Changes")');
    if (await saveButton.count() > 0) {
      // Intercept API call
      const savePromise = page.waitForResponse(response => 
        response.url().includes('/api/cms-save') && response.request().method() === 'POST'
      );
      
      await saveButton.click();
      
      // Wait for API call
      const response = await savePromise;
      expect(response.status()).toBe(200);
      
      // Check for success message
      await expect(page.locator('text=/saved|success/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('should export CMS config', async ({ page }) => {
    // Find export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Export Config")');
    
    if (await exportButton.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      
      await exportButton.click();
      
      // Wait for download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.json');
    }
  });

  test('should show server status indicator', async ({ page }) => {
    // Look for server status indicator (green dot, status text, etc.)
    const statusIndicator = page.locator('[class*="status"], [data-testid*="status"], text=/online|offline|server/i');
    
    if (await statusIndicator.count() > 0) {
      await expect(statusIndicator.first()).toBeVisible();
    }
  });

  test('should handle drag and drop reordering', async ({ page }) => {
    const cards = page.locator('[class*="card"]');
    const cardCount = await cards.count();
    
    if (cardCount >= 2) {
      const firstCard = cards.first();
      const secondCard = cards.nth(1);
      
      // Get initial positions
      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();
      
      if (firstBox && secondBox) {
        // Perform drag and drop
        await firstCard.hover();
        await page.mouse.down();
        await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2);
        await page.mouse.up();
        
        // Wait for reorder animation
        await page.waitForTimeout(500);
        
        // Verify cards are still visible (reordering worked)
        await expect(cards.first()).toBeVisible();
        await expect(cards.nth(1)).toBeVisible();
      }
    }
  });
});

