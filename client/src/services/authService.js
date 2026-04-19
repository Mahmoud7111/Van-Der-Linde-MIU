/**
 * Authentication service (mock + real implementations).
 *
 * What this file is:
 * A service abstraction for all auth-related API operations.
 *
 * What it does:
 * Provides both mock and real async implementations behind one `authService` export,
 * selected by the USE_MOCK flag.
 *
 * Where it is used:
 * AuthContext calls login/register/getMe/logout.
 * Forgot/Reset password pages can call forgotPassword/resetPassword.
 */
import api from '@/api/axiosInstance'
import { USE_MOCK } from '@/utils/constants'
import adminUser from '@/data/admin.json'
import mockUser from '@/data/user.json'

// Mock auth service keeps async contract via Promise.resolve while backend is not ready.
const MOCK_USER_KEY = 'mock-user'

const resolveMockUser = (email) => {
  if (!email) return mockUser
  const normalizedEmail = String(email).toLowerCase().trim()
  if (normalizedEmail === adminUser.email.toLowerCase()) {
    return adminUser
  }
  return mockUser
}

const mock = {
  // Called by AuthContext.login from LoginPage submit flow.
  login: ({ email } = {}) => {
    const user = resolveMockUser(email)
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
    return Promise.resolve({ user, token: `mock-token-${user.role}` })
  },

  // Called by AuthContext.register from RegisterPage submit flow.
  register: (data = {}) => {
    const user = {
      ...mockUser,
      _id: `user-${Date.now()}`,
      name: data.name || mockUser.name,
      email: data.email || mockUser.email,
      role: 'user',
    }
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
    return Promise.resolve({ user, token: 'mock-token-user' })
  },

  // Called on app startup by AuthContext to restore session from token.
  getMe: () => {
    const storedUser = localStorage.getItem(MOCK_USER_KEY)
    const user = storedUser ? JSON.parse(storedUser) : mockUser
    return Promise.resolve(user)
  },

  // Called when user logs out from header/account controls.
  logout: () => {
    localStorage.removeItem(MOCK_USER_KEY)
    return Promise.resolve()
  },

  // Called by ForgotPasswordPage to simulate email dispatch.
  forgotPassword: () => Promise.resolve({ message: 'Email sent' }),

  // Called by ResetPasswordPage to simulate password update.
  resetPassword: () => Promise.resolve({ message: 'Password reset' }),
}

// Real auth service maps frontend actions to backend Express routes.
const real = {
  // POST /auth/login authenticates credentials and returns `{ user, token }`.
  login: (data) => api.post('/auth/login', data).then((response) => response.data),

  // POST /auth/register creates account and returns `{ user, token }`.
  register: (data) => api.post('/auth/register', data).then((response) => response.data),

  // GET /auth/me returns current authenticated user profile from JWT context.
  getMe: () => api.get('/auth/me').then((response) => response.data),

  // POST /auth/logout invalidates session/token server-side when implemented.
  logout: () => api.post('/auth/logout').then((response) => response.data),

  // POST /auth/forgot-password triggers password reset email flow.
  forgotPassword: (data) =>
    api.post('/auth/forgot-password', data).then((response) => response.data),

  // POST /auth/reset-password submits new password token payload.
  resetPassword: (data) => api.post('/auth/reset-password', data).then((response) => response.data),
}

// Single export consumed by context/pages; switches automatically between mock and real modes.
export const authService = USE_MOCK ? mock : real
const MOCK_USERS_STORAGE_KEY = 'mock-auth-users'
const MOCK_CURRENT_USER_ID_KEY = 'mock-auth-current-user-id'

const normalizeEmail = (email = '') => String(email).trim().toLowerCase()

const seedMockUsers = () => {
  const seededUser = {
    ...mockUser,
    role: mockUser.role || 'user',
    password: '123456',
  }
  return [seededUser]
}

const readMockUsers = () => {
  try {
    const raw = localStorage.getItem(MOCK_USERS_STORAGE_KEY)
    if (!raw) return seedMockUsers()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return seedMockUsers()
    return parsed
  } catch {
    return seedMockUsers()
  }
}

const writeMockUsers = (users) => {
  localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users))
}

const toPublicUser = (user) => {
  if (!user) return null
  const { password: _password, ...publicUser } = user
  return publicUser
}

const setCurrentMockUserId = (userId) => {
  if (userId) {
    localStorage.setItem(MOCK_CURRENT_USER_ID_KEY, userId)
    return
  }
  localStorage.removeItem(MOCK_CURRENT_USER_ID_KEY)
}

const getCurrentMockUserId = () => localStorage.getItem(MOCK_CURRENT_USER_ID_KEY)
 login: ({ email, password }) => {
    const users = readMockUsers()
    writeMockUsers(users)

    const normalizedEmail = normalizeEmail(email)
    const matchedUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail)

    if (!matchedUser || matchedUser.password !== password) {
      return Promise.reject(new Error('Invalid email or password'))
    }

    setCurrentMockUserId(matchedUser._id)
    return Promise.resolve({ user: toPublicUser(matchedUser), token: 'mock-token-123' })
  },
    register: (data) => {
    const users = readMockUsers()
    const normalizedEmail = normalizeEmail(data?.email)

    if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
      return Promise.reject(new Error('Email is already in use'))
    }

    const fullName = `${data?.firstName || ''} ${data?.lastName || ''}`.trim()
    const newUser = {
      _id: `user-${Date.now()}`,
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      name: fullName || 'User',
      email: normalizedEmail,
      phone: data?.phone || '',
      role: 'user',
      isVerified: false,
      dateOfBirth: data?.dateOfBirth || '',
      gender: data?.gender || '',
      interests: data?.interests || [],
      address: data?.address || {
        street: '',
        city: '',
        country: '',
        zip: '',
      },
      password: data?.password || '',
    }

    const nextUsers = [...users, newUser]
    writeMockUsers(nextUsers)
    setCurrentMockUserId(newUser._id)

    return Promise.resolve({ user: toPublicUser(newUser), token: 'mock-token-123' })
  }, getMe: () => {
    const users = readMockUsers()
    writeMockUsers(users)

    const currentUserId = getCurrentMockUserId()
    const currentUser = users.find((user) => user._id === currentUserId) || users[0] || null

    if (!currentUser) {
      return Promise.reject(new Error('No authenticated user found'))
    }

    return Promise.resolve(toPublicUser(currentUser))
  },logout: () => {
    setCurrentMockUserId(null)
    return Promise.resolve()
  },
