import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import { registerSchema } from '@/utils/validators'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import authHeroImage from '@/assets/Models/Dutch Van Der Linde1.png'
import './AuthPage.css'
const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    try {
      const payload = {
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim(),
        password: values.password,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        interests: values.interests || [],
        agree: values.agree,
      }

      await registerUser(payload)
      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Could not create account'
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
                "Time is the most valuable
                <br />
                thing a man can spend."
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
            <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
              <Link to="/login" className="auth-tab" role="tab" aria-selected="false">
                SIGN IN
              </Link>
              <Link to="/register" className="auth-tab auth-tab--active" role="tab" aria-selected="true">
                REGISTER
              </Link>
            </div>

            <form className="auth-vdl-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-vdl-field">
                <label htmlFor="firstName" className="auth-vdl-label">FIRST NAME</label>
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
                <label htmlFor="lastName" className="auth-vdl-label">LAST NAME</label>
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
                <label htmlFor="email" className="auth-vdl-label">EMAIL</label>
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
                <label htmlFor="phone" className="auth-vdl-label">PHONE</label>
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
                <label htmlFor="password" className="auth-vdl-label">PASSWORD</label>
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    👁
                  </button>
                </div>
                {errors.password && <p className="auth-vdl-error">{errors.password.message}</p>}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="confirmPassword" className="auth-vdl-label">CONFIRM PASSWORD</label>
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
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                  <label htmlFor="dateOfBirth" className="auth-vdl-label">DATE OF BIRTH</label>
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
                  <label htmlFor="gender" className="auth-vdl-label">GENDER</label>
                  <select
                    id="gender"
                    className={`auth-vdl-input auth-vdl-select${errors.gender ? ' auth-vdl-input--error' : ''}`}
                    disabled={isSubmitting}
                    {...register('gender')}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="auth-vdl-error">{errors.gender.message}</p>}
                </div>
              </div>

              {/* INTERESTS */}
              <div className="auth-vdl-field">
                <label className="auth-vdl-label">INTERESTS</label>
                <div className="auth-vdl-interests">
                  <label className="auth-vdl-checkbox">
                    <input type="checkbox" value="mens" {...register('interests')} />
                    <span>Men&apos;s</span>
                  </label>
                  <label className="auth-vdl-checkbox">
                    <input type="checkbox" value="womens" {...register('interests')} />
                    <span>Women&apos;s</span>
                  </label>
                  <label className="auth-vdl-checkbox">
                    <input type="checkbox" value="limited_edition" {...register('interests')} />
                    <span>Limited Edition</span>
                  </label>
                </div>
              </div>

              {/* TERMS */}
              <div className="auth-vdl-row">
                <label className="auth-vdl-checkbox">
                  <input type="checkbox" {...register('agree')} />
                  <span>I agree to the Terms & Conditions and Privacy Policy</span>
                </label>
              </div>
              {errors.agree && <p className="auth-vdl-error">{errors.agree.message}</p>}

              <Button
                type="submit"
                className="auth-vdl-submit"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                REGISTER
              </Button>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
