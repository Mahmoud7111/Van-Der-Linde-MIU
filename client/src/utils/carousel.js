/**
 * Carousel index helpers.
 *
 * What this file is:
 * Shared utility functions for cyclic index math used by sliders/carousels.
 *
 * What it does:
 * Normalizes any index (including negative) into a valid range [0, count - 1].
 */

// Wrap an index into a circular list with `count` items.
export const wrapIndex = (index, count) => {
  if (!Number.isFinite(count) || count <= 0) return 0
  return ((index % count) + count) % count
}
