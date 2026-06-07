/**
 * Subscriber service.
 * Newsletter email capture and unsubscribe flow.
 */
import { apiPost, apiDelete } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  subscribe: (_email) => Promise.resolve({ message: 'Subscribed successfully' }),
  unsubscribe: (_token) => Promise.resolve({ message: 'Unsubscribed successfully' }),
}

const real = {
  subscribe: (email) => apiPost('/subscribers', { email }),
  // token comes from the unsubscribe URL the user clicks in their email.
  unsubscribe: (token) => apiDelete(`/subscribers/${token}`),
}

export const subscriberService = USE_MOCK ? mock : real
