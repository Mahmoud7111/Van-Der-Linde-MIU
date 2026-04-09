/**
 * Authentication context.
 *
 * What this file is:
 * A global auth state manager for logged-in user session and auth actions.
 *
 * What it does:
 * - Restores session on refresh by validating stored token with `authService.getMe()`.
 * - Exposes login, register, and logout helpers.
 * - Prevents flash of wrong auth UI by rendering children only after initial check completes.
 *
 * Where it is used:
 * useAuth() is consumed by Header, PrivateRoute, AdminRoute, Profile/Account pages,
 * and any page that needs current user or auth actions.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'

// Create auth context for user, loading state, and auth methods.
const AuthContext = createContext(null)

// Provider wraps app and controls auth lifecycle globally.
export const AuthProvider = ({ children }) => {
  // Current authenticated user; null means not logged in.
  const [user, setUser] = useState(null)

  // Loading flag tracks initial token/session restoration process.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Session restore runs once on app startup.
    const restoreSession = async () => {
      // Check if a token exists before calling `/auth/me`.
      const token = localStorage.getItem('token')

      // No token means no session to restore; stop loading immediately.
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Validate token and fetch current user profile silently.
        const currentUser = await authService.getMe()

        // Store user in context so protected UI renders correctly.
        setUser(currentUser)
      } catch {
        // If token is invalid/expired, clear it so future requests do not reuse stale auth.
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        // End initial auth gate so provider can render children.
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Login action used by LoginPage.
  const login = async (email, password) => {
    // Call auth service (mock or real), expecting `{ user, token }` response shape.
    const result = await authService.login({ email, password })

    // Persist JWT for future API calls via axios interceptor.
    localStorage.setItem('token', result.token)

    // Push authenticated user into global context.
    setUser(result.user)

    return result
  }

  // Register action used by RegisterPage.
  const register = async (data) => {
    // Create account through auth service and receive `{ user, token }`.
    const result = await authService.register(data)

    // Persist token to keep the user signed in after registration.
    localStorage.setItem('token', result.token)

    // Set newly created user in context.
    setUser(result.user)

    return result
  }

  // Logout action used by header/account menus.
  const logout = async () => {
    try {
      // Notify backend when available; mock resolves instantly.
      await authService.logout()
    } finally {
      // Always clear local auth state regardless of remote logout outcome.
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    // Block child rendering during initial auth restore to avoid wrong-route flash.
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook for clean auth context usage.
export const useAuth = () => {
  const context = useContext(AuthContext)

  // Guard against usage outside AuthProvider.
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
