import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/common/PageTransition'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { getInitials } from '@/utils/formatters'
import './AccountPage.css'

export default function AccountPage() {
  //auth context provides the current user plus actions to update  auth profile state
  const { user, updateProfile, logout } = useAuth()
  // used to deciede what to show member ui or guest ui  const isAuthenticated = Boolean(user)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const fullName = useMemo(() => {
    const first = user?.firstName || ''
    const last = user?.lastName || ''
    const combined = `${first} ${last}`.trim()
    return combined || user?.name || 'Guest User'
  }, [user])

  const initials = useMemo(() => getInitials(fullName) || 'GU', [fullName])

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setIsEditing(false)
  }, [user])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleEdit = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await updateProfile(formData)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrimaryAction = async () => {
    if (isEditing) {
      await handleSave()
      return
    }

    handleEdit()
  }

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
                <div className="account-profile-form">
                  <div className="account-card__rows">
                    <label className="account-field">
                      <span>First Name</span>
                      {isEditing ? (
                        <input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="given-name"
                        />
                      ) : (
                        <strong>{user?.firstName || '-'}</strong>
                      )}
                    </label>
                    <label className="account-field">
                      <span>Last Name</span>
                      {isEditing ? (
                        <input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="family-name"
                        />
                      ) : (
                        <strong>{user?.lastName || '-'}</strong>
                      )}
                    </label>
                    <label className="account-field">
                      <span>Email</span>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="email"
                        />
                      ) : (
                        <strong>{user?.email || '-'}</strong>
                      )}
                    </label>
                    <label className="account-field">
                      <span>Phone</span>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="tel"
                        />
                      ) : (
                        <strong>{user?.phone || '-'}</strong>
                      )}
                    </label>
                  </div>

                  <div className="account-profile-actions">
                    <Button type="button" onClick={handlePrimaryAction} isLoading={isSaving}>
                      {isEditing ? 'Save Changes' : 'Edit'}
                    </Button>
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
