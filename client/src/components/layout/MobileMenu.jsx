import { NavLink } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import { cn } from '@/utils/cn'
import { FiHeart, FiPhone, FiShoppingCart, FiUser, FiX } from 'react-icons/fi'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { user } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const { theme } = useTheme()

  const accountPath = user ? '/account' : '/login'
  const accountLabel = user ? t('nav.profile') : t('nav.login')

  const navLinkClassName = ({ isActive }) =>
    `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`

  const menu = (
    <>
      <div 
        className={cn('mobile-menu__backdrop', isOpen && 'mobile-menu__backdrop--open')} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('mobile-menu', isOpen && 'mobile-menu--open')}>
        <div className="mobile-menu__header">
          <img
            src={theme === 'dark' ? '/Logo2Dark.png' : '/Logo2.png'}
            alt="Van Der Linde"
            className="mobile-menu__logo"
          />
          <button className="mobile-menu__close" onClick={onClose} aria-label={t('header.closeMenu')}>
            <FiX aria-hidden="true" />
          </button>
        </div>
        
        <div className="mobile-menu__content">
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            <NavLink className={navLinkClassName} to="/" onClick={onClose}>{t('nav.home')}</NavLink>
            <NavLink className={navLinkClassName} to="/shop" onClick={onClose}>{t('nav.shopAll')}</NavLink>
            <NavLink className={navLinkClassName} to="/collections" onClick={onClose}>{t('nav.collections')}</NavLink>
            <NavLink className={navLinkClassName} to="/quiz" onClick={onClose}>{t('nav.watchQuiz')}</NavLink>
            <NavLink className={navLinkClassName} to="/configurator" onClick={onClose}>{t('nav.configurator')}</NavLink>
            <NavLink className={navLinkClassName} to="/services" onClick={onClose}>{t('nav.services')}</NavLink>
            <NavLink className={navLinkClassName} to="/about" onClick={onClose}>{t('nav.ourStory')}</NavLink>
          </nav>
          
          <div className="mobile-menu__footer">
            <div className="mobile-menu__actions" aria-label="Quick actions">
              <NavLink
                aria-label={accountLabel}
                className={({ isActive }) => cn('mobile-menu__action-btn', isActive && 'mobile-menu__action-btn--active')}
                to={accountPath}
                onClick={onClose}
              >

                <FiUser aria-hidden="true" /> {/* Show 'Profile' if logged in, otherwise 'Login' */}
              </NavLink>

              <NavLink
                aria-label={t('nav.wishlist')} 
                className={({ isActive }) => cn('mobile-menu__action-btn', isActive && 'mobile-menu__action-btn--active')}
                to="/wishlist"
                onClick={onClose}
              >
                <FiHeart aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span className="mobile-menu__action-badge" aria-hidden="true">{wishlistCount}</span>
                )}
              </NavLink>
              <NavLink
                aria-label={t('nav.cart')}
                className={({ isActive }) => cn('mobile-menu__action-btn', isActive && 'mobile-menu__action-btn--active')}
                to="/cart"
                onClick={onClose}
              >
                <FiShoppingCart aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="mobile-menu__action-badge" aria-hidden="true">{totalItems}</span>
                )}
              </NavLink>
              <NavLink
                aria-label={t('nav.contact')}
                className={({ isActive }) => cn('mobile-menu__action-btn', isActive && 'mobile-menu__action-btn--active')}
                to="/contact"
                onClick={onClose}
              >
                <FiPhone aria-hidden="true" />
              </NavLink>
            </div>
            <div className="mobile-menu__utilities">
              <CurrencySwitcher className="mobile-menu__utility-pill" showLabel={true} />
              <DarkModeToggle className="mobile-menu__utility-pill" />
            </div>

            <div className="mobile-menu__lang-toggle" role="group" aria-label="Language">
              <button
                type="button"
                className={cn('mobile-menu__lang-btn', lang === 'en' && 'mobile-menu__lang-btn--active')}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={cn('mobile-menu__lang-btn', lang === 'ar' && 'mobile-menu__lang-btn--active')}
                onClick={() => setLang('ar')}
              >
                عربي
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (typeof document === 'undefined') { // safeguard where document is not available (e.g during SSR).
    return null
  }

  return createPortal(menu, document.body)
}
