/**
 * Review service.
 * Public read, protected write (verified purchase check happens on backend).
 * Admin: list all reviews, delete any review.
 */
import { apiGet, apiPost, apiDelete } from '@/services/http'

export const reviewService = {
  getByWatch: (watchId) => apiGet(`/watches/${watchId}/reviews`),
  create: (watchId, data) => apiPost(`/watches/${watchId}/reviews`, data),
  // Admin only
  getAll: () => apiGet('/reviews'),
  deleteById: (id) => apiDelete(`/reviews/${id}`),
}
