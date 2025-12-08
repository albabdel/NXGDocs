import { test, expect } from '@playwright/test';

test.describe('CMS Sidebar Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to CMS page to enable edit mode
    await page.goto('/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="cms-toolbar"]', { timeout: 10000 });
  });

  test('should open sidebar editor modal', async ({ page }) => {
    // Click "Edit Sidebar" button in toolbar using test ID
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await expect(editSidebarButton).toBeVisible();
    await editSidebarButton.click();
    
    // Wait for sidebar editor modal using test ID
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Verify modal is visible
    const modal = page.locator('[data-testid="sidebar-editor-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should display sidebar items in editor', async ({ page }) => {
    // Open sidebar editor
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await editSidebarButton.click();
    
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Check for sidebar items using test ID pattern
    const sidebarItems = page.locator('[data-testid^="sidebar-item-"]');
    const itemCount = await sidebarItems.count();
    
    // Should have at least some items
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should rename a sidebar item', async ({ page }) => {
    // Open sidebar editor
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await editSidebarButton.click();
    
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Find a sidebar item with rename button using test ID
    const sidebarItems = page.locator('[data-testid^="sidebar-item-"]');
    const itemCount = await sidebarItems.count();
    
    if (itemCount > 0) {
      // Get first item's ID
      const firstItem = sidebarItems.first();
      const itemId = await firstItem.getAttribute('data-testid');
      if (itemId) {
        const itemIdValue = itemId.replace('sidebar-item-', '');
        const renameButton = page.locator(`[data-testid="sidebar-rename-button-${itemIdValue}"]`);
        
        if (await renameButton.isVisible()) {
          // Set up dialog handler before clicking
          page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('prompt');
            await dialog.accept('Renamed Item');
          });
          
          await renameButton.click();
          
          // Wait for success toast
          await page.waitForSelector('.Toastify__toast', { timeout: 5000 });
          const toast = page.locator('.Toastify__toast').filter({ hasText: /Renamed/i });
          await expect(toast).toBeVisible();
        }
      }
    }
  });

  test('should delete a sidebar item', async ({ page }) => {
    // Open sidebar editor
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await editSidebarButton.click();
    
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Find delete buttons using test ID
    const sidebarItems = page.locator('[data-testid^="sidebar-item-"]');
    const itemCount = await sidebarItems.count();
    
    if (itemCount > 0) {
      const firstItem = sidebarItems.first();
      const itemId = await firstItem.getAttribute('data-testid');
      if (itemId) {
        const itemIdValue = itemId.replace('sidebar-item-', '');
        const deleteButton = page.locator(`[data-testid="sidebar-delete-button-${itemIdValue}"]`);
        
        if (await deleteButton.isVisible()) {
          // Set up dialog handler before clicking
          page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            await dialog.accept();
          });
          
          await deleteButton.click();
          
          // Wait for success toast
          await page.waitForSelector('.Toastify__toast', { timeout: 5000 });
          const toast = page.locator('.Toastify__toast').filter({ hasText: /Deleted/i });
          await expect(toast).toBeVisible();
        }
      }
    }
  });

  test('should add a new folder to sidebar', async ({ page }) => {
    // Open sidebar editor
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await editSidebarButton.click();
    
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Find sidebar items that can have children (categories)
    const sidebarItems = page.locator('[data-testid^="sidebar-item-"]');
    const itemCount = await sidebarItems.count();
    
    if (itemCount > 0) {
      // Try to find an item with add menu button
      for (let i = 0; i < itemCount; i++) {
        const item = sidebarItems.nth(i);
        const itemId = await item.getAttribute('data-testid');
        if (itemId) {
          const itemIdValue = itemId.replace('sidebar-item-', '');
          const addMenuButton = page.locator(`[data-testid="sidebar-add-menu-button-${itemIdValue}"]`);
          
          if (await addMenuButton.isVisible()) {
            await addMenuButton.click();
            
            // Wait for dropdown
            await page.waitForSelector(`[data-testid="sidebar-add-menu-dropdown-${itemIdValue}"]`, { timeout: 2000 });
            
            // Click add folder button
            const addFolderButton = page.locator(`[data-testid="sidebar-add-folder-button-${itemIdValue}"]`);
            if (await addFolderButton.isVisible()) {
              // Set up dialog handler
              page.once('dialog', async dialog => {
                expect(dialog.type()).toBe('prompt');
                await dialog.accept('Test Folder');
              });
              
              await addFolderButton.click();
              
              // Wait for success indication
              await page.waitForTimeout(1000);
              break;
            }
          }
        }
      }
    }
  });

  test('should reorder sidebar items by dragging', async ({ page }) => {
    // Open sidebar editor
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await editSidebarButton.click();
    
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Find drag handles using test ID pattern
    const dragHandles = page.locator('[data-testid^="sidebar-drag-handle-"]');
    const handleCount = await dragHandles.count();
    
    if (handleCount >= 2) {
      const firstHandle = dragHandles.first();
      const secondHandle = dragHandles.nth(1);
      
      // Get positions
      const firstBox = await firstHandle.boundingBox();
      const secondBox = await secondHandle.boundingBox();
      
      if (firstBox && secondBox) {
        // Drag first to second position
        await firstHandle.hover();
        await page.mouse.down();
        await page.mouse.move(secondBox.x, secondBox.y, { steps: 10 });
        await page.mouse.up();
        
        // Wait for reorder feedback
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should close sidebar editor modal', async ({ page }) => {
    // Open sidebar editor
    const editSidebarButton = page.locator('[data-testid="edit-sidebar-button"]');
    await editSidebarButton.click();
    
    await page.waitForSelector('[data-testid="sidebar-editor-modal"]', { timeout: 5000 });
    
    // Find close button using test ID
    const closeButton = page.locator('[data-testid="sidebar-editor-close-button"]');
    await closeButton.click();
    
    // Verify modal is closed
    const modal = page.locator('[data-testid="sidebar-editor-modal"]');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });
});
