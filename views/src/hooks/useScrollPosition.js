// Returns current scroll Y as reactive state that updates on scroll. Not for critical performance code.
/*
Real world analogy: When you scroll down a page, the header shrinks. To do that, you need to know how far down the user has scrolled. useScrollPosition gives you that number in real-time.
*/

//*answers "how far down is the user?"
//*Returns a number. That's it. Any component that needs to know scroll depth uses this. In your project, the Header uses it to decide when to drop the transparent background (scrollY > 80).

/**
 * useScrollPosition() → scrollY (number)
 *
 * What it is:
 * A hook that returns the current vertical scroll position (Y in pixels) as reactive state.
 * Updates every time the user scrolls.
 *
 * Why we use it:
 * The Header needs to know when the user has scrolled past the hero section so it can add
 * a background and shadow. CSS alone cannot conditionally add a class based on scroll position.
 *
 * The mechanism:
 * Attaches a scroll event listener to window. Passive flag prevents scroll blocking. 
 * updates state. Removes listener on unmount.
 *
 * Primary use in this project:
 * Header.jsx reads scrollY. When scrollY > 80 (past hero), the header gets a solid background
 * and shadow. Without this, the sticky header is transparent over product content which makes
 * text unreadable.
 *
 * Used in these files:
 * - components/layout/Header.jsx
 */

import { useEffect, useState } from 'react'

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY : 0
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Sync once on mount in case the page was restored at a saved scroll offset.
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollY
}

export default useScrollPosition