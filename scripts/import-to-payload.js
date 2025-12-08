const axios = require('axios');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PAYLOAD_URL = 'http://localhost:4000';
const DOCS_DIR = path.resolve(__dirname, '../classic/docs');

// You'll need to create a user first in Payload admin
// Then login to get a token
async function login() {
  const response = await axios.post(`${PAYLOAD_URL}/api/users/login`, {
    email: 'admin@example.com', // Change this
    password: 'password123'      // Change this
  });
  return response.data.token;
}

async function importDocs(token) {
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
  console.log(`Found ${files.length} markdown files`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const { data: frontmatter, content: body } = matter(content);
    
    const relativePath = path.relative(DOCS_DIR, file);
    const slug = relativePath.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');

    try {
      await api.post('/api/pages', {
        title: frontmatter.title || path.basename(file, path.extname(file)),
        content: body
      });
      console.log(`✅ Imported: ${slug}`);
    } catch (error) {
      console.error(`❌ Failed: ${slug}`, error.response?.data || error.message);
    }
  }
}

async function run() {
  console.log('🚀 Starting import...\n');
  console.log('⚠️  First, create an admin user in Payload:');
  console.log('   http://localhost:4000/admin\n');
  console.log('Then update the email/password in this script and run again.\n');
  
  // Uncomment when ready:
  // const token = await login();
  // await importDocs(token);
}

run();
