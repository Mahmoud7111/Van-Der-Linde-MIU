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
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import useMediaQuery from '@/hooks/useMediaQuery'
import MobileMenu from './MobileMenu'
import CartOffcanvas from '@/components/cart/CartOffcanvas'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import LanguageSwitcher from '@/components/features/LanguageSwitcher'
import { cn } from '@/utils/cn'
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu
} from 'react-icons/fi'
import './Header.css'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const isMobileOrTablet = useMediaQuery('(max-width: 1080px)')

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
  const { user } = useAuth()
  const { theme } = useTheme()
  const { t } = useLanguage()

  const accountPath = user ? '/account' : '/login'
  const accountLabel = user ? t('nav.account') : t('nav.login')



  // NavLink className helpers keep JSX clean and apply active state via CSS modifier.
  const navLinkClassName = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `header__icon-control${isActive ? ' header__icon-control--active' : ''}`

  

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
          {isMobileOrTablet ? (
            <button
              className="header__menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={t('header.openMenu')}
            >
              <FiMenu aria-hidden="true" />
            </button>
          ) : (
            <nav className="header__nav header__desktop-nav" aria-label="Shop links">
              <NavLink className={navLinkClassName} to="/shop">
                {t('nav.shopAll')}
              </NavLink>
              <NavLink className={navLinkClassName} to="/collections">
                {t('nav.collections')}
              </NavLink>
              <NavLink className={navLinkClassName} to="/gifting">
                {t('nav.gifting')}
              </NavLink>
              <NavLink className={navLinkClassName} to="/quiz">
                {t('nav.watchQuiz')}
              </NavLink>
            </nav>
          )}
        </div>

        {/* Center brand logo — always links back to homepage */}
        <Link className="header__brand" to="/">
          <img
            className="header__logo"
            src={theme === 'dark' ? "/Logo2Dark.png" : "/Logo2.png"}
            alt="Van Der Linde"
            loading="eager"
          />
        </Link>

        {!isMobileOrTablet && (
          <div className="header__right">
            {/* Right nav — brand/informational links */}
            <nav className="header__nav header__nav--right header__desktop-nav" aria-label="Company links">
              <NavLink className={navLinkClassName} to="/services">
                {t('nav.services')}
              </NavLink>
              <NavLink className={navLinkClassName} to="/about">
                {t('nav.ourStory')}
              </NavLink>
              <NavLink className={navLinkClassName} to="/contact">
                {t('nav.contact')}
              </NavLink>
            </nav>

            {/* Icon controls — utility actions separated from nav links by a divider */}
            <div className="header__icons-wrap">
              <span className="header__divider" aria-hidden="true">
                |
              </span>

              <div className="header__actions">
                {/* Cart badge shows live item count from CartContext */}
                <button
                  type="button"
                  aria-label={t('header.cartWithItems', { count: totalItems })}
                  className="header__icon-control header__icon-control--cart"
                  onClick={() => setIsCartOpen(true)}
                >
                  <FiShoppingCart aria-hidden="true" />
                  <span className="header__pill" aria-hidden="true">
                    {totalItems}
                  </span>
                </button>

                 {/* User icon always opens account page. */}
                <NavLink aria-label={accountLabel} className={iconLinkClassName} to={accountPath}>
                  <FiUser aria-hidden="true" />
                </NavLink>

                <NavLink
                  aria-label={t('nav.admin')}
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

                <NavLink aria-label={t('nav.wishlist')} className={iconLinkClassName} to="/wishlist">
                  <FiHeart aria-hidden="true" />
                </NavLink>
                <LanguageSwitcher className="header__icon-control" />

                <DarkModeToggle className="header__icon-control" />

                <CurrencySwitcher className="header__icon-control" />
              </div>
            </div>
          </div>
        )}
      </div>
      {isMobileOrTablet && (
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      )}
      <CartOffcanvas isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
