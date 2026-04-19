import { useEffect } from 'react';

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