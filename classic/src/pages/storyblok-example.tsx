import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { getStory } from '../lib/storyblok';

interface StoryContent {
  _uid: string;
  component: string;
  [key: string]: any;
}

interface Story {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  content: StoryContent;
  created_at: string;
  published_at: string;
}

export default function StoryblokExample(): JSX.Element {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStory() {
      try {
        setLoading(true);
        // Replace 'home' with your actual story slug from Storyblok
        const data = await getStory('home');

        if (data) {
          setStory(data);
        } else {
          setError('Story not found. Create a story with slug "home" in Storyblok.');
        }
      } catch (err) {
        setError('Failed to load Storyblok content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, []);

  return (
    <Layout
      title="Storyblok Example"
      description="Example page demonstrating Storyblok integration">
      <div className="container margin-vert--lg">
        <h1>Storyblok Integration Example</h1>

        {loading && (
          <div>Loading content from Storyblok...</div>
        )}

        {error && (
          <div className="alert alert--danger" role="alert">
            <h4>Error</h4>
            <p>{error}</p>
            <p>
              <strong>Setup Instructions:</strong>
              <ol>
                <li>Go to <a href="https://app.storyblok.com/" target="_blank" rel="noopener">Storyblok Dashboard</a></li>
                <li>Create a new story with slug "home"</li>
                <li>Add some content fields</li>
                <li>Publish the story</li>
                <li>Refresh this page</li>
              </ol>
            </p>
          </div>
        )}

        {story && !loading && (
          <div>
            <div className="alert alert--success" role="alert">
              <h4>✅ Success! Storyblok content loaded</h4>
            </div>

            <div className="card margin-top--md">
              <div className="card__header">
                <h3>{story.name}</h3>
              </div>
              <div className="card__body">
                <p><strong>Slug:</strong> {story.slug}</p>
                <p><strong>Full Slug:</strong> {story.full_slug}</p>
                <p><strong>Created:</strong> {new Date(story.created_at).toLocaleDateString()}</p>
                <p><strong>Published:</strong> {story.published_at ? new Date(story.published_at).toLocaleDateString() : 'Not published'}</p>
              </div>
            </div>

            <div className="card margin-top--md">
              <div className="card__header">
                <h4>Story Content (Raw JSON)</h4>
              </div>
              <div className="card__body">
                <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                  <code>{JSON.stringify(story.content, null, 2)}</code>
                </pre>
              </div>
            </div>

            <div className="alert alert--info margin-top--md">
              <h4>Next Steps</h4>
              <ol>
                <li>Create more content types in Storyblok</li>
                <li>Build React components to render your content</li>
                <li>Set up the Visual Editor for live preview</li>
                <li>Deploy to Netlify and configure webhooks for instant updates</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
