/**
 * Watch service.
 * Handles catalog reads and admin CRUD operations.
 */
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/http'

export const watchService = {
  getAll: (filters = {}) => {
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v && v !== 'all' && v !== 'default')
    )
    const params = new URLSearchParams(clean).toString()
    return apiGet(`/watches${params ? `?${params}` : ''}`)
  },
  getById: async (id) => {
    try {
      return await apiGet(`/watches/${id}`)
    } catch (err) {
      if (err.statusCode === 404) throw new Response('Watch not found', { status: 404 })
      throw err
    }
  },
  create: (data) => apiPost('/watches', data),
  update: (id, data) => apiPut(`/watches/${id}`, data),
  remove: (id) => apiDelete(`/watches/${id}`),
}
