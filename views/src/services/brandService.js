/**
 * Brand service.
 */
import { apiGet } from '@/services/http'

export const brandService = {
  getAll: () => apiGet('/brands'),
}
