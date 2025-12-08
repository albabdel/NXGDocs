const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PAYLOAD_URL = 'http://localhost:4000';
const DOCS_DIR = path.resolve(__dirname, '../classic/docs');
const EMAIL = 'abed.badarnah@nxgen.io';
const PASSWORD = 'Newpassword#04';

async function syncFromPayload() {
  console.log('🔄 Syncing from Payload to Docusaurus...\n');

  const loginResponse = await axios.post(`${PAYLOAD_URL}/api/users/login`, {
    email: EMAIL,
    password: PASSWORD
  });

  const api = axios.create({
    baseURL: PAYLOAD_URL,
    headers: { Authorization: `JWT ${loginResponse.data.token}` }
  });

  const response = await api.get('/api/pages', { params: { limit: 1000 } });
  const pages = response.data.docs;

  console.log(`Found ${pages.length} pages in Payload\n`);

  // Clear docs directory
  if (fs.existsSync(DOCS_DIR)) {
    fs.rmSync(DOCS_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  for (const page of pages) {
    const fileName = `${page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    const filePath = path.join(DOCS_DIR, fileName);

    const content = `---
title: ${page.title}
---

${page.content || ''}
`;

    fs.writeFileSync(filePath, content);
    console.log(`✅ ${fileName}`);
  }

  console.log(`\n✨ Synced ${pages.length} pages!`);
}

syncFromPayload().catch(error => {
  console.error('❌ Error:', error.response?.data || error.message);
});
