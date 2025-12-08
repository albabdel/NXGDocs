# Quick Fix Guide for E2E Test Failures

## Most Common Issues & Quick Fixes

### 1. Selector Not Found Errors

**Symptom**: `Error: locator.click(): Target closed` or `Timeout waiting for selector`

**Quick Fix**:
```typescript
// Instead of:
page.locator('text=Save Changes')

// Use:
page.locator('button:has-text("Save Changes")')
// Or better, add data-testid and use:
page.locator('[data-testid="save-button"]')
```

### 2. Toast Notification Not Found

**Symptom**: `Timeout waiting for text=Card added`

**Quick Fix**:
```typescript
// Instead of:
await page.waitForSelector('text=Card added')

// Use:
await page.waitForSelector('[role="alert"]', { timeout: 5000 })
// Or check for toast container:
await page.waitForSelector('.Toastify__toast', { timeout: 5000 })
```

### 3. Modal Not Appearing

**Symptom**: `Timeout waiting for modal`

**Quick Fix**:
```typescript
// Add wait for modal overlay:
await page.waitForSelector('[class*="modalOverlay"]', { timeout: 10000 })
// Or wait for specific modal content:
await page.waitForSelector('text=Edit Card', { timeout: 10000 })
```

### 4. Editor Not Ready

**Symptom**: `Cannot interact with editor`

**Quick Fix**:
```typescript
// Wait for editor to initialize:
await page.waitForSelector('[class*="editorContent"]', { timeout: 15000 })
// Wait a bit more for TipTap:
await page.waitForTimeout(1000)
```

### 5. Drag and Drop Not Working

**Symptom**: `Drag operation failed`

**Quick Fix**:
```typescript
// Use proper drag simulation:
const handle = page.locator('[class*="dragHandle"]').first()
const target = page.locator('[class*="dragHandle"]').nth(1)

await handle.hover()
await page.mouse.down()
await page.mouse.move(await target.boundingBox().then(b => b.x), await target.boundingBox().then(b => b.y), { steps: 10 })
await page.mouse.up()
```

### 6. Button Text Mismatch

**Symptom**: `Button not found with text="Save Changes"`

**Quick Fix**:
```typescript
// Use case-insensitive or partial matching:
page.locator('button').filter({ hasText: /save changes/i })
// Or use role:
page.locator('button[type="button"]').filter({ hasText: /save/i })
```

## Priority Fix Order

### Phase 1: Add Test IDs (Do This First!)
1. Add `data-testid` to CMSOverlay toolbar buttons
2. Add `data-testid` to CMS page inputs and buttons
3. Add `data-testid` to ArticleEditor elements
4. Add `data-testid` to SidebarEditor elements

### Phase 2: Fix Selectors
1. Update all test files to use data-testid where available
2. Fix toast notification selectors
3. Fix modal selectors
4. Fix button selectors

### Phase 3: Fix Timing
1. Add proper wait conditions
2. Increase timeouts
3. Wait for network idle

### Phase 4: Fix Features
1. Drag and drop
2. Article editor
3. Sidebar editor
4. Modals/dialogs

## Quick Reference: Common Selectors

### Toolbar
```typescript
// Current (may fail):
page.locator('text=Visual CMS - Edit Mode')

// Better:
page.locator('h2:has-text("Visual CMS")')
// Or with test-id:
page.locator('[data-testid="cms-toolbar"]')
```

### Save Button
```typescript
// Current:
page.locator('button:has-text("Save Changes")')

// Better:
page.locator('button').filter({ hasText: /save/i })
// Or with test-id:
page.locator('[data-testid="save-button"]')
```

### Toast Notifications
```typescript
// Current:
page.locator('text=Card added')

// Better:
page.locator('.Toastify__toast').filter({ hasText: /card added/i })
// Or:
page.locator('[role="alert"]').filter({ hasText: /card added/i })
```

### Modals
```typescript
// Current:
page.locator('[class*="modalOverlay"]')

// Better:
page.locator('[class*="modalOverlay"]').first()
// Or with test-id:
page.locator('[data-testid="modal-overlay"]')
```

## Test ID Locations to Add

### CMSOverlay/index.tsx
```tsx
<div className={cmsStyles.cmsToolbar} data-testid="cms-toolbar">
  <button data-testid="save-button">Save Changes</button>
  <button data-testid="export-button">Export Config</button>
  <button data-testid="exit-edit-mode-button">Exit Edit Mode</button>
  <button data-testid="create-article-button">Create New Article</button>
  <button data-testid="edit-sidebar-button">Edit Sidebar</button>
</div>
```

### cms.tsx
```tsx
<input data-testid="hero-title-input" placeholder="Hero Title" />
<textarea data-testid="hero-subtitle-textarea" placeholder="Hero Subtitle" />
<button data-testid="add-card-button">Add Card</button>
<button data-testid="edit-card-button" title="Edit Card">...</button>
<button data-testid="delete-card-button" title="Delete Card">...</button>
```

### ArticleEditor/index.tsx
```tsx
<div data-testid="article-editor">
  <input data-testid="article-title-input" />
  <div data-testid="article-editor-toolbar">...</div>
  <button data-testid="article-save-button">Save</button>
</div>
```

## Next Steps

1. **Review your test report** - Note which tests failed and why
2. **Start with Phase 1** - Add test IDs to components
3. **Update test files** - Use the new test IDs
4. **Run tests again** - See improvement
5. **Iterate** - Fix remaining issues

## Getting Help

If you're stuck:
1. Check the test report for specific error messages
2. Run tests in headed mode: `npm run test:e2e:headed`
3. Use debug mode: `npm run test:e2e:debug`
4. Check browser console for errors
5. Review the detailed plan in `TEST_FIXES_PLAN.md`

