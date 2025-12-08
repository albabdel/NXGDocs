# Sidebar CSS Classes Reference

## Key CSS Classes

### Collapsible Categories

```css
.menu__list-item-collapsible
```
- Applied to: Category items that can expand/collapse
- Behavior: Cursor pointer, contains chevron indicator

```css
.menu__list-item--collapsed
```
- Applied to: Collapsed category items
- Behavior: Hides child `.menu__list` elements

```css
.menu__link--sublist-caret::after
```
- Applied to: Chevron indicator
- Content: '›' character
- Rotation: 0deg (collapsed), 90deg (expanded)

### Hierarchy & Indentation

```css
.menu__list .menu__list
```
- First level nesting: `padding-left: 1rem`

```css
.menu__list .menu__list .menu__list
```
- Second level nesting: `padding-left: 2rem`

### Active States

```css
.menu__link--active
```
- Background: `rgba(231, 166, 63, 0.15)`
- Border-left: `3px solid #e7a63f`
- Color: `#d4941f`

### Hover States

```css
.menu__link:hover
```
- Light mode: `background: #f5f5f7`
- Dark mode: `background: #2c2c2e`

## Animation Classes

```css
.menu__list (transition)
```
- Property: `max-height, opacity`
- Duration: `0.2s`
- Easing: `ease-out`

## Category Landing Page Classes

```css
.featuresGrid
```
- Desktop: `grid-template-columns: repeat(2, 1fr)`
- Mobile: `grid-template-columns: 1fr`

```css
.featureCard
```
- Hover: `transform: translateY(-8px)`
- Border: Gold accent on hover

## Dark Theme Variants

All classes have `[data-theme="dark"]` variants:
- `.menu__link` → Different colors
- `.menu__list .menu__list` → Different border colors
- `.featureCard` → Different border colors

## Usage Examples

### Collapsed Category
```html
<li class="menu__list-item menu__list-item-collapsible menu__list-item--collapsed">
  <a class="menu__link menu__link--sublist-caret">Category Name</a>
  <ul class="menu__list" style="display: none;">
    <!-- Hidden items -->
  </ul>
</li>
```

### Expanded Category
```html
<li class="menu__list-item menu__list-item-collapsible">
  <a class="menu__link menu__link--sublist-caret">Category Name</a>
  <ul class="menu__list">
    <!-- Visible items -->
  </ul>
</li>
```

### Active Link
```html
<a class="menu__link menu__link--active" href="/docs/page">
  Page Title
</a>
```
