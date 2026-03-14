import { useEffect } from 'react';
import aa from 'search-insights';

/**
 * Algolia Insights Initialization Component
 * 
 * Initializes the search-insights library for tracking user interactions
 * with Algolia search. This enables:
 * - Click events tracking
 * - Conversion events tracking
 * - View events tracking
 * - Personalization support
 */
export default function AlgoliaInsights() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Get credentials from window object (set by Docusaurus or api-config.js)
    // Fallback to hardcoded values if not available
    const appId = 
      (window as any).ALGOLIA_APP_ID || 
      (window as any).__docusaurus?.config?.themeConfig?.algolia?.appId ||
      '0QV3FAFAD5';

    const apiKey =
      (window as any).ALGOLIA_API_KEY ||
      (window as any).__docusaurus?.config?.themeConfig?.algolia?.apiKey ||
      'f479e424871288c2e571a23557f7a62b';

    // Initialize Algolia Insights
    aa('init', {
      appId: appId,
      apiKey: apiKey,
      // Enable cookie-based user tracking (with user consent)
      useCookie: true,
      // Allow partial initialization for better performance
      partial: true,
    });

    // Make aa available globally for event tracking
    (window as any).aa = aa;
  }, []);

  return null; // This component doesn't render anything
}

