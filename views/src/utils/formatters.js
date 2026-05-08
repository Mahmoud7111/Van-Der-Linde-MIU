/**
 * Shared formatter helpers for UI rendering.
 *
 * What this file is:
 * A utility module for transforming raw values into display-friendly strings.
 *
 * What it does:
 * Formats currency, dates, relative time, text snippets, and slugs consistently.
 *
 * Where it is used:
 * Imported by product cards, checkout summaries, order history tables,
 * breadcrumb builders, and list/detail pages.
 */

/**
 * Format a numeric price for the selected currency.
 * Used by: ProductCard, ProductDetailPage, CartSummary, OrderReview, admin tables.
 */
export const formatPrice = (amount, currency = 'USD') => {
  // Convert any incoming value to a finite number to avoid Intl runtime errors.
  const numericAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0

  // Intl handles locale-aware currency symbols, separators, and grouping rules.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount)
}

/**
 * Format an ISO/string date to a long readable format.
 * Used by: OrderHistoryPage, ProfilePage, admin order lists, and confirmation screens.
 */
export const formatDate = (dateString) => {
  // Guard against invalid or missing inputs to avoid rendering "Invalid Date" in the UI.
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  // Example output: "December 1, 2024".
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * Convert a date into a short relative string where possible.
 * Used by: Notifications/toasts, recent orders widgets, timeline cards.
 */
export const formatRelativeTime = (dateString) => {
  // Parse the provided timestamp once and fallback to empty text when invalid.
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  // Compare against today at midnight to compute whole-day differences.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  // Convert millisecond difference into day count.
  const dayDiff = Math.floor((today - target) / (1000 * 60 * 60 * 24))

  if (dayDiff === 0) return 'Today'
  if (dayDiff === 1) return 'Yesterday'
  if (dayDiff > 1 && dayDiff <= 30) return `${dayDiff} days ago`

  // For older dates, switch to absolute date format for clarity.
  return formatDate(dateString)
}

/**
 * Truncate long text safely and append ellipsis.
 * Used by: ProductCard description previews, testimonials, and content teasers.
 */
export const truncateText = (str, n = 100) => {
  // Handle null/undefined/non-string values safely by returning an empty string.
  if (typeof str !== 'string') return ''

  // Return original text when already short enough.
  if (str.length <= n) return str

  // Trim and append ellipsis for a clean clipped result.
  return `${str.slice(0, n).trim()}...`
}

/**
 * Generate URL-safe slugs from display labels.
 * Used by: Collection links, brand routes, and canonical URL generation.
 */
export const slugify = (str) => {
  // Normalize missing input to an empty string so this helper never throws.
  if (typeof str !== 'string') return ''

  // Lowercase, remove non-word characters, collapse spaces, and trim dashes.
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Convert a numeric rating value into a visual star string.
 * Used by: Home favorites/reviews and reusable star-rating displays.
 */
export const formatStars = (ratingValue = 0, maxStars = 5) => {
  const safeMax = Math.max(1, Number(maxStars) || 5)
  const roundedRating = Math.round(Number(ratingValue) || 0)

  return Array.from({ length: safeMax }, (_, starIndex) =>
    starIndex < roundedRating ? '★' : '☆'
  ).join(' ')
}

/**
 * Build two-letter initials from a full display name.
 * Used by: Review avatars and compact identity chips.
 */
export const getInitials = (name = '') =>
  String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0))
    .join('')
    .toUpperCase() || 'NA'
