# Documentation Templates

This directory contains standardized templates for creating documentation in the NXGEN GCXONE knowledge base.

## Available Templates

### 1. Tutorial Template (`tutorial-template.mdx`)
**Use for:** Step-by-step learning experiences that teach users how to accomplish a specific task.

**When to use:**
- Teaching users a new skill or workflow
- Interactive, hands-on learning
- Requires prerequisites to be met
- Estimated completion time is important

**Key features:**
- Learning objectives checklist
- Prerequisites section
- Step-by-step instructions
- Verification steps
- Troubleshooting section

---

### 2. How-To Template (`how-to-template.mdx`)
**Use for:** Quick reference guides for accomplishing specific tasks.

**When to use:**
- Users need to accomplish a specific task quickly
- Multiple methods or variations exist
- Less educational focus, more practical
- Shorter format than tutorials

**Key features:**
- Concise instructions
- Alternative methods
- Common variations
- Quick reference format

---

### 3. Explanation Template (`explanation-template.mdx`)
**Use for:** Explaining concepts, features, or how things work.

**When to use:**
- Explaining a concept or feature
- Describing architecture or design
- Understanding "why" rather than "how"
- Technical deep dives

**Key features:**
- Concept definition
- How it works
- Use cases
- Technical details (collapsible)
- Best practices

---

### 4. Reference Template (`reference-template.mdx`)
**Use for:** Complete API documentation, configuration references, or technical specifications.

**When to use:**
- API endpoints
- Configuration options
- Technical specifications
- Quick lookup reference
- Complete parameter/option lists

**Key features:**
- Complete API documentation
- Parameter tables
- Code examples in multiple languages
- Error codes and handling
- Rate limits and constraints

---

### 5. Device Documentation Template (`device-doc-template.mdx`)
**Use for:** Documenting device integrations and configurations.

**When to use:**
- Documenting a new device integration
- Device-specific configuration guides
- Device troubleshooting
- Device feature documentation

**Key features:**
- Device overview and features
- Installation steps
- Configuration options
- Troubleshooting guide
- Firmware update instructions

---

## How to Use These Templates

1. **Choose the appropriate template** based on your content type
2. **Copy the template** to your documentation directory
3. **Fill in the placeholders** (indicated by `[brackets]`)
4. **Remove unused sections** if they don't apply to your content
5. **Add your content** following the structure and guidelines
6. **Review against CONTENT_STANDARDS.md** for style consistency
7. **Test the documentation** to ensure all components render correctly

## Template Best Practices

### Frontmatter
- Always include a descriptive `title` and `description`
- Add appropriate `tags` for discoverability
- Set `sidebar_position` to control navigation order
- Include `last_updated` date for reference docs

### Structure
- Use clear, descriptive headings
- Break content into logical sections
- Use components (Callouts, Steps, Tabs) to enhance readability
- Include code examples where relevant
- Add troubleshooting sections when helpful

### Components
All templates use standardized components. See `STYLE_GUIDE.md` for component documentation.

Common components:
- `<Callout>` - Info, warning, tip, danger boxes
- `<Steps>` and `<Step>` - Step-by-step instructions
- `<Tabs>` and `<TabItem>` - Tabbed content
- `<Collapsible>` - Progressive disclosure
- `<RelatedArticles>` - Content discovery
- `<CodeBlock>` - Enhanced code blocks

### Writing Style
- Be clear and concise
- Use active voice
- Write for your audience (role-based)
- Include examples and use cases
- Link to related content

## Related Documentation

- [Content Standards](../CONTENT_STANDARDS.md) - Writing guidelines and style
- [Style Guide](../STYLE_GUIDE.md) - Design system and components
- [Component Library](../../classic/src/components/COMPONENT_USAGE_GUIDE.md) - Component usage guide

---

**Questions about templates?** Contact the documentation team or refer to the [Documentation Overhaul Dashboard](../DOCUMENTATION_OVERHAUL_DASHBOARD.md).

