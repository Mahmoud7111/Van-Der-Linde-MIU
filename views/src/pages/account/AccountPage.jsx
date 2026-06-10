import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import PageTransition from '@/components/common/PageTransition'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { FiShield } from 'react-icons/fi'
import { getInitials } from '@/utils/formatters'
import { USER_ROLES } from '@/utils/constants'
import './AccountPage.css'

const fadeContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const fadeItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function AccountPage() {
  // Get current user and auth actions
  // auth context provides the current user plus actions to update auth profile state
  const { user, updateProfile, logout } = useAuth()
  const { t } = useLanguage()
  // used to decide what to show: member UI or guest UI
  const isAuthenticated = Boolean(user)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  // Form state for editable fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState({})

  const fullName = useMemo(() => {
    return user?.name || t('account.guestUser')
  }, [user, t])

  const initials = useMemo(() => getInitials(fullName) || 'GU', [fullName])

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setFormErrors({})
    setIsEditing(false)
  }, [user])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: undefined }))
  }

  const validateProfile = () => {
    const nextErrors = {}
    const name = formData.name.trim()
    const email = formData.email.trim()
    const phone = formData.phone.trim()

    if (name.length < 2) nextErrors.name = 'Full name must be at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Please enter a valid email'
    if (phone && !/^\+?[0-9\s\-()]{7,20}$/.test(phone)) nextErrors.phone = 'Please enter a valid phone number'

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setFormErrors({})
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!validateProfile()) return

    setIsSaving(true)

    try {
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
      })
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
              <p className="account-page__eyebrow">{t('account.myAccount')}</p>
              <h1 className="account-page__name">{fullName}</h1>
              <p className="account-page__email">{user?.email || t('account.noEmail')}</p>
              <div className="account-page__badges">
                {isAuthenticated ? (
                  <Badge variant="primary">{t('account.member')}</Badge>
                ) : (
                  <Badge variant="warning">{t('account.guest')}</Badge>
                )}
                {isAuthenticated &&
                  (user?.isVerified ? (
                    <Badge variant="success">{t('account.verified')}</Badge>
                  ) : (
                    <Badge variant="warning">{t('account.unverified')}</Badge>
                  ))}
              </div>
            </div>
          </header>

          {isAuthenticated ? (
            <Motion.div className="account-page__grid" variants={fadeContainer} initial="hidden" animate="show">
              <Motion.article className="account-card" variants={fadeItem}>
                <h2 className="account-card__title">{t('account.profileDetails')}</h2>
                <div className="account-profile-form">
                  <div className="account-card__rows">
                    <label className="account-field">
                      <span>{t('account.fullName')}</span>
                      {isEditing ? (
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="name"
                          aria-invalid={Boolean(formErrors.name)}
                          aria-describedby={formErrors.name ? 'account-name-error' : undefined}
                        />
                      ) : (
                        <strong>{user?.name || '-'}</strong>
                      )}
                      {isEditing && formErrors.name && <small id="account-name-error" className="account-error">{formErrors.name}</small>}
                    </label>
                    <label className="account-field">
                      <span>{t('account.email')}</span>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="email"
                          aria-invalid={Boolean(formErrors.email)}
                          aria-describedby={formErrors.email ? 'account-email-error' : undefined}
                        />
                      ) : (
                        <strong>{user?.email || '-'}</strong>
                      )}
                      {isEditing && formErrors.email && <small id="account-email-error" className="account-error">{formErrors.email}</small>}
                    </label>
                    <label className="account-field">
                      <span>{t('account.phone')}</span>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFieldChange}
                          className="account-input"
                          autoComplete="tel"
                          aria-invalid={Boolean(formErrors.phone)}
                          aria-describedby={formErrors.phone ? 'account-phone-error' : undefined}
                        />
                      ) : (
                        <strong>{user?.phone || '-'}</strong>
                      )}
                      {isEditing && formErrors.phone && <small id="account-phone-error" className="account-error">{formErrors.phone}</small>}
                    </label>
                  </div>

                  <div className="account-profile-actions">
                    <Button type="button" onClick={handlePrimaryAction} isLoading={isSaving}>
                      {isEditing ? t('account.saveChanges') : t('account.edit')}
                    </Button>
                  </div>
                </div>
              </Motion.article>

              <Motion.article className="account-card" variants={fadeItem}>
                <h2 className="account-card__title">{t('account.quickActions')}</h2>
                <div className="account-actions">
                  {user?.role === USER_ROLES.ADMIN && (
                    <Link className="account-link-btn account-link-btn--admin" to="/admin">
                      <FiShield size={16} /> Admin Panel
                    </Link>
                  )}
                  <Link className="account-link-btn" to="/orders">
                    {t('account.orderHistory')}
                  </Link>
                  <Link className="account-link-btn" to="/wishlist">
                    {t('account.viewWishlist')}
                  </Link>
                  <Link className="account-link-btn" to="/forgot-password">
                    {t('account.passwordReset')}
                  </Link>
                </div>

                <div className="account-logout">
                  <Button type="button" onClick={handleLogout}>
                    {t('account.logout')}
                  </Button>
                </div>
              </Motion.article>
            </Motion.div>
          ) : (
            <Motion.article className="account-card account-card--guest" variants={fadeItem} initial="hidden" animate="show">
              <h2 className="account-card__title">{t('account.welcome')}</h2>
              <p className="account-card__guest-copy">
                {t('account.guestCopy')}
              </p>
              <div className="account-actions account-actions--guest">
                <Link className="account-link-btn" to="/login">
                  {t('nav.login')}
                </Link>
                <Link className="account-link-btn" to="/register">
                  {t('auth.register')}
                </Link>
              </div>
            </Motion.article>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
