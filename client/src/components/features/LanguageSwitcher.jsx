import { useLanguage } from '@/context/LanguageContext'
import { LANGUAGES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import './LanguageSwitcher.css'

export default function LanguageSwitcher({ className, showLabel = false }) {
  const { lang, setLang } = useLanguage()

  const currentIndex = LANGUAGES.findIndex((item) => item.code === lang)
  const currentLanguage = LANGUAGES[currentIndex !== -1 ? currentIndex : 0]

  const handleToggle = () => {
    const nextIndex = (currentIndex + 1) % LANGUAGES.length
    setLang(LANGUAGES[nextIndex].code)
  }

  return (
    <button
      type="button"
      className={cn('language-switcher', className)}
      onClick={handleToggle}
      aria-label={`Current language is ${currentLanguage.label}. Click to change.`}
    >
      <span className="language-switcher__abbr" aria-hidden="true">
        {currentLanguage.code.toUpperCase()}
      </span>
      {showLabel && <span className="language-switcher__label">{currentLanguage.label}</span>}
    </button>
  )
}