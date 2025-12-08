const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get file content
app.get('/api/file', async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.query.path);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);
    res.json({
      frontmatter: parsed.data,
      body: parsed.content,
      raw: content
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Save file
app.post('/api/file', async (req, res) => {
  try {
    const { filePath, content } = req.body;
    const fullPath = path.join(__dirname, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
    res.json({ success: true, path: filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.delete('/api/file', async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.query.path);
    await fs.unlink(filePath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List docs directory
app.get('/api/docs', async (req, res) => {
  try {
    const docsPath = path.join(__dirname, 'docs');
    const files = await listDirectory(docsPath, 'docs');
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function listDirectory(dirPath, relativePath = '') {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const result = [];
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const relPath = path.join(relativePath, item.name);
    
    if (item.isDirectory()) {
      const children = await listDirectory(itemPath, relPath);
      result.push({
        name: item.name,
        path: relPath,
        type: 'folder',
        children
      });
    } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
      result.push({
        name: item.name,
        path: relPath,
        type: 'file'
      });
    }
  }
  
  return result;
}

// Save CMS config (updates index.tsx and sidebars.ts)
app.post('/api/cms-save', async (req, res) => {
  try {
    const { config } = req.body;
    
    // Update index.tsx
    const indexPath = path.join(__dirname, 'src', 'pages', 'index.tsx');
    let indexContent = await fs.readFile(indexPath, 'utf-8');
    
    // Replace landing page data
    const landingPageJson = JSON.stringify(config.landingPage, null, 2);
    indexContent = indexContent.replace(
      /const landingPageData = \{[\s\S]*?\};/,
      `const landingPageData = ${landingPageJson};`
    );
    
    await fs.writeFile(indexPath, indexContent, 'utf-8');
    
    // Update sidebars.ts
    const sidebarsPath = path.join(__dirname, 'sidebars.ts');
    const sidebarItems = config.sidebar.map(item => formatSidebarItem(item)).join(',\n    ');
    const sidebarsContent = `import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    ${sidebarItems}
  ],
};

export default sidebars;
`;
    
    await fs.writeFile(sidebarsPath, sidebarsContent, 'utf-8');
    
    res.json({ success: true, filesUpdated: ['index.tsx', 'sidebars.ts'] });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message });
  }
});

function formatSidebarItem(item, indent = 4) {
  const spaces = ' '.repeat(indent);
  let result = `${spaces}{\n`;
  
  if (item.type) result += `${spaces}  type: '${item.type}',\n`;
  if (item.label) result += `${spaces}  label: "${item.label}",\n`;
  if (item.href) result += `${spaces}  href: "${item.href}",\n`;
  if (item.value) result += `${spaces}  value: '${item.value}',\n`;
  if (item.dirName) result += `${spaces}  dirName: "${item.dirName}",\n`;
  if (item.defaultStyle !== undefined) result += `${spaces}  defaultStyle: ${item.defaultStyle},\n`;
  if (item.collapsible !== undefined) result += `${spaces}  collapsible: ${item.collapsible},\n`;
  if (item.collapsed !== undefined) result += `${spaces}  collapsed: ${item.collapsed},\n`;
  
  if (item.link) {
    result += `${spaces}  link: { type: "${item.link.type}" },\n`;
  }
  
  if (item.items && item.items.length > 0) {
    result += `${spaces}  items: [\n`;
    result += item.items.map(child => formatSidebarItem(child, indent + 4)).join(',\n');
    result += `\n${spaces}  ],\n`;
  }
  
  result += `${spaces}}`;
  return result;
}

app.listen(PORT, () => {
  console.log(`✅ Admin server running on http://localhost:${PORT}`);
  console.log(`📝 CMS available at http://localhost:3000/cms`);
});
