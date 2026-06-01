import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import './ShippingForm.css';

export default function ShippingForm({
  initialData = { name: '', street: '', city: '', postalCode: '', country: '', notes: '' },
  onSubmit,
  isProcessing = false,
  className,
}) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form 
      className={cn('shipping-form', className)} 
      onSubmit={handleSubmit}
      aria-label="Shipping Details Form"
    >
      <header className="shipping-form__header">
        <h2 className="shipping-form__title">Shipping Details</h2>
      </header>

      <div className="shipping-form__fields">
        <div className="shipping-form__field">
          <label htmlFor="name" className="shipping-form__label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="shipping-form__input"
            value={formData.name}
            onChange={handleChange}
            disabled={isProcessing}
            required
            autoComplete="name"
            placeholder="John Doe"
          />
        </div>

        <div className="shipping-form__field">
          <label htmlFor="street" className="shipping-form__label">
            Address
          </label>
          <input
            id="street"
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
            <label htmlFor="city" className="shipping-form__label">
              City
            </label>
            <input
              id="city"
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
            <label htmlFor="postalCode" className="shipping-form__label">
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              className="shipping-form__input"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="postal-code"
              placeholder="10001"
            />
          </div>
        </div>

        <div className="shipping-form__field">
          <label htmlFor="country" className="shipping-form__label">
            Country
          </label>
          <input
            id="country"
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
          <label htmlFor="notes" className="shipping-form__label">
            Order Notes (Optional)
          </label>
          <textarea
            id="notes"
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
        <button 
          type="submit" 
          className="shipping-form__submit-btn"
          disabled={isProcessing}
          aria-busy={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Continue to Payment'}
        </button>
      </footer>
    </form>
  );
}
