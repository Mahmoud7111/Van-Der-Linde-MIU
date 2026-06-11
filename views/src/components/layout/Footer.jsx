import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaFacebook, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa'
import { FiPhone, FiMapPin, FiArrowUp, FiClock } from 'react-icons/fi'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { theme } = useTheme()
  const { t } = useLanguage()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const shopLinks = [
    { to: '/shop', labelKey: 'footer.allWatches' },
    { to: '/collections', labelKey: 'nav.collections' },
    { to: '/quiz', labelKey: 'nav.watchQuiz' },
    { to: '/shop/men', labelKey: 'footer.menCollection' },
    { to: '/shop/women', labelKey: 'footer.womenCollection' },
  ]

  const supportLinks = [
    { to: '/contact', labelKey: 'nav.contactUs' },
    { to: '/faq', labelKey: 'nav.faqs' },
    { to: '/size-guide', labelKey: 'size.title' },
    { to: '/orders', labelKey: 'footer.trackOrder' },
    { to: '/services', labelKey: 'footer.careInstructions' },
  ]

  const companyLinks = [
    { to: '/about', labelKey: 'footer.aboutUs' },
    { to: '/careers', labelKey: 'footer.careers' },
    { to: '/sustainability', labelKey: 'footer.sustainability' },
    { to: '/press', labelKey: 'footer.press' },
  ]

  const legalLinks = [
    { to: '/privacy', labelKey: 'policy.privacyTitle' },
    { to: '/terms', labelKey: 'footer.terms' },
    { to: '/cookie-policy', labelKey: 'footer.cookie' },
  ]

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__ornament">
        <span className="footer__ornament-diamond" />
        <span className="footer__ornament-line" />
        <span className="footer__ornament-diamond" />
      </div>

      <div className="footer__inner">

        {/* ── MAIN GRID ── */}
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo-link" aria-label="Van Der Linde home">
              <img
                src={theme === 'dark' ? "/Logo2Dark.png" : "/Logo2.png"}
                alt="Van Der Linde"
                className="footer__logo-img"
              />
            </Link>
            <p className="footer__brand-desc">
              {t('footer.description')}
            </p>
            <div className="footer__socials">
              <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://tiktok.com" className="footer__social-link" aria-label="TikTok" target="_blank" rel="noreferrer"><FaTiktok /></a>
              <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" className="footer__social-link" aria-label="Twitter" target="_blank" rel="noreferrer"><FaTwitter /></a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer__group">
            <h3 className="footer__group-title">Shop</h3>
            <nav className="footer__nav">
              {shopLinks.map(l => (
                <Link key={l.to} to={l.to} className="footer__nav-link">{t(l.labelKey)}</Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="footer__group">
            <h3 className="footer__group-title">Support</h3>
            <nav className="footer__nav">
              {supportLinks.map(l => (
                <Link key={l.to} to={l.to} className="footer__nav-link">{t(l.labelKey)}</Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="footer__group">
            <h3 className="footer__group-title">Company</h3>
            <nav className="footer__nav">
              {companyLinks.map(l => (
                <Link key={l.to} to={l.to} className="footer__nav-link">{t(l.labelKey)}</Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="footer__group footer__group--contact">
            <h3 className="footer__group-title">Contact</h3>
            <div className="footer__contact-item">
              <FiPhone className="footer__contact-icon" />
              <span>+20 111-998-4154</span>
            </div>
            <div className="footer__contact-item">
              <FiMapPin className="footer__contact-icon" />
              <span>Watches Corridor, Attaba, Cairo, Egypt</span>
            </div>
            <div className="footer__contact-item">
              <FiClock className="footer__contact-icon" />
              <span>Mon–Sat, 10AM – 8PM</span>
            </div>
          </div>

        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} <span>Van Der Linde</span>. All rights reserved.
          </p>
          <div className="footer__bottom-nav">
            {legalLinks.map(l => (
              <Link key={l.to} to={l.to} className="footer__bottom-link">{t(l.labelKey)}</Link>
            ))}
          </div>
          <div className="footer__payments">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
            <FaCcAmex />
          </div>
        </div>
      </div>

      <button className="footer__top" onClick={scrollToTop} aria-label="Back to top">
        <FiArrowUp />
      </button>
    </footer>
  )
}
