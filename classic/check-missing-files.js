const fs = require('fs');
const path = require('path');

// Read sidebar configuration
const sidebarPath = path.join(__dirname, 'sidebars.ts');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Extract file references from sidebar
const fileReferences = [];
const lines = sidebarContent.split('\n');

lines.forEach(line => {
  const match = line.match(/'([^']+)'/);
  if (match && match[1] && !match[1].includes('/') && !match[1].includes('generated-index')) {
    fileReferences.push(match[1]);
  }
});

// Check if files exist
const docsDir = path.join(__dirname, 'docs');
const missingFiles = [];

fileReferences.forEach(ref => {
  const filePath = path.join(docsDir, ref + '.md');
  if (!fs.existsSync(filePath)) {
    missingFiles.push(ref);
  }
});

console.log('Missing files:');
missingFiles.forEach(file => {
  console.log(`- ${file}.md`);
});

console.log(`\nTotal missing files: ${missingFiles.length}`);