const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PAYLOAD_URL = 'http://localhost:4000';
const DOCS_DIR = path.resolve(__dirname, '../classic/docs');

async function syncNewArticles() {
  console.log('🔄 Syncing new articles from Payload...\n');

  // Login with your admin credentials
  const loginResponse = await axios.post(`${PAYLOAD_URL}/api/users/login`, {
    email: process.env.PAYLOAD_EMAIL || 'admin@example.com',
    password: process.env.PAYLOAD_PASSWORD || 'password'
  });

  const token = loginResponse.data.token;
  const api = axios.create({
    baseURL: PAYLOAD_URL,
    headers: { Authorization: `JWT ${token}` }
  });

  // Fetch all pages from Payload
  const response = await api.get('/api/pages');
  const pages = response.data.docs;

  console.log(`Found ${pages.length} pages in Payload\n`);

  for (const page of pages) {
    const fileName = `${page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    const filePath = path.join(DOCS_DIR, fileName);

    const content = `---
title: ${page.title}
---

${page.content || ''}
`;

    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${fileName}`);
  }

  console.log('\n✨ Sync complete!');
}

syncNewArticles().catch(error => {
  console.error('❌ Error:', error.response?.data || error.message);
});
