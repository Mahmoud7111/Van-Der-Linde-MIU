import { Link } from 'react-router-dom'
import { FiHome, FiShoppingBag } from 'react-icons/fi'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">Page Not Found</h2>
        
        <p className="not-found__message">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="not-found__actions">
          <Link to="/" className="not-found__btn not-found__btn--primary">
            <FiHome aria-hidden="true" /> Return Home
          </Link>
          <Link to="/shop" className="not-found__btn not-found__btn--secondary">
            <FiShoppingBag aria-hidden="true" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
