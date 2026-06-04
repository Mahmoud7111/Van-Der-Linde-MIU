/**
 * Auth service.
 * Real mode: backend sets/clears httpOnly cookie — no token handling in frontend.
 * Mock mode: returns mock user directly, no cookie involved.
 */
import { apiGet, apiPost } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'
import mockUser from '@/data/user.json'

const mock = {
  login: () => Promise.resolve({ user: mockUser }),
  register: () => Promise.resolve({ user: mockUser }),
  getMe: () => Promise.resolve(mockUser),
  logout: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve({ message: 'Reset email sent' }),
  resetPassword: () => Promise.resolve({ message: 'Password updated' }),
}

const real = {
  // Backend sets httpOnly cookie on success. Returns { user } — no token in body.
  login: (data) => apiPost('/auth/login', data),

  // Same as login — cookie set server-side. Returns { user }.
  register: (data) => apiPost('/auth/register', data),

  // Called on app load by AuthContext to restore session from cookie.
  // Returns the user object if cookie is valid, throws 401 if not.
  getMe: () => apiGet('/auth/me'),

  // Backend clears the cookie. Frontend has nothing to remove.
  logout: () => apiPost('/auth/logout'),

  forgotPassword: (data) => apiPost('/auth/forgot-password', data),
  resetPassword: (data) => apiPost('/auth/reset-password', data),
}

export const authService = USE_MOCK ? mock : real
