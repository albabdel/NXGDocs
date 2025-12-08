# Visual CMS Setup Guide

## Quick Start

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

3. **Access CMS**: `http://localhost:3000/cms`

## Features

### Homepage Cards
- **Edit**: Click pencil icon
- **Delete**: Click trash icon
- **Add**: Click "Add Card" button
- **Reorder**: Drag using ⋮⋮ handle

### Text Editing
- Edit hero title/subtitle inline
- Edit section headings inline

### Sidebar
- Click "Edit Sidebar" in toolbar
- Drag to reorder

### Articles
- Navigate to any doc page in CMS mode
- Click "Edit Article" button
- Rich text editor with formatting, images, tables

### Saving
1. Click "Save Changes"
2. **Restart dev server** to see changes

## Troubleshooting

**Cannot connect to server**
- Run: `npm run admin:server`

**Changes not showing**
- Restart dev server after saving

**Drag not working**
- Grab ⋮⋮ handle, move 8px before dragging

