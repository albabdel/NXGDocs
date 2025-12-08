# Multilingual Language Toggle Implementation Plan

## Overview
Extend the documentation platform to support 4 languages (English, German, Polish, Spanish) with automatic translation of main content from English source. The platform will seamlessly switch languages for customers.

## Current State Analysis
- **Docusaurus i18n**: Currently configured for English (en) and German (de) only
- **Translation Infrastructure**:
  - i18next setup exists with resources for en/de
  - JSON translation files exist for en, de, pl (UI strings)
  - FloatingLanguageToggle: Binary toggle (EN/DE only)
  - LanguageSwitcher: Supports 3 languages (EN, DE, PL) via dropdown
- **Search**: Configured for en/de only
- **Documentation Structure**: Main content in English with German translations in `/i18n/de/`

## Implementation Strategy

### Phase 1: Configuration Updates

#### 1.1 Update Docusaurus Config (`docusaurus.config.ts`)
- Add `es` to locales array: `locales: ['en', 'de', 'pl', 'es']`
- Update search plugin to support all 4 languages: `language: ['en', 'de', 'pl', 'es']`
- Keep `defaultLocale: 'en'`

#### 1.2 Update i18next Resources (`src/i18n/index.ts`)
- Add Spanish (es) resources with UI string translations
- Maintain namespace structure for consistency
- Add Polish (pl) resources (currently missing from i18next)

#### 1.3 Update Translation Utilities (`src/utils/translations.ts`)
- Add Spanish entry: `es: { code: 'es', name: 'Español' }`
- Update LocaleCode type to include all 4 languages
- No changes needed to storage/retrieval logic

### Phase 2: Automatic Translation Service

#### 2.1 Translation API Integration
**Two Options:**

**Option A (Recommended): Google Translate API**
- Most reliable and widely used
- Supports 100+ languages
- Excellent quality translations
- Requires API key (free tier available)
- Implementation: Create utility function to call Google Translate REST API

**Option B (Free Alternative): LibreTranslate**
- Open-source, privacy-friendly
- Can be self-hosted or use public API
- Good quality for European languages
- More limited than Google Translate
- Implementation: Similar REST API wrapper

**Recommendation**: Google Translate API for reliability

#### 2.2 Create Translation Utility Module (`src/utils/autoTranslate.ts`)
```typescript
// Features:
- translateText(text, targetLanguage, sourceLanguage='en'): Promise<string>
- translateMarkdown(mdContent, targetLanguage): Promise<string>
- cacheTranslations(source, target, translatedText): void
- getTranslationFromCache(source, target): string | null
- handleTranslationError(error): fallbackStrategy
```

**Caching Strategy:**
- Client-side localStorage cache for translations
- Reduces API calls and improves performance
- Persistent across sessions

#### 2.3 Environment Configuration
- Add `REACT_APP_GOOGLE_TRANSLATE_API_KEY` to `.env` files
- Add optional API timeout and retry logic
- Graceful degradation if API is unavailable

### Phase 3: Language Toggle Component Redesign

#### 3.1 Create New Unified Language Switcher
- Support 4 languages with dropdown or button group
- Support keyboard shortcuts: Alt+1/2/3/4 for each language
- Mobile-responsive design
- Full accessibility (ARIA labels, focus management)

#### 3.2 Update Component Features
- Persist language selection to localStorage (`gcxone-locale`)
- Show current language prominently
- Smooth transitions between language versions
- Show loading indicator while translation is in progress
- Error handling with fallback to English

#### 3.3 Integrate into Layout
- Add to Root.tsx for global availability
- Ensure consistent appearance on all pages
- Match existing design language

### Phase 4: Translation Files & Content

#### 4.1 Create Spanish UI Translation JSON (`src/translations/es.json`)
- Translate all keys from English version
- Maintain same structure and nesting
- Include common UI strings for consistency

#### 4.2 Update i18next Polish Resources
- Add Polish (pl) translations to i18next resources
- Pull content from existing `src/translations/pl.json`

#### 4.3 Documentation Structure
- Keep existing German translations
- Add auto-translation for Polish and Spanish on-demand
- Full manual translations can be added incrementally

### Phase 5: Build & Runtime Translation

#### 5.1 Client-Side Translation Strategy
- **Static Content (i18next strings)**: Use JSON files, cached by browser
- **Markdown Content**:
  - Lazy-load and cache translations
  - Translate on first page view
  - Store in localStorage for subsequent views
  - Fallback to English if translation fails

#### 5.2 Performance Optimization
- Lazy-load translations (don't translate until user requests language)
- Client-side caching reduces API calls by 90%+
- Debounce rapid language switches

### Phase 6: Testing & QA

#### 6.1 Testing Checklist
- [ ] Language switching works for all 4 languages
- [ ] Translations persist across page refreshes
- [ ] Keyboard shortcuts function correctly
- [ ] Mobile responsive and accessible
- [ ] Fallback to English when translation fails
- [ ] Search works in all languages
- [ ] No console errors
- [ ] Translation quality acceptable
- [ ] Performance: API calls < 500ms average
- [ ] Browser cache working properly

## Implementation Files to Modify/Create

### Modify (Existing)
1. `docusaurus.config.ts` - Add locales and update search plugin
2. `src/i18n/index.ts` - Add Spanish and Polish resources
3. `src/utils/translations.ts` - Add Spanish language entry
4. `src/components/FloatingLanguageToggle/index.tsx` - Update to 4-language
5. `src/theme/Root.tsx` - Ensure integration

### Create (New)
1. `src/utils/autoTranslate.ts` - Translation API wrapper and caching
2. `src/translations/es.json` - Spanish UI translations
3. `.env.example` - Template for API key

## API Integration Details

### Google Translate API Setup
```
Endpoint: https://translation.googleapis.com/language/translate/v2
Method: POST
Parameters:
- key: API_KEY
- q: text to translate
- target: target language code
- source: source language code

Free tier: Limited requests per day, $15-20/million chars after
```

## Rollout Plan
1. **Step 1**: Update Docusaurus config and add Spanish to translations.ts
2. **Step 2**: Create auto-translation utility with Google Translate API
3. **Step 3**: Update language toggle component for 4 languages
4. **Step 4**: Add Spanish/Polish i18next resources
5. **Step 5**: Test thoroughly and deploy

## Success Criteria
- ✅ All 4 languages selectable and working
- ✅ Seamless language switching
- ✅ Translations cached and performant
- ✅ No broken links when switching languages
- ✅ Search works in all languages
- ✅ Mobile and accessible
- ✅ User preference persisted

## Risks & Mitigation
| Risk | Mitigation |
|------|-----------|
| API rate limits | Aggressive client-side caching |
| Translation quality issues | Manual review and override capability |
| Performance degradation | Lazy-load, cache, comprehensive testing |
| Incomplete documentation | Auto-translation as fallback |
