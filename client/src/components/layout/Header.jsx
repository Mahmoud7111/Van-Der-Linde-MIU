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
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { cn } from '@/utils/cn'
import {
  FiDollarSign,
  FiGlobe,
  FiHeart,
  FiMoon,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi'
import './Header.css'

export default function Header() {
  // Reads scroll position to toggle header background and shadow after scrolling past hero.
  const scrollY = useScrollPosition()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Reads total item count; full header uses this in cart badge and mini cart triggers.
  const { totalItems } = useCart()

  // Reads authenticated user; full header uses this for account menu, logout, and role links.
  const { user } = useAuth()

  const navLinkClassName = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `header__icon-control${isActive ? ' header__icon-control--active' : ''}`

  const cartLinkClassName = ({ isActive }) =>
    `header__icon-control header__icon-control--cart${isActive ? ' header__icon-control--active' : ''}`

  const accountPath = user ? '/profile' : '/login'
  const accountLabel = user ? 'Profile' : 'Login'

  return (
    <header
      className={cn(
        'header',
        isHomePage && 'header--home',
        isHomePage && scrollY < 80 && 'header--transparent'
      )}
    >
      <div className="header__inner">
        <nav className="header__left header__nav" aria-label="Shop links">
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

        <Link className="header__brand" to="/">
          <img
            className="header__logo"
            src="/Logo2.png"
            alt="Van Der Linde"
            loading="eager"
          />
        </Link>

        <div className="header__right">
          <nav className="header__nav header__nav--right" aria-label="Company links">
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

          <div className="header__icons-wrap">
            <span className="header__divider" aria-hidden="true">
              |
            </span>

            <div className="header__actions">
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

              <NavLink aria-label={accountLabel} className={iconLinkClassName} to={accountPath}>
                <FiUser aria-hidden="true" />
              </NavLink>

              <button type="button" className="header__icon-control" aria-label="Language selector">
                <FiGlobe aria-hidden="true" />
              </button>

              <NavLink aria-label="Wishlist" className={iconLinkClassName} to="/wishlist">
                <FiHeart aria-hidden="true" />
              </NavLink>

              <button type="button" className="header__icon-control" aria-label="Dark mode toggle">
                <FiMoon aria-hidden="true" />
              </button>

              <button type="button" className="header__icon-control" aria-label="Currency switcher">
                <FiDollarSign aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
