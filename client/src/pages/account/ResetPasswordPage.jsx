
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import { resetPasswordSchema } from '@/utils/validators'
import { authService } from '@/services/authService'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import authHeroImage from '@/assets/Models/Dutch Van Der Linde1.png'
import './AuthPage.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      resetToken: searchParams.get('token') || '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async ({ resetToken, password }) => {
    try {
      await authService.resetPassword({
        token: resetToken.trim(),
        password,
      })

      toast.success('Password reset successful. Please sign in.')
      navigate('/login', { replace: true })
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password'
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
              <Link to="/register" className="auth-tab" role="tab" aria-selected="false">
                REGISTER
              </Link>
            </div>

            <form className="auth-vdl-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-vdl-field">
                <label htmlFor="resetToken" className="auth-vdl-label">
                  RESET TOKEN
                </label>
                <input
                  id="resetToken"
                  type="text"
                  placeholder="Paste your reset token"
                  className={`auth-vdl-input${errors.resetToken ? ' auth-vdl-input--error' : ''}`}
                  aria-invalid={Boolean(errors.resetToken)}
                  aria-describedby={errors.resetToken ? 'reset-token-error' : undefined}
                  disabled={isSubmitting}
                  {...register('resetToken')}
                />
                {errors.resetToken && (
                  <p id="reset-token-error" className="auth-vdl-error" role="alert">
                    {errors.resetToken.message}
                  </p>
                )}
              </div>

              <div className="auth-vdl-field">
                <label htmlFor="password" className="auth-vdl-label">
                  NEW PASSWORD
                </label>

                <div className="auth-vdl-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`auth-vdl-input auth-vdl-input--password${errors.password ? ' auth-vdl-input--error' : ''}`}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="auth-vdl-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
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

              <div className="auth-vdl-field">
                <label htmlFor="confirmPassword" className="auth-vdl-label">
                  CONFIRM NEW PASSWORD
                </label>

                <div className="auth-vdl-password-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`auth-vdl-input auth-vdl-input--password${errors.confirmPassword ? ' auth-vdl-input--error' : ''}`}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                    disabled={isSubmitting}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="auth-vdl-eye"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    👁
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="auth-vdl-error" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="auth-vdl-submit"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                RESET PASSWORD
              </Button>
            </form>

            <div className="auth-vdl-row auth-vdl-row--cta">
              <Link to="/login" className="auth-vdl-forgot">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
