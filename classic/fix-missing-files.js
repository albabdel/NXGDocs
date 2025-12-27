const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'sidebars.ts');
const docsDir = path.join(__dirname, 'docs');

// Read sidebar content
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Extract all file references
const fileRefs = [];
const lines = sidebarContent.split('\n');

lines.forEach(line => {
  const matches = line.match(/'([^']+)'/g);
  if (matches) {
    matches.forEach(match => {
      const ref = match.replace(/'/g, '');
      if (ref.includes('/') && !ref.includes('generated-index') && !ref.includes('http')) {
        fileRefs.push(ref);
      }
    });
  }
});

// Check for missing files
const missingFiles = [];
const existingFiles = [];

fileRefs.forEach(ref => {
  const filePath = path.join(docsDir, ref + '.md');
  if (fs.existsSync(filePath)) {
    existingFiles.push(ref);
  } else {
    missingFiles.push(ref);
  }
});

console.log('=== SIDEBAR FILE AUDIT ===\n');
console.log(`Total references: ${fileRefs.length}`);
console.log(`Existing files: ${existingFiles.length}`);
console.log(`Missing files: ${missingFiles.length}\n`);

if (missingFiles.length > 0) {
  console.log('MISSING FILES:');
  missingFiles.forEach(file => {
    console.log(`❌ ${file}.md`);
  });
  
  console.log('\n=== CREATING PLACEHOLDER FILES ===\n');
  
  // Create missing files with basic content
  missingFiles.forEach(file => {
    const filePath = path.join(docsDir, file + '.md');
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create basic content
    const title = file.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const content = `---
id: ${file.split('/').pop()}
title: ${title}
sidebar_label: ${title}
---

# ${title}

This documentation is currently being developed.

## Overview

Coming soon...

## Configuration

Coming soon...

## Troubleshooting

Coming soon...
`;
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${file}.md`);
  });
} else {
  console.log('✅ All sidebar references have corresponding files!');
}

console.log('\n=== AUDIT COMPLETE ===');