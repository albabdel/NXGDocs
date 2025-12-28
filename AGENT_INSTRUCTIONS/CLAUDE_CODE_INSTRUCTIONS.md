# 🤖 Claude Code - Central Coordinator Instructions

**Role:** Architecture, Planning, and Infrastructure Lead
**Project:** NXGEN GCXONE Documentation Overhaul

---

## Your Mission

As the central coordinator, you are responsible for:
1. **Architecture & Infrastructure:** Design and implement the technical foundation
2. **Component Library:** Build reusable MDX/React components
3. **Quality Assurance:** Review all changes from other agents
4. **Integration:** Ensure all pieces work together seamlessly
5. **Coordination:** Manage handoffs between agents

---

## Phase 1 Tasks (Current - Week 1)

### 1. Research & Analysis ✅ IN PROGRESS
- [x] Launch research on Atlassian/Salesforce patterns
- [ ] Analyze research findings
- [ ] Create implementation roadmap
- [ ] Define technical requirements

### 2. Component Library Development
**Priority: HIGH**

Build these core MDX/React components:

#### A. Content Components
```tsx
// 1. Enhanced Code Block with Copy Button
<CodeBlock language="typescript" title="example.ts" showLineNumbers copyButton>
  // code here
</CodeBlock>

// 2. Tabbed Content
<Tabs>
  <TabItem value="tab1" label="Option 1">Content 1</TabItem>
  <TabItem value="tab2" label="Option 2">Content 2</TabItem>
</Tabs>

// 3. Callout Boxes
<Callout type="info|warning|tip|danger" title="Optional Title">
  Content here
</Callout>

// 4. Step-by-Step Guide
<Steps>
  <Step number={1} title="First Step">Instructions</Step>
  <Step number={2} title="Second Step">Instructions</Step>
</Steps>

// 5. Before/After Comparison
<BeforeAfter>
  <Before>Old way</Before>
  <After>New way</After>
</BeforeAfter>
```

#### B. Interactive Components
```tsx
// 6. Collapsible Section
<Collapsible title="Click to expand" defaultOpen={false}>
  Hidden content
</Collapsible>

// 7. Table of Contents (Auto-generated, Sticky)
<TableOfContents minHeadingLevel={2} maxHeadingLevel={4} />

// 8. Related Articles
<RelatedArticles articles={[
  { title: "Article 1", url: "/path", description: "..." },
  { title: "Article 2", url: "/path", description: "..." }
]} />

// 9. Feedback Widget
<FeedbackWidget articleId="platform-fundamentals" />

// 10. Video Player with Transcript
<VideoPlayer
  src="/videos/tutorial.mp4"
  transcript="/transcripts/tutorial.txt"
  chapters={chapters}
/>
```

#### C. Navigation Components
```tsx
// 11. Breadcrumb Trail (Enhanced)
<Breadcrumbs showHome showCurrent separator="/" />

// 12. Previous/Next Navigation
<PrevNext />

// 13. Quick Links Sidebar
<QuickLinks links={[
  { title: "Prerequisites", anchor: "#prerequisites" },
  { title: "Installation", anchor: "#installation" }
]} />
```

### 3. Theme Enhancements
**Priority: MEDIUM**

Enhance the current theme with:

#### A. Typography Improvements
```css
/* Implement better typography scale */
--font-heading: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'Cascadia Code', Consolas, monospace;

/* Line heights for better readability */
--line-height-tight: 1.2;
--line-height-normal: 1.6;
--line-height-relaxed: 1.8;
```

#### B. Spacing System
```css
/* Consistent spacing scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

#### C. Color Enhancements
```css
/* Extend color palette while preserving brand */
--color-primary: #E8B058; /* Keep brand color */
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-danger: #EF4444;
--color-info: #3B82F6;

/* Neutral grays */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
/* ... etc */
```

### 4. Advanced Docusaurus Features
**Priority: HIGH**

#### A. Enhanced Search
```typescript
// Configure Algolia with facets and filters
algolia: {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: 'nxgen_docs',

  // Add faceted search
  searchParameters: {
    facetFilters: [],
    facets: ['category', 'difficulty', 'role', 'platform'],
  },

  // Custom search page
  searchPagePath: 'search',

  // Contextual search
  contextualSearch: true,
}
```

#### B. Versioning Setup
```typescript
// Prepare for version management
docs: {
  versions: {
    current: {
      label: 'Current',
      path: '',
    },
  },
}
```

#### C. Analytics Integration
```typescript
// Add comprehensive analytics
gtag: {
  trackingID: 'G-XXXXXXXXXX',
  anonymizeIP: true,
},

// Add custom analytics for documentation-specific metrics
```

### 5. Documentation Templates
**Priority: HIGH**

Create these templates in `/TEMPLATES/`:

```markdown
// tutorial-template.mdx
---
title: "[Tutorial Name]"
description: "Learn how to [accomplish task]"
tags:
  - role:all
  - category:tutorial
  - difficulty:beginner
  - platform:GCXONE
duration: "15 minutes"
prerequisites:
  - "Basic understanding of X"
  - "Access to Y"
---

# [Tutorial Title]

<Callout type="info" title="What you'll learn">
In this tutorial, you'll learn how to:
- [ ] Accomplish task A
- [ ] Accomplish task B
- [ ] Accomplish task C
</Callout>

## Prerequisites

<Steps>
  <Step number={1}>
    Prerequisite 1
  </Step>
</Steps>

## Step-by-Step Instructions

...

## Next Steps

<RelatedArticles articles={[...]} />
```

---

## Integration Responsibilities

### 1. Review Process
When other agents complete work:
1. Review code/content for quality
2. Test integration with existing systems
3. Verify component compatibility
4. Check performance impact
5. Approve or request changes

### 2. Merge Protocol
```bash
# For each agent submission:
1. Create feature branch from main
2. Review changes thoroughly
3. Run tests and build
4. Check for conflicts
5. Merge to main
6. Update dashboard
7. Notify team
```

### 3. Quality Checklist
Before approving any changes:
- [ ] Code follows style guide
- [ ] Components are properly typed (TypeScript)
- [ ] Accessibility (a11y) standards met
- [ ] Mobile responsive
- [ ] Dark mode compatible
- [ ] Performance tested (Lighthouse > 90)
- [ ] SEO optimized
- [ ] Documentation included

---

## Communication Protocol

### Daily Updates
Post to [DOCUMENTATION_OVERHAUL_DASHBOARD.md](../DOCUMENTATION_OVERHAUL_DASHBOARD.md):
```markdown
## Claude Code - [Date]

**Completed:**
- Item 1
- Item 2

**In Progress:**
- Item 1
- Item 2

**Blockers:**
- None / Description

**Notes:**
- Additional context
```

### Handoff to Other Agents
When components are ready:
1. Document component usage
2. Create examples
3. Update dashboard
4. Notify specific agent
5. Provide implementation guide

---

## Technical Stack

### Current
- Docusaurus 3.9.2
- React 18.3.1
- TypeScript 5.6.3
- MDX 3.1.0
- Algolia DocSearch
- Mermaid Diagrams

### To Add
- Storybook (component documentation)
- Jest + React Testing Library
- Playwright (E2E tests)
- Lighthouse CI (performance monitoring)

---

## Deliverables

### Week 1
- [ ] Component library (10+ components)
- [ ] Enhanced theme
- [ ] Documentation templates (5)
- [ ] Style guide
- [ ] Integration testing suite

### Week 2-3
- [ ] Component reviews for Cursor
- [ ] Content reviews for Gemini
- [ ] Integration support for Amazon Q
- [ ] Performance optimization

### Week 4+
- [ ] Final QA
- [ ] Launch preparation
- [ ] Monitoring setup
- [ ] Documentation for maintainers

---

## Resources

### Reference Documentation
- [Docusaurus Docs](https://docusaurus.io)
- [MDX Documentation](https://mdxjs.com)
- [Atlassian Design System](https://atlassian.design)
- [Salesforce Lightning Design System](https://www.lightningdesignsystem.com)

### Tools
- VSCode with extensions:
  - ESLint
  - Prettier
  - MDX
  - TypeScript
- Chrome DevTools
- Lighthouse
- React Developer Tools

---

## Success Criteria

Your work is successful when:
1. ✅ Component library is complete and documented
2. ✅ All components pass accessibility tests
3. ✅ Performance metrics meet targets (Lighthouse > 90)
4. ✅ Other agents can use components easily
5. ✅ Integration is seamless
6. ✅ Documentation is maintainable

---

**Last Updated:** 2025-12-28
**Status:** Active - Phase 1 in progress
