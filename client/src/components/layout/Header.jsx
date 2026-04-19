/**
 * STUB COMPONENT: Header
 *
 * What this file is:
 * A temporary minimal header/navigation scaffold for the Van Der Linde layout.
 *
 * What it does:
 * Renders essential navigation links and shows auth/cart awareness through context.
 * Uses useScrollDirection to handle both scroll depth and hide/show behavior
 * through a single scroll listener instead of two.
 *
 * Where it is used:
 * Imported and rendered in Layout.jsx for all routes.
 *
 * NOTE:
 * Full header implementation (SearchBar, DarkModeToggle, CurrencySwitcher,
 * MobileMenu, sticky behavior, and responsive interactions) is owned by Dev 5.
 */
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import useClickOutside from '@/hooks/useClickOutside'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import { cn } from '@/utils/cn'
import {
  FiDollarSign,
  FiGlobe,
  FiHeart,
  FiMoon,
  FiShoppingCart,
  FiUser,
  FiMenu
} from 'react-icons/fi'
import './Header.css'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Single hook handles both scroll depth (for transparent→solid transition)
  // and scroll direction (for hide/show behavior). Replaces useScrollPosition
  // + a separate useEffect listener that were running two scroll handlers simultaneously.
  const { scrollY, isHidden } = useScrollDirection()

  const location = useLocation()

  // Homepage gets special treatment: header starts transparent over the hero
  // and becomes solid after the user scrolls 80px past the top.
  const isHomePage = location.pathname === '/'

  // Reads total item count; full header uses this in cart badge and mini cart triggers.
  const { totalItems } = useCart()

  // Reads authenticated user; full header uses this for account menu, logout, and role links.
  const { user } = useAuth()
    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false)
  const authMenuRef = useRef(null)

  const closeAuthMenu = useCallback(() => {
    setIsAuthMenuOpen(false)
  }, [])

  useClickOutside(authMenuRef, closeAuthMenu, isAuthMenuOpen)

  useEffect(() => {
    if (!isAuthMenuOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeAuthMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeAuthMenu, isAuthMenuOpen])


  // NavLink className helpers keep JSX clean and apply active state via CSS modifier.
  const navLinkClassName = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `header__icon-control${isActive ? ' header__icon-control--active' : ''}`

  const cartLinkClassName = ({ isActive }) =>
    `header__icon-control header__icon-control--cart${isActive ? ' header__icon-control--active' : ''}`

  

  return (
    <header
      className={cn(
        'header',
        // Fixed positioning + transparent background on homepage hero only.
        isHomePage && 'header--home',
        // Transparent state clears background/shadow while user is inside the hero area.
        isHomePage && scrollY < 80 && 'header--transparent',
        // Hide header when scrolling down; reveal when scrolling up or near the top.
        // The scrollY > 24 guard prevents hiding the header on tiny accidental scrolls.
        isHidden && scrollY > 24 && 'header--hidden'
      )}
    >
      <div className="header__inner">
        {/* Left container — menu toggle (mobile) + shop-facing links (desktop) */}
        <div className="header__left">
          <button 
            className="header__menu-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <FiMenu aria-hidden="true" />
          </button>
          <nav className="header__nav header__desktop-nav" aria-label="Shop links">
            <NavLink className={navLinkClassName} to="/shop">
              SHOP ALL
            </NavLink>
            <NavLink className={navLinkClassName} to="/collections">
              COLLECTIONS
            </NavLink>
            <NavLink className={navLinkClassName} to="/gifting">
              GIFTING
            </NavLink>
            <NavLink className={navLinkClassName} to="/quiz">
              WATCH QUIZ
            </NavLink>
          </nav>
        </div>

        {/* Center brand logo — always links back to homepage */}
        <Link className="header__brand" to="/">
          <img
            className="header__logo"
            src="/Logo2.png"
            alt="Van Der Linde"
            loading="eager"
          />
        </Link>

        <div className="header__right">
          {/* Right nav — brand/informational links */}
          <nav className="header__nav header__nav--right header__desktop-nav" aria-label="Company links">
            <NavLink className={navLinkClassName} to="/services">
              SERVICES
            </NavLink>
            <NavLink className={navLinkClassName} to="/about">
              OUR STORY
            </NavLink>
            <NavLink className={navLinkClassName} to="/contact">
              CONTACT
            </NavLink>
          </nav>

          {/* Icon controls — utility actions separated from nav links by a divider */}
          <div className="header__icons-wrap">
            <span className="header__divider" aria-hidden="true">
              |
            </span>

            <div className="header__actions">
              {/* Cart badge shows live item count from CartContext */}
              <NavLink
                aria-label={`Cart with ${totalItems} items`}
                className={cartLinkClassName}
                to="/cart"
              >
                <FiShoppingCart aria-hidden="true" />
                <span className="header__pill" aria-hidden="true">
                  {totalItems}
                </span>
              </NavLink>

               {/* User icon always opens account page. */}
              <NavLink aria-label="Account" className={iconLinkClassName} to="/account">
                <FiUser aria-hidden="true" />
              </NavLink>

              <NavLink
                aria-label="Admin dashboard"
                className="header__icon-control header__icon-control--admin"
                to="/admin"
              >
                <svg
                  className="header__admin-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3 18h18" />
                  <path d="M4 18l2-9 6 6 6-8 2 11" />
                  <circle cx="6" cy="7" r="1.4" />
                  <circle cx="12" cy="11" r="1.2" />
                  <circle cx="18" cy="5" r="1.4" />
                </svg>
              </NavLink>

              <NavLink aria-label="Wishlist" className={iconLinkClassName} to="/wishlist">
                <FiHeart aria-hidden="true" />
              </NavLink>


              {/* Globe icon now exposes authentication links for guest users. */}
              <div className="header__auth-menu" ref={authMenuRef}>
                <button
                  type="button"
                  className="header__icon-control"
                  aria-label="Authentication menu"
                  aria-expanded={isAuthMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsAuthMenuOpen((prev) => !prev)}
                >
                  <FiGlobe aria-hidden="true" />
                </button>

                {isAuthMenuOpen && (
                  <div className="header__auth-dropdown" role="menu" aria-label="Authentication links">
                    {!user ? (
                      <>
                        <Link
                          to="/login"
                          className="header__auth-link"
                          role="menuitem"
                          onClick={closeAuthMenu}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="header__auth-link"
                          role="menuitem"
                          onClick={closeAuthMenu}
                        >
                          Register
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/account"
                        className="header__auth-link"
                        role="menuitem"
                        onClick={closeAuthMenu}
                      >
                        My Account
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <DarkModeToggle className="header__icon-control" />

              <CurrencySwitcher className="header__icon-control" />
            </div>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
