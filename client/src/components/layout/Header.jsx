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
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import SearchBar from '@/components/features/SearchBar'
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

  // NavLink className helpers keep JSX clean and apply active state via CSS modifier.
  const navLinkClassName = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `header__icon-control${isActive ? ' header__icon-control--active' : ''}`

  const cartLinkClassName = ({ isActive }) =>
    `header__icon-control header__icon-control--cart${isActive ? ' header__icon-control--active' : ''}`

  // Account destination and label depend on auth state.
  const accountPath = user ? '/profile' : '/login'
  const accountLabel = user ? 'Profile' : 'Login'

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
              <SearchBar />
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

              {/* Account link destination switches based on auth state */}
              <NavLink aria-label={accountLabel} className={iconLinkClassName} to={accountPath}>
                <FiUser aria-hidden="true" />
              </NavLink>

              <NavLink aria-label="Wishlist" className={iconLinkClassName} to="/wishlist">
                <FiHeart aria-hidden="true" />
              </NavLink>


              {/* Language, wishlist, theme, currency — wired up by Dev 5 in full implementation */}
              <button type="button" className="header__icon-control" aria-label="Language selector">
                <FiGlobe aria-hidden="true" />
              </button>

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