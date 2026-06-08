/**
 * Review service.
 * Public read, protected write (verified purchase check happens on backend).
 */
import { apiGet, apiPost } from '@/services/http'

export const reviewService = {
  getByWatch: (watchId) => apiGet(`/watches/${watchId}/reviews`),
  create: (watchId, data) => apiPost(`/watches/${watchId}/reviews`, data),
}
