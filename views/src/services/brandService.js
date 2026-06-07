/**
 * Brand service.
 */
import { apiGet } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'
import brands from '@/data/brands.json'

const mock = {
  getAll: () => Promise.resolve(brands),
}

const real = {
  getAll: () => apiGet('/brands'),
}

export const brandService = USE_MOCK ? mock : real
