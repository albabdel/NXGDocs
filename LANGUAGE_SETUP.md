# Language System Setup

## What Changed

The language system now uses **client-side localStorage** instead of URL-based routing. This means:

✅ **No duplicate content needed** - Keep only English docs
✅ **No broken links** - All pages work in all languages
✅ **Easy to add languages** - Just add translation JSON files
✅ **Supports 3 languages** - English, German (Deutsch), Polish (Polski)

## How It Works

1. **User selects language** → Stored in localStorage
2. **Page reloads** → Reads localStorage preference
3. **UI translates** → Using JSON translation files
4. **Content stays same** → English docs for all (or translate via JSON)

## File Structure

```
classic/
├── src/
│   ├── components/
│   │   └── LanguageSwitcher/          # New language switcher
│   │       ├── index.tsx
│   │       └── styles.module.css
│   ├── theme/
│   │   └── Navbar/
│   │       └── Content/
│   │           └── index.tsx          # Injects switcher into navbar
│   ├── translations/                  # Translation files
│   │   ├── en.json
│   │   ├── de.json
│   │   └── pl.json
│   └── utils/
│       └── translations.ts            # Translation utilities
└── docusaurus.config.ts               # Simplified i18n config
```

## Adding More Translations

### 1. Add UI translations

Edit `src/translations/de.json` or `pl.json`:

```json
{
  "navbar.documentation": "Dokumentation",
  "your.custom.key": "Your translation"
}
```

### 2. Use in components

```tsx
import { t } from '@site/src/utils/translations';

function MyComponent() {
  return <h1>{t('your.custom.key')}</h1>;
}
```

## Adding a New Language

1. **Add to translations.ts**:
```ts
export const translations = {
  en: { code: 'en', name: 'English' },
  de: { code: 'de', name: 'Deutsch' },
  pl: { code: 'pl', name: 'Polski' },
  fr: { code: 'fr', name: 'Français' }, // New
};
```

2. **Create translation file**: `src/translations/fr.json`

3. **Import in translations.ts**:
```ts
import frTranslations from '../translations/fr.json';

const translationData = {
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
  fr: frTranslations, // New
};
```

## Removed

- ❌ `i18n/de/` folder (no longer needed)
- ❌ `FloatingLanguageToggle` component (replaced)
- ❌ URL-based locale routing (`/de/docs/...`)
- ❌ Duplicate markdown files requirement

## Testing

```bash
cd classic
npm run start
```

1. Click language switcher in navbar (top right)
2. Select German or Polish
3. Page reloads with stored preference
4. All links work without `/de` or `/pl` prefix

## Next Steps (Optional)

If you want to translate actual documentation content:

1. Add doc translations to JSON files with doc IDs as keys
2. Create a wrapper component that reads doc content
3. Replace content based on locale

For now, this setup handles all UI elements and keeps your docs in English.
