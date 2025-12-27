const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const placeholderIndicators = [
  'Coming soon',
  'This documentation is currently being developed',
  'TODO',
  'Placeholder',
  'Under construction',
  'Content coming soon',
  'To be added',
  'Work in progress'
];

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, results);
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const wordCount = content.split(/\s+/).length;
      
      // Check for placeholder indicators
      const hasPlaceholders = placeholderIndicators.some(indicator => 
        content.toLowerCase().includes(indicator.toLowerCase())
      );
      
      // Consider articles with <200 words as potentially incomplete
      const isShort = wordCount < 200;
      
      if (hasPlaceholders || isShort) {
        const relativePath = path.relative(docsDir, filePath);
        results.push({
          path: relativePath,
          fullPath: filePath,
          wordCount,
          hasPlaceholders,
          isShort,
          category: relativePath.split('/')[0]
        });
      }
    }
  });
  
  return results;
}

console.log('=== PLACEHOLDER ARTICLE ANALYSIS ===\n');

const placeholderArticles = scanDirectory(docsDir);

// Group by category
const byCategory = {};
placeholderArticles.forEach(article => {
  if (!byCategory[article.category]) {
    byCategory[article.category] = [];
  }
  byCategory[article.category].push(article);
});

console.log(`Found ${placeholderArticles.length} articles needing content:\n`);

Object.keys(byCategory).sort().forEach(category => {
  console.log(`📁 ${category.toUpperCase()}:`);
  byCategory[category].forEach(article => {
    const status = article.hasPlaceholders ? '🔴 Placeholder' : '🟡 Short';
    console.log(`   ${status} ${article.path} (${article.wordCount} words)`);
  });
  console.log('');
});

// Save results for processing
fs.writeFileSync('placeholder-analysis.json', JSON.stringify(placeholderArticles, null, 2));
console.log('📊 Analysis saved to placeholder-analysis.json');
console.log(`\n=== SUMMARY ===`);
console.log(`Total articles to improve: ${placeholderArticles.length}`);
console.log(`Categories affected: ${Object.keys(byCategory).length}`);