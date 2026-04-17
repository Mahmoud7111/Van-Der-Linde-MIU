import { Link } from 'react-router-dom'
import './Footer.css'

// Small, simple shared footer.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__title">Van Der Linde</p>
          <small className="footer__copy">&copy; {year} All rights reserved.</small>
        </div>

        <div className="footer__right"> 
          <small className="footer__meta">Since 1875</small>

          <nav className="footer__nav" aria-label="Footer links">
            <Link className="footer__link" to="/privacy">
              Privacy
            </Link>
            <Link className="footer__link" to="/terms">
              Terms
            </Link>
            <Link className="footer__link" to="/contact">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
