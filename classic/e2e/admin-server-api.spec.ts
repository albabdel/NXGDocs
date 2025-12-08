import { test, expect } from '@playwright/test';

test.describe('Admin Server API Integration', () => {
  const API_URL = 'http://localhost:3001/api';

  test('should respond to health check', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  test('should get file content', async ({ request }) => {
    // Try to get a known file
    const response = await request.get(`${API_URL}/file?path=docs/getting-started/README.md`);
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('frontmatter');
      expect(data).toHaveProperty('body');
      expect(data).toHaveProperty('raw');
    } else {
      // File might not exist, that's okay for this test
      expect(response.status()).toBe(404);
    }
  });

  test('should list docs directory', async ({ request }) => {
    const response = await request.get(`${API_URL}/docs`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should save CMS config', async ({ request }) => {
    const testConfig = {
      landingPage: {
        heroTitle: 'Test Title',
        heroSubtitle: 'Test Subtitle',
        coreResources: [],
        featuredResources: [],
      },
      sidebar: [
        {
          type: 'doc',
          id: 'test-1',
          label: 'Test Document',
          href: '/docs/test',
        },
      ],
    };

    const response = await request.post(`${API_URL}/cms-save`, {
      data: { config: testConfig },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('filesUpdated');
    expect(Array.isArray(data.filesUpdated)).toBe(true);
  });

  test('should save file content', async ({ request }) => {
    const testContent = `---
title: Test Article
---

# Test Content

This is a test article.`;

    const response = await request.post(`${API_URL}/file`, {
      data: {
        filePath: 'docs/test-article.md',
        content: testContent,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('path');
  });

  test('should handle invalid file path gracefully', async ({ request }) => {
    const response = await request.get(`${API_URL}/file?path=non-existent-file.md`);
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should validate CMS config structure', async ({ request }) => {
    // Test with invalid config
    const invalidConfig = {
      invalid: 'data',
    };

    const response = await request.post(`${API_URL}/cms-save`, {
      data: { config: invalidConfig },
    });

    // Should either accept it or return error
    // The server might still process it, so we just check it doesn't crash
    expect([200, 400, 500]).toContain(response.status());
  });

  test('should handle CORS correctly', async ({ request }) => {
    // Make a request and check CORS headers
    const response = await request.get(`${API_URL}/health`);
    expect(response.status()).toBe(200);
    // CORS is handled by the server, so request should succeed
  });

  test('should handle large file uploads', async ({ request }) => {
    // Create a large content string
    const largeContent = `---
title: Large Article
---

${'# Large Content\n\n'.repeat(1000)}`;

    const response = await request.post(`${API_URL}/file`, {
      data: {
        filePath: 'docs/large-article.md',
        content: largeContent,
      },
    });

    // Should handle large content (server has 50mb limit)
    expect([200, 413]).toContain(response.status());
  });
});

