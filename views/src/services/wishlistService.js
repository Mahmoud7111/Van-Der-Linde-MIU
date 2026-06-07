/**
 * Wishlist service.
 * Server-side wishlist — requires authentication.
 */
import { apiGet, apiPost, apiDelete } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  getWishlist: () => Promise.resolve({ watches: [] }),
  addWatch: (_watchId) => Promise.resolve({ watches: [] }),
  removeWatch: (_watchId) => Promise.resolve({ watches: [] }),
}

const real = {
  getWishlist: () => apiGet('/wishlist'),
  addWatch: (watchId) => apiPost('/wishlist', { watchId }),
  removeWatch: (watchId) => apiDelete(`/wishlist/${watchId}`),
}

export const wishlistService = USE_MOCK ? mock : real
