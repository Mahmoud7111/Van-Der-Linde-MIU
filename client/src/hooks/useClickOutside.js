import { useEffect } from 'react';
/**
 * Fires `onOutsideClick` when a pointer interaction happens outside `ref`.
 */
export default function useClickOutside(ref, onOutsideClick, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined
     const handlePointerDown = (event) => {
      const element = ref?.current
      if (!element) return

if (!element.contains(event.target)) {
        onOutsideClick?.(event)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [enabled, onOutsideClick, ref])
}
/**
 * useClickOutside(ref, callback) → void
 *
 * A hook that fires a callback function whenever the user clicks anywhere outside
 * a referenced DOM element. Closes drawers, dropdowns, and modals on outside click.
 */
export default function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
