import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'
import { FiX, FiShoppingBag } from 'react-icons/fi'
import CartItem from './CartItem'
import './CartOffcanvas.css'
export default function CartOffcanvas({ isOpen, onClose }) {
  const { cart, totalItems, totalPrice } = useCart()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  return (
    <div className={cn('cart-offcanvas', isOpen && 'cart-offcanvas--open')}>
      {/* Dark overlay behind the panel */}
      <div 
        className="cart-offcanvas__overlay" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      {/* Slide-in panel */}
      <aside 
        className="cart-offcanvas__panel" 
        role="dialog" 
        aria-label={t('cart.title')}
        aria-modal="true"
      >
        <header className="cart-offcanvas__header">
          <div className="cart-offcanvas__title-group">
            <h2 className="cart-offcanvas__title">{t('cart.title')}</h2>
            <span className="cart-offcanvas__count">({totalItems})</span>
          </div>
          <button 
            type="button" 
            className="cart-offcanvas__close-btn" 
            onClick={onClose}
            aria-label={t('cart.close')}
          >
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className="cart-offcanvas__body">
          {cart.length === 0 ? (
            <div className="cart-offcanvas__empty">
              <FiShoppingBag className="cart-offcanvas__empty-icon" aria-hidden="true" />
              <p className="cart-offcanvas__empty-text">{t('cart.empty')}</p>
              <button 
                type="button" 
                className="cart-offcanvas__continue-btn" 
                onClick={onClose}
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <ul className="cart-offcanvas__items">
              {cart.map((item) => (
                <li key={item._id}>
                  <CartItem item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <footer className="cart-offcanvas__footer">
            <div className="cart-offcanvas__summary-row">
              <span className="cart-offcanvas__summary-label">{t('cart.subtotal')}</span>
              <span className="cart-offcanvas__summary-value">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="cart-offcanvas__taxes-note">
              {t('cart.taxesShipping')}
            </p>
            <div className="cart-offcanvas__actions">
              <Link
                to="/cart"
                className="cart-offcanvas__cart-link"
                onClick={onClose}
              >
                {t('cart.viewCart')}
              </Link>
              <Link
                to="/checkout"
                className="cart-offcanvas__checkout-link"
                onClick={onClose}
              >
                {t('cart.proceedCheckout')}
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>
  )
}
