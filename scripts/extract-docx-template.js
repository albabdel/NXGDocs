const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const docxPath = path.join(__dirname, '..', 'NXGEN_Document_Template.docx');
const outputDir = path.join(__dirname, '..', 'extracted-template');

console.log('Extracting NXGEN Document Template...\n');

try {
  const zip = new AdmZip(docxPath);
  const entries = zip.getEntries();
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  zip.extractAllTo(outputDir, true);
  
  console.log('Extracted files:');
  entries.forEach(entry => {
    console.log(`  ${entry.entryName}`);
  });
  
  const documentXml = path.join(outputDir, 'word', 'document.xml');
  const stylesXml = path.join(outputDir, 'word', 'styles.xml');
  
  if (fs.existsSync(documentXml)) {
    const docContent = fs.readFileSync(documentXml, 'utf8');
    console.log('\n=== Document Structure ===');
    
    const sections = docContent.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [];
    console.log(`Found ${sections.length} paragraphs`);
    
    sections.slice(0, 20).forEach((section, i) => {
      const textMatch = section.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
      if (textMatch) {
        const text = textMatch.map(t => t.replace(/<[^>]*>/g, '')).join('');
        if (text.trim()) {
          console.log(`  Paragraph ${i + 1}: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`);
        }
      }
    });
  }
  
  const mediaDir = path.join(outputDir, 'word', 'media');
  if (fs.existsSync(mediaDir)) {
    console.log('\n=== Media Files ===');
    const mediaFiles = fs.readdirSync(mediaDir);
    mediaFiles.forEach(file => {
      const filePath = path.join(mediaDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${file} (${stats.size} bytes)`);
      
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.emf', '.wmf'].includes(ext)) {
        const base64 = fs.readFileSync(filePath).toString('base64');
        const mimeType = ext === '.png' ? 'image/png' : 
                        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                        ext === '.gif' ? 'image/gif' :
                        ext === '.emf' ? 'image/x-emf' :
                        ext === '.wmf' ? 'image/x-wmf' : 'image/png';
        console.log(`    Base64 length: ${base64.length} chars`);
        
        const base64Path = path.join(outputDir, `${file}.base64.txt`);
        fs.writeFileSync(base64Path, `data:${mimeType};base64,${base64}`);
        console.log(`    Saved base64 to: ${file}.base64.txt`);
      }
    });
  }
  
  if (fs.existsSync(stylesXml)) {
    const stylesContent = fs.readFileSync(stylesXml, 'utf8');
    console.log('\n=== Styles ===');
    
    const styleMatches = stylesContent.match(/<w:style[^>]*w:styleId="[^"]*"[\s\S]*?<\/w:style>/g) || [];
    console.log(`Found ${styleMatches.length} styles`);
    
    styleMatches.forEach(style => {
      const nameMatch = style.match(/w:name[^>]*w:val="([^"]*)"/);
      const idMatch = style.match(/w:styleId="([^"]*)"/);
      if (nameMatch && idMatch) {
        console.log(`  ${idMatch[1]}: ${nameMatch[1]}`);
      }
    });
  }
  
  const relsXml = path.join(outputDir, 'word', '_rels', 'document.xml.rels');
  if (fs.existsSync(relsXml)) {
    const relsContent = fs.readFileSync(relsXml, 'utf8');
    console.log('\n=== Relationships ===');
    
    const relMatches = relsContent.match(/<Relationship[^>]*>/g) || [];
    relMatches.forEach(rel => {
      const targetMatch = rel.match(/Target="([^"]*)"/);
      const typeMatch = rel.match(/Type="([^"]*)"/);
      if (targetMatch && typeMatch) {
        const type = typeMatch[1].split('/').pop();
        console.log(`  ${type}: ${targetMatch[1]}`);
      }
    });
  }
  
  console.log('\n=== Extraction complete ===');
  console.log(`Files extracted to: ${outputDir}`);
  
} catch (error) {
  console.error('Error:', error.message);
}
