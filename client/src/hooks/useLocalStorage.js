export default function UseLocalStorage() {
  return null;
}

//! MIGHT DELETE: Context handles shared state in memory while the app is running.
//! useLocalStorage is only needed if you want that state to persist after refresh/reopen.
//! We wrote the localStorage logic directly inside each context (ThemeContext, CurrencyContext, LanguageContext, CartContext, WishlistContext) instead of using this hook. If we had used useLocalStorage, the contexts would be cleaner and more consistent — but it's not a huge deal to have the localStorage logic in each context since it's only 10 lines per context. So this file is just a placeholder for the pattern we could have used if we wanted to abstract localStorage syncing into a reusable hook.
// A simple hook for syncing state with localStorage. Not for critical performance code.
/*
Real world analogy: localStorage is like a notebook that survives closing the browser. useLocalStorage is the pen that writes to it automatically every time state changes — and reads from it when the page opens.
Without it: Every context that persists (theme, currency, language) writes its own localStorage.setItem/getItem logic. Same 10 lines repeated 6 times.
With it: useLocalStorage('theme', 'light') — it reads from localStorage on mount, and writes every time the value changes. Contexts use it internally.
*/

/*
 * useLocalStorage(key, initialValue) → [value, setValue]
 *
 * What it is:
 * A hook that works exactly like useState but automatically reads from and writes to localStorage.
 * State survives page refresh.
 *
 * Why we use it:
 * Our contexts (theme, currency, language, cart, wishlist) all persist across refresh.
 * Without this, every context writes its own localStorage logic — same 10 lines copied 6 times.
 *
 * The mechanism:
 * Initializes state by reading localStorage. Wraps the setter to also write to localStorage every time.
 * Handles JSON.parse and try/catch for private browsing.
 *
 * Without it:
 * Each context manually calls localStorage.getItem on mount and localStorage.setItem on every change.
 * 6 contexts × 10 lines = 60 lines of repeated boilerplate. A bug in one means hunting 6 files.
 *
 * With it:
 * useLocalStorage('theme', 'light') — done. One line. Reads on mount. Writes on change.
 * Error-handled. Consistent across every context.
 *
 * Used in these files:
 * - context/ThemeContext.jsx
 * - context/CurrencyContext.jsx
 * - context/LanguageContext.jsx
 * - context/CartContext.jsx
 * - context/WishlistContext.jsx
 */