import {languageDetector} from 'hono/language';

export const i18n = languageDetector({
  supportedLanguages: ['en', 'pt'],
  fallbackLanguage: 'en',
});
