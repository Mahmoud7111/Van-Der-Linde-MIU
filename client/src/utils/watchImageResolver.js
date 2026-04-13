import collectionFallbackImage from '@/assets/images/notFound1.svg'
import watchRolexLadyDatejust from '@/assets/images/Watches/Rolex Lady Datejust.png'

/**
 * Watch image resolution helpers.
 *
 * What this file is:
 * Shared helpers for turning product JSON image strings into Vite-safe asset URLs.
 *
 * What it does:
 * - Resolves exact glob matches.
 * - Falls back to base-name lookup when path variants differ.
 * - Applies product-specific override assets when needed.
 */

const watchImageAssets = import.meta.glob('/src/assets/images/Watches/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const collectionImageAssets = import.meta.glob('/src/assets/Models/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const normalizeBaseName = (value = '') =>
  value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/\s+/g, ' ')
    .trim()

// Build a tolerant lookup by filename without extension.
const watchImageByBaseName = Object.entries(watchImageAssets).reduce((lookup, [assetPath, assetUrl]) => {
  const fileName = assetPath.split('/').pop() ?? ''
  const baseName = normalizeBaseName(fileName)
  lookup[baseName] = assetUrl
  return lookup
}, {})

// Build a tolerant lookup for collection cover assets in /assets/Models.
const collectionImageByBaseName = Object.entries(collectionImageAssets).reduce(
  (lookup, [assetPath, assetUrl]) => {
    const fileName = assetPath.split('/').pop() ?? ''
    const baseName = normalizeBaseName(fileName)
    lookup[baseName] = assetUrl
    return lookup
  },
  {}
)

// Product-specific overrides for assets that need cleaner alternatives in UI.
const favoriteImageOverrides = {
  // This source asset contains decorative horizontal trails in the file itself,
  // which makes the watch appear cropped/small inside the favorites slots.
  'watch-004': watchRolexLadyDatejust,
}

// Resolve a generic product image string to a displayable URL.
export const resolveWatchProductImage = (imagePath) => {
  if (typeof imagePath !== 'string' || !imagePath.trim()) {
    return collectionFallbackImage
  }

  const normalizedPath = imagePath.trim().replace(/^@\//, '/src/')
  if (watchImageAssets[normalizedPath]) {
    return watchImageAssets[normalizedPath]
  }

  const fileName = normalizedPath.split('/').pop() ?? ''
  const baseName = normalizeBaseName(fileName)
  return watchImageByBaseName[baseName] ?? collectionFallbackImage
}

// Resolve a collection cover image string to a displayable URL.
export const resolveCollectionCoverImage = (imagePath) => {
  if (typeof imagePath !== 'string' || !imagePath.trim()) {
    return collectionFallbackImage
  }

  const normalizedPath = imagePath.trim().replace(/^@\//, '/src/')
  if (collectionImageAssets[normalizedPath]) {
    return collectionImageAssets[normalizedPath]
  }

  const fileName = normalizedPath.split('/').pop() ?? ''
  const baseName = normalizeBaseName(fileName)
  return collectionImageByBaseName[baseName] ?? collectionFallbackImage
}

// Resolve favorites image with override-first strategy.
export const resolveFavoriteWatchImage = (product) => {
  if (!product) return collectionFallbackImage
  return favoriteImageOverrides[product._id] ?? resolveWatchProductImage(product.images?.[0])
}
