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
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import useMediaQuery from '@/hooks/useMediaQuery'
import MobileMenu from './MobileMenu'
import CartOffcanvas from '@/components/cart/CartOffcanvas'
import SearchOverlay from './SearchOverlay'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import LanguageSwitcher from '@/components/features/LanguageSwitcher'
import { cn } from '@/utils/cn'
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiPhone,
  FiSearch,
  FiX
} from 'react-icons/fi'
import './Header.css'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerHeight, setHeaderHeight] = useState(115)
  const searchInputRef = useRef(null)
  const overlayInputRef = useRef(null)
  const headerRef = useRef(null)
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
  const { totalItems: wishlistCount } = useWishlist()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { t } = useLanguage()

  const accountPath = user ? '/account' : '/login'
  const accountLabel = user ? t('nav.account') : t('nav.login')



  // Measure header height so SearchOverlay can position right below it.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setHeaderHeight(el.getBoundingClientRect().height))
    ro.observe(el)
    setHeaderHeight(el.getBoundingClientRect().height)
    return () => ro.disconnect()
  }, [])


  // Close the search when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (isSearchOpen && !e.target.closest('.header__search-bar-wrap') && !e.target.closest('.sov__panel')) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isSearchOpen])

  const openSearch = () => {
    setIsSearchOpen(true)
    setTimeout(() => {
      if (isMobileOrTablet) {
        overlayInputRef.current?.focus()
        return
      }
      searchInputRef.current?.focus()
    }, 50)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const navLinkClassName = ({ isActive }) =>
    `header__link${isActive ? ' header__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `header__icon-control${isActive ? ' header__icon-control--active' : ''}`


  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'header',
          // Transparent state clears background/shadow while user is at the top of the page on the home hero.
          isHomePage && scrollY < 80 && !isSearchOpen && 'header--transparent',
          // Hide header when scrolling down; reveal when scrolling up or near the top.
          // The scrollY > 24 guard prevents hiding the header on tiny accidental scrolls.
          isHidden && scrollY > 24 && 'header--hidden',
          scrollY > 50 && 'header--scrolled'
        )}
      >
        <div className="header__inner">
          <div className="header__icons-wrapper">
            <div className="header__left-icons">
              {isMobileOrTablet ? (
                <button
                  className="header__menu-toggle"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label={t('header.openMenu')}
                >
                  <FiMenu aria-hidden="true" />
                </button>
              ) : (
                <>
                  <NavLink to="/contact" className="header__contact-btn">
                    <FiPhone /> <span>Contact us</span>
                  </NavLink>

                  <LanguageSwitcher className="header__icon-control header__lang-btn" />
                  <CurrencySwitcher className="header__icon-control" />
                  <DarkModeToggle className="header__icon-control" />

                  {/* Expanding search bar: icon → pill when closed, full input when open */}
                  <div className={cn('header__search-bar-wrap', isSearchOpen && 'header__search-bar-wrap--open')}>
                    {!isSearchOpen ? (
                      <button
                        className="header__icon-control header__search-btn"
                        aria-label={t('header.toggleSearch')}
                        onClick={openSearch}
                      >
                        <FiSearch />
                      </button>
                    ) : (
                      <div className="header__search-input-wrap">
                        <FiSearch className="header__search-input-icon" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          className="header__search-input"
                          placeholder={t('header.search')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button className="header__search-clear" onClick={() => setSearchQuery('')} aria-label={t('search.clear')}>
                            <FiX />
                          </button>
                        )}
                        <button className="header__search-close" onClick={closeSearch} aria-label={t('header.toggleSearch')}>
                          <FiX />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="header__right-icons">
              {isMobileOrTablet ? (
                <>
                  <button
                    type="button"
                    aria-label={t('header.toggleSearch')}
                    className="header__icon-control header__icon-control--mobile"
                    onClick={openSearch}
                  >
                    <FiSearch aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <NavLink aria-label={accountLabel} className={iconLinkClassName} to={accountPath}>
                    <FiUser aria-hidden="true" />
                    <span className="header__icon-label">Profile</span>
                  </NavLink>

                  <NavLink
                    aria-label={t('nav.wishlist')}
                    className={({ isActive }) => cn(iconLinkClassName({ isActive }), 'header__icon-control--wishlist')}
                    to="/wishlist"
                  >
                    <div className="header__icon-badge-wrap">
                      <FiHeart aria-hidden="true" />
                      <span className="header__pill" aria-hidden="true">
                        {wishlistCount}
                      </span>
                    </div>
                    <span className="header__icon-label">Wishlist</span>
                  </NavLink>

                  <button
                    type="button"
                    aria-label={t('header.cartWithItems', { count: totalItems })}
                    className="header__icon-control header__icon-control--cart"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <div className="header__icon-badge-wrap">
                      <FiShoppingCart aria-hidden="true" />
                      <span className="header__pill" aria-hidden="true">
                        {totalItems}
                      </span>
                    </div>
                    <span className="header__icon-label">Cart</span>
                  </button>
                </>
              )}
            </div>
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
            <nav className="header__nav" aria-label="Shop links">


              <NavLink className={navLinkClassName} to="/shop">
                SHOP ALL
              </NavLink>

              <NavLink className={navLinkClassName} to="/collections">
                COLLECTIONS
              </NavLink>

              <NavLink className={navLinkClassName} to="/quiz">
                FIND YOUR WATCH
              </NavLink>

              <NavLink className={navLinkClassName} to="/configurator">
                CONFIGURATOR
              </NavLink>

              <NavLink className={navLinkClassName} to="/about">
                OUR STORY
              </NavLink>

              <NavLink className={navLinkClassName} to="/services">
                SERVICES
              </NavLink>

            </nav>
          )}
        </div>
        {isMobileOrTablet && (
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        )}
        <CartOffcanvas isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </header>
      <SearchOverlay
        isOpen={isMobileOrTablet ? isSearchOpen : isSearchOpen && searchQuery.trim().length > 0}
        query={searchQuery}
        headerHeight={headerHeight}
        onClose={closeSearch}
        showInput={isMobileOrTablet}
        onQueryChange={setSearchQuery}
        inputRef={overlayInputRef}
        placeholder={t('header.search')}
      />
    </>
  )
}
