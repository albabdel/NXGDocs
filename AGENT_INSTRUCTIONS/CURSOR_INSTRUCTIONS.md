# ⚡ Cursor - Interactive Features Specialist Instructions

**Role:** Interactive Components and UI/UX Development
**Project:** NXGEN GCXONE Documentation Overhaul

---

## Your Mission

You are responsible for bringing the documentation to life with interactive, engaging components that make learning effortless and enjoyable.

### Core Responsibilities
1. **Interactive Components:** Build React components for tutorials, wizards, and tools
2. **UI/UX Excellence:** Create beautiful, accessible, and performant interfaces
3. **User Engagement:** Implement features that keep users engaged and learning
4. **Code Quality:** Write clean, typed, tested code

---

## Phase 1-2 Tasks (Weeks 1-3)

### 1. Interactive Tutorial Components
**Priority: HIGHEST**

Build a comprehensive interactive tutorial system:

```tsx
// InteractiveTutorial.tsx
interface TutorialProps {
  title: string;
  steps: TutorialStep[];
  prerequisites?: string[];
  estimatedTime?: string;
  onComplete?: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  content: ReactNode;
  codeExample?: string;
  validation?: () => boolean;
  hint?: string;
}

export function InteractiveTutorial({ title, steps, ...props }: TutorialProps) {
  // Implementation with:
  // - Progress tracking
  // - Step validation
  // - Code execution (sandboxed)
  // - Hints and help
  // - Completion certificates
}
```

**Features to implement:**
- [ ] Step-by-step progression with validation
- [ ] Code playgrounds with live execution
- [ ] Progress persistence (localStorage)
- [ ] Interactive hints and tooltips
- [ ] Completion tracking and badges
- [ ] Mobile-responsive design
- [ ] Keyboard navigation support

### 2. Configuration Wizards
**Priority: HIGH**

Create guided configuration wizards for common tasks:

```tsx
// ConfigWizard.tsx
interface WizardProps {
  title: string;
  description: string;
  steps: WizardStep[];
  onComplete: (config: any) => void;
  templates?: ConfigTemplate[];
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  validation: (data: any) => boolean;
}

export function ConfigWizard({ steps, ...props }: WizardProps) {
  // Implementation with:
  // - Multi-step form
  // - Real-time validation
  // - Configuration preview
  // - Export functionality (JSON, YAML, etc.)
  // - Template selection
}
```

**Wizards to create:**
- [ ] Device Onboarding Wizard
- [ ] Site Configuration Wizard
- [ ] User Setup Wizard
- [ ] Integration Configuration Wizard
- [ ] Alarm Rule Builder
- [ ] API Key Generator

### 3. Interactive Diagrams
**Priority: MEDIUM**

Enhance Mermaid diagrams with interactivity:

```tsx
// InteractiveDiagram.tsx
interface DiagramProps {
  mermaidCode: string;
  hotspots?: Hotspot[];
  expandable?: boolean;
  zoomable?: boolean;
}

interface Hotspot {
  elementId: string;
  tooltip: string;
  modal?: {
    title: string;
    content: ReactNode;
  };
}

export function InteractiveDiagram({ mermaidCode, hotspots }: DiagramProps) {
  // Implementation with:
  // - Clickable elements
  // - Tooltips on hover
  // - Modal details
  // - Zoom/pan controls
  // - Export as image
}
```

### 4. Code Playground
**Priority: HIGH**

Build a safe, in-browser code execution environment:

```tsx
// CodePlayground.tsx
interface PlaygroundProps {
  language: 'javascript' | 'typescript' | 'python' | 'json';
  defaultCode: string;
  readOnly?: boolean;
  showOutput?: boolean;
  files?: PlaygroundFile[];
}

export function CodePlayground({ language, defaultCode }: PlaygroundProps) {
  // Implementation with:
  // - Monaco Editor integration
  // - Syntax highlighting
  // - Code execution (sandboxed)
  // - Output display
  // - Error handling
  // - Share functionality
}
```

### 5. Decision Tree Navigator
**Priority: MEDIUM**

Create interactive troubleshooting decision trees:

```tsx
// DecisionTree.tsx
interface TreeNode {
  id: string;
  question: string;
  type: 'question' | 'solution';
  options?: TreeOption[];
  solution?: {
    title: string;
    content: ReactNode;
    relatedArticles?: string[];
  };
}

interface TreeOption {
  label: string;
  nextNodeId: string;
}

export function DecisionTree({ rootNode }: { rootNode: TreeNode }) {
  // Implementation with:
  // - Visual tree navigation
  // - Breadcrumb trail
  // - Jump to any node
  // - Print solution
  // - Feedback mechanism
}
```

### 6. Enhanced Code Blocks
**Priority: HIGHEST**

Upgrade all code blocks with modern features:

```tsx
// CodeBlock.tsx
interface CodeBlockProps {
  children: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  copyButton?: boolean;
  live?: boolean;  // Execute React code
  editable?: boolean;
}

export function CodeBlock({ children, language, ...props }: CodeBlockProps) {
  // Implementation with:
  // - Syntax highlighting (Prism/Shiki)
  // - Copy to clipboard
  // - Line numbers
  // - Line highlighting
  // - File name display
  // - Live preview (for React)
  // - Diff highlighting
}
```

---

## UI/UX Guidelines

### Design Principles
1. **Clarity over Cleverness:** Make it obvious, not clever
2. **Progressive Disclosure:** Show only what's needed, when it's needed
3. **Consistency:** Use established patterns
4. **Accessibility First:** WCAG 2.1 AA minimum
5. **Performance:** Keep it fast (< 100ms interaction)

### Component Standards

#### Accessibility
Every component must:
- [ ] Support keyboard navigation
- [ ] Have proper ARIA labels
- [ ] Work with screen readers
- [ ] Maintain 4.5:1 contrast ratio
- [ ] Support focus indicators
- [ ] Handle reduced motion preferences

#### Responsive Design
Test on:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px, 1440px)
- [ ] Ultra-wide (1920px+)

#### Dark Mode
All components must:
- [ ] Respect theme preference
- [ ] Maintain readability
- [ ] Use CSS variables for colors
- [ ] Avoid hard-coded colors

### Performance Targets
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total Blocking Time < 300ms
- [ ] Cumulative Layout Shift < 0.1

---

## Technical Implementation

### Tech Stack
```json
{
  "core": "React 18.3.1 + TypeScript",
  "styling": "CSS Modules + Tailwind (utility)",
  "editor": "Monaco Editor / CodeMirror",
  "animations": "Framer Motion",
  "forms": "React Hook Form + Zod",
  "testing": "Jest + React Testing Library",
  "a11y": "axe-core"
}
```

### Code Structure
```
src/components/
├── interactive/
│   ├── InteractiveTutorial/
│   │   ├── index.tsx
│   │   ├── InteractiveTutorial.tsx
│   │   ├── TutorialStep.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── styles.module.css
│   │   └── __tests__/
│   ├── ConfigWizard/
│   ├── CodePlayground/
│   └── DecisionTree/
├── enhanced/
│   ├── CodeBlock/
│   ├── Collapsible/
│   └── TabContainer/
└── feedback/
    ├── FeedbackWidget/
    └── RatingWidget/
```

### TypeScript Requirements
```typescript
// All components must be fully typed
interface Props {
  // No `any` types allowed
  // Use strict mode
  // Export all interfaces
}

// Use generics where appropriate
function Component<T extends BaseType>(props: Props<T>) {}
```

---

## Testing Requirements

### Unit Tests
Every component needs:
```typescript
describe('ComponentName', () => {
  it('renders without crashing', () => {});
  it('handles user interactions', () => {});
  it('validates input correctly', () => {});
  it('shows error states', () => {});
  it('is accessible', () => {});
});
```

### Integration Tests
Test with other components:
```typescript
describe('InteractiveTutorial integration', () => {
  it('works with CodePlayground', () => {});
  it('saves progress correctly', () => {});
  it('integrates with feedback system', () => {});
});
```

### Accessibility Tests
```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Deliverables

### Week 1
- [ ] Enhanced Code Block component
- [ ] Collapsible sections component
- [ ] Tabbed content component
- [ ] Basic feedback widget

### Week 2
- [ ] Interactive Tutorial framework
- [ ] Code Playground (basic)
- [ ] Configuration Wizard framework
- [ ] Testing suite setup

### Week 3
- [ ] Decision Tree navigator
- [ ] Interactive Diagrams
- [ ] Complete all wizard templates
- [ ] Polish and optimization

### Week 4
- [ ] Advanced Code Playground features
- [ ] Tutorial completion tracking
- [ ] Analytics integration
- [ ] Performance optimization

### Week 5-6
- [ ] Edge case handling
- [ ] Cross-browser testing
- [ ] Mobile optimization
- [ ] Final QA and refinement

---

## Component Documentation

Each component must include:

### README.md
```markdown
# ComponentName

## Overview
Brief description

## Usage
\`\`\`tsx
import { ComponentName } from '@/components';

<ComponentName prop={value} />
\`\`\`

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |

## Examples
[Live examples]

## Accessibility
[a11y notes]

## Browser Support
[compatibility matrix]
```

### Storybook Stories
```typescript
export default {
  title: 'Interactive/ComponentName',
  component: ComponentName,
} as Meta;

export const Default: Story = {
  args: {
    // default props
  },
};

export const WithError: Story = {
  args: {
    // error state
  },
};
```

---

## Handoff Protocol

When components are ready:
1. Create pull request with:
   - Component code
   - Tests (passing)
   - Documentation
   - Storybook stories
   - Usage examples
2. Update component registry
3. Notify Claude Code for review
4. Address feedback
5. Merge and deploy to Storybook

---

## Communication

### Daily Updates
Update dashboard with:
```markdown
## Cursor - [Date]

**Completed:**
- Component X finished with tests
- Component Y 80% complete

**In Progress:**
- Component Z design iteration

**Blockers:**
- Need design approval for X
- Waiting for API spec for Y

**Next:**
- Complete Component Z
- Start Component W
```

### Questions for Team
- Design decisions → User (project owner)
- Technical architecture → Claude Code
- Content needs → Gemini
- API integration → Amazon Q

---

## Success Criteria

Your work is successful when:
1. ✅ All components are fully functional
2. ✅ Accessibility score 100%
3. ✅ Test coverage > 80%
4. ✅ Performance targets met
5. ✅ Users engage with interactive features
6. ✅ Zero critical bugs in production

---

## Resources

### Design Systems
- [Atlassian Design System](https://atlassian.design)
- [Lightning Design System](https://www.lightningdesignsystem.com)
- [Material Design](https://material.io)

### Tools & Libraries
- [React Hook Form](https://react-hook-form.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Mermaid](https://mermaid.js.org)

### Testing
- [Testing Library](https://testing-library.com/react)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Last Updated:** 2025-12-28
**Status:** Active - Ready to begin Phase 1
