/**
 * Wishlist service.
 * Server-side wishlist — requires authentication.
 */
import { apiGet, apiPost, apiDelete } from '@/services/http'

export const wishlistService = {
  getWishlist: () => apiGet('/wishlist'),
  addWatch: (watchId) => apiPost('/wishlist', { watchId }),
  removeWatch: (watchId) => apiDelete(`/wishlist/${watchId}`),
}
