import { NavLink } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import DarkModeToggle from '@/components/features/DarkModeToggle'
import CurrencySwitcher from '@/components/features/CurrencySwitcher'
import { cn } from '@/utils/cn'
import {
  FiX,
  FiDollarSign,
  FiGlobe,
  FiHeart,
  FiMoon,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const { totalItems } = useCart()
  const { user } = useAuth()

  const accountPath = user ? '/profile' : '/login'
  const accountLabel = user ? 'Profile' : 'Login'

  const navLinkClassName = ({ isActive }) =>
    `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`

  const iconLinkClassName = ({ isActive }) =>
    `mobile-menu__icon-control${isActive ? ' mobile-menu__icon-control--active' : ''}`

  return (
    <>
      <div 
        className={cn('mobile-menu__backdrop', isOpen && 'mobile-menu__backdrop--open')} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('mobile-menu', isOpen && 'mobile-menu--open')}>
        <div className="mobile-menu__header">
          <img src="/Logo2.png" alt="Van Der Linde" className="mobile-menu__logo" />
          <button className="mobile-menu__close" onClick={onClose} aria-label="Close menu">
            <FiX aria-hidden="true" />
          </button>
        </div>
        
        <div className="mobile-menu__content">
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            <NavLink className={navLinkClassName} to="/shop" onClick={onClose}>SHOP ALL</NavLink>
            <NavLink className={navLinkClassName} to="/collections" onClick={onClose}>COLLECTIONS</NavLink>
            <NavLink className={navLinkClassName} to="/gifting" onClick={onClose}>GIFTING</NavLink>
            <NavLink className={navLinkClassName} to="/quiz" onClick={onClose}>WATCH QUIZ</NavLink>
            <div className="mobile-menu__divider" aria-hidden="true" />
            <NavLink className={navLinkClassName} to="/services" onClick={onClose}>SERVICES</NavLink>
            <NavLink className={navLinkClassName} to="/about" onClick={onClose}>OUR STORY</NavLink>
            <NavLink className={navLinkClassName} to="/contact" onClick={onClose}>CONTACT</NavLink>
          </nav>
          
          <div className="mobile-menu__footer">
            <div className="mobile-menu__actions">
              <NavLink aria-label={`Cart with ${totalItems} items`} className="mobile-menu__icon-control mobile-menu__icon-control--cart" to="/cart" onClick={onClose}>
                <FiShoppingCart aria-hidden="true" />
                <span className="mobile-menu__pill" aria-hidden="true">{totalItems}</span>
              </NavLink>
              <NavLink aria-label={accountLabel} className={iconLinkClassName} to={accountPath} onClick={onClose}>
                <FiUser aria-hidden="true" />
              </NavLink>
              <NavLink aria-label="Wishlist" className={iconLinkClassName} to="/wishlist" onClick={onClose}>
                <FiHeart aria-hidden="true" />
              </NavLink>
            </div>
            
            <div className="mobile-menu__utilities">
              <button type="button" className="mobile-menu__utility-btn">
                <FiGlobe aria-hidden="true" /> Language
              </button>
              <DarkModeToggle className="mobile-menu__utility-btn" showLabel={true} />
              <CurrencySwitcher className="mobile-menu__utility-btn" showLabel={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
