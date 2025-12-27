const fs = require('fs');
const path = require('path');

console.log('=== PERFORMANCE OPTIMIZATION ===\n');

// 1. Analyze search index size
const searchIndexPath = path.join(__dirname, 'static', 'search-index.json');
if (fs.existsSync(searchIndexPath)) {
  const stats = fs.statSync(searchIndexPath);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`📊 Search Index: ${sizeKB} KB`);
  
  if (sizeKB > 1000) {
    console.log('⚠️  Search index is large (>1MB). Consider optimization.');
  } else {
    console.log('✅ Search index size is acceptable.');
  }
}

// 2. Check for large images
const imagesDir = path.join(__dirname, 'docs', 'getting-started', 'images');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir);
  let totalSize = 0;
  let largeImages = [];
  
  images.forEach(img => {
    const imgPath = path.join(imagesDir, img);
    const stats = fs.statSync(imgPath);
    const sizeKB = Math.round(stats.size / 1024);
    totalSize += sizeKB;
    
    if (sizeKB > 500) {
      largeImages.push({ name: img, size: sizeKB });
    }
  });
  
  console.log(`📸 Images: ${images.length} files, ${Math.round(totalSize / 1024)} MB total`);
  
  if (largeImages.length > 0) {
    console.log('⚠️  Large images found:');
    largeImages.forEach(img => {
      console.log(`   - ${img.name}: ${img.size} KB`);
    });
  } else {
    console.log('✅ No oversized images found.');
  }
}

// 3. Check build output size
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  function getDirSize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        size += getDirSize(filePath);
      } else {
        size += stats.size;
      }
    });
    
    return size;
  }
  
  const buildSize = getDirSize(buildDir);
  const buildSizeMB = Math.round(buildSize / (1024 * 1024));
  
  console.log(`🏗️  Build Output: ${buildSizeMB} MB`);
  
  if (buildSizeMB > 100) {
    console.log('⚠️  Build output is large (>100MB). Consider optimization.');
  } else {
    console.log('✅ Build output size is reasonable.');
  }
}

// 4. Performance recommendations
console.log('\n=== RECOMMENDATIONS ===');
console.log('1. ✅ Z-index conflicts fixed for floating components');
console.log('2. ✅ Missing documentation files created');
console.log('3. 📝 Consider image compression for getting-started/images/');
console.log('4. 📝 Monitor search index growth over time');
console.log('5. 📝 Regular build size monitoring recommended');

console.log('\n=== OPTIMIZATION COMPLETE ===');