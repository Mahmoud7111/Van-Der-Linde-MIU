import { Link } from 'react-router-dom'
import { FiHome, FiShoppingBag } from 'react-icons/fi'
import { useLanguage } from '@/context/LanguageContext'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">{t('notFound.title')}</h2>
        
        <p className="not-found__message">
          {t('notFound.message')}
        </p>
        
        <div className="not-found__actions">
          <Link to="/" className="not-found__btn not-found__btn--primary">
            <FiHome aria-hidden="true" /> {t('notFound.home')}
          </Link>
          <Link to="/shop" className="not-found__btn not-found__btn--secondary">
            <FiShoppingBag aria-hidden="true" /> {t('notFound.shop')}
          </Link>
        </div>
      </div>
    </div>
  )
}
