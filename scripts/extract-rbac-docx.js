const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const docxPath = 'C:\\Users\\abdel\\.gemini\\antigravity\\scratch\\nxgen-docs\\RBAC-Documentation-v2 (3).docx';
const outputPath = '.planning/features/rbac-full-content.md';

async function extractDocx() {
  console.log('Reading DOCX file:', docxPath);
  
  const result = await mammoth.convertToMarkdown(docxPath, {
    styleMap: [
      "p[style-name='Heading 1'] => ##",
      "p[style-name='Heading 2'] => ###",
      "p[style-name='Heading 3'] => ####",
      "p[style-name='Heading 4'] => #####",
      "p[style-name='Title'] => #"
    ]
  });
  
  const markdown = result.value;
  const messages = result.messages;
  
  console.log('\n--- Extraction Messages ---');
  messages.forEach(msg => console.log(msg));
  
  console.log('\n--- Extracted Content Preview ---');
  console.log('Length:', markdown.length, 'characters');
  console.log('First 500 chars:\n', markdown.substring(0, 500));
  
  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log('\n--- Saved to:', outputPath);
  
  const stats = fs.statSync(outputPath);
  console.log('File size:', stats.size, 'bytes');
}

extractDocx().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
