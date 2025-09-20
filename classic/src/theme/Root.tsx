import React from 'react';
import ScrollIndicator from '../components/ScrollIndicator';
import FloatingSearch from '../components/FloatingSearch';
import FloatingDarkModeToggle from '../components/FloatingDarkModeToggle';

export default function Root({children}) {
  // Handle theme from query parameters using client-side script
  React.useEffect(() => {
    const applyThemeFromQuery = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Support multiple query parameter formats
      const themeParams = ['theme', 'dark', 'darkMode', 'colorMode', 'mode'];
      
      for (const param of themeParams) {
        const value = urlParams.get(param);
        if (value) {
          const lowerValue = value.toLowerCase();
          
          // Dark mode values
          if (['dark', 'true', '1', 'on'].includes(lowerValue)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('docusaurus-theme', 'dark');
            return;
          }
          
          // Light mode values
          if (['light', 'false', '0', 'off'].includes(lowerValue)) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('docusaurus-theme', 'light');
            return;
          }
          
          // Auto mode values
          if (['auto', 'system'].includes(lowerValue)) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('docusaurus-theme', theme);
            return;
          }
        }
      }
    };

    // Apply theme immediately
    applyThemeFromQuery();
  }, []);

  return (
    <>
      <ScrollIndicator />
      <FloatingDarkModeToggle />
      {children}
    </>
  );
} 