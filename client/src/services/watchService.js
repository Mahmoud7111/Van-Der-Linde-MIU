/**
 * Watch service (mock + real implementations).
 *
 * What this file is:
 * A data access layer for watch catalog operations.
 *
 * What it does:
 * Exposes methods used by route loaders and admin pages to list, fetch, create,
 * update, and remove watches.
 *
 * Where it is used:
 * - Route loaders in routes/index.jsx prefetch watch lists and watch detail data.
 * - Shop, product detail, and admin management screens consume these methods.
 */
import api from '@/api/axiosInstance'
import { USE_MOCK } from '@/utils/constants'
import products from '@/data/products.json'

// Mock service for frontend-first development with realistic async behavior.
const mock = {
  // Called by home/shop route loaders to prefetch product grid data before render.
  getAll: (filters = {}) => {
    // Copy source array first so sorting operations do not mutate imported JSON data.
    let result = [...products]

    // Filter by category unless the selected category is "all".
    if (filters.category && filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category)
    }

    // Filter by search text against watch name (case-insensitive).
    if (filters.search) {
      const normalizedSearch = String(filters.search).toLowerCase().trim()
      result = result.filter((item) => item.name.toLowerCase().includes(normalizedSearch))
    }

    // Filter by brand when a specific brand is selected.
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter((item) => item.brand === filters.brand)
    }

    // Filter by gender when selected.
    if (filters.gender && filters.gender !== 'all') {
      result = result.filter((item) => item.gender === filters.gender)
    }

    // Filter by minimum rating threshold.
    if (filters.rating && filters.rating !== 'all') {
      const minRating = Number.parseFloat(filters.rating)
      if (!Number.isNaN(minRating)) {
        result = result.filter((item) => Number(item.rating) >= minRating)
      }
    }

    // Filter by price range when provided.
    const minPrice = Number.parseFloat(filters.minPrice)
    const maxPrice = Number.parseFloat(filters.maxPrice)
    if (!Number.isNaN(minPrice)) {
      result = result.filter((item) => Number(item.price) >= minPrice)
    }
    if (!Number.isNaN(maxPrice)) {
      result = result.filter((item) => Number(item.price) <= maxPrice)
    }

    // Apply sorting based on selected option from shop controls.
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    // Resolve promise to match real async API contract.
    return Promise.resolve(result)
  },

  // Called by ProductDetailPage loader using `/watch/:id` route param.
  getById: (id) => {
    const watch = products.find((item) => item._id === id)

    // Resolve when found so detail page receives watch payload.
    if (watch) {
      return Promise.resolve(watch)
    }

    // Reject with Response for createBrowserRouter errorElement handling (status-aware errors).
    return Promise.reject(new Response('Watch not found', { status: 404 }))
  },

  // Called by admin manage products page to simulate watch creation.
  create: (data) => Promise.resolve({ ...data, _id: `new-${Date.now()}` }),

  // Called by admin manage products page to simulate watch update.
  update: (id, data) => Promise.resolve({ ...data, _id: id }),

  // Called by admin manage products page to simulate watch deletion.
  remove: (id) => Promise.resolve({ id }),
}

// Real service for production API integration.
const real = {
  // GET /watches with query params for filters/search/sort.
  getAll: (filters = {}) => api.get('/watches', { params: filters }).then((response) => response.data),

  // GET /watches/:id returns one watch document by Mongo id.
  getById: (id) => api.get(`/watches/${id}`).then((response) => response.data),

  // POST /watches creates a new watch (admin action).
  create: (data) => api.post('/watches', data).then((response) => response.data),

  // PUT /watches/:id updates existing watch (admin action).
  update: (id, data) => api.put(`/watches/${id}`, data).then((response) => response.data),

  // DELETE /watches/:id removes watch (admin action).
  remove: (id) => api.delete(`/watches/${id}`).then((response) => response.data),
}

// Single service export consumed by loaders/pages; behavior controlled by USE_MOCK flag.
export const watchService = USE_MOCK ? mock : real
