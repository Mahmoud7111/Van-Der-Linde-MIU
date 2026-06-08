/**
 * Collection service.
 */
import { apiGet } from '@/services/http'

export const collectionService = {
  getAll: () => apiGet('/collections'),
  getBySlug: async (slug) => {
    try {
      return await apiGet(`/collections/${slug}`)
    } catch (err) {
      if (err.statusCode === 404) throw new Response('Collection not found', { status: 404 })
      throw err
    }
  },
}
