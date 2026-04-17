import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import './PaymentForm.css';

export default function PaymentForm({
  initialData = { cardName: '', cardNumber: '', expiry: '', cvv: '' },
  onSubmit,
  onBack,
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
      className={cn('payment-form', className)}
      onSubmit={handleSubmit}
      aria-label="Payment Information"
    >
      <header className="payment-form__header">
        <h2 className="payment-form__title">Payment Information</h2>
      </header>

      <fieldset className="payment-form__method-group" disabled={isProcessing}>
        <legend className="payment-form__method-legend sr-only" style={{ display: 'none' }}>Payment Method</legend>
        <div className="payment-form__method-options">
          <label className="payment-form__method-label">
            <input
              type="radio"
              name="paymentMethod"
              value="Credit Card"
              className="payment-form__method-input"
              defaultChecked
              disabled={isProcessing}
            />
            <span className="payment-form__method-name">Credit Card</span>
          </label>
        </div>
      </fieldset>

      <div className="payment-form__fields">
        <div className="payment-form__field">
          <label htmlFor="cardName" className="payment-form__label">
            Cardholder Name
          </label>
          <input
            id="cardName"
            name="cardName"
            type="text"
            className="payment-form__input"
            value={formData.cardName}
            onChange={handleChange}
            disabled={isProcessing}
            required
            autoComplete="cc-name"
            placeholder="Name on card"
          />
        </div>

        <div className="payment-form__field">
          <label htmlFor="cardNumber" className="payment-form__label">
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            className="payment-form__input payment-form__input--mono"
            value={formData.cardNumber}
            onChange={handleChange}
            disabled={isProcessing}
            required
            autoComplete="cc-number"
            minLength={16}
            maxLength={19}
            pattern="[0-9\s]*"
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div className="payment-form__row">
          <div className="payment-form__field payment-form__field--half">
            <label htmlFor="expiry" className="payment-form__label">
              Expiry Date
            </label>
            <input
              id="expiry"
              name="expiry"
              type="text"
              inputMode="numeric"
              className="payment-form__input payment-form__input--mono"
              value={formData.expiry}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>

          <div className="payment-form__field payment-form__field--half">
            <label htmlFor="cvv" className="payment-form__label">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              inputMode="numeric"
              className="payment-form__input payment-form__input--mono"
              value={formData.cvv}
              onChange={handleChange}
              disabled={isProcessing}
              required
              autoComplete="cc-csc"
              minLength={3}
              maxLength={4}
              pattern="[0-9]*"
              placeholder="123"
            />
          </div>
        </div>
      </div>

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
        <span className="payment-form__security-text">
          Transactions are encrypted and secured.
        </span>
      </div>

      <footer className="payment-form__actions">
        {onBack && (
          <button
            type="button"
            className="payment-form__back-btn"
            onClick={onBack}
            disabled={isProcessing}
          >
            Back to Shipping
          </button>
        )}
        <button
          type="submit"
          className="payment-form__submit-btn"
          disabled={isProcessing}
          aria-busy={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Continue to Review'}
        </button>
      </footer>
    </form>
  );
}
