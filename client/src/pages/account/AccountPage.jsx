import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/common/PageTransition'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { getInitials } from '@/utils/formatters'
import './AccountPage.css'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const isAuthenticated = Boolean(user)

  const fullName = useMemo(() => {
    const first = user?.firstName || ''
    const last = user?.lastName || ''
    const combined = `${first} ${last}`.trim()
    return combined || user?.name || 'Guest User'
  }, [user])

  const initials = useMemo(() => getInitials(fullName) || 'GU', [fullName])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <PageTransition>
      <section className="account-page">
        <div className="account-page__container">
          <header className="account-page__header">
            <div className="account-page__avatar" aria-hidden="true">
              {initials}
            </div>

            <div className="account-page__identity">
              <p className="account-page__eyebrow">My Account</p>
              <h1 className="account-page__name">{fullName}</h1>
              <p className="account-page__email">{user?.email || 'No email provided'}</p>
              <div className="account-page__badges">
                {isAuthenticated ? (
                  <Badge variant="primary">Member</Badge>
                ) : (
                  <Badge variant="warning">Guest</Badge>
                )}
                {isAuthenticated &&
                  (user?.isVerified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="warning">Unverified</Badge>
                  ))}
              </div>
            </div>
          </header>

          {isAuthenticated ? (
            <div className="account-page__grid">
              <article className="account-card">
                <h2 className="account-card__title">Profile Details</h2>
                <div className="account-card__rows">
                  <div className="account-row">
                    <span>First Name</span>
                    <strong>{user?.firstName || '-'}</strong>
                  </div>
                  <div className="account-row">
                    <span>Last Name</span>
                    <strong>{user?.lastName || '-'}</strong>
                  </div>
                  <div className="account-row">
                    <span>Email</span>
                    <strong>{user?.email || '-'}</strong>
                  </div>
                  <div className="account-row">
                    <span>Phone</span>
                    <strong>{user?.phone || '-'}</strong>
                  </div>
                </div>
              </article>

              <article className="account-card">
                <h2 className="account-card__title">Quick Actions</h2>
                <div className="account-actions">
                  <Link className="account-link-btn" to="/orders">
                    View Order History
                  </Link>
                  <Link className="account-link-btn" to="/wishlist">
                    View Wishlist
                  </Link>
                  <Link className="account-link-btn" to="/forgot-password">
                    Request Password Reset
                  </Link>
                </div>

                <div className="account-logout">
                  <Button type="button" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </article>
            </div>
          ) : (
            <article className="account-card account-card--guest">
              <h2 className="account-card__title">Welcome</h2>
              <p className="account-card__guest-copy">
                Sign in to view your orders, wishlist, and account details.
              </p>
              <div className="account-actions account-actions--guest">
                <Link className="account-link-btn" to="/login">
                  Login
                </Link>
                <Link className="account-link-btn" to="/register">
                  Register
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
