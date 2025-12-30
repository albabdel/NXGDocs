# NXGEN GCXONE Documentation - Style Guide

**Version:** 1.0  
**Last Updated:** 2025-12-28  
**Purpose:** Comprehensive design system and styling guidelines for NXGEN GCXONE documentation

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Responsive Design](#responsive-design)
7. [Dark Mode](#dark-mode)
8. [Accessibility](#accessibility)

---

## Design Principles

### Core Values
1. **Clarity First** - Make information easy to find and understand
2. **Consistency** - Use established patterns throughout
3. **Professionalism** - Maintain premium, trustworthy appearance
4. **Accessibility** - Ensure usability for all users
5. **Progressive Disclosure** - Show complexity only when needed

### Visual Identity
- **Brand Color:** NXGEN Gold (#C89446 / #E8B058)
- **Aesthetic:** Clean, modern, premium
- **Influence:** Apple Design System principles
- **Theme:** Professional B2B SaaS documentation

---

## Color System

### Primary Colors

#### NXGEN Gold (Brand Color)
```css
--ifm-color-primary: #C89446;      /* Primary gold */
--ifm-color-primary-dark: #B58237; /* Darker variant */
--ifm-color-primary-darker: #A37028;
--ifm-color-primary-darkest: #915E19;
--ifm-color-primary-light: #D4A574;  /* Lighter variant */
--ifm-color-primary-lighter: #E0B688;
--ifm-color-primary-lightest: #F0CDA5;
```

**Usage:**
- Primary actions (buttons, links)
- Accents and highlights
- Brand elements
- Interactive states (hover, active)

#### Tailwind Primary Scale
```css
primary-500: #E8B058  /* Main brand color */
primary-400: #fbbf24
primary-600: #D4A047
primary-700: #C09036
```

### Semantic Colors

#### Success
```css
--color-success: #22C55E;  /* Green */
```
**Usage:** Success messages, positive confirmations, completed states

#### Warning
```css
--color-warning: #F59E0B;  /* Amber/Orange */
```
**Usage:** Warnings, important notices, cautionary information

#### Error/Danger
```css
--color-danger: #EF4444;  /* Red */
```
**Usage:** Errors, destructive actions, critical alerts

#### Info
```css
--color-info: #3B82F6;  /* Blue */
```
**Usage:** Informational messages, tips, helpful context

### Neutral Colors

#### Light Mode
```css
--ifm-background-color: #f8f9fa;        /* Page background */
--ifm-background-surface-color: #ffffff; /* Card/surface background */
--ifm-color-content: #1a1a1a;           /* Primary text */
--ifm-color-content-secondary: #6b7280;  /* Secondary text */
--ifm-color-emphasis-100: #f3f4f6;      /* Subtle backgrounds */
--ifm-color-emphasis-200: #e5e7eb;      /* Borders, dividers */
--ifm-color-emphasis-300: #d1d5db;      /* Medium-light gray */
```

#### Dark Mode
```css
--nxgen-dark-100: #0A0A0A;  /* Background */
--nxgen-dark-200: #121212;  /* Surface/card */
--nxgen-dark-300: #1A1A1A;  /* Elevated surface */
--nxgen-dark-400: #2A2A2A;  /* Borders */
--ifm-color-content: #FFFFFF;  /* Primary text */
--ifm-color-content-secondary: rgba(204, 204, 204, 0.9);  /* Secondary text */
```

### Glow Effects
```css
--nxgen-glow-sm: 0 0 10px rgba(200, 148, 70, 0.2);
--nxgen-glow-md: 0 0 20px rgba(200, 148, 70, 0.3);
--nxgen-glow-lg: 0 0 30px rgba(200, 148, 70, 0.4);
--nxgen-glow-xl: 0 0 40px rgba(200, 148, 70, 0.5);
```

**Usage:** Premium accents, hover effects, focused states

---

## Typography

### Font Families

#### Body Text
```css
--ifm-font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 
                        'SF Pro Text', 'Segoe UI', 'Helvetica Neue', sans-serif;
```
**Usage:** All body text, paragraphs, lists, general content

#### Monospace
```css
--ifm-font-family-monospace: 'JetBrains Mono', 'SF Mono', 'Monaco', 
                             'Consolas', 'Liberation Mono', 'Courier New', monospace;
```
**Usage:** Code blocks, inline code, technical examples

### Font Scale

Based on Apple's typography scale for optimal readability:

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 2.5rem (42px) | 800 | 1.15 | Page titles |
| H2 | 2rem (34px) | 700 | 1.3 | Section headings |
| H3 | 1.5rem (25px) | 600 | 1.4 | Subsection headings |
| H4 | 1.25rem (21px) | 600 | 1.4 | Minor headings |
| H5 | 1.125rem (19px) | 600 | 1.4 | Small headings |
| H6 | 1rem (17px) | 600 | 1.4 | Smallest headings |
| Body | 1.0625rem (17px) | 400 | 1.8 | Paragraph text |
| Code | 0.9em | 400 | 1.6 | Code blocks |

### Font Weights
- **300 (Light):** Rarely used
- **400 (Normal):** Body text, paragraphs
- **500 (Medium):** Emphasis, buttons
- **600 (Semibold):** Headings, labels
- **700 (Bold):** Strong emphasis, H2 headings
- **800 (Extra Bold):** H1 page titles

### Typography Best Practices

#### Headings
- Use H1 only once per page (the page title)
- Maintain proper heading hierarchy (H1 → H2 → H3)
- Don't skip heading levels
- Use descriptive, scannable headings

#### Body Text
- Keep paragraphs to 3-4 sentences
- Use line breaks for readability
- Break up long blocks with lists or examples
- Use emphasis (bold/italic) sparingly

#### Code
- Use inline code for: functions, variables, file names, commands
- Use code blocks for: multi-line examples, snippets
- Always specify language for syntax highlighting
- Include copy-to-clipboard functionality

---

## Spacing & Layout

### Spacing Scale (8pt Grid System)

Based on Apple's 8-point grid for consistency:

| Variable | Value | Usage |
|----------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight spacing, icons |
| `--space-2` | 0.5rem (8px) | Small gaps |
| `--space-3` | 0.75rem (12px) | Default spacing |
| `--space-4` | 1rem (16px) | Standard spacing |
| `--space-6` | 1.5rem (24px) | Medium spacing |
| `--space-8` | 2rem (32px) | Large spacing |
| `--space-12` | 3rem (48px) | Section spacing |
| `--space-16` | 4rem (64px) | Major section spacing |

### Component Spacing

```css
--ifm-spacing-horizontal: 1.5rem;    /* Horizontal padding */
--ifm-navbar-height: 72px;           /* Navbar height */
--ifm-sidebar-width: 300px;          /* Sidebar width */
```

### Border Radius

```css
--ifm-border-radius: 12px;           /* Standard radius */
--ifm-card-border-radius: 16px;      /* Card radius */
--ifm-button-border-radius: 22px;    /* Button radius (pill) */
```

### Shadows

```css
--ifm-global-shadow-lw: 0 1px 3px rgba(0, 0, 0, 0.12), 
                        0 1px 2px rgba(0, 0, 0, 0.24);  /* Light shadow */
--ifm-global-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 
                        0 2px 4px rgba(0, 0, 0, 0.06);  /* Medium shadow */
--ifm-global-shadow-tl: 0 10px 15px rgba(0, 0, 0, 0.1), 
                        0 4px 6px rgba(0, 0, 0, 0.05);  /* Top-level shadow */
```

**Usage:**
- Light: Subtle elevation, hover states
- Medium: Cards, dropdowns
- Top-level: Modals, dialogs, important cards

---

## Component Library

### Standard Components

All components follow these principles:
- Consistent spacing and sizing
- Dark mode support
- Accessibility (WCAG 2.1 AA)
- Responsive design
- TypeScript types

#### Available Components

1. **Callout** - Info, warning, tip, error boxes
2. **CodeBlock** - Enhanced code blocks with copy button
3. **Tabs** - Tabbed content organization
4. **Steps** - Step-by-step instructions
5. **Collapsible** - Progressive disclosure sections
6. **RelatedArticles** - Content discovery widget
7. **VideoEmbed** - Video player with transcripts
8. **Badge** - Status indicators and labels

### Component Usage Guidelines

#### Callout Component
```mdx
<Callout type="info" title="Optional Title">
  Informational content here
</Callout>
```

**Types:** `info`, `success`, `warning`, `error`

**Best Practices:**
- Use sparingly to avoid visual noise
- Keep content concise (2-3 sentences)
- Use titles for important callouts
- Use appropriate type for the message level

#### CodeBlock Component
```mdx
<CodeBlock language="typescript" title="example.ts" showLineNumbers copyButton>
  // Your code here
</CodeBlock>
```

**Features:**
- Syntax highlighting
- Copy to clipboard
- Line numbers (optional)
- Title/filename display

#### Tabs Component
```mdx
<Tabs defaultValue="option1">
  <TabItem value="option1" label="Option 1">
    Content for option 1
  </TabItem>
  <TabItem value="option2" label="Option 2">
    Content for option 2
  </TabItem>
</Tabs>
```

**Best Practices:**
- Use for 2-4 related options
- Keep tab labels short (1-2 words)
- Ensure all tab content is relevant

#### Steps Component
```mdx
<Steps>
  <Step title="Step 1: Title">
    Step content and instructions
  </Step>
  <Step title="Step 2: Title">
    Next step content
  </Step>
</Steps>
```

**Best Practices:**
- Use for sequential processes
- Keep steps focused and actionable
- Number steps clearly
- Include verification steps

#### Collapsible Component
```mdx
<Collapsible title="Click to expand" defaultOpen={false}>
  Hidden content here
</Collapsible>
```

**Best Practices:**
- Use for optional or advanced content
- Keep titles descriptive
- Use for progressive disclosure
- Don't hide critical information

### Component Styling Guidelines

#### Buttons
- Use primary color for primary actions
- Use secondary/gray for secondary actions
- Maintain minimum touch target: 44x44px
- Use pill-shaped border radius (22px)
- Include hover and active states

#### Cards
- Use card background color
- Apply card border radius (16px)
- Include subtle shadow for elevation
- Maintain consistent padding (1.5rem)

#### Links
- Use primary color
- Include hover states (underline or color change)
- Maintain 4.5:1 contrast ratio
- Use clear link text (not "click here")

---

## Responsive Design

### Breakpoints

```css
--breakpoint-mobile: 480px;   /* Mobile devices */
--breakpoint-tablet: 768px;   /* Tablets */
--breakpoint-desktop: 996px;  /* Desktop */
```

### Mobile-First Approach

1. Design for mobile first (320px+)
2. Scale up to tablet (768px+)
3. Optimize for desktop (996px+)
4. Consider large screens (1440px+)

### Responsive Guidelines

#### Typography
- Reduce font sizes on mobile (scale down by ~15%)
- Maintain readable line heights
- Ensure touch targets are 44x44px minimum

#### Layout
- Stack vertically on mobile
- Use single column layouts
- Expand to multi-column on desktop
- Maintain consistent spacing

#### Components
- Full-width components on mobile
- Constrained widths on desktop
- Collapsible navigation on mobile
- Persistent sidebar on desktop

---

## Dark Mode

### Design Principles

1. **Consistency** - Same information hierarchy in both modes
2. **Readability** - Maintain contrast ratios
3. **Comfort** - Reduce eye strain for dark environments
4. **Brand Identity** - Preserve gold accents

### Color Mappings

| Light Mode | Dark Mode | Usage |
|------------|-----------|-------|
| #f8f9fa | #0A0A0A | Background |
| #ffffff | #121212 | Cards/Surfaces |
| #1a1a1a | #FFFFFF | Primary text |
| #6b7280 | rgba(204,204,204,0.9) | Secondary text |
| #e5e7eb | rgba(200,148,70,0.15) | Borders |

### Dark Mode Best Practices

- Test all components in both modes
- Ensure code blocks are readable
- Maintain gold accent visibility
- Use subtle borders (not harsh lines)
- Avoid pure white backgrounds
- Use appropriate opacity for overlays

---

## Accessibility

### WCAG 2.1 AA Compliance

All components and content must meet WCAG 2.1 AA standards:

#### Color Contrast
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18pt+):** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio
- **Interactive elements:** Clear focus indicators

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Logical tab order
- Visible focus indicators
- Skip links for main content

#### Screen Readers
- Semantic HTML structure
- ARIA labels where needed
- Alt text for images
- Descriptive link text

#### Visual Accessibility
- Don't rely solely on color to convey information
- Use icons + text
- Provide text alternatives
- Support text scaling up to 200%

### Accessibility Checklist

Before publishing content:
- [ ] All images have alt text
- [ ] All links are descriptive
- [ ] Color contrast meets standards
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Content structure is logical
- [ ] Text is readable at 200% zoom

---

## Usage Examples

### Creating a Page

```mdx
---
title: "Page Title"
description: "Brief description for SEO and previews"
tags:
  - category:tutorial
  - difficulty:beginner
---

import Callout from '@site/src/components/Callout';
import Steps, { Step } from '@site/src/components/Steps';

# Page Title

<Callout type="info" title="What you'll learn">
Brief overview of page content.
</Callout>

## Section Heading

Content here...

<Steps>
  <Step title="Step 1">
    Instructions
  </Step>
</Steps>
```

### Color Usage

```css
/* Primary action */
.button-primary {
  background-color: var(--ifm-color-primary);
  color: white;
}

/* Error state */
.error-message {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

/* Subtle background */
.section-background {
  background-color: var(--ifm-color-emphasis-100);
}
```

---

## Resources

- [Design System Source](../../classic/src/css/custom.css)
- [Component Library](../../classic/src/components/)
- [Component Usage Guide](../../classic/src/components/COMPONENT_USAGE_GUIDE.md)
- [Templates Directory](../TEMPLATES/)

---

## Questions or Updates?

This is a living document. For questions or updates:
- Check component documentation
- Review existing implementations
- Contact Claude Code (Central Coordinator)
- Update this guide as patterns evolve

---

**Last Updated:** 2025-12-28  
**Maintained By:** Claude Code (Central Coordinator)
