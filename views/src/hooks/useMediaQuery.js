import { useCallback, useSyncExternalStore } from 'react'

export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {}

      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', onStoreChange)

      return () => mediaQueryList.removeEventListener('change', onStoreChange)
    },
    [query]
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}


// A simple hook for media queries. Not for critical performance code.
/*
Without it: You can hide elements with CSS media queries, but you cannot conditionally run JavaScript based on screen size. If you want to show MobileMenu only on mobile and attach a click-outside listener only on desktop, CSS can't help you.
With it: useMediaQuery returns a boolean that updates in real-time as the window resizes. Use it in JS logic, not just CSS display.
*/

/**
 * useMediaQuery(query) → boolean
 *
 * A hook that returns true or false for a CSS media query string.
 * Updates in real time as the window resizes. Responsive logic inside JavaScript.
 *
 * Why we use it:
 * CSS media queries control styling, but you cannot use CSS to conditionally run
 * JavaScript or render different components. This brings responsive logic into JS.
 *
 * The mechanism:
 * Uses window.matchMedia() browser API. Listens for resize events via
 * addEventListener('change'). Returns the current match result as reactive state.
 *
 * Without it:
 * You can hide the hamburger menu with CSS display:none, but you cannot stop the
 * mobile menu's click-outside listener from running on desktop. You need JS-level
 * awareness of screen size.
 *
 * With it:
 * isMobile = useMediaQuery('(max-width: 768px)'). Conditionally render components,
 * attach/detach listeners, enable/disable features — all in JavaScript, updating as
 * the window resizes.
 *
 * Used in:
 * - components/layout/Header.jsx
 * - components/layout/MobileMenu.jsx
 * - components/features/FluidCursor.jsx
 * - components/product/ProductGrid.jsx
 */