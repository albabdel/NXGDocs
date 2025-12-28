import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Storyblok Bridge script
const STORYBLOK_BRIDGE_SCRIPT = 'https://app.storyblok.com/f/storyblok-v2-latest.js';

interface StoryblokStory {
  name: string;
  content: {
    title?: string;
    description?: string;
    body?: any;
  };
  slug: string;
}

function StoryblokPreviewComponent() {
  const location = useLocation();
  const [story, setStory] = useState<StoryblokStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get story slug from URL parameter
    const params = new URLSearchParams(location.search);
    const storyId = params.get('_storyblok') || params.get('path');

    if (!storyId) {
      setError('No story ID provided. Add ?_storyblok=STORY_ID to the URL.');
      setLoading(false);
      return;
    }

    // Load Storyblok Bridge script
    const script = document.createElement('script');
    script.src = STORYBLOK_BRIDGE_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Storyblok Bridge
      if (window.storyblok) {
        const accessToken = process.env.STORYBLOK_ACCESS_TOKEN;
        if (!accessToken) {
          setError('STORYBLOK_ACCESS_TOKEN environment variable not set');
          setLoading(false);
          return;
        }

        window.storyblok.init({
          accessToken: accessToken,
        });

        // Listen for story updates from Storyblok editor
        window.storyblok.on(['input', 'published', 'change'], (event) => {
          if (event.action === 'input') {
            // Live editing - story content changed
            setStory(event.story);
          } else if (event.action === 'published') {
            // Story published
            window.location.reload();
          } else if (event.action === 'change') {
            // Story changed
            window.location.reload();
          }
        });

        // Load initial story
        window.storyblok.get({
          slug: storyId,
          version: 'draft',
        }, (data) => {
          if (data.story) {
            setStory(data.story);
            setLoading(false);
          } else {
            setError('Story not found');
            setLoading(false);
          }
        });
      }
    };

    script.onerror = () => {
      setError('Failed to load Storyblok Bridge script');
      setLoading(false);
    };

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [location.search]);

  if (loading) {
    return (
      <Layout title="Preview Loading">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Loading Preview...</h1>
          <p>Connecting to Storyblok...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Preview Error">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Preview Error</h1>
          <p style={{ color: 'red' }}>{error}</p>
          <p>
            <small>
              Make sure you're opening this page from the Storyblok Visual Editor
              with a valid story ID.
            </small>
          </p>
        </div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout title="No Story">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>No Story Found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={story.content.title || story.name}>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col">
            <div
              data-storyblok-editable
              style={{
                border: '2px dashed #09b3af',
                padding: '2rem',
                borderRadius: '8px',
                minHeight: '400px',
              }}
            >
              <h1>{story.content.title || story.name}</h1>
              {story.content.description && (
                <p className="margin-bottom--lg">{story.content.description}</p>
              )}

              {/* Render body content */}
              {story.content.body && (
                <div>
                  {typeof story.content.body === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: story.content.body }} />
                  ) : (
                    <pre>{JSON.stringify(story.content.body, null, 2)}</pre>
                  )}
                </div>
              )}

              {/* Show live editing indicator */}
              <div
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  background: '#09b3af',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  zIndex: 9999,
                }}
              >
                🔴 LIVE PREVIEW
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Type declaration for window.storyblok
declare global {
  interface Window {
    storyblok: any;
  }
}

export default function StoryblokPreview() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => <StoryblokPreviewComponent />}
    </BrowserOnly>
  );
}
