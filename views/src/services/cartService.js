/**
 * Cart service.
 * Server-side cart for authenticated users.
 * Mock returns empty cart shape so CartContext always has a valid structure.
 */
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  getCart: () => Promise.resolve({ items: [] }),
  addItem: (_watchId, _quantity) => Promise.resolve({ items: [] }),
  updateItem: (_watchId, _quantity) => Promise.resolve({ items: [] }),
  removeItem: (_watchId) => Promise.resolve({ items: [] }),
  clearCart: () => Promise.resolve(),
}

const real = {
  getCart: () => apiGet('/cart'),
  addItem: (watchId, quantity) => apiPost('/cart/items', { watchId, quantity }),
  updateItem: (watchId, quantity) => apiPut(`/cart/items/${watchId}`, { quantity }),
  removeItem: (watchId) => apiDelete(`/cart/items/${watchId}`),
  clearCart: () => apiDelete('/cart'),
}

export const cartService = USE_MOCK ? mock : real
