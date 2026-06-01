/**
 * Theme context for global light/dark mode state.
 *
 * What this file is:
 * A React context that stores the active theme and exposes toggling helpers.
 *
 * What it does:
 * Persists theme in localStorage and syncs `data-theme` on <body> so CSS variables
 * switch automatically via the `[data-theme="dark"]` selector.
 *
 * Where it is used:
 * ThemeProvider wraps the entire app in main.jsx (outermost provider), and useTheme()
 * is consumed by UI controls like DarkModeToggle and themed components.
 */
import { createContext, useContext, useEffect, useState } from 'react'

// Create context object for theme values and actions.
const ThemeContext = createContext(null)

// Provider wraps app tree and supplies theme data to descendants.
export const ThemeProvider = ({ children }) => {
  // Load persisted theme once on mount; fallback to light when no prior selection exists.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    // Dark mode is controlled through data-theme on body, not class toggling.
    document.body.setAttribute('data-theme', theme)

    // Persist latest theme so refreshes restore the same mode.
    localStorage.setItem('theme', theme)
  }, [theme])

  // Toggle helper used by dark mode switches in header/settings areas.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    // Expose both value and mutators so consumers can read and update theme.
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook provides a clean, typed-like API for reading ThemeContext.
export const useTheme = () => {
  const context = useContext(ThemeContext)

  // Guard against accidental use outside provider to fail fast during development.
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
