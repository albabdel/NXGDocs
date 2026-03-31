# NXGEN Design System — Revised Implementation Plan

> Revised March 2026 based on actual codebase audit. The original plan over-scoped and missed what's already working.

---

## What's Already Good (Don't Touch)

- **Token system** — `custom.css` already has semantic tokens: `--card-bg`, `--text-primary`, `--gold-text`, spacing scale, shadow scale, typography scale. This is the right foundation.
- **Tailwind + CSS variables dual system** — Tailwind for utilities, CSS vars for theming. Keep both.
- **Dark mode** — `[data-theme='dark']` overrides are working. Don't change the mechanism.
- **Typography** — Inter + JetBrains Mono, Apple-inspired scale, already solid.
- **Dependencies already installed** — `lucide-react`, `framer-motion`, `react-toastify`, `clsx`, `@tailwindcss/forms`, `@tailwindcss/typography`. No need to add alternatives.
- **Tailwind color scales** — `primary` (9 shades) and `secondary` (9 shades) already exist in `tailwind.config.js`.

---

## The Real Problems (Ranked by Pain)

### 1. Inline styles with `isDark` checks (Highest priority)
Components like `FeatureCard` use JavaScript objects that read `colorMode` and branch on `isDark`. This is the root cause of theming friction — styles live in JS instead of CSS, so tokens can't do their job.

```tsx
// Current: fragile, hard to maintain
style={{ background: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.72)' }}

// Target: token-driven, theme-aware by default
className="feature-card"
// .feature-card { background: var(--card-bg); }
```

### 2. 350+ `!important` declarations
`custom.css` has 328, `style-override.css` has 22. These exist because Docusaurus has high-specificity base styles, and the current fix is to out-specificity them. **The actual fix is CSS `@layer`** — anything in a layer loses to unlayered styles, so you can override Docusaurus without `!important`.

### 3. 3,906-line `custom.css` with no structure
No way to know where to make a change. Dark mode overrides are scattered rather than grouped. The file has grown organically and needs to be split into purpose-driven files.

### 4. No component variant system
Buttons, cards, and badges have no consistent API. Adding a new "danger" button variant requires hunting through CSS and duplicating class logic. **CVA (class-variance-authority) solves this in ~10 lines.**

### 5. Missing: Dialog/Modal primitive
`react-toastify` covers toasts. Lucide covers icons. But there's no accessible Dialog/Modal — it would need to be built from scratch or use Radix UI's `@radix-ui/react-dialog` (3kb gzipped).

---

## Implementation Plan

This is an **incremental** plan — not a rewrite sprint. Each phase delivers visible UI improvement and leaves the codebase in a better state than it found it. Phases can be done over days or weeks, in parallel with feature work.

---

### Phase 1: CSS Architecture (Foundation)
**Goal:** Stop the `!important` wars. Make the cascade predictable.
**Impact:** Immediately unblocks all future CSS work.

#### 1.1 Add CSS `@layer` to `custom.css`
```css
/* At the very top of custom.css */
@layer docusaurus, tokens, components, utilities, overrides;

/* Then wrap existing blocks */
@layer tokens {
  :root { /* all token definitions */ }
  [data-theme='dark'] { /* dark overrides */ }
}

@layer components {
  /* component-specific CSS currently mixed into the file */
}
```

Once layers are in place, `style-override.css` can be deleted — unlayered Docusaurus styles will lose to layered overrides automatically.

#### 1.2 Split `custom.css` into focused files
```
src/css/
├── tokens.css          # All :root variables (light + dark)
├── typography.css      # Font rules, heading sizes
├── components/
│   ├── cards.css
│   ├── buttons.css
│   ├── sidebar.css
│   ├── navbar.css
│   ├── tables.css
│   └── code-blocks.css
├── sphere-background.css  (already separate)
└── custom.css          # Entry point — @imports only, no styles
```

**Deliverables:**
- [ ] Add `@layer` declarations to `custom.css`
- [ ] Confirm `style-override.css` can be deleted after layers
- [ ] Split into ~6-8 focused files
- [ ] Verify dark mode still works after split

---

### Phase 2: Component Tokens — Kill `isDark`
**Goal:** Replace all `style={{ ... isDark ? x : y }}` patterns with CSS tokens.
**Impact:** Components become theme-agnostic. Easier to maintain.

#### 2.1 Add missing tokens to `tokens.css`
For every color/value currently being branched in JS, add a CSS variable pair:

```css
:root {
  /* Glassmorphism surfaces */
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-bg-subtle: rgba(255, 255, 255, 0.025); /* wrong in light - see below */
  --glass-border: rgba(232, 176, 88, 0.12);
  --glass-shadow-inset: inset 0 1px 0 rgba(232, 176, 88, 0.12), 0 2px 8px rgba(0,0,0,0.04);

  /* Icon container */
  --icon-bg: rgba(232, 176, 88, 0.10);
}

[data-theme='dark'] {
  --glass-bg: rgba(255, 255, 255, 0.025);
  --glass-border: rgba(255, 255, 255, 0.07);
  --glass-shadow-inset: inset 0 1px 0 rgba(232, 176, 88, 0.08);
  --icon-bg: rgba(232, 176, 88, 0.12);
}
```

#### 2.2 Update components to use tokens
Starting with `FeatureCard`, then `Admin`, then `ZohoTickets` components:
```tsx
// Remove isDark import and useColorMode hook
// Replace inline style objects with className + CSS tokens
<Link
  to={link}
  className="feature-card block p-6 rounded-xl border no-underline group"
>
```

```css
/* cards.css */
.feature-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(140%);
  border-color: var(--glass-border);
  box-shadow: var(--glass-shadow-inset);
  transition: all 0.25s ease;
}
```

**Deliverables:**
- [ ] Audit all components for `isDark` / inline style branches
- [ ] Add corresponding CSS tokens for each
- [ ] Migrate `FeatureCard` — use as template
- [ ] Migrate `ZohoTickets` components (highest active development)
- [ ] Remove `useColorMode` imports from components that no longer need them

---

### Phase 3: Component Variant System
**Goal:** Consistent, type-safe component APIs. No more hunting for button styles.
**Impact:** Faster feature development. Less CSS duplication.

#### 3.1 Install CVA
```bash
npm install class-variance-authority
```

#### 3.2 Build `ui/` component primitives
Only what's actually missing or inconsistent. Don't rebuild what works.

**Button** — Multiple variants exist but aren't systematized:
```tsx
// src/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx'; // already installed

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-[--ifm-color-primary] text-white hover:brightness-110',
        secondary: 'bg-[--glass-bg] border border-[--glass-border] text-[--text-primary] hover:bg-[--glass-bg-hover]',
        ghost: 'text-[--gold-text] hover:bg-[--gold-bg]',
        destructive: 'bg-[--color-danger] text-white hover:brightness-110',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export const Button = ({ variant, size, className, ...props }) => (
  <button className={clsx(buttonVariants({ variant, size }), className)} {...props} />
);
```

**Dialog/Modal** — Currently missing entirely. Add Radix:
```bash
npm install @radix-ui/react-dialog
```

```tsx
// src/components/ui/dialog.tsx
// Thin wrapper around Radix Dialog with NXGEN tokens
// ~50 lines. Accessible, keyboard-navigable out of the box.
```

**Card** — Systematize the glassmorphism card pattern:
```tsx
// src/components/ui/card.tsx
// Replaces inline styles in FeatureCard and similar
```

**Deliverables:**
- [ ] Install `class-variance-authority`
- [ ] Create `src/components/ui/` directory
- [ ] Build `Button` with 4 variants
- [ ] Install `@radix-ui/react-dialog` and build `Dialog` wrapper
- [ ] Build `Card` component using glass tokens
- [ ] Migrate existing uses of ad-hoc buttons/modals to new primitives

---

### Phase 4: UI Polish — Premium Details
**Goal:** Elevate visual quality using what's already in the codebase.
**Impact:** Noticeably better-looking UI without new dependencies.

#### 4.1 Layered shadows
Current shadows are single-layer. Upgrade to ambient + direct:
```css
/* tokens.css */
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03);
  --shadow-gold: 0 4px 16px rgba(200,148,70,0.20), 0 1px 3px rgba(200,148,70,0.10);
}
[data-theme='dark'] {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.30), 0 1px 3px rgba(0,0,0,0.40);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.30);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.50), 0 4px 6px rgba(0,0,0,0.35);
  --shadow-gold: 0 4px 16px rgba(200,148,70,0.15), 0 1px 3px rgba(200,148,70,0.08);
}
```

#### 4.2 Focus states & accessibility
```css
/* In tokens.css / base layer */
:focus-visible {
  outline: 2px solid var(--ifm-color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 4.3 Accent borders
For cards and info blocks that look flat, add a top accent line:
```css
.card-featured {
  border-top: 2px solid var(--ifm-color-primary);
}
```

#### 4.4 Hover interaction improvements
Currently hover states are often just color changes. Upgrade to contrast-increasing interactions:
```css
.feature-card:hover {
  box-shadow: var(--shadow-gold);
  border-color: var(--glass-border-hover);
  transform: translateY(-2px);
}
```

**Deliverables:**
- [ ] Upgrade shadow tokens to layered system
- [ ] Add `:focus-visible` global styles
- [ ] Add `prefers-reduced-motion` support
- [ ] Audit and improve hover states on cards/buttons
- [ ] Add accent borders to featured content blocks

---

### Phase 5: Modern CSS (Opportunistic)
**Goal:** Adopt browser-native features that reduce complexity.
**Apply:** When touching a component for another reason — not as standalone work.

#### `light-dark()` — Simplify theme tokens
```css
/* Instead of :root + [data-theme='dark'] override pairs */
:root {
  color-scheme: light dark;
  --glass-bg: light-dark(rgba(255,255,255,0.72), rgba(255,255,255,0.025));
  --glass-border: light-dark(rgba(232,176,88,0.12), rgba(255,255,255,0.07));
}
```
Browser support: 93%+ (Chrome 123+, Firefox 120+, Safari 17.5+). Safe for a docs site.

#### Container queries — When rebuilding a component
```css
.card-container { container-type: inline-size; }
@container (width > 480px) {
  .card { grid-template-columns: auto 1fr; }
}
```

#### CSS nesting — When writing new component CSS
```css
.feature-card {
  background: var(--glass-bg);

  &:hover {
    box-shadow: var(--shadow-gold);
    transform: translateY(-2px);
  }

  & .card-icon {
    background: var(--icon-bg);
  }
}
```

---

## What NOT to Do

| Idea | Why to Skip |
|------|-------------|
| Migrate to OKLCH | Current HEX tokens work fine. OKLCH adds complexity with marginal benefit for this codebase. |
| Remove Framer Motion | It's already bundled. Partial removal creates maintenance overhead with no real gain. |
| Add Storybook | Valuable at team scale. Overkill for a docs site right now. |
| Batch migrate all components in Phase 5 | This is how migrations die. Migrate opportunistically instead. |
| Replace react-toastify | It's already there and working. |
| 12-step OKLCH scales | Tailwind already has 9-shade primary/secondary. Good enough. |

---

## New Dependencies Required

| Package | Size | Why |
|---------|------|-----|
| `class-variance-authority` | ~2kb | Component variant system |
| `@radix-ui/react-dialog` | ~3kb | Accessible modal/dialog primitive |

Everything else is already installed.

---

## Execution Order

```
Phase 1 (CSS layers + split)     → unblocks everything, low breakage risk
Phase 2 (Kill isDark)            → biggest maintenance win, do alongside Phase 1
Phase 3 (CVA + Dialog)           → do when building next component that needs variants
Phase 4 (Polish details)         → can be done incrementally, any time
Phase 5 (Modern CSS)             → apply as you go, not as a sprint
```

Phases 1+2 are the highest ROI and should be done together. They directly address the root causes of maintenance friction. Phases 3-5 improve velocity and UI quality progressively.

---

## Success Looks Like

| Before | After |
|--------|-------|
| `isDark ? 'rgba(...)' : 'rgba(...)'` in every component | CSS token resolves automatically |
| Hunt through 3,906 lines to find sidebar styles | Open `sidebar.css` |
| Add `!important` to override Docusaurus | CSS `@layer` handles cascade cleanly |
| Copy-paste button styles for each new variant | `<Button variant="ghost">` |
| No accessible dialog primitive | `<Dialog>` backed by Radix |
| Single-layer shadows look flat | Layered shadows add depth |

---

*Revised: March 2026*
*Based on: codebase audit of actual CSS, component patterns, and installed dependencies*
