# E2E Test Fixes Plan

## Overview
This document outlines the issues found in E2E tests and the plan to fix them.

## Common Issues to Fix

### 1. Selector Issues
**Problem**: Tests may fail because selectors don't match actual DOM structure.

**Fixes Needed**:
- [ ] Update selectors to match actual CSS classes (e.g., `cmsToolbar`, `toolbarButton`)
- [ ] Use more robust selectors (data attributes, role-based)
- [ ] Add data-testid attributes to key elements for reliable testing

**Priority**: HIGH

### 2. Timing and Wait Issues
**Problem**: Tests may fail due to race conditions or elements not being ready.

**Fixes Needed**:
- [ ] Add proper wait conditions before interactions
- [ ] Increase timeouts for slow operations
- [ ] Wait for network idle after navigation
- [ ] Wait for modals/overlays to fully render

**Priority**: HIGH

### 3. Toast Notification Selectors
**Problem**: Toast notifications may use different selectors than expected.

**Fixes Needed**:
- [ ] Verify actual toast notification implementation
- [ ] Update selectors to match react-toastify structure
- [ ] Add wait conditions for toast appearance

**Priority**: MEDIUM

### 4. Drag and Drop Implementation
**Problem**: Drag and drop may need more specific implementation.

**Fixes Needed**:
- [ ] Verify drag handle selectors
- [ ] Implement proper drag simulation
- [ ] Add wait conditions after drag operations

**Priority**: MEDIUM

### 5. Modal/Dialog Handling
**Problem**: Modal and dialog interactions may need better handling.

**Fixes Needed**:
- [ ] Verify modal overlay selectors
- [ ] Improve dialog handler setup
- [ ] Add proper wait conditions for modal appearance

**Priority**: MEDIUM

### 6. Button Text Matching
**Problem**: Button text may vary or be case-sensitive.

**Fixes Needed**:
- [ ] Use more flexible text matching (contains, case-insensitive)
- [ ] Use role-based selectors where possible
- [ ] Add data-testid attributes

**Priority**: LOW

### 7. Article Editor Loading
**Problem**: Article editor may take time to load content.

**Fixes Needed**:
- [ ] Add wait conditions for editor initialization
- [ ] Handle loading states properly
- [ ] Wait for TipTap editor to be ready

**Priority**: MEDIUM

### 8. Sidebar Editor Selectors
**Problem**: Sidebar editor may use different structure.

**Fixes Needed**:
- [ ] Verify sidebar editor component structure
- [ ] Update selectors to match actual implementation
- [ ] Add proper wait conditions

**Priority**: MEDIUM

## Implementation Plan

### Phase 1: Add Test IDs (Critical)
**Goal**: Add data-testid attributes to key elements for reliable testing.

**Files to Modify**:
- `src/components/CMSOverlay/index.tsx`
- `src/pages/cms.tsx`
- `src/components/ArticleEditor/index.tsx`
- `src/components/SidebarEditor/index.tsx`

**Tasks**:
1. Add `data-testid` to toolbar buttons
2. Add `data-testid` to modal overlays
3. Add `data-testid` to form inputs
4. Add `data-testid` to card elements
5. Add `data-testid` to sidebar items

### Phase 2: Fix Selectors
**Goal**: Update test selectors to match actual implementation.

**Files to Modify**:
- All test files in `e2e/`

**Tasks**:
1. Replace text-based selectors with data-testid where possible
2. Update CSS class selectors to match actual classes
3. Use role-based selectors (button, input, etc.)
4. Add proper wait conditions

### Phase 3: Improve Timing
**Goal**: Fix timing issues and race conditions.

**Files to Modify**:
- All test files in `e2e/`
- `e2e/helpers.ts`

**Tasks**:
1. Add wait conditions before interactions
2. Increase timeouts for slow operations
3. Wait for network idle after navigation
4. Wait for animations to complete

### Phase 4: Fix Specific Features
**Goal**: Fix issues with specific features.

**Tasks**:
1. Fix drag and drop tests
2. Fix toast notification tests
3. Fix modal/dialog tests
4. Fix article editor tests
5. Fix sidebar editor tests

### Phase 5: Add Error Handling
**Goal**: Improve error handling and reporting.

**Tasks**:
1. Add better error messages
2. Add screenshots on failure
3. Add video recording for failed tests
4. Improve test reporting

## Detailed Fix List

### Critical Fixes (Do First)

1. **Add data-testid attributes**
   - Toolbar: `data-testid="cms-toolbar"`
   - Save button: `data-testid="save-button"`
   - Edit button: `data-testid="edit-card-button"`
   - Delete button: `data-testid="delete-card-button"`
   - Add card button: `data-testid="add-card-button"`
   - Export button: `data-testid="export-button"`
   - Exit button: `data-testid="exit-edit-mode-button"`

2. **Fix toast notification selectors**
   - Current: `text=Card added`
   - Should use: `[role="alert"]` or specific toast container

3. **Fix modal selectors**
   - Current: `[class*="modalOverlay"]`
   - Should use: `data-testid="modal-overlay"` or more specific selector

4. **Fix button text matching**
   - Use case-insensitive matching
   - Use partial text matching where appropriate

### Medium Priority Fixes

5. **Improve drag and drop**
   - Verify drag handle selectors
   - Add proper drag simulation
   - Wait for drag completion

6. **Fix article editor loading**
   - Wait for TipTap editor initialization
   - Handle loading states
   - Wait for content to load

7. **Fix sidebar editor**
   - Verify sidebar item selectors
   - Fix rename/delete button selectors
   - Add proper wait conditions

### Low Priority Fixes

8. **Improve test helpers**
   - Add more utility functions
   - Improve error handling
   - Add retry logic

9. **Add test data setup**
   - Create test fixtures
   - Add cleanup functions
   - Reset state between tests

## Testing Strategy

### Step 1: Run Tests and Document Failures
- Run all tests: `npm run test:e2e`
- Document each failure
- Categorize failures by type

### Step 2: Fix Critical Issues First
- Add data-testid attributes
- Fix selector issues
- Fix timing issues

### Step 3: Fix Feature-Specific Issues
- Fix drag and drop
- Fix modals/dialogs
- Fix article editor
- Fix sidebar editor

### Step 4: Verify All Tests Pass
- Run tests again
- Fix remaining issues
- Ensure all tests pass consistently

## Next Steps

1. **Review test report** at http://localhost:9323/
2. **Document specific failures** in this file
3. **Prioritize fixes** based on failure frequency
4. **Start with Phase 1** (Add Test IDs)
5. **Iterate** until all tests pass

## Notes

- Some tests may need to be skipped temporarily if features are not fully implemented
- Consider adding visual regression tests
- Add accessibility tests where applicable
- Consider adding performance tests

