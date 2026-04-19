import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaFacebook, FaTwitter } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  const shopLinks = [
    { to: '/shop', label: 'All Watches' },
    { to: '/collections', label: 'Collections' },
    { to: '/quiz', label: 'Watch Quiz' },
    { to: '/shop/men', label: 'Men Collection' },
    { to: '/shop/women', label: 'Women Collection' },
    { to: '/shop/new-arrivals', label: 'New Arrivals' },
    { to: '/shop/best-sellers', label: 'Best Sellers' },
    { to: '/shop/sale', label: 'Sale' },
  ]

  const customerCareLinks = [
    { to: '/contact', label: 'Contact Us' },
    { to: '/terms', label: 'Shipping & Returns' },
    { to: '/size-guide', label: 'Size Guide' },
    { to: '/services', label: 'Care Instructions' },
    { to: '/faq', label: 'FAQ' },
    { to: '/orders', label: 'Track Your Order' },
    { to: '/reviews', label: 'Customer Reviews' },
  ]

  const companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/careers', label: 'Careers' },
    { to: '/press', label: 'Press' },
    { to: '/sustainability', label: 'Sustainability' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
    { to: '/cookie-policy', label: 'Cookie Policy' },
  ]

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__container">

        {/* ── LEFT: BRAND + DESCRIPTION ── */}
        <div className="footer__brand-section">
          <Link to="/" className="footer__logo-link" aria-label="Van Der Linde home">
            <img src="/Logo2.png" alt="Van Der Linde" className="footer__logo-image" />
          </Link>
          <p className="footer__description">
            Discover your signature timepiece with Van Der Linde&apos;s curated collection of premium watches.
            From timeless classics to modern masterpieces, we bring you world-class craftsmanship.
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
            <h3 className="footer__column-title">Shop</h3>
            <nav className="footer__column-nav" aria-label="Shop links">
              {shopLinks.map((link) => (
                <Link key={`${link.to}-${link.label}`} to={link.to} className="footer__column-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Care */}
          <div className="footer__column">
            <h3 className="footer__column-title">Customer Care</h3>
            <nav className="footer__column-nav" aria-label="Customer care links">
              {customerCareLinks.map((link) => (
                <Link key={`${link.to}-${link.label}`} to={link.to} className="footer__column-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="footer__column">
            <h3 className="footer__column-title">Company</h3>
            <nav className="footer__column-nav" aria-label="Company links">
              {companyLinks.map((link) => (
                <Link key={`${link.to}-${link.label}`} to={link.to} className="footer__column-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Get in Touch */}
          <div className="footer__column footer__column--contact">
            <h3 className="footer__column-title">Get in Touch</h3>
            <div className="footer__contact-item">
              <span className="footer__contact-icon-box">
                <span className="footer__contact-icon">☎</span>
              </span>
              <div>
                <p className="footer__contact-label">Phone</p>
                <p className="footer__contact-value">+20 111-998-4154</p>
              </div>
            </div>
            <div className="footer__contact-item">
              <span className="footer__contact-icon-box">
                <span className="footer__contact-icon">📍</span>
              </span>
              <div>
                <p className="footer__contact-label">Address</p>
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
