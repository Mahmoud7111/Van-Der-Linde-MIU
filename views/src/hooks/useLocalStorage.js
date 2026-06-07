import { useCallback, useEffect, useState } from 'react'

const isBrowser = typeof window !== 'undefined'

const resolveInitialValue = (initialValue) =>
  typeof initialValue === 'function' ? initialValue() : initialValue

const readStoredValue = (key, initialValue) => {
  const fallbackValue = resolveInitialValue(initialValue)

  if (!isBrowser) {
    return fallbackValue
  }

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue == null ? fallbackValue : JSON.parse(rawValue)
  } catch {
    return fallbackValue
  }
}

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readStoredValue(key, initialValue))

  useEffect(() => {
    setStoredValue(readStoredValue(key, initialValue))
  }, [key, initialValue])

  const setValue = useCallback(
    (valueOrUpdater) => {
      setStoredValue((previousValue) => {
        const nextValue =
          typeof valueOrUpdater === 'function' ? valueOrUpdater(previousValue) : valueOrUpdater

        if (isBrowser) {
          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue))
          } catch {
            // Ignore storage write failures and keep in-memory state in sync.
          }
        }

        return nextValue
      })
    },
    [key]
  )

  const removeValue = useCallback(() => {
    const fallbackValue = resolveInitialValue(initialValue)

    if (isBrowser) {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Ignore storage removal failures and reset local state.
      }
    }

    setStoredValue(fallbackValue)
  }, [initialValue, key])

  return [storedValue, setValue, removeValue]
}