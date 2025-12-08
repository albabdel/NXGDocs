require('dotenv').config();
const express = require('express');
const payload = require('payload');

const app = express();

app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  const port = process.env.PORT || 4000;
  
  app.listen(port, () => {
    console.log(`\n✅ Payload CMS running at: http://localhost:${port}`);
    console.log(`📝 Admin panel: http://localhost:${port}/admin\n`);
  });
};

start();
