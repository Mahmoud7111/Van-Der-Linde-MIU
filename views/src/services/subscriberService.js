/**
 * Subscriber service.
 * Newsletter email capture and unsubscribe flow.
 */
import { apiPost, apiDelete } from '@/services/http'

export const subscriberService = {
  subscribe: (email) => apiPost('/subscribers', { email }),
  unsubscribe: (token) => apiDelete(`/subscribers/${token}`),
}
