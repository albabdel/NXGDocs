const fs = require('fs');
const path = require('path');

function fixFrontmatter(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix backslash escape sequences in tags
  content = content.replace(/category:([^']*\\[^']*)/g, (match, p1) => {
    return `category:${p1.replace(/\\/g, '/')}`;
  });
  
  fs.writeFileSync(filePath, content);
}

function scanAndFix(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanAndFix(filePath);
    } else if (file.endsWith('.md')) {
      try {
        fixFrontmatter(filePath);
      } catch (error) {
        console.log(`Error fixing ${filePath}: ${error.message}`);
      }
    }
  });
}

console.log('Fixing frontmatter escape sequences...');
scanAndFix(path.join(__dirname, 'docs'));
console.log('✅ Fixed frontmatter issues');