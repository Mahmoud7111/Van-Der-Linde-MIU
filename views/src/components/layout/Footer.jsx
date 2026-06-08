import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaFacebook, FaTwitter } from 'react-icons/fa'
import { FiPhone, FiMapPin } from 'react-icons/fi'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const shopLinks = [
    { to: '/shop', labelKey: 'footer.allWatches' },
    { to: '/collections', labelKey: 'nav.collections' },
    { to: '/quiz', labelKey: 'nav.watchQuiz' },
    { to: '/shop/men', labelKey: 'footer.menCollection' },
    { to: '/shop/women', labelKey: 'footer.womenCollection' },
    { to: '/shop/new-arrivals', labelKey: 'footer.newArrivals' },
    { to: '/shop/best-sellers', labelKey: 'footer.bestSellers' },
    { to: '/shop/sale', labelKey: 'footer.sale' },
  ]

  const customerCareLinks = [
    { to: '/contact', labelKey: 'nav.contactUs' },
    { to: '/terms', labelKey: 'footer.shippingReturns' },
    { to: '/size-guide', labelKey: 'size.title' },
    { to: '/services', labelKey: 'footer.careInstructions' },
    { to: '/faq', labelKey: 'nav.faqs' },
    { to: '/orders', labelKey: 'footer.trackOrder' },
    { to: '/reviews', labelKey: 'footer.customerReviews' },
  ]

  const companyLinks = [
    { to: '/about', labelKey: 'footer.aboutUs' },
    { to: '/careers', labelKey: 'footer.careers' },
    { to: '/press', labelKey: 'footer.press' },
    { to: '/sustainability', labelKey: 'footer.sustainability' },
    { to: '/privacy', labelKey: 'policy.privacyTitle' },
    { to: '/terms', labelKey: 'footer.terms' },
    { to: '/cookie-policy', labelKey: 'footer.cookie' },
  ]

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__container">

        {/* ── LEFT: BRAND + DESCRIPTION ── */}
        <div className="footer__brand-section">
          <Link to="/" className="footer__logo-link" aria-label="Van Der Linde home">
            <img 
              src={theme === 'dark' ? "/Logo2Dark.png" : "/Logo2.png"} 
              alt="Van Der Linde" 
              className="footer__logo-image" 
            />
          </Link>
          <p className="footer__description">
            {t('footer.description')}
          </p>

          {/* Social Icons */}
          <div className="footer__socials">
            <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" className="footer__social-link" aria-label="TikTok" target="_blank" rel="noreferrer">
              <FaTiktok />
            </a>
            <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" className="footer__social-link" aria-label="Twitter" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* ── COLUMNS ── */}
        <div className="footer__columns">

          {/* Shop */}
          <div className="footer__column">
            <h3 className="footer__column-title">{t('footer.shop')}</h3>
            <nav className="footer__column-nav" aria-label={t('footer.shop')}>
              {shopLinks.map((link) => (
                <Link key={`${link.to}-${link.labelKey}`} to={link.to} className="footer__column-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Care */}
          <div className="footer__column">
            <h3 className="footer__column-title">{t('footer.customerCare')}</h3>
            <nav className="footer__column-nav" aria-label={t('footer.customerCare')}>
              {customerCareLinks.map((link) => (
                <Link key={`${link.to}-${link.labelKey}`} to={link.to} className="footer__column-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="footer__column">
            <h3 className="footer__column-title">{t('footer.company')}</h3>
            <nav className="footer__column-nav" aria-label={t('footer.company')}>
              {companyLinks.map((link) => (
                <Link key={`${link.to}-${link.labelKey}`} to={link.to} className="footer__column-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Get in Touch */}
          <div className="footer__column footer__column--contact">
            <h3 className="footer__column-title">{t('footer.getInTouch')}</h3>
            <div className="footer__contact-item">
              <span className="footer__contact-icon-box">
                <FiPhone className="footer__contact-icon" />
              </span>
              <div>
                <p className="footer__contact-label">{t('footer.phone')}</p>
                <p className="footer__contact-value">+20 111-998-4154</p>
              </div>
            </div>
            <div className="footer__contact-item">
              <span className="footer__contact-icon-box">
                <FiMapPin className="footer__contact-icon" />
              </span>
              <div>
                <p className="footer__contact-label">{t('footer.address')}</p>
                <p className="footer__contact-value">123 Fragrance Street</p>
                <p className="footer__contact-value">Cairo, Egypt 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
