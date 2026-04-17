import React from 'react'
import { cn } from '@/utils/cn'
import './CartSummary.css'
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
export default function CartSummary({
  subtotal,
  shippingCost = 0,
  tax = 0,
  total,
  isProcessing = false,
  onCheckout,
  className,
}) {
  return (
    <section className={cn('cart-summary', className)} aria-label="Order Summary">
      <h2 className="cart-summary__title">Order Summary</h2>
      <dl className="cart-summary__list">
        <div className="cart-summary__row">
          <dt className="cart-summary__label">Subtotal</dt>
          <dd className="cart-summary__value">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="cart-summary__row">
          <dt className="cart-summary__label">Estimated Shipping</dt>
          <dd className="cart-summary__value">
            {shippingCost === 0 ? 'Calculated at checkout' : formatCurrency(shippingCost)}
          </dd>
        </div>
        <div className="cart-summary__row">
          <dt className="cart-summary__label">Estimated Tax</dt>
          <dd className="cart-summary__value">{formatCurrency(tax)}</dd>
        </div>
        <div className={cn('cart-summary__row', 'cart-summary__row--total')}>
          <dt className="cart-summary__label">Total</dt>
          <dd className="cart-summary__value">{formatCurrency(total)}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="cart-summary__checkout-btn"
        onClick={onCheckout}
        disabled={isProcessing}
        aria-busy={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      <p className="cart-summary__note">
        Taxes and shipping costs may change during the checkout process based on your final shipping address.
      </p>
    </section>
  )
}