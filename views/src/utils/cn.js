/**
 * Utility: Conditional Class Names (cn)
 *
 * What this file is:
 * A tiny helper used across the UI to compose CSS class names conditionally.
 *
 * What it does:
 * Accepts any number of values, removes falsy entries, and joins the rest
 * into a single className string.
 *
 * Where it is used:
 * Imported by reusable components and pages whenever dynamic classes are needed,
 * for example: cn('btn', isActive && 'btn--active').
 */

// Join class names conditionally by filtering out falsy values like false, null, and undefined.
export const cn = (...classes) => classes.filter(Boolean).join(' ')
