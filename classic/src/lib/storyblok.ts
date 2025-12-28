import { storyblokInit, apiPlugin } from '@storyblok/react';
import StoryblokClient from 'storyblok-js-client';
import Page from '../components/storyblok/Page';
import DocPage from '../components/storyblok/DocPage';
import Feature from '../components/storyblok/Feature';
import Grid from '../components/storyblok/Grid';
import Teaser from '../components/storyblok/Teaser';

// Storyblok configuration
const STORYBLOK_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN || 'lZ1VpFd6y9FjoNcJQFlXLAtt';
const STORYBLOK_REGION = process.env.STORYBLOK_REGION || 'eu';
const STORYBLOK_IS_PREVIEW = process.env.STORYBLOK_IS_PREVIEW === 'true';

// Create Storyblok client
export const storyblokClient = new StoryblokClient({
  accessToken: STORYBLOK_TOKEN,
  region: STORYBLOK_REGION as 'eu' | 'us' | 'ap' | 'ca' | 'cn',
});

// Initialize Storyblok for React components
export const initStoryblok = () => {
  if (!STORYBLOK_TOKEN) {
    console.warn('⚠️ STORYBLOK_ACCESS_TOKEN not set in environment variables');
    return null;
  }

  storyblokInit({
    accessToken: STORYBLOK_TOKEN,
    use: [apiPlugin],
    bridge: STORYBLOK_IS_PREVIEW, // Enable bridge only in preview mode
    components: {
      // Register all Storyblok components
      page: Page,
      doc_page: DocPage,
      feature: Feature,
      grid: Grid,
      teaser: Teaser,
    },
    apiOptions: {
      region: STORYBLOK_REGION,
    },
  });

  console.log(`✅ Storyblok initialized (Preview: ${STORYBLOK_IS_PREVIEW})`);
  return true;
};

// Get version based on environment
export function getVersion() {
  return STORYBLOK_IS_PREVIEW ? 'draft' : 'published';
}

// Fetch a single story by slug
export async function getStory(slug: string, params = {}) {
  try {
    const response = await storyblokClient.get(`cdn/stories/${slug}`, {
      version: getVersion(),
      ...params,
    });
    return response.data.story;
  } catch (error) {
    console.error(`Error fetching story ${slug}:`, error);
    return null;
  }
}

// Fetch all stories
export async function getAllStories(params = {}) {
  try {
    const response = await storyblokClient.get('cdn/stories', {
      version: getVersion(),
      ...params,
    });
    return response.data.stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

// Fetch stories by folder
export async function getStoriesByFolder(folder: string, params = {}) {
  try {
    const response = await storyblokClient.get('cdn/stories', {
      starts_with: folder,
      version: getVersion(),
      ...params,
    });
    return response.data.stories;
  } catch (error) {
    console.error(`Error fetching stories from ${folder}:`, error);
    return [];
  }
}

export default initStoryblok;
