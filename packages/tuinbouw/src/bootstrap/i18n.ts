import { type I18nOptions, createI18n } from 'vue-i18n'

export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
}

export const DEFAULT_LOCALE = 'en'

export const i18nOptions: I18nOptions = {
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  legacy: false,
  messages: {
    en: {
      hello: 'hello world',
    },
    nl: {
      hello: 'hallo wereld',
    },
  },
}

export const i18n = createI18n(i18nOptions)
