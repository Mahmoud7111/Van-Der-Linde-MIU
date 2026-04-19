import { motion as Motion } from 'framer-motion'
import './PolicyPages.css'

export default function TermsPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="policy-page">
      <Motion.header 
        className="policy-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <span className="policy-header__label">Legal Framework</span>
        <h1 className="policy-header__title">Terms of Service</h1>
        <p className="policy-header__date">Last Updated: April 18, 2026</p>
      </Motion.header>

      <Motion.div 
        className="policy-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Van Der Linde. These Terms of Service ("Terms") govern your access to and use of our website, services, and products. By accessing or using our services, you agree to be bound by these Terms.
          </p>
          <p>
            If you do not agree to these Terms, please do not use our website or purchase our products. We reserve the right to modify these Terms at any time, and your continued use of the service constitutes acceptance of such changes.
          </p>
        </section>

        <section>
          <h2>2. Use of Service</h2>
          <p>
            You must be at least 18 years old to use our services or make a purchase. You agree to provide accurate and complete information when creating an account or making a purchase.
          </p>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
            <li>You may not attempt to interfere with the proper functioning of our website.</li>
          </ul>
        </section>

        <section>
          <h2>3. Product Information & Pricing</h2>
          <p>
            While we strive for absolute accuracy, occasional errors in product descriptions or pricing may occur. We reserve the right to correct any errors and to change or update information at any time without prior notice.
          </p>
          <p>
            All prices are subject to change. We reserve the right to refuse or cancel any orders placed for products listed at the incorrect price.
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of Van Der Linde and is protected by international copyright and trademark laws.
          </p>
          <p>
            Any unauthorized use of our intellectual property is strictly prohibited and may result in legal action.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            Van Der Linde shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our products or services.
          </p>
        </section>

        <section>
          <h2>6. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Van Der Linde is headquartered, without regard to its conflict of law principles.
          </p>
        </section>
      </Motion.div>
    </div>
  )
}
