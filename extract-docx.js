const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const inputFile = 'C:\\Users\\abdel\\.gemini\\antigravity\\scratch\\nxgen-docs\\GCXONE_AMS_Integration_Guide.docx';
const outputFile = '.planning/features/dc09-ams-full-content.md';

async function extractDocx() {
  console.log('Reading:', inputFile);
  
  const result = await mammoth.convertToMarkdown({ path: inputFile });
  
  const markdown = result.value;
  
  console.log('\n--- Extraction Messages ---');
  result.messages.forEach(msg => {
    console.log(msg.type + ': ' + msg.message);
  });
  
  fs.writeFileSync(outputFile, markdown, 'utf8');
  console.log('\nOutput saved to:', outputFile);
  console.log('Content length:', markdown.length, 'characters');
}

extractDocx().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
