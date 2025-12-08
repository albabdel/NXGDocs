# E2E Test Fixes Checklist

Use this checklist to track fixes as you work through the test failures.

## Step 1: Review Test Report
- [ ] Open test report at http://localhost:9323/
- [ ] List all failing tests
- [ ] Categorize failures:
  - [ ] Selector not found
  - [ ] Timeout errors
  - [ ] Assertion failures
  - [ ] Network errors
  - [ ] Other errors

## Step 2: Add Test IDs to Components

### CMSOverlay Component
- [ ] Add `data-testid="cms-toolbar"` to toolbar
- [ ] Add `data-testid="save-button"` to save button
- [ ] Add `data-testid="export-button"` to export button
- [ ] Add `data-testid="exit-edit-mode-button"` to exit button
- [ ] Add `data-testid="create-article-button"` to create article button
- [ ] Add `data-testid="edit-sidebar-button"` to edit sidebar button
- [ ] Add `data-testid="edit-article-button"` to floating edit button
- [ ] Add `data-testid="article-editor-modal"` to article editor modal
- [ ] Add `data-testid="new-article-modal"` to new article modal

### CMS Page Component
- [ ] Add `data-testid="hero-title-input"` to hero title input
- [ ] Add `data-testid="hero-subtitle-textarea"` to hero subtitle textarea
- [ ] Add `data-testid="add-card-button"` to all add card buttons
- [ ] Add `data-testid="edit-card-button"` to all edit card buttons
- [ ] Add `data-testid="delete-card-button"` to all delete card buttons
- [ ] Add `data-testid="card-drag-handle"` to all drag handles
- [ ] Add `data-testid="card-editor-modal"` to card editor modal
- [ ] Add `data-testid="section-heading-input"` to section heading inputs
- [ ] Add `data-testid="section-subtitle-input"` to section subtitle inputs

### Article Editor Component
- [ ] Add `data-testid="article-editor"` to editor container
- [ ] Add `data-testid="article-title-input"` to title input
- [ ] Add `data-testid="article-editor-toolbar"` to toolbar
- [ ] Add `data-testid="article-save-button"` to save button
- [ ] Add `data-testid="article-cancel-button"` to cancel button
- [ ] Add `data-testid="bold-button"` to bold button
- [ ] Add `data-testid="heading1-button"` to heading 1 button
- [ ] Add `data-testid="table-button"` to table button

### Sidebar Editor Component
- [ ] Add `data-testid="sidebar-editor-modal"` to sidebar editor modal
- [ ] Add `data-testid="sidebar-item"` to sidebar items
- [ ] Add `data-testid="sidebar-rename-button"` to rename buttons
- [ ] Add `data-testid="sidebar-delete-button"` to delete buttons
- [ ] Add `data-testid="sidebar-add-folder-button"` to add folder buttons
- [ ] Add `data-testid="sidebar-drag-handle"` to drag handles

## Step 3: Fix Test Selectors

### cms-landing-page.spec.ts
- [ ] Fix toolbar selector
- [ ] Fix save button selector
- [ ] Fix hero title input selector
- [ ] Fix hero subtitle textarea selector
- [ ] Fix add card button selector
- [ ] Fix edit card button selector
- [ ] Fix delete card button selector
- [ ] Fix card editor modal selector
- [ ] Fix toast notification selectors
- [ ] Fix export button selector

### cms-article-editing.spec.ts
- [ ] Fix edit article button selector
- [ ] Fix article editor modal selector
- [ ] Fix article title input selector
- [ ] Fix editor content selector
- [ ] Fix toolbar button selectors
- [ ] Fix save button selector
- [ ] Fix new article modal selector

### cms-sidebar-editing.spec.ts
- [ ] Fix edit sidebar button selector
- [ ] Fix sidebar editor modal selector
- [ ] Fix sidebar item selectors
- [ ] Fix rename button selector
- [ ] Fix delete button selector
- [ ] Fix add folder button selector
- [ ] Fix drag handle selector

### cms-integration.spec.ts
- [ ] Fix navigation selectors
- [ ] Fix edit mode persistence checks
- [ ] Fix search integration selectors
- [ ] Fix localStorage checks

### admin-server.spec.ts
- [ ] Verify API endpoints are correct
- [ ] Fix response assertions
- [ ] Add error handling

## Step 4: Fix Timing Issues

- [ ] Add wait conditions before interactions
- [ ] Increase timeouts for slow operations
- [ ] Wait for network idle after navigation
- [ ] Wait for modals to fully render
- [ ] Wait for editor initialization
- [ ] Wait for toast notifications
- [ ] Wait for drag operations to complete

## Step 5: Fix Specific Features

### Drag and Drop
- [ ] Verify drag handle selectors
- [ ] Implement proper drag simulation
- [ ] Add wait conditions after drag
- [ ] Verify reorder feedback

### Toast Notifications
- [ ] Fix toast selector
- [ ] Add wait conditions
- [ ] Verify toast appears/disappears

### Modals/Dialogs
- [ ] Fix modal overlay selector
- [ ] Fix close button selector
- [ ] Add wait conditions
- [ ] Fix dialog handlers

### Article Editor
- [ ] Wait for TipTap initialization
- [ ] Handle loading states
- [ ] Fix content loading
- [ ] Fix save functionality

## Step 6: Update Test Helpers

- [ ] Add waitForToast helper
- [ ] Add waitForModal helper
- [ ] Add waitForEditor helper
- [ ] Improve error messages
- [ ] Add retry logic

## Step 7: Verify All Tests Pass

- [ ] Run all tests: `npm run test:e2e`
- [ ] Check test report
- [ ] Fix any remaining failures
- [ ] Ensure tests pass consistently
- [ ] Run tests multiple times to check stability

## Step 8: Documentation

- [ ] Update test documentation
- [ ] Document any test limitations
- [ ] Add troubleshooting guide
- [ ] Update README with fixes

## Notes

Document any issues or decisions made during fixes:

```
[Add notes here]
```

