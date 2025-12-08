import { GoogleGenerativeAI } from '@google/generative-ai';

// Language mappings for Gemini API
const LANGUAGE_MAPPINGS: Record<string, string> = {
  en: 'English',
  de: 'German',
  pl: 'Polish',
  es: 'Spanish',
};

// Cache configuration
const CACHE_PREFIX = 'gcxone_translation_';
const CACHE_EXPIRY_DAYS = 365; // Cache translations for 1 year

interface TranslationCacheEntry {
  translatedText: string;
  timestamp: number;
  expiresAt: number;
}

interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

// Initialize Gemini API
let genAI: GoogleGenerativeAI | null = null;
let translationModel: any = null;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize the Gemini API with the provided API key
 */
async function initializeGemini(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    if (genAI) return; // Already initialized

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY ||
                   process.env.VITE_GEMINI_API_KEY ||
                   (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY);

    if (!apiKey) {
      console.warn(
        'Gemini API key not found. Set REACT_APP_GEMINI_API_KEY or VITE_GEMINI_API_KEY environment variable. ' +
        'Translation will fall back to cached translations and English.'
      );
      return;
    }

    genAI = new GoogleGenerativeAI(apiKey);

    // Use structured JSON output for consistent translation responses
    translationModel = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object' as any,
          properties: {
            translatedText: {
              type: 'string' as any,
              description: 'The translated text in the target language',
            },
          },
          required: ['translatedText'],
        },
      },
    });
  })();

  return initializationPromise;
}

/**
 * Generate a cache key for a translation
 */
function getCacheKey(text: string, sourceLanguage: string, targetLanguage: string): string {
  // Create a hash-like key using text length and first/last chars
  const textHash = `${text.length}_${text.charCodeAt(0)}_${text.charCodeAt(text.length - 1)}`;
  return `${CACHE_PREFIX}${sourceLanguage}_${targetLanguage}_${textHash}`;
}

/**
 * Check if a cache entry is still valid
 */
function isCacheValid(entry: TranslationCacheEntry): boolean {
  return Date.now() < entry.expiresAt;
}

/**
 * Get translation from cache
 */
function getFromCache(text: string, sourceLanguage: string, targetLanguage: string): string | null {
  if (typeof window === 'undefined') return null;

  const cacheKey = getCacheKey(text, sourceLanguage, targetLanguage);

  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const entry: TranslationCacheEntry = JSON.parse(cached);
    if (!isCacheValid(entry)) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return entry.translatedText;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

/**
 * Store translation in cache
 */
function saveToCache(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  translatedText: string
): void {
  if (typeof window === 'undefined') return;

  const cacheKey = getCacheKey(text, sourceLanguage, targetLanguage);
  const expiresAt = Date.now() + CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  try {
    const entry: TranslationCacheEntry = {
      translatedText,
      timestamp: Date.now(),
      expiresAt,
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    // LocalStorage might be full or disabled
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Skipping cache.');
    } else {
      console.error('Cache storage error:', error);
    }
  }
}

/**
 * Translate text using Gemini API with fallback to cache
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string> {
  // Skip translation if source and target are the same
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  // Check cache first
  const cachedTranslation = getFromCache(text, sourceLanguage, targetLanguage);
  if (cachedTranslation) {
    return cachedTranslation;
  }

  // Initialize Gemini
  await initializeGemini();

  // If Gemini is not available, return original text
  if (!genAI || !translationModel) {
    console.warn(`Translation unavailable for ${sourceLanguage} -> ${targetLanguage}. Returning original text.`);
    return text;
  }

  try {
    const sourceLangName = LANGUAGE_MAPPINGS[sourceLanguage] || sourceLanguage;
    const targetLangName = LANGUAGE_MAPPINGS[targetLanguage] || targetLanguage;

    // Create a focused translation prompt
    const prompt = `You are a professional translator. Translate the following ${sourceLangName} text to ${targetLangName}.
Maintain the original tone, style, and formatting. Only return the translated text in JSON format.

Text: "${text.substring(0, 5000)}${text.length > 5000 ? '...' : ''}"`;

    const result = await translationModel.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    let translatedText: string;
    try {
      const jsonResponse = JSON.parse(responseText);
      translatedText = jsonResponse.translatedText || text;
    } catch {
      // If JSON parsing fails, try to extract text directly
      translatedText = responseText.trim();
    }

    // Save to cache
    saveToCache(text, sourceLanguage, targetLanguage, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);

    // Log more detailed error information
    if (error instanceof Error) {
      if (error.message.includes('429')) {
        console.warn('Rate limit reached. Please wait before translating again.');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        console.error('Authentication failed. Check your Gemini API key.');
      }
    }

    // Return original text as fallback
    return text;
  }
}

/**
 * Translate markdown content (preserving markdown structure)
 */
export async function translateMarkdown(
  mdContent: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string> {
  if (sourceLanguage === targetLanguage) {
    return mdContent;
  }

  // For now, translate the entire markdown as a block
  // More sophisticated paragraph-by-paragraph translation could be implemented
  return translateText(mdContent, targetLanguage, sourceLanguage);
}

/**
 * Batch translate multiple texts (more efficient)
 */
export async function batchTranslate(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string[]> {
  return Promise.all(
    texts.map((text) => translateText(text, targetLanguage, sourceLanguage))
  );
}

/**
 * Clear translation cache for a specific language pair
 */
export function clearCache(sourceLanguage?: string, targetLanguage?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        // If language pair specified, only clear matching entries
        if (sourceLanguage && targetLanguage) {
          if (key.includes(`${sourceLanguage}_${targetLanguage}`)) {
            localStorage.removeItem(key);
          }
        } else {
          // Clear all translation cache
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Cache clearing error:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  approximateSize: number;
} {
  if (typeof window === 'undefined') {
    return { totalEntries: 0, approximateSize: 0 };
  }

  try {
    let totalEntries = 0;
    let approximateSize = 0;

    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        totalEntries++;
        approximateSize += localStorage.getItem(key)?.length || 0;
      }
    }

    return {
      totalEntries,
      approximateSize,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { totalEntries: 0, approximateSize: 0 };
  }
}

/**
 * Preload translations for common terms (called on app startup)
 */
export async function preloadCommonTranslations(
  languages: string[] = ['de', 'pl', 'es']
): Promise<void> {
  const commonTerms = [
    'Documentation',
    'Account',
    'Settings',
    'Help',
    'Home',
    'Platform',
    'Features',
    'Support',
  ];

  for (const targetLang of languages) {
    for (const term of commonTerms) {
      // Fire and forget - don't wait for all to complete
      translateText(term, targetLang, 'en').catch((err) => {
        console.warn(`Failed to preload translation for "${term}" to ${targetLang}:`, err);
      });
    }
  }
}

export default {
  translateText,
  translateMarkdown,
  batchTranslate,
  clearCache,
  getCacheStats,
  preloadCommonTranslations,
};
