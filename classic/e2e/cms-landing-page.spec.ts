import { test, expect } from '@playwright/test';

test.describe('CMS Landing Page Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to CMS page to enable edit mode
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    // Wait for CMS toolbar to appear using test ID
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
  });

  test('should display CMS toolbar in edit mode', async ({ page }) => {
    const toolbar = page.locator('[data-testid="cms-toolbar"]');
    await expect(toolbar).toBeVisible();
    
    // Check for toolbar title
    const toolbarTitle = page.locator('[data-testid="cms-toolbar-title"]');
    await expect(toolbarTitle).toBeVisible();
    
    // Check for save button
    const saveButton = page.locator('[data-testid="save-button"]');
    await expect(saveButton).toBeVisible();
  });

  test('should edit hero title and subtitle', async ({ page }) => {
    // Find hero title input using test ID
    const heroTitleInput = page.locator('[data-testid="hero-title-input"]');
    await expect(heroTitleInput).toBeVisible();
    
    // Clear and type new title
    await heroTitleInput.clear();
    await heroTitleInput.fill('Test Hero Title');
    
    // Find hero subtitle textarea using test ID
    const heroSubtitleTextarea = page.locator('[data-testid="hero-subtitle-textarea"]');
    await expect(heroSubtitleTextarea).toBeVisible();
    
    await heroSubtitleTextarea.clear();
    await heroSubtitleTextarea.fill('Test Hero Subtitle');
    
    // Check that dirty indicator appears
    const dirtyIndicator = page.locator('[data-testid="dirty-indicator"]');
    await expect(dirtyIndicator).toBeVisible({ timeout: 2000 });
  });

  test('should edit section headings and subtitles', async ({ page }) => {
    // Test Featured Topics section using test ID
    const featuredHeadingInput = page.locator('[data-testid="section-heading-input-featured"]');
    if (await featuredHeadingInput.isVisible()) {
      await featuredHeadingInput.clear();
      await featuredHeadingInput.fill('Updated Featured Topics');
      
      // Check for dirty state
      const dirtyIndicator = page.locator('[data-testid="dirty-indicator"]');
      await expect(dirtyIndicator).toBeVisible({ timeout: 2000 });
    }
  });

  test('should add a new card to a section', async ({ page }) => {
    // Find "Add Card" button in Core Resources section using test ID
    const addCardButton = page.locator('[data-testid="add-card-button-coreResources"]');
    await expect(addCardButton).toBeVisible();
    
    // Click add card button
    await addCardButton.click();
    
    // Wait for toast notification - use Toastify selector
    await page.waitForSelector('.Toastify__toast', { timeout: 5000 });
    const toast = page.locator('.Toastify__toast').filter({ hasText: /Card added/i });
    await expect(toast).toBeVisible();
  });

  test('should edit an existing card', async ({ page }) => {
    // Find edit button on a card using test ID pattern
    // First, find a card, then find its edit button
    const cards = page.locator('[data-testid^="card-"]');
    const cardCount = await cards.count();
    
    if (cardCount > 0) {
      // Get the first card's ID
      const firstCard = cards.first();
      const cardId = await firstCard.getAttribute('data-testid');
      if (cardId) {
        const cardIdValue = cardId.replace('card-', '');
        const editButton = page.locator(`[data-testid="edit-card-button-${cardIdValue}"]`);
        
        if (await editButton.isVisible()) {
          await editButton.click();
          
          // Wait for modal to appear using test ID
          await page.waitForSelector('[data-testid="card-editor-modal"]', { timeout: 5000 });
          
          // Edit card title using test ID
          const titleInput = page.locator('[data-testid="card-editor-title-input"]');
          await expect(titleInput).toBeVisible();
          await titleInput.clear();
          await titleInput.fill('Updated Card Title');
          
          // Edit description using test ID
          const descriptionTextarea = page.locator('[data-testid="card-editor-description-textarea"]');
          await descriptionTextarea.clear();
          await descriptionTextarea.fill('Updated description');
          
          // Save the card using test ID
          const saveButton = page.locator('[data-testid="card-editor-save-button"]');
          await saveButton.click();
          
          // Wait for success toast
          await page.waitForSelector('.Toastify__toast', { timeout: 5000 });
          const toast = page.locator('.Toastify__toast').filter({ hasText: /Card updated/i });
          await expect(toast).toBeVisible();
        }
      }
    }
  });

  test('should delete a card', async ({ page }) => {
    // Find delete button on a card using test ID
    const cards = page.locator('[data-testid^="card-"]');
    const cardCount = await cards.count();
    
    if (cardCount > 0) {
      const firstCard = cards.first();
      const cardId = await firstCard.getAttribute('data-testid');
      if (cardId) {
        const cardIdValue = cardId.replace('card-', '');
        const deleteButton = page.locator(`[data-testid="delete-card-button-${cardIdValue}"]`);
        
        if (await deleteButton.isVisible()) {
          // Set up dialog handler before clicking
          page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            await dialog.accept();
          });
          
          // Click delete button
          await deleteButton.click();
          
          // Wait for success toast
          await page.waitForSelector('.Toastify__toast', { timeout: 5000 });
          const toast = page.locator('.Toastify__toast').filter({ hasText: /Card deleted/i });
          await expect(toast).toBeVisible();
        }
      }
    }
  });

  test('should reorder cards by dragging', async ({ page }) => {
    // Find drag handles using test ID pattern
    const dragHandles = page.locator('[data-testid^="card-drag-handle-"]');
    const handleCount = await dragHandles.count();
    
    if (handleCount >= 2) {
      const firstHandle = dragHandles.first();
      const secondHandle = dragHandles.nth(1);
      
      // Get positions
      const firstBox = await firstHandle.boundingBox();
      const secondBox = await secondHandle.boundingBox();
      
      if (firstBox && secondBox) {
        // Drag first card to second position
        await firstHandle.hover();
        await page.mouse.down();
        // Move with steps for smoother drag
        await page.mouse.move(secondBox.x, secondBox.y, { steps: 10 });
        await page.mouse.up();
        
        // Wait for reorder toast
        await page.waitForSelector('.Toastify__toast', { timeout: 5000 });
        const toast = page.locator('.Toastify__toast').filter({ hasText: /Cards reordered/i });
        await expect(toast).toBeVisible();
      }
    }
  });

  test('should save changes to admin server', async ({ page }) => {
    // Make a change first using test ID
    const heroTitleInput = page.locator('[data-testid="hero-title-input"]');
    await heroTitleInput.clear();
    await heroTitleInput.fill('Test Save Title');
    
    // Wait for dirty indicator
    await page.waitForSelector('[data-testid="dirty-indicator"]', { timeout: 5000 });
    
    // Click save button using test ID
    const saveButton = page.locator('[data-testid="save-button"]');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    
    // Wait for save to complete - check for toast
    await page.waitForSelector('.Toastify__toast', { timeout: 10000 });
    const toast = page.locator('.Toastify__toast').filter({ hasText: /Saved|Changes saved/i });
    await expect(toast).toBeVisible();
    
    // Wait a bit for state to update
    await page.waitForTimeout(1000);
    
    // Verify dirty indicator is gone (or save button shows "Saved")
    const saveButtonText = await saveButton.textContent();
    expect(saveButtonText).toMatch(/Saved|Saving/i);
  });

  test('should export CMS config', async ({ page }) => {
    // Click export button using test ID
    const exportButton = page.locator('[data-testid="export-button"]');
    await expect(exportButton).toBeVisible();
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await exportButton.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('cms-config.json');
    
    // Verify file content
    const path = await download.path();
    if (path) {
      const fs = require('fs');
      const content = fs.readFileSync(path, 'utf-8');
      const config = JSON.parse(content);
      expect(config).toHaveProperty('landingPage');
      expect(config).toHaveProperty('sidebar');
      expect(config).toHaveProperty('articles');
    }
  });
});
