/**
 * Page Content Translator
 * Translates page content in-place using Gemini API with caching
 */

import { translateText } from './autoTranslate';

// Element types to skip during translation
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'MATH', 'svg']);
const SKIP_CLASSES = new Set(['language-', 'docusaurus', 'navbar', 'menu', 'footer-link']);

interface TranslatedContent {
  originalText: string;
  translatedText: string;
  language: string;
}

// Store original text to avoid re-translating when switching back
const originalContentCache = new Map<string, string>();
const translationCache = new Map<string, Map<string, TranslatedContent>>();
// Map to store nodes with their original text for fast restoration
const nodeOriginalTextMap = new WeakMap<Text, string>();
let isTranslating = false; // Prevent concurrent translations

/**
 * Extract all translatable text nodes from the DOM
 * Preserves structure and skips non-content elements
 */
function extractTranslatableContent(): Array<{ node: Text; text: string }> {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Array<{ node: Text; text: string }> = [];
  let currentNode: Text | null;

  while ((currentNode = walker.nextNode() as Text | null)) {
    // Skip empty or whitespace-only nodes
    const text = currentNode.textContent?.trim();
    if (!text || text.length === 0) continue;

    // Skip nodes inside skipped elements
    let parent = currentNode.parentElement;
    let shouldSkip = false;

    while (parent) {
      if (SKIP_TAGS.has(parent.tagName)) {
        shouldSkip = true;
        break;
      }

      // Skip navbar, menus, footers, etc.
      if (parent.className) {
        for (const skipClass of SKIP_CLASSES) {
          if (parent.className.includes(skipClass)) {
            shouldSkip = true;
            break;
          }
        }
      }

      if (shouldSkip) break;
      parent = parent.parentElement;
    }

    if (!shouldSkip) {
      textNodes.push({ node: currentNode, text });
      // Store original text in node map for fast English restoration
      nodeOriginalTextMap.set(currentNode, text);
    }
  }

  return textNodes;
}

/**
 * Translate all page content to target language
 */
export async function translatePageContent(
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<void> {
  console.log(`[Page Translator] Starting translation to ${targetLanguage}`);

  // Prevent concurrent translations
  if (isTranslating) {
    console.log('[Page Translator] Translation already in progress, skipping');
    return;
  }

  if (targetLanguage === sourceLanguage) {
    console.log('[Page Translator] Target language same as source, skipping');
    return;
  }

  try {
    // If translating back to English, use cached original content (instant)
    if (targetLanguage === 'en') {
      console.log('[Page Translator] Restoring original English content');
      restoreOriginalContentFast();
      return;
    }

    isTranslating = true;

    // Extract all translatable content
    const textNodes = extractTranslatableContent();
    console.log(`[Page Translator] Extracted ${textNodes.length} text nodes from DOM`);

    if (textNodes.length === 0) {
      console.warn('[Page Translator] No text nodes found to translate');
      return;
    }

    // Get or create cache for this language pair
    const cacheKey = `${sourceLanguage}-${targetLanguage}`;
    if (!translationCache.has(cacheKey)) {
      translationCache.set(cacheKey, new Map());
    }
    const cache = translationCache.get(cacheKey)!;

    // Separate cached and uncached text
    const uncachedTexts: Array<{ index: number; text: string }> = [];
    const textToTranslate: string[] = [];

    textNodes.forEach((item, index) => {
      const cacheEntry = cache.get(item.text);
      if (!cacheEntry) {
        uncachedTexts.push({ index, text: item.text });
        textToTranslate.push(item.text);
      }
    });

    // Translate uncached texts via Gemini API
    if (textToTranslate.length > 0) {
      const translations = await translateBatch(textToTranslate, targetLanguage, sourceLanguage);

      // Cache the translations
      uncachedTexts.forEach(({ text }, i) => {
        const translatedText = translations[i];
        cache.set(text, {
          originalText: text,
          translatedText,
          language: targetLanguage,
        });
      });
    }

    // Update DOM with translations
    textNodes.forEach(({ node, text }) => {
      // Store original if not already stored
      if (!originalContentCache.has(text)) {
        originalContentCache.set(text, text);
      }

      const cacheEntry = cache.get(text);
      if (cacheEntry) {
        node.textContent = cacheEntry.translatedText;

        // Ensure parent elements are fully visible (fix CSS animation/overlay issues)
        const parent = node.parentElement;
        if (parent) {
          parent.style.opacity = '1';
          parent.style.visibility = 'visible';
        }
      }
    });
  } catch (error) {
    console.error('[Page Translator] Error translating page:', error);
    // Silently fail - page stays in original language
  } finally {
    isTranslating = false;
  }
}

/**
 * Get Gemini API key from multiple sources
 */
function getApiKey(): string {
  // Try multiple sources in order of preference

  // 1. Window object (if injected by api-config.js or docusaurus config)
  if (typeof window !== 'undefined') {
    if ((window as any).REACT_APP_GEMINI_API_KEY) {
      console.log('[Page Translator] Using API key from window object');
      return (window as any).REACT_APP_GEMINI_API_KEY;
    }

    // 2. Check localStorage for user-provided key
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('gcxone-gemini-api-key');
      if (stored) {
        console.log('[Page Translator] Using API key from localStorage');
        return stored;
      }
    }
  }

  // 3. Try import.meta (Vite)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY;
      if (key) {
        console.log('[Page Translator] Using API key from import.meta.env');
        return key;
      }
    }
  } catch (e) {
    // ignore
  }

  // 4. Try process.env (Webpack/Node) - only available at build time
  try {
    if (typeof process !== 'undefined' && process.env) {
      const key = process.env.REACT_APP_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (key) {
        console.log('[Page Translator] Using API key from process.env');
        return key;
      }
    }
  } catch (e) {
    // ignore
  }

  console.error('[Page Translator] ❌ No Gemini API key found. Checked:');
  console.error('  - window.REACT_APP_GEMINI_API_KEY');
  console.error('  - localStorage.gcxone-gemini-api-key');
  console.error('  - import.meta.env (Vite)');
  console.error('  - process.env (Build-time)');
  console.error('[Page Translator] Solution: Make sure /api-config.js is loaded or set REACT_APP_GEMINI_API_KEY in .env');
  return '';
}

/**
 * Batch translate multiple texts efficiently
 * Splits large batches into smaller chunks to handle API limits
 */
async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error('[Page Translator] No Gemini API key found. Skipping translation.');
    return texts;
  }

  // Split into smaller batches if needed (max 30 items per batch for better API response handling)
  const batchSize = 30;
  const batches: string[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    batches.push(texts.slice(i, i + batchSize));
  }

  console.log(`[Page Translator] Translating ${texts.length} items in ${batches.length} batch(es)...`);

  const allTranslations: string[] = [];

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    // Use a cleaner format that's easier for the API to parse
    const prompt = `Translate these ${batch.length} items from ${sourceLanguage} to ${targetLanguage}.
Format: Return only the translations, one per line, in the same order. No numbering, explanations, or extra text.

${batch.join('\n')}`;

    try {
      console.log(`[Page Translator] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} items)...`);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4000,
            topP: 0.95,
            topK: 40,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Page Translator] API Error:', error);
        allTranslations.push(...batch);
        continue;
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse response - split by newlines and clean up
      let batchTranslations = responseText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^[\d]+[\.\)]\s*/, '')); // Remove any leading numbers

      console.log(`[Page Translator] Batch ${batchIndex + 1}: Received ${batchTranslations.length} translations (expected ${batch.length})`);

      // If we got more translations than expected, take only the number we need
      if (batchTranslations.length > batch.length) {
        batchTranslations = batchTranslations.slice(0, batch.length);
        console.log('[Page Translator] Trimmed extra translations');
      }

      // Use translations if we got at least most of them
      if (batchTranslations.length >= batch.length * 0.8) {
        // Pad with originals if we're slightly short
        while (batchTranslations.length < batch.length) {
          batchTranslations.push(batch[batchTranslations.length]);
        }
        allTranslations.push(...batchTranslations);
      } else {
        console.warn(`[Page Translator] Batch ${batchIndex + 1}: Too few translations (${batchTranslations.length}/${batch.length}), using originals`);
        allTranslations.push(...batch);
      }
    } catch (error) {
      console.error(`[Page Translator] Error in batch ${batchIndex + 1}:`, error);
      allTranslations.push(...batch);
    }
  }

  const changedCount = allTranslations.filter((t, i) => t !== texts[i]).length;
  console.log(`[Page Translator] Successfully processed ${allTranslations.length} items (${changedCount} translated)`);
  return allTranslations;
}

/**
 * Restore original English content (instant, using WeakMap)
 */
function restoreOriginalContentFast(): void {
  // Get all currently translated nodes and restore them instantly
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  let currentNode: Text | null;
  let restored = 0;

  while ((currentNode = walker.nextNode() as Text | null)) {
    const originalText = nodeOriginalTextMap.get(currentNode);
    if (originalText && currentNode.textContent !== originalText) {
      currentNode.textContent = originalText;
      restored++;
    }
  }

  console.log(`[Page Translator] Restored ${restored} text nodes to English`);
}

/**
 * Clear translation cache to free memory
 */
export function clearTranslationCache(language?: string): void {
  if (language) {
    // Clear specific language
    for (const [key] of translationCache) {
      if (key.includes(language)) {
        translationCache.delete(key);
      }
    }
  } else {
    // Clear all
    translationCache.clear();
    originalContentCache.clear();
  }
}

/**
 * Get translation cache statistics
 */
export function getTranslationStats() {
  let totalEntries = 0;
  let totalSize = 0;

  for (const cache of translationCache.values()) {
    totalEntries += cache.size;
    for (const entry of cache.values()) {
      totalSize += entry.originalText.length + entry.translatedText.length;
    }
  }

  return {
    totalLanguagePairs: translationCache.size,
    totalEntries,
    approximateSize: `${(totalSize / 1024).toFixed(2)} KB`,
  };
}

/**
 * Check if content is cached for a language pair
 */
export function isCached(language: string, sourceLanguage: string = 'en'): boolean {
  const cacheKey = `${sourceLanguage}-${language}`;
  const cache = translationCache.get(cacheKey);
  return cache !== undefined && cache.size > 0;
}
