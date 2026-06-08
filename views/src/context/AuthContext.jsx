/**
 * Authentication context.
 *
 * What this file is:
 * A global auth state manager for logged-in user session and auth actions.
 *
 * What it does:
 * - Restores session on refresh by calling GET /auth/me — the httpOnly authToken
 *   cookie is sent automatically by the browser, no localStorage token needed.
 * - Exposes login, register, update profile, and logout helpers.
 * - Prevents flash of wrong auth UI by rendering children only after initial check completes.
 *
 * Where it is used:
 * useAuth() is consumed by Header, PrivateRoute, AdminRoute, Profile/Account pages,
 * and any page that needs current user or auth actions.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'

import toast from 'react-hot-toast' 

// Create auth context for user, loading state, and auth methods.
const AuthContext = createContext(null)
// Provider wraps app and controls auth lifecycle globally.
export const AuthProvider = ({ children }) => {
  // Current authenticated user; null means not logged in.
  const [user, setUser] = useState(null)

  // Loading flag tracks initial session restoration process.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Session restore runs once on app startup.
    // Auth is cookie-based (httpOnly authToken) — the browser sends the cookie
    // automatically on every request. We always call /auth/me and let the server
    // decide if the session is valid. No localStorage token guard needed or used.
    const restoreSession = async () => {
      try {
        // Cookie is sent automatically; if valid, returns the user object.
        const currentUser = await authService.getMe()
        setUser(currentUser)
      } catch {
        // 401 means no valid cookie / session — user is a guest. Nothing to clear.
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Login action used by LoginPage.
  const login = async (email, password) => {
    // Backend sets httpOnly authToken cookie; response body has { user }.
    // Token is never in the response body — do NOT store in localStorage.
    const result = await authService.login({ email, password })
    setUser(result.user)
    toast.success('Successfully logged in!')

    return result
  }

  // Register action used by RegisterPage.
  const register = async (data) => {
    // Same as login: cookie set by backend, token not in response body.
    const result = await authService.register(data)
    setUser(result.user)
    toast.success('Registration successful!')

    return result
  }

  // Profile update action used by the account page.
  const updateProfile = async (data) => {
    const result = await userService.updateProfile(data)
    setUser(result.user || result)
    toast.success('Profile updated successfully.')
    return result
  }

  // Logout action used by header/account menus.
  const logout = async () => {
    try {
      // Backend clears the httpOnly cookie via Set-Cookie: authToken=; Max-Age=0
      await authService.logout()
    } finally {
      // Always clear local auth state regardless of remote outcome.
      setUser(null)
      toast.success('Logged out successfully.')
    }
  }

  return (
    // Block child rendering during initial auth restore to avoid wrong-route flash.
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
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
