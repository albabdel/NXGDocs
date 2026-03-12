# NXGEN Docs - Editor's Comprehensive Guide

## 🚀 Welcome to Your Enhanced Sanity Studio!

This guide covers all the powerful features available to you for creating and managing content.

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Folder Organization](#folder-organization)
3. [Creating Content](#creating-content)
4. [Rich Text Editing](#rich-text-editing)
5. [Media Management](#media-management)
   - [Images](#images)
   - [GIFs](#gifs)
   - [Videos](#videos)
   - [Audio](#audio)
6. [Importing Content](#importing-content)
7. [Tags and Metadata](#tags-and-metadata)
8. [Collaboration Features](#collaboration-features)
9. [Advanced Components](#advanced-components)
10. [Tips and Best Practices](#tips-and-best-practices)

---

## Getting Started

### Logging In
- Access the Sanity Studio at your organization's URL
- Sign in with your credentials
- You'll land on the Dashboard with quick access to recent content

### Dashboard Overview
The dashboard provides:
- 📈 **Recent Documents** - Quick access to your latest work
- ⏳ **Drafts** - Content awaiting completion
- 👁️ **In Review** - Content pending approval
- 📊 **Statistics** - Content metrics and analytics

### Navigation Structure
```
📊 Overview
├── 📈 Dashboard
├── 📁 Folder Structure
├── 🏷️ Tags & Categories
├── 📥 Import Jobs
└── 📝 Content Templates

📄 Documentation Pages
├── Getting Started
├── Devices
├── Features
├── [More sections...]
└── All Docs (flat)

📋 Release Notes
📰 Articles
📖 Reference Pages

Editorial Workflow
├── 🔘 Drafts
├── 🟡 In Review
├── ✅ Approved
└── 🟢 Published
```

---

## Folder Organization

### Creating Folders
1. Go to **Overview > Folder Structure**
2. Click **Create new document**
3. Choose **Folder**
4. Fill in:
   - **Name** - Folder display name
   - **Description** - What this folder contains
   - **Icon** - Visual identifier (emoji picker)
   - **Color** - Optional color coding
   - **Parent Folder** - For nested folders

### Folder Hierarchy
```
📚 Documentation
├── 📄 Getting Started
│   ├── Installation Guide
│   ├── Quick Start
│   └── Setup Wizard
├── ⚙️ Configuration
│   ├── Basic Settings
│   └── Advanced Options
└── 🎓 Tutorials
    ├── Beginner
    └── Advanced
```

### Moving Documents to Folders
1. Open any document
2. Find the **Folder** field
3. Select the target folder from the dropdown
4. Save the document

### Folder Permissions
Set who can view or edit content:
- **Public** - Everyone
- **Authenticated** - Logged-in users only
- **Editors** - Content editors
- **Admins** - Administrators only

---

## Creating Content

### Document Types

#### 📄 Documentation Page
- Full-featured documentation with all rich text options
- Supports folders, tags, and components
- SEO metadata and analytics

#### 📰 Article
- Blog-style content
- Featured flag for highlighting
- Publication dates

#### 📋 Release Note
- Version-specific updates
- Change tracking
- Audience targeting

#### 📖 Reference Page
- Technical documentation
- API references
- Code examples

### Using Content Templates
1. Click **New Document**
2. Select **From Template**
3. Choose a template:
   - 📝 Standard Article
   - 📄 How-to Guide
   - 📋 Release Notes
   - 📖 API Reference
   - 🎓 Tutorial
   - 📢 Announcement
4. The template will pre-fill with structure and content

---

## Rich Text Editing

### Text Formatting

#### Styles
- **Normal** - Regular paragraph
- **H1-H6** - Headings (H1 for main title)
- **Quote** - Block quotations
- **Lead / Intro** - Introduction paragraph
- **Small** - Fine print/footnotes

#### Decorators (Inline Styles)
- **Bold** - `Ctrl/Cmd + B`
- **Italic** - `Ctrl/Cmd + I`
- **Underline** - `Ctrl/Cmd + U`
- **Code** - Inline code snippets
- **Strike-through** - Crossed-out text
- **Superscript** - ²ⁿᵈ, m²
- **Subscript** - H₂O, CO₂
- **Highlight** - Yellow highlight
- **Low Importance** - Grayed out text

#### Annotations (Special Markers)

##### 🔗 External Link
- URL with optional tooltip
- Open in new tab option

##### 📄 Internal Link
- Link to other documents
- Auto-complete as you type
- Anchor links to specific sections

##### 📑 Footnote
- Add citations and references
- Auto-numbered

##### ℹ️ Abbreviation/Acronym
- Hover to see full text
- Example: "API" → "Application Programming Interface"

##### 📖 Definition/Tooltip
- Hover explanations
- Source attribution

##### 📚 Citation
- Academic references
- URL and date tracking

##### ⌨️ Keyboard Shortcut
- Visual key combinations
- Example: "Press `Ctrl + S` to save"

##### 💬 Comment
- Team annotations
- Mark as resolved
- @mentions support

##### 🌐 Language
- Mark foreign language text
- Proper screen reader support

### Inserting Blocks

#### 📝 Callout (Admonitions)
11 types available:
- 📝 **Note** - General information
- 💡 **Tip** - Helpful suggestion
- ⚠️ **Warning** - Important caution
- 🚫 **Danger** - Critical warning
- ℹ️ **Info** - Additional details
- 🔍 **Abstract** - Summary/TL;DR
- ✅ **Success** - Positive outcome
- ❌ **Failure** - Error/problem
- ❓ **Question** - FAQ format
- 🐛 **Bug** - Known issues
- 💬 **Quote** - Blockquote with style

**Features:**
- Collapsible option
- Custom titles
- Rich text content inside

#### 💻 Code Block
35+ programming languages supported:
- JavaScript, TypeScript
- Python, Ruby, Go, Rust
- HTML, CSS, SCSS
- SQL, Bash, PowerShell
- Java, C, C++, C#
- JSON, YAML, XML, Markdown
- And many more!

**Features:**
- Syntax highlighting
- Line numbers
- File name display
- Copy button

#### 📷 Image
**Upload Methods:**
- Drag & drop
- Paste from clipboard
- Upload file
- Choose from media library

**Image Settings:**
- **Alt text** - Required for accessibility
- **Caption** - Description below image
- **Width** - 25%, 50%, 75%, or full
- **Alignment** - Left, center, right
- **Lightbox** - Click to enlarge
- **Filters** - Grayscale, blur, brightness, etc.
- **Transform** - Rotate, flip, crop

#### 🎬 Video
**Sources:**
- Upload video file
- YouTube embed
- Vimeo embed
- External URL

**Settings:**
- Autoplay
- Mute
- Start/end times
- Custom poster image
- Subtitle tracks (VTT/SRT)

#### 🎵 Audio
- Upload audio files
- Cover art
- Track metadata
- Playback controls

#### 📊 Table
- Create data tables
- Sortable columns
- Header rows
- Merge cells

#### 📁 File Attachment
- PDF downloads
- Document attachments
- Custom button styles
- Download tracking

#### ─── Divider
5 styles:
- Simple line
- Dotted
- Decorative
- Stars
- Arrows

#### 📋 Step-by-Step Procedure
Perfect for tutorials:
- Title and description
- Difficulty level (Easy/Medium/Advanced)
- Estimated time
- Steps with:
  - Title
  - Instructions
  - Step images
  - Tips

#### 🗂️ Tabs
- Create tabbed content
- 2-10 tabs per component
- Rich text in each tab
- Default active tab

#### 📂 Accordion
- Expandable sections
- Multiple items
- Expand by default option
- Nested accordions

#### 🃏 Card / Info Box
- Title and content
- Icon selection
- Border colors
- Optional link

#### 📊 Comparison Table
- Feature comparisons
- Column highlighting
- Multiple rows
- Headers

#### 📅 Timeline
- Vertical or horizontal
- Events with dates
- Milestone markers
- Icons

#### ❓ Quiz
Interactive quizzes:
- Single/Multiple choice
- True/False
- Option feedback
- Score tracking
- Explanations

#### 📈 Chart
- Bar charts
- Line charts
- Pie/Doughnut charts
- Data visualization

#### ∑ Math
- LaTeX equations
- MathJax rendering
- Inline and display math

#### 🧜 Mermaid Diagram
- Flowcharts
- Sequence diagrams
- Entity relationships
- Gantt charts

#### 🌐 Raw HTML/MDX
- Custom HTML
- Docusaurus components
- MDX markup
- Full control

---

## Media Management

### Uploading Media

#### Drag & Drop
1. Open any document
2. Drag images/files directly into the editor
3. They'll automatically upload and create blocks

#### Paste Support
- Copy image from anywhere
- Paste with `Ctrl/Cmd + V`
- Auto-uploads to Sanity

#### From Media Library
1. Click "Browse" on image fields
2. Search existing media
3. Select and insert

### Image Enhancements

#### GIF Support
- Upload animated GIFs
- Autoplay settings
- Loop control
- Static poster frame

#### Image Filters
Available filters:
- **Grayscale** - Black & white
- **Sepia** - Vintage look
- **Blur** - 0-20px blur
- **Brightness** - 0-200%
- **Contrast** - 0-200%
- **Saturation** - 0-200%

#### Transformations
- Rotate (0°, 90°, 180°, 270°)
- Flip (horizontal, vertical, both)
- Custom crop (top, right, bottom, left percentages)

#### Layout Options
- **Width** - 25%, 33%, 50%, 75%, 100%, custom
- **Alignment** - Left, center, right, full bleed
- **Float** - Wrap text around image

#### Interactions
- **Lightbox** - Click to enlarge
- **Link** - Navigate on click
- **Hover effects** - Zoom, fade, overlay, border

#### Lazy Loading
- Load images as they scroll into view
- Placeholder options:
  - Blur hash (colorful blur preview)
  - Dominant color
  - Low quality image

### Media Gallery
Create beautiful galleries:
- **Grid** layout (2-5 columns)
- **Masonry** layout
- **Carousel** with autoplay
- **Slider** with arrows/dots
- **List** view

Gallery features:
- Mix images, videos, audio
- Lightbox viewing
- Thumbnail navigation
- Download option
- Filtering by tags

---

## Importing Content

### Supported Formats

#### 📄 DOCX (Microsoft Word)
- Full formatting preservation
- Image extraction
- Table conversion
- Style mapping

#### 📑 PDF
- Text extraction
- Image extraction
- Table detection
- Link preservation

#### 📝 Markdown
- Complete format support
- Frontmatter parsing
- Image handling

#### 🌐 HTML
- Web page import
- Style cleanup
- Link conversion

#### 📊 JSON/CSV
- Structured data import
- Bulk document creation
- Field mapping

#### 🎨 CMS Exports
- WordPress
- Contentful
- Strapi
- Custom formats

### Import Process

1. **Create Import Job**
   - Go to Overview > Import Jobs
   - Click "Create new document"
   - Select import type

2. **Upload File**
   - Drag & drop or select file
   - Or enter URL for web import

3. **Configure Settings**
   - Target folder
   - Document type conversion
   - Status assignment
   - Auto-tagging
   - Assign to user

4. **Review & Process**
   - Preview documents found
   - Review extraction
   - Start import
   - Monitor progress

5. **Post-Import Review**
   - Check imported documents
   - Review any errors
   - Make manual adjustments

### Import Settings

#### Preserve Formatting
- Keep original styles
- Font colors and sizes
- Paragraph formatting

#### Extract Images
- Save embedded images
- Organize in media library
- Generate alt text (AI)

#### Generate Slugs
- Auto-create URL-friendly names
- From document titles

#### Set Document Status
- Draft (default)
- In Review
- Published

#### Auto-Add Tags
- Apply predefined tags
- Based on content analysis

### Paste Settings
Configure how pasted content is handled:

**Image Paste:**
- Auto-upload to Sanity
- Optimize/compress
- Max file size (default 10MB)
- Allowed formats (PNG, JPEG, GIF, WebP)
- Auto-generate alt text

**Rich Text Paste:**
- Preserve formatting
- Keep links
- Convert tables
- Detect code blocks
- Smart URL detection

**File Paste:**
- Auto-upload files
- Create attachment blocks
- Size limits
- Allowed extensions

**URL Paste:**
- Auto-embed media (YouTube, Vimeo)
- Fetch link metadata
- Create bookmark cards

---

## Tags and Metadata

### Tag System

#### Creating Tags
1. Go to Overview > Tags & Categories
2. Click "Create new document"
3. Set:
   - Name
   - Color
   - Category (Topic, Difficulty, Audience, etc.)
   - Icon
   - Description

#### Tag Categories
- **Topic** - Subject matter
- **Difficulty** - Beginner, Intermediate, Advanced
- **Audience** - Who it's for
- **Format** - Article, Video, Tutorial, etc.
- **Status** - Draft, Published, Archived
- **Department** - Team/organization
- **Product** - Related product
- **Version** - Software version
- **Priority** - High, Medium, Low

#### Auto-Apply Rules
Tags can be automatically applied based on:
- Title contains keywords
- Content contains phrases
- Category matches
- Author matches

#### Tag Groups
Organize tags into groups:
- Allow multiple selections
- Required fields
- Display order

### SEO Metadata

For every document, you can set:

#### Basic SEO
- **Meta Title** - Search result title (50-60 chars)
- **Meta Description** - Search result description (150-160 chars)
- **Keywords** - Comma-separated tags

#### Advanced SEO
- **Canonical URL** - Preferred URL
- **No Index** - Hide from search engines
- **No Follow** - Don't follow links

#### Social Sharing
- **Open Graph Title** - Facebook/LinkedIn title
- **Open Graph Description** - Social description
- **Open Graph Image** - Social preview image (1200x630)
- **Twitter Card** - Summary or large image
- **Twitter Image** - Twitter preview (1200x600)
- **Structured Data** - JSON-LD markup

### Publishing Metadata

#### Schedule Publishing
- **Publish Date** - When to go live
- **Unpublish Date** - When to remove
- **Timezone** - Your local time
- **Visibility** - Public, Password, Private, Draft

#### Content Settings
- **Sticky** - Pin to top
- **Featured** - Highlight content
- **Priority** - Sort order

### Analytics Metadata

Track custom events:
- Page views
- Link clicks
- Form submissions
- Scroll depth
- Custom conversions

### Collaboration Metadata

#### Authors
Multiple authors with roles:
- Writer
- Editor
- Reviewer
- Approver
- Contributor

#### Workflow
- **Assigned To** - Current owner
- **Due Date** - Deadline
- **Review Date** - When to review
- **Approvers** - Who must approve
- **Approved By** - Approval history

### Version Control

Track changes:
- **Version Number** - Semantic versioning
- **Change Log** - What changed
- **Major Changes** - Significant updates

---

## Collaboration Features

### Comments & Annotations

#### Adding Comments
1. Select text
2. Click comment icon
3. Type your comment
4. @mention team members

#### Comment Features
- Threaded discussions
- Mark as resolved
- Email notifications
- In-app alerts

### Assignments

#### Assigning Documents
1. Open document
2. Go to Collaboration section
3. Set "Assigned To"
4. Set due date
5. Save

#### Review Workflow
1. **Draft** - Initial creation
2. **In Review** - Submitted for review
3. **Approved** - Reviewer approved
4. **Published** - Live on site

### Notifications

Receive alerts for:
- Assigned documents
- Comments on your content
- Reviews requested
- Approvals completed
- Due date reminders

### Version History

View document history:
- Who made changes
- When changes were made
- What was changed
- Restore previous versions
- Compare versions

---

## Advanced Components

### Pre-Built Components

#### Hero Section
- Large title
- Subtitle/description
- Background image/video
- Call-to-action buttons

#### Feature Grid
- 2-4 column layout
- Icons for each feature
- Title and description
- Links

#### Testimonial Slider
- Customer quotes
- Author photos
- Company names
- Star ratings

#### Call-to-Action
- Heading
- Description
- Primary/secondary buttons
- Background styles

#### FAQ Accordion
- Question/answer pairs
- Expandable sections
- Searchable

#### Pricing Table
- Multiple plans
- Feature comparisons
- Price highlighting
- CTA buttons

#### Team Members
- Photos
- Names and roles
- Bios
- Social links

#### Statistics Counter
- Animated numbers
- Labels
- Icons
- Various styles

#### Image Gallery
- Grid layouts
- Masonry
- Lightbox
- Captions

#### Newsletter Signup
- Email form
- Custom fields
- Success/error messages
- Integration options

#### Contact Form
- Custom fields
- Validation
- Success/error states
- Email notifications

#### Blog Preview
- Latest posts
- Featured posts
- Layout options
- Excerpt length

### Component Settings

Each component has:
- **Layout options** - Grid, list, slider
- **Style presets** - Pre-designed looks
- **Color schemes** - Match your brand
- **Animation settings** - Entrance effects
- **Responsive settings** - Mobile behavior

### Custom Components

Build your own:
1. Go to **Content Templates**
2. Create new template
3. Define fields
4. Set default values
5. Save and reuse

---

## Tips and Best Practices

### Content Creation

#### Writing for the Web
- **Use headings** - Break up content (H2, H3)
- **Keep paragraphs short** - 2-3 sentences max
- **Use lists** - Bulleted or numbered
- **Add visuals** - Images, videos, diagrams
- **Include CTAs** - Clear next steps

#### Accessibility
- **Alt text** - Describe every image
- **Heading hierarchy** - Don't skip levels
- **Color contrast** - Ensure readability
- **Link text** - Describe the destination
- **Tables** - Use headers properly

#### SEO Best Practices
- **Unique titles** - Every page different
- **Meta descriptions** - Compelling summaries
- **Keywords** - Natural usage
- **Internal links** - Connect related content
- **Image optimization** - Compressed, proper sizing

### Media Guidelines

#### Images
- **Format** - WebP or JPEG for photos, PNG for graphics
- **Size** - Max 2000px wide
- **Compression** - 80% quality
- **Alt text** - Descriptive and concise
- **Captions** - Context when needed

#### Videos
- **Format** - MP4 (H.264)
- **Thumbnails** - Custom poster images
- **Subtitles** - Always include
- **Length** - Keep focused
- **Hosting** - Use YouTube/Vimeo or upload

#### Files
- **Naming** - Descriptive filenames
- **Size** - Compress when possible
- **Organization** - Use folders
- **Access** - Set permissions

### Workflow Tips

#### Before Publishing
- [ ] Spell check
- [ ] Review formatting
- [ ] Check all links
- [ ] Verify images load
- [ ] Test on mobile
- [ ] Review SEO metadata
- [ ] Get approval if needed

#### Content Maintenance
- **Regular reviews** - Check for outdated content
- **Update dates** - When making changes
- **Version control** - Track major updates
- **Redirects** - When moving/deleting pages

#### Collaboration
- **Assign clearly** - Specific people, specific tasks
- **Set deadlines** - Realistic timeframes
- **Comment specifically** - Quote exact text
- **Resolve threads** - Mark discussions complete
- **Communicate** - Use @mentions

### Keyboard Shortcuts

#### Editor Shortcuts
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline
- `Ctrl/Cmd + K` - Insert link
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + S` - Save

#### Navigation Shortcuts
- `Ctrl/Cmd + /` - Search
- `Ctrl/Cmd + P` - Quick open document
- `Esc` - Close modals
- `?` - Show keyboard shortcuts

### Troubleshooting

#### Images Won't Upload
- Check file size (max 10MB default)
- Verify file format (PNG, JPEG, GIF, WebP)
- Check internet connection
- Try smaller file

#### Formatting Issues
- Use "Clear formatting" option
- Paste as plain text first
- Check for hidden characters
- Re-apply formatting

#### Link Problems
- Verify URL starts with http:// or https://
- Check for typos
- Test link after publishing
- Use internal links for site pages

#### Import Failures
- Check file format is supported
- Ensure file isn't corrupted
- Try smaller batches
- Review error messages

---

## Support & Resources

### Getting Help
- **Documentation** - This guide
- **Tooltips** - Hover over fields for help
- **Sanity Docs** - docs.sanity.io
- **Team Support** - Contact your admin

### Additional Resources
- **Component Library** - Reusable building blocks
- **Templates** - Pre-made structures
- **Style Guide** - Brand standards
- **Media Library** - Shared assets

---

## Quick Reference

### Document Statuses
- 🔘 **Draft** - Work in progress
- 🟡 **In Review** - Pending approval
- 🔵 **Approved** - Ready to publish
- 🟢 **Published** - Live on site
- ⚪ **Archived** - No longer active

### Callout Types
- 📝 Note
- 💡 Tip
- ⚠️ Warning
- 🚫 Danger
- ℹ️ Info
- 🔍 Abstract
- ✅ Success
- ❌ Failure
- ❓ Question
- 🐛 Bug
- 💬 Quote

### Media Types
- 📷 Images (with filters)
- 🎬 Videos (YouTube, Vimeo, upload)
- 🎵 Audio
- 📄 Files/Attachments
- 📊 Tables
- 🧜 Diagrams (Mermaid)
- ∑ Math (LaTeX)

### Tag Categories
- 🏷️ Topic
- 📊 Difficulty
- 👥 Audience
- 📄 Format
- 📍 Status
- 🏢 Department
- 📦 Product
- 🔢 Version
- ⭐ Priority

---

**Happy Editing! 🎉**

For questions or feedback, reach out to your content team.
