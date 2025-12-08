const fs = require('fs');
const path = require('path');

function validateStructure() {
  const docsDir = path.join(__dirname, 'docs');
  const errors = [];
  const warnings = [];
  let totalFiles = 0;
  const slugs = new Set();

  function checkDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const categoryFile = path.join(fullPath, '_category_.json');
        if (!fs.existsSync(categoryFile)) {
          warnings.push(`Missing _category_.json in ${relativePath}/${item}`);
        }
        checkDirectory(fullPath, `${relativePath}/${item}`);
      } else if (item.endsWith('.md')) {
        totalFiles++;
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check frontmatter
        if (!content.startsWith('---')) {
          errors.push(`Missing frontmatter: ${relativePath}/${item}`);
        }
        
        // Extract slug from filename
        const slug = item.replace('.md', '');
        if (slugs.has(slug)) {
          errors.push(`Duplicate slug: ${slug}`);
        }
        slugs.add(slug);
        
        // Check for title
        if (!content.includes('title:')) {
          errors.push(`Missing title: ${relativePath}/${item}`);
        }
      }
    });
  }

  checkDirectory(docsDir);

  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log(`\nTotal files checked: ${totalFiles}`);
  console.log(`Unique slugs: ${slugs.size}`);
  
  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach(err => console.log(`  - ${err}`));
  } else {
    console.log('\n✅ No errors found!');
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(warn => console.log(`  - ${warn}`));
  } else {
    console.log('✅ No warnings!');
  }
  
  console.log('\n' + '='.repeat(60));
  
  return errors.length === 0;
}

const isValid = validateStructure();
process.exit(isValid ? 0 : 1);
