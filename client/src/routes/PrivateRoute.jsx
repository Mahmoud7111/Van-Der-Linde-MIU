/**
 * Private route guard.
 *
 * What this file is:
 * A wrapper component that protects authenticated-only pages.
 *
 * What it does:
 * Redirects unauthenticated users to `/login` and preserves intended destination
 * through `state.from`, then renders children when user is authenticated.
 *
 * Where it is used:
 * Wraps checkout, profile, order history, order confirmation, and wishlist routes.
 */
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Guard component receives route element as `children`.
export default function PrivateRoute({ children }) {

  // LoginPage.jsx must do this after successful login --->
    // Read authenticated user from global auth context.
  const { user } = useAuth()

    // Capture current location to support post-login redirect back to this protected route.
  const location = useLocation()

    // If not logged in, redirect to login and store source location in navigation state.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
    // state={{ from: location }} = "remember where I was going"
    // replace = don't add /login to browser history
    // (back button won't loop through /login)

  // `replace` prevents extra /login entry in history, so back button behavior stays clean.
  return children  // <- user exists -> show the protected page
}
