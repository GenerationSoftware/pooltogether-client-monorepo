/**
 * Supported language IDs
 */
export type LANGUAGE_ID =
  | 'en'
  | 'es'
  | 'de'
  | 'fr'
  | 'hi'
  | 'it'
  | 'ko'
  | 'pt'
  | 'ru'
  | 'tr'
  | 'zh'
  | 'fil'
  | 'uk'

/**
 * Supported languages' data
 */
export const SUPPORTED_LANGUAGES: Record<LANGUAGE_ID, { name: string; nativeName: string }> = {
  en: {
    name: 'English',
    nativeName: 'English'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch'
  },
  fr: {
    name: 'French',
    nativeName: 'Français'
  },
  hi: {
    name: 'Hindi',
    nativeName: 'Hindī'
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiana'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어 (韓國語)'
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português'
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский'
  },
  tr: {
    name: 'Turkish',
    nativeName: 'Türkçe'
  },
  zh: {
    name: 'Zhōngwén',
    nativeName: '中文'
  },
  fil: {
    name: 'Filipino',
    nativeName: 'Filipino'
  },
  uk: {
    name: 'Ukrainian',
    nativeName: 'українську'
  }
}
