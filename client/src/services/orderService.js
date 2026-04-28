/**
 * Order service (mock + real implementations).
 *
 * What this file is:
 * Service abstraction for order retrieval and order state mutations.
 *
 * What it does:
 * Supports user order history flows and admin order management flows through
 * one shared API with mock and real backends.
 *
 * Where it is used:
 * - `profile` and `orders` route loaders call getMyOrders().
 * - Admin orders pages call getAll(), getById(), and updateStatus().
 * - Checkout flow calls create().
 */

/*
axiosInstance is used only for real API calls, not for the mock data.
The exported watchService will use axiosInstance if USE_MOCK is false (real mode),
and will not use it if USE_MOCK is true (mock mode).
*/


import api from '@/api/axiosInstance'
import { USE_MOCK } from '@/utils/constants'
import orders from '@/data/orders.json'
import products from '@/data/products.json'

const productImageById = products.reduce((lookup, product) => {
  if (!product?._id) return lookup
  lookup[product._id] = product?.images?.[0] || product?.image || ''
  return lookup
}, {})

const normalizeOrderItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => {
    const productImage = productImageById[item?._id] || ''
    const normalizedImage = item?.image || item?.images?.[0] || productImage
    return {
      ...item,
      image: normalizedImage,
      images: Array.isArray(item?.images) && item.images.length > 0
        ? item.images
        : normalizedImage
          ? [normalizedImage]
          : [],
    }
  })

const normalizeShippingAddress = (shippingAddress = {}) => ({
  fullName: shippingAddress?.fullName || shippingAddress?.name || '',
  email: shippingAddress?.email || '',
  phone: shippingAddress?.phone || '',
  street: shippingAddress?.street || '',
  city: shippingAddress?.city || '',
  country: shippingAddress?.country || '',
  zip: shippingAddress?.zip || shippingAddress?.postalCode || '',
  notes: shippingAddress?.notes || '',
})

const resolveOrderTotal = (order = {}) => {
  const total = Number(order?.totalPrice ?? order?.totalAmount ?? order?.total)
  return Number.isFinite(total) ? total : 0
}

const normalizeOrder = (order) => ({
  ...order,
  shippingAddress: normalizeShippingAddress(order?.shippingAddress || order?.shipping),
  totalPrice: resolveOrderTotal(order),
  items: normalizeOrderItems(order?.items),
})

const mockOrders = orders.map(normalizeOrder)
/**
 * Retrieve persisted orders from localStorage
 * - Used to simulate backend order history
 * - Returns empty array if nothing exists or parsing fails
 */
// Helper to get persisted user orders from localStorage (created during checkout).
const getPersistedUserOrders = () => {
  try {
    const stored = localStorage.getItem('mock-user-orders')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
/**
 * Save user orders to localStorage
 * - Used after checkout or order updates
 * - Silently fails if storage is unavailable
 */
// Helper to save user orders to localStorage.
const persistUserOrders = (userOrders) => {
  try {
    localStorage.setItem('mock-user-orders', JSON.stringify(userOrders))
  } catch {
    // Silent fail on storage errors
  }
}

// Mock order service preserves async API signatures using Promise.resolve.
const mock = {
  // User-facing loader for profile/order history routes.
  // Returns both static demo orders and any orders created during this session.
  getMyOrders: () => {
    const userCreatedOrders = getPersistedUserOrders()
    const allOrders = [...mockOrders, ...userCreatedOrders]
    return Promise.resolve(allOrders)
  },

  // Admin-facing list endpoint for full order management view.
  // Includes both static and user-created orders.
  getAll: () => {
    const userCreatedOrders = getPersistedUserOrders()
    const allOrders = [...mockOrders, ...userCreatedOrders]
    return Promise.resolve(allOrders)
  },

  // Detail lookup for one order id.
  getById: (id) => {
    const userCreatedOrders = getPersistedUserOrders()
    const allOrders = [...mockOrders, ...userCreatedOrders]
    return Promise.resolve(allOrders.find((order) => order._id === id))
  },

  // Creates a new mock order after checkout and persists it to localStorage.
  create: (data) => {
    const newOrder = normalizeOrder({
      ...data,
      _id: `order-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    
    // Persist the new order so it shows up in getMyOrders and order history.
    const userOrders = getPersistedUserOrders()
    userOrders.push(newOrder)
    persistUserOrders(userOrders)
    
    return Promise.resolve(newOrder)
  },

  // Simulates admin order status update.
  updateStatus: (id, status) => {
    // Also update persisted user orders if it exists there.
    const userOrders = getPersistedUserOrders()
    const orderIndex = userOrders.findIndex((o) => o._id === id)
    if (orderIndex !== -1) {
      userOrders[orderIndex].status = status
      persistUserOrders(userOrders)
    }
    return Promise.resolve({ id, status })
  },
}

// Real order service mapped to backend Express routes.
const real = {
  // GET /orders/mine returns current authenticated user's orders.
  getMyOrders: () => api.get('/orders/mine').then((response) => response.data),

  // GET /orders returns all orders (admin-only route on backend).
  getAll: () => api.get('/orders').then((response) => response.data),

  // GET /orders/:id returns one order detail.
  getById: (id) => api.get(`/orders/${id}`).then((response) => response.data),

  // POST /orders creates order from checkout payload.
  create: (data) => api.post('/orders', data).then((response) => response.data),

  // PUT /orders/:id/status updates order status (admin action).
  updateStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }).then((response) => response.data),
}

// Shared export used by loaders/pages; toggles between mock and real via USE_MOCK.
export const orderService = USE_MOCK ? mock : real
