/**
 * Configurator service.
 * Submits custom watch configuration — sends emails to admin and customer.
 */
import { apiGet, apiPost } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  submit: (_data) =>
    Promise.resolve({ message: 'Configuration submitted. We will contact you within 2-3 business days.' }),
  getRequests: () => Promise.resolve([]),
}

const real = {
  // data: { name, email, configuration: { caseColor, dialColor, strapMaterial, strapColor, notes } }
  submit: (data) => apiPost('/configurator/submit', data),
  // Admin only — returns all submitted configuration requests.
  getRequests: () => apiGet('/configurator/requests'),
}

export const configuratorService = USE_MOCK ? mock : real
