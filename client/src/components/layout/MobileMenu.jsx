import { NavLink } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import LanguageSwitcher from '@/components/features/LanguageSwitcher'
import { cn } from '@/utils/cn'
import {
  FiX,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const { totalItems } = useCart()
  const { user } = useAuth()
  const { t } = useLanguage()

  const accountPath = user ? '/account' : '/login'
  const accountLabel = user ? t('nav.profile') : t('nav.login')

  const navLinkClassName = ({ isActive }) =>
    `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `mobile-menu__icon-control${isActive ? ' mobile-menu__icon-control--active' : ''}`

  const menu = (
    <>
      <div 
        className={cn('mobile-menu__backdrop', isOpen && 'mobile-menu__backdrop--open')} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('mobile-menu', isOpen && 'mobile-menu--open')}>
        <div className="mobile-menu__header">
          <img src="/Logo2.png" alt="Van Der Linde" className="mobile-menu__logo" />
          <button className="mobile-menu__close" onClick={onClose} aria-label={t('header.closeMenu')}>
            <FiX aria-hidden="true" />
          </button>
        </div>
        
        <div className="mobile-menu__content">
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            <NavLink className={navLinkClassName} to="/shop" onClick={onClose}>{t('nav.shopAll')}</NavLink>
            <NavLink className={navLinkClassName} to="/collections" onClick={onClose}>{t('nav.collections')}</NavLink>
            <NavLink className={navLinkClassName} to="/gifting" onClick={onClose}>{t('nav.gifting')}</NavLink>
            <NavLink className={navLinkClassName} to="/quiz" onClick={onClose}>{t('nav.watchQuiz')}</NavLink>
            <div className="mobile-menu__divider" aria-hidden="true" />
            <NavLink className={navLinkClassName} to="/services" onClick={onClose}>{t('nav.services')}</NavLink>
            <NavLink className={navLinkClassName} to="/about" onClick={onClose}>{t('nav.ourStory')}</NavLink>
            <NavLink className={navLinkClassName} to="/contact" onClick={onClose}>{t('nav.contact')}</NavLink>
          </nav>
          
          <div className="mobile-menu__footer">
            <div className="mobile-menu__actions">
              <NavLink aria-label={t('header.cartWithItems', { count: totalItems })} className="mobile-menu__icon-control mobile-menu__icon-control--cart" to="/cart" onClick={onClose}>
                <FiShoppingCart aria-hidden="true" />
                <span className="mobile-menu__pill" aria-hidden="true">{totalItems}</span>
              </NavLink>
              <NavLink aria-label={accountLabel} className={iconLinkClassName} to={accountPath} onClick={onClose}>
                <FiUser aria-hidden="true" />
              </NavLink>
              <NavLink aria-label={t('nav.admin')} className={iconLinkClassName} to="/admin" onClick={onClose}>
                <svg className="mobile-menu__admin-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 18h18" />
                  <path d="M4 18l2-9 6 6 6-8 2 11" />
                  <circle cx="6" cy="7" r="1.4" />
                  <circle cx="12" cy="11" r="1.2" />
                  <circle cx="18" cy="5" r="1.4" />
                </svg>
              </NavLink>
              <NavLink aria-label={t('nav.wishlist')} className={iconLinkClassName} to="/wishlist" onClick={onClose}>
                <FiHeart aria-hidden="true" />
              </NavLink>
            </div>
            
            <div className="mobile-menu__utilities">
              <LanguageSwitcher className="mobile-menu__utility-btn" showLabel={true} />
              <DarkModeToggle className="mobile-menu__utility-btn" showLabel={true} />
              <CurrencySwitcher className="mobile-menu__utility-btn" showLabel={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(menu, document.body)
}
