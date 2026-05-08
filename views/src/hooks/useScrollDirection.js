// hooks/useScrollDirection.js
// Returns scrollY + hide/show state for headers that react to scroll direction.
// Used in: components/layout/Header.jsx

//*answers "is the user scrolling up or down, and should the header hide?"
//*Returns two things: the same scroll depth number, plus a boolean for whether the header should be hidden. Built specifically for the hide-on-scroll-down, show-on-scroll-up pattern.

import { useEffect, useRef, useState } from 'react'

const DIRECTION_THRESHOLD = 6   // px delta to trigger hide/show
const TOP_REVEAL_THRESHOLD = 24 // px from top — always show header here

export function useScrollDirection() {
    const [scrollY, setScrollY] = useState(0)
    const [isHidden, setIsHidden] = useState(false)
    const lastY = useRef(0)

    useEffect(() => {
        const handler = () => {
            const current = window.scrollY
            const delta = current - lastY.current

            if (current > TOP_REVEAL_THRESHOLD && delta > DIRECTION_THRESHOLD) {
                setIsHidden(true)
            } else if (delta < -DIRECTION_THRESHOLD || current <= TOP_REVEAL_THRESHOLD) {
                setIsHidden(false)
            }

            setScrollY(current)
            lastY.current = current
        }

        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    return { scrollY, isHidden }
}

export default useScrollDirection