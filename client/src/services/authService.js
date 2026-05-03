import mockUser from '@/data/user.json'
import mockAdmin from '@/data/admin.json'

const MOCK_USERS_STORAGE_KEY = 'mock-auth-users'
const MOCK_CURRENT_USER_ID_KEY = 'mock-auth-current-user-id'

const normalizeEmail = (email = '') => String(email).trim().toLowerCase()

const createSeedUser = (source, role, password) => ({
  ...source,
  role: source.role || role,
  password: source.password || password,
})

const seedMockUsers = () => {
  const seededUser = createSeedUser(mockUser, 'user', '123456')
  const seededAdmin = createSeedUser(mockAdmin, 'admin', 'admin123')
  return [seededUser, seededAdmin]
}

const ensureSeededUsers = (users) => {
  const seedUsers = seedMockUsers()
  const map = new Map()

  users.forEach((user) => {
    const email = normalizeEmail(user?.email)
    if (!email) return
    map.set(email, user)
  })

  seedUsers.forEach((seedUser) => {
    const email = normalizeEmail(seedUser.email)
    if (!email) return

    if (!map.has(email)) {
      map.set(email, seedUser)
      return
    }

    const existing = map.get(email)
    map.set(email, {
      ...seedUser,
      ...existing,
      role: existing?.role || seedUser.role,
      password: existing?.password || seedUser.password,
    })
  })

  return Array.from(map.values())
}

const readMockUsers = () => {
  try {
    const raw = localStorage.getItem(MOCK_USERS_STORAGE_KEY)
    if (!raw) return seedMockUsers()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return seedMockUsers()
    return ensureSeededUsers(parsed)
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

/**
 * Authentication service using local storage for mock data.
 * All real API calls and Axios dependencies have been removed.
 */
export const authService = {
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
  },
  getMe: () => {
    const users = readMockUsers()
    writeMockUsers(users)

    const currentUserId = getCurrentMockUserId()
    const currentUser = users.find((user) => user._id === currentUserId) || users[0] || null

    if (!currentUser) {
      return Promise.reject(new Error('No authenticated user found'))
    }

    return Promise.resolve(toPublicUser(currentUser))
  },
  updateProfile: (data) => {
    const users = readMockUsers()
    const currentUserId = getCurrentMockUserId()

    if (!currentUserId) {
      return Promise.reject(new Error('No authenticated user found'))
    }

    const currentIndex = users.findIndex((user) => user._id === currentUserId)

    if (currentIndex === -1) {
      return Promise.reject(new Error('No authenticated user found'))
    }

    const normalizedEmail = normalizeEmail(data?.email)
    const emailConflict = users.some(
      (user) => user._id !== currentUserId && normalizeEmail(user.email) === normalizedEmail,
    )

    if (emailConflict) {
      return Promise.reject(new Error('Email is already in use'))
    }

    const currentUser = users[currentIndex]
    const nextUser = {
      ...currentUser,
      firstName: data?.firstName ?? currentUser.firstName ?? '',
      lastName: data?.lastName ?? currentUser.lastName ?? '',
      email: normalizedEmail || currentUser.email,
      phone: data?.phone ?? currentUser.phone ?? '',
    }

    nextUser.name = `${nextUser.firstName || ''} ${nextUser.lastName || ''}`.trim() || nextUser.name || 'User'

    users[currentIndex] = nextUser
    writeMockUsers(users)

    return Promise.resolve({ user: toPublicUser(nextUser) })
  },
  logout: () => {
    setCurrentMockUserId(null)
    return Promise.resolve()
  },
  forgotPassword: () => Promise.resolve({ message: 'Email sent' }),
  resetPassword: () => Promise.resolve({ message: 'Password reset' }),
}

export default authService;
