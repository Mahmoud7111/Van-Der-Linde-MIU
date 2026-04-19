import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { cn } from '@/utils/cn'
import { FiX, FiShoppingBag } from 'react-icons/fi'
import CartItem from './CartItem'
import './CartOffcanvas.css'
export default function CartOffcanvas({ isOpen, onClose }) {
  const { cart, totalItems, totalPrice } = useCart()
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
        aria-label="Shopping Cart"
        aria-modal="true"
      >
        <header className="cart-offcanvas__header">
          <div className="cart-offcanvas__title-group">
            <h2 className="cart-offcanvas__title">Your Cart</h2>
            <span className="cart-offcanvas__count">({totalItems})</span>
          </div>
          <button 
            type="button" 
            className="cart-offcanvas__close-btn" 
            onClick={onClose}
            aria-label="Close cart"
          >
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className="cart-offcanvas__body">
          {cart.length === 0 ? (
            <div className="cart-offcanvas__empty">
              <FiShoppingBag className="cart-offcanvas__empty-icon" aria-hidden="true" />
              <p className="cart-offcanvas__empty-text">Your cart is currently empty.</p>
              <button 
                type="button" 
                className="cart-offcanvas__continue-btn" 
                onClick={onClose}
              >
                Continue Shopping
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
              <span className="cart-offcanvas__summary-label">Subtotal</span>
              <span className="cart-offcanvas__summary-value">
                ${Number(totalPrice).toFixed(2)}
              </span>
            </div>
            <p className="cart-offcanvas__taxes-note">
              Taxes and shipping calculated at checkout.
            </p>
            <Link 
              to="/checkout" 
              className="cart-offcanvas__checkout-link"
              onClick={onClose}
            >
              Proceed to Checkout
            </Link>
          </footer>
        )}
      </aside>
    </div>
  )
}
