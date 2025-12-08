import { test, expect } from '@playwright/test';

test.describe('CMS Article Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to CMS page to enable edit mode
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
  });

  test('should navigate to a doc page and show edit button', async ({ page }) => {
    // First, find a link to a doc page from the landing page
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check for floating edit button using test ID
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await expect(editButton).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should open article editor modal', async ({ page }) => {
    // Navigate to a doc page
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        // Click edit button using test ID
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await editButton.click();
        
        // Wait for editor modal to appear using test ID
        await page.waitForSelector('[data-testid="article-editor-modal"]', { timeout: 10000 });
        
        // Check for editor container
        const editor = page.locator('[data-testid="article-editor"]');
        await expect(editor).toBeVisible();
      }
    }
  });

  test('should edit article title', async ({ page }) => {
    // Navigate to a doc page and open editor
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await editButton.click();
        
        // Wait for editor to load using test ID
        await page.waitForSelector('[data-testid="article-title-input"]', { timeout: 15000 });
        
        // Find title input using test ID
        const titleInput = page.locator('[data-testid="article-title-input"]');
        if (await titleInput.isVisible()) {
          await titleInput.clear();
          await titleInput.fill('Updated Article Title');
          
          // Verify the change
          const value = await titleInput.inputValue();
          expect(value).toBe('Updated Article Title');
        }
      }
    }
  });

  test('should use rich text editor formatting tools', async ({ page }) => {
    // Navigate to a doc page and open editor
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await editButton.click();
        
        // Wait for editor to load
        await page.waitForSelector('[data-testid="article-editor-content"]', { timeout: 15000 });
        
        // Wait a bit for TipTap to initialize
        await page.waitForTimeout(1000);
        
        // Find editor content area using test ID
        const editorContent = page.locator('[data-testid="article-editor-content"]').first();
        await editorContent.click();
        
        // Type some text
        await page.keyboard.type('Test content for formatting');
        
        // Select text and apply bold using test ID
        await page.keyboard.press('Control+A');
        const boldButton = page.locator('[data-testid="bold-button"]');
        await boldButton.click();
        
        // Verify bold is applied (check for active state)
        await expect(boldButton).toHaveClass(/active/);
      }
    }
  });

  test('should insert a heading', async ({ page }) => {
    // Navigate to a doc page and open editor
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await editButton.click();
        
        // Wait for editor
        await page.waitForSelector('[data-testid="article-editor-content"]', { timeout: 15000 });
        await page.waitForTimeout(1000);
        
        const editorContent = page.locator('[data-testid="article-editor-content"]').first();
        await editorContent.click();
        
        // Click heading button using test ID
        const headingButton = page.locator('[data-testid="heading1-button"]');
        await headingButton.click();
        
        // Type heading text
        await page.keyboard.type('New Heading');
        
        // Verify heading is active
        await expect(headingButton).toHaveClass(/active/);
      }
    }
  });

  test('should insert a table', async ({ page }) => {
    // Navigate to a doc page and open editor
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await editButton.click();
        
        // Wait for editor
        await page.waitForSelector('[data-testid="article-editor-content"]', { timeout: 15000 });
        await page.waitForTimeout(1000);
        
        const editorContent = page.locator('[data-testid="article-editor-content"]').first();
        await editorContent.click();
        
        // Click table button using test ID
        const tableButton = page.locator('[data-testid="table-button"]');
        await tableButton.click();
        
        // Wait for table to appear
        await page.waitForSelector('table', { timeout: 5000 });
        
        // Verify table exists
        const table = page.locator('table');
        await expect(table).toBeVisible();
      }
    }
  });

  test('should save article changes', async ({ page }) => {
    // Navigate to a doc page and open editor
    const docLink = page.locator('a[href^="/docs/"]').first();
    
    if (await docLink.isVisible()) {
      const href = await docLink.getAttribute('href');
      if (href) {
        await docLink.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.locator('[data-testid="edit-article-button"]');
        await editButton.click();
        
        // Wait for editor to load
        await page.waitForSelector('[data-testid="article-editor-content"]', { timeout: 15000 });
        await page.waitForTimeout(1000);
        
        // Make a change
        const editorContent = page.locator('[data-testid="article-editor-content"]').first();
        await editorContent.click();
        await page.keyboard.type('Test content added');
        
        // Click save button using test ID
        const saveButton = page.locator('[data-testid="article-save-button"]');
        await saveButton.click();
        
        // Wait for success toast
        await page.waitForSelector('.Toastify__toast', { timeout: 10000 });
        const toast = page.locator('.Toastify__toast').filter({ hasText: /Article saved/i });
        await expect(toast).toBeVisible();
        
        // Verify modal closes
        const editorModal = page.locator('[data-testid="article-editor-modal"]');
        await expect(editorModal).not.toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should create a new article', async ({ page }) => {
    // Click "Create New Article" button in toolbar using test ID
    const createButton = page.locator('[data-testid="create-article-button"]');
    await expect(createButton).toBeVisible();
    await createButton.click();
    
    // Wait for modal using test ID
    await page.waitForSelector('[data-testid="new-article-modal"]', { timeout: 5000 });
    
    // Fill in article title using test ID
    const titleInput = page.locator('[data-testid="new-article-title-input"]');
    await titleInput.fill('Test New Article');
    
    // Submit using test ID
    const submitButton = page.locator('[data-testid="new-article-create-button"]');
    await submitButton.click();
    
    // Wait for editor to open
    await page.waitForSelector('[data-testid="article-editor-modal"]', { timeout: 10000 });
    
    // Verify editor is open
    const editorModal = page.locator('[data-testid="article-editor-modal"]');
    await expect(editorModal).toBeVisible();
  });
});
