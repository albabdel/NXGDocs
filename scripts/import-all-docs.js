const axios = require('axios');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PAYLOAD_URL = 'http://localhost:4000';
const DOCS_DIR = path.resolve(__dirname, '../classic/docs');
const EMAIL = 'abed.badarnah@nxgen.io';
const PASSWORD = 'Newpassword#04';

async function importAllDocs() {
  console.log('🚀 Importing all docs to Payload...\n');

  // Login
  const loginResponse = await axios.post(`${PAYLOAD_URL}/api/users/login`, {
    email: EMAIL,
    password: PASSWORD
  });
  const token = loginResponse.data.token;

  const api = axios.create({
    baseURL: PAYLOAD_URL,
    headers: { Authorization: `JWT ${token}` }
  });

  // Get all markdown files
  function getMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getMarkdownFiles(filePath, fileList);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        fileList.push(filePath);
      }
    });
    return fileList;
  }

  const files = getMarkdownFiles(DOCS_DIR);
  console.log(`Found ${files.length} files\n`);

  let imported = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data: frontmatter, content: body } = matter(content);
      
      const relativePath = path.relative(DOCS_DIR, file);
      const title = frontmatter.title || path.basename(file, path.extname(file));

      await api.post('/api/pages', {
        title: title,
        content: body
      });

      console.log(`✅ ${relativePath}`);
      imported++;
    } catch (error) {
      console.error(`❌ ${path.basename(file)}: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed: ${failed}`);
}

importAllDocs().catch(error => {
  console.error('❌ Error:', error.response?.data || error.message);
});
