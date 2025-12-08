import { Page, expect } from '@playwright/test';

/**
 * Wait for CMS edit mode to be active
 */
export async function waitForEditMode(page: Page) {
  await page.goto('/cms');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Visual CMS - Edit Mode', { timeout: 10000 });
}

/**
 * Navigate to a doc page from the landing page
 */
export async function navigateToDocPage(page: Page): Promise<string | null> {
  const docLink = page.locator('a[href^="/docs/"]').first();
  
  if (await docLink.isVisible()) {
    const href = await docLink.getAttribute('href');
    if (href) {
      await docLink.click();
      await page.waitForLoadState('networkidle');
      return href;
    }
  }
  
  return null;
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, text: string, timeout = 5000) {
  await page.waitForSelector(`text=${text}`, { timeout });
}

/**
 * Handle browser dialogs (confirm/prompt)
 */
export function setupDialogHandler(page: Page, type: 'confirm' | 'prompt', response?: string) {
  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe(type);
    if (type === 'prompt' && response) {
      await dialog.accept(response);
    } else {
      await dialog.accept();
    }
  });
}

/**
 * Check if admin server is online
 */
export async function checkAdminServerOnline(page: Page): Promise<boolean> {
  try {
    const response = await page.request.get('http://localhost:3001/api/health');
    return response.status() === 200;
  } catch {
    return false;
  }
}

/**
 * Make a change to trigger dirty state
 */
export async function makeCMSChange(page: Page) {
  const heroTitleInput = page.locator('input[placeholder="Hero Title"]').first();
  if (await heroTitleInput.isVisible()) {
    await heroTitleInput.clear();
    await heroTitleInput.fill('Test Change ' + Date.now());
    await page.waitForTimeout(500); // Wait for state update
  }
}

/**
 * Wait for save to complete
 */
export async function waitForSave(page: Page) {
  // Wait for either success or error message
  await page.waitForSelector(
    'text=Changes saved, text=Cannot connect, text=Failed, text=Saved',
    { timeout: 10000 }
  );
  
  // Wait a bit more for UI to update
  await page.waitForTimeout(1000);
}

