import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import { loginSchema } from '@/utils/validators'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import authHeroImage from '@/assets/Models/Dutch Van Der Linde1.png'
import './AuthPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email.trim(), password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid email or password'
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
              <Link to="/login" className="auth-tab auth-tab--active" role="tab" aria-selected="true">
                SIGN IN
              </Link>
              <Link to="/register" className="auth-tab" role="tab" aria-selected="false">
                REGISTER
              </Link>
            </div>

            <form className="auth-vdl-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-vdl-field">
                <label htmlFor="email" className="auth-vdl-label">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  className={`auth-vdl-input${errors.email ? ' auth-vdl-input--error' : ''}`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isSubmitting}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="auth-vdl-error" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="password" className="auth-vdl-label">
                  PASSWORD
                </label>

                <div className="auth-vdl-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`auth-vdl-input auth-vdl-input--password${errors.password ? ' auth-vdl-input--error' : ''}`}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="auth-vdl-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    👁
                  </button>
                </div>

                {errors.password && (
                  <p id="password-error" className="auth-vdl-error" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="auth-vdl-row">
                <label className="auth-vdl-checkbox">
                  <input type="checkbox" {...register('remember')} />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className="auth-vdl-forgot">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="auth-vdl-submit"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                SIGN IN
              </Button>
            </form>

            <div className="auth-vdl-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="auth-vdl-socials">
              <button type="button" className="auth-vdl-social">GOOGLE</button>
              <button type="button" className="auth-vdl-social">APPLE</button>
              <button type="button" className="auth-vdl-social">FACEBOOK</button>
            </div>

            <div className="auth-vdl-benefits">
              <p className="auth-vdl-benefits__title">MEMBER BENEFITS</p>
              <ul>
                <li>Track orders in real-time</li>
                <li>Save watches to your wishlist</li>
                <li>Faster checkout experience</li>
                <li>Exclusive early access to new collections</li>
                <li>Earn reward points on every purchase</li>
                <li>Birthday gift from Van Der Linde</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}