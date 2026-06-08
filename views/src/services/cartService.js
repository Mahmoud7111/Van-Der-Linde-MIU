/**
 * Cart service.
 * Server-side cart for authenticated users.
 * Mock returns empty cart shape so CartContext always has a valid structure.
 */
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/http'

export const cartService = {
  getCart: () => apiGet('/cart'),
  addItem: (watchId, quantity) => apiPost('/cart/items', { watchId, quantity }),
  updateItem: (watchId, quantity) => apiPut(`/cart/items/${watchId}`, { quantity }),
  removeItem: (watchId) => apiDelete(`/cart/items/${watchId}`),
  clearCart: () => apiDelete('/cart'),
}
