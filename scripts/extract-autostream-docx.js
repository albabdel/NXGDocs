const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const DOCX_PATH = path.join(__dirname, '..', 'GCXONE_AutoStream_Guide.docx');
const OUTPUT_DIR = path.join(__dirname, '..', '.planning', 'features');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'autostream-full-content.md');

async function extractDocx() {
  console.log('Reading:', DOCX_PATH);
  
  const result = await mammoth.convertToMarkdown({ path: DOCX_PATH }, {
    styleMap: [
      "p[style-name='Heading 1'] => #",
      "p[style-name='Heading 2'] => ##",
      "p[style-name='Heading 3'] => ###",
      "p[style-name='Heading 4'] => ####",
      "p[style-name='Heading 5'] => #####",
      "p[style-name='Title'] => #",
    ]
  });
  
  const markdown = result.value;
  const messages = result.messages;
  
  if (messages.length > 0) {
    console.log('\nConversion messages:');
    messages.forEach(msg => console.log(' -', msg));
  }
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');
  console.log('\nSaved to:', OUTPUT_PATH);
  console.log('File size:', fs.statSync(OUTPUT_PATH).size, 'bytes');
}

extractDocx().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
