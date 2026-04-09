/**
 * STUB COMPONENT: Header
 *
 * What this file is:
 * A temporary minimal header/navigation scaffold for the Van Der Linde layout.
 *
 * What it does:
 * Renders essential navigation links and shows auth/cart awareness through context.
 *
 * Where it is used:
 * Imported and rendered in Layout.jsx for all routes.
 *
 * NOTE:
 * Full header implementation (SearchBar, DarkModeToggle, CurrencySwitcher,
 * MobileMenu, sticky behavior, and responsive interactions) is owned by Dev 5.
 */
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

// Stub header component until complete responsive/header feature set is implemented.
export default function Header() {
  // Reads total item count; full header uses this in cart badge and mini cart triggers.
  const { totalItems } = useCart()

  // Reads authenticated user; full header uses this for account menu, logout, and role links.
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="header__inner">
        {/* Brand link always returns user to home page. */}
        <Link to="/">Van Der Linde</Link>

        {/* Minimal nav links for primary discovery routes. */}
        <nav aria-label="Primary">
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Utility links show cart count and auth-dependent entry point. */}
        <div className="header__actions">
          <Link to="/cart">Cart ({totalItems})</Link>
          {user ? <Link to="/profile">Profile</Link> : <Link to="/login">Login</Link>}
        </div>
      </div>
    </header>
  )
}
