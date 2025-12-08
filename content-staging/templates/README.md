# Article Templates

This directory contains templates for creating consistent documentation across the NXGEN GCXONE platform.

## Available Templates

### 1. Device Template (`device-template.md`)
Use this template for all device-specific configuration guides.

**Sections included:**
- Overview & Key Features
- Prerequisites
- Admin Configuration (GCXONE Side)
- Installer Configuration (Device Side)
- Operator View
- Troubleshooting
- Related Articles

**When to use:**
- Creating documentation for new device integrations
- Documenting device-specific features
- Writing device configuration guides

### 2. Feature Template (`feature-template.md`)
Use this template for all feature documentation.

**Sections included:**
- What is the feature?
- Benefits & How It Works
- Supported Devices
- Configuration Steps
- Usage (Admin & Operator)
- Best Practices & Limitations
- FAQ

**When to use:**
- Documenting platform features
- Explaining feature capabilities
- Writing feature configuration guides

### 3. Troubleshooting Template (`troubleshooting-template.md`)
Use this template for all troubleshooting articles.

**Sections included:**
- Problem Description & Symptoms
- Quick Fixes
- Detailed Troubleshooting Steps
- Root Causes
- Prevention
- Escalation Criteria

**When to use:**
- Creating troubleshooting guides
- Documenting common issues
- Writing problem resolution procedures

## How to Use Templates

1. Copy the appropriate template
2. Replace all `[Placeholder Text]` with actual content
3. Update the frontmatter (title, description, tags, etc.)
4. Fill in all sections with relevant information
5. Remove any sections that don't apply
6. Add device/feature-specific sections as needed

## Frontmatter Guidelines

### Tags
Always include:
- `role:` (all, admin, operator, installer)
- `category:` (configuration, features, troubleshooting, etc.)
- `difficulty:` (beginner, intermediate, advanced)
- `platform:` (GCXONE, talos)

Optional tags:
- `device:` (hikvision, dahua, etc.)
- `feature:` (ai-analytics, ptz-control, etc.)

### Sidebar Position
- Use sequential numbers within each category
- Lower numbers appear first in the sidebar

## Best Practices

1. **Be Consistent:** Use the same structure across similar articles
2. **Be Clear:** Write for your target audience (admin, operator, installer)
3. **Be Complete:** Fill in all sections, don't leave placeholders
4. **Be Visual:** Add screenshots, diagrams, and code examples
5. **Be Linked:** Cross-reference related articles
6. **Be Updated:** Keep the `last_updated` field current

## Example Usage

### Creating a New Device Guide

```bash
# Copy the template
cp templates/device-template.md docs/devices/new-device/admin-configuration.md

# Edit the file
# Replace [Device Name] with "Acme Camera"
# Replace [device_slug] with "acme-camera"
# Fill in all sections
```

### Creating a New Feature Guide

```bash
# Copy the template
cp templates/feature-template.md docs/features/new-feature/overview.md

# Edit the file
# Replace [Feature Name] with "Smart Alerts"
# Replace [feature_slug] with "smart-alerts"
# Fill in all sections
```

## Questions?

Contact Agent 1 (Product Owner) for template modifications or additions.
