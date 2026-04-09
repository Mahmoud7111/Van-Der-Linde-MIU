/**
 * Admin route guard.
 *
 * What this file is:
 * A wrapper component that enforces admin-only access for privileged routes.
 *
 * What it does:
 * - Redirects unauthenticated users to `/login`.
 * - Redirects authenticated non-admin users to `/`.
 * - Renders children only for admin accounts.
 *
 * Where it is used:
 * Wraps admin dashboard, manage products, and manage orders routes.
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { USER_ROLES } from '@/utils/constants'

// Guard component receives target admin page as children.
export default function AdminRoute({ children }) {
  // Read current user from auth context.
  const { user } = useAuth()

  //* First check 1: user must be logged in.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  //* Second check 2: logged-in user must have admin role.
  // Using USER_ROLES.ADMIN avoids hardcoding role strings throughout the app.
  if (user.role !== USER_ROLES.ADMIN) {
    return <Navigate to="/" replace />
  }
  // Goes to homepage, not login — they ARE logged in, just not admin

  // Only admins can access wrapped content.
  return children // <- admin confirmed -> show admin page
}
