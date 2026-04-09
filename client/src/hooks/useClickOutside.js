export default function UseClickOutside() {
  return null;
}


/*Real world analogy: When a dropdown menu is open and you click anywhere else on the page, it closes. That's click-outside behavior.
Every UI library does this — now you have your own.*/

/**
 * useClickOutside(ref, callback) → void
 *
 * 
 * A hook that fires a callback function whenever the user clicks anywhere outside
 * a referenced DOM element. Closes drawers, dropdowns, and modals on outside click.
 *
 * why we use it:
 * Every UI that opens (cart offcanvas, mobile menu, search dropdown) needs to close
 * when the user clicks outside. This is a universal pattern — one hook used in every
 * drawer and dropdown.
 *
 * mechanism:
 * Attaches a mousedown listener to document. On every click, checks if the clicked
 * element is inside the ref element using contains(). If outside → fires callback.
 *
 * without it:
 * CartOffcanvas, MobileMenu, and SearchBar each write their own
 * document.addEventListener('mousedown', ...) logic. Same code three times.
 * Each forgets to remove the listener on unmount, leaking memory.
 *
 * with it:
 * One line: useClickOutside(ref, () => setIsOpen(false)). The cleanup is handled
 * automatically. Works for every closeable UI element in the project.
 *
 * usedIn:
 * - components/cart/CartOffcanvas.jsx
 * - components/layout/MobileMenu.jsx
 * - components/features/SearchBar.jsx
 */