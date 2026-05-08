import { useState } from 'react'
import Button from '@/components/common/Button'
import { cn } from '@/utils/cn'
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
  const [formData, setFormData] = useState(normalizeInitialData(initialData))

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form
      className={cn('shipping-form', className)}
      onSubmit={handleSubmit}
      aria-label="Shipping details form"
    >
      <header className="shipping-form__header">
        <h2 className="shipping-form__title">Shipping Details</h2>
      </header>

      <div className="shipping-form__fields">
        <div className="shipping-form__field">
          <label htmlFor="shipping-name" className="shipping-form__label">
            Full Name
          </label>
          <input
            id="shipping-name"
            name="fullName"
            type="text"
            className="shipping-form__input"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isProcessing}
            required
            autoComplete="name"
            placeholder="John Doe"
          />
        </div>

        <div className="shipping-form__row">
          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-email" className="shipping-form__label">
              Email
            </label>
            <input
              id="shipping-email"
              name="email"
              type="email"
              className="shipping-form__input"
              value={formData.email}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-phone" className="shipping-form__label">
              Phone
            </label>
            <input
              id="shipping-phone"
              name="phone"
              type="tel"
              className="shipping-form__input"
              value={formData.phone}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="tel"
              placeholder="+1 555 123 4567"
            />
          </div>
        </div>

        <div className="shipping-form__field">
          <label htmlFor="shipping-street" className="shipping-form__label">
            Address
          </label>
          <input
            id="shipping-street"
            name="street"
            type="text"
            className="shipping-form__input"
            value={formData.street}
            onChange={handleChange}
            disabled={isProcessing}
            required
            autoComplete="street-address"
            placeholder="123 Luxury Ave, Suite 100"
          />
        </div>

        <div className="shipping-form__row">
          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-city" className="shipping-form__label">
              City
            </label>
            <input
              id="shipping-city"
              name="city"
              type="text"
              className="shipping-form__input"
              value={formData.city}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="address-level2"
              placeholder="New York"
            />
          </div>

          <div className="shipping-form__field shipping-form__field--half">
            <label htmlFor="shipping-postal-code" className="shipping-form__label">
              Postal Code
            </label>
            <input
              id="shipping-postal-code"
              name="zip"
              type="text"
              className="shipping-form__input"
              value={formData.zip}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="postal-code"
              placeholder="10001"
            />
          </div>
        </div>

        <div className="shipping-form__field">
          <label htmlFor="shipping-country" className="shipping-form__label">
            Country
          </label>
          <input
            id="shipping-country"
            name="country"
            type="text"
            className="shipping-form__input"
            value={formData.country}
            onChange={handleChange}
            disabled={isProcessing}
            required
            autoComplete="country"
            placeholder="United States"
          />
        </div>

        <div className="shipping-form__field">
          <label htmlFor="shipping-notes" className="shipping-form__label">
            Order Notes (Optional)
          </label>
          <textarea
            id="shipping-notes"
            name="notes"
            className="shipping-form__textarea"
            value={formData.notes}
            onChange={handleChange}
            disabled={isProcessing}
            placeholder="Special instructions for delivery..."
            rows={4}
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
          Continue to Payment
        </Button>
      </footer>
    </form>
  )
}
