# CMS Quick Start Guide

## Setup (2 steps)

1. **Start Admin Server**
   ```bash
   cd classic
   npm run admin:server
   ```

2. **Start Dev Server** (separate terminal)
   ```bash
   cd classic
   npm start
   ```

## Using the CMS

### Access
Navigate to: `http://localhost:3000/cms`

### Features

#### Edit Homepage Cards
- **Edit**: Click pencil icon on any card
- **Delete**: Click trash icon on any card
- **Add**: Click "Add Card" button in each section
- **Reorder**: Drag cards using the ⋮⋮ handle

#### Edit Text
- **Hero Section**: Edit title and subtitle directly
- **Section Headings**: Edit headings and subtitles inline

#### Edit Sidebar
- Click "Edit Sidebar" in toolbar
- Reorder items by dragging
- Edit labels inline

#### Edit Articles
- Navigate to any doc page while in CMS mode
- Click "Edit Article" button
- Use rich text editor with:
  - Text formatting (bold, italic, code)
  - Headings (H1, H2, H3)
  - Lists (bullet, numbered)
  - Links and images
  - Tables
  - Code blocks

### Saving Changes

1. Click "Save Changes" in toolbar
2. Wait for success message
3. **Restart dev server** to see changes:
   ```bash
   # Stop with Ctrl+C, then:
   npm start
   ```

### Tips

- Changes are auto-saved to localStorage
- Export config anytime with "Export Config" button
- Server status shown in toolbar (green = online)
- Exit edit mode with "Exit Edit Mode" button

## Troubleshooting

**"Cannot connect to admin server"**
- Ensure admin server is running: `npm run admin:server`
- Check it's on port 3001

**Changes not showing**
- Restart dev server after saving
- Clear browser cache if needed

**Drag not working**
- Grab the ⋮⋮ handle (top-left of card)
- Move mouse 8px before drag activates
