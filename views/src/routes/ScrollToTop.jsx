/**
 * Route scroll reset helper.
 *
 * What this file is:
 * A side-effect component that listens for route path changes.
 *
 * What it does:
 * On every pathname change, it scrolls the window back to top smoothly.
 *
 * Where it is used:
 * Rendered once inside Layout.jsx so it applies to all routes globally.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// This component renders nothing and only performs side effects.
export default function ScrollToTop() {
  // Read current pathname from router location object.
  const { pathname } = useLocation()

  useEffect(() => {
    // Browsers can preserve old scroll position between routes; reset to top on navigation.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname]) // runs every time pathname changes — i.e. every route navigation

  // Return null because this utility has no visual output.
  return null
}
