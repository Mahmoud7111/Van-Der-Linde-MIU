/**
 * Configurator service.
 * Submits custom watch configuration — sends emails to admin and customer.
 */
import { apiGet, apiPost } from '@/services/http'

export const configuratorService = {
  submit: (data) => apiPost('/configurator/submit', data),
  getRequests: () => apiGet('/configurator/requests'),
}
