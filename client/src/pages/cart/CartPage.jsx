import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { cn } from '@/utils/cn'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import './CartPage.css'

export default function CartPage() {
  const { cart, totalPrice } = useCart()

  const safeCart = Array.isArray(cart) ? cart : []
  const safeTotalPrice = typeof totalPrice === 'number' ? totalPrice : 0

  const navigate = useNavigate()

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (safeCart.length === 0) {
    return (
      <main className="cart-page cart-page--empty">
        <div className="cart-page__empty-state">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <p className="cart-page__empty-text">Your cart is currently empty.</p>
          <Link to="/shop" className="cart-page__continue-btn">
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <header className="cart-page__header">
        <h1 className="cart-page__title">Shopping Cart</h1>
      </header>

      <div className="cart-page__content">
        <section className="cart-page__items-list" aria-label="Cart Items">
          <ul className="cart-page__items">
            {safeCart.map((item) => (
              <li key={item._id}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>
        </section>

        <aside className="cart-page__sidebar" aria-label="Cart Summary">
          <CartSummary
            subtotal={safeTotalPrice}
            shippingCost={0}
            tax={0}
            total={safeTotalPrice}
            onCheckout={handleCheckout}
          />
        </aside>
      </div>
    </main>
  )
}