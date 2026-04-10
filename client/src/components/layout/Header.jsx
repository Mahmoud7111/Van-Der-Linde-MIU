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
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import './Header.css'

// Stub header component until complete responsive/header feature set is implemented.
export default function Header() {
  // Reads total item count; full header uses this in cart badge and mini cart triggers.
  const { totalItems } = useCart()

  // Reads authenticated user; full header uses this for account menu, logout, and role links.
  const { user } = useAuth()

  const navLinkClassName = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const accountLinkClassName = ({ isActive }) =>
    `header__action${isActive ? ' header__action--active' : ''}`

  const cartLinkClassName = ({ isActive }) =>
    `header__action header__action--cart${isActive ? ' header__action--active' : ''}`

  return (
    <header className="header">
      <div className="header__inner">
        {/* Brand link always returns user to home page. */}
        <Link className="header__brand" to="/">
          <img
            className="header__logo"
            src="/Logo2.png"
            alt="Van Der Linde"
            loading="eager"
          />
        </Link>

        {/* Minimal nav links for primary discovery routes. */}
        <nav className="header__nav" aria-label="Primary">
          <NavLink className={navLinkClassName} to="/shop">
            SHOP ALL
          </NavLink>
          <NavLink className={navLinkClassName} to="/collections">
            COLLECTIONS
          </NavLink>
          <NavLink className={navLinkClassName} to="/services">
            SERVICES
          </NavLink>
          <NavLink className={navLinkClassName} to="/about">
            ABOUT 
          </NavLink>
          <NavLink className={navLinkClassName} to="/contact">
            CONTACT
          </NavLink>
        </nav>

        {/* Utility links show cart count and auth-dependent entry point. */}
        <div className="header__actions">
          <NavLink
            aria-label={`Cart with ${totalItems} items`}
            className={cartLinkClassName}
            to="/cart"
          >
            Cart
            <span className="header__pill" aria-hidden="true">
              {totalItems}
            </span>
          </NavLink>
          {user ? (
            <NavLink className={accountLinkClassName} to="/profile">
              Profile
            </NavLink>
          ) : (
            <NavLink className={accountLinkClassName} to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
