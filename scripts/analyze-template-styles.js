const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'extracted-template');

console.log('=== NXGEN Template Style Analysis ===\n');

const headerXml = fs.readFileSync(path.join(outputDir, 'word', 'header1.xml'), 'utf8');
const footerXml = fs.readFileSync(path.join(outputDir, 'word', 'footer1.xml'), 'utf8');
const documentXml = fs.readFileSync(path.join(outputDir, 'word', 'document.xml'), 'utf8');
const stylesXml = fs.readFileSync(path.join(outputDir, 'word', 'styles.xml'), 'utf8');

function extractColors(xml) {
  const colors = [];
  const colorMatches = xml.matchAll(/w:color[^>]*w:val="([^"]+)"/g);
  for (const match of colorMatches) {
    if (!colors.includes(match[1])) {
      colors.push(match[1]);
    }
  }
  return colors;
}

function extractFonts(xml) {
  const fonts = new Set();
  const fontMatches = xml.matchAll(/w:rFonts[^>]*w:ascii="([^"]+)"/g);
  for (const match of fontMatches) {
    fonts.add(match[1]);
  }
  const fontMatches2 = xml.matchAll(/w:font[^>]*w:name="([^"]+)"/g);
  for (const match of fontMatches2) {
    fonts.add(match[1]);
  }
  return Array.from(fonts);
}

function extractSizes(xml) {
  const sizes = [];
  const sizeMatches = xml.matchAll(/w:sz[^>]*w:val="(\d+)"/g);
  for (const match of sizeMatches) {
    const sizePt = parseInt(match[1]) / 2;
    if (!sizes.includes(sizePt)) {
      sizes.push(sizePt);
    }
  }
  return sizes.sort((a, b) => a - b);
}

function extractBorders(xml) {
  const borders = [];
  const borderMatches = xml.matchAll(/w:(bottom|top|left|right)[^>]*w:color="([^"]+)"[^>]*w:val="(\d+)"/g);
  for (const match of borderMatches) {
    borders.push({
      side: match[1],
      color: match[2],
      width: parseInt(match[3]) / 8
    });
  }
  return borders;
}

console.log('=== Header Colors ===');
console.log(extractColors(headerXml).map(c => `#${c}`));

console.log('\n=== Footer Colors ===');
console.log(extractColors(footerXml).map(c => `#${c}`));

console.log('\n=== Document Colors ===');
console.log(extractColors(documentXml).map(c => `#${c}`));

console.log('\n=== Fonts Used ===');
console.log(extractFonts(stylesXml));

console.log('\n=== Font Sizes (pt) ===');
console.log(extractSizes(stylesXml));

console.log('\n=== Borders ===');
console.log(extractBorders(headerXml));
console.log(extractBorders(footerXml));

console.log('\n=== Header Structure ===');
const headerTextMatches = headerXml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g);
for (const match of headerTextMatches) {
  if (match[1].trim()) {
    console.log(`  Text: "${match[1]}"`);
  }
}

const drawingMatches = headerXml.matchAll(/<wp:docPr[^>]*descr="([^"]*)"[^>]*name="([^"]*)"/g);
for (const match of drawingMatches) {
  console.log(`  Image: ${match[2]} - "${match[1]}"`);
}

const picMatches = headerXml.matchAll(/<wp:extent[^>]*cx="(\d+)"[^>]*cy="(\d+)"/g);
for (const match of picMatches) {
  const widthEmu = parseInt(match[1]);
  const heightEmu = parseInt(match[2]);
  const widthPx = Math.round(widthEmu / 9525);
  const heightPx = Math.round(heightEmu / 9525);
  console.log(`  Image dimensions: ${widthPx}px x ${heightPx}px`);
}

console.log('\n=== Footer Structure ===');
const footerTextMatches = footerXml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g);
for (const match of footerTextMatches) {
  if (match[1].trim()) {
    console.log(`  Text: "${match[1]}"`);
  }
}

console.log('\n=== Key Style Colors ===');
const styleDefs = stylesXml.matchAll(/<w:style[^>]*w:styleId="([^"]+)"[\s\S]*?<\/w:style>/g);
for (const match of styleDefs) {
  const styleId = match[1];
  const styleContent = match[0];
  
  const nameMatch = styleContent.match(/w:name[^>]*w:val="([^"]+)"/);
  const colorMatch = styleContent.match(/w:color[^>]*w:val="([^"]+)"/);
  const sizeMatch = styleContent.match(/w:sz[^>]*w:val="(\d+)"/);
  
  if (colorMatch || sizeMatch) {
    console.log(`\n${styleId} (${nameMatch ? nameMatch[1] : 'unnamed'}):`);
    if (colorMatch) console.log(`  Color: #${colorMatch[1]}`);
    if (sizeMatch) console.log(`  Size: ${parseInt(sizeMatch[1]) / 2}pt`);
  }
}

console.log('\n=== Logo Image ===');
const logoPath = path.join(outputDir, 'word', 'media', '1fbc5e66209d59c1209f9b2a895d86712639125a.png');
const base64Path = path.join(outputDir, 'word', 'media', '1fbc5e66209d59c1209f9b2a895d86712639125a.png.base64.txt');
if (fs.existsSync(logoPath)) {
  console.log(`Logo file: ${logoPath}`);
  console.log(`Size: ${fs.statSync(logoPath).size} bytes`);
  console.log(`Base64 available at: ${base64Path}`);
}

console.log('\n=== Summary for CSS ===');
console.log(`
Primary brand color: #C9A227 (gold/amber)
Secondary text color: #888888 (gray)
Document fonts: Arial, Calibri
`);
