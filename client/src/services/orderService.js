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
import api from '@/api/axiosInstance'
import { USE_MOCK } from '@/utils/constants'
import orders from '@/data/orders.json'

// Mock order service preserves async API signatures using Promise.resolve.
const mock = {
  // User-facing loader for profile/order history routes.
  getMyOrders: () => Promise.resolve(orders),

  // Admin-facing list endpoint for full order management view.
  getAll: () => Promise.resolve(orders),

  // Detail lookup for one order id.
  getById: (id) => Promise.resolve(orders.find((order) => order._id === id)),

  // Creates a new mock order after checkout and sets default pending status.
  create: (data) => Promise.resolve({ ...data, _id: `order-${Date.now()}`, status: 'pending' }),

  // Simulates admin order status update.
  updateStatus: (id, status) => Promise.resolve({ id, status }),
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
