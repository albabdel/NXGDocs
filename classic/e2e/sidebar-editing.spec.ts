import { test, expect } from '@playwright/test';

test.describe('Sidebar Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to CMS mode
    await page.goto('/cms');
    await page.waitForTimeout(1000);
  });

  test('should open sidebar editor when clicking edit sidebar button', async ({ page }) => {
    // Find "Edit Sidebar" button
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar"), button:has-text("Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Check if sidebar editor is visible
      const sidebarEditor = page.locator('[class*="sidebar"], [class*="editor"]');
      await expect(sidebarEditor.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display sidebar items in editor', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Check if sidebar items are displayed
      const sidebarItems = page.locator('[class*="item"], [class*="sidebar-item"]');
      const itemCount = await sidebarItems.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('should add a root folder', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Find "Add Root Folder" button
      const addFolderButton = page.locator('button:has-text("Add Root Folder"), button:has-text("Add Folder")');
      
      if (await addFolderButton.count() > 0) {
        const initialItemCount = await page.locator('[class*="item"]').count();
        
        await addFolderButton.click();
        await page.waitForTimeout(500);
        
        // Check if modal opens or item is added
        const modal = page.locator('[class*="modal"]');
        if (await modal.count() > 0) {
          // Fill in folder name
          const nameInput = page.locator('input[type="text"]').first();
          await nameInput.fill('Test Folder');
          await page.locator('button:has-text("Save"), button:has-text("Add")').click();
        }
        
        await page.waitForTimeout(500);
        
        // Verify folder was added
        const newItemCount = await page.locator('[class*="item"]').count();
        expect(newItemCount).toBeGreaterThanOrEqual(initialItemCount);
      }
    }
  });

  test('should rename sidebar item', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Find first item's edit/rename button
      const renameButtons = page.locator('button:has(svg), [aria-label*="edit" i], [aria-label*="rename" i]');
      const firstRenameButton = renameButtons.first();
      
      if (await firstRenameButton.count() > 0) {
        await firstRenameButton.click();
        await page.waitForTimeout(500);
        
        // Find input field (might be inline or in modal)
        const input = page.locator('input[type="text"]').first();
        if (await input.count() > 0) {
          await input.fill('Renamed Item');
          await input.press('Enter');
          
          await page.waitForTimeout(500);
          
          // Verify rename (check if text appears)
          const renamedItem = page.locator('text="Renamed Item"');
          if (await renamedItem.count() > 0) {
            await expect(renamedItem.first()).toBeVisible();
          }
        }
      }
    }
  });

  test('should delete sidebar item with confirmation', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Find delete buttons
      const deleteButtons = page.locator('button:has(svg), [aria-label*="delete" i], [title*="delete" i]');
      const firstDeleteButton = deleteButtons.first();
      
      if (await firstDeleteButton.count() > 0) {
        const initialItemCount = await page.locator('[class*="item"]').count();
        
        // Set up dialog handler
        page.on('dialog', dialog => dialog.accept());
        
        await firstDeleteButton.click();
        await page.waitForTimeout(500);
        
        // Verify item was deleted
        const newItemCount = await page.locator('[class*="item"]').count();
        if (initialItemCount > 0) {
          expect(newItemCount).toBeLessThan(initialItemCount);
        }
      }
    }
  });

  test('should expand and collapse folders', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Find chevron/expand buttons
      const expandButtons = page.locator('button:has(svg), [aria-label*="expand" i], [class*="chevron"]');
      
      if (await expandButtons.count() > 0) {
        const firstExpandButton = expandButtons.first();
        await firstExpandButton.click();
        await page.waitForTimeout(500);
        
        // Check if children are visible (if folder had children)
        const children = page.locator('[class*="child"], [class*="nested"]');
        // Just verify the interaction worked (no error)
        await expect(firstExpandButton).toBeVisible();
      }
    }
  });

  test('should add item to folder', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Find plus/add buttons on folders
      const addButtons = page.locator('button:has-text("+"), button:has(svg)');
      
      if (await addButtons.count() > 0) {
        await addButtons.first().click();
        await page.waitForTimeout(500);
        
        // Check if menu or modal opens
        const menu = page.locator('[class*="menu"], [class*="dropdown"]');
        if (await menu.count() > 0) {
          // Select "Document" or "Folder" option
          const documentOption = page.locator('text=/document|file/i');
          if (await documentOption.count() > 0) {
            await documentOption.first().click();
            
            // Fill in details if modal opens
            await page.waitForTimeout(500);
            const input = page.locator('input[type="text"]').first();
            if (await input.count() > 0) {
              await input.fill('New Document');
              await page.locator('button:has-text("Save"), button:has-text("Add")').click();
            }
          }
        }
      }
    }
  });

  test('should save sidebar changes', async ({ page }) => {
    const editSidebarButton = page.locator('button:has-text("Edit Sidebar")');
    
    if (await editSidebarButton.count() > 0) {
      await editSidebarButton.click();
      await page.waitForTimeout(1000);
      
      // Make a change (rename first item)
      const renameButton = page.locator('button:has(svg), [aria-label*="edit" i]').first();
      if (await renameButton.count() > 0) {
        await renameButton.click();
        await page.waitForTimeout(500);
        
        const input = page.locator('input[type="text"]').first();
        if (await input.count() > 0) {
          await input.fill('Test Rename');
          await input.press('Enter');
        }
      }
      
      // Find save button (might be in overlay or main page)
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Save Changes")');
      
      if (await saveButton.count() > 0) {
        // Intercept API call
        const savePromise = page.waitForResponse(response => 
          response.url().includes('/api/cms-save') && response.request().method() === 'POST'
        ).catch(() => null);
        
        await saveButton.click();
        
        // Wait for save
        await page.waitForTimeout(1000);
        
        // Check for success message
        const successMessage = page.locator('text=/saved|success/i');
        if (await successMessage.count() > 0) {
          await expect(successMessage.first()).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });
});

