import { useTheme } from '@/context/ThemeContext'
import { FiMoon, FiSun } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import './DarkModeToggle.css'

export default function DarkModeToggle({ className, showLabel = false }) {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <button 
      type="button" 
      className={cn('dark-mode-toggle', className)} 
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="dark-mode-toggle__icon-wrapper">
        {isDark ? (
          <FiMoon className="dark-mode-toggle__icon dark-mode-toggle__icon--moon" aria-hidden="true" />
        ) : (
          <FiSun className="dark-mode-toggle__icon dark-mode-toggle__icon--sun" aria-hidden="true" />
        )}
      </span>
      {showLabel && <span className="dark-mode-toggle__label">{showLabel === true ? ' Theme' : ` ${showLabel}`}</span>}
    </button>
  )
}
