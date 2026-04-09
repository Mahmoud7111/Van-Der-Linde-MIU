export default function UseDebounce() {
  return null;
}


// Used for debouncing search input, etc. Not for critical performance code.
/*
Real world analogy: Google doesn't search on every letter you type. It waits until you pause typing, then searches. That's debouncing.
Without it: User types "Chron" in SearchBar. Your service gets called 5 times — C, Ch, Chr, Chro, Chron. 5 API calls for one search. Slow and wasteful.
With it: useDebounce waits 400ms after the last keystroke. User types "Chron" quickly → only 1 call after they stop.
*/

/*
useDebounce(value, delay) → debouncedValue
▾
what it is ->
A hook that delays updating a value until the user stops changing it for N milliseconds. It holds back the value, then releases it after the delay.

why we use it ->
Without it, every single keystroke in the search box triggers a service call. User types "Chrono" = 6 calls. With it = 1 call after they pause typing.

the mechanism ->
Uses useState + useEffect. Effect sets a setTimeout. If value changes before timeout fires, it clears the old timer and starts a new one.

Without it: User types "C-h-r-o-n-o" → watchService.getAll() fires 6 times in under a second. API gets hammered. UI flickers on every keystroke.
With it: User types "Chrono" quickly → hook waits 400ms after the last keystroke → fires exactly once. Clean, efficient, professional.

used in these files ->
components/features/SearchBar.jsx
components/product/ProductFilter.jsx
*/