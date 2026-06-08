/**
 * Auth service.
 * Real mode: backend sets/clears httpOnly cookie — no token handling in frontend.
 * Mock mode: returns mock user directly, no cookie involved.
 */
import { apiGet, apiPost } from '@/services/http'

export const authService = {
  login: (data) => apiPost('/auth/login', data),
  register: (data) => apiPost('/auth/register', data),
  getMe: () => apiGet('/auth/me'),
  logout: () => apiPost('/auth/logout'),
  forgotPassword: (data) => apiPost('/auth/forgot-password', data),
  resetPassword: (data) => apiPost('/auth/reset-password', data),
}
