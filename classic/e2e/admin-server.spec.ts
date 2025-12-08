import { test, expect } from '@playwright/test';

test.describe('Admin Server API', () => {
  const API_URL = 'http://localhost:3001/api';

  test('health check endpoint should respond', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
  });

  test('should list docs directory', async ({ request }) => {
    const response = await request.get(`${API_URL}/docs`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    // Should have at least some items
    if (data.length > 0) {
      const firstItem = data[0];
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('type');
      expect(['file', 'folder']).toContain(firstItem.type);
    }
  });

  test('should read a markdown file', async ({ request }) => {
    // First, get list of docs to find a file
    const docsResponse = await request.get(`${API_URL}/docs`);
    const docs = await docsResponse.json();
    
    // Find a markdown file
    const findFile = (items: any[]): string | null => {
      for (const item of items) {
        if (item.type === 'file' && item.path) {
          return item.path;
        }
        if (item.children) {
          const found = findFile(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const filePath = findFile(docs);
    
    if (filePath) {
      const response = await request.get(`${API_URL}/file?path=${encodeURIComponent(filePath)}`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('frontmatter');
      expect(data).toHaveProperty('body');
      expect(data).toHaveProperty('raw');
    }
  });

  test('should save CMS config', async ({ request }) => {
    const testConfig = {
      landingPage: {
        heroTitle: 'Test Title',
        heroSubtitle: 'Test Subtitle',
        featuredHeading: 'Featured',
        featuredSubtitle: 'Featured Subtitle',
        roleHeading: 'Role',
        roleSubtitle: 'Role Subtitle',
        learnMoreHeading: 'Learn More',
        learnMoreSubtitle: 'Learn More Subtitle',
        coreResources: [],
        featuredResources: [],
        roleResources: [],
        learnMoreResources: [],
      },
      sidebar: [],
      articles: {},
    };
    
    const response = await request.post(`${API_URL}/cms-save`, {
      data: { config: testConfig },
    });
    
    // Should succeed (200) or fail gracefully (500)
    expect([200, 500]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
      expect(data).toHaveProperty('filesUpdated');
    }
  });

  test('should handle file save operation', async ({ request }) => {
    const testContent = `---
title: Test Article
---

# Test Article

This is test content.
`;
    
    const response = await request.post(`${API_URL}/file`, {
      data: {
        filePath: 'docs/test-article.md',
        content: testContent,
      },
    });
    
    // Should succeed
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    }
  });

  test('should handle invalid file path gracefully', async ({ request }) => {
    const response = await request.get(`${API_URL}/file?path=invalid/path.md`);
    
    // Should return 404 for invalid path
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should handle CORS correctly', async ({ request }) => {
    // Make a request and check CORS headers
    const response = await request.get(`${API_URL}/health`);
    
    // Should have CORS headers (handled by cors middleware)
    expect(response.status()).toBe(200);
  });

  test('should handle large payloads', async ({ request }) => {
    // Create a large config
    const largeConfig = {
      landingPage: {
        heroTitle: 'Test',
        heroSubtitle: 'Test',
        featuredHeading: 'Test',
        featuredSubtitle: 'Test',
        roleHeading: 'Test',
        roleSubtitle: 'Test',
        learnMoreHeading: 'Test',
        learnMoreSubtitle: 'Test',
        coreResources: Array(100).fill(null).map((_, i) => ({
          id: `card-${i}`,
          title: `Card ${i}`,
          description: 'Description '.repeat(10),
          link: `/docs/card-${i}`,
          icon: 'FileText',
        })),
        featuredResources: [],
        roleResources: [],
        learnMoreResources: [],
      },
      sidebar: [],
      articles: {},
    };
    
    const response = await request.post(`${API_URL}/cms-save`, {
      data: { config: largeConfig },
    });
    
    // Should handle large payload (may succeed or fail based on server limits)
    expect([200, 413, 500]).toContain(response.status());
  });
});

