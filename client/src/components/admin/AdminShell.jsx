/*
  AdminShell

  Layout wrapper for all admin routes.
  - Provides the left sidebar navigation and top command bar.
  - Applies the `admin-mode` body class to hide the global header/footer.
  - Renders the routed admin page content via `children`.
  - key links: Dashboard, Products, Orders, Settings, Storefront, Back To Home. 
*/

import { NavLink } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/common/Button'
import { cn } from '@/utils/cn'
import './AdminShell.css'

const primaryNavItems = [
  { label: 'Dashboard', to: '/admin' },

]

const managementNavItems = [
  { label: 'Products', to: '/admin/watches' },
  { label: 'Orders', to: '/admin/orders' },
]

const secondaryNavItems = [
  { label: 'Users', disabled: true },
  { label: 'Reviews', disabled: true },
]

const getAdminName = (user) => {
  if (!user) return 'Admin'
  const name = user.name || user.fullName || user.username || user.email
  if (!name) return 'Admin'
  const cleaned = String(name).trim()
  if (!cleaned) return 'Admin'
  return cleaned.includes('@') ? cleaned.split('@')[0] : cleaned
}

export default function AdminShell({ children }) {
  const { user } = useAuth()

  const adminName = useMemo(() => getAdminName(user), [user])

  useEffect(() => {
    document.body.classList.add('admin-mode')
    return () => document.body.classList.remove('admin-mode')
  }, [])

  const navLinkClassName = ({ isActive }) =>
    cn('admin-shell__nav-link', isActive && 'admin-shell__nav-link--active')

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar" aria-label="Admin navigation">
        <div className="admin-shell__brand">
          <span className="admin-shell__brand-title">Admin Panel</span>
          <span className="admin-shell__brand-subtitle">Van Der Linde</span>
        </div>

        <nav className="admin-shell__nav">
          <p className="admin-shell__nav-heading">Overview</p>
          {primaryNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName} end>
              {item.label}
            </NavLink>
          ))}

          <div className="admin-shell__nav-divider" aria-hidden="true" />

          <p className="admin-shell__nav-heading">Management</p>
          {managementNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName} end>
              {item.label}
            </NavLink>
          ))}
          {secondaryNavItems.map((item) => (
            <span
              key={item.label}
              className={cn('admin-shell__nav-link', 'admin-shell__nav-link--disabled')}
              aria-disabled="true"
            >
              {item.label}
              <span className="admin-shell__nav-badge">Soon</span>
            </span>
          ))}
        </nav>

        <div className="admin-shell__sidebar-footer">
          <div className="admin-shell__sidebar-actions">
            <Button
              to="/admin/settings"
              variant="secondary"
              size="sm"
              className="admin-shell__sidebar-button"
              disabled={true}
            >
              Settings
            </Button>
            <Button to="/" variant="secondary" size="sm" className="admin-shell__sidebar-button">
              Back To Home
            </Button>
          </div>
        </div>
      </aside>

      <div className="admin-shell__main">
        <header className="admin-shell__topbar">
          <div>
            <p className="admin-shell__welcome">Welcome, {adminName}</p>
            <p className="admin-shell__welcome-sub">Control Room</p>
          </div>
          <Button to="/" variant="secondary" size="sm" className="admin-shell__cta">
            Storefront
          </Button>
        </header>

        <div className="admin-shell__content">{children}</div>
      </div>
    </div>
  )
}
