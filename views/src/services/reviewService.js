/**
 * Review service.
 * Public read, protected write (verified purchase check happens on backend).
 */
import { apiGet, apiPost } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  getByWatch: (_watchId) => Promise.resolve([]),
  create: (_watchId, data) =>
    Promise.resolve({ ...data, _id: `review-${Date.now()}`, isVerifiedPurchase: true }),
}

const real = {
  getByWatch: (watchId) => apiGet(`/watches/${watchId}/reviews`),
  create: (watchId, data) => apiPost(`/watches/${watchId}/reviews`, data),
}

export const reviewService = USE_MOCK ? mock : real
