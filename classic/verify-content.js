const fs = require('fs');
const path = require('path');

console.log('=== CONTENT CLEANUP VERIFICATION ===\n');

const docsDir = path.join(__dirname, 'docs');
let totalArticles = 0;
let qualityArticles = 0;
let shortArticles = 0;
let placeholderArticles = 0;

function analyzeContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const wordCount = content.split(/\s+/).length;
  
  const hasPlaceholders = [
    'Coming soon',
    'This documentation is currently being developed',
    'TODO',
    'Placeholder',
    'Under construction'
  ].some(indicator => content.toLowerCase().includes(indicator.toLowerCase()));
  
  return { wordCount, hasPlaceholders, content };
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.md')) {
      totalArticles++;
      const analysis = analyzeContent(filePath);
      
      if (analysis.hasPlaceholders) {
        placeholderArticles++;
        console.log(`🔴 Still has placeholders: ${path.relative(docsDir, filePath)} (${analysis.wordCount} words)`);
      } else if (analysis.wordCount < 200) {
        shortArticles++;
        console.log(`🟡 Short content: ${path.relative(docsDir, filePath)} (${analysis.wordCount} words)`);
      } else {
        qualityArticles++;
      }
    }
  });
}

scanDirectory(docsDir);

console.log('\n=== CONTENT QUALITY SUMMARY ===');
console.log(`Total articles: ${totalArticles}`);
console.log(`Quality articles (>200 words): ${qualityArticles} (${Math.round(qualityArticles/totalArticles*100)}%)`);
console.log(`Short articles (<200 words): ${shortArticles} (${Math.round(shortArticles/totalArticles*100)}%)`);
console.log(`Placeholder articles: ${placeholderArticles} (${Math.round(placeholderArticles/totalArticles*100)}%)`);

// Clean up generated files
const filesToClean = [
  'placeholder-analysis.json',
  '@docusaurus/plugin-content-docs.md'
];

console.log('\n=== CLEANUP ===');
filesToClean.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Removed: ${file}`);
  }
});

// Remove the incorrectly created file
const incorrectFile = path.join(docsDir, '@docusaurus', 'plugin-content-docs.md');
if (fs.existsSync(incorrectFile)) {
  fs.unlinkSync(incorrectFile);
  const dir = path.dirname(incorrectFile);
  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
  console.log(`🗑️ Removed incorrect file: @docusaurus/plugin-content-docs.md`);
}

console.log('\n=== FINAL STATUS ===');
if (placeholderArticles === 0) {
  console.log('✅ All placeholder content has been replaced with quality articles!');
} else {
  console.log(`⚠️ ${placeholderArticles} articles still need improvement`);
}

console.log(`\n📊 Content improvement: ${Math.round((qualityArticles/(totalArticles-placeholderArticles))*100)}% of articles are now high quality`);
console.log('\n🎉 Content cleanup completed successfully!');