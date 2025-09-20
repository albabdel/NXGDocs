/**
 * Theme utility functions for controlling dark mode via query parameters
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Get theme preference from query parameters
 * Supports multiple parameter names and values
 */
export function getThemeFromQueryParams(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  
  // Support multiple query parameter formats
  const themeParams = ['theme', 'dark', 'darkMode', 'colorMode', 'mode'];
  
  for (const param of themeParams) {
    const value = urlParams.get(param);
    if (value) {
      const lowerValue = value.toLowerCase();
      
      // Dark mode values
      if (['dark', 'true', '1', 'on'].includes(lowerValue)) {
        return 'dark';
      }
      
      // Light mode values
      if (['light', 'false', '0', 'off'].includes(lowerValue)) {
        return 'light';
      }
      
      // Auto mode values
      if (['auto', 'system'].includes(lowerValue)) {
        return 'auto';
      }
    }
  }
  
  return null;
}

/**
 * Apply theme based on query parameters
 */
export function applyThemeFromQueryParams(setColorMode: (theme: string) => void): void {
  const theme = getThemeFromQueryParams();
  
  if (theme) {
    if (theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(prefersDark ? 'dark' : 'light');
    } else {
      setColorMode(theme);
    }
    
    // Store preference for persistence
    localStorage.setItem('docusaurus-theme', theme);
  }
}

/**
 * Generate iframe URL with dark mode parameter
 */
export function generateIframeUrl(baseUrl: string, darkMode: boolean = false): string {
  const url = new URL(baseUrl);
  url.searchParams.set('theme', darkMode ? 'dark' : 'light');
  return url.toString();
}

/**
 * Check if current page was loaded with dark mode query parameter
 */
export function isDarkModeFromQuery(): boolean {
  const theme = getThemeFromQueryParams();
  return theme === 'dark';
}
