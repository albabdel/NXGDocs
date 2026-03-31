# Roadmap: v3.0 Design System Polish

## Milestone Goal

Transform the NXGEN docs site from a patchwork of inline styles and `!important` hacks into a maintainable, token-driven design system. Components should be theme-agnostic, CSS should be predictable, and adding new variants should require zero CSS hunting.

## Why This Matters

**Current Pain Points:**
- 959 `isDark` conditional branches in components — styles in JS, not CSS
- 350+ `!important` declarations fighting Docusaurus base styles
- 3,906-line `custom.css` with no discoverable structure
- No consistent component variant API
- Missing Dialog/Modal primitive

**Target State:**
- CSS tokens resolve themes automatically — no JS branching
- CSS `@layer` handles cascade cleanly — no `!important` wars
- Split CSS files — `sidebar.css` for sidebar, not hunting through 4k lines
- `<Button variant="ghost">` — type-safe component APIs
- `<Dialog>` — accessible modal primitive

---

## Phases

### Phase 24: CSS Architecture (Foundation)
**Goal**: Stop the `!important` wars. Make the cascade predictable.
**Depends on**: Phase 23 (v2.0 complete)
**Requirements**: CSS-01, CSS-02, CSS-03, CSS-04
**Success Criteria** (what must be TRUE):
  1. CSS `@layer` declarations exist at the top of `custom.css` — Docusaurus base styles automatically lose to layered overrides
  2. `style-override.css` is deleted — no longer needed after layers
  3. `custom.css` is an entry point with `@import` statements only — no styles in the file
  4. CSS is split into ~6-8 focused files: `tokens.css`, `typography.css`, `components/cards.css`, `components/buttons.css`, etc.
  5. Dark mode still works after split — `[data-theme='dark']` overrides function correctly
**Plans**: 2 plans

### Phase 25: Component Tokens — Kill `isDark`
**Goal**: Replace all `style={{ ... isDark ? x : y }}` patterns with CSS tokens.
**Depends on**: Phase 24
**Requirements**: TOKN-01, TOKN-02, TOKN-03, TOKN-04, TOKN-05
**Success Criteria** (what must be TRUE):
  1. `FeatureCard` component uses CSS tokens instead of inline style branches
  2. All `DocsIndex/*` components use CSS tokens instead of `useColorMode` + inline styles
  3. `ZohoTickets/*` components use CSS tokens for theme-aware styles
  4. `useColorMode` imports are removed from components that no longer need them
  5. CSS tokens exist for: glass-bg, glass-border, glass-shadow-inset, icon-bg, and all other values currently branched in JS
**Plans**: 3 plans

### Phase 26: Component Variant System
**Goal**: Consistent, type-safe component APIs. No more hunting for button styles.
**Depends on**: Phase 25
**Requirements**: CVA-01, CVA-02, CVA-03, CVA-04, CVA-05
**Success Criteria** (what must be TRUE):
  1. `class-variance-authority` is installed and configured
  2. `src/components/ui/` directory exists with primitives
  3. `Button` component has 4 variants: primary, secondary, ghost, destructive — each with sm/md/lg sizes
  4. `Dialog` component exists using `@radix-ui/react-dialog` — accessible, keyboard-navigable
  5. `Card` component exists using glass tokens — replaces inline styles in feature cards
  6. Existing ad-hoc button styles are migrated to new primitives
**Plans**: 3 plans

### Phase 27: UI Polish — Premium Details
**Goal**: Elevate visual quality using what's already in the codebase.
**Depends on**: Phase 26
**Requirements**: PLSH-01, PLSH-02, PLSH-03, PLSH-04, PLSH-05
**Success Criteria** (what must be TRUE):
  1. Shadow tokens use layered system (ambient + direct) — depth looks natural
  2. `:focus-visible` global styles exist — keyboard navigation is visible
  3. `prefers-reduced-motion` media query exists — respects user preferences
  4. Hover states on cards/buttons include subtle transforms and shadow changes
  5. Featured content blocks have accent top borders
**Plans**: 2 plans

### Phase 28: Modern CSS (Opportunistic)
**Goal**: Adopt browser-native features that reduce complexity.
**Depends on**: Phase 27
**Requirements**: MOD-01, MOD-02, MOD-03
**Success Criteria** (what must be TRUE):
  1. `light-dark()` function is used for theme tokens where applicable
  2. Container queries are available for responsive components
  3. CSS nesting is used in new component CSS
**Plans**: 1 plan

---

## Dependencies Required

| Package | Size | Phase | Why |
|---------|------|-------|-----|
| `class-variance-authority` | ~2kb | 26 | Component variant system |
| `@radix-ui/react-dialog` | ~3kb | 26 | Accessible modal/dialog primitive |

Everything else is already installed.

---

## What NOT to Do

| Idea | Why to Skip |
|------|-------------|
| Migrate to OKLCH | Current HEX tokens work fine. OKLCH adds complexity with marginal benefit. |
| Remove Framer Motion | It's already bundled. No real gain. |
| Add Storybook | Overkill for a docs site. |
| Batch migrate all components | This is how migrations die. Migrate incrementally. |
| Replace react-toastify | It's already there and working. |
| 12-step OKLCH scales | Tailwind already has 9-shade primary/secondary. Good enough. |

---

## Execution Order

```
Phase 24 (CSS layers + split)     → unblocks everything, low breakage risk
Phase 25 (Kill isDark)            → biggest maintenance win, do alongside Phase 24
Phase 26 (CVA + Dialog)           → do when building next component that needs variants
Phase 27 (Polish details)         → can be done incrementally, any time
Phase 28 (Modern CSS)             → apply as you go, not as a sprint
```

Phases 24+25 are the highest ROI and should be done together. They directly address the root causes of maintenance friction. Phases 26-28 improve velocity and UI quality progressively.

---

## Requirements Index

### Phase 24: CSS Architecture
- **CSS-01**: Add `@layer` declarations to `custom.css`
- **CSS-02**: Delete `style-override.css` after layers are verified
- **CSS-03**: Split `custom.css` into focused files
- **CSS-04**: Verify dark mode still works after split

### Phase 25: Component Tokens
- **TOKN-01**: Audit all components for `isDark` / inline style branches
- **TOKN-02**: Add CSS tokens for each branched value
- **TOKN-03**: Migrate `FeatureCard` as template
- **TOKN-04**: Migrate `ZohoTickets` components
- **TOKN-05**: Remove unnecessary `useColorMode` imports

### Phase 26: Variant System
- **CVA-01**: Install `class-variance-authority`
- **CVA-02**: Create `src/components/ui/` directory
- **CVA-03**: Build `Button` with 4 variants
- **CVA-04**: Build `Dialog` using Radix
- **CVA-05**: Build `Card` using glass tokens

### Phase 27: UI Polish
- **PLSH-01**: Upgrade shadow tokens to layered system
- **PLSH-02**: Add `:focus-visible` global styles
- **PLSH-03**: Add `prefers-reduced-motion` support
- **PLSH-04**: Improve hover states on cards/buttons
- **PLSH-05**: Add accent borders to featured content

### Phase 28: Modern CSS
- **MOD-01**: Use `light-dark()` for theme tokens
- **MOD-02**: Add container queries support
- **MOD-03**: Use CSS nesting in new component CSS

---

*Created: 2026-04-01*
*Based on: DESIGN_SYSTEM_ANALYSIS_AND_IMPLEMENTATION_PLAN.md*
