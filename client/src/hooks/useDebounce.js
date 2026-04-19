import { useState, useEffect } from 'react';

/**
 * useDebounce(value, delay) → debouncedValue
 * 
 * A hook that delays updating a value until the user stops changing it for N milliseconds.
 */
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}