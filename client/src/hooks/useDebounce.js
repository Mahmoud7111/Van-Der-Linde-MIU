import { useEffect, useState } from 'react'

/**
 * Delay value updates until no new changes happen within `delay` ms.
 * Useful for search/filter inputs to reduce repeated service calls.
 */
export default function useDebounce(value, delay = 300) {
  const normalizedDelay = Number.isFinite(Number(delay)) ? Math.max(0, Number(delay)) : 300
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, normalizedDelay)

    // Cancel pending update when value/delay changes or component unmounts.
    return () => clearTimeout(timeoutId)
  }, [value, normalizedDelay])

  return debouncedValue
}