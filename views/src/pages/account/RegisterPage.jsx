import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import { registerSchema } from '@/utils/validators'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import authHeroImage from '@/assets/Models/Dutch Van Der Linde1.png'
import './AuthPage.css'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      gender: '',
      interests: [],
      agree: false,
    },
  })

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const payload = {
        name: `${values.firstName?.trim() || ''} ${values.lastName?.trim() || ''}`.trim(),
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        email: values.email?.trim().toLowerCase(),
        phone: values.phone?.trim(),
        password: values.password,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        interests: values.interests || [],
        agree: values.agree,
      }

      await registerUser(payload)
      toast.success(t('auth.accountCreated'))
      navigate('/account', { replace: true })
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t('auth.createAccountError')
      setServerError(message)
      toast.error(message)
    }
  }

  return (
    <PageTransition>
      <section className="auth-split">
        <aside
          className="auth-hero"
          aria-hidden="true"
          style={{ backgroundImage: `url(${authHeroImage})` }}
        >
          <div className="auth-hero__overlay" />
          <div className="auth-hero__content">
            <div className="auth-hero__text-wrap">
              <p className="auth-hero__quote">
                {t('auth.quote')}
              </p>
              <p className="auth-hero__author">— THEOPHRASTUS</p>

              <div className="auth-hero__brand">
                <p className="auth-hero__brand-name">VAN DER LINDE</p>
                <p className="auth-hero__brand-sub">EST. 1874</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="auth-panel">
          <div className="auth-panel__inner">
            <div className="auth-tabs" role="tablist" aria-label={t('auth.tabs')}>
              <Link to="/login" className="auth-tab" role="tab" aria-selected="false">
                {t('auth.signIn')}
              </Link>
              <Link to="/register" className="auth-tab auth-tab--active" role="tab" aria-selected="true">
                {t('auth.register')}
              </Link>
            </div>

            <form className="auth-vdl-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {serverError && (
                <div className="auth-vdl-alert auth-vdl-alert--error" role="alert">
                  <span className="auth-vdl-alert__icon">⚠</span>
                  <span className="auth-vdl-alert__text">{serverError}</span>
                </div>
              )}
              <div className="auth-vdl-field">
                <label htmlFor="firstName" className="auth-vdl-label">{t('auth.firstName')}</label>
                <input
                  id="firstName"
                  type="text"
                  className={`auth-vdl-input${errors.firstName ? ' auth-vdl-input--error' : ''}`}
                  disabled={isSubmitting}
                  {...register('firstName')}
                />
                {errors.firstName && <p className="auth-vdl-error">{errors.firstName.message}</p>}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="lastName" className="auth-vdl-label">{t('auth.lastName')}</label>
                <input
                  id="lastName"
                  type="text"
                  className={`auth-vdl-input${errors.lastName ? ' auth-vdl-input--error' : ''}`}
                  disabled={isSubmitting}
                  {...register('lastName')}
                />
                {errors.lastName && <p className="auth-vdl-error">{errors.lastName.message}</p>}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="email" className="auth-vdl-label">{t('auth.email')}</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  className={`auth-vdl-input${errors.email ? ' auth-vdl-input--error' : ''}`}
                  disabled={isSubmitting}
                  {...register('email')}
                />
                {errors.email && <p className="auth-vdl-error">{errors.email.message}</p>}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="phone" className="auth-vdl-label">{t('auth.phone')}</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  autoComplete="tel"
                  className={`auth-vdl-input${errors.phone ? ' auth-vdl-input--error' : ''}`}
                  disabled={isSubmitting}
                  {...register('phone')}
                />
                {errors.phone && <p className="auth-vdl-error">{errors.phone.message}</p>}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="password" className="auth-vdl-label">{t('auth.password')}</label>
                <div className="auth-vdl-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`auth-vdl-input auth-vdl-input--password${errors.password ? ' auth-vdl-input--error' : ''}`}
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="auth-vdl-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    👁
                  </button>
                </div>
                {errors.password && <p className="auth-vdl-error">{errors.password.message}</p>}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="confirmPassword" className="auth-vdl-label">{t('auth.confirmPassword')}</label>
                <div className="auth-vdl-password-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`auth-vdl-input auth-vdl-input--password${errors.confirmPassword ? ' auth-vdl-input--error' : ''}`}
                    disabled={isSubmitting}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="auth-vdl-eye"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    disabled={isSubmitting}
                    aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    👁
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="auth-vdl-error">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* DATE OF BIRTH + GENDER (2 columns like screenshot) */}
              <div className="auth-vdl-grid-2">
                <div className="auth-vdl-field">
                  <label htmlFor="dateOfBirth" className="auth-vdl-label">{t('auth.dateOfBirth')}</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className={`auth-vdl-input${errors.dateOfBirth ? ' auth-vdl-input--error' : ''}`}
                    disabled={isSubmitting}
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && <p className="auth-vdl-error">{errors.dateOfBirth.message}</p>}
                </div>

                <div className="auth-vdl-field">
                  <label htmlFor="gender" className="auth-vdl-label">{t('auth.gender')}</label>
                  <select
                    id="gender"
                    className={`auth-vdl-input auth-vdl-select${errors.gender ? ' auth-vdl-input--error' : ''}`}
                    disabled={isSubmitting}
                    {...register('gender')}
                  >
                    <option value="">{t('auth.select')}</option>
                    <option value="male">{t('auth.male')}</option>
                    <option value="female">{t('auth.female')}</option>
                  </select>
                  {errors.gender && <p className="auth-vdl-error">{errors.gender.message}</p>}
                </div>
              </div>

              {/* INTERESTS */}
              <div className="auth-vdl-field">
                <label className="auth-vdl-label">{t('auth.interests')}</label>
                <div className="auth-vdl-interests">
                  <label className="auth-vdl-checkbox">
                    <input type="checkbox" value="mens" {...register('interests')} />
                    <span>{t('auth.mens')}</span>
                  </label>
                  <label className="auth-vdl-checkbox">
                    <input type="checkbox" value="womens" {...register('interests')} />
                    <span>{t('auth.womens')}</span>
                  </label>
                  <label className="auth-vdl-checkbox">
                    <input type="checkbox" value="limited_edition" {...register('interests')} />
                    <span>{t('auth.limitedEdition')}</span>
                  </label>
                </div>
              </div>

              {/* TERMS */}
              <div className="auth-vdl-row">
                <label className="auth-vdl-checkbox">
                  <input type="checkbox" {...register('agree')} />
                  <span>{t('auth.termsAgree')}</span>
                </label>
              </div>
              {errors.agree && <p className="auth-vdl-error">{errors.agree.message}</p>}

              <Button
                type="submit"
                className="auth-vdl-submit"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                {t('auth.register')}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
