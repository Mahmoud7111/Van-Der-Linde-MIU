import { useState } from 'react'
import Button from '@/components/common/Button'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'
import './PaymentForm.css'

const DEFAULT_PAYMENT_DATA = {
  paymentMethod: 'Credit Card',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

const luhnCheck = (value) => {
  const digits = String(value || '').replace(/\D/g, '')
  let sum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return digits.length >= 13 && digits.length <= 19 && sum % 10 === 0
}

const isValidExpiry = (value) => {
  const match = String(value || '').trim().match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false

  const month = Number(match[1])
  const year = Number(`20${match[2]}`)
  if (month < 1 || month > 12) return false

  const now = new Date()
  const expiryDate = new Date(year, month)
  return expiryDate > new Date(now.getFullYear(), now.getMonth())
}

const validatePayment = (data) => {
  if (data.paymentMethod === 'Cash on Delivery') return {}

  const errors = {}
  const cardName = String(data.cardName || '').trim()
  const cvv = String(data.cvv || '').trim()

  if (cardName.length < 2) errors.cardName = 'Cardholder name is required'
  if (!luhnCheck(data.cardNumber)) errors.cardNumber = 'Please enter a valid card number'
  if (!isValidExpiry(data.expiry)) errors.expiry = 'Please enter a valid future expiry date'
  if (!/^\d{3,4}$/.test(cvv)) errors.cvv = 'Please enter a valid CVV'

  return errors
}

export default function PaymentForm({
  initialData,
  onSubmit,
  onBack,
  isProcessing = false,
  className,
}) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    ...DEFAULT_PAYMENT_DATA,
    ...(initialData || {}),
  })
  const [errors, setErrors] = useState({})

  const isCOD = formData.paymentMethod === 'Cash on Delivery'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validatePayment(formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit?.(formData)
  }

  return (
    <form
      className={cn('payment-form', className)}
      onSubmit={handleSubmit}
      aria-label={t('checkout.paymentInfo')}
    >
      <header className="payment-form__header">
        <h2 className="payment-form__title">{t('checkout.paymentTitle')}</h2>
      </header>

      <fieldset className="payment-form__method-group" disabled={isProcessing}>
        <legend className="payment-form__method-legend">{t('checkout.paymentMethod')}</legend>

        <div className="payment-form__method-options">
          <label className="payment-form__method-label">
            <input
              type="radio"
              name="paymentMethod"
              value="Credit Card"
              className="payment-form__method-input"
              checked={formData.paymentMethod === 'Credit Card'}
              onChange={handleChange}
              disabled={isProcessing}
            />
            <span className="payment-form__method-name">{t('checkout.creditCard')}</span>
          </label>

          <label className="payment-form__method-label">
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              className="payment-form__method-input"
              checked={isCOD}
              onChange={handleChange}
              disabled={isProcessing}
            />
            <span className="payment-form__method-name">{t('checkout.cashDelivery')}</span>
          </label>
        </div>
      </fieldset>

      {isCOD ? (
        <div className="payment-form__cod-notice">
          <svg
            className="payment-form__cod-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
          </svg>
          <p className="payment-form__cod-text">
            {t('checkout.codNotice')}
          </p>
        </div>
      ) : (
        <div className="payment-form__fields">
          <div className="payment-form__field">
            <label htmlFor="payment-card-name" className="payment-form__label">
              {t('checkout.cardholder')}
            </label>
            <input
              id="payment-card-name"
              name="cardName"
              type="text"
              className="payment-form__input"
              value={formData.cardName}
              onChange={handleChange}
              disabled={isProcessing}
              aria-invalid={Boolean(errors.cardName)}
              aria-describedby={errors.cardName ? 'payment-card-name-error' : undefined}
              autoComplete="cc-name"
              placeholder={t('checkout.cardNamePlaceholder')}
            />
            {errors.cardName && <p id="payment-card-name-error" className="payment-form__error">{errors.cardName}</p>}
          </div>

          <div className="payment-form__field">
            <label htmlFor="payment-card-number" className="payment-form__label">
              {t('checkout.cardNumber')}
            </label>
            <input
              id="payment-card-number"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              className="payment-form__input payment-form__input--mono"
              value={formData.cardNumber}
              onChange={handleChange}
              disabled={isProcessing}
              aria-invalid={Boolean(errors.cardNumber)}
              aria-describedby={errors.cardNumber ? 'payment-card-number-error' : undefined}
              autoComplete="cc-number"
              minLength={16}
              maxLength={19}
              pattern="[0-9\s]*"
              placeholder="0000 0000 0000 0000"
            />
            {errors.cardNumber && <p id="payment-card-number-error" className="payment-form__error">{errors.cardNumber}</p>}
          </div>

          <div className="payment-form__row">
            <div className="payment-form__field payment-form__field--half">
              <label htmlFor="payment-expiry" className="payment-form__label">
                {t('checkout.expiry')}
              </label>
              <input
                id="payment-expiry"
                name="expiry"
                type="text"
                inputMode="numeric"
                className="payment-form__input payment-form__input--mono"
                value={formData.expiry}
                onChange={handleChange}
                disabled={isProcessing}
                aria-invalid={Boolean(errors.expiry)}
                aria-describedby={errors.expiry ? 'payment-expiry-error' : undefined}
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiry && <p id="payment-expiry-error" className="payment-form__error">{errors.expiry}</p>}
            </div>

            <div className="payment-form__field payment-form__field--half">
              <label htmlFor="payment-cvv" className="payment-form__label">
                CVV
              </label>
              <input
                id="payment-cvv"
                name="cvv"
                type="text"
                inputMode="numeric"
                className="payment-form__input payment-form__input--mono"
                value={formData.cvv}
                onChange={handleChange}
                disabled={isProcessing}
                aria-invalid={Boolean(errors.cvv)}
                aria-describedby={errors.cvv ? 'payment-cvv-error' : undefined}
                autoComplete="cc-csc"
                minLength={3}
                maxLength={4}
                pattern="[0-9]*"
                placeholder="123"
              />
              {errors.cvv && <p id="payment-cvv-error" className="payment-form__error">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="payment-form__security-notice">
        <svg
          className="payment-form__security-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="payment-form__security-text">{t('checkout.security')}</span>
      </div>

      <footer className="payment-form__actions">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            className="payment-form__back-btn"
            onClick={onBack}
            disabled={isProcessing}
          >
            {t('checkout.backShipping')}
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          className="payment-form__submit-btn"
          disabled={isProcessing}
          isLoading={isProcessing}
        >
          {t('checkout.continueReview')}
        </Button>
      </footer>
    </form>
  )
}
