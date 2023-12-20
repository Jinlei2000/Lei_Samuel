import { createI18n, type I18nOptions } from 'vue-i18n'

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
  messages: {},
  missingWarn: false, // Disable missing key warnings
  fallbackWarn: false, // Disable fallback warnings
}

export const i18n = createI18n(i18nOptions)
