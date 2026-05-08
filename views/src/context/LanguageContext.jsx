/**
 * Language and i18n context.
 *
 * What this file is:
 * A global context for current language, translation lookup, and text direction.
 *
 * What it does:
 * - Restores selected language from localStorage.
 * - Exposes `t(key)` translation helper with fallbacks.
 * - Applies `dir` and `lang` attributes on <html> so Arabic renders RTL properly.
 *
 * Where it is used:
 * LanguageProvider wraps the app in main.jsx, and useLanguage() is consumed by
 * Header controls, translated labels, and any page/component that needs `t()`.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { LANGUAGES } from '@/utils/constants'
import translations from '@/data/translations.json'

// Create language context for current lang code and translation actions.
const LanguageContext = createContext(null)

const languageCodes = new Set([
  ...LANGUAGES.map((item) => item.code),
  ...Object.keys(translations || {}),
])

const normalizeLanguage = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase()
  return languageCodes.has(normalizedValue) ? normalizedValue : 'en'
}

// Apply language direction and lang metadata on the document root.
const applyHtmlLanguageAttributes = (langCode) => {
  // Arabic uses RTL, all other supported languages use LTR.
  const dir = langCode === 'ar' ? 'rtl' : 'ltr'

  // Update HTML direction so layout/typography flow follows selected language.
  document.documentElement.setAttribute('dir', dir)

  // Update HTML lang attribute to improve accessibility and browser language hints.
  document.documentElement.setAttribute('lang', langCode)
}

// Provider exposes language state and localization helpers.
export const LanguageProvider = ({ children }) => {
  // Restore saved language or default to English.
  const [lang, setLang] = useState(() => normalizeLanguage(localStorage.getItem('lang')))

  useEffect(() => {
    // Keep document attributes synchronized whenever current language changes.
    applyHtmlLanguageAttributes(lang)
  }, [lang])

  // Translation helper used by UI text: returns active language value, then English fallback, then raw key.
  const t = (key, params = {}) => {
    const template = translations?.[lang]?.[key] || translations?.en?.[key] || key

    if (typeof template !== 'string') {
      return String(template ?? key)
    }

    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, token) =>
      Object.prototype.hasOwnProperty.call(params, token) ? String(params[token]) : ''
    )
  }

  // Language setter updates React state, persistence, and document attributes in one action.
  const handleSetLang = (nextLang) => {
    // Normalize unsupported values back to English to avoid undefined translation maps.
    const normalizedLang = normalizeLanguage(nextLang)

    // Update React state so consumers re-render with new language.
    setLang(normalizedLang)

    // Persist language for refresh/session continuity.
    localStorage.setItem('lang', normalizedLang)

    // Immediately apply RTL/LTR and lang metadata on the root document element.
    applyHtmlLanguageAttributes(normalizedLang)
  }

  return (
    // Expose selected language, setter, and translator function to all descendants.
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook for ergonomic context consumption.
export const useLanguage = () => {
  const context = useContext(LanguageContext)

  // Prevent silent failures if used outside LanguageProvider.
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
