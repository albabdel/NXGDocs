import express from 'express';
import payload from 'payload';

const app = express();

// Redirect root to payload admin
app.get('/', (_, res) => {
  res.redirect('/payload-admin');
});

const start = async () => {
  try {
    // Initialize Payload - config is loaded from PAYLOAD_CONFIG_PATH env var
    await payload.init({
      express: app,
      onInit: async () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Payload CMS running on http://localhost:${port}`);
      console.log(`Admin panel: http://localhost:${port}/payload-admin`);
    });
  } catch (error) {
    console.error('Error starting Payload:', error);
    process.exit(1);
  }
};

start();
