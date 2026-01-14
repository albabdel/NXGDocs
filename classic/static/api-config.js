// Inject API keys into window object
// This file is loaded before the React app initializes
// You can override these values by setting environment variables or editing this file

// Gemini API Key
window.REACT_APP_GEMINI_API_KEY = 'AIzaSyCJEhGHl_wPaNPpwi9oPaP04R5TXvqg_5I';

// Algolia Credentials
// Application ID: V5T3AW2AU9
// Search API key: faaa9ffb8640ba49520a0cf44dc9f7ef (used for search and insights)
window.ALGOLIA_APP_ID = 'V5T3AW2AU9';
window.ALGOLIA_API_KEY = 'faaa9ffb8640ba49520a0cf44dc9f7ef';

console.log('[API Config] Gemini API key injected:', window.REACT_APP_GEMINI_API_KEY ? 'YES' : 'NO');
console.log('[API Config] Algolia App ID:', window.ALGOLIA_APP_ID || 'NOT SET');
console.log('[API Config] Algolia API Key:', window.ALGOLIA_API_KEY ? 'SET' : 'NOT SET');
