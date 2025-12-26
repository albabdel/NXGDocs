import { storyblokInit, apiPlugin } from '@storyblok/react';
import StoryblokClient from 'storyblok-js-client';

// Storyblok configuration
const STORYBLOK_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN || 'lZ1VpFd6y9FjoNcJQFlXLAtt';
const STORYBLOK_REGION = process.env.STORYBLOK_REGION || 'eu';

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
    components: {
      // Register your Storyblok components here
      // Example: page: StoryblokPage,
      // article: StoryblokArticle,
    },
    apiOptions: {
      region: STORYBLOK_REGION,
    },
  });

  return true;
};

// Fetch a single story by slug
export async function getStory(slug: string, params = {}) {
  try {
    const response = await storyblokClient.get(`cdn/stories/${slug}`, params);
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
      version: 'draft', // Use 'published' in production
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
      version: 'draft',
      ...params,
    });
    return response.data.stories;
  } catch (error) {
    console.error(`Error fetching stories from ${folder}:`, error);
    return [];
  }
}

export default initStoryblok;
