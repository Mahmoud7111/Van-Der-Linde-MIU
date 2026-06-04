/**
 * Collection service.
 */
import { apiGet } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'
import collections from '@/data/collections.json'

const mock = {
  getAll: () => Promise.resolve(collections),
  getBySlug: (slug) => {
    const collection = collections.find((c) => c.slug === slug)
    if (collection) return Promise.resolve(collection)
    return Promise.reject(new Response('Collection not found', { status: 404 }))
  },
}

const real = {
  getAll: () => apiGet('/collections'),
  getBySlug: async (slug) => {
    try {
      return await apiGet(`/collections/${slug}`)
    } catch (err) {
      if (err.statusCode === 404) {
        throw new Response('Collection not found', { status: 404 })
      }
      throw err
    }
  },
}

export const collectionService = USE_MOCK ? mock : real
