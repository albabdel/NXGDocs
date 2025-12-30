# NXGEN Content Standards

To ensure consistency and quality across 500+ documentation files, every article must adhere to these standards.

## The 4-Tier Content Model

All documentation must be categorized into one of these four tiers:

### 1. Tutorials (Learning-Oriented)
- **Goal:** Guide a user through a hands-on project.
- **Requirements:**
    - Title starts with an action verb (e.g., "Add Your First Camera").
    - Clear objective stated at the top.
    - Minimal theoretical explanation.
    - Step-by-step instructions.
    - Result verification ("You should now see...").

### 2. How-To Guides (Problem-Oriented)
- **Goal:** Solve a specific problem or perform a discrete task.
- **Requirements:**
    - Title is a specific question or task (e.g., "How to Reset a Password").
    - Prerequisites clearly listed.
    - Action-oriented steps.
    - Link to related troubleshooting if applicable.

### 3. Explanations (Understanding-Oriented)
- **Goal:** Clarify a concept or "why" something works.
- **Requirements:**
    - Conceptual title (e.g., "Understanding Multi-Tenancy").
    - Use of analogies and visuals.
    - Focus on the "big picture" and architecture.
    - Links to related tutorials and reference docs.

### 4. Reference (Information-Oriented)
- **Goal:** Technical description of the "machinery".
- **Requirements:**
    - Dry, factual title (e.g., "API Parameter: siteId").
    - Structured layout (tables, lists).
    - Comprehensive data (types, defaults, constraints).
    - Accuracy is the #1 priority.

---

## Technical Requirements (Markdown & MDX)

### 1. Frontmatter
Every file MUST contain the following frontmatter:
```yaml
---
title: "Article Title"
description: "One sentence description"
tags:
  - role:[operator|installer|admin|manager|all]
  - category:[tutorial|how-to|explanation|reference]
  - difficulty:[beginner|intermediate|advanced]
  - platform:GCXONE
last_updated: YYYY-MM-DD
---
```

### 2. Heading Structure
- `h1` (#) is reserved for the title (only one per page).
- `h2` (##) for major sections.
- `h3` (###) for sub-sections.
- Avoid going deeper than `h4`.

### 3. Links
- Use relative links for internal documentation (`/docs/folder/file`).
- Use absolute links for external resources (`https://...`).
- Ensure all links have descriptive text (No "click here").

### 4. Media
- Store images in the `static/img/` directory of the Docusaurus project.
- Use `![Caption](/img/path/to/image.png)` syntax.
- Every image MUST have alt-text for accessibility.

---

---

## Voice & Tone Guide

### Core Voice Principles
Our documentation voice should be:

1. **Helpful** - We're here to help users succeed
2. **Clear** - No ambiguity, no jargon (or explain it)
3. **Professional** - Trustworthy and competent
4. **Encouraging** - Celebrate wins, acknowledge effort
5. **Efficient** - Respect users' time

### Tone by Content Type

#### Tutorials: Encouraging & Patient
- Use positive reinforcement: "Great job!", "You did it!"
- Acknowledge learning curve: "Don't worry if this feels overwhelming"
- Celebrate milestones: "Congratulations! You've just..."
- Be patient with explanations: "Let's walk through this step-by-step"

**Example:**
> Great job! You've just created your first site. Next, let's add a camera to see it in action.

#### How-Tos: Clear & Confident
- Direct and actionable: "Follow these steps to..."
- Assume competence: "You'll configure..." not "You should try to..."
- Be decisive: "Use this method" not "You might want to try..."
- Provide rationale when helpful: "This ensures that..."

**Example:**
> Follow these steps to configure email notifications. This ensures you're alerted immediately when alarms trigger.

#### Explanations: Thoughtful & Insightful
- Use analogies: "Think of it like..."
- Explain the "why": "This architecture allows..."
- Connect concepts: "This relates to X because..."
- Show patterns: "You'll notice that..."

**Example:**
> Think of GCXONE's hierarchy like a company structure: customers are like companies, sites are like offices, and devices are like employees in each office.

#### Reference: Precise & Complete
- Be factual: "The parameter is..." not "You can use..."
- Be comprehensive: List all options, all types, all constraints
- Be accurate: This is the source of truth
- Be structured: Tables, lists, clear organization

**Example:**
> `customerId` (string, required): Unique identifier for the customer. Must match pattern: `^[a-zA-Z0-9-_]{3,50}$`

---

## Writing Principles

### 1. Active Voice
✅ **Do:** "Click Save"  
❌ **Don't:** "Save should be clicked"

✅ **Do:** "The system sends notifications"  
❌ **Don't:** "Notifications are sent by the system"

### 2. Present Tense
✅ **Do:** "The system processes requests"  
❌ **Don't:** "The system will process requests" (unless future behavior)

### 3. Second Person (You/Your)
✅ **Do:** "You configure the device"  
❌ **Don't:** "The user configures the device"

✅ **Do:** "Your settings are saved"  
❌ **Don't:** "Settings are saved"

### 4. Concrete Examples
✅ **Do:** Use real scenarios with specific values  
❌ **Don't:** Use vague placeholders unnecessarily

**Example:**
✅ "Name: `Demo Customer`, Email: `support@example.com`"  
❌ "Name: `[customer-name]`, Email: `[email]`" (unless required for clarity)

### 5. Scannable Content
- **Short paragraphs:** 3-4 sentences max
- **Bulleted lists:** For multiple items (non-sequential)
- **Numbered lists:** For sequential steps
- **Headings:** Clear, descriptive, hierarchical
- **White space:** Don't cram information

### 6. Clear and Concise
- **Short sentences:** 15-20 words average
- **Remove fluff:** "In order to" → "To"
- **Cut redundancy:** "First and foremost" → "First"
- **Be specific:** "Several minutes" → "5 minutes"

---

## Structure Guidelines

### Page Structure Template

```markdown
---
title: "[Clear, Action-Oriented Title]"
description: "[One sentence: what users will learn/do]"
tags:
  - category:[tutorial|how-to|explanation|reference]
  - difficulty:[beginner|intermediate|advanced]
  - role:[operator|installer|admin|manager|all]
  - platform:GCXONE
sidebar_position: 1
estimated_time: "[X minutes]" # For tutorials/how-tos
---

# [H1 - Page Title] (Only one per page)

[Brief overview paragraph - 2-3 sentences]

## Overview / What You'll Learn

[For tutorials: Learning objectives checklist]
[For how-tos: What will be accomplished]
[For explanations: What will be understood]

## Prerequisites / Before You Begin

- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

## [Main Content Sections]

[Organized with H2 and H3 headings]

## Next Steps / Related Articles

[Links to related content]

## Troubleshooting / Common Issues

[Optional but recommended]
```

### Heading Best Practices

1. **One H1 per page** - The page title
2. **Logical hierarchy** - Don't skip levels (H1 → H2 → H3)
3. **Descriptive headings** - Users should understand content from heading alone
4. **Scannable** - Users should be able to scan headings to understand page structure

**Examples:**
✅ "Configure Email Notifications"  
❌ "Configuration"

✅ "Troubleshooting Connection Issues"  
❌ "Problems"

### Paragraph Structure

- **Lead with the main point:** First sentence contains key information
- **Supporting details:** Rest of paragraph expands on the point
- **One idea per paragraph:** Don't mix concepts
- **Transition between paragraphs:** Connect ideas smoothly

---

## Formatting Guidelines

### Emphasis

- **Bold (`**text**`)**: UI elements, important terms, key concepts
  - Example: Click **Save** to apply changes
  - Example: **Important:** This setting cannot be changed later

- *Italics (`*text*`)**: Use sparingly for emphasis, foreign terms, or document titles
  - Example: This is a *critical* step
  - Avoid overuse

- `Code (backticks)`: Functions, variables, file names, commands, technical terms
  - Example: Set `maxConnections` to 100
  - Example: Run `npm install`

### Lists

#### Bulleted Lists (Unordered)
Use for items without sequence:
- Features
- Options
- Examples
- Requirements

#### Numbered Lists (Ordered)
Use for sequential steps:
1. First action
2. Second action
3. Third action

#### Checklist Format
Use for prerequisites, verification, or tasks:
- [ ] Prerequisite 1
- [ ] Prerequisite 2
- [x] Completed task

### Code Blocks

Always specify language for syntax highlighting:

\`\`\`typescript
// Example code
const config = { ... };
\`\`\`

For file names or single-line commands, use inline code with backticks.

### Tables

Use tables for:
- Comparison data
- Configuration options
- Feature matrices
- Parameter reference

**Example:**
```markdown
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `host` | string | Yes | - | Server hostname |
| `port` | number | No | 80 | Server port |
```

### Links

- **Descriptive link text:** "See the configuration guide" not "click here"
- **Internal links:** Use relative paths `/docs/path/to/article`
- **External links:** Use absolute URLs `https://example.com`
- **Link context:** Ensure surrounding text makes link purpose clear

**Examples:**
✅ "See the [device configuration guide](/docs/devices/configure) for details"  
❌ "For more information, [click here](/docs/devices/configure)"

---

## Language & Terminology

### Use Clear, Simple Language

- **Avoid jargon:** Or explain it on first use
- **Define acronyms:** "API (Application Programming Interface)"
- **Use familiar terms:** "Site" not "Tenant Instance" (unless technical accuracy requires it)
- **Be consistent:** Use same term throughout (don't alternate between "device" and "camera" randomly)

### Product Terminology

Maintain consistent use of:
- **GCXONE** - The platform name (always capitalized)
- **Talos** - The monitoring application
- **Genesis** - The alarm management system
- **Site** - A location/customer site
- **Device** - Generic term for cameras, sensors, etc.
- **Camera** - Specific device type (use when specificity matters)

### Technical Terms

- **API** - Application Programming Interface (define on first use)
- **REST API** - Representational State Transfer API
- **Webhook** - HTTP callback mechanism
- **SDK** - Software Development Kit

---

## Accessibility Guidelines

### Images

- **Always include alt text:** `![Description of image](/img/path.png)`
- **Descriptive alt text:** Describe what's shown, not just "screenshot"
- **Decorative images:** Use empty alt text `![ ]` for purely decorative images

**Examples:**
✅ `![GCXONE dashboard showing device list with 3 cameras online](/img/dashboard.png)`  
❌ `![Screenshot](/img/dashboard.png)`

### Links

- **Descriptive text:** Users should understand destination from link text alone
- **Screen reader friendly:** Avoid "click here", "read more"
- **Context:** Ensure surrounding text provides context

### Color

- **Don't rely on color alone:** Use text, icons, or patterns to convey meaning
- **Contrast:** Ensure sufficient contrast (4.5:1 for normal text)
- **Color blind friendly:** Test with color blindness simulators

### Keyboard Navigation

- **Logical tab order:** Ensure interactive elements can be reached via keyboard
- **Focus indicators:** Visible focus states for keyboard navigation
- **Skip links:** Provide ways to skip repetitive content

---

## Quality Checklist

Before submitting any documentation file:

### Content Quality
- [ ] Follows the 4-Tier Content Model correctly
- [ ] Matches voice & tone for content type
- [ ] Uses active voice and second person
- [ ] Free of spelling and grammar errors
- [ ] Scannable (short paragraphs, headings, lists)
- [ ] Includes concrete examples where helpful

### Technical Quality
- [ ] Frontmatter is complete and correct
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] All links are functional (internal and external)
- [ ] Code examples are accurate and tested
- [ ] Images have descriptive alt text
- [ ] Tables are properly formatted

### Structure & Organization
- [ ] Clear overview/introduction
- [ ] Logical flow of information
- [ ] Prerequisites listed (if needed)
- [ ] Next steps or related articles included
- [ ] Troubleshooting section (if applicable)

### Accessibility
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Color is not the only means of conveying information
- [ ] Content is readable and understandable
- [ ] Structure is semantic and logical

### User Experience
- [ ] Clear value proposition (what will user learn/do)
- [ ] Appropriate for target audience (role, difficulty)
- [ ] Estimated time included (for tutorials/how-tos)
- [ ] Success criteria clear (how to verify completion)
- [ ] Common issues addressed

---

## Examples by Content Type

### Tutorial Example
```markdown
---
title: "Add Your First Camera to GCXONE"
description: "Learn how to add and configure your first IP camera in GCXONE"
tags:
  - category:tutorial
  - difficulty:beginner
  - role:installer
  - platform:GCXONE
estimated_time: "10 minutes"
---

# Add Your First Camera to GCXONE

In this tutorial, you'll add your first IP camera to GCXONE and view live video. This takes about 10 minutes.

<Callout type="info" title="What you'll learn">
- How to add a camera to a site
- How to configure camera settings
- How to view live video feed
</Callout>

## Prerequisites

Before you begin, you'll need:
- [ ] Access to GCXONE platform
- [ ] IP camera (Hikvision, Dahua, or Axis)
- [ ] Camera IP address and credentials
- [ ] Network access to camera

## Step 1: Navigate to Device Management

1. Log into GCXONE
2. Select your site from the sidebar
3. Click **Devices** in the main navigation
4. Click **+ Add Device**

Great! You're ready to add your camera.

## Step 2: Enter Camera Details

...
```

### How-To Example
```markdown
---
title: "How to Configure Email Notifications"
description: "Set up email alerts for alarm triggers in GCXONE"
tags:
  - category:how-to
  - difficulty:intermediate
  - role:admin
  - platform:GCXONE
---

# How to Configure Email Notifications

Learn how to set up automatic email alerts when alarms are triggered in GCXONE.

## Prerequisites

- Administrator access to GCXONE
- SMTP server details (host, port, credentials)
- 5 minutes

## Steps

### 1. Access Notification Settings

Navigate to **Settings** → **Notifications** → **Email**

### 2. Configure SMTP Server

...
```

### Explanation Example
```markdown
---
title: "Understanding GCXONE's Multi-Tenant Architecture"
description: "Learn how GCXONE's multi-tenant architecture provides secure data isolation"
tags:
  - category:explanation
  - difficulty:intermediate
  - role:all
  - platform:GCXONE
---

# Understanding GCXONE's Multi-Tenant Architecture

GCXONE uses a multi-tenant architecture to serve multiple customers securely on a single platform. This article explains how it works and why it matters.

## What is Multi-Tenancy?

Think of GCXONE like a luxury apartment building. Each customer has their own private apartment (tenant) with complete privacy and security, but everyone shares the building infrastructure (platform resources).

...

## How Data Isolation Works

...

## Benefits of Multi-Tenancy

...
```

---

## Resources

- [Templates Directory](../TEMPLATES/) - Use templates for new content
- [Style Guide](../STYLE_GUIDE.md) - Visual design guidelines
- [Component Usage Guide](../../classic/src/components/COMPONENT_USAGE_GUIDE.md) - Component documentation

---

**Last Updated:** 2025-12-28  
**Maintained By:** Claude Code (Central Coordinator)
