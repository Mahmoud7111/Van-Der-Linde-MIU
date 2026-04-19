import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import './OrderReview.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function OrderReview({
  cart = { items: [], subtotal: 0, tax: 0, shippingCost: 0, total: 0 },
  shippingData = {},
  paymentData = {},
  onPlaceOrder,
  isProcessing = false,
  className,
}) {
  return (
    <section className={cn('order-review', className)} aria-label="Order summary and review">
      <header className="order-review__header">
        <h2 className="order-review__title">Review Your Order</h2>
      </header>

      <div className="order-review__content">
        <section className="order-review__items-section" aria-label="Order items">
          <ul className="order-review__item-list">
            {cart.items.map((item) => (
              <li key={item.id} className="order-review__item">
                <figure className="order-review__item-figure">
                  <div className="order-review__item-image-wrapper">
                    <img 
                      src={item.image || '/placeholder-watch.jpg'} 
                      alt={`Image of ${item.brand} ${item.name}`} 
                      className="order-review__item-image" 
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="order-review__item-details">
                    <span className="order-review__item-brand">{item.brand}</span>
                    <h3 className="order-review__item-name">{item.name}</h3>
                    <span className="order-review__item-qty">Qty: {item.quantity}</span>
                  </figcaption>
                </figure>
                <div className="order-review__item-price-wrapper">
                  <span className="order-review__item-price">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="order-review__info-grid">
          <article className="order-review__info-block" aria-label="Shipping details">
            <div className="order-review__info-header">
              <h3 className="order-review__info-title">Shipping Address</h3>
              <Link to="/checkout/shipping" className="order-review__info-edit">
                Edit
              </Link>
            </div>
            <address className="order-review__info-content">
              {shippingData.name}<br />
              {shippingData.street}<br />
              {shippingData.city}, {shippingData.postalCode}<br />
              {shippingData.country}
            </address>
          </article>

          <article className="order-review__info-block" aria-label="Payment details">
            <div className="order-review__info-header">
              <h3 className="order-review__info-title">Payment Method</h3>
              <Link to="/checkout/payment" className="order-review__info-edit">
                Edit
              </Link>
            </div>
            <div className="order-review__info-content">
              <span className="order-review__payment-method">{paymentData.method}</span>
              {paymentData.last4 && (
                <span className="order-review__payment-card">
                  {paymentData.brand} ending in {paymentData.last4}
                </span>
              )}
            </div>
          </article>
        </div>

        <section className="order-review__summary-section" aria-label="Order totals">
          <dl className="order-review__totals">
            <div className="order-review__total-row">
              <dt className="order-review__total-label">Subtotal</dt>
              <dd className="order-review__total-value">{formatCurrency(cart.subtotal)}</dd>
            </div>
            <div className="order-review__total-row">
              <dt className="order-review__total-label">Shipping</dt>
              <dd className="order-review__total-value">
                {cart.shippingCost === 0 ? 'Complimentary' : formatCurrency(cart.shippingCost)}
              </dd>
            </div>
            <div className="order-review__total-row">
              <dt className="order-review__total-label">Estimated Tax</dt>
              <dd className="order-review__total-value">{formatCurrency(cart.tax)}</dd>
            </div>
            <div className="order-review__total-row order-review__total-row--final">
              <dt className="order-review__total-label">Total</dt>
              <dd className="order-review__total-value">{formatCurrency(cart.total)}</dd>
            </div>
          </dl>
        </section>

        <footer className="order-review__footer">
          <button 
            type="button"
            className="order-review__submit-btn" 
            onClick={onPlaceOrder}
            disabled={isProcessing}
            aria-busy={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </footer>
      </div>
    </section>
  );
}
