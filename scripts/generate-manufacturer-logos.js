const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'integration-matrix.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'img', 'manufacturers');

function getManufacturerInitials(manufacturer) {
  const cleanName = manufacturer.replace(/[,\/]/g, ' ').trim();
  const words = cleanName.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 1) {
    const word = words[0];
    if (word.length <= 2) return word.toUpperCase();
    return word.substring(0, 2).toUpperCase();
  }
  
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function hashStringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  const saturation = 45 + (Math.abs(hash >> 8) % 30);
  const lightness = 35 + (Math.abs(hash >> 16) % 20);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function generateSVG(manufacturer, size = 200) {
  const initials = getManufacturerInitials(manufacturer);
  const bgColor = hashStringToColor(manufacturer);
  const fontSize = Math.floor(size * 0.4);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  <text x="${size/2}" y="${size/2}" 
        font-family="Arial, Helvetica, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central">${initials}</text>
</svg>`;
}

function sanitizeFilename(name) {
  return name.replace(/[,\/\\\s]+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase();
}

function extractManufacturers(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const manufacturers = new Set();
  
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.manufacturer) {
        manufacturers.add(item.manufacturer);
      }
    });
  }
  
  return Array.from(manufacturers).sort();
}

function main() {
  console.log('Extracting manufacturers from:', INPUT_FILE);
  
  const manufacturers = extractManufacturers(INPUT_FILE);
  console.log(`Found ${manufacturers.length} unique manufacturers:\n`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory:', OUTPUT_DIR);
  }
  
  let generated = 0;
  
  manufacturers.forEach(manufacturer => {
    const svg = generateSVG(manufacturer);
    const filename = sanitizeFilename(manufacturer) + '.svg';
    const outputPath = path.join(OUTPUT_DIR, filename);
    
    fs.writeFileSync(outputPath, svg);
    console.log(`  [OK] ${manufacturer} -> ${filename}`);
    generated++;
  });
  
  console.log(`\n========================================`);
  console.log(`Generated ${generated} placeholder logos`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`========================================`);
}

main();
