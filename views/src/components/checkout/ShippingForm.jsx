import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@/components/common/Button'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'
import { shippingSchema } from '@/utils/validators'
import './ShippingForm.css'

const DEFAULT_SHIPPING_DATA = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  zip: '',
  country: '',
  notes: '',
}

const normalizeInitialData = (initialData = {}) => ({
  ...DEFAULT_SHIPPING_DATA,
  ...initialData,
  // Backward compatibility with older field names.
  fullName: initialData?.fullName || initialData?.name || '',
  zip: initialData?.zip || initialData?.postalCode || '',
})

export default function ShippingForm({
  initialData,
  onSubmit,
  isProcessing = false,
  className,
}) {
  const { t } = useLanguage()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingSchema),
    mode: 'onBlur',
    defaultValues: normalizeInitialData(initialData),
  })

  useEffect(() => {
    reset(normalizeInitialData(initialData))
  }, [initialData, reset])

  const submitShipping = (values) => {
    onSubmit?.(values)
  }

  return (
    <form
      className={cn('shipping-form', className)}
      onSubmit={handleSubmit(submitShipping)}
      aria-label={t('checkout.shippingForm')}
      noValidate
    >
      <header className="shipping-form__header">
        <h2 className="shipping-form__title">{t('checkout.shippingDetails')}</h2>
      </header>

      <div className="shipping-form__fields">
        <div className="shipping-form__field">
          <label htmlFor="shipping-name" className="shipping-form__label">
            {t('checkout.fullName')}
          </label>
          <input
            id="shipping-name"
            name="fullName"
            type="text"
            className="shipping-form__input"
            disabled={isProcessing}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'shipping-name-error' : undefined}
            autoComplete="name"
            placeholder="John Doe"
            {...register('fullName')}
          />
          {errors.fullName && <p id="shipping-name-error" className="shipping-form__error">{errors.fullName.message}</p>}
        </div>

        <div className="shipping-form__row">
          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-email" className="shipping-form__label">
              {t('checkout.email')}
            </label>
            <input
              id="shipping-email"
              name="email"
              type="email"
              className="shipping-form__input"
              disabled={isProcessing}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'shipping-email-error' : undefined}
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p id="shipping-email-error" className="shipping-form__error">{errors.email.message}</p>}
          </div>

          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-phone" className="shipping-form__label">
              {t('checkout.phone')}
            </label>
            <input
              id="shipping-phone"
              name="phone"
              type="tel"
              className="shipping-form__input"
              disabled={isProcessing}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'shipping-phone-error' : undefined}
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              {...register('phone')}
            />
            {errors.phone && <p id="shipping-phone-error" className="shipping-form__error">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="shipping-form__field">
          <label htmlFor="shipping-street" className="shipping-form__label">
            {t('checkout.address')}
          </label>
          <input
            id="shipping-street"
            name="street"
            type="text"
            className="shipping-form__input"
            disabled={isProcessing}
            aria-invalid={Boolean(errors.street)}
            aria-describedby={errors.street ? 'shipping-street-error' : undefined}
            autoComplete="street-address"
            placeholder="123 Luxury Ave, Suite 100"
            {...register('street')}
          />
          {errors.street && <p id="shipping-street-error" className="shipping-form__error">{errors.street.message}</p>}
        </div>

        <div className="shipping-form__row">
          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-city" className="shipping-form__label">
              {t('checkout.city')}
            </label>
            <input
              id="shipping-city"
              name="city"
              type="text"
              className="shipping-form__input"
              disabled={isProcessing}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'shipping-city-error' : undefined}
              autoComplete="address-level2"
              placeholder="New York"
              {...register('city')}
            />
            {errors.city && <p id="shipping-city-error" className="shipping-form__error">{errors.city.message}</p>}
          </div>

          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-postal-code" className="shipping-form__label">
              {t('checkout.postalCode')}
            </label>
            <input
              id="shipping-postal-code"
              name="zip"
              type="text"
              className="shipping-form__input"
              disabled={isProcessing}
              aria-invalid={Boolean(errors.zip)}
              aria-describedby={errors.zip ? 'shipping-zip-error' : undefined}
              autoComplete="postal-code"
              placeholder="10001"
              {...register('zip')}
            />
            {errors.zip && <p id="shipping-zip-error" className="shipping-form__error">{errors.zip.message}</p>}
          </div>
        </div>

        <div className="shipping-form__field">
          <label htmlFor="shipping-country" className="shipping-form__label">
            {t('checkout.country')}
          </label>
          <input
            id="shipping-country"
            name="country"
            type="text"
            className="shipping-form__input"
            disabled={isProcessing}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? 'shipping-country-error' : undefined}
            autoComplete="country"
            placeholder="United States"
            {...register('country')}
          />
          {errors.country && <p id="shipping-country-error" className="shipping-form__error">{errors.country.message}</p>}
        </div>

        <div className="shipping-form__field">
          <label htmlFor="shipping-notes" className="shipping-form__label">
            {t('checkout.orderNotes')}
          </label>
          <textarea
            id="shipping-notes"
            name="notes"
            className="shipping-form__textarea"
            disabled={isProcessing}
            placeholder={t('checkout.notesPlaceholder')}
            rows={4}
            {...register('notes')}
          />
        </div>
      </div>

      <footer className="shipping-form__actions">
        <Button
          type="submit"
          variant="primary"
          className="shipping-form__submit-btn"
          disabled={isProcessing}
          isLoading={isProcessing}
        >
          {t('checkout.continuePayment')}
        </Button>
      </footer>
    </form>
  )
}
