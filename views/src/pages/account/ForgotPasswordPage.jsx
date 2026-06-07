import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import { forgotPasswordSchema } from '@/utils/validators'
import { authService } from '@/services/authService'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import authHeroImage from '@/assets/Models/Dutch Van Der Linde1.png'
import './AuthPage.css'

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword({ email: email.trim() })
      toast.success('If this email exists, a reset link has been sent.')
      reset()
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send reset email'
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
                FORGOT PASSWORD
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

              <Button
                type="submit"
                className="auth-vdl-submit"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                SEND RESET LINK
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
