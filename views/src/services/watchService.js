/**
 * Watch service.
 * Handles catalog reads and admin CRUD operations.
 */
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'
import products from '@/data/products.json'

const mock = {
  getAll: (filters = {}) => {
    let result = [...products]

    if (filters.category && filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category)
    }

    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim()
      result = result.filter((item) => item.name.toLowerCase().includes(q))
    }

    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating)

    return Promise.resolve(result)
  },

  getById: (id) => {
    const watch = products.find((item) => item._id === id)
    if (watch) return Promise.resolve(watch)
    // Reject with Response so createBrowserRouter errorElement receives the status.
    return Promise.reject(new Response('Watch not found', { status: 404 }))
  },

  create: (data) => Promise.resolve({ ...data, _id: `new-${Date.now()}` }),
  update: (id, data) => Promise.resolve({ ...data, _id: id }),
  remove: (id) => Promise.resolve({ id }),
}

const real = {
  getAll: (filters = {}) => {
    // Remove empty values so the query string stays clean.
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v && v !== 'all' && v !== 'default')
    )
    const params = new URLSearchParams(cleanFilters).toString()
    return apiGet(`/watches${params ? `?${params}` : ''}`)
  },

  // Throws Response on 404 so route loader errorElement triggers correctly.
  getById: async (id) => {
    try {
      return await apiGet(`/watches/${id}`)
    } catch (err) {
      if (err.statusCode === 404) {
        throw new Response('Watch not found', { status: 404 })
      }
      throw err
    }
  },

  create: (data) => apiPost('/watches', data),
  update: (id, data) => apiPut(`/watches/${id}`, data),
  remove: (id) => apiDelete(`/watches/${id}`),
}

export const watchService = USE_MOCK ? mock : real
