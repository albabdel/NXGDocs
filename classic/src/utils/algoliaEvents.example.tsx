/**
 * Example Usage of Algolia Event Tracking
 * 
 * This file demonstrates how to use the Algolia event tracking utilities
 * in your React components.
 */

import React, { useEffect } from 'react';
import {
  trackSearchClick,
  trackClick,
  trackSearchConversion,
  trackConversion,
  trackView,
  setAuthenticatedUserToken,
  getEffectiveUserToken,
} from './algoliaEvents';

// Example 1: Track click on search result
export function SearchResultItem({ hit, queryID, position }: {
  hit: { objectID: string; title: string; url: string };
  queryID: string;
  position: number;
}) {
  const handleClick = () => {
    // Track the click event
    trackSearchClick({
      index: 'Documentation site',
      queryID: queryID,
      objectID: hit.objectID,
      position: position,
      eventName: 'Documentation Clicked',
    });

    // Navigate to the page
    window.location.href = hit.url;
  };

  return (
    <div onClick={handleClick}>
      <h3>{hit.title}</h3>
    </div>
  );
}

// Example 2: Track conversion when user reads an article
export function ArticlePage({ articleId, queryID }: {
  articleId: string;
  queryID?: string;
}) {
  useEffect(() => {
    // Track view event when page loads
    trackView({
      index: 'Documentation site',
      objectID: articleId,
      eventName: 'Article Viewed',
    });

    // Track conversion when user scrolls to bottom (article read)
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // If user scrolled to bottom (within 100px)
      if (scrollPosition >= documentHeight - 100) {
        if (queryID) {
          // Conversion after search
          trackSearchConversion({
            index: 'Documentation site',
            queryID: queryID,
            objectID: articleId,
            eventName: 'Article Read',
          });
        } else {
          // Conversion without search context
          trackConversion({
            index: 'Documentation site',
            objectID: articleId,
            eventName: 'Article Read',
          });
        }

        // Remove listener after tracking
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, queryID]);

  return <div>Article content...</div>;
}

// Example 3: Track click on homepage recommendation
export function HomepageRecommendation({ item }: {
  item: { objectID: string; title: string; url: string };
}) {
  const handleClick = () => {
    // Track click without search context
    trackClick({
      index: 'Documentation site',
      objectID: item.objectID,
      eventName: 'Homepage Recommendation Clicked',
    });

    window.location.href = item.url;
  };

  return (
    <div onClick={handleClick}>
      <h3>{item.title}</h3>
    </div>
  );
}

// Example 4: Set authenticated user token after login
export function LoginHandler() {
  const handleLogin = async (userId: string) => {
    // After successful authentication, set the user token
    setAuthenticatedUserToken(userId);

    // Now all events will be linked to this user
    console.log('User token set for personalization');
  };

  return <button onClick={() => handleLogin('user-123')}>Login</button>;
}

// Example 5: Using user token in search requests
export function SearchComponent() {
  const performSearch = async (query: string) => {
    const userToken = getEffectiveUserToken();

    // Make search request with user token
    // This links the search with the user's event history
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userToken, // Include user token
        clickAnalytics: true, // Enable click analytics
      }),
    });

    const data = await response.json();
    return data;
  };

  return <div>Search component...</div>;
}

// Example 6: Track multiple conversion events
export function InteractiveDocumentation({ docId, queryID }: {
  docId: string;
  queryID?: string;
}) {
  const trackBookmark = () => {
    if (queryID) {
      trackSearchConversion({
        index: 'Documentation site',
        queryID: queryID,
        objectID: docId,
        eventName: 'Documentation Bookmarked',
      });
    } else {
      trackConversion({
        index: 'Documentation site',
        objectID: docId,
        eventName: 'Documentation Bookmarked',
      });
    }
  };

  const trackShare = () => {
    if (queryID) {
      trackSearchConversion({
        index: 'Documentation site',
        queryID: queryID,
        objectID: docId,
        eventName: 'Documentation Shared',
      });
    } else {
      trackConversion({
        index: 'Documentation site',
        objectID: docId,
        eventName: 'Documentation Shared',
      });
    }
  };

  return (
    <div>
      <button onClick={trackBookmark}>Bookmark</button>
      <button onClick={trackShare}>Share</button>
    </div>
  );
}

